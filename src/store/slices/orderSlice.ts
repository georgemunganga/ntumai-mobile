import { create } from 'zustand';
import { OrderState, Order, OrderStatus } from '@/types';

interface OrderStore extends OrderState {
  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setCurrentOrder: (order: Order | null) => void;
  removeOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  // Initial state
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  // Actions
  setOrders: (orders: Order[]) => {
    set({ orders });
  },

  addOrder: (order: Order) => {
    const orders = [order, ...get().orders];
    set({ orders, currentOrder: order });
  },

  updateOrder: (orderId: string, updates: Partial<Order>) => {
    const orders = get().orders.map(order =>
      order.id === orderId
        ? { ...order, ...updates, updatedAt: new Date().toISOString() }
        : order
    );
    set({ orders });

    // Update current order if it's the one being updated
    const currentOrder = get().currentOrder;
    if (currentOrder && currentOrder.id === orderId) {
      set({ currentOrder: { ...currentOrder, ...updates, updatedAt: new Date().toISOString() } });
    }
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    get().updateOrder(orderId, { status });
  },

  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order });
  },

  removeOrder: (orderId: string) => {
    const orders = get().orders.filter(order => order.id !== orderId);
    set({ orders });

    // Clear current order if it's the one being removed
    const currentOrder = get().currentOrder;
    if (currentOrder && currentOrder.id === orderId) {
      set({ currentOrder: null });
    }
  },

  getOrderById: (orderId: string) => {
    return get().orders.find(order => order.id === orderId);
  },

  getOrdersByStatus: (status: OrderStatus) => {
    return get().orders.filter(order => order.status === status);
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

  clearOrders: () => {
    set({
      orders: [],
      currentOrder: null,
      error: null,
    });
  },
}));
