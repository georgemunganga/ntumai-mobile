# Complete Authentication API Documentation with Country Code

**Date:** December 10, 2025  
**Version:** 1.0  
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Country Code Standards](#country-code-standards)
3. [Send OTP Endpoint](#send-otp-endpoint)
4. [Verify OTP Endpoint](#verify-otp-endpoint)
5. [Select Role Endpoint](#select-role-endpoint)
6. [Refresh Token Endpoint](#refresh-token-endpoint)
7. [Logout Endpoint](#logout-endpoint)
8. [Error Scenarios](#error-scenarios)
9. [Client Implementation Examples](#client-implementation-examples)

---

## Overview

The authentication system supports both **email** and **phone** based OTP verification. When using phone, the **country code is mandatory** and must be included with the phone number.

### Authentication Flow

```
1. User enters email OR (phone + country code)
2. Backend sends OTP via email or SMS
3. User receives OTP and enters it
4. Backend verifies OTP and returns user data
5. User selects role (customer/tasker/vendor)
6. Backend returns access token and refresh token
7. User is authenticated and can access app
```

---

## Country Code Standards

### Supported Country Codes

| Country | Code | Format | Example |
|---------|------|--------|---------|
| **United States** | +1 | +1 XXX XXX XXXX | +1 2025551234 |
| **United Kingdom** | +44 | +44 XXXX XXXXXX | +44 2071838750 |
| **India** | +91 | +91 XXXXX XXXXX | +91 9876543210 |
| **Zambia** | +260 | +260 9XX XXX XXX | +260 978123456 |
| **Nigeria** | +234 | +234 9XX XXX XXXX | +234 9012345678 |
| **Kenya** | +254 | +254 7XX XXX XXX | +254 712345678 |
| **South Africa** | +27 | +27 XX XXX XXXX | +27 212345678 |
| **Australia** | +61 | +61 2 XXXX XXXX | +61 212345678 |
| **Canada** | +1 | +1 XXX XXX XXXX | +1 4165551234 |
| **Germany** | +49 | +49 30 XXXXXXXX | +49 3012345678 |
| **France** | +33 | +33 X XXXX XXXX | +33 123456789 |
| **Japan** | +81 | +81 XX XXXX XXXX | +81 9012345678 |
| **China** | +86 | +86 XXX XXXX XXXX | +86 13912345678 |
| **Brazil** | +55 | +55 XX XXXXX XXXX | +55 1133334444 |
| **Mexico** | +52 | +52 XX XXXX XXXX | +52 5512345678 |

### Country Code Format Rules

- **Format:** `+{country_code}`
- **Prefix:** Always starts with `+`
- **Valid Range:** +1 to +999
- **Examples:**
  - ✅ `+1` (USA/Canada)
  - ✅ `+44` (UK)
  - ✅ `+260` (Zambia)
  - ❌ `1` (missing +)
  - ❌ `260` (missing +)
  - ❌ `00260` (wrong format)

---

## Send OTP Endpoint

### Endpoint Details

```
POST /auth/send-otp
Content-Type: application/json
```

### Request Parameters

#### Option 1: Email-based OTP

```json
{
  "email": "user@example.com",
  "method": "email"
}
```

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `email` | string | Yes (if phone not provided) | Valid email address | `user@example.com` |
| `method` | string | Yes | Delivery method | `email` |

#### Option 2: Phone-based OTP (with Country Code)

```json
{
  "countryCode": "+260",
  "phone": "0978123456",
  "method": "sms"
}
```

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `countryCode` | string | Yes (if phone provided) | Country code with + prefix | `+260` |
| `phone` | string | Yes (if countryCode provided) | Phone number without country code | `0978123456` |
| `method` | string | Yes | Delivery method | `sms` |

#### Option 3: Phone with Full Number (Alternative)

```json
{
  "phone": "+260978123456",
  "method": "sms"
}
```

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `phone` | string | Yes | Full phone with country code | `+260978123456` |
| `method` | string | Yes | Delivery method | `sms` |

### Success Response

```json
{
  "success": true,
  "data": {
    "sessionId": "session_abc123def456",
    "expiresIn": 600,
    "method": "sms",
    "maskedContact": "****3456",
    "message": "OTP sent successfully to +260978123456"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | string | Unique session ID for OTP verification |
| `expiresIn` | number | OTP expiration time in seconds (typically 600 = 10 minutes) |
| `method` | string | Delivery method used (email or sms) |
| `maskedContact` | string | Masked contact for security (last 4 digits) |
| `message` | string | Confirmation message |

### Error Responses

#### Invalid Country Code

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_INVALID_COUNTRY_CODE",
    "message": "Invalid country code format",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "countryCode",
        "message": "Country code must be in format +XXX (e.g., +260, +44, +1)",
        "code": "VALIDATION_INVALID_COUNTRY_CODE"
      }
    ],
    "suggestion": "Use a valid country code with + prefix (e.g., +260 for Zambia)"
  },
  "data": null
}
```

#### Invalid Phone Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_INVALID_PHONE",
    "message": "Invalid phone number format",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "phone",
        "message": "Phone number must be 7-15 digits (without country code)",
        "code": "VALIDATION_INVALID_PHONE"
      }
    ],
    "suggestion": "Enter a valid phone number without the country code (e.g., 0978123456)"
  },
  "data": null
}
```

#### Missing Required Fields

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_REQUIRED_FIELD",
    "message": "Required fields are missing",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "countryCode",
        "message": "Country code is required when using phone number",
        "code": "VALIDATION_REQUIRED_FIELD"
      },
      {
        "field": "phone",
        "message": "Phone number is required when using SMS",
        "code": "VALIDATION_REQUIRED_FIELD"
      }
    ],
    "suggestion": "Provide either email OR (countryCode + phone)"
  },
  "data": null
}
```

#### OTP Rate Limit

```json
{
  "success": false,
  "error": {
    "code": "OTP_RATE_LIMIT",
    "message": "Too many OTP requests",
    "status": 429,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "phone",
        "message": "You've requested OTP 5 times in the last hour. Please try again after 1 hour.",
        "code": "OTP_RATE_LIMIT"
      }
    ],
    "suggestion": "Wait before requesting another OTP"
  },
  "data": {
    "retryAfter": 3600,
    "nextAvailableAt": "2025-12-10T11:00:00Z"
  }
}
```

---

## Verify OTP Endpoint

### Endpoint Details

```
POST /auth/verify-otp
Content-Type: application/json
```

### Request Parameters

```json
{
  "sessionId": "session_abc123def456",
  "otp": "123456",
  "countryCode": "+260",
  "phone": "0978123456"
}
```

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `sessionId` | string | Yes | Session ID from send-otp response | `session_abc123def456` |
| `otp` | string | Yes | 6-digit OTP code | `123456` |
| `countryCode` | string | Conditional | Country code (if phone used) | `+260` |
| `phone` | string | Conditional | Phone number (if phone used) | `0978123456` |
| `email` | string | Conditional | Email (if email used) | `user@example.com` |

### Success Response

```json
{
  "success": true,
  "data": {
    "sessionId": "session_abc123def456",
    "userId": "user_xyz789",
    "email": "user@example.com",
    "phone": "+260978123456",
    "countryCode": "+260",
    "isNewUser": false,
    "requiresRoleSelection": true,
    "existingRoles": ["customer"],
    "message": "OTP verified successfully"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | string | Session ID for role selection |
| `userId` | string | User ID (for new users) |
| `email` | string | User's email |
| `phone` | string | User's full phone number with country code |
| `countryCode` | string | Country code extracted from phone |
| `isNewUser` | boolean | Whether this is a new user |
| `requiresRoleSelection` | boolean | Whether user needs to select role |
| `existingRoles` | array | Roles user already has |

### Error Responses

#### Invalid OTP

```json
{
  "success": false,
  "error": {
    "code": "AUTH_OTP_INVALID",
    "message": "OTP is invalid or expired",
    "status": 401,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "otp",
        "message": "The OTP you entered is incorrect. You have 4 attempts remaining.",
        "code": "AUTH_OTP_INVALID"
      }
    ],
    "suggestion": "Check your email/SMS and enter the correct OTP"
  },
  "data": {
    "attemptsRemaining": 4,
    "sessionId": "session_abc123def456"
  }
}
```

#### OTP Expired

```json
{
  "success": false,
  "error": {
    "code": "AUTH_OTP_EXPIRED",
    "message": "OTP has expired",
    "status": 401,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "otp",
        "message": "The OTP expired at 2025-12-10T10:10:00Z. Request a new one.",
        "code": "AUTH_OTP_EXPIRED"
      }
    ],
    "suggestion": "Request a new OTP and try again"
  },
  "data": {
    "expiredAt": "2025-12-10T10:10:00Z",
    "sessionId": "session_abc123def456"
  }
}
```

#### OTP Attempts Exceeded

```json
{
  "success": false,
  "error": {
    "code": "AUTH_OTP_ATTEMPTS_EXCEEDED",
    "message": "Too many OTP attempts",
    "status": 429,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "otp",
        "message": "Maximum OTP attempts exceeded. Please try again after 15 minutes.",
        "code": "AUTH_OTP_ATTEMPTS_EXCEEDED"
      }
    ],
    "suggestion": "Wait 15 minutes before requesting another OTP"
  },
  "data": {
    "lockoutUntil": "2025-12-10T10:15:00Z",
    "retryAfter": 900
  }
}
```

#### Country Code Mismatch

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_MISMATCH",
    "message": "Country code mismatch",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "details": [
      {
        "field": "countryCode",
        "message": "Country code +260 doesn't match the phone number provided",
        "code": "VALIDATION_MISMATCH"
      }
    ],
    "suggestion": "Use the same country code and phone number from OTP request"
  },
  "data": null
}
```

---

## Select Role Endpoint

### Endpoint Details

```
POST /auth/select-role
Content-Type: application/json
Authorization: Bearer {sessionId}
```

### Request Parameters

```json
{
  "userId": "user_xyz789",
  "role": "customer",
  "countryCode": "+260",
  "phone": "+260978123456"
}
```

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `userId` | string | Yes | User ID from verify-otp | `user_xyz789` |
| `role` | string | Yes | Role to select | `customer` \| `tasker` \| `vendor` |
| `countryCode` | string | No | Country code for reference | `+260` |
| `phone` | string | No | Full phone number | `+260978123456` |

### Success Response

```json
{
  "success": true,
  "data": {
    "userId": "user_xyz789",
    "role": "customer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "user_xyz789",
      "email": "user@example.com",
      "phone": "+260978123456",
      "countryCode": "+260",
      "role": "customer",
      "name": "John Doe",
      "profilePhoto": "https://...",
      "verified": true,
      "createdAt": "2025-12-10T10:00:00Z"
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | User ID |
| `role` | string | Selected role |
| `accessToken` | string | JWT access token |
| `refreshToken` | string | JWT refresh token |
| `expiresIn` | number | Access token expiration in seconds |
| `tokenType` | string | Token type (always "Bearer") |
| `user` | object | User profile data |

---

## Refresh Token Endpoint

### Endpoint Details

```
POST /auth/refresh
Content-Type: application/json
Authorization: Bearer {refreshToken}
```

### Request Parameters

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `refreshToken` | string | Yes | Refresh token from select-role |

### Success Response

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

---

## Logout Endpoint

### Endpoint Details

```
POST /auth/logout
Content-Type: application/json
Authorization: Bearer {accessToken}
```

### Request Parameters

```json
{
  "userId": "user_xyz789",
  "deviceId": "device_abc123"
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully",
    "timestamp": "2025-12-10T10:00:00Z"
  }
}
```

---

## Error Scenarios

### Complete Error Handling Flow

#### Scenario 1: User with Phone Number

**Step 1: Send OTP**

```json
POST /auth/send-otp
{
  "countryCode": "+260",
  "phone": "0978123456",
  "method": "sms"
}

Response (Success):
{
  "success": true,
  "data": {
    "sessionId": "session_abc123def456",
    "expiresIn": 600,
    "method": "sms",
    "maskedContact": "****3456"
  }
}
```

**Step 2: Verify OTP**

```json
POST /auth/verify-otp
{
  "sessionId": "session_abc123def456",
  "otp": "123456",
  "countryCode": "+260",
  "phone": "0978123456"
}

Response (Success):
{
  "success": true,
  "data": {
    "userId": "user_xyz789",
    "phone": "+260978123456",
    "countryCode": "+260",
    "isNewUser": false,
    "requiresRoleSelection": true
  }
}
```

**Step 3: Select Role**

```json
POST /auth/select-role
{
  "userId": "user_xyz789",
  "role": "customer",
  "countryCode": "+260",
  "phone": "+260978123456"
}

Response (Success):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600,
    "user": {
      "id": "user_xyz789",
      "phone": "+260978123456",
      "countryCode": "+260",
      "role": "customer"
    }
  }
}
```

---

## Client Implementation Examples

### React Native Implementation

```typescript
// authService.ts
import { apiClient } from './client';

interface SendOtpParams {
  email?: string;
  countryCode?: string;
  phone?: string;
  method: 'email' | 'sms';
}

interface VerifyOtpParams {
  sessionId: string;
  otp: string;
  countryCode?: string;
  phone?: string;
  email?: string;
}

export const authService = {
  // Send OTP via email or SMS
  async sendOtp(params: SendOtpParams) {
    try {
      // Validate inputs
      if (params.method === 'email' && !params.email) {
        throw new Error('Email is required for email method');
      }
      
      if (params.method === 'sms') {
        if (!params.countryCode || !params.phone) {
          throw new Error('Country code and phone are required for SMS method');
        }
        
        // Validate country code format
        if (!/^\+\d{1,3}$/.test(params.countryCode)) {
          throw new Error('Invalid country code format. Use +XXX (e.g., +260)');
        }
        
        // Validate phone format (7-15 digits)
        if (!/^\d{7,15}$/.test(params.phone.replace(/\D/g, ''))) {
          throw new Error('Invalid phone number format');
        }
      }
      
      const response = await apiClient.post('/auth/send-otp', {
        email: params.email,
        countryCode: params.countryCode,
        phone: params.phone,
        method: params.method,
      });
      
      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },

  // Verify OTP
  async verifyOtp(params: VerifyOtpParams) {
    try {
      // Validate OTP format
      if (!/^\d{6}$/.test(params.otp)) {
        throw new Error('OTP must be 6 digits');
      }
      
      const response = await apiClient.post('/auth/verify-otp', {
        sessionId: params.sessionId,
        otp: params.otp,
        countryCode: params.countryCode,
        phone: params.phone,
        email: params.email,
      });
      
      return response;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  // Select role
  async selectRole(userId: string, role: 'customer' | 'tasker' | 'vendor', countryCode?: string, phone?: string) {
    try {
      const response = await apiClient.post('/auth/select-role', {
        userId,
        role,
        countryCode,
        phone,
      });
      
      return response;
    } catch (error) {
      console.error('Select role error:', error);
      throw error;
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string) {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken,
      });
      
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  // Logout
  async logout(userId: string) {
    try {
      const response = await apiClient.post('/auth/logout', {
        userId,
      });
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};
```

### OTP Verification Screen Component

```typescript
// OtpVerification.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../../src/api/auth';
import { useAuthStore } from '../../src/store';

interface OtpVerificationProps {
  sessionId: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  method: 'email' | 'sms';
}

export default function OtpVerification({
  sessionId,
  countryCode,
  phone,
  email,
  method,
}: OtpVerificationProps) {
  const router = useRouter();
  const { setError, error } = useAuthStore();
  
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const otpInputRef = useRef<TextInput>(null);

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.verifyOtp({
        sessionId,
        otp,
        countryCode,
        phone,
        email,
      });

      if (response.success) {
        const userData = response.data;
        
        // Store user info
        useAuthStore.setState({
          user: userData,
          isAuthenticated: false, // Not fully authenticated until role selected
        });

        // Navigate to role selection
        router.replace('/(auth)/RoleSelection');
      } else {
        // Handle error
        if (response.error?.code === 'AUTH_OTP_INVALID') {
          setAttemptsRemaining(response.data?.attemptsRemaining || 0);
          setError(
            `Invalid OTP. ${response.data?.attemptsRemaining || 0} attempts remaining.`
          );
        } else if (response.error?.code === 'AUTH_OTP_EXPIRED') {
          Alert.alert(
            'OTP Expired',
            'Your OTP has expired. Please request a new one.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else if (response.error?.code === 'AUTH_OTP_ATTEMPTS_EXCEEDED') {
          Alert.alert(
            'Too Many Attempts',
            'Please try again after 15 minutes.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          setError(response.error?.message || 'Failed to verify OTP');
        }
        
        // Clear OTP input
        setOtp('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      const response = await authService.sendOtp({
        countryCode,
        phone,
        email,
        method,
      });

      if (response.success) {
        setTimeLeft(response.data.expiresIn);
        setAttemptsRemaining(5);
        setOtp('');
        Alert.alert('Success', 'New OTP sent successfully');
      } else {
        setError(response.error?.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const displayContact = method === 'email' ? email : `***${phone?.slice(-4)}`;

  return (
    <View className="flex-1 bg-white px-6 py-12 justify-center">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-4xl font-bold text-gray-900 mb-2">Verify OTP</Text>
        <Text className="text-lg text-gray-600">
          We've sent a code to {displayContact}
        </Text>
      </View>

      {/* Error Message */}
      {error && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <Text className="text-red-800 font-medium">{error}</Text>
        </View>
      )}

      {/* OTP Input */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Enter 6-digit Code
        </Text>
        <TextInput
          ref={otpInputRef}
          className="border border-gray-300 rounded-lg px-4 py-4 text-2xl text-center tracking-widest font-bold bg-white"
          placeholder="000000"
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
          maxLength={6}
          keyboardType="number-pad"
          editable={!isLoading}
          placeholderTextColor="#D1D5DB"
        />
      </View>

      {/* Timer */}
      {timeLeft > 0 && (
        <Text className="text-center text-gray-600 mb-6">
          Code expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </Text>
      )}

      {/* Attempts Remaining */}
      {attemptsRemaining < 5 && (
        <Text className="text-center text-orange-600 mb-6 font-semibold">
          {attemptsRemaining} attempts remaining
        </Text>
      )}

      {/* Verify Button */}
      <TouchableOpacity
        onPress={handleVerifyOtp}
        disabled={isLoading || otp.length < 6}
        className={`rounded-lg py-4 flex-row items-center justify-center mb-4 ${
          isLoading || otp.length < 6 ? 'bg-gray-300' : 'bg-green-600'
        }`}
      >
        <Text className="text-white text-lg font-bold">Verify OTP</Text>
      </TouchableOpacity>

      {/* Resend Button */}
      <TouchableOpacity
        onPress={handleResendOtp}
        disabled={isLoading}
        className="py-3"
      >
        <Text className={`text-center font-semibold ${isLoading ? 'text-gray-400' : 'text-blue-600'}`}>
          Resend Code
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Login Screen with Country Code Selection

```typescript
// LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Picker } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../../src/api/auth';

const COUNTRY_CODES = [
  { label: '🇺🇸 USA/Canada (+1)', value: '+1' },
  { label: '🇬🇧 UK (+44)', value: '+44' },
  { label: '🇮🇳 India (+91)', value: '+91' },
  { label: '🇿🇲 Zambia (+260)', value: '+260' },
  { label: '🇳🇬 Nigeria (+234)', value: '+234' },
  { label: '🇰🇪 Kenya (+254)', value: '+254' },
  { label: '🇿🇦 South Africa (+27)', value: '+27' },
  { label: '🇦🇺 Australia (+61)', value: '+61' },
  { label: '🇩🇪 Germany (+49)', value: '+49' },
  { label: '🇫🇷 France (+33)', value: '+33' },
];

export default function LoginScreen() {
  const router = useRouter();
  
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+260');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setError('');
    
    if (authMethod === 'email') {
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }
    } else {
      if (!phone.trim()) {
        setError('Please enter your phone number');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const response = await authService.sendOtp({
        email: authMethod === 'email' ? email : undefined,
        countryCode: authMethod === 'phone' ? countryCode : undefined,
        phone: authMethod === 'phone' ? phone : undefined,
        method: authMethod === 'email' ? 'email' : 'sms',
      });

      if (response.success) {
        // Navigate to OTP verification
        router.push({
          pathname: '/(auth)/OtpVerification',
          params: {
            sessionId: response.data.sessionId,
            countryCode: authMethod === 'phone' ? countryCode : undefined,
            phone: authMethod === 'phone' ? phone : undefined,
            email: authMethod === 'email' ? email : undefined,
            method: authMethod === 'email' ? 'email' : 'sms',
          },
        });
      } else {
        setError(response.error?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12 justify-center">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 mb-2">Sign In</Text>
          <Text className="text-lg text-gray-600">
            Enter your email or phone number to get started
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <Text className="text-red-800 font-medium">{error}</Text>
          </View>
        )}

        {/* Auth Method Toggle */}
        <View className="flex-row mb-6 bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            onPress={() => setAuthMethod('email')}
            className={`flex-1 py-3 rounded ${authMethod === 'email' ? 'bg-white' : ''}`}
          >
            <Text className={`text-center font-semibold ${authMethod === 'email' ? 'text-blue-600' : 'text-gray-600'}`}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAuthMethod('phone')}
            className={`flex-1 py-3 rounded ${authMethod === 'phone' ? 'bg-white' : ''}`}
          >
            <Text className={`text-center font-semibold ${authMethod === 'phone' ? 'text-blue-600' : 'text-gray-600'}`}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        {authMethod === 'email' && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Email Address</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        )}

        {/* Phone Input */}
        {authMethod === 'phone' && (
          <>
            {/* Country Code Picker */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Country Code</Text>
              <View className="border border-gray-300 rounded-lg bg-white">
                <Picker
                  selectedValue={countryCode}
                  onValueChange={(value) => setCountryCode(value)}
                  enabled={!isLoading}
                >
                  {COUNTRY_CODES.map((country) => (
                    <Picker.Item
                      key={country.value}
                      label={country.label}
                      value={country.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Phone Number Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Phone Number</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg bg-white">
                <Text className="px-4 text-gray-600 font-semibold">{countryCode}</Text>
                <TextInput
                  className="flex-1 px-0 py-3 text-base"
                  placeholder="978123456"
                  value={phone}
                  onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                  editable={!isLoading}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <Text className="text-xs text-gray-500 mt-2">
                Enter phone number without country code
              </Text>
            </View>
          </>
        )}

        {/* Send OTP Button */}
        <TouchableOpacity
          onPress={handleSendOtp}
          disabled={isLoading || (authMethod === 'email' ? !email.trim() : !phone.trim())}
          className={`rounded-lg py-4 flex-row items-center justify-center ${
            isLoading || (authMethod === 'email' ? !email.trim() : !phone.trim())
              ? 'bg-gray-300'
              : 'bg-green-600'
          }`}
        >
          <Text className="text-white text-lg font-bold">
            {isLoading ? 'Sending...' : 'Send OTP'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
```

---

## Summary

✅ **Complete country code integration**  
✅ **Phone and email authentication**  
✅ **Validation for all parameters**  
✅ **Error handling for all scenarios**  
✅ **Client-side implementation examples**  
✅ **React Native components ready to use**  
✅ **Production-ready code**  

---

**Status:** ✅ **READY FOR BACKEND IMPLEMENTATION**
