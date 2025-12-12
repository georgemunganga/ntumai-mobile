import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  const getBadgeStyles = () => {
    let baseStyles = 'rounded-full items-center justify-center';
    
    switch (size) {
      case 'sm':
        baseStyles += ' px-2 py-1';
        break;
      case 'lg':
        baseStyles += ' px-4 py-2';
        break;
      default:
        baseStyles += ' px-3 py-1';
    }
    
    switch (variant) {
      case 'success':
        baseStyles += ' bg-green-100';
        break;
      case 'warning':
        baseStyles += ' bg-yellow-100';
        break;
      case 'error':
        baseStyles += ' bg-red-100';
        break;
      case 'info':
        baseStyles += ' bg-blue-100';
        break;
      default:
        baseStyles += ' bg-gray-100';
    }
    
    return baseStyles;
  };
  
  const getTextStyles = () => {
    let textStyles = 'font-medium';
    
    switch (size) {
      case 'sm':
        textStyles += ' text-xs';
        break;
      case 'lg':
        textStyles += ' text-base';
        break;
      default:
        textStyles += ' text-sm';
    }
    
    switch (variant) {
      case 'success':
        textStyles += ' text-green-800';
        break;
      case 'warning':
        textStyles += ' text-yellow-800';
        break;
      case 'error':
        textStyles += ' text-red-800';
        break;
      case 'info':
        textStyles += ' text-blue-800';
        break;
      default:
        textStyles += ' text-gray-800';
    }
    
    return textStyles;
  };
  
  return (
    <View className={getBadgeStyles()}>
      <Text className={getTextStyles()}>{children}</Text>
    </View>
  );
}
