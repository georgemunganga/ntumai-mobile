import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Star, ChevronDown, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';


interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  timestamp: string;
  reviewText: string;
  hasImages?: boolean;
  images?: string[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Top Rating');

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Mack Nelson',
      userImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 3,
      timestamp: 'Just now',
      reviewText:
        'I love the fact that this product is of the highest standard that I needed.',
    },
    {
      id: '2',
      userName: 'Mack Nelson',
      userImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 3,
      timestamp: 'One hour ago',
      reviewText:
        'I love the fact that this product is of the highest standard that I needed. In fact I hope I come across these kinds of products in this store... See more',
      hasImages: true,
      images: [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      ],
    },
    {
      id: '3',
      userName: 'Mack Nelson',
      userImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 3,
      timestamp: 'Just now',
      reviewText:
        'I love the fact that this product is of the highest standard that I needed.',
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <View className='flex-row items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#ed4877' : 'transparent'}
            color={star <= rating ? '#ed4877' : '#d1d5db'}
          />
        ))}
        <Text className='text-gray-500 text-sm ml-1'>({rating}/5)</Text>
      </View>
    );
  };

  const renderReview = (review: Review) => (
    <View key={review.id} className='bg-gray-100 rounded-2xl p-4 mb-3'>
      <View className='flex-row items-start justify-between mb-3'>
        <View className='flex-row items-center flex-1'>
          <View className='w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-[#0aaf97]'>
            <Image
              source={{ uri: review.userImage }}
              className='w-full h-full'
              resizeMode='cover'
            />
          </View>
          <View className='flex-1'>
            <Text className='text-black font-bold text-base'>
              {review.userName}
            </Text>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text className='text-gray-500 text-sm'>{review.timestamp}</Text>
      </View>

      <Text className='text-gray-700 text-base mb-3' numberOfLines={3}>
        {review.reviewText}
      </Text>

      {review.hasImages && review.images && (
        <View className='flex-row mb-3'>
          {review.images.slice(0, 3).map((image, index) => (
            <View
              key={index}
              className='w-24 h-24 rounded-2xl overflow-hidden mr-2'
            >
              <Image
                source={{ uri: image }}
                className='w-full h-full'
                resizeMode='cover'
              />
              {index === 2 && review.images && review.images.length > 3 && (
                <View className='absolute inset-0 bg-[#000000a6] bg-opacity-30 items-center justify-center'>
                  <Text className='text-white text-xs font-bold'>10 more</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <View className='flex-row justify-end'>
        <TouchableOpacity className='border border-gray-300 rounded-full px-4 py-2'>
          <Text className='text-gray-600 text-sm'>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='bg-[#0aaf97] px-4 py-3 flex-row items-center'>
        <TouchableOpacity onPress={() => router.back()} className='mr-4'>
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
        <Text className='text-white font-medium text-lg'>Back</Text>
      </View>

      <ScrollView className='flex-1'>
        <View className='relative'>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop',
            }}
            className='w-full h-64'
            resizeMode='cover'
          />

          <View className='absolute bottom-0 left-7 transform translate-y-1/2'>
            <View className='w-20 h-20 rounded-full overflow-hidden border-4 border-white'>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>
          </View>
        </View>

        <View className='flex-row items-start '>
          <View className='pt-[50px]'>
            <TouchableOpacity className='bg-[#ed4877] rounded-full ml-4 px-3 py-3'>
              <Text className='text-white font-medium'>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <View className='pl-2 pt-3 pb-6'>
            <View className='flex-1'>
              <Text className='text-black font-bold text-2xl mb-2'>
                Denvate Restaurant
              </Text>
              {renderStars(3)}
            </View>

            <View className='flex-row items-center space-x-4'>
              <Text className='text-gray-500 text-base'>2.68km</Text>
              <Text className='text-gray-500 text-base'>19-29 mins</Text>
            </View>
          </View>
        </View>

        <View className='px-4 pb-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-black font-bold text-xl'>Reviews</Text>
            <TouchableOpacity className='bg-gray-200 rounded-full px-4 py-2 flex-row items-center'>
              <Text className='text-gray-600 text-sm mr-2'>{activeFilter}</Text>
              <ChevronDown size={16} color='#6b7280' />
            </TouchableOpacity>
          </View>

          {reviews.map(renderReview)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
