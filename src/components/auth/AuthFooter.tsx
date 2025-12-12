import React from "react";
import { Pressable, Text, View } from "react-native";
import AppText from "../../../components/AppText";

interface AuthFooterProps {
  questionText: string;
  actionText: string;
  onPress: () => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({
  questionText,
  actionText,
  onPress,
}) => {
  return (
    <View className='px-6 pb-12 font-ubuntu'>
      <Pressable onPress={onPress}>
        <AppText
          className='text-base text-center leading-relaxed'
          style={{ color: '#787878' }}
        >
          {questionText}{' '}
          <Text className='text-primary font-ubuntu-bold'>{actionText}</Text>
        </AppText>
      </Pressable>
    </View>
  );
};

export default AuthFooter;
