import AppText from '@/components/AppText';
import { useEffect, useState } from 'react';





import { View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';





import { useRouter, useLocalSearchParams } from 'expo-router';





import { useAuthStore, useTaskerStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











export default function JobDetailScreen() {





  const router = useRouter();





  const { jobId } = useLocalSearchParams();





  const { user } = useAuthStore();





  const { availableOrders, acceptJob, isLoading } = useTaskerStore();





  const [job, setJob] = useState<any>(null);





  const [isAccepting, setIsAccepting] = useState(false);











  useEffect(() => {





    if (jobId) {





      const foundJob = availableOrders.find(j => j.id === jobId);





      setJob(foundJob);





    }





  }, [jobId, availableOrders]);











  const handleAcceptJob = async () => {





    if (!user?.id || !job) return;











    setIsAccepting(true);





    try {





      await acceptJob(user.id, job.id, job.type);





      Alert.alert('Success', 'Job accepted! Navigate to the pickup location.');





      router.replace(`/(tasker)/DeliveryDetail?orderId=${job.id}`);





    } catch (error: any) {





      Alert.alert('Error', error.message || 'Failed to accept job');





    } finally {





      setIsAccepting(false);





    }





  };











  if (!job) {





    return (





      <View className="flex-1 bg-white items-center justify-center">





        <ActivityIndicator size="large" color="#16A34A" />





      </View>





    );





  }











  return (





    <View className="flex-1 bg-white">





      {/* Header */}





      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">





        <TouchableOpacity onPress={() => router.back()} className="mr-4">





          <Feather name="chevron-left" size={24} color="#1F2937" />





        </TouchableOpacity>





        <View className="flex-1">





          <AppText className="text-2xl font-bold text-gray-900">Job Details</AppText>





        </View>





      </View>











      <ScrollView className="flex-1">





        {/* Job Type Badge */}





        <View className="px-6 py-6">





          <View className={`inline-flex px-4 py-2 rounded-full mb-4 ${





            job.type === 'delivery' ? 'bg-blue-100' : 'bg-purple-100'





          }`}>





            <AppText className={`font-bold ${





              job.type === 'delivery' ? 'text-blue-700' : 'text-purple-700'





            }`}>





              {job.type === 'delivery' ? 'ð DELIVERY' : 'â TASK'}





            </AppText>





          </View>











          {/* Title and Description */}





          <AppText className="text-3xl font-bold text-gray-900 mb-2">{job.title}</AppText>





          <AppText className="text-gray-600 text-lg mb-6">{job.description}</AppText>





        </View>











        {/* Earnings Card */}





        <View className="px-6 py-6 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">





          <View className="flex-row items-center justify-between">





            <View>





              <AppText className="text-gray-600 text-sm mb-1">Estimated Earnings</AppText>





              <AppText className="text-4xl font-bold text-green-600">{job.estimatedPay}K</AppText>





            </View>





            <View>





              <AppText className="text-gray-600 text-sm mb-1 text-right">Est. Time</AppText>





              <AppText className="text-2xl font-bold text-gray-900">{job.estimatedTime}</AppText>





            </View>





          </View>





        </View>











        {/* Locations */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Locations</AppText>











          {/* Pickup */}





          <View className="mb-6">





            <View className="flex-row items-center mb-2">





              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">





                <Feather name="map-pin" size={16} color="#16A34A" />





              </View>





              <AppText className="text-gray-600 text-sm font-semibold">Pickup Location</AppText>





            </View>





            <View className="bg-gray-50 rounded-lg p-4 ml-11">





              <AppText className="text-gray-900 font-semibold mb-1">{job.pickupLocation}</AppText>





              <AppText className="text-gray-600 text-sm">Tap to navigate</AppText>





            </View>





          </View>











          {/* Dropoff */}





          <View>





            <View className="flex-row items-center mb-2">





              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">





                <Feather name="map-pin" size={16} color="#2563EB" />





              </View>





              <AppText className="text-gray-600 text-sm font-semibold">Dropoff Location</AppText>





            </View>





            <View className="bg-gray-50 rounded-lg p-4 ml-11">





              <AppText className="text-gray-900 font-semibold mb-1">{job.dropoffLocation}</AppText>





              <AppText className="text-gray-600 text-sm">Tap to navigate</AppText>





            </View>





          </View>





        </View>











        {/* Additional Details */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Additional Details</AppText>





          <View className="gap-3">





            <View className="flex-row items-center justify-between">





              <View className="flex-row items-center">





                <Feather name="navigation" size={16} color="#6B7280" />





                <AppText className="text-gray-600 ml-3">Distance</AppText>





              </View>





              <AppText className="text-gray-900 font-semibold">{job.distance || '2.5 km'}</AppText>





            </View>





            <View className="flex-row items-center justify-between">





              <View className="flex-row items-center">





                <Feather name="clock" size={16} color="#6B7280" />





                <AppText className="text-gray-600 ml-3">Estimated Duration</AppText>





              </View>





              <AppText className="text-gray-900 font-semibold">{job.estimatedTime}</AppText>





            </View>





            <View className="flex-row items-center justify-between">





              <View className="flex-row items-center">





                <Feather name="user" size={16} color="#6B7280" />





                <AppText className="text-gray-600 ml-3">Customer Rating</AppText>





              </View>





              <View className="flex-row items-center">





                <Feather name="star" size={14} color="#FCD34D" fill="#FCD34D" />





                <AppText className="text-gray-900 font-semibold ml-1">4.8</AppText>





              </View>





            </View>





          </View>





        </View>











        {/* Requirements */}





        <View className="px-6 py-6">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Requirements</AppText>





          <View className="gap-2">





            <View className="flex-row items-center">





              <Feather name="check" size={16} color="#16A34A" />





              <AppText className="text-gray-700 ml-3">Professional and courteous</AppText>





            </View>





            <View className="flex-row items-center">





              <Feather name="check" size={16} color="#16A34A" />





              <AppText className="text-gray-700 ml-3">On-time delivery</AppText>





            </View>





            <View className="flex-row items-center">





              <Feather name="check" size={16} color="#16A34A" />





              <AppText className="text-gray-700 ml-3">Keep items safe and secure</AppText>





            </View>





          </View>





        </View>





      </ScrollView>











      {/* Action Buttons */}





      <View className="px-6 py-6 border-t border-gray-200 gap-3">





        <TouchableOpacity





          onPress={handleAcceptJob}





          disabled={isAccepting || isLoading}





          className={`rounded-lg py-4 flex-row items-center justify-center ${





            isAccepting || isLoading ? 'bg-gray-300' : 'bg-green-600'





          }`}





        >





          {isAccepting || isLoading ? (





            <ActivityIndicator color="white" />





          ) : (





            <>





              <Feather name="check-circle" size={20} color="white" />





              <AppText className="text-white text-center font-bold text-lg ml-2">Accept Job</AppText>





            </>





          )}





        </TouchableOpacity>











        <TouchableOpacity





          onPress={() => router.back()}





          className="bg-gray-100 rounded-lg py-4"





        >





          <AppText className="text-gray-900 text-center font-bold text-lg">Decline</AppText>





        </TouchableOpacity>





      </View>





    </View>





  );





}

















