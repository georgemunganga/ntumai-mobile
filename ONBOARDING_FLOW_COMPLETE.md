# Complete Onboarding Flow Documentation

## Overview

This document details the complete post-OTP onboarding flow for all three user roles: **Customer**, **Tasker**, and **Vendor**. Each role has a distinct experience tailored to their needs.

---

## 1. Authentication Flow (Pre-Onboarding)

### Sequence

```
User → OtpStart → OtpVerify → RoleSelection → Role-Specific Onboarding
```

### API Calls

| Step | Endpoint | Method | Purpose |
|------|----------|--------|---------|
| 1 | `POST /auth/otp/start` | POST | Initiate OTP flow |
| 2 | `POST /auth/otp/verify` | POST | Verify OTP, get `onboardingToken` |
| 3 | `POST /auth/select-role` | POST | Select role, exchange for full tokens |

### Response Structure After OTP Verify

```json
{
  "success": true,
  "data": {
    "sessionId": "session_123",
    "onboardingToken": "eyJhbGc...",
    "userId": "user_123",
    "email": "user@example.com",
    "phone": "+260972827372",
    "isNewUser": true,
    "requiresRoleSelection": true,
    "roles": [],
    "taskerOnboardingStatus": null,
    "vendorId": null
  }
}
```

---

## 2. Customer Onboarding Flow

### Screens

```
RoleSelection (select "Customer")
        ↓
        ↓ POST /auth/select-role (role: "customer")
        ↓
Customer Home Dashboard
```

### Details

| Aspect | Value |
|--------|-------|
| **Screens** | 1 (RoleSelection → Home) |
| **API Calls** | 1 (`POST /auth/select-role`) |
| **Duration** | Instant |
| **User Experience** | Immediate access to marketplace |

### Flow Steps

1. **RoleSelection Screen**
   - User sees three role options
   - Selects "Customer / Order Deliveries"
   - Taps "Continue"

2. **API Call: `POST /auth/select-role`**
   ```json
   {
     "onboardingToken": "eyJhbGc...",
     "role": "customer"
   }
   ```

3. **Response**
   ```json
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc...",
       "user": {
         "id": "user_123",
         "email": "user@example.com",
         "phone": "+260972827372",
         "role": "customer",
         "firstName": "John",
         "lastName": "Doe"
       }
     }
   }
   ```

4. **Navigation**
   - Redirect to `/(customer)/Home`
   - Bottom navigation becomes visible
   - User can immediately browse marketplace

### Available APIs After Onboarding

- `GET /api/v1/marketplace/vendors` - Browse vendors
- `GET /api/v1/marketplace/products` - Browse products
- `POST /api/v1/orders` - Place orders
- `GET /api/v1/orders/me` - View order history
- `GET /api/v1/wallet` - View wallet
- `GET /auth/me` - Get profile

---

## 3. Tasker Onboarding Flow

### Screens

```
RoleSelection (select "Tasker")
        ↓
        ↓ POST /auth/select-role (role: "tasker")
        ↓
TaskerOnboardingIntro
        ↓ (user taps "Start Application")
        ↓
DriverOnboarding (4-step wizard)
  Step 1: Vehicle Information
  Step 2: Documents Upload
  Step 3: Bank Account
  Step 4: Review & Submit
        ↓
WaitingForApproval (polls status)
        ↓
DriverDashboard (once ACTIVE)
```

### Details

| Aspect | Value |
|--------|-------|
| **Screens** | 6 (Intro + 4-step wizard + Approval) |
| **API Calls** | 3+ (`POST /auth/select-role`, `POST /api/v1/riders/apply`, `POST /api/v1/riders/kyc`, `GET /api/v1/riders/me/onboarding-status`) |
| **Duration** | 5-10 minutes (user time) + 1-2 days (backend verification) |
| **User Experience** | Guided wizard with clear steps |

### Flow Steps

#### 1. RoleSelection Screen
- User selects "Register as a Tasker / Biker"
- Taps "Continue"

#### 2. API Call: `POST /auth/select-role`
```json
{
  "onboardingToken": "eyJhbGc...",
  "role": "tasker"
}
```

#### 3. Redirect to TaskerOnboardingIntro
- Shows benefits (earn money, flexible hours, etc.)
- Shows requirements (ID, license, insurance, bank account)
- Shows timeline (5 steps, 2-3 days)
- Two CTAs: "Start Application" or "Skip for Now"

#### 4. TaskerOnboardingIntro → DriverOnboarding
- User taps "Start Application"
- Enters DriverOnboarding wizard

#### 5. DriverOnboarding - Step 1: Vehicle Information
```json
{
  "vehicleType": "motorcycle",
  "vehicleModel": "Honda CB200",
  "licensePlate": "ABC 123"
}
```

#### 6. DriverOnboarding - Step 2: Documents
- Upload driver license
- Upload vehicle registration
- Upload insurance certificate

#### 7. DriverOnboarding - Step 3: Bank Account
```json
{
  "accountName": "John Doe",
  "bankName": "Zanaco",
  "accountNumber": "1234567890"
}
```

#### 8. DriverOnboarding - Step 4: Review
- Show summary of all information
- User confirms and submits

#### 9. API Call: `POST /api/v1/riders/apply`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+260972827372",
  "email": "john@example.com",
  "vehicleType": "motorcycle",
  "vehicleModel": "Honda CB200",
  "licensePlate": "ABC 123"
}
```

#### 10. API Call: `POST /api/v1/riders/kyc`
```json
{
  "driverLicense": "base64_encoded_image",
  "vehicleRegistration": "base64_encoded_image",
  "insurance": "base64_encoded_image",
  "bankAccountName": "John Doe",
  "bankName": "Zanaco",
  "bankAccountNumber": "1234567890"
}
```

#### 11. WaitingForApproval Screen
- Polls `GET /api/v1/riders/me/onboarding-status` every 5-10 seconds
- Shows current status (APPLIED → KYC_PENDING → KYC_APPROVED → TRAINING_PENDING → TRAINING_COMPLETED → PROBATION → ACTIVE)
- Once ACTIVE, redirects to DriverDashboard

#### 12. DriverDashboard
- Shows "Go Online/Offline" toggle
- Shows earnings summary
- Shows active jobs
- Full access to tasker features

### Onboarding Status States

| State | Meaning | Next Step |
|-------|---------|-----------|
| APPLIED | Application submitted | Wait for KYC review |
| KYC_PENDING | Documents under review | Wait for approval |
| KYC_APPROVED | Documents approved | Complete training |
| TRAINING_PENDING | Training not started | Complete training |
| TRAINING_COMPLETED | Training done | Enter probation |
| PROBATION | Limited orders available | Build rating |
| ACTIVE | Full access | Start earning |

### Available APIs After Onboarding

- `GET /api/v1/jobs` - Available jobs
- `POST /api/v1/jobs/:id/accept` - Accept job
- `GET /api/v1/jobs/:id` - Job details
- `POST /api/v1/jobs/:id/complete` - Mark job complete
- `GET /api/v1/wallet` - Earnings
- `GET /api/v1/riders/me/probation-kpis` - Probation metrics
- `GET /auth/me` - Profile

---

## 4. Vendor Onboarding Flow

### Screens

```
RoleSelection (select "Vendor")
        ↓
        ↓ POST /auth/select-role (role: "vendor")
        ↓
VendorOnboardingIntro
        ↓ (user taps "Start Setup")
        ↓
VendorOnboardingWizard (4-step wizard)
  Step 1: Business Information
  Step 2: Location Setup
  Step 3: Bank Details
  Step 4: Review & Submit
        ↓
WaitingForApproval (polls status)
        ↓
VendorDashboard (once ACTIVE)
```

### Details

| Aspect | Value |
|--------|-------|
| **Screens** | 6 (Intro + 4-step wizard + Approval) |
| **API Calls** | 3+ (`POST /auth/select-role`, `POST /api/v1/vendors`, `POST /api/v1/vendors/:id/kyc`, `GET /api/v1/vendors/me/status`) |
| **Duration** | 5-10 minutes (user time) + 1-2 days (backend verification) |
| **User Experience** | Guided wizard with clear steps |

### Flow Steps

#### 1. RoleSelection Screen
- User selects "Register as a Vendor"
- Taps "Continue"

#### 2. API Call: `POST /auth/select-role`
```json
{
  "onboardingToken": "eyJhbGc...",
  "role": "vendor"
}
```

#### 3. Redirect to VendorOnboardingIntro
- Shows benefits (online store, analytics, payments, growth)
- Shows requirements (business registration, tax ID, bank account, ID)
- Shows timeline (5 steps, 1-2 days)
- Two CTAs: "Start Setup" or "Skip for Now"

#### 4. VendorOnboardingIntro → VendorOnboardingWizard
- User taps "Start Setup"
- Enters VendorOnboardingWizard

#### 5. VendorOnboardingWizard - Step 1: Business Information
```json
{
  "businessName": "John's Restaurant",
  "businessType": "Restaurant",
  "description": "Serving authentic Zambian cuisine",
  "phone": "+260972827372"
}
```

#### 6. VendorOnboardingWizard - Step 2: Location Setup
```json
{
  "address": "123 Main Street",
  "city": "Lusaka",
  "district": "Kabulonga",
  "latitude": "-17.8252",
  "longitude": "25.8655"
}
```

#### 7. VendorOnboardingWizard - Step 3: Bank Details
```json
{
  "accountName": "John's Restaurant",
  "bankName": "Zanaco",
  "accountNumber": "1234567890",
  "branchCode": "001"
}
```

#### 8. VendorOnboardingWizard - Step 4: Review
- Show summary of all information
- User confirms and submits

#### 9. API Call: `POST /api/v1/vendors`
```json
{
  "businessName": "John's Restaurant",
  "businessType": "Restaurant",
  "description": "Serving authentic Zambian cuisine",
  "phone": "+260972827372",
  "location": {
    "address": "123 Main Street",
    "city": "Lusaka",
    "district": "Kabulonga",
    "latitude": "-17.8252",
    "longitude": "25.8655"
  }
}
```

#### 10. API Call: `POST /api/v1/vendors/:id/kyc`
```json
{
  "businessRegistration": "base64_encoded_image",
  "taxId": "base64_encoded_image",
  "bankProof": "base64_encoded_image",
  "governmentId": "base64_encoded_image",
  "accountName": "John's Restaurant",
  "bankName": "Zanaco",
  "accountNumber": "1234567890"
}
```

#### 11. WaitingForApproval Screen
- Polls `GET /api/v1/vendors/me/status` every 5-10 seconds
- Shows current status (PENDING → VERIFIED → ACTIVE)
- Once ACTIVE, redirects to VendorDashboard

#### 12. VendorDashboard
- Shows "Open for Orders / Closed" toggle
- Shows pending orders
- Shows quick links to Inventory & Reports
- Full access to vendor features

### Vendor Status States

| State | Meaning | Next Step |
|-------|---------|-----------|
| PENDING | Application submitted | Wait for verification |
| VERIFIED | Documents verified | Ready to go live |
| ACTIVE | Live and accepting orders | Start managing store |
| SUSPENDED | Account suspended | Contact support |

### Available APIs After Onboarding

- `GET /api/v1/vendors/me` - Store profile
- `GET /api/v1/vendors/me/products` - Products
- `POST /api/v1/vendors/me/products` - Add product
- `GET /api/v1/vendors/me/orders` - Orders
- `POST /api/v1/vendors/me/orders/:id/status` - Update order status
- `GET /api/v1/vendors/me/reports` - Analytics
- `GET /auth/me` - Profile

---

## 5. Navigation Structure

### Auth Stack
```
(auth)/
  ├── Splash.improved.tsx
  ├── OtpStart.improved.tsx
  ├── OtpVerify.improved.tsx
  ├── RoleSelection.improved.tsx
  └── _layout.tsx
```

### Customer Stack
```
(customer)/
  ├── Home.tsx (Dashboard)
  ├── Marketplace.tsx
  ├── Orders.tsx
  ├── Wallet.tsx
  ├── Profile.tsx
  └── _layout.tsx
```

### Tasker Stack
```
(tasker)/
  ├── OnboardingIntro.tsx (NEW)
  ├── DriverOnboarding.tsx (Wizard)
  ├── DriverDashboard.tsx
  ├── AvailableJobsScreen.tsx
  ├── ActiveJobScreen.tsx
  ├── EarningsScreen.tsx
  ├── ProbationScreen.tsx
  ├── DriverProfile.tsx
  └── _layout.tsx
```

### Vendor Stack
```
(vendor)/
  ├── OnboardingIntro.tsx (NEW)
  ├── OnboardingWizard.tsx (NEW)
  ├── VendorDashboard.tsx
  ├── ManageProductsScreen.tsx
  ├── AnalyticsScreen.tsx
  ├── VendorProfile.tsx
  └── _layout.tsx
```

---

## 6. State Management

### Auth Store (Zustand)

```typescript
interface AuthState {
  // Tokens
  accessToken: string | null;
  refreshToken: string | null;
  onboardingToken: string | null;

  // User Info
  user: User | null;
  role: 'customer' | 'tasker' | 'vendor' | null;

  // Onboarding Status
  taskerOnboardingStatus: TaskerStatus | null;
  vendorOnboardingStatus: VendorStatus | null;

  // Methods
  startOtp(identifier: string): Promise<void>;
  verifyOtp(sessionId: string, code: string): Promise<void>;
  selectRole(role: 'customer' | 'tasker' | 'vendor'): Promise<void>;
  logout(): Promise<void>;
}
```

### Selectors

```typescript
selectIsFullyAuthenticated() // Has accessToken + role
selectIsOnboarding() // Has onboardingToken, no role
selectIsOtpFlowActive() // In OTP verification
selectTaskerOnboardingStep() // Current step in tasker onboarding
selectVendorOnboardingStep() // Current step in vendor onboarding
```

---

## 7. Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `INVALID_OTP` | Wrong code | Show error, allow retry |
| `OTP_EXPIRED` | Code expired | Show error, trigger resend |
| `SESSION_EXPIRED` | Onboarding token expired | Redirect to login |
| `ROLE_ALREADY_EXISTS` | User already has role | Redirect to dashboard |
| `INVALID_DOCUMENTS` | Documents rejected | Show feedback, allow retry |
| `VERIFICATION_FAILED` | Backend verification failed | Show error, allow resubmit |

### Retry Logic

- **OTP Verification**: Max 5 attempts, then cooldown
- **Document Upload**: Unlimited attempts
- **Status Polling**: Every 5-10 seconds, max 30 minutes

---

## 8. Testing Scenarios

### Scenario 1: New Customer
1. Start OTP flow
2. Verify OTP
3. Select "Customer"
4. Redirected to Home
5. ✅ Can browse marketplace immediately

### Scenario 2: New Tasker
1. Start OTP flow
2. Verify OTP
3. Select "Tasker"
4. See OnboardingIntro
5. Tap "Start Application"
6. Complete 4-step wizard
7. Submitted
8. Poll for approval
9. Once ACTIVE, access DriverDashboard
10. ✅ Can accept jobs

### Scenario 3: New Vendor
1. Start OTP flow
2. Verify OTP
3. Select "Vendor"
4. See VendorOnboardingIntro
5. Tap "Start Setup"
6. Complete 4-step wizard
7. Submitted
8. Poll for approval
9. Once ACTIVE, access VendorDashboard
10. ✅ Can manage store

### Scenario 4: Skip Onboarding
1. Complete OTP + role selection
2. See onboarding intro
3. Tap "Skip for Now"
4. Redirected to dashboard
5. ✅ Can still access features (with limitations)

---

## 9. Backend Requirements

### Required Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/otp/start` | POST | Initiate OTP |
| `/auth/otp/verify` | POST | Verify OTP |
| `/auth/select-role` | POST | Select role |
| `/auth/me` | GET | Get profile |
| `/auth/refresh` | POST | Refresh token |
| `/auth/logout` | POST | Logout |
| `/api/v1/riders/apply` | POST | Apply as tasker |
| `/api/v1/riders/kyc` | POST | Submit KYC |
| `/api/v1/riders/me/onboarding-status` | GET | Check status |
| `/api/v1/vendors` | POST | Create vendor |
| `/api/v1/vendors/:id/kyc` | POST | Submit KYC |
| `/api/v1/vendors/me/status` | GET | Check status |

### Database Schema

**users**
- id, email, phone, firstName, lastName, role, createdAt

**tasker_applications**
- id, userId, status, vehicleType, vehicleModel, licensePlate, bankDetails, createdAt

**vendor_applications**
- id, userId, status, businessName, businessType, location, bankDetails, createdAt

---

## 10. Summary

| Role | Screens | Duration | Experience |
|------|---------|----------|-------------|
| **Customer** | 1 | Instant | Immediate access |
| **Tasker** | 6 | 5-10 min + 1-2 days | Guided wizard + approval |
| **Vendor** | 6 | 5-10 min + 1-2 days | Guided wizard + approval |

All flows follow the principle of **simplifying complex workflows** while maintaining **security** through proper token management and **clarity** through explicit step-by-step guidance.
