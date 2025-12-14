import AppText from '@/components/AppText';
import { useState, useEffect } from 'react';





import { View, TouchableOpacity, Animated, Dimensions, Alert, Vibration } from 'react-native';





import { useRouter, useRoute } from 'expo-router';





import { Ionicons } from '@expo/vector-icons';











const { width, height } = Dimensions.get('window');











export default function JobOfferScreen() {





  const router = useRouter();





  const route = useRoute();





  const [timeLeft, setTimeLeft] = useState(30);





  const [swipeProgress] = useState(new Animated.Value(0));





  const [isAccepting, setIsAccepting] = useState(false);











  const jobData = {





    jobId: 'job_123',





    pickupLocation: 'Downtown Market',





    dropoffLocation: 'Residential Area',





    estimatedEarnings: 2.5,





    distance: 3.2,





    type: 'delivery',





  };











  // Timer





  useEffect(() => {





    const timer = setInterval(() => {





      setTimeLeft((prev) => {





        if (prev <= 1) {





          handleReject();





          return 0;





        }





        return prev - 1;





      });





    }, 1000);











    return () => clearInterval(timer);





  }, []);











  // Vibration on mount





  useEffect(() => {





    Vibration.vibrate([0, 500, 200, 500]);





  }, []);











  const handleAccept = async () => {





    setIsAccepting(true);





    Vibration.vibrate(200);











    // Simulate API call





    setTimeout(() => {





      Alert.alert('Success', 'Job accepted! Navigate to pickup location.', [





        {





          text: 'Start Navigation',





          onPress: () => {





            router.push({





              pathname: '/(tasker)/ActiveJobScreen',





              params: { jobId: jobData.jobId },





            });





          },





        },





      ]);





    }, 500);





  };











  const handleReject = () => {





    Vibration.vibrate(100);





    router.back();





  };











  return (





    <View className="flex-1 bg-gradient-to-b from-orange-500 to-orange-600">





      {/* Header with Timer */}





      <View className="pt-8 pb-4 px-4">





        <View className="flex-row justify-between items-center">





          <AppText className="text-white text-lg font-bold">New Job Offer</AppText>





          <View className={`px-3 py-1 rounded-full ${





            timeLeft <= 10 ? 'bg-red-500' : 'bg-white'





          }`}>





            <AppText className={`font-bold ${





              timeLeft <= 10 ? 'text-white' : 'text-orange-600'





            }`}>





              {timeLeft}s





            </AppText>





          </View>





        </View>





      </View>











      {/* Main Content */}





      <View className="flex-1 justify-center items-center px-4">





        {/* Job Icon */}





        <View className="mb-6">





          <View className="w-20 h-20 bg-white rounded-full items-center justify-center">





            <Ionicons name="car" size={40} color="#FF6B35" />





          </View>





        </View>











        {/* Job Details */}





        <View className="bg-white rounded-2xl p-6 w-full mb-6">





          {/* Earnings */}





          <View className="mb-6 items-center">





            <AppText className="text-gray-600 text-sm mb-1">Estimated Earnings</AppText>





            <AppText className="text-4xl font-bold text-orange-600">





              â­{jobData.estimatedEarnings}





            </AppText>





          </View>











          {/* Route */}





          <View className="mb-6">





            {/* Pickup */}





            <View className="flex-row items-start mb-4">





              <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3 mt-1">





                <AppText className="text-white text-xs">ð</AppText>





              </View>





              <View className="flex-1">





                <AppText className="text-gray-600 text-xs">Pickup</AppText>





                <AppText className="text-gray-900 font-semibold">





                  {jobData.pickupLocation}





                </AppText>





              </View>





            </View>











            {/* Divider */}





            <View className="ml-3 mb-4 border-l-2 border-gray-300 h-4" />











            {/* Dropoff */}





            <View className="flex-row items-start">





              <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center mr-3 mt-1">





                <AppText className="text-white text-xs">ð</AppText>





              </View>





              <View className="flex-1">





                <AppText className="text-gray-600 text-xs">Dropoff</AppText>





                <AppText className="text-gray-900 font-semibold">





                  {jobData.dropoffLocation}





                </AppText>





              </View>





            </View>





          </View>











          {/* Distance */}





          <View className="flex-row justify-between items-center p-3 bg-gray-100 rounded-lg">





            <AppText className="text-gray-600">Distance</AppText>





            <AppText className="text-gray-900 font-semibold">{jobData.distance} km</AppText>





          </View>





        </View>





      </View>











      {/* Action Buttons */}





      <View className="px-4 pb-8">





        {/* Accept Button */}





        <TouchableOpacity





          onPress={handleAccept}





          disabled={isAccepting}





          className="bg-white py-4 rounded-full mb-3 active:opacity-80"





        >





          <AppText className="text-center text-orange-600 font-bold text-lg">





            {isAccepting ? 'Accepting...' : 'â Swipe to Accept'}





          </AppText>





        </TouchableOpacity>











        {/* Reject Button */}





        <TouchableOpacity





          onPress={handleReject}





          className="bg-orange-700 py-3 rounded-full active:opacity-80"





        >





          <AppText className="text-center text-white font-semibold">â Decline</AppText>





        </TouchableOpacity>





      </View>





    </View>





  );





}











