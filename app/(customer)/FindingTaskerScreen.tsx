import AppText from '@/components/AppText';
import { useState, useEffect } from 'react';





import { View, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';





import { useMatchingStore } from '@/src/store/slices/matchingSlice';





import { useRouter } from 'expo-router';











const { width, height } = Dimensions.get('window');











export default function FindingTaskerScreen({ route }: any) {





  const { jobData, pickupLocation } = route.params;





  const router = useRouter();





  const [mapMarkers, setMapMarkers] = useState<any[]>([]);





  const [elapsedTime, setElapsedTime] = useState(0);











  const {





    isMatching,





    matchedTasker,





    availableTaskers,





    estimatedWaitTime,





    matchingProgress,





    startMatching,





    cancelMatching,





    getAvailableTaskers,





  } = useMatchingStore();











  useEffect(() => {





    // Start matching





    startMatching(jobData);





    getAvailableTaskers(pickupLocation);











    // Timer





    const timer = setInterval(() => {





      setElapsedTime((prev) => prev + 1);





    }, 1000);











    return () => clearInterval(timer);





  }, []);











  useEffect(() => {





    // Simulate map markers





    const markers = availableTaskers.map((tasker, index) => ({





      id: tasker.id,





      name: tasker.name,





      latitude: tasker.latitude,





      longitude: tasker.longitude,





      rating: tasker.rating,





      distance: tasker.distance,





      isMatched: matchedTasker?.taskerId === tasker.id,





    }));





    setMapMarkers(markers);





  }, [availableTaskers, matchedTasker]);











  // When tasker is matched





  useEffect(() => {





    if (matchedTasker && !isMatching) {





      // Navigate to active order screen after 2 seconds





      setTimeout(() => {





        router.push({





          pathname: '/(customer)/OrderTrackingScreen',





          params: {





            orderId: jobData.id,





            taskerId: matchedTasker.taskerId,





            taskerName: matchedTasker.taskerName,





            taskerPhoto: matchedTasker.taskerPhoto,





          },





        });





      }, 2000);





    }





  }, [matchedTasker, isMatching]);











  const handleCancel = () => {





    cancelMatching();





    router.back();





  };











  return (





    <View className="flex-1 bg-white">





      {/* Map Area (Placeholder) */}





      <Map>





        <View className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 relative">





          {/* Simulated Map */}





          <View className="flex-1 items-center justify-center">





            <View className="w-64 h-64 rounded-full border-4 border-blue-300 items-center justify-center">





              {/* Pickup Location */}





              <View className="w-4 h-4 bg-green-500 rounded-full absolute" />











              {/* Available Taskers */}





              {mapMarkers.map((marker, index) => (





                <View





                  key={marker.id}





                  className={`w-8 h-8 rounded-full absolute items-center justify-center ${





                    marker.isMatched ? 'bg-blue-600' : 'bg-orange-500'





                  }`}





                  style={{





                    transform: [





                      {





                        rotate: `${(index * 360) / mapMarkers.length}deg`,





                      },





                    ],





                    marginTop: -80,





                  }}





                >





                  <AppText className="text-white text-xs font-bold">





                    {marker.name?.charAt(0)?.toUpperCase() || 'T'}





                  </AppText>





                </View>





              ))}





            </View>











            {/* Matching Status */}





            <View className="mt-8 items-center">





              <AppText className="text-lg font-bold text-gray-900 mb-2">





                Finding the Right Tasker...





              </AppText>





              <View className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">





                <Animated.View





                  className="h-full bg-blue-500"





                  style={{





                    width: `${matchingProgress}%`,





                  }}





                />





              </View>





              <AppText className="text-sm text-gray-600 mt-2">





                {matchingProgress}% complete





              </AppText>





            </View>





          </View>





        </View>





      </Map>











      {/* Info Panel */}





      <View className="bg-white border-t border-gray-200 p-4">





        {/* Estimated Wait Time */}





        <View className="mb-4">





          <AppText className="text-sm text-gray-600 mb-1">Estimated Wait Time</AppText>





          <AppText className="text-2xl font-bold text-gray-900">





            {estimatedWaitTime}





          </AppText>





        </View>











        {/* Available Taskers Count */}





        <View className="mb-4 p-3 bg-blue-50 rounded-lg">





          <AppText className="text-sm text-gray-700">





            {availableTaskers.length} taskers available nearby





          </AppText>





        </View>











        {/* Matched Tasker Info */}





        {matchedTasker && (





          <View className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">





            <AppText className="text-sm font-semibold text-green-900 mb-1">





              Tasker Found!





            </AppText>





            <AppText className="text-base font-bold text-green-900">





              {matchedTasker.taskerName}





            </AppText>





            <AppText className="text-sm text-green-700">





              Rating: {matchedTasker.rating} stars - ETA: {matchedTasker.estimatedArrival} min





            </AppText>





          </View>





        )}











        {/* Elapsed Time */}





        <View className="mb-4 text-center">





          <AppText className="text-xs text-gray-500">





            Searching for {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}





          </AppText>





        </View>











        {/* Cancel Button */}





        <TouchableOpacity





          onPress={handleCancel}





          className="bg-gray-100 py-3 rounded-lg"





        >





          <AppText className="text-center text-gray-900 font-semibold">





            Cancel





          </AppText>





        </TouchableOpacity>





      </View>





    </View>





  );





}











// Placeholder Map component





function Map({ children }: any) {





  return <View className="flex-1">{children}</View>;





}











