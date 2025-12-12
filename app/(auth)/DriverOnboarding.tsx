import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

type OnboardingStep = 'vehicle' | 'documents' | 'bank' | 'review' | 'submitted';

export default function DriverOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('vehicle');

  // Form state
  const [vehicleType, setVehicleType] = useState<'motorcycle' | 'car' | 'bicycle' | null>(null);
  const [vehicleModel, setVehicleModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [documents, setDocuments] = useState({
    driverLicense: false,
    vehicleRegistration: false,
    insurance: false,
  });
  const [bankAccount, setBankAccount] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
  });

  const handleVehicleSelection = (type: 'motorcycle' | 'car' | 'bicycle') => {
    setVehicleType(type);
  };

  const handleDocumentUpload = (doc: keyof typeof documents) => {
    // In real app, this would open file picker
    setDocuments(prev => ({ ...prev, [doc]: true }));
    Alert.alert('Success', `${doc} uploaded successfully`);
  };

  const handleSubmit = () => {
    // Validate all fields
    if (!vehicleType || !vehicleModel || !licensePlate) {
      Alert.alert('Error', 'Please fill in all vehicle details');
      return;
    }

    if (!Object.values(documents).every(v => v)) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    if (!bankAccount.accountName || !bankAccount.accountNumber || !bankAccount.bankName) {
      Alert.alert('Error', 'Please fill in all bank details');
      return;
    }

    setCurrentStep('submitted');
  };

  const handleSkip = () => {
    router.replace('/(tasker)/DriverDashboard');
  };

  // Step 1: Vehicle Information
  if (currentStep === 'vehicle') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-600">Vehicle Information</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">What vehicle do you use?</Text>
          </View>

          {/* Vehicle Options */}
          <View className="gap-3 mb-8">
            {[
              { type: 'motorcycle' as const, label: 'Motorcycle', icon: '🏍️' },
              { type: 'car' as const, label: 'Car', icon: '🚗' },
              { type: 'bicycle' as const, label: 'Bicycle', icon: '🚴' },
            ].map(option => (
              <TouchableOpacity
                key={option.type}
                onPress={() => handleVehicleSelection(option.type)}
                className={`border-2 rounded-lg p-4 flex-row items-center ${
                  vehicleType === option.type
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <Text className="text-3xl mr-4">{option.icon}</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">{option.label}</Text>
                </View>
                {vehicleType === option.type && (
                  <Feather name="check-circle" size={24} color="#16A34A" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Vehicle Details */}
          {vehicleType && (
            <>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Vehicle Model</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="e.g., Honda CB200, Toyota Corolla"
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="mb-8">
                <Text className="text-sm font-semibold text-gray-700 mb-2">License Plate</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 uppercase"
                  placeholder="e.g., ABC 123"
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TouchableOpacity
                onPress={() => setCurrentStep('documents')}
                className="bg-green-600 rounded-lg py-4"
              >
                <Text className="text-white text-center font-bold text-lg">Continue</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={handleSkip} className="py-4 mt-4">
            <Text className="text-center text-gray-600 font-semibold">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 2: Documents
  if (currentStep === 'documents') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-600">Documents</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">Upload required documents</Text>
          </View>

          {/* Document Upload Items */}
          <View className="gap-3 mb-8">
            {[
              { key: 'driverLicense' as const, label: 'Driver License', icon: '🪪' },
              { key: 'vehicleRegistration' as const, label: 'Vehicle Registration', icon: '📋' },
              { key: 'insurance' as const, label: 'Insurance Certificate', icon: '📄' },
            ].map(doc => (
              <TouchableOpacity
                key={doc.key}
                onPress={() => handleDocumentUpload(doc.key)}
                className={`border-2 rounded-lg p-4 flex-row items-center ${
                  documents[doc.key]
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 border-dashed'
                }`}
              >
                <Text className="text-3xl mr-4">{doc.icon}</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">{doc.label}</Text>
                  <Text className="text-sm text-gray-600">
                    {documents[doc.key] ? '✓ Uploaded' : 'Tap to upload'}
                  </Text>
                </View>
                {documents[doc.key] && (
                  <Feather name="check-circle" size={24} color="#16A34A" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setCurrentStep('bank')}
            disabled={!Object.values(documents).every(v => v)}
            className={`rounded-lg py-4 ${
              Object.values(documents).every(v => v) ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} className="py-4 mt-4">
            <Text className="text-center text-gray-600 font-semibold">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 3: Bank Account
  if (currentStep === 'bank') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-600">Bank Account</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">Where should we send your earnings?</Text>
          </View>

          {/* Bank Details Form */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Account Holder Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Your full name"
              value={bankAccount.accountName}
              onChangeText={(text) => setBankAccount(prev => ({ ...prev, accountName: text }))}
              placeholderTextColor="#9CA3AF"
            />

            <Text className="text-sm font-semibold text-gray-700 mb-2">Bank Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="e.g., Zanaco, Standard Chartered"
              value={bankAccount.bankName}
              onChangeText={(text) => setBankAccount(prev => ({ ...prev, bankName: text }))}
              placeholderTextColor="#9CA3AF"
            />

            <Text className="text-sm font-semibold text-gray-700 mb-2">Account Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Your account number"
              value={bankAccount.accountNumber}
              onChangeText={(text) => setBankAccount(prev => ({ ...prev, accountNumber: text }))}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={() => setCurrentStep('review')}
            className="bg-green-600 rounded-lg py-4 mb-4"
          >
            <Text className="text-white text-center font-bold text-lg">Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} className="py-4">
            <Text className="text-center text-gray-600 font-semibold">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 4: Review
  if (currentStep === 'review') {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
          <Text className="text-3xl font-bold text-gray-900 mb-8">Review Your Information</Text>

          {/* Vehicle Summary */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Vehicle</Text>
            <Text className="text-lg font-bold text-gray-900 mb-1">{vehicleType?.toUpperCase()}</Text>
            <Text className="text-gray-600">{vehicleModel} • {licensePlate}</Text>
          </View>

          {/* Documents Summary */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Documents</Text>
            {Object.entries(documents).map(([key, uploaded]) => (
              <View key={key} className="flex-row items-center mb-2">
                <Feather name={uploaded ? 'check-circle' : 'circle'} size={20} color={uploaded ? '#16A34A' : '#D1D5DB'} />
                <Text className="ml-2 text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Text>
              </View>
            ))}
          </View>

          {/* Bank Summary */}
          <View className="bg-gray-50 rounded-lg p-4 mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Bank Account</Text>
            <Text className="text-gray-600">{bankAccount.accountName}</Text>
            <Text className="text-gray-600">{bankAccount.bankName}</Text>
            <Text className="text-gray-600">****{bankAccount.accountNumber.slice(-4)}</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-600 rounded-lg py-4 mb-4"
          >
            <Text className="text-white text-center font-bold text-lg">Submit Application</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentStep('vehicle')} className="py-4">
            <Text className="text-center text-gray-600 font-semibold">Back to Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Step 5: Submitted
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12 justify-center items-center">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
          <Feather name="check" size={40} color="#16A34A" />
        </View>

        <Text className="text-3xl font-bold text-gray-900 text-center mb-3">Application Submitted!</Text>
        <Text className="text-lg text-gray-600 text-center mb-8">
          Thank you for applying! We'll review your information and get back to you within 24 hours.
        </Text>

        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 w-full">
          <Text className="text-blue-900 font-semibold mb-2">📧 What's next?</Text>
          <Text className="text-blue-800 text-sm">
            We'll send you an email with updates on your application status. In the meantime, you can start exploring the app as a customer.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(customer)/CustomerDashboard')}
          className="bg-green-600 rounded-lg py-4 w-full"
        >
          <Text className="text-white text-center font-bold text-lg">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
