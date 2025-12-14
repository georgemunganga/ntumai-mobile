import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Switch,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Settings,
  Tag,
  CornerDownLeft,
  DollarSign,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react-native';
import AppText from '@/components/AppText';
import { useRouter } from 'expo-router';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  description: string;
  hasWarranty: boolean;
  isRefundable: boolean;
}

export default function EditProductScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'generalInfo'
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [product, setProduct] = useState<Product>({
    id: '1',
    name: 'Apple Laptop Latest Version',
    category: 'Office Accessory',
    brand: 'Apple',
    price: 250.0,
    description: '',
    hasWarranty: true,
    isRefundable: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateProduct = (field: keyof Product, value: any) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteProduct = () => {
    // Handle product deletion logic here
    console.log('Product deleted');
    setShowDeleteModal(false);
    router.back();
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const renderGeneralInfo = () => (
    <View className='space-y-4'>
      <View>
        <AppText
          style={{ fontFamily: 'Ubuntu-Regular' }}
          className='text-gray-600 text-sm mb-2'
        >
          Product Name
        </AppText>
        <View className='bg-gray-100 rounded-lg px-3 py-3 flex-row items-center'>
          <Package size={20} color='#6B7280' />
          <TextInput
            className='flex-1 ml-2 text-gray-900'
            value={product.name}
            onChangeText={(text) => updateProduct('name', text)}
            placeholder='Enter product name'
          />
        </View>
      </View>

      <View>
        <AppText
          style={{ fontFamily: 'Ubuntu-Regular' }}
          className='text-gray-600 text-sm mb-2'
        >
          Categories
        </AppText>
        <View className='bg-gray-100 rounded-lg px-3 py-3 flex-row items-center'>
          <Layers size={20} color='#6B7280' />
          <TextInput
            className='flex-1 ml-2 text-gray-900'
            value={product.category}
            onChangeText={(text) => updateProduct('category', text)}
            placeholder='Select category'
          />
        </View>
      </View>

      <View>
        <AppText
          style={{ fontFamily: 'Ubuntu-Regular' }}
          className='text-gray-600 text-sm mb-2'
        >
          Brand
        </AppText>
        <View className='bg-gray-100 rounded-lg px-3 py-3 flex-row items-center'>
          <Settings size={20} color='#6B7280' />
          <TextInput
            className='flex-1 ml-2 text-gray-900'
            value={product.brand}
            onChangeText={(text) => updateProduct('brand', text)}
            placeholder='Enter brand'
          />
        </View>
      </View>

      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <Tag size={20} color='#6B7280' />
          <AppText
            style={{ fontFamily: 'Ubuntu-Regular' }}
            className='text-gray-900 ml-2'
          >
            Warranty
          </AppText>
        </View>
        <Switch
          value={product.hasWarranty}
          onValueChange={(value) => updateProduct('hasWarranty', value)}
          trackColor={{ false: '#E5E7EB', true: '#08AF97' }}
          thumbColor='#FFFFFF'
          ios_backgroundColor='#E5E7EB'
        />
      </View>

      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <CornerDownLeft size={20} color='#6B7280' />
          <AppText
            style={{ fontFamily: 'Ubuntu-Regular' }}
            className='text-gray-900 ml-2'
          >
            Refundable
          </AppText>
        </View>
        <Switch
          value={product.isRefundable}
          onValueChange={(value) => updateProduct('isRefundable', value)}
          trackColor={{ false: '#E5E7EB', true: '#08AF97' }}
          thumbColor='#FFFFFF'
          ios_backgroundColor='#E5E7EB'
        />
      </View>

      <View>
        <AppText
          style={{ fontFamily: 'Ubuntu-Regular' }}
          className='text-gray-600 text-sm mb-2'
        >
          Description
        </AppText>
        <TextInput
          className='bg-gray-100 rounded-lg px-3 py-3 text-gray-900 min-h-[100]'
          value={product.description}
          onChangeText={(text) => updateProduct('description', text)}
          placeholder='Enter product description'
          multiline
          textAlignVertical='top'
        />
      </View>

      <View>
        <AppText
          style={{ fontFamily: 'Ubuntu-Regular' }}
          className='text-gray-600 text-sm mb-2'
        >
          Price
        </AppText>
        <View className='bg-gray-100 rounded-lg px-3 py-3 flex-row items-center'>
          <DollarSign size={20} color='#6B7280' />
          <TextInput
            className='flex-1 ml-2 text-gray-900'
            value={product.price.toString()}
            onChangeText={(text) =>
              updateProduct('price', parseFloat(text) || 0)
            }
            placeholder='0.00'
            keyboardType='numeric'
          />
        </View>
      </View>
    </View>
  );

  const renderMedia = () => (
    <View className='space-y-4'>
      <View className='bg-gray-100 rounded-lg p-6 items-center'>
        <ImageIcon size={40} color='#08AF97' />
        <AppText className='text-gray-900 mt-2'>Add Cover</AppText>
      </View>

      <View className='bg-gray-100 rounded-lg p-6 items-center'>
        <ImageIcon size={40} color='#08AF97' />
        <AppText className='text-gray-900 mt-2'>Add Product</AppText>
        <AppText
          style={{ fontFamily: 'Ubuntu-Regular' }}
          className='text-gray-500 text-sm mt-1'
        >
          Please upload at least 8 images.
        </AppText>
      </View>
    </View>
  );

  const renderVariant = () => (
    <View className='space-y-4'>
      <View>
        <AppText className='text-gray-600 text-sm'>Variant name</AppText>
        <View className='bg-[#f8f9fa] rounded-[40px] py-2 px-[9px] flex-row items-center justify-between'>
          <Package size={20} color='#6B7280' />
          <TextInput
            className='flex-1 ml-2 text-gray-900'
            value='Brand 0751 Discount Offer'
            placeholder='Enter variant name'
          />
          <TouchableOpacity className='w-8 h-8 rounded-full ml-2 border-2 border-[#40af97] flex items-center justify-center'>
            <AppText className='text-[#40af97] text-xl font-bold pb-1'>+</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <AppText className='text-gray-600 text-sm'>Fixed Price</AppText>
        <View className='bg-[#f8f9fa] rounded-[40px] py-2 px-[9px] flex-row items-center justify-between'>
          <DollarSign size={20} color='#6B7280' />
          <TextInput
            className='flex-1 ml-2 text-gray-900'
            value='$ 250.00'
            placeholder='0.00'
            keyboardType='numeric'
          />
        </View>
      </View>

      <View className='items-center pt-2'>
        <AppText className='text-gray-500 text-sm text-center'>
          The product price will be the same for all variants
        </AppText>
      </View>
    </View>
  );

  const renderOption = () => (
    <View className='space-y-4'>
      <TouchableOpacity className='bg-white border-2 border-[#40af97] rounded-full py-4 px-6 items-center'>
        <AppText className='text-[#40af97] text-lg'>Copy from other product</AppText>
      </TouchableOpacity>

      <View className='mt-4'>
        <AppText
          style={{ fontFamily: 'Ubuntu-Regular' }}
          className='text-[#909090] text-l pb-4'
        >
          Create New option
        </AppText>
      </View>

      <View>
        <View className='bg-white rounded-full px-3 py-3 flex-row items-center justify-between'>
          <Package size={20} color='#6B7280' />
          <TextInput
            className='flex-1 ml-2 text-gray-900'
            placeholder='Option Name'
            placeholderTextColor='#9CA3AF'
          />
          <TouchableOpacity className='w-8 h-8 rounded-full ml-2 border-2 border-[#40af97] flex items-center justify-center'>
            <AppText className='text-[#40af97] text-xl font-bold pb-1'>+</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <StatusBar barStyle='light-content' />

      <View className='bg-[#08AF97] px-4 py-4'>
        <TouchableOpacity
          className='flex-row items-center'
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color='white' />
          <AppText className='text-white text-lg ml-2'>Back</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1 px-4 py-6'>
        <AppText
          style={{ fontFamily: 'Ubuntu-Bold' }}
          className='text-[#909090] text-2xl text-center mb-6'
        >
          Edit Product
        </AppText>

        <View className='bg-gray-100 rounded-xl p-6 space-y-4'>
          <View>
            <TouchableOpacity
              className='flex-row items-center justify-between py-3'
              onPress={() => toggleSection('generalInfo')}
            >
              <AppText className='text-gray-900 text-lg'>General Info</AppText>
              {expandedSection === 'generalInfo' ? (
                <ChevronUp size={20} color='#6B7280' />
              ) : (
                <ChevronDown size={20} color='#6B7280' />
              )}
            </TouchableOpacity>
            {expandedSection === 'generalInfo' && (
              <View className='pt-4'>{renderGeneralInfo()}</View>
            )}
          </View>

          <View className='border-t border-gray-200' />

          <View>
            <TouchableOpacity
              className='flex-row items-center justify-between py-3'
              onPress={() => toggleSection('media')}
            >
              <AppText className='text-gray-900 text-lg'>Media</AppText>
              {expandedSection === 'media' ? (
                <ChevronUp size={20} color='#6B7280' />
              ) : (
                <ChevronDown size={20} color='#6B7280' />
              )}
            </TouchableOpacity>
            {expandedSection === 'media' && (
              <View className='pt-4'>{renderMedia()}</View>
            )}
          </View>

          <View className='border-t border-gray-200' />

          <View>
            <TouchableOpacity
              className='flex-row items-center justify-between py-3'
              onPress={() => toggleSection('variant')}
            >
              <AppText className='text-gray-900 text-lg'>Variant</AppText>
              {expandedSection === 'variant' ? (
                <ChevronUp size={20} color='#6B7280' />
              ) : (
                <ChevronDown size={20} color='#6B7280' />
              )}
            </TouchableOpacity>
            {expandedSection === 'variant' && (
              <View className='pt-4'>{renderVariant()}</View>
            )}
          </View>

          <View className='border-t border-gray-200' />

          <View>
            <TouchableOpacity
              className='flex-row items-center justify-between py-3'
              onPress={() => toggleSection('option')}
            >
              <AppText className='text-gray-900 text-lg'>Option</AppText>
              {expandedSection === 'option' ? (
                <ChevronUp size={20} color='#6B7280' />
              ) : (
                <ChevronDown size={20} color='#6B7280' />
              )}
            </TouchableOpacity>
            {expandedSection === 'option' && (
              <View className='pt-4'>{renderOption()}</View>
            )}
          </View>

          <View>
            <TouchableOpacity
              className='bg-gray-100 rounded-lg pt-4 flex-row items-center justify-between border-t border-gray-200'
              onPress={openDeleteModal}
            >
              <AppText className='text-[#ed4877] text-lg flex-1'>
                Delete this item
              </AppText>
              <Trash2 size={20} color='#ed4877' />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className='absolute bottom-4 right-4'>
        <TouchableOpacity className='bg-[#08AF97] rounded-full py-3 px-6 items-center'>
          <AppText className='text-white text-base font-medium'>Save</AppText>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDeleteModal}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable
          className='flex-1 bg-[#a6a6a673] bg-opacity-50 justify-center items-center'
          onPress={() => setShowDeleteModal(false)}
        >
          <View className='bg-white rounded-xl p-6 w-80 mx-4'>
            <AppText className='text-gray-900 text-xl mb-4'>Delete Product</AppText>
            <AppText className='text-gray-600 text-sm mb-6'>
              Are you sure you want to delete this product?
            </AppText>
            <View className='flex-row space-x-3 gap-6'>
              <TouchableOpacity
                className='flex-1 bg-white border border-[#08AF97] rounded-full py-3 items-center'
                onPress={() => setShowDeleteModal(false)}
              >
                <AppText className='text-[#08AF97] text-base'>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-1 bg-[#08AF97] rounded-full py-3 items-center'
                onPress={handleDeleteProduct}
              >
                <AppText className='text-white text-base'>Okay</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
