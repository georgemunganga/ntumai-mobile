import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RadioButton({
  selected,
  onSelect,
  label,
  disabled = false,
  size = 'md',
}: RadioButtonProps) {
  const getRadioStyles = () => {
    let baseStyles = 'border-2 rounded-full items-center justify-center';
    
    switch (size) {
      case 'sm':
        baseStyles += ' w-4 h-4';
        break;
      case 'lg':
        baseStyles += ' w-6 h-6';
        break;
      default:
        baseStyles += ' w-5 h-5';
    }
    
    if (selected) {
      baseStyles += ' border-blue-500';
    } else {
      baseStyles += ' border-gray-300';
    }
    
    if (disabled) {
      baseStyles += ' opacity-50';
    }
    
    return baseStyles;
  };
  
  const getDotStyles = () => {
    let dotStyles = 'bg-blue-500 rounded-full';
    
    switch (size) {
      case 'sm':
        dotStyles += ' w-2 h-2';
        break;
      case 'lg':
        dotStyles += ' w-3 h-3';
        break;
      default:
        dotStyles += ' w-2.5 h-2.5';
    }
    
    return dotStyles;
  };
  
  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => !disabled && onSelect()}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View className={getRadioStyles()}>
        {selected && <View className={getDotStyles()} />}
      </View>
      {label && (
        <Text className="ml-2 text-gray-700 font-medium">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
