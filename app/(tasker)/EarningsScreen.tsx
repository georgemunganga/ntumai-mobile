import AppText from '@/components/AppText';
import { useEffect, useState } from 'react';





import { View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';





import { useRouter } from 'expo-router';





import { useAuthStore, useTaskerStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











type Period = 'today' | 'week' | 'month';











export default function EarningsScreen() {





  const router = useRouter();





  const { user } = useAuthStore();





  const { earnings, fetchEarnings, isLoading } = useTaskerStore();





  const [selectedPeriod, setSelectedPeriod] = useState<Period>('today');





  const [transactions, setTransactions] = useState<any[]>([





    {





      id: '1',





      type: 'earning',





      amount: 45,





      description: 'Food delivery - Order #1234',





      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),





      status: 'completed',





    },





    {





      id: '2',





      type: 'earning',





      amount: 30,





      description: 'Package delivery',





      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),





      status: 'completed',





    },





    {





      id: '3',





      type: 'earning',





      amount: 25,





      description: 'Shopping task',





      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),





      status: 'completed',





    },





  ]);











  useEffect(() => {





    if (user?.id) {





      fetchEarnings(user.id, selectedPeriod);





    }





  }, [user, selectedPeriod]);











  const currentEarning = earnings[selectedPeriod];











  return (





    <View className="flex-1 bg-white">





      {/* Header */}





      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">





        <TouchableOpacity onPress={() => router.back()} className="mr-4">





          <Feather name="chevron-left" size={24} color="#1F2937" />





        </TouchableOpacity>





        <AppText className="text-2xl font-bold text-gray-900">Earnings</AppText>





      </View>











      <ScrollView className="flex-1">





        {/* Period Selector */}





        <View className="px-6 py-6">





          <View className="flex-row gap-3">





            {[





              { id: 'today', label: 'Today' },





              { id: 'week', label: 'This Week' },





              { id: 'month', label: 'This Month' },





            ].map(period => (





              <TouchableOpacity





                key={period.id}





                onPress={() => setSelectedPeriod(period.id as Period)}





                className={`flex-1 rounded-lg py-3 ${





                  selectedPeriod === period.id





                    ? 'bg-green-600'





                    : 'bg-gray-100'





                }`}





              >





                <AppText className={`text-center font-bold ${





                  selectedPeriod === period.id ? 'text-white' : 'text-gray-700'





                }`}>





                  {period.label}





                </AppText>





              </TouchableOpacity>





            ))}





          </View>





        </View>











        {/* Earnings Card */}





        <View className="px-6 py-6">





          <View className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8">





            <AppText className="text-green-100 text-sm mb-2">Total Earnings</AppText>





            <AppText className="text-5xl font-bold text-white mb-6">{currentEarning}K</AppText>





            <View className="flex-row items-center justify-between pt-6 border-t border-green-500">





              <View>





                <AppText className="text-green-100 text-xs mb-1">Completed Jobs</AppText>





                <AppText className="text-white font-bold text-lg">12</AppText>





              </View>





              <View>





                <AppText className="text-green-100 text-xs mb-1">Avg per Job</AppText>





                <AppText className="text-white font-bold text-lg">{Math.round(currentEarning / 12)}K</AppText>





              </View>





              <View>





                <AppText className="text-green-100 text-xs mb-1">Rating</AppText>





                <View className="flex-row items-center">





                  <Feather name="star" size={16} color="#FCD34D" fill="#FCD34D" />





                  <AppText className="text-white font-bold text-lg ml-1">4.8</AppText>





                </View>





              </View>





            </View>





          </View>





        </View>











        {/* Breakdown */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Breakdown</AppText>





          <View className="gap-3">





            <View className="flex-row items-center justify-between">





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">





                  <Feather name="package" size={16} color="#2563EB" />





                </View>





                <View>





                  <AppText className="text-gray-900 font-semibold">Deliveries</AppText>





                  <AppText className="text-gray-600 text-xs">8 completed</AppText>





                </View>





              </View>





              <AppText className="text-2xl font-bold text-gray-900">280K</AppText>





            </View>











            <View className="flex-row items-center justify-between">





              <View className="flex-row items-center">





                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">





                  <Feather name="check-square" size={16} color="#7C3AED" />





                </View>





                <View>





                  <AppText className="text-gray-900 font-semibold">Tasks</AppText>





                  <AppText className="text-gray-600 text-xs">4 completed</AppText>





                </View>





              </View>





              <AppText className="text-2xl font-bold text-gray-900">80K</AppText>





            </View>





          </View>





        </View>











        {/* Recent Transactions */}





        <View className="px-6 py-6">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</AppText>





          {isLoading ? (





            <ActivityIndicator color="#16A34A" />





          ) : (





            <FlatList





              data={transactions}





              keyExtractor={(item) => item.id}





              scrollEnabled={false}





              renderItem={({ item }) => (





                <View className="flex-row items-center justify-between py-4 border-b border-gray-100">





                  <View className="flex-row items-center flex-1">





                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${





                      item.type === 'earning' ? 'bg-green-100' : 'bg-red-100'





                    }`}>





                      <Feather





                        name={item.type === 'earning' ? 'arrow-down-left' : 'arrow-up-right'}





                        size={16}





                        color={item.type === 'earning' ? '#16A34A' : '#EF4444'}





                      />





                    </View>





                    <View className="flex-1">





                      <AppText className="text-gray-900 font-semibold">{item.description}</AppText>





                      <AppText className="text-gray-600 text-xs">





                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}





                      </AppText>





                    </View>





                  </View>





                  <AppText className={`text-lg font-bold ${





                    item.type === 'earning' ? 'text-green-600' : 'text-red-600'





                  }`}>





                    {item.type === 'earning' ? '+' : '-'}{item.amount}K





                  </AppText>





                </View>





              )}





            />





          )}





        </View>





      </ScrollView>











      {/* Withdrawal Button */}





      <View className="px-6 py-6 border-t border-gray-200">





        <TouchableOpacity className="bg-green-600 rounded-lg py-4">





          <AppText className="text-white text-center font-bold text-lg">Withdraw Earnings</AppText>





        </TouchableOpacity>





      </View>





    </View>





  );





}

















