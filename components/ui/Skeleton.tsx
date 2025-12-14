import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export default function Skeleton({
  width = '100%' as DimensionValue,
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
