import AppText from '@/components/AppText';
import React from 'react';




import { View, ScrollView } from 'react-native';




import { useRouter } from 'expo-router';




import { Feather } from '@expo/vector-icons';
import { Button } from '@/src/components/ui';









export default function OrdersTab() {




  const router = useRouter();









  return (




    <ScrollView className="flex-1 bg-gray-50">




      <View className="bg-white px-6 py-6 border-b border-gray-200">




        <AppText className="text-2xl font-bold text-gray-900">My Orders</AppText>




        <AppText className="text-gray-600 mt-1">Track your orders and history</AppText>




      </View>









      <View className="px-6 py-6">




        <View className="bg-white rounded-lg p-6 items-center">




          <Feather name="inbox" size={64} color="#D1D5DB" />




          <AppText className="text-xl font-bold text-gray-900 mt-4">No Orders Yet</AppText>




          <AppText className="text-gray-600 text-center mt-2 px-4">




            Your order history will appear here once you place your first order




          </AppText>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(customer)/(tabs)/marketplace')}
            className="mt-6 px-6"
            fullWidth={false}
          />




        </View>




      </View>




    </ScrollView>




  );




}




