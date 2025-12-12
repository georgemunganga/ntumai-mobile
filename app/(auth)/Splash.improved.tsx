/**
 * Splash/Dashboard Screen - Improved Flow
 * 
 * This is the first screen users see
 * Implements "Dashboard First" UX:
 * - Shows guest view if not authenticated
 * - Shows personalized dashboard if authenticated
 * - Bottom nav only appears when fully authenticated with role
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore, selectIsFullyAuthenticated } from '@/src/store/slices/authSlice.improved';
import { AuthButton } from '@/src/components/auth';

export default function SplashScreen() {
  const router = useRouter();
  const {
    isAuthenticated,
    hasRole,
    user,
    isLoading,
    initializeAuth,
  } = useAuthStore();

  const isFullyAuthenticated = selectIsFullyAuthenticated(useAuthStore());

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  useEffect(() => {
    const initApp = async () => {
      try {
        // Try to restore session from storage
        await initializeAuth();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initApp();
  }, []);

  // ========================================================================
  // NAVIGATION LOGIC
  // ========================================================================

  // If still loading, show loading screen
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  // If fully authenticated with role, go to dashboard
  if (isFullyAuthenticated && user?.role) {
    useEffect(() => {
      switch (user.role) {
        case 'customer':
          router.replace('/(customer)/Home');
          break;
        case 'tasker':
          router.replace('/(tasker)/DriverDashboard');
          break;
        case 'vendor':
          router.replace('/(vendor)/VendorDashboard');
          break;
      }
    }, []);

    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="text-gray-600 mt-4">Redirecting...</Text>
      </View>
    );
  }

  // ========================================================================
  // GUEST VIEW (Not authenticated)
  // ========================================================================

  if (!isAuthenticated) {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 px-6 py-8">
          {/* Logo/Hero */}
          <View className="items-center mt-12 mb-8">
            <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
              <Text className="text-5xl">🚀</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 text-center">
              NTUMAI
            </Text>
            <Text className="text-lg text-gray-600 text-center mt-2">
              Your All-in-One Delivery Platform
            </Text>
          </View>

          {/* Features */}
          <View className="gap-4 mb-12 mt-8">
            <FeatureCard
              icon="🍔"
              title="Order Food"
              description="Browse restaurants and get food delivered fast"
            />
            <FeatureCard
              icon="📦"
              title="Send Parcels"
              description="Send packages to anyone, anytime"
            />
            <FeatureCard
              icon="💼"
              title="Earn Money"
              description="Work as a tasker and earn on your schedule"
            />
            <FeatureCard
              icon="🏪"
              title="Sell Online"
              description="Start your store and reach customers"
            />
          </View>

          {/* CTA Buttons */}
          <View className="gap-3 mb-8">
            <AuthButton
              title="Sign In or Create Account"
              onPress={() => router.push('/(auth)/OtpStart')}
            />
            <TouchableOpacity
              onPress={() => router.push('/(auth)/Onboarding')}
              className="py-3 px-4 border-2 border-green-600 rounded-lg items-center"
            >
              <Text className="text-green-600 font-semibold">
                Learn More
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-sm text-blue-900 text-center">
              <Text className="font-semibold">No password needed.</Text> We use secure OTP authentication.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ========================================================================
  // AUTHENTICATED BUT NO ROLE (Onboarding)
  // ========================================================================

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-900">
            Welcome!
          </Text>
          <Text className="text-gray-600 mt-2">
            {user?.email || user?.phone || 'Guest'}
          </Text>
        </View>

        {/* Onboarding Message */}
        <View className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <Text className="text-lg font-bold text-green-900 mb-2">
            Complete Your Setup
          </Text>
          <Text className="text-green-800">
            Choose your role to get started and access all features.
          </Text>
        </View>

        {/* Role Selection Preview */}
        <View className="gap-4 mb-8">
          <RolePreviewCard
            icon="🛍️"
            title="Customer"
            description="Order food and services"
            onPress={() => router.push('/(auth)/RoleSelection')}
          />
          <RolePreviewCard
            icon="🚗"
            title="Tasker/Driver"
            description="Deliver and earn money"
            onPress={() => router.push('/(auth)/RoleSelection')}
          />
          <RolePreviewCard
            icon="🏪"
            title="Vendor"
            description="Sell food or services"
            onPress={() => router.push('/(auth)/RoleSelection')}
          />
        </View>

        {/* Continue Button */}
        <AuthButton
          title="Select Role"
          onPress={() => router.push('/(auth)/RoleSelection')}
        />

        {/* Logout Option */}
        <TouchableOpacity
          onPress={() => useAuthStore.getState().logout()}
          className="mt-8 py-3 items-center"
        >
          <Text className="text-gray-600 font-semibold">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ========================================================================
// COMPONENTS
// ========================================================================

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View className="flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg">
      <Text className="text-4xl">{icon}</Text>
      <View className="flex-1">
        <Text className="font-bold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-600 mt-1">{description}</Text>
      </View>
    </View>
  );
}

interface RolePreviewCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

function RolePreviewCard({ icon, title, description, onPress }: RolePreviewCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <Text className="text-4xl">{icon}</Text>
      <View className="flex-1">
        <Text className="font-bold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-600 mt-1">{description}</Text>
      </View>
      <Text className="text-gray-400 text-xl">›</Text>
    </TouchableOpacity>
  );
}
