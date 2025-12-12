import React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export default function Spinner({
  size = 'small',
  color,
  variant = 'default',
}: SpinnerProps) {
  const getColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'primary':
        return '#3B82F6';
      case 'secondary':
        return '#6B7280';
      default:
        return '#9CA3AF';
    }
  };
  
  return (
    <View className="items-center justify-center">
      <ActivityIndicator size={size} color={getColor()} />
    </View>
  );
}
