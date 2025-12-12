import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMarketplaceStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function Marketplace() {
  const router = useRouter();
  const { fetchVendors, vendors, isLoading, searchProducts, searchResults, setSearchQuery, searchQuery } = useMarketplaceStore();
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleVendorPress = (vendorId: string) => {
    router.push(`/(customer)/VendorDetail?vendorId=${vendorId}`);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      searchProducts(text);
    }
  };

  const displayVendors = searchQuery.trim() ? [] : vendors;
  const displayProducts = searchQuery.trim() ? searchResults : [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4"
        >
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-gray-900 mb-4">Marketplace</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Search restaurants, food..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.trim() && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Feather name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="bg-white flex-row border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          className={`flex-1 py-4 border-b-2 ${
            activeTab === 'all' ? 'border-green-600' : 'border-transparent'
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'all' ? 'text-green-600' : 'text-gray-600'
          }`}>
            All Vendors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('favorites')}
          className={`flex-1 py-4 border-b-2 ${
            activeTab === 'favorites' ? 'border-green-600' : 'border-transparent'
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'favorites' ? 'text-green-600' : 'text-gray-600'
          }`}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : (
        <ScrollView className="flex-1">
          {/* Search Results */}
          {searchQuery.trim() && displayProducts.length > 0 && (
            <View className="px-6 py-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Search Results ({displayProducts.length})
              </Text>
              <FlatList
                data={displayProducts}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/(customer)/ProductDetail?productId=${item.id}`)}
                    className="bg-white rounded-xl p-4 mb-3 flex-row border border-gray-200"
                  >
                    <Image
                      source={{ uri: item.image }}
                      className="w-20 h-20 rounded-lg mr-4"
                    />
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">{item.name}</Text>
                      <Text className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-green-600">{item.price}K</Text>
                        <View className="flex-row items-center">
                          <Feather name="star" size={14} color="#FCD34D" fill="#FCD34D" />
                          <Text className="text-xs text-gray-600 ml-1">{item.rating}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* No Search Results */}
          {searchQuery.trim() && displayProducts.length === 0 && (
            <View className="flex-1 items-center justify-center py-12">
              <Feather name="search" size={48} color="#D1D5DB" />
              <Text className="text-gray-600 text-center mt-4">No products found</Text>
            </View>
          )}

          {/* Vendors List */}
          {!searchQuery.trim() && activeTab === 'all' && (
            <View className="px-6 py-6">
              {displayVendors.length > 0 ? (
                <FlatList
                  data={displayVendors}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleVendorPress(item.id)}
                      className="bg-white rounded-xl overflow-hidden mb-4 border border-gray-200"
                    >
                      {/* Vendor Header Image */}
                      <Image
                        source={{ uri: item.logo }}
                        className="w-full h-40"
                      />

                      {/* Vendor Info */}
                      <View className="p-4">
                        <View className="flex-row items-start justify-between mb-2">
                          <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-900">{item.name}</Text>
                            <Text className="text-gray-600 text-sm mt-1">{item.description}</Text>
                          </View>
                        </View>

                        {/* Rating and Info */}
                        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200">
                          <View className="flex-row items-center">
                            <Feather name="star" size={16} color="#FCD34D" fill="#FCD34D" />
                            <Text className="text-gray-700 font-semibold ml-1">{item.rating}</Text>
                            <Text className="text-gray-600 text-sm ml-1">({item.reviewCount})</Text>
                          </View>
                          <View className="flex-row items-center gap-3">
                            <View className="flex-row items-center">
                              <Feather name="clock" size={14} color="#6B7280" />
                              <Text className="text-gray-600 text-xs ml-1">{item.deliveryTime}</Text>
                            </View>
                            <View className="flex-row items-center">
                              <Feather name="truck" size={14} color="#6B7280" />
                              <Text className="text-gray-600 text-xs ml-1">{item.deliveryFee}K</Text>
                            </View>
                          </View>
                        </View>

                        {/* Status */}
                        <View className="mt-3">
                          <Text className={`text-sm font-semibold ${
                            item.isOpen ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.isOpen ? 'â Open Now' : 'â Closed'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View className="items-center justify-center py-12">
                  <Feather name="inbox" size={48} color="#D1D5DB" />
                  <Text className="text-gray-600 text-center mt-4">No vendors available</Text>
                </View>
              )}
            </View>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <View className="flex-1 items-center justify-center py-12">
              <Feather name="heart" size={48} color="#D1D5DB" />
              <Text className="text-gray-600 text-center mt-4">No favorite vendors yet</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

