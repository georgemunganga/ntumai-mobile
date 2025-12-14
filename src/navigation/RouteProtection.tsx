import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store';
import { Feather } from '@expo/vector-icons';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'tasker' | 'vendor';
  requiredAuth?: boolean;
}

/**
 * ProtectedRoute Component
 * Ensures user has required authentication and role to access route
 */
export function ProtectedRoute({
  children,
  requiredRole,
  requiredAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Check authentication
  if (requiredAuth && !isAuthenticated) {
    React.useEffect(() => {
      router.replace('/(auth)/Splash');
    }, []);
    return null;
  }

  // Check role
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Feather name="lock" size={64} color="#D1D5DB" />
        <Text className="text-2xl font-bold text-gray-900 mt-4">Access Denied</Text>
        <Text className="text-gray-600 text-center mt-2 px-6">
          You don't have permission to access this page.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

/**
 * Permission Checker
 * Returns true if user has required permission
 */
export function usePermission(requiredRole?: 'customer' | 'tasker' | 'vendor') {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return false;
  if (!requiredRole) return true;
  return user?.role === requiredRole;
}

/**
 * Role Checker Hook
 * Returns current user role
 */
export function useUserRole() {
  const { user } = useAuthStore();
  return user?.role || null;
}

/**
 * Authentication Checker Hook
 * Returns authentication status
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated;
}

/**
 * Feature Access Checker
 * Checks if user can access specific features
 */
export function useFeatureAccess() {
  const { user } = useAuthStore();

  return {
    canOrderFood: user?.role === 'customer',
    canSendParcel: user?.role === 'customer',
    canCreateTask: user?.role === 'customer',
    canAcceptJobs: user?.role === 'tasker',
    canManageProducts: user?.role === 'vendor',
    canViewAnalytics: user?.role === 'vendor',
    canWithdraw: user?.role === 'tasker' || user?.role === 'vendor',
  };
}
