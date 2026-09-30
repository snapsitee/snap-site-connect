# Project architecture decisions

- Maintain the site's monochrome palette in `src/index.css` semantic tokens and map legacy Tailwind hue utilities to grayscale in `tailwind.config.ts`, so existing pages remain consistent without changing their behavior.