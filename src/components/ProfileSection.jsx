import React, { useState } from 'react';
import { User, Edit3, Flower2, Mail, Calendar, Target, Heart } from 'lucide-react';

export default function ProfileSection({ user, onUpdateUser, lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Sarah',
    email: user?.email || 'sarah@gmail.com',
    age: user?.age || 28,
    goal: user?.goal || 'Better Health & Peace',
    joined: user?.joined || 'Oct 1, 2026'
  });

  const profileTabs = ['Personal Info', 'Preferences', 'Settings'];

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) onUpdateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="dashboard-card profile-dashboard-card">
      {/* Header */}
      <div className="card-header-row">
        <h3 className="card-title-main">
          <User size={18} className="text-violet" />
          <span>{lang === 'ta' ? 'சுயவிவரம்' : 'Profile'}</span>
        </h3>
        <button 
          type="button" 
          className="btn-edit-profile-pill"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 size={13} />
          <span>{lang === 'ta' ? 'சுயவிவரம் திருத்து' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* User Header Strip */}
      <div className="profile-user-strip">
        <div className="profile-round-avatar">
          <span>{formData.name.charAt(0)}</span>
        </div>
        <div className="profile-user-names">
          <h4 className="profile-name-bold">{formData.name}</h4>
          <span className="profile-role-sub">
            {lang === 'ta' ? 'யோகா ஆர்வலர்' : 'Yoga Enthusiast'}
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="profile-tabs-strip">
        {profileTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tab-strip-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Details & Quote Box Flex Row */}
      <div className="profile-content-split">
        {/* Left: Info Key-Values */}
        <div className="profile-details-list">
          <div className="detail-field-row">
            <span className="field-key-label">{lang === 'ta' ? 'பெயர்:' : 'Name:'}</span>
            <strong className="field-val-text">{formData.name}</strong>
          </div>

          <div className="detail-field-row">
            <span className="field-key-label">{lang === 'ta' ? 'மின்னஞ்சல்:' : 'Email:'}</span>
            <span className="field-val-text email-val">{formData.email}</span>
          </div>

          <div className="detail-field-row">
            <span className="field-key-label">{lang === 'ta' ? 'வயது:' : 'Age:'}</span>
            <span className="field-val-text">{formData.age}</span>
          </div>

          <div className="detail-field-row">
            <span className="field-key-label">{lang === 'ta' ? 'இலக்கு:' : 'Goal:'}</span>
            <span className="field-val-text">{formData.goal}</span>
          </div>

          <div className="detail-field-row">
            <span className="field-key-label">{lang === 'ta' ? 'இணைந்தது:' : 'Joined:'}</span>
            <span className="field-val-text">{formData.joined}</span>
          </div>
        </div>

        {/* Right: Lotus Quote Card Box */}
        <div className="profile-quote-card-box">
          <div className="quote-lotus-wrap">
            <svg viewBox="0 0 24 24" className="quote-lotus-icon">
              <path d="M12 2C12 2 15 7 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 7 12 2 12 2ZM6.5 7.5C6.5 7.5 10 10.5 10.5 13C11 15 9.5 16.5 7.5 16.5C5.5 16.5 4.5 14.5 4.5 13C4.5 10 6.5 7.5 6.5 7.5ZM17.5 7.5C17.5 7.5 19.5 10 19.5 13C19.5 14.5 18.5 16.5 16.5 16.5C14.5 16.5 13 15 13.5 13C14 10.5 17.5 7.5 17.5 7.5ZM12 15C13.5 15 18 16.5 19.5 19C19.5 19 16 20.5 12 20.5C8 20.5 4.5 19 4.5 19C6 16.5 10.5 15 12 15Z" />
            </svg>
          </div>
          <p className="quote-mind-body">
            {lang === 'ta' ? '"ஆரோக்கியமான மனமே மகிழ்ச்சியான வாழ்க்கைக்கு வழிவகுக்கும்."' : '"A healthy mind leads to a happy life."'}
          </p>
        </div>
      </div>
    </div>
  );
}
