import AppText from '@/components/AppText';
import { useEffect, useState } from 'react';





import { View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';





import { useRouter, useLocalSearchParams } from 'expo-router';





import { useDeliveryStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











const DeliverySteps = [





  { id: 'accepted', label: 'Tasker Accepted', icon: 'check-circle' },





  { id: 'pickup', label: 'Picking Up', icon: 'package' },





  { id: 'in_transit', label: 'In Transit', icon: 'truck' },





  { id: 'delivered', label: 'Delivered', icon: 'home' },





];











export default function DeliveryTrackingScreen() {





  const router = useRouter();





  const { deliveryId } = useLocalSearchParams();





  const { getDeliveryDetail, selectedDelivery, isLoading } = useDeliveryStore();





  const [currentStep, setCurrentStep] = useState(0);











  useEffect(() => {





    if (deliveryId) {





      getDeliveryDetail(deliveryId as string);





    }





  }, [deliveryId]);











  useEffect(() => {





    if (selectedDelivery) {





      const stepIndex = DeliverySteps.findIndex(s => s.id === selectedDelivery.status);





      setCurrentStep(Math.max(0, stepIndex));





    }





  }, [selectedDelivery]);











  if (isLoading || !selectedDelivery) {





    return (





      <View className="flex-1 bg-white items-center justify-center">





        <ActivityIndicator size="large" color="#16A34A" />





      </View>





    );





  }











  const isDelivered = selectedDelivery.status === 'delivered';





  const estimatedDelivery = new Date(selectedDelivery.estimatedDeliveryTime);











  return (





    <View className="flex-1 bg-white">





      {/* Header */}





      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">





        <TouchableOpacity onPress={() => router.back()} className="mr-4">





          <Feather name="chevron-left" size={24} color="#1F2937" />





        </TouchableOpacity>





        <View className="flex-1">





          <AppText className="text-2xl font-bold text-gray-900">Parcel Delivery</AppText>





          <AppText className="text-gray-600 text-sm">{new Date(selectedDelivery.createdAt).toLocaleDateString()}</AppText>





        </View>





      </View>











      <ScrollView className="flex-1">





        {/* Status Card */}





        <View className="px-6 py-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">





          <View className="flex-row items-center justify-between mb-4">





            <View>





              <AppText className="text-gray-600 text-sm mb-1">Current Status</AppText>





              <AppText className="text-2xl font-bold text-gray-900 capitalize">





                {selectedDelivery.status.replace('_', ' ')}





              </AppText>





            </View>





            <View className={`px-4 py-2 rounded-full ${





              isDelivered ? 'bg-green-100' : 'bg-yellow-100'





            }`}>





              <AppText className={`font-bold text-sm ${





                isDelivered ? 'text-green-700' : 'text-yellow-700'





              }`}>





                {isDelivered ? 'â Delivered' : 'â± In Progress'}





              </AppText>





            </View>





          </View>











          {!isDelivered && (





            <AppText className="text-gray-600 text-sm">





              Estimated delivery: {estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}





            </AppText>





          )}





        </View>











        {/* Timeline */}





        <View className="px-6 py-8">





          <AppText className="text-lg font-bold text-gray-900 mb-6">Delivery Timeline</AppText>











          {DeliverySteps.map((step, index) => {





            const isCompleted = index <= currentStep;





            const isCurrent = index === currentStep;











            return (





              <View key={step.id} className="mb-6 flex-row">





                {/* Timeline Line and Circle */}





                <View className="items-center mr-4">





                  <View className={`w-12 h-12 rounded-full items-center justify-center ${





                    isCompleted ? 'bg-green-600' : 'bg-gray-200'





                  }`}>





                    <Feather





                      name={isCompleted ? 'check' : step.icon as any}





                      size={24}





                      color={isCompleted ? 'white' : '#9CA3AF'}





                    />





                  </View>





                  {index < DeliverySteps.length - 1 && (





                    <View className={`w-1 h-12 ${





                      isCompleted ? 'bg-green-600' : 'bg-gray-200'





                    }`} />





                  )}





                </View>











                {/* Step Info */}





                <View className="flex-1 pt-2">





                  <AppText className={`text-lg font-bold ${





                    isCompleted ? 'text-gray-900' : 'text-gray-400'





                  }`}>





                    {step.label}





                  </AppText>





                  {isCurrent && !isDelivered && (





                    <AppText className="text-green-600 text-sm font-semibold mt-1">In progress...</AppText>





                  )}





                </View>





              </View>





            );





          })}





        </View>











        {/* Tasker Info */}





        {selectedDelivery.tasker && (





          <View className="px-6 py-6 border-t border-gray-200">





            <AppText className="text-lg font-bold text-gray-900 mb-4">Your Tasker</AppText>





            <View className="bg-gray-50 rounded-lg p-4 flex-row items-center">





              <Image





                source={{ uri: selectedDelivery.tasker.avatar }}





                className="w-16 h-16 rounded-full mr-4"





              />





              <View className="flex-1">





                <AppText className="text-lg font-bold text-gray-900">{selectedDelivery.tasker.name}</AppText>





                <View className="flex-row items-center mt-2">





                  <Feather name="star" size={16} color="#FCD34D" fill="#FCD34D" />





                  <AppText className="text-gray-700 font-semibold ml-1">{selectedDelivery.tasker.rating}</AppText>





                </View>





              </View>





              <TouchableOpacity className="bg-green-600 rounded-full p-3">





                <Feather name="phone" size={20} color="white" />





              </TouchableOpacity>





            </View>





          </View>





        )}











        {/* Parcel Details */}





        <View className="px-6 py-6 border-t border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Parcel Details</AppText>





          <View className="bg-gray-50 rounded-lg p-4 gap-3">





            <View className="flex-row items-start justify-between">





              <View className="flex-1">





                <AppText className="text-gray-600 text-sm">Description</AppText>





                <AppText className="text-gray-900 font-semibold mt-1">





                  {selectedDelivery.parcelDetails.description}





                </AppText>





              </View>





            </View>





            <View className="border-t border-gray-200 pt-3 flex-row items-center justify-between">





              <AppText className="text-gray-600">Size</AppText>





              <AppText className="text-gray-900 font-semibold capitalize">





                {selectedDelivery.parcelDetails.size}





              </AppText>





            </View>





            {selectedDelivery.parcelDetails.fragile && (





              <View className="border-t border-gray-200 pt-3 flex-row items-center">





                <Feather name="alert-circle" size={16} color="#EF4444" />





                <AppText className="text-red-600 font-semibold ml-2">Fragile Items</AppText>





              </View>





            )}





          </View>





        </View>











        {/* Locations */}





        <View className="px-6 py-6 border-t border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Locations</AppText>





          <View className="gap-4">





            {/* Pickup */}





            <View className="bg-gray-50 rounded-lg p-4 flex-row items-start">





              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4 mt-1">





                <Feather name="map-pin" size={20} color="#16A34A" />





              </View>





              <View className="flex-1">





                <AppText className="text-gray-600 text-sm">Pickup From</AppText>





                <AppText className="text-gray-900 font-semibold mt-1">





                  {selectedDelivery.pickupAddress}





                </AppText>





              </View>





            </View>











            {/* Dropoff */}





            <View className="bg-gray-50 rounded-lg p-4 flex-row items-start">





              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4 mt-1">





                <Feather name="map-pin" size={20} color="#2563EB" />





              </View>





              <View className="flex-1">





                <AppText className="text-gray-600 text-sm">Deliver To</AppText>





                <AppText className="text-gray-900 font-semibold mt-1">





                  {selectedDelivery.dropoffLocation}





                </AppText>





              </View>





            </View>





          </View>





        </View>











        {/* Price Summary */}





        <View className="px-6 py-6 border-t border-gray-200">





          <View className="bg-gray-50 rounded-lg p-4">





            <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-200">





              <AppText className="text-gray-600">Delivery Cost</AppText>





              <AppText className="text-gray-900 font-semibold">{selectedDelivery.price}K</AppText>





            </View>





            <View className="flex-row items-center justify-between">





              <AppText className="text-lg font-bold text-gray-900">Total</AppText>





              <AppText className="text-2xl font-bold text-green-600">{selectedDelivery.price}K</AppText>





            </View>





          </View>





        </View>





      </ScrollView>











      {/* Action Buttons */}





      {isDelivered && (





        <View className="px-6 py-6 border-t border-gray-200 gap-3">





          <TouchableOpacity className="bg-green-600 rounded-lg py-4">





            <AppText className="text-white text-center font-bold text-lg">Rate Delivery</AppText>





          </TouchableOpacity>





          <TouchableOpacity





            onPress={() => router.push('/(customer)/Home')}





            className="bg-gray-100 rounded-lg py-4"





          >





            <AppText className="text-gray-900 text-center font-bold text-lg">Back to Home</AppText>





          </TouchableOpacity>





        </View>





      )}





    </View>





  );





}

















