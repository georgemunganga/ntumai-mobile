import React from "react";
import { Pressable } from "react-native";
import AppText from "../../../components/AppText";

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <Pressable
      className={`w-full py-5 rounded-2xl mb-2 ${props.className}`}
      onPress={props.onPress}
    >
      <AppText
        className={` text-center text-lg font-semibold ${props.className}`}
      >
        {props.title}
      </AppText>
    </Pressable>
  );
};

export default Button;
