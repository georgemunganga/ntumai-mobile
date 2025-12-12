import { Redirect } from 'expo-router';
import { useAuthContext } from '../src/providers';
import { USER_ROLES } from '../src/utils/constants';

const roleToRouteMap: Record<string, string> = {
  [USER_ROLES.CUSTOMER]: '/(customer)/CustomerDashboard',
  [USER_ROLES.DRIVER]: '/(tasker)/DriverHome',
  [USER_ROLES.VENDOR]: '/(vendor)/VendorTabs',
  [USER_ROLES.ADMIN]: '/(customer)/CustomerDashboard',
};

export default function HomeEntry() {
  const { isAuthenticated, user, isInitializing } = useAuthContext();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/SelectMethod" />;
  }

  const target = roleToRouteMap[user.role] ?? '/(customer)/CustomerDashboard';
  return <Redirect href={target} />;
}
