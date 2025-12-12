import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function AddressesScreen() {
  const router = useRouter();
  const { addresses } = useUserStore();
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id);

  const handleDeleteAddress = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => {
          // Delete logic here
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">Addresses</Text>
          <Text className="text-gray-600 text-sm">{addresses.length} saved</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(shared)/AddAddressScreen')}
          className="bg-green-600 rounded-lg p-3"
        >
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Addresses List */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedAddressId(item.id)}
            className={`px-6 py-4 border-b border-gray-100 ${
              selectedAddressId === item.id ? 'bg-green-50' : ''
            }`}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-start flex-1">
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 mt-1 ${
                  selectedAddressId === item.id
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300'
                }`}>
                  {selectedAddressId === item.id && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-bold text-gray-900 uppercase">
                      {item.type}
                    </Text>
                    {item.isDefault && (
                      <View className="bg-blue-100 rounded-full px-2 py-1 ml-2">
                        <Text className="text-blue-700 text-xs font-bold">Default</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-900 font-semibold">
                    {item.street}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {item.city}, {item.state} {item.zipCode}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {item.country}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => router.push(`/(shared)/EditAddressScreen?addressId=${item.id}`)}
                  className="bg-blue-100 p-2 rounded-lg"
                >
                  <Feather name="edit-2" size={16} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(item.id)}
                  className="bg-red-100 p-2 rounded-lg"
                >
                  <Feather name="trash-2" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

