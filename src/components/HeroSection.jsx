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
      {/* 1. Large Welcome Hero Banner */}
      <div className="pastel-welcome-banner">
        <div className="welcome-banner-decor-blob1"></div>
        <div className="welcome-banner-decor-blob2"></div>

        <div className="welcome-banner-content">
          <div className="welcome-greeting-badge">
            <Sparkles size={14} className="sparkle-gold" />
            <span>
              {lang === 'ta' ? 'இன்றைய யோகா நல்வாழ்வு' : 'Daily Yoga & Wellness'}
            </span>
          </div>

          <h2 className="welcome-banner-title">
            <span>{lang === 'ta' ? `காலை வணக்கம், ${displayName}! ☀️` : `Good Morning, ${displayName}! ☀️`}</span>
            <span className="welcome-banner-subtitle-line">
              {lang === 'ta' ? 'உடலசைவு • சுவாசம் • நினைவூட்டல் • அமைதி' : 'Move • Breathe • Remember • Relax'}
            </span>
          </h2>

          <p className="welcome-banner-description">
            {lang === 'ta'
              ? 'ஒவ்வொரு நாளும் எடுத்து வைக்கும் சிறிய அடிகள், உங்களை ஆரோக்கியமாகவும் மகிழ்ச்சியாகவும் மாற்றும். இன்று உங்களுக்காக சிறிது நேரம் ஒதுக்குங்கள்.'
              : 'Small steps every day lead to a healthier and happier you. Make time for your mindful practice today.'}
          </p>

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
                  : (lang === 'ta' ? 'பயிற்சியைத் தொடர்க 🧘‍♀️' : 'Continue Practice 🧘‍♀️')}
              </span>
            </button>

            <button 
              type="button" 
              className="btn-pastel-cta-secondary ya-ripple"
              onClick={onViewSchedule}
            >
              <Calendar size={16} />
              <span>{lang === 'ta' ? "இன்றைய அட்டவணை" : "Today's Schedule"}</span>
            </button>
          </div>
        </div>

        {/* Right Artwork: Meditating Yogi & Zen Plant Elements */}
        <div className="welcome-banner-art-wrap hero-right-visual-wrapper">
          <div className="art-aura-ring"></div>
          <img 
            src="assets/images/chakra-meditation.jpg" 
            alt="Nithya Yoga Meditating Yogi" 
            className="welcome-banner-yogi-img hero-chakra-visual-img" 
          />
          <div className="art-plant-accent" title="Zen Flora">🪴</div>
        </div>
      </div>

      {/* 2. Four Distinct Pastel Statistics Cards */}
      <div className="pastel-stat-card-row">
        {/* Card 1: Lavender - Total Practice Sessions */}
        <div className="pastel-stat-card card-tone-lavender">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-lavender">
              <Flower2 size={18} />
            </span>
            <span className="stat-trend-tag tag-lavender">
              {lang === 'ta' ? 'இந்த மாதம்' : 'This Month'}
            </span>
          </div>
          <div className="stat-card-meta">
            <strong className="stat-card-value">{user?.classesAttended || 12}</strong>
            <span className="stat-card-title">
              {lang === 'ta' ? 'கலந்துகொண்ட வகுப்புகள்' : 'Classes Attended'}
            </span>
            <span className="stat-card-subtext">
              {lang === 'ta' ? '12 அமர்வுகள் நிறைவு' : '12 sessions completed'}
            </span>
          </div>
        </div>

        {/* Card 2: Soft Pink - Attendance Rate */}
        <div className="pastel-stat-card card-tone-pink">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-pink">
              <Clock size={18} />
            </span>
            <span className="stat-trend-tag tag-pink">
              +5% {lang === 'ta' ? 'முன்னேற்றம்' : 'vs last mo'}
            </span>
          </div>
          <div className="stat-card-meta">
            <strong className="stat-card-value">{user?.attendanceRate || 85}%</strong>
            <span className="stat-card-title">
              {lang === 'ta' ? 'வருகை விகிதம்' : 'Attendance Rate'}
            </span>
            <span className="stat-card-subtext">
              {lang === 'ta' ? 'நிலையான தொடர்ச்சி' : 'Consistent consistency'}
            </span>
          </div>
        </div>

        {/* Card 3: Soft Cream / Yellow - Practice Streak */}
        <div className="pastel-stat-card card-tone-yellow">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-yellow">
              <Flame size={18} />
            </span>
            <span className="stat-trend-tag tag-yellow">
              🔥 {lang === 'ta' ? 'தொடர்' : 'Streak'}
            </span>
          </div>
          <div className="stat-card-meta">
            <strong className="stat-card-value">{user?.dayStreak || 7} {lang === 'ta' ? 'நாட்கள்' : 'Days'}</strong>
            <span className="stat-card-title">
              {lang === 'ta' ? 'தொடர் நாட்கள்' : 'Day Streak'}
            </span>
            <span className="stat-card-subtext">
              {lang === 'ta' ? 'தொடர்ந்து செய்யுங்கள்!' : 'Keep going strong!'}
            </span>
          </div>
        </div>

        {/* Card 4: Soft Sky Blue - Reminders Completed & Level */}
        <div className="pastel-stat-card card-tone-blue">
          <div className="stat-card-top-row">
            <span className="stat-card-icon-pill icon-blue">
              <CheckCircle2 size={18} />
            </span>
            <span className="stat-trend-tag tag-blue">
              {user?.level || 'Beginner'}
            </span>
          </div>
          <div className="stat-card-meta">
            <strong className="stat-card-value">18</strong>
            <span className="stat-card-title">
              {lang === 'ta' ? 'நினைவூட்டல்கள் முடிந்தது' : 'Reminders Done'}
            </span>
            <span className="stat-card-subtext">
              {lang === 'ta' ? 'ஆரோக்கிய பழக்கங்கள்' : 'Healthy daily habits'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
