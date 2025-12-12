import React from 'react';
import { View, Text } from 'react-native';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
  children?: React.ReactNode;
  className?: string;
}

export default function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  children,
  className = '',
}: DividerProps) {
  if (children) {
    return (
      <View className={`flex-row items-center my-4 ${className}`}>
        <View className={`flex-1 h-px bg-gray-300 ${variant === 'dashed' ? 'border-dashed border-t' : ''}`} />
        <Text className="mx-4 text-gray-500 text-sm">{children}</Text>
        <View className={`flex-1 h-px bg-gray-300 ${variant === 'dashed' ? 'border-dashed border-t' : ''}`} />
      </View>
    );
  }
  
  if (orientation === 'vertical') {
    return (
      <View
        className={`w-px bg-gray-300 ${variant === 'dashed' ? 'border-dashed border-l' : ''} ${className}`}
        style={{ height: '100%' }}
      />
    );
  }
  
  return (
    <View
      className={`h-px bg-gray-300 my-4 ${variant === 'dashed' ? 'border-dashed border-t' : ''} ${className}`}
    />
  );
}
