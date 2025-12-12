/**
 * Vendor Onboarding Wizard
 * 
 * Multi-step form for vendor setup:
 * 1. Business Information
 * 2. Location Setup
 * 3. Bank Details
 * 4. Review & Submit
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

type OnboardingStep = 'business' | 'location' | 'bank' | 'review' | 'submitted';

export default function VendorOnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('business');

  // Form state
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '', // restaurant, grocery, pharmacy, etc.
    description: '',
    phone: '',
  });

  const [location, setLocation] = useState({
    address: '',
    city: '',
    district: '',
    latitude: '',
    longitude: '',
  });

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchCode: '',
  });

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleNext = () => {
    if (currentStep === 'business') {
      if (!businessInfo.businessName || !businessInfo.businessType) {
        Alert.alert('Error', 'Please fill in all business details');
        return;
      }
      setCurrentStep('location');
    } else if (currentStep === 'location') {
      if (!location.address || !location.city) {
        Alert.alert('Error', 'Please fill in all location details');
        return;
      }
      setCurrentStep('bank');
    } else if (currentStep === 'bank') {
      if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
        Alert.alert('Error', 'Please fill in all bank details');
        return;
      }
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'business') {
      router.back();
    } else if (currentStep === 'location') {
      setCurrentStep('business');
    } else if (currentStep === 'bank') {
      setCurrentStep('location');
    } else if (currentStep === 'review') {
      setCurrentStep('bank');
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Call API to submit vendor onboarding
      // POST /api/v1/vendors
      // {
      //   businessName,
      //   businessType,
      //   description,
      //   phone,
      //   location: { address, city, district, latitude, longitude },
      //   bankDetails: { accountName, accountNumber, bankName, branchCode }
      // }

      setCurrentStep('submitted');
      
      // After 2 seconds, redirect to dashboard
      setTimeout(() => {
        router.replace('/(vendor)/VendorDashboard');
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vendor information');
    }
  };

  const handleSkip = () => {
    router.replace('/(vendor)/VendorDashboard');
  };

  // ========================================================================
  // STEP 1: BUSINESS INFORMATION
  // ========================================================================

  if (currentStep === 'business') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity onPress={handleBack} className="mr-4">
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">1</Text>
                </View>
                <Text className="text-sm font-semibold text-gray-600">Business Information</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">Tell us about your store</Text>
            </View>
          </View>

          {/* Business Name */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Business Name *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="e.g., John's Restaurant"
              value={businessInfo.businessName}
              onChangeText={(text) => setBusinessInfo(prev => ({ ...prev, businessName: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Business Type */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Business Type *</Text>
            <View className="gap-2">
              {['Restaurant', 'Grocery', 'Pharmacy', 'Bakery', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setBusinessInfo(prev => ({ ...prev, businessType: type }))}
                  className={`p-3 rounded-lg border-2 ${
                    businessInfo.businessType === type
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Text className={businessInfo.businessType === type ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 h-24"
              placeholder="Tell customers about your business"
              value={businessInfo.description}
              onChangeText={(text) => setBusinessInfo(prev => ({ ...prev, description: text }))}
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Phone */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="+260..."
              value={businessInfo.phone}
              onChangeText={(text) => setBusinessInfo(prev => ({ ...prev, phone: text }))}
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity onPress={handleNext} className="bg-green-600 rounded-lg py-4 mb-3">
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} className="py-4">
            <Text className="text-center text-gray-600 font-semibold">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ========================================================================
  // STEP 2: LOCATION SETUP
  // ========================================================================

  if (currentStep === 'location') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity onPress={handleBack} className="mr-4">
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">2</Text>
                </View>
                <Text className="text-sm font-semibold text-gray-600">Location Setup</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">Where are you located?</Text>
            </View>
          </View>

          {/* Address */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Address *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Street address"
              value={location.address}
              onChangeText={(text) => setLocation(prev => ({ ...prev, address: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* City */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">City *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="e.g., Lusaka"
              value={location.city}
              onChangeText={(text) => setLocation(prev => ({ ...prev, city: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* District */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-2">District</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="e.g., Kabulonga"
              value={location.district}
              onChangeText={(text) => setLocation(prev => ({ ...prev, district: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity onPress={handleNext} className="bg-green-600 rounded-lg py-4 mb-3">
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} className="py-4">
            <Text className="text-center text-gray-600 font-semibold">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ========================================================================
  // STEP 3: BANK DETAILS
  // ========================================================================

  if (currentStep === 'bank') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity onPress={handleBack} className="mr-4">
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">3</Text>
                </View>
                <Text className="text-sm font-semibold text-gray-600">Bank Details</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">Where should we send payments?</Text>
            </View>
          </View>

          {/* Account Name */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Account Holder Name *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Business name"
              value={bankDetails.accountName}
              onChangeText={(text) => setBankDetails(prev => ({ ...prev, accountName: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Bank Name */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Bank Name *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="e.g., Zanaco, Standard Chartered"
              value={bankDetails.bankName}
              onChangeText={(text) => setBankDetails(prev => ({ ...prev, bankName: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Account Number */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Account Number *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Your account number"
              value={bankDetails.accountNumber}
              onChangeText={(text) => setBankDetails(prev => ({ ...prev, accountNumber: text }))}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Branch Code */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Branch Code</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Optional"
              value={bankDetails.branchCode}
              onChangeText={(text) => setBankDetails(prev => ({ ...prev, branchCode: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity onPress={handleNext} className="bg-green-600 rounded-lg py-4 mb-3">
            <Text className="text-white text-center font-bold text-lg">Review</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} className="py-4">
            <Text className="text-center text-gray-600 font-semibold">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ========================================================================
  // STEP 4: REVIEW
  // ========================================================================

  if (currentStep === 'review') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          <Text className="text-3xl font-bold text-gray-900 mb-8">Review Your Information</Text>

          {/* Business Summary */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Business</Text>
            <View className="space-y-2">
              <Text className="text-gray-900"><Text className="font-semibold">Name:</Text> {businessInfo.businessName}</Text>
              <Text className="text-gray-900"><Text className="font-semibold">Type:</Text> {businessInfo.businessType}</Text>
              <Text className="text-gray-900"><Text className="font-semibold">Phone:</Text> {businessInfo.phone}</Text>
            </View>
          </View>

          {/* Location Summary */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Location</Text>
            <View className="space-y-2">
              <Text className="text-gray-900"><Text className="font-semibold">Address:</Text> {location.address}</Text>
              <Text className="text-gray-900"><Text className="font-semibold">City:</Text> {location.city}</Text>
              {location.district && <Text className="text-gray-900"><Text className="font-semibold">District:</Text> {location.district}</Text>}
            </View>
          </View>

          {/* Bank Summary */}
          <View className="bg-gray-50 rounded-lg p-4 mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Bank Account</Text>
            <View className="space-y-2">
              <Text className="text-gray-900"><Text className="font-semibold">Account Name:</Text> {bankDetails.accountName}</Text>
              <Text className="text-gray-900"><Text className="font-semibold">Bank:</Text> {bankDetails.bankName}</Text>
              <Text className="text-gray-900"><Text className="font-semibold">Account Number:</Text> ****{bankDetails.accountNumber.slice(-4)}</Text>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <Text className="text-sm text-blue-900">
              By submitting, you agree to our merchant terms and conditions. We'll verify your information within 1-2 business days.
            </Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity onPress={handleSubmit} className="bg-green-600 rounded-lg py-4 mb-3">
            <Text className="text-white text-center font-bold text-lg">Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentStep('bank')} className="border-2 border-green-600 rounded-lg py-4">
            <Text className="text-green-600 text-center font-bold text-lg">Edit Information</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ========================================================================
  // STEP 5: SUBMITTED
  // ========================================================================

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="items-center">
        <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
          <Text className="text-5xl">✓</Text>
        </View>
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
          Application Submitted!
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          We'll verify your information and get back to you within 1-2 business days.
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          Redirecting to your dashboard...
        </Text>
      </View>
    </View>
  );
}
