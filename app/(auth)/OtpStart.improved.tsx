/**
 * OTP Start Screen - Improved Flow
 * 
 * User enters email or phone number to start OTP flow
 * Backend determines if this is login or signup
 * Backend decides which channels to use (SMS, email, or both)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/slices/authSlice.improved';
import { AuthInput, AuthButton, AuthHeader } from '@/src/components/auth';
import { CountryCodePicker } from '@/src/components/ui/CountryCodePicker';

type ContactMethod = 'email' | 'phone';

export default function OtpStartScreen() {
  const router = useRouter();
  const { startOtp, isLoading, error, clearError } = useAuthStore();
  
  // Form state
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [formError, setFormError] = useState<string | null>(null);

  // ========================================================================
  // VALIDATION
  // ========================================================================

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    // Check if it's 7-15 digits (E.164 standard)
    return /^\d{7,15}$/.test(cleaned);
  };

  const validateForm = (): boolean => {
    setFormError(null);

    if (contactMethod === 'email') {
      if (!email.trim()) {
        setFormError('Email is required');
        return false;
      }
      if (!validateEmail(email)) {
        setFormError('Please enter a valid email address');
        return false;
      }
    } else {
      if (!phone.trim()) {
        setFormError('Phone number is required');
        return false;
      }
      if (!validatePhone(phone)) {
        setFormError('Please enter a valid phone number (7-15 digits)');
        return false;
      }
    }

    return true;
  };

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleStartOtp = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      
      let request = {
        email: contactMethod === 'email' ? email : undefined,
        phone: contactMethod === 'phone' ? `${countryCode}${phone}` : undefined,
        deviceId: 'device-uuid', // In production, use actual device ID
      };

      // Remove undefined fields
      Object.keys(request).forEach(key => 
        request[key as keyof typeof request] === undefined && delete request[key as keyof typeof request]
      );

      const response = await startOtp(request as any);

      // Navigate to OTP verification screen
      router.push('/(auth)/OtpVerify');
    } catch (err: any) {
      setFormError(err.message || 'Failed to start OTP flow');
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <AuthHeader
          title="Sign In or Create Account"
          subtitle="Enter your email or phone number to continue"
        />

        {/* Contact Method Tabs */}
        <View className="flex-row gap-3 mb-8 mt-8">
          <TouchableOpacity
            onPress={() => {
              setContactMethod('email');
              setFormError(null);
            }}
            className={`flex-1 py-3 rounded-lg border-2 items-center ${
              contactMethod === 'email'
                ? 'bg-green-50 border-green-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Text
              className={`font-semibold ${
                contactMethod === 'email' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setContactMethod('phone');
              setFormError(null);
            }}
            className={`flex-1 py-3 rounded-lg border-2 items-center ${
              contactMethod === 'phone'
                ? 'bg-green-50 border-green-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Text
              className={`font-semibold ${
                contactMethod === 'phone' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        {contactMethod === 'email' && (
          <View className="mb-6">
            <AuthInput
              label="Email Address"
              placeholder="user@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>
        )}

        {/* Phone Input */}
        {contactMethod === 'phone' && (
          <View className="mb-6">
            {/* Country Code Picker */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Country Code
              </Text>
              <CountryCodePicker
                selectedCode={countryCode}
                onSelectCode={setCountryCode}
              />
            </View>

            {/* Phone Number Input */}
            <AuthInput
              label="Phone Number"
              placeholder="972827372"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
              hint="Enter number without country code"
            />
          </View>
        )}

        {/* Error Messages */}
        {(formError || error) && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Text className="text-red-600 font-semibold">
              {formError || error}
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <Text className="text-sm text-blue-900">
            {contactMethod === 'email'
              ? "We'll send a one-time code to your email. No password needed."
              : "We'll send a one-time code via SMS. Make sure your phone number is correct."}
          </Text>
        </View>

        {/* Continue Button */}
        <AuthButton
          title={isLoading ? 'Sending OTP...' : 'Continue'}
          onPress={handleStartOtp}
          disabled={isLoading}
          loading={isLoading}
        />

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Alternative Actions */}
        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/Onboarding')}
            className="py-3 px-4 border border-gray-300 rounded-lg items-center"
          >
            <Text className="text-gray-700 font-semibold">
              Learn More
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-8 pt-8 border-t border-gray-200">
          <Text className="text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <Text className="text-green-600 font-semibold">Terms of Service</Text>
            {' '}and{' '}
            <Text className="text-green-600 font-semibold">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
