import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/providers';
import { USER_ROLES } from '../src/utils/constants';

const SplashScreen = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    isLoading,
    isInitializing,
    error,
    clearError,
    requiresVerification,
    verificationMethod,
    verificationValue,
  } = useAuthContext();
  const [minSplashTime, setMinSplashTime] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Ensure minimum splash screen display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashTime(true);
    }, 3000); // Minimum 3 seconds splash
    return () => clearTimeout(timer);
  }, []);

  // Authentication initialization is handled by AuthProvider
  
  // Retry initialization on error
  const handleRetry = () => {
    clearError();
    setRetryCount(prev => prev + 1);
    // Force re-initialization by navigating to splash again
    router.replace('/(auth)/Splash');
  };

  // Navigate based on authentication state after initialization
  useEffect(() => {
    if (!isInitializing && !isLoading && minSplashTime && !error) {
      if (requiresVerification && verificationMethod && verificationValue) {
        router.replace({
          pathname: '/(auth)/Otp',
          params: { method: verificationMethod, value: verificationValue },
        });
        return;
      }

      if (isAuthenticated && user) {
        router.replace('/Home');
      } else {
        // User not authenticated, go to onboarding
        router.replace('/(auth)/Onboarding');
      }
    }
  }, [
    isInitializing,
    isLoading,
    minSplashTime,
    isAuthenticated,
    requiresVerification,
    verificationMethod,
    verificationValue,
    user,
    router,
    error,
  ]);

  return (
    <View className='flex-1 bg-primary'>
      <ImageBackground
        source={require('../assets/splash_style.png')}
        className='flex-1 absolute top-0 left-0 w-full h-full'
        resizeMode='cover'
        style={{ opacity: 0.1 }}
      />
      <View className='flex-1 justify-center items-center px-8'>
        {/* App Logo or Branding */}
        <View className='mb-12'>
          <Text className='text-white text-4xl font-bold text-center mb-2'>
            NTUMAI
          </Text>
          <Text className='text-white/80 text-lg text-center'>
            Food Delivery Made Easy
          </Text>
        </View>

        {/* Loading and Error States */}
        {error ? (
          <View className='items-center'>
            <Text className='text-red-300 text-center mb-4 text-base'>
              {error.includes('Network') ? 
                'Network connection failed. Please check your internet connection.' :
                'Failed to initialize app. Please try again.'
              }
            </Text>
            <TouchableOpacity 
              onPress={handleRetry}
              className='bg-white/20 px-6 py-3 rounded-lg'
            >
              <Text className='text-white font-semibold'>
                Retry {retryCount > 0 && `(${retryCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className='items-center'>
            <ActivityIndicator size='large' color='white' className='mb-4' />
            <Text className='text-white/80 text-center'>
              {isInitializing ? 'Initializing...' : 
               isLoading ? 'Loading...' : 
               !minSplashTime ? 'Starting up...' : 'Almost ready...'}
            </Text>
          </View>
        )}
      </View>
      <StatusBar style='light' />
    </View>
  );
};

export default SplashScreen;
