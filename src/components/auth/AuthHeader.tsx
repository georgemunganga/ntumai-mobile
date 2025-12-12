import React from "react";
import { Text, View } from "react-native";
import AppText from "../../../components/AppText";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  description,
}) => {
  return (
    <View className='px-6 pt-8 pb-4 font-ubuntu'>
      <AppText
        className='text-primary text-5xl font-ubuntu-bold mb-1 leading-tight'
        style={{ fontFamily: 'Ubuntu-Bold' }}
      >
        {title}
      </AppText>
      <AppText
        className='text-primary text-5xl font-ubuntu-bold'
        style={{ fontFamily: 'Ubuntu-Medium' }}
      >
        {subtitle}
      </AppText>
      <AppText
        className='text-base mt-4 leading-relaxed pt-4 pb-4'
        style={{ color: '#606268' }}
      >
        {description}
      </AppText>
    </View>
  );
};

export default AuthHeader;
