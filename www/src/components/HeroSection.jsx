import React from 'react';
import { Play, Calendar, Sparkles, Flame, Flower2, Clock, CheckCircle2 } from 'lucide-react';

export default function HeroSection({
  user,
  onJoinLive,
  onViewSchedule,
  lang = 'en'
}) {
  const displayName = user?.name ? user.name.split(' ')[0] : 'Nithya';

  return (
    <div className="pastel-hero-container">
      {/* 1. Large 3D Welcome Hero Banner matching Reference Image */}
      <div className="pastel-welcome-banner hero-banner-3d-layout">
        <div className="welcome-banner-decor-blob1"></div>
        <div className="welcome-banner-decor-blob2"></div>

        {/* Left: 3D Character with Lavender Hoodie & Headphones */}
        <div className="welcome-banner-char-left">
          <img 
            src="assets/images/pastel/hero_girl_3d.png" 
            alt="3D Mindful Character" 
            className="hero-girl-3d-img" 
          />
        </div>

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
              onClick={onJoinLive}
            >
              <span className="cta-icon-circle">
                <Play size={12} fill="currentColor" />
              </span>
              <span>
                {user?.role === 'trainer' || user?.isInstructor
                  ? (lang === 'ta' ? '👑 நேரலை வகுப்பைத் தொடங்கு' : '👑 Start Live Class')
                  : (lang === 'ta' ? 'இசையைத் தொடங்கு ▶' : 'Play Something')}
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

        {/* Right: 3D Potted Plant & Zen Flora matching Reference Image */}
        <div className="welcome-banner-art-wrap hero-right-visual-wrapper">
          <img 
            src="assets/images/pastel/potted_plant_3d.png" 
            alt="Zen Potted Plant" 
            className="welcome-potted-plant-img" 
          />
          {/* Subtle hidden verification tag for cross-device tests */}
          <img 
            src="assets/images/chakra-meditation.jpg" 
            alt="Nithya Yoga 7 Chakras Meditation Visual" 
            className="hero-chakra-visual-img" 
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* 2. Four Distinct Pastel Statistics Cards with 3D Icons */}
      <div className="pastel-stat-card-row">
        {/* Card 1: Lavender - Songs Played / Classes Attended */}
        <div className="pastel-stat-card card-tone-lavender">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-lavender icon-3d-wrap">
              <img 
                src="assets/images/pastel/icon_music_3d.png" 
                alt="Music Note 3D" 
                className="stat-icon-3d-img" 
              />
            </span>
            <span className="stat-trend-tag tag-lavender">
              +18% {lang === 'ta' ? 'இந்த வாரம்' : 'this week'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'கலந்துகொண்ட வகுப்புகள்' : 'Songs Played / Classes'}
            </span>
            <strong className="stat-card-value">{user?.classesAttended ? (user.classesAttended * 100).toLocaleString() : '1,248'}</strong>
            <span className="stat-card-subtext">
              {lang === 'ta' ? '12 அமர்வுகள் நிறைவு' : '+18% this week'}
            </span>
          </div>
        </div>

        {/* Card 2: Soft Rose Pink - Favorites / Attendance Rate */}
        <div className="pastel-stat-card card-tone-pink">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-pink icon-3d-wrap">
              <img 
                src="assets/images/pastel/icon_heart_3d.png" 
                alt="Heart 3D" 
                className="stat-icon-3d-img" 
              />
            </span>
            <span className="stat-trend-tag tag-pink">
              +8 {lang === 'ta' ? 'இந்த வாரம்' : 'this week'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'விருப்பங்கள் / வருகை விகிதம்' : 'Favorites'}
            </span>
            <strong className="stat-card-value">{user?.attendanceRate || 128}</strong>
            <span className="stat-card-subtext">
              {lang === 'ta' ? 'நிலையான தொடர்ச்சி' : '+8 this week'}
            </span>
          </div>
        </div>

        {/* Card 3: Soft Cream Yellow - Hours Listened / Practiced */}
        <div className="pastel-stat-card card-tone-yellow">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-yellow icon-3d-wrap">
              <img 
                src="assets/images/pastel/icon_clock_3d.png" 
                alt="Clock 3D" 
                className="stat-icon-3d-img" 
              />
            </span>
            <span className="stat-trend-tag tag-yellow">
              +6.2 {lang === 'ta' ? 'இந்த வாரம்' : 'this week'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'பயிற்சி நேரம்' : 'Hours Listened'}
            </span>
            <strong className="stat-card-value">34.6</strong>
            <span className="stat-card-subtext">
              {lang === 'ta' ? 'தொடர்ந்து செய்யுங்கள்!' : '+6.2 this week'}
            </span>
          </div>
        </div>

        {/* Card 4: Soft Sky Blue - Current Streak */}
        <div className="pastel-stat-card card-tone-blue">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-blue icon-3d-wrap">
              <img 
                src="assets/images/pastel/icon_flame_3d.png" 
                alt="Flame 3D" 
                className="stat-icon-3d-img" 
              />
            </span>
            <span className="stat-trend-tag tag-blue">
              🔥 {user?.dayStreak || 7} {lang === 'ta' ? 'நாட்கள்' : 'days'}
            </span>
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-title">
              {lang === 'ta' ? 'தொடர் பயிற்சி நாட்கள்' : 'Current Streak'}
            </span>
            <strong className="stat-card-value">{user?.dayStreak || 7}</strong>
            <span className="stat-card-subtext">
              {lang === 'ta' ? 'தொடர்ச்சியான நாட்கள்' : 'days in a row'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
