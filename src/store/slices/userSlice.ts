// @ts-nocheck
import { create } from 'zustand';
import { UserState, UserProfile, DeliveryAddress, Product, VendorProfile } from '@/types';
import { createPersistentStore } from '@/src/store/utils/persistentStore';

interface UserStore extends UserState {
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: DeliveryAddress) => void;
  updateAddress: (addressId: string, updates: Partial<DeliveryAddress>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addFavoriteProduct: (product: Product) => void;
  removeFavoriteProduct: (productId: string) => void;
  addFavoriteVendor: (vendor: VendorProfile) => void;
  removeFavoriteVendor: (vendorId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>()(
  createPersistentStore(
    (set, get) => ({
      // Initial state
      profile: null,
      addresses: [],
      favoriteProducts: [],
      favoriteVendors: [],
      isLoading: false,
      error: null,

      // Actions
      setProfile: (profile: UserProfile) => {
        set({
          profile,
          addresses: profile.addresses || [],
        });
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          const updatedProfile = { ...currentProfile, ...updates };
          set({
            profile: updatedProfile,
            addresses: updatedProfile.addresses || get().addresses,
          });
        }
      },

      addAddress: (address: DeliveryAddress) => {
        const addresses = [...get().addresses, address];
        set({ addresses });
        
        // Update profile if exists
        const profile = get().profile;
        if (profile) {
          set({ profile: { ...profile, addresses } });
        }
      },

      updateAddress: (addressId: string, updates: Partial<DeliveryAddress>) => {
        const addresses = get().addresses.map(addr =>
          addr.id === addressId ? { ...addr, ...updates } : addr
        );
        set({ addresses });
        
        // Update profile if exists
        const profile = get().profile;
        if (profile) {
          set({ profile: { ...profile, addresses } });
        }
      },

      removeAddress: (addressId: string) => {
        const addresses = get().addresses.filter(addr => addr.id !== addressId);
        set({ addresses });
        
        // Update profile if exists
        const profile = get().profile;
        if (profile) {
          set({ profile: { ...profile, addresses } });
        }
      },

      setDefaultAddress: (addressId: string) => {
        const addresses = get().addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId,
        }));
        set({ addresses });
        
        // Update profile if exists
        const profile = get().profile;
        if (profile) {
          set({ profile: { ...profile, addresses } });
        }
      },

      addFavoriteProduct: (product: Product) => {
        const favoriteProducts = get().favoriteProducts;
        const exists = favoriteProducts.some(p => p.id === product.id);
        if (!exists) {
          set({ favoriteProducts: [...favoriteProducts, product] });
        }
      },

      removeFavoriteProduct: (productId: string) => {
        const favoriteProducts = get().favoriteProducts.filter(p => p.id !== productId);
        set({ favoriteProducts });
      },

      addFavoriteVendor: (vendor: VendorProfile) => {
        const favoriteVendors = get().favoriteVendors;
        const exists = favoriteVendors.some(v => v.id === vendor.id);
        if (!exists) {
          set({ favoriteVendors: [...favoriteVendors, vendor] });
        }
      },

      removeFavoriteVendor: (vendorId: string) => {
        const favoriteVendors = get().favoriteVendors.filter(v => v.id !== vendorId);
        set({ favoriteVendors });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        profile: state.profile,
        addresses: state.addresses,
        favoriteProducts: state.favoriteProducts,
        favoriteVendors: state.favoriteVendors,
      }),
    }
  )
);
