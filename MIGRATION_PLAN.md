# React Navigation to Expo Router Migration Plan

## Executive Summary

**Current Status:** ~70% Complete (Partial Migration)

The codebase has both React Navigation and Expo Router installed, creating a hybrid navigation architecture. While Expo Router is configured as the primary routing system with most screens migrated, **3 critical tab navigators** still use React Navigation, and **36 wrapper files** create unnecessary indirection.

---

## Critical Findings

### 🚨 High Priority Issues

1. **Tab Navigator Conflicts** - 3 files using `createBottomTabNavigator` nested inside Expo Router:
   - `screens/vendor/VendorTabs.tsx` (5 tabs)
   - `screens/home/HomeTabs.tsx` (3 tabs)
   - `screens/driver/DriverHome.tsx` (5 tabs)

2. **36 Wrapper Files** - Unnecessary indirection pattern:
   ```tsx
   // app/(vendor)/CreateBrand.tsx
   import CreateBrand from '@/screens/CreateBrand';
   export default function CreateBrandRoute(props: any) {
     return <CreateBrand {...props} />;
   }
   ```

3. **Mixed Navigation Hooks** - Both systems used:
   - `useNavigation()` from `@react-navigation/native` (5 files in screens/)
   - `useRouter()` from `expo-router` (45+ files in app/)

4. **Duplicate Dependencies** - Both installed:
   ```json
   "@react-navigation/bottom-tabs": "^7.4.0",
   "@react-navigation/native": "^7.1.8",
   "@react-navigation/native-stack": "^7.3.16",
   "expo-router": "6.0.17"
   ```

---

## Migration Audit Results

### ✅ Completed (Working Correctly)

- **Entry Point**: `app/_layout.tsx` uses Expo Router Stack ✓
- **Route Groups**: All layout files (`(auth)`, `(customer)`, `(tasker)`, `(vendor)`) use Expo Router ✓
- **45+ Screens**: Fully implemented directly in `app/` with Expo Router ✓
- **Navigation Helpers**: `src/navigation/NavigationHelpers.ts` uses `useRouter()` ✓
- **Role-Based Router**: `src/navigation/RoleBasedNavigator.tsx` uses Expo Router ✓

### ⚠️ Partially Migrated (Needs Work)

- **36 Wrapper Files**: Re-export from `screens/` directory
- **3 Tab Navigators**: Still using React Navigation inside Expo Router
- **1 Screen**: `app/(shared)/ChatScreen.tsx` uses `useRoute()` from React Navigation
- **Legacy Hooks**: `src/hooks/useNavigation.ts` (393 lines) wraps React Navigation
- **Legacy Types**: `src/types/navigation.ts` defines React Navigation types

### ❌ Not Started

- Removal of React Navigation dependencies
- Cleanup of `screens/` directory
- Migration of tab navigators to Expo Router Tabs

---

## Detailed File Inventory

### Wrapper Files (36 total)

#### Auth Wrappers (7 files)
| App File | Imports From | Status |
|----------|-------------|---------|
| `app/(auth)/Splash.tsx` | `screens/SplashScreen.tsx` | Wrapper |
| `app/(auth)/Login.tsx` | `screens/LoginScreen.tsx` | Wrapper |
| `app/(auth)/Onboarding.tsx` | `screens/OnboardingScreen.tsx` | Wrapper |
| `app/(auth)/Otp.tsx` | `screens/OtpInputScreen.tsx` | Wrapper |
| `app/(auth)/SelectMethod.tsx` | `screens/SelectMethodScreen.tsx` | Wrapper |
| `app/(auth)/ContinueBoarding.tsx` | `screens/ContinueBoarding.tsx` | Wrapper |
| `app/(auth)/ContinueSignUp.tsx` | `screens/ContinueSignUpScreen.tsx` | Wrapper |

#### Vendor Wrappers (10 files)
| App File | Imports From | Status | React Nav? |
|----------|-------------|---------|-----------|
| `app/(vendor)/VendorTabs.tsx` | `screens/vendor/VendorTabs.tsx` | Wrapper | ⚠️ YES |
| `app/(vendor)/VendorProducts.tsx` | `screens/vendor/VendorProducts.tsx` | Wrapper | No |
| `app/(vendor)/VendorProfile.tsx` | `screens/vendor/VendorProfile.tsx` | Wrapper | No |
| `app/(vendor)/VendorReports.tsx` | `screens/vendor/VendorReports.tsx` | Wrapper | No |
| `app/(vendor)/VendorNotifications.tsx` | `screens/vendor/VendorNotifications.tsx` | Wrapper | No |
| `app/(vendor)/CreateBrand.tsx` | `screens/CreateBrand.tsx` | Wrapper | No |
| `app/(vendor)/CreateCategory.tsx` | `screens/CreateCategory.tsx` | Wrapper | No |
| `app/(vendor)/CreatePromotion.tsx` | `screens/CreatePromotion.tsx` | Wrapper | No |
| `app/(vendor)/PreviewPromotion.tsx` | `screens/PreviewPromotion.tsx` | Wrapper | No |
| `app/(vendor)/ProductScreen.tsx` | `screens/home/EditProductScreen.tsx` | Wrapper | No |

#### Tasker/Driver Wrappers (9 files)
| App File | Imports From | Status | React Nav? |
|----------|-------------|---------|-----------|
| `app/(tasker)/DriverHome.tsx` | `screens/driver/DriverHome.tsx` | Wrapper | ⚠️ YES |
| `app/(tasker)/DriverOrders.tsx` | `screens/driver/DriverOrders.tsx` | Wrapper | No |
| `app/(tasker)/DriverRoutes.tsx` | `screens/driver/DriverRoutes.tsx` | Wrapper | No |
| `app/(tasker)/DriverEarnings.tsx` | `screens/driver/DriverEarnings.tsx` | Wrapper | No |
| `app/(tasker)/DriverProfile.tsx` | `screens/driver/DriverProfile.tsx` | Wrapper | No |
| `app/(tasker)/DriverSetting.tsx` | `screens/driver/DriverSetting.tsx` | Wrapper | No |
| `app/(tasker)/OrderDeliveryFirstStep.tsx` | `screens/driver/deliveries/...` | Wrapper | No |
| `app/(tasker)/OrderDeliverySecondStep.tsx` | `screens/driver/deliveries/...` | Wrapper | No |
| `app/(tasker)/OrderDeliveryLastStep.tsx` | `screens/driver/deliveries/...` | Wrapper | No |

#### Customer Wrappers (10 files)
| App File | Imports From | Status | React Nav? |
|----------|-------------|---------|-----------|
| `app/(customer)/Home.tsx` | N/A (fully migrated) | ✓ Migrated | No |
| `app/(customer)/Checkout.tsx` | `screens/checkout/CheckoutScreen.tsx` | Wrapper | ⚠️ YES |
| `app/(customer)/AddLocation.tsx` | `screens/checkout/steps/AddLocation.tsx` | Wrapper | No |
| `app/(customer)/OrderTracking.tsx` | `screens/checkout/steps/OrderTrackingScreen.tsx` | Wrapper | ⚠️ YES |
| `app/(customer)/RateOrder.tsx` | `screens/checkout/steps/RateOrderScreen.tsx` | Wrapper | ⚠️ YES |
| `app/(customer)/Profile.tsx` | `screens/home/ProfileScreen.tsx` | Wrapper | No |

### React Navigation Tab Navigators (3 files - CRITICAL)

#### 1. Vendor Tabs
**File**: `screens/vendor/VendorTabs.tsx`
```tsx
const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="VendorDashboard" component={VendorDashboard} />
  <Tab.Screen name="VendorProducts" component={VendorProducts} />
  <Tab.Screen name="VendorReports" component={VendorReports} />
  <Tab.Screen name="VendorNotifications" component={VendorNotifications} />
  <Tab.Screen name="VendorProfile" component={VendorProfile} />
</Tab.Navigator>
```
**Replacement**: Create `app/(vendor)/(tabs)/_layout.tsx`

#### 2. Driver/Tasker Tabs
**File**: `screens/driver/DriverHome.tsx`
```tsx
const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="DriverDashboard" component={DriverDashboard} />
  <Tab.Screen name="DriverOrders" component={DriverOrders} />
  <Tab.Screen name="DriverRoutes" component={DriverRoutes} />
  <Tab.Screen name="DriverEarnings" component={DriverEarnings} />
  <Tab.Screen name="DriverSetting" component={DriverSetting} />
</Tab.Navigator>
```
**Replacement**: Create `app/(tasker)/(tabs)/_layout.tsx`

#### 3. Customer Home Tabs
**File**: `screens/home/HomeTabs.tsx`
```tsx
const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```
**Replacement**: Create `app/(customer)/(tabs)/_layout.tsx`

### Files Using React Navigation Hooks

| File | Hook Used | Impact |
|------|-----------|---------|
| `app/(shared)/ChatScreen.tsx` | `useRoute()` | Get route params |
| `screens/checkout/CheckoutScreen.tsx` | `useNavigation()` | Navigate to screens |
| `screens/checkout/steps/OrderTrackingScreen.tsx` | `useNavigation()` | Navigate to screens |
| `screens/checkout/steps/RateOrderScreen.tsx` | `useNavigation()` | Navigate to screens |
| `screens/home/MarketplaceScreen.tsx` | `useNavigation()` | Navigate to screens |

### Legacy Infrastructure Files

| File | Lines | Purpose | Status |
|------|-------|---------|---------|
| `src/hooks/useNavigation.ts` | 393 | React Nav compatibility layer | ❌ Delete |
| `src/types/navigation.ts` | 43 | React Nav type definitions | ❌ Delete |
| `screens/PlaceholderHome.tsx` | ~50 | Unused placeholder | ❌ Delete |
| `screens/vendor/VendorHeader.tsx` | ~30 | Component (not a screen) | ↔️ Move to components |

---

## Migration Plan - Phased Approach

### Phase 1: Convert Tab Navigators (HIGH PRIORITY) 🔴

**Goal**: Replace React Navigation tab navigators with Expo Router Tabs

**Estimated Time**: 4-6 hours

#### Step 1.1: Vendor Tabs
- [ ] Create `app/(vendor)/(tabs)/_layout.tsx` with Expo Router Tabs
- [ ] Move tab screen files to `app/(vendor)/(tabs)/` directory:
  - [ ] `dashboard.tsx` (from VendorDashboard)
  - [ ] `products.tsx` (from VendorProducts)
  - [ ] `reports.tsx` (from VendorReports)
  - [ ] `notifications.tsx` (from VendorNotifications)
  - [ ] `profile.tsx` (from VendorProfile)
- [ ] Update `app/(vendor)/VendorDashboard.tsx` to redirect to `/(vendor)/(tabs)/dashboard`
- [ ] Delete `screens/vendor/VendorTabs.tsx`
- [ ] Delete wrapper `app/(vendor)/VendorTabs.tsx`

#### Step 1.2: Driver/Tasker Tabs
- [ ] Create `app/(tasker)/(tabs)/_layout.tsx` with Expo Router Tabs
- [ ] Move tab screen files to `app/(tasker)/(tabs)/` directory:
  - [ ] `dashboard.tsx` (from DriverDashboard)
  - [ ] `orders.tsx` (from DriverOrders)
  - [ ] `routes.tsx` (from DriverRoutes)
  - [ ] `earnings.tsx` (from DriverEarnings)
  - [ ] `settings.tsx` (from DriverSetting)
- [ ] Update `app/(tasker)/DriverDashboard.tsx` to redirect to `/(tasker)/(tabs)/dashboard`
- [ ] Delete `screens/driver/DriverHome.tsx`
- [ ] Delete wrapper `app/(tasker)/DriverHome.tsx`

#### Step 1.3: Customer Home Tabs
- [ ] Create `app/(customer)/(tabs)/_layout.tsx` with Expo Router Tabs
- [ ] Move tab screen files to `app/(customer)/(tabs)/` directory:
  - [ ] `index.tsx` (from Home - main tab)
  - [ ] `marketplace.tsx` (from Marketplace)
  - [ ] `profile.tsx` (from Profile)
- [ ] Update `app/(customer)/Home.tsx` to redirect to `/(customer)/(tabs)`
- [ ] Delete `screens/home/HomeTabs.tsx`

**Deliverables**:
- 3 new `_layout.tsx` files with Expo Router Tabs
- 13 tab screens moved/created
- 3 React Navigation tab navigator files deleted
- Tab navigation fully on Expo Router

---

### Phase 2: Fix ChatScreen and Other Hooks (MEDIUM PRIORITY) 🟡

**Goal**: Replace all React Navigation hooks with Expo Router equivalents

**Estimated Time**: 2-3 hours

#### Step 2.1: Fix ChatScreen
- [ ] Open `app/(shared)/ChatScreen.tsx`
- [ ] Replace:
  ```tsx
  import { useRoute } from '@react-navigation/native';
  const route = useRoute();
  const params = route.params;
  ```
  With:
  ```tsx
  import { useLocalSearchParams } from 'expo-router';
  const params = useLocalSearchParams();
  ```
- [ ] Test chat functionality

#### Step 2.2: Update screens/ files using React Nav hooks
Since these will be removed in Phase 3, we can either:
- **Option A**: Skip (will be deleted anyway)
- **Option B**: Update now for safety

**Recommendation**: Option A (skip, delete in Phase 3)

**Deliverables**:
- ChatScreen using Expo Router params
- No React Navigation hooks in `app/` directory

---

### Phase 3: Remove Wrapper Files (MEDIUM PRIORITY) 🟡

**Goal**: Move screen implementations from `screens/` to `app/`, delete wrappers

**Estimated Time**: 6-8 hours

#### Step 3.1: Auth Screens (7 files)
For each wrapper:
1. Open `screens/[ScreenName].tsx`
2. Copy implementation to `app/(auth)/[ScreenName].tsx` (replacing wrapper)
3. Update imports to use Expo Router (`useRouter` instead of `useNavigation`)
4. Delete original `screens/[ScreenName].tsx`
5. Test functionality

- [ ] `app/(auth)/Splash.tsx` ← `screens/SplashScreen.tsx`
- [ ] `app/(auth)/Login.tsx` ← `screens/LoginScreen.tsx`
- [ ] `app/(auth)/Onboarding.tsx` ← `screens/OnboardingScreen.tsx`
- [ ] `app/(auth)/Otp.tsx` ← `screens/OtpInputScreen.tsx`
- [ ] `app/(auth)/SelectMethod.tsx` ← `screens/SelectMethodScreen.tsx`
- [ ] `app/(auth)/ContinueBoarding.tsx` ← `screens/ContinueBoarding.tsx`
- [ ] `app/(auth)/ContinueSignUp.tsx` ← `screens/ContinueSignUpScreen.tsx`

#### Step 3.2: Vendor Screens (10 files)
- [ ] `app/(vendor)/VendorProducts.tsx` ← `screens/vendor/VendorProducts.tsx`
- [ ] `app/(vendor)/VendorProfile.tsx` ← `screens/vendor/VendorProfile.tsx`
- [ ] `app/(vendor)/VendorReports.tsx` ← `screens/vendor/VendorReports.tsx`
- [ ] `app/(vendor)/VendorNotifications.tsx` ← `screens/vendor/VendorNotifications.tsx`
- [ ] `app/(vendor)/CreateBrand.tsx` ← `screens/CreateBrand.tsx`
- [ ] `app/(vendor)/CreateCategory.tsx` ← `screens/CreateCategory.tsx`
- [ ] `app/(vendor)/CreatePromotion.tsx` ← `screens/CreatePromotion.tsx`
- [ ] `app/(vendor)/PreviewPromotion.tsx` ← `screens/PreviewPromotion.tsx`
- [ ] `app/(vendor)/ProductScreen.tsx` ← `screens/home/EditProductScreen.tsx`
- [ ] `app/(vendor)/EditProduct.tsx` ← Update to not duplicate ProductScreen

#### Step 3.3: Tasker/Driver Screens (9 files)
- [ ] `app/(tasker)/DriverOrders.tsx` ← `screens/driver/DriverOrders.tsx`
- [ ] `app/(tasker)/DriverRoutes.tsx` ← `screens/driver/DriverRoutes.tsx`
- [ ] `app/(tasker)/DriverEarnings.tsx` ← `screens/driver/DriverEarnings.tsx`
- [ ] `app/(tasker)/DriverProfile.tsx` ← `screens/driver/DriverProfile.tsx`
- [ ] `app/(tasker)/DriverSetting.tsx` ← `screens/driver/DriverSetting.tsx`
- [ ] `app/(tasker)/OrderDeliveryFirstStep.tsx` ← `screens/driver/deliveries/OrderDeliveryFirstStep.tsx`
- [ ] `app/(tasker)/OrderDeliverySecondStep.tsx` ← `screens/driver/deliveries/OrderDeliverySecondStep.tsx`
- [ ] `app/(tasker)/OrderDeliveryLastStep.tsx` ← `screens/driver/deliveries/OrderDeliveryLastStep.tsx`

#### Step 3.4: Customer Screens (10 files)
- [ ] `app/(customer)/Checkout.tsx` ← `screens/checkout/CheckoutScreen.tsx`
- [ ] `app/(customer)/AddLocation.tsx` ← `screens/checkout/steps/AddLocation.tsx`
- [ ] `app/(customer)/OrderTracking.tsx` ← `screens/checkout/steps/OrderTrackingScreen.tsx`
- [ ] `app/(customer)/RateOrder.tsx` ← `screens/checkout/steps/RateOrderScreen.tsx`
- [ ] `app/(customer)/Profile.tsx` ← `screens/home/ProfileScreen.tsx`

**Deliverables**:
- 36 screens moved from `screens/` to `app/`
- All wrappers deleted
- `screens/` directory mostly empty

---

### Phase 4: Delete Legacy Infrastructure (LOW PRIORITY) 🟢

**Goal**: Remove all React Navigation-specific code and files

**Estimated Time**: 2-3 hours

#### Step 4.1: Delete Legacy Files
- [ ] Delete `src/hooks/useNavigation.ts` (393 lines)
- [ ] Delete `src/types/navigation.ts` (43 lines)
- [ ] Update `src/hooks/index.ts` to remove exports:
  ```tsx
  // Remove these exports:
  export * from './useNavigation';
  ```
- [ ] Delete `screens/PlaceholderHome.tsx`
- [ ] Move `screens/vendor/VendorHeader.tsx` to `src/components/vendor/VendorHeader.tsx`

#### Step 4.2: Clean Up Empty Directories
- [ ] Delete `screens/vendor/` (if empty)
- [ ] Delete `screens/driver/` (if empty)
- [ ] Delete `screens/checkout/` (if empty)
- [ ] Delete `screens/home/` (if empty)
- [ ] Delete `screens/` (if empty)

#### Step 4.3: Search for Remaining Imports
Run searches to ensure no files import deleted modules:
```bash
# Search for legacy navigation imports
grep -r "from '@react-navigation" app/ src/
grep -r "useNavigation" app/ src/ --exclude="NavigationHelpers.ts"
grep -r "navigation.navigate" app/ src/
grep -r "screens/" app/ src/
```

**Deliverables**:
- `screens/` directory deleted
- Legacy navigation files deleted
- No orphaned imports

---

### Phase 5: Remove React Navigation Dependencies (LOW PRIORITY) 🟢

**Goal**: Uninstall React Navigation packages

**Estimated Time**: 30 minutes

#### Step 5.1: Update package.json
Remove from dependencies:
```json
"@react-navigation/bottom-tabs": "^7.4.0",
"@react-navigation/native": "^7.1.8",
"@react-navigation/native-stack": "^7.3.16"
```

#### Step 5.2: Clean Install
```bash
npm uninstall @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack
npm install
```

#### Step 5.3: Verify Build
```bash
npm run android
npm run ios
npm run web
```

**Deliverables**:
- React Navigation packages removed
- Clean build with only Expo Router
- Reduced bundle size

---

### Phase 6: Testing and Validation (CRITICAL) 🔴

**Goal**: Ensure all navigation works correctly

**Estimated Time**: 4-6 hours

#### Step 6.1: Functional Testing

**Auth Flow:**
- [ ] App starts at Splash screen
- [ ] Splash navigates to Onboarding (new user) or Home (authenticated)
- [ ] Onboarding flow works
- [ ] Login with phone/email works
- [ ] OTP verification works
- [ ] Role selection works
- [ ] Driver onboarding works

**Customer Flow:**
- [ ] Customer tabs navigation works (Home, Marketplace, Profile)
- [ ] Navigate to vendor detail
- [ ] Add items to cart
- [ ] Checkout flow works
- [ ] Order tracking works
- [ ] Parcel sending works
- [ ] Task creation works
- [ ] Profile screens accessible
- [ ] Wallet screen works

**Vendor Flow:**
- [ ] Vendor tabs navigation works (Dashboard, Products, Reports, Notifications, Profile)
- [ ] Product management (create, edit, delete)
- [ ] Category management
- [ ] Promotion management
- [ ] Analytics screen
- [ ] Order management
- [ ] Profile screens accessible

**Tasker/Driver Flow:**
- [ ] Driver tabs navigation works (Dashboard, Orders, Routes, Earnings, Settings)
- [ ] Available jobs list
- [ ] Job acceptance
- [ ] Active delivery tracking
- [ ] Delivery steps (pickup, transit, delivery)
- [ ] Earnings screen
- [ ] Float top-up
- [ ] Profile screens accessible

**Shared Screens:**
- [ ] Profile editing
- [ ] Address management
- [ ] Payment methods
- [ ] Chat screen (with params)
- [ ] Wallet operations
- [ ] Help/Support
- [ ] Referral screen

#### Step 6.2: Deep Linking Testing
- [ ] Test deep links to orders
- [ ] Test deep links to deliveries
- [ ] Test deep links to jobs
- [ ] Verify `useDeepLinkHandler` works

#### Step 6.3: Navigation State Testing
- [ ] Back button navigation works correctly
- [ ] Tab switching preserves state
- [ ] Navigation params pass correctly
- [ ] Browser back/forward (web) works
- [ ] Android hardware back button works

#### Step 6.4: Role-Based Navigation
- [ ] Customer can't access vendor/driver screens
- [ ] Vendor can't access customer/driver screens
- [ ] Driver can't access customer/vendor screens
- [ ] Unauthenticated users redirected to auth
- [ ] Route protection works (`ProtectedRoute` component)

**Deliverables**:
- Comprehensive test report
- All flows working correctly
- No navigation errors
- Clean console (no warnings)

---

## Risk Assessment and Mitigation

### High Risk Areas

#### Risk 1: Tab Navigator State Loss
**Issue**: Converting React Navigation tabs to Expo Router may lose navigation state
**Mitigation**:
- Test thoroughly before deploying
- Consider state preservation with `initialRouteName`
- Document any behavior changes

#### Risk 2: Type Safety Breaks
**Issue**: Removing `src/types/navigation.ts` may break TypeScript
**Mitigation**:
- Run TypeScript check after each phase: `npx tsc --noEmit`
- Fix type errors immediately
- Use Expo Router's typed routes (if available)

#### Risk 3: Deep Linking Breaks
**Issue**: URL scheme changes may break existing deep links
**Mitigation**:
- Map old routes to new routes in `useDeepLinkHandler`
- Test all deep link scenarios
- Document URL changes for backend team

#### Risk 4: Third-Party Dependencies
**Issue**: Some libraries may expect React Navigation
**Mitigation**:
- Audit `package.json` for navigation-dependent packages
- Check library documentation for Expo Router support
- Create compatibility adapters if needed

### Medium Risk Areas

#### Risk 5: Bundle Size Regression
**Issue**: Temporary dual navigation increases bundle size
**Mitigation**:
- Complete migration quickly (minimize dual-system time)
- Monitor bundle size with `npx expo export:analyze`
- Verify reduction after React Navigation removal

#### Risk 6: Developer Confusion
**Issue**: Team members may use wrong navigation pattern
**Mitigation**:
- Document Expo Router patterns clearly
- Code review navigation changes
- Add ESLint rules to prevent React Navigation imports

### Low Risk Areas

#### Risk 7: Screen Wrapper Complexity
**Issue**: Moving screen code may introduce bugs
**Mitigation**:
- Move one screen at a time
- Test after each move
- Git commit after each successful migration

---

## Success Criteria

### Phase Completion Criteria

**Phase 1 Complete When**:
- [ ] All 3 tab navigators converted to Expo Router Tabs
- [ ] Tab navigation works identically to before
- [ ] No React Navigation tab navigators remain
- [ ] No console errors

**Phase 2 Complete When**:
- [ ] ChatScreen uses Expo Router params
- [ ] All `app/` files use Expo Router hooks only
- [ ] No `@react-navigation` imports in `app/` or `src/` (except legacy files scheduled for deletion)

**Phase 3 Complete When**:
- [ ] All 36 wrapper files deleted
- [ ] All screen implementations in `app/` directory
- [ ] `screens/` directory empty (except components to move)
- [ ] All screens function correctly

**Phase 4 Complete When**:
- [ ] `src/hooks/useNavigation.ts` deleted
- [ ] `src/types/navigation.ts` deleted
- [ ] `screens/` directory deleted
- [ ] No orphaned imports
- [ ] TypeScript compiles without errors

**Phase 5 Complete When**:
- [ ] React Navigation packages uninstalled
- [ ] `package.json` clean (only Expo Router)
- [ ] App builds successfully
- [ ] Bundle size reduced

**Phase 6 Complete When**:
- [ ] All test cases pass
- [ ] No navigation-related bugs
- [ ] All deep links work
- [ ] Role-based routing works
- [ ] Performance acceptable

### Overall Migration Complete When:
✅ All 6 phases complete
✅ Only Expo Router in codebase
✅ All screens in `app/` directory
✅ All navigation using `useRouter()`
✅ TypeScript compiles cleanly
✅ All tests pass
✅ No React Navigation dependencies
✅ Documentation updated

---

## Rollback Plan

### If Critical Issues Arise

**During Phase 1-2 (Tab Navigators)**:
1. Keep old React Navigation tab files
2. Revert wrapper changes
3. Document issues
4. Fix root cause before continuing

**During Phase 3 (Wrapper Removal)**:
1. Each screen move is a separate commit
2. Can revert individual screen migrations
3. Old `screens/` files remain until verified working

**During Phase 4-5 (Cleanup)**:
1. Git tag before deletion: `git tag pre-cleanup`
2. Can restore deleted files from git history
3. React Navigation packages can be reinstalled

**Nuclear Option**:
```bash
# Revert entire migration
git checkout <commit-before-migration-start>
git checkout -b migration-rollback
```

---

## Timeline Estimate

### Conservative Estimate (Safe Pace)
- **Phase 1**: 6 hours (tab navigators)
- **Phase 2**: 3 hours (hooks)
- **Phase 3**: 8 hours (wrappers)
- **Phase 4**: 3 hours (cleanup)
- **Phase 5**: 1 hour (dependencies)
- **Phase 6**: 6 hours (testing)

**Total**: ~27 hours (~3-4 working days)

### Aggressive Estimate (Fast Pace)
- **Phase 1**: 4 hours
- **Phase 2**: 2 hours
- **Phase 3**: 6 hours
- **Phase 4**: 2 hours
- **Phase 5**: 0.5 hours
- **Phase 6**: 4 hours

**Total**: ~18.5 hours (~2-3 working days)

### Recommended Approach
**Spread over 1 week** (1-2 hours per day):
- **Day 1**: Phase 1 (Vendor tabs)
- **Day 2**: Phase 1 (Driver tabs)
- **Day 3**: Phase 1 (Customer tabs) + Phase 2 (hooks)
- **Day 4**: Phase 3 (Auth + Vendor wrappers)
- **Day 5**: Phase 3 (Driver + Customer wrappers)
- **Day 6**: Phase 4 + Phase 5 (cleanup + uninstall)
- **Day 7**: Phase 6 (testing + validation)

---

## Post-Migration Actions

### Documentation Updates
- [ ] Update README.md with Expo Router navigation patterns
- [ ] Document tab navigation structure
- [ ] Document deep linking setup
- [ ] Update developer onboarding guide

### Code Quality
- [ ] Add ESLint rule to prevent React Navigation imports:
  ```json
  {
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["@react-navigation/*"]
      }
    ]
  }
  ```
- [ ] Add pre-commit hook to check for navigation patterns
- [ ] Update TypeScript config if needed

### Performance Monitoring
- [ ] Measure bundle size reduction
- [ ] Check app startup time
- [ ] Monitor navigation performance
- [ ] Compare before/after metrics

### Team Training
- [ ] Share Expo Router best practices
- [ ] Demo new navigation patterns
- [ ] Update coding standards
- [ ] Q&A session for team

---

## Resources and References

### Expo Router Documentation
- [Expo Router Introduction](https://docs.expo.dev/router/introduction/)
- [File-based Routing](https://docs.expo.dev/router/create-pages/)
- [Tabs Layout](https://docs.expo.dev/router/advanced/tabs/)
- [Navigation with useRouter](https://docs.expo.dev/router/navigating-pages/)
- [Route Parameters](https://docs.expo.dev/router/reference/url-parameters/)
- [Deep Linking](https://docs.expo.dev/router/reference/linking/)

### Migration Guides
- [Migrating from React Navigation](https://docs.expo.dev/router/migrate/from-react-navigation/)
- [Expo Router vs React Navigation](https://docs.expo.dev/router/introduction/#expo-router-vs-react-navigation)

### Helpful Patterns
- [Typed Routes (Experimental)](https://docs.expo.dev/router/reference/typed-routes/)
- [Authentication Flow](https://docs.expo.dev/router/reference/authentication/)
- [Modals and Overlays](https://docs.expo.dev/router/advanced/modals/)

---

## Notes and Observations

### Current State Analysis
1. **Good Foundation**: Expo Router is properly configured and working
2. **Partial Migration**: ~45 screens already using Expo Router correctly
3. **Clear Blockers**: 3 tab navigators are the main technical blocker
4. **Code Smell**: 36 wrapper files indicate incomplete migration
5. **Legacy Debt**: ~400 lines of unused navigation helper code

### Migration Quality
The migration was started correctly:
- ✅ Expo Router properly installed and configured
- ✅ File-based routing structure created
- ✅ Most new screens use Expo Router
- ✅ Navigation helpers refactored to use `useRouter()`

But stopped before completion:
- ❌ Tab navigators not converted
- ❌ Wrapper files not removed
- ❌ Legacy infrastructure not deleted
- ❌ React Navigation not uninstalled

### Recommendations
1. **Prioritize Phase 1**: Tab navigator conversion is critical
2. **One Phase at a Time**: Don't rush, test thoroughly between phases
3. **Version Control**: Commit after each successful screen migration
4. **Team Communication**: Coordinate if multiple developers working on navigation
5. **Testing First**: Write tests before migrating (if possible)

---

## Conclusion

This migration is **70% complete** and on a solid foundation. The remaining 30% requires:
1. Converting 3 tab navigators (most critical)
2. Removing 36 wrapper files (most tedious)
3. Cleaning up legacy code (straightforward)

**Estimated effort**: 2-4 days of focused work

**Risk level**: Low to Medium (clear path forward, no major blockers)

**Recommended approach**: Complete Phase 1 first (tab navigators), then proceed systematically through remaining phases.

Once complete, the codebase will have:
- ✅ Single navigation system (Expo Router only)
- ✅ File-based routing (cleaner, more intuitive)
- ✅ Better TypeScript support
- ✅ Smaller bundle size
- ✅ Easier maintenance
- ✅ Better developer experience

---

**Document Version**: 1.0
**Last Updated**: 2025-12-13
**Status**: Ready for Implementation
