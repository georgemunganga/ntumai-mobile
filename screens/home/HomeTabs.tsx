// screens/home/HomeTabs.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import MarketplaceScreen from "./MarketplaceScreen";
import { Home, ShoppingBag, Package, User, File } from "lucide-react-native";
import { DriverProfile } from "../driver";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") return <Home size={size} color={color} />;
          if (route.name === "Marketplace")
            return <ShoppingBag size={size} color={color} />;
          if (route.name === "Products")
            return <Package size={size} color={color} />;
          if (route.name === "Reports")
            return <File size={size} color={color} />;
          if (route.name === "Profile")
            return <User size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ED4877",
        tabBarInactiveTintColor: "#000000",
        headerShown: false,
        tabBarStyle: {
          height: "10%",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Profile" component={DriverProfile} />
    </Tab.Navigator>
  );
}
