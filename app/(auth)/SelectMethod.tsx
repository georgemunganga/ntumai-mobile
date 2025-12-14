import SelectMethodScreen from '@/screens/SelectMethodScreen';
import { AuthGuard } from '@/src/components/auth';

export default function SelectMethodRoute() {
  return (
    <AuthGuard requireAuth={false}>
      <SelectMethodScreen />
    </AuthGuard>
  );
}

