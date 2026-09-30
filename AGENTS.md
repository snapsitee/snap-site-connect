# Project architecture decisions

- Maintain the site's monochrome palette in `src/index.css` semantic tokens and map legacy Tailwind hue utilities to grayscale in `tailwind.config.ts`, so existing pages remain consistent without changing their behavior.
- Render the hero's white light rays with the supplied OGL shader and monochrome semantic token, pausing animation offscreen or when the page is hidden to preserve performance.