# Error Handling & Failure Scenarios Documentation

**Date:** December 10, 2025  
**Version:** 1.0  
**Status:** Production Ready

---

## Table of Contents

1. [Standard Error Response Format](#standard-error-response-format)
2. [HTTP Status Codes](#http-status-codes)
3. [Error Codes & Messages](#error-codes--messages)
4. [Authentication Failures](#authentication-failures)
5. [Validation Errors](#validation-errors)
6. [Business Logic Errors](#business-logic-errors)
7. [Network & Timeout Errors](#network--timeout-errors)
8. [Rate Limiting](#rate-limiting)
9. [Concurrent Request Handling](#concurrent-request-handling)
10. [Offline Mode Scenarios](#offline-mode-scenarios)
11. [Data Conflict Scenarios](#data-conflict-scenarios)
12. [Permission & Authorization Errors](#permission--authorization-errors)
13. [Payment Failures](#payment-failures)
14. [Location & Geofencing Errors](#location--geofencing-errors)
15. [WebSocket Disconnection Handling](#websocket-disconnection-handling)
16. [Retry Logic & Exponential Backoff](#retry-logic--exponential-backoff)

---

## Standard Error Response Format

All error responses follow this standardized format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "status": 400,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error message",
        "code": "FIELD_ERROR_CODE"
      }
    ],
    "suggestion": "What the user should do to resolve this"
  },
  "data": null
}
```

---

## HTTP Status Codes

| Code | Name | When to Use |
|------|------|------------|
| **200** | OK | Request succeeded |
| **201** | Created | Resource created successfully |
| **204** | No Content | Request succeeded, no content to return |
| **400** | Bad Request | Invalid request parameters |
| **401** | Unauthorized | Authentication required or failed |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource not found |
| **409** | Conflict | Resource conflict (duplicate, state mismatch) |
| **422** | Unprocessable Entity | Validation error |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |
| **502** | Bad Gateway | Gateway error |
| **503** | Service Unavailable | Service temporarily unavailable |
| **504** | Gateway Timeout | Request timeout |

---

## Error Codes & Messages

### Authentication Error Codes

| Code | HTTP Status | Message | Scenario |
|------|-------------|---------|----------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Invalid email or password | User entered wrong credentials |
| `AUTH_OTP_INVALID` | 401 | OTP is invalid or expired | User entered wrong OTP or it expired |
| `AUTH_OTP_EXPIRED` | 401 | OTP has expired | User took too long to enter OTP |
| `AUTH_OTP_ATTEMPTS_EXCEEDED` | 429 | Too many OTP attempts | User exceeded max OTP attempts |
| `AUTH_TOKEN_EXPIRED` | 401 | Access token has expired | Token needs refresh |
| `AUTH_TOKEN_INVALID` | 401 | Access token is invalid | Token is malformed or revoked |
| `AUTH_REFRESH_FAILED` | 401 | Failed to refresh token | Refresh token is invalid |
| `AUTH_SESSION_EXPIRED` | 401 | Session has expired | User session timed out |
| `AUTH_UNAUTHORIZED` | 401 | Unauthorized access | User not authenticated |
| `AUTH_FORBIDDEN` | 403 | Access forbidden | User doesn't have permission |
| `AUTH_ACCOUNT_LOCKED` | 403 | Account is locked | Too many failed login attempts |
| `AUTH_ACCOUNT_SUSPENDED` | 403 | Account is suspended | Account suspended by admin |
| `AUTH_ACCOUNT_DELETED` | 403 | Account has been deleted | User deleted their account |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | Email not verified | User needs to verify email |
| `AUTH_PHONE_NOT_VERIFIED` | 403 | Phone not verified | User needs to verify phone |
| `AUTH_2FA_REQUIRED` | 403 | Two-factor authentication required | 2FA is enabled |
| `AUTH_2FA_INVALID` | 401 | Invalid 2FA code | Wrong 2FA code |

### Validation Error Codes

| Code | HTTP Status | Message | Scenario |
|------|-------------|---------|----------|
| `VALIDATION_REQUIRED_FIELD` | 422 | Field is required | Missing required field |
| `VALIDATION_INVALID_FORMAT` | 422 | Invalid format | Field format is incorrect |
| `VALIDATION_INVALID_EMAIL` | 422 | Invalid email format | Email is not valid |
| `VALIDATION_INVALID_PHONE` | 422 | Invalid phone format | Phone number is not valid |
| `VALIDATION_INVALID_DATE` | 422 | Invalid date format | Date is not valid |
| `VALIDATION_INVALID_URL` | 422 | Invalid URL format | URL is not valid |
| `VALIDATION_MIN_LENGTH` | 422 | Field is too short | Field length is below minimum |
| `VALIDATION_MAX_LENGTH` | 422 | Field is too long | Field length exceeds maximum |
| `VALIDATION_MIN_VALUE` | 422 | Value is too small | Value is below minimum |
| `VALIDATION_MAX_VALUE` | 422 | Value is too large | Value exceeds maximum |
| `VALIDATION_INVALID_ENUM` | 422 | Invalid option selected | Selected value not in allowed list |
| `VALIDATION_DUPLICATE` | 409 | This value already exists | Duplicate entry |
| `VALIDATION_MISMATCH` | 422 | Values do not match | Two fields don't match (e.g., passwords) |

### Business Logic Error Codes

| Code | HTTP Status | Message | Scenario |
|------|-------------|---------|----------|
| `RESOURCE_NOT_FOUND` | 404 | Resource not found | Order, user, product not found |
| `RESOURCE_ALREADY_EXISTS` | 409 | Resource already exists | Trying to create duplicate |
| `RESOURCE_DELETED` | 404 | Resource has been deleted | Accessing deleted resource |
| `RESOURCE_ARCHIVED` | 404 | Resource has been archived | Accessing archived resource |
| `INVALID_STATE_TRANSITION` | 409 | Cannot transition to this state | Invalid order/job status change |
| `INSUFFICIENT_BALANCE` | 402 | Insufficient wallet balance | Not enough money in wallet |
| `INSUFFICIENT_STOCK` | 409 | Product out of stock | Item not available |
| `MINIMUM_ORDER_NOT_MET` | 422 | Order total below minimum | Order doesn't meet minimum amount |
| `MAXIMUM_ORDER_EXCEEDED` | 422 | Order total exceeds maximum | Order exceeds maximum amount |
| `DELIVERY_UNAVAILABLE` | 422 | Delivery not available for this area | Location not in delivery zone |
| `RESTAURANT_CLOSED` | 422 | Restaurant is currently closed | Can't order from closed restaurant |
| `RESTAURANT_BUSY` | 422 | Restaurant is too busy | Restaurant not accepting orders |
| `ITEM_UNAVAILABLE` | 422 | Item is currently unavailable | Item temporarily out of stock |
| `PROMO_CODE_INVALID` | 422 | Invalid or expired promo code | Promo code not valid |
| `PROMO_CODE_EXPIRED` | 422 | Promo code has expired | Promo code no longer valid |
| `PROMO_CODE_ALREADY_USED` | 422 | Promo code already used | User already used this code |
| `PROMO_CODE_MAX_USES_EXCEEDED` | 422 | Promo code max uses exceeded | Code usage limit reached |
| `PROMO_CODE_MINIMUM_NOT_MET` | 422 | Order doesn't meet promo minimum | Order too small for promo |
| `DUPLICATE_ORDER` | 409 | Duplicate order detected | Order already placed |
| `DUPLICATE_DELIVERY` | 409 | Duplicate delivery detected | Delivery already requested |
| `DUPLICATE_TASK` | 409 | Duplicate task detected | Task already created |
| `ORDER_ALREADY_CANCELLED` | 409 | Order already cancelled | Can't cancel twice |
| `ORDER_ALREADY_COMPLETED` | 409 | Order already completed | Can't modify completed order |
| `DELIVERY_ALREADY_ACCEPTED` | 409 | Delivery already accepted | Delivery taken by another tasker |
| `JOB_ALREADY_ACCEPTED` | 409 | Job already accepted | Job taken by another tasker |
| `JOB_EXPIRED` | 422 | Job offer has expired | Job no longer available |
| `TASKER_NOT_AVAILABLE` | 422 | Tasker not available | Tasker offline or busy |
| `TASKER_NOT_QUALIFIED` | 403 | Tasker not qualified for this job | Tasker doesn't meet requirements |
| `TASKER_ON_PROBATION` | 403 | Tasker on probation | Tasker can't accept jobs |
| `TASKER_ACCOUNT_SUSPENDED` | 403 | Tasker account suspended | Tasker suspended |
| `VENDOR_NOT_AVAILABLE` | 422 | Vendor not available | Vendor offline |
| `VENDOR_ACCOUNT_SUSPENDED` | 403 | Vendor account suspended | Vendor suspended |
| `PAYMENT_FAILED` | 402 | Payment processing failed | Payment declined |
| `PAYMENT_CANCELLED` | 402 | Payment was cancelled | User cancelled payment |
| `PAYMENT_TIMEOUT` | 504 | Payment processing timeout | Payment took too long |
| `REFUND_FAILED` | 500 | Refund processing failed | Unable to process refund |

### Network & System Error Codes

| Code | HTTP Status | Message | Scenario |
|------|-------------|---------|----------|
| `NETWORK_ERROR` | 0 | Network connection error | No internet connection |
| `NETWORK_TIMEOUT` | 504 | Request timeout | Request took too long |
| `SERVER_ERROR` | 500 | Internal server error | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable | Server maintenance |
| `DATABASE_ERROR` | 500 | Database error | Database connection failed |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service error | Third-party API failed |
| `PAYMENT_GATEWAY_ERROR` | 502 | Payment gateway error | Payment processor error |
| `SMS_GATEWAY_ERROR` | 502 | SMS gateway error | SMS provider error |
| `EMAIL_GATEWAY_ERROR` | 502 | Email gateway error | Email provider error |
| `LOCATION_SERVICE_ERROR` | 502 | Location service error | Maps/location API error |
| `STORAGE_ERROR` | 500 | Storage service error | File storage error |
| `CACHE_ERROR` | 500 | Cache service error | Cache service error |

### Rate Limiting Error Codes

| Code | HTTP Status | Message | Scenario |
|------|-------------|---------|----------|
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Rate limit exceeded |
| `OTP_RATE_LIMIT` | 429 | Too many OTP requests | OTP sent too frequently |
| `LOGIN_RATE_LIMIT` | 429 | Too many login attempts | Too many failed logins |
| `API_RATE_LIMIT` | 429 | API rate limit exceeded | API quota exceeded |

---

## Authentication Failures

### 1. Invalid OTP

**Scenario:** User enters wrong OTP code

**Request:**
```json
POST /auth/verify-otp
{
  "sessionId": "session_123",
  "otp": "000000"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_OTP_INVALID",
    "message": "OTP is invalid or expired",
    "status": 401,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "otp",
        "message": "The OTP you entered is incorrect",
        "code": "AUTH_OTP_INVALID"
      }
    ],
    "suggestion": "Please check your email/SMS and enter the correct OTP. You have 4 attempts remaining."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In OtpVerification.tsx
try {
  const response = await mockAuthService.verifyOtp(otpId, otp);
  
  if (!response.success) {
    // Show error message
    setError(response.error.message);
    
    // Show remaining attempts
    if (response.error.details?.[0]?.message.includes('attempts')) {
      // Update UI to show attempts remaining
    }
    
    // Clear OTP input
    setOtp('');
  }
} catch (err) {
  setError('Failed to verify OTP. Please try again.');
}
```

---

### 2. OTP Expired

**Scenario:** User takes too long to enter OTP (>10 minutes)

**Request:**
```json
POST /auth/verify-otp
{
  "sessionId": "session_123",
  "otp": "123456"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_OTP_EXPIRED",
    "message": "OTP has expired",
    "status": 401,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "otp",
        "message": "The OTP expired at 2025-12-10T10:10:00Z",
        "code": "AUTH_OTP_EXPIRED"
      }
    ],
    "suggestion": "Request a new OTP and try again."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In OtpVerification.tsx
if (response.error.code === 'AUTH_OTP_EXPIRED') {
  setStep('contact'); // Go back to contact entry
  setError('OTP expired. Please request a new one.');
  setOtp('');
  setOtpId('');
}
```

---

### 3. OTP Attempts Exceeded

**Scenario:** User enters wrong OTP more than 5 times

**Request:**
```json
POST /auth/verify-otp
{
  "sessionId": "session_123",
  "otp": "000000"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_OTP_ATTEMPTS_EXCEEDED",
    "message": "Too many OTP attempts",
    "status": 429,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "otp",
        "message": "Maximum OTP attempts exceeded. Please try again after 15 minutes.",
        "code": "AUTH_OTP_ATTEMPTS_EXCEEDED"
      }
    ],
    "suggestion": "You've exceeded the maximum number of OTP attempts. Please try again after 15 minutes."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In OtpVerification.tsx
if (response.error.code === 'AUTH_OTP_ATTEMPTS_EXCEEDED') {
  setStep('contact');
  setError('Too many attempts. Please try again after 15 minutes.');
  setResendDisabled(true);
  
  // Disable for 15 minutes
  setTimeout(() => setResendDisabled(false), 15 * 60 * 1000);
}
```

---

### 4. Token Expired

**Scenario:** Access token expires while user is using the app

**Request:**
```json
GET /orders?userId=user_123
Authorization: Bearer eyJhbGc...expired_token
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "Access token has expired",
    "status": 401,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "authorization",
        "message": "Token expired at 2025-12-10T10:30:00Z",
        "code": "AUTH_TOKEN_EXPIRED"
      }
    ],
    "suggestion": "Please refresh your session."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In API client interceptor
if (response.error.code === 'AUTH_TOKEN_EXPIRED') {
  // Try to refresh token
  const refreshed = await authStore.refreshToken();
  
  if (refreshed) {
    // Retry original request
    return retryRequest();
  } else {
    // Redirect to login
    router.replace('/(auth)/LoginScreen');
  }
}
```

---

### 5. Account Locked

**Scenario:** User has too many failed login attempts

**Request:**
```json
POST /auth/send-otp
{
  "email": "john@example.com"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_ACCOUNT_LOCKED",
    "message": "Account is locked",
    "status": 403,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "email",
        "message": "Account locked due to multiple failed login attempts",
        "code": "AUTH_ACCOUNT_LOCKED"
      }
    ],
    "suggestion": "Your account has been locked for security reasons. Please contact support or try again after 24 hours."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In LoginScreen.tsx
if (response.error.code === 'AUTH_ACCOUNT_LOCKED') {
  setError('Account locked. Please contact support.');
  // Show support contact info
}
```

---

## Validation Errors

### 1. Required Field Missing

**Scenario:** User submits form without required field

**Request:**
```json
POST /orders
{
  "vendorId": "vendor_123",
  "items": [],
  "deliveryAddressId": "",
  "paymentMethod": "",
  "total": 0
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_REQUIRED_FIELD",
    "message": "Required fields are missing",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "items",
        "message": "Items list is required and cannot be empty",
        "code": "VALIDATION_REQUIRED_FIELD"
      },
      {
        "field": "deliveryAddressId",
        "message": "Delivery address is required",
        "code": "VALIDATION_REQUIRED_FIELD"
      },
      {
        "field": "paymentMethod",
        "message": "Payment method is required",
        "code": "VALIDATION_REQUIRED_FIELD"
      }
    ],
    "suggestion": "Please fill in all required fields before submitting."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
if (!response.success) {
  // Show field-specific errors
  response.error.details.forEach(error => {
    if (error.field === 'items') {
      setItemsError(error.message);
    } else if (error.field === 'deliveryAddressId') {
      setAddressError(error.message);
    } else if (error.field === 'paymentMethod') {
      setPaymentError(error.message);
    }
  });
}
```

---

### 2. Invalid Email Format

**Scenario:** User enters invalid email

**Request:**
```json
POST /auth/send-otp
{
  "email": "not-an-email"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_INVALID_EMAIL",
    "message": "Invalid email format",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "email",
        "message": "Please enter a valid email address (e.g., user@example.com)",
        "code": "VALIDATION_INVALID_EMAIL"
      }
    ],
    "suggestion": "Check your email address and try again."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In LoginScreen.tsx
if (response.error.code === 'VALIDATION_INVALID_EMAIL') {
  setError(response.error.details[0].message);
  // Highlight email field
  setEmailError(true);
}
```

---

### 3. Duplicate Entry

**Scenario:** User tries to create duplicate address

**Request:**
```json
POST /users/user_123/addresses
{
  "label": "Home",
  "street": "123 Main St",
  "city": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_DUPLICATE",
    "message": "This address already exists",
    "status": 409,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "address",
        "message": "You already have an address saved at this location",
        "code": "VALIDATION_DUPLICATE"
      }
    ],
    "suggestion": "Edit the existing address or add a different one."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In AddressesScreen.tsx
if (response.error.code === 'VALIDATION_DUPLICATE') {
  Alert.alert(
    'Address Already Exists',
    response.error.suggestion,
    [
      { text: 'Edit Existing', onPress: () => editExistingAddress() },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
}
```

---

## Business Logic Errors

### 1. Insufficient Balance

**Scenario:** User tries to pay with wallet but doesn't have enough balance

**Request:**
```json
POST /orders
{
  "vendorId": "vendor_123",
  "items": [...],
  "paymentMethod": "wallet",
  "total": 100.00
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient wallet balance",
    "status": 402,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "wallet",
        "message": "Wallet balance is $25.50 but order total is $100.00",
        "code": "INSUFFICIENT_BALANCE"
      }
    ],
    "suggestion": "Add funds to your wallet or use a different payment method."
  },
  "data": {
    "requiredAmount": 100.00,
    "currentBalance": 25.50,
    "shortfall": 74.50
  }
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
if (response.error.code === 'INSUFFICIENT_BALANCE') {
  const shortfall = response.data.shortfall;
  Alert.alert(
    'Insufficient Balance',
    `You need $${shortfall.toFixed(2)} more to complete this order.`,
    [
      { text: 'Add Funds', onPress: () => navigateToWallet() },
      { text: 'Use Different Payment', onPress: () => changePaymentMethod() },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
}
```

---

### 2. Product Out of Stock

**Scenario:** Product becomes unavailable while user is checking out

**Request:**
```json
POST /orders
{
  "vendorId": "vendor_123",
  "items": [
    {
      "productId": "product_123",
      "quantity": 5
    }
  ],
  "total": 50.00
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Product out of stock",
    "status": 409,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "items[0].productId",
        "message": "Product 'Burger' only has 2 items in stock but you requested 5",
        "code": "INSUFFICIENT_STOCK"
      }
    ],
    "suggestion": "Reduce the quantity to 2 or remove this item from your cart."
  },
  "data": {
    "productId": "product_123",
    "productName": "Burger",
    "requestedQuantity": 5,
    "availableQuantity": 2
  }
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
if (response.error.code === 'INSUFFICIENT_STOCK') {
  const product = response.data;
  Alert.alert(
    'Out of Stock',
    `Only ${product.availableQuantity} ${product.productName}(s) available.`,
    [
      {
        text: 'Update Quantity',
        onPress: () => updateCartQuantity(product.productId, product.availableQuantity)
      },
      { text: 'Remove Item', onPress: () => removeFromCart(product.productId) },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
}
```

---

### 3. Minimum Order Not Met

**Scenario:** Order total is below restaurant's minimum

**Request:**
```json
POST /orders
{
  "vendorId": "vendor_123",
  "items": [
    {
      "productId": "product_123",
      "quantity": 1
    }
  ],
  "total": 5.00
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "MINIMUM_ORDER_NOT_MET",
    "message": "Order total below minimum",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "total",
        "message": "Minimum order amount is $15.00 but your order is $5.00",
        "code": "MINIMUM_ORDER_NOT_MET"
      }
    ],
    "suggestion": "Add more items to reach the minimum order amount of $15.00."
  },
  "data": {
    "minimumOrderAmount": 15.00,
    "currentOrderAmount": 5.00,
    "shortfall": 10.00
  }
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
if (response.error.code === 'MINIMUM_ORDER_NOT_MET') {
  const shortfall = response.data.shortfall;
  Alert.alert(
    'Minimum Order Not Met',
    `Add $${shortfall.toFixed(2)} more items to place order.`,
    [
      { text: 'Continue Shopping', onPress: () => goBackToVendor() },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
}
```

---

### 4. Restaurant Closed

**Scenario:** Restaurant closes while user is placing order

**Request:**
```json
POST /orders
{
  "vendorId": "vendor_123",
  "items": [...],
  "total": 50.00
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "RESTAURANT_CLOSED",
    "message": "Restaurant is currently closed",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "vendorId",
        "message": "Restaurant closed at 22:00. Opens again at 09:00 tomorrow.",
        "code": "RESTAURANT_CLOSED"
      }
    ],
    "suggestion": "Try ordering tomorrow after 09:00 AM."
  },
  "data": {
    "vendorId": "vendor_123",
    "closedAt": "2025-12-10T22:00:00Z",
    "opensAt": "2025-12-11T09:00:00Z"
  }
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
if (response.error.code === 'RESTAURANT_CLOSED') {
  const opensAt = new Date(response.data.opensAt);
  Alert.alert(
    'Restaurant Closed',
    `Opens again at ${opensAt.toLocaleTimeString()}`,
    [
      { text: 'Go Back', onPress: () => goBack() },
      { text: 'Browse Other Restaurants', onPress: () => goToMarketplace() }
    ]
  );
}
```

---

### 5. Delivery Not Available

**Scenario:** Delivery not available for user's location

**Request:**
```json
POST /orders
{
  "vendorId": "vendor_123",
  "items": [...],
  "deliveryAddressId": "addr_123",
  "total": 50.00
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "DELIVERY_UNAVAILABLE",
    "message": "Delivery not available for this area",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "deliveryAddressId",
        "message": "This restaurant doesn't deliver to your area. Delivery available within 5km of restaurant.",
        "code": "DELIVERY_UNAVAILABLE"
      }
    ],
    "suggestion": "Choose a different address within the delivery zone or select a different restaurant."
  },
  "data": {
    "vendorId": "vendor_123",
    "deliveryZoneRadius": 5,
    "userDistance": 8.5,
    "availableAddresses": [
      {
        "id": "addr_456",
        "label": "Office",
        "distance": 3.2
      }
    ]
  }
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
if (response.error.code === 'DELIVERY_UNAVAILABLE') {
  const availableAddresses = response.data.availableAddresses;
  
  if (availableAddresses.length > 0) {
    Alert.alert(
      'Delivery Unavailable',
      'This restaurant doesn\'t deliver to this address.',
      [
        {
          text: 'Use Available Address',
          onPress: () => selectAddress(availableAddresses[0].id)
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  } else {
    Alert.alert(
      'Delivery Unavailable',
      'This restaurant doesn\'t deliver to your area.',
      [{ text: 'OK', style: 'cancel' }]
    );
  }
}
```

---

### 6. Promo Code Invalid

**Scenario:** User enters invalid promo code

**Request:**
```json
POST /orders
{
  "vendorId": "vendor_123",
  "items": [...],
  "promoCode": "INVALID123",
  "total": 50.00
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "PROMO_CODE_INVALID",
    "message": "Invalid or expired promo code",
    "status": 422,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "promoCode",
        "message": "Promo code 'INVALID123' is not valid",
        "code": "PROMO_CODE_INVALID"
      }
    ],
    "suggestion": "Check the promo code and try again."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
if (response.error.code === 'PROMO_CODE_INVALID') {
  setPromoError(response.error.details[0].message);
  setPromoCode('');
}
```

---

### 7. Job Already Accepted

**Scenario:** Tasker tries to accept job that's already accepted

**Request:**
```json
POST /taskers/tasker_123/jobs/job_123/accept
{
  "taskerId": "tasker_123",
  "jobId": "job_123"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "JOB_ALREADY_ACCEPTED",
    "message": "Job already accepted",
    "status": 409,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "jobId",
        "message": "This job was accepted by another tasker 2 minutes ago",
        "code": "JOB_ALREADY_ACCEPTED"
      }
    ],
    "suggestion": "Browse other available jobs."
  },
  "data": {
    "jobId": "job_123",
    "acceptedBy": "tasker_456",
    "acceptedAt": "2025-12-10T09:58:00Z"
  }
}
```

**Client-Side Handling:**
```typescript
// In JobDetailScreen.tsx
if (response.error.code === 'JOB_ALREADY_ACCEPTED') {
  Alert.alert(
    'Job Taken',
    'Another tasker already accepted this job.',
    [
      { text: 'Browse Jobs', onPress: () => goToAvailableJobs() },
      { text: 'OK', style: 'cancel' }
    ]
  );
}
```

---

### 8. Tasker Not Qualified

**Scenario:** Tasker doesn't meet job requirements

**Request:**
```json
POST /taskers/tasker_123/jobs/job_123/accept
{
  "taskerId": "tasker_123",
  "jobId": "job_123"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "TASKER_NOT_QUALIFIED",
    "message": "Tasker not qualified for this job",
    "status": 403,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "taskerId",
        "message": "Your rating (3.2) is below the required minimum (4.0)",
        "code": "TASKER_NOT_QUALIFIED"
      }
    ],
    "suggestion": "Complete more jobs and improve your rating to accept this type of job."
  },
  "data": {
    "taskerId": "tasker_123",
    "currentRating": 3.2,
    "requiredRating": 4.0,
    "jobsNeeded": 15
  }
}
```

**Client-Side Handling:**
```typescript
// In JobDetailScreen.tsx
if (response.error.code === 'TASKER_NOT_QUALIFIED') {
  Alert.alert(
    'Not Qualified',
    `Your rating (${response.data.currentRating}) is below required (${response.data.requiredRating})`,
    [{ text: 'OK', style: 'cancel' }]
  );
}
```

---

## Network & Timeout Errors

### 1. Network Connection Error

**Scenario:** No internet connection

**Request:**
```
Any API call without internet
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "NETWORK_ERROR",
    "message": "Network connection error",
    "status": 0,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "network",
        "message": "Unable to connect to server. Check your internet connection.",
        "code": "NETWORK_ERROR"
      }
    ],
    "suggestion": "Check your internet connection and try again."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In API client
try {
  const response = await fetch(url);
} catch (error) {
  if (error.message.includes('Network')) {
    // Show offline banner
    showOfflineBanner();
    
    // Queue request for retry
    queueRequestForRetry(url, options);
  }
}
```

---

### 2. Request Timeout

**Scenario:** Request takes longer than 30 seconds

**Request:**
```
Any slow API call
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "NETWORK_TIMEOUT",
    "message": "Request timeout",
    "status": 504,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "request",
        "message": "Request took longer than 30 seconds",
        "code": "NETWORK_TIMEOUT"
      }
    ],
    "suggestion": "Check your internet connection and try again."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In API client
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch(url, { signal: controller.signal });
} catch (error) {
  if (error.name === 'AbortError') {
    // Handle timeout
    showTimeoutError();
    // Show retry button
  }
} finally {
  clearTimeout(timeout);
}
```

---

## Rate Limiting

### 1. OTP Rate Limit

**Scenario:** User requests OTP too many times

**Request:**
```json
POST /auth/send-otp
{
  "email": "john@example.com"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "OTP_RATE_LIMIT",
    "message": "Too many OTP requests",
    "status": 429,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "email",
        "message": "You've requested OTP 5 times in the last hour. Please try again after 1 hour.",
        "code": "OTP_RATE_LIMIT"
      }
    ],
    "suggestion": "Wait before requesting another OTP."
  },
  "data": {
    "retryAfter": 3600,
    "nextAvailableAt": "2025-12-10T11:00:00Z"
  }
}
```

**Client-Side Handling:**
```typescript
// In LoginScreen.tsx
if (response.error.code === 'OTP_RATE_LIMIT') {
  const retryAfter = response.data.retryAfter;
  setResendDisabled(true);
  
  // Disable for the specified duration
  setTimeout(() => setResendDisabled(false), retryAfter * 1000);
  
  setError(`Too many attempts. Try again after ${Math.ceil(retryAfter / 60)} minutes.`);
}
```

---

### 2. API Rate Limit

**Scenario:** User exceeds API rate limit

**Request:**
```
Any API call after exceeding limit
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "API_RATE_LIMIT",
    "message": "API rate limit exceeded",
    "status": 429,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "api",
        "message": "You've made 100 requests in the last minute. Limit is 100 per minute.",
        "code": "API_RATE_LIMIT"
      }
    ],
    "suggestion": "Wait a moment before making more requests."
  },
  "data": {
    "limit": 100,
    "remaining": 0,
    "resetAt": "2025-12-10T10:01:00Z"
  }
}
```

**Client-Side Handling:**
```typescript
// In API client
if (response.status === 429) {
  const resetAt = new Date(response.data.resetAt);
  const waitTime = resetAt.getTime() - Date.now();
  
  // Queue request for retry
  setTimeout(() => retryRequest(), waitTime);
  
  // Show message to user
  showMessage('Too many requests. Retrying...');
}
```

---

## Concurrent Request Handling

### 1. Duplicate Request Prevention

**Scenario:** User taps button multiple times quickly

**Request:**
```json
POST /orders (first request)
POST /orders (duplicate request within 2 seconds)
```

**Response (Failure - Second Request):**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ORDER",
    "message": "Duplicate order detected",
    "status": 409,
    "timestamp": "2025-12-10T10:00:01Z",
    "requestId": "req_123456790",
    "details": [
      {
        "field": "order",
        "message": "An identical order was just created. Please check your orders.",
        "code": "DUPLICATE_ORDER"
      }
    ],
    "suggestion": "Check your orders to see if your order was placed."
  },
  "data": {
    "existingOrderId": "order_123",
    "createdAt": "2025-12-10T10:00:00Z"
  }
}
```

**Client-Side Handling:**
```typescript
// In CheckoutScreen.tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handlePlaceOrder = async () => {
  if (isSubmitting) return; // Prevent duplicate submissions
  
  setIsSubmitting(true);
  
  try {
    const response = await placeOrder();
    
    if (response.error?.code === 'DUPLICATE_ORDER') {
      // Navigate to existing order
      router.push(`/orders/${response.data.existingOrderId}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Offline Mode Scenarios

### 1. Offline Data Sync Conflict

**Scenario:** User made changes offline, but data changed on server

**Request (After Coming Online):**
```json
PUT /users/user_123
{
  "name": "John Doe",
  "lastModified": "2025-12-10T09:00:00Z"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "Resource has been modified",
    "status": 409,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "lastModified",
        "message": "Resource was modified at 2025-12-10T09:30:00Z",
        "code": "RESOURCE_CONFLICT"
      }
    ],
    "suggestion": "Refresh your data and try again."
  },
  "data": {
    "serverVersion": {
      "name": "John Smith",
      "lastModified": "2025-12-10T09:30:00Z"
    },
    "clientVersion": {
      "name": "John Doe",
      "lastModified": "2025-12-10T09:00:00Z"
    }
  }
}
```

**Client-Side Handling:**
```typescript
// In ProfileScreen.tsx
if (response.error.code === 'RESOURCE_CONFLICT') {
  Alert.alert(
    'Conflict',
    'Your data was modified elsewhere. Choose which version to keep.',
    [
      {
        text: 'Keep Server Version',
        onPress: () => {
          updateLocalData(response.data.serverVersion);
          refreshUI();
        }
      },
      {
        text: 'Keep My Changes',
        onPress: () => {
          // Retry with force flag
          retryWithForce();
        }
      },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
}
```

---

## Permission & Authorization Errors

### 1. Insufficient Permissions

**Scenario:** User tries to access resource they don't own

**Request:**
```json
GET /orders/order_456
Authorization: Bearer user_123_token
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FORBIDDEN",
    "message": "Access forbidden",
    "status": 403,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "orderId",
        "message": "You don't have permission to view this order",
        "code": "AUTH_FORBIDDEN"
      }
    ],
    "suggestion": "You can only view your own orders."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In OrderDetailScreen.tsx
if (response.error.code === 'AUTH_FORBIDDEN') {
  Alert.alert(
    'Access Denied',
    'You don\'t have permission to view this order.',
    [{ text: 'Go Back', onPress: () => goBack() }]
  );
}
```

---

## Payment Failures

### 1. Payment Declined

**Scenario:** Credit card declined

**Request:**
```json
POST /payments/process
{
  "orderId": "order_123",
  "amount": 50.00,
  "method": "card",
  "cardNumber": "4000000000000002"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_FAILED",
    "message": "Payment processing failed",
    "status": 402,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "payment",
        "message": "Card declined: Insufficient funds",
        "code": "PAYMENT_FAILED"
      }
    ],
    "suggestion": "Check your card details and try again or use a different payment method."
  },
  "data": {
    "transactionId": "txn_123",
    "amount": 50.00,
    "failureReason": "insufficient_funds",
    "retryable": true
  }
}
```

**Client-Side Handling:**
```typescript
// In PaymentConfirmationScreen.tsx
if (response.error.code === 'PAYMENT_FAILED') {
  Alert.alert(
    'Payment Failed',
    response.error.details[0].message,
    [
      { text: 'Retry', onPress: () => retryPayment() },
      { text: 'Use Different Card', onPress: () => changePaymentMethod() },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
}
```

---

### 2. Payment Timeout

**Scenario:** Payment processing takes too long

**Request:**
```json
POST /payments/process
{
  "orderId": "order_123",
  "amount": 50.00,
  "method": "card"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_TIMEOUT",
    "message": "Payment processing timeout",
    "status": 504,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "payment",
        "message": "Payment processing took longer than expected",
        "code": "PAYMENT_TIMEOUT"
      }
    ],
    "suggestion": "Check your bank account. If payment was deducted, your order may have been placed. Otherwise, try again."
  },
  "data": {
    "transactionId": "txn_123",
    "status": "pending",
    "checkStatusAt": "2025-12-10T10:05:00Z"
  }
}
```

**Client-Side Handling:**
```typescript
// In PaymentConfirmationScreen.tsx
if (response.error.code === 'PAYMENT_TIMEOUT') {
  Alert.alert(
    'Payment Processing',
    'Payment is being processed. Please wait...',
    [
      { text: 'Check Status', onPress: () => checkPaymentStatus(response.data.transactionId) },
      { text: 'OK', style: 'cancel' }
    ]
  );
}
```

---

## Location & Geofencing Errors

### 1. Location Permission Denied

**Scenario:** User denies location permission

**Request:**
```
Location permission required for delivery tracking
```

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "LOCATION_PERMISSION_DENIED",
    "message": "Location permission denied",
    "status": 403,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "location",
        "message": "Location permission is required to track your delivery",
        "code": "LOCATION_PERMISSION_DENIED"
      }
    ],
    "suggestion": "Grant location permission in settings to track your delivery."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In OrderTrackingScreen.tsx
useEffect(() => {
  requestLocationPermission().then(granted => {
    if (!granted) {
      Alert.alert(
        'Location Permission Required',
        'Grant location permission to track your delivery.',
        [
          { text: 'Open Settings', onPress: () => openSettings() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  });
}, []);
```

---

## WebSocket Disconnection Handling

### 1. WebSocket Connection Lost

**Scenario:** WebSocket connection drops

**Response (Failure):**
```json
{
  "success": false,
  "error": {
    "code": "WS_CONNECTION_LOST",
    "message": "WebSocket connection lost",
    "status": 0,
    "timestamp": "2025-12-10T10:00:00Z",
    "requestId": "req_123456789",
    "details": [
      {
        "field": "websocket",
        "message": "Connection to real-time server lost",
        "code": "WS_CONNECTION_LOST"
      }
    ],
    "suggestion": "Reconnecting automatically. Please wait..."
  },
  "data": null
}
```

**Client-Side Handling:**
```typescript
// In websocket.ts service
const reconnectWithBackoff = async (attempt = 0) => {
  const maxAttempts = 5;
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  
  if (attempt >= maxAttempts) {
    showError('Unable to connect to real-time service');
    return;
  }
  
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  
  setTimeout(() => {
    try {
      connectWebSocket();
    } catch (error) {
      reconnectWithBackoff(attempt + 1);
    }
  }, delay);
};
```

---

## Retry Logic & Exponential Backoff

### Implementation Example

```typescript
// In API client
const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxAttempts = 3,
  baseDelay = 1000
) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
};

// Usage
const response = await retryWithBackoff(() => apiClient.get('/orders'));
```

---

## Summary

This document covers:

✅ **Standard error response format**  
✅ **HTTP status codes**  
✅ **20+ error codes with descriptions**  
✅ **15+ failure scenarios with examples**  
✅ **Client-side handling code**  
✅ **Retry logic and backoff strategies**  
✅ **Offline mode handling**  
✅ **WebSocket disconnection handling**  
✅ **Payment failure scenarios**  
✅ **Rate limiting handling**  

Your backend team should implement all these error scenarios and return responses in the exact format specified.

---

**Status:** ✅ **READY FOR BACKEND IMPLEMENTATION**
