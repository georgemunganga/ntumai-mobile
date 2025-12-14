import AppText from '@/components/AppText';
import { useState, useEffect } from 'react';





import { View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';





import { useRouter } from 'expo-router';





import { Ionicons } from '@expo/vector-icons';





import { shoppingListMockService } from '@/src/api/mockServices.extended';











interface ShoppingList {





  id: string;





  name: string;





  itemCount: number;





  lastUsed: string;





  estimatedCost: number;





}











export default function ShoppingListsScreen() {





  const router = useRouter();





  const [lists, setLists] = useState<ShoppingList[]>([]);





  const [loading, setLoading] = useState(true);





  const [showCreateForm, setShowCreateForm] = useState(false);





  const [newListName, setNewListName] = useState('');











  useEffect(() => {





    loadLists();





  }, []);











  const loadLists = async () => {





    try {





      const response = await shoppingListMockService.getLists('user_1');





      if (response.success) {





        setLists(response.data);





      }





    } catch (error) {





      Alert.alert('Error', 'Failed to load shopping lists');





    } finally {





      setLoading(false);





    }





  };











  const handleCreateList = async () => {





    if (!newListName.trim()) {





      Alert.alert('Error', 'Please enter a list name');





      return;





    }











    try {





      const response = await shoppingListMockService.createList({





        name: newListName,





        items: [],





      });





      if (response.success) {





        setLists([...lists, response.data]);





        setNewListName('');





        setShowCreateForm(false);





        Alert.alert('Success', 'Shopping list created');





      }





    } catch (error) {





      Alert.alert('Error', 'Failed to create list');





    }





  };











  const handleUseList = (list: ShoppingList) => {





    router.push({





      pathname: '/(customer)/DoTaskScreen',





      params: {





        shoppingListId: list.id,





        shoppingListName: list.name,





      },





    });





  };











  const handleDeleteList = (listId: string) => {





    Alert.alert('Delete List', 'Are you sure you want to delete this list?', [





      { text: 'Cancel', style: 'cancel' },





      {





        text: 'Delete',





        onPress: () => {





          setLists(lists.filter((l) => l.id !== listId));





        },





        style: 'destructive',





      },





    ]);





  };











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





        <AppText className="text-2xl font-bold text-gray-900">Shopping Lists</AppText>





        <AppText className="text-sm text-gray-600 mt-1">





          Create and reuse shopping lists for errands





        </AppText>





      </View>











      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>





        {/* Create New List Form */}





        {showCreateForm && (





          <View className="bg-white rounded-lg p-4 mb-4 border border-blue-200">





            <AppText className="text-lg font-bold text-gray-900 mb-3">Create New List</AppText>





            <TextInput





              value={newListName}





              onChangeText={setNewListName}





              placeholder="List name (e.g., Weekly Groceries)"





              className="bg-gray-100 rounded-lg px-4 py-3 text-gray-900 mb-3"





              placeholderTextColor="#999"





            />





            <View className="flex-row gap-2">





              <TouchableOpacity





                onPress={handleCreateList}





                className="flex-1 bg-blue-500 py-2 rounded-lg"





              >





                <AppText className="text-center text-white font-semibold">Create</AppText>





              </TouchableOpacity>





              <TouchableOpacity





                onPress={() => {





                  setShowCreateForm(false);





                  setNewListName('');





                }}





                className="flex-1 bg-gray-200 py-2 rounded-lg"





              >





                <AppText className="text-center text-gray-900 font-semibold">Cancel</AppText>





              </TouchableOpacity>





            </View>





          </View>





        )}











        {/* Lists */}





        {lists.length === 0 ? (





          <View className="items-center justify-center py-12">





            <Ionicons name="list" size={48} color="#D1D5DB" />





            <AppText className="text-gray-600 mt-4 text-center">





              No shopping lists yet. Create one to get started!





            </AppText>





          </View>





        ) : (





          lists.map((list) => (





            <View





              key={list.id}





              className="bg-white rounded-lg p-4 mb-3 border border-gray-200"





            >





              <View className="flex-row justify-between items-start mb-2">





                <View className="flex-1">





                  <AppText className="text-lg font-bold text-gray-900">{list.name}</AppText>





                  <AppText className="text-sm text-gray-600 mt-1">





                    {list.itemCount} items â¢ â­{list.estimatedCost.toFixed(2)}





                  </AppText>





                </View>





                <TouchableOpacity





                  onPress={() => handleDeleteList(list.id)}





                  className="p-2"





                >





                  <Ionicons name="trash" size={20} color="#EF4444" />





                </TouchableOpacity>





              </View>











              <AppText className="text-xs text-gray-500 mb-3">





                Last used: {new Date(list.lastUsed).toLocaleDateString()}





              </AppText>











              <TouchableOpacity





                onPress={() => handleUseList(list)}





                className="bg-blue-500 py-2 rounded-lg"





              >





                <AppText className="text-center text-white font-semibold">Use This List</AppText>





              </TouchableOpacity>





            </View>





          ))





        )}





      </ScrollView>











      {/* Create Button */}





      {!showCreateForm && (





        <View className="px-4 py-4 border-t border-gray-200 bg-white">





          <TouchableOpacity





            onPress={() => setShowCreateForm(true)}





            className="bg-blue-500 py-3 rounded-lg flex-row items-center justify-center"





          >





            <Ionicons name="add" size={24} color="white" />





            <AppText className="text-white font-bold ml-2">Create New List</AppText>





          </TouchableOpacity>





        </View>





      )}





    </View>





  );





}

















