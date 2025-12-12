// ContinueSignUpScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import { useAuthContext } from "../src/providers";
import type { RegisterData } from "../src/providers/types";

// Import Zod validation
import { signupSchema, validateEmail, validatePhone } from "../src/utils/authValidation";

const ContinueSignUpScreen = () => {
  const router = useRouter();
  const {
    register,
    isLoading,
    error,
    clearError,
    isAuthenticated,
    requiresVerification,
    verificationMethod,
    verificationValue,
  } = useAuthContext();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Real-time validation function
  const validateForm = () => {
    const errors: {[key: string]: string[]} = {};
    let isValid = true;

    // Validate first name
    if (!firstName.trim()) {
      errors.firstName = ['First name is required'];
      isValid = false;
    } else if (firstName.trim().length < 2) {
      errors.firstName = ['First name must be at least 2 characters'];
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(firstName.trim())) {
      errors.firstName = ['First name can only contain letters and spaces'];
      isValid = false;
    }

    // Validate last name
    if (!lastName.trim()) {
      errors.lastName = ['Last name is required'];
      isValid = false;
    } else if (lastName.trim().length < 2) {
      errors.lastName = ['Last name must be at least 2 characters'];
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(lastName.trim())) {
      errors.lastName = ['Last name can only contain letters and spaces'];
      isValid = false;
    }

    // Validate email or phone (at least one required)
    const hasEmail = email.trim().length > 0;
    const hasPhone = phoneNumber.trim().length > 0;
    
    if (!hasEmail && !hasPhone) {
      errors.contact = ['Either email or phone number is required'];
      isValid = false;
    } else {
      if (hasEmail) {
        const emailValidation = validateEmail(email.trim());
        if (!emailValidation.isValid) {
          errors.email = emailValidation.errors;
          isValid = false;
        }
      }
      
      if (hasPhone) {
        const phoneValidation = validatePhone(phoneNumber.trim(), '+1');
        if (!phoneValidation.isValid) {
          errors.phone = phoneValidation.errors;
          isValid = false;
        }
      }
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      errors.terms = ['Please accept the Terms and Conditions'];
      isValid = false;
    }

    setValidationErrors(errors);
    setIsFormValid(isValid);
    return { isValid, errors };
  };

  const handleSignUp = async () => {
    try {
      // Clear previous errors
      clearError();
      
      // Final validation before submission
      const validation = validateForm();
      if (!validation.isValid) {
        return;
      }

      // Construct register data
      const registerData: RegisterData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        phone: phoneNumber.trim() || undefined,
        countryCode: '+1', // You might want to make this dynamic
        acceptTerms,
      };

      // Call register method from AuthProvider
      const result = await register(registerData);
      
      if (
        result.success &&
        result.requiresVerification &&
        result.verificationMethod &&
        result.verificationValue
      ) {
        router.push({
          pathname: '/(auth)/Otp',
          params: {
            method: result.verificationMethod,
            value: result.verificationValue,
          },
        });
      } else if (!result.success) {
        Alert.alert('Registration Failed', result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  // Real-time validation effects
  useEffect(() => {
    validateForm();
  }, [firstName, lastName, email, phoneNumber, acceptTerms]);

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (requiresVerification && verificationMethod && verificationValue) {
      router.push({
        pathname: '/(auth)/Otp',
        params: { method: verificationMethod, value: verificationValue },
      });
    } else if (isAuthenticated) {
      router.replace('/Home');
    }
  }, [requiresVerification, verificationMethod, verificationValue, isAuthenticated, router]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="items-center px-6 pt-20 pb-8">
            <Image
              source={require("../assets/logo_green.png")}
              resizeMode="contain"
              className="w-100 h-24 mb-6"
            />
            <View className="mr-24 mb-3">
              <Text className="text-primary text-4xl text-left font-bold mb-2">
                Let's Continue,
              </Text>
              <Text className="text-primary text-4xl text-left font-bold mb-4">
                almost there!
              </Text>
            </View>
            <Text className="text-gray-500 text-base text-center">
              Create your account to get started
            </Text>
          </View>

          <View className="flex-1 px-6">
            {/* First Name */}
            <View className="mb-6">
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-5 py-5 bg-gray-50">
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-4"
                >
                  <Path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <TextInput
                  className="flex-1 text-gray-800 text-base"
                  placeholder="First Name"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {/* Display first name errors */}
              {validationErrors.firstName && validationErrors.firstName.length > 0 && (
                <View className="mt-1">
                  {validationErrors.firstName.map((error, index) => (
                    <Text key={index} className="text-red-500 text-sm">
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Last Name */}
            <View className="mb-6">
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-5 py-5 bg-gray-50">
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-4"
                >
                  <Path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <TextInput
                  className="flex-1 text-gray-800 text-base"
                  placeholder="Last Name"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {/* Display last name errors */}
              {validationErrors.lastName && validationErrors.lastName.length > 0 && (
                <View className="mt-1">
                  {validationErrors.lastName.map((error, index) => (
                    <Text key={index} className="text-red-500 text-sm">
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Email */}
            <View className="mb-6">
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-5 py-5 bg-gray-50">
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-4"
                >
                  <Path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M22 6L12 13L2 6"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <TextInput
                  className="flex-1 text-gray-800 text-base"
                  placeholder="Email (optional)"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {/* Display email errors */}
              {validationErrors.email && validationErrors.email.length > 0 && (
                <View className="mt-1">
                  {validationErrors.email.map((error, index) => (
                    <Text key={index} className="text-red-500 text-sm">
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Phone Number */}
            <View className="mb-6">
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-5 py-5 bg-gray-50">
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-4"
                >
                  <Path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <TextInput
                  className="flex-1 text-gray-800 text-base"
                  placeholder="Phone Number (optional)"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {/* Display phone errors */}
              {validationErrors.phone && validationErrors.phone.length > 0 && (
                <View className="mt-1">
                  {validationErrors.phone.map((error, index) => (
                    <Text key={index} className="text-red-500 text-sm">
                      {error}
                    </Text>
                  ))}
                </View>
              )}
              {/* Display contact requirement error */}
              {validationErrors.contact && validationErrors.contact.length > 0 && (
                <View className="mt-1">
                  {validationErrors.contact.map((error, index) => (
                    <Text key={index} className="text-red-500 text-sm">
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Terms and Conditions */}
            <View className="mb-6">
              <Pressable
                className="flex-row items-center"
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View className={`w-5 h-5 border-2 rounded mr-3 ${acceptTerms ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                  {acceptTerms && (
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M20 6L9 17l-5-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </View>
                <Text className="text-gray-600 text-sm flex-1">
                  I accept the{' '}
                  <Text className="text-primary font-semibold">Terms and Conditions</Text>
                  {' '}and{' '}
                  <Text className="text-primary font-semibold">Privacy Policy</Text>
                </Text>
              </Pressable>
              {/* Display terms errors */}
              {validationErrors.terms && validationErrors.terms.length > 0 && (
                <View className="mt-1">
                  {validationErrors.terms.map((error, index) => (
                    <Text key={index} className="text-red-500 text-sm">
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              className={`w-full py-5 rounded-2xl mb-8 ${isFormValid && !isLoading ? 'bg-primary' : 'bg-gray-400'}`}
              onPress={handleSignUp}
              disabled={!isFormValid || isLoading}
            >
              <View className="flex-row items-center justify-center">
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mr-2"
                >
                  <Path
                    d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M8.5 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M20 8v6M23 11h-6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text className="text-white text-center text-lg font-semibold">
                  {isLoading ? 'Creating Account...' : 'Continue with OTP'}
                </Text>
              </View>
            </Pressable>

            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-6 text-gray-400 text-sm font-medium">OR</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            <View className="flex-row justify-center gap-6 mb-8">
              <Pressable className="w-12 h-12 items-center justify-center rounded-2xl bg-white border border-gray-200">
                <Svg width={24} height={24} viewBox="0 0 533.5 544.3">
                  <Path
                    fill="#4285F4"
                    d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.2H272.1v95h146.9c-6.4 34.5-25.1 63.7-53.4 83.1v68h86.3c50.6-46.7 81.6-115.5 81.6-195.9z"
                  />
                  <Path
                    fill="#34A853"
                    d="M272.1 544.3c72.6 0 133.6-24 178.2-65.3l-86.3-68c-24 16.1-54.7 25.4-91.9 25.4-70.6 0-130.5-47.7-151.9-111.7H29.2v70.2c44.7 89.6 137 149.4 242.9 149.4z"
                  />
                  <Path
                    fill="#FBBC04"
                    d="M120.2 324.7c-10.3-30.3-10.3-62.9 0-93.2V161.3H29.2c-31.2 62.3-31.2 135.7 0 198z"
                  />
                  <Path
                    fill="#EA4335"
                    d="M272.1 107.7c39.5 0 75 13.6 102.9 40.5l77.1-77.1C405.7 25 344.7 0 272.1 0 166.2 0 73.9 59.7 29.2 149.4l91 70.2c21.4-64 81.3-111.9 151.9-111.9z"
                  />
                </Svg>
              </Pressable>

              <Pressable className="w-12 h-12 items-center justify-center rounded-2xl bg-white border border-gray-200">
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="#1877F2">
                  <Path d="M22.675 0h-21.35C.597 0 0 .6 0 1.33v21.34C0 23.4.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.099 2.795.144v3.24h-1.918c-1.506 0-1.797.716-1.797 1.766v2.315h3.59l-.467 3.622h-3.123V24h6.116C23.403 24 24 23.4 24 22.67V1.33C24 .6 23.403 0 22.675 0z" />
                </Svg>
              </Pressable>

              <Pressable className="w-12 h-12 items-center justify-center rounded-2xl bg-white border border-gray-200">
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="black">
                  <Path d="M16.365 1.43c0 1.14-.467 2.23-1.26 3.04-.78.82-2.06 1.45-3.15 1.34a3.26 3.26 0 0 1-.03-.4c0-1.12.51-2.28 1.29-3.07.78-.79 2.07-1.36 3.15-1.37.02.13.04.26.04.4zm2.91 16.14c-.25.57-.51 1.13-.84 1.64-.66 1.01-1.45 2.01-2.57 2.02-1 .01-1.3-.65-2.71-.64-1.4.01-1.74.65-2.74.64-1.12-.01-1.96-1.1-2.62-2.1-1.79-2.61-3.16-7.39-1.32-10.63.91-1.59 2.54-2.6 4.3-2.62 1.05-.02 2.05.7 2.71.7.66 0 1.88-.86 3.17-.73.54.02 2.07.22 3.06 1.67-.08.05-1.82 1.06-1.81 3.15 0 2.49 2.23 3.33 2.28 3.35-.03.09-.36 1.27-1.17 2.53z" />
                </Svg>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>

        <View className="items-center pb-8">
          <Pressable onPress={() => router.push("/(auth)/Login")}>
            <Text className="text-gray-600 text-base text-center">
              Already have an Account?{" "}
              <Text className="text-primary font-semibold">Log In</Text>
            </Text>
          </Pressable>
        </View>

        <StatusBar style="dark" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContinueSignUpScreen;
