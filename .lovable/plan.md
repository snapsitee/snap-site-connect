

## Password Reset Functionality Implementation

This plan adds a complete password reset flow that allows users to recover their accounts when they forget their passwords.

---

### Overview

The implementation consists of three main parts:
1. **Forgot Password Request** - A form where users enter their email to receive a reset link
2. **Password Reset Page** - A page where users set their new password after clicking the email link
3. **UI Integration** - Adding a "Forgot Password?" link to the login form

---

### User Flow

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PASSWORD RESET FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. User clicks "Forgot Password?"                                          │
│         ↓                                                                   │
│  2. Enters email address                                                    │
│         ↓                                                                   │
│  3. System sends reset link via email                                       │
│         ↓                                                                   │
│  4. User clicks link in email                                               │
│         ↓                                                                   │
│  5. Redirected to /reset-password page                                      │
│         ↓                                                                   │
│  6. Enters new password (with confirmation)                                 │
│         ↓                                                                   │
│  7. Password updated, redirected to dashboard                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Implementation Details

#### 1. Update Auth Page with Forgot Password View

**File:** `src/pages/Auth.tsx`

- Add a new state `view` to track: `'login' | 'signup' | 'forgot-password'`
- Add forgot password form with email input only
- Implement `supabase.auth.resetPasswordForEmail()` with redirect URL pointing to `/reset-password`
- Show success message after sending the reset email
- Add bilingual support (Arabic/English) for all new text

#### 2. Create Reset Password Page

**File:** `src/pages/ResetPassword.tsx` (new file)

- Form with new password and confirm password fields
- Validate password match and minimum length (6 characters)
- Use `supabase.auth.updateUser({ password })` to set the new password
- Listen for `PASSWORD_RECOVERY` event in `onAuthStateChange` to detect when user arrives from email link
- Show success message and redirect to dashboard after successful reset
- Full bilingual support matching existing design

#### 3. Add Route for Reset Password

**File:** `src/App.tsx`

- Add new route: `/reset-password` pointing to the ResetPassword component

#### 4. Bilingual Text Additions

All new UI elements will support both English and Arabic:

| Key | English | Arabic |
|-----|---------|--------|
| Forgot Password? | "Forgot your password?" | "نسيت كلمة المرور؟" |
| Reset Password | "Reset Password" | "إعادة تعيين كلمة المرور" |
| Enter email | "Enter your email to receive a reset link" | "أدخل بريدك الإلكتروني لاستلام رابط إعادة التعيين" |
| Send Reset Link | "Send Reset Link" | "إرسال رابط إعادة التعيين" |
| Email Sent | "Reset link sent! Check your email." | "تم إرسال الرابط! تحقق من بريدك الإلكتروني." |
| New Password | "New Password" | "كلمة المرور الجديدة" |
| Confirm Password | "Confirm Password" | "تأكيد كلمة المرور" |
| Passwords don't match | "Passwords don't match" | "كلمات المرور غير متطابقة" |
| Back to Login | "Back to Login" | "العودة لتسجيل الدخول" |

---

### Technical Details

#### Supabase Auth Methods Used

```typescript
// Request password reset email
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
});

// Update password after user clicks email link
await supabase.auth.updateUser({ password: newPassword });

// Detect password recovery event
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    // User arrived from password reset email
  }
});
```

#### Validation Schema (using Zod)

```typescript
const resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

---

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Auth.tsx` | Modify | Add forgot password form and "Forgot password?" link |
| `src/pages/ResetPassword.tsx` | Create | New page for setting new password |
| `src/App.tsx` | Modify | Add `/reset-password` route |

---

### Security Considerations

- Email validation using Zod before sending reset request
- Password minimum length of 6 characters (matching existing signup requirements)
- Password confirmation field to prevent typos
- Reset tokens are handled securely by Supabase (expire after use)
- No sensitive information logged to console

