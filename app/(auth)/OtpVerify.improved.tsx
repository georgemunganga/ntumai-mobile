/**
 * OTP Verification Screen - Improved Flow
 * 
 * User enters OTP code received via email or SMS
 * Backend handles two paths:
 * 1. Existing user with role → Direct login
 * 2. New user → Navigate to role selection
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/slices/authSlice.improved';
import { AuthInput, AuthButton, AuthHeader } from '@/src/components/auth';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { otpSession, verifyOtp, isLoading, error, clearError } = useAuthStore();
  
  // Form state
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Timer for OTP expiry
  useEffect(() => {
    if (!otpSession) {
      router.replace('/(auth)/OtpStart');
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const expiresAt = new Date(otpSession.expiresAt);
      const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        setFormError('OTP expired. Please request a new one.');
        setCanResend(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSession]);

  // ========================================================================
  // VALIDATION
  // ========================================================================

  const validateOtp = (otp: string): boolean => {
    // OTP should be 4-8 digits
    return /^\d{4,8}$/.test(otp);
  };

  const validateForm = (): boolean => {
    setFormError(null);

    if (!otp.trim()) {
      setFormError('OTP code is required');
      return false;
    }

    if (!validateOtp(otp)) {
      setFormError('OTP must be 4-8 digits');
      return false;
    }

    return true;
  };

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleVerifyOtp = async () => {
    if (!validateForm() || !otpSession) return;

    try {
      clearError();

      const response = await verifyOtp({
        sessionId: otpSession.sessionId,
        otp,
        deviceId: 'device-uuid', // In production, use actual device ID
      });

      // PATH 1: Existing user with role → Go to dashboard
      if (response.flowType === 'login' && !response.requiresRoleSelection) {
        router.replace('/(customer)/Home');
      }

      // PATH 2: New user → Go to role selection
      if (response.flowType === 'signup' && response.requiresRoleSelection) {
        router.push('/(auth)/RoleSelection');
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to verify OTP');
    }
  };

  const handleResendOtp = async () => {
    // Navigate back to OTP start
    router.replace('/(auth)/OtpStart');
  };

  // ========================================================================
  // HELPERS
  // ========================================================================

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const contactDisplay = otpSession
    ? otpSession.email || otpSession.phone || 'your contact'
    : 'your contact';

  const channelsDisplay = otpSession
    ? otpSession.channelsSent.join(' and ')
    : 'email or SMS';

  // ========================================================================
  // RENDER
  // ========================================================================

  if (!otpSession) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <AuthHeader
          title="Enter OTP Code"
          subtitle={`We sent a code to ${contactDisplay}`}
        />

        {/* Channel Info */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 mt-8">
          <Text className="text-sm text-blue-900">
            <Text className="font-semibold">OTP sent via:</Text> {channelsDisplay}
          </Text>
        </View>

        {/* OTP Input */}
        <View className="mb-6">
          <AuthInput
            label="OTP Code"
            placeholder="123456"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={8}
            editable={!isLoading && timeLeft > 0}
          />
          <Text className="text-xs text-gray-500 mt-2">
            Enter the 4-8 digit code
          </Text>
        </View>

        {/* Timer */}
        <View className="flex-row items-center justify-center mb-6">
          <Text className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
            Code expires in: {formatTime(timeLeft)}
          </Text>
        </View>

        {/* Error Messages */}
        {(formError || error) && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Text className="text-red-600 font-semibold">
              {formError || error}
            </Text>
          </View>
        )}

        {/* Verify Button */}
        <AuthButton
          title={isLoading ? 'Verifying...' : 'Verify OTP'}
          onPress={handleVerifyOtp}
          disabled={isLoading || timeLeft === 0}
          loading={isLoading}
        />

        {/* Resend Option */}
        <View className="mt-8 pt-8 border-t border-gray-200 items-center">
          <Text className="text-sm text-gray-600 mb-4">
            Didn't receive the code?
          </Text>
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={isLoading}
          >
            <Text className="text-green-600 font-semibold text-sm">
              Request New OTP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View className="mt-8 pt-8 border-t border-gray-200">
          <Text className="text-xs text-gray-500 text-center">
            Check your spam folder if you don't see the code
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
