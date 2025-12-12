Ntumai Auth Flow
1. App Launch

Check if JWT/Refresh token exists in local storage (AsyncStorage/MMKV).

If valid → auto login & fetch user profile (stored so that app can render correct screen based on role in profile or api response that is stored).

If missing/expired → go to onboarding/login screen.



2. Onboarding / Role Selection

Users choose whether they are:

Customer (requesting delivery/errand/marketplace purchase)

Driver/Service Provider (fulfilling requests)

Vendor (offering products in marketplace)

Same account can potentially switch roles (depending on business rules).



3. Authentication Options

Phone number OTP login (most common in Africa, better than email).

Social login (optional, e.g., Google, Facebook).

Email/password fallback (for vendors/admins).



4. Registration

Capture role-specific info:

Customer → Name, Phone, Location (optional).

Driver → NRC/ID, License, Vehicle type, Contact details.

Vendor → Business Name, Address, Bank/Mobile Money details.

Store this profile in DB linked to user ID.




5. Login

User enters phone/email → gets OTP or token.

API validates and issues Access Token + Refresh Token.

Tokens stored in Secure Storage (AsyncStorage or MMKV).





6. Session Management

Every API call → Access Token in headers.

If expired → use Refresh Token to get new Access Token.

If refresh fails → force logout.










7. Post-Login Routing

Customer → Home screen (Request courier, errand, marketplace).

Driver → Dashboard (Jobs, Earnings, Active Trips).

Vendor → Vendor Panel (Orders, Products, Payments).






8. Logout

Clear tokens from storage.

Reset navigation to login screen.


Domain / Business Logic Layer → This is where behavior (rules, validations, calculations, workflows) lives.
Example: "A driver can only accept one active trip at a time" → belongs in domain logic.

Services Layer → Implements how behavior interacts with APIs or local storage.
Example: "Call /api/trips/accept when driver accepts a trip".

Providers Layer → Consumes services & domain logic, then exposes ready-to-use state + actions to the UI.
Example: useAuth() hook uses AuthProvider to let UI call login() or logout() without worrying about tokens.

✅ Breakdown with Ntumai Example

Domain Logic

Rule: A driver cannot accept a second delivery if one is ongoing.

Rule: A vendor must have verified business details before listing items.

Service Layer

Functions: acceptDeliveryRequest(), verifyVendor(), createOrder().

These talk to the API.

Provider Layer

AuthProvider: Wraps login(), logout(), keeps tokens in context.

DriverProvider: Wraps service calls, enforces driver-related state (isAvailable, activeJob).

VendorProvider: Wraps vendor product listing and order management state.

UI Layer

Screens/Components simply call useDriver() or useAuth() instead of directly handling API or logic.

👉 So in short:

Providers = State distributors + orchestration helpers.

Behavior = Domain/Services layer.

Providers should stay thin — just connect business logic to the UI.