import React from 'react';
import { Home, Flower2, Radio, BellRing, User } from 'lucide-react';

/**
 * Mobile Bottom Navigation — Design 05 (Pill Highlight)
 * 
 * Features:
 * - Rounded pill-style container floating above system navigation bar
 * - Dedicated pill highlight background on the active tab
 * - Subtle purple accent (#7c3aed) matching Nithya Yoga identity
 * - Bilingual labels (English / Tamil)
 * - Safe-area inset support for modern Android devices and iPhones
 * - Smooth, subtle transitions without excessive animation
 */
export default function MobileBottomNav({ currentTab, setCurrentTab, lang = 'en' }) {
  const bottomItems = [
    { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { id: 'yoga', labelEn: 'Yoga', labelTa: 'யோகா', icon: Flower2 },
    { id: 'live', labelEn: 'Live Class', labelTa: 'நேரலை', icon: Radio },
    { id: 'reminders', labelEn: 'Reminders', labelTa: 'நினைவூட்டல்', icon: BellRing },
    { id: 'profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்', icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav-container mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-nav-dock pill-highlight-dock">
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || 
            (item.id === 'yoga' && (currentTab === 'classes' || currentTab === 'yoga-classes')) ||
            (item.id === 'live' && (currentTab === 'live' || currentTab === 'live-classes'));
          
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
                {item.id === 'live' && currentTab === 'live' && (
                  <span className="live-status-dot-ping" title="Live Class Active" />
                )}
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
