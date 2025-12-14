import AppText from '@/components/AppText';
import { useState, useEffect } from 'react';





import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';





import { useRouter } from 'expo-router';





import { useCartStore, useOrderStore, useUserStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











export default function CheckoutScreen() {





  const router = useRouter();





  const { items, totalPrice, deliveryFee } = useCartStore();





  const { createOrder, isLoading } = useOrderStore();





  const { addresses, getAddresses } = useUserStore();





  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);





  const [selectedPayment, setSelectedPayment] = useState<'card' | 'cash'>('card');





  const [isProcessing, setIsProcessing] = useState(false);











  useEffect(() => {





    getAddresses();





  }, []);











  const tax = Math.round(totalPrice * 0.1);





  const total = totalPrice + deliveryFee + tax;











  const handlePlaceOrder = async () => {





    if (!selectedAddress) {





      alert('Please select a delivery address');





      return;





    }











    setIsProcessing(true);





    try {





      const address = addresses.find(a => a.id === selectedAddress);





      if (!address) return;











      const order = await createOrder({





        items,





        deliveryAddress: address,





        paymentMethod: selectedPayment,





        totalAmount: total,





        deliveryFee,





      });











      if (order) {





        router.replace(`/(customer)/OrderTracking?orderId=${order.id}`);





      }





    } finally {





      setIsProcessing(false);





    }





  };











  if (!addresses.length) {





    return (





      <View className="flex-1 bg-white">





        <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">





          <TouchableOpacity onPress={() => router.back()} className="mr-4">





            <Feather name="chevron-left" size={24} color="#1F2937" />





          </TouchableOpacity>





          <AppText className="text-2xl font-bold text-gray-900">Checkout</AppText>





        </View>





        <View className="flex-1 items-center justify-center">





          <ActivityIndicator size="large" color="#16A34A" />





        </View>





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





        <AppText className="text-2xl font-bold text-gray-900">Checkout</AppText>





      </View>











      <ScrollView className="flex-1">





        {/* Delivery Address */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Delivery Address</AppText>





          {addresses.map(address => (





            <TouchableOpacity





              key={address.id}





              onPress={() => setSelectedAddress(address.id)}





              className={`border-2 rounded-lg p-4 mb-3 flex-row items-center ${





                selectedAddress === address.id





                  ? 'border-green-600 bg-green-50'





                  : 'border-gray-200'





              }`}





            >





              <View className="flex-1">





                <AppText className="text-lg font-semibold text-gray-900 mb-1">





                  {address.type.toUpperCase()}





                </AppText>





                <AppText className="text-gray-600">





                  {address.street}, {address.city}





                </AppText>





                <AppText className="text-gray-500 text-sm">





                  {address.state}, {address.zipCode}





                </AppText>





              </View>





              {selectedAddress === address.id && (





                <Feather name="check-circle" size={24} color="#16A34A" />





              )}





            </TouchableOpacity>





          ))}





          <TouchableOpacity





            onPress={() => router.push('/(customer)/AddLocation')}





            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"





          >





            <Feather name="plus" size={24} color="#9CA3AF" />





            <AppText className="text-gray-600 font-semibold mt-2">Add New Address</AppText>





          </TouchableOpacity>





        </View>











        {/* Payment Method */}





        <View className="px-6 py-6 border-b border-gray-200">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Payment Method</AppText>





          <TouchableOpacity





            onPress={() => setSelectedPayment('card')}





            className={`border-2 rounded-lg p-4 mb-3 flex-row items-center ${





              selectedPayment === 'card'





                ? 'border-green-600 bg-green-50'





                : 'border-gray-200'





            }`}





          >





            <Feather name="credit-card" size={24} color={selectedPayment === 'card' ? '#16A34A' : '#9CA3AF'} />





            <View className="flex-1 ml-4">





              <AppText className="text-lg font-semibold text-gray-900">Credit/Debit Card</AppText>





              <AppText className="text-gray-600 text-sm">Visa, Mastercard</AppText>





            </View>





            {selectedPayment === 'card' && (





              <Feather name="check-circle" size={24} color="#16A34A" />





            )}





          </TouchableOpacity>











          <TouchableOpacity





            onPress={() => setSelectedPayment('cash')}





            className={`border-2 rounded-lg p-4 flex-row items-center ${





              selectedPayment === 'cash'





                ? 'border-green-600 bg-green-50'





                : 'border-gray-200'





            }`}





          >





            <Feather name="dollar-sign" size={24} color={selectedPayment === 'cash' ? '#16A34A' : '#9CA3AF'} />





            <View className="flex-1 ml-4">





              <AppText className="text-lg font-semibold text-gray-900">Cash on Delivery</AppText>





              <AppText className="text-gray-600 text-sm">Pay when order arrives</AppText>





            </View>





            {selectedPayment === 'cash' && (





              <Feather name="check-circle" size={24} color="#16A34A" />





            )}





          </TouchableOpacity>





        </View>











        {/* Order Summary */}





        <View className="px-6 py-6">





          <AppText className="text-lg font-bold text-gray-900 mb-4">Order Summary</AppText>





          <View className="bg-gray-50 rounded-lg p-4 gap-3">





            <View className="flex-row items-center justify-between">





              <AppText className="text-gray-600">Subtotal</AppText>





              <AppText className="text-gray-900 font-semibold">{totalPrice}K</AppText>





            </View>





            <View className="flex-row items-center justify-between">





              <AppText className="text-gray-600">Tax (10%)</AppText>





              <AppText className="text-gray-900 font-semibold">{tax}K</AppText>





            </View>





            <View className="flex-row items-center justify-between">





              <AppText className="text-gray-600">Delivery Fee</AppText>





              <AppText className="text-gray-900 font-semibold">{deliveryFee}K</AppText>





            </View>





            <View className="border-t border-gray-200 pt-3 flex-row items-center justify-between">





              <AppText className="text-lg font-bold text-gray-900">Total</AppText>





              <AppText className="text-2xl font-bold text-green-600">{total}K</AppText>





            </View>





          </View>





        </View>





      </ScrollView>











      {/* Place Order Button */}





      <View className="px-6 py-6 border-t border-gray-200 bg-white">





        <TouchableOpacity





          onPress={handlePlaceOrder}





          disabled={isProcessing || isLoading || !selectedAddress}





          className={`rounded-lg py-4 flex-row items-center justify-center ${





            isProcessing || isLoading || !selectedAddress ? 'bg-gray-300' : 'bg-green-600'





          }`}





        >





          {isProcessing || isLoading ? (





            <ActivityIndicator color="white" />





          ) : (





            <AppText className="text-white text-center font-bold text-lg">Place Order</AppText>





          )}





        </TouchableOpacity>





      </View>





    </View>





  );





}

















