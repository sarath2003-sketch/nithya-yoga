import React from 'react';
import { Home, Flower2, BellRing, User, ShieldCheck } from 'lucide-react';

/**
 * Mobile Bottom Navigation — Design 05 (Pill Highlight)
 * 
 * Features:
 * - Public Portal and Admin Portal separation as per user request
 * - Live Class creation removed from public bottom navigation
 * - Reminders prominently displayed
 * - Rounded pill-style container floating above system navigation bar
 * - Dedicated pill highlight background on the active tab
 * - Bilingual labels (English / Tamil)
 */
export default function MobileBottomNav({ currentTab, setCurrentTab, lang = 'en' }) {
  const bottomItems = [
    { id: 'home', labelEn: 'Public Portal', labelTa: 'பொதுப்பகுதி', icon: Home },
    { id: 'reminders', labelEn: 'Reminders', labelTa: 'நினைவூட்டல்', icon: BellRing },
    { id: 'yoga', labelEn: 'Yoga Classes', labelTa: 'யோகா', icon: Flower2 },
    { id: 'admin', labelEn: 'Admin Portal', labelTa: 'அட்மின் போர்டல்', icon: ShieldCheck },
    { id: 'profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்', icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav-container mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-nav-dock pill-highlight-dock">
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || 
            (item.id === 'yoga' && (currentTab === 'classes' || currentTab === 'yoga-classes')) ||
            (item.id === 'admin' && currentTab === 'admin');
          
          return (
            <button
              key={item.id}
              type="button"
              className={`pill-nav-btn mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
              aria-label={lang === 'ta' ? item.labelTa : item.labelEn}
              aria-selected={isActive}
            >
              {/* Design 05: Pill Highlight Capsule */}
              {isActive && <span className="pill-highlight-capsule" />}
              
              <div className="pill-nav-icon-wrap icon-glow-container">
                <Icon size={19} className="pill-nav-icon" />
              </div>

              <span className="pill-nav-label mobile-nav-label">
                {lang === 'ta' ? item.labelTa : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
