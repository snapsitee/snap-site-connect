

# Renewal System Implementation Plan

## Overview
This plan implements a complete renewal system with:
1. Renewal checkout flow using the monthly fee (not setup fee)
2. A separate `renewals` database table
3. A "Renewals" tab in the admin dashboard
4. Dynamic pricing that reflects admin changes

---

## Database Changes

### 1. Create `renewals` Table
A new table to store all renewal transactions separately from initial orders:

```text
renewals table structure:
+------------------------+------------------+------------------------------------------+
| Column                 | Type             | Notes                                    |
+------------------------+------------------+------------------------------------------+
| id                     | uuid (PK)        | Auto-generated                           |
| renewal_id             | text             | Generated like orders: "RNW-XXXXXX"      |
| original_order_id      | text             | Links to the original order's order_id   |
| full_name              | text             | Customer name                            |
| business_name          | text             | Business name                            |
| email                  | text             | Email                                    |
| phone                  | text             | Phone                                    |
| whatsapp               | text             | WhatsApp number                          |
| renewal_fee            | integer          | Amount paid (from pricing.monthly_fee)   |
| payment_method         | text             | Vodafone Cash / InstaPay                 |
| receipt_url            | text             | Receipt image URL                        |
| coupon_code            | text (nullable)  | Applied coupon                           |
| coupon_discount        | integer          | Discount amount                          |
| status                 | enum             | pending, confirmed, rejected             |
| created_at             | timestamp        | When renewal was submitted               |
+------------------------+------------------+------------------------------------------+
```

### 2. Create Renewal Status Enum
```sql
CREATE TYPE renewal_status AS ENUM ('pending', 'confirmed', 'rejected');
```

### 3. Generate Renewal ID Function
Similar to orders, auto-generate IDs like "RNW-ABC123"

### 4. RLS Policies
- Anyone can insert renewals (public checkout)
- Admins can view, update, and delete all renewals

---

## Frontend Changes

### 1. Update Subscribe.tsx (Renewal Flow)
- When `isRenewal=true`, fetch `monthly_fee` from pricing table as the base fee
- Remove add-ons section for renewals (already covered in original order)
- Add an input field to enter the original order ID

### 2. Update CartStep.tsx
- Already handles `isRenewal` prop
- Fix: For renewals, use `monthlyFee` (not `setupFee`) as the base price
- Keep coupon functionality (applies to renewal fee)

### 3. Update PaymentStep.tsx
- No changes needed (already works for both flows)

### 4. Update FormStep.tsx
- For renewals: Insert into `renewals` table instead of updating `orders`
- Remove website requirements field for renewals (already exists)
- Add original order ID input field

### 5. Create RenewalsTable.tsx (Admin Component)
Similar to SubscribersTable but for renewals:
- Display all renewal submissions
- Search by renewal ID, original order ID, name
- Filter by status (pending, confirmed, rejected)
- View receipt
- Confirm/reject renewals
- When confirmed, optionally update the original order's renewal_date

### 6. Update AdminDashboard.tsx
- Add "Renewals" tab with RefreshCw icon
- Wire up the RenewalsTable component

---

## Implementation Steps

### Step 1: Database Migration
- Create `renewal_status` enum
- Create `renewals` table with all columns
- Create trigger to auto-generate `renewal_id`
- Add RLS policies for public insert and admin management

### Step 2: Update Subscribe Page Flow
Modify `Subscribe.tsx`:
- Fetch `monthly_fee` for renewal pricing
- Pass correct fee to CartStep

### Step 3: Update CartStep Component
- Ensure renewal flow displays "Renewal Fee" correctly
- Base calculations on `monthlyFee` for renewals

### Step 4: Update FormStep Component
- Add original order ID input field for renewals
- Insert into `renewals` table when `isRenewal=true`
- Remove website requirements for renewals

### Step 5: Create RenewalsTable Admin Component
- Build table with search, filters, status management
- Add receipt preview modal
- Add confirm/reject actions with status updates
- Export functionality

### Step 6: Add Renewals Tab to Admin Dashboard
- Import RenewalsTable
- Add tab with RefreshCw icon in the tabs array
- Render component when tab is active

---

## Technical Details

### Pricing Logic
```typescript
// In Subscribe.tsx
const baseSetupFee = isRenewal 
  ? pricingData.monthly_fee  // Renewal uses monthly fee
  : pricingData.setup_fee;   // New order uses setup fee
```

### Renewal Form Submission
```typescript
// In FormStep.tsx for renewals
const { data, error } = await supabase
  .from('renewals')
  .insert([{
    original_order_id: originalOrderId,
    full_name: formData.fullName,
    business_name: formData.businessName,
    email: formData.email,
    phone: formData.phone,
    whatsapp: formData.whatsapp,
    renewal_fee: orderData.setupFee, // This will be the monthly fee
    payment_method: orderData.paymentMethod,
    receipt_url: orderData.receiptUrl,
    coupon_code: orderData.couponCode || null,
    coupon_discount: orderData.couponDiscount || 0,
    status: 'pending',
  }])
  .select('renewal_id')
  .single();
```

### Admin Renewal Management
When admin confirms a renewal:
1. Update renewal status to 'confirmed'
2. Optionally update the original order's `subscription_status` to 'renewed'
3. Optionally extend the `renewal_date` by 30 days

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| Database migration | Create | New renewals table and policies |
| `src/pages/Subscribe.tsx` | Modify | Fix renewal pricing logic |
| `src/components/subscribe/CartStep.tsx` | Modify | Minor adjustments for clarity |
| `src/components/subscribe/FormStep.tsx` | Modify | Add order ID input, save to renewals |
| `src/components/admin/RenewalsTable.tsx` | Create | New admin component |
| `src/components/admin/AdminDashboard.tsx` | Modify | Add renewals tab |

