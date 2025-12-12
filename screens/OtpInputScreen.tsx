import { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthContext } from '../src/providers';

const OtpInputScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ method?: string; value?: string }>();
  const method = (params.method as 'phone' | 'email') ?? 'phone';
  const value = typeof params.value === 'string' ? params.value : '';
  const { 
    verifyOtp, 
    resendOtp,
    isLoading, 
    error,
    handleAuthSuccess 
  } = useAuthContext();
  
  // Local state for OTP input
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleResendOtp = async () => {
    try {
      await resendOtp();
      setCountdown(120);
      setIsResendDisabled(true);
      Alert.alert('Success', 'OTP has been resent successfully.');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      try {
        const result = await verifyOtp(otpValue);
        if (result.success) {
          handleAuthSuccess(result);
        } else {
          Alert.alert('Error', result.error || 'Invalid OTP. Please try again.');
        }
      } catch (err) {
        Alert.alert('Error', 'Verification failed. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
    }
  };

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle errors from auth provider
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length <= 1 && /^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 bg-white'>

        <View className='pt-20 pb-8 px-6'>
          <Text
            className='text-primary text-5xl font-bold mb-2 font-ubuntu'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Get Started!
          </Text>
          <Text
            className='text-primary text-2xl font-medium font-ubuntu'
            style={{ fontFamily: 'Ubuntu-Medium' }}
          >
            Verify to Continue
          </Text>
        </View>

        <KeyboardAvoidingView
          className='flex-1'
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            className='flex-1 px-6'
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <Text
              className='text-gray-700 text-base mb-8 leading-6'
              style={{ fontFamily: 'Ubuntu-Regular' }}
            >
              Enter the code we sent to{'\n'}
              <Text
                className='font-semibold text-black'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                {method === 'email' ? value : `${value}`}
              </Text>
              .
            </Text>

            <View className='flex justify-start mb-8'>
              <Text
                className='text-primary text-2xl font-medium'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
                {formatCountdown(countdown)}
              </Text>
            </View>

            <View className='flex-row justify-between mb-20'>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className='w-20 h-20 bg-white border border-primary shadow-xl shadow-primary rounded-2xl text-center text-primary text-2xl font-semibold box-shadow: 0px 4px 8px 0px #08AF9729;'
                  maxLength={1}
                  keyboardType='number-pad'
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <View className='items-center mb-12'>
              <Pressable onPress={handleResendOtp} disabled={isResendDisabled}>
                <View className='flex-row gap-2'>
                  <Text
                    className='text-base font-medium text-gray-400'
                    style={{ fontFamily: 'Ubuntu-Medium' }}
                  >
                    {isResendDisabled && `Didn't Receive OTP?`}
                  </Text>
                  <Text
                    className={`text-base font-medium text-primary
                  `}
                    style={{ fontFamily: 'Ubuntu-Medium' }}
                  >
                    Resend
                  </Text>
                </View>
              </Pressable>
            </View>

            <View className='flex-1 justify-end pb-12'>
              <Pressable
                className={`w-full py-5 rounded-2xl shadow-sm ${
                  otp.join('').length === 4 && !isLoading ? 'bg-primary' : 'bg-gray-300'
                }`}
                onPress={handleVerifyOtp}
                disabled={otp.join('').length < 4 || isLoading}
              >
                <Text
                  className='text-white text-center text-lg font-semibold'
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <StatusBar style='dark' />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OtpInputScreen;
