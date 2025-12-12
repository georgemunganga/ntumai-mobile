import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { OtpContextType, OtpProviderProps } from './types';
import { useAuthContext } from './AuthProvider';

const OtpContext = createContext<OtpContextType | undefined>(undefined);

const OTP_COUNTDOWN_DURATION = 30; // seconds

export const OtpProvider: React.FC<OtpProviderProps> = ({ children }) => {
  const authContext = useAuthContext();
  
  // OTP UI state
  const [isVisible, setIsVisible] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(OTP_COUNTDOWN_DURATION);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (countdown > 0 && isResendDisabled && isVisible) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isResendDisabled, isVisible]);

  // Show OTP modal/screen
  const showOtp = useCallback((otpMethod: 'email' | 'phone', otpValue: string) => {
    setMethod(otpMethod);
    setValue(otpValue);
    setIsVisible(true);
    setCountdown(OTP_COUNTDOWN_DURATION);
    setIsResendDisabled(true);
    setError(null);
  }, []);

  // Hide OTP modal/screen
  const hideOtp = useCallback(() => {
    setIsVisible(false);
    setMethod(null);
    setValue(null);
    setError(null);
    setIsVerifying(false);
  }, []);

  // Verify OTP code
  const verifyOtp = useCallback(async (otp: string): Promise<boolean> => {
    try {
      setIsVerifying(true);
      setError(null);

      const result = await authContext.verifyOtp(otp);
      
      if (result.success) {
        // Hide OTP screen and complete verification
        hideOtp();
        authContext.completeVerification();
        return true;
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [authContext, hideOtp]);

  // Resend OTP code
  const resendOtp = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      await authContext.resendOtp();
      
      // Reset countdown
      setCountdown(OTP_COUNTDOWN_DURATION);
      setIsResendDisabled(true);
    } catch (error: any) {
      setError(error.message || 'Failed to resend code. Please try again.');
    }
  }, [authContext]);

  // Reset countdown manually
  const resetCountdown = useCallback(() => {
    setCountdown(OTP_COUNTDOWN_DURATION);
    setIsResendDisabled(true);
  }, []);

  // Sync with auth context verification state
  useEffect(() => {
    if (authContext.requiresVerification && authContext.verificationMethod && authContext.verificationValue) {
      showOtp(authContext.verificationMethod, authContext.verificationValue);
    } else if (!authContext.requiresVerification && isVisible) {
      hideOtp();
    }
  }, [authContext.requiresVerification, authContext.verificationMethod, authContext.verificationValue, isVisible, showOtp, hideOtp]);

  const contextValue: OtpContextType = {
    // State
    isVisible,
    method,
    value,
    countdown,
    isResendDisabled,
    isVerifying,
    error,
    
    // Actions
    showOtp,
    hideOtp,
    verifyOtp,
    resendOtp,
    resetCountdown,
  };

  return (
    <OtpContext.Provider value={contextValue}>
      {children}
    </OtpContext.Provider>
  );
};

export const useOtpContext = (): OtpContextType => {
  const context = useContext(OtpContext);
  if (context === undefined) {
    throw new Error('useOtpContext must be used within an OtpProvider');
  }
  return context;
};