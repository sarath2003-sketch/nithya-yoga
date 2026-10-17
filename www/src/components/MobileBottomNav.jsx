import React from 'react';
import { Home, GraduationCap, Flower2, BellRing, User } from 'lucide-react';

export default function MobileBottomNav({ currentTab, setCurrentTab, lang }) {
  const bottomItems = [
    { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { id: 'student', labelEn: 'Student', labelTa: 'மாணவர்', icon: GraduationCap },
    { id: 'yoga-classes', labelEn: 'Classes', labelTa: 'வகுப்புகள்', icon: Flower2 },
    { id: 'reminders', labelEn: 'Reminders', labelTa: 'நினைவூட்டல்', icon: BellRing },
    { id: 'profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்', icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {bottomItems.map(item => {
        const Icon = item.icon;
        const isActive = currentTab === item.id || 
          (item.id === 'yoga-classes' && (currentTab === 'classes' || currentTab === 'live' || currentTab === 'yoga-classes' || currentTab === 'live-classes'));
        
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id === 'yoga-classes' ? 'classes' : item.id)}
          >
            <div className="icon-glow-container">
              <Icon size={20} />
            </div>
            <span className="mobile-nav-label">
              {lang === 'ta' ? item.labelTa : item.labelEn}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
