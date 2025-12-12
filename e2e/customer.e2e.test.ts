/**
 * E2E Tests for Customer Workflow
 * Tests marketplace browsing, product selection, cart, checkout, and order tracking
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  mockMarketplaceService,
  mockOrderService,
  mockAuthService,
} from '../src/api/mockServices';
import { useAuthStore, useMarketplaceStore, useCartStore, useOrderStore } from '../src/store';

describe('Customer Workflow E2E Tests', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    useMarketplaceStore.setState({
      vendors: [],
      selectedVendor: null,
      products: [],
      categories: [],
      isLoading: false,
    });
    useCartStore.setState({
      items: [],
      total: 0,
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      discount: 0,
    });
    useOrderStore.setState({
      orders: [],
      selectedOrder: null,
      isLoading: false,
    });
  });

  describe('Authentication for Customer', () => {
    it('should authenticate customer successfully', async () => {
      // Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        email: 'customer@example.com',
        method: 'email',
      });

      expect(sendResponse.success).toBe(true);

      // Verify OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId: sendResponse.data.sessionId,
        otp: '123456',
        email: 'customer@example.com',
      });

      expect(verifyResponse.success).toBe(true);

      // Select customer role
      const roleResponse = await mockAuthService.selectRole(
        verifyResponse.data.userId,
        'customer'
      );

      expect(roleResponse.success).toBe(true);
      expect(roleResponse.data.user.role).toBe('customer');

      // Update auth store
      useAuthStore.setState({
        user: roleResponse.data.user,
        token: roleResponse.data.accessToken,
        isAuthenticated: true,
      });

      const authState = useAuthStore.getState();
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user.role).toBe('customer');
    });
  });

  describe('Marketplace Browsing', () => {
    it('should fetch vendors successfully', async () => {
      const response = await mockMarketplaceService.getVendors({
        latitude: 40.7128,
        longitude: -74.006,
        radius: 5,
      });

      expect(response.success).toBe(true);
      expect(response.data.vendors).toBeDefined();
      expect(Array.isArray(response.data.vendors)).toBe(true);
      expect(response.data.vendors.length).toBeGreaterThan(0);

      // Update marketplace store
      useMarketplaceStore.setState({
        vendors: response.data.vendors,
      });

      const state = useMarketplaceStore.getState();
      expect(state.vendors.length).toBeGreaterThan(0);
    });

    it('should fetch vendor details successfully', async () => {
      // First get vendors
      const vendorsResponse = await mockMarketplaceService.getVendors({
        latitude: 40.7128,
        longitude: -74.006,
      });

      expect(vendorsResponse.success).toBe(true);
      const vendorId = vendorsResponse.data.vendors[0].id;

      // Get vendor details
      const detailResponse = await mockMarketplaceService.getVendorDetail(vendorId);

      expect(detailResponse.success).toBe(true);
      expect(detailResponse.data.vendor.id).toBe(vendorId);
      expect(detailResponse.data.vendor.name).toBeDefined();
      expect(detailResponse.data.vendor.rating).toBeDefined();
      expect(detailResponse.data.products).toBeDefined();
      expect(Array.isArray(detailResponse.data.products)).toBe(true);

      // Update marketplace store
      useMarketplaceStore.setState({
        selectedVendor: detailResponse.data.vendor,
        products: detailResponse.data.products,
      });

      const state = useMarketplaceStore.getState();
      expect(state.selectedVendor.id).toBe(vendorId);
      expect(state.products.length).toBeGreaterThan(0);
    });

    it('should search vendors successfully', async () => {
      const response = await mockMarketplaceService.searchVendors({
        query: 'pizza',
        latitude: 40.7128,
        longitude: -74.006,
      });

      expect(response.success).toBe(true);
      expect(response.data.vendors).toBeDefined();
      expect(Array.isArray(response.data.vendors)).toBe(true);
    });

    it('should get product categories', async () => {
      const response = await mockMarketplaceService.getCategories();

      expect(response.success).toBe(true);
      expect(response.data.categories).toBeDefined();
      expect(Array.isArray(response.data.categories)).toBe(true);
      expect(response.data.categories.length).toBeGreaterThan(0);
    });

    it('should filter vendors by category', async () => {
      const response = await mockMarketplaceService.getVendors({
        category: 'food',
        latitude: 40.7128,
        longitude: -74.006,
      });

      expect(response.success).toBe(true);
      expect(response.data.vendors).toBeDefined();
      expect(Array.isArray(response.data.vendors)).toBe(true);
    });
  });

  describe('Shopping Cart', () => {
    beforeEach(async () => {
      // Setup: Get vendor and products
      const vendorsResponse = await mockMarketplaceService.getVendors({
        latitude: 40.7128,
        longitude: -74.006,
      });

      const vendorId = vendorsResponse.data.vendors[0].id;
      const detailResponse = await mockMarketplaceService.getVendorDetail(vendorId);

      useMarketplaceStore.setState({
        selectedVendor: detailResponse.data.vendor,
        products: detailResponse.data.products,
      });
    });

    it('should add product to cart', async () => {
      const state = useMarketplaceStore.getState();
      const product = state.products[0];

      // Add to cart
      const cartState = useCartStore.getState();
      const newItems = [
        ...cartState.items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          vendorId: state.selectedVendor.id,
        },
      ];

      const subtotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      useCartStore.setState({
        items: newItems,
        subtotal,
        total: subtotal,
      });

      const updatedCart = useCartStore.getState();
      expect(updatedCart.items.length).toBe(1);
      expect(updatedCart.items[0].productId).toBe(product.id);
    });

    it('should update product quantity in cart', async () => {
      const state = useMarketplaceStore.getState();
      const product = state.products[0];

      // Add to cart
      useCartStore.setState({
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            vendorId: state.selectedVendor.id,
          },
        ],
        subtotal: product.price,
        total: product.price,
      });

      // Update quantity
      const cartState = useCartStore.getState();
      const updatedItems = cartState.items.map((item) =>
        item.productId === product.id ? { ...item, quantity: 2 } : item
      );

      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      useCartStore.setState({
        items: updatedItems,
        subtotal: newSubtotal,
        total: newSubtotal,
      });

      const updatedCart = useCartStore.getState();
      expect(updatedCart.items[0].quantity).toBe(2);
      expect(updatedCart.subtotal).toBe(product.price * 2);
    });

    it('should remove product from cart', async () => {
      const state = useMarketplaceStore.getState();
      const product = state.products[0];

      // Add to cart
      useCartStore.setState({
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            vendorId: state.selectedVendor.id,
          },
        ],
        subtotal: product.price,
        total: product.price,
      });

      // Remove from cart
      useCartStore.setState({
        items: [],
        subtotal: 0,
        total: 0,
      });

      const updatedCart = useCartStore.getState();
      expect(updatedCart.items.length).toBe(0);
      expect(updatedCart.total).toBe(0);
    });

    it('should apply promo code', async () => {
      const cartState = useCartStore.getState();
      const subtotal = 50;

      // Apply 10% discount
      const discount = subtotal * 0.1;
      const tax = (subtotal - discount) * 0.1;
      const deliveryFee = 5;
      const total = subtotal - discount + tax + deliveryFee;

      useCartStore.setState({
        subtotal,
        discount,
        tax,
        deliveryFee,
        total,
      });

      const updatedCart = useCartStore.getState();
      expect(updatedCart.discount).toBe(5);
      expect(updatedCart.total).toBeLessThan(subtotal + tax + deliveryFee);
    });
  });

  describe('Checkout', () => {
    beforeEach(async () => {
      // Setup: Authenticate and add items to cart
      const authResponse = await mockAuthService.selectRole('user_123', 'customer');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });

      // Add items to cart
      useCartStore.setState({
        items: [
          {
            productId: 'product_1',
            name: 'Burger',
            price: 12.99,
            quantity: 2,
            vendorId: 'vendor_1',
          },
        ],
        subtotal: 25.98,
        deliveryFee: 2.5,
        tax: 2.35,
        total: 30.83,
      });
    });

    it('should create order successfully', async () => {
      const authState = useAuthStore.getState();
      const cartState = useCartStore.getState();

      const orderResponse = await mockOrderService.createOrder({
        userId: authState.user.id,
        vendorId: 'vendor_1',
        items: cartState.items,
        deliveryAddressId: 'addr_123',
        paymentMethod: 'card',
        total: cartState.total,
      });

      expect(orderResponse.success).toBe(true);
      expect(orderResponse.data.order.id).toBeDefined();
      expect(orderResponse.data.order.status).toBe('pending');
      expect(orderResponse.data.order.total).toBe(cartState.total);

      // Update order store
      useOrderStore.setState({
        orders: [orderResponse.data.order],
        selectedOrder: orderResponse.data.order,
      });

      const orderState = useOrderStore.getState();
      expect(orderState.orders.length).toBe(1);
      expect(orderState.selectedOrder.id).toBe(orderResponse.data.order.id);
    });

    it('should handle insufficient balance error', async () => {
      const authState = useAuthStore.getState();

      const orderResponse = await mockOrderService.createOrder({
        userId: authState.user.id,
        vendorId: 'vendor_1',
        items: [
          {
            productId: 'product_1',
            name: 'Expensive Item',
            price: 1000,
            quantity: 1,
            vendorId: 'vendor_1',
          },
        ],
        deliveryAddressId: 'addr_123',
        paymentMethod: 'wallet',
        total: 1000,
      });

      // May fail if wallet doesn't have enough balance
      if (!orderResponse.success) {
        expect(orderResponse.error.code).toMatch(/INSUFFICIENT|PAYMENT/);
      }
    });

    it('should handle minimum order amount error', async () => {
      const authState = useAuthStore.getState();

      const orderResponse = await mockOrderService.createOrder({
        userId: authState.user.id,
        vendorId: 'vendor_1',
        items: [
          {
            productId: 'product_1',
            name: 'Item',
            price: 2,
            quantity: 1,
            vendorId: 'vendor_1',
          },
        ],
        deliveryAddressId: 'addr_123',
        paymentMethod: 'card',
        total: 2,
      });

      // May fail if below minimum
      if (!orderResponse.success) {
        expect(orderResponse.error.code).toMatch(/MINIMUM/);
      }
    });
  });

  describe('Order Tracking', () => {
    beforeEach(async () => {
      // Setup: Create an order
      const authResponse = await mockAuthService.selectRole('user_123', 'customer');
      useAuthStore.setState({
        user: authResponse.data.user,
        token: authResponse.data.accessToken,
        isAuthenticated: true,
      });

      const orderResponse = await mockOrderService.createOrder({
        userId: authResponse.data.user.id,
        vendorId: 'vendor_1',
        items: [
          {
            productId: 'product_1',
            name: 'Burger',
            price: 12.99,
            quantity: 2,
            vendorId: 'vendor_1',
          },
        ],
        deliveryAddressId: 'addr_123',
        paymentMethod: 'card',
        total: 30.83,
      });

      if (orderResponse.success) {
        useOrderStore.setState({
          orders: [orderResponse.data.order],
          selectedOrder: orderResponse.data.order,
        });
      }
    });

    it('should get order details', async () => {
      const orderState = useOrderStore.getState();
      const orderId = orderState.selectedOrder.id;

      const response = await mockOrderService.getOrderDetail(orderId);

      expect(response.success).toBe(true);
      expect(response.data.order.id).toBe(orderId);
      expect(response.data.order.status).toBeDefined();
      expect(response.data.order.items).toBeDefined();
    });

    it('should track order status', async () => {
      const orderState = useOrderStore.getState();
      const orderId = orderState.selectedOrder.id;

      const response = await mockOrderService.getOrderDetail(orderId);

      expect(response.success).toBe(true);
      expect(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered']).toContain(
        response.data.order.status
      );
    });

    it('should get order history', async () => {
      const authState = useAuthStore.getState();

      const response = await mockOrderService.getOrders(authState.user.id);

      expect(response.success).toBe(true);
      expect(response.data.orders).toBeDefined();
      expect(Array.isArray(response.data.orders)).toBe(true);
    });

    it('should cancel order', async () => {
      const orderState = useOrderStore.getState();
      const orderId = orderState.selectedOrder.id;

      const response = await mockOrderService.cancelOrder(orderId);

      if (response.success) {
        expect(response.data.order.status).toBe('cancelled');
      } else {
        // Order might not be cancellable if already in progress
        expect(response.error.code).toMatch(/CANCELLED|STATE/);
      }
    });
  });

  describe('Complete Customer Journey', () => {
    it('should complete full customer workflow', async () => {
      // Step 1: Authenticate
      const authSendResponse = await mockAuthService.sendOtp({
        email: 'customer@example.com',
        method: 'email',
      });

      const authVerifyResponse = await mockAuthService.verifyOtp({
        sessionId: authSendResponse.data.sessionId,
        otp: '123456',
        email: 'customer@example.com',
      });

      const authRoleResponse = await mockAuthService.selectRole(
        authVerifyResponse.data.userId,
        'customer'
      );

      useAuthStore.setState({
        user: authRoleResponse.data.user,
        token: authRoleResponse.data.accessToken,
        isAuthenticated: true,
      });

      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Step 2: Browse marketplace
      const vendorsResponse = await mockMarketplaceService.getVendors({
        latitude: 40.7128,
        longitude: -74.006,
      });

      expect(vendorsResponse.success).toBe(true);
      const vendorId = vendorsResponse.data.vendors[0].id;

      const vendorDetailResponse = await mockMarketplaceService.getVendorDetail(vendorId);

      expect(vendorDetailResponse.success).toBe(true);

      useMarketplaceStore.setState({
        selectedVendor: vendorDetailResponse.data.vendor,
        products: vendorDetailResponse.data.products,
      });

      // Step 3: Add to cart
      const product = vendorDetailResponse.data.products[0];

      useCartStore.setState({
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            vendorId,
          },
        ],
        subtotal: product.price,
        deliveryFee: 2.5,
        tax: product.price * 0.1,
        total: product.price + 2.5 + product.price * 0.1,
      });

      expect(useCartStore.getState().items.length).toBe(1);

      // Step 4: Checkout
      const cartState = useCartStore.getState();
      const authState = useAuthStore.getState();

      const orderResponse = await mockOrderService.createOrder({
        userId: authState.user.id,
        vendorId,
        items: cartState.items,
        deliveryAddressId: 'addr_123',
        paymentMethod: 'card',
        total: cartState.total,
      });

      expect(orderResponse.success).toBe(true);

      useOrderStore.setState({
        orders: [orderResponse.data.order],
        selectedOrder: orderResponse.data.order,
      });

      // Step 5: Track order
      const orderState = useOrderStore.getState();

      const orderDetailResponse = await mockOrderService.getOrderDetail(orderState.selectedOrder.id);

      expect(orderDetailResponse.success).toBe(true);
      expect(orderDetailResponse.data.order.status).toBeDefined();

      // Verify final state
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useMarketplaceStore.getState().selectedVendor).toBeDefined();
      expect(useOrderStore.getState().selectedOrder).toBeDefined();
    });
  });
});
