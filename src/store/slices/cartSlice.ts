import { create } from 'zustand';
import { CartState, CartItem, Product } from '@/types';
import { createPersistentStore } from '@/src/store/utils/persistentStore';

interface CartStore extends CartState {
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  applyDiscount: (discount: number) => void;
  removeDiscount: () => void;
}

export const useCartStore = create<CartStore>()(
  createPersistentStore(
    (set, get) => ({
      // Initial state
      items: [],
      totalPrice: 0,
      totalItems: 0,
      discount: 0,
      deliveryFee: 0,

      // Actions
      addItem: (product: Product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { product, quantity }],
          });
        }

        // Update totals
        const store = get();
        set({
          totalPrice: store.getTotalPrice(),
          totalItems: store.getTotalItems(),
        });
      },

      removeItem: (productId: string) => {
        const items = get().items.filter(item => item.product.id !== productId);
        set({ items });

        // Update totals
        const store = get();
        set({
          totalPrice: store.getTotalPrice(),
          totalItems: store.getTotalItems(),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const items = get().items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );
        set({ items });

        // Update totals
        const store = get();
        set({
          totalPrice: store.getTotalPrice(),
          totalItems: store.getTotalItems(),
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalPrice: 0,
          totalItems: 0,
          discount: 0,
        });
      },

      getTotalPrice: () => {
        const { items, discount, deliveryFee } = get();
        const subtotal = items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
        return Math.max(0, subtotal - discount + deliveryFee);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      applyDiscount: (discount: number) => {
        set({ discount });
        const store = get();
        set({ totalPrice: store.getTotalPrice() });
      },

      removeDiscount: () => {
        set({ discount: 0 });
        const store = get();
        set({ totalPrice: store.getTotalPrice() });
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
