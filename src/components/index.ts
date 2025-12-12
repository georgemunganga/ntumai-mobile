// Components barrel export file
// This file exports all components from the components directory

// Auth components
export * from './auth';

// UI components
export * from './ui';

// Component types
export interface ComponentProps {
  children?: React.ReactNode;
  style?: any;
  testID?: string;
}

export interface AuthComponentProps extends ComponentProps {
  onAuthSuccess?: () => void;
  onAuthError?: (error: Error) => void;
}

export interface UIComponentProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// Common component utilities
export const componentUtils = {
  getTestID: (component: string, suffix?: string) => {
    return suffix ? `${component}-${suffix}` : component;
  },
  
  mergeStyles: (...styles: any[]) => {
    return styles.filter(Boolean).reduce((acc, style) => ({ ...acc, ...style }), {});
  },
  
  getVariantStyle: (variant: UIComponentProps['variant']) => {
    const variants = {
      primary: { backgroundColor: '#007AFF', color: '#FFFFFF' },
      secondary: { backgroundColor: '#5856D6', color: '#FFFFFF' },
      outline: { borderWidth: 1, borderColor: '#007AFF', backgroundColor: 'transparent' },
      ghost: { backgroundColor: 'transparent' },
    };
    return variants[variant || 'primary'];
  },
  
  getSizeStyle: (size: UIComponentProps['size']) => {
    const sizes = {
      small: { padding: 8, fontSize: 14 },
      medium: { padding: 12, fontSize: 16 },
      large: { padding: 16, fontSize: 18 },
    };
    return sizes[size || 'medium'];
  },
};

// Component constants
export const COMPONENT_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  DEFAULT_TIMEOUT: 5000,
  MAX_RETRY_ATTEMPTS: 3,
} as const;

// Component hooks
export const useComponentState = <T>(initialState: T) => {
  const [state, setState] = React.useState<T>(initialState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  const updateState = React.useCallback((newState: Partial<T>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);
  
  const resetState = React.useCallback(() => {
    setState(initialState);
    setError(null);
    setLoading(false);
  }, [initialState]);
  
  return {
    state,
    setState,
    updateState,
    resetState,
    loading,
    setLoading,
    error,
    setError,
  };
};

// Re-export React for convenience
import React from 'react';
export { React };