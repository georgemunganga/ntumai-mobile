// @ts-nocheck
import { create } from 'zustand';
import { mockWalletService, mockPaymentService } from '../../api/mockServices';
import { createPersistentStore } from '../utils/persistentStore';

interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'paypal' | 'mobile_money';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

interface WalletState {
  balance: number;
  currency: string;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
}

interface WalletStore extends WalletState {
  // Wallet actions
  getWalletBalance: (userId: string) => Promise<void>;
  getTransactions: (userId: string, limit?: number) => Promise<void>;
  addFunds: (userId: string, amount: number, paymentMethod: string) => Promise<void>;
  withdrawFunds: (userId: string, amount: number, bankAccount: any) => Promise<void>;

  // Payment method actions
  getPaymentMethods: (userId: string) => Promise<void>;
  addPaymentMethod: (userId: string, methodData: any) => Promise<void>;
  selectPaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (methodId: string) => void;

  // Payment actions
  initiatePayment: (orderId: string, amount: number, paymentMethod: string) => Promise<any>;
  confirmPayment: (paymentId: string) => Promise<void>;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: WalletState = {
  balance: 0,
  currency: 'ZMW',
  transactions: [],
  paymentMethods: [],
  selectedPaymentMethod: null,
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletStore>()(
  createPersistentStore(
    (set, get) => ({
      ...initialState,

      // Wallet actions
      getWalletBalance: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockWalletService.getWalletBalance(userId);
          if (response.success) {
            set({
              balance: response.data.balance,
              currency: response.data.currency,
              isLoading: false,
            });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      getTransactions: async (userId: string, limit: number = 20) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockWalletService.getTransactions(userId, limit);
          if (response.success) {
            set({
              transactions: response.data,
              isLoading: false,
            });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      addFunds: async (userId: string, amount: number, paymentMethod: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockWalletService.addFunds(userId, amount, paymentMethod);
          if (response.success) {
            set(state => ({
              balance: response.data.newBalance,
              transactions: [
                {
                  id: response.data.transactionId,
                  type: 'credit',
                  amount,
                  description: `Added funds via ${paymentMethod}`,
                  timestamp: new Date().toISOString(),
                  status: 'completed',
                },
                ...state.transactions,
              ],
              isLoading: false,
            }));
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      withdrawFunds: async (userId: string, amount: number, bankAccount: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockWalletService.withdrawFunds(userId, amount, bankAccount);
          if (response.success) {
            set(state => ({
              balance: state.balance - amount,
              transactions: [
                {
                  id: response.data.transactionId,
                  type: 'debit',
                  amount,
                  description: `Withdrawal to bank account`,
                  timestamp: new Date().toISOString(),
                  status: 'pending',
                },
                ...state.transactions,
              ],
              isLoading: false,
            }));
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Payment method actions
      getPaymentMethods: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockPaymentService.getPaymentMethods(userId);
          if (response.success) {
            const defaultMethod = response.data.find((m: PaymentMethod) => m.isDefault) || response.data[0];
            set({
              paymentMethods: response.data,
              selectedPaymentMethod: defaultMethod,
              isLoading: false,
            });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      addPaymentMethod: async (userId: string, methodData: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockPaymentService.addPaymentMethod(userId, methodData);
          if (response.success) {
            set(state => ({
              paymentMethods: [...state.paymentMethods, response.data],
              isLoading: false,
            }));
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      selectPaymentMethod: (method: PaymentMethod) => {
        set({ selectedPaymentMethod: method });
      },

      deletePaymentMethod: (methodId: string) => {
        set(state => ({
          paymentMethods: state.paymentMethods.filter(m => m.id !== methodId),
          selectedPaymentMethod:
            state.selectedPaymentMethod?.id === methodId ? null : state.selectedPaymentMethod,
        }));
      },

      // Payment actions
      initiatePayment: async (orderId: string, amount: number, paymentMethod: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockPaymentService.initiatePayment(orderId, amount, paymentMethod);
          if (response.success) {
            set({ isLoading: false });
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

      confirmPayment: async (paymentId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockPaymentService.confirmPayment(paymentId);
          if (response.success) {
            set({ isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
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
      name: 'wallet-store',
      partialize: (state) => ({
        balance: state.balance,
        transactions: state.transactions,
        paymentMethods: state.paymentMethods,
        selectedPaymentMethod: state.selectedPaymentMethod,
      }),
    }
  )
);
