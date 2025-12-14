// @ts-nocheck
import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { LoginCredentials, LoginResponse } from '@/src/api/types';
import { AuthService } from '@/src/api/auth';
import { createPersistentStore } from '@/src/store/utils/persistentStore';

interface AuthStore extends AuthState {
  // Actions
  login: (user: User, token: string) => void;
  loginAsync: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  validateLoginCredentials: (credentials: LoginCredentials) => { isValid: boolean; errors: string[] };
}

const authService = new AuthService();

export const useAuthStore = create<AuthStore>()(
  createPersistentStore(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      loginAsync: async (credentials: LoginCredentials): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          
          // Validate credentials first
          const validation = get().validateLoginCredentials(credentials);
          if (!validation.isValid) {
            set({ 
              error: validation.errors.join(', '), 
              isLoading: false 
            });
            return false;
          }

          const response = await authService.login(credentials);
          
          if (response.success && response.data) {
            const { user, token, refreshToken, expiresIn } = response.data;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: response.error || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'An unexpected error occurred',
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
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

      validateLoginCredentials: (credentials: LoginCredentials) => {
        const errors: string[] = [];
        
        // Check if either email or phone+countryCode is provided
        const hasEmail = credentials.email && credentials.email.trim() !== '';
        const hasPhone = credentials.phone && credentials.phone.trim() !== '' && credentials.countryCode;
        
        if (!hasEmail && !hasPhone) {
          errors.push('Either email or phone number with country code is required');
        }
        
        // Validate email format if provided
        if (hasEmail) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email!)) {
            errors.push('Please enter a valid email address');
          }
        }
        
        // Validate phone format if provided
        if (credentials.phone && !hasPhone) {
          errors.push('Country code is required when using phone number');
        }
        
        if (credentials.phone && credentials.phone.trim() !== '') {
          const phoneRegex = /^[0-9+\-\s()]+$/;
          if (!phoneRegex.test(credentials.phone)) {
            errors.push('Please enter a valid phone number');
          }
        }
        
        // Validate country code format if provided
        if (credentials.countryCode && credentials.countryCode.trim() !== '') {
          const countryCodeRegex = /^\+[1-9]\d{0,3}$/;
          if (!countryCodeRegex.test(credentials.countryCode)) {
            errors.push('Please enter a valid country code (e.g., +1, +44)');
          }
        }
        
        return {
          isValid: errors.length === 0,
          errors,
        };
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
