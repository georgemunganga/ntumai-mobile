import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useRoute } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { paymentMockService } from '../../src/api/mockServices.extended';

const { width } = Dimensions.get('window');

export default function PaymentConfirmationScreen() {
  const router = useRouter();
  const route = useRoute();
  const { orderId, amount, paymentMethod } = route.params as any;

  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const orderData = {
    orderId,
    amount,
    paymentMethod,
    items: [
      { name: 'Item 1', quantity: 2, price: 10.0 },
      { name: 'Item 2', quantity: 1, price: 15.0 },
    ],
    subtotal: 35.0,
    deliveryFee: 2.0,
    tax: 3.7,
    total: amount,
  };

  useEffect(() => {
    // Auto-process payment after 2 seconds
    const timer = setTimeout(() => {
      handleProcessPayment();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleProcessPayment = async () => {
    setProcessing(true);
    try {
      const response = await paymentMockService.processPayment({
        amount,
        method: paymentMethod,
        orderId,
      });

      if (response.success) {
        setTransactionId(response.data.transactionId);
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
    handleProcessPayment();
  };

  const handleContinue = () => {
    router.push({
      pathname: '/(customer)/OrderTrackingScreen',
      params: { orderId },
    });
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Status Section */}
      <View className="items-center justify-center py-8">
        {paymentStatus === 'pending' && (
          <>
            <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
              <Text className="text-3xl">ð³</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</Text>
            <Text className="text-gray-600 text-center">Please wait while we process your payment...</Text>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-green-600 mb-2">Payment Successful</Text>
            <Text className="text-gray-600 text-center">Your payment has been processed</Text>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
              <Ionicons name="close-circle" size={64} color="#EF4444" />
            </View>
            <Text className="text-2xl font-bold text-red-600 mb-2">Payment Failed</Text>
            <Text className="text-gray-600 text-center">Unable to process your payment. Please try again.</Text>
          </>
        )}
      </View>

      {/* Transaction Details */}
      <View className="px-4 py-6">
        {/* Order Summary */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Order Summary</Text>

          {orderData.items.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text className="text-gray-600">
                {item.name} x {item.quantity}
              </Text>
              <Text className="text-gray-900 font-semibold">â­{item.price.toFixed(2)}</Text>
            </View>
          ))}

          <View className="border-t border-gray-300 my-3" />

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-900">â­{orderData.subtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Delivery Fee</Text>
            <Text className="text-gray-900">â­{orderData.deliveryFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Tax</Text>
            <Text className="text-gray-900">â­{orderData.tax.toFixed(2)}</Text>
          </View>

          <View className="bg-white p-3 rounded-lg">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-2xl font-bold text-blue-600">
                â­{orderData.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-3">Payment Details</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Order ID</Text>
            <Text className="text-gray-900 font-mono text-sm">{orderId}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Payment Method</Text>
            <Text className="text-gray-900 font-semibold">
              {paymentMethod === 'card'
                ? 'Credit/Debit Card'
                : paymentMethod === 'wallet'
                ? 'Wallet'
                : 'Cash on Delivery'}
            </Text>
          </View>
          {transactionId && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Transaction ID</Text>
              <Text className="text-gray-900 font-mono text-sm">{transactionId}</Text>
            </View>
          )}
        </View>

        {/* Status Message */}
        {paymentStatus === 'success' && (
          <View className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <Text className="text-green-900 text-center">
              Your order has been confirmed. You'll receive a confirmation email shortly.
            </Text>
          </View>
        )}

        {paymentStatus === 'failed' && (
          <View className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
            <Text className="text-red-900 text-center mb-3">
              We couldn't process your payment. Please check your payment details and try again.
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-red-500 py-2 rounded-lg"
            >
              <Text className="text-center text-white font-semibold">Retry Payment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action Button */}
      {paymentStatus === 'success' && (
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={handleContinue}
            className="bg-blue-500 py-4 rounded-lg"
          >
            <Text className="text-center text-white font-bold text-lg">
              Continue to Order Tracking
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {paymentStatus === 'failed' && (
        <View className="px-4 pb-6 flex-row gap-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-200 py-3 rounded-lg"
          >
            <Text className="text-center text-gray-900 font-semibold">Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRetry}
            className="flex-1 bg-blue-500 py-3 rounded-lg"
          >
            <Text className="text-center text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

