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
    { id: 'home', labelEn: 'Public Portal', mobileLabelEn: 'Portal', labelTa: 'பொதுப்பகுதி', mobileLabelTa: 'முகப்பு', icon: Home },
    { id: 'reminders', labelEn: 'Reminders', mobileLabelEn: 'Reminders', labelTa: 'நினைவூட்டல்', mobileLabelTa: 'அலர்ட்', icon: BellRing },
    { id: 'yoga', labelEn: 'Yoga Classes', mobileLabelEn: 'Yoga', labelTa: 'யோகா வகுப்புகள்', mobileLabelTa: 'யோகா', icon: Flower2 },
    { id: 'admin', labelEn: 'Admin Portal', mobileLabelEn: 'Admin', labelTa: 'அட்மின் போர்டல்', mobileLabelTa: 'அட்மின்', icon: ShieldCheck },
    { id: 'profile', labelEn: 'Profile', mobileLabelEn: 'Profile', labelTa: 'சுயவிவரம்', mobileLabelTa: 'சுயவிவரம்', icon: User }
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
                <span className="nav-label-mobile sm:hidden">
                  {lang === 'ta' ? item.mobileLabelTa : item.mobileLabelEn}
                </span>
                <span className="nav-label-full hidden sm:inline">
                  {lang === 'ta' ? item.labelTa : item.labelEn}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
