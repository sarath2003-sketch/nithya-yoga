# BRIEFING — 2026-10-29T05:27:00Z

## Mission
Investigate all UI components, pages, templates, and styles rendering the chakra illustration to identify exact paths, lines, and styling rules needing updates for the new glowing meditating yoga woman image.

## 🔒 My Identity
- Archetype: explorer
- Roles: UI Component Explorer
- Working directory: c:\Users\acer\Downloads\nithya web page_files\.agents\teamwork\explorer_survey_2\
- Original parent: 5df0c237-854b-423a-aa47-d894181d8e7b
- Milestone: survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify source code/assets
- Target files to write only in c:\Users\acer\Downloads\nithya web page_files\.agents\teamwork\explorer_survey_2\

## Current Parent
- Conversation ID: 5df0c237-854b-423a-aa47-d894181d8e7b
- Updated: 2026-10-29T05:27:00Z

## Investigation State
- **Explored paths**:
  - `src/components/HeroSection.jsx` (Hero welcome banner art)
  - `src/App.jsx` (Dashboard row 3, Col 2 `col-live` upcoming/live class card)
  - `src/components/LiveYogaClassRoom.jsx` (Live share modal header avatar & class card visual)
  - `src/components/StudentDashboard.jsx` (Student video library card vid-3)
  - `src/styles.css` (CSS classes `.chakra-moon-hero-frame`, `.chakra-moon-hero-img`, `.chakra-hero-halo-ring`, `.welcome-banner-art-wrap`, `.hero-right-visual-wrapper` at lines 960, 3531, 3558, 3612, 6195, 6288)
  - `saved_resource.html`, `index.html.backup`, `build_site.js` (Standalone legacy HTML with interactive SVG oscillator frequencies)
  - `sw.js` (PWA precache URLs)
  - `scripts/test_student_attendance_and_public_views.js`, `scripts/verify_mobile_viewports_and_quality.js`, `scripts/verify_all_prompt_fixes.js`, `scripts/verify_live_cross_device_fixes.js`
- **Key findings**:
  - Uploaded image (`media_1793249584268_2fdccc8d.jpg`): 1024x1024, 204KB JPEG, square 1:1 aspect ratio with glowing 7 chakras, circular aura, twilight lake & lotuses.
  - Existing hero asset (`chakra-moon-hero.svg`): 900x900, UTF-16LE SVG, flat dark vector card.
  - Critical layout finding: `.hero-right-visual-wrapper` in `src/styles.css` has `display: none !important;` at `@media (max-width: 768px)` and `@media (max-width: 640px)`. Because `HeroSection.jsx` attaches both `welcome-banner-art-wrap` and `hero-right-visual-wrapper`, the hero image was completely hidden on mobile! Overriding/enabling this on mobile allows the glowing meditating woman to render prominently without overflow.
  - Container sizing: `HeroSection` uses 145x145px (desktop) and 105x105px (mobile). `App.jsx` uses 64x64px (`w-16 h-16`). Both are 1:1 squares, matching the image's 1:1 aspect ratio with zero distortion.
  - Test dependencies: `test_student_attendance_and_public_views.js` line 71 checks for `chakra-moon-hero.svg`; `verify_all_prompt_fixes.js` lines 40, 43 check for `img[src*="chakra-moon-hero.svg"]`. We provide clear recommendations on asset naming and test compatibility.
- **Unexplored areas**: None remaining for UI survey.

## Key Decisions Made
- Fully documented all UI component locations, styles, responsive rules, aspect ratios, and test suite constraints.

## Artifact Index
- DISPATCH.md — Initial dispatch message
- BRIEFING.md — Persistent context & state
- progress.md — Liveness heartbeat
- handoff.md — Final structured handoff report
