import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import AppText from "@/components/AppText";

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
});
interface AuthMethodTabsProps {
  selectedMethod: "phone" | "email";
  onMethodChange: (method: "phone" | "email") => void;
}

const AuthMethodTabs: React.FC<AuthMethodTabsProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <View
      className='flex-row w-full mb-8 rounded-full bg-[#ededed] p-2'
      style={styles.container}
    >
      <Pressable
        className={`flex-1 py-4 rounded-full items-center ${
          selectedMethod === 'phone' ? 'bg-white' : ''
        }`}
        onPress={() => onMethodChange('phone')}
      >
        <AppText variant="body" weight="bold" className='text-[#3B3A3A]'>
          Phone Number
        </AppText>
      </Pressable>
      <Pressable
        className={`flex-1 py-4 rounded-full items-center  ${
          selectedMethod === 'email' ? 'bg-white' : ''
        }`}
        onPress={() => onMethodChange('email')}
      >
        <AppText variant="body" weight="bold" className='text-[#3B3A3A]'>
          Email
        </AppText>
      </Pressable>
    </View>
  );
};

export default AuthMethodTabs;
