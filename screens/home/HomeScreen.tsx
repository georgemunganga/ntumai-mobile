// @ts-nocheck
// screens/home/HomeScreen.tsx
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import {
  MapPin,
  Search,
  Bell,
  User,
  MessageCircleQuestion,
  Navigation,
  ChevronDown,
  Wallet,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import AppText from "@/components/AppText";


const { width } = Dimensions.get("window");
const cardWidth = (width - 36) / 2 - 4;

const thinkingCards = [
  {
    title: "Last Delivery>",
    image: require("@/assets/potatopie.jpg"),
  },
  {
    title: "Latest>",
    image: require("@/assets/bakedpotato.jpg"),
  },
  {
    title: "Trending>",
    image: require("@/assets/salad.jpg"),
  },
  {
    title: "New Stores>",
    image: require("@/assets/cornmeal.jpg"),
  },
];


const HomeScreen = () => {
  const router = useRouter();

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='pt-5 pb-4 px-4'>
        <View className='flex-row items-center justify-between mb-8'>
          <View className='flex-row items-center flex-1'>
            <MapPin size={16} className='text-primary' />
            <TouchableOpacity className='flex-row items-center'>
              <AppText
                className='text-black ml-2 text-xs font-medium'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                ZA1893, Mulungushi, Lusaka Zambia
              </AppText>

              <ChevronDown color={'#08AF97'} />
            </TouchableOpacity>
          </View>
          <View className='flex-row gap-3'>
            <TouchableOpacity>
              <MessageCircleQuestion size={20} color={'#08AF97'} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Bell size={20} color={'#08AF97'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(customer)/Profile')}>
              <User size={20} color={'#08AF97'} />
            </TouchableOpacity>
          </View>
        </View>


        <View className='bg-primary rounded-full px-4 py-3 flex-row items-center shadow-sm'>
          <Search size={25} color='white' />
          <TextInput
            placeholder='Search for food, groceries, etc...'
            className='flex-1 ml-3 text-gray-700 text-md'
            placeholderTextColor='white'
          />
        </View>
      </View>


      <View className='mx-4 my-4'>
        <View className='bg-primary rounded-2xl p-6 flex-row justify-between shadow-sm'>
          <View className='items-center' style={{ flex: 0.3 }}>
            <AppText
              className='text-white text-xl font-extrabold'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Get ready,
            </AppText>
            <AppText
              className='text-yellow-400 text-xl font-extrabold mb-4'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Move on!
            </AppText>
            <View className='bg-yellow-400 flex-row items-center justify-center rounded-full w-24 h-24'>
              <View className='bg-primary rounded-full w-16 h-16 flex-row items-center justify-center'>
                <AppText
                  className='text-white text-lg font-bold'
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                >
                  10
                </AppText>
                <AppText
                  className='text-white text-xs font-medium ml-1 mt-1'
                  style={{ fontFamily: 'Ubuntu-Medium' }}
                >
                  min
                </AppText>
              </View>
            </View>
          </View>
          <View className='justify-between' style={{ flex: 0.7 }}>
            <View className='mb-4'>
              <Image
                source={require('@/assets/otw.png')}
                resizeMode='contain'
                className='w-52 h-20'
              />
            </View>
            <View className='flex-row items-center justify-end px-6 py-2'>
              <Wallet size={20} color={'white'} />
              <TouchableOpacity className='ml-2'>
                <AppText
                  className='text-white text-md font-semibold underline'
                  style={{ fontFamily: 'Ubuntu-Medium' }}
                >
                  Book now!
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>


      <View className='px-4 mb-6'>
        <AppText
          className='text-gray-500 text-lg font-semibold mb-4 ml-4'
          style={{ fontFamily: 'Ubuntu-Medium' }}
        >
          What are you thinking?
        </AppText>
        <View className='flex-row flex-wrap gap-2'>
          <Image
            source={require('@/assets/home-categories.png')}
            className='w-full h-[210px]'
            resizeMode='cover'
          />
        </View>
      </View>


      <View className='px-4 '>
        <AppText
          className='text-gray-500 text-lg font-semibold mb-4 ml-4'
          style={{ fontFamily: 'Ubuntu-Medium' }}
        >
          Track your Order
        </AppText>
        <View className='bg-primary rounded-2xl overflow-hidden shadow-sm'>
          <View className='flex-row'>
            <View className='p-6 flex-1' style={{ flex: 0.5 }}>
              <AppText
                className='text-white text-sm font-semibold mb-1'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Traveling to
              </AppText>
              <AppText
                className='text-white text-xs mb-2 font-medium'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                HIGHSCHOOL HOTEL
              </AppText>
              <View className='flex-row items-center mb-1'>
                <MapPin size={10} color='white' />
                <AppText
                  className='text-white text-xs ml-1'
                  style={{ fontFamily: 'Ubuntu-Medium' }}
                >
                  Food Arena
                </AppText>
              </View>
              <AppText
                className='text-white text-xs mb-2'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Lower Kabete, Kabete Park
              </AppText>
              <AppText
                className='text-white text-xs font-medium'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Delivering
              </AppText>
              <AppText
                className='text-white text-xs'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Order from Mama Pork
              </AppText>
              <AppText
                className='text-white text-xs font-medium'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                Approx. 24min
              </AppText>
            </View>
            <View className='flex-1 bg-white p-4 items-center justify-center'>
              <View className='w-full h-24 bg-gray-100 rounded-lg items-center justify-center mb-2 relative overflow-hidden'>

                <View className='absolute inset-0 bg-primary'>
                  <View className='absolute top-2 left-2 w-8 h-4 bg-primary rounded opacity-60' />
                  <View className='absolute top-4 right-3 w-6 h-3 bg-primary rounded opacity-40' />
                  <View className='absolute bottom-3 left-4 w-10 h-2 bg-primary rounded opacity-50' />
                  <View className='absolute bottom-2 right-2 w-4 h-4 bg-primary rounded opacity-30' />
                </View>

                <View className='absolute top-6 left-8 w-16 h-0.5 bg-primary transform rotate-12' />
                <View className='absolute top-8 left-16 w-12 h-0.5 bg-primary transform -rotate-12' />

                <View className='bg-red-500 w-4 h-4 rounded-full items-center justify-center'>
                  <View className='bg-white w-2 h-2 rounded-full' />
                </View>
              </View>
              <TouchableOpacity className='flex-row items-center'>
                <Navigation size={12} color='#14B8A6' />
                <AppText
                  style={{ fontFamily: 'Ubuntu-Medium' }}
                  className='text-primary text-xs font-medium ml-1'
                >
                  Get Directions
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>


      <View className='h-20' />
    </ScrollView>
  );
};

export default HomeScreen;
