

## Replace Animated BorderGlow with Static Gradient Border

The reference image shows a clean, static purple-to-blue gradient border (no animation). Currently, 7 sections use the heavy `BorderGlow` component with animated glow effects. This change will also improve performance by removing all the `requestAnimationFrame` loops.

### Changes

**Replace `BorderGlow` wrapper with a simple div using `gradient-border` class in these 7 files:**

1. **HowItWorksSection.tsx** — Replace `<BorderGlow>` around each step card with a `<div className="gradient-border rounded-3xl p-6 ...">` wrapper
2. **SnapSiteSystemSection.tsx** — Same replacement for system feature cards
3. **WhyUsSection.tsx** — Same for "Why Us" feature cards
4. **WhatYouGetSection.tsx** — Same for the features grid card
5. **SubscriptionExplanationSection.tsx** — Same for subscription explanation cards
6. **PainPointsSection.tsx** — Same for pain point cards
7. **PricingSection.tsx** — Same for the pricing card

Each replacement:
- Remove `<BorderGlow ...props>` and its `<span className="edge-light" />` child
- Replace with `<div className="gradient-border rounded-3xl bg-card">` keeping the same inner content and padding
- Remove the `BorderGlow` import from each file

**Cleanup (optional):**
- The `BorderGlow.tsx` and `BorderGlow.css` files can be removed since they will no longer be used anywhere

### Impact
- Removes 7 simultaneous `requestAnimationFrame` animation loops
- Eliminates complex CSS with pseudo-elements, `mask-image`, and `mix-blend-mode`
- Significant performance improvement, especially on mobile
- Consistent visual style matching the FAQ section's existing gradient border

