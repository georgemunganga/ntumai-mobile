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

const OrderDeliverySecondStep: React.FC = () => {
  const router = useRouter();
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TouchableOpacity
        className='flex-row items-center px-4 py-3 bg-primary'
        onPress={() => {
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
          source={require('@/assets/order-second-step.png')}
          className='h-32 w-full'
        />
      </View>

      <ScrollView className='flex-1 px-6' showsVerticalScrollIndicator={false}>
        <AppText className='text-xl font-bold text-[#919190] mb-6'>
          Sender details
        </AppText>

        <View className='border border-primary/20 rounded-2xl p-6 mb-6 bg-white'>
          <View className='mb-4'>
            <TouchableOpacity className='bg-primary rounded-2xl px-4 py-[20px] '>
              <AppText className='text-white text-base'>
                Enter sender name
              </AppText>
            </TouchableOpacity>
          </View>

          <View className='mb-4'>
            <TouchableOpacity className='bg-primary rounded-2xl px-4 py-[20px] '>
              <AppText className='text-white text-base'>
                Enter sender phone
              </AppText>
            </TouchableOpacity>
          </View>

          <View className='flex-row w-full'>
            <TouchableOpacity className='flex-row w-full justify-start bg-primary rounded-2xl p-4 min-h-[100px] '>
              <AppText className='text-white text-base'>Sender remarks</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <AppText className='text-xl font-bold text-[#919190] mb-6'>
          Receiver details
        </AppText>

        <View className='rounded-2xl p-6 mb-6 bg-[#e8fac8]'>
          <View className='mb-4'>
            <TouchableOpacity className='bg-primary rounded-2xl px-4 py-[20px]'>
              <AppText className='text-white text-base'>
                Enter sender name
              </AppText>
            </TouchableOpacity>
          </View>

          <View className='mb-4'>
            <TouchableOpacity className='bg-primary rounded-xl px-4 py-[20px]'>
              <AppText className='text-white text-base'>
                Enter sender phone
              </AppText>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity className='flex-row w-full justify-start bg-primary rounded-2xl p-4 min-h-[100px] '>
              <AppText className='text-white text-base'>Sender remarks</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View className='mb-[90px]'>
          <AppText className='text-xl font-bold text-[#919190] mb-4'>
            Choose type
          </AppText>

          <View className='space-y-3'>
            <View className='flex-row gap-3 pb-2'>
              {[
                { label: 'Book', selected: false },
                { label: 'Goods', selected: false },
                { label: 'Cosmetics', selected: false },
                { label: 'Electronic', selected: true },
              ].map((type, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-4 py-3 rounded-full ${
                    type.selected ? 'bg-primary' : 'bg-gray-800'
                  }`}
                >
                  <AppText
                    className={`font-medium text-sm ${
                      type.selected ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    {type.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            <View className='flex-row gap-3'>
              {[
                { label: 'Medicine', selected: false },
                { label: 'Computer', selected: false },
                { label: 'Computer', selected: false },
              ].map((type, index) => (
                <TouchableOpacity
                  key={index + 4}
                  className={`px-4 py-3 rounded-full ${
                    type.selected ? 'bg-primary' : 'bg-gray-800'
                  }`}
                >
                  <AppText
                    className={`font-medium text-sm ${
                      type.selected ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    {type.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
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
              router.push('/(tasker)/OrderDeliveryLastStep');
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

export default OrderDeliverySecondStep;


