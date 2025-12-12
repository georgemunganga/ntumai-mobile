import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Switch,
  Modal,
  Pressable,
  FlatList,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Edit,
  Globe,
  Trash2,
  Clock4,
} from 'lucide-react-native';
import Text from '../../components/Text';
import { useRouter } from 'expo-router';
import HeaderBar from '../../components/HeaderBar';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  isActive: boolean;
}

interface Promotion {
  id: string;
  name: string;
  code: string;
  discount: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: 'Active' | 'Inactive';
  image: string;
}

interface Category {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  image: string;
}
interface Brand {
  id: string;
  name: string;
  image: string;
}

export default function VenderProducts() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );

  // Mock data for products
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Mixed Salad',
      price: 20.0,
      rating: 3.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      isActive: true,
    },
    {
      id: '2',
      name: 'Mixed Salad',
      price: 20.0,
      rating: 3.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      isActive: true,
    },
    {
      id: '3',
      name: 'Mixed Salad',
      price: 20.0,
      rating: 3.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      isActive: true,
    },
    {
      id: '4',
      name: 'Mixed Salad',
      price: 20.0,
      rating: 3.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      isActive: true,
    },
    {
      id: '5',
      name: 'Mixed Salad',
      price: 20.0,
      rating: 3.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      isActive: true,
    },
    {
      id: '6',
      name: 'Mixed Salad',
      price: 20.0,
      rating: 3.5,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      isActive: true,
    },
  ]);

  // Mock data for promotions
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      name: 'Store wide promotion',
      code: 'B28769',
      discount: '50% OFF',
      startDate: '07-02-2025',
      startTime: '08:00am',
      endDate: '03-02-2025',
      endTime: '09:00am',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      name: 'Bonus promotion',
      code: 'B28768',
      discount: '25% OFF',
      startDate: '07-02-2025',
      startTime: '08:00am',
      endDate: '03-02-2025',
      endTime: '09:00am',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      name: 'Store wide promotion',
      code: 'B28767',
      discount: '50% OFF',
      startDate: '07-02-2025',
      startTime: '08:00am',
      endDate: '03-02-2025',
      endTime: '09:00am',
      status: 'Inactive',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '4',
      name: 'Mini Pack promotion',
      code: 'B28766',
      discount: '10% OFF',
      startDate: '07-02-2025',
      startTime: '08:00am',
      endDate: '03-02-2025',
      endTime: '09:00am',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    },
    {
      id: '5',
      name: 'Store wide promotion',
      code: 'B28765',
      discount: '50% OFF',
      startDate: '07-02-2025',
      startTime: '08:00am',
      endDate: '03-02-2025',
      endTime: '09:00am',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '6',
      name: 'Extravagant Promo',
      code: 'B28764',
      discount: '50% OFF',
      startDate: '07-02-2025',
      startTime: '08:00am',
      endDate: '03-02-2025',
      endTime: '09:00am',
      status: 'Inactive',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
  ]);

  // Mock data for categories
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Beef',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      name: 'Meat',
      status: 'Inactive',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      name: 'Soya',
      status: 'Active',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '4',
      name: 'Chicken',
      status: 'Inactive',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
  ]);
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: '1',
      name: 'Beef',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      name: 'Meat',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      name: 'Soya',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
    {
      id: '4',
      name: 'Chicken',
      image:
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    },
  ]);

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'Products':
        return 'Add Products';
      case 'Promotions':
        return 'Add Promotions';
      case 'Categories':
        return 'Add Category';
      default:
        return 'Add Brand';
    }
  };

  const handleToggleProduct = (productId: string) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, isActive: !product.isActive }
          : product
      )
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
    setShowActionModal(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    // Navigate to edit screen
    console.log('Navigate to edit screen for product:', product.id);
    router.push('/(vendor)/EditProduct');
    setShowActionModal(false);
    setSelectedProduct(null);
  };

  const openActionModal = (product: Product) => {
    setSelectedProduct(product);
    setShowActionModal(true);
  };
  const handleDeletePromotion = (promotionId: string) => {
    setPromotions(
      promotions.filter((promotion) => promotion.id !== promotionId)
    );
    setShowActionModal(false);
    setSelectedPromotion(null);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    // Navigate to edit screen
    console.log('Navigate to edit screen for promotion:', promotion.id);
    router.push('/(vendor)/EditPromotion');
    setShowActionModal(false);
    setSelectedPromotion(null);
  };

  const openActionModalPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowActionModal(true);
  };
  const openActionModalBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowActionModal(true);
  };
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    setShowActionModal(false);
    setSelectedCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    // Navigate to edit screen
    console.log('Navigate to edit screen for category:', category.id);
    router.push('/(vendor)/EditCategory');
    setShowActionModal(false);
    setSelectedCategory(null);
  };

  const openActionModalCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowActionModal(true);
  };

  const handleCreate = () => {
    const buttonLable = getAddButtonText();
    if (buttonLable == 'Add Promotions') {
      router.push('/(vendor)/CreatePromotion');
    } else if (buttonLable == 'Add Category') {
      router.push('/(vendor)/CreateCategory');
    } else if (buttonLable == 'Add Brand') {
      router.push('/(vendor)/CreateBrand');
    }
  };
  const renderProducts = () => (
    <View className='px-4'>
      {products.map((product) => (
        <View key={product.id} className='bg-[#eeeeee] rounded-3xl p-4 mb-3'>
          <View className='flex-row items-center'>
            <View className='w-16 h-16 rounded-full overflow-hidden mr-4'>
              <Image
                source={{ uri: product.image }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </View>

            <View className='flex-1'>
              <Text className='font-semibold text-gray-900 text-lg mb-1'>
                {product.name}
              </Text>
              <Text className='text-gray-700 text-sm mb-1'>
                Price K{product.price.toFixed(2)}
              </Text>
              <Text className='text-gray-700 text-sm'>
                Rating: {product.rating}/5 ★
              </Text>
            </View>

            <View className='items-end'>
              <TouchableOpacity
                className='p-2 mb-2'
                onPress={() => openActionModal(product)}
              >
                <Text className='text-[#43b7a2] text-2xl font-bold'>⋮</Text>
              </TouchableOpacity>
              <Switch
                value={product.isActive}
                onValueChange={() => handleToggleProduct(product.id)}
                trackColor={{ false: '#E5E7EB', true: '#08AF97' }}
                thumbColor={product.isActive ? '#FFFFFF' : '#FFFFFF'}
                ios_backgroundColor='#E5E7EB'
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPromotions = () => (
    <View className='px-4'>
      {promotions.map((promo) => (
        <TouchableOpacity
          key={promo.id}
          className='bg-[#eeeeee] rounded-3xl mb-3'
          onPress={() => router.push('/(vendor)/PreviewPromotion')}
        >
          <View className='h-[140px] flex-row justify-between items-start'>
            <View className='w-[140px] mr-3 h-full relative'>
              <Image
                source={{ uri: promo.image }}
                className='w-full h-full rounded-3xl'
                resizeMode='cover'
              />
              <View
                className={`absolute top-8 left-0 px-2 py-1 rounded-tr-full rounded-br-full ${
                  promo.status === 'Active' ? 'bg-[#40af97]' : 'bg-gray-400'
                }`}
              >
                <Text className='text-white text-xl font-medium'>
                  {promo.status}
                </Text>
              </View>
            </View>

            <View className='flex-1 h-full pt-2'>
              <Text className='font-semibold text-gray-900 text-lg mb-1'>
                {promo.name}
              </Text>
              <Text className='text-gray-900text-sm mb-2'>
                Code: {promo.code}
              </Text>
              <View className='bg-[#ed4877] rounded-full px-3 py-1 self-start mb-2'>
                <Text className='text-white font-medium'>{promo.discount}</Text>
              </View>
              <Text className='text-gray-500 text-sm'>
                {promo.startDate} {promo.startTime}
              </Text>
              <Text className='text-gray-500 text-sm'>
                {promo.endDate} {promo.endTime}
              </Text>
            </View>

            <View className='h-full flex-col align-center justify-center pr-3'>
              <TouchableOpacity
                onPress={() => openActionModalPromotion(promo)}
                className='p-2 items-center'
              >
                <Text className='text-[#43b7a2] text-2xl font-bold'>⋮</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategories = () => (
    <View className='px-4'>
      <View className='flex-row flex-wrap justify-between'>
        {categories.map((category) => (
          <TouchableOpacity
            onPress={() => handleCreate()}
            key={category.id}
            className='w-[48%] bg-[#eeeeee] rounded-2xl p-4 mb-4 relative'
          >
            <View
              className={`absolute top-8 z-20 left-0 px-3 py-1 rounded-tr-full rounded-br-full shadow-lg ${
                category.status === 'Active' ? 'bg-[#0aaf97]' : 'bg-[#909090]'
              }`}
            >
              <Text className='text-white text-xl font-medium'>
                {category.status}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => openActionModalCategory(category)}
              className='absolute top-2 right-2 p-1'
            >
              <Text className='color-primary text-2xl font-bold'>⋮</Text>
            </TouchableOpacity>
            <View className='items-center mt-6 mb-3'>
              <View className='w-32 h-32 rounded-3xl overflow-hidden relative'>
                <Image
                  source={{ uri: category.image }}
                  className='w-full h-full absolute'
                  resizeMode='cover'
                />
                <View className='w-full h-full absolute opacity-25 bg-green-500 bg-opacity-50'></View>
              </View>
            </View>
            <Text className='text-center text-black font-medium text-base'>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  const renderBrands = () => (
    <View className='px-4'>
      <View className='flex-row flex-wrap justify-between'>
        {brands.map((brand) => (
          <TouchableOpacity
            onPress={() => handleCreate()}
            key={brand.id}
            className='w-[48%] bg-[#eeeeee] rounded-2xl p-4 mb-4 relative'
          >
            <TouchableOpacity
              onPress={() => openActionModalBrand(brand)}
              className='absolute top-2 right-2 p-1'
            >
              <Text className='color-primary text-2xl font-bold'>⋮</Text>
            </TouchableOpacity>
            <View className='items-center mt-6 mb-3'>
              <View className='w-32 h-32 rounded-3xl overflow-hidden relative'>
                <Image
                  source={{ uri: brand.image }}
                  className='w-full h-full absolute'
                  resizeMode='cover'
                />
                <View className='w-full h-full absolute opacity-25 bg-green-500 bg-opacity-50'></View>
              </View>
            </View>
            <Text className='text-center text-black font-medium text-base'>
              {brand.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <StatusBar barStyle='dark-content' />
      <HeaderBar />
      <View className='bg-white px-4 py-4 border-b border-gray-200'>
        <FlatList
          horizontal
          data={['Products', 'Promotions', 'Categories', 'Brands']}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 4 }}
          style={{ marginBottom: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(tab)}
              className={`py-3 px-4 rounded-full border border-[#08AF97] ${
                activeTab === tab ? 'bg-[#08AF97]' : 'bg-white'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === tab ? 'text-white' : 'text-[#08AF97]'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )}
        />

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

        <View className='flex-row items-center justify-between'>
          <TouchableOpacity className='p-2'>
            <SlidersHorizontal size={20} color='#08AF97' />
          </TouchableOpacity>
          <View className='flex-row'>
            <TouchableOpacity
              onPress={() => handleCreate()}
              className='bg-[#eeeeee] px-4 py-2 rounded-[20px] flex-row items-center mr-2'
            >
              <Plus size={20} color='#08AF97' />
              <Text className='text-[#08AF97] font-medium ml-1'>
                {getAddButtonText()}
              </Text>
            </TouchableOpacity>
            {activeTab === 'Products' && (
              <TouchableOpacity className='bg-[#08AF97] flex gap-2 px-4 py-2 rounded-[20px] flex-row items-center'>
                <SlidersHorizontal size={20} color='white' />
                <Text className='text-white font-medium ml-1'>Reorder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView className='flex-1 py-4'>
        {activeTab === 'Products' && renderProducts()}
        {activeTab === 'Promotions' && renderPromotions()}
        {activeTab === 'Categories' && renderCategories()}
        {activeTab === 'Brands' && renderBrands()}
      </ScrollView>

      <Modal
        visible={showActionModal}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setShowActionModal(false)}
      >
        <Pressable
          className='flex-1 bg-opacity-50'
          onPress={() => setShowActionModal(false)}
        >
          <View className='flex-1 justify-end'>
            <Pressable className='bg-white rounded-t-3xl p-6'>
              <TouchableOpacity
                className='flex-row items-center py-4 '
                onPress={() =>
                  selectedProduct && handleEditProduct(selectedProduct)
                }
              >
                <Edit size={20} color='#6B7280' />
                <Text className='text-gray-600 ml-3 flex-1'>Edit</Text>
              </TouchableOpacity>

              {selectedPromotion || selectedCategory ? (
                <TouchableOpacity
                  className='flex-row items-center py-4 '
                  onPress={() => {
                    if (selectedProduct) {
                      handleEditProduct(selectedProduct);
                    } else if (selectedPromotion) {
                      handleEditPromotion(selectedPromotion);
                    } else if (selectedCategory) {
                      handleEditCategory(selectedCategory);
                    }
                  }}
                >
                  <Clock4 size={20} color='#6B7280' />
                  <Text className='text-gray-600 ml-3 flex-1'>
                    set {activeTab == 'promotions' ? 'expire' : ''} Time
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className='flex-row items-center py-4 '>
                  <Globe size={20} color='#6B7280' />
                  <Text className='text-gray-600 ml-3 flex-1'>Public</Text>
                  <Switch
                    value={selectedProduct?.isActive || false}
                    onValueChange={() => {
                      if (selectedProduct) {
                        const updatedProduct = {
                          ...selectedProduct,
                          isActive: !selectedProduct.isActive,
                        };
                        setSelectedProduct(updatedProduct);
                        handleToggleProduct(updatedProduct.id);
                      }
                    }}
                    trackColor={{ false: '#E5E7EB', true: '#08AF97' }}
                    thumbColor='#FFFFFF'
                    ios_backgroundColor='#E5E7EB'
                  />
                </View>
              )}

              <TouchableOpacity
                className='flex-row items-center py-4'
                onPress={() =>
                  selectedProduct
                    ? handleDeleteProduct(selectedProduct.id)
                    : handleDeletePromotion(selectedPromotion?.id || '')
                }
              >
                <Trash2 size={20} color='#EF4444' />
                <Text className='text-red-500 ml-3 flex-1'>Delete</Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
