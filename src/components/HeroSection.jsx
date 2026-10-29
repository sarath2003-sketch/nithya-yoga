import React from 'react';
import { Play, Calendar, Sparkles } from 'lucide-react';
import { Stat3DMusicNote, Stat3DHeart, Stat3DClock, Stat3DFlame } from './ThreeDIcons';

export default function HeroSection({
  user,
  onJoinLive,
  onViewSchedule,
  onTabChange,
  lang = 'en'
}) {
  const displayName = user?.name ? user.name.split(' ')[0] : 'Nithya';

  return (
    <div className="pastel-hero-container">
      {/* 1. Large 3D Welcome Hero Banner matching Reference Image */}
      <div className="pastel-welcome-banner hero-banner-3d-layout">
        <div className="welcome-banner-decor-blob1"></div>
        <div className="welcome-banner-decor-blob2"></div>

        {/* Center: Floating Musical Notes, Greeting & CTA */}
        <div className="welcome-banner-content">
          <div className="floating-music-notes" aria-hidden="true">
            <span className="note-pink note-1">🎵</span>
            <span className="note-purple note-2">🎶</span>
          </div>

          <h2 className="welcome-banner-title">
            <span className="greeting-main-line">
              {lang === 'ta' ? `காலை வணக்கம், ${displayName}! ☀️` : `Good Morning, ${displayName}! ☀️`}
            </span>
            <span className="welcome-banner-subtitle-line">
              {lang === 'ta' ? 'இன்று சிறிது யோகாவும் இசையும் ரசிப்போம்!' : "Let's enjoy some music & mindful practice today!"}
            </span>
          </h2>

          <div className="welcome-banner-actions">
            <button 
              type="button" 
              className="btn-pastel-cta-primary ya-ripple"
              onClick={() => {
                if (onTabChange) {
                  onTabChange('classes');
                } else {
                  onViewSchedule();
                }
              }}
            >
              <span className="cta-icon-circle">
                <Play size={12} fill="currentColor" />
              </span>
              <span>
                {lang === 'ta' ? 'யோகா பயிற்சி தொடங்கு ▶' : 'Start Yoga Practice ▶'}
              </span>
            </button>

            <button 
              type="button" 
              className="btn-pastel-cta-secondary ya-ripple"
              onClick={onViewSchedule}
            >
              <Calendar size={15} />
              <span>{lang === 'ta' ? "அட்டவணை" : "Schedule"}</span>
            </button>
          </div>
        </div>

        {/* Right: Featured Chakra Moon Vector Artwork + Preserved Test Elements */}
        <div className="welcome-banner-art-wrap hero-right-visual-wrapper">
          <div className="chakra-moon-hero-frame">
            <div className="chakra-hero-halo-ring" aria-hidden="true"></div>
            <img 
              src="assets/premium-yoga/chakra-glowing-hero.jpg" 
              alt="Nithya Yoga Glowing 7 Chakras Meditating Woman" 
              className="chakra-moon-hero-img" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                if (!e.currentTarget.src.includes('chakra-moon-hero.svg')) {
                  e.currentTarget.src = "assets/premium-yoga/chakra-moon-hero.svg";
                }
              }}
            />
          </div>
          {/* Preserved cross-device test element */}
          <img 
            src="assets/images/chakra-meditation.jpg" 
            alt="Nithya Yoga 7 Chakras Meditation Visual" 
            className="hero-chakra-visual-img" 
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* 2. Four Interactive Practice & Feature Shortcut Cards */}
      <div className="pastel-stat-card-row">
        {/* Card 1: Lavender - Mindful Reminders Shortcut */}
        <div 
          className="pastel-stat-card card-tone-lavender ya-ripple cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          onClick={() => (onTabChange ? onTabChange('reminders') : onViewSchedule())}
          title={lang === 'ta' ? 'நினைவூட்டல் பகுதிக்குச் செல்லவும்' : 'Open Mindful Reminders'}
        >
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-lavender icon-3d-wrap">
              <Stat3DMusicNote size={28} />
            </span>
            <span className="stat-trend-tag tag-lavender font-bold">
              🔔 {lang === 'ta' ? 'நினைவூட்டல்' : 'Reminders'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'தினசரி நினைவூட்டல்' : 'Mindful Alarms'}
            </span>
            <strong className="stat-card-value text-base">
              {lang === 'ta' ? 'பயிற்சி நேரம்' : 'Daily Schedule'}
            </strong>
            <span className="stat-card-subtext font-semibold text-primary flex items-center gap-1 mt-1">
              {lang === 'ta' ? 'அமைக்க தட்டவும் ➔' : 'Manage Reminders ➔'}
            </span>
          </div>
        </div>

        {/* Card 2: Soft Rose Pink - Meditation Music Shortcut */}
        <div 
          className="pastel-stat-card card-tone-pink ya-ripple cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          onClick={() => (onTabChange ? onTabChange('classes') : null)}
          title={lang === 'ta' ? 'தியான அமைதி இசையைக் கேட்க' : 'Listen to Meditation Sounds'}
        >
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-pink icon-3d-wrap">
              <Stat3DHeart size={28} />
            </span>
            <span className="stat-trend-tag tag-pink font-bold">
              🌿 {lang === 'ta' ? 'இசை' : 'Audio'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'தியான அமைதி இசை' : 'Meditation Audio'}
            </span>
            <strong className="stat-card-value text-base">
              {lang === 'ta' ? '5 இசைத்தடங்கள்' : '5 Audio Tracks'}
            </strong>
            <span className="stat-card-subtext font-semibold text-pink-500 flex items-center gap-1 mt-1">
              {lang === 'ta' ? 'இசையைக் கேள் ➔' : 'Tap to listen ➔'}
            </span>
          </div>
        </div>

        {/* Card 3: Soft Cream Yellow - Yoga Notes Shortcut */}
        <div 
          className="pastel-stat-card card-tone-yellow ya-ripple cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          onClick={() => (onTabChange ? onTabChange('notes') : null)}
          title={lang === 'ta' ? 'யோகா குறிப்புகளைக் காண' : 'View Yoga Diary & Notes'}
        >
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-yellow icon-3d-wrap">
              <Stat3DClock size={28} />
            </span>
            <span className="stat-trend-tag tag-yellow font-bold">
              📝 {lang === 'ta' ? 'குறிப்புகள்' : 'Journal'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'யோகா நாட்குறிப்பு' : 'Yoga Notes & Diary'}
            </span>
            <strong className="stat-card-value text-base">
              {lang === 'ta' ? 'தனிப்பயன் குறிப்புகள்' : 'Personal Notes'}
            </strong>
            <span className="stat-card-subtext font-semibold text-amber-600 flex items-center gap-1 mt-1">
              {lang === 'ta' ? 'திறக்க தட்டவும் ➔' : 'Tap to view ➔'}
            </span>
          </div>
        </div>

        {/* Card 4: Soft Sky Blue - Reminders & Alarms Shortcut */}
        <div 
          className="pastel-stat-card card-tone-blue ya-ripple cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          onClick={() => (onTabChange ? onTabChange('reminders') : null)}
          title={lang === 'ta' ? 'பயிற்சி நினைவூட்டல் அமைப்புகள்' : 'Practice Reminder Alarms'}
        >
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-blue icon-3d-wrap">
              <Stat3DFlame size={28} />
            </span>
            <span className="stat-trend-tag tag-blue font-bold">
              ⏰ {lang === 'ta' ? 'அலாரம்' : 'Alarms'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'பயிற்சி நினைவூட்டல்' : 'Daily Reminders'}
            </span>
            <strong className="stat-card-value text-base">
              {lang === 'ta' ? 'அமைப்புகள் தயார்' : 'Schedule Alarms'}
            </strong>
            <span className="stat-card-subtext font-semibold text-blue-500 flex items-center gap-1 mt-1">
              {lang === 'ta' ? 'அமைக்க தட்டவும் ➔' : 'Tap to set ➔'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
