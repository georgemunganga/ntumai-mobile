import { Text as RNText } from "react-native";
import React from "react";

interface TextProps {
  style?: object;
  className?: string;
  children: React.ReactNode;
}
const Text = ({ style, className, children, ...props }: TextProps) => {
  return (
    <RNText
      style={[{ fontFamily: "Ubuntu-Regular" }, style]}
      className={className}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;
