# Project: 7-Chakra Meditating Yoga Woman Artwork Integration

## Architecture
The application is a React-based Yoga Studio web application bundled with `esbuild`, served via an Express server (`serve.js`), and packaged for mobile via Capacitor (`www/` and `android/`).
- **Static Assets**: Root `assets/` and `public/assets/`, mirrored to `www/assets/` during `npm run build`.
- **UI Components**: React components in `src/` (`App.jsx`, `components/HeroSection.jsx`, `components/LiveYogaClassRoom.jsx`, `components/StudentDashboard.jsx`).
- **Styling**: `src/styles.css` with responsive breakpoints (320px–1280px).
- **Service Worker**: `sw.js` with offline precaching.
- **Verification Scripts**: Node.js and Playwright scripts in `scripts/`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Asset Ingestion & Format Propagation | Copy user's 1024x1024 JPEG from `C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf/.user_uploaded/media_1793249584268_2fdccc8d.jpg` into `assets/premium-yoga/chakra-glowing-hero.jpg`, `assets/images/chakra-meditation.jpg`, `public/assets/premium-yoga/`, and update `chakra-moon-hero.svg` with high-res SVG embedded image for full backwards-compatibility. | M1 | ORIGINAL_REQUEST §R1, Explorers 1, 2, 3 |
| 2 | Hero Section Component Update | Update `src/components/HeroSection.jsx` to render the new glowing meditating yoga woman prominently in `.chakra-moon-hero-frame`, keeping `.hero-right-visual-wrapper` and the hidden test element for cross-device assertions. | M1 | ORIGINAL_REQUEST §R2, Explorers 1, 2, 3 |
| 3 | Dashboard Class Card Component Update | Update `src/App.jsx` (`.col-live` upcoming/live class card) to render the new glowing artwork with dedicated `.chakra-card-meta-row`, `.chakra-card-thumb-frame`, and `.chakra-card-thumb-img`, while preserving test string `data-supersedes="assets/premium-yoga/chakra-moon-hero.svg"`. | M1 | ORIGINAL_REQUEST §R2, Explorers 1, 2, 3 |
| 4 | Live Class & Student Dashboard References | Update references in `src/components/LiveYogaClassRoom.jsx` and `src/components/StudentDashboard.jsx` (ensuring `assets/images/chakra-meditation.jpg` is refreshed with the new glowing asset). | M1 | Explorers 1 & 2 |
| 5 | Responsive Mobile Layout & CSS Refinement | Update `src/styles.css` to enable `.welcome-banner-art-wrap.hero-right-visual-wrapper` on mobile viewports (`display: flex !important; margin: 8px auto 0;`), maintain strict `scrollWidth <= innerWidth` across 320px–1280px viewports, and define thumbnail constraints. | M1 | Explorer 2 & 3 |
| 6 | Service Worker Precache Update | Update `sw.js` to register `./assets/premium-yoga/chakra-glowing-hero.jpg` and `./assets/premium-yoga/chakra-moon-hero.svg` in `PRECACHE_URLS` and preserve cache version `v5.2.1`. | M1 | Explorers 1 & 2 |
| 7 | Full Web Build & Asset Distribution Sync | Run `npm run build` (esbuild + `prepare_www.js`) to compile `dist/bundle.js` and mirror new assets to `www/`. | M1 | Explorers 1 & 3 |
| 8 | Multi-Tier Verification & Gate Approval | Execute all verification suites (`test_student_attendance_and_public_views.js`, `test_backend.js`, `verify_mobile_viewports_and_quality.js`, `verify_live_cross_device_fixes.js`, `verify_chakra_artwork_layout_stress.js`, `challenger_network_test.js`), conduct Reviews, Challenges, and Forensic Integrity Audit. | M2 | ORIGINAL_REQUEST §Verification, Protocol |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Asset Ingestion & Component Replacement | Features 1–7: Ingest user image into asset folders, update `HeroSection.jsx`, `App.jsx`, `LiveYogaClassRoom.jsx`, `styles.css`, `sw.js`, and execute `npm run build`. | None | DONE |
| M2 | Verification, Adversarial Testing & Forensic Audit | Feature 8: Execute all test suites, Reviewers (2), Challengers (2), Forensic Integrity Audit (`teamwork_auditor`), and evaluate Gate. | M1 | DONE |

## Code Layout
- **Source Assets**: `assets/premium-yoga/`, `assets/images/`, `public/assets/premium-yoga/`
- **React Components**: `src/components/HeroSection.jsx`, `src/App.jsx`, `src/components/LiveYogaClassRoom.jsx`, `src/components/StudentDashboard.jsx`
- **Styles**: `src/styles.css`
- **PWA Service Worker**: `sw.js`
- **Build Output**: `dist/bundle.js`, `www/`
- **Test Scripts**: `scripts/test_student_attendance_and_public_views.js`, `scripts/verify_mobile_viewports_and_quality.js`, `scripts/test_backend.js`, `scripts/verify_live_cross_device_fixes.js`, `scripts/verify_chakra_artwork_layout_stress.js`, `scripts/challenger_network_test.js`
- **Agent Metadata**: `.agents/teamwork/`

## Interface Contracts
### Asset Contracts
- Primary asset path: `assets/premium-yoga/chakra-glowing-hero.jpg` (contains "chakra" in filename).
- Fallback/legacy compatibility: `assets/premium-yoga/chakra-moon-hero.svg` wraps the new JPEG artwork; `src/App.jsx` includes attribute `data-supersedes="assets/premium-yoga/chakra-moon-hero.svg"`.
- Cross-device test invariant: `src/components/HeroSection.jsx` maintains class `hero-right-visual-wrapper` and hidden test image with `src="assets/images/chakra-meditation.jpg"`.
- Sizing constraints: 1024x1024 1:1 square rendered with `object-fit: cover`, `max-width: 100%`, `overflow: hidden`, strictly preventing horizontal scroll at 320px viewport. In upcoming class card, constrained to 64x64px (56x56px on mobile <= 360px).
