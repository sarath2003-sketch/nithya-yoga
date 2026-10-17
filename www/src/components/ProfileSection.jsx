import React, { useState, useEffect } from 'react';
import { User, Edit3, Flower2, Mail, Calendar, Target, Heart, Camera, Check, X, Trash2, RefreshCw, Download, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { CURRENT_APP_VERSION, CURRENT_BUILD_NUMBER, triggerApkDownload } from './InAppUpdateBanner';

export default function ProfileSection({ user, onUpdateUser, showToast, lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);
  const [remoteUpdate, setRemoteUpdate] = useState(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Yoga Member',
    email: user?.email || 'member@nithyayoga.com',
    age: user?.age || 28,
    goal: user?.goal || 'Better Health & Peace',
    joined: user?.joined || 'Oct 1, 2026',
    avatar: user?.avatar || ''
  });

  const profileTabs = ['Personal Info', 'Preferences', 'Settings'];

  // Check remote version when visiting settings
  useEffect(() => {
    if (activeTab === 'Settings') {
      handleCheckUpdates();
    }
  }, [activeTab]);

  const handleCheckUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const res = await fetch(`https://sarath2003-sketch.github.io/nithya-yoga/version.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setRemoteUpdate(data);
      }
    } catch (e) {
      console.warn('Update check failed:', e);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleTriggerUpdate = async () => {
    setIsUpdatingApp(true);
    const apkDownloadUrl = remoteUpdate?.apkUrl || 'https://sarath2003-sketch.github.io/nithya-yoga/NITHYA-Yoga-v1.0.apk';
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }
      if (remoteUpdate?.version) {
        localStorage.setItem('nithya_installed_version', remoteUpdate.version);
        if (remoteUpdate?.versionCode) {
          localStorage.setItem('nithya_installed_build', remoteUpdate.versionCode.toString());
        }
      }
      // Trigger Chrome APK download via Android Native Bridge & external intent
      triggerApkDownload(apkDownloadUrl);

      if (showToast) {
        showToast(
          lang === 'ta' ? 'குரோமில் APK பதிவிறக்கம் தொடங்கியது ✓' : 'APK Download Started in Chrome ✓',
          lang === 'ta' ? 'பதிவிறக்கம் முடிந்ததும் Notification-ஐ திறந்து Install செய்யவும்.' : 'Open Downloads notification once complete to Install.',
          'success'
        );
      }
    } catch (_) {
      triggerApkDownload(apkDownloadUrl);
    } finally {
      setTimeout(() => {
        setIsUpdatingApp(false);
      }, 1000);
    }
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        await reg.unregister();
      }
    }
    if (showToast) {
      showToast(
        lang === 'ta' ? 'கேச் நீக்கப்பட்டது ✓' : 'Cache Cleared ✓',
        lang === 'ta' ? 'சமீபத்திய மாற்றங்கள் புதுப்பிக்கப்படுகின்றன...' : 'Refreshing latest assets...',
        'info'
      );
    }
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const isCapacitorOrLocal = 
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.protocol === 'capacitor:' ||
          window.location.protocol === 'file:';
        if (isCapacitorOrLocal) {
          window.location.reload();
        } else {
          window.location.replace(`${window.location.origin}${window.location.pathname}?live_sync=${Date.now()}`);
        }
      }
    }, 500);
  };

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
              <span>{lang === 'ta' ? 'சேமிக்கவும் (Submit)' : 'Save / Submit'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Tab Content Switching */
        activeTab === 'Settings' ? (
          <div className="profile-settings-view flex flex-col gap-4 p-2">
            {/* App Version & In-App Updater Box */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                    🚀
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-heading uppercase tracking-wide">
                      {lang === 'ta' ? 'ஆப் பதிப்பு & நேரடி அப்டேட்' : 'App Version & In-App Updates'}
                    </h4>
                    <span className="text-[11px] text-muted font-medium">
                      {lang === 'ta' ? 'தற்போதைய பதிப்பு:' : 'Installed Version:'} <strong className="text-heading">v{CURRENT_APP_VERSION}</strong>
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {remoteUpdate?.version && (remoteUpdate.versionCode > CURRENT_BUILD_NUMBER || remoteUpdate.version !== CURRENT_APP_VERSION)
                    ? (lang === 'ta' ? `புதிய பதிப்பு v${remoteUpdate.version} தயார்!` : `New v${remoteUpdate.version} Ready!`)
                    : (lang === 'ta' ? 'லேட்டஸ்ட் பதிப்பு ✓' : 'Latest Release ✓')}
                </span>
              </div>

              {remoteUpdate?.notesTa && (
                <div className="p-2.5 rounded-lg bg-card border border-subtle text-xs text-sub leading-relaxed">
                  <span className="font-bold text-heading block mb-1">
                    {lang === 'ta' ? 'அப்டேட் குறிப்புகள்:' : 'Update Notes:'}
                  </span>
                  {lang === 'ta' ? remoteUpdate.notesTa : remoteUpdate.notes}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap pt-1">
                <button
                  type="button"
                  className="ya-btn ya-btn--soft text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer font-bold"
                  onClick={handleCheckUpdates}
                  disabled={isCheckingUpdate}
                >
                  <RefreshCw size={13} className={isCheckingUpdate ? 'animate-spin' : ''} />
                  <span>
                    {isCheckingUpdate 
                      ? (lang === 'ta' ? 'சரிபார்க்கிறது...' : 'Checking...') 
                      : (lang === 'ta' ? 'அப்டேட்களைச் சரிபார்' : 'Check for Updates')}
                  </span>
                </button>

                <button
                  type="button"
                  className="ya-btn ya-btn--primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer font-black shadow-md shadow-primary/20"
                  onClick={handleTriggerUpdate}
                  disabled={isUpdatingApp}
                >
                  <RefreshCw size={13} className={isUpdatingApp ? 'animate-spin' : ''} />
                  <span>
                    {isUpdatingApp 
                      ? (lang === 'ta' ? 'அப்டேட் ஆகிறது...' : 'Updating...') 
                      : (lang === 'ta' ? 'அப்டேட் நவ் (Update Now)' : 'Update Now')}
                  </span>
                </button>

                <button
                  type="button"
                  className="ya-btn ya-btn--soft text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer font-bold text-violet hover:bg-subtle/70"
                  onClick={() => {
                    triggerApkDownload(remoteUpdate?.apkUrl);
                    if (showToast) {
                      showToast(
                        lang === 'ta' ? 'குரோமில் APK பதிவிறக்கம் தொடங்கியது ✓' : 'APK Download Started in Chrome ✓',
                        lang === 'ta' ? 'பதிவிறக்கம் முடிந்ததும் Notification-ஐ திறந்து Install செய்யவும்.' : 'Open Downloads notification once complete to Install.',
                        'success'
                      );
                    }
                  }}
                  title={lang === 'ta' ? 'நேரடியாக APK டவுன்லோட் செய்க' : 'Download Full APK'}
                >
                  <Download size={13} />
                  <span>{lang === 'ta' ? 'APK டவுன்லோட்' : 'Download APK'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearCache}
                  className="ya-btn text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer font-bold border border-subtle bg-card text-heading hover:bg-subtle/50 ml-auto"
                >
                  <RefreshCw size={13} />
                  <span>{lang === 'ta' ? 'நேரலை புதுப்பித்தல்' : 'Live Sync'}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions & Cache Clear */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-subtle bg-card flex items-center justify-between">
                <div>
                  <strong className="text-xs text-heading block">
                    {lang === 'ta' ? 'ஆப் கேச் (Cache) ரீசெட்' : 'Reset Web Cache'}
                  </strong>
                  <span className="text-[11px] text-muted">
                    {lang === 'ta' ? 'சமீபத்திய மாற்றங்களை உடனடியாகப் பெற' : 'Fetch freshest assets immediately'}
                  </span>
                </div>
                <button
                  type="button"
                  className="ya-btn ya-btn--soft text-xs px-2.5 py-1.5 cursor-pointer"
                  onClick={handleClearCache}
                >
                  {lang === 'ta' ? 'ரீசெட்' : 'Clear'}
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-subtle bg-card flex items-center justify-between">
                <div>
                  <strong className="text-xs text-heading block">
                    {lang === 'ta' ? 'அலாரம் ஒலி சோதனை' : 'Test Reminder Sound'}
                  </strong>
                  <span className="text-[11px] text-muted">
                    {lang === 'ta' ? 'அலாரம் சரியாக வேலை செய்கிறதா என சோதிக்க' : 'Check if bell chime rings clearly'}
                  </span>
                </div>
                <button
                  type="button"
                  className="ya-btn ya-btn--soft text-xs px-2.5 py-1.5 cursor-pointer text-primary"
                  onClick={() => audioEngine.playAlarmChime()}
                >
                  🔔 {lang === 'ta' ? 'ஒலி எழுப்பு' : 'Play Bell'}
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Preferences' ? (
          <div className="profile-preferences-view p-3 flex flex-col gap-3">
            <div className="p-3.5 rounded-xl border border-subtle bg-card flex items-center justify-between">
              <div>
                <strong className="text-xs text-heading block">
                  {lang === 'ta' ? 'தானியங்கி அப்டேட் அறிவிப்பு' : 'Auto Update Notification'}
                </strong>
                <span className="text-[11px] text-muted">
                  {lang === 'ta' ? 'புதிய மாற்றங்கள் வந்தால் திரையில் உடனடியாகத் தெரிவிக்கும்' : 'Notify when a new version is pushed to GitHub'}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {lang === 'ta' ? 'இயக்கப்பட்டுள்ளது' : 'Enabled'}
              </span>
            </div>
          </div>
        ) : (
          /* Profile Details & Quote Box Flex Row (Personal Info) */
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
        )
      )}
    </div>
  );
}
