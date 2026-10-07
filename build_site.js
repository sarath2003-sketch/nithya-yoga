const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="ta" data-theme="dark" data-lang="ta">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>NITHYA YOGA & WELLNESS | நித்யா யோகா & லைவ் ஸ்டுடியோ</title>
  
  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧘‍♀️</text></svg>">
  
  <!-- Google Fonts: Figtree, Fraunces, Noto Sans Tamil -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Figtree:ital,wght@0,300..900;1,300..900&family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800&family=Noto+Sans+Tamil:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    /* ==========================================================================
       CSS Variables & Theme Tokens
       ========================================================================== */
    :root {
      --primary-gradient: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 50%, #FFD93D 100%);
      --accent-gradient: linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%);
      --divine-gold: linear-gradient(135deg, #F9D423 0%, #FF4E50 100%);
      --chakra-violet: #8e44ad;
      --chakra-indigo: #2980b9;
      --chakra-blue: #00cec9;
      --chakra-green: #27ae60;
      --chakra-yellow: #f1c40f;
      --chakra-orange: #e67e22;
      --chakra-red: #e74c3c;
      
      --font-body: 'Figtree', 'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-title: 'Cinzel', 'Fraunces', serif;
      
      /* Dark Zen Mode (Default) */
      --bg-dark: #0a0814;
      --bg-card: rgba(23, 20, 38, 0.75);
      --bg-card-hover: rgba(33, 29, 56, 0.9);
      --glass-border: rgba(255, 255, 255, 0.12);
      --glass-glow: rgba(155, 89, 182, 0.25);
      --text-main: #f5f3ff;
      --text-sub: #b3aed0;
      --text-muted: #7d78a1;
      --accent-teal: #00f2fe;
      --accent-purple: #9d50bb;
      --accent-gold: #f6d365;
      --radius-sm: 10px;
      --radius-md: 18px;
      --radius-lg: 26px;
      --shadow-card: 0 16px 36px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.08);
      --shadow-neon: 0 0 25px rgba(233, 64, 87, 0.45);
    }

    [data-theme="light"] {
      --bg-dark: #f6f4fa;
      --bg-card: rgba(255, 255, 255, 0.82);
      --bg-card-hover: rgba(255, 255, 255, 0.96);
      --glass-border: rgba(140, 120, 180, 0.18);
      --glass-glow: rgba(138, 35, 135, 0.12);
      --text-main: #1d1733;
      --text-sub: #4f476a;
      --text-muted: #80779e;
      --shadow-card: 0 18px 40px -15px rgba(70, 50, 120, 0.15), 0 0 1px 1px rgba(120, 90, 180, 0.1);
      --shadow-neon: 0 8px 24px rgba(233, 64, 87, 0.25);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-body);
      min-height: 100vh;
      line-height: 1.6;
      overflow-x: hidden;
      position: relative;
      transition: background-color 0.4s ease, color 0.4s ease;
    }

    /* Ambient Background Wallpapers */
    .bg-canvas-container {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .ambient-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.18;
      filter: blur(2px) saturate(1.2);
      transition: opacity 1.2s ease, transform 10s ease;
      transform: scale(1.04);
    }

    [data-theme="light"] .ambient-bg-img {
      opacity: 0.12;
      filter: blur(1px) brightness(1.05);
    }

    .ambient-gradient-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 20%, rgba(138, 35, 135, 0.25), transparent 70%),
                  linear-gradient(to bottom, transparent 0%, var(--bg-dark) 85%);
      pointer-events: none;
    }

    /* Floating glowing orbs */
    .ambient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      pointer-events: none;
      opacity: 0.35;
      animation: floatOrb 18s ease-in-out infinite alternate;
    }
    .orb-1 { width: 450px; height: 450px; background: #8e44ad; top: -100px; left: -100px; }
    .orb-2 { width: 500px; height: 500px; background: #e94057; bottom: 5%; right: -120px; animation-duration: 22s; }
    .orb-3 { width: 350px; height: 350px; background: #00cec9; top: 40%; left: 35%; animation-duration: 25s; opacity: 0.2; }

    @keyframes floatOrb {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(40px, 60px) scale(1.1); }
      100% { transform: translate(-30px, 30px) scale(0.95); }
    }

    /* App Shell Layout */
    .app-shell {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* ==========================================================================
       Header & Branding (Mass Advanced Level)
       ========================================================================== */
    header.main-header {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      background: rgba(14, 11, 28, 0.82);
      border-bottom: 1px solid var(--glass-border);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    [data-theme="light"] header.main-header {
      background: rgba(255, 255, 255, 0.88);
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      text-decoration: none;
    }

    /* 3D Glowing Animated Lotus Logo */
    .brand-logo-badge {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      background: linear-gradient(135deg, #FF416C, #FF4B2B);
      box-shadow: 0 10px 25px -5px rgba(255, 65, 108, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .brand-logo-badge::after {
      content: '';
      position: absolute;
      inset: -50%;
      background: linear-gradient(60deg, transparent, rgba(255, 255, 255, 0.5), transparent);
      transform: rotate(25deg);
      animation: logoGleam 4s infinite;
    }

    @keyframes logoGleam {
      0%, 70% { transform: translateX(-150%) rotate(25deg); }
      100% { transform: translateX(150%) rotate(25deg); }
    }

    .brand-logo-badge:hover {
      transform: scale(1.08) rotate(3deg);
    }

    .brand-logo-badge svg {
      width: 30px;
      height: 30px;
      fill: #ffffff;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    /* Double Color High-End 3D Typography */
    .brand-title {
      font-family: var(--font-title);
      font-size: 1.65rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      line-height: 1.1;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .brand-word-1 {
      background: linear-gradient(135deg, #FF6B6B 0%, #FFA07A 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 14px rgba(255, 107, 107, 0.4);
      font-size: 1.85rem;
      letter-spacing: 0.12em;
    }

    .brand-word-2 {
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 14px rgba(0, 242, 254, 0.35);
      font-size: 1.1rem;
      font-weight: 700;
    }

    .brand-tagline {
      font-size: 0.82rem;
      color: var(--text-sub);
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .brand-tagline span.live-indicator {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.72rem;
      color: #2ecc71;
      font-weight: 700;
      background: rgba(46, 204, 113, 0.15);
      padding: 2px 8px;
      border-radius: 20px;
      border: 1px solid rgba(46, 204, 113, 0.3);
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #2ecc71;
      animation: pulseGreen 1.5s infinite;
    }

    @keyframes pulseGreen {
      0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
      70% { box-shadow: 0 0 0 7px rgba(46, 204, 113, 0); }
      100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
    }

    /* Header Controls */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-icon-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 15px;
      border-radius: 30px;
      border: 1px solid var(--glass-border);
      background: var(--bg-card);
      color: var(--text-main);
      font-size: 0.86rem;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(12px);
      transition: all 0.25s ease;
    }

    .btn-icon-pill:hover {
      background: var(--bg-card-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px -4px var(--glass-glow);
    }

    .btn-primary-gradient {
      background: var(--accent-gradient);
      color: #ffffff;
      border: none;
      box-shadow: 0 8px 22px -5px rgba(233, 64, 87, 0.6);
    }

    .btn-primary-gradient:hover {
      box-shadow: 0 12px 28px -5px rgba(233, 64, 87, 0.8);
      transform: translateY(-2px) scale(1.02);
      color: #ffffff;
    }

    /* Sound Tester Quick Bell in Header */
    .sound-bell-btn {
      position: relative;
    }

    .sound-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 10px;
      height: 10px;
      background: #ff4757;
      border-radius: 50%;
      border: 2px solid var(--bg-dark);
    }

    /* Navigation Bar */
    nav.sub-navbar {
      display: flex;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(14, 11, 28, 0.5);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      overflow-x: auto;
      scrollbar-width: none;
    }

    nav.sub-navbar::-webkit-scrollbar { display: none; }

    .nav-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 14px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-sub);
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .nav-tab-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-tab-btn.active {
      color: #ffffff;
      background: linear-gradient(135deg, rgba(233, 64, 87, 0.25), rgba(138, 35, 135, 0.3));
      border-color: rgba(233, 64, 87, 0.45);
      box-shadow: 0 6px 16px -6px rgba(233, 64, 87, 0.4);
    }

    .nav-tab-btn svg {
      width: 18px;
      height: 18px;
    }

    /* ==========================================================================
       Main Container & Sections
       ========================================================================== */
    main.main-content {
      flex: 1;
      max-width: 1380px;
      width: 100%;
      margin: 0 auto;
      padding: 24px 20px 100px;
    }

    .tab-section {
      display: none;
      animation: fadeInTab 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .tab-section.active {
      display: block;
    }

    @keyframes fadeInTab {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ==========================================================================
       Hero Section & 3D Interactive Yogi Chakras
       ========================================================================== */
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 28px;
      align-items: center;
      margin-bottom: 36px;
    }

    @media (max-width: 980px) {
      .hero-grid {
        grid-template-columns: 1fr;
      }
    }

    .hero-card {
      background: var(--bg-card);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 36px;
      box-shadow: var(--shadow-card);
      position: relative;
      overflow: hidden;
    }

    .hero-card::before {
      content: '';
      position: absolute;
      top: -40px;
      right: -40px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(233, 64, 87, 0.25), transparent 70%);
      pointer-events: none;
    }

    .hero-badge-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(246, 211, 101, 0.15);
      border: 1px solid rgba(246, 211, 101, 0.35);
      border-radius: 30px;
      color: #f6d365;
      font-size: 0.84rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-bottom: 18px;
    }

    .hero-title-main {
      font-family: var(--font-title);
      font-size: clamp(2.2rem, 4.5vw, 3.4rem);
      line-height: 1.15;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .hero-title-main span.gradient-hero {
      background: linear-gradient(135deg, #FF6B6B, #F9D423 70%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle-ta {
      font-size: 1.25rem;
      color: #e0dbf5;
      margin-bottom: 14px;
      font-weight: 600;
    }

    .hero-desc {
      color: var(--text-sub);
      font-size: 1.02rem;
      line-height: 1.7;
      max-width: 580px;
      margin-bottom: 26px;
    }

    .hero-actions-row {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }

    .btn-big {
      padding: 14px 28px;
      font-size: 1.02rem;
      border-radius: 18px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }

    /* 3D Visualizer Card: 7 Chakras Human Figure */
    .chakra-3d-card {
      background: var(--bg-card);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .chakra-visual-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .chakra-visual-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chakra-stage-container {
      position: relative;
      width: 100%;
      height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 50%, rgba(142, 68, 173, 0.18), transparent 75%);
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* SVG Meditating Human Figure & Interactive Chakras */
    .yogi-svg {
      width: 85%;
      height: 90%;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4));
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .chakra-node {
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
    }

    .chakra-node:hover {
      transform: scale(1.35);
      filter: drop-shadow(0 0 16px var(--node-glow));
    }

    .chakra-node.active-chakra {
      transform: scale(1.45);
      filter: drop-shadow(0 0 25px var(--node-glow));
      animation: chakraPulse 1.8s infinite alternate;
    }

    @keyframes chakraPulse {
      0% { transform: scale(1.35); }
      100% { transform: scale(1.6); }
    }

    .chakra-quick-info {
      width: 100%;
      margin-top: 14px;
      background: rgba(14, 11, 28, 0.6);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .chakra-info-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chakra-pill-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
    }

    .chakra-text-details h4 {
      font-size: 0.98rem;
      font-weight: 700;
    }

    .chakra-text-details p {
      font-size: 0.82rem;
      color: var(--text-sub);
    }

    .play-freq-btn {
      padding: 7px 14px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .play-freq-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.04);
    }

    /* ==========================================================================
       Dashboard Grid: Today's Priorities (Water, Meals, Yoga, Live)
       ========================================================================== */
    .dashboard-modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 22px;
      margin-bottom: 36px;
    }

    .dash-box {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 22px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      transition: transform 0.25s ease, border-color 0.25s ease;
    }

    .dash-box:hover {
      transform: translateY(-4px);
      border-color: rgba(233, 64, 87, 0.4);
    }

    .dash-box-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dash-box-title {
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .icon-badge {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 700;
    }

    /* Water Module */
    .water-tracker-card {
      background: linear-gradient(135deg, rgba(0, 206, 201, 0.12), rgba(9, 132, 227, 0.08));
      border: 1px solid rgba(0, 206, 201, 0.25);
    }

    .water-glasses-row {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin: 10px 0;
    }

    .water-glass-btn {
      flex: 1;
      height: 48px;
      border-radius: 10px;
      border: 1px solid rgba(0, 206, 201, 0.3);
      background: rgba(0, 206, 201, 0.08);
      color: #00cec9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.72rem;
      font-weight: 700;
      transition: all 0.2s ease;
    }

    .water-glass-btn.filled {
      background: linear-gradient(180deg, #00cec9, #0984e3);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 206, 201, 0.4);
      border-color: transparent;
    }

    .water-action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    /* ==========================================================================
       Live Class Studio & Automatic 70% Attendance System
       ========================================================================== */
    .live-studio-container {
      display: grid;
      grid-template-columns: 1.35fr 0.65fr;
      gap: 24px;
    }

    @media (max-width: 990px) {
      .live-studio-container {
        grid-template-columns: 1fr;
      }
    }

    .video-viewport-card {
      background: #06040d;
      border-radius: var(--radius-lg);
      border: 1px solid var(--glass-border);
      overflow: hidden;
      box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.8);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .video-screen-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      background: #0e0b1d;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    video#localVideoFeed {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scaleX(-1);
    }

    .video-offline-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(145deg, #181232, #0c081e);
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }

    .studio-active-overlay {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
      z-index: 10;
    }

    .live-broadcast-pill {
      background: rgba(231, 76, 60, 0.9);
      color: #ffffff;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.5);
    }

    .timer-pill {
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(8px);
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      font-size: 0.88rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: #f5f3ff;
    }

    /* 70% Attendance Live Gauge Bar */
    .attendance-gauge-banner {
      background: rgba(20, 16, 36, 0.95);
      border-top: 1px solid var(--glass-border);
      padding: 14px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .gauge-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.88rem;
      font-weight: 600;
    }

    .gauge-target-badge {
      color: #f1c40f;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .gauge-bar-track {
      width: 100%;
      height: 12px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .gauge-70-marker {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 70%;
      width: 2px;
      background: #f1c40f;
      z-index: 2;
    }

    .gauge-70-marker::after {
      content: '70%';
      position: absolute;
      top: -16px;
      left: -12px;
      font-size: 0.68rem;
      color: #f1c40f;
      font-weight: 800;
    }

    .gauge-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      border-radius: 10px;
      transition: width 0.5s ease;
    }

    .gauge-fill.verified {
      background: linear-gradient(90deg, #2ecc71, #00f2fe);
      box-shadow: 0 0 14px rgba(46, 204, 113, 0.8);
    }

    /* Video Control Center */
    .video-controls-row {
      padding: 14px 20px;
      background: rgba(14, 11, 28, 0.98);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-media-control {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-media-control:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.08);
    }

    .btn-media-control.off {
      background: #e74c3c;
      border-color: #e74c3c;
      color: #ffffff;
    }

    .btn-leave-class {
      background: #e74c3c;
      border: none;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Live Studio Sidebar */
    .studio-side-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 22px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .studio-side-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .class-info-box {
      background: rgba(255, 255, 255, 0.04);
      border-radius: var(--radius-sm);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .share-invite-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed var(--glass-border);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .invite-link-input-group {
      display: flex;
      gap: 8px;
    }

    .invite-link-input-group input {
      flex: 1;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--glass-border);
      border-radius: 10px;
      padding: 8px 12px;
      color: var(--text-main);
      font-size: 0.85rem;
    }

    /* Google Meet & Jitsi Alternate Integrations */
    .meet-integrations-box {
      background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
      border: 1px solid rgba(66, 133, 244, 0.25);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* ==========================================================================
       Reminders Engine (Loud Sound + Forgetfulness Assistant)
       ========================================================================== */
    .reminders-hero-banner {
      background: linear-gradient(135deg, rgba(233, 64, 87, 0.2), rgba(138, 35, 135, 0.25));
      border: 1px solid rgba(233, 64, 87, 0.35);
      border-radius: var(--radius-lg);
      padding: 24px 28px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .reminders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .reminder-card {
      background: var(--bg-card);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 20px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      border-left: 5px solid var(--reminder-color, #9b59b6);
      transition: all 0.25s ease;
    }

    .reminder-card.completed {
      opacity: 0.65;
    }

    .reminder-card.completed .rem-title-text {
      text-decoration: line-through;
    }

    .reminder-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }

    .reminder-kind-badge {
      font-size: 0.76rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-sub);
    }

    .reminder-card-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }

    .btn-wa-share {
      background: #25D366;
      color: #ffffff;
      border: none;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-wa-share:hover {
      background: #1ebc59;
      transform: scale(1.04);
    }

    /* Sound Settings Control in Reminders */
    .sound-settings-panel {
      background: var(--bg-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 20px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .sound-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    .volume-slider-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 200px;
    }

    input[type="range"] {
      flex: 1;
      height: 8px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.15);
      outline: none;
      accent-color: #e94057;
      cursor: pointer;
    }

    /* ==========================================================================
       Yoga News & Wisdom Feed Section
       ========================================================================== */
    .news-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 14px;
    }

    .news-filter-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .chip-filter-btn {
      padding: 7px 16px;
      border-radius: 20px;
      background: var(--bg-card);
      border: 1px solid var(--glass-border);
      color: var(--text-sub);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .chip-filter-btn.active {
      background: var(--accent-gradient);
      color: #ffffff;
      border-color: transparent;
    }

    .news-articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }

    .article-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      transition: transform 0.25s ease;
    }

    .article-card:hover {
      transform: translateY(-5px);
      border-color: rgba(233, 64, 87, 0.4);
    }

    .article-thumb-wrapper {
      position: relative;
      width: 100%;
      height: 190px;
      overflow: hidden;
    }

    .article-thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .article-card:hover .article-thumb-img {
      transform: scale(1.08);
    }

    .article-tag-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(14, 11, 28, 0.85);
      backdrop-filter: blur(8px);
      color: #f6d365;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.74rem;
      font-weight: 700;
      border: 1px solid rgba(246, 211, 101, 0.3);
    }

    .article-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .article-body h3 {
      font-size: 1.18rem;
      font-weight: 700;
      line-height: 1.35;
    }

    .article-body p {
      color: var(--text-sub);
      font-size: 0.92rem;
      line-height: 1.6;
      flex: 1;
    }

    .article-footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    /* ==========================================================================
       Attendance History & Registry Section
       ========================================================================== */
    .attendance-stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }

    .stat-metric-card {
      background: var(--bg-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-metric-card .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(233, 64, 87, 0.15);
      color: #e94057;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-metric-card h4 {
      font-size: 1.85rem;
      font-weight: 800;
      line-height: 1;
    }

    .stat-metric-card p {
      font-size: 0.85rem;
      color: var(--text-sub);
    }

    .attendance-table-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-card);
      overflow-x: auto;
    }

    table.attendance-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    table.attendance-table th {
      padding: 12px 16px;
      color: var(--text-muted);
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--glass-border);
    }

    table.attendance-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.92rem;
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
    }

    .badge-status.verified {
      background: rgba(46, 204, 113, 0.15);
      color: #2ecc71;
      border: 1px solid rgba(46, 204, 113, 0.3);
    }

    .badge-status.incomplete {
      background: rgba(243, 156, 18, 0.15);
      color: #f39c12;
      border: 1px solid rgba(243, 156, 18, 0.3);
    }

    /* ==========================================================================
       Relaxation & Zen Breathwork Module
       ========================================================================== */
    .pranayama-stage-card {
      background: linear-gradient(145deg, #16122d, #0b071a);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
      margin-bottom: 30px;
      overflow: hidden;
    }

    .pranayama-circle-wrapper {
      position: relative;
      width: 260px;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 28px 0;
    }

    .pranayama-orb {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #ffffff, #d9ccff 30%, #8fb4ff 65%, #5fd3b5);
      box-shadow: 0 0 70px rgba(143, 180, 255, 0.6);
      transition: transform 4s ease-in-out;
    }

    .pranayama-orb.inhale {
      transform: scale(1.6);
    }

    .pranayama-orb.exhale {
      transform: scale(0.9);
    }

    .pranayama-text-guide {
      font-family: var(--font-title);
      font-size: 1.8rem;
      font-weight: 700;
      color: #f5f3ff;
      margin-bottom: 6px;
    }

    /* Ambient Sounds Grid */
    .ambient-sounds-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .ambient-sound-btn {
      background: var(--bg-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .ambient-sound-btn.playing {
      background: linear-gradient(135deg, rgba(155, 89, 182, 0.35), rgba(41, 128, 185, 0.35));
      border-color: #9b59b6;
      box-shadow: 0 0 20px rgba(155, 89, 182, 0.4);
    }

    /* ==========================================================================
       Modals, Dialogs, Toast Notifications
       ========================================================================== */
    .modal-scrim {
      position: fixed;
      inset: 0;
      background: rgba(8, 6, 18, 0.75);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .modal-scrim.open {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-window {
      background: var(--bg-dark);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      width: min(540px, 100%);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9);
      transform: scale(0.94);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-scrim.open .modal-window {
      transform: scale(1);
    }

    .modal-header {
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--glass-border);
    }

    .modal-body {
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--glass-border);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .input-field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-field-group label {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-sub);
    }

    .input-text, .input-select, .input-textarea {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 12px 16px;
      color: var(--text-main);
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
    }

    .input-text:focus, .input-select:focus, .input-textarea:focus {
      border-color: #e94057;
      box-shadow: 0 0 10px rgba(233, 64, 87, 0.3);
    }

    /* Toast Stack */
    .toast-tray {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast-msg {
      background: rgba(23, 19, 44, 0.95);
      border: 1px solid var(--glass-border);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #ffffff;
      min-width: 280px;
      max-width: 380px;
      pointer-events: auto;
      animation: slideToast 0.3s ease forwards;
    }

    .toast-msg.success {
      border-left: 4px solid #2ecc71;
    }

    .toast-msg.alert {
      border-left: 4px solid #e74c3c;
    }

    @keyframes slideToast {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* ==========================================================================
       Mobile Bottom Navigation
       ========================================================================== */
    .mobile-tab-bar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 150;
      background: rgba(14, 11, 28, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--glass-border);
      padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
      justify-content: space-around;
    }

    @media (max-width: 768px) {
      .mobile-tab-bar {
        display: flex;
      }
      nav.sub-navbar {
        display: none;
      }
      main.main-content {
        padding-bottom: 90px;
      }
      .brand-title {
        font-size: 1.3rem;
      }
      .brand-word-1 {
        font-size: 1.4rem;
      }
      .brand-word-2 {
        font-size: 0.9rem;
      }
    }

    .mobile-tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      background: none;
      border: none;
      color: var(--text-sub);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      padding: 4px;
    }

    .mobile-tab-item.active {
      color: #e94057;
    }

    .mobile-tab-item svg {
      width: 22px;
      height: 22px;
    }
  </style>
</head>
<body>

  <!-- Ambient Backdrop with Yoga Visuals & Gradient Orbs -->
  <div class="bg-canvas-container" aria-hidden="true">
    <img id="ambientBgImg" class="ambient-bg-img" src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1920&q=80" alt="Yoga Zen Ambient">
    <div class="ambient-gradient-overlay"></div>
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>
  </div>

  <div class="app-shell">
    
    <!-- ==========================================================================
         Header with Double-Color Advanced Branding & Quick Controls
         ========================================================================== -->
    <header class="main-header">
      <a href="#" class="brand-group" onclick="switchTab('dashboard'); return false;">
        <div class="brand-logo-badge" title="Nithya Yoga & Wellness">
          <!-- Lotus Emblem SVG -->
          <svg viewBox="0 0 24 24">
            <path d="M12 2C12 2 15 7 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 7 12 2 12 2ZM6.5 7.5C6.5 7.5 10 10.5 10.5 13C11 15 9.5 16.5 7.5 16.5C5.5 16.5 4.5 14.5 4.5 13C4.5 10 6.5 7.5 6.5 7.5ZM17.5 7.5C17.5 7.5 19.5 10 19.5 13C19.5 14.5 18.5 16.5 16.5 16.5C14.5 16.5 13 15 13.5 13C14 10.5 17.5 7.5 17.5 7.5ZM12 15C13.5 15 18 16.5 19.5 19C19.5 19 16 20.5 12 20.5C8 20.5 4.5 19 4.5 19C6 16.5 10.5 15 12 15Z"/>
          </svg>
        </div>
        <div class="brand-text">
          <div class="brand-title">
            <span class="brand-word-1">NITHYA</span>
            <span class="brand-word-2">YOGA & WELLNESS</span>
          </div>
          <div class="brand-tagline">
            <span id="brandSubTag">நித்யா யோகா & லைவ் ஸ்டுடியோ</span>
            <span class="live-indicator"><span class="pulse-dot"></span> LIVE CLASS ACTIVE</span>
          </div>
        </div>
      </a>

      <!-- Quick Actions Header -->
      <div class="header-actions">
        <!-- Sound Test & Alert Button (Loud Chime) -->
        <button type="button" class="btn-icon-pill sound-bell-btn" id="headerSoundBtn" onclick="testLoudSound()" title="சத்தமான ரிமைண்டர் ஒலியைச் சோதிக்கவும் (Test Loud Sound)">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span class="sound-badge"></span>
          <span class="hide-mobile" id="lblTestSound">சவுண்ட் டெஸ்ட்</span>
        </button>

        <!-- Quick Live Class Launcher -->
        <button type="button" class="btn-icon-pill btn-primary-gradient" onclick="switchTab('live-studio'); startOrJoinLive();">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
          <span id="lblHeaderLive">லைவ் கிளாஸ்</span>
        </button>

        <!-- Language Switcher (EN / தமிழ்) -->
        <button type="button" class="btn-icon-pill" onclick="toggleLanguage()" id="langToggleBtn" title="Change Language">
          🌐 <span>தமிழ்</span>
        </button>

        <!-- Theme Toggle (Dark / Light) -->
        <button type="button" class="btn-icon-pill" onclick="toggleTheme()" id="themeToggleBtn" title="Theme Toggle">
          🌙
        </button>
      </div>
    </header>

    <!-- Top Navigation Tabs (Desktop & Tablet) -->
    <nav class="sub-navbar" aria-label="Main Navigation">
      <button type="button" class="nav-tab-btn active" data-tab="dashboard" onclick="switchTab('dashboard')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span class="tab-label" data-en="Home Dashboard" data-ta="முகப்பு பக்கம்">முகப்பு பக்கம்</span>
      </button>

      <button type="button" class="nav-tab-btn" data-tab="chakras-3d" onclick="switchTab('chakras-3d')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path></svg>
        <span class="tab-label" data-en="3D Chakras & Yoga" data-ta="3D சக்கரங்கள் & யோகா">3D சக்கரங்கள் & யோகா</span>
      </button>

      <button type="button" class="nav-tab-btn" data-tab="live-studio" onclick="switchTab('live-studio')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
        <span class="tab-label" data-en="Live Class Studio" data-ta="லைவ் கிளாஸ் ஸ்டுடியோ">லைவ் கிளாஸ் ஸ்டுடியோ</span>
      </button>

      <button type="button" class="nav-tab-btn" data-tab="reminders" onclick="switchTab('reminders')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span class="tab-label" data-en="Smart Reminders" data-ta="ரிமைண்டர் ஆப்">ரிமைண்டர் ஆப்</span>
      </button>

      <button type="button" class="nav-tab-btn" data-tab="yoga-news" onclick="switchTab('yoga-news')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
        <span class="tab-label" data-en="Yoga News & Wisdom" data-ta="யோகா நியூஸ் & விசேஷங்கள்">யோகா நியூஸ் & விசேஷங்கள்</span>
      </button>

      <button type="button" class="nav-tab-btn" data-tab="attendance-logs" onclick="switchTab('attendance-logs')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>
        <span class="tab-label" data-en="70% Attendance Records" data-ta="அட்டெண்டன்ஸ் ரெக்கார்ட்">அட்டெண்டன்ஸ் ரெக்கார்ட்</span>
      </button>

      <button type="button" class="nav-tab-btn" data-tab="zen-relaxation" onclick="switchTab('zen-relaxation')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
        <span class="tab-label" data-en="Relaxation & Sounds" data-ta="தியானம் & அமைதி">தியானம் & அமைதி</span>
      </button>
    </nav>

    <!-- ==========================================================================
         Main App Content Pages
         ========================================================================== -->
    <main class="main-content">
      
      <!-- TAB 1: DASHBOARD & 3D OVERVIEW -->
      <section id="tab-dashboard" class="tab-section active">
        <!-- Hero Section -->
        <div class="hero-grid">
          <div class="hero-card">
            <div class="hero-badge-tag">
              ✨ NITHYA YOGA &amp; ADVANCED WELLNESS
            </div>
            <h1 class="hero-title-main">
              உடலையும் மனதையும் <br>
              <span class="gradient-hero">ஆரோக்கியமாக்குங்கள்.</span>
            </h1>
            <p class="hero-subtitle-ta">
              நேரத்துக்கு யோகா, தண்ணீர் &amp; உணவு ரிமைண்டர்! லைவ் வகுப்புகளுடன் 70% ஆட்டோமேட்டிக் அட்டெண்டன்ஸ்.
            </p>
            <p class="hero-desc">
              தினசரி வேலைகளுக்கு மத்தியில் உங்கள் ஆரோக்கியத்தை மறக்காமல் பேண உதவும் பிரத்யேக தளம். நண்பர்களுடன் இணைந்து லைவ் வகுப்புகளில் பங்குபெற்று உடற்பயிற்சி செய்யுங்கள்.
            </p>
            <div class="hero-actions-row">
              <button type="button" class="btn-big btn-primary-gradient" onclick="switchTab('live-studio'); startOrJoinLive();">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                <span>லைவ் வகுப்பில் இணைக</span>
              </button>
              <button type="button" class="btn-big btn-icon-pill" onclick="openNewReminderModal()">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>புதிய ரிமைண்டர் சேர்</span>
              </button>
            </div>
          </div>

          <!-- 3D Chakra Interactive Preview Card -->
          <div class="chakra-3d-card">
            <div class="chakra-visual-header">
              <h3>
                <span style="color:#00cec9;">☸</span>
                <span>7 சக்கரங்கள் &amp; யோகா தோரணை</span>
              </h3>
              <span style="font-size:0.75rem; color:var(--text-muted);">கிளிக் செய்து பாருங்கள்</span>
            </div>

            <!-- SVG 3D Meditating Figure -->
            <div class="chakra-stage-container" id="chakraStage">
              <svg class="yogi-svg" viewBox="0 0 400 450" id="yogiSvg">
                <defs>
                  <!-- Radial energy gradients -->
                  <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#9b59b6" stop-opacity="0.8"/>
                    <stop offset="60%" stop-color="#3498db" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
                  </radialGradient>
                  <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <!-- Divine Aura Circle -->
                <circle cx="200" cy="225" r="180" fill="url(#auraGlow)" opacity="0.6"/>

                <!-- Meditating Human Silhouette (Padmasana) -->
                <!-- Head -->
                <path d="M 200 65 C 182 65, 172 82, 172 105 C 172 128, 184 142, 200 142 C 216 142, 228 128, 228 105 C 228 82, 218 65, 200 65 Z" fill="#2d2254" stroke="#a29bfe" stroke-width="2.5" opacity="0.9"/>
                <!-- Neck & Torso -->
                <path d="M 190 142 L 170 170 L 140 210 L 145 280 L 170 330 L 230 330 L 255 280 L 260 210 L 230 170 L 210 142 Z" fill="#241b45" stroke="#a29bfe" stroke-width="2" opacity="0.95"/>
                <!-- Arms resting on knees (Gyan Mudra) -->
                <path d="M 170 170 L 105 235 L 70 310 L 95 330 L 145 280" fill="none" stroke="#8372b6" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M 230 170 L 295 235 L 330 310 L 305 330 L 255 280" fill="none" stroke="#8372b6" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Folded Legs (Lotus Pose) -->
                <path d="M 95 330 C 120 375, 160 380, 200 370 C 240 380, 280 375, 305 330 C 270 360, 230 355, 200 350 C 170 355, 130 360, 95 330 Z" fill="#2d2254" stroke="#a29bfe" stroke-width="2"/>

                <!-- Central Pranic Sushumna Nadi Line -->
                <line x1="200" y1="65" x2="200" y2="350" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="4,4"/>

                <!-- 7 Chakras Aligned Vertically with Click Handlers -->
                <!-- 1. Sahasrara (Crown - 963Hz - Violet/White) -->
                <g class="chakra-node active-chakra" data-id="sahasrara" onclick="selectChakra('sahasrara')" style="--node-glow:#9b59b6;">
                  <circle cx="200" cy="65" r="14" fill="#9b59b6" filter="url(#glowFilter)"/>
                  <circle cx="200" cy="65" r="7" fill="#ffffff"/>
                </g>

                <!-- 2. Ajna (Third Eye - 852Hz - Indigo) -->
                <g class="chakra-node" data-id="ajna" onclick="selectChakra('ajna')" style="--node-glow:#34495e;">
                  <circle cx="200" cy="105" r="13" fill="#2980b9" filter="url(#glowFilter)"/>
                  <circle cx="200" cy="105" r="6" fill="#74b9ff"/>
                </g>

                <!-- 3. Vishuddha (Throat - 741Hz - Sky Blue) -->
                <g class="chakra-node" data-id="vishuddha" onclick="selectChakra('vishuddha')" style="--node-glow:#00cec9;">
                  <circle cx="200" cy="150" r="13" fill="#00cec9" filter="url(#glowFilter)"/>
                  <circle cx="200" cy="150" r="6" fill="#81ecec"/>
                </g>

                <!-- 4. Anahata (Heart - 639Hz - Green) -->
                <g class="chakra-node" data-id="anahata" onclick="selectChakra('anahata')" style="--node-glow:#27ae60;">
                  <circle cx="200" cy="205" r="14" fill="#27ae60" filter="url(#glowFilter)"/>
                  <circle cx="200" cy="205" r="6" fill="#55efc4"/>
                </g>

                <!-- 5. Manipura (Solar Plexus - 528Hz - Yellow/Gold) -->
                <g class="chakra-node" data-id="manipura" onclick="selectChakra('manipura')" style="--node-glow:#f1c40f;">
                  <circle cx="200" cy="255" r="13" fill="#f1c40f" filter="url(#glowFilter)"/>
                  <circle cx="200" cy="255" r="6" fill="#ffeaa7"/>
                </g>

                <!-- 6. Svadhishthana (Sacral - 417Hz - Orange) -->
                <g class="chakra-node" data-id="svadhishthana" onclick="selectChakra('svadhishthana')" style="--node-glow:#e67e22;">
                  <circle cx="200" cy="300" r="13" fill="#e67e22" filter="url(#glowFilter)"/>
                  <circle cx="200" cy="300" r="6" fill="#fab1a0"/>
                </g>

                <!-- 7. Muladhara (Root - 396Hz - Crimson Red) -->
                <g class="chakra-node" data-id="muladhara" onclick="selectChakra('muladhara')" style="--node-glow:#e74c3c;">
                  <circle cx="200" cy="350" r="15" fill="#e74c3c" filter="url(#glowFilter)"/>
                  <circle cx="200" cy="350" r="7" fill="#ff7675"/>
                </g>
              </svg>
            </div>

            <!-- Active Chakra Details Pill -->
            <div class="chakra-quick-info" id="activeChakraInfoBox">
              <div class="chakra-info-left">
                <div class="chakra-pill-icon" id="chakraPillIcon" style="background:#9b59b6;">
                  ॐ
                </div>
                <div class="chakra-text-details">
                  <h4 id="chakraDetailName">சகஸ்ரார சக்கரம் (Sahasrara - Crown)</h4>
                  <p id="chakraDetailSub">மந்திரம்: AUM | அதிர்வு: 963 Hz | ஞானம் &amp; அமைதி</p>
                </div>
              </div>
              <button type="button" class="play-freq-btn" onclick="playChakraFrequency()">
                🔊 <span id="lblFreqTone">ஒலி கேட்க</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard Modules Grid: Water, Meals, Next Yoga Class -->
        <div class="dashboard-modules-grid">
          
          <!-- Water Intake Card (Forgetfulness Helper) -->
          <div class="dash-box water-tracker-card">
            <div class="dash-box-top">
              <div class="dash-box-title">
                <div class="icon-badge" style="background:#00cec9;">💧</div>
                <div>
                  <h4>தண்ணீர் ரிமைண்டர்</h4>
                  <p style="font-size:0.8rem; color:var(--text-sub);">இலக்கு: 8 டம்ளர்கள் (2 லிட்டர்)</p>
                </div>
              </div>
              <span id="waterCountBadge" style="font-weight:800; font-size:1.1rem; color:#00cec9;">3 / 8</span>
            </div>

            <p style="font-size:0.88rem; color:var(--text-sub);">
              ஞாபக மறதியைத் தவிர்க்க: ஒவ்வொரு 1.5 மணி நேரத்துக்கும் தண்ணீர் குடிப்பது உடலுக்கும் மூளைக்கும் புத்துணர்ச்சி தரும்!
            </p>

            <div class="water-glasses-row" id="waterGlassesRow">
              <div class="water-glass-btn filled" onclick="toggleGlass(0)">🥛 1</div>
              <div class="water-glass-btn filled" onclick="toggleGlass(1)">🥛 2</div>
              <div class="water-glass-btn filled" onclick="toggleGlass(2)">🥛 3</div>
              <div class="water-glass-btn" onclick="toggleGlass(3)">🥛 4</div>
              <div class="water-glass-btn" onclick="toggleGlass(4)">🥛 5</div>
              <div class="water-glass-btn" onclick="toggleGlass(5)">🥛 6</div>
              <div class="water-glass-btn" onclick="toggleGlass(6)">🥛 7</div>
              <div class="water-glass-btn" onclick="toggleGlass(7)">🥛 8</div>
            </div>

            <div class="water-action-row">
              <button type="button" class="btn-icon-pill" onclick="logWaterGlass()" style="background:#00cec9; color:#000;">
                +1 டம்ளர் குடித்தேன்
              </button>
              <a href="#" class="btn-wa-share" onclick="shareWaterOnWhatsApp(); return false;">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.57 2.083.917 3.296.917 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm0 10.37c-1.023 0-2.022-.293-2.883-.846l-.206-.132-1.742.457.465-1.7-.135-.215c-.605-.961-.924-2.001-.923-3.168.001-2.54 2.067-4.606 4.608-4.606 2.542 0 4.608 2.066 4.608 4.606 0 2.541-2.066 4.604-4.607 4.604z"/></svg>
                WhatsApp நினைவூட்டல்
              </a>
            </div>
          </div>

          <!-- Meals & Healthy Diet Reminder Card -->
          <div class="dash-box" style="border-left: 4px solid #f1c40f;">
            <div class="dash-box-top">
              <div class="dash-box-title">
                <div class="icon-badge" style="background:#f1c40f; color:#000;">🥗</div>
                <div>
                  <h4>உணவு &amp; டயட் நேரம்</h4>
                  <p style="font-size:0.8rem; color:var(--text-sub);">நேரத்துக்குச் சாப்பிட மறக்காதீங்க</p>
                </div>
              </div>
              <span class="badge-status verified" style="font-size:0.75rem;">இன்றைய திட்டம்</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px;">
                <span>🥣 காலை உணவு (8:30 AM)</span>
                <span style="color:#2ecc71; font-weight:700;">✓ முடிந்தது</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px;">
                <span>🍲 மதிய உணவு (1:00 PM)</span>
                <span style="color:#2ecc71; font-weight:700;">✓ முடிந்தது</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(241,196,15,0.1); padding:8px 12px; border-radius:10px; border:1px solid rgba(241,196,15,0.3);">
                <span>🍎 மாலை பழங்கள்/நட்ஸ் (5:00 PM)</span>
                <span style="color:#f1c40f; font-weight:700;">அடுத்தது!</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px;">
                <span>🥗 இரவு மிதமான உணவு (7:45 PM)</span>
                <span style="color:var(--text-muted);">காத்திருப்பு</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
              <button type="button" class="btn-icon-pill" onclick="playLoudChime()">
                🔔 சவுண்ட் ஒலி எழுப்பு
              </button>
              <a href="#" class="btn-wa-share" onclick="shareMealReminderWhatsApp(); return false;">
                WhatsApp மெசேஜ்
              </a>
            </div>
          </div>

          <!-- Upcoming Live Yoga Class Card with 70% Attendance Warning -->
          <div class="dash-box" style="border-left: 4px solid #e94057;">
            <div class="dash-box-top">
              <div class="dash-box-title">
                <div class="icon-badge" style="background:#e94057;">🧘‍♀️</div>
                <div>
                  <h4>இன்றைய யோகா வகுப்பு</h4>
                  <p style="font-size:0.8rem; color:var(--text-sub);">மாலை விந்யாசா &amp; தியானம்</p>
                </div>
              </div>
              <span class="live-broadcast-pill" style="font-size:0.7rem;">நேரலை</span>
            </div>

            <p style="font-size:0.88rem; color:var(--text-sub);">
              பயிற்சியாளர்: <b>நித்யா</b> (Nithya)<br>
              நேரம்: <b>இன்று மாலை 6:00 PM (45 நிமிடங்கள்)</b><br>
              <span style="color:#f1c40f;">★ 70% நேரம் (32 நிமிடம்) வகுப்பில் இருந்தால் ஆட்டோமேட்டிக் அட்டெண்டன்ஸ் மார்க் ஆகும்!</span>
            </p>

            <div style="display:flex; gap:10px; margin-top:8px;">
              <button type="button" class="btn-primary-gradient" style="flex:1; padding:10px; border-radius:12px; font-weight:700; cursor:pointer;" onclick="switchTab('live-studio'); startOrJoinLive();">
                வகுப்பில் சேரவும்
              </button>
              <a href="#" class="btn-wa-share" onclick="shareClassInviteWhatsApp(); return false;" title="நண்பர்களுக்கு WhatsApp லிங்க் அனுப்ப">
                லிங்க் அனுப்பு
              </a>
            </div>
          </div>

        </div>

      </section>

      <!-- TAB 2: 3D CHAKRAS & FULL ASANA EXPLORER -->
      <section id="tab-chakras-3d" class="tab-section">
        <div class="sec-head" style="margin-bottom:24px;">
          <div>
            <h2 style="font-family:var(--font-title); font-size:2rem;">மனித உடலின் 7 சக்கரங்கள் &amp; யோகா தோரணைகள்</h2>
            <p style="color:var(--text-sub);">தலையிலிருந்து பாதம் வரை உடலின் சக்தி மையங்கள், மந்திரங்கள் மற்றும் ஆசனங்கள்</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;" id="chakraCardsGrid">
          <!-- Dynamic Chakra Cards populated by JS -->
        </div>
      </section>

      <!-- TAB 3: LIVE CLASS STUDIO WITH 70% ATTENDANCE TRACKER & GOOGLE MEET -->
      <section id="tab-live-studio" class="tab-section">
        <div class="sec-head" style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-family:var(--font-title); font-size:2rem;">நித்யா யோகா லைவ் ஸ்டுடியோ</h2>
            <p style="color:var(--text-sub);">நேரலை வகுப்பில் இணையுங்கள் · கேமரா &amp; மைக் வசதி · 70% ஆட்டோமேடிக் அட்டெண்டன்ஸ்</p>
          </div>
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn-icon-pill" onclick="launchGoogleMeet()" style="border-color:#4285f4; color:#4285f4;" title="Open in Google Meet">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
              <span>Google Meet மூலம் சேர</span>
            </button>
            <button type="button" class="btn-icon-pill btn-primary-gradient" onclick="shareLiveInviteLink()">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.57 2.083.917 3.296.917 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm0 10.37c-1.023 0-2.022-.293-2.883-.846l-.206-.132-1.742.457.465-1.7-.135-.215c-.605-.961-.924-2.001-.923-3.168.001-2.54 2.067-4.606 4.608-4.606 2.542 0 4.608 2.066 4.608 4.606 0 2.541-2.066 4.604-4.607 4.604z"/></svg>
              <span>லிங்க் WhatsApp இல் அனுப்பு</span>
            </button>
          </div>
        </div>

        <div class="live-studio-container">
          
          <!-- Video Screen & 70% Progress Area -->
          <div class="video-viewport-card">
            <div class="video-screen-wrapper">
              
              <!-- Video Stream (Local WebRTC or Stream) -->
              <video id="localVideoFeed" autoplay playsinline muted></video>
              
              <!-- Placeholder when video is off -->
              <div class="video-offline-placeholder" id="videoPlaceholder">
                <div style="width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg, #e94057, #8a2387); display:flex; align-items:center; justify-content:center; font-size:2.2rem; margin-bottom:14px; box-shadow:0 10px 30px rgba(233,64,87,0.5);">
                  🧘‍♀️
                </div>
                <h3 style="font-size:1.4rem; margin-bottom:6px;">நித்யா யோகா லைவ் ஸ்டுடியோ</h3>
                <p style="color:var(--text-sub); max-width:420px; font-size:0.92rem;">
                  வகுப்பில் இணைய கீழே உள்ள <b>"கேமராவை ஆன் செய்"</b> அல்லது <b>"வகுப்பைத் தொடங்கு"</b> பொத்தானை அழுத்தவும்.
                </p>
                <button type="button" class="btn-primary-gradient" style="margin-top:16px; padding:10px 24px; border-radius:20px; font-weight:700; cursor:pointer;" onclick="toggleCameraStream()">
                  📹 கேமராவை ஆன் செய்
                </button>
              </div>

              <!-- Live Indicator Overlay -->
              <div class="studio-active-overlay">
                <div class="live-broadcast-pill">
                  <span class="pulse-dot"></span>
                  <span id="liveStatusText">லைவ் வகுப்பு செயலில்</span>
                </div>
                <div class="timer-pill" id="liveTimerDisplay">
                  00:00 / 10:00
                </div>
              </div>
            </div>

            <!-- Automatic 70% Attendance Tracker Banner -->
            <div class="attendance-gauge-banner">
              <div class="gauge-top-row">
                <span id="attendanceTrackerLabel">
                  ⏱️ உங்கள் வருகை நேரம்: <b><span id="timeAttendedText">0 நிமிடம்</span></b> (<span id="attendancePctText">0%</span>)
                </span>
                <span class="gauge-target-badge" id="attendanceGoalBadge">
                  🎯 இலக்கு: 70% (ஆட்டோமேட்டிக் அட்டெண்டன்ஸ்)
                </span>
              </div>
              <div class="gauge-bar-track">
                <div class="gauge-70-marker"></div>
                <div class="gauge-fill" id="attendanceGaugeFill"></div>
              </div>
              <p style="font-size:0.8rem; color:var(--text-sub); margin-top:2px;" id="attendanceNoticeText">
                💡 இந்த வகுப்பில் குறைந்தது 70% நேரம் இருந்தவுடன் உங்கள் அட்டெண்டன்ஸ் தானாகப் பதிவு செய்யப்பட்டு சான்றிதழ் வழங்கப்படும்.
              </p>
            </div>

            <!-- Media Controls Bar -->
            <div class="video-controls-row">
              <button type="button" class="btn-media-control" id="btnToggleCam" onclick="toggleCameraStream()" title="Camera On/Off">
                📷
              </button>
              <button type="button" class="btn-media-control" id="btnToggleMic" onclick="toggleMicrophone()" title="Mic Mute/Unmute">
                🎙️
              </button>
              <button type="button" class="btn-media-control" id="btnToggleScreen" onclick="toggleScreenShare()" title="Screen Share">
                🖥️
              </button>
              <button type="button" class="btn-media-control" onclick="simulateAttendanceFast()" title="70% டெஸ்ட் செய்ய (Fast 70% Attendance Simulator)">
                ⚡ 70%
              </button>
              <button type="button" class="btn-leave-class" onclick="leaveLiveClass()">
                ✕ வகுப்பிலிருந்து வெளியேறு
              </button>
            </div>
          </div>

          <!-- Studio Sidebar (Class Details, Link Generator & Student Registry) -->
          <div class="studio-side-card">
            <h3>📋 வகுப்பு விவரங்கள் &amp; அழைப்பு லிங்க்</h3>
            
            <div class="class-info-box">
              <div style="font-size:0.85rem; color:var(--text-sub);">வகுப்பு பெயர்:</div>
              <div style="font-size:1.05rem; font-weight:700;">Morning Prana Flow &amp; Spine Health</div>
              <div style="font-size:0.85rem; color:var(--text-sub); margin-top:6px;">பயிற்சியாளர்: <b>நித்யா (Nithya)</b></div>
              <div style="font-size:0.85rem; color:var(--text-sub);">மொத்த நேரம்: <b>10 நிமிடங்கள் (Demo Mode)</b></div>
            </div>

            <!-- Shareable Live Link Box -->
            <div class="share-invite-box">
              <span style="font-size:0.88rem; font-weight:700;">🔗 நண்பர்களுக்கான நேரடி இணைப்பு:</span>
              <div class="invite-link-input-group">
                <input type="text" id="liveRoomLinkInput" readonly value="https://nithyayoga.live/join?room=nithya-live-studio">
                <button type="button" class="btn-icon-pill" onclick="copyLiveRoomLink()" title="Copy Link">
                  📋 நகலெடு
                </button>
              </div>
              <button type="button" class="btn-wa-share" style="width:100%; justify-content:center; padding:10px;" onclick="shareLiveInviteLink()">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.57 2.083.917 3.296.917 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm0 10.37c-1.023 0-2.022-.293-2.883-.846l-.206-.132-1.742.457.465-1.7-.135-.215c-.605-.961-.924-2.001-.923-3.168.001-2.54 2.067-4.606 4.608-4.606 2.542 0 4.608 2.066 4.608 4.606 0 2.541-2.066 4.604-4.607 4.604z"/></svg>
                WhatsApp இல் லிங்க் அனுப்பவும்
              </button>
            </div>

            <!-- Alternative Google Meet Launch -->
            <div class="meet-integrations-box">
              <span style="font-size:0.88rem; font-weight:700; color:#4285f4;">கூகுள் மீட் (Google Meet) மூலம் இணைக்க:</span>
              <p style="font-size:0.8rem; color:var(--text-sub);">
                உங்களுக்கு Google Meet பழக்கம் என்றால், உடனடியாக புதிய Google Meet அறையைத் தொடங்கலாம்!
              </p>
              <button type="button" class="btn-icon-pill" onclick="launchGoogleMeet()" style="background:#4285f4; color:#ffffff; border:none; justify-content:center;">
                🚀 Open Google Meet
              </button>
            </div>

            <!-- Enrolled Students Presence in Studio -->
            <div>
              <span style="font-size:0.88rem; font-weight:700;">பங்குபெறும் மாணவர்கள்:</span>
              <ul style="list-style:none; margin-top:8px; display:flex; flex-direction:column; gap:6px;" id="studioStudentsList">
                <li style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px; font-size:0.85rem;">
                  <span>🧘‍♀️ நித்யா (பயிற்சியாளர் - Host)</span>
                  <span style="color:#2ecc71; font-weight:700;">ஆன்லைன்</span>
                </li>
                <li style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px; font-size:0.85rem;">
                  <span>👤 நீங்கள் (Student - You)</span>
                  <span id="studentLiveBadge" style="color:#3498db; font-weight:700;">இணைக்கப்பட்டுள்ளீர்கள்</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      <!-- TAB 4: SMART REMINDERS & LOUD SOUND SYSTEM (FORGETFULNESS APP) -->
      <section id="tab-reminders" class="tab-section">
        <div class="reminders-hero-banner">
          <div>
            <h2 style="font-family:var(--font-title); font-size:1.8rem; color:#fff;">ஞாபக மறதிக்கான ஸ்பெஷல் ரிமைண்டர் தளம்</h2>
            <p style="color:#f5e8fc; max-width:620px; font-size:0.95rem; margin-top:4px;">
              தண்ணீர், நேரம் தவறாத சாப்பாடு, மாத்திரை, குடும்பத்தினருடன் பேசுதல் &amp; யோகா பயிற்சிகளை எப்போதும் தவறவிடாமல் இருக்க உதவும் நவீன குரல்/ஒலி நினைவூட்டல்!
            </p>
          </div>
          <button type="button" class="btn-big btn-primary-gradient" onclick="openNewReminderModal()">
            + புதிய ரிமைண்டர் சேர்க்க
          </button>
        </div>

        <!-- Master Sound Control Panel -->
        <div class="sound-settings-panel">
          <div class="sound-row">
            <div>
              <h4 style="font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                🔊 அதிக ஒலி &amp; சவுண்ட் சிஸ்டம் (Loud Chime Settings)
              </h4>
              <p style="font-size:0.85rem; color:var(--text-sub);">
                ரிமைண்டர் நேரம் வரும்போது சத்தமாக மணி ஒலிக்கும். ஒலி அளவை இங்கே அமைத்துக் கொள்ளலாம்.
              </p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <button type="button" class="btn-icon-pill" onclick="testLoudSound()" style="background:#e94057; color:#fff; border:none;">
                🔔 சவுண்ட் ஒலித்துப்பார்
              </button>
              <button type="button" class="btn-icon-pill" onclick="testTempleGong()">
                🪘 கோயில் மணி ஒலி
              </button>
            </div>
          </div>

          <div class="volume-slider-group">
            <span style="font-size:0.88rem; font-weight:600;">ஒலி அளவு (Volume):</span>
            <input type="range" id="masterVolumeSlider" min="0" max="100" value="95" oninput="updateMasterVolume(this.value)">
            <span id="volumeValueLabel" style="font-weight:700; min-width:40px;">95%</span>
          </div>
        </div>

        <!-- Reminders List Grid -->
        <div class="reminders-grid" id="remindersGridContainer">
          <!-- Populated by JavaScript -->
        </div>
      </section>

      <!-- TAB 5: YOGA NEWS & DAILY HEALTH FEED -->
      <section id="tab-yoga-news" class="tab-section">
        <div class="news-header-row">
          <div>
            <h2 style="font-family:var(--font-title); font-size:2rem;">யோகா நியூஸ் &amp; ஆரோக்கிய விசேஷங்கள்</h2>
            <p style="color:var(--text-sub);">ஆரோக்கியமான வாழ்க்கை முறை, பிராணாயாம வழிகாட்டிகள் மற்றும் ஆயுர்வேத தகவல்கள்</p>
          </div>
          <div class="news-filter-chips">
            <button type="button" class="chip-filter-btn active" onclick="filterNews('all', this)">அனைத்தும் (All)</button>
            <button type="button" class="chip-filter-btn" onclick="filterNews('nutrition', this)">உணவு &amp; டயட்</button>
            <button type="button" class="chip-filter-btn" onclick="filterNews('pranayama', this)">பிராணாயாமம்</button>
            <button type="button" class="chip-filter-btn" onclick="filterNews('mental-peace', this)">மன அமைதி</button>
            <button type="button" class="chip-filter-btn" onclick="filterNews('asanas', this)">ஆசனங்கள்</button>
          </div>
        </div>

        <div class="news-articles-grid" id="newsArticlesGrid">
          <!-- Populated dynamically with high quality imagery & bilingual summaries -->
        </div>
      </section>

      <!-- TAB 6: 70% ATTENDANCE RECORDS & CERTIFICATES -->
      <section id="tab-attendance-logs" class="tab-section">
        <div class="sec-head" style="margin-bottom:20px;">
          <div>
            <h2 style="font-family:var(--font-title); font-size:2rem;">மாணவர் வருகைப்பதிவு (70% Attendance Records)</h2>
            <p style="color:var(--text-sub);">70% நேரத்திற்கு மேல் பங்குபெற்ற வகுப்புகள் ஆட்டோமேட்டிக்காக பதிவு செய்யப்படும் பட்டியல்</p>
          </div>
        </div>

        <!-- Metric Summary Cards -->
        <div class="attendance-stats-cards">
          <div class="stat-metric-card">
            <div class="stat-icon">📅</div>
            <div>
              <h4 id="statTotalClasses">18</h4>
              <p>மொத்த வகுப்புகள்</p>
            </div>
          </div>
          <div class="stat-metric-card">
            <div class="stat-icon" style="background:rgba(46,204,113,0.15); color:#2ecc71;">✓</div>
            <div>
              <h4 id="statVerifiedClasses">16</h4>
              <p>70%+ சரிபார்க்கப்பட்டவை</p>
            </div>
          </div>
          <div class="stat-metric-card">
            <div class="stat-icon" style="background:rgba(241,196,15,0.15); color:#f1c40f;">🎯</div>
            <div>
              <h4>88.9%</h4>
              <p>ஒட்டுமொத்த வருகை விகிதம்</p>
            </div>
          </div>
          <div class="stat-metric-card">
            <div class="stat-icon" style="background:rgba(155,89,182,0.15); color:#9b59b6;">🏆</div>
            <div>
              <h4>தங்க பேட்ஜ்</h4>
              <p>யோகா தொடர் சாதனை</p>
            </div>
          </div>
        </div>

        <div class="attendance-table-card">
          <table class="attendance-table">
            <thead>
              <tr>
                <th>தேதி (Date)</th>
                <th>வகுப்பு பெயர் (Class)</th>
                <th>பயிற்சியாளர் (Instructor)</th>
                <th>செலவழித்த நேரம் (Duration)</th>
                <th>சதவீதம் (Percentage)</th>
                <th>நிலை (Status)</th>
                <th>சான்றிதழ் (Action)</th>
              </tr>
            </thead>
            <tbody id="attendanceTableBody">
              <!-- Populated by JS -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 7: RELAXATION & AMBIENT ZEN SOUNDS -->
      <section id="tab-zen-relaxation" class="tab-section">
        <div class="sec-head" style="margin-bottom:24px;">
          <div>
            <h2 style="font-family:var(--font-title); font-size:2rem;">தியானம் &amp; மன அமைதிக்கான ஒலிகள்</h2>
            <p style="color:var(--text-sub);">சுவாசப் பயிற்சி (Pranayama Breathwork) மற்றும் இயற்கை தியான ஒலிகள்</p>
          </div>
        </div>

        <!-- Box Breathing Interactive Circle -->
        <div class="pranayama-stage-card">
          <div class="pranayama-text-guide" id="pranayamaPhaseText">மூச்சை உள்ளிழுக்கவும் (Inhale)</div>
          <p style="color:var(--text-sub); font-size:0.95rem;">4 வினாடிகள் உள்ளிழுத்து, 4 வினாடிகள் அடக்கி, 4 வினாடிகள் வெளியிடவும்</p>
          
          <div class="pranayama-circle-wrapper">
            <div class="pranayama-orb inhale" id="pranayamaOrb"></div>
          </div>

          <button type="button" class="btn-big btn-primary-gradient" id="btnToggleBreath" onclick="toggleBreathPractice()">
            ⏸️ சுவாசப் பயிற்சியை நிறுத்து
          </button>
        </div>

        <!-- Ambient Sound Generators (Web Audio Synthesized, Zero external dependency!) -->
        <h3 style="font-size:1.3rem; margin-bottom:16px;">இயற்கை தியான ஒலிகள் (Ambient Sounds)</h3>
        <div class="ambient-sounds-grid">
          <button type="button" class="ambient-sound-btn" data-sound="om" onclick="toggleAmbientSound('om', this)">
            <span style="font-size:2rem;">🕉️</span>
            <b>ஓம் தியான ஒலி (Om Drone)</b>
            <span style="font-size:0.8rem; color:var(--text-sub);">ஆழ்ந்த அதிர்வு</span>
          </button>

          <button type="button" class="ambient-sound-btn" data-sound="bowl" onclick="toggleAmbientSound('bowl', this)">
            <span style="font-size:2rem;">🥣</span>
            <b>திபெத்திய கிண்ணம் (Singing Bowl)</b>
            <span style="font-size:0.8rem; color:var(--text-sub);">ஹார்மோனிக்ஸ்</span>
          </button>

          <button type="button" class="ambient-sound-btn" data-sound="rain" onclick="toggleAmbientSound('rain', this)">
            <span style="font-size:2rem;">🌧️</span>
            <b>மென்மையான மழை (Zen Rain)</b>
            <span style="font-size:0.8rem; color:var(--text-sub);">மனதை அமைதிப்படுத்தும்</span>
          </button>

          <button type="button" class="ambient-sound-btn" data-sound="waves" onclick="toggleAmbientSound('waves', this)">
            <span style="font-size:2rem;">🌊</span>
            <b>கடல் அலைகள் (Ocean Surf)</b>
            <span style="font-size:0.8rem; color:var(--text-sub);">அமைதியான லயனம்</span>
          </button>
        </div>
      </section>

    </main>

    <!-- ==========================================================================
         Mobile Bottom App Navigation Bar
         ========================================================================== -->
    <nav class="mobile-tab-bar" aria-label="Mobile Navigation">
      <button type="button" class="mobile-tab-item active" data-tab="dashboard" onclick="switchTab('dashboard')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span>முகப்பு</span>
      </button>

      <button type="button" class="mobile-tab-item" data-tab="chakras-3d" onclick="switchTab('chakras-3d')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path></svg>
        <span>சக்கரங்கள்</span>
      </button>

      <button type="button" class="mobile-tab-item" data-tab="live-studio" onclick="switchTab('live-studio')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
        <span>லைவ்</span>
      </button>

      <button type="button" class="mobile-tab-item" data-tab="reminders" onclick="switchTab('reminders')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>ரிமைண்டர்</span>
      </button>

      <button type="button" class="mobile-tab-item" data-tab="yoga-news" onclick="switchTab('yoga-news')">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path></svg>
        <span>நியூஸ்</span>
      </button>
    </nav>

  </div>

  <!-- ==========================================================================
       Modal: Add New Smart Reminder
       ========================================================================== -->
  <div class="modal-scrim" id="newReminderModal">
    <div class="modal-window">
      <div class="modal-header">
        <h3 style="font-size:1.25rem; font-weight:700;">⏰ புதிய ரிமைண்டர் உருவாக்குதல்</h3>
        <button type="button" class="btn-icon-pill" onclick="closeNewReminderModal()" style="padding:6px 10px;">✕</button>
      </div>
      <div class="modal-body">
        <div class="input-field-group">
          <label>நினைவூட்டல் தலைப்பு (Reminder Title):</label>
          <input type="text" id="remInputTitle" class="input-text" placeholder="எ.கா: மாலை 1 டம்ளர் தண்ணீர் குடிக்கவும்">
        </div>

        <div class="input-field-group">
          <label>வகை (Category):</label>
          <select id="remInputCategory" class="input-select">
            <option value="water">💧 தண்ணீர் (Drink Water)</option>
            <option value="meal">🥗 உணவு / டயட் (Meal / Nutrition)</option>
            <option value="yoga">🧘 யோகா &amp; பயிற்சி (Yoga &amp; Fitness)</option>
            <option value="health">💊 மாத்திரை &amp; வைட்டமின் (Health &amp; Medicine)</option>
            <option value="family">📞 குடும்பத்தினரிடம் பேசுதல் (Call Loved Ones)</option>
            <option value="custom">✨ பொதுவானது (Custom Note)</option>
          </select>
        </div>

        <div class="input-field-group">
          <label>நேரம் (Time):</label>
          <input type="time" id="remInputTime" class="input-text" value="18:30">
        </div>

        <div class="input-field-group">
          <label>நினைவூட்டல் செய்தி (Caring Message in Tamil):</label>
          <textarea id="remInputMsg" class="input-textarea" rows="2" placeholder="கொஞ்சம் உடம்பை கவனிச்சுக்கோங்க... நேரம் வந்துடுச்சு! ❤️"></textarea>
        </div>

        <div class="input-field-group">
          <label>ரிமைண்டர் ஒலி வகை (Loud Chime Tone):</label>
          <select id="remInputSound" class="input-select">
            <option value="singing-bowl">🥣 இனிமையான கோயில் மணி (Temple Bowl Chime)</option>
            <option value="bright-bell">🔔 அதிக சத்தமுள்ள மணி (Bright Loud Bell)</option>
            <option value="om-drone">🕉️ ஓம் தியான ஒலி (Om Drone Vibrations)</option>
            <option value="alert-beep">⚡ எலக்ட்ரானிக் பீப் (High Electronic Beep)</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-icon-pill" onclick="closeNewReminderModal()">ரத்து செய்</button>
        <button type="button" class="btn-primary-gradient btn-big" style="padding:10px 22px;" onclick="saveNewReminder()">
          ரிமைண்டர் சேமி
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Stack -->
  <div class="toast-tray" id="toastTray"></div>

  <!-- ==========================================================================
       Master Interactive Logic: Web Audio, WebRTC, Chakras & Reminders
       ========================================================================== -->
  <script>
    /* --------------------------------------------------------------------------
       State & Storage
       -------------------------------------------------------------------------- */
    let currentLang = 'ta';
    let currentTheme = 'dark';
    let masterVolume = 0.95;
    let audioCtx = null;
    let localStream = null;
    let isLiveActive = false;
    let liveSecondsElapsed = 0;
    let liveTimerInterval = null;
    const CLASS_TOTAL_SECONDS = 600; // 10 minutes total for interactive test (70% = 420s)
    let attendanceVerified = false;

    // Chakras Database with Frequencies, Mantras, Tamil Details, and Benefits
    const CHAKRAS_DATA = {
      sahasrara: {
        nameEn: "Sahasrara (Crown Chakra)",
        nameTa: "சகஸ்ரார சக்கரம் (கிரீட சக்கரம்)",
        mantra: "AUM / OM",
        symbol: "ॐ",
        color: "#9b59b6",
        freq: 963,
        location: "உச்சந்தலை (Top of head)",
        element: "தெய்வீக ஒளி & பேரறிவு (Pure Cosmic Energy)",
        benefitsTa: "மன அமைதி, அதீத ஞாபக சக்தி, ஆன்மீக விழிப்புணர்வு மற்றும் தூக்கமின்மை நீக்கம்.",
        asanasTa: "சிரசாசனம், சவாசனா, தாடாசனம்."
      },
      ajna: {
        nameEn: "Ajna (Third Eye Chakra)",
        nameTa: "ஆக்ஞா சக்கரம் (மூன்றாம் கண்)",
        mantra: "KSHAM / OM",
        symbol: "🕉️",
        color: "#2980b9",
        freq: 852,
        location: "புருவ மத்தி (Between eyebrows)",
        element: "ஒளி & நுண்ணறிவு (Light & Intuition)",
        benefitsTa: "கூர்மையான கவனம், உள்ளுணர்வு பலப்படுதல், முடிவெடுக்கும் திறன் அதிகரித்தல்.",
        asanasTa: "பாலாசனம் (குழந்தை ஆசனம்), கருடாசனம்."
      },
      vishuddha: {
        nameEn: "Vishuddha (Throat Chakra)",
        nameTa: "விசுத்தி சக்கரம் (தொண்டை சக்கரம்)",
        mantra: "HAM",
        symbol: "हं",
        color: "#00cec9",
        freq: 741,
        location: "தொண்டை பகுதி (Throat)",
        element: "ஆகாயம் (Ether / Space)",
        benefitsTa: "தொடர்பு திறன், தைராய்டு சமநிலை, இனிமையான பேச்சு மற்றும் உணர்வுகளை வெளிப்படுத்துதல்.",
        asanasTa: "மத்ஸ்யாசனம் (மீன் ஆசனம்), சர்வாங்காசனம், உஷ்ட்ராசனம்."
      },
      anahata: {
        nameEn: "Anahata (Heart Chakra)",
        nameTa: "அனாகத சக்கரம் (இதய சக்கரம்)",
        mantra: "YAM",
        symbol: "यं",
        color: "#27ae60",
        freq: 639,
        location: "மார்பு கூடு / இதயம் (Center of chest)",
        element: "காற்று (Air)",
        benefitsTa: "அன்பு, இரக்கம், மன அழுத்தம் குறைதல், இதய ஆரோக்கியம் மற்றும் ரத்த ஓட்டம் சீராதல்.",
        asanasTa: "புஜங்காசனம் (நாக ஆசனம்), சேது பந்தாசனம், தனுராசனம்."
      },
      manipura: {
        nameEn: "Manipura (Solar Plexus Chakra)",
        nameTa: "மணிபூரக சக்கரம் (தொப்புள் சக்கரம்)",
        mantra: "RAM",
        symbol: "रं",
        color: "#f1c40f",
        freq: 528,
        location: "தொப்புளுக்கு மேல் (Above navel)",
        element: "நெருப்பு (Fire)",
        benefitsTa: "செரிமான சக்தி, தன்னம்பிக்கை, சோம்பல் நீங்கி சுறுசுறுப்பு அடைதல், எனர்ஜி நிலைப்பு.",
        asanasTa: "நவாசனம் (படகு ஆசனம்), வீரபத்ராசனம், சூரிய நமஸ்காரம்."
      },
      svadhishthana: {
        nameEn: "Svadhishthana (Sacral Chakra)",
        nameTa: "சுவாதிஷ்டான சக்கரம் (இடுப்பு சக்கரம்)",
        mantra: "VAM",
        symbol: "वं",
        color: "#e67e22",
        freq: 417,
        location: "அடிவயிறு / இடுப்பு (Lower abdomen)",
        element: "நீர் (Water)",
        benefitsTa: "உணர்ச்சி சமநிலை, படைப்பாற்றல், உடலில் நீர்ச்சத்து சமநிலை, நெகிழ்வுத்தன்மை.",
        asanasTa: "பத்த கோணாசனம் (வண்ணத்துப்பூச்சி ஆசனம்), அஞ்சனேயாசனம்."
      },
      muladhara: {
        nameEn: "Muladhara (Root Chakra)",
        nameTa: "மூலாதார சக்கரம் (அடிப்படை சக்கரம்)",
        mantra: "LAM",
        symbol: "लं",
        color: "#e74c3c",
        freq: 396,
        location: "முதுகெலும்பின் கீழ் முனை (Base of spine)",
        element: "பூமி (Earth)",
        benefitsTa: "உடல் உறுதி, பயம் நீங்குதல், தரைமட்ட நிலைத்தன்மை மற்றும் எலும்பு பலம்.",
        asanasTa: "விருட்சாசனம் (மர ஆசனம்), மலானாசனம் (ஸ்குவாட்), சுகாசனம்."
      }
    };

    let activeChakraKey = 'sahasrara';

    // Pre-loaded Smart Reminders (Engineered for Forgetfulness)
    let remindersData = [
      {
        id: "rem-1",
        title: "காலை 1 டம்ளர் வெதுவெதுப்பான தண்ணீர்",
        titleEn: "Morning Warm Water & Hydration",
        category: "water",
        time: "06:30 AM",
        msg: "காலை விடிஞ்சாச்சு… ஒரு கிளாஸ் வெதுவெதுப்பான தண்ணி குடிங்க! உடம்பு புத்துணர்ச்சி ஆகும் ❤️",
        sound: "singing-bowl",
        done: true,
        color: "#00cec9"
      },
      {
        id: "rem-2",
        title: "காலை யோகா & பிராணாயாம பயிற்சி",
        titleEn: "Morning Yoga & Pranayama Flow",
        category: "yoga",
        time: "07:15 AM",
        msg: "யோகா டைம்… கொஞ்ச நேரம் பாய் விரிச்சு மூச்சு பயிற்சி பண்ணுங்க 🧘‍♀️",
        sound: "om-drone",
        done: true,
        color: "#9b59b6"
      },
      {
        id: "rem-3",
        title: "ஆரோக்கியமான காலை உணவு சாப்பிடவும்",
        titleEn: "Nutritious Breakfast Reminder",
        category: "meal",
        time: "08:45 AM",
        msg: "சாப்பிடாம வேலை செய்யாதீங்க… நேரத்துக்கு ஆரோக்கியமான உணவு எடுத்துக்கோங்க 🥣",
        sound: "bright-bell",
        done: true,
        color: "#f1c40f"
      },
      {
        id: "rem-4",
        title: "மதிய உணவு & வைட்டமின் மாத்திரைகள்",
        titleEn: "Lunch & Vitamins / Supplements",
        category: "health",
        time: "01:15 PM",
        msg: "மதிய சாப்பாடு நேரம் வந்தாச்சு! அப்புறம் வைட்டமின் எடுத்துக்க மறக்காதீங்க 💊",
        sound: "alert-beep",
        done: false,
        color: "#e67e22"
      },
      {
        id: "rem-5",
        title: "மாலை தாகம் தீர்க்க தண்ணீர் & பழங்கள்",
        titleEn: "Evening Hydration & Fresh Fruit",
        category: "water",
        time: "04:30 PM",
        msg: "தண்ணி குடிக்க நேரமாச்சு! உடம்புக்கு நீர்ச்சத்து ரொம்ப முக்கியம் 💧",
        sound: "singing-bowl",
        done: false,
        color: "#00cec9"
      },
      {
        id: "rem-6",
        title: "குடும்பத்தினரிடம் பேசுதல் / போன் கால்",
        titleEn: "Call Family & Loved Ones",
        category: "family",
        time: "06:00 PM",
        msg: "அம்மா / குடும்பத்துல உள்ளவங்ககிட்ட ஒரு போன் போட்டு நலம் விசாரிங்க 📞",
        sound: "bright-bell",
        done: false,
        color: "#e74c3c"
      },
      {
        id: "rem-7",
        title: "இரவு யோகா & மனதை அமைதிப்படுத்தும் தியானம்",
        titleEn: "Evening Relaxation & Meditation",
        category: "yoga",
        time: "08:30 PM",
        msg: "நாள் முழுக்க உழைச்ச உடம்புக்கு கொஞ்சம் ஓய்வும் தியானமும் குடுங்க ✨",
        sound: "om-drone",
        done: false,
        color: "#9b59b6"
      }
    ];

    // Yoga News & Articles Feed
    const YOGA_NEWS_DATA = [
      {
        id: "news-1",
        category: "pranayama",
        categoryLabel: "பிராணாயாமம்",
        title: "ஞாபக மறதியை விரட்டும் நாடி சுத்தி & பிராணாயாம பயிற்சிகள்",
        titleEn: "Pranayama Breathing Techniques to Enhance Memory",
        thumb: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=80",
        summary: "தினமும் 10 நிமிடங்கள் நாடி சுத்தி பிராணாயாமம் செய்வதன் மூலம் மூளையின் இடது மற்றும் வலது பக்கங்கள் சமநிலை அடைந்து, மூளை செல்களுக்கு ஆக்சிஜன் விநியோகம் அதிகரித்து ஞாபக மறதி வியக்கத்தக்க வகையில் குறைகிறது.",
        readTime: "4 நிமிடம் வாசிப்பு",
        date: "இன்று"
      },
      {
        id: "news-2",
        category: "nutrition",
        categoryLabel: "உணவு & டயட்",
        title: "யோகிகளுக்கான தினசரி நீர்ச்சத்து & சத்தான சாத்விக உணவு முறை",
        titleEn: "The Yogic Hydration Guide & Sattvic Nutrition",
        thumb: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
        summary: "உடலில் 70% நீர் நிறைந்துள்ளது. காலையில் வெதுவெதுப்பான நீர், சீரகத் தண்ணீர், சமைக்காத புதிய பழங்கள் மற்றும் கொட்டைகள் ஆகியவை நாள் முழுவதும் உடலை சுறுசுறுப்பாகவும் புத்துணர்ச்சியாகவும் வைத்திருக்கும்.",
        readTime: "5 நிமிடம் வாசிப்பு",
        date: "நேற்று"
      },
      {
        id: "news-3",
        category: "asanas",
        categoryLabel: "ஆசனங்கள்",
        title: "முதுகு வலி மற்றும் உட்கார்ந்து வேலை செய்வோருக்கான 5 சிறந்த ஆசனங்கள்",
        titleEn: "5 Essential Yoga Poses for Spine Flexibility & Desk Days",
        thumb: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80",
        summary: "கணினி முன் நீண்ட நேரம் அமர்வதால் ஏற்படும் முதுகு தண்டுவட அழுத்தம், மார்ஜரியாசனம் (பூனை ஆசனம்) மற்றும் புஜங்காசனம் செய்வதன் மூலம் உடனடியாக தணிகிறது.",
        readTime: "6 நிமிடம் வாசிப்பு",
        date: "2 நாட்களுக்கு முன்"
      },
      {
        id: "news-4",
        category: "mental-peace",
        categoryLabel: "மன அமைதி",
        title: "இரவு ஆழ்ந்த தூக்கத்திற்கான யோகா நித்ரா & சப்த சக்கர தியானம்",
        titleEn: "Yoga Nidra for Deep Restorative Sleep & Stress Relief",
        thumb: "https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=700&q=80",
        summary: "படுக்கைக்கு செல்லும் முன் 15 நிமிடங்கள் செய்யும் சக்கர தியானம் நரம்பு மண்டலத்தை அமைதிப்படுத்தி, தூக்கமின்மை மற்றும் கவலைகளை உடனடியாக விரட்டுகிறது.",
        readTime: "3 நிமிடம் வாசிப்பு",
        date: "3 நாட்களுக்கு முன்"
      }
    ];

    // Attendance History Logs (Auto recorded when 70% threshold is reached)
    let attendanceRecords = [
      {
        date: "07 அக் 2026",
        classTitle: "Morning Prana Flow & Breathwork",
        instructor: "நித்யா (Nithya)",
        duration: "42 min / 45 min",
        pct: 93,
        status: "verified"
      },
      {
        date: "06 அக் 2026",
        classTitle: "Spine Health & Hatha Asanas",
        instructor: "நித்யா (Nithya)",
        duration: "35 min / 40 min",
        pct: 87,
        status: "verified"
      },
      {
        date: "05 அக் 2026",
        classTitle: "Evening Yin Release & Chakras",
        instructor: "நித்யா (Nithya)",
        duration: "32 min / 45 min",
        pct: 71,
        status: "verified"
      },
      {
        date: "03 அக் 2026",
        classTitle: "Desk Stress Relief Yoga",
        instructor: "நித்யா (Nithya)",
        duration: "18 min / 30 min",
        pct: 60,
        status: "incomplete"
      }
    ];

    /* --------------------------------------------------------------------------
       Web Audio API: High Volume Synthesizer (Zero External Dependencies)
       -------------------------------------------------------------------------- */
    function getAudioContext() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    // Loud Temple Singing Bowl Chime
    function playLoudChime() {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(masterVolume * 0.9, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
        gainNode.connect(ctx.destination);

        // Multi-harmonic frequencies for authentic rich singing bowl
        [528, 1056, 1584, 2112].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq + (idx * 2), now);
          osc.connect(gainNode);
          osc.start(now);
          osc.stop(now + 3.2);
        });
        showToast("🔔 சத்தமான மணி ஒலித்தது (Loud Chime Played)", "success");
      } catch (e) {
        console.error("Audio error:", e);
      }
    }

    // Sacred Temple Gong / Tibetan Bell
    function testTempleGong() {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(masterVolume * 1.0, now);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        masterGain.connect(ctx.destination);

        [216, 432, 864, 1296].forEach(freq => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 4.5);
        });
        showToast("🪘 கோயில் மணி ஒலி எழுப்பப்பட்டது (Temple Gong)", "success");
      } catch (e) {
        console.error("Audio error:", e);
      }
    }

    // High Alert Beep
    function playAlertBeep() {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(masterVolume * 0.9, now);
        gain.connect(ctx.destination);

        // Double beep pattern
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(880, now + 0.15);
        osc.frequency.setValueAtTime(1174.66, now + 0.25);
        osc.connect(gain);
        osc.start(now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.stop(now + 0.6);
      } catch (e) {
        console.error("Audio error:", e);
      }
    }

    function testLoudSound() {
      playLoudChime();
    }

    function playChakraFrequency() {
      const chakra = CHAKRAS_DATA[activeChakraKey];
      if (!chakra) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(masterVolume * 0.7, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        gainNode.connect(ctx.destination);

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chakra.freq, now);
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 3.0);

        showToast(\`🎵 \${chakra.nameTa} - \${chakra.freq} Hz புனித அதிர்வு ஒலித்தது\`, "success");
      } catch (e) {
        console.error("Audio error:", e);
      }
    }

    /* --------------------------------------------------------------------------
       Interactive 3D Chakra Selection & Visualization
       -------------------------------------------------------------------------- */
    function selectChakra(chakraKey) {
      activeChakraKey = chakraKey;
      const data = CHAKRAS_DATA[chakraKey];
      if (!data) return;

      // Update active styling on SVG nodes
      document.querySelectorAll('.chakra-node').forEach(node => {
        if (node.getAttribute('data-id') === chakraKey) {
          node.classList.add('active-chakra');
        } else {
          node.classList.remove('active-chakra');
        }
      });

      // Update Quick Info Card
      document.getElementById('chakraPillIcon').style.background = data.color;
      document.getElementById('chakraPillIcon').textContent = data.symbol;
      document.getElementById('chakraDetailName').textContent = data.nameTa;
      document.getElementById('chakraDetailSub').textContent = \`மந்திரம்: \${data.mantra} | அதிர்வு: \${data.freq} Hz | மையம்: \${data.location}\`;

      // Play harmonious frequency
      playChakraFrequency();
    }

    function renderChakraCards() {
      const container = document.getElementById('chakraCardsGrid');
      if (!container) return;
      container.innerHTML = Object.entries(CHAKRAS_DATA).map(([key, item]) => \`
        <div class="dash-box" style="border-left: 5px solid \${item.color};">
          <div class="dash-box-top">
            <div class="dash-box-title">
              <div class="icon-badge" style="background:\${item.color};">\${item.symbol}</div>
              <div>
                <h4>\${item.nameTa}</h4>
                <p style="font-size:0.8rem; color:var(--text-sub);">\${item.nameEn}</p>
              </div>
            </div>
            <button type="button" class="btn-icon-pill" onclick="selectChakra('\${key}'); playChakraFrequency();" style="padding:6px 12px; font-size:0.75rem;">
              🔊 \${item.freq} Hz
            </button>
          </div>
          <div style="font-size:0.88rem; display:flex; flex-direction:column; gap:6px; color:var(--text-sub);">
            <div><b>பீஜ மந்திரம்:</b> <span style="color:\${item.color}; font-weight:700;">\${item.mantra}</span></div>
            <div><b>இடம்:</b> \${item.location}</div>
            <div><b>பயன்கள்:</b> \${item.benefitsTa}</div>
            <div><b>பரிந்துரைக்கப்படும் ஆசனங்கள்:</b> <span style="color:#ffffff;">\${item.asanasTa}</span></div>
          </div>
        </div>
      \`).join('');
    }

    /* --------------------------------------------------------------------------
       Live Class Studio & 70% Automatic Attendance Engine
       -------------------------------------------------------------------------- */
    async function startOrJoinLive() {
      isLiveActive = true;
      document.getElementById('liveStatusText').textContent = "லைவ் வகுப்பு செயலில் (Live Running)";
      startLiveTimer();
      try {
        if (!localStream) {
          await toggleCameraStream();
        }
      } catch (err) {
        console.log("Camera optional/denied:", err);
      }
      showToast("📹 லைவ் வகுப்பில் இணைக்கப்பட்டீர்கள்! 70% டைமர் துவங்குகிறது.", "success");
    }

    async function toggleCameraStream() {
      const videoElem = document.getElementById('localVideoFeed');
      const placeholder = document.getElementById('videoPlaceholder');
      const btnCam = document.getElementById('btnToggleCam');

      if (localStream && localStream.getVideoTracks().length > 0 && localStream.getVideoTracks()[0].enabled) {
        localStream.getVideoTracks()[0].enabled = false;
        btnCam.classList.add('off');
        placeholder.style.display = 'flex';
        showToast("கேமரா அணைக்கப்பட்டது (Camera Off)", "alert");
      } else {
        try {
          if (!localStream) {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoElem.srcObject = localStream;
          } else {
            localStream.getVideoTracks()[0].enabled = true;
          }
          placeholder.style.display = 'none';
          btnCam.classList.remove('off');
          showToast("கேமரா இயக்கப்பட்டது (Camera On)", "success");
        } catch (err) {
          console.warn("Camera access fallback:", err);
          placeholder.style.display = 'flex';
          showToast("கேமரா அனுமதி கிடைக்கவில்லை. நேரலை ஆடியோ மட்டும் இயக்கப்படுகிறது.", "alert");
        }
      }
    }

    function toggleMicrophone() {
      const btnMic = document.getElementById('btnToggleMic');
      if (localStream && localStream.getAudioTracks().length > 0) {
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        btnMic.classList.toggle('off', !audioTrack.enabled);
        showToast(audioTrack.enabled ? "மைக் ஆன் செய்யப்பட்டது" : "மைக் ம்யூட் செய்யப்பட்டது", "success");
      } else {
        showToast("மைக் சாதனம் கிடைக்கவில்லை", "alert");
      }
    }

    async function toggleScreenShare() {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoElem = document.getElementById('localVideoFeed');
        videoElem.srcObject = screenStream;
        document.getElementById('videoPlaceholder').style.display = 'none';
        showToast("திரை பகிரப்படுகிறது (Screen Sharing Active)", "success");
      } catch (e) {
        showToast("திரை பகிர்வு ரத்து செய்யப்பட்டது", "alert");
      }
    }

    function startLiveTimer() {
      if (liveTimerInterval) clearInterval(liveTimerInterval);
      liveTimerInterval = setInterval(() => {
        liveSecondsElapsed++;
        updateLiveProgress();
      }, 1000);
    }

    function updateLiveProgress() {
      const timerDisplay = document.getElementById('liveTimerDisplay');
      const gaugeFill = document.getElementById('attendanceGaugeFill');
      const timeAttendedText = document.getElementById('timeAttendedText');
      const attendancePctText = document.getElementById('attendancePctText');

      // Format time
      const curM = Math.floor(liveSecondsElapsed / 60);
      const curS = liveSecondsElapsed % 60;
      const totM = Math.floor(CLASS_TOTAL_SECONDS / 60);
      const totS = CLASS_TOTAL_SECONDS % 60;
      timerDisplay.textContent = \`\${String(curM).padStart(2,'0')}:\${String(curS).padStart(2,'0')} / \${String(totM).padStart(2,'0')}:\${String(totS).padStart(2,'0')}\`;

      const pct = Math.min(100, Math.round((liveSecondsElapsed / CLASS_TOTAL_SECONDS) * 100));
      gaugeFill.style.width = pct + '%';
      timeAttendedText.textContent = \`\${curM} நிமிடம் \${curS} விநாடி\`;
      attendancePctText.textContent = \`\${pct}%\`;

      // 70% Threshold Detection!
      if (pct >= 70 && !attendanceVerified) {
        attendanceVerified = true;
        gaugeFill.classList.add('verified');
        document.getElementById('attendanceGoalBadge').innerHTML = "🎉 <b>70% நிறைவு! அட்டெண்டன்ஸ் சரிபார்க்கப்பட்டது!</b>";
        document.getElementById('attendanceGoalBadge').style.color = "#2ecc71";
        document.getElementById('studentLiveBadge').textContent = "✓ 70% அட்டெண்டன்ஸ் பெற்றது!";
        document.getElementById('studentLiveBadge').style.color = "#2ecc71";

        // Play victory celebration chime
        playLoudChime();

        // Auto-log to attendance list
        recordAttendanceAutomatic(pct);
        showToast("🎉 வாழ்த்துகள்! 70% நேரம் நிறைவுபெற்றதால் உங்கள் அட்டெண்டன்ஸ் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!", "success");
      }
    }

    function simulateAttendanceFast() {
      // Fast forward to 72% for instant testing as requested by user
      liveSecondsElapsed = Math.floor(CLASS_TOTAL_SECONDS * 0.72);
      updateLiveProgress();
      showToast("⚡ 70%+ வருகை வேகம் உருவகப்படுத்தப்பட்டது (Fast Test)", "success");
    }

    function recordAttendanceAutomatic(pct) {
      const todayStr = "07 அக் 2026";
      const newRecord = {
        date: todayStr,
        classTitle: "Morning Prana Flow & Breathwork",
        instructor: "நித்யா (Nithya)",
        duration: \`\${Math.floor(liveSecondsElapsed/60)} min / \${Math.floor(CLASS_TOTAL_SECONDS/60)} min\`,
        pct: pct,
        status: "verified"
      };
      attendanceRecords.unshift(newRecord);
      renderAttendanceTable();
    }

    function leaveLiveClass() {
      if (liveTimerInterval) clearInterval(liveTimerInterval);
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
        localStream = null;
      }
      isLiveActive = false;
      document.getElementById('videoPlaceholder').style.display = 'flex';
      showToast("வகுப்பிலிருந்து வெளியேறினீர்கள்", "alert");
    }

    function copyLiveRoomLink() {
      const input = document.getElementById('liveRoomLinkInput');
      input.select();
      navigator.clipboard.writeText(input.value);
      showToast("📋 இணைப்பு நகலெடுக்கப்பட்டது (Link Copied)", "success");
    }

    function shareLiveInviteLink() {
      const link = document.getElementById('liveRoomLinkInput').value;
      const text = encodeURIComponent(\`🧘‍♀️ நித்யா யோகா லைவ் கிளாஸ் அழைப்பு!\\n\\nஇன்றைய நேரலை வகுப்பில் இணையுங்கள்: \${link}\\n\\n★ 70% நேரம் பங்குபெற்றால் தானியங்கி வருகைப் பதிவு உண்டு! வாருங்கள், இணைந்து பயிற்சி செய்வோம்! ❤️\`);
      window.open(\`https://wa.me/?text=\${text}\`, '_blank');
    }

    function launchGoogleMeet() {
      window.open("https://meet.google.com/new", "_blank");
      showToast("Google Meet புதிய அழைப்பு அறை திறக்கப்படுகிறது...", "success");
    }

    /* --------------------------------------------------------------------------
       Smart Reminders Engine & WhatsApp Alert Sharing
       -------------------------------------------------------------------------- */
    function renderReminders() {
      const container = document.getElementById('remindersGridContainer');
      if (!container) return;
      container.innerHTML = remindersData.map(rem => \`
        <div class="reminder-card \${rem.done ? 'completed' : ''}" style="--reminder-color:\${rem.color};">
          <div class="reminder-card-top">
            <span class="reminder-kind-badge">\${getCategoryLabel(rem.category)}</span>
            <span style="font-size:0.88rem; font-weight:700; color:\${rem.color};">⏰ \${rem.time}</span>
          </div>
          <div>
            <h4 class="rem-title-text" style="font-size:1.05rem; margin-bottom:4px;">\${rem.title}</h4>
            <p style="font-size:0.85rem; color:var(--text-sub);">\${rem.msg}</p>
          </div>
          <div class="reminder-card-actions">
            <button type="button" class="btn-icon-pill" onclick="toggleReminderDone('\${rem.id}')" style="padding:6px 14px; font-size:0.8rem; background:\${rem.done ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.08)'}; color:\${rem.done ? '#2ecc71' : 'var(--text-main)'};">
              \${rem.done ? '✓ முடிந்தது (Done)' : 'முடிந்தது என குறிக்க'}
            </button>
            <button type="button" class="btn-icon-pill" onclick="triggerReminderSound('\${rem.sound}')" title="Play Sound">
              🔔 ஒலி
            </button>
            <a href="#" class="btn-wa-share" onclick="shareReminderWhatsApp('\${rem.id}'); return false;" title="Send to WhatsApp">
              WhatsApp
            </a>
          </div>
        </div>
      \`).join('');
    }

    function getCategoryLabel(cat) {
      switch(cat) {
        case 'water': return '💧 தண்ணீர்';
        case 'meal': return '🥗 உணவு';
        case 'yoga': return '🧘 யோகா';
        case 'health': return '💊 ஆரோக்கியம்';
        case 'family': return '📞 குடும்பம்';
        default: return '✨ நினைவூட்டல்';
      }
    }

    function toggleReminderDone(id) {
      const rem = remindersData.find(r => r.id === id);
      if (rem) {
        rem.done = !rem.done;
        renderReminders();
        if (rem.done) {
          playLoudChime();
          showToast(\`✓ "\${rem.title}" முடிந்தது என குறிக்கப்பட்டது!\`, "success");
        }
      }
    }

    function triggerReminderSound(soundType) {
      if (soundType === 'om-drone') {
        playChakraFrequency();
      } else if (soundType === 'alert-beep') {
        playAlertBeep();
      } else if (soundType === 'bright-bell') {
        testTempleGong();
      } else {
        playLoudChime();
      }
    }

    function shareReminderWhatsApp(id) {
      const rem = remindersData.find(r => r.id === id);
      if (!rem) return;
      const text = encodeURIComponent(\`🧘‍♀️ நித்யா யோகா நினைவூட்டல்: \${rem.title}\\n\\n\${rem.msg}\\n\\nநேரம்: \${rem.time} ❤️ ஞாபகமா கவனிச்சுக்கோங்க!\`);
      window.open(\`https://wa.me/?text=\${text}\`, '_blank');
    }

    function shareWaterOnWhatsApp() {
      const text = encodeURIComponent("💧 நித்யா யோகா ஆரோக்கிய நினைவூட்டல்: கொஞ்சம் தண்ணீர் குடிச்சுக்கோங்க! உடலில் நீர்ச்சத்து மிகவும் முக்கியம். Stay Hydrated! 🥛❤️");
      window.open(\`https://wa.me/?text=\${text}\`, '_blank');
    }

    function shareMealReminderWhatsApp() {
      const text = encodeURIComponent("🥗 நித்யா யோகா நினைவூட்டல்: வேலைக்கு மத்தியில் சாப்பிட மறக்காதீங்க! நேரத்துக்கு சத்தான உணவு சாப்பிடுங்க ❤️");
      window.open(\`https://wa.me/?text=\${text}\`, '_blank');
    }

    function shareClassInviteWhatsApp() {
      const text = encodeURIComponent("🧘‍♀️ நித்யா யோகா மாலை வகுப்பு: மாலை 6:00 மணிக்கு விந்யாசா & தியான வகுப்பு துவங்குகிறது! 70% வருகைப் பதிவுடன் நேரலையில் இணையுங்கள்!");
      window.open(\`https://wa.me/?text=\${text}\`, '_blank');
    }

    function openNewReminderModal() {
      document.getElementById('newReminderModal').classList.add('open');
    }

    function closeNewReminderModal() {
      document.getElementById('newReminderModal').classList.remove('open');
    }

    function saveNewReminder() {
      const title = document.getElementById('remInputTitle').value.trim();
      const cat = document.getElementById('remInputCategory').value;
      const timeVal = document.getElementById('remInputTime').value;
      const msg = document.getElementById('remInputMsg').value.trim();
      const sound = document.getElementById('remInputSound').value;

      if (!title) {
        showToast("தயவுசெய்து தலைப்பை உள்ளிடவும்", "alert");
        return;
      }

      const colors = {
        water: "#00cec9",
        meal: "#f1c40f",
        yoga: "#9b59b6",
        health: "#e67e22",
        family: "#e74c3c",
        custom: "#a29bfe"
      };

      const newRem = {
        id: "rem-" + Date.now(),
        title: title,
        titleEn: title,
        category: cat,
        time: timeVal || "18:00",
        msg: msg || "நேரத்துக்கு நினைவூட்டல்! உடலையும் மனதையும் ஆரோக்கியமாக வையுங்கள் ❤️",
        sound: sound,
        done: false,
        color: colors[cat] || "#9b59b6"
      };

      remindersData.unshift(newRem);
      renderReminders();
      closeNewReminderModal();
      playLoudChime();
      showToast("புதிய ரிமைண்டர் வெற்றிகரமாகச் சேமிக்கப்பட்டது!", "success");
    }

    function updateMasterVolume(val) {
      masterVolume = val / 100;
      document.getElementById('volumeValueLabel').textContent = val + '%';
    }

    /* --------------------------------------------------------------------------
       Water Tracking Module
       -------------------------------------------------------------------------- */
    let waterGlassesCount = 3;

    function toggleGlass(idx) {
      waterGlassesCount = idx + 1;
      updateWaterUI();
    }

    function logWaterGlass() {
      if (waterGlassesCount < 8) {
        waterGlassesCount++;
        updateWaterUI();
        playLoudChime();
        showToast("💧 1 டம்ளர் தண்ணீர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!", "success");
      } else {
        showToast("🎉 அருமை! இன்றைய 8 டம்ளர்கள் இலக்கு முழுமை பெற்றது!", "success");
      }
    }

    function updateWaterUI() {
      document.getElementById('waterCountBadge').textContent = \`\${waterGlassesCount} / 8\`;
      const buttons = document.querySelectorAll('.water-glass-btn');
      buttons.forEach((btn, idx) => {
        if (idx < waterGlassesCount) {
          btn.classList.add('filled');
        } else {
          btn.classList.remove('filled');
        }
      });
    }

    /* --------------------------------------------------------------------------
       Yoga News Feed & Filters
       -------------------------------------------------------------------------- */
    function renderNews(filterCat = 'all') {
      const container = document.getElementById('newsArticlesGrid');
      if (!container) return;
      const filtered = filterCat === 'all' ? YOGA_NEWS_DATA : YOGA_NEWS_DATA.filter(n => n.category === filterCat);
      container.innerHTML = filtered.map(item => \`
        <div class="article-card">
          <div class="article-thumb-wrapper">
            <img class="article-thumb-img" src="\${item.thumb}" alt="\${item.title}">
            <span class="article-tag-badge">\${item.categoryLabel}</span>
          </div>
          <div class="article-body">
            <h3>\${item.title}</h3>
            <p>\${item.summary}</p>
            <div class="article-footer-row">
              <span>⏱️ \${item.readTime}</span>
              <span>📅 \${item.date}</span>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function filterNews(cat, btn) {
      document.querySelectorAll('.chip-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderNews(cat);
    }

    /* --------------------------------------------------------------------------
       Attendance Logs Registry
       -------------------------------------------------------------------------- */
    function renderAttendanceTable() {
      const tbody = document.getElementById('attendanceTableBody');
      if (!tbody) return;
      tbody.innerHTML = attendanceRecords.map(r => \`
        <tr>
          <td><b>\${r.date}</b></td>
          <td>\${r.classTitle}</td>
          <td>\${r.instructor}</td>
          <td>\${r.duration}</td>
          <td><b>\${r.pct}%</b></td>
          <td>
            <span class="badge-status \${r.status}">
              \${r.status === 'verified' ? '✓ 70%+ சரிபார்க்கப்பட்டது' : 'இழுக்கப்படாதது'}
            </span>
          </td>
          <td>
            <button type="button" class="btn-icon-pill" onclick="showCertificate('\${r.classTitle}')" style="padding:4px 10px; font-size:0.75rem;">
              📜 பேட்ஜ்
            </button>
          </td>
        </tr>
      \`).join('');

      const verifiedCount = attendanceRecords.filter(r => r.status === 'verified').length;
      document.getElementById('statTotalClasses').textContent = attendanceRecords.length;
      document.getElementById('statVerifiedClasses').textContent = verifiedCount;
    }

    function showCertificate(title) {
      showToast(\`🏆 சான்றிதழ்: "\${title}" வகுப்பில் 70% நேரத்திற்கு மேல் பங்குபெற்றமைக்கான நற்சான்று!\`, "success");
    }

    /* --------------------------------------------------------------------------
       Pranayama & Ambient Sounds Engine
       -------------------------------------------------------------------------- */
    let breathInterval = null;
    let breathIsRunning = true;

    function startPranayamaGuide() {
      const orb = document.getElementById('pranayamaOrb');
      const text = document.getElementById('pranayamaPhaseText');
      let step = 0; // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold

      const steps = [
        { text: "மூச்சை உள்ளிழுக்கவும் (Inhale - 4s)", class: "inhale" },
        { text: "மூச்சை அடக்கவும் (Hold - 4s)", class: "inhale" },
        { text: "மூச்சை மெதுவாக வெளியிடவும் (Exhale - 4s)", class: "exhale" },
        { text: "அமைதியாக இருங்கள் (Pause - 4s)", class: "exhale" }
      ];

      if (breathInterval) clearInterval(breathInterval);
      breathInterval = setInterval(() => {
        if (!breathIsRunning) return;
        step = (step + 1) % steps.length;
        text.textContent = steps[step].text;
        orb.className = 'pranayama-orb ' + steps[step].class;
      }, 4000);
    }

    function toggleBreathPractice() {
      breathIsRunning = !breathIsRunning;
      const btn = document.getElementById('btnToggleBreath');
      btn.textContent = breathIsRunning ? "⏸️ சுவாசப் பயிற்சியை நிறுத்து" : "▶️ சுவாசப் பயிற்சியைத் தொடங்கு";
      showToast(breathIsRunning ? "சுவாசப் பயிற்சி தொடங்கியது" : "சுவாசப் பயிற்சி நிறுத்தப்பட்டது", "success");
    }

    // Ambient Audio Synthesizers (Web Audio Oscillators & Noise)
    let activeAmbientOscs = {};

    function toggleAmbientSound(type, btn) {
      const ctx = getAudioContext();
      if (activeAmbientOscs[type]) {
        // Stop
        activeAmbientOscs[type].gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        setTimeout(() => {
          activeAmbientOscs[type].source.stop();
          delete activeAmbientOscs[type];
        }, 900);
        btn.classList.remove('playing');
        showToast("ஒலி நிறுத்தப்பட்டது", "alert");
      } else {
        // Start
        const now = ctx.currentTime;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.3 * masterVolume, now + 1.2);
        gain.connect(ctx.destination);

        let osc;
        if (type === 'om') {
          osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(136.1, now); // 136.1 Hz Om cosmic frequency
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(280, now);
          osc.connect(filter);
          filter.connect(gain);
        } else {
          osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(type === 'bowl' ? 432 : 300, now);
          osc.connect(gain);
        }
        osc.start(now);
        activeAmbientOscs[type] = { source: osc, gain: gain };
        btn.classList.add('playing');
        showToast("தியான ஒலி இசைக்கப்படுகிறது...", "success");
      }
    }

    /* --------------------------------------------------------------------------
       Tab Navigation & App State
       -------------------------------------------------------------------------- */
    function switchTab(tabId) {
      document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
      document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.mobile-tab-item').forEach(btn => btn.classList.remove('active'));

      const targetSection = document.getElementById('tab-' + tabId);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      document.querySelectorAll(\`[data-tab="\${tabId}"]\`).forEach(b => b.classList.add('active'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleLanguage() {
      currentLang = currentLang === 'ta' ? 'en' : 'ta';
      document.documentElement.setAttribute('data-lang', currentLang);
      const btn = document.getElementById('langToggleBtn');
      btn.innerHTML = currentLang === 'ta' ? '🌐 <span>தமிழ்</span>' : '🌐 <span>English</span>';
      
      document.querySelectorAll('.tab-label').forEach(el => {
        el.textContent = currentLang === 'ta' ? el.getAttribute('data-ta') : el.getAttribute('data-en');
      });
      showToast(currentLang === 'ta' ? "மொழி தமிழாக மாற்றப்பட்டது" : "Language switched to English", "success");
    }

    function toggleTheme() {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.getElementById('themeToggleBtn').textContent = currentTheme === 'dark' ? '🌙' : '☀️';
      showToast(currentTheme === 'dark' ? "Zen Dark Mode இயக்கப்பட்டது" : "Light Mode இயக்கப்பட்டது", "success");
    }

    function showToast(msg, type = "success") {
      const tray = document.getElementById('toastTray');
      const toast = document.createElement('div');
      toast.className = \`toast-msg \${type}\`;
      toast.innerHTML = \`<span>\${type === 'success' ? '✓' : '⚠️'}</span> <div>\${msg}</div>\`;
      tray.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    /* --------------------------------------------------------------------------
       Init
       -------------------------------------------------------------------------- */
    window.addEventListener('DOMContentLoaded', () => {
      renderChakraCards();
      renderReminders();
      renderNews();
      renderAttendanceTable();
      startPranayamaGuide();
    });
  </script>
</body>
</html>
`;

// Target destination files:
// 1. In workspace: index.html
// 2. In workspace: saved_resource.html
// 3. Parent downloads: nithya web page.html

const workspacePath = path.resolve(__dirname);
const indexPath = path.join(workspacePath, 'index.html');
const savedResourcePath = path.join(workspacePath, 'saved_resource.html');
const parentDownloadsHtml = path.resolve(workspacePath, '..', 'nithya web page.html');

console.log("Writing to:", indexPath);
fs.writeFileSync(indexPath, htmlContent, 'utf8');

console.log("Writing to:", savedResourcePath);
fs.writeFileSync(savedResourcePath, htmlContent, 'utf8');

console.log("Writing to:", parentDownloadsHtml);
fs.writeFileSync(parentDownloadsHtml, htmlContent, 'utf8');

console.log("Successfully generated all files!");
