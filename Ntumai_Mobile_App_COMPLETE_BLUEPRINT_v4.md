# Ntumai Mobile App: Enhanced Production Blueprint

**Version:** 2.0  
**Date:** December 10, 2025

---

## Part 1: Core Product Architecture & Philosophy

### 1.1. Introduction

This document outlines the comprehensive, production-ready blueprint for the Ntumai mobile application. Ntumai is a hybrid, on-demand service platform designed to provide a seamless user experience for marketplace purchases, peer-to-peer (P2P) deliveries, and general errands. The architecture is built to serve three primary user roles:

*   **Customer:** The end-user who initiates all tasks.
*   **Tasker (Driver/Rider):** The service provider who executes assigned tasks.
*   **Vendor (Merchant):** The business that sells products via the marketplace.

This blueprint is the single source of truth for the mobile application, consolidating all functional requirements, user workflows, API specifications, and UI/UX guidelines. It is informed by initial requirements, user feedback, and an analysis of industry best practices from platforms like Uber, Yango, and InDrive.

### 1.2. Core Principles & Rules

The Ntumai platform is governed by a set of non-negotiable principles that ensure a consistent, efficient, and high-quality user experience. These rules are the foundation of the application logic and user interface design.

| Rule Category | Core Rule | Rationale & Implementation Notes |
| :--- | :--- | :--- |
| **Authentication** | The platform will use a **passwordless, OTP-based authentication** system for all user roles. | This reduces friction during sign-up and login, enhancing security by eliminating password-related vulnerabilities. The flow is: Phone/Email -> OTP -> Access. Social logins (Google, Apple, Facebook) will also be supported as an alternative OTP-based entry point. |
| **Customer Experience** | All customer-initiated tasks MUST follow a strict **three-step workflow**: 1. Selection, 2. Review & Commitment, and 3. Finalize & Pay. | This simplifies the user journey and creates a predictable interface. Each step is a distinct screen or set of closely related screens. For example, sender and recipient details for a package delivery are consolidated into a single screen within the "Review & Commitment" step. |
| **Tasker Job Assignment** | Taskers are assigned jobs exclusively by the system based on **proximity** and **performance rating**. Taskers CANNOT browse or select jobs from a list. | This model optimizes dispatch efficiency and creates a merit-based system. Job offers will be presented as a time-sensitive, full-screen, "call-like" notification to demand immediate attention. |
| **Hybrid User Roles** | A single user account can function as both a **Customer** and a **Tasker**. Users MUST explicitly switch between these roles using a dedicated in-app toggle. | This provides flexibility and maximizes user participation in the ecosystem. The app must maintain distinct and secure sessions for each role. |
| **Financial Commitment** | For errands requiring an upfront purchase, the Customer MUST **commit** to the estimated cost during the booking process. | This establishes financial trust and ensures the Tasker is not at risk. The UI will feature a clear "Commitment Amount" section in the "Review & Commitment" step. |
| **Unregistered Receivers** | The P2P delivery feature MUST support sending parcels to receivers who are **not registered** on the Ntumai app. | This is a critical growth feature that expands use cases to gifting and B2B deliveries. The receiver is identified by their phone number, and the sender can share a tracking link with them. |
| **Separation of Concerns** | All administrative, deep analytics, and financial reconciliation functions are handled via a separate, web-based **Admin Dashboard**. | This keeps the mobile application lightweight, secure, and focused on the core operational tasks of booking, execution, and fulfillment. |

---

## Part 2: User Roles, Onboarding, and Permissions

This section details the specific onboarding flows and permissions for each user role.

### 2.1. Customer Role

*   **Onboarding Flow:**
    1.  **Guest Access:** Upon first launch, the user is presented with the Home Screen to browse services without needing to log in, providing immediate value.
    2.  **Initiate Action:** When the user attempts to book a task or place an order, they are prompted to authenticate.
    3.  **Sign-up/Login:** The user enters their Phone Number or Email to receive an OTP. Social login options are also available.
    4.  **Role Selection:** After OTP verification, the user is presented with a choice: "Order Deliveries" or "Register as a Biker." Selecting "Order Deliveries" completes their registration as a Customer.
*   **Permissions:**
    *   Access all core services: Marketplace, Send a Parcel, and Do a Task.
    *   Manage their profile, saved addresses, and payment methods.
    *   View order history, track active orders, and rate completed services.
    *   Initiate the process to become a Tasker from their profile.

### 2.2. Tasker (Driver/Rider) Role

#### 2.2.1. Tasker Onboarding Workflow

The Tasker onboarding process is a comprehensive 11-step workflow designed to ensure quality, safety, and compliance. The backend must support this entire lifecycle.

**Onboarding State Machine:**

| Step | Status | Description |
| :--- | :--- | :--- |
| 1 | `APPLIED` | Rider submits initial application. |
| 2 | `PRE_SCREEN_PASSED` | Rider passes the pre-screen quiz. |
| 3 | `KYC_PENDING` | Rider needs to upload KYC documents. |
| 4 | `KYC_APPROVED` | All documents are verified and approved. |
| 5 | `TRAINING_PENDING` | Rider needs to complete training. |
| 6 | `TRAINING_COMPLETED` | Rider passes training quiz and test run. |
| 7 | `PROBATION` | Rider is live on the platform for 2 weeks. |
| 8 | `ACTIVE` | Rider is fully activated. |
| 9 | `REJECTED` | Rider application is rejected. |
| 10 | `SUSPENDED` | Rider account is temporarily suspended. |
| 11 | `DEACTIVATED` | Rider account is permanently deactivated. |

**Key Backend Requirements:**

*   **KYC Document Management:** Securely upload, store, and validate all required documents (NRC, driver's license, police clearance, etc.).
*   **Training Completion Tracking:** Record quiz scores and test run results.
*   **Probation Monitoring Service:** Real-time calculation and tracking of probation KPIs.
*   **Badging & Leveling Engine:** Automatically assign badges (Bronze, Silver, Gold) based on performance.
*   **Three-Strike Policy Enforcement:** Track violations and manage the appeal process.

#### 2.2.2. Standard Onboarding Flow

*   **Onboarding Flow:**
    1.  **From Sign-up:** A new user selects "Register as a Biker" during the initial role selection.
    2.  **From Customer Profile:** An existing Customer can apply to become a Tasker via an option in their profile.
    3.  **KYC Process:** The user is then guided through a mandatory KYC (Know Your Customer) process:
        *   **Personal Details:** Full name, address, etc.
        *   **Vehicle Information:** Vehicle type (motorcycle, car, bicycle), model, license plate.
        *   **Document Upload:** Driver's license, vehicle registration, proof of insurance.
    4.  **Admin Approval:** The application is submitted for review by the Ntumai admin team. The Tasker account is only activated upon approval.
*   **Permissions:**
    *   Go online/offline via a persistent toggle on their main dashboard.
    *   Receive and accept/reject system-assigned job offers.
    *   Utilize in-app navigation and job management tools.
    *   View a real-time earnings tracker and detailed payout history.
    *   Switch back to their Customer role.

### 2.3. Vendor (Merchant) Role

*   **Onboarding:** Vendors are onboarded by the Ntumai admin team via the web dashboard. This includes business verification and bank account setup. Once approved, they receive credentials for the mobile app.
*   **Permissions:**
    *   Access a dedicated Vendor dashboard within the mobile app.
    *   Manage their store's operational status (Open/Closed) and stock availability (In Stock/Out of Stock) for each item.
    *   Accept and manage incoming orders.
    *   Manage their product catalog.
    *   View sales reports and payout information.


---

## Part 3: Detailed User Workflows

This section provides a granular, step-by-step breakdown of the user workflows, incorporating the full feature set and industry best practices.

### 3.1. Customer Workflows: The Three-Step Process

#### Service 1: Marketplace

This workflow allows customers to order goods from registered vendors with real-time stock availability.

| Step | Screen(s) | Key Actions & UI Elements |
| :--- | :--- | :--- |
| **1. Selection** | Home Screen → Marketplace → Store/Menu | 1. From the Home Screen, tap **"Marketplace."**<br>2. Browse categories or search for stores/items.<br>3. Select a Vendor. The UI will only show items marked as "In Stock" by the vendor.<br>4. Add desired items to the cart. |
| **2. Review & Commitment** | Cart Screen | 1. Review all selected items and quantities.<br>2. Add special instructions for the vendor.<br>3. The subtotal is displayed. The user commits by tapping **"Proceed to Checkout."** |
| **3. Finalize & Pay** | Checkout Screen | 1. Select or add a delivery address.<br>2. Select a payment method.<br>3. Review the final order summary, including all fees.<br>4. Tap **"Place Order"** to finalize the transaction. |

#### Service 2: Send a Parcel (P2P Delivery)

This workflow is for sending an item to any recipient, whether they are on the Ntumai platform or not.

| Step | Screen(s) | Key Actions & UI Elements |
| :--- | :--- | :--- |
| **1. Selection** | Home Screen → Send a Parcel | 1. From the Home Screen, tap **"Send a Parcel."**<br>2. Describe the item being sent and select a delivery type (e.g., Moto, Car) which affects pricing.<br>3. Set the **Pickup Location** and **Drop-off Location**. |
| **2. Review & Commitment** | Recipient & Details Screen | 1. For the recipient, the user can either **select a contact from their phonebook** (which auto-fills the name and number) or manually enter the recipient's name and phone number.<br>2. The system displays the calculated price.<br>3. The user commits by tapping **"Confirm Details."** |
| **3. Finalize & Pay** | Finalize & Pay Screen | 1. Select a payment method.<br>2. Review the final route and price.<br>3. Tap **"Book Delivery."** After booking, the user is presented with a **"Share Tracking Link"** button to send to the recipient via SMS, WhatsApp, etc. |

#### Service 3: Do a Task (Errand)

This workflow is for complex tasks that may require communication and financial commitment.

| Step | Screen(s) | Key Actions & UI Elements |
| :--- | :--- | :--- |
| **1. Selection** | Home Screen → Do a Task | 1. From the Home Screen, tap **"Do a Task."**<br>2. Choose an errand category (e.g., Shopping, Pickup, Paperwork).<br>3. Describe the task in detail. The user can add a checklist of items/steps and **attach photos** for reference. |
| **2. Review & Commitment** | Location & Commitment Screen | 1. Set the relevant location(s) for the task.<br>2. If the task requires a purchase, the user toggles **"This errand requires money"** and enters the estimated cost in the **"Commitment Amount"** field.<br>3. The system displays the service fee. The user commits by tapping **"Confirm Task."** |
| **3. Finalize & Pay** | Finalize & Pay Screen | 1. Select a payment method for the service fee and the committed amount.<br>2. Review the final task summary.<br>3. Tap **"Book Tasker"** to finalize the booking. |

### 3.4. Tasker Workflows

#### 3.4.1. Probation Period (First 2 Weeks)

During the 2-week probation period, Taskers are closely monitored. The backend must track the following KPIs in real-time and make them visible to the Tasker in the app:

| KPI | Target |
| :--- | :--- |
| Acceptance Rate | ≥ 85% |
| On-Time Rate | ≥ 90% |
| Order Completion Rate | ≥ 98% |
| Average Rating | ≥ 4.7/5 |
| Incident Rate | ≤ 1% |

If a Tasker's KPIs fall below these thresholds, the system should trigger an alert for immediate coaching. If performance does not improve, the system should automatically suspend the Tasker's account.

#### 3.4.2. Badging & Leveling

After probation, Taskers are assigned a badge (Bronze, Silver, Gold) based on their performance. This badge affects their access to bonuses, priority orders, and surge zones. The backend must:

*   Calculate and update badges in real-time.
*   Use the badge level as a factor in the matching engine's scoring algorithm.

#### 3.4.3. Three-Strike Policy

The backend must track violations such as late/no-shows, customer misconduct, and safety violations. After three strikes, the system should automatically suspend the Tasker's account and initiate an appeal process.

#### 3.4.4. Standard Workflow

Tasker workflows are optimized for speed and clear communication.

1.  **Go Online/Offline:** The Tasker uses a persistent toggle button, likely on the main dashboard header or as a floating action button (FAB), to manage their availability.
2.  **Receive Job Offer:** A new job offer is pushed as a full-screen, **"call-like" notification** with a distinct sound and vibration. It displays the pickup/drop-off points and estimated earnings. The Tasker can **swipe to accept** or tap to reject.
3.  **Execute Task:**
    *   Upon acceptance, the app provides integrated navigation.
    *   The Tasker can initiate an **in-app chat (with image attachments)** or an **in-app voice call** with the customer at any point.
    *   For errands, if a substitution is needed, the Tasker sends a request which triggers the **Hybrid Substitution Approval Flow** for the customer.
4.  **Complete Task:**
    *   At the destination, the Tasker verifies the recipient's name and number.
    *   The Tasker **swipes to confirm delivery**. No signature is required, as the delivery is GPS-tracked.
5.  **Earnings Management:** The Tasker has a dedicated "Earnings" tab with a real-time dashboard showing daily/weekly totals and a detailed history of every transaction.

### 3.3. Vendor Workflows

Vendor workflows are focused on efficient order and inventory management.

1.  **Manage Store & Inventory:** The Vendor dashboard has a main toggle for **"Open for Orders" / "Closed."** Crucially, in their product list, each item has an **"In Stock" / "Out of Stock"** toggle to prevent orders for unavailable items.
2.  **Receive & Accept Orders:** New orders trigger a persistent notification. The Vendor can view order details and accept or reject them.
3.  **Manage Order Pipeline:** Accepted orders move through a clear visual pipeline: "New" → "Preparing" → "Ready for Pickup."

### 3.4. Cross-Functional Workflows

These workflows are critical for a polished, production-ready application.

| Workflow | Description |
| :--- | :--- |
| **Substitution Approval (Errands)** | 1. Tasker suggests a substitution in-app.<br>2. Customer receives a push notification with "Approve," "Reject," and "Chat" actions.<br>3. If no response in 5 mins, a second notification is sent.<br>4. If no response after another 5 mins, the substitution is **auto-approved** to prevent delays. The event is logged for dispute resolution. |
| **In-App Communication** | A chat interface is available for all active orders/tasks, supporting text and image attachments. In-app voice calls (VoIP) and direct phone dialing are also available. |
| **Cancellations** | Users can cancel an order/task at different stages. A modal appears requiring them to select a reason, and the cancellation policy (e.g., fee if Tasker is already en route) is clearly displayed. |
| **Dispute Resolution** | If a user reports an issue (e.g., item not delivered), a dispute is created. Both parties can submit evidence (chat logs, photos) in a dedicated "Dispute Center" screen for review by Ntumai support. |
| **Referrals & Rewards** | Users have a unique referral code. In their profile, they can track invites and earned credits. A "Rewards" section shows their points balance and redeemable discounts. |
| **Promotions** | Vendors can create promo codes via the Admin Dashboard. Customers can apply these codes at checkout. |


---

## Part 4: Screen-by-Screen UI Specification

This section provides a text-based description of each screen, incorporating the full feature set and UI patterns from industry best practices.

### 4.1. Customer App Screens

| Screen Name | Purpose & Key UI Elements |
| :--- | :--- |
| **Home Screen** | **Purpose:** Central hub for initiating tasks, accessible without login.<br>**UI Elements:** A top bar with location selector, search icon, and a **Notification Bell Icon** with a badge. Three prominent, vertically-centered buttons: **"Marketplace," "Send a Parcel,"** and **"Do a Task."** A bottom card shows the status of any active order. |
| **Marketplace Screens** | **Purpose:** Browse and order from vendors.<br>**UI Elements:** Standard e-commerce flow: Category lists -> Vendor lists -> Product grids -> Product detail pages. All product listings reflect real-time "In Stock"/"Out of Stock" status. |
| **Cart & Checkout** | **Purpose:** Review and pay for orders.<br>**UI Elements:** Standard cart with item list and quantity controls. Checkout includes address selection, payment methods, and a field for **Promo Codes**. |
| **Send a Parcel Screens** | **Purpose:** Configure a P2P delivery.<br>**UI Elements:** Fields for item description and delivery type. Map-based pickup/drop-off selectors. A recipient section with a button to **"Select from Contacts"** or manually enter name/number. A final **"Share Tracking Link"** button is presented after booking. |
| **Do a Task (Errand) Screens** | **Purpose:** Configure and book a general errand.<br>**UI Elements:** A text area for task description, a checklist for items/steps, and a button to **attach photos**. A toggle for **"This errand requires money"** which reveals the "Commitment Amount" field. |
| **Active Order/Task Screen** | **Purpose:** Track progress and communicate with the Tasker.<br>**UI Elements:** A map with the Tasker's live location and an updating ETA. A vertical **Order Status Timeline** (e.g., Accepted -> Preparing -> En Route). Prominent buttons for **In-App Chat** and **In-App Voice Call**. |
| **Chat Screen** | **Purpose:** Real-time communication with the Tasker.<br>**UI Elements:** A standard bubble-based messaging interface. A paperclip icon to allow for **attaching images**. |
| **Profile Screen** | **Purpose:** Manage account and access key features.<br>**UI Elements:** Links to Order History, Saved Addresses, Payment Methods, **Help & Support,** and a **"Refer & Earn"** section with the user's referral code. |
| **Notification Center** | **Purpose:** A persistent history of all notifications.<br>**UI Elements:** Accessed via the bell icon in the Home Screen header. A chronological list of all order updates, promotions, and system messages. |
| **Help & Support Screen** | **Purpose:** Provide self-service and direct support.<br>**UI Elements:** A searchable **FAQ** section. A **"Chat with Support"** button to initiate a conversation with the Ntumai support team. A section to open and track **Dispute Tickets**. |

### 4.2. Tasker App Screens

| Screen Name | Purpose & Key UI Elements |
| :--- | :--- |
| **Tasker Dashboard** | **Purpose:** The main control center for Taskers.<br>**UI Elements:** A persistent header or FAB with the **"Go Online" / "Go Offline"** toggle. A summary of today's earnings and completed trips. A list of active and pending jobs. |
| **Job Offer Screen** | **Purpose:** Alert the Tasker of a new job in an unmissable way.<br>**UI Elements:** A full-screen, modal interface with a loud, repeating notification sound. Displays pickup/drop-off points, estimated earnings, and a countdown timer. A large **"Swipe to Accept"** slider at the bottom. |
| **Active Job Screen** | **Purpose:** Guide the Tasker through the delivery process.<br>**UI Elements:** Integrated map for navigation. Buttons for **In-App Chat, In-App Voice Call,** and direct phone dialing. A large **"Swipe to Complete"** slider at the end of the job. |
| **Earnings Screen** | **Purpose:** Provide a detailed and transparent breakdown of earnings.<br>**UI Elements:** A dashboard with selectable timeframes (Daily, Weekly, Monthly). A chart visualizing earnings over time. A detailed list of all transactions, including fares, tips, and bonuses. |
| **Tasker Profile Screen** | **Purpose:** Manage Tasker-specific information and performance.<br>**UI Elements:** Tasker's name, photo, and prominently displayed overall **Rating**. Links to update vehicle information and documents. |

### 4.3. Vendor App Screens

| Screen Name | Purpose & Key UI Elements |
| :--- | :--- |
| **Vendor Dashboard** | **Purpose:** The main operational screen for merchants.<br>**UI Elements:** A large **"Open for Orders" / "Closed"** toggle. A summary of active and pending orders. Quick links to manage products and view reports. |
| **Product Management Screen** | **Purpose:** Manage inventory and availability in real-time.<br>**UI Elements:** A list of all products. Each item has an "Edit" button and, crucially, a simple **"In Stock" / "Out of Stock"** toggle for quick inventory control. |
| **Order Management Screen** | **Purpose:** View and process incoming orders.<br>**UI Elements:** A list of new orders awaiting acceptance. A clear, tabbed, or column-based view of the order pipeline: **"New" -> "Preparing" -> "Ready for Pickup."** |


---

## Part 5: API & Technical Specifications

### 5.1. Rider Onboarding API

**`POST /api/v1/riders/apply`**
- **Description:** Submit initial application.
- **Request Body:** `firstName`, `lastName`, `phoneNumber`, `email`

**`POST /api/v1/riders/kyc`**
- **Description:** Upload KYC documents.
- **Request Body:** `userId`, `documentType`, `file`

**`POST /api/v1/riders/training/complete`**
- **Description:** Mark training as complete.
- **Request Body:** `userId`, `quizScore`, `testRunResult`

**`GET /api/v1/riders/:id/probation-kpis`**
- **Description:** Get real-time probation KPIs for a rider.

### 5.2. Standard APIs

This section outlines the technical specifications, updated to include the full feature set.

### 5.1. API Endpoint Reference

The API structure remains as defined in the original `Ntumai_Delivery_App_API_Requirements(1).docx`, but will be expanded to include new endpoints for:

*   **/api/support/**: Endpoints for creating and managing support tickets and disputes.
*   **/api/referrals/**: Endpoints for tracking referral codes and applying credits.
*   **/api/chat/**: Endpoints for storing and retrieving chat history between users.
*   **/api/notifications/**: Endpoints to fetch the list of historical notifications for the Notification Center.

### 5.2. Real-time Functionality (WebSockets)

WebSockets are critical for the app's real-time features:

*   **Live Order Tracking:** Pushing Tasker location updates to the Customer.
*   **Job Notifications:** Pushing new job offers to Taskers and new order notifications to Vendors.
*   **In-App Chat:** Transmitting chat messages instantly between users.
*   **Substitution Requests:** Pushing substitution approval requests to the Customer in real-time.

### 5.3. Authentication & Security

*   **Passwordless (OTP):** The primary authentication method. The backend will handle OTP generation, delivery (via SMS/email), and verification.
*   **Token-Based Sessions:** Standard JWTs will be used to manage sessions. The token payload must include the user's current role (Customer, Tasker, or Vendor) to enforce API-level permissions.
*   **Secure Role Switching:** When a user switches roles, the app must request a new JWT from the backend that is scoped to the permissions of the new role.

---

## Part 6: Testing, Deployment, and Release

This section is updated to include testing for the new, critical features.

### 6.1. QA & Testing Guidelines

In addition to the previously defined scenarios, testing must cover:

*   **P2P Delivery to Unregistered Users:** Verify that a sender can book a delivery for a non-user and successfully share the tracking link.
*   **Substitution Approval Flow:** Test the full hybrid flow for errand substitutions, including the push notifications, dual prompts, and auto-approval on timeout.
*   **In-App Communication:** Test the chat and voice call features for reliability and clarity. Ensure image attachments send and display correctly.
*   **Dispute Resolution:** Test the process of creating a dispute ticket and submitting evidence from both the Customer and Tasker sides.
*   **Referral and Rewards System:** Verify that referral codes are tracked correctly and that credits/points are applied to user accounts as expected.

### 6.2. Deployment Checklist

The checklist remains the same, with an added emphasis on ensuring the WebSocket server and any new microservices (e.g., for chat or notifications) are correctly configured and scaled for the production environment.

### 6.3. Release Notes Template

The template remains the same, providing a clear and consistent format for communicating changes to users.


---

## Part 7: Financial & Wallet Management

This section details the financial architecture, wallet systems, and payment mechanisms that are critical to the Ntumai business model.

### 7.1. Wallet System Architecture

All user roles (Customer, Tasker, Vendor) have a **Wallet** associated with their account. Each wallet has a unique **Wallet ID** for internal tracking and support reference purposes.

#### Wallet Types by Role

| Role | Wallet Purpose | Balance Components | Key Features |
| :--- | :--- | :--- | :--- |
| **Customer** | Stores payment methods and transaction history. | Not applicable (payments are processed per transaction). | Can view order history and payment receipts. |
| **Tasker** | Stores earnings and maintains a required float balance. | **Float Balance** (prepaid, required to operate) + **Earnings Balance** (money earned from completed tasks). | Can top up float, view earnings, request payouts. |
| **Vendor** | Stores earnings after commission deductions. | **Gross Earnings** (before commission) + **Net Earnings** (after commission and fees). | Can view commission breakdowns, subscription status, and request payouts. |

### 7.2. Tasker Float System

The float system is a critical component of the Ntumai business model, ensuring Taskers are committed to the platform while providing flexibility through incentives.

#### Float Requirements

*   **Minimum Float Balance:** Taskers must maintain a minimum float balance (e.g., $10) to remain online and receive job offers.
*   **Float Depletion:** When a Tasker completes a task, the float is **not deducted**. Instead, earnings are credited to a separate **Earnings Balance**.
*   **Float Top-Up:** Taskers can purchase additional float at any time using available payment methods.

#### Float Purchase Flow

1.  **Initiate Top-Up:** From the Tasker dashboard or wallet screen, the Tasker taps **"Top Up Float."**
2.  **Select Amount:** The app presents preset options (e.g., $10, $25, $50, $100) or allows custom amounts.
3.  **Select Payment Method:** The Tasker chooses from available payment methods:
    *   **Card** (Visa, Mastercard)
    *   **Mobile Money** (Airtel Money, Zamtel, MTN)
    *   **Bank Transfer** (future)
4.  **Process Payment:** The payment is processed immediately. Upon success, the float balance is updated in real-time.
5.  **Confirmation:** A receipt is generated and stored in the transaction history.

#### Float Alerts & Incentives

*   **Low Balance Alert:** When the float drops below a threshold (e.g., $10), the Tasker receives a push notification and a banner on the dashboard warning them.
*   **Force Offline:** If the float reaches zero, the Tasker is automatically forced offline and cannot receive new job offers.
*   **Bonus Float:** Ntumai can award bonus float to Taskers as incentives (e.g., "Earn 5 extra deliveries this week, get $5 bonus float"). Bonus float is clearly labeled and may have an expiration date.

#### Float Balance Display

The Tasker dashboard prominently displays:

*   **Float Balance:** $X.XX (e.g., "Float: $25.00")
*   **Earnings Balance:** $Y.YY (e.g., "Earnings: $120.50")
*   **Wallet ID:** (for support reference, e.g., "Wallet ID: TK-123456")
*   **Last Top-Up:** Date and amount of the most recent float purchase

### 7.3. Vendor Commission & Fee Structure

Vendors operate under a flexible fee model that balances Ntumai's revenue with vendor profitability.

#### Commission Model

*   **Per-Order Commission:** Ntumai deducts a commission percentage from each order (e.g., 10-15%, configurable by admin).
*   **Commission Display:** On each order, vendors see a clear breakdown:
    *   Order Total: $50.00
    *   Commission (10%): -$5.00
    *   Vendor Earnings: $45.00

#### Subscription Fees (Optional)

Vendors can optionally subscribe to a tier that offers benefits (e.g., featured placement, analytics, priority support):

*   **Weekly Subscription:** (e.g., $5/week)
*   **Monthly Subscription:** (e.g., $15/month)
*   **Subscription Status Screen:** Vendors can view their current subscription tier, renewal date, and the option to upgrade or cancel.

#### Vendor Earnings Display

The Vendor dashboard displays:

*   **Today's Earnings:** Gross total before commission
*   **Commission Deducted:** Total commission charged today
*   **Net Earnings:** Gross minus commission
*   **Subscription Status:** Active/Inactive, next billing date
*   **Wallet ID:** (for support reference)

#### Invoice & Reporting

Vendors can access a **Reports** section where they can:

*   View a **detailed transaction list** (order ID, items, order total, commission %, commission amount, net earnings)
*   **Download invoices** as PDF for accounting purposes
*   **Export data** as CSV/Excel for their own records
*   View **subscription billing history** with all charges and renewal dates

### 7.4. Payment on Delivery

Payment is collected at the point of delivery. Currently, only **cash payments** are supported, with future expansion to mobile money and card payments.

#### Cash Payment Flow

1.  **Order Confirmation:** When a customer places an order, they select **"Cash on Delivery"** as the payment method.
2.  **Tasker Notification:** The Tasker sees the exact amount to collect before arriving at the delivery location.
3.  **Delivery & Collection:** Upon arrival, the Tasker collects the cash from the customer.
4.  **Confirm Payment:** The Tasker taps a **"Confirm Payment Received"** button in the app, which marks the task as complete.
5.  **Settlement:** The collected amount is credited to the Vendor's or Customer's account (depending on the service type).

#### Payment Failure Handling

If a customer refuses to pay or cannot pay:

1.  **Report Issue:** The Tasker can tap a **"Payment Issue"** button to report the problem.
2.  **Attempt Resolution:** The app prompts the Tasker to try again or contact the customer via in-app chat/call.
3.  **Escalate to Support:** If unresolved, the Tasker can escalate to Ntumai support, creating a **Dispute Ticket**.
4.  **Dispute Resolution:** Ntumai support reviews the case and determines liability (refund to customer, compensation to Tasker, etc.).

#### Future Payment Methods

The app architecture is designed to support future payment methods without major changes:

*   **Mobile Money:** Airtel Money, Zamtel, MTN (payment processed via API integration)
*   **Card Payments:** Visa, Mastercard (processed via payment gateway)
*   **Bank Transfer:** (for bulk or scheduled payments)

### 7.5. Payout Mechanism

Taskers and Vendors can withdraw their earnings from their wallet.

#### Payout Flow

1.  **Request Payout:** From the wallet screen, the user taps **"Request Payout."**
2.  **Select Amount:** The user enters the amount they wish to withdraw (must be less than or equal to their available balance).
3.  **Select Destination:** The user selects their bank account or mobile money account (previously saved or newly added).
4.  **Confirm:** The user reviews the details and confirms the payout request.
5.  **Processing:** The payout is processed according to Ntumai's schedule (e.g., payouts processed every Friday).
6.  **Notification:** The user receives a notification when the payout is complete.

#### Payout History

Users can view a complete **Payout History** showing:

*   Date of request
*   Amount requested
*   Destination account
*   Status (Pending, Processing, Completed, Failed)
*   Transaction ID

### 7.6. Transaction Receipts & Invoices

Every financial transaction generates a receipt or invoice that users can view, download, and share.

#### Receipt Types

| Transaction Type | Receipt Contents | Available Actions |
| :--- | :--- | :--- |
| **Order Completion** | Order ID, items, total, commission (vendor), payment method, timestamp | View, Download (PDF), Share |
| **Float Top-Up** | Wallet ID, amount, payment method, timestamp, confirmation code | View, Download (PDF), Share |
| **Payout** | Payout ID, amount, destination, date processed, transaction ID | View, Download (PDF), Share |
| **Subscription Charge** | Subscription tier, amount, billing period, next renewal date | View, Download (PDF), Share |

### 7.7. Wallet Security & Compliance

*   **Wallet ID:** Displayed in receipts and support tickets for reference, but not used for sensitive operations.
*   **Two-Factor Authentication:** Optional for high-value transactions (payouts above a threshold).
*   **Transaction Limits:** Ntumai may impose daily/weekly limits on payouts to prevent fraud.
*   **Tax Compliance:** For vendors, the app can store **Tax ID** information and generate tax-compliant invoices.

### 7.8. Wallet Screens & UI Elements

#### Tasker Wallet Screen

*   **Header:** Wallet ID, current float balance, earnings balance
*   **Quick Actions:** "Top Up Float," "Request Payout," "View History"
*   **Float Status:** Visual indicator (e.g., green if above minimum, red if below)
*   **Recent Transactions:** List of last 5 transactions with amounts and dates
*   **Bonus Float:** If applicable, a section showing bonus float with expiration date

#### Vendor Wallet Screen

*   **Header:** Wallet ID, today's earnings, total commission deducted
*   **Quick Actions:** "View Reports," "Request Payout," "Manage Subscription"
*   **Subscription Status:** Current tier, renewal date, option to upgrade/cancel
*   **Recent Transactions:** List of last 5 orders with commission breakdown
*   **Invoice History:** Quick access to download recent invoices

#### Customer Wallet Screen

*   **Header:** Saved payment methods
*   **Quick Actions:** "Add Payment Method," "View Order History"
*   **Recent Transactions:** List of last 5 orders with amounts and dates
*   **Payment Methods:** List of saved cards/mobile money accounts with options to edit or delete

# Part 8: Shopping Lists & Recurring Errands

## 8.1. Overview

The Shopping List feature is a simple, notes-based tool that allows customers to create, save, and reuse shopping lists exclusively within the **Do a Task (Errand)** workflow. This feature is NOT part of the Marketplace service and is designed to simplify recurring errand bookings.

## 8.2. Shopping List Creation

Shopping lists can be created in two ways:

### Option A: Create Before Ordering
1. From the Customer profile or home screen, access **"Saved Shopping Lists"**
2. Tap **"Create New List"**
3. Enter a **list name** (e.g., "Weekly Groceries," "Office Supplies")
4. Add items by tapping **"Add Item"**:
   - Item name (free text)
   - Quantity (number input)
   - Estimated cost per item (user-provided, not system-calculated)
5. Tap **"Save List"** to store it for later use

### Option B: Create During Errand Booking
1. Start the **Do a Task** workflow
2. Select **"Shopping"** as the errand category
3. In the **Selection step**, the user can:
   - **Select an existing saved list** (if available)
   - **Create a new list on the fly** (same interface as Option A)
4. Proceed through the three-step workflow as normal

## 8.3. Shopping List Management

### Saved Lists Screen
A dedicated screen accessible from the Customer profile displays all saved shopping lists:

| Element | Description |
| :--- | :--- |
| **List Name** | (e.g., "Weekly Groceries") |
| **Item Count** | (e.g., "5 items") |
| **Last Used** | Date of last order using this list |
| **Actions** | Edit, Duplicate, Delete, Use Now |

### List Editing
Users can:
- **Add items** to an existing list
- **Remove items** from a list
- **Update quantities** for existing items
- **Update estimated costs** for items
- **Rename the list**
- **Delete the list** (with confirmation)

## 8.4. Using a Saved List in the Errand Workflow

1. **Step 1 (Selection):** Customer selects "Do a Task" → "Shopping" → Selects a saved list
2. **Step 2 (Review & Commitment):** 
   - The list items are pre-populated
   - Customer can edit quantities, add/remove items, or update estimated costs
   - The system calculates the **total estimated cost** based on user-provided estimates
   - Customer enters the **Commitment Amount** (which may differ from the estimate)
3. **Step 3 (Finalize & Pay):** Standard checkout process

## 8.5. List Sharing

Users can share shopping lists with family members or other app users:

1. From the **Saved Lists** screen, tap **"Share"** on a list
2. Select recipients from their contacts or by phone number
3. Shared users can:
   - **View the list**
   - **Duplicate it** to create their own copy
   - **Suggest edits** (optional, if collaboration is enabled)
4. The original list owner can revoke sharing at any time

## 8.6. Recurring Shopping (Scheduled Errands)

Users can schedule a shopping errand to repeat automatically:

1. After creating or selecting a list, users can tap **"Schedule This Order"**
2. Options:
   - **One-time order:** Specify a date and time
   - **Recurring order:** Select frequency (Weekly, Bi-weekly, Monthly)
3. The system will:
   - Automatically create a new errand at the scheduled time
   - Use the saved list as the template
   - Notify the user before the order is placed (e.g., "Your weekly groceries order will be placed tomorrow at 9 AM. Confirm or cancel.")
   - Allow the user to modify the list before each recurring order

## 8.7. UI Specifications

### Shopping List Item
Each item in a list displays:
- **Item Name** (editable)
- **Quantity** (editable)
- **Estimated Cost** (editable, user-provided)
- **Delete Button** (remove item)

### List Summary
When reviewing a list before booking:
- **Total Items:** Count of all items
- **Total Estimated Cost:** Sum of (quantity × estimated cost per item)
- **Commitment Amount:** What the customer will actually pay (may differ from estimate)

### Simple Notes Interface
The list interface is intentionally simple, resembling a notes app:
- Clean, minimal design
- Easy to add/remove items
- Quick to edit quantities and costs
- No product search or catalog integration (unlike Marketplace)

# Part 9: Auto-Matching & Live Tasker Discovery

## 9.1. Overview

When a customer books a task (Marketplace order, Send a Parcel, or Errand), the backend automatically matches the task to the best available Tasker based on proximity, rating, and availability. During the matching process, the customer sees a live map with available Taskers, creating transparency and confidence in the system.

## 9.2. Auto-Matching Algorithm

The backend matching system evaluates Taskers based on the following criteria (in order of priority):

| Criteria | Weight | Details |
| :--- | :--- | :--- |
| **Availability** | 100% | Tasker must be online and within the service area |
| **Proximity** | 40% | Tasker closest to pickup location is preferred |
| **Rating** | 30% | Higher-rated Taskers are prioritized |
| **Task Specialization** | 20% | For specific task types (e.g., fragile items), Taskers with relevant experience are preferred |
| **Completion Rate** | 10% | Taskers with higher completion rates are prioritized |

## 9.3. Live Tasker Discovery UI

### During Matching ("Finding the Right Tasker...")

When a customer books a task, they are presented with a **"Finding the Right Tasker"** screen:

| Element | Description |
| :--- | :--- |
| **Map View** | Shows the customer's location and available Taskers in real-time as they accept/decline tasks |
| **Tasker Indicators** | Each online Tasker is shown as a marker on the map (e.g., green dot for available, yellow for busy) |
| **Status Message** | "Finding the right tasker for you..." with a loading animation |
| **Estimated Wait Time** | (e.g., "Usually found in 30 seconds") |
| **Cancel Button** | Allows the customer to cancel the booking if they change their mind |

### Real-Time Updates

As Taskers accept or decline tasks:
- The map updates in real-time showing Tasker movements
- The system continues searching for the best match
- Once a match is found, the customer is notified and transitioned to the **Active Order** screen

## 9.4. Tasker Job Offer Flow

When a Tasker is selected as the best match, they receive a **full-screen job offer notification**:

| Element | Description |
| :--- | :--- |
| **Job Details** | Pickup location, drop-off location, estimated earnings, task type |
| **Countdown Timer** | 30-second timer to accept or decline |
| **Accept Button** | Swipe or tap to accept the job |
| **Decline Button** | Tap to decline (system will reassign to next best Tasker) |
| **Sound & Vibration** | Loud notification sound and haptic feedback to demand attention |

### Acceptance & Reassignment

- **If Tasker Accepts:** Job is assigned, customer is notified, active order tracking begins
- **If Tasker Declines:** System immediately reassigns to the next best Tasker (within 5 seconds)
- **If Timer Expires:** System treats it as a decline and reassigns

## 9.5. Multiple Job Stacking

Taskers can have multiple jobs assigned to them simultaneously, but with the following rules:

| Rule | Details |
| :--- | :--- |
| **Sequential Assignment** | Only one new job is offered at a time. Once accepted, the Tasker can receive another offer. |
| **Job Queue** | Accepted jobs are queued and displayed in order of priority (e.g., closest location first) |
| **Maximum Concurrent Jobs** | A Tasker can have up to **3 active jobs** at any time (configurable by admin) |
| **Job Status Visibility** | The Tasker dashboard shows all active jobs with their status (Assigned, In Progress, Completed) |

## 9.6. Performance Metrics for Tasker Matching

The system tracks the following metrics to continuously improve matching and identify the best Taskers for specific job types:

| Metric | Purpose | Calculation |
| :--- | :--- | :--- |
| **On-Time Delivery Rate** | Percentage of deliveries completed within estimated time | (On-time deliveries / Total deliveries) × 100 |
| **Customer Satisfaction Rating** | Average rating from customers (1-5 stars) | Sum of all ratings / Number of ratings |
| **Cancellation Rate** | Percentage of jobs cancelled by Tasker | (Cancelled jobs / Total assigned jobs) × 100 |
| **Completion Rate** | Percentage of jobs completed | (Completed jobs / Total assigned jobs) × 100 |
| **Acceptance Rate** | Percentage of job offers accepted | (Accepted jobs / Total offers) × 100 |
| **Response Time** | Average time to respond to job offer | Sum of response times / Number of offers |
| **Task Specialization Score** | Tasker's proficiency with specific task types | Weighted average based on task type performance |

These metrics are used by the admin to:
- Identify top-performing Taskers
- Provide performance feedback to underperforming Taskers
- Adjust matching algorithms
- Award incentives or bonuses

## 9.7. Matching Transparency

The customer can see:
- **Estimated wait time** for a Tasker to be assigned
- **Live map** showing available Taskers in their area
- **Tasker details** (once assigned): Name, photo, rating, vehicle type
- **Real-time tracking** of the Tasker's location and ETA

This transparency builds trust and confidence in the platform.

# Part 10: Architecture, Performance & Scalability

## 10.1. Technical Architecture Overview

The Ntumai mobile app is built on a **REST API + WebSocket** architecture, ensuring real-time communication and scalability.

### Architecture Layers

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React Native / Flutter (TBD) | Cross-platform mobile app |
| **Backend API** | Node.js / Python (TBD) | REST API for all CRUD operations |
| **Real-Time Communication** | Socket.io | WebSocket for live tracking, notifications, chat |
| **Database** | PostgreSQL / MongoDB (TBD) | Persistent data storage |
| **Cache** | Redis | Session management, real-time data caching |
| **Message Queue** | RabbitMQ / Kafka (TBD) | Asynchronous task processing |
| **Payment Gateway** | Callback-based integration | Handles cash and digital payments |
| **Maps & Location** | Google Maps API / OpenStreetMap | Real-time tracking and navigation |
| **Notifications** | Firebase Cloud Messaging (FCM) | Push notifications to users |

## 10.2. API Architecture

### REST API Principles

- **Stateless:** Each request contains all necessary information
- **Versioning:** API endpoints include version (e.g., `/api/v1/orders`)
- **Rate Limiting:** Prevent abuse with request throttling (e.g., 100 requests/minute per user)
- **Authentication:** JWT tokens with role-based access control (RBAC)
- **Error Handling:** Standardized error responses with clear messages

### WebSocket (Socket.io) Usage

WebSockets are used for real-time features that require instant updates:

| Feature | WebSocket Event | Direction |
| :--- | :--- | :--- |
| **Live Order Tracking** | `order:location_update` | Server → Client (Customer/Vendor) |
| **Job Offers** | `job:new_offer` | Server → Client (Tasker) |
| **Chat Messages** | `chat:message` | Bidirectional |
| **Substitution Requests** | `order:substitution_request` | Server → Client (Customer) |
| **Notifications** | `notification:new` | Server → Client (All) |
| **Tasker Status** | `tasker:status_change` | Server → Client (Customer) |

### Asynchronous Processing

Non-critical operations are processed asynchronously via message queues:

- Email/SMS notifications
- Invoice generation
- Report generation
- Analytics processing
- Payout processing

## 10.3. Performance Optimization

### App Size & Load Time

- **Target App Size:** < 150 MB (iOS) / < 200 MB (Android)
- **Strategies:**
  - Code splitting and lazy loading
  - Image compression and optimization
  - Minification and tree-shaking
  - Remove unused dependencies

### Network Optimization

- **API Response Caching:** Cache frequently accessed data (e.g., vendor lists, categories)
- **Compression:** Gzip compression for API responses
- **Image Optimization:** Serve images in multiple resolutions based on device capabilities
- **Batch Requests:** Combine multiple API calls into a single request where possible

### Offline Mode

The app supports limited offline functionality:

- **Cached Data:** Previously viewed products, vendor lists, and order history are cached locally
- **Skeleton Loading:** While offline, the app shows skeleton screens (placeholder UI) with a notification banner
- **Notification Banner:** A persistent banner at the top center indicates "No internet connection. Some features are unavailable."
- **Queued Actions:** Actions like chat messages or order modifications are queued and synced when connection is restored
- **Limitations:** Most features (booking, payments, real-time tracking) require an active internet connection

### Database Optimization

- **Indexing:** Proper indexing on frequently queried columns (e.g., user_id, order_id, location)
- **Query Optimization:** Use efficient queries and avoid N+1 problems
- **Connection Pooling:** Reuse database connections to reduce overhead
- **Partitioning:** For large tables (e.g., orders, transactions), use time-based partitioning

## 10.4. Scalability

### Horizontal Scaling

- **Load Balancing:** Distribute traffic across multiple API servers
- **Stateless Design:** API servers don't store session state (state is in Redis or JWT)
- **Database Replication:** Master-slave replication for read scalability

### Vertical Scaling

- **Resource Allocation:** Increase CPU, memory, and storage as needed
- **Monitoring:** Track resource usage and scale proactively

### Real-Time Scalability (WebSocket)

- **Connection Pooling:** Efficiently manage thousands of concurrent WebSocket connections
- **Message Broadcasting:** Use Redis Pub/Sub for efficient message distribution across multiple servers
- **Sticky Sessions:** Ensure a user's WebSocket connection stays on the same server

## 10.5. Security Best Practices

| Area | Best Practice |
| :--- | :--- |
| **Authentication** | OTP-based, passwordless; JWT tokens with short expiration (15 minutes) and refresh tokens (7 days) |
| **Authorization** | Role-based access control (RBAC); verify permissions on every API call |
| **Data Encryption** | HTTPS/TLS for all API communication; encrypt sensitive data at rest (e.g., payment info) |
| **API Security** | Rate limiting, CORS configuration, input validation, SQL injection prevention |
| **Mobile Security** | Use secure storage for tokens (Keychain on iOS, Keystore on Android); certificate pinning for HTTPS |
| **Logging & Monitoring** | Log all critical actions; monitor for suspicious activity; alert on security events |

## 10.6. Monitoring & Analytics

### Performance Monitoring

- **API Response Time:** Track average and p95/p99 response times
- **Error Rate:** Monitor 4xx and 5xx error rates
- **Database Performance:** Track slow queries and connection pool usage
- **WebSocket Health:** Monitor connection count, message throughput, latency

### User Analytics

- **User Engagement:** Track daily/monthly active users, session duration
- **Feature Usage:** Which features are most used?
- **Conversion Funnel:** Track drop-off rates at each step (sign-up, first order, repeat order)
- **Crash Reporting:** Monitor app crashes and errors

### Business Metrics

- **Order Volume:** Track orders per day, week, month
- **Revenue:** Track total revenue, revenue per Tasker, revenue per Vendor
- **Customer Acquisition Cost (CAC):** Track cost to acquire a new customer
- **Lifetime Value (LTV):** Track average customer lifetime value

## 10.7. Deployment & DevOps

### Deployment Strategy

- **CI/CD Pipeline:** Automated testing and deployment on every code commit
- **Staging Environment:** Test all changes in a staging environment before production
- **Blue-Green Deployment:** Minimize downtime by running two identical production environments
- **Rollback Plan:** Ability to quickly rollback to a previous version if issues arise

### Infrastructure

- **Cloud Provider:** AWS, Google Cloud, or Azure (TBD)
- **Container Orchestration:** Kubernetes for managing containerized services
- **Infrastructure as Code:** Use Terraform or CloudFormation for reproducible infrastructure

### Monitoring & Alerting

- **Uptime Monitoring:** 99.9% uptime SLA target
- **Alert System:** Automated alerts for critical issues (e.g., API down, database error rate > 5%)
- **On-Call Rotation:** Dedicated team for incident response

## 10.8. Data Retention & Privacy

### Data Retention Policy

| Data Type | Retention Period | Reason |
| :--- | :--- | :--- |
| **User Accounts** | Indefinite (unless deleted) | User management |
| **Order History** | 7 years | Tax and legal compliance |
| **Chat Messages** | 1 year | Dispute resolution |
| **Payment Records** | 7 years | Financial audit trail |
| **Location Data** | 30 days | Real-time tracking only |
| **Analytics Data** | 2 years | Business intelligence |

### Privacy Compliance

- **GDPR Compliance:** Support data export and deletion requests
- **Data Encryption:** Encrypt sensitive data at rest and in transit
- **Privacy Policy:** Clear, transparent privacy policy in the app
- **Consent Management:** Obtain explicit consent for data collection and processing

## 10.9. Testing Strategy

### Unit Testing

- Target: 80%+ code coverage
- Framework: Jest, Mocha, or similar
- Run on every commit

### Integration Testing

- Test API endpoints with various inputs
- Test database interactions
- Test WebSocket communication

### End-to-End (E2E) Testing

- Simulate real user workflows
- Test on multiple devices and OS versions
- Framework: Cypress, Detox, or similar

### Performance Testing

- Load testing: Simulate 10,000+ concurrent users
- Stress testing: Identify breaking points
- Tools: JMeter, Locust, or similar

### Security Testing

- Penetration testing: Identify vulnerabilities
- OWASP compliance: Follow security best practices
- Regular security audits

# Part 11: Release Roadmap & Prioritization

## 11.1. Version Strategy

The Ntumai mobile app will be released in phases, prioritizing core features for launch (v1.0) and deferring nice-to-have features to future releases.

## 11.2. v1.0 - MVP (Minimum Viable Product)

**Target Release:** Q1 2026  
**Focus:** Core functionality for all three services with essential features

### Features Included in v1.0

#### Authentication & Onboarding
- Passwordless OTP-based sign-up and login
- Multi-factor authentication (email and phone)
- Google login for customers (with phone number requirement)
- Role selection (Customer vs. Tasker)
- Basic KYC for Taskers (National ID, Driver's License, vehicle info)

#### Customer Features
- **Marketplace:** Browse vendors, view products, add to cart, checkout with cash on delivery
- **Send a Parcel:** Book P2P delivery with recipient phone number, share tracking link
- **Do a Task (Errand):** Create errands with description, photos, and commitment amount
- **Order Tracking:** Real-time map tracking with Tasker location and ETA
- **In-App Chat:** Text-based communication with Tasker (text and image attachments)
- **In-App Voice Calls:** VoIP communication with Tasker
- **Direct Phone Calls:** Dial Tasker's number directly
- **Order History:** View past orders and receipts
- **Profile Management:** Update personal info, saved addresses, payment methods

#### Tasker Features
- **Job Offers:** Receive system-assigned jobs with accept/decline options
- **Online/Offline Toggle:** Manage availability status
- **Job Execution:** Navigate to location, communicate with customer, mark as complete
- **Earnings Dashboard:** View real-time earnings, daily/weekly/monthly summaries
- **Wallet Management:** View float balance, earnings balance, transaction history
- **Float Top-Up:** Purchase float using available payment methods (card, mobile money)
- **Payout Requests:** Request withdrawal of earnings
- **Performance Metrics:** View personal rating and performance statistics
- **KYC Management:** Update documents and vehicle information

#### Vendor Features
- **Store Management:** Toggle "Open/Closed" status
- **Inventory Management:** Toggle "In Stock/Out of Stock" for products
- **Order Management:** Accept/reject incoming orders, manage order pipeline
- **Earnings Dashboard:** View daily/weekly earnings, commission breakdown
- **Payout Requests:** Request withdrawal of earnings
- **Basic Reports:** View order history and commission summary

#### Platform Features
- **Auto-Matching:** Backend system assigns tasks to best Tasker based on proximity and rating
- **Live Tasker Discovery:** Customers see available Taskers on map during matching
- **Real-Time Notifications:** Push notifications for order updates, job offers, payments
- **Notification Center:** View history of all notifications
- **Dispute Resolution:** Report issues and create support tickets
- **Help & Support:** FAQ section and chat with support team
- **Referral System:** Share referral code, track invites, earn credits
- **Loyalty Program:** Basic points system for orders
- **Promo Codes:** Apply discount codes at checkout
- **Cancellation Policies:** Clear terms for canceling orders at different stages
- **Wallet System:** Unique Wallet IDs, transaction receipts, invoice downloads
- **Payment on Delivery:** Cash payment collection with confirmation
- **Offline Mode:** Skeleton loading with notification banner when offline

#### Technical Features
- REST API + WebSocket architecture
- JWT-based authentication with role-based access control
- Real-time location tracking
- Push notifications via Firebase Cloud Messaging
- Secure payment gateway integration (callback-based)
- Database with proper indexing and optimization
- Monitoring and error tracking

---

## 11.3. v1.1 - Enhancement Release

**Target Release:** Q2 2026  
**Focus:** Improve user experience and add requested features based on v1.0 feedback

### Features Added in v1.1

#### Customer Features
- **Shopping Lists:** Create, save, and reuse shopping lists for errands
- **List Sharing:** Share lists with family members
- **Scheduled Orders:** Schedule recurring errands (weekly, bi-weekly, monthly)
- **Favorites:** Save favorite vendors and products
- **Search History:** Quick access to previous searches
- **Ratings & Reviews:** Rate vendors, products, and Taskers; read reviews
- **Wishlist:** Save items for later purchase

#### Tasker Features
- **Performance Insights:** Detailed analytics on performance metrics
- **Incentive Programs:** Track bonuses and incentives earned
- **Subscription Tiers:** Optional premium features (e.g., priority job matching)

#### Vendor Features
- **Bulk Product Upload:** Upload multiple products via CSV
- **Product Variants:** Support for product sizes, colors, etc.
- **Advanced Analytics:** Top-selling items, customer demographics, peak hours
- **Subscription Tiers:** Optional premium features (e.g., featured placement)
- **Vendor Support:** Dedicated support channel for vendors

#### Platform Features
- **Multi-Language Support:** (Future, not v1.1)
- **Advanced Filtering:** Filter orders by type, status, date range
- **Export Data:** Download reports as CSV/Excel
- **Tax Compliance:** Tax ID storage and tax-compliant invoices
- **Subscription Management:** Vendor subscription tier management

---

## 11.4. v2.0 - Major Feature Release

**Target Release:** Q4 2026  
**Focus:** Expand platform capabilities and enter new markets

### Features Added in v2.0

#### Payment Methods
- **Mobile Money Integration:** Airtel Money, Zamtel, MTN
- **Card Payments:** Visa, Mastercard, local cards
- **Bank Transfers:** Direct bank account transfers for payouts
- **Wallet-to-Wallet Transfers:** Send money between users

#### Marketplace Enhancements
- **Subscription Boxes:** Regular deliveries of curated items
- **Bulk Orders:** Special pricing for bulk purchases
- **Vendor Ratings & Reviews:** Customer reviews of vendors
- **Live Chat Support:** Real-time chat with vendor support

#### Tasker Features
- **Tasker Ratings & Reviews:** Customer reviews of Taskers
- **Skill Endorsements:** Verification of specialized skills
- **Insurance Integration:** Optional insurance for high-value deliveries

#### Vendor Features
- **POS Integration:** Sync inventory with external POS systems
- **Multi-Location Support:** Manage multiple store locations
- **Staff Management:** Manage vendor staff and permissions
- **Advanced Analytics:** Predictive analytics and recommendations

#### Platform Features
- **Multi-Language Support:** English, Bemba, Nyanja, etc.
- **Regional Expansion:** Support for multiple countries
- **API for Third Parties:** Allow external developers to build on Ntumai
- **Advanced Dispute Resolution:** AI-assisted dispute resolution
- **Compliance Tools:** Automated tax reporting and compliance

---

## 11.5. Feature Deprecation & Sunset Policy

Features that are no longer maintained will follow a deprecation policy:

1. **Announcement:** Users are notified 3 months before deprecation
2. **Migration Path:** Provide tools to migrate to replacement features
3. **Sunset Date:** Feature is disabled 6 months after announcement
4. **Archival:** Data is archived for 1 year before deletion

---

## 11.6. Prioritization Matrix

| Feature | v1.0 | v1.1 | v2.0 | Priority | Effort | Impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Marketplace | ✅ | ✅ | ✅ | CRITICAL | HIGH | HIGH |
| Send a Parcel | ✅ | ✅ | ✅ | CRITICAL | MEDIUM | HIGH |
| Do a Task | ✅ | ✅ | ✅ | CRITICAL | HIGH | HIGH |
| Auto-Matching | ✅ | ✅ | ✅ | CRITICAL | HIGH | HIGH |
| Wallet System | ✅ | ✅ | ✅ | CRITICAL | MEDIUM | HIGH |
| Float System | ✅ | ✅ | ✅ | CRITICAL | MEDIUM | HIGH |
| In-App Chat | ✅ | ✅ | ✅ | CRITICAL | MEDIUM | HIGH |
| Real-Time Tracking | ✅ | ✅ | ✅ | CRITICAL | HIGH | HIGH |
| Shopping Lists | ❌ | ✅ | ✅ | HIGH | LOW | MEDIUM |
| Ratings & Reviews | ❌ | ✅ | ✅ | HIGH | MEDIUM | MEDIUM |
| Favorites | ❌ | ✅ | ✅ | MEDIUM | LOW | LOW |
| Mobile Money | ❌ | ❌ | ✅ | HIGH | HIGH | HIGH |
| Multi-Language | ❌ | ❌ | ✅ | MEDIUM | HIGH | MEDIUM |
| Subscription Boxes | ❌ | ❌ | ✅ | LOW | HIGH | LOW |

---

## 11.7. Success Metrics for Each Release

### v1.0 Success Metrics
- **Launch on time** (Q1 2026)
- **Zero critical bugs** in first week
- **1,000+ downloads** in first month
- **100+ active Taskers** in launch city
- **50+ active Vendors** in launch city
- **99.5% uptime** in first month

### v1.1 Success Metrics
- **10,000+ downloads** total
- **500+ active Taskers**
- **200+ active Vendors**
- **Shopping list feature adoption:** 30% of customers use lists
- **Customer satisfaction:** 4.5+ star rating on app stores

### v2.0 Success Metrics
- **100,000+ downloads** total
- **5,000+ active Taskers**
- **1,000+ active Vendors**
- **Multi-country expansion:** Operating in 3+ countries
- **Customer satisfaction:** 4.7+ star rating on app stores

# Part 4: Complete Screen-by-Screen UI Specification (79 Screens)

**Version:** 3.0 (Complete)  
**Total Screens:** 79 (32 core + 47 additional)

---

## 4.1. Authentication & Onboarding Screens (8 screens)

### Screen 1: Splash Screen
**Purpose:** App initialization and branding  
**Navigation:** Auto-transitions to Onboarding Carousel after 2-3 seconds  
**Key UI Elements:**
- Ntumai logo centered on screen
- Teal/green gradient background
- Loading indicator (subtle animation)
- No interactive elements

**Backend Requirements:** None (client-side only)

---

### Screen 2: Onboarding Carousel (3-5 slides)
**Purpose:** Educate users on platform features before login  
**Navigation:** Swipe between slides, skip button, "Get Started" CTA on last slide  
**Slide Content:**
- **Slide 1:** "Quick Deliveries at Your Fingertips" - Marketplace feature
- **Slide 2:** "Send Packages Anywhere" - P2P delivery feature
- **Slide 3:** "Get Things Done" - Errand/task feature
- **Slide 4:** "Earn Money as a Rider" - Tasker opportunity (optional)
- **Slide 5:** "Join Our Community" - Call to action

**Key UI Elements:**
- Full-screen carousel with swipe gestures
- Dot indicators showing current slide
- Skip button (top-right)
- "Get Started" button (last slide)
- Illustration/image for each slide

**Backend Requirements:** None (static content)

---

### Screen 3: Sign-Up - Phone/Email Entry
**Purpose:** Initiate user registration  
**Navigation:** Tap "Send OTP" to proceed to Screen 4  
**Key UI Elements:**
- Two tabs: "Phone Number" (default) and "Email"
- Country code selector (default: +260 for Zambia)
- Phone number input field with validation
- Email input field with validation
- "Send OTP" button (disabled until valid input)
- "Already have an account? Login" link

**Validation Rules:**
- Phone: Must be 10 digits (Zambian format)
- Email: Must be valid email format

**Backend Requirements:**
- `POST /api/v1/auth/request-otp` - Generate and send OTP via SMS/Email

---

### Screen 4: Sign-Up - OTP Verification
**Purpose:** Verify user identity via OTP  
**Navigation:** On successful verification, proceed to Screen 6 (Role Selection)  
**Key UI Elements:**
- Display phone/email being verified
- 6-digit OTP input field (auto-focus, numeric keyboard)
- Countdown timer (10 minutes)
- "Resend OTP" button (disabled until timer expires)
- "Change phone/email" link (back to Screen 3)

**Validation Rules:**
- OTP must be exactly 6 digits
- OTP must match backend-generated code
- OTP must not be expired

**Backend Requirements:**
- `POST /api/v1/auth/verify-otp` - Validate OTP and create temporary session

---

### Screen 5: Sign-Up - Social Login
**Purpose:** Alternative authentication via social providers  
**Navigation:** Appears alongside Screen 3 (Phone/Email entry)  
**Key UI Elements:**
- "OR" divider
- Three buttons: "Continue with Google," "Continue with Apple," "Continue with Facebook"
- Each button shows provider logo and name

**Flow After Social Login:**
- If user is new: Proceed to Screen 6 (Role Selection)
- If user exists: Proceed to Screen 7 (Welcome Screen)

**Backend Requirements:**
- `POST /api/v1/auth/social-login` - Handle OAuth tokens and user creation

---

### Screen 6: Sign-Up - Role Selection
**Purpose:** Determine user's primary role  
**Navigation:** Tap on a role card to proceed  
**Key UI Elements:**
- Two large, tappable cards:
  - **Card 1:** "Order Deliveries" - Icon of person ordering, description: "Browse and order from vendors, send packages, or book tasks"
  - **Card 2:** "Register as a Rider" - Icon of rider on bike, description: "Earn money by delivering orders and completing tasks"
- Each card has a radio button indicator
- "Continue" button (enabled only when a role is selected)

**Backend Requirements:**
- `POST /api/v1/auth/select-role` - Store initial role preference

---

### Screen 7: Login Screen
**Purpose:** Authenticate returning users  
**Navigation:** Tap "Login" to proceed to Screen 4 (OTP Verification)  
**Key UI Elements:**
- Ntumai logo at top
- Two tabs: "Phone Number" (default) and "Email"
- Phone/Email input field
- "Send OTP" button
- "Don't have an account? Sign Up" link
- Social login options (Google, Apple, Facebook)

**Backend Requirements:**
- `POST /api/v1/auth/request-otp` - Same as Screen 3

---

### Screen 8: Welcome Screen (Post-Auth)
**Purpose:** Personalized greeting and role confirmation  
**Navigation:** Tap "Get Started" to proceed to Home Screen  
**Key UI Elements:**
- Greeting message: "Welcome, [First Name]!"
- Role confirmation: "You're all set as a [Customer/Rider]"
- Role switch option: "Want to switch roles? Go to Settings"
- "Get Started" button
- Optional: Quick tips or feature highlights

**Backend Requirements:**
- `GET /api/v1/users/me` - Fetch user profile

---

## 4.2. Customer App Screens (23 total)

### Core Screens (14 - Already Documented)
1. Home Screen
2. Marketplace - Category List
3. Marketplace - Store/Vendor List
4. Marketplace - Product Grid
5. Marketplace - Product Detail
6. Cart Screen
7. Checkout Screen
8. Send a Parcel - Main Screen
9. Send a Parcel - Recipient & Details
10. Send a Parcel - Finalize & Pay
11. Do a Task (Errand) - Main Screen
12. Do a Task - Location & Commitment
13. Do a Task - Finalize & Pay
14. Active Order/Task Screen
15. Chat Screen
16. Profile Screen
17. Notification Center

### Additional Customer Screens (9 - New)

---

### Screen 18: Saved Addresses
**Purpose:** Manage frequently used delivery locations  
**Navigation:** Accessible from Profile → "Saved Addresses"  
**Key UI Elements:**
- List of saved addresses with labels (Home, Work, etc.)
- Each address card shows: Label, full address, edit/delete buttons
- "Add New Address" button (FAB or top button)
- Set default address toggle

**Interactions:**
- Tap address to select for current booking
- Swipe to delete
- Tap edit icon to modify

**Backend Requirements:**
- `GET /api/v1/customers/:id/addresses` - Fetch saved addresses
- `POST /api/v1/customers/:id/addresses` - Create new address
- `PUT /api/v1/customers/:id/addresses/:addressId` - Update address
- `DELETE /api/v1/customers/:id/addresses/:addressId` - Delete address

---

### Screen 19: Payment Methods
**Purpose:** Manage payment options  
**Navigation:** Accessible from Profile → "Payment Methods"  
**Key UI Elements:**
- List of saved payment methods (cards, mobile money)
- Each card shows: Last 4 digits, expiration, card type icon
- "Add Payment Method" button
- Set default payment method toggle

**Interactions:**
- Tap to select for current booking
- Swipe to delete
- Tap edit to update details

**Backend Requirements:**
- `GET /api/v1/customers/:id/payment-methods` - Fetch payment methods
- `POST /api/v1/customers/:id/payment-methods` - Add payment method
- `DELETE /api/v1/customers/:id/payment-methods/:methodId` - Remove payment method

---

### Screen 20: Order History
**Purpose:** View past orders and tasks  
**Navigation:** Accessible from Profile → "Order History"  
**Key UI Elements:**
- Tabbed interface: "All," "Deliveries," "Tasks," "Marketplace"
- List of orders with: Date, vendor/tasker name, status, total amount
- Search/filter options (date range, status)
- Pagination or infinite scroll

**Interactions:**
- Tap order to view details (Screen 21)
- Swipe to reorder (quick action)

**Backend Requirements:**
- `GET /api/v1/customers/:id/orders?status=&type=&page=` - Fetch order history with filters

---

### Screen 21: Order Detail
**Purpose:** View full information about a completed order  
**Navigation:** Tap order from Screen 20  
**Key UI Elements:**
- Order number and date
- Vendor/Tasker information (name, rating, contact)
- Items ordered (with quantities and prices)
- Delivery/task address
- Timeline of order status changes
- Total amount and payment method used
- Receipt download button
- "Reorder" button
- "Rate & Review" button (if not yet rated)

**Backend Requirements:**
- `GET /api/v1/orders/:orderId` - Fetch order details

---

### Screen 22: Referral & Rewards
**Purpose:** Track referrals and earned credits  
**Navigation:** Accessible from Profile → "Refer & Earn"  
**Key UI Elements:**
- Unique referral code (copy button)
- "Share Referral Link" button (SMS, WhatsApp, Email)
- Referral stats: Total invites, successful signups, credits earned
- List of referred users with status (pending, active, completed)
- Rewards balance and redemption history
- "How it works" explanation section

**Backend Requirements:**
- `GET /api/v1/customers/:id/referrals` - Fetch referral data
- `POST /api/v1/customers/:id/referrals/share` - Track referral share
- `GET /api/v1/customers/:id/rewards` - Fetch rewards balance

---

### Screen 23: Promo Code Entry
**Purpose:** Apply discount codes at checkout  
**Navigation:** Displayed on Checkout Screen (Screen 7)  
**Key UI Elements:**
- Text input field for promo code
- "Apply" button
- Discount amount display (if valid)
- "Remove" button (if applied)
- List of available promotions (expandable)

**Validation:**
- Code must be valid and not expired
- Code must be applicable to current order
- Code must not already be used (if single-use)

**Backend Requirements:**
- `POST /api/v1/promo-codes/validate` - Validate promo code
- `POST /api/v1/promo-codes/:codeId/apply` - Apply promo code to order

---

### Screen 24: Help & Support
**Purpose:** Access customer support and FAQ  
**Navigation:** Accessible from Profile → "Help & Support" or from Home → Help icon  
**Key UI Elements:**
- Tabbed interface: "FAQ," "Contact Support," "Chat with Support"
- **FAQ Tab:** Searchable list of common questions with expandable answers
- **Contact Support Tab:** Phone number, email, support hours
- **Chat Tab:** In-app support chat interface (similar to order chat)

**Backend Requirements:**
- `GET /api/v1/support/faqs` - Fetch FAQ list
- `POST /api/v1/support/tickets` - Create support ticket
- WebSocket for real-time support chat

---

### Screen 25: Account Settings
**Purpose:** Manage user preferences and account  
**Navigation:** Accessible from Profile → "Settings"  
**Key UI Elements:**
- **Preferences Section:**
  - Language selection (English for now)
  - Notification preferences (toggle for different notification types)
  - Privacy settings (data sharing, tracking)
- **Account Section:**
  - Email address (with change option)
  - Phone number (with change option)
  - Password/security (OTP settings)
- **Danger Zone:**
  - "Delete Account" button (with confirmation modal)
  - "Logout" button

**Backend Requirements:**
- `PUT /api/v1/users/:id/preferences` - Update user preferences
- `PUT /api/v1/users/:id/email` - Change email
- `DELETE /api/v1/users/:id` - Delete account

---

### Screen 26: Rating & Review
**Purpose:** Submit feedback after order/task completion  
**Navigation:** Appears after task completion or from Order Detail (Screen 21)  
**Key UI Elements:**
- Vendor/Tasker name and photo
- Star rating selector (1-5 stars)
- Text area for written review (optional)
- "Submit" button
- "Skip" button (optional)

**Validation:**
- At least 1 star must be selected
- Review text (if provided) must be at least 10 characters

**Backend Requirements:**
- `POST /api/v1/ratings` - Submit rating and review

---

## 4.3. Tasker App Screens (18 total)

### Core Screens (10 - Already Documented)
1. Tasker Home Screen
2. Job Offer Notification (Full-Screen)
3. Task Execution Screen
4. Navigation Screen
5. Chat Screen (with Tasker)
6. Earnings Dashboard
7. Earnings History
8. Profile Screen
9. Settings Screen
10. Support Screen

### Additional Tasker Screens (8 - New)

---

### Screen 27: Online/Offline Toggle
**Purpose:** Manage availability status  
**Navigation:** Persistent element on Tasker Home Screen (top bar or FAB)  
**Key UI Elements:**
- Large toggle switch: "Online" / "Offline"
- Current status display: "You're Online" / "You're Offline"
- Status indicator (green dot for online, gray for offline)
- Last active time (if offline)
- Optional: Reason for going offline (dropdown)

**Interactions:**
- Tap toggle to switch status
- Status persists across app sessions
- If float balance is zero, toggle is disabled with message: "Top up your float to go online"

**Backend Requirements:**
- `PUT /api/v1/taskers/:id/status` - Update online/offline status
- Real-time status update via WebSocket

---

### Screen 28: Task Acceptance/Rejection
**Purpose:** Respond to job offers  
**Navigation:** Full-screen modal when new job offer arrives  
**Key UI Elements:**
- Large "Accept" button (green, prominent)
- Large "Reject" button (red, secondary)
- Job details: Pickup location, dropoff location, estimated earnings, delivery type
- Timer showing how long offer is valid (e.g., "Expires in 30 seconds")
- Sound/vibration notification

**Interactions:**
- Swipe right to accept
- Swipe left to reject
- Tap buttons as alternative
- If no action taken within timeout, offer is auto-rejected

**Backend Requirements:**
- `POST /api/v1/tasks/:taskId/accept` - Accept job
- `POST /api/v1/tasks/:taskId/reject` - Reject job

---

### Screen 29: Pickup Confirmation
**Purpose:** Verify customer and location before pickup  
**Navigation:** After accepting job, before navigation  
**Key UI Elements:**
- Customer name and photo
- Pickup location with map preview
- "Verify Customer" button (optional: scan QR code or enter OTP)
- "Confirm Pickup" button
- "Cancel Job" button (with warning)

**Interactions:**
- Tap "Confirm Pickup" to proceed to navigation
- Tap "Cancel Job" to reject (may incur penalty)

**Backend Requirements:**
- `POST /api/v1/tasks/:taskId/pickup-confirmed` - Mark pickup as confirmed

---

### Screen 30: Substitution Request Screen
**Purpose:** Propose alternative items for errands  
**Navigation:** During task execution, if item unavailable  
**Key UI Elements:**
- Original item requested
- Suggested substitute item
- Reason for substitution (dropdown: "Out of stock," "Better alternative," etc.)
- Price comparison (if different)
- "Send Request" button
- "Try another item" button

**Interactions:**
- Tasker selects substitute and sends request
- Customer receives push notification with approval/rejection options
- Timeout: Auto-approve after 10 minutes if no response

**Backend Requirements:**
- `POST /api/v1/tasks/:taskId/substitution-request` - Submit substitution request
- WebSocket notification to customer

---

### Screen 31: Proof of Delivery
**Purpose:** Verify delivery completion  
**Navigation:** At dropoff location  
**Key UI Elements:**
- Recipient name and phone verification
- Photo capture button (camera icon)
- Signature pad (optional, for sensitive deliveries)
- OTP entry field (optional, if customer provided)
- "Confirm Delivery" button
- "Issue with delivery" button

**Interactions:**
- Tasker captures photo of delivery
- Tasker verifies recipient identity
- Tasker confirms delivery
- System marks task as completed

**Backend Requirements:**
- `POST /api/v1/tasks/:taskId/proof-of-delivery` - Submit proof (photo, signature, OTP)

---

### Screen 32: Incident Reporting
**Purpose:** Report accidents, theft, or customer misconduct  
**Navigation:** Accessible during or after task execution  
**Key UI Elements:**
- Incident type selector (dropdown: "Accident," "Theft," "Customer misconduct," "App issue," "Other")
- Description text area
- Photo/video upload (up to 3 files)
- Incident location (auto-populated from GPS)
- "Submit Report" button

**Interactions:**
- Tasker fills out incident details
- Tasker uploads evidence (photos/videos)
- Report is submitted to support team
- Tasker receives confirmation and ticket number

**Backend Requirements:**
- `POST /api/v1/incidents` - Create incident report
- File upload endpoint for evidence

---

### Screen 33: Ratings & Reviews Received
**Purpose:** View customer feedback  
**Navigation:** Accessible from Profile → "Ratings & Reviews"  
**Key UI Elements:**
- Average rating (large display: e.g., "4.8/5")
- Rating distribution (bar chart: 5 stars, 4 stars, etc.)
- List of recent reviews with: Customer name, rating, review text, date
- Filter options (rating, date range)

**Interactions:**
- Tap review to expand full text
- Scroll through review list

**Backend Requirements:**
- `GET /api/v1/taskers/:id/ratings` - Fetch ratings and reviews

---

### Screen 34: Badging & Leveling Screen
**Purpose:** Display current badge and progression  
**Navigation:** Accessible from Profile → "Badge & Level"  
**Key UI Elements:**
- Current badge display (Bronze, Silver, or Gold with icon)
- Badge description and benefits
- Progression bar showing progress to next level
- KPI breakdown showing how badge is calculated:
  - Acceptance rate
  - On-time rate
  - Completion rate
  - Average rating
  - Incident rate
- "How to level up" section with tips

**Interactions:**
- Tap badge to view details
- Tap KPI to see how to improve

**Backend Requirements:**
- `GET /api/v1/taskers/:id/badge` - Fetch current badge and progression

---

## 4.4. Vendor App Screens (13 total)

### Core Screens (8 - Already Documented)
1. Vendor Dashboard
2. Inventory Management
3. Order List
4. Order Detail
5. Order Pipeline (New → Preparing → Ready)
6. Sales Reports
7. Profile Screen
8. Settings Screen

### Additional Vendor Screens (5 - New)

---

### Screen 35: Vendor Onboarding
**Purpose:** Register new vendor  
**Navigation:** Accessed via admin dashboard or in-app link  
**Key UI Elements:**
- **Step 1: Business Information**
  - Business name
  - Business type (dropdown: Restaurant, Grocery, etc.)
  - Business registration number
  - Contact person name and phone
- **Step 2: Location**
  - Business address
  - Map picker for precise location
  - Delivery zones (multi-select)
- **Step 3: Bank Details**
  - Bank name
  - Account number
  - Account holder name
- **Step 4: Agreement**
  - Checkbox for terms & conditions
  - Checkbox for commission structure agreement

**Backend Requirements:**
- `POST /api/v1/vendors` - Create vendor account
- `POST /api/v1/vendors/:id/kyc` - Submit KYC documents

---

### Screen 36: Product Management
**Purpose:** Add, edit, delete products  
**Navigation:** Accessible from Vendor Dashboard → "Manage Products"  
**Key UI Elements:**
- List of products with: Name, category, price, availability status
- "Add Product" button (FAB)
- Search/filter by category
- Edit/delete buttons for each product

**Add/Edit Product Modal:**
- Product name
- Category selector
- Description
- Price
- Image upload (up to 5 images)
- Availability toggle
- Variants (if applicable)
- "Save" button

**Backend Requirements:**
- `GET /api/v1/vendors/:id/products` - Fetch product list
- `POST /api/v1/vendors/:id/products` - Create product
- `PUT /api/v1/vendors/:id/products/:productId` - Update product
- `DELETE /api/v1/vendors/:id/products/:productId` - Delete product

---

### Screen 37: Opening Hours Management
**Purpose:** Set store hours and delivery zones  
**Navigation:** Accessible from Vendor Dashboard → "Settings" → "Opening Hours"  
**Key UI Elements:**
- **Opening Hours Section:**
  - Day selector (Monday-Sunday)
  - Open time picker
  - Close time picker
  - "Closed" toggle for days off
- **Delivery Zones Section:**
  - Map showing current delivery zones
  - Add/remove zones
  - Delivery fee per zone

**Backend Requirements:**
- `PUT /api/v1/vendors/:id/opening-hours` - Update opening hours
- `PUT /api/v1/vendors/:id/delivery-zones` - Update delivery zones

---

### Screen 38: Commission & Fees Breakdown
**Purpose:** Display financial structure  
**Navigation:** Accessible from Vendor Dashboard → "Financials"  
**Key UI Elements:**
- **Commission Structure:**
  - Per-order commission percentage (e.g., 10%)
  - Subscription tier (Free, Basic, Premium)
  - Monthly subscription fee (if applicable)
- **Example Calculation:**
  - Order total: ZMW 100
  - Commission (10%): ZMW 10
  - Net earnings: ZMW 90
- **FAQ Section:** Explaining commission structure

**Backend Requirements:**
- `GET /api/v1/vendors/:id/commission-structure` - Fetch commission details

---

### Screen 39: Payout History
**Purpose:** View weekly/monthly payouts  
**Navigation:** Accessible from Vendor Dashboard → "Payouts"  
**Key UI Elements:**
- List of payouts with: Date, amount, status (Pending, Completed, Failed)
- Payout schedule (e.g., "Weekly on Fridays")
- Filter by date range
- "Request Payout" button
- Download receipt button

**Backend Requirements:**
- `GET /api/v1/vendors/:id/payouts` - Fetch payout history
- `POST /api/v1/vendors/:id/payouts/request` - Request payout

---

## 4.5. Cross-Functional Screens (5 total)

---

### Screen 40: Dispute Center
**Purpose:** Submit and track disputes  
**Navigation:** Accessible from Profile → "Help & Support" → "Disputes"  
**Key UI Elements:**
- List of disputes with: Order ID, status (Open, In Review, Resolved), date
- "Create New Dispute" button
- Tap dispute to view details

**Dispute Detail Screen:**
- Order information
- Issue description
- Evidence section (chat logs, photos, receipts)
- "Add Evidence" button
- Status timeline
- Support team response (if available)

**Backend Requirements:**
- `GET /api/v1/disputes` - Fetch dispute list
- `POST /api/v1/disputes` - Create dispute
- `POST /api/v1/disputes/:id/evidence` - Add evidence

---

### Screen 41: Shopping List Management
**Purpose:** Create and reuse shopping lists  
**Navigation:** Accessible during "Do a Task" (Errand) workflow  
**Key UI Elements:**
- **Shopping List Creation:**
  - Text area for items (one per line)
  - "Add from previous lists" button (dropdown with saved lists)
  - "Save this list" toggle
  - List name input (if saving)
- **Shopping List View:**
  - Checklist of items
  - Add/remove items
  - Estimated cost (user-entered)

**Backend Requirements:**
- `GET /api/v1/customers/:id/shopping-lists` - Fetch saved lists
- `POST /api/v1/customers/:id/shopping-lists` - Save new list
- `PUT /api/v1/shopping-lists/:id` - Update list

---

### Screen 42: Real-Time Notifications
**Purpose:** View all notifications in one place  
**Navigation:** Tap bell icon on Home Screen  
**Key UI Elements:**
- Tabbed interface: "All," "Orders," "Promotions," "System"
- List of notifications with: Icon, title, description, timestamp
- Mark as read/unread
- Delete notification
- Tap notification to navigate to relevant screen

**Backend Requirements:**
- `GET /api/v1/notifications` - Fetch notification list
- `PUT /api/v1/notifications/:id/read` - Mark as read

---

### Screen 43: Substitution Approval Modal
**Purpose:** Approve/reject substitutions during errands  
**Navigation:** Triggered by push notification  
**Key UI Elements:**
- Original item requested
- Suggested substitute
- Reason for substitution
- Price comparison
- "Approve" button (green)
- "Reject" button (red)
- "Chat with Tasker" button
- Timer showing time remaining for decision

**Backend Requirements:**
- `POST /api/v1/tasks/:taskId/substitution/approve` - Approve substitution
- `POST /api/v1/tasks/:taskId/substitution/reject` - Reject substitution

---

### Screen 44: Cancellation Confirmation Modal
**Purpose:** Confirm order/task cancellation  
**Navigation:** Triggered by user tapping "Cancel" on active order  
**Key UI Elements:**
- "Are you sure?" message
- Reason selector (dropdown: "Changed my mind," "Found alternative," "Item unavailable," etc.)
- Cancellation policy display (e.g., "Free to cancel before tasker pickup")
- "Confirm Cancellation" button (red)
- "Keep Order" button (gray)

**Backend Requirements:**
- `POST /api/v1/tasks/:taskId/cancel` - Cancel task

---

## 4.6. Component Library & Reusable Patterns

To accelerate development and ensure consistency, the following components should be built as reusable modules:

| Component | Usage | Examples |
| :--- | :--- | :--- |
| **Modal Dialog** | Confirmations, alerts, substitution approvals, cancellations | "Are you sure?" modals, error alerts |
| **Bottom Sheet** | Filters, sorting, action menus | Filter orders by status, sort by date |
| **Card Component** | Order summaries, product listings, ratings | Order card, product card, review card |
| **Tabs** | Navigation between related sections | "All Orders," "Active," "History" |
| **Badge** | Status indicators, rider levels, order status | "Accepted," "In Progress," "Bronze Level" |
| **Progress Indicator** | Multi-step forms, task status | Checkout progress, onboarding steps |
| **Floating Action Button (FAB)** | Quick actions | Online/offline toggle, add address |
| **Swipe Gesture** | Accept/reject, confirm delivery, navigate | Swipe to accept job, swipe to confirm delivery |
| **Map Component** | Live tracking, location selection, delivery routes | Live tracking map, location picker |
| **Chat Bubble** | In-app messaging | Customer-tasker chat |
| **Notification Banner** | Alerts, status updates, promotions | "Order accepted," "Promo available" |
| **Star Rating** | Feedback collection | Rate order, rate tasker |
| **Toggle Switch** | Boolean settings | Online/offline, notifications on/off |
| **Dropdown/Select** | Option selection | Reason for cancellation, incident type |
| **Text Input** | Data entry | Search, promo code, message |
| **Checkbox** | Multiple selections | Accept terms, select delivery zones |
| **Radio Button** | Single selection | Role selection, payment method |

---

## 4.7. User Flow Diagrams

### Customer Booking Flow (Marketplace)
```
Home Screen 
  → Tap "Marketplace" 
  → Browse Categories/Stores 
  → Select Store 
  → Browse Products 
  → Add to Cart 
  → Tap "Checkout" 
  → Cart Screen (Review items) 
  → Tap "Proceed to Checkout" 
  → Checkout Screen (Address, payment) 
  → Tap "Place Order" 
  → Order Confirmation 
  → Active Order Screen (Live tracking)
```

### Tasker Job Acceptance Flow
```
Tasker Home (Online) 
  → Job Offer Notification (Full-screen) 
  → Tap "Accept" or Swipe Right 
  → Pickup Confirmation Screen 
  → Tap "Confirm Pickup" 
  → Navigation to Pickup Location 
  → Arrive at Pickup 
  → Chat/Call Customer (if needed) 
  → Confirm Pickup 
  → Navigate to Dropoff 
  → Arrive at Dropoff 
  → Proof of Delivery Screen 
  → Tap "Confirm Delivery" 
  → Task Completed 
  → Rating Screen
```

### Errand Booking Flow
```
Home Screen 
  → Tap "Do a Task" 
  → Select Errand Category 
  → Describe Task & Add Checklist 
  → Tap "Next" 
  → Location & Commitment Screen 
  → Toggle "Requires Money" (if applicable) 
  → Enter Commitment Amount 
  → Tap "Confirm Task" 
  → Finalize & Pay Screen 
  → Select Payment Method 
  → Tap "Book Tasker" 
  → Finding Tasker Screen 
  → Tasker Assigned 
  → Active Task Screen (Live tracking, chat)
```

---

## 4.8. Accessibility Guidelines

All screens must comply with **WCAG 2.1 AA** standards:

- **Text Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Touch Targets:** Minimum 48x48 dp (device-independent pixels)
- **Font Size:** Minimum 12 sp (scalable pixels) for body text
- **Color Not Sole Indicator:** Do not rely on color alone to convey information
- **Keyboard Navigation:** All interactive elements must be keyboard accessible
- **Screen Reader Support:** All UI elements must have appropriate labels and descriptions
- **Focus Indicators:** Clear visual focus indicators for keyboard navigation
- **Motion:** Avoid excessive animations; provide option to reduce motion

---

## 4.9. Screen Count Summary

| Category | Count |
| :--- | :--- |
| Authentication & Onboarding | 8 |
| Customer App | 23 |
| Tasker App | 18 |
| Vendor App | 13 |
| Cross-Functional | 5 |
| **TOTAL** | **79** |

