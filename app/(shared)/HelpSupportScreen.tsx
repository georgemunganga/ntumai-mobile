import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supportMockService } from '../../src/api/mockServices.extended';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
}

export default function HelpSupportScreen() {
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'contact'>('faq');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [faqResponse, ticketsResponse] = await Promise.all([
        supportMockService.getFAQ(),
        supportMockService.getTickets('user_1'),
      ]);

      if (faqResponse.success) {
        setFaqs(faqResponse.data);
      }
      if (ticketsResponse.success) {
        setTickets(ticketsResponse.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load support data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await supportMockService.createTicket({
        subject: ticketSubject,
        description: ticketDescription,
      });
      if (response.success) {
        setTickets([...tickets, response.data]);
        setTicketSubject('');
        setTicketDescription('');
        setShowNewTicketForm(false);
        Alert.alert('Success', 'Support ticket created');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create ticket');
    }
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900">Help & Support</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white border-b border-gray-200">
        {(['faq', 'tickets', 'contact'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === tab ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === tab ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              {tab === 'faq' ? 'FAQ' : tab === 'tickets' ? 'Tickets' : 'Contact'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search FAQ..."
              className="bg-white rounded-lg px-4 py-3 text-gray-900 mb-4 border border-gray-200"
              placeholderTextColor="#999"
            />

            {filteredFAQs.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-gray-600">No FAQs found</Text>
              </View>
            ) : (
              filteredFAQs.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  onPress={() =>
                    setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                  }
                  className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-4">
                      <Text className="font-semibold text-gray-900">
                        {faq.question}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {faq.category}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'
                      }
                      size={20}
                      color="#6B7280"
                    />
                  </View>

                  {expandedFAQ === faq.id && (
                    <Text className="text-gray-700 mt-3 leading-5">
                      {faq.answer}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <>
            {showNewTicketForm ? (
              <View className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  Create Support Ticket
                </Text>
                <TextInput
                  value={ticketSubject}
                  onChangeText={setTicketSubject}
                  placeholder="Subject"
                  className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-3"
                  placeholderTextColor="#999"
                />
                <TextInput
                  value={ticketDescription}
                  onChangeText={setTicketDescription}
                  placeholder="Describe your issue..."
                  multiline
                  numberOfLines={4}
                  className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-3"
                  placeholderTextColor="#999"
                />
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={handleCreateTicket}
                    className="flex-1 bg-blue-500 py-2 rounded-lg"
                  >
                    <Text className="text-center text-white font-semibold">
                      Submit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowNewTicketForm(false)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg"
                  >
                    <Text className="text-center text-gray-900 font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {tickets.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="ticket" size={48} color="#D1D5DB" />
                <Text className="text-gray-600 mt-4">No support tickets yet</Text>
              </View>
            ) : (
              tickets.map((ticket) => (
                <View
                  key={ticket.id}
                  className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-semibold text-gray-900 flex-1">
                      {ticket.subject}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded ${
                        ticket.status === 'open'
                          ? 'bg-blue-100'
                          : 'bg-green-100'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          ticket.status === 'open'
                            ? 'text-blue-700'
                            : 'text-green-700'
                        }`}
                      >
                        {ticket.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <>
            <View className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Contact Us
              </Text>

              <TouchableOpacity className="flex-row items-center mb-4 p-3 bg-blue-50 rounded-lg">
                <Ionicons name="call" size={24} color="#3B82F6" />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-gray-900">Call Support</Text>
                  <Text className="text-sm text-gray-600">+1 (555) 123-4567</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center mb-4 p-3 bg-green-50 rounded-lg">
                <Ionicons name="mail" size={24} color="#10B981" />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-gray-900">Email Support</Text>
                  <Text className="text-sm text-gray-600">support@ntumai.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center p-3 bg-purple-50 rounded-lg">
                <Ionicons name="chatbubble" size={24} color="#A855F7" />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-gray-900">Live Chat</Text>
                  <Text className="text-sm text-gray-600">Available 24/7</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Create Ticket Button */}
      {activeTab === 'tickets' && !showNewTicketForm && (
        <View className="px-4 py-4 border-t border-gray-200 bg-white">
          <TouchableOpacity
            onPress={() => setShowNewTicketForm(true)}
            className="bg-blue-500 py-3 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="add" size={24} color="white" />
            <Text className="text-white font-bold ml-2">New Ticket</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

