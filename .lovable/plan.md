

# Implementation Plan: Complete Subscribe/Payment System with Client Dashboard

**STATUS: ✅ IMPLEMENTED**

This plan outlines the implementation of a comprehensive subscription and payment system, client authentication, client dashboard, and enhanced admin dashboard for SnapSite.

---

## Overview - COMPLETED

The implementation will add:
1. **Multi-step subscription/payment flow** with add-ons
2. **Egyptian payment methods** (Instapay & Vodafone Cash) with QR codes
3. **Client authentication system** (signup/login)
4. **Client dashboard** to view websites and renewals
5. **Enhanced admin dashboard** with subscribers management
6. **Order tracking system** with unique Order IDs

---

## Phase 1: Database Schema

### New Tables Required

**1. `orders` table** - Core subscription orders
- `id` (uuid, primary key)
- `order_id` (text, unique) - Human-readable format: SNP-XXXXXX
- `user_id` (uuid, references auth.users)
- `full_name`, `business_name`, `email`, `phone`, `whatsapp` (text)
- `website_requirements` (text)
- `setup_fee`, `monthly_fee` (integer)
- `custom_domain_addon` (boolean, default false)
- `business_email_addon` (boolean, default false)
- `addon_total` (integer)
- `subscription_status` (enum: pending, active, suspended, expired, renewed, didnt_renew, fake_order)
- `project_status` (enum: received, in_progress, delivered)
- `website_status` (enum: live, disabled, maintenance, paused)
- `start_date`, `renewal_date` (timestamp)
- `payment_method` (text)
- `receipt_url` (text) - URL to uploaded receipt in storage
- `created_at`, `updated_at` (timestamps)

**2. `payment_settings` table** - Admin-configurable payment accounts
- `id` (uuid, primary key)
- `instapay_account_number`, `instapay_username`, `instapay_link` (text)
- `instapay_qr_url` (text)
- `vodafone_number`, `vodafone_link`, `vodafone_qr_url` (text)
- `paypal_email` (text)
- `updated_at` (timestamp)

**3. `addon_settings` table** - Admin-configurable add-on prices
- `id` (uuid, primary key)
- `custom_domain_price` (integer, default 2000)
- `custom_domain_enabled` (boolean, default true)
- `business_email_price` (integer, default 4000)
- `business_email_enabled` (boolean, default true)
- `updated_at` (timestamp)

**4. `profiles` table** - Client profile data
- `id` (uuid, primary key, references auth.users)
- `full_name` (text)
- `phone`, `whatsapp` (text)
- `created_at`, `updated_at` (timestamps)

### Enums to Create
```sql
CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'suspended', 'expired', 'renewed', 'didnt_renew', 'fake_order');
CREATE TYPE project_status AS ENUM ('received', 'in_progress', 'delivered');
CREATE TYPE website_status AS ENUM ('live', 'disabled', 'maintenance', 'paused');
```

### Storage Bucket
- Create `receipts` bucket for payment receipt uploads
- Public read access, authenticated write access

### RLS Policies
- Clients can only view their own orders and profile
- Admins can view/update all orders
- Anyone can insert orders (for checkout flow before auth)
- Authenticated users can upload receipts

---

## Phase 2: File Storage Setup

### Receipt Upload Storage
- Create a `receipts` storage bucket
- Store payment receipts with path: `{order_id}/{filename}`
- Generate signed URLs for admin preview

### QR Code Images
- Copy uploaded QR images to `src/assets/` folder:
  - `instapay-qr.jpeg`
  - `vodafone-qr.jpeg`

---

## Phase 3: Frontend - Subscription Flow

### New Pages

**1. `/subscribe` - Multi-Step Subscription Flow**

**Step 1: Cart/Review**
- Display setup fee from pricing table
- Show optional add-ons with checkboxes:
  - Custom domain (2000 EGP/year)
  - Business email (4000 EGP/year)
- Calculate and show order summary
- "Continue to Payment" button

**Step 2: Payment Method Selection**
- Three payment options:
  - Instapay (Egypt)
  - Vodafone Cash (Egypt)
- For Instapay: Show QR code, account details, copy buttons
- For Vodafone: Show QR code, number, copy buttons
- Receipt upload field (image)
- "Continue" button

**Step 3: Subscription Form**
- Full Name
- Business Name
- Email
- Phone
- WhatsApp
- Website Requirements (textarea)
- "Pay & Subscribe" button

**Success Page**
- Bilingual success message with casual tone
- Display Order ID
- Show next steps message

### Components to Create
- `src/pages/Subscribe.tsx` - Main subscription page
- `src/components/subscribe/CartStep.tsx`
- `src/components/subscribe/PaymentStep.tsx`
- `src/components/subscribe/FormStep.tsx`
- `src/components/subscribe/SuccessStep.tsx`
- `src/components/subscribe/PaymentMethodCard.tsx`
- `src/components/subscribe/QRCodeDisplay.tsx`

---

## Phase 4: Client Authentication

### Auth Pages

**1. `/auth` - Client Login/Signup**
- Email/password authentication
- Signup with email confirmation (auto-confirm enabled)
- Clean, branded design matching site theme
- Redirect to client dashboard after login
- NO visible link to admin - admin access only via `/admin`

### Components
- `src/pages/Auth.tsx` - Client authentication page
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/SignupForm.tsx`

### Auth Flow
- Use Supabase Auth with email/password
- Store user profile in `profiles` table on signup
- Redirect authenticated users to `/dashboard`

---

## Phase 5: Client Dashboard

### New Page: `/dashboard`

**Features:**
- List of client's websites/orders
- For each order show:
  - Order ID
  - Business name
  - Website status (badge)
  - Days until renewal (countdown)
  - Subscription status (badge)
  - "Renew / تجديد" button

**Renewal Flow:**
- Click "Renew" redirects to payment flow
- Monthly renewal price: 500 EGP
- After payment, status updates to "Renewed"
- If not renewed, becomes "Didn't Renew"

### Components
- `src/pages/Dashboard.tsx` - Client dashboard
- `src/components/dashboard/OrderCard.tsx`
- `src/components/dashboard/RenewalButton.tsx`
- `src/components/dashboard/StatusBadge.tsx`

---

## Phase 6: Enhanced Admin Dashboard

### New Tab: Subscribers

**Columns:**
- Order ID (searchable)
- Client Name
- Business Name
- Phone
- WhatsApp (clickable)
- Subscription Status (badge)
- Project Status (badge)
- Website Status (badge)
- Start Date
- Renewal Date
- Receipt (preview button)

**Filters:**
- Filter by subscription status
- Filter by project status
- Filter by website status
- Filter by order id

**Actions:**
- Update any status
- View receipt image (modal)
- Contact via WhatsApp
- Download as CSV

**Alerts:**
- Highlight upcoming renewals (within 7 days)
- Alert for expired subscriptions
- Visual indicators for overdue renewals

### New Tab: Payment Settings

Allow admin to configure:
- Instapay: Account number, username, link, QR code image
- Vodafone Cash: Number, link, QR code image
- PayPal email
- Upload new QR code images

### New Tab: Add-on Settings

Allow admin to:
- Enable/disable custom domain add-on
- Set custom domain price
- Enable/disable business email add-on
- Set business email price

### Components to Create/Modify
- `src/components/admin/SubscribersTable.tsx`
- `src/components/admin/PaymentSettingsManager.tsx`
- `src/components/admin/AddonSettingsManager.tsx`
- `src/components/admin/ReceiptPreviewModal.tsx`
- `src/components/admin/StatusDropdown.tsx`
- Update `AdminDashboard.tsx` with new tabs

---

## Phase 7: Translations

Add all new translation keys to `LanguageContext.tsx`:

**Subscribe Flow:**
- `subscribe.title`, `subscribe.stepCart`, `subscribe.stepPayment`, `subscribe.stepForm`
- `subscribe.setupFee`, `subscribe.addons`, `subscribe.customDomain`, `subscribe.businessEmail`
- `subscribe.perYear`, `subscribe.total`, `subscribe.continue`, `subscribe.paySubscribe`
- `subscribe.selectPayment`, `subscribe.uploadReceipt`, `subscribe.receiptHint`
- `subscribe.success.title`, `subscribe.success.message`

**Payment Methods:**
- `payment.paypal`, `payment.instapay`, `payment.vodafone`
- `payment.accountNumber`, `payment.username`, `payment.copyLink`, `payment.copyNumber`

**Client Dashboard:**
- `dashboard.title`, `dashboard.myWebsites`, `dashboard.orderID`
- `dashboard.daysLeft`, `dashboard.renew`, `dashboard.noOrders`

**Admin Dashboard:**
- `admin.subscribers`, `admin.paymentSettings`, `admin.addonSettings`
- `admin.orderId`, `admin.businessName`, `admin.subscriptionStatus`
- `admin.projectStatus`, `admin.websiteStatus`, `admin.startDate`, `admin.renewalDate`
- `admin.viewReceipt`, `admin.upcomingRenewals`, `admin.expiredAlert`

**Status Labels (bilingual):**
- Subscription: pending, active, suspended, expired, renewed, didnt_renew, fake_order
- Project: received, in_progress, delivered
- Website: live, disabled, maintenance, paused

---

## Phase 8: Navigation Updates

### Navbar Changes
- Add "Login" / "تسجيل الدخول" button for clients
- If logged in, show "Dashboard" / "لوحة التحكم"
- NO admin link visible anywhere

### Pricing Section
- Update "Subscribe Now" button to navigate to `/subscribe`

---

## Phase 9: Order ID Generation

### Format
- Pattern: `SNP-XXXXXX` (e.g., SNP-A3B9F2)
- 6 alphanumeric characters after prefix
- Unique constraint in database

### Implementation
- Database function or trigger to auto-generate on insert
- Alternatively, generate client-side with collision check

---

## Technical Considerations

### Security
- RLS policies on all new tables
- Authenticated routes for client dashboard
- Admin-only access for subscribers management
- Secure file uploads with size/type validation

### Performance
- Index on `order_id` for fast searches
- Index on `user_id` for client dashboard queries
- Pagination for large subscriber lists

### File Uploads
- Max 5MB for receipt images
- Accept: JPEG, PNG, PDF
- Store in Supabase Storage, save URL in database

---

## Implementation Order

1. Database migrations (tables, enums, storage)
2. Copy QR code images to assets
3. Payment settings and addon settings tables + admin UI
4. Subscribe page with multi-step flow
5. Client authentication (auth page)
6. Client dashboard
7. Subscribers table in admin
8. Translations for all new features
9. Navigation updates
10. Testing and refinement

---

## Files to Create

```text
src/pages/Subscribe.tsx
src/pages/Auth.tsx
src/pages/Dashboard.tsx
src/components/subscribe/CartStep.tsx
src/components/subscribe/PaymentStep.tsx
src/components/subscribe/FormStep.tsx
src/components/subscribe/SuccessStep.tsx
src/components/subscribe/PaymentMethodCard.tsx
src/components/subscribe/QRCodeDisplay.tsx
src/components/auth/LoginForm.tsx
src/components/auth/SignupForm.tsx
src/components/dashboard/OrderCard.tsx
src/components/dashboard/RenewalButton.tsx
src/components/dashboard/StatusBadge.tsx
src/components/admin/SubscribersTable.tsx
src/components/admin/PaymentSettingsManager.tsx
src/components/admin/AddonSettingsManager.tsx
src/components/admin/ReceiptPreviewModal.tsx
src/components/admin/StatusDropdown.tsx
src/assets/instapay-qr.jpeg (copy from upload)
src/assets/vodafone-qr.jpeg (copy from upload)
```

## Files to Modify

```text
src/App.tsx (add routes)
src/contexts/LanguageContext.tsx (add translations)
src/components/Navbar.tsx (add login/dashboard links)
src/components/admin/AdminDashboard.tsx (add new tabs)
src/components/sections/PricingSection.tsx (update CTA)
```

