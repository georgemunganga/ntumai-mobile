import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DeliveryEarningsDetails = () => {
  const handleAccept = () => {
    console.log('Delivery accepted');
  };

  const handleReject = () => {
    console.log('Delivery rejected');
  };

  return (
    <View className='absolute bottom-0 left-0 right-0 bg-primary rounded-t-3xl'>
      <ScrollView className='px-4 py-6' showsVerticalScrollIndicator={false}>

        <View className='flex-row justify-between items-center pb-4'>
          <Text className='text-white text-2xl mb-2 font-bold'>
            My Earnings
          </Text>
          <TouchableOpacity
            onPress={handleAccept}
            className=' bg-white py-[12px] px-6 rounded-full'
          >
            <Text className='text-primary text-center font-semibold text-lg'>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <View className=' rounded-2xl p-4  flex-row justify-between items-center'>
            <View>
              <Text className='text-white text-xl font-bold'>Today</Text>
              <Text className='text-white text-sm'>22 January 2025</Text>
            </View>
            <Text className='text-white text-2xl font-bold'>K 22.60 +</Text>
          </View>

          <View className='h-px bg-gray-200 ' />

          <View className=' rounded-2xl p-4  flex-row justify-between items-center'>
            <View>
              <Text className='text-white text-xl font-bold'>Last Week</Text>
              <Text className='text-white text-sm'>12 - 19 Jan 2025</Text>
            </View>
            <Text className='text-white text-2xl font-bold'>K 100</Text>
          </View>

          <View className='h-px bg-gray-200 ' />

          <View className=' rounded-2xl p-4  flex-row justify-between items-center'>
            <View>
              <Text className='text-white text-xl font-bold'>Last Month</Text>
              <Text className='text-white text-sm'>December 2024</Text>
            </View>
            <Text className='text-white text-2xl font-bold'>K 2,000</Text>
          </View>
        </View>
      </ScrollView>

      <View className='px-4 pb-4'>
        <View className='flex-row items-center justify-center space-x-4 gap-2'>
          <Text className='text-white text-l'>App version 1.0.0</Text>
          <Text className='text-white text-sm font-medium'>
            Ntumai delivery express
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DeliveryEarningsDetails;
