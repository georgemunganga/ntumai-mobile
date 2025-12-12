import { useRouter } from 'expo-router';
import { useAuthStore } from '../store';

/**
 * Navigation Helper Hooks
 * Provides convenient navigation functions for different user roles
 */

export function useCustomerNavigation() {
  const router = useRouter();

  return {
    goHome: () => router.push('/(customer)/Home'),
    goMarketplace: () => router.push('/(customer)/Marketplace'),
    goVendorDetail: (vendorId: string) => router.push(`/(customer)/VendorDetail?vendorId=${vendorId}`),
    goCart: () => router.push('/(customer)/Cart'),
    goCheckout: () => router.push('/(customer)/CheckoutScreen'),
    goOrderTracking: (orderId: string) => router.push(`/(customer)/OrderTrackingScreen?orderId=${orderId}`),
    goSendParcel: () => router.push('/(customer)/SendParcelScreen'),
    goDeliveryTracking: (deliveryId: string) => router.push(`/(customer)/DeliveryTrackingScreen?deliveryId=${deliveryId}`),
    goDoTask: () => router.push('/(customer)/DoTaskScreen'),
    goTaskDetail: (taskId: string) => router.push(`/(customer)/TaskDetail?taskId=${taskId}`),
    goWallet: () => router.push('/(shared)/WalletScreen'),
    goProfile: () => router.push('/(shared)/ProfileScreen'),
    goEditProfile: () => router.push('/(shared)/EditProfileScreen'),
    goAddresses: () => router.push('/(shared)/AddressesScreen'),
    goPaymentMethods: () => router.push('/(shared)/PaymentMethodsScreen'),
  };
}

export function useTaskerNavigation() {
  const router = useRouter();

  return {
    goDashboard: () => router.push('/(tasker)/DriverDashboard'),
    goAvailableJobs: () => router.push('/(tasker)/AvailableJobsScreen'),
    goJobDetail: (jobId: string) => router.push(`/(tasker)/JobDetailScreen?jobId=${jobId}`),
    goDeliveryDetail: (orderId: string) => router.push(`/(tasker)/DeliveryDetail?orderId=${orderId}`),
    goDeliveryHistory: () => router.push('/(tasker)/DeliveryHistory'),
    goEarnings: () => router.push('/(tasker)/EarningsScreen'),
    goWallet: () => router.push('/(shared)/WalletScreen'),
    goProfile: () => router.push('/(shared)/ProfileScreen'),
    goEditProfile: () => router.push('/(shared)/EditProfileScreen'),
  };
}

export function useVendorNavigation() {
  const router = useRouter();

  return {
    goDashboard: () => router.push('/(vendor)/VendorDashboard'),
    goManageProducts: () => router.push('/(vendor)/ManageProductsScreen'),
    goAddProduct: () => router.push('/(vendor)/AddProductScreen'),
    goEditProduct: (productId: string) => router.push(`/(vendor)/EditProductScreen?productId=${productId}`),
    goAnalytics: () => router.push('/(vendor)/AnalyticsScreen'),
    goOrderHistory: () => router.push('/(vendor)/OrderHistory'),
    goOrderDetail: (orderId: string) => router.push(`/(vendor)/OrderDetail?orderId=${orderId}`),
    goProfile: () => router.push('/(shared)/ProfileScreen'),
    goEditProfile: () => router.push('/(shared)/EditProfileScreen'),
  };
}

export function useAuthNavigation() {
  const router = useRouter();

  return {
    goSplash: () => router.replace('/(auth)/SplashScreen'),
    goPhoneLogin: () => router.push('/(auth)/PhoneLogin'),
    goOtpVerification: (phone: string) => router.push(`/(auth)/OtpVerification?phone=${phone}`),
    goRoleSelection: () => router.push('/(auth)/RoleSelection'),
    goDriverOnboarding: () => router.push('/(auth)/DriverOnboarding'),
  };
}

/**
 * Role-based Navigation Hook
 * Automatically returns the correct navigation object based on user role
 */
export function useRoleBasedNavigation() {
  const { user } = useAuthStore();
  const customerNav = useCustomerNavigation();
  const taskerNav = useTaskerNavigation();
  const vendorNav = useVendorNavigation();
  const authNav = useAuthNavigation();

  switch (user?.role) {
    case 'customer':
      return customerNav;
    case 'tasker':
      return taskerNav;
    case 'vendor':
      return vendorNav;
    default:
      return authNav;
  }
}

/**
 * Deep Link Handler
 * Handles deep links and routes to appropriate screen
 */
export function useDeepLinkHandler() {
  const router = useRouter();
  const { user } = useAuthStore();

  return {
    handleDeepLink: (url: string) => {
      // Parse deep link and route accordingly
      const parts = url.split('://');
      if (parts.length !== 2) return;

      const [scheme, path] = parts;
      const [route, ...params] = path.split('?');

      // Route based on scheme and path
      switch (route) {
        case 'order':
          if (user?.role === 'customer') {
            router.push(`/(customer)/OrderTrackingScreen?orderId=${params[0]}`);
          }
          break;
        case 'delivery':
          if (user?.role === 'customer') {
            router.push(`/(customer)/DeliveryTrackingScreen?deliveryId=${params[0]}`);
          }
          break;
        case 'job':
          if (user?.role === 'tasker') {
            router.push(`/(tasker)/JobDetailScreen?jobId=${params[0]}`);
          }
          break;
        default:
          break;
      }
    },
  };
}

