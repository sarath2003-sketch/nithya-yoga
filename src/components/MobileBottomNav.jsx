import React from 'react';
import { Home, GraduationCap, Flower2, BellRing, User, Radio } from 'lucide-react';

export default function MobileBottomNav({ currentTab, setCurrentTab, lang }) {
  const bottomItems = [
    { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { id: 'student', labelEn: 'Student', labelTa: 'மாணவர்', icon: GraduationCap },
    { id: 'yoga-classes', labelEn: 'Classes', labelTa: 'வகுப்புகள்', icon: Flower2 },
    { id: 'reminders', labelEn: 'Reminders', labelTa: 'நினைவூட்டல்', icon: BellRing },
    { id: 'profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்', icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav-container mobile-bottom-nav" aria-label="Mobile Navigation Dock">
      <div className="mobile-bottom-nav-dock">
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isLiveTab = currentTab === 'live';
          const isActive = currentTab === item.id || 
            (item.id === 'yoga-classes' && (currentTab === 'classes' || currentTab === 'live' || currentTab === 'yoga-classes' || currentTab === 'live-classes'));
          
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-dock-item mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id === 'yoga-classes' ? 'classes' : item.id)}
              aria-label={lang === 'ta' ? item.labelTa : item.labelEn}
              aria-selected={isActive}
            >
              {isActive && <span className="active-pill-backdrop" />}
              
              <div className="dock-icon-wrapper icon-glow-container">
                <Icon size={20} className="dock-icon" />
                {item.id === 'yoga-classes' && isLiveTab && (
                  <span className="dock-live-ping" title="Live class active">
                    <span className="dock-live-ping-pulse"></span>
                    <span className="dock-live-ping-dot"></span>
                  </span>
                )}
              </div>

              <span className="dock-label-text mobile-nav-label">
                {lang === 'ta' ? item.labelTa : item.labelEn}
              </span>

              {isActive && <span className="dock-active-indicator-dot" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
