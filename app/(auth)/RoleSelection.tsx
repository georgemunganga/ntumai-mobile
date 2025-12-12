import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function RoleSelection() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'driver' | null>(null);

  const handleRoleSelection = async (role: 'customer' | 'driver') => {
    setSelectedRole(role);
    
    // Update user role in store
    updateUser({ role });

    // Navigate to appropriate onboarding
    if (role === 'customer') {
      router.replace('/(customer)/CustomerDashboard');
    } else {
      router.replace('/(auth)/DriverOnboarding');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.firstName}!</Text>
          <Text className="text-lg text-gray-600">
            What would you like to do?
          </Text>
        </View>

        {/* Role Cards */}
        <View className="gap-4 mb-8">
          {/* Customer Role */}
          <TouchableOpacity
            onPress={() => handleRoleSelection('customer')}
            className={`border-2 rounded-2xl p-6 ${
              selectedRole === 'customer'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <View className="flex-row items-start">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Feather name="shopping-bag" size={32} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 mb-1">Order Deliveries</Text>
                <Text className="text-gray-600 text-sm">
                  Browse restaurants, order food, send packages, and request tasks
                </Text>
                <View className="flex-row gap-2 mt-3 flex-wrap">
                  <View className="bg-blue-100 rounded-full px-3 py-1">
                    <Text className="text-xs text-blue-700 font-semibold">Marketplace</Text>
                  </View>
                  <View className="bg-blue-100 rounded-full px-3 py-1">
                    <Text className="text-xs text-blue-700 font-semibold">P2P Delivery</Text>
                  </View>
                  <View className="bg-blue-100 rounded-full px-3 py-1">
                    <Text className="text-xs text-blue-700 font-semibold">Errands</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Driver Role */}
          <TouchableOpacity
            onPress={() => handleRoleSelection('driver')}
            className={`border-2 rounded-2xl p-6 ${
              selectedRole === 'driver'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <View className="flex-row items-start">
              <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mr-4">
                <Feather name="truck" size={32} color="#EA580C" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 mb-1">Become a Tasker</Text>
                <Text className="text-gray-600 text-sm">
                  Deliver orders, complete tasks, and earn money on your own schedule
                </Text>
                <View className="flex-row gap-2 mt-3 flex-wrap">
                  <View className="bg-orange-100 rounded-full px-3 py-1">
                    <Text className="text-xs text-orange-700 font-semibold">Deliveries</Text>
                  </View>
                  <View className="bg-orange-100 rounded-full px-3 py-1">
                    <Text className="text-xs text-orange-700 font-semibold">Tasks</Text>
                  </View>
                  <View className="bg-orange-100 rounded-full px-3 py-1">
                    <Text className="text-xs text-orange-700 font-semibold">Earnings</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <Text className="text-blue-900 font-semibold mb-2">💡 Did you know?</Text>
          <Text className="text-blue-800 text-sm">
            You can switch between roles anytime! Start as a customer and become a tasker later, or vice versa.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={() => selectedRole && handleRoleSelection(selectedRole)}
          disabled={!selectedRole}
          className={`rounded-lg py-4 flex-row items-center justify-center ${
            selectedRole ? 'bg-green-600' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white text-lg font-bold">Continue</Text>
        </TouchableOpacity>

        {/* Skip for now */}
        <TouchableOpacity
          onPress={() => router.replace('/(customer)/CustomerDashboard')}
          className="py-4"
        >
          <Text className="text-center text-gray-600 font-semibold">Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
