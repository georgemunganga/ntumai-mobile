/**
 * E2E Tests for Authentication Flows
 * Tests email and phone-based OTP authentication with country codes
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { mockAuthService } from '@/src/api/mockServices';
import { useAuthStore } from '@/src/store';

describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  describe('Email-Based Authentication', () => {
    it('should send OTP via email successfully', async () => {
      const email = 'test@example.com';

      const response = await mockAuthService.sendOtp({
        email,
        method: 'email',
      });

      expect(response.success).toBe(true);
      expect(response.data.sessionId).toBeDefined();
      expect(response.data.expiresIn).toBe(600); // 10 minutes
      expect(response.data.method).toBe('email');
      expect(response.data.maskedContact).toContain('****');
    });

    it('should verify OTP via email successfully', async () => {
      // Step 1: Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        email: 'test@example.com',
        method: 'email',
      });

      expect(sendResponse.success).toBe(true);
      const sessionId = sendResponse.data.sessionId;

      // Step 2: Verify OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId,
        otp: '123456', // Mock OTP
        email: 'test@example.com',
      });

      expect(verifyResponse.success).toBe(true);
      expect(verifyResponse.data.userId).toBeDefined();
      expect(verifyResponse.data.email).toBe('test@example.com');
      expect(verifyResponse.data.isNewUser).toBeDefined();
      expect(verifyResponse.data.requiresRoleSelection).toBe(true);
    });

    it('should handle invalid OTP for email', async () => {
      // Step 1: Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        email: 'test@example.com',
        method: 'email',
      });

      const sessionId = sendResponse.data.sessionId;

      // Step 2: Verify with wrong OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId,
        otp: '000000', // Wrong OTP
        email: 'test@example.com',
      });

      expect(verifyResponse.success).toBe(false);
      expect(verifyResponse.error.code).toBe('AUTH_OTP_INVALID');
      expect(verifyResponse.error.status).toBe(401);
    });

    it('should handle rate limiting for email OTP', async () => {
      // Send OTP multiple times to trigger rate limit
      let response;

      for (let i = 0; i < 6; i++) {
        response = await mockAuthService.sendOtp({
          email: 'test@example.com',
          method: 'email',
        });
      }

      // 6th request should be rate limited
      expect(response.success).toBe(false);
      expect(response.error.code).toBe('OTP_RATE_LIMIT');
      expect(response.error.status).toBe(429);
    });
  });

  describe('Phone-Based Authentication with Country Code', () => {
    it('should send OTP via SMS with country code successfully', async () => {
      const countryCode = '+260';
      const phone = '0978123456';

      const response = await mockAuthService.sendOtp({
        countryCode,
        phone,
        method: 'sms',
      });

      expect(response.success).toBe(true);
      expect(response.data.sessionId).toBeDefined();
      expect(response.data.expiresIn).toBe(600);
      expect(response.data.method).toBe('sms');
      expect(response.data.maskedContact).toContain('****');
    });

    it('should verify OTP via SMS with country code successfully', async () => {
      const countryCode = '+260';
      const phone = '0978123456';

      // Step 1: Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        countryCode,
        phone,
        method: 'sms',
      });

      expect(sendResponse.success).toBe(true);
      const sessionId = sendResponse.data.sessionId;

      // Step 2: Verify OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId,
        otp: '123456',
        countryCode,
        phone,
      });

      expect(verifyResponse.success).toBe(true);
      expect(verifyResponse.data.userId).toBeDefined();
      expect(verifyResponse.data.phone).toBe(`${countryCode}${phone}`);
      expect(verifyResponse.data.countryCode).toBe(countryCode);
      expect(verifyResponse.data.requiresRoleSelection).toBe(true);
    });

    it('should validate country code format', async () => {
      // Test invalid country code formats
      const invalidCodes = ['260', '00260', '+26', '+26000'];

      for (const code of invalidCodes) {
        const response = await mockAuthService.sendOtp({
          countryCode: code,
          phone: '0978123456',
          method: 'sms',
        });

        expect(response.success).toBe(false);
        expect(response.error.code).toMatch(/VALIDATION_INVALID/);
      }
    });

    it('should validate phone number format', async () => {
      // Test invalid phone formats
      const invalidPhones = ['123', '12345678901234567890', 'abc123', ''];

      for (const phone of invalidPhones) {
        const response = await mockAuthService.sendOtp({
          countryCode: '+260',
          phone,
          method: 'sms',
        });

        expect(response.success).toBe(false);
        expect(response.error.code).toMatch(/VALIDATION_INVALID/);
      }
    });

    it('should handle country code mismatch during verification', async () => {
      // Step 1: Send OTP with +260
      const sendResponse = await mockAuthService.sendOtp({
        countryCode: '+260',
        phone: '0978123456',
        method: 'sms',
      });

      const sessionId = sendResponse.data.sessionId;

      // Step 2: Try to verify with different country code
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId,
        otp: '123456',
        countryCode: '+44', // Different country code
        phone: '0978123456',
      });

      expect(verifyResponse.success).toBe(false);
      expect(verifyResponse.error.code).toBe('VALIDATION_MISMATCH');
    });

    it('should support multiple country codes', async () => {
      const countryCodes = ['+1', '+44', '+91', '+260', '+234', '+254', '+27'];

      for (const code of countryCodes) {
        const response = await mockAuthService.sendOtp({
          countryCode: code,
          phone: '1234567890',
          method: 'sms',
        });

        expect(response.success).toBe(true);
        expect(response.data.sessionId).toBeDefined();
      }
    });

    it('should handle invalid OTP for SMS', async () => {
      // Step 1: Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        countryCode: '+260',
        phone: '0978123456',
        method: 'sms',
      });

      const sessionId = sendResponse.data.sessionId;

      // Step 2: Verify with wrong OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId,
        otp: '000000',
        countryCode: '+260',
        phone: '0978123456',
      });

      expect(verifyResponse.success).toBe(false);
      expect(verifyResponse.error.code).toBe('AUTH_OTP_INVALID');
    });

    it('should handle rate limiting for SMS OTP', async () => {
      // Send OTP multiple times to trigger rate limit
      let response;

      for (let i = 0; i < 6; i++) {
        response = await mockAuthService.sendOtp({
          countryCode: '+260',
          phone: '0978123456',
          method: 'sms',
        });
      }

      // 6th request should be rate limited
      expect(response.success).toBe(false);
      expect(response.error.code).toBe('OTP_RATE_LIMIT');
    });
  });

  describe('Role Selection', () => {
    it('should select customer role successfully', async () => {
      // Step 1: Send and verify OTP
      const sendResponse = await mockAuthService.sendOtp({
        email: 'test@example.com',
        method: 'email',
      });

      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId: sendResponse.data.sessionId,
        otp: '123456',
        email: 'test@example.com',
      });

      const userId = verifyResponse.data.userId;

      // Step 2: Select role
      const roleResponse = await mockAuthService.selectRole(userId, 'customer');

      expect(roleResponse.success).toBe(true);
      expect(roleResponse.data.userId).toBe(userId);
      expect(roleResponse.data.role).toBe('customer');
      expect(roleResponse.data.accessToken).toBeDefined();
      expect(roleResponse.data.refreshToken).toBeDefined();
      expect(roleResponse.data.user.role).toBe('customer');
    });

    it('should select tasker role successfully', async () => {
      // Step 1: Send and verify OTP
      const sendResponse = await mockAuthService.sendOtp({
        countryCode: '+260',
        phone: '0978123456',
        method: 'sms',
      });

      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId: sendResponse.data.sessionId,
        otp: '123456',
        countryCode: '+260',
        phone: '0978123456',
      });

      const userId = verifyResponse.data.userId;

      // Step 2: Select role
      const roleResponse = await mockAuthService.selectRole(userId, 'tasker');

      expect(roleResponse.success).toBe(true);
      expect(roleResponse.data.role).toBe('tasker');
      expect(roleResponse.data.user.role).toBe('tasker');
    });

    it('should select vendor role successfully', async () => {
      // Step 1: Send and verify OTP
      const sendResponse = await mockAuthService.sendOtp({
        email: 'vendor@example.com',
        method: 'email',
      });

      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId: sendResponse.data.sessionId,
        otp: '123456',
        email: 'vendor@example.com',
      });

      const userId = verifyResponse.data.userId;

      // Step 2: Select role
      const roleResponse = await mockAuthService.selectRole(userId, 'vendor');

      expect(roleResponse.success).toBe(true);
      expect(roleResponse.data.role).toBe('vendor');
      expect(roleResponse.data.user.role).toBe('vendor');
    });

    it('should validate role selection', async () => {
      // Step 1: Send and verify OTP
      const sendResponse = await mockAuthService.sendOtp({
        email: 'test@example.com',
        method: 'email',
      });

      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId: sendResponse.data.sessionId,
        otp: '123456',
        email: 'test@example.com',
      });

      const userId = verifyResponse.data.userId;

      // Step 2: Try invalid role
      const roleResponse = await mockAuthService.selectRole(userId, 'invalid_role' as any);

      expect(roleResponse.success).toBe(false);
      expect(roleResponse.error.code).toMatch(/VALIDATION_INVALID/);
    });
  });

  describe('Token Management', () => {
    it('should refresh token successfully', async () => {
      // Step 1: Complete authentication
      const sendResponse = await mockAuthService.sendOtp({
        email: 'test@example.com',
        method: 'email',
      });

      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId: sendResponse.data.sessionId,
        otp: '123456',
        email: 'test@example.com',
      });

      const roleResponse = await mockAuthService.selectRole(
        verifyResponse.data.userId,
        'customer'
      );

      const refreshToken = roleResponse.data.refreshToken;

      // Step 2: Refresh token
      const refreshResponse = await mockAuthService.refreshToken(refreshToken);

      expect(refreshResponse.success).toBe(true);
      expect(refreshResponse.data.accessToken).toBeDefined();
      expect(refreshResponse.data.refreshToken).toBeDefined();
    });

    it('should handle invalid refresh token', async () => {
      const response = await mockAuthService.refreshToken('invalid_token');

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('AUTH_TOKEN_INVALID');
    });
  });

  describe('Complete Authentication Flow', () => {
    it('should complete full email authentication flow', async () => {
      // Step 1: Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        email: 'john@example.com',
        method: 'email',
      });

      expect(sendResponse.success).toBe(true);
      const sessionId = sendResponse.data.sessionId;

      // Step 2: Verify OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId,
        otp: '123456',
        email: 'john@example.com',
      });

      expect(verifyResponse.success).toBe(true);
      const userId = verifyResponse.data.userId;

      // Step 3: Select role
      const roleResponse = await mockAuthService.selectRole(userId, 'customer');

      expect(roleResponse.success).toBe(true);
      expect(roleResponse.data.accessToken).toBeDefined();
      expect(roleResponse.data.user.email).toBe('john@example.com');
      expect(roleResponse.data.user.role).toBe('customer');

      // Step 4: Store in auth store
      useAuthStore.setState({
        user: roleResponse.data.user,
        token: roleResponse.data.accessToken,
        refreshToken: roleResponse.data.refreshToken,
        isAuthenticated: true,
      });

      // Verify store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.email).toBe('john@example.com');
      expect(state.user.role).toBe('customer');
    });

    it('should complete full phone authentication flow with country code', async () => {
      // Step 1: Send OTP
      const sendResponse = await mockAuthService.sendOtp({
        countryCode: '+260',
        phone: '0978123456',
        method: 'sms',
      });

      expect(sendResponse.success).toBe(true);
      const sessionId = sendResponse.data.sessionId;

      // Step 2: Verify OTP
      const verifyResponse = await mockAuthService.verifyOtp({
        sessionId,
        otp: '123456',
        countryCode: '+260',
        phone: '0978123456',
      });

      expect(verifyResponse.success).toBe(true);
      const userId = verifyResponse.data.userId;

      // Step 3: Select role
      const roleResponse = await mockAuthService.selectRole(userId, 'tasker');

      expect(roleResponse.success).toBe(true);
      expect(roleResponse.data.accessToken).toBeDefined();
      expect(roleResponse.data.user.phone).toBe('+2600978123456');
      expect(roleResponse.data.user.countryCode).toBe('+260');
      expect(roleResponse.data.user.role).toBe('tasker');

      // Step 4: Store in auth store
      useAuthStore.setState({
        user: roleResponse.data.user,
        token: roleResponse.data.accessToken,
        refreshToken: roleResponse.data.refreshToken,
        isAuthenticated: true,
      });

      // Verify store state
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.phone).toBe('+2600978123456');
      expect(state.user.countryCode).toBe('+260');
      expect(state.user.role).toBe('tasker');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Simulate network error by passing invalid data
      const response = await mockAuthService.sendOtp({
        email: '',
        method: 'email',
      });

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.error.code).toBeDefined();
    });

    it('should return proper error messages', async () => {
      const response = await mockAuthService.sendOtp({
        countryCode: 'invalid',
        phone: '123',
        method: 'sms',
      });

      expect(response.success).toBe(false);
      expect(response.error.message).toBeDefined();
      expect(response.error.details).toBeDefined();
      expect(response.error.suggestion).toBeDefined();
    });

    it('should handle concurrent requests', async () => {
      const promises = [
        mockAuthService.sendOtp({
          email: 'test1@example.com',
          method: 'email',
        }),
        mockAuthService.sendOtp({
          email: 'test2@example.com',
          method: 'email',
        }),
        mockAuthService.sendOtp({
          countryCode: '+260',
          phone: '0978123456',
          method: 'sms',
        }),
      ];

      const responses = await Promise.all(promises);

      expect(responses).toHaveLength(3);
      responses.forEach((response) => {
        expect(response.success).toBe(true);
        expect(response.data.sessionId).toBeDefined();
      });
    });
  });
});
