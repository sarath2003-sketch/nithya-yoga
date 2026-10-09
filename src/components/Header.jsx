import React from 'react';
import { Search, Bell, Sparkles, Moon, Sun, Globe } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  theme,
  setTheme,
  lang,
  setLang,
  user,
  onOpenNotifications,
  onTestSound
}) {
  return (
    <header className="dashboard-top-header">
      {/* Mobile Brand Logo */}
      <div className="header-mobile-brand-wrap" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src="assets/images/logo.png" alt="Nithya Yoga" className="header-mobile-logo-img" />
        <span className="header-mobile-title">NITHYA</span>
      </div>

      {/* Search Input Bar */}
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

      {/* Header Actions */}
      <div className="header-tools-cluster">
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

        {/* Notification Bell */}
        <button
          type="button"
          className="header-tool-btn notif-bell-btn"
          onClick={onTestSound}
          title="Notifications"
        >
          <Bell size={17} />
          <span className="red-notification-dot"></span>
        </button>

        {/* User Pill */}
        <div 
          className="header-user-badge"
          onClick={() => {
            const el = document.querySelector('.profile-dashboard-card');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          title="View / Edit Profile"
          role="button"
          tabIndex={0}
        >
          <div className="user-avatar-circle">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="user-greeting-meta">
            <span className="welcome-tag">{lang === 'ta' ? 'வணக்கம்,' : 'Welcome,'}</span>
            <span className="user-name-bold">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
