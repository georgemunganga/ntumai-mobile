// @ts-nocheck
import { create } from 'zustand';
import { Product } from '@/types';
import { mockMarketplaceService } from '@/src/api/mockServices';
import { createPersistentStore } from '@/src/store/utils/persistentStore';

interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  distance?: number;
}

interface MarketplaceState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  products: Product[];
  selectedProduct: Product | null;
  categories: any[];
  searchResults: Product[];
  searchQuery: string;
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    sortBy?: 'relevance' | 'rating' | 'price' | 'delivery_time';
  };
  isLoading: boolean;
  error: string | null;
}

interface MarketplaceStore extends MarketplaceState {
  // Vendor actions
  fetchVendors: (latitude?: number, longitude?: number, search?: string) => Promise<void>;
  selectVendor: (vendor: Vendor) => void;
  getVendorDetail: (vendorId: string) => Promise<void>;

  // Product actions
  fetchProducts: (vendorId: string, categoryId?: string) => Promise<void>;
  selectProduct: (product: Product) => void;
  getProductDetail: (productId: string) => Promise<void>;

  // Category actions
  fetchCategories: (vendorId: string) => Promise<void>;

  // Search and filter
  searchProducts: (query: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<MarketplaceState['filters']>) => void;
  clearFilters: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: MarketplaceState = {
  vendors: [],
  selectedVendor: null,
  products: [],
  selectedProduct: null,
  categories: [],
  searchResults: [],
  searchQuery: '',
  filters: {},
  isLoading: false,
  error: null,
};

export const useMarketplaceStore = create<MarketplaceStore>()(
  createPersistentStore(
    (set, get) => ({
      ...initialState,

      // Vendor actions
      fetchVendors: async (latitude?: number, longitude?: number, search?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockMarketplaceService.getVendors(latitude, longitude, search);
          if (response.success) {
            set({ vendors: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      selectVendor: (vendor: Vendor) => {
        set({ selectedVendor: vendor, selectedProduct: null, products: [] });
      },

      getVendorDetail: async (vendorId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockMarketplaceService.getVendorDetail(vendorId);
          if (response.success) {
            set({ selectedVendor: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Product actions
      fetchProducts: async (vendorId: string, categoryId?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockMarketplaceService.getProducts(vendorId, categoryId);
          if (response.success) {
            set({ products: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      selectProduct: (product: Product) => {
        set({ selectedProduct: product });
      },

      getProductDetail: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockMarketplaceService.getProductDetail(productId);
          if (response.success) {
            set({ selectedProduct: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Category actions
      fetchCategories: async (vendorId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockMarketplaceService.getCategories(vendorId);
          if (response.success) {
            set({ categories: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Search and filter
      searchProducts: async (query: string) => {
        try {
          set({ isLoading: true, error: null, searchQuery: query });
          const response = await mockMarketplaceService.searchProducts(query, get().filters);
          if (response.success) {
            set({ searchResults: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setFilters: (filters: Partial<MarketplaceState['filters']>) => {
        set(state => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      // State management
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'marketplace-store',
      partialize: (state) => ({
        vendors: state.vendors,
        selectedVendor: state.selectedVendor,
        products: state.products,
        filters: state.filters,
      }),
    }
  )
);
