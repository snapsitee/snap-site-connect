# Read-only Work Dashboard

## Goal
Create a protected `/work` area styled like the existing Admin Dashboard. Authorized work users can inspect Analytics, Subscribers, Renewals, and Leads, including order details and payment receipts, but cannot change or delete anything.

## What will be built
- Add a dedicated `/work` sign-in and protected work dashboard.
- Match the Admin Dashboard's black monochrome theme, responsive sidebar, language switcher, and English/Arabic RTL behavior.
- Show only four sections: Analytics, Subscribers, Renewals, and Leads.
- Keep useful read-only tools: search, filters, record details, receipts, and WhatsApp links.
- Remove every editing control from `/work`: status selectors, date editing, confirm/reject actions, selection checkboxes, delete actions, and other mutations.
- Label the area as read-only in English and Arabic so its purpose is clear.

## Secure access
- Add a separate `viewer` role to the existing role system.
- Add read-only database policies for `viewer` accounts on orders, renewals, and leads.
- Do not grant viewer insert, update, or delete access; the database remains the final protection even if someone tampers with the page.
- Let administrators continue using `/admin`; administrators may also open `/work` for verification.
- Keep role assignment admin-only.

## Reuse and consistency
- Reuse the existing analytics calculations and detail/receipt presentations.
- Add explicit read-only modes to the shared Subscribers, Renewals, and Leads views so `/admin` behavior remains unchanged.
- Keep Pricing, Payment Settings, Add-ons, Coupons, Selected Work, Reviews, and Popup settings out of `/work`.

## Verification
- Verify `/work` redirects signed-out visitors to its sign-in screen.
- Verify an authorized viewer can read all four sections and open receipts/details.
- Verify no editing controls appear in the work dashboard.
- Verify viewer update/delete attempts are denied by the database while admin editing still works.
- Check desktop and mobile layouts in English and Arabic.

## Access setup
After the dashboard is built, the work user's account must be assigned the new `viewer` role by an administrator. No credentials will be hardcoded into the site.
