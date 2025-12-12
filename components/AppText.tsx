import { Text as RNText } from 'react-native';
import React from 'react';

interface AppTextProps {
  style?: object;
  children: React.ReactNode;
  className?: string;
  numberOfLines?: number;
}

const AppText = ({ style, className, ...props }: AppTextProps) => {
  return (
    <RNText
      style={[{ fontFamily: 'Ubuntu-Regular' }, style]}
      {...props}
      className={className}
    />
  );
};

export default AppText;
