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
  Heart,
  ShieldCheck
} from 'lucide-react';
import { KitHeart } from './ThreeDIcons';
import LotusMark from './LotusMark';

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
    { id: 'admin', label: 'Admin Portal', labelTa: 'நிர்வாகி பகுதி', icon: ShieldCheck },
  ];

  return (
    <aside className="app-sidebar-nav">
      {/* Brand Header */}
      <div className="sidebar-brand-container" onClick={() => setCurrentTab('home')}>
        <img 
          src="assets/images/logo.png" 
          alt="Nithya Yoga &amp; Wellness Logo" 
          className="sidebar-brand-logo-img" 
        />
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
            <LotusMark className="lotus-tiny-svg" />
          </div>
          <p className="bottom-card-quote">
            {lang === 'ta' ? 'ஆரோக்கியமான நீங்களே மகிழ்ச்சியான நீங்கள்...' : 'A healthier you is a happier you...'}
          </p>
          <span className="bottom-card-heart" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <KitHeart size={14} />
          </span>
        </div>
      </div>
    </aside>
  );
}
