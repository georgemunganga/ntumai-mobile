import AppText from '@/components/AppText';
import { useState } from 'react';





import { View, TouchableOpacity, ScrollView, Image, Switch, Alert } from 'react-native';





import { useRouter } from 'expo-router';





import { useAuthStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











export default function ProfileScreen() {





  const router = useRouter();





  const { user, logout } = useAuthStore();





  const [notificationsEnabled, setNotificationsEnabled] = useState(true);





  const [locationEnabled, setLocationEnabled] = useState(true);











  const handleLogout = () => {





    Alert.alert('Logout', 'Are you sure you want to logout?', [





      { text: 'Cancel', onPress: () => {} },





      {





        text: 'Logout',





        onPress: () => {





          logout();





          router.replace('/(auth)/Splash');





        },





        style: 'destructive',





      },





    ]);





  };











  return (





    <View className="flex-1 bg-white">





      {/* Header */}





      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">





        <TouchableOpacity onPress={() => router.back()} className="mr-4">





          <Feather name="chevron-left" size={24} color="#1F2937" />





        </TouchableOpacity>





        <AppText className="text-2xl font-bold text-gray-900">Profile</AppText>





      </View>











      <ScrollView className="flex-1">





        {/* Profile Header */}





        <View className="px-6 py-8 items-center border-b border-gray-200">





          <Image





            source={{ uri: user?.avatar }}





            className="w-24 h-24 rounded-full mb-4"





          />





          <AppText className="text-2xl font-bold text-gray-900 mb-1">





            {user?.firstName} {user?.lastName}





          </AppText>





          <AppText className="text-gray-600 mb-4">{user?.email}</AppText>





          <View className="flex-row items-center gap-2 bg-green-100 px-4 py-2 rounded-full">





            <View className="w-2 h-2 bg-green-600 rounded-full" />





            <AppText className="text-green-700 font-semibold capitalize">{user?.role}</AppText>





          </View>





        </View>











        {/* Account Section */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Account</AppText>





          <View className="gap-3">





            <TouchableOpacity





              onPress={() => router.push('/(shared)/EditProfileScreen')}





              className="flex-row items-center justify-between py-4 border-b border-gray-100"





            >





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">





                  <Feather name="user" size={20} color="#2563EB" />





                </View>





                <AppText className="text-gray-900 font-semibold">Edit Profile</AppText>





              </View>





              <Feather name="chevron-right" size={20} color="#9CA3AF" />





            </TouchableOpacity>











            <TouchableOpacity





              onPress={() => router.push('/(shared)/AddressesScreen')}





              className="flex-row items-center justify-between py-4 border-b border-gray-100"





            >





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">





                  <Feather name="map-pin" size={20} color="#16A34A" />





                </View>





                <AppText className="text-gray-900 font-semibold">Addresses</AppText>





              </View>





              <Feather name="chevron-right" size={20} color="#9CA3AF" />





            </TouchableOpacity>











            <TouchableOpacity





              onPress={() => router.push('/(shared)/PaymentMethodsScreen')}





              className="flex-row items-center justify-between py-4"





            >





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">





                  <Feather name="credit-card" size={20} color="#7C3AED" />





                </View>





                <AppText className="text-gray-900 font-semibold">Payment Methods</AppText>





              </View>





              <Feather name="chevron-right" size={20} color="#9CA3AF" />





            </TouchableOpacity>





          </View>





        </View>











        {/* Preferences Section */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Preferences</AppText>





          <View className="gap-4">





            <View className="flex-row items-center justify-between">





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">





                  <Feather name="bell" size={20} color="#EA580C" />





                </View>





                <AppText className="text-gray-900 font-semibold">Notifications</AppText>





              </View>





              <Switch





                value={notificationsEnabled}





                onValueChange={setNotificationsEnabled}





                trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}





                thumbColor={notificationsEnabled ? '#16A34A' : '#9CA3AF'}





              />





            </View>











            <View className="flex-row items-center justify-between">





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">





                  <Feather name="navigation" size={20} color="#EF4444" />





                </View>





                <AppText className="text-gray-900 font-semibold">Location Services</AppText>





              </View>





              <Switch





                value={locationEnabled}





                onValueChange={setLocationEnabled}





                trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}





                thumbColor={locationEnabled ? '#16A34A' : '#9CA3AF'}





              />





            </View>





          </View>





        </View>











        {/* Support Section */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Support</AppText>





          <View className="gap-3">





            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">





                  <Feather name="help-circle" size={20} color="#2563EB" />





                </View>





                <AppText className="text-gray-900 font-semibold">Help & Support</AppText>





              </View>





              <Feather name="chevron-right" size={20} color="#9CA3AF" />





            </TouchableOpacity>











            <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">





                  <Feather name="file-text" size={20} color="#16A34A" />





                </View>





                <AppText className="text-gray-900 font-semibold">Terms & Privacy</AppText>





              </View>





              <Feather name="chevron-right" size={20} color="#9CA3AF" />





            </TouchableOpacity>











            <TouchableOpacity className="flex-row items-center justify-between py-4">





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">





                  <Feather name="info" size={20} color="#FCD34D" />





                </View>





                <AppText className="text-gray-900 font-semibold">About</AppText>





              </View>





              <Feather name="chevron-right" size={20} color="#9CA3AF" />





            </TouchableOpacity>





          </View>





        </View>











        {/* Logout Button */}





        <View className="px-6 py-6">





          <TouchableOpacity





            onPress={handleLogout}





            className="bg-red-600 rounded-lg py-4"





          >





            <View className="flex-row items-center justify-center">





              <Feather name="log-out" size={20} color="white" />





              <AppText className="text-white font-bold text-lg ml-2">Logout</AppText>





            </View>





          </TouchableOpacity>





        </View>





      </ScrollView>





    </View>





  );





}











