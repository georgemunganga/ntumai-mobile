import { AuthProvider } from '@/src/providers/AuthProvider';
import { OtpProvider } from '@/src/providers/OtpProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Main application provider that wraps all context providers
 * This ensures proper provider hierarchy and dependency management
 *
 * Note: With Expo Router, navigation is handled by the file-based routing system.
 * The splash screen (app/index.tsx → /(auth)/Splash) handles initial routing decisions.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <OtpProvider>
        {children}
      </OtpProvider>
    </AuthProvider>
  );
};

/**
 * Navigation Structure:
 *
 * Auth Stack:
 * - Splash (entry point)
 * - PhoneLogin
 * - Otp
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
