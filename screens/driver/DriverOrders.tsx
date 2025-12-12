import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import { Image } from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const DriverOrders: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');

  const orders = [
    {
      id: 1,
      status: 'canceled',
      customer: 'John D.',
      amount: 23.6,
      distance: '4.2 mi',
      time: '15 min',
    },
    {
      id: 2,
      status: 'to be delivered',
      customer: 'Sarah M.',
      amount: 18.4,
      distance: '2.1 mi',
      time: '8 min',
    },
    {
      id: 3,
      status: 'delivered',
      customer: 'Mike R.',
      amount: 31.2,
      distance: '6.3 mi',
      time: '22 min',
    },
    {
      id: 4,
      status: 'delivered',
      customer: 'Lisa K.',
      amount: 15.8,
      distance: '1.8 mi',
      time: '12 min',
    },
  ];

  const filteredOrders = orders.filter((order) =>
    activeTab === 'upcoming'
      ? order.status === 'to be delivered'
      : order.status !== ''
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' backgroundColor='white' />


      <View className='flex-row items-center justify-between px-6 py-3 bg-white '>
        <View className='flex-row items-center'>
          <AppText className='text-4xl font-bold text-primary'>Orders</AppText>
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


      <View className='flex-row bg-white m-4 rounded-full p-2 shadow-xl'>
        <TouchableOpacity
          onPress={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 rounded-full ${
            activeTab === 'upcoming' ? 'bg-primary' : ''
          }`}
        >
          <AppText
            className={`text-center text-lg font-medium ${
              activeTab === 'upcoming' ? 'text-white' : 'text-primary'
            }`}
          >
            upcoming
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-full ${
            activeTab === 'history' ? 'bg-primary' : ''
          }`}
        >
          <AppText
            className={`text-center text-lg font-medium ${
              activeTab === 'history' ? 'text-white' : 'text-primary'
            }`}
          >
            history
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1'>
        {filteredOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => router.push('/(tasker)/OrderDeliveryFirstStep')}
            className='mx-4 mb-3 bg-white rounded-xl p-4 border border-gray-100 shadow-xl'
          >
            <View className='flex-row items-center'>

              <View className='w-[100px] h-24 bg-primary rounded-2xl mr-4 items-center justify-center'>
                <Image
                  source={require('../../assets/order.png')}
                  className='w-14 h-14'
                />
              </View>


              <View className='flex-1'>
                <View className='flex-row items-center mb-1'>
                  <AppText
                    className={`text-sm mr-2 ${
                      order.status === 'canceled'
                        ? 'text-pink-500'
                        : 'text-primary'
                    }`}
                  >
                    {order.status === 'canceled'
                      ? 'Canceled'
                      : order.status === 'to be delivered'
                      ? 'to be delivered'
                      : 'Delivered'}
                  </AppText>
                  <AppText className='text-sm text-gray-500'>|</AppText>
                  <AppText className='text-sm text-gray-500 ml-2'>
                    {order.time}
                  </AppText>
                </View>
                <AppText className='text-2xl font-bold text-primary'>
                  {order.customer}
                </AppText>
              </View>

              <View className='ml-2'>
                {order.status === 'canceled' ? (
                  <ChevronLeft size={24} color='#999595' />
                ) : order.status === 'delivered' ? (
                  <Check size={24} color='#999595' />
                ) : (
                  <AppText className='text-gray-400 text-[40px]'>›</AppText>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View className='items-center py-8'>
        <AppText
          className='text-gray-400 text-sm mb-2'
          style={{ fontFamily: 'Ubuntu-Regular' }}
        >
          App version 1.0.0
        </AppText>
        <AppText className='text-primary text-l font-thin'>
          Ntumai delivery express
        </AppText>
      </View>
    </SafeAreaView>
  );
};

export default DriverOrders;


