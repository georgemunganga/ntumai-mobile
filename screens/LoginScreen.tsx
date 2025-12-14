import AppText from '@/components/AppText';
import { useState, useEffect } from 'react';
import { View, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Import auth provider and types
import { useAuthContext } from '@/src/providers';
import type { LoginCredentials } from '@/src/api/types';

// Import Zod validation
import { validateLoginCredentials, validatePhone, validateEmail } from '@/src/utils/authValidation';

import AuthHeader from '@/src/components/auth/AuthHeader';
import AuthMethodTabs from '@/src/components/auth/AuthMethodTabs';
import AuthInput from '@/src/components/auth/AuthInput';
import AuthButton from '@/src/components/auth/AuthButton';
import SocialAuth from '@/src/components/auth/SocialAuth';
import AuthFooter from '@/src/components/auth/AuthFooter';
import DevResetAuthButton from '@/src/components/auth/DevResetAuthButton';

const LoginScreen = () => {
  const router = useRouter();
  const {
    sendOtp,
    validateCredentials,
    isLoading,
    error,
    clearError,
  } = useAuthContext();

  // Form state
  const [selectedMethod, setSelectedMethod] = useState<'phone' | 'email'>('phone');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+263'); // Default to Zimbabwe
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string[]}>({});

  const handleMethodChange = (method: 'phone' | 'email') => {
    setSelectedMethod(method);
    setValidationErrors([]);
    setFieldErrors({});
    clearError();
    // Clear the other field when switching methods
    if (method === 'phone') {
      setEmail('');
    } else {
      setPhone('');
    }
    // Revalidate form after method change
    validateForm(method === 'phone' ? phone : email, method);
  };

  // Real-time validation function
  const validateForm = (value: string, method: 'phone' | 'email' = selectedMethod) => {
    console.log('🔍 Validating:', { value, method, countryCode });
    let validation;
    let isValid = false;
    const errors: {[key: string]: string[]} = {};

    if (method === 'phone') {
      validation = validatePhone(value, countryCode);
      console.log('📱 Phone validation result:', validation);
      if (!validation.isValid) {
        errors.phone = validation.errors;
      } else {
        isValid = true;
      }
    } else {
      validation = validateEmail(value);
      console.log('📧 Email validation result:', validation);
      if (!validation.isValid) {
        errors.email = validation.errors;
      } else {
        isValid = true;
      }
    }

    console.log('✅ Final validation state:', { isValid, errors, fieldErrors: errors });
    setFieldErrors(errors);
    setIsFormValid(isValid && value.trim().length > 0);
    return { isValid, errors: validation.errors };
  };

  const handleSendOtp = async () => {
    try {
      // Clear previous errors
      setValidationErrors([]);
      clearError();

      // Final validation before sending OTP
      const currentValue = selectedMethod === 'email' ? email : phone;
      const finalValidation = validateForm(currentValue, selectedMethod);

      if (!finalValidation.isValid) {
        setValidationErrors(finalValidation.errors);
        return;
      }

      // Prepare login credentials (no password needed for OTP)
      const credentials: LoginCredentials = {
        ...(selectedMethod === 'email' ? { email } : { phone, countryCode })
      };

      // Validate credentials using existing auth provider validation
      const validation = validateCredentials(credentials);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }

      // Send OTP
      const result = await sendOtp(credentials);

      // Handle OTP sending result
      if (result.success && result.requiresVerification) {
        console.log('[LOGIN] Manual navigation to OTP after user clicked Send OTP');
        router.push({
          pathname: '/(auth)/Otp',
          params: {
            method: result.verificationMethod!,
            value: result.verificationValue!,
          },
        });
      } else {
        Alert.alert('Failed to Send OTP', result.error || 'Unable to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      Alert.alert('Failed to Send OTP', 'An unexpected error occurred. Please try again.');
    }
  };

  // Real-time validation effects
  useEffect(() => {
    if (selectedMethod === 'phone' && phone) {
      validateForm(phone, 'phone');
    }
  }, [phone, countryCode]);

  useEffect(() => {
    if (selectedMethod === 'email' && email) {
      validateForm(email, 'email');
    }
  }, [email]);

  // Validate when method changes
  useEffect(() => {
    const currentValue = selectedMethod === 'email' ? email : phone;
    if (currentValue) {
      validateForm(currentValue, selectedMethod);
    } else {
      setIsFormValid(false);
      setFieldErrors({});
    }
  }, [selectedMethod]);

  // REMOVED: Auto-navigation useEffects (lines 166-187)
  // These violated architectural principles by auto-routing based on auth state changes.
  // ALL routing now happens via:
  // 1. User action: Manual navigation after clicking "Send OTP" button (line 124-131)
  // 2. Routing layer: app/index.tsx routes authenticated users to /Home
  // This prevents unwanted OTP routing on fresh devices with stale verification state.

  // Handle and display errors
  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
    }
  }, [error]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-white'>
        <StatusBar style='dark' />
        <View className='w-full flex justify-center items-center mt-12'>
          <Image
            source={require('@/assets/green-logo.png')}
            style={{ height: 44, width: 170 }}
          />
        </View>
        <AuthHeader
          title='Tiye, tiye!'
          subtitle='Login below'
          description='Enter your phone number or email to receive a verification code!'
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className='flex-1'
        >
          <ScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className='flex-1 px-6'>
              <AuthMethodTabs
                selectedMethod={selectedMethod}
                onMethodChange={handleMethodChange}
              />

              {/* Email/Phone Input */}
              {selectedMethod === 'email' ? (
                <View>
                  <AuthInput
                    method="email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    hasError={fieldErrors.email && fieldErrors.email.length > 0}
                    isValid={selectedMethod === 'email' && email.length > 0 && (!fieldErrors.email || fieldErrors.email.length === 0)}
                  />
                  {/* Display field-specific errors for email */}
                  {fieldErrors.email && fieldErrors.email.length > 0 && (
                    <View className="-mt-6 mb-4">
                      {fieldErrors.email.map((error, index) => (
                        <AppText key={index} className="text-red-500 text-sm mb-1">
                          {error}
                        </AppText>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <AuthInput
                    method="phone"
                    value={phone}
                    onChangeText={setPhone}
                    countryCode={countryCode}
                    onCountryCodeChange={setCountryCode}
                    placeholder="Enter your phone number"
                    hasError={fieldErrors.phone && fieldErrors.phone.length > 0}
                    isValid={selectedMethod === 'phone' && phone.length > 0 && (!fieldErrors.phone || fieldErrors.phone.length === 0)}
                  />
                  {/* Display field-specific errors for phone */}
                  {fieldErrors.phone && fieldErrors.phone.length > 0 && (
                    <View className="-mt-6 mb-4">
                      {fieldErrors.phone.map((error, index) => (
                        <AppText key={index} className="text-red-500 text-sm mb-1">
                          {error}
                        </AppText>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Display general validation errors */}
              {validationErrors.length > 0 && (
                <View className="mt-2">
                  {validationErrors.map((error, index) => (
                    <AppText key={index} className="text-red-500 text-sm mb-1">
                      {error}
                    </AppText>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View className='px-6'>
          <AuthButton
            title={isLoading ? 'Sending OTP...' : 'Send OTP'}
            onPress={handleSendOtp}
            disabled={isLoading || !isFormValid}
            className={`mb-4 ${isFormValid && !isLoading ? 'bg-primary' : 'bg-gray-400'}`}
          />
          <SocialAuth />
          <DevResetAuthButton />
        </View>

        <AuthFooter
          questionText="Don't have an account?"
          actionText='Sign Up'
          onPress={() => router.push('/(auth)/SelectMethod')}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
