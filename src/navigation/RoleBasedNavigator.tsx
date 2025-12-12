import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store';

export function RoleBasedNavigator() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  React.useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/(auth)/SplashScreen');
      return;
    }

    // Route based on user role
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
      default:
        router.replace('/(auth)/RoleSelection');
    }
  }, [isAuthenticated, user, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return null;
}

/**
 * Navigation Routes by Role:
 *
 * CUSTOMER:
 * - /(customer)/Home - Main dashboard
 * - /(customer)/Marketplace - Browse vendors
 * - /(customer)/VendorDetail - View vendor products
 * - /(customer)/Cart - Shopping cart
 * - /(customer)/CheckoutScreen - Checkout
 * - /(customer)/OrderTrackingScreen - Track orders
 * - /(customer)/SendParcelScreen - P2P delivery
 * - /(customer)/DeliveryTrackingScreen - Track deliveries
 * - /(customer)/DoTaskScreen - Create tasks
 * - /(customer)/TaskDetail - View task details
 * - /(shared)/WalletScreen - Wallet
 * - /(shared)/ProfileScreen - Profile
 * - /(shared)/EditProfileScreen - Edit profile
 * - /(shared)/AddressesScreen - Manage addresses
 * - /(shared)/PaymentMethodsScreen - Payment methods
 *
 * TASKER/DRIVER:
 * - /(tasker)/DriverDashboard - Main dashboard
 * - /(tasker)/AvailableJobsScreen - Browse available jobs
 * - /(tasker)/JobDetailScreen - View job details
 * - /(tasker)/DeliveryDetail - Active delivery details
 * - /(tasker)/DeliveryHistory - Past deliveries
 * - /(tasker)/EarningsScreen - View earnings
 * - /(shared)/WalletScreen - Wallet
 * - /(shared)/ProfileScreen - Profile
 * - /(shared)/EditProfileScreen - Edit profile
 *
 * VENDOR:
 * - /(vendor)/VendorDashboard - Main dashboard
 * - /(vendor)/ManageProductsScreen - Manage products
 * - /(vendor)/AddProductScreen - Add product
 * - /(vendor)/EditProductScreen - Edit product
 * - /(vendor)/AnalyticsScreen - View analytics
 * - /(vendor)/OrderHistory - View order history
 * - /(vendor)/OrderDetail - View order details
 * - /(shared)/ProfileScreen - Profile
 * - /(shared)/EditProfileScreen - Edit profile
 *
 * AUTH:
 * - /(auth)/SplashScreen - Initial splash
 * - /(auth)/PhoneLogin - Phone login
 * - /(auth)/OtpVerification - OTP verification
 * - /(auth)/RoleSelection - Role selection
 * - /(auth)/DriverOnboarding - Driver KYC
 */

