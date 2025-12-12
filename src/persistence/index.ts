// @ts-nocheck
// Persistence Layer - Storage Utilities and Data Persistence

// Core storage interfaces
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
  has(key: string): Promise<boolean>;
}

export interface StorageOptions {
  prefix?: string;
  serializer?: {
    serialize: (value: any) => string;
    deserialize: (value: string) => any;
  };
  encryption?: {
    encrypt: (value: string) => string;
    decrypt: (value: string) => string;
  };
  compression?: {
    compress: (value: string) => string;
    decompress: (value: string) => string;
  };
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum storage size in bytes
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number;
  size?: number;
}

export interface PersistenceConfig {
  storage: StorageAdapter;
  key: string;
  version?: number;
  migrations?: Record<number, (data: any) => any>;
  debounceMs?: number;
  throttleMs?: number;
}

// Local Storage Adapter
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private options: StorageOptions = {}) {}

  private getKey(key: string): string {
    return this.options.prefix ? `${this.options.prefix}:${key}` : key;
  }

  private serialize(value: any): string {
    const serialized = this.options.serializer?.serialize(value) ?? JSON.stringify(value);
    const compressed = this.options.compression?.compress(serialized) ?? serialized;
    const encrypted = this.options.encryption?.encrypt(compressed) ?? compressed;
    return encrypted;
  }

  private deserialize<T>(value: string): T {
    const decrypted = this.options.encryption?.decrypt(value) ?? value;
    const decompressed = this.options.compression?.decompress(decrypted) ?? decrypted;
    const deserialized = this.options.serializer?.deserialize(decompressed) ?? JSON.parse(decompressed);
    return deserialized;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (!item) return null;

      if (this.options.ttl) {
        const entry: CacheEntry<T> = this.deserialize(item);
        const now = Date.now();
        const ttl = entry.ttl ?? this.options.ttl;
        
        if (now - entry.timestamp > ttl) {
          await this.remove(key);
          return null;
        }
        
        return entry.value;
      }

      return this.deserialize<T>(item);
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      let item: string;

      if (this.options.ttl) {
        const entry: CacheEntry<T> = {
          value,
          timestamp: Date.now(),
          ttl: this.options.ttl
        };
        item = this.serialize(entry);
      } else {
        item = this.serialize(value);
      }

      // Check storage size limit
      if (this.options.maxSize) {
        const currentSize = new Blob([item]).size;
        if (currentSize > this.options.maxSize) {
          throw new Error(`Item size (${currentSize}) exceeds maximum allowed size (${this.options.maxSize})`);
        }
      }

      localStorage.setItem(fullKey, item);
    } catch (error) {
      console.error('LocalStorage set error:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('LocalStorage remove error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.options.prefix) {
        const keys = await this.keys();
        for (const key of keys) {
          localStorage.removeItem(key);
        }
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('LocalStorage clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      const prefix = this.options.prefix ? `${this.options.prefix}:` : '';
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (!prefix || key.startsWith(prefix))) {
          keys.push(key);
        }
      }
      
      return keys;
    } catch (error) {
      console.error('LocalStorage keys error:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error('LocalStorage has error:', error);
      return false;
    }
  }
}

// Session Storage Adapter
export class SessionStorageAdapter implements StorageAdapter {
  constructor(private options: StorageOptions = {}) {}

  private getKey(key: string): string {
    return this.options.prefix ? `${this.options.prefix}:${key}` : key;
  }

  private serialize(value: any): string {
    const serialized = this.options.serializer?.serialize(value) ?? JSON.stringify(value);
    const compressed = this.options.compression?.compress(serialized) ?? serialized;
    const encrypted = this.options.encryption?.encrypt(compressed) ?? compressed;
    return encrypted;
  }

  private deserialize<T>(value: string): T {
    const decrypted = this.options.encryption?.decrypt(value) ?? value;
    const decompressed = this.options.compression?.decompress(decrypted) ?? decrypted;
    const deserialized = this.options.serializer?.deserialize(decompressed) ?? JSON.parse(decompressed);
    return deserialized;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getKey(key);
      const item = sessionStorage.getItem(fullKey);
      
      if (!item) return null;

      if (this.options.ttl) {
        const entry: CacheEntry<T> = this.deserialize(item);
        const now = Date.now();
        const ttl = entry.ttl ?? this.options.ttl;
        
        if (now - entry.timestamp > ttl) {
          await this.remove(key);
          return null;
        }
        
        return entry.value;
      }

      return this.deserialize<T>(item);
    } catch (error) {
      console.error('SessionStorage get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      let item: string;

      if (this.options.ttl) {
        const entry: CacheEntry<T> = {
          value,
          timestamp: Date.now(),
          ttl: this.options.ttl
        };
        item = this.serialize(entry);
      } else {
        item = this.serialize(value);
      }

      // Check storage size limit
      if (this.options.maxSize) {
        const currentSize = new Blob([item]).size;
        if (currentSize > this.options.maxSize) {
          throw new Error(`Item size (${currentSize}) exceeds maximum allowed size (${this.options.maxSize})`);
        }
      }

      sessionStorage.setItem(fullKey, item);
    } catch (error) {
      console.error('SessionStorage set error:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      sessionStorage.removeItem(fullKey);
    } catch (error) {
      console.error('SessionStorage remove error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.options.prefix) {
        const keys = await this.keys();
        for (const key of keys) {
          sessionStorage.removeItem(key);
        }
      } else {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('SessionStorage clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      const prefix = this.options.prefix ? `${this.options.prefix}:` : '';
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (!prefix || key.startsWith(prefix))) {
          keys.push(key);
        }
      }
      
      return keys;
    } catch (error) {
      console.error('SessionStorage keys error:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getKey(key);
      return sessionStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error('SessionStorage has error:', error);
      return false;
    }
  }
}

// Memory Storage Adapter (for testing or temporary storage)
export class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, string>();
  
  constructor(private options: StorageOptions = {}) {}

  private getKey(key: string): string {
    return this.options.prefix ? `${this.options.prefix}:${key}` : key;
  }

  private serialize(value: any): string {
    const serialized = this.options.serializer?.serialize(value) ?? JSON.stringify(value);
    const compressed = this.options.compression?.compress(serialized) ?? serialized;
    const encrypted = this.options.encryption?.encrypt(compressed) ?? compressed;
    return encrypted;
  }

  private deserialize<T>(value: string): T {
    const decrypted = this.options.encryption?.decrypt(value) ?? value;
    const decompressed = this.options.compression?.decompress(decrypted) ?? decrypted;
    const deserialized = this.options.serializer?.deserialize(decompressed) ?? JSON.parse(decompressed);
    return deserialized;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getKey(key);
      const item = this.storage.get(fullKey);
      
      if (!item) return null;

      if (this.options.ttl) {
        const entry: CacheEntry<T> = this.deserialize(item);
        const now = Date.now();
        const ttl = entry.ttl ?? this.options.ttl;
        
        if (now - entry.timestamp > ttl) {
          await this.remove(key);
          return null;
        }
        
        return entry.value;
      }

      return this.deserialize<T>(item);
    } catch (error) {
      console.error('MemoryStorage get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      let item: string;

      if (this.options.ttl) {
        const entry: CacheEntry<T> = {
          value,
          timestamp: Date.now(),
          ttl: this.options.ttl
        };
        item = this.serialize(entry);
      } else {
        item = this.serialize(value);
      }

      // Check storage size limit
      if (this.options.maxSize) {
        const currentSize = new Blob([item]).size;
        if (currentSize > this.options.maxSize) {
          throw new Error(`Item size (${currentSize}) exceeds maximum allowed size (${this.options.maxSize})`);
        }
      }

      this.storage.set(fullKey, item);
    } catch (error) {
      console.error('MemoryStorage set error:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      this.storage.delete(fullKey);
    } catch (error) {
      console.error('MemoryStorage remove error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.options.prefix) {
        const keys = await this.keys();
        for (const key of keys) {
          this.storage.delete(key);
        }
      } else {
        this.storage.clear();
      }
    } catch (error) {
      console.error('MemoryStorage clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      const prefix = this.options.prefix ? `${this.options.prefix}:` : '';
      
      for (const key of this.storage.keys()) {
        if (!prefix || key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      
      return keys;
    } catch (error) {
      console.error('MemoryStorage keys error:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getKey(key);
      return this.storage.has(fullKey);
    } catch (error) {
      console.error('MemoryStorage has error:', error);
      return false;
    }
  }
}

// IndexedDB Storage Adapter
export class IndexedDBStorageAdapter implements StorageAdapter {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(
    dbName: string = 'AppStorage',
    storeName: string = 'keyvalue',
    version: number = 1,
    private options: StorageOptions = {}
  ) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  private getKey(key: string): string {
    return this.options.prefix ? `${this.options.prefix}:${key}` : key;
  }

  private serialize(value: any): string {
    const serialized = this.options.serializer?.serialize(value) ?? JSON.stringify(value);
    const compressed = this.options.compression?.compress(serialized) ?? serialized;
    const encrypted = this.options.encryption?.encrypt(compressed) ?? compressed;
    return encrypted;
  }

  private deserialize<T>(value: string): T {
    const decrypted = this.options.encryption?.decrypt(value) ?? value;
    const decompressed = this.options.compression?.decompress(decrypted) ?? decrypted;
    const deserialized = this.options.serializer?.deserialize(decompressed) ?? JSON.parse(decompressed);
    return deserialized;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const fullKey = this.getKey(key);

      return new Promise((resolve, reject) => {
        const request = store.get(fullKey);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const item = request.result;
          
          if (!item) {
            resolve(null);
            return;
          }

          if (this.options.ttl) {
            const entry: CacheEntry<T> = this.deserialize(item);
            const now = Date.now();
            const ttl = entry.ttl ?? this.options.ttl;
            
            if (now - entry.timestamp > ttl) {
              this.remove(key).then(() => resolve(null));
              return;
            }
            
            resolve(entry.value);
          } else {
            resolve(this.deserialize<T>(item));
          }
        };
      });
    } catch (error) {
      console.error('IndexedDB get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const fullKey = this.getKey(key);
      
      let item: string;

      if (this.options.ttl) {
        const entry: CacheEntry<T> = {
          value,
          timestamp: Date.now(),
          ttl: this.options.ttl
        };
        item = this.serialize(entry);
      } else {
        item = this.serialize(value);
      }

      // Check storage size limit
      if (this.options.maxSize) {
        const currentSize = new Blob([item]).size;
        if (currentSize > this.options.maxSize) {
          throw new Error(`Item size (${currentSize}) exceeds maximum allowed size (${this.options.maxSize})`);
        }
      }

      return new Promise((resolve, reject) => {
        const request = store.put(item, fullKey);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('IndexedDB set error:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const fullKey = this.getKey(key);

      return new Promise((resolve, reject) => {
        const request = store.delete(fullKey);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('IndexedDB remove error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      if (this.options.prefix) {
        const keys = await this.keys();
        for (const key of keys) {
          await new Promise<void>((resolve, reject) => {
            const request = store.delete(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
          });
        }
      } else {
        return new Promise((resolve, reject) => {
          const request = store.clear();
          
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        });
      }
    } catch (error) {
      console.error('IndexedDB clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const prefix = this.options.prefix ? `${this.options.prefix}:` : '';

      return new Promise((resolve, reject) => {
        const keys: string[] = [];
        const request = store.openKeyCursor();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            const key = cursor.key as string;
            if (!prefix || key.startsWith(prefix)) {
              keys.push(key);
            }
            cursor.continue();
          } else {
            resolve(keys);
          }
        };
      });
    } catch (error) {
      console.error('IndexedDB keys error:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const fullKey = this.getKey(key);

      return new Promise((resolve, reject) => {
        const request = store.count(fullKey);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result > 0);
      });
    } catch (error) {
      console.error('IndexedDB has error:', error);
      return false;
    }
  }
}

// Persistent Store Class
export class PersistentStore<T = any> {
  private storage: StorageAdapter;
  private key: string;
  private version: number;
  private migrations: Record<number, (data: any) => any>;
  private debounceTimer: NodeJS.Timeout | null = null;
  private throttleTimer: NodeJS.Timeout | null = null;
  private lastSave = 0;

  constructor(config: PersistenceConfig) {
    this.storage = config.storage;
    this.key = config.key;
    this.version = config.version ?? 1;
    this.migrations = config.migrations ?? {};
  }

  async load(): Promise<T | null> {
    try {
      const data = await this.storage.get<{ version: number; data: T }>(this.key);
      
      if (!data) return null;

      // Handle version migrations
      let migratedData = data.data;
      let currentVersion = data.version ?? 1;

      while (currentVersion < this.version) {
        const migration = this.migrations[currentVersion + 1];
        if (migration) {
          migratedData = migration(migratedData);
        }
        currentVersion++;
      }

      // Save migrated data if version changed
      if (currentVersion !== data.version) {
        await this.save(migratedData);
      }

      return migratedData;
    } catch (error) {
      console.error('PersistentStore load error:', error);
      return null;
    }
  }

  async save(data: T, options?: { debounce?: number; throttle?: number }): Promise<void> {
    const debounceMs = options?.debounce ?? 0;
    const throttleMs = options?.throttle ?? 0;

    if (debounceMs > 0) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      this.debounceTimer = setTimeout(() => {
        this.performSave(data);
      }, debounceMs);
      
      return;
    }

    if (throttleMs > 0) {
      const now = Date.now();
      if (now - this.lastSave < throttleMs) {
        if (!this.throttleTimer) {
          this.throttleTimer = setTimeout(() => {
            this.performSave(data);
            this.throttleTimer = null;
          }, throttleMs - (now - this.lastSave));
        }
        return;
      }
    }

    await this.performSave(data);
  }

  private async performSave(data: T): Promise<void> {
    try {
      const payload = {
        version: this.version,
        data
      };
      
      await this.storage.set(this.key, payload);
      this.lastSave = Date.now();
    } catch (error) {
      console.error('PersistentStore save error:', error);
      throw error;
    }
  }

  async remove(): Promise<void> {
    try {
      await this.storage.remove(this.key);
    } catch (error) {
      console.error('PersistentStore remove error:', error);
      throw error;
    }
  }

  async exists(): Promise<boolean> {
    try {
      return await this.storage.has(this.key);
    } catch (error) {
      console.error('PersistentStore exists error:', error);
      return false;
    }
  }
}

// Storage Manager
export class StorageManager {
  private adapters = new Map<string, StorageAdapter>();
  private defaultAdapter: StorageAdapter;

  constructor(defaultAdapter?: StorageAdapter) {
    this.defaultAdapter = defaultAdapter ?? new LocalStorageAdapter();
  }

  registerAdapter(name: string, adapter: StorageAdapter): void {
    this.adapters.set(name, adapter);
  }

  getAdapter(name?: string): StorageAdapter {
    if (!name) return this.defaultAdapter;
    return this.adapters.get(name) ?? this.defaultAdapter;
  }

  createStore<T>(key: string, adapterName?: string, options?: Partial<PersistenceConfig>): PersistentStore<T> {
    const storage = this.getAdapter(adapterName);
    return new PersistentStore<T>({
      storage,
      key,
      ...options
    });
  }

  async clearAll(adapterName?: string): Promise<void> {
    const adapter = this.getAdapter(adapterName);
    await adapter.clear();
  }

  async getAllKeys(adapterName?: string): Promise<string[]> {
    const adapter = this.getAdapter(adapterName);
    return adapter.keys();
  }
}

import { AsyncStorageAdapter } from './AsyncStorageAdapter';

// Default storage instances
export const localStorage = new LocalStorageAdapter();
export const sessionStorage = new SessionStorageAdapter();
export const memoryStorage = new MemoryStorageAdapter();
export const indexedDBStorage = new IndexedDBStorageAdapter();
export const asyncStorage = new AsyncStorageAdapter();

// Default storage manager - use AsyncStorage for React Native
export const storageManager = new StorageManager(asyncStorage);

// Register adapters
storageManager.registerAdapter('localStorage', asyncStorage); // Map localStorage to AsyncStorage for React Native
storageManager.registerAdapter('sessionStorage', memoryStorage); // Use memory storage for session in React Native
storageManager.registerAdapter('memoryStorage', memoryStorage);
storageManager.registerAdapter('indexedDB', memoryStorage); // Use memory storage for IndexedDB in React Native
storageManager.registerAdapter('asyncStorage', asyncStorage);

// Utility functions
export const createPersistentStore = <T>(
  key: string,
  storage?: StorageAdapter,
  options?: Partial<PersistenceConfig>
): PersistentStore<T> => {
  return new PersistentStore<T>({
    storage: storage ?? localStorage,
    key,
    ...options
  });
};

export const createEncryptedStore = <T>(
  key: string,
  encryptionKey: string,
  storage?: StorageAdapter
): PersistentStore<T> => {
  const encryptedStorage = new LocalStorageAdapter({
    encryption: {
      encrypt: (value: string) => btoa(value + encryptionKey), // Simple encryption for demo
      decrypt: (value: string) => atob(value).replace(encryptionKey, '')
    }
  });
  
  return new PersistentStore<T>({
    storage: storage ?? encryptedStorage,
    key
  });
};

export const createTTLStore = <T>(
  key: string,
  ttlMs: number,
  storage?: StorageAdapter
): PersistentStore<T> => {
  const ttlStorage = new LocalStorageAdapter({
    ttl: ttlMs
  });
  
  return new PersistentStore<T>({
    storage: storage ?? ttlStorage,
    key
  });
};

// Export all types and classes
export * from './types';
export * from './migrations';
export * from './serializers';
export * from './compression';
export * from './encryption';
export { AsyncStorageAdapter } from './AsyncStorageAdapter';

// Default export
export default {
  StorageManager,
  PersistentStore,
  LocalStorageAdapter,
  SessionStorageAdapter,
  MemoryStorageAdapter,
  IndexedDBStorageAdapter,
  AsyncStorageAdapter,
  localStorage,
  sessionStorage,
  memoryStorage,
  indexedDBStorage,
  asyncStorage,
  storageManager,
  createPersistentStore,
  createEncryptedStore,
  createTTLStore
};
