import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  User, 
  Edit3, 
  Flower2, 
  Mail, 
  Calendar, 
  Target, 
  Heart, 
  Camera, 
  Check, 
  X, 
  Trash2, 
  RefreshCw, 
  Download, 
  Sparkles, 
  ShieldCheck,
  LogOut,
  Key,
  Lock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { CURRENT_APP_VERSION, CURRENT_BUILD_NUMBER, triggerApkDownload } from './InAppUpdateBanner';
import { TimedUndoAction } from './TimedUndoAction';
import { FloatingInput } from './FloatingInput';
import { apiFetch } from '../utils/api';
import { DEFAULT_USER } from '../utils/storage';

export default function ProfileSection({ 
  user, 
  onUpdateUser, 
  onNavigateAdmin, 
  onNavigateHome,
  showToast, 
  lang = 'en' 
}) {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);
  const [remoteUpdate, setRemoteUpdate] = useState(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  // Account Management & Deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || (user?.role === 'trainer' ? 'NITHYA Master' : 'Yoga Student'),
    email: user?.email || 'student@nithyayoga.com',
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
      let data = null;
      // 1. Try local / current domain version.json
      try {
        const localRes = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (localRes.ok) data = await localRes.json();
      } catch (_) {}

      // 2. Fallback to production GitHub Pages version.json
      if (!data) {
        const res = await fetch(`https://sarath2003-sketch.github.io/nithya-yoga/version.json?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (res.ok) data = await res.json();
      }

      if (data) {
        setRemoteUpdate(data);
        if (showToast) {
          showToast(
            lang === 'ta' ? 'அப்டேட் சரிபார்க்கப்பட்டது ✓' : 'Update Check Completed ✓',
            lang === 'ta' ? `கிடைக்கக்கூடிய பதிப்பு: v${data.version}` : `Available Version: v${data.version}`,
            'info'
          );
        }
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
          lang === 'ta' ? 'ஆப் புதுப்பிக்கப்பட்டு மறுதொடக்கம் செய்யப்படுகிறது ✓' : 'App Updated & Refreshing ✓',
          lang === 'ta' ? 'புதிய மாற்றங்கள் பயன்படுத்தப்படுகின்றன...' : 'Applying latest improvements...',
          'success'
        );
      }

      // Automatically reload/refresh to apply the update immediately on screen!
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
            window.location.replace(`${window.location.origin}${window.location.pathname}?updated=${Date.now()}`);
          }
        }
      }, 700);
    } catch (_) {
      triggerApkDownload(apkDownloadUrl);
      setTimeout(() => window.location.reload(), 700);
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

  // Log Out and Redirect to Home Page
  const handleLogout = () => {
    try {
      localStorage.removeItem('nithya_admin_token');
      localStorage.removeItem('nithya_teacher_token');
      localStorage.removeItem('nithya_auth_token');
      localStorage.removeItem('nithya_member');
      localStorage.removeItem('nithya_student_session');
      localStorage.removeItem('nithya_trainer_id');
      localStorage.removeItem('nithya_trainer_profile');
      localStorage.setItem('nithya_active_role', 'student');
      localStorage.setItem('nithya_active_tab', 'home');
    } catch (_) {}

    if (onUpdateUser) {
      onUpdateUser({
        ...DEFAULT_USER,
        name: 'Yoga Student',
        role: 'student',
        isInstructor: false
      });
    }

    if (showToast) {
      showToast(
        lang === 'ta' ? 'வெளியேறியாச்சு ✓' : 'Logged Out Successfully ✓',
        lang === 'ta' ? 'அனைத்து அமர்வுகளும் முடிக்கப்பட்டன. முகப்பிற்குச் செல்கிறது...' : 'Session ended. Navigating to Home...',
        'info'
      );
    }

    setTimeout(() => {
      if (onNavigateHome) {
        onNavigateHome();
      } else if (typeof window !== 'undefined') {
        window.location.hash = '';
        window.location.reload();
      }
    }, 300);
  };

  const handleStartDeleteCountdown = (e) => {
    if (e) e.preventDefault();
    setDeleteError('');
    const isTrainerOrAdmin = Boolean(
      localStorage.getItem('nithya_admin_token') ||
      localStorage.getItem('nithya_teacher_token') ||
      user?.role === 'trainer'
    );

    if (isTrainerOrAdmin && !deletePassword.trim()) {
      setDeleteError(lang === 'ta' ? 'தயவுசெய்து உங்கள் கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your password to confirm account deletion.');
      return;
    }

    setCountdownActive(true);
  };

  const handleExecuteAccountDeletion = async () => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      const isTrainerOrAdmin = Boolean(
        localStorage.getItem('nithya_admin_token') ||
        localStorage.getItem('nithya_teacher_token') ||
        user?.role === 'trainer'
      );

      if (isTrainerOrAdmin) {
        const token = localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_teacher_token');
        const res = await apiFetch('/api/admin/delete-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            password: deletePassword.trim()
          })
        }).catch(async () => {
          return await apiFetch('/api/trainer/delete-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ password: deletePassword.trim() })
          });
        });

        if (res && res.error) {
          throw new Error(res.error);
        }
      }

      // Purge all user tokens and data locally
      try {
        localStorage.removeItem('nithya_admin_token');
        localStorage.removeItem('nithya_teacher_token');
        localStorage.removeItem('nithya_auth_token');
        localStorage.removeItem('nithya_member');
        localStorage.removeItem('nithya_student_session');
        localStorage.removeItem('nithya_trainer_id');
        localStorage.removeItem('nithya_trainer_profile');
        localStorage.removeItem('nithya_live_participants');
        localStorage.setItem('nithya_active_role', 'student');
        localStorage.setItem('nithya_active_tab', 'home');
      } catch (_) {}

      if (onUpdateUser) {
        onUpdateUser({
          ...DEFAULT_USER,
          name: 'Yoga Student',
          role: 'student',
          isInstructor: false
        });
      }

      setShowDeleteModal(false);
      setCountdownActive(false);
      setDeletePassword('');

      if (showToast) {
        showToast(
          lang === 'ta' ? 'கணக்கு நிரந்தரமாக நீக்கப்பட்டது ✓' : 'Account Permanently Deleted ✓',
          lang === 'ta' ? 'உங்கள் கணக்கு விவரங்கள் அனைத்தும் அழிக்கப்பட்டன.' : 'All user data and records have been purged.',
          'success'
        );
      }

      setTimeout(() => {
        if (onNavigateHome) {
          onNavigateHome();
        } else if (typeof window !== 'undefined') {
          window.location.hash = '';
          window.location.reload();
        }
      }, 400);
    } catch (err) {
      setDeleteError(err.message || (lang === 'ta' ? 'கணக்கை நீக்குவதில் பிழை ஏற்பட்டது.' : 'Failed to delete account.'));
      setCountdownActive(false);
    } finally {
      setIsDeleting(false);
    }
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
        <div className="flex items-center gap-2">
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

          <button
            type="button"
            className="ya-btn ya-btn--soft text-xs px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer font-bold text-rose-500 hover:bg-rose-500/10 rounded-full border border-rose-500/20 transition-colors"
            onClick={handleLogout}
            title={lang === 'ta' ? 'கணக்கிலிருந்து வெளியேறு' : 'Log Out'}
          >
            <LogOut size={13} />
            <span>{lang === 'ta' ? 'லாக் அவுட்' : 'Log Out'}</span>
          </button>
        </div>
      </div>

      {/* User Header Strip */}
      <div className="profile-user-strip">
        <div className="profile-round-avatar relative-avatar-wrap">
          {formData.avatar ? (
            <img src={formData.avatar} alt={formData.name} className="profile-img-fit" />
          ) : (
            <img src="assets/images/pastel/nithya_3d_avatar.png" alt={formData.name} className="profile-img-fit" />
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
          <div className="profile-settings-view flex flex-col gap-4 p-2 w-full max-w-full overflow-hidden">
            {/* App Version & In-App Updater Box */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3 w-full max-w-full box-border">
              <div className="flex items-center justify-between flex-wrap gap-2 w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                    🚀
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-heading uppercase tracking-wide truncate">
                      {lang === 'ta' ? 'ஆப் பதிப்பு & நேரடி அப்டேட்' : 'App Version & In-App Updates'}
                    </h4>
                    <span className="text-[11px] text-muted font-medium block truncate">
                      {lang === 'ta' ? 'தற்போதைய பதிப்பு:' : 'Installed Version:'} <strong className="text-heading">v{CURRENT_APP_VERSION}</strong>
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                  {remoteUpdate?.version && (remoteUpdate.versionCode > CURRENT_BUILD_NUMBER || remoteUpdate.version !== CURRENT_APP_VERSION)
                    ? (lang === 'ta' ? `புதிய பதிப்பு v${remoteUpdate.version} தயார்!` : `New v${remoteUpdate.version} Ready!`)
                    : (lang === 'ta' ? 'லேட்டஸ்ட் பதிப்பு ✓' : 'Latest Release ✓')}
                </span>
              </div>

              {remoteUpdate?.notesTa && (
                <div className="p-2.5 rounded-lg bg-card border border-subtle text-xs text-sub leading-relaxed break-words">
                  <span className="font-bold text-heading block mb-1">
                    {lang === 'ta' ? 'அப்டேட் குறிப்புகள்:' : 'Update Notes:'}
                  </span>
                  {lang === 'ta' ? remoteUpdate.notesTa : remoteUpdate.notes}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap pt-1 w-full">
                <button
                  type="button"
                  className="ya-btn ya-btn--soft text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer font-bold shrink-0"
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
                  className="ya-btn ya-btn--primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer font-black shadow-md shadow-primary/20 shrink-0"
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
                  className="ya-btn ya-btn--soft text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer font-bold text-violet hover:bg-subtle/70 shrink-0"
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
                  className="ya-btn text-xs px-3 py-2 flex items-center gap-1.5 cursor-pointer font-bold border border-subtle bg-card text-heading hover:bg-subtle/50 shrink-0"
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

            {/* Instructor & Admin Portal Card */}
            <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/10 flex items-center justify-between flex-wrap gap-3">
              <div className="min-w-0">
                <strong className="text-xs text-heading flex items-center gap-1.5 text-violet-700 dark:text-violet-300 font-bold">
                  <ShieldCheck size={16} className="text-violet-600 dark:text-violet-400 shrink-0" />
                  <span>{lang === 'ta' ? 'யோகா பயிற்றுநர் & அட்மின் போர்ட்டல்' : 'Instructor & Admin Portal'}</span>
                </strong>
                <span className="text-[11px] text-muted block mt-0.5">
                  {lang === 'ta' ? 'புதிய நேரலை வகுப்பை உருவாக்க மற்றும் நிர்வகிக்க உள்நுழையவும்' : 'Sign in or register to create and host live sessions'}
                </span>
              </div>
              <button
                type="button"
                className="ya-btn ya-btn--primary text-xs px-3.5 py-2 cursor-pointer font-bold shrink-0 shadow-md shadow-violet-500/20"
                onClick={() => {
                  if (onNavigateAdmin) {
                    onNavigateAdmin();
                  } else {
                    try {
                      localStorage.setItem('nithya_active_tab', 'admin');
                      window.location.reload();
                    } catch (_) {}
                  }
                }}
              >
                {lang === 'ta' ? 'அட்மின் போர்ட்டல் ➡️' : 'Open Admin Portal ➡️'}
              </button>
            </div>

            {/* Account Management & Security Zone */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <strong className="text-xs text-heading flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-bold">
                    <User size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>{lang === 'ta' ? 'கணக்கு மேலாண்மை & பாதுகாப்பு' : 'Account Management & Security'}</span>
                  </strong>
                  <span className="text-[11px] text-muted block mt-0.5">
                    {lang === 'ta' 
                      ? 'கணக்கிலிருந்து வெளியேறலாம் அல்லது உங்கள் கணக்கை நிரந்தரமாக நீக்கலாம்' 
                      : 'Sign out of your session or permanently delete your account and data'}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="ya-btn ya-btn--soft text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 rounded-xl transition-all"
                  >
                    <LogOut size={14} />
                    <span>{lang === 'ta' ? 'லாக் அவுட்' : 'Log Out'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeletePassword('');
                      setDeleteError('');
                      setCountdownActive(false);
                      setShowDeleteModal(true);
                    }}
                    className="ya-btn text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 rounded-xl transition-all"
                  >
                    <Trash2 size={14} />
                    <span>{lang === 'ta' ? 'கணக்கை நீக்கு' : 'Delete Account'}</span>
                  </button>
                </div>
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

      {/* Account Deletion Confirmation Modal via Portal */}
      {showDeleteModal && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md ya-reveal"
          onClick={() => {
            if (!countdownActive && !isDeleting) {
              setShowDeleteModal(false);
              setDeletePassword('');
              setDeleteError('');
            }
          }}
        >
          <div 
            className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[#130E2E] border border-rose-500/40 shadow-2xl text-white font-['Poppins',sans-serif]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-500/20 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="font-black text-base text-rose-100">
                    {lang === 'ta' ? 'கணக்கை நிரந்தரமாக நீக்கு' : 'Permanently Delete Account'}
                  </h3>
                  <span className="text-[11px] text-rose-300/70 block">
                    {lang === 'ta' ? 'அனைத்து தரவுகளும் நிரந்தரமாக அழிக்கப்படும்' : 'Irreversible permanent account purge'}
                  </span>
                </div>
              </div>
              {!countdownActive && !isDeleting && (
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="p-1 rounded-full text-rose-300/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Error Message */}
            {deleteError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center gap-2 text-rose-200 text-xs">
                <AlertTriangle size={15} className="text-rose-400 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            {!countdownActive ? (
              <form onSubmit={handleStartDeleteCountdown} className="flex flex-col gap-3">
                <p className="text-xs text-rose-200/80 leading-relaxed">
                  {lang === 'ta'
                    ? 'எச்சரிக்கை: இந்தச் செயல் உங்கள் வகுப்புகள், குறிப்புகள், வருகைப் பதிவுகள் மற்றும் சுயவிவரத் தரவுகள் அனைத்தையும் தரவுத்தளத்திலிருந்து நிரந்தரமாக அழிக்கும். இதை மீட்டெடுக்க முடியாது.'
                    : 'Warning: This action will permanently wipe all your hosted classes, attendance logs, and profile records from the database. This cannot be undone.'}
                </p>

                {(localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_teacher_token') || user?.role === 'trainer') && (
                  <div className="mt-1">
                    <label className="block text-xs font-semibold text-rose-200 mb-1">
                      {lang === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும் (Verify Password):' : 'Enter Password to Confirm:'}
                    </label>
                    <FloatingInput
                      type="password"
                      label={lang === 'ta' ? 'கடவுச்சொல் (Password)' : 'Account Password'}
                      value={deletePassword}
                      onChange={(e) => {
                        setDeletePassword(e.target.value);
                        if (deleteError) setDeleteError('');
                      }}
                      icon={<Lock size={15} />}
                      required
                      placeholder="••••••••"
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2.5 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword('');
                      setDeleteError('');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs cursor-pointer transition-all"
                  >
                    {lang === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>{lang === 'ta' ? 'தொடரவும் (10s Countdown)' : 'Proceed to Delete'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-full mb-4">
                  <TimedUndoAction
                    duration={10}
                    initialText={lang === 'ta' ? 'கணக்கு 10 விநாடிகளில் அழிக்கப்படும்...' : 'Account will be permanently deleted in 10s...'}
                    actionText={lang === 'ta' ? 'அழிக்கப்படுகிறது...' : 'Purging Account Records...'}
                    accentColor="#EF4444"
                    buttonWidth="w-full"
                    onComplete={handleExecuteAccountDeletion}
                    onUndo={() => {
                      setCountdownActive(false);
                      setDeleteError(lang === 'ta' ? 'நீக்குதல் ரத்து செய்யப்பட்டது.' : 'Deletion cancelled.');
                    }}
                  />
                </div>
                <p className="text-[11px] text-rose-300/70">
                  {lang === 'ta'
                    ? '10 விநாடிகளுக்குள் நீங்கள் "Undo" அழுத்தினால் கணக்கு நீக்கப்படாது.'
                    : 'Tap Undo within 10 seconds to stop account deletion.'}
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
