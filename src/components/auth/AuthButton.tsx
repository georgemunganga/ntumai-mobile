import React from "react";
import { Pressable, Text } from "react-native";
import AppText from "../../../components/AppText";
import { SquarePen } from "lucide-react-native";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  className = "",
  disabled = false,
}) => {
  return (
    <Pressable
      className={`flex-row  justify-center gap-2 w-full py-5 rounded-2xl ${disabled ? 'bg-gray-400' : 'bg-primary'} font-ubuntu elevation-1 ${className}`}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      {title === 'Login' && <SquarePen color="#ffffff" />}
      <AppText className='text-white text-center text-lg font-bold'>
        {title}
      </AppText>
    </Pressable>
  );
};

export default AuthButton;
