import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Checkbox({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  size = 'md',
}: CheckboxProps) {
  const getCheckboxStyles = () => {
    let baseStyles = 'border-2 rounded items-center justify-center';
    
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
    
    if (checked) {
      baseStyles += ' bg-blue-500 border-blue-500';
    } else {
      baseStyles += ' bg-white border-gray-300';
    }
    
    if (disabled) {
      baseStyles += ' opacity-50';
    }
    
    return baseStyles;
  };
  
  const getCheckmarkStyles = () => {
    let checkStyles = 'text-white font-bold';
    
    switch (size) {
      case 'sm':
        checkStyles += ' text-xs';
        break;
      case 'lg':
        checkStyles += ' text-base';
        break;
      default:
        checkStyles += ' text-sm';
    }
    
    return checkStyles;
  };
  
  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View className={getCheckboxStyles()}>
        {checked && <Text className={getCheckmarkStyles()}>✓</Text>}
      </View>
      {label && (
        <Text className="ml-2 text-gray-700 font-medium">{label}</Text>
      )}
    </TouchableOpacity>
  );
}
