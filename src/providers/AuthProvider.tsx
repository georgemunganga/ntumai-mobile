import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store';
import type { User as StoreUser } from '@/src/store/types';
import type { User as ApiUser } from '@/src/apitypes';
import type {
  AuthChallengeRequest,
  AuthChallengeResponse,
  AuthChallengeVerificationRequest,
} from '@/src/apimodules/auth';
import { useAuthDomain } from '@/src/domain/auth';
import {
  AuthContextType,
  AuthProviderProps,
  AuthResult,
  LoginCredentials,
  RegisterData,
  VerificationResult,
} from './types';
import { validateLoginCredentials as validateLoginCredentialsUtil } from '@/src/utils/authValidation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapApiRoleToStoreRole = (role: ApiUser['role']): StoreUser['role'] => {
  switch (role) {
    case 'restaurant_owner':
      return 'vendor';
    case 'delivery_driver':
      return 'tasker';
    case 'admin':
      return 'admin';
    default:
      return 'customer';
  }
};

const mapApiUserToStoreUser = (user: ApiUser): StoreUser => ({
  id: user.id,
  email: user.email,
  phone: user.phone,
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatar,
  role: mapApiRoleToStoreRole(user.role),
  isVerified: user.emailVerified || user.phoneVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const sanitizePhone = (phone: string): string => phone.replace(/[\s-]/g, '');

const extractPhoneParts = (phone: string, countryCode?: string) => {
  const trimmed = sanitizePhone(phone);

  if (countryCode) {
    if (trimmed.startsWith(countryCode)) {
      return {
        countryCode,
        identifier: trimmed.slice(countryCode.length),
      };
    }
    return {
      countryCode,
      identifier: trimmed.replace(/^\+/, ''),
    };
  }

  if (trimmed.startsWith('+')) {
    const match = trimmed.match(/^\+(\d{1,4})(.*)$/);
    if (match) {
      return {
        countryCode: `+${match[1]}`,
        identifier: match[2],
      };
    }
  }

  return {
    countryCode,
    identifier: trimmed,
  };
};

const toChallengeRequest = (
  credentials: LoginCredentials,
  purpose: AuthChallengeRequest['purpose']
): AuthChallengeRequest => {
  const email = credentials.email?.trim();
  const phone = credentials.phone?.trim();

  if (email) {
    return {
      method: 'email',
      identifier: email.toLowerCase(),
      purpose,
      metadata: {
        channel: 'email',
      },
    };
  }

  if (phone) {
    const parts = extractPhoneParts(phone, credentials.countryCode);
    if (!parts.countryCode) {
      throw new Error('Country code is required when using phone authentication');
    }

    return {
      method: 'phone',
      identifier: parts.identifier,
      countryCode: parts.countryCode,
      purpose,
      metadata: {
        channel: 'sms',
      },
    };
  }

  throw new Error('Either email or phone number must be provided');
};

const getVerificationDisplayValue = (request: AuthChallengeRequest): string => {
  if (request.method === 'phone') {
    const code = request.countryCode ?? '';
    const normalizedCode = code.startsWith('+') ? code : `+${code}`;
    return `${normalizedCode}${request.identifier}`;
  }
  return request.identifier;
};

const getDisplayValueFromState = (request?: AuthChallengeRequest): string | undefined =>
  request ? getVerificationDisplayValue(request) : undefined;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
};

const DEFAULT_VERIFICATION_STATE = {
  requiresVerification: false,
  method: undefined as 'email' | 'phone' | undefined,
  value: undefined as string | undefined,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login: loginStore,
    logout: logoutStore,
    setLoading,
    setError,
    clearError: clearStoreError,
  } = useAuthStore();

  const { state: domainState, coordinator, isInitializing, initializationError, reinitialize } = useAuthDomain({
    persistence: { enabled: false },
  });

  const [verificationState, setVerificationState] = useState(DEFAULT_VERIFICATION_STATE);

  useEffect(() => {
    if (domainState.status === 'authenticated' && domainState.user && domainState.session) {
      const apiUser = domainState.user as ApiUser;
      if (!isAuthenticated || token !== domainState.session.accessToken) {
        loginStore(mapApiUserToStoreUser(apiUser), domainState.session.accessToken);
      }
    }
  }, [domainState, isAuthenticated, token, loginStore]);

  // Sync verification state with domain state
  // IMPORTANT: This clears stale state when NOT in active verification flow
  useEffect(() => {
    if (
      (domainState.status === 'challenge-sent' || domainState.status === 'verifying') &&
      domainState.request
    ) {
      // Active verification flow - sync state
      const currentRequest = domainState.request;
      const displayValue = getVerificationDisplayValue(currentRequest);

      setVerificationState((prev) => {
        // Only update if values actually changed
        if (
          prev.requiresVerification &&
          prev.method === currentRequest.method &&
          prev.value === displayValue
        ) {
          return prev;
        }

        return {
          requiresVerification: true,
          method: currentRequest.method,
          value: displayValue,
        };
      });
    } else {
      // NOT in verification flow - ensure state is clean
      // This handles: fresh app launch, completed auth, errors, etc.
      setVerificationState(DEFAULT_VERIFICATION_STATE);
    }
  }, [domainState.status, domainState.request]);

  const isLoading =
    storeLoading || domainState.status === 'requesting-challenge' || domainState.status === 'verifying';
  const domainRequest = domainState.request;
  const requiresVerification =
    verificationState.requiresVerification ||
    domainState.status === 'challenge-sent' ||
    domainState.status === 'verifying';
  const verificationMethod = verificationState.method ?? domainRequest?.method ?? undefined;
  const verificationValue = verificationState.value ?? getDisplayValueFromState(domainRequest);

  const performChallenge = useCallback(
    async (
      credentials: LoginCredentials,
      purpose: AuthChallengeRequest['purpose']
    ): Promise<AuthResult> => {
      setLoading(true);
      setError(null);

      try {
        const validation = validateLoginCredentialsUtil(credentials);
        if (!validation.isValid) {
          const message = validation.errors.join(', ');
          setError(message);
          return {
            success: false,
            error: message,
          };
        }

        const request = toChallengeRequest(credentials, purpose);
        await coordinator.startChallenge(request);

        const displayValue = getVerificationDisplayValue(request);
        setVerificationState({
          requiresVerification: true,
          method: request.method,
          value: displayValue,
        });

        return {
          success: true,
          requiresVerification: true,
          verificationMethod: request.method,
          verificationValue: displayValue,
        };
      } catch (error) {
        const message = getErrorMessage(error, 'Failed to request verification code');
        setError(message);
        return {
          success: false,
          error: message,
        };
      } finally {
        setLoading(false);
      }
    },
    [coordinator, setError, setLoading]
  );

  const sendOtp = useCallback(
    (credentials: LoginCredentials, purpose: AuthChallengeRequest['purpose'] = 'login') =>
      performChallenge(credentials, purpose),
    [performChallenge]
  );

  const login = useCallback(
    (credentials: LoginCredentials) => performChallenge(credentials, 'login'),
    [performChallenge]
  );

  const register = useCallback(
    (data: RegisterData) =>
      performChallenge(
        {
          email: data.email,
          phone: data.phone,
          countryCode: data.countryCode,
        },
        'register'
      ),
    [performChallenge]
  );

  const verifyOtp = useCallback(
    async (otp: string): Promise<VerificationResult> => {
      const activeChallenge: AuthChallengeResponse | undefined = domainState.challenge;
      const activeRequest: AuthChallengeRequest | undefined = domainState.request;

      if (!activeChallenge || !activeRequest) {
        const message = 'No active verification challenge';
        setError(message);
        return { success: false, error: message };
      }

      const verificationRequest: AuthChallengeVerificationRequest = {
        challengeId: activeChallenge.challengeId,
        code: otp.trim(),
        method: activeRequest.method,
        identifier: activeRequest.identifier,
        countryCode: activeRequest.countryCode,
      };

      setLoading(true);

      try {
        const nextState = await coordinator.verifyCode(verificationRequest);

        if (!nextState.session || !nextState.user) {
          throw new Error('Verification completed without an authenticated session');
        }

        const storeUser = mapApiUserToStoreUser(nextState.user as ApiUser);
        loginStore(storeUser, nextState.session.accessToken);
        setVerificationState(DEFAULT_VERIFICATION_STATE);

        return { success: true };
      } catch (error) {
        const message = getErrorMessage(error, 'Verification failed');
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [coordinator, domainState.challenge, domainState.request, loginStore, setError, setLoading]
  );

  const resendOtp = useCallback(async () => {
    const activeRequest: AuthChallengeRequest | undefined = domainState.request;
    if (!activeRequest) {
      const message = 'No verification request to resend';
      setError(message);
      return;
    }

    setLoading(true);
    try {
      await coordinator.startChallenge(activeRequest);
      const displayValue = getVerificationDisplayValue(activeRequest);
      setVerificationState({
        requiresVerification: true,
        method: activeRequest.method,
        value: displayValue,
      });
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to resend verification code');
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [coordinator, domainState.request, setError, setLoading]);

  const logout = useCallback(async () => {
    await coordinator.logout();
    logoutStore();
    setVerificationState(DEFAULT_VERIFICATION_STATE);
  }, [coordinator, logoutStore]);

  const clearError = useCallback(() => {
    clearStoreError();
    coordinator.clearError();
    // Also clear verification state when clearing errors
    // This prevents stale OTP states from persisting
    setVerificationState(DEFAULT_VERIFICATION_STATE);
  }, [clearStoreError, coordinator]);

  const retryInitialization = useCallback(async () => {
    clearStoreError();
    coordinator.clearError();
    try {
      await reinitialize();
    } catch (error) {
      // Error already captured by hook
    }
  }, [clearStoreError, coordinator, reinitialize]);

  const validateCredentials = useCallback((credentials: LoginCredentials) => validateLoginCredentialsUtil(credentials), []);

  const handleAuthSuccess = useCallback(
    (result: AuthResult) => {
      if (result.requiresVerification && result.verificationMethod && result.verificationValue) {
        setVerificationState({
          requiresVerification: true,
          method: result.verificationMethod,
          value: result.verificationValue,
        });

        router.push({
          pathname: '/(auth)/Otp',
          params: {
            method: result.verificationMethod,
            value: result.verificationValue,
          },
        });
      } else if (result.success) {
        router.replace('/Home');
      }
    },
    [router]
  );

  const completeVerification = useCallback(() => {
    setVerificationState(DEFAULT_VERIFICATION_STATE);
    router.replace('/Home');
  }, [router]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      isInitializing,
      error: storeError,
      initializationError,
      requiresVerification,
      verificationMethod,
      verificationValue,
      sendOtp,
      login,
      register,
      logout,
      verifyOtp,
      resendOtp,
      clearError,
      retryInitialization,
      validateCredentials,
      handleAuthSuccess,
      completeVerification,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      isInitializing,
      storeError,
      initializationError,
      requiresVerification,
      verificationMethod,
      verificationValue,
      sendOtp,
      login,
      register,
      logout,
      verifyOtp,
      resendOtp,
      clearError,
      retryInitialization,
      validateCredentials,
      handleAuthSuccess,
      completeVerification,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
