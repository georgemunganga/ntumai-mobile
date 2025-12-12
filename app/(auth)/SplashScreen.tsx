import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        // Route based on user role
        if (user.role === 'driver') {
          router.replace('/(tasker)/DriverDashboard');
        } else if (user.role === 'vendor') {
          router.replace('/(vendor)/VendorDashboard');
        } else {
          router.replace('/(customer)/CustomerDashboard');
        }
      } else {
        router.replace('/(auth)/OtpVerification');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return (
    <View className="flex-1 bg-gradient-to-b from-green-600 to-green-700 items-center justify-center">
      {/* Logo */}
      <View className="mb-8">
        <Text className="text-6xl font-bold text-white text-center">🚀</Text>
      </View>

      {/* App Name */}
      <Text className="text-4xl font-bold text-white mb-2">Ntumai</Text>
      <Text className="text-lg text-green-100 mb-12">On-Demand Delivery & Tasks</Text>

      {/* Loading Indicator */}
      <ActivityIndicator size="large" color="white" />

      {/* Loading Text */}
      <Text className="text-green-100 mt-8">Getting things ready...</Text>
    </View>
  );
}
