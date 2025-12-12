import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store';
import { Feather } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Picture */}
        <View className="px-6 py-8 items-center border-b border-gray-200">
          <View className="relative mb-4">
            <Image
              source={{ uri: user?.avatar }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-green-600 rounded-full p-3">
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-600 text-sm">Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <View className="px-6 py-6">
          {/* First Name */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">First Name *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="First name"
              value={formData.firstName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Last Name */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Last Name *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Email *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Email address"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Phone */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Phone</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Bio */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Bio</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 h-24"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              multiline
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-6 border-t border-gray-200 gap-3">
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className={`rounded-lg py-4 flex-row items-center justify-center ${
            isLoading ? 'bg-gray-300' : 'bg-green-600'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Feather name="save" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-100 rounded-lg py-4"
        >
          <Text className="text-gray-900 text-center font-bold text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

