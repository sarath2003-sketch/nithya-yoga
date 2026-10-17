# NITHYA YOGA & WELLNESS — PRODUCT CONTEXT (PRODUCT.md)

> **Specification Standard:** Impeccable (impeccable.style) Durable Context  
> **Application:** NITHYA Yoga Platform & Mobile Application  
> **Repository:** `sarath2003-sketch/nithya-yoga`  
> **Stack:** React 18, WebRTC / LiveKit Client, Capacitor 8 (Android APK), SQLite Backend (`serve.js`), PWA Service Worker (`sw.js`)

---

## 1. PRODUCT MISSION & OVERVIEW

NITHYA Yoga is a comprehensive, bilingual (English & Tamil) yoga learning and wellness platform designed for daily practice, mindful habits, and live virtual training.

### Core Value Propositions:
1. **Interactive Live Yoga Classes:** Real-time WebRTC/LiveKit video and audio sessions with dedicated Instructor (👑 NITHYA Master) controls and lightweight student entry.
2. **Smart Mindful Care Reminders:** Daily habit alerts (Yoga, Water, Meals, Sleep, Heart) with gentle sound chimes and native system status-bar notifications outside the app.
3. **Structured Attendance Tracking:** 70%+ participation threshold logging for certification.
4. **Bilingual Accessibility:** Instant toggle between English and Tamil (`ta`), with full font optimization for Tamil typography (`Noto Sans Tamil`).

---

## 2. KEY SURFACES & USER FLOWS

### Surface 1: The Sanctuary (Dashboard & Home)
- **Hero Panoramic Section:** Greet user, show active practice streak, and one-click "Start / Join Live Class" CTA.
- **Smart Care Reminders Timeline:** Carousel of 5 color-coded pastel cards with 3D badges, quick chime testing, and enable/pause switches.
- **Breathing & Relaxation Zone:** Guided Pranayama breathing orb with rhythmic expansion/contraction and ambient white noise/soothing nature soundscapes.
- **Yoga Classes Catalog:** Filterable list of sessions (Hatha, Vinyasa, Power, Yin, Pranayama).
- **Attendance & Analytics:** Visual charts and streak logs stored locally and synced with SQLite backend.

### Surface 2: The Studio (Live Yoga WebRTC Room)
- **Host / Instructor Mode (👑 NITHYA Master):**
  - Camera spotlighted at the center of the video grid.
  - Broadcast controls: Microphone, Camera, Screen Sharing, Attendance Register, 70% threshold mark, and "End Class For All".
  - Shareable student invite link generation (`?live=cls-1&join=student`).
- **Student Mode (👥 Practitioner):**
  - Automatic entry via invite link with quick name + 10-digit mobile verification.
  - Direct download button for Android mobile app APK (`NITHYA-Yoga-v1.0.apk`).
  - Student controls: Mute, Video, Raise Hand, Live Chat, Leave Session.
- **Instant Role Switcher:**
  - One-click `👑 NITHYA Master ⮂` <-> `👥 Student Mode ⮂` toggle button on the header for seamless testing and administrative preview.

### Surface 3: Mindful Habit Reminders
- **Customization Modal:** Add, edit, or delete reminders with custom times, repeat patterns (Daily, Weekdays, Weekly, Once), and audio chimes.
- **Background Synchronization:** Synchronized with native Android OS `AlarmManager` and high-priority notification channels (`nithya_yoga_reminders`) so alarms trigger in the notification bar and lock screen even when the app is closed.

---

## 3. TECHNICAL CONSTRAINTS & GUARANTEES

- **No Framework Rewrites:** Must remain on lightweight React 18 with esbuild single-bundle output (`dist/bundle.js`).
- **Offline & Low-Bandwidth Resilience:** Full Service Worker caching (`sw.js`) and graceful WebRTC fallback if cloud LiveKit credentials are not active.
- **Safe Storage Protocol:** Primary storage in browser `localStorage` under `nithya_*` keys, backed by SQLite API endpoints (`/api/*`).
- **Mobile Packaging:** Android debug/release APK generated via `@capacitor/android` and Gradle (`gradlew.bat assembleDebug`).
