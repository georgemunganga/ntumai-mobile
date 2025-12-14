import AppText from '@/components/AppText';
import { useState, useEffect } from 'react';





import { View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Share, Clipboard } from 'react-native';





import { Ionicons } from '@expo/vector-icons';





import { referralMockService } from '@/src/api/mockServices.extended';











export default function ReferralScreen() {





  const [referralData, setReferralData] = useState<any>(null);





  const [loading, setLoading] = useState(true);





  const [referralCode, setReferralCode] = useState('');





  const [applyingCode, setApplyingCode] = useState(false);





  const [copiedCode, setCopiedCode] = useState(false);











  useEffect(() => {





    loadReferralData();





  }, []);











  const loadReferralData = async () => {





    try {





      const response = await referralMockService.getReferralCode('user_1');





      if (response.success) {





        setReferralData(response.data);





      }





    } catch (error) {





      Alert.alert('Error', 'Failed to load referral data');





    } finally {





      setLoading(false);





    }





  };











  const handleCopyCode = async () => {





    try {





      await Clipboard.setString(referralData.referralCode);





      setCopiedCode(true);





      setTimeout(() => setCopiedCode(false), 2000);





    } catch (error) {





      Alert.alert('Error', 'Failed to copy code');





    }





  };











  const handleShareCode = async () => {





    try {





      await Share.share({





        message: `Join Ntumai using my referral code: ${referralData.referralCode}. Get â­5 credit when you sign up!`,





        title: 'Ntumai Referral',





      });





    } catch (error) {





      Alert.alert('Error', 'Failed to share code');





    }





  };











  const handleApplyCode = async () => {





    if (!referralCode.trim()) {





      Alert.alert('Error', 'Please enter a referral code');





      return;





    }











    setApplyingCode(true);





    try {





      const response = await referralMockService.applyReferralCode(





        referralCode.trim()





      );





      if (response.success) {





        Alert.alert('Success', response.data.message);





        setReferralCode('');





      }





    } catch (error) {





      Alert.alert('Error', 'Invalid referral code');





    } finally {





      setApplyingCode(false);





    }





  };











  if (loading) {





    return (





      <View className="flex-1 justify-center items-center bg-white">





        <ActivityIndicator size="large" color="#FF6B35" />





      </View>





    );





  }











  return (





    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>





      {/* Header */}





      <View className="bg-white border-b border-gray-200 px-4 py-4">





        <AppText className="text-2xl font-bold text-gray-900">Referrals & Rewards</AppText>





        <AppText className="text-sm text-gray-600 mt-1">





          Earn credits by referring friends





        </AppText>





      </View>











      <View className="px-4 py-4">





        {/* Your Referral Code */}





        <View className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 mb-6 text-white">





          <AppText className="text-white text-sm opacity-90 mb-2">Your Referral Code</AppText>





          <AppText className="text-white text-3xl font-bold mb-4 tracking-wider">





            {referralData?.referralCode}





          </AppText>





          <View className="flex-row gap-2">





            <TouchableOpacity





              onPress={handleCopyCode}





              className="flex-1 bg-white bg-opacity-20 py-2 rounded-lg flex-row items-center justify-center"





            >





              <Ionicons name="copy" size={18} color="white" />





              <AppText className="text-white font-semibold ml-2">





                {copiedCode ? 'Copied!' : 'Copy'}





              </AppText>





            </TouchableOpacity>





            <TouchableOpacity





              onPress={handleShareCode}





              className="flex-1 bg-white bg-opacity-20 py-2 rounded-lg flex-row items-center justify-center"





            >





              <Ionicons name="share-social" size={18} color="white" />





              <AppText className="text-white font-semibold ml-2">Share</AppText>





            </TouchableOpacity>





          </View>





        </View>











        {/* Earnings Summary */}





        <View className="grid grid-cols-2 gap-4 mb-6">





          <View className="bg-white rounded-lg p-4 border border-gray-200">





            <AppText className="text-gray-600 text-sm mb-1">Total Referrals</AppText>





            <AppText className="text-3xl font-bold text-gray-900">





              {referralData?.totalReferrals}





            </AppText>





          </View>





          <View className="bg-white rounded-lg p-4 border border-gray-200">





            <AppText className="text-gray-600 text-sm mb-1">Total Earnings</AppText>





            <AppText className="text-3xl font-bold text-green-600">





              â­{referralData?.totalEarnings.toFixed(2)}





            </AppText>





          </View>





        </View>











        {/* Pending Earnings */}





        {referralData?.pendingEarnings > 0 && (





          <View className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">





            <View className="flex-row items-center justify-between">





              <View>





                <AppText className="text-yellow-900 text-sm">Pending Earnings</AppText>





                <AppText className="text-2xl font-bold text-yellow-900 mt-1">





                  â­{referralData?.pendingEarnings.toFixed(2)}





                </AppText>





              </View>





              <Ionicons name="hourglass" size={32} color="#D97706" />





            </View>





            <AppText className="text-xs text-yellow-700 mt-2">





              These will be credited after your referrals complete their first order





            </AppText>





          </View>





        )}











        {/* How It Works */}





        <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">How It Works</AppText>





          <View className="space-y-3">





            <View className="flex-row items-start">





              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-0.5">





                <AppText className="text-white text-sm font-bold">1</AppText>





              </View>





              <AppText className="text-gray-700 flex-1">Share your referral code with friends</AppText>





            </View>





            <View className="flex-row items-start">





              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-0.5">





                <AppText className="text-white text-sm font-bold">2</AppText>





              </View>





              <AppText className="text-gray-700 flex-1">





                They sign up using your code





              </AppText>





            </View>





            <View className="flex-row items-start">





              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-0.5">





                <AppText className="text-white text-sm font-bold">3</AppText>





              </View>





              <AppText className="text-gray-700 flex-1">





                They complete their first order





              </AppText>





            </View>





            <View className="flex-row items-start">





              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-0.5">





                <AppText className="text-white text-sm font-bold">4</AppText>





              </View>





              <AppText className="text-gray-700 flex-1">





                You both get â­5 credit!





              </AppText>





            </View>





          </View>





        </View>











        {/* Apply Referral Code */}





        <View className="bg-white rounded-lg p-4 border border-gray-200 mb-6">





          <AppText className="text-lg font-bold text-gray-900 mb-3">Have a Referral Code?</AppText>





          <TextInput





            value={referralCode}





            onChangeText={setReferralCode}





            placeholder="Enter referral code"





            className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-3 border border-gray-200"





            placeholderTextColor="#999"





          />





          <TouchableOpacity





            onPress={handleApplyCode}





            disabled={applyingCode}





            className={`py-3 rounded-lg ${





              applyingCode ? 'bg-gray-300' : 'bg-blue-500'





            }`}





          >





            <AppText className="text-center text-white font-bold">





              {applyingCode ? 'Applying...' : 'Apply Code'}





            </AppText>





          </TouchableOpacity>





        </View>











        {/* Terms */}





        <View className="bg-gray-100 rounded-lg p-4 mb-6">





          <AppText className="text-xs text-gray-600 leading-5">





            <AppText className="font-bold">Terms: </AppText>





            Referral credits are valid for 30 days. One referral code per user. Credits cannot be transferred or refunded.





          </AppText>





        </View>





      </View>





    </ScrollView>





  );





}

















