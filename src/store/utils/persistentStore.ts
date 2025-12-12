// @ts-nocheck
import { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom storage interface for React Native with proper serialization
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      console.error(`Error getting item ${name} from storage:`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      // Ensure value is a string
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(name, stringValue);
    } catch (error) {
      console.error(`Error setting item ${name} to storage:`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing item ${name} from storage:`, error);
    }
  },
};

// Helper function to create persistent stores with custom options
export const createPersistentStore = <T>(
  stateCreator: StateCreator<T>,
  options: Omit<PersistOptions<T>, 'storage'> & {
    name: string;
    version?: number;
    migrate?: (persistedState: any, version: number) => T;
  }
) => {
  return persist(stateCreator, {
    ...options,
    storage,
    version: options.version || 1,
    migrate: options.migrate,
  });
};

// Storage utilities
export const storageUtils = {
  // Clear all app data
  clearAllData: async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => 
        key.startsWith('auth-store') ||
        key.startsWith('user-store') ||
        key.startsWith('cart-store') ||
        key.startsWith('driver-store') ||
        key.startsWith('vendor-store')
      );
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },

  // Clear specific store data
  clearStoreData: async (storeName: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(storeName);
    } catch (error) {
      console.error(`Error clearing ${storeName} data:`, error);
    }
  },

  // Get storage info
  getStorageInfo: async (): Promise<{
    keys: string[];
    size: number;
  }> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => 
        key.startsWith('auth-store') ||
        key.startsWith('user-store') ||
        key.startsWith('cart-store') ||
        key.startsWith('driver-store') ||
        key.startsWith('vendor-store')
      );
      
      let totalSize = 0;
      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return {
        keys: appKeys,
        size: totalSize,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { keys: [], size: 0 };
    }
  },
};
