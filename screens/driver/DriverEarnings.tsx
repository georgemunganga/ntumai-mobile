import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import DeliveryEarningsDetails from './DeliveryEarningsDetails';
import { useRouter } from 'expo-router';

const DriverEarnings: React.FC = () => {
  const router = useRouter();
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' backgroundColor='white' />


      <View className='flex-row items-center px-4 py-3 bg-primary border-b border-gray-100'>
        <TouchableOpacity onPress={() => router.back()} className='mr-3'>
          <Ionicons name='arrow-back' size={24} color='#fff' />
        </TouchableOpacity>
        <AppText className='text-xl font-semibold text-white'>back</AppText>
      </View>


      <View className='flex-1 bg-gray-100 rounded-xl relative'>
        <Image
          source={require('../../assets/earnings.png')}
          className='w-full'
        />
        <DeliveryEarningsDetails />
      </View>
    </SafeAreaView>
  );
};

export default DriverEarnings;

