// @ts-nocheck
import { create } from 'zustand';
import { VendorState, VendorProfile, VendorStats, Product, Order } from '../types';
import { createPersistentStore } from '../utils/persistentStore';

interface VendorStore extends VendorState {
  // Actions
  setProfile: (profile: VendorProfile) => void;
  updateProfile: (updates: Partial<VendorProfile>) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  updateStats: (stats: Partial<VendorStats>) => void;
  toggleVendorStatus: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetVendorData: () => void;
}

export const useVendorStore = create<VendorStore>()(
  createPersistentStore(
    (set, get) => ({
      // Initial state
      profile: null,
      products: [],
      orders: [],
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalProducts: 0,
        activeOrders: 0,
      },
      isLoading: false,
      error: null,

      // Actions
      setProfile: (profile: VendorProfile) => {
        set({ profile });
      },

      updateProfile: (updates: Partial<VendorProfile>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({ profile: { ...currentProfile, ...updates } });
        }
      },

      setProducts: (products: Product[]) => {
        set({ products });
        // Update stats
        const stats = get().stats;
        set({ stats: { ...stats, totalProducts: products.length } });
      },

      addProduct: (product: Product) => {
        const products = [...get().products, product];
        set({ products });
        // Update stats
        const stats = get().stats;
        set({ stats: { ...stats, totalProducts: products.length } });
      },

      updateProduct: (productId: string, updates: Partial<Product>) => {
        const products = get().products.map(product =>
          product.id === productId ? { ...product, ...updates } : product
        );
        set({ products });
      },

      removeProduct: (productId: string) => {
        const products = get().products.filter(product => product.id !== productId);
        set({ products });
        // Update stats
        const stats = get().stats;
        set({ stats: { ...stats, totalProducts: products.length } });
      },

      toggleProductAvailability: (productId: string) => {
        const products = get().products.map(product =>
          product.id === productId
            ? { ...product, isAvailable: !product.isAvailable }
            : product
        );
        set({ products });
      },

      setOrders: (orders: Order[]) => {
        set({ orders });
        // Update stats
        const stats = get().stats;
        const activeOrders = orders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'ready_for_pickup'].includes(order.status)
        ).length;
        const totalRevenue = orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + order.totalAmount, 0);
        
        set({
          stats: {
            ...stats,
            totalOrders: orders.length,
            activeOrders,
            totalRevenue,
          }
        });
      },

      addOrder: (order: Order) => {
        const orders = [order, ...get().orders];
        set({ orders });
        // Update stats
        const stats = get().stats;
        set({
          stats: {
            ...stats,
            totalOrders: orders.length,
            activeOrders: stats.activeOrders + 1,
          }
        });
      },

      updateOrder: (orderId: string, updates: Partial<Order>) => {
        const orders = get().orders.map(order =>
          order.id === orderId
            ? { ...order, ...updates, updatedAt: new Date().toISOString() }
            : order
        );
        set({ orders });
        
        // Recalculate stats if order status changed
        if (updates.status) {
          const stats = get().stats;
          const activeOrders = orders.filter(order => 
            ['pending', 'confirmed', 'preparing', 'ready_for_pickup'].includes(order.status)
          ).length;
          const totalRevenue = orders
            .filter(order => order.status === 'delivered')
            .reduce((sum, order) => sum + order.totalAmount, 0);
          
          set({
            stats: {
              ...stats,
              activeOrders,
              totalRevenue,
            }
          });
        }
      },

      removeOrder: (orderId: string) => {
        const orders = get().orders.filter(order => order.id !== orderId);
        set({ orders });
        // Update stats
        const stats = get().stats;
        const activeOrders = orders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'ready_for_pickup'].includes(order.status)
        ).length;
        
        set({
          stats: {
            ...stats,
            totalOrders: orders.length,
            activeOrders,
          }
        });
      },

      updateStats: (stats: Partial<VendorStats>) => {
        const currentStats = get().stats;
        set({ stats: { ...currentStats, ...stats } });
      },

      toggleVendorStatus: () => {
        const profile = get().profile;
        if (profile) {
          set({ profile: { ...profile, isOpen: !profile.isOpen } });
        }
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

      resetVendorData: () => {
        set({
          profile: null,
          products: [],
          orders: [],
          stats: {
            totalOrders: 0,
            totalRevenue: 0,
            averageRating: 0,
            totalProducts: 0,
            activeOrders: 0,
          },
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'vendor-store',
      partialize: (state) => ({
        profile: state.profile,
        stats: state.stats,
      }),
    }
  )
);
