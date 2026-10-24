import React from 'react';
import { Search, Bell, Sparkles, Moon, Sun, Globe, RefreshCw, CheckCircle2 } from 'lucide-react';
import { APP_VERSION } from '../utils/versionManager';

export default function Header({
  searchQuery,
  setSearchQuery,
  theme,
  setTheme,
  lang,
  setLang,
  user,
  onOpenNotifications,
  onTestSound,
  onOpenProfile,
  onQuickUpdate,
  updateAvailable = false
}) {
  return (
    <header className="dashboard-top-header">
      {/* Left: Page Title / Mobile Brand */}
      <div className="header-left-cluster">
        <div className="header-mobile-brand-wrap" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="assets/images/logo.png?v=20261024" alt="Nithya Yoga" className="header-mobile-logo-img" />
          <span className="header-mobile-title">NITHYA</span>
        </div>
        <div className="header-page-title-block hidden md:flex">
          <h1 className="header-page-title">
            {lang === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Center: Search Input Bar */}
      <div className="header-search-wrapper">
        <Search size={16} className="search-icon-left" />
        <input
          type="text"
          className="header-search-input"
          placeholder={lang === 'ta' ? 'தேடுங்கள் (யோகா, குறிப்புகள், நினைவூட்டல்)...' : 'Search anything...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" className="search-submit-btn" aria-label="Search">
          <Search size={14} />
        </button>
      </div>

      {/* Right: Header Tools & User Profile */}
      <div className="header-tools-cluster">
        {/* Quick App Update Pill */}
        <button
          type="button"
          className={`header-tool-btn header-update-pill cursor-pointer ${updateAvailable ? 'has-update-glow' : ''}`}
          onClick={onQuickUpdate}
          title={lang === 'ta' ? `நித்யா யோகா v${APP_VERSION} (புதுப்பிப்பைச் சரிபார்க்கவும்)` : `Nithya Yoga v${APP_VERSION} (Check updates)`}
        >
          {updateAvailable ? (
            <RefreshCw size={14} className="header-update-icon text-primary animate-spin" />
          ) : (
            <CheckCircle2 size={14} className="header-update-icon text-emerald-500" />
          )}
          <span className="update-text-short hidden sm:inline font-bold text-xs">
            {updateAvailable ? (lang === 'ta' ? 'அப்டேட்' : 'Update') : `v${APP_VERSION}`}
          </span>
        </button>

        {/* Language Switcher */}
        <button
          type="button"
          className="header-tool-btn lang-pill-btn"
          onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
          title="Toggle Language"
        >
          <Globe size={15} />
          <span className="lang-text-short">{lang === 'ta' ? 'தமிழ்' : 'EN'}</span>
        </button>

        {/* Theme Sparkle / Mode */}
        <button
          type="button"
          className="header-tool-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        >
          <Sparkles size={17} className="sparkle-icon" />
        </button>

        {/* Notification Bell with Pink Indicator Dot */}
        <button
          type="button"
          className="header-tool-btn notif-bell-btn"
          onClick={onTestSound}
          title="Notifications"
        >
          <Bell size={17} />
          <span className="pink-notification-dot"></span>
        </button>

        {/* User Pill with 3D Pop-out Avatar */}
        <div 
          className="header-user-badge cursor-pointer"
          onClick={() => {
            if (onOpenProfile) {
              onOpenProfile();
            } else {
              const el = document.querySelector('.profile-dashboard-card');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          title={lang === 'ta' ? 'சுயவிவரம் பார்க்க' : 'View / Edit Profile'}
          role="button"
          tabIndex={0}
        >
          <div className="header-avatar-3d-wrap">
            <img 
              src={user?.avatar || 'assets/images/pastel/nithya_3d_avatar.png'} 
              alt={user?.name || 'Nithya'} 
              className="header-avatar-3d-img"
            />
          </div>
          <div className="user-greeting-meta hidden sm:flex">
            <span className="welcome-tag">{lang === 'ta' ? 'ஹாய்,' : 'Hi,'}</span>
            <span className="user-name-bold">{user?.name ? (user.name.includes('Master') ? (lang === 'ta' ? 'நித்யா மாஸ்டர்' : 'Nithya Master') : (lang === 'ta' ? 'நித்யா 👋' : 'Nithya 👋')) : 'Nithya'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
