// @ts-nocheck

import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VendorHeader } from './VendorHeader';
import Text from '../../components/Text';

export function VendorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  
  const stats = [
    { title: 'Total Orders', value: '125', change: '+12%', color: '#10B981' },
    { title: 'Revenue', value: 'K2,540', change: '+8%', color: '#3B82F6' },
    { title: 'Active Products', value: '47', change: '+3', color: '#F59E0B' },
    { title: 'Pending Orders', value: '8', change: '-2', color: '#EF4444' },
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', amount: 'K25.50', status: 'Preparing', time: '2 min ago' },
    { id: '#ORD002', customer: 'Jane Smith', amount: 'K18.75', status: 'Ready', time: '5 min ago' },
    { id: '#ORD003', customer: 'Mike Johnson', amount: 'K32.25', status: 'Delivered', time: '12 min ago' },
  ];

  return (
    <View className='flex-1'>
      <VendorHeader />
      <StatusBar barStyle="dark-content" />

      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text style={{fontFamily:'Ubuntu-Bold'}} className="text-2xl font-bold text-gray-900">Dashboard</Text>
            <Text style={{fontFamily:'Ubuntu-Bold'}} className="text-gray-500 mt-1">Welcome back, Vendor!</Text>
          </View>
          <TouchableOpacity className="p-2">
            <Ionicons name="notifications-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row mt-4 bg-gray-100 rounded-lg p-1">
          {['Today', 'Week', 'Month'].map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 rounded-md ${
                selectedPeriod === period ? 'bg-white' : ''
              }`}
            >
              <Text style={{fontFamily:'Ubuntu-Medium'}} className={`text-center font-medium ${
                selectedPeriod === period ? 'text-emerald-600' : 'text-gray-600'
              }`}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <View className="flex-row flex-wrap -mx-2">
            {stats.map((stat, index) => (
              <View key={index} className="w-1/2 px-2 mb-4">
                <View className="bg-white p-4 rounded-xl">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className={`w-10 h-10 rounded-full items-center justify-center`} 
                          style={{ backgroundColor: `${stat.color}20` }}>
                      <View className={`w-6 h-6 rounded-full`} 
                            style={{ backgroundColor: stat.color }} />
                    </View>
                    <Text  className={`text-sm font-medium`} 
                          style={{ color: stat.color , fontFamily:'Ubuntu-Medium'}}>
                      {stat.change}
                    </Text>
                  </View>
                  <Text style={{fontFamily:'Ubuntu-Bold'}} className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </Text>
                  <Text className="text-gray-500 text-sm">{stat.title}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="px-4 mb-6">
          <Text style={{fontFamily:'Ubuntu-Bold'}} className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            {[
              { title: 'Add Product', icon: 'add-circle', color: '#10B981' },
              { title: 'View Orders', icon: 'list', color: '#3B82F6' },
              { title: 'Promotions', icon: 'pricetag', color: '#F59E0B' },
              { title: 'Analytics', icon: 'analytics', color: '#8B5CF6' },
            ].map((action, index) => (
              <TouchableOpacity key={index} className="items-center">
                <View className={`w-14 h-14 rounded-full items-center justify-center mb-2`}
                      style={{ backgroundColor: `${action.color}20` }}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={{fontFamily:'Ubuntu-Medium'}} className="text-xs text-gray-600 text-center">{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{fontFamily:'Ubuntu-Bold'}} className="text-lg font-semibold text-gray-900">Recent Orders</Text>
            <TouchableOpacity>
              <Text style={{fontFamily:'Ubuntu-Medium'}} className="text-emerald-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-xl">
            {recentOrders.map((order, index) => (
              <View key={index} className={`p-4 ${index < recentOrders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text style={{fontFamily:'Ubuntu-Medium'}} className="font-semibold text-gray-900 mr-2">{order.id}</Text>
                      <View className={`px-2 py-1 rounded-full ${
                        order.status === 'Preparing' ? 'bg-yellow-100' :
                        order.status === 'Ready' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Text style={{fontFamily:'Ubuntu-Medium'}} className={`text-xs font-medium ${
                          order.status === 'Preparing' ? 'text-yellow-600' :
                          order.status === 'Ready' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={{fontFamily:'Ubuntu-Medium'}} className="text-gray-600 text-sm">{order.customer}</Text>
                    <Text style={{fontFamily:'Ubuntu-Medium'}} className="text-gray-400 text-xs mt-1">{order.time}</Text>
                  </View>
                  <Text style={{fontFamily:'Ubuntu-Medium'}} className="font-bold text-gray-900">{order.amount}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      </View>
  );
}
