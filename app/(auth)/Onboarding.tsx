import SplashScreen from '@/screens/SplashScreen';

/**
 * Onboarding Route Wrapper
 *
 * Note: This uses SplashScreen as the canonical onboarding/promotional screen.
 * screens/OnboardingScreen.tsx is deprecated and will be removed in future cleanup.
 *
 * Both /(auth)/Splash and /(auth)/Onboarding routes now use the same screen component
 * to ensure consistent user experience.
 */
export default function OnboardingRoute() {
  return <SplashScreen />;
}
