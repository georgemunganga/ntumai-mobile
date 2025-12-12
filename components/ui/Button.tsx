import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const getButtonStyles = () => {
    let baseStyles = 'rounded-lg flex-row items-center justify-center';
    
    // Size styles
    switch (size) {
      case 'sm':
        baseStyles += ' px-3 py-2';
        break;
      case 'lg':
        baseStyles += ' px-6 py-4';
        break;
      default:
        baseStyles += ' px-4 py-3';
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyles += ' bg-gray-200';
        break;
      case 'outline':
        baseStyles += ' border border-blue-500 bg-transparent';
        break;
      case 'ghost':
        baseStyles += ' bg-transparent';
        break;
      default:
        baseStyles += ' bg-blue-500';
    }
    
    if (disabled) {
      baseStyles += ' opacity-50';
    }
    
    return baseStyles;
  };
  
  const getTextStyles = () => {
    let textStyles = 'font-medium';
    
    switch (size) {
      case 'sm':
        textStyles += ' text-sm';
        break;
      case 'lg':
        textStyles += ' text-lg';
        break;
      default:
        textStyles += ' text-base';
    }
    
    switch (variant) {
      case 'secondary':
        textStyles += ' text-gray-700';
        break;
      case 'outline':
        textStyles += ' text-blue-500';
        break;
      case 'ghost':
        textStyles += ' text-blue-500';
        break;
      default:
        textStyles += ' text-white';
    }
    
    return textStyles;
  };
  
  return (
    <TouchableOpacity
      className={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && <ActivityIndicator size="small" color="white" className="mr-2" />}
      <Text className={getTextStyles()}>{title}</Text>
    </TouchableOpacity>
  );
}
