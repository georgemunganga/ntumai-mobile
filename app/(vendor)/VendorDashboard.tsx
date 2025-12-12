import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function VendorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    todayOrders: 12,
    todayRevenue: 450,
    totalRating: 4.8,
    completionRate: 98,
  });
  const [orders, setOrders] = useState([
    {
      id: '1',
      orderNumber: '#ORD-2024-001',
      customer: 'John Doe',
      items: 3,
      total: 85,
      status: 'pending',
      time: '10 mins ago',
    },
    {
      id: '2',
      orderNumber: '#ORD-2024-002',
      customer: 'Jane Smith',
      items: 2,
      total: 65,
      status: 'preparing',
      time: '5 mins ago',
    },
    {
      id: '3',
      orderNumber: '#ORD-2024-003',
      customer: 'Bob Johnson',
      items: 4,
      total: 120,
      status: 'ready',
      time: '2 mins ago',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'preparing':
        return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'ready':
        return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'completed':
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm text-gray-600">Welcome back</Text>
            <Text className="text-2xl font-bold text-gray-900">{user?.firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(vendor)/Profile')}>
            <Image
              source={{ uri: user?.avatar }}
              className="w-12 h-12 rounded-full"
            />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View className="bg-green-50 border border-green-200 rounded-lg p-3 flex-row items-center">
          <View className="w-2 h-2 bg-green-600 rounded-full mr-2" />
          <Text className="text-green-700 font-semibold">Online & Accepting Orders</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="px-6 py-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Today's Performance</Text>
        <View className="gap-3">
          {/* Orders */}
          <View className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200">
            <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
              <Feather name="shopping-bag" size={24} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">Orders</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.todayOrders}</Text>
            </View>
            <Text className="text-green-600 font-bold">+2</Text>
          </View>

          {/* Revenue */}
          <View className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200">
            <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-4">
              <Feather name="dollar-sign" size={24} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">Revenue</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.todayRevenue}K</Text>
            </View>
            <Text className="text-green-600 font-bold">+15%</Text>
          </View>

          {/* Rating */}
          <View className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200">
            <View className="w-12 h-12 bg-yellow-100 rounded-lg items-center justify-center mr-4">
              <Feather name="star" size={24} color="#FCD34D" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm">Rating</Text>
              <Text className="text-2xl font-bold text-gray-900">{stats.totalRating}</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="star" size={16} color="#FCD34D" fill="#FCD34D" />
              <Text className="text-gray-600 text-sm ml-1">(248)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(vendor)/ManageProducts')}
            className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200"
          >
            <View className="w-12 h-12 bg-purple-100 rounded-lg items-center justify-center mr-4">
              <Feather name="package" size={24} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">Manage Products</Text>
              <Text className="text-gray-600 text-sm">Add, edit, or remove items</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(vendor)/Analytics')}
            className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200"
          >
            <View className="w-12 h-12 bg-orange-100 rounded-lg items-center justify-center mr-4">
              <Feather name="bar-chart-2" size={24} color="#EA580C" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">Analytics</Text>
              <Text className="text-gray-600 text-sm">View detailed reports</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View className="px-6 py-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">Recent Orders</Text>
          <TouchableOpacity onPress={() => router.push('/(vendor)/OrderHistory')}>
            <Text className="text-blue-600 font-semibold">View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const statusColor = getStatusColor(item.status);
            return (
              <TouchableOpacity
                onPress={() => router.push(`/(vendor)/OrderDetail?orderId=${item.id}`)}
                className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{item.orderNumber}</Text>
                    <Text className="text-gray-600 text-sm">{item.customer}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${statusColor.bg}`}>
                    <Text className={`text-xs font-bold capitalize ${statusColor.text}`}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
                  <View className="flex-row items-center">
                    <Feather name="package" size={14} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{item.items} items</Text>
                  </View>
                  <View className="flex-row items-center gap-4">
                    <Text className="text-gray-600 text-sm">{item.time}</Text>
                    <Text className="text-lg font-bold text-green-600">{item.total}K</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScrollView>
  );
}

