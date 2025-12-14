/**
 * Role-Based Navigator - Improved Flow
 * 
 * Implements "Dashboard First" UX:
 * - Splash screen is always the first screen
 * - Guest view shown if not authenticated
 * - Bottom nav only appears when fully authenticated with role
 * - Protected routes redirect to login if not authenticated
 */

import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore, selectIsFullyAuthenticated } from '@/src/store/slices/authSlice.improved';

/**
 * This hook protects routes and handles navigation based on auth state
 */
export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const {
    isAuthenticated,
    hasRole,
    user,
    isLoading,
    initializeAuth,
  } = useAuthStore();

  const isFullyAuthenticated = selectIsFullyAuthenticated(useAuthStore());

  useEffect(() => {
    // Initialize auth on app start
    if (!isLoading) {
      initializeAuth();
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Get the current route
    const inAuthGroup = segments[0] === '(auth)';
    const inCustomerGroup = segments[0] === '(customer)';
    const inTaskerGroup = segments[0] === '(tasker)';
    const inVendorGroup = segments[0] === '(vendor)';

    // ========================================================================
    // ROUTE PROTECTION LOGIC
    // ========================================================================

    // If not authenticated and trying to access protected routes
    if (!isAuthenticated && (inCustomerGroup || inTaskerGroup || inVendorGroup)) {
      // Redirect to login
      router.replace('/(auth)/OtpStart');
      return;
    }

    // If authenticated but no role and trying to access protected routes
    if (isAuthenticated && !hasRole && (inCustomerGroup || inTaskerGroup || inVendorGroup)) {
      // Redirect to role selection
      router.replace('/(auth)/RoleSelection');
      return;
    }

    // If fully authenticated, allow access to role-specific routes
    if (isFullyAuthenticated) {
      // Verify user is accessing correct role's routes
      if (inCustomerGroup && user?.role !== 'customer') {
        router.replace('/(auth)/Splash');
        return;
      }
      if (inTaskerGroup && user?.role !== 'tasker') {
        router.replace('/(auth)/Splash');
        return;
      }
      if (inVendorGroup && user?.role !== 'vendor') {
        router.replace('/(auth)/Splash');
        return;
      }
    }
  }, [isAuthenticated, hasRole, isFullyAuthenticated, isLoading, segments, user?.role]);
}

/**
 * Component that wraps the app and handles role-based navigation
 */
export function RoleBasedNavigator() {
  useProtectedRoute();
  return null; // Navigation is handled by Expo Router
}

/**
 * Hook to get navigation helpers for different roles
 */
export function useRoleNavigation() {
  const router = useRouter();
  const { user } = useAuthStore();

  return {
    // Auth navigation
    goLogin: () => router.push('/(auth)/OtpStart'),
    goRoleSelection: () => router.push('/(auth)/RoleSelection'),
    goSplash: () => router.replace('/(auth)/Splash'),

    // Customer navigation
    goCustomerHome: () => router.push('/(customer)/Home'),
    goMarketplace: () => router.push('/(customer)/Marketplace'),
    goCart: () => router.push('/(customer)/Cart'),
    goCheckout: () => router.push('/(customer)/Checkout'),
    goOrderTracking: (orderId: string) =>
      router.push(`/(customer)/OrderTracking?orderId=${orderId}`),
    goProfile: () => router.push('/(customer)/Profile'),

    // Tasker navigation
    goTaskerDashboard: () => router.push('/(tasker)/DriverDashboard'),
    goAvailableJobs: () => router.push('/(tasker)/AvailableJobsScreen'),
    goEarnings: () => router.push('/(tasker)/EarningsScreen'),

    // Vendor navigation
    goVendorDashboard: () => router.push('/(vendor)/VendorDashboard'),
    goManageProducts: () => router.push('/(vendor)/ManageProductsScreen'),
    goAnalytics: () => router.push('/(vendor)/AnalyticsScreen'),

    // Shared navigation
    goProfile: () => router.push('/(shared)/ProfileScreen'),
    goAddresses: () => router.push('/(shared)/AddressesScreen'),
    goPaymentMethods: () => router.push('/(shared)/PaymentMethodsScreen'),
    goWallet: () => router.push('/(shared)/WalletScreen'),
    goChat: () => router.push('/(shared)/ChatScreen'),

    // Logout
    logout: async () => {
      await useAuthStore.getState().logout();
      router.replace('/(auth)/Splash');
    },
  };
}

/**
 * Hook to check if user can access a specific route
 */
export function useCanAccessRoute(requiredRole?: 'customer' | 'tasker' | 'vendor'): boolean {
  const { isAuthenticated, hasRole, user } = useAuthStore();

  if (!isAuthenticated || !hasRole) {
    return false;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return false;
  }

  return true;
}

/**
 * Hook to check current auth state
 */
export function useAuthState() {
  const {
    isAuthenticated,
    hasRole,
    user,
    isLoading,
    error,
    accessToken,
    onboardingToken,
    otpSession,
  } = useAuthStore();

  return {
    isAuthenticated,
    hasRole,
    user,
    isLoading,
    error,
    accessToken,
    onboardingToken,
    otpSession,
    isFullyAuthenticated: isAuthenticated && hasRole,
    isOnboarding: isAuthenticated && !hasRole,
    isOtpFlowActive: !!otpSession,
  };
}
