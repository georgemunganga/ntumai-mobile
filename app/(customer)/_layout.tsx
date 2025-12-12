import { Stack } from 'expo-router';
import { AuthGuard } from '../../src/components/auth';
import { USER_ROLES } from '../../src/utils/constants';

export default function CustomerLayout() {
  return (
    <AuthGuard allowedRoles={[USER_ROLES.CUSTOMER]} redirectTo='/Home'>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthGuard>
  );
}
