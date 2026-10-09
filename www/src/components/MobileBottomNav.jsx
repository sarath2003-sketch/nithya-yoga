import React from 'react';
import { Home, Flower2, BellRing, Moon, User } from 'lucide-react';

export default function MobileBottomNav({ currentTab, setCurrentTab, lang }) {
  const bottomItems = [
    { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு', icon: Home },
    { id: 'yoga-classes', labelEn: 'Yoga', labelTa: 'யோகா', icon: Flower2 },
    { id: 'reminders', labelEn: 'Reminders', labelTa: 'நினைவூட்டல்', icon: BellRing },
    { id: 'relaxation', labelEn: 'Relax', labelTa: 'தியானம்', icon: Moon },
    { id: 'profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்', icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {bottomItems.map(item => {
        const Icon = item.icon;
        const isActive = currentTab === item.id || 
          (item.id === 'yoga-classes' && currentTab === 'live-classes');
        
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
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
