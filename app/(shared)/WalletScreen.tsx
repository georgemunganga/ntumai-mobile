import AppText from '@/components/AppText';
import { useState } from 'react';





import { View, TouchableOpacity, ScrollView, FlatList } from 'react-native';





import { useRouter } from 'expo-router';





import { useWalletStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











export default function WalletScreen() {





  const router = useRouter();





  const { balance, transactions } = useWalletStore();





  const [selectedFilter, setSelectedFilter] = useState<'all' | 'credit' | 'debit'>('all');











  const filteredTransactions = transactions.filter(t => {





    if (selectedFilter === 'all') return true;





    return selectedFilter === 'credit' ? t.amount > 0 : t.amount < 0;





  });











  return (





    <View className="flex-1 bg-white">





      {/* Header */}





      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">





        <TouchableOpacity onPress={() => router.back()} className="mr-4">





          <Feather name="chevron-left" size={24} color="#1F2937" />





        </TouchableOpacity>





        <AppText className="text-2xl font-bold text-gray-900">Wallet</AppText>





      </View>











      <ScrollView className="flex-1">





        {/* Balance Card */}





        <View className="px-6 py-8">





          <View className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 mb-6">





            <AppText className="text-green-100 text-sm mb-2">Available Balance</AppText>





            <AppText className="text-5xl font-bold text-white mb-8">{balance}K</AppText>





            <View className="flex-row items-center justify-between pt-6 border-t border-green-500">





              <View>





                <AppText className="text-green-100 text-xs mb-1">Pending</AppText>





                <AppText className="text-white font-bold">0K</AppText>





              </View>





              <View>





                <AppText className="text-green-100 text-xs mb-1">Total Earned</AppText>





                <AppText className="text-white font-bold">12,500K</AppText>





              </View>





              <View>





                <AppText className="text-green-100 text-xs mb-1">Total Spent</AppText>





                <AppText className="text-white font-bold">8,200K</AppText>





              </View>





            </View>





          </View>











          {/* Action Buttons */}





          <View className="flex-row gap-3">





            <TouchableOpacity className="flex-1 bg-green-600 rounded-lg py-4">





              <View className="flex-row items-center justify-center">





                <Feather name="plus-circle" size={20} color="white" />





                <AppText className="text-white font-bold ml-2">Add Money</AppText>





              </View>





            </TouchableOpacity>





            <TouchableOpacity className="flex-1 bg-blue-600 rounded-lg py-4">





              <View className="flex-row items-center justify-center">





                <Feather name="send" size={20} color="white" />





                <AppText className="text-white font-bold ml-2">Send Money</AppText>





              </View>





            </TouchableOpacity>





          </View>





        </View>











        {/* Transaction Filters */}





        <View className="px-6 py-4 border-t border-gray-200">





          <View className="flex-row gap-2">





            {['all', 'credit', 'debit'].map(filter => (





              <TouchableOpacity





                key={filter}





                onPress={() => setSelectedFilter(filter as any)}





                className={`px-4 py-2 rounded-full ${





                  selectedFilter === filter ? 'bg-green-600' : 'bg-gray-100'





                }`}





              >





                <AppText className={`font-semibold capitalize ${





                  selectedFilter === filter ? 'text-white' : 'text-gray-700'





                }`}>





                  {filter}





                </AppText>





              </TouchableOpacity>





            ))}





          </View>





        </View>











        {/* Transactions List */}





        <View className="px-6 py-6">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</AppText>





          <FlatList





            data={filteredTransactions}





            keyExtractor={(item) => item.id}





            scrollEnabled={false}





            renderItem={({ item }) => {





              const isCredit = item.amount > 0;





              return (





                <View className="flex-row items-center justify-between py-4 border-b border-gray-100">





                  <View className="flex-row items-center flex-1">





                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${





                      isCredit ? 'bg-green-100' : 'bg-red-100'





                    }`}>





                      <Feather





                        name={isCredit ? 'arrow-down-left' : 'arrow-up-right'}





                        size={20}





                        color={isCredit ? '#16A34A' : '#EF4444'}





                      />





                    </View>





                    <View className="flex-1">





                      <AppText className="text-gray-900 font-semibold">{item.description}</AppText>





                      <AppText className="text-gray-600 text-xs mt-1">





                        {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}





                      </AppText>





                    </View>





                  </View>





                  <View className="items-end">





                    <AppText className={`text-lg font-bold ${





                      isCredit ? 'text-green-600' : 'text-red-600'





                    }`}>





                      {isCredit ? '+' : ''}{item.amount}K





                    </AppText>





                    <AppText className={`text-xs font-semibold ${





                      item.status === 'completed' ? 'text-green-600' : 'text-yellow-600'





                    }`}>





                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}





                    </AppText>





                  </View>





                </View>





              );





            }}





          />





        </View>





      </ScrollView>





    </View>





  );





}

















