// @ts-nocheck
// API client implementation
import { ApiResponse, ApiError, RequestConfig } from '@/types';
import { API_CONFIG, getBaseUrl, DEFAULT_HEADERS, HTTP_STATUS, ERROR_CODES } from '@/src/api/config';
import { Storage } from '@/src/utils/storage';
import { apiUtils } from '@/src/utils/api';

// Request interceptor type
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

// Response interceptor type
export type ResponseInterceptor = {
  onFulfilled?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  onRejected?: (error: ApiError) => ApiError | Promise<ApiError>;
};

// API client class
export class ApiClient {
  private baseUrl: string;
  private defaultConfig: RequestConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private storage: Storage;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private rateLimitQueue: Array<{ resolve: Function; reject: Function; timestamp: number }> = [];
  private requestCount = 0;
  private windowStart = Date.now();

  constructor(baseUrl?: string, defaultConfig?: RequestConfig) {
    this.baseUrl = baseUrl || getBaseUrl();
    this.defaultConfig = {
      timeout: API_CONFIG.DEFAULT_TIMEOUT,
      retries: API_CONFIG.DEFAULT_RETRIES,
      cache: false,
      cacheTimeout: API_CONFIG.DEFAULT_CACHE_TIMEOUT,
      requiresAuth: true,
      ...defaultConfig,
    };
    this.storage = new Storage();
    
    // Add default interceptors
    this.addDefaultInterceptors();
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // Remove request interceptor
  removeRequestInterceptor(interceptor: RequestInterceptor): void {
    const index = this.requestInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.requestInterceptors.splice(index, 1);
    }
  }

  // Remove response interceptor
  removeResponseInterceptor(interceptor: ResponseInterceptor): void {
    const index = this.responseInterceptors.indexOf(interceptor);
    if (index > -1) {
      this.responseInterceptors.splice(index, 1);
    }
  }

  // Make HTTP request
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      // Apply rate limiting
      await this.checkRateLimit();
      
      // Merge with default config
      const mergedConfig = { ...this.defaultConfig, ...config };
      
      // Apply request interceptors
      let processedConfig = mergedConfig;
      for (const interceptor of this.requestInterceptors) {
        processedConfig = await interceptor(processedConfig);
      }
      
      // Check cache first
      if (processedConfig.cache && processedConfig.method === 'GET') {
        const cachedResponse = await this.getCachedResponse<T>(processedConfig);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      
      // Check for duplicate requests
      const requestKey = this.getRequestKey(processedConfig);
      if (this.requestQueue.has(requestKey)) {
        return await this.requestQueue.get(requestKey)!;
      }
      
      // Make the actual request
      const requestPromise = this.executeRequest<T>(processedConfig);
      this.requestQueue.set(requestKey, requestPromise);
      
      try {
        const response = await requestPromise;
        
        // Cache successful responses
        if (processedConfig.cache && response.success) {
          await this.cacheResponse(processedConfig, response);
        }
        
        return response;
      } finally {
        this.requestQueue.delete(requestKey);
      }
    } catch (error: any) {
      throw await this.handleError(error);
    }
  }

  // Execute the actual HTTP request
  private async executeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(config.url || '', config.params);
    const headers = { ...DEFAULT_HEADERS, ...config.headers };
    
    // Add authentication header if required
    if (config.requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Create abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, config.timeout || API_CONFIG.DEFAULT_TIMEOUT);
    
    const requestOptions: RequestInit = {
      method: config.method || 'GET',
      headers,
      signal: abortController.signal,
    };
    
    // Add body for non-GET requests
    if (config.data && config.method !== 'GET') {
      if (config.data instanceof FormData) {
        requestOptions.body = config.data;
        delete headers['Content-Type']; // Let browser set it for FormData
      } else {
        requestOptions.body = JSON.stringify(config.data);
      }
    }
    
    let lastError: any;
    const maxRetries = config.retries || 0;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);
        return await this.processResponse<T>(response);
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on certain errors
        if (this.shouldNotRetry(error) || attempt === maxRetries) {
          clearTimeout(timeoutId);
          break;
        }
        
        // Wait before retrying (exponential backoff)
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }
    
    clearTimeout(timeoutId);
    
    throw lastError;
  }

  // Process HTTP response
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any;
    
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      data = {};
    }
    
    if (!response.ok) {
      throw {
        code: this.getErrorCode(response.status),
        message: data.message || response.statusText,
        details: data,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
      } as ApiError;
    }
    
    const apiResponse: ApiResponse<T> = {
      success: true,
      data: data.data || data,
      message: data.message,
      errors: data.errors,
      meta: data.meta,
      timestamp: new Date().toISOString(),
      requestId: response.headers.get('X-Request-ID') || undefined,
    };
    
    // Apply response interceptors
    let processedResponse = apiResponse;
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        processedResponse = await interceptor.onFulfilled(processedResponse);
      }
    }
    
    return processedResponse;
  }

  // Handle errors
  private async handleError(error: any): Promise<ApiError> {
    let apiError: ApiError;
    
    if (error.name === 'AbortError') {
      apiError = {
        code: ERROR_CODES.TIMEOUT_ERROR,
        message: 'Request timeout',
        timestamp: new Date().toISOString(),
      };
    } else if (error.code) {
      apiError = error;
    } else {
      apiError = {
        code: ERROR_CODES.NETWORK_ERROR,
        message: error.message || 'Network error',
        timestamp: new Date().toISOString(),
      };
    }
    
    // Apply error response interceptors
    let processedError = apiError;
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onRejected) {
        processedError = await interceptor.onRejected(processedError);
      }
    }
    
    return processedError;
  }

  // Convenience methods
  async get<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'url'>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'url'>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Utility methods
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    if (params) {
      const queryString = apiUtils.buildQueryString(params);
      url += queryString ? `?${queryString}` : '';
    }
    
    return url;
  }

  private getRequestKey(config: RequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await this.storage.getItem(API_CONFIG.TOKEN_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  private async getCachedResponse<T>(config: RequestConfig): Promise<ApiResponse<T> | null> {
    try {
      const cacheKey = `${API_CONFIG.CACHE_PREFIX}${this.getRequestKey(config)}`;
      const cached = await this.storage.getItem(cacheKey);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        if (age < (config.cacheTimeout || API_CONFIG.DEFAULT_CACHE_TIMEOUT)) {
          return data;
        } else {
          // Remove expired cache
          await this.storage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    
    return null;
  }

  private async cacheResponse<T>(config: RequestConfig, response: ApiResponse<T>): Promise<void> {
    try {
      const cacheKey = `${API_CONFIG.CACHE_PREFIX}${this.getRequestKey(config)}`;
      const cacheData = {
        data: response,
        timestamp: Date.now(),
      };
      
      await this.storage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset window if needed
    if (now - this.windowStart >= API_CONFIG.RATE_LIMIT.window) {
      this.requestCount = 0;
      this.windowStart = now;
    }
    
    // Check if we're within limits
    if (this.requestCount >= API_CONFIG.RATE_LIMIT.requests) {
      const waitTime = API_CONFIG.RATE_LIMIT.window - (now - this.windowStart);
      await this.delay(waitTime);
      
      // Reset after waiting
      this.requestCount = 0;
      this.windowStart = Date.now();
    }
    
    this.requestCount++;
  }

  private shouldNotRetry(error: any): boolean {
    // Don't retry on authentication errors, client errors, etc.
    return (
      error.statusCode >= 400 && error.statusCode < 500 &&
      error.statusCode !== 429 // Retry on rate limit
    );
  }

  private getErrorCode(statusCode: number): string {
    switch (statusCode) {
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_CODES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_CODES.UNAUTHORIZED;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_CODES.SERVER_ERROR;
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return ERROR_CODES.VALIDATION_ERROR;
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return ERROR_CODES.RATE_LIMIT_EXCEEDED;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_CODES.SERVER_ERROR;
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return ERROR_CODES.SERVICE_UNAVAILABLE;
      default:
        return ERROR_CODES.SERVER_ERROR;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private addDefaultInterceptors(): void {
    // Request ID interceptor
    this.addRequestInterceptor((config) => {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return config;
    });
    
    // Logging interceptor
    this.addRequestInterceptor((config) => {
      if (__DEV__) {
        console.log(`[API] ${config.method} ${config.url}`, config.data);
      }
      return config;
    });
    
    // Response logging interceptor
    this.addResponseInterceptor({
      onFulfilled: (response) => {
        if (__DEV__) {
          console.log(`[API] Response:`, response);
        }
        return response;
      },
      onRejected: (error) => {
        if (__DEV__) {
          console.error(`[API] Error:`, error);
        }
        return error;
      },
    });
  }

  // Clear all caches
  async clearCache(): Promise<void> {
    try {
      const keys = await this.storage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(API_CONFIG.CACHE_PREFIX));
      
      for (const key of cacheKeys) {
        await this.storage.removeItem(key);
      }
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }

  // Update base URL
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  // Get current base URL
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Default API client instance
export const apiClient = new ApiClient();

