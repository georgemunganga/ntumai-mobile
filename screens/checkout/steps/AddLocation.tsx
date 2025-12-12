// @ts-nocheck

import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import Text from '../../../components/Text';
import AppText from '../../../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function AddLocation() {
  const router = useRouter();
  const [locationName, setLocationName] = useState('Home');
  const [country, setCountry] = useState('Zambia');
  const [city, setCity] = useState('Lusaka');
  const [street, setStreet] = useState('Mulungushi');
  const [blockNumber, setBlockNumber] = useState('ZA1893');
  const [isDefault, setIsDefault] = useState(true);
  return (
    <View className='flex-1 bg-white'>
      <TouchableOpacity
        className='flex-row items-center px-4 py-3 bg-primary'
        onPress={() => router.back()}
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

      <ScrollView className='flex-1 px-4 py-6 mb-[120px] '>

        <View className='items-center mb-8'>
          <Text
            className='text-gray-500 text-lg font-medium mb-6'
            style={{ fontFamily: 'Ubuntu-Regular' }}
          >
            Add Location
          </Text>
          <Text
            className='text-3xl font-bold text-center mb-8'
            style={{
              fontFamily: 'Ubuntu-Bold',
              color: '#08AF97',
            }}
          >
            What's{'\n'}Your Location?
          </Text>
        </View>

        <View className='mb-6'>
          <Text
            className='text-gray-500 text-sm mb-2'
            style={{ fontFamily: 'Ubuntu-Regular' }}
          >
            Location Name
          </Text>
          <View className='flex-row items-center rounded-full justify-between bg-[#f8f9fa] p-4 py-2'>
            <TextInput
              value={locationName}
              onChangeText={setLocationName}
              className='flex-1 text-[#4a5159] text-lg'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            />
            <View className='flex-row items-center'>
              <Text
                className='text-gray-500 mr-2'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                Default
              </Text>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{ false: '#E5E7EB', true: '#08AF97' }}
                thumbColor={isDefault ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>
        </View>

        <View className='mb-6'>
          <Text
            className='text-gray-500 text-sm mb-2'
            style={{ fontFamily: 'Ubuntu-Regular' }}
          >
            Country
          </Text>
          <View className='flex-row items-center rounded-full justify-between bg-[#f8f9fa] p-4 py-2'>
            <TextInput
              value={country}
              onChangeText={setCountry}
              className='text-[#4a5159] text-lg'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            />
          </View>
        </View>

        <View className='mb-6'>
          <Text
            className='text-gray-500 text-sm mb-2'
            style={{ fontFamily: 'Ubuntu-Regular' }}
          >
            City/Town
          </Text>
          <View className='flex-row items-center rounded-full justify-between bg-[#f8f9fa] p-4 py-2'>
            <TextInput
              value={city}
              onChangeText={setCity}
              className='text-[#4a5159] text-lg'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            />
          </View>
        </View>

        <View className='mb-6'>
          <Text
            className='text-gray-500 text-sm mb-2'
            style={{ fontFamily: 'Ubuntu-Regular' }}
          >
            Street
          </Text>
          <View className='flex-row items-center rounded-full justify-between bg-[#f8f9fa] p-4 py-2'>
            <TextInput
              value={street}
              onChangeText={setStreet}
              className='text-[#4a5159] text-lg'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            />
          </View>
        </View>

        <View className='mb-8'>
          <Text
            className='text-gray-500 text-sm mb-2'
            style={{ fontFamily: 'Ubuntu-Regular' }}
          >
            Block Number
          </Text>
          <View className='flex-row items-center rounded-full justify-between bg-[#f8f9fa] p-4 py-2'>
            <TextInput
              value={blockNumber}
              onChangeText={setBlockNumber}
              className='text-[#4a5159] text-lg'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            />
          </View>
        </View>

        <View className='items-end w-full mb-8'>
          <TouchableOpacity
            className='rounded-full px-6 py-2'
            style={{ backgroundColor: '#08AF97', alignSelf: 'flex-end' }}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text
              className='text-white font-bold text-lg'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View className='items-center pb-12 '>
          <Text
            className='text-gray-500 text-center text-base leading-6'
            style={{ fontFamily: 'Ubuntu-Regular' }}
          >
            Your orders will be delivered to this location.{'\n'}
            You can edit your address settings later.
          </Text>
        </View>
      </ScrollView>

      <View className='absolute w-full left-0 right-0 bottom-0 bg-primary rounded-t-3xl px-6 py-6'>
        <TouchableOpacity
          className='bg-white rounded-full px-8 py-4 w-full flex-row items-center justify-center'
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppText className='text-primary  font-bold text-lg'>
            Back to checkout
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

