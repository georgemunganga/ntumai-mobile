import AppText from '@/components/AppText';
import { useEffect } from 'react';
import { View, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/src/providers';
import Button from '@/src/components/ui/Button';
import DevResetAuthButton from '@/src/components/auth/DevResetAuthButton';

/**
 * Splash/Onboarding Screen
 *
 * This is a PROMOTIONAL screen shown to unauthenticated users.
 *
 * Responsibilities:
 * - Show app branding and value proposition
 * - Provide entry points for user actions
 * - NO automatic routing (only when user clicks)
 *
 * Note: This screen is only reached if user is NOT authenticated.
 * Initial routing happens at app/index.tsx based on auth state.
 */
const SplashScreen = () => {
  const router = useRouter();
  const { clearError } = useAuthContext();

  // Clear any stale auth state/errors when landing on this screen
  useEffect(() => {
    clearError();
  }, []);

  return (
    <View className='flex-1 bg-white'>
      {/* Top Section - Branding & Value Prop */}
      <View className='flex-1 justify-center items-center p-6 bg-white'>
        <AppText className='text-primary text-4xl font-bold text-center mb-4'>
          Quick Deliveries at your fingertips
        </AppText>
        <AppText className='text-gray-600 text-base text-center mb-6 font-ubuntu'>
          Find your favorite Meals at the best prices with exclusive deals only
          on Ntumai app.
        </AppText>
      </View>

      {/* Bottom Section - Actions */}
      <View className='relative h-1/4 bg-primary'>
        <ImageBackground
          source={require('@/assets/splash_style.png')}
          className='absolute top-0 left-0 w-full h-full'
          resizeMode='cover'
          style={{ opacity: 0.3 }}
        />

        <View className='flex-1 gap-2 p-6 justify-end z-10'>
          <Button
            title='Get Started'
            onPress={() => router.push('/(auth)/GuestDashboard')}
            className='text-primary bg-white font-ubuntu-bold'
          />
          <Button
            title='Sign In'
            onPress={() => router.push('/(auth)/Login')}
            className='text-white bg-black font-ubuntu-bold'
          />
          <DevResetAuthButton />
        </View>
      </View>

      <StatusBar style='dark' />
    </View>
  );
};

export default SplashScreen;
