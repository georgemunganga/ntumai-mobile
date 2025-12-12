import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore, useDriverStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function DriverDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    isOnline,
    setOnlineStatus,
    activeOrder,
    availableOrders,
    earnings,
    stats,
    goOnlineAsync,
    goOfflineAsync,
    fetchAvailableJobs,
    fetchEarnings,
    fetchStats,
    isLoading,
  } = useDriverStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchEarnings(user.id, 'today');
      fetchStats(user.id);
    }
  }, [user]);

  const handleToggleOnline = async () => {
    if (user?.id) {
      if (isOnline) {
        await goOfflineAsync(user.id);
      } else {
        await goOnlineAsync(user.id);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await fetchAvailableJobs(user.id, 0, 0); // Mock location
      await fetchEarnings(user.id, 'today');
      await fetchStats(user.id);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Status Toggle */}
      <View className="bg-white px-6 py-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm text-gray-600">Welcome back</Text>
            <Text className="text-2xl font-bold text-gray-900">{user?.firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tasker)/Profile')}>
            <Image
              source={{ uri: user?.avatar }}
              className="w-12 h-12 rounded-full"
            />
          </TouchableOpacity>
        </View>

        {/* Online Status Toggle */}
        <View className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-600 text-sm mb-1">Status</Text>
            <Text className={`text-lg font-bold ${
              isOnline ? 'text-green-600' : 'text-gray-600'
            }`}>
              {isOnline ? 'ð¢ Online' : 'â« Offline'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            disabled={isLoading}
            trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
            thumbColor={isOnline ? '#16A34A' : '#9CA3AF'}
          />
        </View>
      </View>

      {/* Earnings Card */}
      <View className="px-6 py-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Today's Earnings</Text>
        <View className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-green-100 text-sm mb-1">Total Earned</Text>
              <Text className="text-4xl font-bold text-white">{earnings.today}K</Text>
            </View>
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
              <Feather name="trending-up" size={32} color="white" />
            </View>
          </View>
          <View className="flex-row items-center justify-between pt-4 border-t border-green-500">
            <View>
              <Text className="text-green-100 text-xs">This Week</Text>
              <Text className="text-white font-bold">{earnings.week}K</Text>
            </View>
            <View>
              <Text className="text-green-100 text-xs">This Month</Text>
              <Text className="text-white font-bold">{earnings.month}K</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      {stats && (
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Your Stats</Text>
          <View className="gap-3">
            <View className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200">
              <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
                <Feather name="package" size={24} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Total Deliveries</Text>
                <Text className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200">
              <View className="w-12 h-12 bg-yellow-100 rounded-lg items-center justify-center mr-4">
                <Feather name="star" size={24} color="#FCD34D" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Average Rating</Text>
                <Text className="text-2xl font-bold text-gray-900">{stats.averageRating}</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200">
              <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-4">
                <Feather name="check-circle" size={24} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Completion Rate</Text>
                <Text className="text-2xl font-bold text-gray-900">{stats.completionRate}%</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Active Job */}
      {activeOrder && (
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Active Delivery</Text>
          <TouchableOpacity
            onPress={() => router.push(`/(tasker)/DeliveryDetail?orderId=${activeOrder.id}`)}
            className="bg-white rounded-lg p-4 border-2 border-green-600"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-900">Order #{activeOrder.id.slice(-4)}</Text>
              <View className="bg-green-100 rounded-full px-3 py-1">
                <Text className="text-green-700 font-bold text-xs">IN PROGRESS</Text>
              </View>
            </View>
            <Text className="text-gray-600 text-sm mb-3">Tap to view details and navigate</Text>
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
              <View>
                <Text className="text-gray-600 text-xs">Delivery Fee</Text>
                <Text className="text-lg font-bold text-green-600">{activeOrder.deliveryFee}K</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Available Jobs */}
      {isOnline && availableOrders.length > 0 && (
        <View className="px-6 py-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Available Jobs</Text>
            <TouchableOpacity onPress={handleRefresh}>
              {refreshing ? (
                <ActivityIndicator color="#16A34A" />
              ) : (
                <Feather name="refresh-cw" size={20} color="#16A34A" />
              )}
            </TouchableOpacity>
          </View>

          <FlatList
            data={availableOrders.slice(0, 5)}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/(tasker)/JobDetail?jobId=${item.id}`)}
                className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </Text>
                  </View>
                  <View className="bg-green-100 rounded-lg px-3 py-1 ml-2">
                    <Text className="text-green-700 font-bold">{item.estimatedPay}K</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                      <Feather name="map-pin" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-xs ml-1">2.5 km away</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Feather name="clock" size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-xs ml-1">{item.estimatedTime}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            )}
          />

          {availableOrders.length > 5 && (
            <TouchableOpacity
              onPress={() => router.push('/(tasker)/AvailableJobs')}
              className="bg-green-600 rounded-lg py-3 mt-2"
            >
              <Text className="text-white text-center font-bold">View All {availableOrders.length} Jobs</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Empty State */}
      {!isOnline && (
        <View className="px-6 py-12 items-center">
          <Feather name="pause-circle" size={64} color="#D1D5DB" />
          <Text className="text-2xl font-bold text-gray-900 mt-4">You're Offline</Text>
          <Text className="text-gray-600 text-center mt-2">
            Go online to see available jobs and start earning
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View className="px-6 py-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(tasker)/Earnings')}
            className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200"
          >
            <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-4">
              <Feather name="dollar-sign" size={24} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">Earnings</Text>
              <Text className="text-gray-600 text-sm">View detailed earnings</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tasker)/DeliveryHistory')}
            className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200"
          >
            <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
              <Feather name="list" size={24} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">Delivery History</Text>
              <Text className="text-gray-600 text-sm">View past deliveries</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

