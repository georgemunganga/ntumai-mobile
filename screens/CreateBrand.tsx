// @ts-nocheck
import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import AppText from '@/components/AppText';
import { Package } from 'lucide-react-native';

const CreateBrand = () => {
  const router = useRouter();
  const [fixedPrice, setFixedPrice] = useState('');
  const [code, setCode] = useState('');

  const handleBack = () => {
    router.replace('/(vendor)/ProductScreen');
  };

  const handleSave = () => {
    if (!fixedPrice) {
      Alert.alert('Error', 'Fixed Price is required');
      return;
    }
    // TODO: Implement save functionality
    Alert.alert('Success', 'Promotion created successfully!');
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    Alert.alert('Image Upload', 'Image upload functionality would go here');
  };

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='light' />

      <View className='bg-primary pt-12 pb-4'>
        <View className='flex-row items-center px-4'>
          <TouchableOpacity
            onPress={handleBack}
            className='flex-row items-center'
          >
            <Ionicons name='arrow-back' size={24} color='white' />
            <AppText className='text-white text-lg ml-2'>Back</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='items-center mt-6 mb-6'>
          <AppText className='text-2xl font-bold text-[#909090]'>
            Create Brand
          </AppText>
        </View>

        <View className='mx-6 mb-6 '>
          <View className='bg-[#ededed] rounded-2xl p-6 shadow-sm'>
            <View className='mb-4'>
              <AppText className='text-sm text-gray-600 '>name</AppText>
              <TouchableOpacity className='flex-row bg-white items-center justify-between rounded-full p-4 border border-gray-200'>
                <View className='flex-row items-center'>
                  <Package size={20} color='#666' />
                  <AppText className='text-gray-800 ml-3'>Vuitton</AppText>
                </View>
              </TouchableOpacity>
            </View>

            <View className='mb-4'>
              <AppText className='text-sm text-gray-600 '>description</AppText>
              <View className='flex-row bg-white items-center rounded-2xl  py-1 px-2 border border-gray-200'>
                <TextInput
                  value={''}
                  onChangeText={setCode}
                  className='h-32 flex-1 ml-3 text-gray-800'
                />
              </View>
            </View>
            <View className='mb-4'>
              <TouchableOpacity
                onPress={handleImageUpload}
                className=' bg-white  rounded-xl p-8 items-center justify-center'
              >
                <Ionicons name='image-outline' size={48} color='#0aaf97' />
                <AppText className='text-gray-800 text-lg mt-2'>
                  Add Image
                </AppText>
                <AppText className='text-gray-500 text-sm mt-1'>
                  Recommended size 800 x 400 pixel
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className='h-20' />
      </ScrollView>

      <View className='absolute bottom-6 right-6'>
        <TouchableOpacity
          onPress={handleSave}
          className='bg-primary py-3 px-6 rounded-full'
          style={{ width: 120 }}
        >
          <AppText className='text-white text-center text-lg font-semibold'>
            Save
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateBrand;
