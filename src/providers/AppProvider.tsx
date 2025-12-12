import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AuthProvider } from './AuthProvider';
import { OtpProvider } from './OtpProvider';
import { useAuthStore } from '../store';
import { RoleBasedNavigator } from '../navigation/RoleBasedNavigator';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Main application provider that wraps all context providers
 * This ensures proper provider hierarchy and dependency management
 * Also handles role-based navigation and authentication initialization
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const router = useRouter();
  const { initializeAuth } = useAuthStore();

  // Initialize authentication on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        router.replace('/(auth)/SplashScreen');
      }
    };

    initApp();
  }, []);

  return (
    <AuthProvider>
      <OtpProvider>
        <RoleBasedNavigator />
        {children}
      </OtpProvider>
    </AuthProvider>
  );
};

/**
 * Navigation Structure:
 *
 * Auth Stack:
 * - SplashScreen (entry point)
 * - PhoneLogin
 * - OtpVerification
 * - RoleSelection
 * - DriverOnboarding
 *
 * Customer Stack:
 * - Home
 * - Marketplace
 * - VendorDetail
 * - Cart
 * - Checkout
 * - OrderTracking
 * - SendParcel
 * - DeliveryTracking
 * - DoTask
 * - TaskDetail
 * - Wallet
 * - Profile
 * - EditProfile
 * - Addresses
 * - PaymentMethods
 *
 * Tasker Stack:
 * - DriverDashboard
 * - AvailableJobs
 * - JobDetail
 * - DeliveryDetail
 * - DeliveryHistory
 * - Earnings
 * - Wallet
 * - Profile
 * - EditProfile
 *
 * Vendor Stack:
 * - VendorDashboard
 * - ManageProducts
 * - AddProduct
 * - EditProduct
 * - Analytics
 * - OrderHistory
 * - OrderDetail
 * - Profile
 * - EditProfile
 */