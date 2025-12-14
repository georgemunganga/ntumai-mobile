import AppText from '@/components/AppText';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DeliveryTaskDetails = () => {
  const handleAccept = () => {
    console.log('Delivery accepted');
  };

  const handleReject = () => {
    console.log('Delivery rejected');
  };

  return (
    <View className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl'>
      <ScrollView className='px-4 py-6' showsVerticalScrollIndicator={false}>

        <View className='flex-row justify-between items-center pb-4'>
          <AppText className='text-primary text-2xl mb-2 font-bold'>
            23 January 2025
          </AppText>
          <TouchableOpacity
            onPress={handleAccept}
            className=' bg-primary py-4 px-6 rounded-full'
          >
            <AppText className='text-white text-center font-semibold text-lg'>
              Local
            </AppText>
          </TouchableOpacity>
        </View>
        <View className='mb-4'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-1'>
              <AppText className='text-gray-500 text-sm mb-2'>Pick Up</AppText>
              <AppText className='text-gray-900 text-xl font-bold leading-tight'>
                432, Dominic Ct, South Plainfield, NJ
              </AppText>
            </View>

            <View className='mx-4 self-start'>
              <Ionicons name='swap-horizontal' size={20} color='#9ca3af' />
            </View>

            <View className='flex-1 items-start'>
              <AppText className='text-gray-500 text-sm mb-2 '>Delivery</AppText>
              <AppText className='text-gray-900 text-xl font-bold  leading-tight'>
                22 Revendal Way, NY 22301
              </AppText>
            </View>
          </View>
        </View>

        <View className='h-px bg-gray-200 mb-4' />

        <View className='flex-row items-center justify-between mb-4'>
          <View>
            <AppText className='text-gray-500 text-sm mb-2'>Sending</AppText>
            <AppText className='text-gray-900 text-2xl font-bold'>Hisense Tv</AppText>
          </View>
          <View className='flex-row justify-center items-center w-[180px]'>
            <AppText className='text-gray-900 text-2xl text-start font-bold'>
              50" A6 Series
            </AppText>
          </View>
        </View>

        <View className='h-px bg-gray-200 mb-4' />

        <View className=' flex-row items-center justify-between '>
          <AppText className='text-gray-500 text-sm'>Total</AppText>
          <View className='flex-row justify-center items-center w-[210px]'>
            <AppText className='text-gray-900 text-3xl font-bold'>K 22.60</AppText>
          </View>
        </View>
      </ScrollView>

      <View className='px-4 pb-6'>
        <View
          className='flex-row space-x-4 p-2 rounded-full bg-white'
          style={{
            borderRadius: 30,
            shadowColor: '#0000005c',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2, // for Android
          }}
        >
          <TouchableOpacity
            onPress={handleAccept}
            className='flex-1 bg-primary py-2 rounded-full'
          >
            <AppText className='text-white text-center font-semibold text-lg'>
              Accept
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReject}
            className='flex-1 py-2 rounded-full'
          >
            <AppText className='text-primary text-center font-semibold text-lg'>
              Reject
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View className='px-4 pb-4'>
        <View className='flex-row items-center justify-center space-x-4 gap-2'>
          <AppText className='text-gray-400 text-l'>App version 1.0.0</AppText>
          <AppText className='text-primary text-sm font-medium'>
            Ntumai delivery express
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default DeliveryTaskDetails;
