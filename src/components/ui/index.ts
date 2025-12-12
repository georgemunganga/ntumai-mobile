// UI components barrel export file
// This file exports all UI-related components

import React from 'react';
import { UIComponentProps } from '../index';

// Button component types
export interface ButtonProps extends UIComponentProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  icon?: string;
}

// Input component types
export interface InputProps extends UIComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
}

// Card component types
export interface CardProps extends UIComponentProps {
  title?: string;
  subtitle?: string;
  image?: string;
  onPress?: () => void;
}

// Modal component types
export interface ModalProps extends UIComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  animationType?: 'slide' | 'fade' | 'none';
}

// Loading component types
export interface LoadingProps extends UIComponentProps {
  text?: string;
  overlay?: boolean;
}

// Alert component types
export interface AlertProps {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

// Placeholder components (to be implemented)
export const Button: React.FC<ButtonProps> = (props) => {
  // TODO: Implement Button component
  return null;
};

export const Input: React.FC<InputProps> = (props) => {
  // TODO: Implement Input component
  return null;
};

export const Card: React.FC<CardProps> = (props) => {
  // TODO: Implement Card component
  return null;
};

export const Modal: React.FC<ModalProps> = (props) => {
  // TODO: Implement Modal component
  return null;
};

export const Loading: React.FC<LoadingProps> = (props) => {
  // TODO: Implement Loading component
  return null;
};

export const Avatar: React.FC<UIComponentProps & { source?: string; name?: string; size?: number }> = (props) => {
  // TODO: Implement Avatar component
  return null;
};

export const Badge: React.FC<UIComponentProps & { count?: number; color?: string }> = (props) => {
  // TODO: Implement Badge component
  return null;
};

export const Divider: React.FC<UIComponentProps> = (props) => {
  // TODO: Implement Divider component
  return null;
};

export const Header: React.FC<UIComponentProps & { title: string; leftAction?: () => void; rightAction?: () => void }> = (props) => {
  // TODO: Implement Header component
  return null;
};

export const TabBar: React.FC<UIComponentProps & { tabs: TabItem[]; activeTab: string; onTabPress: (tab: string) => void }> = (props) => {
  // TODO: Implement TabBar component
  return null;
};

// UI types
export interface TabItem {
  id: string;
  title: string;
  icon?: string;
  badge?: number;
}

// UI utilities
export const uiUtils = {
  getColorByType: (type: AlertProps['type']) => {
    const colors = {
      info: '#007AFF',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
    };
    return colors[type || 'info'];
  },
  
  formatBadgeCount: (count: number): string => {
    if (count > 99) return '99+';
    return count.toString();
  },
  
  generateTestID: (component: string, props: any): string => {
    const { testID, title, placeholder } = props;
    return testID || title || placeholder || component;
  },
};

// UI constants
export const UI_CONSTANTS = {
  BORDER_RADIUS: {
    small: 4,
    medium: 8,
    large: 12,
    round: 50,
  },
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  COLORS: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    text: '#000000',
    textSecondary: '#8E8E93',
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    border: '#C6C6C8',
  },
  FONT_SIZES: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
} as const;

// Alert utility function
export const showAlert = (props: AlertProps): void => {
  // TODO: Implement platform-specific alert
  console.log('Alert:', props);
};