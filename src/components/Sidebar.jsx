import React from 'react';
import { 
  Home, 
  Flower2, 
  Video, 
  Bell, 
  FileText, 
  Calendar, 
  Music, 
  User,
  Heart
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, lang = 'en' }) {
  const navItems = [
    { id: 'home', label: 'Home', labelTa: 'முகப்பு', icon: Home },
    { id: 'classes', label: 'Yoga Classes', labelTa: 'யோகா வகுப்புகள்', icon: Flower2 },
    { id: 'live', label: 'Live Classes', labelTa: 'லைவ் வகுப்புகள்', icon: Video },
    { id: 'reminders', label: 'Reminders', labelTa: 'நினைவூட்டல்', icon: Bell },
    { id: 'notes', label: 'Yoga Notes', labelTa: 'யோகா குறிப்புகள்', icon: FileText },
    { id: 'attendance', label: 'Attendance', labelTa: 'வருகைப் பதிவு', icon: Calendar },
    { id: 'relaxation', label: 'Relaxation', labelTa: 'ரிலாக்சேஷன்', icon: Music },
    { id: 'profile', label: 'Profile', labelTa: 'சுயவிவரம்', icon: User },
  ];

  return (
    <aside className="app-sidebar-nav">
      {/* Brand Header */}
      <div className="sidebar-brand-container" onClick={() => setCurrentTab('home')}>
        <div className="brand-lotus-circle">
          <svg viewBox="0 0 24 24" className="sidebar-lotus-svg">
            <path d="M12 2C12 2 15 7 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 7 12 2 12 2ZM6.5 7.5C6.5 7.5 10 10.5 10.5 13C11 15 9.5 16.5 7.5 16.5C5.5 16.5 4.5 14.5 4.5 13C4.5 10 6.5 7.5 6.5 7.5ZM17.5 7.5C17.5 7.5 19.5 10 19.5 13C19.5 14.5 18.5 16.5 16.5 16.5C14.5 16.5 13 15 13.5 13C14 10.5 17.5 7.5 17.5 7.5ZM12 15C13.5 15 18 16.5 19.5 19C19.5 19 16 20.5 12 20.5C8 20.5 4.5 19 4.5 19C6 16.5 10.5 15 12 15Z" />
          </svg>
        </div>
        <div className="brand-text-block">
          <h1 className="brand-name-title">NITHYA</h1>
          <span className="brand-subtitle">Yoga &amp; Wellness</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-menu-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={18} className="menu-icon" />
              <span className="menu-label">
                {lang === 'ta' ? item.labelTa : item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Inspiration Card */}
      <div className="sidebar-bottom-wellness-card">
        <div className="bottom-card-bg-overlay"></div>
        <div className="bottom-card-content">
          <div className="bottom-card-lotus">
            <svg viewBox="0 0 24 24" className="lotus-tiny-svg">
              <path d="M12 2C12 2 15 7 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 7 12 2 12 2ZM6.5 7.5C6.5 7.5 10 10.5 10.5 13C11 15 9.5 16.5 7.5 16.5C5.5 16.5 4.5 14.5 4.5 13C4.5 10 6.5 7.5 6.5 7.5ZM17.5 7.5C17.5 7.5 19.5 10 19.5 13C19.5 14.5 18.5 16.5 16.5 16.5C14.5 16.5 13 15 13.5 13C14 10.5 17.5 7.5 17.5 7.5ZM12 15C13.5 15 18 16.5 19.5 19C19.5 19 16 20.5 12 20.5C8 20.5 4.5 19 4.5 19C6 16.5 10.5 15 12 15Z" />
            </svg>
          </div>
          <p className="bottom-card-quote">
            {lang === 'ta' ? 'ஆரோக்கியமான நீங்களே மகிழ்ச்சியான நீங்கள்...' : 'A healthier you is a happier you...'}
          </p>
          <span className="bottom-card-heart">♡</span>
        </div>
      </div>
    </aside>
  );
}
