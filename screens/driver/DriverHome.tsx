// @ts-nocheck

import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DriverOrders from './DriverOrders';
import DriverRoutes from './DriverRoutes';
import DriverEarnings from './DriverEarnings';
import DriverDashboard from './DriverDashboard';
import DriverSetting from './DriverSetting';




const Tab = createBottomTabNavigator();

const DriverHome = () => {
  return (
    <SafeAreaView className='flex-1'>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Orders') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Routes') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Earnings') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopColor: '#f3f4f6',
            height: '8%',
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name='Dashboard' component={DriverDashboard} />
        <Tab.Screen name='Orders' component={DriverOrders} />
        <Tab.Screen name='Routes' component={DriverRoutes} />
        <Tab.Screen name='Earnings' component={DriverEarnings} />
        <Tab.Screen name='Settings' component={DriverSetting} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default DriverHome;


