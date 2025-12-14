import React from 'react';
import { Pressable, TextInput, View, Text, GestureResponderEvent } from 'react-native';
import AppText from '@/components/AppText';
import CountryCodePicker from './CountryCodePicker';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const baseRadius = 'rounded-2xl';

const buttonBgClasses: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  ghost: 'bg-transparent border border-primary',
};

const buttonTextClasses: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-black',
  destructive: 'text-white',
  ghost: 'text-primary',
};

const buttonSizeClasses: Record<Size, string> = {
  sm: 'py-3 px-4 text-sm',
  md: 'py-4 px-5 text-base',
  lg: 'py-5 px-6 text-lg',
};

export interface ButtonProps {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  textClassName = '',
  fullWidth = true,
  leftIcon,
}) => {
  const variantClasses = buttonBgClasses[variant];
  const textColor = buttonTextClasses[variant];
  const sizeClasses = buttonSizeClasses[size];
  const disabledClasses = disabled ? 'opacity-60' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <Pressable
      className={`${widthClass} items-center justify-center ${baseRadius} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      onPress={onPress}
    >
      <View className={`flex-row items-center justify-center ${leftIcon ? 'gap-2' : ''}`}>
        {leftIcon}
        <AppText className={`font-semibold ${textColor} ${textClassName}`}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
};

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  errorText?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
  errorText,
  rightElement,
  leftElement,
  className = '',
}) => {
  const borderColor = errorText ? 'border-red-500' : 'border-gray-200';

  return (
    <View className='mb-4'>
      {label ? <AppText className='mb-2 text-gray-600'>{label}</AppText> : null}
      <View className={`flex-row items-center bg-gray-100 border ${borderColor} ${baseRadius} px-4 ${className}`}>
        {leftElement}
        <TextInput
          className='flex-1 py-3 text-base text-gray-900'
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          placeholderTextColor='#9CA3AF'
        />
        {rightElement}
      </View>
      {errorText ? <Text className='text-red-500 text-sm mt-1'>{errorText}</Text> : null}
    </View>
  );
};

export interface PhoneInputProps extends Omit<InputProps, 'keyboardType' | 'leftElement' | 'onChangeText' | 'value'> {
  phone: string;
  countryCode: string;
  onPhoneChange: (val: string) => void;
  onCountryChange?: (code: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  placeholder,
  phone,
  countryCode,
  onPhoneChange,
  onCountryChange = () => {},
  errorText,
  className = '',
}) => (
  <View className='mb-4'>
    {label ? <AppText className='mb-2 text-gray-600'>{label}</AppText> : null}
    <View className={`flex-row items-center bg-gray-100 border ${errorText ? 'border-red-500' : 'border-gray-200'} ${baseRadius} px-2 ${className}`}>
      <CountryCodePicker code={countryCode} onSelect={onCountryChange} />
      <TextInput
        className='flex-1 py-3 px-2 text-base text-gray-900'
        placeholder={placeholder}
        value={phone}
        onChangeText={onPhoneChange}
        keyboardType='phone-pad'
        autoCapitalize='none'
        placeholderTextColor='#9CA3AF'
      />
    </View>
    {errorText ? <Text className='text-red-500 text-sm mt-1'>{errorText}</Text> : null}
  </View>
);

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onPress }) => {
  const Container: any = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 ${className}`}
    >
      {children}
    </Container>
  );
};

// Barrel exports for shared components
export { default as CountryCodePicker } from './CountryCodePicker';
