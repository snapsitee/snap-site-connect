

## Welcome Popup Feature

### What We're Building
A customizable welcome popup that appears when visitors land on the website. Fully controlled from the admin dashboard with options to toggle visibility, include a coupon code with a copy button, and customize title and description text (both English and Arabic).

### Database Changes
Create a new `popup_settings` table:
- `id` (uuid, primary key)
- `is_active` (boolean) — controls whether popup shows
- `title_en` (text) — English title
- `title_ar` (text) — Arabic title
- `description_en` (text) — English description
- `description_ar` (text) — Arabic description
- `include_coupon` (boolean) — whether to show a coupon code
- `coupon_code` (text, nullable) — the coupon code to display
- `updated_at` (timestamp)

RLS: Anyone can SELECT (public-facing), only admins can UPDATE.

Seed one default row with `is_active = false`.

### Frontend Components

**1. `WelcomePopup` component** (`src/components/WelcomePopup.tsx`)
- Fetches `popup_settings` on mount
- If `is_active` is false, renders nothing
- Uses `sessionStorage` to only show once per session
- Dialog with X close button
- Shows title and description based on current language
- If `include_coupon` is true and `coupon_code` is set, shows the code with a copy-to-clipboard button (same style as the payment checkout copy button with Copy/Check icon toggle)

**2. `PopupSettingsManager` component** (`src/components/admin/PopupSettingsManager.tsx`)
- Toggle switch for popup active/inactive
- Input fields for title (EN/AR) and description (EN/AR)
- Toggle for include coupon
- Conditional input for coupon code (shown only when include coupon is on)
- Save button that updates the `popup_settings` table

**3. Integration**
- Add `WelcomePopup` to `Index.tsx` (homepage only)
- Add "Popup" tab to `AdminDashboard.tsx` with a `Megaphone` icon

### Technical Details
- Copy button reuses the same Copy → Check icon pattern from `PaymentStep.tsx`
- Popup uses the existing `Dialog` component for consistent styling
- `sessionStorage` key `popup_dismissed` prevents repeat showing during same session

