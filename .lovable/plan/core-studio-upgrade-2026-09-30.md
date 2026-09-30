# Core Studio upgrade

Rebrand SnapSite's homepage into "Core Studio", a full-service digital agency with an ultra-minimal black-on-black look. Pricing and Contact stay exactly as they are.

## What changes
1. **Look and feel.** Pure black backgrounds, faint charcoal borders, crisp white text, muted gray secondary text. Headings use a clean sans-serif (Cairo stays for Arabic). Small labels and tags use a monospace font (JetBrains Mono).
2. **Top bar.** Shows the "Core Studio" wordmark in place of the SnapSite logo. It stays pinned to the top as a frosted-glass dark bar. The slide-in menu you have now keeps working.
3. **Hero.** Built around big type:
   - Headline: "Build, Automate, and Scale."
   - The subheadline you supplied
   - Main button goes to Pricing, second button goes to Contact
   - A small monospace tag above the headline
   - The white light rays stay behind it, dimmed
4. **Services grid.** Four tiles in a mixed-size grid, each with an icon, a monospace tag, a title and a short line:
   - Web-as-a-Service
   - Workflow Automation (n8n)
   - Graphic Design
   - Social Media Services

   Hovering a tile lifts it slightly with a brighter border. This grid replaces the current "SnapSite System" features section.
5. **Animations.** The hero and services grid fade in quickly and smoothly as you scroll to them.
6. **Arabic.** Every new line of text also gets an Egyptian-Arabic version, with right-to-left layout.
7. **Locked sections.** Pricing and Contact keep their current text, layout and logic. The only change is that their backgrounds blend into the new black.

## Assumptions (tell me if any are wrong)
- These sections stay, restyled to the new look: Pain Points, How It Works, Why Us, What You Get, Subscription Explanation, Our Work, Testimonials, FAQ, Final CTA and Footer.
- The page title and tab text change to "Core Studio". The checkout, renewal and admin pages keep their current wording.
- Order numbers still start with SNP- and RNW-.

## Technical details
- New files: `HeroSection.tsx` (rewritten) and `ServicesBentoSection.tsx`, using framer-motion (already installed) and lucide icons: Globe, Workflow, PenTool, TrendingUp.
- In `Index.tsx`, swap `SnapSiteSystemSection` for `ServicesBentoSection` and give it the `id="services"` anchor.
- Add JetBrains Mono through the `@import` at the top of `src/index.css`, and add `fontFamily.mono` in the Tailwind config.
- Set `--background` to 0 0% 0%. Add a `--glass` token so the top bar gets its backdrop-blur.
- `Navbar.tsx`: replace the logo image with a text wordmark and apply the glass header styling.
- Add new strings to `LanguageContext.tsx` under `hero.*` and `services.*`, and update the `index.html` meta tags.
- `PricingSection.tsx` and `ContactSection.tsx` stay unchanged, apart from making sure their backgrounds are transparent or `bg-background`.
- Update the monochrome rule in `AGENTS.md`.
