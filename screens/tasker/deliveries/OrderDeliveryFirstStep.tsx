// @ts-nocheck
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/AppText';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';

const OrderDeliveryFirstStep: React.FC = () => {
  const router = useRouter();
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TouchableOpacity
        className='flex-row items-center px-4 py-3 bg-primary'
        onPress={() => {
          // If using react-navigation, you can use navigation.goBack()
          // Otherwise, replace with your go back logic
          router.back();
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name='arrow-back'
          size={24}
          color='white'
          style={{ marginRight: 12 }}
        />
        <AppText className='text-white text-lg font-semibold'>Back</AppText>
      </TouchableOpacity>

      <View className='px-6 py-6'>
        <Image
          source={require('@/assets/order-first-step.png')}
          className='h-32 w-full'
        />
      </View>

      <ScrollView className='flex-1 px-6' showsVerticalScrollIndicator={false}>
        <AppText className='text-2xl font-bold text-[#919190] mb-6'>
          Select location
        </AppText>
        <View className='bg-primary rounded-2xl p-6 mb-6'>
          <View className='flex-row items-start mb-6'>
            <View className='mr-4 mt-1'>
              <Ionicons name='location' size={24} color='white' />
            </View>
            <View className='flex-1'>
              <View className='flex-row items-center justify-between mb-1'>
                <AppText className='text-white font-bold text-lg'>
                  Collect from
                </AppText>
                <TouchableOpacity>
                  <Ionicons name='create-outline' size={20} color='white' />
                </TouchableOpacity>
              </View>
              <AppText className='text-white/80 text-sm mb-1'>
                Sender address
              </AppText>
              <AppText className='text-white text-sm leading-5'>
                Kilometer 6, 278H, Street 201R, Kroalkor Village, Unnamed Road,
                Phnom Penh
              </AppText>
            </View>
          </View>

          <View className='absolute left-7 top-20 w-0.5 h-16 border-l border-dashed border-white/30' />

          <View className='flex-row items-start'>
            <View className='mr-4 mt-1'>
              <Ionicons name='location' size={24} color='white' />
            </View>
            <View className='flex-1'>
              <View className='flex-row items-center justify-between mb-1'>
                <AppText className='text-white font-bold text-lg'>
                  Delivery to
                </AppText>
                <TouchableOpacity>
                  <Ionicons name='create-outline' size={20} color='white' />
                </TouchableOpacity>
              </View>
              <AppText className='text-white/80 text-sm mb-1'>
                Receiver address
              </AppText>
              <AppText className='text-white text-sm leading-5'>
                2nd Floor 01, 25 Mao Tse Toung Blvd (245), Phnom Penh 12302,
                Cambodia
              </AppText>
            </View>
          </View>
          <View className='items-start pl-8 pt-4'>
            <TouchableOpacity className='bg-white border-2 border-primary rounded-full px-6 py-3 flex-row items-center'>
              <Ionicons
                name='time-outline'
                size={20}
                color='#14b8a6'
                className='mr-2'
              />
              <AppText className='text-primary font-medium ml-2'>
                Take around 20 min
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View className='mb-6'>
          <AppText className='text-xl font-bold text-[#919190] mb-4'>
            Collect time
          </AppText>

          <View className='flex-row space-x-3 mb-6 gap-4'>
            <TouchableOpacity className='flex-1 bg-primary rounded-2xl p-4'>
              <View className='flex-row items-center justify-between'>
                <AppText className='text-white font-bold text-lg mb-1'>
                  Express
                </AppText>
                <View className='w-6 h-6 bg-white rounded-full items-center justify-center'>
                  <Ionicons name='checkmark' size={16} color='#14b8a6' />
                </View>
              </View>
              <AppText className='text-white text-sm mb-1'>
                Collect time 10-20 min
              </AppText>
              <AppText className='text-white text-sm'>
                Delivery to receiver 1-2 hours
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity className='flex-1 bg-lime-100 rounded-2xl p-4'>
              <View className='flex-row items-center justify-between'>
                <AppText className='text-primary font-bold text-lg mb-1'>
                  Schedule
                </AppText>
                <View className='w-6 h-6 border-2 border-gray-400 rounded-full' />
              </View>
              <AppText className='text-gray-600 text-sm mb-1'>
                Choose available time
              </AppText>
              <View className='flex-row items-center mb-1'>
                <Ionicons
                  name='cash-outline'
                  size={16}
                  color='#374151'
                  className='mr-1'
                />
                <AppText className='text-gray-600 text-sm'>
                  Flexible price
                </AppText>
              </View>
              <View className='flex-row items-center'>
                <Ionicons
                  name='time-outline'
                  size={16}
                  color='#374151'
                  className='mr-1'
                />
                <AppText className='text-gray-600 text-sm'>
                  Plan 2 day ahead
                </AppText>
              </View>
            </TouchableOpacity>
          </View>

          <AppText className='text-xl font-bold text-[#919190] mb-4'>
            Choose package type
          </AppText>

          <View className='flex-row space-x-3 gap-4'>
            {[
              {
                key: 'small',
                selected: false,
                bg: 'bg-lime-100',
                img: require('@/assets/box1.png'),
              },
              {
                key: 'medium',
                selected: true,
                bg: 'bg-primary',
                img: require('@/assets/order.png'),
              },
              {
                key: 'large',
                selected: false,
                bg: 'bg-lime-100',
                img: require('@/assets/box3.png'),
              },
            ].map((box, idx) => (
              <TouchableOpacity
                key={box.key}
                className={`flex-1 ${box.bg} rounded-2xl p-4 items-center`}
              >
                <View className='items-end mb-2 w-full'>
                  {box.selected ? (
                    <View className='w-6 h-6 bg-white rounded-full items-center justify-center'>
                      <Ionicons name='checkmark' size={16} color='#14b8a6' />
                    </View>
                  ) : (
                    <View className='w-6 h-6 border-2 border-gray-400 rounded-full' />
                  )}
                </View>
                <Image source={box.img} className='h-16 w-16' />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className='mb-[90px]'>
          <AppText className='text-xl font-bold text-[#919190] mb-4'>
            Dimension
          </AppText>

          <View className='flex-row gap-2 space-x-3'>
            {[
              { value: '10 cm', selected: false },
              { value: '20 cm', selected: false },
              { value: '30 cm', selected: true },
              { value: '40 cm', selected: false },
              { value: '50 cm', selected: false },
            ].map((dimension, index) => (
              <TouchableOpacity
                key={index}
                className={`px-4 py-3  rounded-full ${
                  dimension.selected ? 'bg-primary' : 'bg-[#efefee]'
                }`}
              >
                <AppText
                  className={`font-medium text-sm ${
                    dimension.selected ? 'text-white' : 'text-[#939d7e]'
                  }`}
                >
                  {dimension.value}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className='h-8' />
      </ScrollView>
      <View className='absolute w-full left-0 right-0 bottom-0 bg-primary rounded-t-3xl px-6 py-6'>
        <View className='flex-row items-center justify-between'>
          <View>
            <AppText className='text-white text-sm mb-1'>
              Total (incl. VAT)
            </AppText>
            <AppText className='text-white text-2xl font-bold'>K2.00</AppText>
          </View>

          <TouchableOpacity
            className='bg-white rounded-full px-8 py-4'
            onPress={() => {
              router.push('/(tasker)/OrderDeliverySecondStep');
            }}
            activeOpacity={0.8}
          >
            <AppText className='text-primary font-bold text-lg'>
              Process Next
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDeliveryFirstStep;



