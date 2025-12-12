import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../../components/HeaderBar';
import {
  CreditCard,
  DollarSign,
  Search,
  SlidersHorizontal,
} from 'lucide-react-native';

interface VendorReportsProps {
  navigation: any;
}

interface Order {
  id: string;
  restaurantName: string;
  orderId: string;
  date: string;
  time: string;
  price: string;
  status: 'Paid' | 'Unpaid';
  image: string;
}

interface Transaction {
  id: string;
  restaurantName: string;
  description: string;
  amount: string;
  date: string;
  image: string;
}

const VendorReports: React.FC<VendorReportsProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Order report');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock order data
  const orders: Order[] = [
    {
      id: '1',
      restaurantName: 'Madindigo Restaurant',
      orderId: '01218327BSJ93D',
      date: 'Jan 27, 2025',
      time: '10:35 AM',
      price: 'K9.50',
      status: 'Unpaid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      restaurantName: 'Madindigo Restaurant',
      orderId: '01218327BSJ93D',
      date: 'Jan 27, 2025',
      time: '10:35 AM',
      price: 'K9.50',
      status: 'Paid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      restaurantName: 'Madindigo Restaurant',
      orderId: '01218327BSJ93D',
      date: 'Jan 27, 2025',
      time: '10:35 AM',
      price: 'K9.50',
      status: 'Unpaid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '4',
      restaurantName: 'Madindigo Restaurant',
      orderId: '01218327BSJ93D',
      date: 'Jan 27, 2025',
      time: '10:35 AM',
      price: 'K9.50',
      status: 'Paid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '6',
      restaurantName: 'New Horizon Cafe',
      orderId: '01218327BSJ94E',
      date: 'Feb 1, 2025',
      time: '11:45 AM',
      price: 'K22.00',
      status: 'Paid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '7',
      restaurantName: 'New Horizon Cafe',
      orderId: '01218327BSJ94E',
      date: 'Feb 1, 2025',
      time: '11:45 AM',
      price: 'K22.00',
      status: 'Paid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '8',
      restaurantName: 'New Horizon Cafe',
      orderId: '01218327BSJ94E',
      date: 'Feb 1, 2025',
      time: '11:45 AM',
      price: 'K22.00',
      status: 'Paid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '9',
      restaurantName: 'New Horizon Cafe',
      orderId: '01218327BSJ94E',
      date: 'Feb 1, 2025',
      time: '11:45 AM',
      price: 'K22.00',
      status: 'Paid',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
  ];

  // Mock transaction data for Payment report
  const transactions: Transaction[] = [
    {
      id: '1',
      restaurantName: 'Madindigo Restaurant',
      description: 'Top up for UDM',
      amount: 'K 9.50',
      date: 'Jan 25, 2021',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      restaurantName: 'Madindigo Restaurant',
      description: 'Top up for UDM',
      amount: 'K 9.50',
      date: 'Jan 25, 2021',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      restaurantName: 'Izoniq 1 Stop',
      description: 'Amanda foodpoint',
      amount: 'K 9.50',
      date: 'Feb 25, 2021',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
    {
      id: '4',
      restaurantName: 'Izoniq 1 Stop',
      description: 'Amanda foodpoint',
      amount: 'K 9.50',
      date: 'Feb 25, 2021',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    },
  ];

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const renderOrderModal = () => (
    <Modal
      visible={showOrderModal}
      transparent={true}
      animationType='slide'
      onRequestClose={handleCloseModal}
    >
      <Pressable className='flex-1 bg-opacity-50' onPress={handleCloseModal}>
        <View className='flex-1 justify-end'>
          <Pressable className='bg-white rounded-t-3xl p-6'>
            <View className='flex-row items-center mb-6'>
              <View className='rounded-full p-3'>
                <DollarSign size={32} color='#0aaf97' />
              </View>
              <Text className='text-black font-bold text-3xl'>
                {selectedOrder?.price}
              </Text>
            </View>

            <View className='space-y-4'>
              <View className='flex-row justify-between items-center'>
                <Text className='text-gray-500 text-base'>Name</Text>
                <Text className='text-black font-medium text-base'>
                  {selectedOrder?.restaurantName}
                </Text>
              </View>

              <View className='flex-row justify-between items-center'>
                <Text className='text-gray-500 text-base'>Tax ID</Text>
                <Text className='text-black font-medium text-base'>
                  {selectedOrder?.orderId}
                </Text>
              </View>

              <View className='flex-row justify-between items-center'>
                <Text className='text-gray-500 text-base'>
                  Transaction Date
                </Text>
                <Text className='text-black font-medium text-base'>
                  {selectedOrder?.date} {selectedOrder?.time}
                </Text>
              </View>

              <View className='flex-row justify-between items-center'>
                <Text className='text-gray-500 text-base'>Remarks</Text>
                <Text className='text-black font-medium text-base'>
                  Pay in App using my Credit Card
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  const renderOrderReport = () => (
    <View className='mb-6'>
      <Text className='text-black font-bold text-lg mb-4'>Order Report</Text>
      <View className='flex-row flex-wrap justify-between'>
        <View className='w-[48%] bg-[#eeeeee] rounded-2xl p-4 mb-3'>
          <Text className='text-primary font-medium text-xl mb-1'>Today</Text>
          <Text className='text-black font-bold text-2xl text-right pt-7'>
            35
          </Text>
        </View>
        <View className='w-[48%] bg-[#eeeeee] rounded-2xl p-4 mb-3'>
          <Text className='text-primary font-medium text-xl mb-1'>
            Yesterday
          </Text>
          <Text className='text-black font-bold text-2xl text-right pt-7'>
            43
          </Text>
        </View>
        <View className='w-[48%] bg-[#eeeeee] rounded-2xl p-4 mb-3'>
          <Text className='text-primary font-medium text-xl mb-1'>
            This Week
          </Text>
          <Text className='text-black font-bold text-2xl text-right pt-7'>
            100
          </Text>
        </View>
        <View className='w-[48%] bg-[#eeeeee] rounded-2xl p-4 mb-3'>
          <Text className='text-primary font-medium text-xl mb-1'>Total</Text>
          <Text className='text-black font-bold text-2xl text-right pt-7'>
            1500
          </Text>
        </View>
      </View>
    </View>
  );

  const renderIncomeReport = () => (
    <View className='mb-6'>
      <Text className='text-black font-bold text-lg mb-4'>Income Report</Text>
      <View className='flex-row flex-wrap justify-between'>
        <View className='w-[48%] bg-[#eeeeee] rounded-xl p-4 mb-3'>
          <Text className='text-primary font-medium text-xl mb-1'>Today</Text>
          <Text className='text-black font-bold text-2xl text-right pt-7'>
            K14,592.00
          </Text>
        </View>
        <View className='w-[48%] bg-[#eeeeee] rounded-xl p-4 mb-3'>
          <Text className='text-primary font-medium text-xl mb-1'>
            Yesterday
          </Text>
          <Text className='text-black font-bold text-2xl text-right pt-7'>
            K2,374.10
          </Text>
        </View>
        <View className='flex-row justify-between'>
          <View className='w-[32%] bg-[#eeeeee] rounded-xl p-4 mb-3'>
            <Text className='text-primary font-medium text-xl mb-1'>
              This Week
            </Text>
            <Text className='text-black font-bold text-2xl text-right pt-7'>
              K14,592.00
            </Text>
          </View>
          <View className='w-[32%] bg-[#eeeeee] rounded-xl p-4 mb-3'>
            <Text className='text-primary font-medium text-xl mb-1'>
              This Month
            </Text>
            <Text className='text-black font-bold text-2xl text-right pt-7'>
              K14,592.00
            </Text>
          </View>
          <View className='w-[32%] bg-[#eeeeee] rounded-xl p-4 mb-3'>
            <Text className='text-primary font-medium text-xl mb-1'>
              This Year
            </Text>
            <Text className='text-black font-bold text-2xl text-right pt-7'>
              K14,592.00
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderOrderList = () => (
    <View className='flex-1'>
      <View className='flex-row items-center mb-4'>
        <View className='flex-row items-center bg-gray-100 rounded-full px-3 py-2 flex-1 mr-2'>
          <Search size={20} color='#9CA3AF' />
          <TextInput
            className='flex-1 ml-2 text-gray-700'
            placeholder='Search'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <SlidersHorizontal size={20} color='#9CA3AF' />
        </View>
      </View>
      <ScrollView className='flex-1'>
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className='bg-[#eeeeee] rounded-xl p-4 mb-3'
            onPress={() => handleOrderPress(order)}
          >
            <View className='flex-row items-start'>
              <View className='w-16 h-16 rounded-lg overflow-hidden mr-3'>
                <Image
                  source={{ uri: order.image }}
                  className='w-full h-full'
                  resizeMode='cover'
                />
              </View>

              <View className='flex-1'>
                <Text className='font-bold text-black text-base mb-1'>
                  {order.restaurantName}
                </Text>
                <Text className='text-gray-600 text-sm mb-1'>
                  Order: {order.orderId}
                </Text>
                <Text className='text-gray-600 text-sm'>
                  {order.date} {order.time}
                </Text>
              </View>

              <View className='items-end'>
                <Text
                  className={`font-bold text-lg mb-2 ${
                    order.status === 'Paid'
                      ? 'text-[#0aaf97]'
                      : 'text-[#ed4877]'
                  }`}
                >
                  {order.price}
                </Text>
                <View
                  className={`px-3 py-1 rounded-full ${
                    order.status === 'Paid' ? 'bg-[#0aaf97]' : 'bg-[#ed4877]'
                  }`}
                >
                  <Text className='text-white text-xs font-medium'>
                    {order.status}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPaymentReport = () => {
    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);

    return (
      <View className='flex-1'>
        <View className='bg-[#0aaf97] p-6 mb-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center'>
              <View className='w-12 h-12 rounded-full bg-white mr-3'>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                  }}
                  className='w-full h-full rounded-full'
                  resizeMode='cover'
                />
              </View>
              <Text className='text-white font-semibold text-lg'>Gibson</Text>
            </View>
            <Image
              source={require('../../assets/splash_logo.png')}
              style={{ width: 80, height: 30 }}
            />
          </View>

          <Text className='text-white text-4xl py-4 font-bold mb-2 w-full text-center tracking-wider'>
            1 3 2 0 7 5 1 3 9
          </Text>

          <View className='flex-row justify-between items-end'>
            <View>
              <Text className='text-white text-sm opacity-90'>Balance:</Text>
              <Text className='text-white text-2xl font-bold'>K 250.00</Text>
            </View>
            <View className='items-end'>
              <Text className='text-white text-sm opacity-90'>
                Member since
              </Text>
              <Text className='text-white text-lg font-semibold'>
                Jan 25, 2021
              </Text>
            </View>
          </View>
        </View>

        <View className='flex-row justify-end mb-4'>
          <TouchableOpacity>
            <Text className='text-[#55c2fd] text-sm'>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        <View className='flex-1'>
          <Text className='text-black font-bold text-xl mb-2'>
            Recent Transactions
          </Text>

          <ScrollView className='flex-1'>
            {Object.entries(groupedTransactions).map(
              ([date, dateTransactions]) => (
                <View key={date} className='mb-6'>
                  <View className='flex-row justify-between items-center mb-3'>
                    <Text className='text-gray-500 text-base'>{date}</Text>
                    <TouchableOpacity>
                      <Text className='text-[#0aaf97] text-sm font-medium'>
                        View All
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className='bg-gray-100 rounded-2xl p-4 '>
                    {dateTransactions.map((transaction) => (
                      <View
                        key={transaction.id}
                        className=' mb-4 flex-row items-center'
                      >
                        <View className='w-14 h-14 rounded-full overflow-hidden mr-3'>
                          <Image
                            source={{ uri: transaction.image }}
                            className='w-full h-full'
                            resizeMode='cover'
                          />
                        </View>
                        <View className='flex-1'>
                          <Text className='text-black font-medium text-base'>
                            {transaction.restaurantName}
                          </Text>
                          <Text className='text-gray-600 text-sm'>
                            {transaction.description}
                          </Text>
                        </View>
                        <Text className='text-[#ed4877] font-bold text-base'>
                          {transaction.amount}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <HeaderBar />
      {/* <View className='flex-row items-center p-4'>
        <TouchableOpacity onPress={handleBackPress} className='mr-4'>
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-black'>Reports</Text>
      </View> */}

      <ScrollView className='flex-1 p-4'>
        <FlatList
          horizontal
          data={['All', 'Order report', 'Payment report']}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 4 }}
          style={{ marginBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(tab)}
              className={`py-3 px-4 rounded-full ${
                activeTab === tab
                  ? 'bg-[#0aaf97]'
                  : 'bg-white border border-[#0aaf97]'
              }`}
            >
              <Text
                className={`text-center font-medium w-[110px] ${
                  activeTab === tab ? 'text-white' : 'text-[#0aaf97]'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )}
        />

        {activeTab === 'All' && (
          <>
            <View className='bg-[#eeeeee] rounded-full p-2 mb-6 shadow-sm'>
              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center'>
                  <View className=' p-2 mr-3'>
                    <CreditCard size={24} color='#0aaf97' />
                  </View>
                  <Text className='text-[#495057] font-bold text-2xl'>
                    K1500
                  </Text>
                </View>
                <TouchableOpacity className='bg-[#0aaf97] rounded-full px-5 py-4'>
                  <Text className='text-white font-medium'>View Data</Text>
                </TouchableOpacity>
              </View>
            </View>

            {renderOrderReport()}

            {renderIncomeReport()}
          </>
        )}

        {activeTab === 'Order report' && renderOrderList()}

        {activeTab === 'Payment report' && renderPaymentReport()}
      </ScrollView>

      {activeTab === 'All' && (
        <View className='bg-[#0aaf97] rounded-xl p-8 mx-4 mb-4'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center'>
              <DollarSign size={24} color='white' />
              <Text className='text-white font-semibold text-xl ml-2'>
                Total Paid
              </Text>
            </View>
            <Text className='text-white font-bold text-xl'>K 253.95</Text>
          </View>
        </View>
      )}

      {renderOrderModal()}
    </SafeAreaView>
  );
};

export default VendorReports;
