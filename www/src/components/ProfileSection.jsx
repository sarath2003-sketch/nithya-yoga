import React, { useState } from 'react';
import { User, Edit3, Flower2, Mail, Calendar, Target, Heart, Camera, Check, X, Trash2 } from 'lucide-react';

export default function ProfileSection({ user, onUpdateUser, lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Sarah',
    email: user?.email || 'sarah@gmail.com',
    age: user?.age || 28,
    goal: user?.goal || 'Better Health & Peace',
    joined: user?.joined || 'Oct 1, 2026',
    avatar: user?.avatar || ''
  });

  const profileTabs = ['Personal Info', 'Preferences', 'Settings'];

  // Keep form data synced if prop changes
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        age: user.age || prev.age,
        goal: user.goal || prev.goal,
        joined: user.joined || prev.joined,
        avatar: user.avatar !== undefined ? user.avatar : prev.avatar
      }));
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'ta' ? 'படத்தின் அளவு 2MB-க்கு குறைவாக இருக்க வேண்டும்' : 'Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Img = event.target.result;
        setFormData(prev => ({ ...prev, avatar: base64Img }));
        if (onUpdateUser) {
          onUpdateUser({ avatar: base64Img });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    if (onUpdateUser) {
      onUpdateUser({ avatar: '' });
    }
  };

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
          {isEditing ? <X size={13} /> : <Edit3 size={13} />}
          <span>
            {isEditing 
              ? (lang === 'ta' ? 'ரத்து செய்' : 'Cancel') 
              : (lang === 'ta' ? 'சுயவிவரம் திருத்து' : 'Edit Profile')}
          </span>
        </button>
      </div>

      {/* User Header Strip */}
      <div className="profile-user-strip">
        <div className="profile-round-avatar relative-avatar-wrap">
          {formData.avatar ? (
            <img src={formData.avatar} alt={formData.name} className="profile-img-fit" />
          ) : (
            <span>{formData.name ? formData.name.charAt(0) : 'S'}</span>
          )}

          {/* Quick Upload Button on Avatar */}
          <label className="avatar-camera-overlay-badge" title="Upload Profile Picture">
            <Camera size={13} />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden-file-input" 
              onChange={handleImageUpload} 
            />
          </label>
        </div>

        <div className="profile-user-names">
          <h4 className="profile-name-bold">{formData.name}</h4>
          <span className="profile-role-sub">
            {lang === 'ta' ? 'யோகா ஆர்வலர்' : 'Yoga Enthusiast'}
          </span>
          {formData.avatar && (
            <button 
              type="button" 
              onClick={handleRemovePhoto} 
              className="text-xs text-muted hover-red flex items-center gap-1 mt-1 btn-plain-link"
              title="Remove profile image"
            >
              <Trash2 size={11} />
              <span>{lang === 'ta' ? 'புகைப்படம் நீக்கு' : 'Remove photo'}</span>
            </button>
          )}
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

      {/* Inline Edit Form when isEditing is True */}
      {isEditing ? (
        <form onSubmit={handleSave} className="profile-edit-form-block">
          <div className="edit-field-group">
            <label className="field-key-label">{lang === 'ta' ? 'பெயர்:' : 'Name:'}</label>
            <input 
              type="text" 
              className="input-field-custom"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="edit-field-group">
            <label className="field-key-label">{lang === 'ta' ? 'மின்னஞ்சல்:' : 'Email:'}</label>
            <input 
              type="email" 
              className="input-field-custom"
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>

          <div className="form-grid-2col">
            <div className="edit-field-group">
              <label className="field-key-label">{lang === 'ta' ? 'வயது:' : 'Age:'}</label>
              <input 
                type="number" 
                className="input-field-custom"
                value={formData.age} 
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} 
              />
            </div>

            <div className="edit-field-group">
              <label className="field-key-label">{lang === 'ta' ? 'இலக்கு:' : 'Goal:'}</label>
              <input 
                type="text" 
                className="input-field-custom"
                value={formData.goal} 
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })} 
              />
            </div>
          </div>

          <div className="profile-edit-actions-row">
            <button type="button" className="btn-modal-cancel" onClick={() => setIsEditing(false)}>
              {lang === 'ta' ? 'ரத்து' : 'Cancel'}
            </button>
            <button type="submit" className="btn-modal-save">
              <Check size={14} />
              <span>{lang === 'ta' ? 'சேமிக்கவும்' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Profile Details & Quote Box Flex Row */
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
      )}
    </div>
  );
}
