# Replace Hero Animation with Light Rays

## Scope
- Add the supplied OGL light-rays animation as a reusable hero background.
- Configure it with white rays, top-center origin, mouse response, and the exact motion settings provided.
- Replace the current topographic canvas without changing hero text, buttons, spacing, or section behavior.
- Keep the effect full-bleed and cropped by the hero on narrow screens rather than stretched.

## Performance and accessibility
- Cap render density for smoother mobile performance.
- Pause rendering when the hero is offscreen or the tab is hidden.
- Show a static frame when reduced motion is preferred.
- Clean up canvas, observers, and pointer listeners when unmounted.

## Verification
- Check desktop and mobile layouts for cropping, overflow, readability, and a working canvas.
- Confirm the preview builds without errors.

## Technical details
- Reuse the existing `ogl` dependency.
- Add typed `LightRays` and its container styles, remove the obsolete topography component, and update the architecture note.
