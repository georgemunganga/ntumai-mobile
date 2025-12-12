import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDeliveryStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

const DeliverySteps = [
  { id: 'accepted', label: 'Tasker Accepted', icon: 'check-circle' },
  { id: 'pickup', label: 'Picking Up', icon: 'package' },
  { id: 'in_transit', label: 'In Transit', icon: 'truck' },
  { id: 'delivered', label: 'Delivered', icon: 'home' },
];

export default function DeliveryTrackingScreen() {
  const router = useRouter();
  const { deliveryId } = useLocalSearchParams();
  const { getDeliveryDetail, selectedDelivery, isLoading } = useDeliveryStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (deliveryId) {
      getDeliveryDetail(deliveryId as string);
    }
  }, [deliveryId]);

  useEffect(() => {
    if (selectedDelivery) {
      const stepIndex = DeliverySteps.findIndex(s => s.id === selectedDelivery.status);
      setCurrentStep(Math.max(0, stepIndex));
    }
  }, [selectedDelivery]);

  if (isLoading || !selectedDelivery) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  const isDelivered = selectedDelivery.status === 'delivered';
  const estimatedDelivery = new Date(selectedDelivery.estimatedDeliveryTime);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">Parcel Delivery</Text>
          <Text className="text-gray-600 text-sm">{new Date(selectedDelivery.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Status Card */}
        <View className="px-6 py-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-600 text-sm mb-1">Current Status</Text>
              <Text className="text-2xl font-bold text-gray-900 capitalize">
                {selectedDelivery.status.replace('_', ' ')}
              </Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${
              isDelivered ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Text className={`font-bold text-sm ${
                isDelivered ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isDelivered ? 'â Delivered' : 'â± In Progress'}
              </Text>
            </View>
          </View>

          {!isDelivered && (
            <Text className="text-gray-600 text-sm">
              Estimated delivery: {estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>

        {/* Timeline */}
        <View className="px-6 py-8">
          <Text className="text-lg font-bold text-gray-900 mb-6">Delivery Timeline</Text>

          {DeliverySteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <View key={step.id} className="mb-6 flex-row">
                {/* Timeline Line and Circle */}
                <View className="items-center mr-4">
                  <View className={`w-12 h-12 rounded-full items-center justify-center ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`}>
                    <Feather
                      name={isCompleted ? 'check' : step.icon as any}
                      size={24}
                      color={isCompleted ? 'white' : '#9CA3AF'}
                    />
                  </View>
                  {index < DeliverySteps.length - 1 && (
                    <View className={`w-1 h-12 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </View>

                {/* Step Info */}
                <View className="flex-1 pt-2">
                  <Text className={`text-lg font-bold ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </Text>
                  {isCurrent && !isDelivered && (
                    <Text className="text-green-600 text-sm font-semibold mt-1">In progress...</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Tasker Info */}
        {selectedDelivery.tasker && (
          <View className="px-6 py-6 border-t border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-4">Your Tasker</Text>
            <View className="bg-gray-50 rounded-lg p-4 flex-row items-center">
              <Image
                source={{ uri: selectedDelivery.tasker.avatar }}
                className="w-16 h-16 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{selectedDelivery.tasker.name}</Text>
                <View className="flex-row items-center mt-2">
                  <Feather name="star" size={16} color="#FCD34D" fill="#FCD34D" />
                  <Text className="text-gray-700 font-semibold ml-1">{selectedDelivery.tasker.rating}</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-green-600 rounded-full p-3">
                <Feather name="phone" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Parcel Details */}
        <View className="px-6 py-6 border-t border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Parcel Details</Text>
          <View className="bg-gray-50 rounded-lg p-4 gap-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Description</Text>
                <Text className="text-gray-900 font-semibold mt-1">
                  {selectedDelivery.parcelDetails.description}
                </Text>
              </View>
            </View>
            <View className="border-t border-gray-200 pt-3 flex-row items-center justify-between">
              <Text className="text-gray-600">Size</Text>
              <Text className="text-gray-900 font-semibold capitalize">
                {selectedDelivery.parcelDetails.size}
              </Text>
            </View>
            {selectedDelivery.parcelDetails.fragile && (
              <View className="border-t border-gray-200 pt-3 flex-row items-center">
                <Feather name="alert-circle" size={16} color="#EF4444" />
                <Text className="text-red-600 font-semibold ml-2">Fragile Items</Text>
              </View>
            )}
          </View>
        </View>

        {/* Locations */}
        <View className="px-6 py-6 border-t border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Locations</Text>
          <View className="gap-4">
            {/* Pickup */}
            <View className="bg-gray-50 rounded-lg p-4 flex-row items-start">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4 mt-1">
                <Feather name="map-pin" size={20} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Pickup From</Text>
                <Text className="text-gray-900 font-semibold mt-1">
                  {selectedDelivery.pickupAddress}
                </Text>
              </View>
            </View>

            {/* Dropoff */}
            <View className="bg-gray-50 rounded-lg p-4 flex-row items-start">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4 mt-1">
                <Feather name="map-pin" size={20} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Deliver To</Text>
                <Text className="text-gray-900 font-semibold mt-1">
                  {selectedDelivery.dropoffLocation}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Price Summary */}
        <View className="px-6 py-6 border-t border-gray-200">
          <View className="bg-gray-50 rounded-lg p-4">
            <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <Text className="text-gray-600">Delivery Cost</Text>
              <Text className="text-gray-900 font-semibold">{selectedDelivery.price}K</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-2xl font-bold text-green-600">{selectedDelivery.price}K</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {isDelivered && (
        <View className="px-6 py-6 border-t border-gray-200 gap-3">
          <TouchableOpacity className="bg-green-600 rounded-lg py-4">
            <Text className="text-white text-center font-bold text-lg">Rate Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(customer)/Home')}
            className="bg-gray-100 rounded-lg py-4"
          >
            <Text className="text-gray-900 text-center font-bold text-lg">Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

