# Project architecture decisions

- Core Studio black-on-black: pure black background token, JetBrains Mono (`font-mono`) for labels; Pricing and Contact sections are locked and must not be restructured.
- Maintain the site's monochrome palette in `src/index.css` semantic tokens and map legacy Tailwind hue utilities to grayscale in `tailwind.config.ts`, so existing pages remain consistent without changing their behavior.
- Render the hero's white light rays with the supplied OGL shader and monochrome semantic token, pausing animation offscreen or when the page is hidden to preserve performance.
- Use the Core Studio square-with-cutout mark as the desktop cursor motif; retain the native cursor on touch and coarse-pointer devices for usability.
- Keep every visual element corner sharp with a global zero-radius rule, matching the angular Core Studio logo and cursor.
- Protect `/work` with the separate `viewer` role and database SELECT-only policies; reuse admin data displays without exposing mutations.
- Guest orders/renewals are insert-only (IDs generated client-side, order lookup via order_exists RPC); receipts bucket is private and viewed via signed URLs by admin/viewer only — prevents public exposure of customer data.
