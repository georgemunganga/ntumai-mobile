// VendorHeader.tsx
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../components/Text";

export function VendorHeader() {
  return (
    <View className="bg-emerald-600 px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">

      <View className="flex-row items-center">
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          className="w-10 h-10 rounded-full mr-3 bg-white"
        />
        <View>
          <Text style={{fontFamily:'Ubuntu-Bold'}} className="text-white font-semibold text-lg">Hi, Gibson</Text>
          <Text style={{fontFamily:'Ubuntu-Bold'}} className="text-white text-xs">Stay safe</Text>
        </View>
      </View>

      <TouchableOpacity>
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
