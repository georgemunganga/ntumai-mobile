// @ts-nocheck
// Authentication Service Layer
// Handles business logic, validation, and coordination between API and store

import { LoginCredentials, LoginResponse, User } from '@/src/apitypes';
import { AuthService as ApiAuthService } from '@/src/apiauth';
import { useAuthStore } from '@/src/store/slices/authSlice';
import { StorageManager, asyncStorage } from '@/src/persistence';

export interface AuthServiceConfig {
  enablePersistence: boolean;
  tokenStorageKey: string;
  userStorageKey: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

export interface LoginAttempt {
  timestamp: number;
  method: 'email' | 'phone';
  identifier: string;
  success: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: number;
  loginMethod: 'email' | 'phone';
}

class AuthenticationService {
  private apiService: ApiAuthService;
  private storageManager: StorageManager;
  private config: AuthServiceConfig;
  private loginAttempts: Map<string, LoginAttempt[]> = new Map();

  constructor(config: Partial<AuthServiceConfig> = {}) {
    this.apiService = new ApiAuthService();
    this.storageManager = new StorageManager(asyncStorage);
    this.config = {
      enablePersistence: true,
      tokenStorageKey: 'auth_token',
      userStorageKey: 'auth_user',
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxLoginAttempts: 5,
      ...config,
    };
  }

  /**
   * Enhanced login with business logic
   */
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
    remainingAttempts?: number;
  }> {
    try {
      // Check rate limiting
      const identifier = credentials.email || credentials.phone || 'unknown';
      if (!this.canAttemptLogin(identifier)) {
        return {
          success: false,
          error: 'Too many login attempts. Please try again later.',
          remainingAttempts: 0,
        };
      }

      // Validate credentials format
      const validation = this.validateCredentials(credentials);
      if (!validation.isValid) {
        this.recordLoginAttempt(identifier, credentials, false);
        return {
          success: false,
          error: validation.errors.join(', '),
          remainingAttempts: this.getRemainingAttempts(identifier),
        };
      }

      // Attempt login via API
      const response = await this.apiService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token, refreshToken, expiresIn } = response.data;
        
        // Create session
        const session: AuthSession = {
          user,
          token,
          refreshToken,
          expiresAt: Date.now() + (expiresIn || this.config.sessionTimeout),
          loginMethod: credentials.email ? 'email' : 'phone',
        };

        // Store session if persistence is enabled
        if (this.config.enablePersistence) {
          await this.storeSession(session);
        }

        // Update auth store
        const authStore = useAuthStore.getState();
        authStore.login(user, token);

        // Record successful attempt
        this.recordLoginAttempt(identifier, credentials, true);
        this.clearLoginAttempts(identifier);

        return {
          success: true,
          user,
          token,
        };
      } else {
        // Record failed attempt
        this.recordLoginAttempt(identifier, credentials, false);
        
        return {
          success: false,
          error: response.error || 'Login failed',
          remainingAttempts: this.getRemainingAttempts(identifier),
        };
      }
    } catch (error: any) {
      const identifier = credentials.email || credentials.phone || 'unknown';
      this.recordLoginAttempt(identifier, credentials, false);
      
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        remainingAttempts: this.getRemainingAttempts(identifier),
      };
    }
  }

  /**
   * Logout with cleanup
   */
  async logout(): Promise<void> {
    try {
      // Clear stored session
      if (this.config.enablePersistence) {
        await this.clearStoredSession();
      }

      // Update auth store
      const authStore = useAuthStore.getState();
      authStore.logout();

      // Clear login attempts
      this.loginAttempts.clear();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Restore session from storage with token validation
   */
  async restoreSession(): Promise<boolean> {
    if (!this.config.enablePersistence) {
      return false;
    }

    try {
      const session = await this.getStoredSession();
      if (!session) {
        return false;
      }

      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        console.log('Session expired, attempting token refresh...');
        
        // Try to refresh token before clearing session
        const refreshResult = await this.attemptTokenRefresh(session.token);
        if (refreshResult.success && refreshResult.token && refreshResult.user) {
          // Update session with new token
          const newSession: AuthSession = {
            user: refreshResult.user,
            token: refreshResult.token,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          };
          
          await this.storeSession(newSession);
          
          // Restore auth state with refreshed data
          const authStore = useAuthStore.getState();
          authStore.login(refreshResult.user, refreshResult.token);
          
          return true;
        } else {
          // Token refresh failed, clear session
          await this.clearStoredSession();
          return false;
        }
      }

      // Validate token with server (optional - can be disabled for offline support)
      const isTokenValid = await this.validateTokenWithServer(session.token);
      if (!isTokenValid) {
        console.log('Token validation failed, clearing session');
        await this.clearStoredSession();
        return false;
      }

      // Restore auth state
      const authStore = useAuthStore.getState();
      authStore.login(session.user, session.token);

      return true;
    } catch (error) {
      console.error('Error restoring session:', error);
      await this.clearStoredSession(); // Clear potentially corrupted session
      return false;
    }
  }

  /**
   * Attempt to refresh expired token
   */
  private async attemptTokenRefresh(expiredToken: string): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
  }> {
    try {
      const response = await this.apiService.refreshToken({ token: expiredToken });
      
      if (response.success && response.token && response.user) {
        return {
          success: true,
          token: response.token,
          user: response.user,
        };
      }
      
      return {
        success: false,
        error: response.error || 'Token refresh failed',
      };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      };
    }
  }

  /**
   * Validate token with server (lightweight check)
   */
  private async validateTokenWithServer(token: string): Promise<boolean> {
    try {
      // For now, we'll skip server validation to avoid blocking app startup
      // This can be enabled when the validate token API endpoint is available
      // const response = await this.apiService.validateToken({ token });
      // return response.success;
      
      // Temporary: just check if token exists and has valid format
      return token && token.length > 10;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Validate login credentials (OTP-only, no password required)
   */
  private validateCredentials(credentials: LoginCredentials): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email or phone validation
    const hasEmail = credentials.email && credentials.email.trim() !== '';
    const hasPhone = credentials.phone && credentials.phone.trim() !== '' && credentials.countryCode;

    if (!hasEmail && !hasPhone) {
      errors.push('Either email or phone number with country code is required');
    }

    // Email format validation
    if (hasEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email!)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Phone format validation
    if (credentials.phone && !credentials.countryCode) {
      errors.push('Country code is required when using phone number');
    }

    if (credentials.phone && credentials.phone.trim() !== '') {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(credentials.phone)) {
        errors.push('Please enter a valid phone number');
      }
    }

    // Country code validation
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
  }

  /**
   * Rate limiting logic
   */
  private canAttemptLogin(identifier: string): boolean {
    const attempts = this.loginAttempts.get(identifier) || [];
    const recentAttempts = attempts.filter(
      attempt => Date.now() - attempt.timestamp < 15 * 60 * 1000 // 15 minutes
    );
    
    return recentAttempts.length < this.config.maxLoginAttempts;
  }

  private recordLoginAttempt(
    identifier: string,
    credentials: LoginCredentials,
    success: boolean
  ): void {
    const attempts = this.loginAttempts.get(identifier) || [];
    attempts.push({
      timestamp: Date.now(),
      method: credentials.email ? 'email' : 'phone',
      identifier,
      success,
    });
    
    // Keep only recent attempts
    const recentAttempts = attempts.filter(
      attempt => Date.now() - attempt.timestamp < 60 * 60 * 1000 // 1 hour
    );
    
    this.loginAttempts.set(identifier, recentAttempts);
  }

  private getRemainingAttempts(identifier: string): number {
    const attempts = this.loginAttempts.get(identifier) || [];
    const recentAttempts = attempts.filter(
      attempt => Date.now() - attempt.timestamp < 15 * 60 * 1000
    );
    
    return Math.max(0, this.config.maxLoginAttempts - recentAttempts.length);
  }

  private clearLoginAttempts(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Session storage methods
   */
  private async storeSession(session: AuthSession): Promise<void> {
    try {
      const adapter = this.storageManager.getAdapter('localStorage');
      await adapter.set(this.config.tokenStorageKey, session.token);
      await adapter.set(this.config.userStorageKey, session);
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }

  private async getStoredSession(): Promise<AuthSession | null> {
    try {
      const adapter = this.storageManager.getAdapter('localStorage');
      const sessionData = await adapter.get<AuthSession>(this.config.userStorageKey);
      
      if (!sessionData) {
        return null;
      }
      
      return sessionData;
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  }

  private async clearStoredSession(): Promise<void> {
    try {
      const adapter = this.storageManager.getAdapter('localStorage');
      await adapter.remove(this.config.tokenStorageKey);
      await adapter.remove(this.config.userStorageKey);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  /**
   * Utility methods
   */
  getLoginAttempts(identifier: string): LoginAttempt[] {
    return this.loginAttempts.get(identifier) || [];
  }

  isSessionValid(): boolean {
    const authStore = useAuthStore.getState();
    return authStore.isAuthenticated && !!authStore.token;
  }

  getCurrentUser(): User | null {
    const authStore = useAuthStore.getState();
    return authStore.user;
  }
}

// Export singleton instance
export const authService = new AuthenticationService();
export default authService;

// Export class for custom configurations
export { AuthenticationService };
