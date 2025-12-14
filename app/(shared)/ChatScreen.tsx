import AppText from '@/components/AppText';
import { useState, useEffect, useRef } from 'react';





import { View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';





import { useChatStore } from '@/src/store/slices/chatSlice';





import { useLocalSearchParams } from 'expo-router';











export default function ChatScreen() {





  const params = useLocalSearchParams();





  const { chatId, participantName, participantPhoto } = params;





  const [message, setMessage] = useState('');





  const [isTyping, setIsTyping] = useState(false);





  const scrollViewRef = useRef<ScrollView>(null);











  const {





    currentChat,





    messages,





    typingUsers,





    loading,





    selectChat,





    loadMessages,





    sendMessage,





    sendTypingIndicator,





  } = useChatStore();











  useEffect(() => {





    selectChat(chatId);





  }, [chatId]);











  useEffect(() => {





    scrollViewRef.current?.scrollToEnd({ animated: true });





  }, [messages]);











  const handleSendMessage = async () => {





    if (message.trim()) {





      await sendMessage(chatId, 'user_1', 'You', message.trim());





      setMessage('');





      setIsTyping(false);





      sendTypingIndicator(chatId, false);





    }





  };











  const handleTyping = (text: string) => {





    setMessage(text);





    if (!isTyping && text.length > 0) {





      setIsTyping(true);





      sendTypingIndicator(chatId, true);





    } else if (isTyping && text.length === 0) {





      setIsTyping(false);





      sendTypingIndicator(chatId, false);





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





    <KeyboardAvoidingView





      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}





      className="flex-1 bg-white"





    >





      {/* Header */}





      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center">





        {participantPhoto && (





          <Image





            source={{ uri: participantPhoto }}





            className="w-10 h-10 rounded-full mr-3"





          />





        )}





        <View className="flex-1">





          <AppText className="text-lg font-bold text-gray-900">{participantName}</AppText>





          <AppText className="text-sm text-gray-500">Active now</AppText>





        </View>





      </View>











      {/* Messages */}





      <ScrollView





        ref={scrollViewRef}





        className="flex-1 px-4 py-3"





        showsVerticalScrollIndicator={false}





      >





        {messages.map((msg) => (





          <View





            key={msg.id}





            className={`mb-3 flex-row ${msg.senderId === 'user_1' ? 'justify-end' : 'justify-start'}`}





          >





            <View





              className={`max-w-xs px-4 py-2 rounded-lg ${





                msg.senderId === 'user_1'





                  ? 'bg-blue-500'





                  : 'bg-gray-200'





              }`}





            >





              <AppText





                className={`text-base ${





                  msg.senderId === 'user_1'





                    ? 'text-white'





                    : 'text-gray-900'





                }`}





              >





                {msg.message}





              </AppText>





              <AppText





                className={`text-xs mt-1 ${





                  msg.senderId === 'user_1'





                    ? 'text-blue-100'





                    : 'text-gray-500'





                }`}





              >





                {new Date(msg.timestamp).toLocaleTimeString([], {





                  hour: '2-digit',





                  minute: '2-digit',





                })}





              </AppText>





            </View>





          </View>





        ))}











        {/* Typing Indicator */}





        {typingUsers.length > 0 && (





          <View className="mb-3 flex-row justify-start">





            <View className="bg-gray-300 px-4 py-2 rounded-lg">





              <AppText className="text-gray-600">Typing...</AppText>





            </View>





          </View>





        )}





      </ScrollView>











      {/* Input */}





      <View className="border-t border-gray-200 px-4 py-3 flex-row items-center bg-white">





        <TextInput





          value={message}





          onChangeText={handleTyping}





          placeholder="Type a message..."





          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-900 mr-2"





          placeholderTextColor="#999"





        />





        <TouchableOpacity





          onPress={handleSendMessage}





          disabled={!message.trim()}





          className={`w-10 h-10 rounded-full items-center justify-center ${





            message.trim() ? 'bg-blue-500' : 'bg-gray-300'





          }`}





        >





          <AppText className="text-white text-lg">â</AppText>





        </TouchableOpacity>





      </View>





    </KeyboardAvoidingView>





  );





}

















