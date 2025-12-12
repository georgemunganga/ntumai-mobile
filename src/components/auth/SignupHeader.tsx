import React, { ReactNode } from "react";
import { View } from "react-native";
import AppText from "../../../components/AppText";

interface SignupHeaderProps {
  title: string;
  subtitle: string;
  description: ReactNode;
}

const SignupHeader: React.FC<SignupHeaderProps> = ({
  title,
  subtitle,
  description,
}) => {
  return (
    <View className="px-6 pt-20 pb-6">
      <AppText
        className="text-primary text-5xl font-ubuntu-bold mb-1 leading-tight"
        style={{ fontFamily: "Ubuntu-Bold" }}
      >
        {title}
      </AppText>
      <AppText
        className="text-primary text-2xl font-ubuntu-medium"
        style={{ fontFamily: "Ubuntu-Medium" }}
      >
        {subtitle}
      </AppText>
      <AppText
        className="text-gray-700 text-base mt-4 leading-relaxed"
        style={{ fontFamily: "Ubuntu-Regular" }}
      >
        {description}
      </AppText>
    </View>
  );
};

export default SignupHeader;
