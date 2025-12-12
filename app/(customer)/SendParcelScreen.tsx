import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDeliveryStore, useUserStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

type DeliveryStep = 'location' | 'details' | 'pricing' | 'confirmation';

export default function SendParcelScreen() {
  const router = useRouter();
  const { createDelivery, isLoading } = useDeliveryStore();
  const { addresses } = useUserStore();

  const [step, setStep] = useState<DeliveryStep>('location');
  const [pickupAddress, setPickupAddress] = useState(addresses[0]?.id || '');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [parcelDetails, setParcelDetails] = useState({
    description: '',
    weight: '',
    size: 'medium' as 'small' | 'medium' | 'large',
    fragile: false,
  });
  const [recipientInfo, setRecipientInfo] = useState({
    name: '',
    phone: '',
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const handleCalculatePrice = () => {
    if (!dropoffLocation.trim()) {
      Alert.alert('Error', 'Please enter dropoff location');
      return;
    }
    // Mock price calculation
    const basePrice = 25;
    const sizeMultiplier = { small: 1, medium: 1.5, large: 2 }[parcelDetails.size];
    const fragileMultiplier = parcelDetails.fragile ? 1.2 : 1;
    const calculatedPrice = Math.round(basePrice * sizeMultiplier * fragileMultiplier);
    setEstimatedPrice(calculatedPrice);
    setStep('pricing');
  };

  const handleCreateDelivery = async () => {
    if (!recipientInfo.name || !recipientInfo.phone) {
      Alert.alert('Error', 'Please fill in recipient information');
      return;
    }

    try {
      const delivery = await createDelivery({
        pickupAddressId: pickupAddress,
        dropoffLocation,
        parcelDetails,
        recipientInfo,
        estimatedPrice,
      });

      if (delivery) {
        router.replace(`/(customer)/DeliveryTracking?deliveryId=${delivery.id}`);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Step 1: Location Selection
  if (step === 'location') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Feather name="chevron-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-600">Pickup Location</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">Where are you sending from?</Text>
          </View>

          {/* Pickup Address Selection */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Select Pickup Address</Text>
            {addresses.map(address => (
              <TouchableOpacity
                key={address.id}
                onPress={() => setPickupAddress(address.id)}
                className={`border-2 rounded-lg p-4 mb-3 flex-row items-center ${
                  pickupAddress === address.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <Feather
                  name="map-pin"
                  size={24}
                  color={pickupAddress === address.id ? '#16A34A' : '#9CA3AF'}
                  className="mr-4"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {address.type.toUpperCase()}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {address.street}, {address.city}
                  </Text>
                </View>
                {pickupAddress === address.id && (
                  <Feather name="check-circle" size={24} color="#16A34A" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Dropoff Location */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Dropoff Location</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter full address or location name"
              value={dropoffLocation}
              onChangeText={setDropoffLocation}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            onPress={() => setStep('details')}
            disabled={!pickupAddress || !dropoffLocation.trim()}
            className={`rounded-lg py-4 ${
              !pickupAddress || !dropoffLocation.trim() ? 'bg-gray-300' : 'bg-green-600'
            }`}
          >
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 2: Parcel Details
  if (step === 'details') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <TouchableOpacity onPress={() => setStep('location')} className="mb-4">
              <Feather name="chevron-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-600">Parcel Details</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">What are you sending?</Text>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">What's in the parcel?</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 h-24"
              placeholder="e.g., Documents, Electronics, Clothing"
              value={parcelDetails.description}
              onChangeText={(text) => setParcelDetails(prev => ({ ...prev, description: text }))}
              multiline
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Size Selection */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Parcel Size</Text>
            <View className="gap-3">
              {['small', 'medium', 'large'].map(size => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setParcelDetails(prev => ({ ...prev, size: size as any }))}
                  className={`border-2 rounded-lg p-4 flex-row items-center ${
                    parcelDetails.size === size
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 capitalize">{size}</Text>
                    <Text className="text-gray-600 text-sm">
                      {size === 'small' && 'Up to 2kg'}
                      {size === 'medium' && '2-5kg'}
                      {size === 'large' && '5-10kg'}
                    </Text>
                  </View>
                  {parcelDetails.size === size && (
                    <Feather name="check-circle" size={24} color="#16A34A" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fragile Option */}
          <TouchableOpacity
            onPress={() => setParcelDetails(prev => ({ ...prev, fragile: !prev.fragile }))}
            className="border border-gray-300 rounded-lg p-4 mb-8 flex-row items-center"
          >
            <View className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
              parcelDetails.fragile ? 'bg-green-600 border-green-600' : 'border-gray-300'
            }`}>
              {parcelDetails.fragile && (
                <Feather name="check" size={16} color="white" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">Fragile Items</Text>
              <Text className="text-gray-600 text-sm">Requires extra care (20% surcharge)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStep('pricing')}
            className="bg-green-600 rounded-lg py-4"
          >
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 3: Pricing
  if (step === 'pricing') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <TouchableOpacity onPress={() => setStep('details')} className="mb-4">
              <Feather name="chevron-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-600">Pricing</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">Confirm Delivery Price</Text>
          </View>

          {/* Pricing Breakdown */}
          <View className="bg-gray-50 rounded-lg p-6 mb-8">
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <Text className="text-gray-600">Base Price</Text>
              <Text className="text-gray-900 font-semibold">25K</Text>
            </View>
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <Text className="text-gray-600">Size Multiplier ({parcelDetails.size})</Text>
              <Text className="text-gray-900 font-semibold">
                {parcelDetails.size === 'small' ? '1x' : parcelDetails.size === 'medium' ? '1.5x' : '2x'}
              </Text>
            </View>
            {parcelDetails.fragile && (
              <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <Text className="text-gray-600">Fragile Surcharge</Text>
                <Text className="text-gray-900 font-semibold">+20%</Text>
              </View>
            )}
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-3xl font-bold text-green-600">{estimatedPrice}K</Text>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <Text className="text-blue-900 font-semibold mb-2">ð¡ Delivery Time</Text>
            <Text className="text-blue-800 text-sm">
              Estimated delivery: 30-60 minutes from confirmation
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setStep('confirmation')}
            className="bg-green-600 rounded-lg py-4"
          >
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 4: Confirmation
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <TouchableOpacity onPress={() => setStep('pricing')} className="mb-4">
            <Feather name="chevron-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold text-sm">4</Text>
            </View>
            <Text className="text-sm font-semibold text-gray-600">Recipient Info</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900">Who's receiving this?</Text>
        </View>

        {/* Recipient Info Form */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Recipient Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            placeholder="Full name"
            value={recipientInfo.name}
            onChangeText={(text) => setRecipientInfo(prev => ({ ...prev, name: text }))}
            placeholderTextColor="#9CA3AF"
          />

          <Text className="text-sm font-semibold text-gray-700 mb-2">Recipient Phone</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Phone number"
            value={recipientInfo.phone}
            onChangeText={(text) => setRecipientInfo(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Summary */}
        <View className="bg-gray-50 rounded-lg p-6 mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Delivery Summary</Text>
          <View className="gap-3">
            <View>
              <Text className="text-gray-600 text-sm">From</Text>
              <Text className="text-gray-900 font-semibold">Your Location</Text>
            </View>
            <View>
              <Text className="text-gray-600 text-sm">To</Text>
              <Text className="text-gray-900 font-semibold">{dropoffLocation}</Text>
            </View>
            <View className="border-t border-gray-200 pt-3">
              <Text className="text-gray-600 text-sm">Total Cost</Text>
              <Text className="text-2xl font-bold text-green-600">{estimatedPrice}K</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCreateDelivery}
          disabled={isLoading || !recipientInfo.name || !recipientInfo.phone}
          className={`rounded-lg py-4 flex-row items-center justify-center ${
            isLoading || !recipientInfo.name || !recipientInfo.phone ? 'bg-gray-300' : 'bg-green-600'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">Confirm & Pay {estimatedPrice}K</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

