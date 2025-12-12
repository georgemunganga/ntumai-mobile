# Improved Authentication Implementation Guide

**Date:** December 12, 2025  
**Version:** 2.0 - Improved OTP Flow  
**Status:** Ready for Implementation

---

## Overview

This guide documents the improved authentication flow that addresses security and UX concerns. The implementation includes:

1. **Backend-driven flow determination** (login vs signup)
2. **Backend-driven channel selection** (SMS, email, or both)
3. **E.164 phone format standardization**
4. **SessionId-only verification** (no re-sending identifiers)
5. **Two token paths** (full tokens vs onboarding token)
6. **OTP security** (max attempts, rate limiting, single-use)
7. **Dashboard-first UX** (guest view until authenticated)

---

## Files Created/Modified

### New Files

#### API Layer
- `src/api/modules/auth/schemas.ts` - Updated Zod schemas for new flow
- `src/api/modules/auth/types.ts` - Updated TypeScript types
- `src/api/mockAuthServices.ts` - Mock implementation of new flow

#### Store Layer
- `src/store/slices/authSlice.improved.ts` - Improved Zustand store

#### Screens
- `app/(auth)/OtpStart.improved.tsx` - Email/phone OTP initiation
- `app/(auth)/OtpVerify.improved.tsx` - OTP verification
- `app/(auth)/RoleSelection.improved.tsx` - Role selection for new users
- `app/(auth)/Splash.improved.tsx` - Dashboard-first splash screen

#### Navigation
- `src/navigation/RoleBasedNavigator.improved.tsx` - Role-based routing

---

## Implementation Steps

### Step 1: Replace Auth Store

Replace the current auth store with the improved version:

```bash
# Backup current store
cp src/store/slices/authSlice.ts src/store/slices/authSlice.old.ts

# Use new store
mv src/store/slices/authSlice.improved.ts src/store/slices/authSlice.ts
```

Update `src/store/index.ts` to export from the new store:

```typescript
export { useAuthStore, selectIsFullyAuthenticated, selectIsOnboarding } from './slices/authSlice';
```

### Step 2: Replace Mock Auth Services

```bash
# Backup current services
cp src/api/mockServices.ts src/api/mockServices.old.ts

# Use new mock auth services
# (Keep other mock services, just replace auth-related ones)
```

Update `src/api/mockServices.ts` to import from the new file:

```typescript
import { mockAuthService } from './mockAuthServices';
```

### Step 3: Update Auth Screens

Replace the old auth screens with improved versions:

```bash
# Backup old screens
mkdir -p app/(auth)/old
mv app/(auth)/Login.tsx app/(auth)/old/
mv app/(auth)/OtpVerification.tsx app/(auth)/old/
mv app/(auth)/RoleSelection.tsx app/(auth)/old/
mv app/(auth)/SplashScreen.tsx app/(auth)/old/

# Use new screens
mv app/(auth)/OtpStart.improved.tsx app/(auth)/OtpStart.tsx
mv app/(auth)/OtpVerify.improved.tsx app/(auth)/OtpVerify.tsx
mv app/(auth)/RoleSelection.improved.tsx app/(auth)/RoleSelection.tsx
mv app/(auth)/Splash.improved.tsx app/(auth)/Splash.tsx
```

### Step 4: Update Navigation

Replace the role-based navigator:

```bash
# Backup old navigator
cp src/navigation/RoleBasedNavigator.tsx src/navigation/RoleBasedNavigator.old.tsx

# Use new navigator
mv src/navigation/RoleBasedNavigator.improved.tsx src/navigation/RoleBasedNavigator.tsx
```

Update `src/navigation/index.ts` to export new hooks:

```typescript
export {
  useProtectedRoute,
  useRoleNavigation,
  useCanAccessRoute,
  useAuthState,
} from './RoleBasedNavigator';
```

### Step 5: Update App Entry Point

Update `app/_layout.tsx` to use the new Splash screen:

```typescript
export const unstable_settings = {
  initialRouteName: 'Splash', // Changed from 'SplashScreen'
};
```

---

## Authentication Flow

### Step 1: OTP Start (`POST /auth/otp/start`)

**Request:**
```json
{
  "email": "user@example.com",
  "phone": "+260972827372",
  "deviceId": "uuid-from-app"
}
```

**Response (New User):**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_123",
    "expiresIn": 600,
    "flowType": "signup",
    "channelsSent": ["sms", "email"],
    "message": "OTP sent to sms and email"
  }
}
```

**Response (Existing User):**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_123",
    "expiresIn": 600,
    "flowType": "login",
    "channelsSent": ["email"],
    "message": "OTP sent to email"
  }
}
```

**Backend Responsibilities:**
- ✅ Normalize phone to E.164 format
- ✅ Check if user exists
- ✅ Determine flow type (login vs signup)
- ✅ Decide channels (SMS, email, or both)
- ✅ Create OTP session
- ✅ Send OTP via selected channels
- ✅ Implement rate limiting per IP/device/phone/email
- ✅ Log for audit purposes

---

### Step 2: OTP Verify (`POST /auth/otp/verify`)

**Request:**
```json
{
  "sessionId": "session_123",
  "otp": "123456",
  "deviceId": "uuid-from-app"
}
```

**Response (Existing User with Role):**
```json
{
  "success": true,
  "data": {
    "flowType": "login",
    "requiresRoleSelection": false,
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "phone": "+260972827372",
      "role": "customer",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://..."
    }
  }
}
```

**Response (New User or No Role):**
```json
{
  "success": true,
  "data": {
    "flowType": "signup",
    "requiresRoleSelection": true,
    "onboardingToken": "onboard_abc",
    "user": {
      "id": "user_456",
      "email": "user@example.com",
      "phone": "+260972827372"
    }
  }
}
```

**Backend Responsibilities:**
- ✅ Validate session exists and not expired
- ✅ Check OTP code
- ✅ Enforce max attempts (e.g., 5)
- ✅ Mark OTP as single-use (invalidate after success)
- ✅ Return full tokens for existing users with role
- ✅ Return onboarding token for new users/users without role
- ✅ Implement cooldown between OTP attempts
- ✅ Generic error messages (prevent user enumeration)

---

### Step 3: Select Role (`POST /auth/select-role`)

**Request:**
```json
{
  "onboardingToken": "onboard_abc",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600,
    "user": {
      "id": "user_456",
      "email": "user@example.com",
      "phone": "+260972827372",
      "role": "customer",
      "firstName": null,
      "lastName": null
    }
  }
}
```

**Backend Responsibilities:**
- ✅ Validate onboarding token
- ✅ Check if token is expired
- ✅ Check if token already used (single-use)
- ✅ Bind role to user
- ✅ Create default profile data
- ✅ Issue full token set
- ✅ Mark onboarding token as used

---

### Step 4: Validate Session (`GET /auth/me`)

**Request:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "phone": "+260972827372",
      "role": "customer",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://...",
      "isVerified": true
    }
  }
}
```

**Backend Responsibilities:**
- ✅ Validate token signature
- ✅ Check if token is revoked
- ✅ Check if token is expired
- ✅ Return user data

---

### Step 5: Refresh Token (`POST /auth/refresh`)

**Request:**
```json
{
  "refreshToken": "eyJhbGc...",
  "deviceId": "uuid-from-app"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Backend Responsibilities:**
- ✅ Validate refresh token signature
- ✅ Check if refresh token is revoked
- ✅ Check if refresh token is expired
- ✅ Generate new access token
- ✅ Optionally rotate refresh token

---

## Client-Side Implementation

### Initialize Auth on App Start

```typescript
// In AppProvider or root component
useEffect(() => {
  const initApp = async () => {
    try {
      await useAuthStore.getState().initializeAuth();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  initApp();
}, []);
```

### Use Auth State in Components

```typescript
import { useAuthStore, selectIsFullyAuthenticated } from '@/src/store/slices/authSlice';

function MyComponent() {
  const { user, isAuthenticated, hasRole } = useAuthStore();
  const isFullyAuthenticated = selectIsFullyAuthenticated(useAuthStore());

  if (!isFullyAuthenticated) {
    return <LoginPrompt />;
  }

  return <Dashboard />;
}
```

### Protect Routes

```typescript
import { useCanAccessRoute } from '@/src/navigation/RoleBasedNavigator';

function CustomerOnlyScreen() {
  const canAccess = useCanAccessRoute('customer');

  if (!canAccess) {
    return <Unauthorized />;
  }

  return <CustomerContent />;
}
```

### Navigate Based on Auth State

```typescript
import { useRoleNavigation } from '@/src/navigation/RoleBasedNavigator';

function LoginButton() {
  const nav = useRoleNavigation();

  return (
    <Button onPress={() => nav.goLogin()}>
      Sign In
    </Button>
  );
}
```

---

## Testing Checklist

### Unit Tests

- [ ] Phone number normalization to E.164 format
- [ ] Email validation
- [ ] OTP code validation (4-8 digits)
- [ ] Session expiry calculation
- [ ] Token expiry calculation
- [ ] Onboarding token validation

### Integration Tests

- [ ] OTP start with email
- [ ] OTP start with phone
- [ ] OTP start with both email and phone
- [ ] OTP verification with correct code
- [ ] OTP verification with incorrect code
- [ ] OTP verification with expired session
- [ ] OTP verification with max attempts exceeded
- [ ] Role selection with valid token
- [ ] Role selection with invalid token
- [ ] Role selection with expired token
- [ ] Login flow (existing user with role)
- [ ] Signup flow (new user)
- [ ] Token refresh
- [ ] Session validation
- [ ] Logout

### Security Tests

- [ ] OTP code is single-use (can't verify twice)
- [ ] Onboarding token is single-use
- [ ] Max attempts prevents brute force
- [ ] Rate limiting prevents spam
- [ ] Generic error messages (no user enumeration)
- [ ] Phone numbers normalized consistently
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected
- [ ] Token signature validation
- [ ] HTTPS enforcement (in production)

### User Flow Tests

- [ ] Guest user sees guest view
- [ ] Guest user can start OTP flow
- [ ] User can verify OTP
- [ ] New user sees role selection
- [ ] User can select role
- [ ] Authenticated user sees dashboard
- [ ] Bottom nav only appears when fully authenticated
- [ ] Protected routes redirect to login
- [ ] User can logout
- [ ] Logout clears all data

### Error Handling Tests

- [ ] Network error handling
- [ ] Timeout handling
- [ ] Invalid email error
- [ ] Invalid phone error
- [ ] Session not found error
- [ ] OTP expired error
- [ ] Max attempts exceeded error
- [ ] Invalid token error
- [ ] Expired token error

---

## Backend Implementation Checklist

### Database Schema

- [ ] Users table with email, phone, role, verified status
- [ ] OTP sessions table with sessionId, email, phone, code, attempts, expiresAt
- [ ] Onboarding sessions table with token, userId, expiresAt, used status
- [ ] Refresh tokens table with token, userId, expiresAt, revoked status
- [ ] Audit logs table for security events

### API Endpoints

- [ ] `POST /auth/otp/start` - Initiate OTP flow
- [ ] `POST /auth/otp/verify` - Verify OTP code
- [ ] `POST /auth/select-role` - Select role
- [ ] `GET /auth/me` - Validate session
- [ ] `POST /auth/refresh` - Refresh token
- [ ] `POST /auth/logout` - Logout user

### Security Implementation

- [ ] Rate limiting per IP/device/phone/email
- [ ] Max attempts per OTP session
- [ ] OTP code expiry (10 minutes)
- [ ] Access token expiry (1 hour)
- [ ] Refresh token expiry (7 days)
- [ ] Onboarding token expiry (30 minutes)
- [ ] Single-use OTP enforcement
- [ ] Single-use onboarding token enforcement
- [ ] Generic error messages
- [ ] Audit logging
- [ ] HTTPS enforcement
- [ ] CORS configuration
- [ ] JWT signature validation
- [ ] Token revocation support

### Testing

- [ ] Unit tests for all functions
- [ ] Integration tests for all endpoints
- [ ] Security tests for all vulnerabilities
- [ ] Load testing for rate limiting
- [ ] Error scenario testing

---

## Deployment Checklist

- [ ] All endpoints implemented
- [ ] All security measures in place
- [ ] All tests passing
- [ ] Error handling complete
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] API documentation updated
- [ ] Client app updated
- [ ] Staging environment tested
- [ ] Production deployment ready

---

## Troubleshooting

### OTP Not Received

**Possible Causes:**
- SMS service not configured
- Email service not configured
- Phone number not normalized correctly
- Rate limiting blocking requests

**Solutions:**
- Check SMS/email service credentials
- Verify phone number format (E.164)
- Check rate limiting rules
- Review service logs

### Token Validation Fails

**Possible Causes:**
- Token signature invalid
- Token expired
- Token revoked
- Wrong secret key

**Solutions:**
- Verify JWT secret key
- Check token expiry time
- Check if token is revoked
- Verify token format

### User Can't Complete Signup

**Possible Causes:**
- Onboarding token expired
- Onboarding token already used
- Role selection endpoint failing
- Database error

**Solutions:**
- Check onboarding token expiry
- Check if token was already used
- Review endpoint logs
- Check database connection

---

## Support

For questions or issues:
1. Review this guide
2. Check the mock implementation
3. Review test cases
4. Check logs and error messages
5. Contact the development team

---

**Last Updated:** December 12, 2025  
**Version:** 2.0 - Improved OTP Flow  
**Status:** Ready for Implementation
