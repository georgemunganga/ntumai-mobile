import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store';
import { mockAuthService } from '../../src/api/mockServices';

export default function OtpVerification() {
  const router = useRouter();
  const { loginAsync, setError, error, isLoading } = useAuthStore();

  const [otpId, setOtpId] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'contact' | 'verification'>('contact');
  const [isEmail, setIsEmail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const otpInputRef = useRef<TextInput>(null);

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    if (!contact.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    try {
      const isEmailFormat = contact.includes('@');
      setIsEmail(isEmailFormat);

      const response = await mockAuthService.sendOtp(
        isEmailFormat ? contact : undefined,
        isEmailFormat ? undefined : contact
      );

      if (response.success) {
        setOtpId(response.otpId);
        setStep('verification');
        setTimeLeft(response.expiresIn);
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 30000); // 30 second cooldown
        otpInputRef.current?.focus();
      } else {
        setError(response.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await mockAuthService.verifyOtp(otpId, otp);

      if (response.success) {
        // Store user and token in auth store
        useAuthStore.setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });

        // Navigate to home or role selection
        if (response.isNewUser) {
          router.replace('/(auth)/SelectMethod');
        } else {
          router.replace('/(customer)/CustomerDashboard');
        }
      } else {
        setError(response.error || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimeLeft(600);
    await handleSendOtp();
    setTimeout(() => setResendDisabled(false), 30000);
  };

  if (step === 'contact') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 px-6 py-12 justify-center">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">Sign In</Text>
            <Text className="text-lg text-gray-600">
              Enter your email or phone number to get started
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <Text className="text-red-800 font-medium">{error}</Text>
            </View>
          )}

          {/* Contact Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Email or Phone</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
              placeholder="example@email.com or +260978123456"
              value={contact}
              onChangeText={setContact}
              editable={!isLoading}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            onPress={handleSendOtp}
            disabled={isLoading || !contact.trim()}
            className={`rounded-lg py-4 flex-row items-center justify-center ${
              isLoading || !contact.trim() ? 'bg-gray-300' : 'bg-green-600'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-3 text-gray-500">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login Placeholder */}
          <TouchableOpacity className="border border-gray-300 rounded-lg py-3 mb-3">
            <Text className="text-center text-gray-700 font-semibold">Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-gray-300 rounded-lg py-3">
            <Text className="text-center text-gray-700 font-semibold">Continue with Apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12 justify-center">
        {/* Header */}
        <View className="mb-8">
          <TouchableOpacity onPress={() => setStep('contact')} className="mb-4">
            <Text className="text-blue-600 font-semibold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-4xl font-bold text-gray-900 mb-2">Verify OTP</Text>
          <Text className="text-lg text-gray-600">
            We've sent a code to {isEmail ? contact : `***${contact.slice(-4)}`}
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Text className="text-red-800 font-medium">{error}</Text>
          </View>
        )}

        {/* OTP Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Enter 6-digit Code</Text>
          <TextInput
            ref={otpInputRef}
            className="border border-gray-300 rounded-lg px-4 py-4 text-2xl text-center tracking-widest font-bold bg-white"
            placeholder="000000"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            keyboardType="number-pad"
            editable={!isLoading}
            placeholderTextColor="#D1D5DB"
          />
        </View>

        {/* Timer */}
        {timeLeft > 0 && (
          <Text className="text-center text-gray-600 mb-6">
            Code expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </Text>
        )}

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerifyOtp}
          disabled={isLoading || otp.length < 6}
          className={`rounded-lg py-4 flex-row items-center justify-center mb-4 ${
            isLoading || otp.length < 6 ? 'bg-gray-300' : 'bg-green-600'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Verify OTP</Text>
          )}
        </TouchableOpacity>

        {/* Resend Button */}
        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={resendDisabled || isLoading}
          className="py-3"
        >
          <Text className={`text-center font-semibold ${resendDisabled ? 'text-gray-400' : 'text-blue-600'}`}>
            {resendDisabled ? 'Resend in 30s' : 'Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
