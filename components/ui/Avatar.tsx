import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
}: AvatarProps) {
  const getAvatarStyles = () => {
    let baseStyles = 'rounded-full bg-gray-300 items-center justify-center';
    
    switch (size) {
      case 'sm':
        baseStyles += ' w-8 h-8';
        break;
      case 'lg':
        baseStyles += ' w-16 h-16';
        break;
      case 'xl':
        baseStyles += ' w-20 h-20';
        break;
      default:
        baseStyles += ' w-12 h-12';
    }
    
    return baseStyles;
  };
  
  const getTextStyles = () => {
    let textStyles = 'font-medium text-gray-600';
    
    switch (size) {
      case 'sm':
        textStyles += ' text-xs';
        break;
      case 'lg':
        textStyles += ' text-lg';
        break;
      case 'xl':
        textStyles += ' text-xl';
        break;
      default:
        textStyles += ' text-sm';
    }
    
    return textStyles;
  };
  
  if (src) {
    return (
      <Image
        source={{ uri: src }}
        className={getAvatarStyles()}
        alt={alt}
      />
    );
  }
  
  return (
    <View className={getAvatarStyles()}>
      <Text className={getTextStyles()}>
        {fallback || '?'}
      </Text>
    </View>
  );
}
