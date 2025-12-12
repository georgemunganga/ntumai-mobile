import React from 'react';
import { View, Text } from 'react-native';

interface AlertProps {
  title?: string;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export default function Alert({
  title,
  description,
  variant = 'default',
}: AlertProps) {
  const getAlertStyles = () => {
    let baseStyles = 'p-4 rounded-lg border-l-4';
    
    switch (variant) {
      case 'success':
        baseStyles += ' bg-green-50 border-green-500';
        break;
      case 'warning':
        baseStyles += ' bg-yellow-50 border-yellow-500';
        break;
      case 'error':
        baseStyles += ' bg-red-50 border-red-500';
        break;
      case 'info':
        baseStyles += ' bg-blue-50 border-blue-500';
        break;
      default:
        baseStyles += ' bg-gray-50 border-gray-500';
    }
    
    return baseStyles;
  };
  
  const getTitleStyles = () => {
    let titleStyles = 'font-semibold mb-1';
    
    switch (variant) {
      case 'success':
        titleStyles += ' text-green-800';
        break;
      case 'warning':
        titleStyles += ' text-yellow-800';
        break;
      case 'error':
        titleStyles += ' text-red-800';
        break;
      case 'info':
        titleStyles += ' text-blue-800';
        break;
      default:
        titleStyles += ' text-gray-800';
    }
    
    return titleStyles;
  };
  
  const getDescriptionStyles = () => {
    let descStyles = 'text-sm';
    
    switch (variant) {
      case 'success':
        descStyles += ' text-green-700';
        break;
      case 'warning':
        descStyles += ' text-yellow-700';
        break;
      case 'error':
        descStyles += ' text-red-700';
        break;
      case 'info':
        descStyles += ' text-blue-700';
        break;
      default:
        descStyles += ' text-gray-700';
    }
    
    return descStyles;
  };
  
  return (
    <View className={getAlertStyles()}>
      {title && <Text className={getTitleStyles()}>{title}</Text>}
      <Text className={getDescriptionStyles()}>{description}</Text>
    </View>
  );
}
