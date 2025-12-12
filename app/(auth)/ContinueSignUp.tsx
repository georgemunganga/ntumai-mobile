import ContinueSignUpScreen from '../../screens/ContinueSignUpScreen';
import { AuthGuard } from '../../src/components/auth';

export default function ContinueSignUpRoute() {
  return (
    <AuthGuard requireAuth={false}>
      <ContinueSignUpScreen />
    </AuthGuard>
  );
}
