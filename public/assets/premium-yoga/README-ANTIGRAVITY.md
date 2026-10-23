# Nithya Yoga — Premium Visual Asset Pack

These are original lightweight SVG assets created for this repository. They are source artwork, not downloaded stock photos or videos.

## Files
- `chakra-moon-hero.svg`: moon + seated yoga silhouette + seven chakra points. Use as a featured hero illustration or Chakra page visual.
- `meditation-orbit-bg.svg`: subtle orbit/mandala background. Use behind a meditation or Live Class waiting state with low opacity.

## Antigravity implementation brief
Copy this into Antigravity after opening the repository:

> Use the existing Nithya Yoga React project. Do not change the logo, existing text/content, routes, authentication, API calls, or working features. Add the assets already present at:
> - `/assets/premium-yoga/chakra-moon-hero.svg`
> - `/assets/premium-yoga/meditation-orbit-bg.svg`
>
> First inspect the existing app structure and determine whether the deployed build is served from `public/` or `www/`. Copy/sync the assets into the actual public build output if the existing build process requires it; do not duplicate files blindly.
>
> Apply a premium calm 3D-inspired visual language: deep midnight navy backgrounds, indigo/violet ambient glow, soft glass panels, restrained gradients, subtle depth/shadows, smooth 180–350ms transitions, and readable high-contrast text. Do not make the entire screen pure black. Keep yoga imagery and text calm and accessible.
>
> Live Class is the priority: show only real backend/room participants; no hard-coded sample people or seeded fake chat. Display a clear waiting-for-instructor state until an actual instructor connection is confirmed. If no camera stream exists, show a visible branded placeholder, not a black rectangle. Keep join/leave, camera, mic, and chat logic intact. Make the layout mobile-first, with controls reachable on small screens and a clean responsive desktop grid.
>
> Typography: use `Inter` for Latin UI text, `Noto Sans Tamil` for Tamil text, and `Poppins` only for short headings. Prefer existing local fonts if present; otherwise add a robust system fallback stack. Do not depend on remote font loading for essential UI. Keep font weights limited to 400/500/600/700.
>
> Motion: use CSS transforms and opacity only where possible. A slow orbit rotation may be applied to a decorative ring around the chakra illustration, not to the whole page. On hover, use a subtle 2–4px lift and soft glow; on touch devices, avoid hover-only interactions. Respect `prefers-reduced-motion: reduce`. Never animate the actual person's face/body independently or make the yoga figure wobble; animate decorative halo/orbit layers instead.
>
> After implementation, run the project's documented build and tests. Inspect the real generated output and mobile/desktop layouts. Report exactly what was tested and do not claim deployment unless the configured deployment workflow completed successfully.

## Font and visual guidance
- Headings: Poppins 600/700 (short headings only)
- Body and controls: Inter 400/500/600
- Tamil UI: Noto Sans Tamil 400/500/600
- Fallback: system-ui, -apple-system, "Segoe UI", sans-serif
- Palette: #080C1D, #111831, #252052, #8F7CF6, #B9A8FF, #EDEAFF, accent teal #74E4D1
- Accessibility: maintain contrast, visible keyboard focus, tap targets around 44px, and reduced-motion support.

## Asset paths
These files are source SVGs and can be previewed in a browser. They are not yet wired into React components; Antigravity should place them after inspecting the actual page/component structure.
