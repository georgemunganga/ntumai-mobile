// User and Authentication Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'customer' | 'tasker' | 'vendor' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Product and Cart Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  preparationTime: number;
  ingredients?: string[];
  allergens?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  specialInstructions?: string;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  discount: number;
  deliveryFee: number;
}

// Order Types
export interface DeliveryAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  driverId?: string;
  items: CartItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  specialInstructions?: string;
  rating?: number;
  review?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'card' | 'cash' | 'paypal' | 'mobile_money';

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

// Tasker Types (renamed from Driver)
export interface TaskerLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface TaskerStats {
  totalDeliveries: number;
  totalEarnings: number;
  averageRating: number;
  completionRate: number;
  onTimeRate: number;
}

export interface TaskerState {
  isOnline: boolean;
  currentLocation: TaskerLocation | null;
  activeOrder: Order | null;
  availableOrders: Order[];
  stats: TaskerStats;
  earnings: {
    today: number;
    week: number;
    month: number;
  };
  isLoading: boolean;
  error: string | null;
}

// Legacy aliases for backward compatibility (deprecated - use Tasker* instead)
export type DriverLocation = TaskerLocation;
export type DriverStats = TaskerStats;
export type DriverState = TaskerState;

// Vendor Types
export interface VendorProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  address: DeliveryAddress;
  phone: string;
  email: string;
}

export interface VendorStats {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalProducts: number;
  activeOrders: number;
}

export interface VendorState {
  profile: VendorProfile | null;
  products: Product[];
  orders: Order[];
  stats: VendorStats;
  isLoading: boolean;
  error: string | null;
}

// User Profile Types
export interface UserProfile extends User {
  addresses: DeliveryAddress[];
  paymentMethods: PaymentMethod[];
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
    currency: string;
  };
  orderHistory: Order[];
}

export interface UserState {
  profile: UserProfile | null;
  addresses: DeliveryAddress[];
  favoriteProducts: Product[];
  favoriteVendors: VendorProfile[];
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}