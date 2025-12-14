import AppText from '@/components/AppText';
import { useState, useEffect } from 'react';





import { View, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';





import { useRouter, useRoute } from 'expo-router';





import { Ionicons } from '@expo/vector-icons';





import { locationService } from '@/src/services/location';











const { width } = Dimensions.get('window');











interface JobStep {





  id: string;





  title: string;





  description: string;





  completed: boolean;





  timestamp?: string;





}











export default function ActiveJobScreen() {





  const router = useRouter();





  const route = useRoute();





  const { jobId } = route.params as any;











  const [currentLocation, setCurrentLocation] = useState<any>(null);





  const [isTracking, setIsTracking] = useState(false);





  const [steps, setSteps] = useState<JobStep[]>([





    {





      id: '1',





      title: 'Navigate to Pickup',





      description: 'Head to the pickup location',





      completed: false,





    },





    {





      id: '2',





      title: 'Arrive at Pickup',





      description: 'Confirm arrival at pickup location',





      completed: false,





    },





    {





      id: '3',





      title: 'Collect Items',





      description: 'Collect items from customer',





      completed: false,





    },





    {





      id: '4',





      title: 'Navigate to Dropoff',





      description: 'Head to the dropoff location',





      completed: false,





    },





    {





      id: '5',





      title: 'Deliver Items',





      description: 'Deliver items to customer',





      completed: false,





    },





  ]);











  const jobData = {





    jobId,





    pickupLocation: 'Downtown Market',





    pickupAddress: '123 Main St, Downtown',





    dropoffLocation: 'Residential Area',





    dropoffAddress: '456 Oak Ave, Suburbs',





    customerName: 'John Doe',





    customerPhone: '+1 (555) 123-4567',





    estimatedEarnings: 2.5,





    distance: 3.2,





    status: 'in_progress',





  };











  useEffect(() => {





    startTracking();





    return () => {





      locationService.stopTracking();





    };





  }, []);











  const startTracking = async () => {





    const location = await locationService.getCurrentLocation();





    if (location) {





      setCurrentLocation(location);





      setIsTracking(true);











      // Start continuous tracking





      await locationService.startTracking((location) => {





        setCurrentLocation(location);





      });





    }





  };











  const handleCompleteStep = (stepId: string) => {





    setSteps(





      steps.map((step) =>





        step.id === stepId





          ? {





              ...step,





              completed: true,





              timestamp: new Date().toLocaleTimeString(),





            }





          : step





      )





    );





  };











  const handleArriveAtPickup = () => {





    Alert.alert('Confirm Arrival', 'Are you at the pickup location?', [





      { text: 'Cancel', style: 'cancel' },





      {





        text: 'Confirm',





        onPress: () => {





          handleCompleteStep('2');





          Alert.alert('Success', 'Arrival confirmed. Collect items from customer.');





        },





      },





    ]);





  };











  const handleCollectItems = () => {





    Alert.alert('Collect Items', 'Have you collected all items?', [





      { text: 'No', style: 'cancel' },





      {





        text: 'Yes',





        onPress: () => {





          handleCompleteStep('3');





          Alert.alert('Success', 'Items collected. Head to dropoff location.');





        },





      },





    ]);





  };











  const handleDelivery = () => {





    Alert.alert('Confirm Delivery', 'Have you delivered all items?', [





      { text: 'No', style: 'cancel' },





      {





        text: 'Yes',





        onPress: () => {





          handleCompleteStep('5');





          Alert.alert('Success', 'Delivery completed! Job finished.', [





            {





              text: 'View Earnings',





              onPress: () => {





                router.push('/(tasker)/EarningsScreen');





              },





            },





          ]);





        },





      },





    ]);





  };











  const handleCancelJob = () => {





    Alert.alert(





      'Cancel Job',





      'Are you sure you want to cancel this job? This may affect your rating.',





      [





        { text: 'Keep Job', style: 'cancel' },





        {





          text: 'Cancel Job',





          onPress: () => {





            router.back();





          },





          style: 'destructive',





        },





      ]





    );





  };











  const completedSteps = steps.filter((s) => s.completed).length;





  const progress = (completedSteps / steps.length) * 100;











  return (





    <View className="flex-1 bg-white">





      {/* Header */}





      <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between">





        <View>





          <AppText className="text-2xl font-bold text-gray-900">Active Job</AppText>





          <AppText className="text-sm text-gray-600 mt-1">Job ID: {jobId}</AppText>





        </View>





        <TouchableOpacity





          onPress={handleCancelJob}





          className="p-2"





        >





          <Ionicons name="close" size={24} color="#EF4444" />





        </TouchableOpacity>





      </View>











      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>





        {/* Progress */}





        <View className="mb-6">





          <View className="flex-row justify-between items-center mb-2">





            <AppText className="text-sm font-semibold text-gray-900">Progress</AppText>





            <AppText className="text-sm text-gray-600">{completedSteps}/{steps.length}</AppText>





          </View>





          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">





            <View





              className="h-full bg-green-500"





              style={{ width: `${progress}%` }}





            />





          </View>





        </View>











        {/* Current Location */}





        {currentLocation && (





          <View className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">





            <AppText className="text-sm text-blue-900 font-semibold mb-2">ð Current Location</AppText>





            <AppText className="text-xs text-blue-700">





              Lat: {currentLocation.latitude.toFixed(4)}, Lon: {currentLocation.longitude.toFixed(4)}





            </AppText>





          </View>





        )}











        {/* Job Details */}





        <View className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Job Details</AppText>











          {/* Pickup */}





          <View className="mb-4">





            <View className="flex-row items-start mb-2">





              <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3 mt-0.5">





                <AppText className="text-white text-xs">ð</AppText>





              </View>





              <View className="flex-1">





                <AppText className="text-sm text-gray-600">Pickup</AppText>





                <AppText className="text-base font-semibold text-gray-900">





                  {jobData.pickupLocation}





                </AppText>





                <AppText className="text-xs text-gray-600 mt-1">





                  {jobData.pickupAddress}





                </AppText>





              </View>





            </View>





          </View>











          {/* Divider */}





          <View className="ml-3 mb-4 border-l-2 border-gray-300 h-4" />











          {/* Dropoff */}





          <View className="mb-4">





            <View className="flex-row items-start">





              <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center mr-3 mt-0.5">





                <AppText className="text-white text-xs">ð</AppText>





              </View>





              <View className="flex-1">





                <AppText className="text-sm text-gray-600">Dropoff</AppText>





                <AppText className="text-base font-semibold text-gray-900">





                  {jobData.dropoffLocation}





                </AppText>





                <AppText className="text-xs text-gray-600 mt-1">





                  {jobData.dropoffAddress}





                </AppText>





              </View>





            </View>





          </View>











          {/* Earnings */}





          <View className="flex-row justify-between items-center p-3 bg-white rounded-lg border border-gray-200 mt-4">





            <AppText className="text-gray-600 font-semibold">Estimated Earnings</AppText>





            <AppText className="text-2xl font-bold text-green-600">





              â­{jobData.estimatedEarnings}





            </AppText>





          </View>





        </View>











        {/* Steps */}





        <AppText className="text-lg font-bold text-gray-900 mb-3">Delivery Steps</AppText>





        {steps.map((step, index) => (





          <View key={step.id} className="mb-3">





            <TouchableOpacity





              onPress={() => {





                if (step.id === '2') handleArriveAtPickup();





                else if (step.id === '3') handleCollectItems();





                else if (step.id === '5') handleDelivery();





              }}





              disabled={step.completed}





              className={`p-4 rounded-lg border-2 ${





                step.completed





                  ? 'bg-green-50 border-green-300'





                  : 'bg-white border-gray-200'





              }`}





            >





              <View className="flex-row items-start">





                <View





                  className={`w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5 ${





                    step.completed ? 'bg-green-500' : 'bg-gray-300'





                  }`}





                >





                  {step.completed ? (





                    <Ionicons name="checkmark" size={16} color="white" />





                  ) : (





                    <AppText className="text-white text-xs font-bold">{index + 1}</AppText>





                  )}





                </View>





                <View className="flex-1">





                  <AppText





                    className={`font-semibold ${





                      step.completed ? 'text-green-900' : 'text-gray-900'





                    }`}





                  >





                    {step.title}





                  </AppText>





                  <AppText





                    className={`text-sm mt-1 ${





                      step.completed ? 'text-green-700' : 'text-gray-600'





                    }`}





                  >





                    {step.description}





                  </AppText>





                  {step.timestamp && (





                    <AppText className="text-xs text-green-600 mt-1">





                      Completed at {step.timestamp}





                    </AppText>





                  )}





                </View>





              </View>





            </TouchableOpacity>





          </View>





        ))}











        {/* Customer Info */}





        <View className="bg-gray-50 rounded-lg p-4 mt-6 border border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-3">Customer Info</AppText>





          <View className="flex-row items-center justify-between mb-3">





            <AppText className="text-gray-900 font-semibold">{jobData.customerName}</AppText>





            <TouchableOpacity className="p-2 bg-green-500 rounded-full">





              <Ionicons name="call" size={20} color="white" />





            </TouchableOpacity>





          </View>





          <AppText className="text-sm text-gray-600">{jobData.customerPhone}</AppText>





        </View>





      </ScrollView>





    </View>





  );





}

















