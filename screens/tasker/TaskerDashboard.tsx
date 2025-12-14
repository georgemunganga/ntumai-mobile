// @ts-nocheck
import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DollarSign } from 'lucide-react-native';
import AppText from '@/components/AppText';
import { useRouter } from 'expo-router';

const DriverDashboard: React.FC = () => {
  const router = useRouter();
  // Dummy data for Next Orders
  const nextOrders = [
    {
      id: 1,
      time: '06 : 38 : 21',
      orderId: 'ZA1893',
      location: 'Mulungushi, Lusaka Zambia.',
      scheduledTime: '06:00 PM',
    },
    {
      id: 2,
      time: '07 : 15 : 42',
      orderId: 'ZA1894',
      location: 'Kabulonga, Lusaka Zambia.',
      scheduledTime: '07:30 PM',
    },
    {
      id: 3,
      time: '08 : 22 : 15',
      orderId: 'ZA1895',
      location: 'Woodlands, Lusaka Zambia.',
      scheduledTime: '08:45 PM',
    },
    {
      id: 4,
      time: '08 : 22 : 15',
      orderId: 'ZA1895',
      location: 'Woodlands, Lusaka Zambia.',
      scheduledTime: '08:45 PM',
    },
    {
      id: 5,
      time: '08 : 22 : 15',
      orderId: 'ZA1895',
      location: 'Woodlands, Lusaka Zambia.',
      scheduledTime: '08:45 PM',
    },
  ];

  // Dummy data for Income Cards
  const incomeCards = [
    {
      id: 1,
      income: '$ 578',
      status: 'Online',
      duration: '2hr 30min',
      iconSize: 'text-6xl',
    },
    {
      id: 2,
      income: '$ 578',
      status: 'Online',
      duration: '2hr 30min',
      iconSize: 'text-7xl',
    },
    {
      id: 3,
      income: '$ 578',
      status: 'Online',
      duration: '2hr 30min',
      iconSize: 'text-7xl',
    },
  ];

  return (
    <View className='flex-1'>
      <StatusBar barStyle='dark-content' backgroundColor='white' />

      <View className='flex-row items-center justify-between px-6 py-3 bg-white '>
        <View className='flex-row items-center'>
          <Image
            source={require('@/assets/person.png')}
            className='w-10 h-10 rounded-full mr-3 border-2 border-teal-400'
          />
          <View>
            <AppText
              className='text-sm font-semibold text-gray-900'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            >
              Today's IncomeK578
            </AppText>
          </View>
        </View>
        <View className='flex-row items-center'>
          <TouchableOpacity className='mr-3'>
            <Ionicons name='help-circle-outline' size={24} color='#14b8a6' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='notifications-outline' size={24} color='#14b8a6' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className='flex-1 bg-white pb-32'>
        <View className='mt-4'>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            className='mb-4'
          >
            {incomeCards.map((card) => (
              <View
                key={card.id}
                className='bg-[#eee] rounded-2xl p-4 mr-4 w-80'
              >
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center flex-1'>
                    <View className='p-3  mr-3'>
                      <DollarSign
                        className={`${card.iconSize} font-bold`}
                        color={'#14b8a6'}
                      />
                    </View>
                    <View>
                      <AppText
                        className='text-gray-900 text-sm'
                        style={{ fontFamily: 'Ubuntu-Regular' }}
                      >
                        Today's Income
                      </AppText>
                      <AppText className='text-teal-500 text-lg font-semibold'>
                        {card.income}
                      </AppText>
                    </View>
                  </View>
                  <View className='items-end'>
                    <AppText
                      className='text-gray-900 text-sm'
                      style={{ fontFamily: 'Ubuntu-Regular' }}
                    >
                      Online
                    </AppText>
                    <AppText className='text-teal-500 text-sm font-semibold'>
                      {card.duration}
                    </AppText>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className='flex-row justify-center items-center'>
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-500 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
          </View>
        </View>

        <View className='mx-4 bg-white rounded-2xl p-4 pb-0'>
          <AppText className='text-lg font-semibold text-[#9d9c9c] mb-3'>
            What's new on Ntumai
          </AppText>

          <Image
            source={require('@/assets/get-ready.png')}
            className='w-full rounded-3xl'
            style={{ width: '100%', height: 150 }}
          />
          <View className='flex-row justify-center items-center mt-4'>
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-500 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
            <View className='w-2 h-2 bg-teal-300 rounded-full mx-1' />
          </View>
        </View>

        <View className='mx-4  bg-white rounded-2xl p-4'>
          <AppText className='text-lg font-semibold text-gray-600 mb-4'>
            Next Orders:
          </AppText>

          <ScrollView showsVerticalScrollIndicator={false} className='max-h-80'>
            {nextOrders.map((order, index) => (
              <View
                key={order.id}
                className={`flex-row items-center justify-between py-4 ${
                  index < nextOrders.length - 1
                    ? 'border-b border-gray-200'
                    : ''
                }`}
              >
                <View className='flex-1'>
                  <AppText className='text-xl font-bold text-gray-900 mb-2'>
                    {order.time}
                  </AppText>
                  <AppText className='text-pink-500 text-sm font-medium'>
                    Cancel Order
                  </AppText>
                </View>
                <View className='items-end'>
                  <AppText
                    className='text-gray-900 text-sm font-medium mb-1'
                    style={{ fontFamily: 'Ubuntu-Medium' }}
                  >
                    {order.orderId}, {order.location}
                  </AppText>
                  <AppText className='text-teal-500 text-sm font-semibold'>
                    {order.scheduledTime}
                  </AppText>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4'>
        <TouchableOpacity
          className='bg-primary py-4 rounded-xl mb-3'
          onPress={() => router.push('/(tasker)/DriverOrders')}
        >
          <AppText className='text-white text-center font-semibold text-lg'>
            Delivery Orders
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-white border border-primary py-4 rounded-xl'
          onPress={() => router.push('/(tasker)/DriverRoutes')}
        >
          <AppText className='text-primary text-center font-semibold text-lg'>
            Routes
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DriverDashboard;

