// VendorTabs.tsx - Main Vendor Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { VendorDashboard } from './VendorDashboard';
import  VendorProducts  from './VendorProducts';
import  VendorReports  from './VendorReports';
import { VendorNotifications } from './VendorNotifications';
import  VendorProfile  from './VendorProfile';

const Tab = createBottomTabNavigator();

export default function VendorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }
          
          return <Ionicons name={iconName as any} className='w-6 h-6' size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: '8%',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={VendorDashboard} />
      <Tab.Screen name="Products" component={VendorProducts} />
      <Tab.Screen name="Reports" component={VendorReports} />
      <Tab.Screen name="Notifications" component={VendorNotifications} />
      <Tab.Screen name="Profile" component={VendorProfile} />
    </Tab.Navigator>
  );
}