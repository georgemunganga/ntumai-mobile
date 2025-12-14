import ContinueBoardingScreen from '@/screens/ContinueBoarding';
import { AuthGuard } from '@/src/components/auth';

export default function ContinueBoardingRoute() {
  return (
    <AuthGuard requireAuth={false}>
      <ContinueBoardingScreen />
    </AuthGuard>
  );
}

