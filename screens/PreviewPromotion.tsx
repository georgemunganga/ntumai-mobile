import AppText from '@/components/AppText';
// @ts-nocheck
import React from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const promotion = {
  id: 'dummy-id',
  title: 'Dummy Promotion',
  discount: '20% off',
  code: 'DUMMY20',
  type: 'percentage',
  imageUrl:
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
  expiryDays: [
    { day: 'Monday', timeRange: '10am - 5pm' },
    { day: 'Tuesday', timeRange: '10am - 5pm' },
    { day: 'Wednesday', timeRange: '10am - 5pm' },
    { day: 'Thursday', timeRange: '10am - 5pm' },
    { day: 'Friday', timeRange: '10am - 5pm' },
    { day: 'Saturday', timeRange: '10am - 5pm' },
    { day: 'Sunday', timeRange: '10am - 5pm' },
  ],
};


const PreviewPromotion = () => {
  const router = useRouter();
  const handleBackPress = () => {
    router.back();
  };

  const renderExpiryDay = (
    day: { day: string; timeRange: string },
    index: number
  ) => (
    <View
      key={index}
      className='bg-[#f8f9fa] px-4 py-3 rounded-full flex-row justify-between items-center'
    >
      <AppText className='text-base text-black font-medium'>{day.day}</AppText>
      <AppText className='text-base text-black font-medium'>{day.timeRange}</AppText>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>

      <View className='bg-primary px-4 py-3 flex-row items-center'>
        <TouchableOpacity
          onPress={handleBackPress}
          className='flex-row items-center'
        >
          <Ionicons name='arrow-back' size={24} color='white' />
          <AppText className='text-white text-base font-medium ml-2'>Back</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>

        <View className='w-full h-64 relative'>
          <Image
            source={{ uri: promotion.imageUrl }}
            className='w-full h-full absolute'
            resizeMode='cover'
            style={{ opacity: 0.5 }}
          />
          <View className='absolute w-full h-full bg-green-500 opacity-25' />
        </View>


        <View className='px-4 py-5'>
          <AppText className='text-lg font-semibold text-black mb-3'>
            Discount
          </AppText>
          <View className='bg-primary px-4 py-2 rounded-full self-start'>
            <AppText className='text-white text-base font-semibold'>
              {promotion.discount}
            </AppText>
          </View>
        </View>


        <View className='px-4 py-5'>
          <AppText className='text-lg font-semibold text-black mb-3'>
            Specifications
          </AppText>
          <View className='flex-row gap-3'>
            <View className='flex-1 bg-[#eeeeee] p-4 rounded-2xl'>
              <AppText className='text-xs text-gray-500 mb-1'>Type:</AppText>
              <AppText className='text-base p-6 font-semibold text-black text-center'>
                {promotion.type}
              </AppText>
            </View>
            <View className='flex-1 bg-[#eeeeee] p-4 rounded-2xl'>
              <AppText className='text-xs text-gray-500 mb-1'>Code:</AppText>
              <AppText className='text-base p-6 font-semibold text-black text-center'>
                {promotion.code}
              </AppText>
            </View>
          </View>
        <View className='px-4 py-5 bg-[#eeeeee] mt-4 rounded-2xl'>
          <AppText className='text-base text-gray-500 mb-3'>Date Expire</AppText>
          <View className='gap-2'>
            {promotion.expiryDays.map((day, index) =>
              renderExpiryDay(day, index)
            )}
          </View>
        </View>
        </View>

              
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreviewPromotion;


