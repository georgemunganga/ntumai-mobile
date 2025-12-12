// screens/checkout/CheckoutScreen.tsx
import { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';

import Text from '../../../components/Text';
import AppText from '../../../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { OrderTrackingScreenProps } from '../CheckoutScreen';

export function OrderTrackingScreen({
  route,
  navigation,
}: OrderTrackingScreenProps) {
  return (
    <View className='flex-1 bg-gray-50'>
      <TouchableOpacity
        className='flex-row items-center px-4 py-3 bg-primary'
        onPress={() => {
          // If using react-navigation, you can use navigation.goBack()
          // Otherwise, replace with your go back logic
          if (typeof navigation !== 'undefined' && navigation.goBack) {
            navigation.goBack();
          }
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
      <ScrollView className='flex-1 px-4 py-6'>
        <View className='mb-6'>
          <Text className='text-gray-500 text-sm mb-2'>
            February 08, 2025 | 12:58PM
          </Text>
          <View className='flex-row items-center justify-between'>
            <Text
              style={{ fontFamily: 'Ubuntu-Bold' }}
              className='text-gray-900 font-bold text-3xl'
            >
              Order: 19CDW9D
            </Text>
            <View className='flex-row items-center'>
              <View
                className='w-5 h-5 rounded-full bg-primary'
                style={{ width: 10, height: 10 }}
              />
              <View className='px-2 py-1 rounded-full'>
                <Text className='text-primary text-l font-medium'>
                  Delivered
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className='rounded-2xl p-4 mb-6 '>
          <Text
            style={{ fontFamily: 'Ubuntu-Bold' }}
            className='text-gray-800 font-semibold text-lg mb-6'
          >
            Order Status
          </Text>

          <View className='mb-6'>
            <View className='flex-row items-center justify-between mb-4 relative'>
              <View className='items-center z-10'>
                <View
                  className='w-16 h-16 rounded-full items-center justify-center'
                  style={{ backgroundColor: '#08AF97' }}
                >
                  <Ionicons name='checkmark' size={24} color='white' />
                </View>
              </View>

              <View
                className='flex-1 h-1 mx-2'
                style={{ backgroundColor: '#08AF97' }}
              />

              <View className='items-center z-10'>
                <View
                  className='w-16 h-16 rounded-full items-center justify-center'
                  style={{ backgroundColor: '#08AF97' }}
                >
                  <Ionicons name='checkmark' size={24} color='white' />
                </View>
              </View>

              <View
                className='flex-1 h-1 mx-2'
                style={{ backgroundColor: '#08AF97' }}
              />

              <View className='items-center z-10'>
                <View
                  className='w-16 h-16 rounded-full items-center justify-center'
                  style={{ backgroundColor: '#ec4876' }}
                >
                  <Ionicons name='checkmark' size={24} color='white' />
                </View>
              </View>
            </View>

            <View className='flex-row justify-between'>
              <Text className='text-gray-800 font-medium text-start flex-1 '>
                Pending
              </Text>
              <Text className='text-gray-800 font-medium text-right flex-1'>
                On the Way
              </Text>
              <Text className='text-gray-800 font-medium text-right flex-1'>
                Delivered
              </Text>
            </View>
          </View>

          <View className='flex-row gap-4 space-x-4'>
            <TouchableOpacity
              className='flex-1 py-3 rounded-2xl flex-row items-center justify-center'
              style={{ backgroundColor: '#ec4876' }}
              onPress={() =>
                navigation.navigate('RateOrder', {
                  orderId: '19CDW9D',
                  orderDetails: {
                    restaurant: 'Devante Restaurant',
                    items: [
                      {
                        id: '1',
                        name: 'Mixed Salad',
                        price: 20,
                        quantity: 1,
                      },
                      {
                        id: '2',
                        name: 'Grilled Chicken',
                        price: 15,
                        quantity: 2,
                      },
                    ],
                    total: 50,
                  },
                })
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name='chatbubble-outline'
                size={20}
                color='white'
                style={{ marginRight: 8 }}
              />
              <Text className='text-white font-medium'>Rate Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-1 py-3 rounded-2xl flex-row items-center justify-center'
              style={{ backgroundColor: '#ec4876' }}
            >
              <Ionicons
                name='calendar-outline'
                size={20}
                color='white'
                style={{ marginRight: 8 }}
              />
              <Text className='text-white font-medium'>Order Again</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className='bg-white rounded-2xl p-4'>
          <Text
            style={{ fontFamily: 'Ubuntu-Bold' }}
            className='text-[#909191] font-semibold text-lg'
          >
            Driver's Information
          </Text>
          <View className='flex-row items-center bg-[#eeefef] rounded-2xl px-6 py-4 mt-2'>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              }}
              className='w-16 h-16 rounded-full mr-4'
            />
            <View className='flex-1'>
              <Text className='text-gray-800 font-bold text-l'>
                Alfred John
              </Text>
              <Text className='text-gray-500 text-sm'>+255746118766</Text>
              <Text className='text-gray-500 text-sm'>4158 Lusaka Zambia</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name='chevron-down' size={20} color='#ec4876' />
            </TouchableOpacity>
          </View>
        </View>

        <View className='bg-white rounded-2xl px-4'>
          <Text
            style={{ fontFamily: 'Ubuntu-Bold' }}
            className='text-[#909191] font-semibold text-lg '
          >
            Buyer's Information
          </Text>
          <View className='flex-row items-center bg-[#eeefef] rounded-2xl px-6 py-4 mt-2'>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              }}
              className='w-16 h-16 rounded-full mr-4'
            />
            <View className='flex-1'>
              <Text className='text-gray-800 font-bold text-l'>
                Alfred John
              </Text>
              <Text className='text-gray-500 text-sm'>+255746118766</Text>
              <Text className='text-gray-500 text-sm'>4158 Lusaka Zambia</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name='chevron-down' size={20} color='#ec4876' />
            </TouchableOpacity>
          </View>
        </View>

        <View className='bg-white rounded-2xl p-4 mb-6'>
          <Text
            style={{ fontFamily: 'Ubuntu-Bold' }}
            className='text-[#909191] font-semibold text-lg mb-4'
          >
            Store and Product Information
          </Text>

          <View className='flex-row items-center mb-6'>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
              }}
              className='w-12 h-12 rounded-full mr-4'
            />
            <Text
              style={{ fontFamily: 'Ubuntu-Bold' }}
              className='text-gray-800 font-bold text-xl'
            >
              Devante Restaurant
            </Text>
          </View>

          <View className='w-full flex-row justify-center'>
            <View className='items-center flex-row'>
              <View className='relative mr-6'>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
                  }}
                  className='w-24 h-24 rounded-2xl'
                  resizeMode='cover'
                />
                <TouchableOpacity className='absolute top-1 right-1'>
                  <View
                    className='w-6 h-6 rounded-full items-center justify-center'
                    style={{ backgroundColor: '#ec4876' }}
                  >
                    <Ionicons name='heart' size={14} color='white' />
                  </View>
                </TouchableOpacity>
              </View>

              <View className='items-start'>
                <Text
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                  className='text-gray-800 font-bold text-xl text-center'
                >
                  Mixed Salad
                </Text>
                <Text
                  className='text-gray-500 text-base text-center'
                  style={{ fontFamily: 'Ubuntu-Regular' }}
                >
                  Comes with Mayonize
                </Text>
                <Text
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                  className='text-gray-800 font-bold text-2xl text-center'
                >
                  K20
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className='items-center mt-8 mb-12'>
          <Text className='text-gray-400 text-base mb-2'>
            App version 1.0.0
          </Text>
          <Text
            className='text-primary text-base font-medium'
            style={{ color: '#08AF97' }}
          >
            Ntumai delivery express
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
