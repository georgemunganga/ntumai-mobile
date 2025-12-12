// screens/checkout/CheckoutScreen.tsx
import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import {
  MapPin,
  Edit,
  Check,
  X,
  Wallet,
  CreditCard,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Text from '../../components/Text';
import AppText from '../../components/AppText';
import { Ionicons } from '@expo/vector-icons';

// Types
type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
  RateOrder: { orderId: string; orderDetails: any };
  AddLocation: undefined;
};

export type CheckoutScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Checkout'
>;
export type OrderTrackingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderTracking'
>;
export type RateOrderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RateOrder'
>;

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile' | 'cash';
  name: string;
  details: string;
  icon: string;
  isDefault?: boolean;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  isDefault?: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'Home',
    address: 'Plot 123, Lusaka Road, Lusaka, Zambia',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    name: 'Office',
    address: 'Cairo Road, Business District, Lusaka, Zambia',
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'mobile',
    name: 'MTN Mobile Money',
    details: '**** **** 1234',
    icon: '📱',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    name: 'Visa Card',
    details: '**** **** **** 5678',
    icon: '💳',
  },
  {
    id: '3',
    type: 'cash',
    name: 'Cash on Delivery',
    details: 'Pay when order arrives',
    icon: '💵',
  },
];

// Checkout Screen
export function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    mockAddresses[0]
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    mockPaymentMethods[0]
  );
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  return (
    <View className='flex-1 bg-gray-50'>
      <TouchableOpacity
        className='flex-row items-center px-4 py-3 bg-primary'
        onPress={() => {
          // If using react-navigation, you can use navigation.goBack()
          // Otherwise, replace with your go back logic
          if (typeof navigation !== 'undefined' && navigation.goBack) {
            navigation.goBack();
          }
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name='arrow-back'
          size={24}
          color='white'
          style={{ marginRight: 12 }}
        />
        <AppText className='text-white text-lg font-semibold'>Back</AppText>
      </TouchableOpacity>

      <ScrollView className='flex-1'>
        <View className='px-4 py-6'>
          <AppText
            className='text-gray-600 font-bold text-xl text-center'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Checkout
          </AppText>
        </View>

        <View className='px-4 mb-4'>
          <View className='flex-row items-center justify-between'>
            <AppText
              className='text-gray-900 font-bold text-lg'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Shipping
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddLocation')}
            >
              <AppText
                className='text-pink-500 font-medium text-base'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Add Location
              </AppText>
            </TouchableOpacity>
          </View>

          <View className='rounded-2xl p-4  space-y-3 gap-4'>
            <TouchableOpacity
              className='flex-row items-center p-3 bg-[#eeefef] rounded-2xl'
              onPress={() => setSelectedAddress(mockAddresses[0])}
            >
              <View className='w-5 h-5 rounded-full border-2 border-pink-500 items-center justify-center mr-3'>
                <View className='w-2.5 h-2.5 rounded-full bg-pink-500' />
              </View>
              <View className='flex-1'>
                <AppText className='text-gray-900 font-bold text-base'>
                  Home
                </AppText>
                <AppText
                  className='text-gray-500 text-sm'
                  style={{ fontFamily: 'Ubuntu-Regular' }}
                >
                  +255746118766
                </AppText>
                <AppText
                  className='text-gray-500 text-sm'
                  style={{ fontFamily: 'Ubuntu-Regular' }}
                >
                  4158 Lusaka Zambia
                </AppText>
              </View>
              <TouchableOpacity>
                <Edit size={20} color='#EC4899' />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-row items-center p-3 bg-[#eeefef] rounded-2xl'
              onPress={() => setSelectedAddress(mockAddresses[1])}
            >
              <View className='w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center mr-3'></View>
              <View className='flex-1'>
                <AppText className='text-gray-900 font-bold text-base'>
                  Office
                </AppText>
                <AppText
                  className='text-gray-500 text-sm'
                  style={{ fontFamily: 'Ubuntu-Regular' }}
                >
                  +255746118766
                </AppText>
                <AppText
                  className='text-gray-500 text-sm'
                  style={{ fontFamily: 'Ubuntu-Regular' }}
                >
                  4158 Lusaka Zambia
                </AppText>
              </View>
              <TouchableOpacity>
                <Edit size={20} color='#EC4899' />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        <View className='px-4 mb-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <AppText
              className='text-gray-900 font-bold text-lg'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Payment
            </AppText>
            <TouchableOpacity>
              <AppText
                className='text-pink-500 font-medium text-base'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Add Card
              </AppText>
            </TouchableOpacity>
          </View>

          <View className='bg-[#eeefef] rounded-3xl p-4 '>
            <TouchableOpacity
              className='flex-row items-center py-3 px-1 rounded-xl'
              onPress={() => setSelectedPayment(mockPaymentMethods[2])}
            >
              <View className='w-8 h-8 rounded-lg bg-teal-500 items-center justify-center mr-3'>
                <Wallet size={20} color='white' />
              </View>
              <AppText
                className='flex-1 text-gray-900 font-medium text-base'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Cash on Delivery
              </AppText>
              <View className='w-5 h-5 rounded-full border-2 border-pink-500 items-center justify-center'>
                <View className='w-2.5 h-2.5 rounded-full bg-pink-500' />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-row items-center py-3 px-1 rounded-xl'
              onPress={() => setSelectedPayment(mockPaymentMethods[1])}
            >
              <View className='w-8 h-8 rounded-lg bg-teal-500 items-center justify-center mr-3'>
                <CreditCard size={20} color='white' />
              </View>
              <AppText
                className='flex-1 text-gray-900 font-medium text-base'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Visa/Mastercard/JCB
              </AppText>
              <View className='w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center'></View>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-row items-center py-3 px-1 rounded-xl'
              onPress={() => setSelectedPayment(mockPaymentMethods[0])}
            >
              <View className='w-8 h-8 rounded-lg bg-teal-500 items-center justify-center mr-3'>
                <Image
                  source={require('../../assets/pay-pal1.png')}
                  className='w-10 h-10'
                  // resizeMode='contain'
                />
              </View>
              <AppText
                className='flex-1 text-gray-900 font-medium text-base'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                PayPal
              </AppText>
              <View className='w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center'></View>
            </TouchableOpacity>
          </View>
        </View>

        <View className='px-4 mb-36'>
          <AppText
            className='text-gray-900 font-bold text-lg mb-4'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Payment Summary
          </AppText>

          <View className='space-y-3'>
            <View className='flex-row justify-between items-center'>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                Total:
              </AppText>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                K300.00
              </AppText>
            </View>

            <View className='flex-row justify-between items-center'>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                Discount:
              </AppText>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                K0.00
              </AppText>
            </View>

            <View className='flex-row justify-between items-center'>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                Delivery:
              </AppText>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                FREE
              </AppText>
            </View>

            <View className='flex-row justify-between items-center'>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                VAT:
              </AppText>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                K5.30
              </AppText>
            </View>

            <View className='flex-row justify-between items-center'>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                Wallet Discount:
              </AppText>
              <AppText
                className='text-gray-500 text-base'
                style={{ fontFamily: 'Ubuntu-Regular' }}
              >
                K5.30
              </AppText>
            </View>

            <View className='border-b border-gray-200 my-4' />

            <View className='flex-row justify-between items-center'>
              <AppText className='text-gray-500 font-bold text-lg'>
                Grand Total:
              </AppText>
              <AppText className='text-gray-900 font-bold text-lg'>
                K300.00
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className='absolute w-full left-0 right-0 bottom-0 bg-primary rounded-t-3xl px-6 py-6'>
        <View className='flex-row items-center justify-between'>
          <View>
            <AppText className='text-white text-sm mb-1'>
              Total (incl. VAT)
            </AppText>
            <AppText className='text-white text-2xl font-bold'>K2.00</AppText>
          </View>

          <TouchableOpacity
            className='bg-white rounded-full px-8 py-4'
            onPress={() =>
              navigation.navigate('OrderTracking', {
                orderId: '1234567890',
              })
            }
            activeOpacity={0.8}
          >
            <AppText className='text-primary font-bold text-lg'>
              Pay now
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showAddressModal} transparent animationType='slide'>
        <View className='flex-1 bg-black bg-opacity-50 justify-end'>
          <View className='bg-white rounded-t-3xl p-4 max-h-96'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-xl font-bold text-gray-800'>
                Select Address
              </Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <X size={24} color='#9CA3AF' />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {mockAddresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  onPress={() => {
                    setSelectedAddress(address);
                    setShowAddressModal(false);
                  }}
                  className='flex-row items-start p-3 rounded-xl mb-2 border border-gray-200'
                >
                  <MapPin size={20} color='#10B981' />
                  <View className='ml-3 flex-1'>
                    <Text className='text-gray-800 font-medium'>
                      {address.name}
                    </Text>
                    <Text
                      style={{ fontFamily: 'Ubuntu-Regular' }}
                      className='text-gray-600 text-sm'
                    >
                      {address.address}
                    </Text>
                  </View>
                  {selectedAddress.id === address.id && (
                    <Check size={20} color='#10B981' />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showPaymentModal} transparent animationType='slide'>
        <View className='flex-1 bg-black bg-opacity-50 justify-end'>
          <View className='bg-white rounded-t-3xl p-4 max-h-96'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-xl font-bold text-gray-800'>
                Payment Method
              </Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <X size={24} color='#9CA3AF' />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {mockPaymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => {
                    setSelectedPayment(method);
                    setShowPaymentModal(false);
                  }}
                  className='flex-row items-center p-3 rounded-xl mb-2 border border-gray-200'
                >
                  <Text className='text-2xl mr-3'>{method.icon}</Text>
                  <View className='flex-1'>
                    <Text className='text-gray-800 font-medium'>
                      {method.name}
                    </Text>
                    <Text
                      style={{ fontFamily: 'Ubuntu-Regular' }}
                      className='text-gray-600 text-sm'
                    >
                      {method.details}
                    </Text>
                  </View>
                  {selectedPayment.id === method.id && (
                    <Check size={20} color='#10B981' />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
