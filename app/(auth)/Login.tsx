import LoginScreen from '@/screens/LoginScreen';
import { AuthGuard } from '@/src/components/auth';

export default function LoginRoute() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginScreen />
    </AuthGuard>
  );
}

