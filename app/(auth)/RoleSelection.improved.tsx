/**
 * Role Selection Screen - Improved Flow
 * 
 * New users select their role after OTP verification
 * Only shown when requiresRoleSelection = true
 * Requires onboardingToken (prevents spoofing)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/slices/authSlice.improved';
import { AuthButton, AuthHeader } from '@/src/components/auth';
import { Briefcase, ShoppingBag, Truck } from 'lucide-react-native';

interface RoleOption {
  id: 'customer' | 'tasker' | 'vendor';
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Order food, send parcels, book services',
    icon: <ShoppingBag size={40} color="#16A34A" />,
    features: [
      'Browse restaurants & vendors',
      'Track orders in real-time',
      'Save favorite places',
      'Earn rewards',
    ],
  },
  {
    id: 'tasker',
    title: 'Tasker/Driver',
    description: 'Deliver orders and earn money',
    icon: <Truck size={40} color="#16A34A" />,
    features: [
      'Accept delivery jobs',
      'Flexible working hours',
      'Earn daily',
      'Build your rating',
    ],
  },
  {
    id: 'vendor',
    title: 'Vendor',
    description: 'Sell food or services',
    icon: <Briefcase size={40} color="#16A34A" />,
    features: [
      'Manage your store',
      'Track sales & analytics',
      'Reach more customers',
      'Set your own prices',
    ],
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { onboardingToken, selectRole, isLoading, error, clearError } = useAuthStore();
  
  const [selectedRole, setSelectedRole] = useState<'customer' | 'tasker' | 'vendor' | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // ========================================================================
  // VALIDATION
  // ========================================================================

  const validateForm = (): boolean => {
    setFormError(null);

    if (!selectedRole) {
      setFormError('Please select a role to continue');
      return false;
    }

    if (!onboardingToken) {
      setFormError('Session expired. Please login again.');
      return false;
    }

    return true;
  };

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleSelectRole = async () => {
    if (!validateForm() || !selectedRole || !onboardingToken) return;

    try {
      clearError();

      await selectRole({
        onboardingToken,
        role: selectedRole,
      });

      // Navigate to appropriate screen based on role
      // New users (tasker/vendor) go to onboarding intro
      // Existing customers go directly to dashboard
      switch (selectedRole) {
        case 'customer':
          // Customers go straight to dashboard
          router.replace('/(customer)/Home');
          break;
        case 'tasker':
          // New taskers see onboarding intro first
          router.replace('/(tasker)/OnboardingIntro');
          break;
        case 'vendor':
          // New vendors see onboarding intro first
          router.replace('/(vendor)/OnboardingIntro');
          break;
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to select role');
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  if (!onboardingToken) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-red-600 font-semibold mb-4">
          Session expired
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/OtpStart')}
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">
            Login Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <AuthHeader
          title="Choose Your Role"
          subtitle="Select how you want to use NTUMAI"
        />

        {/* Role Options */}
        <View className="gap-4 mt-8 mb-8">
          {ROLE_OPTIONS.map((role) => (
            <TouchableOpacity
              key={role.id}
              onPress={() => {
                setSelectedRole(role.id);
                setFormError(null);
              }}
              className={`p-6 rounded-xl border-2 ${
                selectedRole === role.id
                  ? 'bg-green-50 border-green-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Icon and Title */}
              <View className="flex-row items-center mb-3">
                <View className="mr-4">
                  {role.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {role.title}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {role.description}
                  </Text>
                </View>
                {selectedRole === role.id && (
                  <View className="w-6 h-6 rounded-full bg-green-600 items-center justify-center">
                    <Text className="text-white font-bold">✓</Text>
                  </View>
                )}
              </View>

              {/* Features */}
              {selectedRole === role.id && (
                <View className="mt-4 pt-4 border-t border-green-200">
                  {role.features.map((feature, idx) => (
                    <View key={idx} className="flex-row items-center mb-2">
                      <Text className="text-green-600 mr-2">•</Text>
                      <Text className="text-sm text-gray-700">{feature}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Error Messages */}
        {(formError || error) && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Text className="text-red-600 font-semibold">
              {formError || error}
            </Text>
          </View>
        )}

        {/* Continue Button */}
        <AuthButton
          title={isLoading ? 'Setting up...' : 'Continue'}
          onPress={handleSelectRole}
          disabled={isLoading || !selectedRole}
          loading={isLoading}
        />

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <Text className="text-xs text-blue-900">
            <Text className="font-semibold">Note:</Text> You can change your role later in settings
          </Text>
        </View>

        {/* Footer */}
        <View className="mt-8 pt-8 border-t border-gray-200">
          <Text className="text-center text-xs text-gray-600">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
