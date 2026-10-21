import React from 'react';
import { 
  Home, 
  GraduationCap,
  Flower2, 
  Video, 
  Bell, 
  FileText, 
  Calendar, 
  Music, 
  User,
  ShieldCheck,
  Crown,
  Sparkles
} from 'lucide-react';
import { KitHeart } from './ThreeDIcons';
import LotusMark from './LotusMark';

export default function Sidebar({ currentTab, setCurrentTab, lang = 'en', user = { name: 'Nithya' } }) {
  const navItems = [
    { id: 'home', label: 'Home', labelTa: 'முகப்பு', icon: Home },
    { id: 'student', label: 'Student Portal', labelTa: 'மாணவர் பகுதி', icon: GraduationCap },
    { id: 'classes', label: 'Yoga Classes', labelTa: 'யோகா வகுப்புகள்', icon: Flower2 },
    { id: 'live', label: 'Live Classes', labelTa: 'லைவ் வகுப்புகள்', icon: Video },
    { id: 'reminders', label: 'Reminders', labelTa: 'நினைவூட்டல்', icon: Bell },
    { id: 'notes', label: 'Yoga Notes', labelTa: 'யோகா குறிப்புகள்', icon: FileText },
    { id: 'attendance', label: 'Attendance', labelTa: 'வருகைப் பதிவு', icon: Calendar },
    { id: 'relaxation', label: 'Relaxation', labelTa: 'ரிலாக்சேஷன்', icon: Music },
    { id: 'profile', label: 'Profile', labelTa: 'சுயவிவரம்', icon: User },
    { id: 'admin', label: 'Trainer Portal', labelTa: 'பயிற்றுநர் பகுதி', icon: ShieldCheck },
  ];

  const displayName = user?.name ? user.name.split(' ')[0] : 'Nithya';

  return (
    <aside className="app-sidebar-nav" aria-label="Sidebar Navigation">
      {/* Brand & User Profile Top Header */}
      <div className="sidebar-brand-container" onClick={() => setCurrentTab('home')}>
        <div className="sidebar-user-avatar-pill">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="sidebar-user-img" />
          ) : (
            <div className="sidebar-avatar-fallback">
              {displayName.charAt(0)}
            </div>
          )}
          <span className="sidebar-online-status-dot"></span>
        </div>
        <div className="brand-text-block">
          <div className="sidebar-greeting-row">
            <span className="sidebar-hi-text">Hi, {displayName}!</span>
            <span className="sidebar-wave">👋</span>
          </div>
          <span className="brand-subtitle">
            {lang === 'ta' ? 'நித்யா யோகா & நலம்' : 'Yoga & Wellness'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-menu-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || 
            (item.id === 'classes' && (currentTab === 'yoga' || currentTab === 'yoga-classes')) ||
            (item.id === 'live' && (currentTab === 'live' || currentTab === 'live-classes'));
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
              aria-selected={isActive}
            >
              <Icon size={18} className="menu-icon" />
              <span className="menu-label">
                {lang === 'ta' ? item.labelTa : item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Inspiration / Go Premium Pastel Card */}
      <div className="sidebar-bottom-wellness-card">
        <div className="bottom-card-pastel-blob"></div>
        <div className="bottom-card-content">
          <div className="bottom-card-icon-badge">
            <Crown size={15} className="bottom-card-crown-icon" />
          </div>
          <h4 className="bottom-card-title">
            {lang === 'ta' ? 'தினசரி உத்வேகம்' : 'Daily Inspiration'}
          </h4>
          <p className="bottom-card-quote">
            {lang === 'ta' ? 'ஆரோக்கியமான நீங்களே மகிழ்ச்சியான நீங்கள்...' : 'A healthier you is a happier you...'}
          </p>
          <div className="bottom-card-footer-pill">
            <span className="bottom-card-heart">
              <KitHeart size={13} />
            </span>
            <span className="bottom-card-spark">
              {lang === 'ta' ? 'அமைதி • ஆரோக்கியம்' : 'Mindful • Healthy'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
