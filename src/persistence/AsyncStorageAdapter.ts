// @ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageAdapter, StorageOptions } from './types';

export class AsyncStorageAdapter implements StorageAdapter {
  private prefix: string;
  private serializer: {
    serialize: (value: any) => string;
    deserialize: (value: string) => any;
  };

  constructor(private options: StorageOptions = {}) {
    this.prefix = options.prefix || 'app_';
    this.serializer = options.serializer || {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    };
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private serialize(value: any): string {
    try {
      return this.serializer.serialize(value);
    } catch (error) {
      console.error('AsyncStorageAdapter: Serialization error:', error);
      throw new Error(`Failed to serialize value for key`);
    }
  }

  private deserialize<T>(value: string): T {
    try {
      return this.serializer.deserialize(value);
    } catch (error) {
      console.error('AsyncStorageAdapter: Deserialization error:', error);
      throw new Error(`Failed to deserialize value`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getKey(key);
      const value = await AsyncStorage.getItem(fullKey);
      
      if (value === null) {
        return null;
      }

      return this.deserialize<T>(value);
    } catch (error) {
      console.error('AsyncStorageAdapter: Get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      const serializedValue = this.serialize(value);
      await AsyncStorage.setItem(fullKey, serializedValue);
    } catch (error) {
      console.error('AsyncStorageAdapter: Set error:', error);
      throw new Error(`Failed to store value for key: ${key}`);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      await AsyncStorage.removeItem(fullKey);
    } catch (error) {
      console.error('AsyncStorageAdapter: Remove error:', error);
      throw new Error(`Failed to remove value for key: ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(prefixedKeys);
    } catch (error) {
      console.error('AsyncStorageAdapter: Clear error:', error);
      throw new Error('Failed to clear storage');
    }
  }

  async keys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length));
    } catch (error) {
      console.error('AsyncStorageAdapter: Keys error:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getKey(key);
      const value = await AsyncStorage.getItem(fullKey);
      return value !== null;
    } catch (error) {
      console.error('AsyncStorageAdapter: Has error:', error);
      return false;
    }
  }
}

export default AsyncStorageAdapter;
