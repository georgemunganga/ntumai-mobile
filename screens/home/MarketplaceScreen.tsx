// screens/marketplace/MarketplaceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {
  Search,
  Filter,
  Heart,
  Star,
  Plus,
  ShoppingCart,
  ArrowLeft,
  MapPin,
  Clock,
  Gift,
  Truck,
  Minus,
  X,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppText from '../../components/AppText';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Navigation Types
type RootStackParamList = {
  Home: undefined;
  RestaurantDetail: { restaurant: Restaurant };
  ProductDetail: { product: Product };
  Cart: undefined;
  Checkout: undefined;
};

type MarketplaceScreenProps = NativeStackScreenProps<RootStackParamList>;
type RestaurantDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RestaurantDetail'
>;
type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;
type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  restaurant: string;
  restaurantId: string;
  description: string;
  isPromo?: boolean;
  promoText?: string;
  discount?: number;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  category: string;
  location: string;
  followers: number;
  isFollowing: boolean;
  promoText?: string;
  deliveryFee: number;
  minOrder: number;
}

interface PromoCard {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  color: string;
  textColor: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Enhanced Mock Data
const promoCards: PromoCard[] = [
  {
    id: '1',
    title: 'Get ready',
    subtitle: 'Promo out',
    discount: '10%',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
    color: '#10B981',
    textColor: '#FFFFFF',
  },
  {
    id: '2',
    title: 'Special',
    subtitle: 'Deal',
    discount: '25%',
    image:
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop',
    color: '#F59E0B',
    textColor: '#FFFFFF',
  },
];

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Dewaxe Restaurant',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
    rating: 4.5,
    deliveryTime: '25-35 min',
    category: 'African • $$ • 2.1km',
    location: 'Lusaka, Zambia',
    followers: 1250,
    isFollowing: false,
    promoText: 'Up to 25% Off',
    deliveryFee: 15,
    minOrder: 50,
  },
  {
    id: '2',
    name: 'Mama Pork',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop',
    rating: 4.8,
    deliveryTime: '20-30 min',
    category: 'BBQ • $$$ • 1.5km',
    location: 'Kabwe, Zambia',
    followers: 2100,
    isFollowing: true,
    promoText: 'Free Delivery',
    deliveryFee: 0,
    minOrder: 30,
  },
  {
    id: '3',
    name: 'Green Garden',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=250&fit=crop',
    rating: 4.3,
    deliveryTime: '15-25 min',
    category: 'Healthy •K• 0.8km',
    location: 'Ndola, Zambia',
    followers: 890,
    isFollowing: false,
    deliveryFee: 10,
    minOrder: 25,
  },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Mixed Salad',
    price: 45,
    originalPrice: 60,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 128,
    category: 'Salads',
    restaurant: 'Dewaxe Restaurant',
    restaurantId: '1',
    description:
      'Fresh mixed greens with seasonal vegetables, cherry tomatoes, cucumber, and house dressing',
    isPromo: true,
    promoText: '25% Off',
    discount: 25,
  },
  {
    id: '2',
    name: 'Soulful Jollof',
    price: 75,
    image:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 245,
    category: 'African',
    restaurant: 'Dewaxe Restaurant',
    restaurantId: '1',
    description:
      'Traditional Nigerian jollof rice with perfectly balanced spices, tender chicken, and vegetables',
  },
  {
    id: '3',
    name: 'Sweet Cupcake',
    price: 25,
    image:
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=400&fit=crop',
    rating: 4.4,
    reviews: 89,
    category: 'Desserts',
    restaurant: 'Green Garden',
    restaurantId: '3',
    description:
      'Vanilla cupcake with buttercream frosting and colorful sprinkles',
  },
  {
    id: '4',
    name: 'Grilled Chicken',
    price: 85,
    image:
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 156,
    category: 'BBQ',
    restaurant: 'Mama Pork',
    restaurantId: '2',
    description:
      'Perfectly grilled chicken breast with herbs and spices, served with roasted vegetables',
  },
];

// Global cart state (in a real app, you'd use Context or Redux)
let globalCart: CartItem[] = [];

export default function MarketplaceScreen({
  navigation,
}: MarketplaceScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followedRestaurants, setFollowedRestaurants] = useState<string[]>([
    '2',
  ]);
  const [cartCount, setCartCount] = useState(3);

  const categories = ['All', 'African', 'BBQ', 'Healthy', 'Desserts', 'Salads'];

  const toggleFollow = (restaurantId: string) => {
    setFollowedRestaurants((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const addToCart = (product: Product) => {
    const existingItem = globalCart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      globalCart.push({ ...product, quantity: 1 });
    }
    setCartCount(globalCart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const PromoCard = ({ promo }: { promo: PromoCard }) => (
    <TouchableOpacity
      style={[styles.promoCard, { backgroundColor: promo.color }]}
      className='mr-4 p-4 rounded-2xl flex-row items-center justify-between'
    >
      <View className='flex-1'>
        <AppText
          style={{ color: promo.textColor, fontFamily: 'Ubuntu-Medium' }}
          className='text-sm'
        >
          {promo.title}
        </AppText>
        <AppText
          style={{ color: promo.textColor, fontFamily: 'Ubuntu-Medium' }}
          className='text-sm'
        >
          {promo.subtitle}
        </AppText>
        <AppText
          style={{ color: promo.textColor, fontFamily: 'Ubuntu-Bold' }}
          className='text-2xl mt-1'
        >
          {promo.discount}
        </AppText>
        <TouchableOpacity className='bg-white px-3 py-1 rounded-full mt-2 self-start'>
          <AppText
            className='text-xs font-semibold'
            style={{ color: promo.color }}
          >
            Order now
          </AppText>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: promo.image }}
        className='w-16 h-16 rounded-full'
        resizeMode='cover'
      />
    </TouchableOpacity>
  );

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <TouchableOpacity
      className='bg-white rounded-2xl overflow-hidden mr-4 shadow-sm'
      style={{ width: width * 0.8 }}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
    >
      <View className='relative'>
        <Image
          source={{ uri: restaurant.image }}
          className='w-full h-36'
          resizeMode='cover'
        />
        {restaurant.promoText && (
          <View className='absolute top-3 left-3 bg-red-500 px-2 py-1 rounded-md'>
            <AppText
              className='text-white text-xs font-semibold'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            >
              {restaurant.promoText}
            </AppText>
          </View>
        )}
        <TouchableOpacity
          className='absolute top-3 right-3 bg-white w-8 h-8 rounded-full items-center justify-center shadow-sm'
          onPress={() => toggleFollow(restaurant.id)}
        >
          <Heart
            size={16}
            color={
              followedRestaurants.includes(restaurant.id)
                ? '#EF4444'
                : '#9CA3AF'
            }
            fill={
              followedRestaurants.includes(restaurant.id) ? '#EF4444' : 'none'
            }
          />
        </TouchableOpacity>
      </View>

      <View className='p-4'>
        <AppText
          className='text-gray-800 font-bold text-base mb-1'
          style={{ fontFamily: 'Ubuntu-Bold' }}
        >
          {restaurant.name}
        </AppText>
        <View className='flex-row items-center mb-2'>
          <Star size={14} color='#FCD34D' fill='#FCD34D' />
          <AppText
            className='text-gray-600 text-sm ml-1'
            style={{ fontFamily: 'Ubuntu-Medium' }}
          >
            {restaurant.rating}
          </AppText>
          <AppText className='text-gray-400 text-sm ml-2'>•</AppText>
          <Clock size={14} color='#9CA3AF' />
          <AppText
            className='text-gray-600 text-sm ml-1'
            style={{ fontFamily: 'Ubuntu-Medium' }}
          >
            {restaurant.deliveryTime}
          </AppText>
        </View>
        <AppText
          className='text-gray-500 text-sm mb-2'
          style={{ fontFamily: 'Ubuntu-Medium' }}
        >
          {restaurant.category}
        </AppText>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <Truck size={14} color='#10B981' />
            <AppText className='text-green-600 text-sm ml-1 font-medium'>
              {restaurant.deliveryFee === 0
                ? 'Free delivery'
                : `K${restaurant.deliveryFee} delivery`}
            </AppText>
          </View>
          <AppText className='text-gray-500 text-xs'>
            Min K{restaurant.minOrder}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <TouchableOpacity
      className='bg-white rounded-2xl overflow-hidden mb-4 shadow-sm'
      onPress={() => navigation.navigate('ProductDetail', { product })}
    >
      <View className='flex-row p-4'>
        <View className='relative'>
          <Image
            source={{ uri: product.image }}
            className='w-24 h-24 rounded-xl'
            resizeMode='cover'
          />
          {product.isPromo && (
            <View className='absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center'>
              <AppText
                className='text-white text-xs font-bold'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
                %
              </AppText>
            </View>
          )}
        </View>

        <View className='flex-1 ml-4 justify-between'>
          <View>
            <View className='flex-row items-start justify-between mb-1'>
              <AppText
                className='text-gray-800 font-semibold text-base flex-1'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
                {product.name}
              </AppText>
              <TouchableOpacity
                className='bg-red-500 w-7 h-7 rounded-full items-center justify-center ml-2'
                onPress={() => addToCart(product)}
              >
                <Plus size={14} color='white' />
              </TouchableOpacity>
            </View>

            <View className='flex-row items-center mb-2'>
              <Star size={12} color='#FCD34D' fill='#FCD34D' />
              <AppText
                className='text-gray-600 text-sm ml-1'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                {product.rating}
              </AppText>
              <AppText
                className='text-gray-400 text-sm ml-1'
                style={{ fontFamily: 'Ubuntu-Medium' }}
              >
                ({product.reviews})
              </AppText>
            </View>

            <AppText
              className='text-gray-500 text-sm mb-1'
              style={{ fontFamily: 'Ubuntu-Medium' }}
            >
              {product.restaurant}
            </AppText>
          </View>

          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center'>
              <AppText
                className='text-red-500 font-bold text-lg'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
                K{product.price}
              </AppText>
              {product.originalPrice && (
                <AppText
                  className='text-gray-400 text-sm line-through ml-2'
                  style={{ fontFamily: 'Ubuntu-Medium' }}
                >
                  K{product.originalPrice}
                </AppText>
              )}
            </View>
            {product.isPromo && (
              <View className='bg-red-100 px-2 py-1 rounded-md'>
                <AppText
                  className='text-red-500 text-xs font-medium'
                  style={{ fontFamily: 'Ubuntu-Medium' }}
                >
                  {product.promoText}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className='flex-1 bg-gray-50'>
      <View className='pb-6'>
        <View className='bg-gray-50 flex-row items-center justify-between px-4 pt-2 mb-6 shadow-lg'>
          <View>
            <Image
              source={require('../../assets/green-logo.png')}
              resizeMode='contain'
              style={{ width: 120, height: 100 }}
            />
          </View>
          <View className='flex-row items-center'>
            <TouchableOpacity className='mr-2 rounded-full bg-primary p-3'>
              <Search size={24} color='white' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              className='rounded-full bg-primary p-3'
            >
              <ShoppingCart size={24} color='white' />
              {cartCount > 0 && (
                <View className='absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center'>
                  <AppText
                    className='text-white text-xs font-bold'
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    {cartCount}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className='flex-row items-center justify-between mb-6'>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='flex-row'
          >
            {[1, 2, 3, 4].map((i) => (
              <TouchableOpacity key={i} className='mr-4'>
                <Image
                  source={{
                    uri: `https://images.unsplash.com/photo-${
                      1500000000000 + i
                    }?w=50&h=50&fit=crop&crop=face`,
                  }}
                  className='w-12 h-12 rounded-full border-2 border-white'
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity>
            <AppText
              className='text-white font-semibold'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              View All
            </AppText>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='mb-4'
        >
          {promoCards.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </ScrollView>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='px-4 py-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <AppText
              className='text-gray-800 text-lg font-bold'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Trending
            </AppText>
            <TouchableOpacity>
              <AppText
                className='text-primary font-medium'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
                See all
              </AppText>
            </TouchableOpacity>
          </View>

          <View className='flex-row flex-wrap justify-between'>
            {restaurants.slice(0, 4).map((restaurant, index) => (
              <TouchableOpacity
                key={restaurant.id}
                className='w-[48%] bg-white rounded-2xl overflow-hidden mb-4 shadow-sm'
                onPress={() =>
                  navigation.navigate('RestaurantDetail', { restaurant })
                }
              >
                <View className='relative'>
                  <Image
                    source={{ uri: restaurant.image }}
                    className='w-full h-24'
                    resizeMode='cover'
                  />
                  <TouchableOpacity
                    className='absolute top-2 right-2 bg-white w-6 h-6 rounded-full items-center justify-center'
                    onPress={() => toggleFollow(restaurant.id)}
                  >
                    <Heart
                      size={12}
                      color={
                        followedRestaurants.includes(restaurant.id)
                          ? '#EF4444'
                          : '#9CA3AF'
                      }
                      fill={
                        followedRestaurants.includes(restaurant.id)
                          ? '#EF4444'
                          : 'none'
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View className='p-3'>
                  <AppText
                    className='font-semibold text-gray-800 text-sm'
                    numberOfLines={1}
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    {restaurant.name}
                  </AppText>
                  <AppText
                    className='text-red-500 font-bold text-base'
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    K{Math.floor(Math.random() * 50) + 100}
                  </AppText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className='px-4 mb-4'>
          <View className='bg-white rounded-full px-4 py-3 flex-row items-center shadow-sm'>
            <Search size={18} color='#6B7280' />
            <TextInput
              placeholder='Search for food...'
              className='flex-1 ml-3 text-gray-700'
              placeholderTextColor='#9CA3AF'
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity>
              <Filter size={18} color='#6B7280' />
            </TouchableOpacity>
          </View>
        </View>

        <View className='px-4 mb-6'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row gap-3'>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <AppText
                    className={`text-sm font-medium ${
                      selectedCategory === category
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    {category}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className='mb-6'>
          <View className='flex-row items-center justify-between px-4 mb-4'>
            <Text className='text-gray-800 text-lg font-bold'>
              Featured Restaurants
            </Text>
            <TouchableOpacity>
              <Text className='text-primary font-medium'>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='px-4'
          >
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </ScrollView>
        </View>

        <View className='px-4 pb-20'>
          <AppText
            className='text-gray-800 text-lg font-bold mb-4'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Popular Items
          </AppText>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Restaurant Detail Screen
export function RestaurantDetailScreen({
  route,
  navigation,
}: RestaurantDetailScreenProps) {
  const { restaurant } = route.params;
  const [isFollowing, setIsFollowing] = useState(restaurant.isFollowing);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const restaurantProducts = products.filter(
    (p) => p.restaurantId === restaurant.id
  );
  const categories = [
    'All',
    ...Array.from(new Set(restaurantProducts.map((p) => p.category))),
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? restaurantProducts
      : restaurantProducts.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = globalCart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      globalCart.push({ ...product, quantity: 1 });
    }
    Alert.alert('Added to Cart', `${product.name} has been added to your cart`);
  };

  return (
    <View className='flex-1 bg-white'>
      <View className='relative'>
        <Image
          source={{ uri: restaurant.image }}
          className='w-full h-64'
          resizeMode='cover'
        />
        <View className='absolute top-12 left-4 right-4 flex-row justify-between'>
          <TouchableOpacity
            className='bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm'
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color='#374151' />
          </TouchableOpacity>
          <View className='flex-row'>
            <TouchableOpacity
              className='bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm mr-3'
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Heart
                size={20}
                color={isFollowing ? '#EF4444' : '#9CA3AF'}
                fill={isFollowing ? '#EF4444' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className='bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm'
              onPress={() => navigation.navigate('Cart')}
            >
              <ShoppingCart size={20} color='#374151' />
            </TouchableOpacity>
          </View>
        </View>
        {restaurant.promoText && (
          <View className='absolute bottom-4 left-4 bg-red-500 px-3 py-1 rounded-full'>
            <AppText
              className='text-white text-sm font-semibold'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              {restaurant.promoText}
            </AppText>
          </View>
        )}
      </View>

      <View className='px-4 py-6 border-b border-gray-100'>
        <AppText
          className='text-2xl font-bold text-gray-800 mb-2'
          style={{ fontFamily: 'Ubuntu-Bold' }}
        >
          {restaurant.name}
        </AppText>

        <View className='flex-row items-center mb-3'>
          <Star size={16} color='#FCD34D' fill='#FCD34D' />
          <AppText
            className='text-gray-600 ml-1 font-medium'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            {restaurant.rating}
          </AppText>
          <AppText className='text-gray-400 ml-2'>•</AppText>
          <Clock size={16} color='#9CA3AF' />
          <AppText className='text-gray-600 ml-1'>
            {restaurant.deliveryTime}
          </AppText>
          <AppText className='text-gray-400 ml-2'>•</AppText>
          <MapPin size={16} color='#9CA3AF' />
          <AppText className='text-gray-600 ml-1'>
            {restaurant.location}
          </AppText>
        </View>

        <AppText
          className='text-gray-500 mb-4'
          style={{ fontFamily: 'Ubuntu-Bold' }}
        >
          {restaurant.category}
        </AppText>

        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <Truck size={16} color='#10B981' />
            <AppText
              className='text-green-600 ml-1 font-medium'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              {restaurant.deliveryFee === 0
                ? 'Free delivery'
                : `K${restaurant.deliveryFee} delivery`}
            </AppText>
            <AppText className='text-gray-500 ml-3 text-sm'>
              Min K{restaurant.minOrder}
            </AppText>
          </View>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              isFollowing ? 'bg-gray-200' : 'bg-primary'
            }`}
            onPress={() => setIsFollowing(!isFollowing)}
          >
            <AppText
              className={`font-medium ${
                isFollowing ? 'text-gray-700' : 'text-white'
              }`}
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View className='px-4 py-4'>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className='flex-row gap-3'>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <AppText
                  className={`text-sm font-medium ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                >
                  {category}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className='flex-1 px-4'>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            className='bg-white rounded-2xl mb-4 shadow-sm border border-gray-100'
            onPress={() => navigation.navigate('ProductDetail', { product })}
          >
            <View className='flex-row p-4'>
              <View className='flex-1 mr-4'>
                <AppText
                  className='text-gray-800 font-semibold text-lg mb-2'
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                >
                  {product.name}
                </AppText>
                <AppText
                  className='text-gray-500 text-sm mb-3'
                  numberOfLines={2}
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                >
                  {product.description}
                </AppText>

                <View className='flex-row items-center mb-2'>
                  <Star size={14} color='#FCD34D' fill='#FCD34D' />
                  <AppText
                    className='text-gray-600 text-sm ml-1'
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    {product.rating}
                  </AppText>
                  <AppText
                    className='text-gray-400 text-sm ml-1'
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    ({product.reviews})
                  </AppText>
                </View>

                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center'>
                    <AppText
                      className='text-primary font-bold text-xl'
                      style={{ fontFamily: 'Ubuntu-Bold' }}
                    >
                      K{product.price}
                    </AppText>
                    {product.originalPrice && (
                      <AppText
                        className='text-gray-400 text-sm line-through ml-2'
                        style={{ fontFamily: 'Ubuntu-Bold' }}
                      >
                        K{product.originalPrice}
                      </AppText>
                    )}
                  </View>
                  <TouchableOpacity
                    className='bg-primary px-4 py-2 rounded-full'
                    onPress={() => addToCart(product)}
                  >
                    <AppText
                      className='text-white text-sm font-medium'
                      style={{ fontFamily: 'Ubuntu-Bold' }}
                    >
                      Add to Cart
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>

              <View className='relative'>
                <Image
                  source={{ uri: product.image }}
                  className='w-24 h-24 rounded-xl'
                  resizeMode='cover'
                />
                {product.isPromo && (
                  <View className='absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center'>
                    <AppText
                      className='text-white text-xs font-bold'
                      style={{ fontFamily: 'Ubuntu-Bold' }}
                    >
                      %
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// Product Detail Screen
export function ProductDetailScreen({
  route,
  navigation,
}: ProductDetailScreenProps) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const sizes = ['Small', 'Medium', 'Large'];
  const extras = ['Extra Cheese', 'Bacon', 'Avocado', 'Extra Sauce'];
  const sizePrice = { Small: -5, Medium: 0, Large: 10 };
  const extraPrice = 5;

  const calculateTotal = () => {
    const basePrice = product.price;
    const sizePriceAdjustment =
      sizePrice[selectedSize as keyof typeof sizePrice];
    const extrasTotal = selectedExtras.length * extraPrice;
    return (basePrice + sizePriceAdjustment + extrasTotal) * quantity;
  };

  const toggleExtra = (extra: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    );
  };

  const addToCart = () => {
    const customProduct = {
      ...product,
      price: calculateTotal() / quantity,
      customizations: {
        size: selectedSize,
        extras: selectedExtras,
      },
    };

    const existingItem = globalCart.find(
      (item) =>
        item.id === product.id &&
        JSON.stringify((item as any).customizations) ===
          JSON.stringify(customProduct.customizations)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      globalCart.push({ ...customProduct, quantity });
    }

    Alert.alert(
      'Added to Cart',
      `${quantity}x ${product.name} has been added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  return (
    <View className='flex-1 bg-white'>
      <View className='relative'>
        <Image
          source={{ uri: product.image }}
          className='w-full h-80'
          resizeMode='cover'
        />
        <View className='absolute top-12 left-4 right-4 flex-row justify-between'>
          <TouchableOpacity
            className='bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm'
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={20} color='#374151' />
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm'
            onPress={() => navigation.navigate('Cart')}
          >
            <ShoppingCart size={20} color='#374151' />
          </TouchableOpacity>
        </View>
        {product.isPromo && (
          <View className='absolute bottom-4 left-4 bg-red-500 px-3 py-2 rounded-full'>
            <AppText
              className='text-white font-semibold'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              {product.promoText}
            </AppText>
          </View>
        )}
      </View>

      <ScrollView className='flex-1'>
        <View className='px-4 py-6'>
          <AppText
            className='text-2xl font-bold text-gray-800 mb-2'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            {product.name}
          </AppText>

          <View className='flex-row items-center mb-4'>
            <Star size={16} color='#FCD34D' fill='#FCD34D' />
            <AppText
              className='text-gray-600 ml-1 font-medium'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              {product.rating}
            </AppText>
            <AppText
              className='text-gray-400 ml-1'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              ({product.reviews} reviews)
            </AppText>
            <AppText
              className='text-gray-400 ml-4'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              •
            </AppText>
            <AppText
              className='text-primary ml-2 font-medium'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              {product.restaurant}
            </AppText>
          </View>

          <AppText
            className='text-gray-600 text-base mb-6 leading-6'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            {product.description}
          </AppText>

          <View className='mb-6'>
            <AppText
              className='text-gray-800 font-semibold text-lg mb-3'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Size
            </AppText>
            <View className='flex-row gap-3'>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  className={`flex-1 py-3 rounded-xl border-2 ${
                    selectedSize === size
                      ? 'border-primary bg-primary'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <AppText
                    className={`text-center font-medium ${
                      selectedSize === size ? 'text-primary' : 'text-gray-600'
                    }`}
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    {size}
                  </AppText>
                  <AppText
                    className={`text-center text-sm ${
                      selectedSize === size ? 'text-primary' : 'text-gray-400'
                    }`}
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    {sizePrice[size as keyof typeof sizePrice] >= 0 ? '+' : ''}K
                    {sizePrice[size as keyof typeof sizePrice]}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className='mb-6'>
            <AppText
              className='text-gray-800 font-semibold text-lg mb-3'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Add Extras
            </AppText>
            {extras.map((extra) => (
              <TouchableOpacity
                key={extra}
                onPress={() => toggleExtra(extra)}
                className='flex-row items-center justify-between py-3 border-b border-gray-100'
              >
                <AppText
                  className='text-gray-700 font-medium'
                  style={{ fontFamily: 'Ubuntu-Bold' }}
                >
                  {extra}
                </AppText>
                <View className='flex-row items-center'>
                  <AppText
                    className='text-gray-500 mr-3'
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    +K{extraPrice}
                  </AppText>
                  <View
                    className={`w-6 h-6 rounded border-2 items-center justify-center ${
                      selectedExtras.includes(extra)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedExtras.includes(extra) && (
                      <AppText
                        className='text-white text-xs'
                        style={{ fontFamily: 'Ubuntu-Bold' }}
                      >
                        ✓
                      </AppText>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className='mb-8'>
            <AppText
              className='text-gray-800 font-semibold text-lg mb-3'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Quantity
            </AppText>
            <View className='flex-row items-center'>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className='w-12 h-12 rounded-full border-2 border-gray-200 items-center justify-center'
              >
                <Minus size={18} color='#6B7280' />
              </TouchableOpacity>
              <AppText
                className='mx-6 text-xl font-semibold text-gray-800'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
                {quantity}
              </AppText>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className='w-12 h-12 rounded-full border-2 border-primary bg-primary items-center justify-center'
              >
                <Plus size={18} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className='px-4 py-6 border-t border-gray-100'>
        <TouchableOpacity
          onPress={addToCart}
          className='bg-primary py-4 rounded-2xl flex-row items-center justify-center'
        >
          <ShoppingCart size={20} color='white' />
          <AppText
            className='text-white font-bold text-lg ml-2'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Add to Cart • K{calculateTotal()}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Cart Screen
export function CartScreen({ navigation }: CartScreenProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(globalCart);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      globalCart.splice(0, globalCart.length, ...updatedCart);
    } else {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      globalCart.splice(0, globalCart.length, ...updatedCart);
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    globalCart.splice(0, globalCart.length, ...updatedCart);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <View className='flex-1 bg-white py-4 mt-5'>
        <View className='flex-row items-center px-4 py-6 border-b border-gray-100'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color='#374151' />
          </TouchableOpacity>
          <AppText
            className='text-xl font-bold text-gray-800 ml-4'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Cart
          </AppText>
        </View>

        <View className='flex-1 items-center justify-center px-4'>
          <ShoppingCart size={80} color='#D1D5DB' />
          <AppText
            className='text-xl font-semibold text-gray-800 mt-4 mb-2'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Your cart is empty
          </AppText>
          <AppText
            className='text-gray-500 text-center mb-8'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Add some delicious items to get started
          </AppText>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='bg-primary px-6 py-3 rounded-full'
          >
            <AppText
              className='text-white font-semibold'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Continue Shopping
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
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
        <View className='px-4 pt-4'>
          <Text className='text-center text-[#929292] font-bold text-2xl  mb-4'>
            Cart
          </Text>

          <View className='flex-row items-center justify-between'>
            <Text
              style={{ fontFamily: 'Ubuntu-Bold' }}
              className='text-gray-900 font-bold text-2xl'
            >
              Product
            </Text>
            <View
              className='px-6 py-2 rounded-full'
              style={{ backgroundColor: '#ec4876' }}
            >
              <Text className='text-white font-medium'>3 Items</Text>
            </View>
          </View>
        </View>
        <View className='px-4 py-4'>
          {cartItems.map((item, index) => (
            <View
              key={`${item.id}-${index}`}
              className='bg-white rounded-2xl p-2 shadow-sm'
            >
              <View className='flex-row items-center'>
                <View
                  className='w-6 h-6 rounded-full items-center justify-center mr-3'
                  style={{ backgroundColor: '#ec4876' }}
                >
                  <Ionicons name='checkmark' size={16} color='white' />
                </View>

                <View className='relative'>
                  <View className='w-28 h-28 rounded-3xl bg-primary items-center justify-center mr-4'>
                    <Image
                      source={{
                        uri:
                          item.image ||
                          'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
                      }}
                      className='w-16 h-16 rounded-xl'
                      resizeMode='cover'
                    />
                  </View>
                  <TouchableOpacity className='absolute top-1 right-5'>
                    <View
                      className='w-6 h-6 rounded-full items-center justify-center'
                      style={{ backgroundColor: '#ec4876' }}
                    >
                      <Ionicons name='heart' size={14} color='white' />
                    </View>
                  </TouchableOpacity>
                </View>

                <View className='flex-1'>
                  <AppText
                    className='text-gray-900 font-bold text-lg'
                    numberOfLines={1}
                    style={{ fontFamily: 'Ubuntu-Bold' }}
                  >
                    Apple Watch
                  </AppText>

                  <AppText
                    className='text-gray-500 text-sm'
                    style={{ fontFamily: 'Ubuntu-Regular' }}
                  >
                    Sabai's Store
                  </AppText>

                  <View className='flex-row items-center justify-between'>
                    <AppText
                      className='text-gray-900 font-bold text-xl'
                      style={{ fontFamily: 'Ubuntu-Bold' }}
                    >
                      $300
                    </AppText>

                    <View className='flex-row  items-center'>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className='w-8 h-8 rounded-full bg-gray-200 items-center justify-center'
                      >
                        <Minus size={16} color='#ec4876' strokeWidth={2} />
                      </TouchableOpacity>
                      <AppText
                        className='mx-4 font-bold text-gray-900 text-lg'
                        style={{ fontFamily: 'Ubuntu-Bold' }}
                      >
                        {item.quantity}
                      </AppText>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className='w-8 h-8 rounded-full items-center justify-center'
                        style={{ backgroundColor: '#ec4876' }}
                      >
                        <Plus size={16} color='white' strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className='mx-4 mb-2'>
          <TouchableOpacity className='flex-row items-center mb-6'>
            <View className='w-8 h-8 rounded-full bg-pink-500 items-center justify-center mr-3'>
              <Plus size={16} color='white' strokeWidth={2} />
            </View>
            <AppText
              className='text-gray-900 font-bold text-lg'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Add other items
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity className='border-2 border-dashed bg-[#eeefef] border-pink-400 rounded-full p-2 py-1 mb-6'>
            <AppText
              className='text-pink-500 font-bold text-center text-lg'
              style={{ fontFamily: 'Ubuntu-Bold' }}
            >
              Apply Discount Code
            </AppText>
          </TouchableOpacity>
        </View>

        <View className='mx-4 pb-[100px]'>
          <AppText
            className='text-gray-900 font-bold text-xl mb-4'
            style={{ fontFamily: 'Ubuntu-Bold' }}
          >
            Payment Info
          </AppText>

          <View className='border-b border-gray-200 mb-4' />

          <View className='space-y-3'>
            <View className='flex-row justify-between items-center mb-3'>
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

            <View className='flex-row justify-between items-center mb-3'>
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

            <View className='flex-row justify-between items-center mb-3'>
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

            <View className='flex-row justify-between items-center mb-3'>
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

            <View className='flex-row justify-between items-center mb-6'>
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

            <View className='border-b border-gray-200 mb-4' />

            <View className='flex-row justify-between items-center'>
              <AppText
                className='text-gray-500 font-bold text-lg'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
                Grand Total:
              </AppText>
              <AppText
                className='text-gray-900 font-bold text-lg'
                style={{ fontFamily: 'Ubuntu-Bold' }}
              >
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
            onPress={() => navigation.navigate('Checkout')}
            activeOpacity={0.8}
          >
            <AppText className='text-primary font-bold text-lg'>
              Proceed to Checkout
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  promoCard: {
    width: width * 0.7,
  },
});
