import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function Cart() {
  const router = useRouter();
  const {
    items,
    totalPrice,
    totalItems,
    removeItem,
    updateQuantity,
    discount,
    deliveryFee,
  } = useCartStore();

  const subtotal = totalPrice;
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + deliveryFee + tax - discount;

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Feather name="chevron-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Shopping Cart</Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center">
          <Feather name="shopping-cart" size={64} color="#D1D5DB" />
          <Text className="text-2xl font-bold text-gray-900 mt-4">
            Your cart is empty
          </Text>
          <Text className="text-gray-600 text-center mt-2 px-6">
            Add items from the marketplace to get started
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(customer)/Marketplace')}
            className="bg-green-600 rounded-lg px-8 py-4 mt-8"
          >
            <Text className="text-white font-bold text-lg">Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Feather name="chevron-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Shopping Cart</Text>
        </View>
        <View className="bg-green-100 rounded-full px-3 py-1">
          <Text className="text-green-700 font-bold text-sm">
            {totalItems} items
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Cart Items */}
        <View className="px-6 py-6">
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="bg-gray-50 rounded-lg p-4 mb-4 flex-row items-center">
                <Image
                  source={{ uri: item.product.image }}
                  className="w-20 h-20 rounded-lg mr-4"
                />
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 mb-1">
                    {item.product.name}
                  </Text>
                  <Text className="text-green-600 font-bold">
                    {item.product.price}K
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center"
                  >
                    <Text className="text-gray-600 font-bold">-</Text>
                  </TouchableOpacity>
                  <Text className="w-6 text-center font-bold text-gray-900">
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center"
                  >
                    <Text className="text-gray-600 font-bold">+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeItem(item.product.id)}
                    className="ml-3"
                  >
                    <Feather name="trash-2" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* Special Instructions */}
        <View className="px-6 py-4 border-t border-gray-200">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Special Instructions
          </Text>
          <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <Text className="text-gray-600">
              Add any special requests or dietary requirements...
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Summary and Checkout */}
      <View className="border-t border-gray-200 px-6 py-6 bg-white">
        {/* Price Breakdown */}
        <View className="mb-6 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-900 font-semibold">{subtotal}K</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">Tax (10%)</Text>
            <Text className="text-gray-900 font-semibold">{tax}K</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">Delivery Fee</Text>
            <Text className="text-gray-900 font-semibold">{deliveryFee}K</Text>
          </View>
          {discount > 0 && (
            <View className="flex-row items-center justify-between">
              <Text className="text-green-600">Discount</Text>
              <Text className="text-green-600 font-semibold">-{discount}K</Text>
            </View>
          )}
        </View>

        {/* Total */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">Total</Text>
          <Text className="text-2xl font-bold text-green-600">{total}K</Text>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          onPress={() => router.push('/(customer)/Checkout')}
          className="bg-green-600 rounded-lg py-4"
        >
          <Text className="text-white text-center font-bold text-lg">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>

        {/* Continue Shopping */}
        <TouchableOpacity
          onPress={() => router.push('/(customer)/Marketplace')}
          className="py-4"
        >
          <Text className="text-center text-gray-600 font-semibold">
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
