# Original User Request

## Approved Task Prompt — 2026-10-29T05:01:44Z

Use the full team. Replace the current flat 7-chakra illustration image in the app with the user-provided glowing 7-chakra meditating yoga woman image, and update all referencing components so the new artwork displays prominently across the application.

Integrity mode: development

## Requirements

### R1. Replace Chakra Image Asset
Copy the user's uploaded image `C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf/.user_uploaded/media_1793249584268_2fdccc8d.jpg` into the project assets directory (`assets/premium-yoga/` or the designated asset directory) to replace or supersede the existing 7-chakra illustration asset (`assets/premium-yoga/chakra-moon-hero.svg`).

### R2. Update Referencing Components
Update all hero sections, welcome headers, class cards, and related UI components that reference the old chakra illustration so that the newly provided glowing meditating yoga woman image is rendered prominently without layout disruption or distortion.

## Verification Resources

- Visual asset and attendance test: `node scripts/test_student_attendance_and_public_views.js`
- Backend integration tests: `node scripts/test_backend.js`
- Responsive multi-viewport check: `node scripts/verify_mobile_viewports_and_quality.js`
- Web build check: `npm run build`

## Acceptance Criteria

### Asset Integration & UI Display
- [ ] The image file from `C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf/.user_uploaded/media_1793249584268_2fdccc8d.jpg` is integrated into the workspace asset directory.
- [ ] All components and views referencing the old chakra illustration (such as `chakra-moon-hero.svg`) now reference the new glowing 7-chakra meditating yoga woman image.
- [ ] The new image renders properly and prominently in the UI without broken image links, aspect ratio distortion, or layout overflows.
- [ ] `npm run build` completes without errors.
- [ ] `node scripts/test_student_attendance_and_public_views.js` and `node scripts/verify_mobile_viewports_and_quality.js` execute cleanly.
