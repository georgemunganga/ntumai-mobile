# Driver → Tasker Renaming Instructions

## ✅ Completed (Automated)

### Constants Updated
- ✅ `USER_ROLES.DRIVER` → `USER_ROLES.TASKER` in [src/utils/constants.ts:256](src/utils/constants.ts#L256)
- ✅ Storage keys: `DRIVER_*` → `TASKER_*` (lines 41-43)
- ✅ Business constants: `DRIVER_COMMISSION_RATE` → `TASKER_COMMISSION_RATE` (lines 138-140)
- ✅ Notification types: `DRIVER_ASSIGNMENT` → `TASKER_ASSIGNMENT` (line 265)
- ✅ Map colors: `DRIVER` → `TASKER` (line 282)
- ✅ Feature flags: `ENABLE_DRIVER_TIPS` → `ENABLE_TASKER_TIPS` (line 305)

### Navigation and Types Updated
- ✅ [app/Home.tsx:7](app/Home.tsx#L7) - Changed `USER_ROLES.DRIVER` to `USER_ROLES.TASKER`
- ✅ [app/(tasker)/_layout.tsx:7](app/(tasker)/_layout.tsx#L7) - Changed `USER_ROLES.DRIVER` to `USER_ROLES.TASKER` in AuthGuard
- ✅ [src/store/types.ts:9](src/store/types.ts#L9) - Changed User role type from `'driver'` to `'tasker'`
- ✅ [src/providers/AuthProvider.tsx:29](src/providers/AuthProvider.tsx#L29) - Updated API role mapping: `'delivery_driver'` → `'tasker'` (internal)

---

## ⚠️ Manual Steps Required (Windows Permission Issues)

Due to Windows file system permission restrictions, you need to manually rename the following files and directories:

### Step 1: Rename screens/driver Directory
```
screens/driver/ → screens/tasker/
```

**How to do it:**
1. In File Explorer, navigate to `screens/`
2. Right-click `driver` folder
3. Select "Rename"
4. Type `tasker`
5. Press Enter

### Step 2: Rename Files in screens/tasker/
Once the directory is renamed, rename these files:

| Old Name | New Name |
|----------|----------|
| `DriverDashboard.tsx` | `TaskerDashboard.tsx` |
| `DriverEarnings.tsx` | `TaskerEarnings.tsx` |
| `DriverOrders.tsx` | `TaskerOrders.tsx` |
| `DriverProfile.tsx` | `TaskerProfile.tsx` |
| `DriverRoutes.tsx` | `TaskerRoutes.tsx` |
| `DriverSetting.tsx` | `TaskerSetting.tsx` |

### Step 3: Update screens/tasker/index.ts
After renaming, update the index file:

**File:** `screens/tasker/index.ts`

**Change from:**
```typescript
// Driver Screen Components
// DriverHome removed - migrated to Expo Router tabs at app/(tasker)/(tabs)/
export { default as DriverDashboard } from './DriverDashboard';
export { default as DriverOrders } from './DriverOrders';
export { default as DriverRoutes } from './DriverRoutes';
export { default as DriverEarnings } from './DriverEarnings';
export { default as DriverProfile } from './DriverProfile';
```

**Change to:**
```typescript
// Tasker Screen Components
// Note: TaskerHome was removed - migrated to Expo Router tabs at app/(tasker)/(tabs)/
export { default as TaskerDashboard } from './TaskerDashboard';
export { default as TaskerOrders } from './TaskerOrders';
export { default as TaskerRoutes } from './TaskerRoutes';
export { default as TaskerEarnings } from './TaskerEarnings';
export { default as TaskerProfile } from './TaskerProfile';
```

### Step 4: Rename Files in app/(tasker)/
Navigate to `app/(tasker)/` and rename:

| Old Name | New Name |
|----------|----------|
| `DriverDashboard.tsx` | `TaskerDashboard.tsx` |
| `DriverEarnings.tsx` | `TaskerEarnings.tsx` |
| `DriverOrders.tsx` | `TaskerOrders.tsx` |
| `DriverProfile.tsx` | `TaskerProfile.tsx` |
| `DriverRoutes.tsx` | `TaskerRoutes.tsx` |
| `DriverSetting.tsx` | `TaskerSetting.tsx` |

### Step 5: Rename File in app/(auth)/
Navigate to `app/(auth)/` and rename:

| Old Name | New Name |
|----------|----------|
| `DriverOnboarding.tsx` | `TaskerOnboarding.tsx` |

### Step 6: Rename Store Slice File
Navigate to `src/store/slices/` and rename:

| Old Name | New Name |
|----------|----------|
| `driverSlice.ts` | `taskerSlice.ts` |

**CRITICAL**: After renaming this file, update the export in `src/store/index.ts`:

**Change from:**
```typescript
export { useDriverStore } from './slices/driverSlice';
```

**Change to:**
```typescript
export { useTaskerStore } from './slices/taskerSlice';
```

### Step 7: Update Import Statements in Wrapper Files

**IMPORTANT**: These wrapper files currently import from `screens/driver/` which will break after Step 1. Update them to import from `screens/tasker/`:

**Files to update:**
- `app/(tasker)/DriverEarnings.tsx` → Change import path to `@/screens/tasker/TaskerEarnings`
- `app/(tasker)/DriverOrders.tsx` → Change import path to `@/screens/tasker/TaskerOrders`
- `app/(tasker)/DriverProfile.tsx` → Change import path to `@/screens/tasker/TaskerProfile`
- `app/(tasker)/DriverRoutes.tsx` → Change import path to `@/screens/tasker/TaskerRoutes`
- `app/(tasker)/DriverSetting.tsx` → Change import path to `@/screens/tasker/TaskerSetting`
- `app/(tasker)/OrderDeliveryFirstStep.tsx` → Change import path to `@/screens/tasker/deliveries/OrderDeliveryFirstStep`
- `app/(tasker)/OrderDeliverySecondStep.tsx` → Change import path to `@/screens/tasker/deliveries/OrderDeliverySecondStep`
- `app/(tasker)/OrderDeliveryLastStep.tsx` → Change import path to `@/screens/tasker/deliveries/OrderDeliveryLastStep`

### Step 8: Update All useDriverStore References

**Files using `useDriverStore` (needs to change to `useTaskerStore`):**
- `app/(tasker)/EarningsScreen.tsx`
- `app/(tasker)/AvailableJobsScreen.tsx`
- `app/(tasker)/DriverDashboard.tsx` (will be renamed to TaskerDashboard.tsx)
- `app/(tasker)/JobDetailScreen.tsx`
- `src/store/slices/driverSlice.ts` (will be renamed to taskerSlice.ts - update internally)

**Search and replace:**
- Find: `useDriverStore`
- Replace with: `useTaskerStore`

### Step 9: Update Import Statements

After renaming all files, search for and update imports:

**Search for:** `from.*screens/driver`
**Replace with:** `from '@/screens/tasker'` (or appropriate path)

**Search for:** `Driver` (in import statements)
**Evaluate each and replace with:** `Tasker` (where appropriate)

### Step 10: Update Component Names Inside Files

Some files may export components with "Driver" in the name. Update these:

**Example in renamed files:**
```typescript
// OLD:
export default function DriverDashboard() {

// NEW:
export default function TaskerDashboard() {
```

**Files likely needing internal updates:**
- All renamed screen files (check function names, comments)
- `src/store/slices/taskerSlice.ts` - Update internal interface names and comments

### Step 11: Check for Remaining Driver References

After all renames, run these searches:

```bash
# In VS Code or your editor, search:
1. "Driver" (case-sensitive) - check each result
2. "driver" (case-sensitive) - check each result
3. Import statements containing "Driver"
4. Route paths containing "Driver"
```

**Acceptable "driver" references:**
- ✅ `driversLicense` - document type (keep as-is)
- ✅ `type: 'driver'` - when referring to tasker type (keep as-is)
- ✅ Comments explaining driver vs rider types (keep as-is)
- ✅ UI labels like "Register as Driver" for driver-type taskers (context-dependent)

**Unacceptable "Driver" references:**
- ❌ `DriverDashboard` component names
- ❌ `screens/driver/` paths
- ❌ `USER_ROLES.DRIVER` constant usage
- ❌ `/Driver` in route paths

---

## After Renaming Checklist

- [ ] **Step 1:** `screens/driver/` directory renamed to `screens/tasker/`
- [ ] **Step 2:** All 6 files in `screens/tasker/` renamed (Driver* → Tasker*)
- [ ] **Step 3:** `screens/tasker/index.ts` exports updated
- [ ] **Step 4:** All 6 files in `app/(tasker)/` renamed (Driver* → Tasker*)
- [ ] **Step 5:** `app/(auth)/DriverOnboarding.tsx` renamed to `TaskerOnboarding.tsx`
- [ ] **Step 6:** `src/store/slices/driverSlice.ts` renamed to `taskerSlice.ts`
- [ ] **Step 6:** `src/store/index.ts` export updated (`useDriverStore` → `useTaskerStore`)
- [ ] **Step 7:** All 8 wrapper file imports updated (`screens/driver` → `screens/tasker`)
- [ ] **Step 8:** All `useDriverStore` references changed to `useTaskerStore` (5 files)
- [ ] **Step 9:** All other imports verified and updated
- [ ] **Step 10:** Component function names updated inside files
- [ ] **Step 11:** Search completed for remaining "Driver" references
- [ ] No `USER_ROLES.DRIVER` references (should be `USER_ROLES.TASKER`)
- [ ] App builds without errors: `npm start`
- [ ] TypeScript compiles: Run build check

---

## Expected File Structure After Completion

```
screens/
└── tasker/  ← Renamed from driver
    ├── index.ts  ← Exports updated (Driver* → Tasker*)
    ├── TaskerDashboard.tsx  ← Renamed
    ├── TaskerEarnings.tsx  ← Renamed
    ├── TaskerOrders.tsx  ← Renamed
    ├── TaskerProfile.tsx  ← Renamed
    ├── TaskerRoutes.tsx  ← Renamed
    ├── TaskerSetting.tsx  ← Renamed
    └── deliveries/
        ├── OrderDeliveryFirstStep.tsx
        ├── OrderDeliverySecondStep.tsx
        └── OrderDeliveryLastStep.tsx

app/
├── (auth)/
│   └── TaskerOnboarding.tsx  ← Renamed from DriverOnboarding
│
└── (tasker)/
    ├── (tabs)/  ← Already migrated in Phase 1
    ├── _layout.tsx  ← Updated to use USER_ROLES.TASKER
    ├── TaskerDashboard.tsx  ← Renamed (wrapper)
    ├── TaskerEarnings.tsx  ← Renamed (wrapper)
    ├── TaskerOrders.tsx  ← Renamed (wrapper)
    ├── TaskerProfile.tsx  ← Renamed (wrapper)
    ├── TaskerRoutes.tsx  ← Renamed (wrapper)
    ├── TaskerSetting.tsx  ← Renamed (wrapper)
    ├── EarningsScreen.tsx  ← Updated to use useTaskerStore
    ├── AvailableJobsScreen.tsx  ← Updated to use useTaskerStore
    ├── JobDetailScreen.tsx  ← Updated to use useTaskerStore
    └── ... other files

src/
├── store/
│   ├── index.ts  ← Updated: useDriverStore → useTaskerStore
│   ├── types.ts  ← Updated: role type 'driver' → 'tasker'
│   └── slices/
│       └── taskerSlice.ts  ← Renamed from driverSlice.ts
│
├── providers/
│   └── AuthProvider.tsx  ← Updated: API mapping 'delivery_driver' → 'tasker'
│
└── utils/
    └── constants.ts  ← Updated: USER_ROLES.DRIVER → USER_ROLES.TASKER
```

---

## Verification Steps

After completing all manual renames:

1. **Build Check:**
   ```bash
   npm start
   ```
   - Should start without errors
   - No import errors

2. **Search Verification:**
   - Search for `USER_ROLES.DRIVER` → Should find ZERO results (except in this doc)
   - Search for `screens/driver` → Should find ZERO results
   - Search for `DriverDashboard` → Should find ZERO results (except in documentation)

3. **Test Navigation:**
   - Login as tasker
   - Verify tabs work
   - Verify navigation to tasker screens works
   - No console errors

---

## Estimated Time

**Manual file renaming:** 10-15 minutes
**Import updates:** 5-10 minutes
**Verification:** 5 minutes

**Total:** ~20-30 minutes

---

## If You Get Stuck

**Common Issues:**

1. **"Cannot find module" errors after renaming**
   - Check all import paths are updated
   - Restart dev server

2. **TypeScript errors about missing exports**
   - Check `screens/tasker/index.ts` is updated
   - Verify component names match exports

3. **Navigation doesn't work**
   - Check `USER_ROLES.TASKER` is used (not `USER_ROLES.DRIVER`)
   - Verify role-based routing in `app/Home.tsx`

---

**Status:** 🟡 **PARTIALLY COMPLETE** - Constants and types updated, manual file renaming needed
**What's Done:** Constants, USER_ROLES, type definitions, API mapping, AuthGuard
**What's Needed:** File/directory renaming (Steps 1-11), import path updates, useDriverStore → useTaskerStore
**Next Step:** Follow Steps 1-11 above to complete all manual renaming tasks
**After Completion:** Run verification steps and test

---

## Quick Summary for User

**What I've already done (automated):**
✅ Updated all constants from DRIVER → TASKER
✅ Changed User role type from 'driver' to 'tasker'
✅ Updated API role mapping (backend 'delivery_driver' → internal 'tasker')
✅ Fixed AuthGuard to use USER_ROLES.TASKER
✅ Updated navigation routing

**What you need to do (manual - Windows permissions):**
1. Rename `screens/driver/` folder to `screens/tasker/`
2. Rename 6 screen files (Driver* → Tasker*) in `screens/tasker/`
3. Rename 6 wrapper files in `app/(tasker)/`
4. Rename `app/(auth)/DriverOnboarding.tsx` to `TaskerOnboarding.tsx`
5. Rename `src/store/slices/driverSlice.ts` to `taskerSlice.ts`
6. Update imports and exports (detailed in steps above)
7. Change all `useDriverStore` to `useTaskerStore` (5 files)

**Estimated time:** 25-35 minutes for all steps
**Critical:** Follow the steps in order - renaming the directory first will break imports temporarily
