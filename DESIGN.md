# NITHYA YOGA & WELLNESS — DESIGN SYSTEM (DESIGN.md)

> **Document Type:** Agent-facing & Developer-facing Design Reference  
> **Application:** NITHYA Yoga & Wellness (React 18, Capacitor Android & PWA)  
> **Brand Identity:** Mindful Practice, Calm Luxury, High-Fidelity WebRTC Studio, 3D Pastel Care Reminders  
> **Specification Version:** 1.0.0 (Standard conforms to `awesome-design-md` & Google Stitch)

---

## 1. VISUAL ATMOSPHERE & PHILOSOPHY

The visual identity of NITHYA Yoga is **"Calm Luxury & Focused Mindfulness"**:
- **Not generic purple SaaS slop:** Instead of loud, aggressive neon gradients, the interface uses deeply serene slate canvases, gentle lavender card highlights, and soft organic pastel accents.
- **Dual Personality:**
  1. **The Sanctuary (Dashboard):** Soft daylight cards, organic rounded corners (`14px`–`22px`), 3D glass-effect habit badges, peaceful spacing.
  2. **The Studio (Live Video):** Dark-mode immersive broadcast stage (`#080D1D`), high-contrast participant tiles, gold badges for 👑 NITHYA Master, emerald badges for students.

---

## 2. COLOR PALETTE & SEMANTIC TOKENS

### A. Foundations & Surfaces
| Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| `--bg-app` | `#F5F7FC` | `#080D1D` | Global application canvas background |
| `--bg-card` | `#FFFFFF` | `#0F172A` | Primary content cards and modals |
| `--bg-card-subtle` | `#F8FAFC` | `#1E293B` | Nested sections, inputs, and tables |
| `--bg-sidebar` | `#131428` | `#060A17` | Navigation sidebar canvas |

### B. Brand & Accent Tones
| Token | Hex Value | Usage |
|---|---|---|
| `--primary-purple` | `#5B44E6` | Core brand identity, primary CTA buttons |
| `--primary-hover` | `#4B33D4` | Hover and active interaction states |
| `--primary-subtle` | `#EEF0FF` | Active navigation pills, badge backgrounds |
| `--accent-teal` | `#0D9488` | Pranayama breathwork, mindfulness widgets |
| `--accent-blue` | `#2563EB` | Live video studio indicators, information |
| `--accent-orange` | `#EA580C` | Meal reminders, sunrise energy cards |
| `--accent-gold` | `#D97706` | 👑 NITHYA Master host pill, master certifications |
| `--accent-green` | `#16A34A` | 👥 Student active pills, 70%+ attendance passed |
| `--accent-pink` | `#E11D48` | End session, delete, and alert destructive actions |

### C. Text Hierarchy
| Token | Light Theme | Dark Theme | Role |
|---|---|---|---|
| `--text-heading` | `#0F172A` | `#F8FAFC` | H1–H4, section titles, hero headlines |
| `--text-main` | `#1E293B` | `#E2E8F0` | Body copy, card descriptions, labels |
| `--text-sub` | `#64748B` | `#94A3B8` | Subtitles, helper text, metadata |
| `--text-muted` | `#94A3B8` | `#64748B` | Timestamps, placeholders, inactive icons |

---

## 3. TYPOGRAPHY SYSTEM

### Font Families
1. **Headings & Hero (`--font-heading`):** `'Poppins', 'Inter', sans-serif`  
   *Weights:* `600` (SemiBold), `700` (Bold)  
   *Character:* Welcoming, warm geometric curves, distinctive editorial title presence.
2. **Body & UI Elements (`--font-family`):** `'Inter', sans-serif`  
   *Weights:* `400` (Regular), `500` (Medium), `600` (SemiBold)  
   *Character:* High-legibility optical kerning for numbers, schedules, and button text.
3. **Tamil Localization (`[data-lang="ta"]`):** `'Noto Sans Tamil', 'Inter', sans-serif`  
   *Weights:* `400` (Regular), `600` (SemiBold), `700` (Bold)  
   *Character:* Smooth Unicode rendering, natural Tamil script balance without baseline clipping.

### Type Scale
| Level | Font Size | Line Height | Weight | Tracking |
|---|---|---|---|---|
| Hero Title | `2.25rem` (36px) | `1.2` | `700` | `-0.02em` |
| Section Heading | `1.5rem` (24px) | `1.3` | `600` | `-0.01em` |
| Card Title | `1.125rem` (18px) | `1.4` | `600` | `0` |
| Body Text | `0.9375rem` (15px) | `1.5` | `400` | `0` |
| Caption / Metadata | `0.75rem` (12px) | `1.4` | `500` | `+0.01em` |

---

## 4. ELEVATION, RADIUS & SPACING

- **Border Radii:**
  - `sm: 8px` (Chips, action icons, small buttons)
  - `md: 14px` (Secondary cards, dialogs, form inputs)
  - `lg: 18px` (Primary bento cards, timeline item cards)
  - `xl: 22px` (Hero banner, live studio stage)
- **Shadows:**
  - Ambient: `0 4px 20px -2px rgba(100, 116, 139, 0.07)`
  - Hover: `0 10px 28px -4px rgba(100, 116, 139, 0.12)`
  - Active Glow: `0 8px 24px -4px rgba(91, 68, 230, 0.35)`

---

## 5. COMPONENT BLUEPRINTS

### A. The Role Switcher Pill
- **👑 NITHYA Master (Host):**
  - Background: `linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(245, 158, 11, 0.25))`
  - Border: `1px solid rgba(217, 119, 6, 0.5)`
  - Text: Gold / Amber `#B45309` (`#FCD34D` in dark mode)
- **👥 Student Mode (Practitioner):**
  - Background: `linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.25))`
  - Border: `1px solid rgba(16, 185, 129, 0.5)`
  - Text: Emerald `#047857` (`#6EE7B7` in dark mode)

### B. 3D Pastel Care Reminder Cards
- Each card has an organic pastel theme:
  - Yoga: Purple gradient accent (`#F3E8FF`)
  - Water: Cyan/Teal gradient accent (`#E0F2FE`)
  - Meal: Orange/Peach accent (`#FFEDD5`)
  - Sleep/Relax: Indigo accent (`#E0E7FF`)
- Badges feature micro-elevated 3D illustrations with gentle scale hover (`transform: scale(1.05)`).

---

## 6. RULES FOR AGENTS & CONTRIBUTORS

### ✅ DO:
1. Preserve all bilingual localization support (`en` and `ta`). Every heading and user-facing message must provide an accurate Tamil translation (`Noto Sans Tamil`).
2. Use CSS custom variables (`var(--...)`) instead of hardcoding random hex values.
3. Keep the 👑 NITHYA Master instructor role as the default host identity for the app owner.
4. Ensure all interactive tap targets are at least `44px` on mobile screens for Android/iOS guidelines.

### ❌ DO NOT:
1. Do not overwrite existing brand assets (`assets/images/logo.png`, `LotusMark.jsx`).
2. Do not introduce bloated UI component frameworks (Tailwind full build, Material UI, Bootstrap) that could break the existing mobile Capacitor bundle.
3. Do not alter the 70% attendance completion threshold rule.
