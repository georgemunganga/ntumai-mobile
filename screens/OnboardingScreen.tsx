import AppText from '@/components/AppText';
import { View, Image, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/src/components/ui/Button";
import DevResetAuthButton from "@/src/components/auth/DevResetAuthButton";

/**
 * Onboarding Screen - Promotional/Marketing Screen
 *
 * This is a PRESENTATION-ONLY screen for unauthenticated users.
 *
 * Responsibilities:
 * - Show app value proposition and branding
 * - Provide user action buttons (Get Started, Sign In)
 * - NO automatic routing based on auth state
 *
 * Routing:
 * - All routing handled by app/index.tsx (entry point)
 * - This screen only routes when user clicks a button
 */
const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <View className="flex-1 bg-white justify-center items-center p-6">
        <Image
          source={require("../assets/onboarding_image.png")}
          className="w-70 h-64 mb-6"
          resizeMode="contain"
        />
        <AppText className="text-primary text-4xl font-bold text-left mb-4">
          Quick Deliveries at your fingertips
        </AppText>
        <AppText className="text-gray-600 text-base text-left mb-6 font-ubuntu">
          Find your favorite Meals at the best prices with exclusive deals only
          on Ntumai app.
        </AppText>
      </View>

      <View className="relative h-1/4 bg-primary">
        <ImageBackground
          source={require("../assets/splash_style.png")}
          className="absolute top-0 left-0 w-full h-full"
          resizeMode="cover"
          style={{ opacity: 0.3 }}
        />

        <LinearGradient
          colors={["rgb(255, 255, 255)", "transparent"]}
          locations={[0, 1]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            zIndex: 1,
          }}
        />

        <View className="flex-1 gap-2 p-6 justify-end z-10">
          <Button
            title="Get Started"
            onPress={() => router.push("/(auth)/GuestDashboard")}
            className="text-primary bg-white font-ubuntu-bold"
          />
          <Button
            title="Sign In"
            onPress={() => router.push("/(auth)/Login")}
            className="text-white bg-black font-ubuntu-bold"
          />
          <DevResetAuthButton />
        </View>
      </View>

      <StatusBar style="dark" />
    </View>
  );
};

export default OnboardingScreen;
