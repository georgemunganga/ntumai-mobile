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
import { useOrderStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

const OrderSteps = [
  { id: 'confirmed', label: 'Order Confirmed', icon: 'check-circle' },
  { id: 'preparing', label: 'Being Prepared', icon: 'clock' },
  { id: 'ready', label: 'Ready for Pickup', icon: 'package' },
  { id: 'on_way', label: 'On the Way', icon: 'truck' },
  { id: 'delivered', label: 'Delivered', icon: 'home' },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { getOrderDetail, selectedOrder, isLoading } = useOrderStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId as string);
    }
  }, [orderId]);

  useEffect(() => {
    if (selectedOrder) {
      const stepIndex = OrderSteps.findIndex(s => s.id === selectedOrder.status);
      setCurrentStep(Math.max(0, stepIndex));
    }
  }, [selectedOrder]);

  if (isLoading || !selectedOrder) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  const estimatedDelivery = new Date(selectedOrder.estimatedDeliveryTime);
  const isDelivered = selectedOrder.status === 'delivered';

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id.slice(-4)}</Text>
          <Text className="text-gray-600 text-sm">{new Date(selectedOrder.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Status Card */}
        <View className="px-6 py-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-600 text-sm mb-1">Current Status</Text>
              <Text className="text-2xl font-bold text-gray-900 capitalize">
                {selectedOrder.status.replace('_', ' ')}
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
          <Text className="text-lg font-bold text-gray-900 mb-6">Order Timeline</Text>

          {OrderSteps.map((step, index) => {
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
                  {index < OrderSteps.length - 1 && (
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
                  {isCompleted && index < currentStep && (
                    <Text className="text-gray-600 text-sm mt-1">Completed</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Driver Info */}
        {selectedOrder.driver && (
          <View className="px-6 py-6 border-t border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-4">Your Driver</Text>
            <View className="bg-gray-50 rounded-lg p-4 flex-row items-center">
              <Image
                source={{ uri: selectedOrder.driver.avatar }}
                className="w-16 h-16 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{selectedOrder.driver.name}</Text>
                <View className="flex-row items-center mt-2">
                  <Feather name="star" size={16} color="#FCD34D" fill="#FCD34D" />
                  <Text className="text-gray-700 font-semibold ml-1">{selectedOrder.driver.rating}</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-green-600 rounded-full p-3">
                <Feather name="phone" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View className="px-6 py-6 border-t border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Order Items</Text>
          {selectedOrder.items.map((item, index) => (
            <View key={index} className="flex-row items-center mb-4 pb-4 border-b border-gray-200">
              <Image
                source={{ uri: item.product.image }}
                className="w-16 h-16 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.product.name}</Text>
                <Text className="text-gray-600 text-sm">Qty: {item.quantity}</Text>
              </View>
              <Text className="text-lg font-bold text-green-600">{item.product.price * item.quantity}K</Text>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View className="px-6 py-6 border-t border-gray-200">
          <View className="bg-gray-50 rounded-lg p-4 gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-900 font-semibold">{selectedOrder.subtotal}K</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Delivery Fee</Text>
              <Text className="text-gray-900 font-semibold">{selectedOrder.deliveryFee}K</Text>
            </View>
            <View className="border-t border-gray-200 pt-3 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-2xl font-bold text-green-600">{selectedOrder.totalAmount}K</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {isDelivered && (
        <View className="px-6 py-6 border-t border-gray-200 gap-3">
          <TouchableOpacity className="bg-green-600 rounded-lg py-4">
            <Text className="text-white text-center font-bold text-lg">Rate Order</Text>
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

