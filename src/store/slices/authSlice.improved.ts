/**
 * Improved Authentication Store
 * 
 * Implements the new OTP flow with:
 * - OTP session management
 * - Onboarding token handling
 * - Two authentication paths (login vs signup)
 * - Token refresh and expiry management
 * - Persistent storage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  OtpStartRequest,
  OtpStartResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  OtpVerifyExistingUserResponse,
  OtpVerifyNewUserResponse,
  SelectRoleRequest,
  SelectRoleResponse,
  AuthMeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  AuthState as AuthStateType,
  OtpSession,
  AuthUser,
  Role,
} from '@/src/api/modules/auth/types';
import { mockAuthService } from '@/src/api/mockAuthServices';

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface AuthStore extends AuthStateType {
  // OTP Flow Actions
  startOtp: (request: OtpStartRequest) => Promise<OtpStartResponse>;
  verifyOtp: (request: OtpVerifyRequest) => Promise<OtpVerifyResponse>;
  selectRole: (request: SelectRoleRequest) => Promise<void>;
  
  // Session Management
  validateSession: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => Promise<void>;
  
  // State Management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Internal state updates
  setOtpSession: (session: OtpSession | null) => void;
  setOnboardingToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => void;
  
  // Initialization
  initializeAuth: () => Promise<void>;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // INITIAL STATE
      // ========================================================================
      
      user: null,
      accessToken: null,
      refreshToken: null,
      onboardingToken: null,
      otpSession: null,
      isAuthenticated: false,
      hasRole: false,
      isLoading: false,
      error: null,
      tokenExpiresAt: null,
      
      // ========================================================================
      // OTP FLOW ACTIONS
      // ========================================================================
      
      /**
       * Step 1: Start OTP flow
       * - User enters email or phone
       * - Backend determines if login or signup
       * - Backend decides channels (SMS, email, or both)
       */
      startOtp: async (request: OtpStartRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await mockAuthService.otpStart(request);
          
          // Store OTP session
          const otpSession: OtpSession = {
            sessionId: response.sessionId,
            flowType: response.flowType,
            channelsSent: response.channelsSent,
            expiresAt: new Date(Date.now() + response.expiresIn * 1000),
            email: request.email,
            phone: request.phone,
          };
          
          set({
            otpSession,
            isLoading: false,
          });
          
          return response;
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to start OTP flow';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },
      
      /**
       * Step 2: Verify OTP
       * - User enters OTP code
       * - Two paths:
       *   a) Existing user with role → Return full tokens
       *   b) New user → Return onboarding token
       */
      verifyOtp: async (request: OtpVerifyRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await mockAuthService.otpVerify(request);
          
          // PATH A: Existing user with role
          if (response.flowType === 'login' && !response.requiresRoleSelection) {
            const existingResponse = response as OtpVerifyExistingUserResponse;
            
            set({
              user: existingResponse.user,
              accessToken: existingResponse.accessToken,
              refreshToken: existingResponse.refreshToken,
              tokenExpiresAt: new Date(Date.now() + existingResponse.expiresIn * 1000),
              isAuthenticated: true,
              hasRole: true,
              otpSession: null, // Clear OTP session
              isLoading: false,
            });
            
            return response;
          }
          
          // PATH B: New user or user without role
          if (response.flowType === 'signup' && response.requiresRoleSelection) {
            const newUserResponse = response as OtpVerifyNewUserResponse;
            
            set({
              user: newUserResponse.user,
              onboardingToken: newUserResponse.onboardingToken,
              isAuthenticated: false, // Not fully authenticated yet
              hasRole: false,
              otpSession: null, // Clear OTP session
              isLoading: false,
            });
            
            return response;
          }
          
          throw new Error('Unexpected response from OTP verification');
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to verify OTP';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },
      
      /**
       * Step 3: Select Role
       * - User selects customer, tasker, or vendor
       * - Backend validates onboarding token
       * - Issues full token set
       */
      selectRole: async (request: SelectRoleRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await mockAuthService.selectRole(request);
          
          // Update user with role
          const currentUser = get().user;
          if (currentUser) {
            currentUser.role = request.role;
          }
          
          set({
            user: currentUser,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            tokenExpiresAt: new Date(Date.now() + response.expiresIn * 1000),
            onboardingToken: null, // Clear onboarding token
            isAuthenticated: true,
            hasRole: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to select role';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },
      
      // ========================================================================
      // SESSION MANAGEMENT ACTIONS
      // ========================================================================
      
      /**
       * Validate current session
       * Called on app startup to check if user is still authenticated
       */
      validateSession: async () => {
        try {
          const { accessToken } = get();
          
          if (!accessToken) {
            set({ isAuthenticated: false });
            return false;
          }
          
          // Call /auth/me to validate token
          const response = await mockAuthService.getMe(accessToken);
          
          set({
            user: response.user,
            isAuthenticated: true,
            hasRole: !!response.user.role,
          });
          
          return true;
        } catch (error) {
          // Token is invalid or expired
          set({
            isAuthenticated: false,
            accessToken: null,
            user: null,
          });
          return false;
        }
      },
      
      /**
       * Refresh access token
       * Called when access token is about to expire
       */
      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            set({ isAuthenticated: false });
            return false;
          }
          
          const response = await mockAuthService.refresh({
            refreshToken,
          });
          
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken || refreshToken,
            tokenExpiresAt: new Date(Date.now() + response.expiresIn * 1000),
          });
          
          return true;
        } catch (error) {
          // Refresh failed, user needs to login again
          set({
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            user: null,
          });
          return false;
        }
      },
      
      /**
       * Logout user
       * Clears all authentication data
       */
      logout: async () => {
        try {
          set({ isLoading: true });
          
          await mockAuthService.logout();
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            onboardingToken: null,
            otpSession: null,
            isAuthenticated: false,
            hasRole: false,
            tokenExpiresAt: null,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Even if logout fails on backend, clear local state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            onboardingToken: null,
            otpSession: null,
            isAuthenticated: false,
            hasRole: false,
            tokenExpiresAt: null,
            isLoading: false,
          });
        }
      },
      
      // ========================================================================
      // STATE MANAGEMENT ACTIONS
      // ========================================================================
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setOtpSession: (session: OtpSession | null) => {
        set({ otpSession: session });
      },
      
      setOnboardingToken: (token: string | null) => {
        set({ onboardingToken: token });
      },
      
      setUser: (user: AuthUser | null) => {
        set({ user });
      },
      
      setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => {
        set({
          accessToken,
          refreshToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        });
      },
      
      // ========================================================================
      // INITIALIZATION
      // ========================================================================
      
      /**
       * Initialize authentication on app startup
       * - Check for existing tokens
       * - Validate session
       * - Restore user state
       */
      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          
          // Try to validate existing session
          const isValid = await get().validateSession();
          
          set({ isLoading: false });
          
          return isValid;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
    }),
    {
      // Persistence configuration
      name: 'auth-store',
      storage: {
        getItem: async (name: string) => {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
        isAuthenticated: state.isAuthenticated,
        hasRole: state.hasRole,
      }),
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Select if user is fully authenticated and has a role
 */
export const selectIsFullyAuthenticated = (state: AuthStore) =>
  state.isAuthenticated && state.hasRole;

/**
 * Select if user is in onboarding (has onboarding token)
 */
export const selectIsOnboarding = (state: AuthStore) =>
  !!state.onboardingToken && !state.isAuthenticated;

/**
 * Select if OTP flow is in progress
 */
export const selectIsOtpFlowActive = (state: AuthStore) =>
  !!state.otpSession;

/**
 * Select if token is about to expire (within 5 minutes)
 */
export const selectShouldRefreshToken = (state: AuthStore) => {
  if (!state.tokenExpiresAt) return false;
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  return state.tokenExpiresAt <= fiveMinutesFromNow;
};
