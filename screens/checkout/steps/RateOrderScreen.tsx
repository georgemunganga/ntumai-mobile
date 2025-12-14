// screens/checkout/CheckoutScreen.tsx
import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { ArrowLeft, Check, Star } from 'lucide-react-native';
import { RateOrderScreenProps } from '@/CheckoutScreen';
import AppText from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';

// Rate Order Screen
export function RateOrderScreen({ route, navigation }: RateOrderScreenProps) {
  const { orderId, orderDetails } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [driverRating, setDriverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please rate your order experience');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Thank You!', 'Your feedback helps us improve our service', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    }, 1500);
  };

  const StarRating = ({
    rating,
    onRatingChange,
    size = 32,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: number;
  }) => (
    <View className='flex-row'>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          className='mr-2'
        >
          <Star
            size={size}
            color={star <= rating ? '#FCD34D' : '#E5E7EB'}
            fill={star <= rating ? '#FCD34D' : '#E5E7EB'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

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
        <View className='items-center mb-8'>
          <AppText
            style={{ fontFamily: 'Ubuntu-Bold' }}
            className='text-gray-500 text-2xl font-bold mb-8'
          >
            Rate Items
          </AppText>

          <View className='flex-row items-center justify-center mb-8'>
            <View className='w-24 h-24 rounded-full overflow-hidden mr-4'>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>

            <View
              className='w-32 h-32 rounded-full overflow-hidden mx-4 border-4'
              style={{ borderColor: '#08AF97' }}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>

            <View className='w-24 h-24 rounded-full overflow-hidden ml-4'>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>
          </View>

          <AppText
            style={{ fontFamily: 'Ubuntu-Bold' }}
            className='text-gray-800 font-bold text-3xl mb-4'
          >
            Devante Restaurant
          </AppText>

          <AppText
            style={{ fontFamily: 'Ubuntu-Regular' }}
            className='text-gray-500 text-lg mb-6'
          >
            What did you like about the product?
          </AppText>

          <View className='flex-row mb-8'>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                className='mr-2'
              >
                <Star
                  size={60}
                  color={star <= 3 ? '#ec4876' : '#E5E7EB'}
                  fill={star <= 3 ? '#ec4876' : '#E5E7EB'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View className='flex-row w-full flex-wrap gap-3 mb-4 justify-start'>
            <TouchableOpacity className='px-6 py-3 rounded-full border border-gray-300'>
              <AppText className='text-gray-600'>Yummy!</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              className='px-6 py-3 rounded-full'
              style={{ backgroundColor: '#ec4876' }}
            >
              <AppText className='text-white font-medium'>Best Package</AppText>
            </TouchableOpacity>
            <TouchableOpacity className='px-6 py-3 rounded-full border border-gray-300'>
              <AppText className='text-gray-600'>Good Quality</AppText>
            </TouchableOpacity>
            <TouchableOpacity className='px-6 py-3 rounded-full border border-gray-300'>
              <AppText className='text-gray-600'>Nice!</AppText>
            </TouchableOpacity>
            <TouchableOpacity className='px-6 py-3 rounded-full border border-gray-300'>
              <AppText className='text-gray-600'>On Point</AppText>
            </TouchableOpacity>
            <TouchableOpacity className='px-6 py-3 rounded-full border border-gray-300'>
              <AppText className='text-gray-600'>Trusted</AppText>
            </TouchableOpacity>
            <TouchableOpacity className='px-6 py-3 rounded-full border border-gray-300'>
              <AppText className='text-gray-600'>New Model</AppText>
            </TouchableOpacity>
            <TouchableOpacity className='px-6 py-3 rounded-full border border-gray-300'>
              <AppText className='text-gray-600'>Good</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View className='px-4 py-6 bg-white'>
          <View className='mb-6'>
            <TextInput
              placeholder='Any suggestions?'
              className='bg-gray-100 p-4 rounded-2xl text-gray-700 h-32'
              placeholderTextColor='#9CA3AF'
              value={review}
              onChangeText={setReview}
              multiline
              textAlignVertical='top'
              style={{
                fontFamily: 'Ubuntu-Regular',
                fontSize: 16,
              }}
            />
          </View>

          <TouchableOpacity className='flex-row items-center mb-8'>
            <View className='w-16 h-16 rounded-2xl border-2 border-gray-300 items-center justify-center mr-4'>
              <AppText className='text-gray-400 text-2xl'>+</AppText>
            </View>
            <AppText
              className='text-gray-500 text-lg'
              style={{ fontFamily: 'Ubuntu-Regular' }}
            >
              Upload Image
            </AppText>
          </TouchableOpacity>

          <View className='items-center mt-8'>
            <AppText
              className='text-gray-400 text-base mb-2'
              style={{ fontFamily: 'Ubuntu-Regular' }}
            >
              App version 1.0.0
            </AppText>
            <AppText
              className='text-base font-medium'
              style={{
                fontFamily: 'Ubuntu-Medium',
                color: '#08AF97',
              }}
            >
              Ntumai delivery express
            </AppText>
          </View>
        </View>
      </ScrollView>

      <View className='px-12 py-6 bg-white border-t border-gray-100'>
        <TouchableOpacity
          onPress={handleSubmitRating}
          disabled={isSubmitting}
          className={`py-4 rounded-2xl ${
            isSubmitting ? 'bg-gray-400' : 'bg-primary'
          }`}
        >
          <AppText
            style={{ fontFamily: 'Ubuntu-Bold' }}
            className='text-white font-bold text-lg text-center'
          >
            {isSubmitting ? 'Submitting...' : 'Post'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
