import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VendorHeader } from '@/screens/vendor/VendorHeader';
import AppText from '@/components/AppText';


interface Notification {
  id: string;
  type: 'order' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      message: 'Order #1234 from John Doe - 2 items worth $25.99',
      time: '2 min ago',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $25.99 has been processed for Order #1233',
      time: '15 min ago',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'review',
      title: 'New Review',
      message: 'Sarah left a 5-star review: "Amazing food quality!"',
      time: '1 hour ago',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: 'Menu Update',
      message: 'Your menu has been successfully updated',
      time: '2 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'order',
      title: 'Order Cancelled',
      message: 'Order #1232 has been cancelled by customer',
      time: '3 hours ago',
      read: true,
      priority: 'medium'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return 'restaurant-outline';
      case 'payment': return 'card-outline';
      case 'review': return 'star-outline';
      case 'system': return 'settings-outline';
      default: return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return '#EF4444';
    switch (type) {
      case 'order': return '#10B981';
      case 'payment': return '#3B82F6';
      case 'review': return '#F59E0B';
      case 'system': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <VendorHeader />
      <StatusBar barStyle="dark-content" />
      

      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <AppText style={{fontFamily:'Ubuntu-Bold'}} className="text-2xl font-bold text-gray-900">Notifications</AppText>
          {unreadCount > 0 && (
            <TouchableOpacity 
              onPress={markAllAsRead}
              className="bg-emerald-600 px-3 py-1 rounded-lg"
            >
              <AppText style={{fontFamily:'Ubuntu-Medium'}} className="text-white text-sm font-medium">Mark All Read</AppText>
            </TouchableOpacity>
          )}
        </View>
        
        
        <View className="flex-row mt-4 bg-gray-100 rounded-lg p-1">
          <TouchableOpacity 
            onPress={() => setFilter('all')}
            className={`flex-1 py-2 rounded-md ${
              filter === 'all' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <AppText style={{fontFamily:'Ubuntu-Medium'}} className={`text-center font-medium ${
              filter === 'all' ? 'text-gray-900' : 'text-gray-600'
            }`}>
              All ({notifications.length})
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('unread')}
            className={`flex-1 py-2 rounded-md ${
              filter === 'unread' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <AppText style={{fontFamily:'Ubuntu-Medium'}} className={`text-center font-medium ${
              filter === 'unread' ? 'text-gray-900' : 'text-gray-600'
            }`}>
              Unread ({unreadCount})
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {filteredNotifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="notifications-outline" size={64} color="#D1D5DB" />
            <AppText style={{fontFamily:'Ubuntu-Medium'}} className="text-gray-500 text-lg font-medium mt-4">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </AppText>
            <AppText style={{fontFamily:'Ubuntu-Medium'}} className="text-gray-400 text-center mt-2 px-8">
              {filter === 'unread' 
                ? 'All caught up! Check back later for new updates.' 
                : 'You\'ll see order updates, payments, and reviews here.'
              }
            </AppText>
          </View>
        ) : (
          <View className="p-4 space-y-3">
            {filteredNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => markAsRead(notification.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                style={{
                  borderLeftColor: getNotificationColor(notification.type, notification.priority)
                }}
              >
                <View className="flex-row items-start">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: getNotificationColor(notification.type, notification.priority) + '20' 
                    }}
                  >
                    <Ionicons 
                      name={getNotificationIcon(notification.type) as any}
                      size={20} 
                      color={getNotificationColor(notification.type, notification.priority)}
                    />
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <AppText style={{fontFamily:'Ubuntu-Medium'}} className={`font-semibold ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </AppText>
                      {!notification.read && (
                        <View className="w-2 h-2 bg-emerald-600 rounded-full" />
                      )}
                    </View>
                    
                    <AppText style={{fontFamily:'Ubuntu-Light'}} className={`text-sm mb-2 ${
                      !notification.read ? 'text-gray-700' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </AppText>
                    
                    <AppText style={{fontFamily:'Ubuntu-Light'}} className="text-xs text-gray-500">
                      {notification.time}
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


