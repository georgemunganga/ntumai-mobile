// @ts-nocheck
import { create } from 'zustand';
import { DriverState, DriverLocation, DriverStats, Order } from '../types';
import { mockDriverService } from '../../api/mockServices';
import { createPersistentStore } from '../utils/persistentStore';

interface DriverStore extends DriverState {
  // Async methods for mock service integration
  fetchAvailableJobs: (driverId: string, latitude: number, longitude: number) => Promise<void>;
  goOnlineAsync: (driverId: string) => Promise<void>;
  goOfflineAsync: (driverId: string) => Promise<void>;
  fetchStats: (driverId: string) => Promise<void>;
  fetchEarnings: (driverId: string, period?: 'today' | 'week' | 'month') => Promise<void>;

  // Sync Actions
  setOnlineStatus: (isOnline: boolean) => void;
  updateLocation: (location: DriverLocation) => void;
  setActiveOrder: (order: Order | null) => void;
  setAvailableOrders: (orders: Order[]) => void;
  addAvailableOrder: (order: Order) => void;
  removeAvailableOrder: (orderId: string) => void;
  acceptOrder: (orderId: string) => void;
  updateStats: (stats: Partial<DriverStats>) => void;
  updateEarnings: (period: 'today' | 'week' | 'month', amount: number) => void;
  addEarnings: (period: 'today' | 'week' | 'month', amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetDriverData: () => void;
}

export const useDriverStore = create<DriverStore>()(
  createPersistentStore(
    (set, get) => ({
      // Initial state
      isOnline: false,
      currentLocation: null,
      activeOrder: null,
      availableOrders: [],
      stats: {
        totalDeliveries: 0,
        totalEarnings: 0,
        averageRating: 0,
        completionRate: 0,
        onTimeRate: 0,
      },
      earnings: {
        today: 0,
        week: 0,
        month: 0,
      },
      isLoading: false,
      error: null,

      // Sync Actions
      setOnlineStatus: (isOnline: boolean) => {
        set({ isOnline });
        if (!isOnline) {
          // Clear available orders when going offline
          set({ availableOrders: [] });
        }
      },

      updateLocation: (location: DriverLocation) => {
        set({ currentLocation: location });
      },

      setActiveOrder: (order: Order | null) => {
        set({ activeOrder: order });
        if (order) {
          // Remove from available orders if accepting
          const availableOrders = get().availableOrders.filter(
            availableOrder => availableOrder.id !== order.id
          );
          set({ availableOrders });
        }
      },

      setAvailableOrders: (orders: Order[]) => {
        set({ availableOrders: orders });
      },

      addAvailableOrder: (order: Order) => {
        const availableOrders = get().availableOrders;
        const exists = availableOrders.some(existingOrder => existingOrder.id === order.id);
        if (!exists) {
          set({ availableOrders: [...availableOrders, order] });
        }
      },

      removeAvailableOrder: (orderId: string) => {
        const availableOrders = get().availableOrders.filter(
          order => order.id !== orderId
        );
        set({ availableOrders });
      },

      acceptOrder: (orderId: string) => {
        const availableOrders = get().availableOrders;
        const order = availableOrders.find(order => order.id === orderId);
        if (order) {
          get().setActiveOrder(order);
        }
      },

      updateStats: (stats: Partial<DriverStats>) => {
        const currentStats = get().stats;
        set({ stats: { ...currentStats, ...stats } });
      },

      updateEarnings: (period: 'today' | 'week' | 'month', amount: number) => {
        const earnings = get().earnings;
        set({ earnings: { ...earnings, [period]: amount } });
      },

      addEarnings: (period: 'today' | 'week' | 'month', amount: number) => {
        const earnings = get().earnings;
        set({ earnings: { ...earnings, [period]: earnings[period] + amount } });

        // Also update total earnings in stats
        const stats = get().stats;
        set({ stats: { ...stats, totalEarnings: stats.totalEarnings + amount } });
      },

      // Async methods for mock service integration
      fetchAvailableJobs: async (driverId: string, latitude: number, longitude: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockDriverService.getAvailableJobs(driverId, latitude, longitude);
          if (response.success) {
            set({ availableOrders: response.data.orders, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      goOnlineAsync: async (driverId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockDriverService.goOnline(driverId);
          if (response.success) {
            set({ isOnline: true, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      goOfflineAsync: async (driverId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockDriverService.goOffline(driverId);
          if (response.success) {
            set({ isOnline: false, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchStats: async (driverId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockDriverService.getStats(driverId);
          if (response.success) {
            set({ stats: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchEarnings: async (driverId: string, period: 'today' | 'week' | 'month' = 'today') => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockDriverService.getEarnings(driverId, period);
          if (response.success) {
            set(state => ({
              earnings: { ...state.earnings, [period]: response.data.amount },
              isLoading: false,
            }));
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
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

      resetDriverData: () => {
        set({
          isOnline: false,
          currentLocation: null,
          activeOrder: null,
          availableOrders: [],
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'driver-store',
      partialize: (state) => ({
        stats: state.stats,
        earnings: state.earnings,
      }),
    }
  )
);
