import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthContext } from "../src/providers";
import type { LoginCredentials } from "../src/providers/types";

// Import reusable components
import SignupHeader from "../src/components/auth/SignupHeader";
import AuthMethodTabs from "../src/components/auth/AuthMethodTabs";
import AuthInput from "../src/components/auth/AuthInput";
import AuthButton from "../src/components/auth/AuthButton";
import SocialAuth from "../src/components/auth/SocialAuth";
import AuthFooter from "../src/components/auth/AuthFooter";

const SelectMethodScreen = () => {
  const router = useRouter();
  const {
    sendOtp,
    validateCredentials,
    isLoading,
    error,
    clearError,
    requiresVerification,
    verificationMethod,
    verificationValue,
    isAuthenticated,
  } = useAuthContext();
  const [selectedMethod, setSelectedMethod] = useState<"phone" | "email">(
    "phone"
  );
  const [inputValue, setInputValue] = useState("");
  const [countryCode, setCountryCode] = useState("+260");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleMethodChange = (method: "phone" | "email") => {
    setSelectedMethod(method);
    setInputValue("");
    setValidationErrors([]);
    clearError();
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Verification Error", error);
    }
  }, [error]);

  useEffect(() => {
    if (requiresVerification && verificationMethod && verificationValue) {
      router.push({
        pathname: "/(auth)/Otp",
        params: {
          method: verificationMethod,
          value: verificationValue,
        },
      });
    } else if (isAuthenticated) {
      router.replace("/Home");
    }
  }, [requiresVerification, verificationMethod, verificationValue, isAuthenticated, router]);

  const handleNext = async () => {
    const trimmedValue = inputValue.trim();
    setValidationErrors([]);
    clearError();

    if (!trimmedValue) {
      setValidationErrors([
        `Please enter your ${selectedMethod === "phone" ? "phone number" : "email address"}.`,
      ]);
      return;
    }

    const credentials: LoginCredentials =
      selectedMethod === "email"
        ? { email: trimmedValue }
        : { phone: trimmedValue, countryCode };

    const validation = validateCredentials(credentials);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      const result = await sendOtp(credentials, 'register');
      if (
        result.success &&
        result.requiresVerification &&
        result.verificationMethod &&
        result.verificationValue
      ) {
        router.push({
          pathname: "/(auth)/Otp",
          params: {
            method: result.verificationMethod,
            value: result.verificationValue,
          },
        });
      } else {
        Alert.alert(
          "Failed to Send OTP",
          result.error || "Unable to send verification code. Please try again."
        );
      }
    } catch (err: any) {
      Alert.alert(
        "Failed to Send OTP",
        err?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  const description = (
    <>
      We will send you a{" "}
      <Text className="font-semibold text-black">One Time Password (OTP)</Text>{" "}
      on this {selectedMethod === "phone" ? "mobile number" : "email address"}.
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SignupHeader
            title="Get Started!"
            subtitle="Verify to Sign up"
            description={description}
          />

          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <AuthMethodTabs
              selectedMethod={selectedMethod}
              onMethodChange={handleMethodChange}
            />

            <AuthInput
              method={selectedMethod}
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                setValidationErrors([]);
                clearError();
              }}
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              hasError={validationErrors.length > 0}
              isValid={validationErrors.length === 0 && inputValue.trim().length > 0}
            />

            {validationErrors.length > 0 && (
              <View className="mt-2">
                {validationErrors.map((errMsg) => (
                  <Text key={errMsg} className="text-red-500 text-sm">
                    {errMsg}
                  </Text>
                ))}
              </View>
            )}

            <View style={{ flex: 1 }} />
          </View>
        </KeyboardAvoidingView>

        <View className="px-6">
          <AuthButton
            title={isLoading ? "Sending..." : "Send OTP"}
            onPress={handleNext}
            className="mb-4"
            disabled={isLoading}
          />
          <SocialAuth />
        </View>

        <AuthFooter
          questionText="Already have an account?"
          actionText="Login to Continue"
          onPress={() => router.push("/(auth)/Login")}
        />

        <StatusBar style="dark" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SelectMethodScreen;
