import { Stack } from 'expo-router';
import { AuthGuard } from '../../src/components/auth';
import { USER_ROLES } from '../../src/utils/constants';

export default function TaskerLayout() {
  return (
    <AuthGuard allowedRoles={[USER_ROLES.DRIVER]} redirectTo='/Home'>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthGuard>
  );
}
