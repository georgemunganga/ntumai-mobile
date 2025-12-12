// @ts-nocheck
import { StateCreator } from 'zustand';

// Logger middleware for development
export const logger = <T>(
  f: StateCreator<T>,
  name?: string
): StateCreator<T> => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    if (__DEV__) {
      console.group(`🏪 Store Update: ${name || 'Unknown'}`);
      console.log('Previous State:', get());
      set(...args);
      console.log('New State:', get());
      console.groupEnd();
    } else {
      set(...args);
    }
  };
  
  return f(loggedSet, get, store);
};

// Error boundary middleware
export const errorBoundary = <T>(
  f: StateCreator<T>
): StateCreator<T> => (set, get, store) => {
  const safeSet: typeof set = (...args) => {
    try {
      set(...args);
    } catch (error) {
      console.error('Store update error:', error);
      // Optionally, you can set an error state here
      // set({ error: error.message } as any);
    }
  };
  
  return f(safeSet, get, store);
};

// Performance monitoring middleware
export const performance = <T>(
  f: StateCreator<T>,
  name?: string
): StateCreator<T> => (set, get, store) => {
  const timedSet: typeof set = (...args) => {
    if (__DEV__) {
      const start = Date.now();
      set(...args);
      const end = Date.now();
      const duration = end - start;
      
      if (duration > 10) { // Log slow updates (>10ms)
        console.warn(`⚠️ Slow store update in ${name || 'Unknown'}: ${duration}ms`);
      }
    } else {
      set(...args);
    }
  };
  
  return f(timedSet, get, store);
};

// Combine multiple middlewares
export const storeMiddleware = <T>(
  f: StateCreator<T>,
  name?: string
): StateCreator<T> => {
  return errorBoundary(
    performance(
      logger(f, name),
      name
    )
  );
};

// Validation middleware
export const validator = <T>(
  f: StateCreator<T>,
  validate: (state: T) => boolean,
  errorMessage?: string
): StateCreator<T> => (set, get, store) => {
  const validatedSet: typeof set = (...args) => {
    const prevState = get();
    set(...args);
    const newState = get();
    
    if (!validate(newState)) {
      console.error('State validation failed:', errorMessage || 'Invalid state');
      console.error('Invalid state:', newState);
      // Revert to previous state
      set(prevState as any);
    }
  };
  
  return f(validatedSet, get, store);
};

// Debounce middleware for frequent updates
export const debounce = <T>(
  f: StateCreator<T>,
  delay: number = 100
): StateCreator<T> => (set, get, store) => {
  let timeoutId: NodeJS.Timeout;
  
  const debouncedSet: typeof set = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      set(...args);
    }, delay);
  };
  
  return f(debouncedSet, get, store);
};

// Optimistic updates middleware
export const optimistic = <T>(
  f: StateCreator<T>
): StateCreator<T> => (set, get, store) => {
  const optimisticSet: typeof set = (...args) => {
    const prevState = get();
    
    // Apply optimistic update immediately
    set(...args);
    
    // Store previous state for potential rollback
    (store as any).rollback = () => {
      set(prevState as any);
    };
  };
  
  return f(optimisticSet, get, store);
};
