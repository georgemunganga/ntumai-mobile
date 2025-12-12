import React from 'react';
import { View } from 'react-native';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export default function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getContainerStyles = () => {
    let baseStyles = 'bg-gray-200 rounded-full overflow-hidden';
    
    switch (size) {
      case 'sm':
        baseStyles += ' h-1';
        break;
      case 'lg':
        baseStyles += ' h-4';
        break;
      default:
        baseStyles += ' h-2';
    }
    
    return baseStyles;
  };
  
  const getBarStyles = () => {
    let barStyles = 'h-full rounded-full';
    
    switch (variant) {
      case 'success':
        barStyles += ' bg-green-500';
        break;
      case 'warning':
        barStyles += ' bg-yellow-500';
        break;
      case 'error':
        barStyles += ' bg-red-500';
        break;
      default:
        barStyles += ' bg-blue-500';
    }
    
    return barStyles;
  };
  
  return (
    <View className={getContainerStyles()}>
      <View
        className={getBarStyles()}
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
}
