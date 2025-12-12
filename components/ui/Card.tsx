import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const getCardStyles = () => {
    let baseStyles = 'bg-white rounded-lg';
    
    switch (variant) {
      case 'elevated':
        baseStyles += ' shadow-lg elevation-4';
        break;
      case 'outlined':
        baseStyles += ' border border-gray-200';
        break;
      default:
        baseStyles += ' shadow-sm elevation-2';
    }
    
    switch (padding) {
      case 'none':
        break;
      case 'sm':
        baseStyles += ' p-3';
        break;
      case 'lg':
        baseStyles += ' p-6';
        break;
      default:
        baseStyles += ' p-4';
    }
    
    return `${baseStyles} ${className}`;
  };
  
  return (
    <View className={getCardStyles()} {...props}>
      {children}
    </View>
  );
}
