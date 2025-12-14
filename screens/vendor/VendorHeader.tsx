// VendorHeader.tsx
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "@/components/AppText";

export function VendorHeader() {
  return (
    <View className="bg-emerald-600 px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">

      <View className="flex-row items-center">
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          className="w-10 h-10 rounded-full mr-3 bg-white"
        />
        <View>
          <AppText variant="subtitle" weight="bold" className="text-white">Hi, Gibson</AppText>
          <AppText variant="caption" weight="bold" className="text-white">Stay safe</AppText>
        </View>
      </View>

      <TouchableOpacity>
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
