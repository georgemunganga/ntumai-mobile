import OtpInputScreen from '../../screens/OtpInputScreen';
import { AuthGuard } from '../../src/components/auth';

export default function OtpRoute() {
  return (
    <AuthGuard requireAuth={false}>
      <OtpInputScreen />
    </AuthGuard>
  );
}
