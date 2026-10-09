import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SmartCareTimeline from './components/SmartCareTimeline';
import YogaClassesSection from './components/YogaClassesSection';
import LiveClassStudio from './components/LiveClassStudio';
import QuickAddReminderCard from './components/QuickAddReminderCard';
import RelaxationZone from './components/RelaxationZone';
import PranayamaBreathingOrb from './components/PranayamaBreathingOrb';
import AttendanceProgressSection from './components/AttendanceProgressSection';
import YogaNotesSection from './components/YogaNotesSection';
import ProfileSection from './components/ProfileSection';
import ToastContainer from './components/ToastContainer';
import MobileBottomNav from './components/MobileBottomNav';
import ReminderModal from './components/ReminderModal';
import LiveYogaClassRoom from './components/LiveYogaClassRoom';

import { 
  loadStorage, 
  saveStorage, 
  DEFAULT_USER, 
  DEFAULT_REMINDERS, 
  DEFAULT_CLASSES, 
  DEFAULT_NOTES,
  DEFAULT_ATTENDANCE_LOGS 
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
  const [classes, setClasses] = useState(() => loadStorage('nithya_classes', DEFAULT_CLASSES));
  const [activeClass, setActiveClass] = useState(() => classes[0] || DEFAULT_CLASSES[0]);
  const [attendanceLogs, setAttendanceLogs] = useState(() => loadStorage('nithya_attendance', DEFAULT_ATTENDANCE_LOGS));
  const [toasts, setToasts] = useState([]);

  // Modal State for editing/adding reminders
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

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

  // Sync state to LocalStorage
  useEffect(() => {
    saveStorage('nithya_user', user);
  }, [user]);

  useEffect(() => {
    saveStorage('nithya_reminders', reminders);
  }, [reminders]);

  useEffect(() => {
    saveStorage('nithya_classes', classes);
  }, [classes]);

  useEffect(() => {
    saveStorage('nithya_attendance', attendanceLogs);
  }, [attendanceLogs]);

  const showToast = (title, message = '', type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleTestSound = () => {
    audioEngine.playMeditationTone();
    showToast(
      lang === 'ta' ? 'அறிவிப்பு ஒலி சரிபார்க்கப்பட்டது 🔔' : 'Notification chime verified 🔔',
      lang === 'ta' ? 'தியான ஒலி இயங்கியது' : 'Meditation Tone played successfully',
      'success'
    );
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    if (tabId === 'live' || tabId === 'live-classes') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    let selector = '';
    if (tabId === 'classes' || tabId === 'yoga-classes') selector = '.col-classes';
    else if (tabId === 'reminders') selector = '.today-reminders-section';
    else if (tabId === 'notes') selector = '.col-notes';
    else if (tabId === 'attendance') selector = '.col-progress';
    else if (tabId === 'relaxation') selector = '.relaxation-zone-card';
    else if (tabId === 'profile') selector = '.profile-dashboard-card';

    if (selector) {
      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handleAddReminder = (newReminder) => {
    setReminders(prev => [newReminder, ...prev]);
    audioEngine.playSoundByName(newReminder.sound || 'Soft Bell');
    showToast(
      lang === 'ta' ? 'நினைவூட்டல் சேர்க்கப்பட்டது ✓' : 'Reminder Saved ✓',
      `${newReminder.title} (${newReminder.time})`,
      'success'
    );
  };

  const handleSaveModalReminder = (remData) => {
    setReminders(prev => {
      const exists = prev.some(r => r.id === remData.id);
      if (exists) {
        return prev.map(r => r.id === remData.id ? remData : r);
      }
      return [remData, ...prev];
    });
    audioEngine.playSoundByName(remData.sound || 'Soft Bell');
    showToast(
      lang === 'ta' ? 'நினைவூட்டல் புதுப்பிக்கப்பட்டது ✓' : 'Reminder Updated ✓',
      remData.title,
      'success'
    );
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setIsReminderModalOpen(true);
  };

  const handleToggleComplete = (id) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = !r.completed;
        if (nextState) audioEngine.playSoftBell();
        return { ...r, completed: nextState };
      }
      return r;
    }));
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    showToast(
      lang === 'ta' ? 'நினைவூட்டல் நீக்கப்பட்டது' : 'Reminder Removed',
      '',
      'info'
    );
  };

  const handleUpdateUser = (updated) => {
    setUser(prev => ({ ...prev, ...updated }));
    showToast(
      lang === 'ta' ? 'சுயவிவரம் புதுப்பிக்கப்பட்டது ✓' : 'Profile Updated ✓',
      lang === 'ta' ? 'மாற்றங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன' : 'Changes saved successfully',
      'success'
    );
  };

  const handleRecordAttendance = (record) => {
    setAttendanceLogs(prev => [record, ...prev]);
    setUser(prev => {
      const nextCount = (prev.classesAttended || 0) + 1;
      const nextRate = Math.min(100, (prev.attendanceRate || 85) + 2);
      return { ...prev, classesAttended: nextCount, attendanceRate: nextRate };
    });
    showToast(
      lang === 'ta' ? 'வருகை பதிவு செய்யப்பட்டது ✓' : 'Attendance Verified & Logged ✓',
      `${record.className} • ${record.durationMinutes} mins`,
      'success'
    );
  };

  const handleScheduleClass = (newCls) => {
    setClasses(prev => [newCls, ...prev]);
    setActiveClass(newCls);
    showToast(
      lang === 'ta' ? 'புதிய வகுப்பு அட்டவணைப்படுத்தப்பட்டது 🧘‍♀️' : 'Live Class Scheduled 🧘‍♀️',
      `${newCls.name} by ${newCls.instructor}`,
      'success'
    );
  };

  const handleJoinLive = (cls) => {
    if (cls) setActiveClass(cls);
    setCurrentTab('live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(
      lang === 'ta' ? 'லைவ் ஸ்டுடியோ இணைக்கப்பட்டது 🧘‍♀️' : 'Joined Live Yoga Studio 🧘‍♀️',
      `${cls ? cls.title || cls.name : activeClass.name} • ${cls ? cls.instructor : activeClass.instructor}`,
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
    <div className="nithya-app-root yoga-advanced">
      <div className="app-main-layout">
        {/* Left Dark Sidebar with exact uploaded logo */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={handleTabChange} 
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

          {currentTab === 'live' ? (
            <main className="dedicated-live-class-viewport p-4 max-w-7xl mx-auto ya-reveal">
              {/* Breadcrumb & Switcher Bar */}
              <div className="live-page-breadcrumb-bar flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    className="ya-btn ya-btn--soft text-xs"
                    onClick={() => setCurrentTab('home')}
                  >
                    ← {lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Dashboard'}
                  </button>
                  <span className="text-muted">/</span>
                  <span className="font-bold text-sm text-heading">
                    {lang === 'ta' ? 'நேரலை யோகா வகுப்பறை (LiveKit HD)' : 'Live Yoga Class Studio (LiveKit HD)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted font-medium">
                    {lang === 'ta' ? 'வகுப்பு:' : 'Class:'}
                  </span>
                  <select
                    value={activeClass?.id}
                    onChange={(e) => {
                      const found = classes.find(c => c.id === e.target.value);
                      if (found) setActiveClass(found);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border bg-card text-heading font-semibold"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title || c.name} ({c.instructor})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dedicated LiveYogaClassRoom component */}
              <LiveYogaClassRoom
                activeClass={activeClass}
                user={user}
                onLeaveClass={() => {
                  showToast(
                    lang === 'ta' ? 'அமர்வு முடிந்தது' : 'Session Ended',
                    lang === 'ta' ? 'நீங்கள் அமர்விலிருந்து வெளியேறினீர்கள்' : 'You left the live session',
                    'info'
                  );
                  setCurrentTab('home');
                }}
                onRecordAttendance={handleRecordAttendance}
                lang={lang}
              />
            </main>
          ) : (
            <main className="dashboard-content-grid-wrapper">
              {/* Row 1: Panoramic Hero Banner (Left) + Hello, Sarah Bento (Right) */}
              <HeroSection
                user={user}
                onJoinLive={() => handleJoinLive(activeClass)}
                onViewSchedule={handleViewSchedule}
                lang={lang}
              />

              {/* Row 2: Today's Reminders (5 Pastel Cards) */}
              <SmartCareTimeline
                reminders={reminders}
                onToggleComplete={handleToggleComplete}
                onDeleteReminder={handleDeleteReminder}
                onEditReminder={handleEditReminder}
                onShowAll={() => {
                  setEditingReminder(null);
                  setIsReminderModalOpen(true);
                }}
                lang={lang}
              />

              {/* Row 3: 3 Columns Grid (Yoga Classes | Live Class Studio | Quick Add + Relaxation) */}
              <div className="dashboard-row-3-grid">
                {/* Col 1: Yoga Classes */}
                <div className="grid-col col-classes">
                  <YogaClassesSection
                    onSelectClass={(cls) => {
                      handleJoinLive(cls);
                    }}
                    onShowAll={() => handleTabChange('classes')}
                    lang={lang}
                  />
                </div>

                {/* Col 2: Live Class Studio */}
                <div className="grid-col col-live">
                  <LiveClassStudio
                    activeClass={activeClass}
                    onLeaveClass={() => showToast(lang === 'ta' ? 'அமர்வு முடிந்தது' : 'Session Ended', lang === 'ta' ? 'நீங்கள் அமர்விலிருந்து வெளியேறினீர்கள்' : 'You left the live session', 'info')}
                    onRecordAttendance={handleRecordAttendance}
                    onScheduleClass={handleScheduleClass}
                    onOpenFullStudio={() => setCurrentTab('live')}
                    lang={lang}
                  />
                </div>

              {/* Col 3: Quick Add Reminder (Top) + Breathing Orb (Middle) + Relaxation Zone (Bottom) */}
              <div className="grid-col col-quick-relax">
                <QuickAddReminderCard
                  onAddReminder={handleAddReminder}
                  lang={lang}
                />

                <PranayamaBreathingOrb
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
                  attendanceLogs={attendanceLogs}
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
        )}
        </div>
      </div>

      {/* Floating Safe-Area Bottom Nav on Mobile */}
      <MobileBottomNav 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange} 
        lang={lang} 
      />

      {/* Edit / Add Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setEditingReminder(null);
        }}
        onSave={handleSaveModalReminder}
        onDelete={handleDeleteReminder}
        initialData={editingReminder}
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
