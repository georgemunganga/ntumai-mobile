import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { floatMockService } from '../../src/api/mockServices.extended';

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function FloatTopUpScreen() {
  const router = useRouter();
  const [floatBalance, setFloatBalance] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Debit/Credit Card', icon: 'card' },
    { id: 'mobile_money', name: 'Mobile Money', icon: 'phone-portrait' },
    { id: 'bank', name: 'Bank Transfer', icon: 'business' },
  ];

  useEffect(() => {
    loadFloatBalance();
  }, []);

  const loadFloatBalance = async () => {
    try {
      const response = await floatMockService.getFloatBalance('tasker_1');
      if (response.success) {
        setFloatBalance(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load float balance');
    } finally {
      setLoading(false);
    }
  };

  const getTopUpAmount = (): number | null => {
    if (selectedAmount) return selectedAmount;
    if (customAmount.trim()) return parseFloat(customAmount);
    return null;
  };

  const handleTopUp = async () => {
    const amount = getTopUpAmount();

    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please select or enter a valid amount');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setProcessing(true);
    try {
      const response = await floatMockService.topUpFloat(
        amount,
        selectedPaymentMethod
      );
      if (response.success) {
        Alert.alert('Success', 'Float top-up completed!', [
          {
            text: 'OK',
            onPress: () => {
              setFloatBalance({
                ...floatBalance,
                floatBalance: response.data.newBalance,
              });
              setSelectedAmount(null);
              setCustomAmount('');
              setSelectedPaymentMethod(null);
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process top-up');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">Top Up Float</Text>
      </View>

      <View className="px-4 py-4">
        {/* Current Balance */}
        <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-6 text-white">
          <Text className="text-white text-sm opacity-90 mb-2">Current Float Balance</Text>
          <Text className="text-white text-4xl font-bold mb-4">
            â­{floatBalance?.floatBalance.toFixed(2)}
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white text-xs opacity-75">Earnings</Text>
              <Text className="text-white text-lg font-semibold">
                â­{floatBalance?.earningsBalance.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text className="text-white text-xs opacity-75">Minimum Required</Text>
              <Text className="text-white text-lg font-semibold">
                â­{floatBalance?.minimumRequired.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Float Status */}
        {floatBalance?.floatBalance < floatBalance?.minimumRequired && (
          <View className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
            <Text className="text-red-900 font-semibold mb-1">â ï¸ Low Float Balance</Text>
            <Text className="text-red-700 text-sm">
              Your float is below the minimum required. Top up to continue receiving jobs.
            </Text>
          </View>
        )}

        {/* Preset Amounts */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Quick Select</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {PRESET_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => {
                setSelectedAmount(amount);
                setCustomAmount('');
              }}
              className={`flex-1 min-w-[45%] py-3 rounded-lg border-2 ${
                selectedAmount === amount
                  ? 'bg-blue-500 border-blue-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  selectedAmount === amount
                    ? 'text-white'
                    : 'text-gray-900'
                }`}
              >
                â­{amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Custom Amount</Text>
        <TextInput
          value={customAmount}
          onChangeText={(text) => {
            setCustomAmount(text);
            setSelectedAmount(null);
          }}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          className="bg-white rounded-lg px-4 py-3 text-gray-900 border border-gray-200 mb-6"
          placeholderTextColor="#999"
        />

        {/* Payment Methods */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => setSelectedPaymentMethod(method.id)}
            className={`flex-row items-center p-4 rounded-lg mb-3 border-2 ${
              selectedPaymentMethod === method.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200'
            }`}
          >
            <Ionicons
              name={method.icon as any}
              size={24}
              color={selectedPaymentMethod === method.id ? '#3B82F6' : '#6B7280'}
            />
            <Text
              className={`ml-3 font-semibold ${
                selectedPaymentMethod === method.id
                  ? 'text-blue-600'
                  : 'text-gray-900'
              }`}
            >
              {method.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Summary */}
        {getTopUpAmount() && (
          <View className="bg-gray-100 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Amount to Top Up</Text>
              <Text className="text-gray-900 font-semibold">
                â­{getTopUpAmount()?.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">New Balance</Text>
              <Text className="text-gray-900 font-bold">
                â­{(floatBalance?.floatBalance + (getTopUpAmount() || 0)).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Button */}
      <View className="px-4 pb-6">
        <TouchableOpacity
          onPress={handleTopUp}
          disabled={processing || !getTopUpAmount() || !selectedPaymentMethod}
          className={`py-4 rounded-lg ${
            processing || !getTopUpAmount() || !selectedPaymentMethod
              ? 'bg-gray-300'
              : 'bg-blue-500'
          }`}
        >
          <Text className="text-center text-white font-bold text-lg">
            {processing ? 'Processing...' : 'Top Up Float'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

