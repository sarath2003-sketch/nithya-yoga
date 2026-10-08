import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SmartCareTimeline from './components/SmartCareTimeline';
import YogaClassesSection from './components/YogaClassesSection';
import LiveClassStudio from './components/LiveClassStudio';
import QuickAddReminderCard from './components/QuickAddReminderCard';
import RelaxationZone from './components/RelaxationZone';
import AttendanceProgressSection from './components/AttendanceProgressSection';
import YogaNotesSection from './components/YogaNotesSection';
import ProfileSection from './components/ProfileSection';
import ToastContainer from './components/ToastContainer';
import MobileBottomNav from './components/MobileBottomNav';

import { 
  loadStorage, 
  saveStorage, 
  DEFAULT_USER, 
  DEFAULT_REMINDERS, 
  DEFAULT_CLASSES, 
  DEFAULT_NOTES 
} from './utils/storage';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [theme, setTheme] = useState(() => loadStorage('nithya_theme', 'light'));
  const [lang, setLang] = useState(() => loadStorage('nithya_lang', 'en'));
  const [searchQuery, setSearchQuery] = useState('');

  // States
  const [user, setUser] = useState(() => loadStorage('nithya_user', DEFAULT_USER));
  const [reminders, setReminders] = useState(() => loadStorage('nithya_reminders', DEFAULT_REMINDERS));
  const [activeClass, setActiveClass] = useState(DEFAULT_CLASSES[0]);
  const [toasts, setToasts] = useState([]);

  // Theme attribute
  useEffect(() => {
    saveStorage('nithya_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Language attribute
  useEffect(() => {
    saveStorage('nithya_lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  // Sync state
  useEffect(() => {
    saveStorage('nithya_user', user);
  }, [user]);

  useEffect(() => {
    saveStorage('nithya_reminders', reminders);
  }, [reminders]);

  const showToast = (title, message = '', type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleTestSound = () => {
    audioEngine.playTempleBell();
    showToast(
      lang === 'ta' ? 'கோயில் மணி ஒலித்தது 🔔' : 'Temple Bell Chime 🔔',
      lang === 'ta' ? 'அறிவிப்பு ஒலி சரிபார்க்கப்பட்டது' : 'Notification chime verified',
      'success'
    );
  };

  const handleAddReminder = (newReminder) => {
    setReminders(prev => [newReminder, ...prev]);
    audioEngine.playGentleBell();
    showToast(
      lang === 'ta' ? 'நினைவூட்டல் சேர்க்கப்பட்டது ✓' : 'Reminder Saved ✓',
      newReminder.title,
      'success'
    );
  };

  const handleToggleComplete = (id) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.completed;
        if (nextState) audioEngine.playGentleBell();
        return { ...r, completed: nextState };
      }
      return r;
    }));
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    showToast('Deleted', 'Reminder removed', 'info');
  };

  const handleUpdateUser = (updated) => {
    setUser(prev => ({ ...prev, ...updated }));
    showToast('Profile Updated', 'Your changes have been saved', 'success');
  };

  const handleJoinLive = () => {
    const studioEl = document.querySelector('.live-class-card');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
      studioEl.classList.add('highlight-glow');
      setTimeout(() => studioEl.classList.remove('highlight-glow'), 2000);
    }
    showToast(
      lang === 'ta' ? 'லைவ் ஸ்டுடியோ இணைக்கப்பட்டது 🧘‍♀️' : 'Joined Live Yoga Studio 🧘‍♀️',
      'Hatha Yoga • Priya',
      'success'
    );
  };

  const handleViewSchedule = () => {
    const remEl = document.querySelector('.today-reminders-section');
    if (remEl) {
      remEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="nithya-app-root">
      <div className="app-main-layout">
        {/* Left Dark Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          lang={lang} 
        />

        {/* Main Content Area */}
        <div className="main-viewport-content">
          {/* Top Header Bar */}
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            theme={theme}
            setTheme={setTheme}
            lang={lang}
            setLang={setLang}
            user={user}
            onOpenNotifications={handleTestSound}
            onTestSound={handleTestSound}
          />

          <main className="dashboard-content-grid-wrapper">
            {/* Row 1: Panoramic Hero Banner (Left) + Hello, Sarah Bento (Right) */}
            <HeroSection
              user={user}
              onJoinLive={handleJoinLive}
              onViewSchedule={handleViewSchedule}
              lang={lang}
            />

            {/* Row 2: Today's Reminders (5 Pastel Cards) */}
            <SmartCareTimeline
              reminders={reminders}
              onToggleComplete={handleToggleComplete}
              onDeleteReminder={handleDeleteReminder}
              onShowAll={() => setCurrentTab('reminders')}
              lang={lang}
            />

            {/* Row 3: 3 Columns Grid (Yoga Classes | Live Class Studio | Quick Add + Relaxation) */}
            <div className="dashboard-row-3-grid">
              {/* Col 1: Yoga Classes */}
              <div className="grid-col col-classes">
                <YogaClassesSection
                  onSelectClass={(cls) => {
                    setActiveClass(cls);
                    handleJoinLive();
                  }}
                  onShowAll={() => setCurrentTab('classes')}
                  lang={lang}
                />
              </div>

              {/* Col 2: Live Class Studio */}
              <div className="grid-col col-live">
                <LiveClassStudio
                  activeClass={activeClass}
                  onLeaveClass={() => showToast('Session Ended', 'You left the live session', 'info')}
                  lang={lang}
                />
              </div>

              {/* Col 3: Quick Add Reminder (Top) + Relaxation Zone (Bottom) */}
              <div className="grid-col col-quick-relax">
                <QuickAddReminderCard
                  onAddReminder={handleAddReminder}
                  lang={lang}
                />

                <RelaxationZone
                  lang={lang}
                />
              </div>
            </div>

            {/* Row 4: 3 Columns Grid (Progress | Yoga Notes | Profile) */}
            <div className="dashboard-row-4-grid">
              {/* Col 1: Progress Analytics */}
              <div className="grid-col col-progress">
                <AttendanceProgressSection
                  user={user}
                  lang={lang}
                />
              </div>

              {/* Col 2: Yoga Notes */}
              <div className="grid-col col-notes">
                <YogaNotesSection
                  lang={lang}
                />
              </div>

              {/* Col 3: Member Profile */}
              <div className="grid-col col-profile">
                <ProfileSection
                  user={user}
                  onUpdateUser={handleUpdateUser}
                  lang={lang}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Safe-Area Bottom Nav on Mobile */}
      <MobileBottomNav 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        lang={lang} 
      />

      {/* Toast Notification Tray */}
      <ToastContainer 
        toasts={toasts} 
        onDismiss={handleDismissToast} 
      />
    </div>
  );
}
