import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore, useDriverStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function JobDetailScreen() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { availableOrders, acceptJob, isLoading } = useDriverStore();
  const [job, setJob] = useState<any>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (jobId) {
      const foundJob = availableOrders.find(j => j.id === jobId);
      setJob(foundJob);
    }
  }, [jobId, availableOrders]);

  const handleAcceptJob = async () => {
    if (!user?.id || !job) return;

    setIsAccepting(true);
    try {
      await acceptJob(user.id, job.id, job.type);
      Alert.alert('Success', 'Job accepted! Navigate to the pickup location.');
      router.replace(`/(tasker)/DeliveryDetail?orderId=${job.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept job');
    } finally {
      setIsAccepting(false);
    }
  };

  if (!job) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">Job Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Job Type Badge */}
        <View className="px-6 py-6">
          <View className={`inline-flex px-4 py-2 rounded-full mb-4 ${
            job.type === 'delivery' ? 'bg-blue-100' : 'bg-purple-100'
          }`}>
            <Text className={`font-bold ${
              job.type === 'delivery' ? 'text-blue-700' : 'text-purple-700'
            }`}>
              {job.type === 'delivery' ? 'ð DELIVERY' : 'â TASK'}
            </Text>
          </View>

          {/* Title and Description */}
          <Text className="text-3xl font-bold text-gray-900 mb-2">{job.title}</Text>
          <Text className="text-gray-600 text-lg mb-6">{job.description}</Text>
        </View>

        {/* Earnings Card */}
        <View className="px-6 py-6 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-600 text-sm mb-1">Estimated Earnings</Text>
              <Text className="text-4xl font-bold text-green-600">{job.estimatedPay}K</Text>
            </View>
            <View>
              <Text className="text-gray-600 text-sm mb-1 text-right">Est. Time</Text>
              <Text className="text-2xl font-bold text-gray-900">{job.estimatedTime}</Text>
            </View>
          </View>
        </View>

        {/* Locations */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Locations</Text>

          {/* Pickup */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Feather name="map-pin" size={16} color="#16A34A" />
              </View>
              <Text className="text-gray-600 text-sm font-semibold">Pickup Location</Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4 ml-11">
              <Text className="text-gray-900 font-semibold mb-1">{job.pickupLocation}</Text>
              <Text className="text-gray-600 text-sm">Tap to navigate</Text>
            </View>
          </View>

          {/* Dropoff */}
          <View>
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Feather name="map-pin" size={16} color="#2563EB" />
              </View>
              <Text className="text-gray-600 text-sm font-semibold">Dropoff Location</Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4 ml-11">
              <Text className="text-gray-900 font-semibold mb-1">{job.dropoffLocation}</Text>
              <Text className="text-gray-600 text-sm">Tap to navigate</Text>
            </View>
          </View>
        </View>

        {/* Additional Details */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Additional Details</Text>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather name="navigation" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-3">Distance</Text>
              </View>
              <Text className="text-gray-900 font-semibold">{job.distance || '2.5 km'}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather name="clock" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-3">Estimated Duration</Text>
              </View>
              <Text className="text-gray-900 font-semibold">{job.estimatedTime}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather name="user" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-3">Customer Rating</Text>
              </View>
              <View className="flex-row items-center">
                <Feather name="star" size={14} color="#FCD34D" fill="#FCD34D" />
                <Text className="text-gray-900 font-semibold ml-1">4.8</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Requirements */}
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Requirements</Text>
          <View className="gap-2">
            <View className="flex-row items-center">
              <Feather name="check" size={16} color="#16A34A" />
              <Text className="text-gray-700 ml-3">Professional and courteous</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="check" size={16} color="#16A34A" />
              <Text className="text-gray-700 ml-3">On-time delivery</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="check" size={16} color="#16A34A" />
              <Text className="text-gray-700 ml-3">Keep items safe and secure</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-6 border-t border-gray-200 gap-3">
        <TouchableOpacity
          onPress={handleAcceptJob}
          disabled={isAccepting || isLoading}
          className={`rounded-lg py-4 flex-row items-center justify-center ${
            isAccepting || isLoading ? 'bg-gray-300' : 'bg-green-600'
          }`}
        >
          {isAccepting || isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Feather name="check-circle" size={20} color="white" />
              <Text className="text-white text-center font-bold text-lg ml-2">Accept Job</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-100 rounded-lg py-4"
        >
          <Text className="text-gray-900 text-center font-bold text-lg">Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

