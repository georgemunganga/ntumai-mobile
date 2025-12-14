// @ts-nocheck
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/AppText';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';

const OrderDeliveryLastStep: React.FC = () => {
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
          source={require('@/assets/order-last-step.png')}
          className='h-32 w-full'
        />
      </View>

      <ScrollView className='flex-1 px-6' showsVerticalScrollIndicator={false}>
        <AppText className='text-2xl font-bold text-[#919190] mb-6'>
          Adress Details
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

        <AppText className='text-2xl font-bold text-[#919190] mb-6'>
          Payment method
        </AppText>
        <View className='rounded-2xl p-6 mb-6'>
          <View className='space-y-4 flex-col gap-4'>
            <TouchableOpacity className='flex-row gap-4 items-center justify-between'>
              <View className='flex-row items-center'>
                <View className='w-10 h-10 bg-primary rounded-full items-center justify-center mr-3'>
                  <Ionicons name='wallet' size={20} color='white' />
                </View>
                <AppText className='text-black text-lg font-bold'>
                  Cash on Delivery
                </AppText>
              </View>
              <View className='w-6 h-6 bg-primary rounded-full items-center justify-center'>
                <Ionicons name='checkmark' size={16} color='white' />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center justify-between'>
              <View className='flex-row items-center'>
                <View className='w-10 h-10 bg-primary rounded-full items-center justify-center mr-3'>
                  <Ionicons name='card' size={20} color='white' />
                </View>
                <AppText className='text-black text-lg font-bold'>
                  Visa/Mastercard/JCB
                </AppText>
              </View>
              <View className='w-6 h-6 border-2 border-primary rounded-full' />
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center justify-between'>
              <View className='flex-row items-center'>
                <View className='w-10 h-10 bg-primary rounded-full items-center justify-center mr-3'>
                  <AppText className='text-white font-bold text-lg'>P</AppText>
                </View>
                <AppText className='text-black text-lg font-bold'>
                  PayPal
                </AppText>
              </View>
              <View className='w-6 h-6 border-2 border-primary rounded-full' />
            </TouchableOpacity>
          </View>
        </View>

        <AppText className='text-2xl font-bold text-[#919190] mb-6'>
          Order summary
        </AppText>
        <View className='mb-[80px] rounded-2xl p-6'>
          <View className='space-y-3'>
            <View className='flex-row justify-between items-center'>
              <AppText className='text-black text-base'>Size</AppText>
              <AppText className='text-black font-bold text-lg'>20 cm</AppText>
            </View>

            <View className='flex-row justify-between items-center'>
              <AppText className='text-black text-lg'>Type</AppText>
              <AppText className='text-black font-bold text-lg'>
                Cosmetic
              </AppText>
            </View>

            <View className='flex-row justify-between items-center'>
              <AppText className='text-black text-lg font-bold'>
                Collect time
              </AppText>
              <AppText className='text-black font-bold text-lg'>
                Express
              </AppText>
            </View>

            <View className='flex-row justify-between items-center'>
              <AppText className='text-black text-lg font-bold'>
                Delivery
              </AppText>
              <AppText className='text-black font-bold text-lg'>$2.00</AppText>
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
              onPress={() => router.replace('/(tasker)/DriverOrders')}
            activeOpacity={0.8}
          >
            <AppText className='text-primary font-bold text-lg'>Submit</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDeliveryLastStep;

