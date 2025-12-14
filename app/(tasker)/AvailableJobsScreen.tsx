import AppText from '@/components/AppText';
import { useEffect, useState } from 'react';





import { View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';





import { useRouter } from 'expo-router';





import { useAuthStore, useTaskerStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











export default function AvailableJobsScreen() {





  const router = useRouter();





  const { user } = useAuthStore();





  const { availableOrders, fetchAvailableJobs, isLoading } = useTaskerStore();





  const [refreshing, setRefreshing] = useState(false);





  const [filterType, setFilterType] = useState<'all' | 'delivery' | 'task'>('all');











  useEffect(() => {





    if (user?.id) {





      fetchAvailableJobs(user.id, 0, 0);





    }





  }, [user]);











  const handleRefresh = async () => {





    setRefreshing(true);





    if (user?.id) {





      await fetchAvailableJobs(user.id, 0, 0);





    }





    setRefreshing(false);





  };











  const filteredJobs = availableOrders.filter(job => {





    if (filterType === 'all') return true;





    return job.type === filterType;





  });











  return (





    <View className="flex-1 bg-white">





      {/* Header */}





      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">





        <TouchableOpacity onPress={() => router.back()} className="mr-4">





          <Feather name="chevron-left" size={24} color="#1F2937" />





        </TouchableOpacity>





        <View className="flex-1">





          <AppText className="text-2xl font-bold text-gray-900">Available Jobs</AppText>





          <AppText className="text-gray-600 text-sm">{filteredJobs.length} jobs available</AppText>





        </View>





      </View>











      {/* Filter Tabs */}





      <View className="bg-white flex-row border-b border-gray-200 px-6">





        {[





          { id: 'all', label: 'All Jobs' },





          { id: 'delivery', label: 'Deliveries' },





          { id: 'task', label: 'Tasks' },





        ].map(tab => (





          <TouchableOpacity





            key={tab.id}





            onPress={() => setFilterType(tab.id as any)}





            className={`py-4 px-4 border-b-2 ${





              filterType === tab.id ? 'border-green-600' : 'border-transparent'





            }`}





          >





            <AppText className={`font-semibold ${





              filterType === tab.id ? 'text-green-600' : 'text-gray-600'





            }`}>





              {tab.label}





            </AppText>





          </TouchableOpacity>





        ))}





      </View>











      {/* Jobs List */}





      {isLoading && !refreshing ? (





        <View className="flex-1 items-center justify-center">





          <ActivityIndicator size="large" color="#16A34A" />





        </View>





      ) : filteredJobs.length > 0 ? (





        <FlatList





          data={filteredJobs}





          keyExtractor={(item) => item.id}





          refreshControl={





            <RefreshControl





              refreshing={refreshing}





              onRefresh={handleRefresh}





              colors={['#16A34A']}





            />





          }





          renderItem={({ item }) => (





            <TouchableOpacity





              onPress={() => router.push(`/(tasker)/JobDetail?jobId=${item.id}`)}





              className="px-6 py-4 border-b border-gray-100"





            >





              <View className="flex-row items-start justify-between mb-3">





                <View className="flex-1">





                  <View className="flex-row items-center mb-2">





                    <AppText className="text-lg font-bold text-gray-900 flex-1">{item.title}</AppText>





                    <View className={`px-3 py-1 rounded-full ${





                      item.type === 'delivery' ? 'bg-blue-100' : 'bg-purple-100'





                    }`}>





                      <AppText className={`text-xs font-bold ${





                        item.type === 'delivery' ? 'text-blue-700' : 'text-purple-700'





                      }`}>





                        {item.type.toUpperCase()}





                      </AppText>





                    </View>





                  </View>





                  <AppText className="text-gray-600 text-sm line-clamp-2">





                    {item.description}





                  </AppText>





                </View>





              </View>











              {/* Location and Details */}





              <View className="bg-gray-50 rounded-lg p-3 mb-3">





                <View className="flex-row items-center mb-2">





                  <Feather name="map-pin" size={14} color="#6B7280" />





                  <AppText className="text-gray-600 text-xs ml-2 flex-1">





                    {item.pickupLocation}





                  </AppText>





                </View>





                <View className="flex-row items-center">





                  <Feather name="arrow-down" size={14} color="#9CA3AF" />





                  <AppText className="text-gray-600 text-xs ml-2 flex-1">





                    {item.dropoffLocation}





                  </AppText>





                </View>





              </View>











              {/* Footer */}





              <View className="flex-row items-center justify-between">





                <View className="flex-row items-center gap-4">





                  <View className="flex-row items-center">





                    <Feather name="clock" size={14} color="#6B7280" />





                    <AppText className="text-gray-600 text-xs ml-1">{item.estimatedTime}</AppText>





                  </View>





                  <View className="flex-row items-center">





                    <Feather name="navigation" size={14} color="#6B7280" />





                    <AppText className="text-gray-600 text-xs ml-1">{item.distance || '2.5 km'}</AppText>





                  </View>





                </View>





                <View className="items-end">





                  <AppText className="text-2xl font-bold text-green-600">{item.estimatedPay}K</AppText>





                  <AppText className="text-gray-600 text-xs">Est. earnings</AppText>





                </View>





              </View>





            </TouchableOpacity>





          )}





        />





      ) : (





        <View className="flex-1 items-center justify-center">





          <Feather name="inbox" size={64} color="#D1D5DB" />





          <AppText className="text-2xl font-bold text-gray-900 mt-4">No jobs available</AppText>





          <AppText className="text-gray-600 text-center mt-2 px-6">





            Check back soon or adjust your location to see more opportunities





          </AppText>





          <TouchableOpacity





            onPress={handleRefresh}





            className="bg-green-600 rounded-lg px-8 py-3 mt-6"





          >





            <AppText className="text-white font-bold">Refresh</AppText>





          </TouchableOpacity>





        </View>





      )}





    </View>





  );





}

















