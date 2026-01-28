

# SnapSite - Bilingual SaaS Web Platform

## Project Overview
Building a premium, dark-themed, fully bilingual (Arabic/English) SaaS platform for a web design subscription service. The platform includes a public-facing website and a secure admin dashboard for lead management and pricing control.

---

## 🎨 Design Foundation

**Theme & Styling:**
- Dark mode only with deep black/gray backgrounds
- Primary gradient: Purple (#DC18EE) → Blue (#1E8CED)
- White and soft gray typography
- Premium SaaS aesthetic inspired by the reference designs
- Smooth animations and transitions
- Glass morphism effects for cards and components

**Bilingual System:**
- Language context provider for AR/EN switching
- RTL layout support for Arabic
- Language switcher in navigation (globe icon with AR/EN toggle)
- All text content stored in translation files

---

## 📱 Frontend Website

### Navigation Bar
- SnapSite logo (using provided White.png)
- Language switcher (AR/EN)
- Smooth scroll links to sections
- "Get Started" CTA button with gradient

### Section 1: Hero
- Bold headline with gradient text effect
- English: "Bridging the gap between creative design and technical implementation"
- Arabic: "نقوم بسد الفجوة بين التصميم الإبداعي والتنفيذ التقني"
- Subheading about subscription-based websites
- Two CTA buttons: "Get Started" & "View Pricing"
- Abstract gradient glow background effect

### Section 2: How SnapSite Works
- 3-step process with animated icons
- Step 1: Submit your request / ابعت طلبك
- Step 2: We design & build / نُصمم ونُنفذ
- Step 3: Launch & maintain / نُطلق ونُتابع
- "No long-term contracts" badge

### Section 3: Why Choose SnapSite
- Feature cards with icons in a grid layout
- Fast delivery, Subscription pricing, No upfront costs
- Professional UI, Ongoing support
- Hover effects with gradient borders

### Section 4: What You Get
- Clean list/card layout showing deliverables
- Custom website, Responsive design, Hosting included
- Technical support, Continuous updates
- Simple, non-technical language

### Section 5: Pricing Card
- Single premium subscription card
- Setup Fee: 1,500 EGP (one-time)
- Monthly: 500 EGP
- Feature list with checkmarks
- "Subscribe Now" button opens popup form
- Prices fetched from database (admin-editable)
- Discount badge when offer is active

### Subscription Popup Form
- Modal dialog triggered by "Subscribe Now"
- Fields: Name, Email, Phone, WhatsApp, Business Type (free text)
- Form validation with Zod
- Submits to "interested_leads" table
- Success confirmation message

### Section 6: How Subscription Works
- Visual timeline/steps explaining:
  - Pay setup fee first
  - Website delivered
  - Monthly billing starts after 30 days
  - Cancel anytime policy

### Section 7: Contact Form
- Full lead capture form
- Fields: Full Name, Email, Phone, WhatsApp, Business Description
- Required field validation
- Saves to "leads" table in database
- Success toast notification

### Section 8: FAQ Accordion
- Expandable Q&A section
- Bilingual questions and answers
- Topics: subscription process, cancellation, delivery time, renewal, upgrades

### Section 9: Final CTA
- Strong closing section with gradient background
- Compelling message to subscribe
- CTA button linking to contact form

### Footer
- SnapSite logo and slogan
- Contact info: contact@snapsitee.com, +20-1033865141
- Terms & Conditions link (external Google Drive)
- Language switcher
- Copyright notice

---

## 🔐 Admin Dashboard (/admin)

### Admin Authentication
- Email/password login system
- No public login button - access only via /admin URL
- Secure session management
- Redirect to dashboard after login

### Dashboard Layout
- Sidebar navigation (collapsible)
- Language switcher for bilingual admin UI
- Modern dark theme matching frontend

### Leads Management
- Table view of all leads with columns:
  - Name, Email, Phone, WhatsApp (clickable), Message, Date
- Status indicators (New, Contacted, Archived)
- Actions: Mark as Contacted, Archive, Delete
- Search and filter functionality
- **Export to Excel** button for downloading leads

### Interested Leads (from Subscription Popup)
- Separate table for subscription form submissions
- Same functionality as leads management
- Track potential subscribers

### Pricing Management
- Edit Setup Fee (currently 1,500 EGP)
- Edit Monthly Subscription (currently 500 EGP)
- Toggle discount/offer on/off
- Set discount percentage or amount
- Changes reflect immediately on frontend

---

## 🗄️ Database Structure (Lovable Cloud)

**Tables:**
1. `leads` - Contact form submissions
2. `interested_leads` - Subscription popup submissions
3. `pricing` - Editable pricing configuration
4. `admin_users` - Admin authentication (via Supabase Auth)

---

## 📱 Responsive Design
- Desktop-first design with full responsive support
- Mobile hamburger menu
- Stacked layouts for mobile
- Touch-friendly interactions
- Optimized for all screen sizes

---

## 🚀 Key Features Summary
- ✅ Fully bilingual (AR/EN) with RTL support
- ✅ Premium dark SaaS aesthetic
- ✅ Purple-to-blue gradient theme
- ✅ Subscription popup form
- ✅ Contact/lead capture form
- ✅ Secure admin dashboard (/admin)
- ✅ Lead management with Excel export
- ✅ Admin-editable pricing
- ✅ Discount/offer toggle
- ✅ Responsive on all devices

