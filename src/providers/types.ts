import { ReactNode } from 'react';
import { User } from '@/src/store/types';

export type AuthChallengePurpose = 'login' | 'register' | 'reset-password' | 'verify';

// Auth Provider Types
export interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  initializationError: string | null;
  requiresVerification: boolean;
  verificationMethod?: 'email' | 'phone';
  verificationValue?: string;
  
  // Actions
  sendOtp: (credentials: LoginCredentials, purpose?: AuthChallengePurpose) => Promise<AuthResult>;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<VerificationResult>;
  resendOtp: () => Promise<void>;
  clearError: () => void;
  retryInitialization: () => void;
  validateCredentials: (credentials: LoginCredentials) => { isValid: boolean; errors: string[]; };
  
  // Navigation helpers
  handleAuthSuccess: (result: AuthResult) => void;
  completeVerification: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// OTP Provider Types
export interface OtpContextType {
  // State
  isVisible: boolean;
  method: 'email' | 'phone' | null;
  value: string | null;
  countdown: number;
  isResendDisabled: boolean;
  isVerifying: boolean;
  error: string | null;
  
  // Actions
  showOtp: (method: 'email' | 'phone', value: string) => void;
  hideOtp: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
  resendOtp: () => Promise<void>;
  resetCountdown: () => void;
}

export interface OtpProviderProps {
  children: ReactNode;
}

// Auth Flow Types
export interface LoginCredentials {
  email?: string;
  phone?: string;
  countryCode?: string;
}

export interface RegisterData {
  email?: string;
  phone?: string;
  countryCode?: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  requiresVerification?: boolean;
  verificationMethod?: 'email' | 'phone';
  verificationValue?: string;
  error?: string;
}

export interface VerificationResult {
  success: boolean;
  error?: string;
}

// Navigation Types
export type AuthNavigationAction = 
  | { type: 'NAVIGATE_HOME' }
  | { type: 'NAVIGATE_OTP'; method: 'email' | 'phone'; value: string }
  | { type: 'NAVIGATE_COMPLETE_PROFILE' }
  | { type: 'STAY_CURRENT' };
