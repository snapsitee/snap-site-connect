
# Multi-Step Subscription Wizard

## Overview
Transform the current single-page subscription form into a 4-step wizard with add-ons selection, coupon code, payment method, contact form, and confirmation screen.

---

## Step-by-Step Flow

### Step 1: Add-ons & Coupon
- **Custom Domain Add-on**: Toggle to add custom domain instead of `.snapsitee.com` for 2,000 EGP/year
- **Business Email Add-on**: Toggle to add professional business email for 4,000 EGP/year
- **Coupon Code Input**: Text field to enter discount codes with "Apply" button
  - Real-time validation against `coupons` table
  - Show discount amount when valid code applied
- **Price Summary**: Dynamic display showing base fee + add-ons - discount = total
- Note: Add-ons step only shown for new subscriptions, not renewals

### Step 2: Payment Method
- **Payment Method Selection**: Choose between Instapay or Vodafone Cash
- **Payment Details Display**: QR code + account number with copy button
- **Payment Link Button**: Opens payment app directly
- **Receipt Upload**: Mandatory file upload for payment proof

### Step 3: Contact Form
- **Full Name** (required)
- **Business Name** (required)
- **Email** (required)
- **Phone** (required)
- **WhatsApp** (required)
- **Website Edits / Requirements** (required) - renamed and made mandatory
- For renewals: Show **Original Order ID** field instead of add-ons

### Step 4: Confirmation Screen
- Success animation with checkmark
- Display Order ID (SNP-XXXXXX) or Renewal ID (RNW-XXXXXX)
- Order summary with all details
- "Go Home" button

---

## Progress Indicator
- Visual stepper showing all 4 steps
- Current step highlighted
- Previous steps marked as complete
- Step titles: "Add-ons" > "Payment" > "Details" > "Done"

---

## Renewal Flow Differences
- Skip Step 1 (add-ons) - go directly to payment
- Show "Original Order ID" field in contact form
- Validate order ID exists before submission

---

## Technical Details

### Files to Create
1. `src/components/subscribe/StepIndicator.tsx` - Progress stepper component
2. `src/components/subscribe/AddonsStep.tsx` - Step 1: Add-ons and coupon selection
3. `src/components/subscribe/PaymentStep.tsx` - Step 2: Payment method and receipt
4. `src/components/subscribe/DetailsStep.tsx` - Step 3: Contact form
5. `src/components/subscribe/ConfirmationStep.tsx` - Step 4: Success screen

### Files to Modify
1. `src/pages/Subscribe.tsx` - Orchestrate wizard flow with state management
2. `src/components/admin/SubscribersTable.tsx` - Add website requirements column/display

### State Management
```text
+-------------------+
|   Subscribe.tsx   |
+-------------------+
| - currentStep     |
| - formData        |
| - selectedAddons  |
| - couponData      |
| - paymentMethod   |
| - receiptFile     |
| - pricing         |
+-------------------+
         |
         v
+--------+--------+--------+--------+
| Step 1 | Step 2 | Step 3 | Step 4 |
| Addons | Pay    | Form   | Done   |
+--------+--------+--------+--------+
```

### Coupon Validation Logic
1. User enters coupon code
2. Query `coupons` table for active coupon matching code
3. If valid: Calculate discount (percentage or fixed) on setup fee only
4. Display applied discount in price summary
5. Store coupon_code and coupon_discount for order submission

### Database Interactions
- Read: `addon_settings`, `pricing`, `payment_settings`, `coupons`
- Write: `orders` (new subscriptions), `renewals` (renewals)
- Storage: Upload receipt to `receipts` bucket

### Admin Dashboard Update
- Add "Website Edits / Requirements" display in order details dialog
- Show requirements in a readable text block format

---

## User Experience Enhancements
- Smooth animations between steps using Framer Motion
- Back/Next navigation buttons
- Form validation before advancing
- Persistent state if user goes back
- Mobile-responsive design
- RTL support for Arabic language
