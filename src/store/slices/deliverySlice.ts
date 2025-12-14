// @ts-nocheck
import { create } from 'zustand';
import { DeliveryAddress } from '@/types';
import { mockP2PService } from '@/src/api/mockServices';
import { createPersistentStore } from '@/src/store/utils/persistentStore';

interface P2PDelivery {
  id: string;
  senderId: string;
  senderName: string;
  recipientName: string;
  recipientPhone: string;
  pickupLocation: DeliveryAddress;
  dropoffLocation: DeliveryAddress;
  itemDescription: string;
  deliveryType: 'moto' | 'car' | 'truck';
  estimatedPrice: number;
  status: 'pending' | 'accepted' | 'on_the_way' | 'delivered' | 'cancelled';
  driverId?: string;
  createdAt: string;
  completedAt?: string;
  trackingLink: string;
}

interface DeliveryState {
  deliveries: P2PDelivery[];
  currentDelivery: P2PDelivery | null;
  trackedDelivery: P2PDelivery | null;
  estimatedPrice: number | null;
  estimatedTime: string | null;
  isLoading: boolean;
  error: string | null;
}

interface DeliveryStore extends DeliveryState {
  // Delivery actions
  createDelivery: (deliveryData: any) => Promise<P2PDelivery | null>;
  getDeliveries: (userId: string, role?: 'sender' | 'driver') => Promise<void>;
  getDeliveryDetail: (deliveryId: string) => Promise<void>;
  trackDelivery: (trackingId: string) => Promise<void>;
  estimatePrice: (pickupLocation: any, dropoffLocation: any, deliveryType: string) => Promise<void>;
  cancelDelivery: (deliveryId: string) => Promise<void>;

  // State management
  setCurrentDelivery: (delivery: P2PDelivery | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: DeliveryState = {
  deliveries: [],
  currentDelivery: null,
  trackedDelivery: null,
  estimatedPrice: null,
  estimatedTime: null,
  isLoading: false,
  error: null,
};

export const useDeliveryStore = create<DeliveryStore>()(
  createPersistentStore(
    (set, get) => ({
      ...initialState,

      createDelivery: async (deliveryData: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockP2PService.createDelivery(deliveryData);
          if (response.success) {
            set(state => ({
              deliveries: [response.data, ...state.deliveries],
              currentDelivery: response.data,
              isLoading: false,
            }));
            return response.data;
          } else {
            set({ error: response.error, isLoading: false });
            return null;
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      getDeliveries: async (userId: string, role: 'sender' | 'driver' = 'sender') => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockP2PService.getDeliveries(userId, role);
          if (response.success) {
            set({ deliveries: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      getDeliveryDetail: async (deliveryId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockP2PService.getDeliveryDetail(deliveryId);
          if (response.success) {
            set({ currentDelivery: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      trackDelivery: async (trackingId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockP2PService.trackDelivery(trackingId);
          if (response.success) {
            set({ trackedDelivery: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      estimatePrice: async (pickupLocation: any, dropoffLocation: any, deliveryType: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockP2PService.estimatePrice(pickupLocation, dropoffLocation, deliveryType);
          if (response.success) {
            set({
              estimatedPrice: response.data.estimatedPrice,
              estimatedTime: response.data.estimatedTime,
              isLoading: false,
            });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      cancelDelivery: async (deliveryId: string) => {
        try {
          set({ isLoading: true, error: null });
          const delivery = get().deliveries.find(d => d.id === deliveryId);
          if (delivery && ['pending', 'accepted'].includes(delivery.status)) {
            set(state => ({
              deliveries: state.deliveries.map(d =>
                d.id === deliveryId ? { ...d, status: 'cancelled' } : d
              ),
              isLoading: false,
            }));
          } else {
            set({ error: 'Cannot cancel this delivery', isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      setCurrentDelivery: (delivery: P2PDelivery | null) => {
        set({ currentDelivery: delivery });
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

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'delivery-store',
      partialize: (state) => ({
        deliveries: state.deliveries,
        currentDelivery: state.currentDelivery,
      }),
    }
  )
);
