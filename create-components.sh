#!/bin/bash

# Create components directory
mkdir -p components/ui

# Button Component
cat > components/ui/Button.tsx << 'EOF'
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const getButtonStyles = () => {
    let baseStyles = 'rounded-lg flex-row items-center justify-center';
    
    // Size styles
    switch (size) {
      case 'sm':
        baseStyles += ' px-3 py-2';
        break;
      case 'lg':
        baseStyles += ' px-6 py-4';
        break;
      default:
        baseStyles += ' px-4 py-3';
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyles += ' bg-gray-200';
        break;
      case 'outline':
        baseStyles += ' border border-blue-500 bg-transparent';
        break;
      case 'ghost':
        baseStyles += ' bg-transparent';
        break;
      default:
        baseStyles += ' bg-blue-500';
    }
    
    if (disabled) {
      baseStyles += ' opacity-50';
    }
    
    return baseStyles;
  };
  
  const getTextStyles = () => {
    let textStyles = 'font-medium';
    
    switch (size) {
      case 'sm':
        textStyles += ' text-sm';
        break;
      case 'lg':
        textStyles += ' text-lg';
        break;
      default:
        textStyles += ' text-base';
    }
    
    switch (variant) {
      case 'secondary':
        textStyles += ' text-gray-700';
        break;
      case 'outline':
        textStyles += ' text-blue-500';
        break;
      case 'ghost':
        textStyles += ' text-blue-500';
        break;
      default:
        textStyles += ' text-white';
    }
    
    return textStyles;
  };
  
  return (
    <TouchableOpacity
      className={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && <ActivityIndicator size="small" color="white" className="mr-2" />}
      <Text className={getTextStyles()}>{title}</Text>
    </TouchableOpacity>
  );
}
EOF

# Input Component
cat > components/ui/Input.tsx << 'EOF'
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  keyboardType = 'default',
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 font-medium mb-2">{label}</Text>}
      <View className="relative">
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base ${
            error
              ? 'border-red-500'
              : isFocused
              ? 'border-blue-500'
              : 'border-gray-300'
          } ${!editable && 'bg-gray-100'} ${multiline && 'h-24'}`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {secureTextEntry && (
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text className="text-gray-500">{showPassword ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
EOF

# Card Component
cat > components/ui/Card.tsx << 'EOF'
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
EOF

# Badge Component
cat > components/ui/Badge.tsx << 'EOF'
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
EOF

# Alert Component
cat > components/ui/Alert.tsx << 'EOF'
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
EOF

# Avatar Component
cat > components/ui/Avatar.tsx << 'EOF'
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
EOF

# Switch Component
cat > components/ui/Switch.tsx << 'EOF'
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
EOF

# Progress Component
cat > components/ui/Progress.tsx << 'EOF'
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
EOF

# Spinner Component
cat > components/ui/Spinner.tsx << 'EOF'
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
EOF

# Skeleton Component
cat > components/ui/Skeleton.tsx << 'EOF'
import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = 20,
  variant = 'text',
  className = '',
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    
    animation.start();
    
    return () => animation.stop();
  }, []);
  
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  const getSkeletonStyles = () => {
    let baseStyles = 'bg-gray-300';
    
    switch (variant) {
      case 'circular':
        baseStyles += ' rounded-full';
        break;
      case 'rectangular':
        baseStyles += ' rounded';
        break;
      default:
        baseStyles += ' rounded';
    }
    
    return `${baseStyles} ${className}`;
  };
  
  return (
    <Animated.View
      className={getSkeletonStyles()}
      style={{
        width,
        height,
        opacity,
      }}
    />
  );
}
EOF

# Divider Component
cat > components/ui/Divider.tsx << 'EOF'
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
EOF

# Checkbox Component
cat > components/ui/Checkbox.tsx << 'EOF'
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
EOF

# RadioButton Component
cat > components/ui/RadioButton.tsx << 'EOF'
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
EOF

# Create index file
cat > components/ui/index.tsx << 'EOF'
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as Alert } from './Alert';
export { default as Avatar } from './Avatar';
export { default as Switch } from './Switch';
export { default as Progress } from './Progress';
export { default as Spinner } from './Spinner';
export { default as Skeleton } from './Skeleton';
export { default as Divider } from './Divider';
export { default as Checkbox } from './Checkbox';
export { default as RadioButton } from './RadioButton';
EOF

# Create example usage file
cat > components/ui/Example.tsx << 'EOF'
import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import {
  Button,
  Input,
  Card,
  Badge,
  Alert,
  Avatar,
  Switch,
  Progress,
  Spinner,
  Skeleton,
  Divider,
  Checkbox,
  RadioButton,
} from './index';

export default function Example() {
  const [inputValue, setInputValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-6">UI Components Example</Text>
      
      {/* Buttons */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Buttons</Text>
        <View className="space-y-2">
          <Button title="Primary Button" onPress={() => {}} />
          <Button title="Secondary" variant="secondary" onPress={() => {}} />
          <Button title="Outline" variant="outline" onPress={() => {}} />
          <Button title="Loading" loading onPress={() => {}} />
        </View>
      </Card>

      {/* Input */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Input</Text>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="email-address"
        />
      </Card>

      {/* Badges */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Badges</Text>
        <View className="flex-row space-x-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </View>
      </Card>

      {/* Alert */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Alerts</Text>
        <View className="space-y-3">
          <Alert title="Info" description="This is an info alert" variant="info" />
          <Alert description="This is a success message" variant="success" />
        </View>
      </Card>

      {/* Avatar */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Avatars</Text>
        <View className="flex-row space-x-3">
          <Avatar fallback="JD" size="sm" />
          <Avatar fallback="AB" size="md" />
          <Avatar fallback="XY" size="lg" />
        </View>
      </Card>

      {/* Switch */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Switch</Text>
        <Switch
          value={switchValue}
          onValueChange={setSwitchValue}
          label="Enable notifications"
        />
      </Card>

      {/* Progress */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Progress</Text>
        <View className="space-y-3">
          <Progress value={25} />
          <Progress value={60} variant="success" />
          <Progress value={80} variant="warning" />
        </View>
      </Card>

      {/* Spinner */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Spinner</Text>
        <View className="flex-row space-x-4">
          <Spinner size="small" />
          <Spinner size="large" variant="primary" />
        </View>
      </Card>

      {/* Skeleton */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Skeleton</Text>
        <View className="space-y-2">
          <Skeleton height={16} />
          <Skeleton height={16} width="80%" />
          <Skeleton height={40} variant="rectangular" />
        </View>
      </Card>

      {/* Divider */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Divider</Text>
        <Divider />
        <Text className="text-center py-2">Content above and below</Text>
        <Divider>OR</Divider>
        <Text className="text-center py-2">Divider with text</Text>
      </Card>

      {/* Checkbox */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Checkbox</Text>
        <Checkbox
          checked={checkboxValue}
          onCheckedChange={setCheckboxValue}
          label="I agree to the terms"
        />
      </Card>

      {/* Radio Button */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold mb-3">Radio Button</Text>
        <View className="space-y-2">
          <RadioButton
            selected={radioValue === 'option1'}
            onSelect={() => setRadioValue('option1')}
            label="Option 1"
          />
          <RadioButton
            selected={radioValue === 'option2'}
            onSelect={() => setRadioValue('option2')}
            label="Option 2"
          />
        </View>
      </Card>
    </ScrollView>
  );
}
EOF