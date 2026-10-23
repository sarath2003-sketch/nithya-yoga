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
  Heart,
  Radio,
  Activity,
  Settings
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, lang = 'en', user = { name: 'Nithya' } }) {
  const navItems = [
    { id: 'home', label: 'Dashboard', labelTa: 'டாஷ்போர்டு', icon: Home },
    { id: 'classes', label: 'My Music & Yoga', labelTa: 'யோகா & இசை', icon: Music },
    { id: 'notes', label: 'Favorites', labelTa: 'விருப்பங்கள்', icon: Heart },
    { id: 'student', label: 'Playlists', labelTa: 'பயிற்சிப் பட்டியல்', icon: Flower2 },
    { id: 'live', label: 'Podcasts & Live', labelTa: 'நேரலை வகுப்புகள்', icon: Radio },
    { id: 'attendance', label: 'Activity', labelTa: 'செயல்பாடுகள்', icon: Activity },
    { id: 'reminders', label: 'Reminders', labelTa: 'நினைவூட்டல்', icon: Bell },
    { id: 'profile', label: 'Settings', labelTa: 'அமைப்புகள்', icon: Settings },
    { id: 'admin', label: 'Trainer Portal', labelTa: 'பயிற்றுநர் பகுதி', icon: ShieldCheck },
  ];

  const displayName = user?.name ? user.name.split(' ')[0] : 'Nithya';

  return (
    <aside className="app-sidebar-nav" aria-label="Sidebar Navigation">
      {/* Official Brand Logo matching original user design */}
      <div className="sidebar-brand-container" onClick={() => setCurrentTab('home')}>
        <div className="sidebar-brand-logo-wrap">
          <img 
            src="assets/images/logo.png" 
            alt="Nithya Yoga Logo" 
            className="sidebar-official-logo-img" 
          />
        </div>
        <div className="brand-text-block">
          <div className="sidebar-greeting-row">
            <span className="sidebar-hi-text">{lang === 'ta' ? 'நித்யா யோகா' : 'NITHYA YOGA'}</span>
          </div>
          <span className="brand-subtitle">
            {lang === 'ta' ? `ஹாய், ${displayName}! 👋` : `Hi, ${displayName}! 👋`}
          </span>
        </div>
      </div>

      {/* Navigation Links with exact White Capsule Pill on Active */}
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

      {/* Bottom Peach Card with 3D Golden Crown matching Reference Image */}
      <div className="sidebar-bottom-wellness-card">
        <div className="bottom-card-pastel-blob"></div>
        <div className="bottom-card-content">
          <div className="bottom-card-icon-badge-3d">
            <img 
              src="assets/images/pastel/crown_3d.png" 
              alt="3D Golden Crown" 
              className="bottom-card-crown-img-3d" 
            />
          </div>
          <h4 className="bottom-card-title">
            {lang === 'ta' ? 'பிரீமியம் பெறுங்கள்' : 'Go Premium'}
          </h4>
          <p className="bottom-card-quote">
            {lang === 'ta' ? 'விளம்பரமற்ற யோகா & இசைப் பயன்கள்!' : 'Unlock ad-free music and more!'}
          </p>
          <button 
            type="button" 
            className="btn-sidebar-upgrade-pill"
            onClick={() => setCurrentTab('profile')}
          >
            {lang === 'ta' ? 'மேம்படுத்துக' : 'Upgrade'}
          </button>
        </div>
      </div>
    </aside>
  );
}
