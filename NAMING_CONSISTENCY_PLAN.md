# Naming Consistency Plan: Driver → Tasker

## Issue
According to the [Ntumai Blueprint](Ntumai_Mobile_App_COMPLETE_BLUEPRINT_v4.md), the three primary roles are:
1. **Customer**
2. **Tasker (Driver/Rider)** ← Primary role name is "Tasker"
3. **Vendor**

Currently, the codebase inconsistently uses "driver" when it should use "tasker". The term "driver" should only appear when specifically referring to the driver **type** of tasker (as opposed to rider/biker type).

---

## Audit Results

###Files with "Driver" in Name (Need Renaming)

#### App Directory (Wrappers & Screens)
1. `app/(auth)/DriverOnboarding.tsx` → Should be `TaskerOnboarding.tsx`
2. `app/(tasker)/DriverDashboard.tsx` → Should be `TaskerDashboard.tsx`
3. `app/(tasker)/DriverEarnings.tsx` → Should be `TaskerEarnings.tsx`
4. `app/(tasker)/DriverOrders.tsx` → Should be `TaskerOrders.tsx`
5. `app/(tasker)/DriverProfile.tsx` → Should be `TaskerProfile.tsx`
6. `app/(tasker)/DriverRoutes.tsx` → Should be `TaskerRoutes.tsx`
7. `app/(tasker)/DriverSetting.tsx` → Should be `TaskerSetting.tsx`

#### Screens Directory (Legacy)
8. `screens/driver/DriverDashboard.tsx` → Should be `screens/tasker/TaskerDashboard.tsx`
9. `screens/driver/DriverEarnings.tsx` → Should be `screens/tasker/TaskerEarnings.tsx`
10. `screens/driver/DriverOrders.tsx` → Should be `screens/tasker/TaskerOrders.tsx`
11. `screens/driver/DriverProfile.tsx` → Should be `screens/tasker/TaskerProfile.tsx`
12. `screens/driver/DriverRoutes.tsx` → Should be `screens/tasker/TaskerRoutes.tsx`
13. `screens/driver/DriverSetting.tsx` → Should be `screens/tasker/TaskerSetting.tsx`
14. `screens/driver/index.ts` → Should be `screens/tasker/index.ts`
15. `screens/driver/` directory → Should be `screens/tasker/`

#### State Management
16. `src/store/slices/driverSlice.ts` → Should be `taskerSlice.ts`

**Total Files**: 16 files + 1 directory

---

## Constants & Code References

### src/utils/constants.ts

#### USER_ROLES (Line 254-259)
**Current:**
```typescript
export const USER_ROLES = {
  CUSTOMER: 'customer',
  DRIVER: 'driver',  // ❌ WRONG - Should be TASKER
  VENDOR: 'vendor',
  ADMIN: 'admin',
} as const;
```

**Should Be:**
```typescript
export const USER_ROLES = {
  CUSTOMER: 'customer',
  TASKER: 'tasker',  // ✅ CORRECT
  VENDOR: 'vendor',
  ADMIN: 'admin',
} as const;
```

**BUT:** Backend API likely uses 'driver' so we need to check API contract first!

#### Storage Keys (Lines 40-43)
**Current:**
```typescript
DRIVER_STATUS: '@ntumai_driver_status',
DRIVER_LOCATION: '@ntumai_driver_location',
DRIVER_STATS: '@ntumai_driver_stats',
```

**Should Be:**
```typescript
TASKER_STATUS: '@ntumai_tasker_status',
TASKER_LOCATION: '@ntumai_tasker_location',
TASKER_STATS: '@ntumai_tasker_stats',
```

#### Business Constants (Lines 137-140)
**Current:**
```typescript
DRIVER_COMMISSION_RATE: 0.8,
MIN_DRIVER_RATING: 4.0,
MAX_ACTIVE_ORDERS_PER_DRIVER: 3,
```

**Should Be:**
```typescript
TASKER_COMMISSION_RATE: 0.8,
MIN_TASKER_RATING: 4.0,
MAX_ACTIVE_ORDERS_PER_TASKER: 3,
```

#### Notification Types (Line 265)
**Current:**
```typescript
DRIVER_ASSIGNMENT: 'driver_assignment',
```

**Should Be:**
```typescript
TASKER_ASSIGNMENT: 'tasker_assignment',
```

#### Role Colors (Line 282)
**Current:**
```typescript
DRIVER: '#34C759',
```

**Should Be:**
```typescript
TASKER: '#34C759',
```

#### Feature Flags (Line 305)
**Current:**
```typescript
ENABLE_DRIVER_TIPS: true,
```

**Should Be:**
```typescript
ENABLE_TASKER_TIPS: true,
```

---

## Navigation & Routing References

### Route Names
- `/(tasker)/DriverDashboard` → `/(tasker)/TaskerDashboard`
- `/(tasker)/DriverHome` → `/(tasker)/TaskerHome` (already deleted)
- `/(auth)/DriverOnboarding` → `/(auth)/TaskerOnboarding`

### Entry Points Already Updated ✅
- `app/Home.tsx` - Uses `USER_ROLES.DRIVER` (needs to change to `USER_ROLES.TASKER`)
- `src/navigation/RoleBasedNavigator.tsx` - Routes to `/(tasker)/(tabs)` ✅

---

## When "Driver" IS Appropriate

The term "driver" should **only** be used in these specific contexts:

### 1. Tasker Type/Category
```typescript
// ✅ CORRECT - Referring to driver TYPE of tasker
interface Tasker {
  type: 'driver' | 'rider' | 'biker';  // Specific tasker type
  vehicle: 'motorcycle' | 'car' | 'bicycle';
}
```

### 2. Vehicle-Specific References
```typescript
// ✅ CORRECT - Driver's license is a document type
kyc: {
  driversLicense: string;
  vehicleRegistration: string;
}
```

### 3. UI Labels for Driver-Type Taskers
```typescript
// ✅ CORRECT - Showing tasker type to user
"Register as a Driver"  // When specifically becoming a driver-type tasker
"Driver Details"        // When viewing driver-specific info
```

---

## Impact Analysis

### HIGH IMPACT (Breaking Changes)
1. **USER_ROLES.DRIVER → USER_ROLES.TASKER**
   - Affects: Authentication, role checking, route protection
   - Risk: May break if backend expects 'driver'
   - **ACTION REQUIRED**: Check backend API contract

2. **File Renames**
   - Affects: All imports throughout codebase
   - Risk: Build will fail if any import not updated
   - **ACTION REQUIRED**: Careful find-and-replace

### MEDIUM IMPACT
3. **Storage Keys**
   - Affects: Persisted data in AsyncStorage
   - Risk: Existing users lose their driver status/location
   - **MITIGATION**: Need migration script or backward compatibility

4. **State Management**
   - Affects: Redux/Zustand store
   - Risk: State shape changes break existing code
   - **ACTION REQUIRED**: Update all selectors

### LOW IMPACT
5. **Constants & Configuration**
   - Affects: Business logic constants
   - Risk: Low - mostly internal
   - **ACTION REQUIRED**: Simple find-replace

---

## Recommended Phased Approach

### Phase A: Verify Backend Contract (CRITICAL FIRST STEP)
**Before any renaming:**
1. Check backend API documentation
2. Verify what role value backend expects: `'driver'` or `'tasker'`?
3. Check if backend endpoints use `/driver/` or `/tasker/`

**If backend uses 'driver':**
- Keep `USER_ROLES.DRIVER: 'driver'` for API compatibility
- Rename UI/file names to "tasker" for clarity
- Add type alias: `type TaskerRole = 'driver';`

**If backend uses 'tasker':**
- Full rename including USER_ROLES

### Phase B: File Renaming (Once Phase A complete)
**Order of operations:**
1. Rename state slice first (`driverSlice.ts` → `taskerSlice.ts`)
2. Update imports of state slice
3. Rename screens directory (`screens/driver/` → `screens/tasker/`)
4. Rename individual screen files
5. Update all imports
6. Rename app directory files
7. Update route references

### Phase C: Constants Update
1. Update constants.ts
2. Add migration for AsyncStorage keys (if needed)
3. Update all constant usages

### Phase D: Testing & Verification
1. TypeScript compilation
2. Search for remaining "driver" references
3. Manual testing of tasker flows
4. Verify no broken imports

---

## Migration Script Needed?

**AsyncStorage Migration:**
```typescript
// If we rename storage keys, need migration
async function migrateDriverToTasker() {
  const driverStatus = await AsyncStorage.getItem('@ntumai_driver_status');
  if (driverStatus) {
    await AsyncStorage.setItem('@ntumai_tasker_status', driverStatus);
    await AsyncStorage.removeItem('@ntumai_driver_status');
  }
  // Repeat for other keys
}
```

---

## Search Patterns for Manual Verification

After automated renaming, manually search for:

```bash
# Find remaining "driver" references (case-insensitive)
grep -ri "driver" app/ src/ screens/ --exclude-dir=node_modules

# Check for imports
grep -r "import.*Driver" app/ src/

# Check for route references
grep -r "/(tasker)/Driver" app/ src/

# Check for USER_ROLES.DRIVER
grep -r "USER_ROLES.DRIVER" app/ src/
```

---

## Decision Points

### ⚠️ CRITICAL DECISIONS NEEDED:

1. **What does the backend API use?**
   - [ ] Backend uses 'driver' role
   - [ ] Backend uses 'tasker' role
   - [ ] Need to check API docs

2. **Do we migrate AsyncStorage keys?**
   - [ ] Yes - create migration script
   - [ ] No - keep old keys for backward compatibility
   - [ ] Hybrid - support both during transition

3. **When to do this migration?**
   - [ ] Now (during Phase 1 cleanup)
   - [ ] After Phase 1 testing
   - [ ] Separate phase after full migration complete

4. **Scope of renaming?**
   - [ ] Full rename (files + constants + API)
   - [ ] UI/files only (keep API as 'driver')
   - [ ] Gradual (rename in phases)

---

## Estimated Effort

**If backend uses 'tasker':** 4-6 hours
- File renaming: 2 hours
- Import updates: 1 hour
- Constants update: 1 hour
- Testing: 2 hours

**If backend uses 'driver':** 2-3 hours
- File renaming only: 1.5 hours
- Import updates: 1 hour
- Testing: 0.5 hours

---

## Next Steps

1. **STOP** - Do not proceed with renaming yet
2. **CHECK** - Verify backend API contract for role naming
3. **DECIDE** - Choose migration approach based on backend
4. **PLAN** - Create detailed rename script/checklist
5. **EXECUTE** - Systematic renaming with testing
6. **VERIFY** - Comprehensive search for missed references

---

**Status:** 🔴 **PENDING DECISION**
**Blocker:** Need to verify backend API contract
**Priority:** HIGH (affects code clarity and blueprint alignment)
**Risk:** HIGH (breaking changes if done incorrectly)
