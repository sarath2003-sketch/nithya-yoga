import React from 'react';
import { Play, Calendar, Sparkles, Flame, Star, Flower2 } from 'lucide-react';

export default function HeroSection({
  user,
  onJoinLive,
  onViewSchedule,
  lang = 'en'
}) {
  return (
    <div className="hero-section-grid">
      {/* Panoramic Sunset Yoga Hero Card */}
      <div className="hero-banner-card">
        <div className="hero-banner-bg">
          <img 
            src="assets/images/chakra-meditation.jpg" 
            alt="Yoga &amp; Wellness Chakra Meditation" 
            className="hero-img-cover" 
          />
          <div className="hero-gradient-overlay"></div>
        </div>

        {/* Hero Copy & CTAs */}
        <div className="hero-content-body">
          <h2 className="hero-headline-title">
            <span>Move • Breathe •</span>
            <br />
            <span>Remember • Relax</span>
          </h2>

          <p className="hero-supporting-sub">
            {lang === 'ta'
              ? 'ஒவ்வொரு நாளும் எடுத்து வைக்கும் சிறிய அடிகள், உங்களை ஆரோக்கியமாகவும் மகிழ்ச்சியாகவும் மாற்றும்.'
              : 'Small steps every day lead to a healthier and happier you.'}
          </p>

          <div className="hero-cta-buttons-row">
            <button 
              type="button" 
              className="btn-hero-primary ya-btn ya-ripple"
              onClick={onJoinLive}
            >
              <span className="btn-play-circle" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={11} fill="currentColor" />
              </span>
              <span>
                {user?.role === 'trainer' || user?.isInstructor
                  ? (lang === 'ta' ? '👑 நேரலை வகுப்பைத் தொடங்கு' : '👑 Start Live Class')
                  : (lang === 'ta' ? 'லைவ் வகுப்பில் இணைக' : 'Join Live Class')}
              </span>
            </button>

            <button 
              type="button" 
              className="btn-hero-secondary ya-btn ya-ripple"
              onClick={onViewSchedule}
            >
              <Calendar size={16} />
              <span>{lang === 'ta' ? "இன்றைய அட்டவணை" : "View Today's Schedule"}</span>
            </button>
          </div>
        </div>

        {/* Sacred 7 Chakras Meditating Yogi Artwork */}
        <div className="hero-right-visual-wrapper">
          <img 
            src="assets/images/chakra-meditation.jpg" 
            alt="NITHYA 7 Chakras Meditation Visual" 
            className="hero-chakra-visual-img" 
          />
        </div>
      </div>

      {/* Top Right: User Profile Bento Card */}
      <div className="hero-user-stat-card">
        <div className="user-profile-header-mini">
          <div className="user-round-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="hero-avatar-img" />
            ) : (
              <span>{user?.name ? user.name.charAt(0) : 'N'}</span>
            )}
          </div>
          <div className="user-heading-meta">
            <h3 className="user-greeting-name">
              {lang === 'ta' ? `வணக்கம், ${user.name}` : `Hello, ${user.name}`}
            </h3>
            <p className="user-subtitle-care">
              {user?.role === 'trainer' || user?.isInstructor
                ? (lang === 'ta' ? '👑 நித்யா மாஸ்டர் • தலைமைப் பயிற்றுநர்' : '👑 Master Instructor • Lead Guide')
                : (lang === 'ta' ? 'தொடர்ந்து இருங்கள். ஆரோக்கியமாக இருங்கள்.' : 'Stay consistent. Stay healthy.')}
            </p>
          </div>
        </div>

        {/* 2x2 Stat Tiles Grid */}
        <div className="user-stats-2x2-grid">
          {/* Tile 1: Classes Attended */}
          <div className="stat-tile-box tile-teal">
            <div className="stat-tile-icon-wrap teal-bg">
              <Flower2 size={18} className="text-teal" />
            </div>
            <div className="stat-tile-text">
              <strong className="stat-number">{user.classesAttended || 12}</strong>
              <span className="stat-label">
                {lang === 'ta' ? 'கலந்துகொண்ட வகுப்புகள்' : 'Classes Attended'}
              </span>
            </div>
          </div>

          {/* Tile 2: Attendance Rate */}
          <div className="stat-tile-box tile-blue">
            <div className="stat-tile-icon-wrap blue-bg">
              <Calendar size={18} className="text-blue" />
            </div>
            <div className="stat-tile-text">
              <strong className="stat-number">{user.attendanceRate || 85}%</strong>
              <span className="stat-label">
                {lang === 'ta' ? 'வருகை விகிதம்' : 'Attendance Rate'}
              </span>
            </div>
          </div>

          {/* Tile 3: Day Streak */}
          <div className="stat-tile-box tile-orange">
            <div className="stat-tile-icon-wrap orange-bg">
              <Flame size={18} className="text-orange" />
            </div>
            <div className="stat-tile-text">
              <strong className="stat-number">{user.dayStreak || 7}</strong>
              <span className="stat-label">
                {lang === 'ta' ? 'தொடர் நாட்கள்' : 'Day Streak'}
              </span>
            </div>
          </div>

          {/* Tile 4: Level */}
          <div className="stat-tile-box tile-gold">
            <div className="stat-tile-icon-wrap gold-bg">
              <Star size={18} className="text-gold" />
            </div>
            <div className="stat-tile-text">
              <strong className="stat-number">{user.level || 'Beginner'}</strong>
              <span className="stat-label">
                {lang === 'ta' ? 'நிலை' : 'Level'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
