// @ts-nocheck
// Main entry point for the NTUMAI application modules
// This file exports all the core modules and utilities

// Store exports - State management
export * from './store';
export { default as store } from './store';

// Components exports - UI and Auth components
export * from './components';

// Utils exports - Common utilities and helpers
export * from './utils';

// Hooks exports - Custom React hooks
export * from './hooks';

// API exports - Networking layer
export * from './api';

// Services exports - Cross-cutting utilities
export * from './services';

// Persistence exports - Storage utilities
export * from './persistence';

// Domain exports - State machines and coordinators
export * from './domain/auth';

// Type definitions
export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
  features: {
    analytics: boolean;
    debugging: boolean;
    persistence: boolean;
  };
  storage: {
    provider: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory';
    encryption: boolean;
    compression: boolean;
  };
}

// Default configuration
export const defaultConfig: AppConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  environment: (__DEV__ ? 'development' : 'production') as AppConfig['environment'],
  features: {
    analytics: !__DEV__,
    debugging: __DEV__,
    persistence: true,
  },
  storage: {
    provider: 'localStorage',
    encryption: false,
    compression: false,
  },
};

// Application initialization
export class NTUMAIApp {
  private config: AppConfig;
  private initialized = false;

  constructor(config: Partial<AppConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('NTUMAI App already initialized');
      return;
    }

    try {
      // Initialize services
      console.log('Initializing NTUMAI App...');
      
      // Set up error handling
      this.setupErrorHandling();
      
      // Initialize storage
      await this.initializeStorage();
      
      // Initialize API layer
      this.initializeAPI();
      
      // Initialize analytics if enabled
      if (this.config.features.analytics) {
        this.initializeAnalytics();
      }
      
      this.initialized = true;
      console.log('NTUMAI App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NTUMAI App:', error);
      throw error;
    }
  }

  private setupErrorHandling(): void {
    // Global error handler for React Native
    const originalHandler = global.ErrorUtils?.getGlobalHandler?.();
    
    global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
      console.error('Global error:', error);
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }

  private async initializeStorage(): Promise<void> {
    // Storage initialization logic would go here
    console.log(`Initializing storage with provider: ${this.config.storage.provider}`);
  }

  private initializeAPI(): void {
    // API initialization logic would go here
    console.log(`Initializing API with base URL: ${this.config.apiBaseUrl}`);
  }

  private initializeAnalytics(): void {
    // Analytics initialization logic would go here
    console.log('Initializing analytics...');
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Create default app instance
export const app = new NTUMAIApp();

// Convenience function for quick initialization
export const initializeApp = async (config?: Partial<AppConfig>): Promise<NTUMAIApp> => {
  const appInstance = config ? new NTUMAIApp(config) : app;
  await appInstance.initialize();
  return appInstance;
};

// Version information
export const version = '1.0.0';
export const buildDate = new Date().toISOString();

// Development utilities
if (__DEV__) {
  // Expose app instance globally for debugging
  (global as any).__NTUMAI_APP__ = app;
  
  console.log(`NTUMAI App v${version} loaded in development mode`);
}

