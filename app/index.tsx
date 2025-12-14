import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthContext } from '@/src/providers';
import AppText from '@/components/AppText';

/**
 * App Entry Point - Handles initial routing logic
 *
 * Responsibilities:
 * 1. Wait for auth initialization
 * 2. Show native splash screen during init
 * 3. Route to appropriate screen based on auth state
 *
 * Routing Logic:
 * - Authenticated → /Home (role-based routing)
 * - Not Authenticated → /(auth)/Splash (onboarding flow)
 */
export default function Index() {
  const { isAuthenticated, user, isInitializing } = useAuthContext();
  const [minLoadTime, setMinLoadTime] = useState(false);

  // Ensure minimum 2 seconds for smooth transition
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadTime(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Wait for both auth initialization AND minimum load time
  if (isInitializing || !minLoadTime) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <AppText className="text-white text-4xl font-bold mb-4">NTUMAI</AppText>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  // Auth initialized - make routing decision
  if (isAuthenticated && user) {
    // User is logged in → go to role-based home
    return <Redirect href="/Home" />;
  }

  // User not authenticated → go to onboarding/splash
  return <Redirect href="/(auth)/Splash" />;
}
