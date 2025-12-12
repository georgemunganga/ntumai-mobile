import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Switch({
  value,
  onValueChange,
  label,
  disabled = false,
  size = 'md',
}: SwitchProps) {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);
  
  const getSwitchStyles = () => {
    let baseStyles = 'rounded-full flex-row items-center';
    
    switch (size) {
      case 'sm':
        baseStyles += ' w-10 h-6';
        break;
      case 'lg':
        baseStyles += ' w-16 h-9';
        break;
      default:
        baseStyles += ' w-12 h-7';
    }
    
    if (value) {
      baseStyles += ' bg-blue-500';
    } else {
      baseStyles += ' bg-gray-300';
    }
    
    if (disabled) {
      baseStyles += ' opacity-50';
    }
    
    return baseStyles;
  };
  
  const getThumbStyles = () => {
    let thumbStyles = 'bg-white rounded-full shadow-sm';
    
    switch (size) {
      case 'sm':
        thumbStyles += ' w-4 h-4 m-1';
        break;
      case 'lg':
        thumbStyles += ' w-7 h-7 m-1';
        break;
      default:
        thumbStyles += ' w-5 h-5 m-1';
    }
    
    return thumbStyles;
  };
  
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size === 'sm' ? 16 : size === 'lg' ? 28 : 20],
  });
  
  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        className={getSwitchStyles()}
        onPress={() => !disabled && onValueChange(!value)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View
          className={getThumbStyles()}
          style={{ transform: [{ translateX }] }}
        />
      </TouchableOpacity>
      {label && (
        <Text className="ml-3 text-gray-700 font-medium">{label}</Text>
      )}
    </View>
  );
}
