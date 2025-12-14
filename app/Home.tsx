import { Redirect } from 'expo-router';
import { useAuthContext } from '@/src/providers';
import { USER_ROLES } from '@/src/utils/constants';

const roleToRouteMap: Record<string, string> = {
  [USER_ROLES.CUSTOMER]: '/(customer)/(tabs)',
  [USER_ROLES.TASKER]: '/(tasker)/(tabs)',
  [USER_ROLES.VENDOR]: '/(vendor)/(tabs)',
  [USER_ROLES.ADMIN]: '/(customer)/(tabs)',
};

export default function HomeEntry() {
  const { isAuthenticated, user, isInitializing } = useAuthContext();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/Splash" />;
  }

  const target = roleToRouteMap[user.role] ?? '/(customer)/(tabs)';
  return <Redirect href={target} />;
}

