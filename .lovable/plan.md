# Sharp-Corner System

## Goal
Remove all corner rounding across the website so every visual element matches the angular Core Studio logo and cursor.

## Changes
- Set the shared radius token to zero so all design-system controls, dialogs, inputs, cards, menus, and badges become square.
- Add a global zero-radius rule to cover existing one-off rounded utilities, circular shapes, images, and third-party elements.
- Preserve layout, content, colors, animations, and functionality.
- Check the homepage and key interface states for any remaining rounded corners or visual regressions.

## Technical detail
Apply the rule centrally in the global stylesheet instead of editing every component individually. Record sharp corners as a project-wide design rule.
