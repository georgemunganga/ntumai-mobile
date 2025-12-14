import AppText from '@/components/AppText';
import { useState } from 'react';





import { View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';





import { useRouter } from 'expo-router';





import { useTaskStore } from '@/src/store';





import { Feather } from '@expo/vector-icons';











type TaskStep = 'category' | 'details' | 'budget' | 'confirmation';











const TASK_CATEGORIES = [





  { id: 'shopping', label: 'Shopping', icon: 'ðï¸', description: 'Buy items from stores' },





  { id: 'cleaning', label: 'Cleaning', icon: 'ð§¹', description: 'Home cleaning services' },





  { id: 'moving', label: 'Moving', icon: 'ð¦', description: 'Help with moving' },





  { id: 'handyman', label: 'Handyman', icon: 'ð§', description: 'Repairs & maintenance' },





  { id: 'delivery', label: 'Delivery', icon: 'ð®', description: 'Deliver items' },





  { id: 'other', label: 'Other', icon: 'â­', description: 'Other tasks' },





];











export default function DoTaskScreen() {





  const router = useRouter();





  const { createTask, isLoading } = useTaskStore();











  const [step, setStep] = useState<TaskStep>('category');





  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);





  const [taskDetails, setTaskDetails] = useState({





    title: '',





    description: '',





    location: '',





    dueDate: '',





    dueTime: '',





  });





  const [budget, setBudget] = useState({





    min: '',





    max: '',





  });











  const handleCreateTask = async () => {





    if (!selectedCategory || !taskDetails.title || !taskDetails.description) {





      Alert.alert('Error', 'Please fill in all required fields');





      return;





    }











    if (!budget.min || !budget.max) {





      Alert.alert('Error', 'Please set a budget range');





      return;





    }











    try {





      const task = await createTask({





        category: selectedCategory,





        title: taskDetails.title,





        description: taskDetails.description,





        location: taskDetails.location,





        dueDate: taskDetails.dueDate,





        dueTime: taskDetails.dueTime,





        budgetMin: parseInt(budget.min),





        budgetMax: parseInt(budget.max),





      });











      if (task) {





        Alert.alert('Success', 'Task posted! Taskers will start bidding soon.');





        router.replace(`/(customer)/TaskDetail?taskId=${task.id}`);





      }





    } catch (error: any) {





      Alert.alert('Error', error.message);





    }





  };











  // Step 1: Category Selection





  if (step === 'category') {





    return (





      <ScrollView className="flex-1 bg-white">





        <View className="px-6 py-8">





          {/* Header */}





          <View className="mb-8">





            <TouchableOpacity onPress={() => router.back()} className="mb-4">





              <Feather name="chevron-left" size={24} color="#1F2937" />





            </TouchableOpacity>





            <View className="flex-row items-center mb-4">





              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">





                <AppText className="text-white font-bold text-sm">1</AppText>





              </View>





              <AppText className="text-sm font-semibold text-gray-600">Task Category</AppText>





            </View>





            <AppText className="text-3xl font-bold text-gray-900">What do you need help with?</AppText>





          </View>











          {/* Category Grid */}





          <View className="gap-3 mb-8">





            {TASK_CATEGORIES.map(category => (





              <TouchableOpacity





                key={category.id}





                onPress={() => {





                  setSelectedCategory(category.id);





                  setStep('details');





                }}





                className={`border-2 rounded-lg p-4 flex-row items-center ${





                  selectedCategory === category.id





                    ? 'border-green-600 bg-green-50'





                    : 'border-gray-200'





                }`}





              >





                <AppText className="text-3xl mr-4">{category.icon}</AppText>





                <View className="flex-1">





                  <AppText className="text-lg font-bold text-gray-900">{category.label}</AppText>





                  <AppText className="text-gray-600 text-sm">{category.description}</AppText>





                </View>





                {selectedCategory === category.id && (





                  <Feather name="check-circle" size={24} color="#16A34A" />





                )}





              </TouchableOpacity>





            ))}





          </View>





        </View>





      </ScrollView>





    );





  }











  // Step 2: Task Details





  if (step === 'details') {





    const category = TASK_CATEGORIES.find(c => c.id === selectedCategory);











    return (





      <ScrollView className="flex-1 bg-white">





        <View className="px-6 py-8">





          {/* Header */}





          <View className="mb-8">





            <TouchableOpacity onPress={() => setStep('category')} className="mb-4">





              <Feather name="chevron-left" size={24} color="#1F2937" />





            </TouchableOpacity>





            <View className="flex-row items-center mb-4">





              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">





                <AppText className="text-white font-bold text-sm">2</AppText>





              </View>





              <AppText className="text-sm font-semibold text-gray-600">Task Details</AppText>





            </View>





            <AppText className="text-3xl font-bold text-gray-900">Tell us more about your task</AppText>





          </View>











          {/* Category Badge */}





          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex-row items-center">





            <AppText className="text-2xl mr-3">{category?.icon}</AppText>





            <AppText className="text-blue-900 font-semibold">{category?.label}</AppText>





          </View>











          {/* Task Title */}





          <View className="mb-6">





            <AppText className="text-sm font-semibold text-gray-700 mb-2">Task Title</AppText>





            <TextInput





              className="border border-gray-300 rounded-lg px-4 py-3"





              placeholder="e.g., Buy groceries from Shoprite"





              value={taskDetails.title}





              onChangeText={(text) => setTaskDetails(prev => ({ ...prev, title: text }))}





              placeholderTextColor="#9CA3AF"





            />





          </View>











          {/* Description */}





          <View className="mb-6">





            <AppText className="text-sm font-semibold text-gray-700 mb-2">Description</AppText>





            <TextInput





              className="border border-gray-300 rounded-lg px-4 py-3 h-24"





              placeholder="Provide detailed instructions..."





              value={taskDetails.description}





              onChangeText={(text) => setTaskDetails(prev => ({ ...prev, description: text }))}





              multiline





              placeholderTextColor="#9CA3AF"





            />





          </View>











          {/* Location */}





          <View className="mb-6">





            <AppText className="text-sm font-semibold text-gray-700 mb-2">Location</AppText>





            <TextInput





              className="border border-gray-300 rounded-lg px-4 py-3"





              placeholder="Where should the task be done?"





              value={taskDetails.location}





              onChangeText={(text) => setTaskDetails(prev => ({ ...prev, location: text }))}





              placeholderTextColor="#9CA3AF"





            />





          </View>











          {/* Due Date */}





          <View className="mb-6 flex-row gap-4">





            <View className="flex-1">





              <AppText className="text-sm font-semibold text-gray-700 mb-2">Due Date</AppText>





              <TextInput





                className="border border-gray-300 rounded-lg px-4 py-3"





                placeholder="YYYY-MM-DD"





                value={taskDetails.dueDate}





                onChangeText={(text) => setTaskDetails(prev => ({ ...prev, dueDate: text }))}





                placeholderTextColor="#9CA3AF"





              />





            </View>





            <View className="flex-1">





              <AppText className="text-sm font-semibold text-gray-700 mb-2">Time</AppText>





              <TextInput





                className="border border-gray-300 rounded-lg px-4 py-3"





                placeholder="HH:MM"





                value={taskDetails.dueTime}





                onChangeText={(text) => setTaskDetails(prev => ({ ...prev, dueTime: text }))}





                placeholderTextColor="#9CA3AF"





              />





            </View>





          </View>











          <TouchableOpacity





            onPress={() => setStep('budget')}





            disabled={!taskDetails.title || !taskDetails.description}





            className={`rounded-lg py-4 ${





              !taskDetails.title || !taskDetails.description ? 'bg-gray-300' : 'bg-green-600'





            }`}





          >





            <AppText className="text-white text-center font-bold text-lg">Continue</AppText>





          </TouchableOpacity>





        </View>





      </ScrollView>





    );





  }











  // Step 3: Budget





  if (step === 'budget') {





    return (





      <ScrollView className="flex-1 bg-white">





        <View className="px-6 py-8">





          {/* Header */}





          <View className="mb-8">





            <TouchableOpacity onPress={() => setStep('details')} className="mb-4">





              <Feather name="chevron-left" size={24} color="#1F2937" />





            </TouchableOpacity>





            <View className="flex-row items-center mb-4">





              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">





                <AppText className="text-white font-bold text-sm">3</AppText>





              </View>





              <AppText className="text-sm font-semibold text-gray-600">Budget</AppText>





            </View>





            <AppText className="text-3xl font-bold text-gray-900">What's your budget?</AppText>





          </View>











          {/* Budget Info */}





          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">





            <AppText className="text-blue-900 font-semibold mb-2">ð¡ Budget Tips</AppText>





            <AppText className="text-blue-800 text-sm">





              Set a realistic budget range. Higher budgets attract more taskers and get completed faster.





            </AppText>





          </View>











          {/* Min Budget */}





          <View className="mb-6">





            <AppText className="text-sm font-semibold text-gray-700 mb-2">Minimum Budget (K)</AppText>





            <TextInput





              className="border border-gray-300 rounded-lg px-4 py-3"





              placeholder="e.g., 50"





              value={budget.min}





              onChangeText={(text) => setBudget(prev => ({ ...prev, min: text }))}





              keyboardType="numeric"





              placeholderTextColor="#9CA3AF"





            />





          </View>











          {/* Max Budget */}





          <View className="mb-8">





            <AppText className="text-sm font-semibold text-gray-700 mb-2">Maximum Budget (K)</AppText>





            <TextInput





              className="border border-gray-300 rounded-lg px-4 py-3"





              placeholder="e.g., 150"





              value={budget.max}





              onChangeText={(text) => setBudget(prev => ({ ...prev, max: text }))}





              keyboardType="numeric"





              placeholderTextColor="#9CA3AF"





            />





          </View>











          {/* Budget Summary */}





          {budget.min && budget.max && (





            <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">





              <AppText className="text-green-900 font-semibold mb-2">Budget Range</AppText>





              <AppText className="text-2xl font-bold text-green-600">





                {budget.min}K - {budget.max}K





              </AppText>





            </View>





          )}











          <TouchableOpacity





            onPress={() => setStep('confirmation')}





            disabled={!budget.min || !budget.max}





            className={`rounded-lg py-4 ${





              !budget.min || !budget.max ? 'bg-gray-300' : 'bg-green-600'





            }`}





          >





            <AppText className="text-white text-center font-bold text-lg">Continue</AppText>





          </TouchableOpacity>





        </View>





      </ScrollView>





    );





  }











  // Step 4: Confirmation





  return (





    <ScrollView className="flex-1 bg-white">





      <View className="px-6 py-8">





        {/* Header */}





        <View className="mb-8">





          <TouchableOpacity onPress={() => setStep('budget')} className="mb-4">





            <Feather name="chevron-left" size={24} color="#1F2937" />





          </TouchableOpacity>





          <View className="flex-row items-center mb-4">





            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-3">





              <AppText className="text-white font-bold text-sm">4</AppText>





            </View>





            <AppText className="text-sm font-semibold text-gray-600">Review & Post</AppText>





          </View>





          <AppText className="text-3xl font-bold text-gray-900">Review your task</AppText>





        </View>











        {/* Summary */}





        <View className="bg-gray-50 rounded-lg p-6 mb-8">





          <View className="mb-4 pb-4 border-b border-gray-200">





            <AppText className="text-gray-600 text-sm">Category</AppText>





            <AppText className="text-lg font-bold text-gray-900">





              {TASK_CATEGORIES.find(c => c.id === selectedCategory)?.label}





            </AppText>





          </View>











          <View className="mb-4 pb-4 border-b border-gray-200">





            <AppText className="text-gray-600 text-sm">Title</AppText>





            <AppText className="text-lg font-bold text-gray-900">{taskDetails.title}</AppText>





          </View>











          <View className="mb-4 pb-4 border-b border-gray-200">





            <AppText className="text-gray-600 text-sm">Description</AppText>





            <AppText className="text-gray-900">{taskDetails.description}</AppText>





          </View>











          <View className="mb-4 pb-4 border-b border-gray-200">





            <AppText className="text-gray-600 text-sm">Location</AppText>





            <AppText className="text-gray-900">{taskDetails.location}</AppText>





          </View>











          <View className="mb-4 pb-4 border-b border-gray-200">





            <AppText className="text-gray-600 text-sm">Due Date & Time</AppText>





            <AppText className="text-gray-900">





              {taskDetails.dueDate} at {taskDetails.dueTime}





            </AppText>





          </View>











          <View>





            <AppText className="text-gray-600 text-sm">Budget</AppText>





            <AppText className="text-2xl font-bold text-green-600">





              {budget.min}K - {budget.max}K





            </AppText>





          </View>





        </View>











        <TouchableOpacity





          onPress={handleCreateTask}





          disabled={isLoading}





          className={`rounded-lg py-4 flex-row items-center justify-center ${





            isLoading ? 'bg-gray-300' : 'bg-green-600'





          }`}





        >





          {isLoading ? (





            <ActivityIndicator color="white" />





          ) : (





            <AppText className="text-white text-center font-bold text-lg">Post Task</AppText>





          )}





        </TouchableOpacity>





      </View>





    </ScrollView>





  );





}

















