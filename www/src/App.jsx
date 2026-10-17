import React, { useState, useEffect, useRef } from 'react';
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
import AdminPortalSection from './components/AdminPortalSection';
import InviteRegistrationModal from './components/InviteRegistrationModal';
import ActiveAlarmModal from './components/ActiveAlarmModal';
import StudentJoinModal from './components/StudentJoinModal';
import StudentDashboard from './components/StudentDashboard';
import InAppUpdateBanner from './components/InAppUpdateBanner';
import { ArrowLeft } from 'lucide-react';

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
import { 
  initNotificationSystem, 
  syncAllRemindersWithSystem, 
  triggerImmediateSystemNotification, 
  requestSystemNotificationPermission 
} from './utils/notificationScheduler';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [theme, setTheme] = useState(() => loadStorage('nithya_theme', 'light'));
  const [lang, setLang] = useState(() => loadStorage('nithya_lang', 'en'));
  const [searchQuery, setSearchQuery] = useState('');

  // Active in-app alarm trigger state
  const [activeAlarm, setActiveAlarm] = useState(null);

  // Invite Token from URL search parameters (?invite=...)
  const [inviteToken, setInviteToken] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('invite') || '';
    } catch (e) {
      return '';
    }
  });

  // Client Session Details for Live Class: name + phone
  const [studentSession, setStudentSession] = useState(() => {
    return loadStorage('nithya_student_session', null);
  });
  const [showStudentJoinModal, setShowStudentJoinModal] = useState(false);

  // States - Default app owner is 👑 NITHYA Master (Instructor / Admin)
  const [user, setUser] = useState(() => {
    const stored = loadStorage('nithya_user', null);
    const isLegacyOrNotTrainer = !stored || 
      stored.name === 'Yoga Practitioner' || 
      stored.name === 'Kavitha Ram' || 
      stored.role === 'Member' || 
      stored.role === 'Verified Member' || 
      stored.role !== 'trainer';

    if (isLegacyOrNotTrainer) {
      const defaultInstructor = {
        ...DEFAULT_USER,
        name: 'NITHYA Master',
        role: 'trainer',
        isInstructor: true
      };
      saveStorage('nithya_user', defaultInstructor);
      try {
        localStorage.setItem('nithya_trainer_token', 'nithya_master_active');
      } catch (_) {}
      return defaultInstructor;
    }
    return stored;
  });
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
    syncAllRemindersWithSystem(reminders, lang);
  }, [reminders, lang]);

  useEffect(() => {
    saveStorage('nithya_classes', classes);
  }, [classes]);

  useEffect(() => {
    saveStorage('nithya_attendance', attendanceLogs);
  }, [attendanceLogs]);

  // Initialize native Android notification channel and pre-request permission on mount
  useEffect(() => {
    initNotificationSystem();
  }, []);

  // Active reminder scheduler loop - checks device clock & triggers alarms without duplicates
  const firedRemindersRef = useRef(new Set());

  useEffect(() => {
    const checkScheduledReminders = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const current24 = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayDateStr = `${year}-${month}-${day}`;
      const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday

      reminders.forEach(r => {
        if (r.enabled === false || r.completed) return;

        // Determine scheduled 24h time ("HH:MM")
        let scheduled24 = '';
        if (r.rawTime && r.rawTime.includes(':')) {
          scheduled24 = r.rawTime.trim().slice(0, 5);
        } else if (r.time) {
          const t = r.time.trim();
          if (t.toUpperCase().includes('AM') || t.toUpperCase().includes('PM')) {
            const parts = t.split(/\s+/);
            const [hStr, mStr] = (parts[0] || '08:00').split(':');
            let h = parseInt(hStr, 10);
            const m = parseInt(mStr || '0', 10);
            const isPM = (parts[1] || '').toUpperCase() === 'PM';
            if (isPM && h < 12) h += 12;
            if (!isPM && h === 12) h = 0;
            scheduled24 = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          } else {
            scheduled24 = t.slice(0, 5);
          }
        }

        if (scheduled24 !== current24) return;

        // Check Repeat pattern
        const repeat = r.repeat || 'Daily';
        if (repeat === 'Once') {
          if (r.date && r.date !== todayDateStr) return;
        } else if (repeat === 'Weekdays') {
          if (dayOfWeek === 0 || dayOfWeek === 6) return;
        } else if (repeat === 'Weekly') {
          if (r.date) {
            const remDate = new Date(r.date + 'T00:00:00');
            if (remDate.getDay() !== dayOfWeek) return;
          }
        }

        // Deduplication key: only fire once per reminder per date per minute
        const fireKey = `${r.id}_${todayDateStr}_${current24}`;
        if (firedRemindersRef.current.has(fireKey)) return;

        firedRemindersRef.current.add(fireKey);

        // 1. Play repeating alarm chime & mobile hardware vibration
        if (r.customAudioUrl) {
          audioEngine.playAudioFile(r.customAudioUrl);
        } else {
          audioEngine.playAlarmChime();
        }

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate([400, 200, 400, 200, 400]); } catch (_) {}
        }

        // 2. Set active in-app ringing alarm modal
        setActiveAlarm(r);

        // 3. In-app toast notification
        showToast(
          lang === 'ta' ? `🔔 நினைவூட்டல்: ${r.titleTa || r.title}` : `🔔 Reminder: ${r.title}`,
          lang === 'ta' ? (r.messageTa || r.message || 'உங்கள் ஆரோக்கியத்தைக் கவனிக்கவும்') : (r.message || 'Time for your healthy habit'),
          'success'
        );

        // 4. Trigger system notification outside app (Android Status Bar, Lock Screen & Web Notification)
        triggerImmediateSystemNotification(r, lang);
      });
    };

    // Run check immediately and every 5 seconds
    checkScheduledReminders();
    const interval = setInterval(checkScheduledReminders, 5000);
    return () => clearInterval(interval);
  }, [reminders, lang]);

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

  const handleDismissAlarm = () => {
    audioEngine.stopAlarmSound();
    if (activeAlarm && activeAlarm.repeat === 'Once') {
      setReminders(prev => prev.map(r => r.id === activeAlarm.id ? { ...r, completed: true } : r));
    }
    setActiveAlarm(null);
  };

  const handleSnoozeAlarm = () => {
    audioEngine.stopAlarmSound();
    if (!activeAlarm) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const snoozeHours = now.getHours();
    const snoozeMinutes = now.getMinutes();
    const snooze24 = `${String(snoozeHours).padStart(2, '0')}:${String(snoozeMinutes).padStart(2, '0')}`;
    const period = snoozeHours >= 12 ? 'PM' : 'AM';
    const hours12 = snoozeHours % 12 || 12;
    const snooze12 = `${String(hours12).padStart(2, '0')}:${String(snoozeMinutes).padStart(2, '0')} ${period}`;

    setReminders(prev => prev.map(r => {
      if (r.id === activeAlarm.id) {
        return { ...r, rawTime: snooze24, time: snooze12 };
      }
      return r;
    }));

    showToast(
      lang === 'ta' ? 'நினைவூட்டல் 5 நிமிடம் தள்ளிவைக்கப்பட்டது ⏱️' : 'Reminder Snoozed for 5 minutes ⏱️',
      `${activeAlarm.title} (${snooze12})`,
      'info'
    );
    setActiveAlarm(null);
  };

  // Navigate and scroll to member profile card
  const handleOpenProfile = () => {
    setCurrentTab('home');
    setTimeout(() => {
      const el = document.querySelector('.profile-dashboard-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        el.classList.add('ring-2', 'ring-violet-500', 'transition-all');
        setTimeout(() => el.classList.remove('ring-2', 'ring-violet-500'), 2000);
      }
    }, 100);
  };

  // URL query parameter (?live=cls-1 or ?room=... or ?join=student) listener
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const liveId = params.get('live') || params.get('room');
      const isStudentInvite = params.get('join') === 'student' || params.get('role') === 'student' || Boolean(params.get('invite'));

      if (liveId || isStudentInvite) {
        if (liveId) {
          const found = classes.find(c => c.id === liveId) || classes[0];
          if (found) setActiveClass(found);
        }
        setCurrentTab('live');

        if (isStudentInvite) {
          localStorage.setItem('nithya_active_role', 'student');
          const session = loadStorage('nithya_student_session', null);
          if (!session) {
            setShowStudentJoinModal(true);
          }
        } else {
          // Default: NITHYA Master entering their studio
          localStorage.setItem('nithya_active_role', 'instructor');
          setShowStudentJoinModal(false);
        }
      }
    } catch (_) {}
  }, [classes]);

  const handleTestSound = async () => {
    audioEngine.playMeditationTone();

    // Check & request system notification permission
    await requestSystemNotificationPermission();

    const sample = reminders[0] || {
      id: 'test-sound-1',
      title: 'Yoga Practice',
      titleTa: 'யோகா பயிற்சி',
      message: 'Time for your healthy yoga habit! 💜',
      messageTa: 'யோகா பயிற்சி நேரம்! உங்கள் உடலையும் மனதையும் அமைதிப்படுத்துங்கள் 💜'
    };
    await triggerImmediateSystemNotification(sample, lang);

    showToast(
      lang === 'ta' ? 'அறிவிப்பு ஒலி & கணினி அறிவிப்பு சரிபார்க்கப்பட்டது 🔔' : 'Notification chime & system alert verified 🔔',
      lang === 'ta' ? 'மொபைல் ஸ்டேட்டஸ் பாரில் (Notification Bar) அறிவிப்பு வந்துள்ளதா எனப் பார்க்கவும்.' : 'Check your device status bar / lock screen outside the app.',
      'success'
    );
  };

  const handleTestSystemNotification = async () => {
    audioEngine.playAlarmChime();
    await requestSystemNotificationPermission();

    const activeRem = reminders.find(r => r.enabled !== false && !r.completed) || reminders[0] || {
      id: 'test-system-notif',
      title: 'Yoga Reminder',
      titleTa: 'யோகா நினைவூட்டல்',
      message: 'Time for mindful practice! 💜',
      messageTa: 'யோகா பயிற்சி நேரம்! உங்கள் உடலையும் மனதையும் அமைதிப்படுத்துங்கள் 💜'
    };

    await triggerImmediateSystemNotification(activeRem, lang);

    showToast(
      lang === 'ta' ? '🔔 கணினி அறிவிப்பு அனுப்பப்பட்டது!' : '🔔 System Notification Sent!',
      lang === 'ta' 
        ? 'ஆப்பிற்கு வெளியே உங்கள் மொபைல் நோட்டிபிகேஷன் பார் (Status Bar) மற்றும் லாக் ஸ்கிரீனைப் பார்க்கவும்.' 
        : 'Notification sent! Check your device status bar / lock screen outside the app.',
      'success'
    );
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    if (tabId === 'live' || tabId === 'live-classes' || tabId === 'student' || tabId === 'admin') {
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
        return { ...r, completed: nextState };
      }
      return r;
    }));
  };

  const handleToggleEnable = (id) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = r.enabled !== false ? false : true;
        showToast(
          nextState 
            ? (lang === 'ta' ? 'நினைவூட்டல் இயக்கப்பட்டது ✓' : 'Reminder Enabled ✓') 
            : (lang === 'ta' ? 'நினைவூட்டல் இடைநிறுத்தப்பட்டது' : 'Reminder Paused'),
          r.title,
          'info'
        );
        return { ...r, enabled: nextState };
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
      {/* Real-time In-App Remote Update Notification */}
      <InAppUpdateBanner lang={lang} />

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
            onOpenProfile={handleOpenProfile}
          />

          {currentTab === 'student' ? (
            <main className="dedicated-student-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => setCurrentTab('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Dashboard'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  🎓 {lang === 'ta' ? 'மாணவர் போர்ட்டல்' : 'Student Learning Portal'}
                </span>
              </div>
              <StudentDashboard
                user={user}
                classes={classes}
                reminders={reminders}
                onJoinLiveClass={(cls) => {
                  if (cls) setActiveClass(cls);
                  const session = loadStorage('nithya_student_session', null);
                  if (!session) {
                    setShowStudentJoinModal(true);
                  } else {
                    setCurrentTab('live');
                  }
                }}
                onOpenReminderModal={() => {
                  setEditingReminder(null);
                  setIsReminderModalOpen(true);
                }}
                lang={lang}
              />
            </main>
          ) : currentTab === 'admin' ? (
            <main className="dedicated-admin-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => setCurrentTab('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Dashboard'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  🛡️ {lang === 'ta' ? 'நிர்வாகி கட்டுப்பாட்டு அறை' : 'Instructor & Admin Portal'}
                </span>
              </div>
              <AdminPortalSection
                onLaunchInstructorStudio={(cls) => {
                  if (cls) setActiveClass(cls);
                  setCurrentTab('live');
                }}
                showToast={showToast}
                lang={lang}
              />
            </main>
          ) : currentTab === 'live' ? (
            <main className="dedicated-live-class-viewport p-4 max-w-7xl mx-auto ya-reveal">
              {/* Luxury Studio Frame Header & Switcher */}
              <div className="live-studio-premium-frame mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    type="button" 
                    className="btn-back-dashboard-modern"
                    onClick={() => setCurrentTab('home')}
                  >
                    <ArrowLeft size={14} className="back-arrow-icon" />
                    <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Dashboard'}</span>
                  </button>
                  <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <span className="live-indicator-dot animate-pulse"></span>
                    <span className="font-black text-sm tracking-wide text-white">
                      {lang === 'ta' ? 'நேரலை யோகா வகுப்பறை' : 'Live Yoga Studio'}
                    </span>
                    <span className="badge-private-hd">HD WebRTC</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-white/70 font-semibold hidden sm:inline">
                    {lang === 'ta' ? 'வகுப்பு:' : 'Class:'}
                  </span>
                  <select
                    value={activeClass?.id}
                    onChange={(e) => {
                      const found = classes.find(c => c.id === e.target.value);
                      if (found) setActiveClass(found);
                    }}
                    className="studio-class-dropdown"
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
              {/* Row 1: Panoramic Hero Banner (Left) + User Profile Bento (Right) */}
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
                onToggleEnable={handleToggleEnable}
                onDeleteReminder={handleDeleteReminder}
                onEditReminder={handleEditReminder}
                onTestSystemNotification={handleTestSystemNotification}
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
                  showToast={showToast}
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

      {/* Invite Link Member Registration Modal */}
      {inviteToken && (
        <InviteRegistrationModal
          inviteToken={inviteToken}
          onClose={() => setInviteToken('')}
          onRegistrationSuccess={({ member, classInfo }) => {
            setInviteToken('');
            setUser(prev => ({
              ...prev,
              name: member.name,
              email: member.email,
              phone: member.phone,
              role: 'Verified Member'
            }));
            if (classInfo) {
              setActiveClass(prev => ({ ...prev, id: classInfo.id, title: classInfo.title, name: classInfo.title }));
            }
            setCurrentTab('live');
            showToast(
              lang === 'ta' ? 'பதிவு முடிந்தது! நேரலை வகுப்பிற்கு வரவேற்கிறோம் 🧘‍♀️' : 'Registration Complete! Welcome to Live Class 🧘‍♀️',
              `${member.name} • ${classInfo?.title || 'Yoga Session'}`,
              'success'
            );
          }}
          lang={lang}
        />
      )}

      {/* In-App Active Alarm Modal (Pops up when scheduled reminder fires) */}
      <ActiveAlarmModal
        alarm={activeAlarm}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
        lang={lang}
      />

      {/* Student Join Modal (2 Fields: Name + Mobile Number before entering live yoga) */}
      <StudentJoinModal
        isOpen={showStudentJoinModal}
        onClose={() => setShowStudentJoinModal(false)}
        activeClass={activeClass}
        lang={lang}
        onJoin={(student) => {
          setStudentSession(student);
          setShowStudentJoinModal(false);
          setCurrentTab('live');
          showToast(
            lang === 'ta' ? 'வகுப்பில் இணைந்தீர்கள் 🧘‍♀️' : 'Joined Live Session 🧘‍♀️',
            `${student.name} • ${activeClass?.title || activeClass?.name}`,
            'success'
          );
        }}
      />

      {/* Toast Notification Tray */}
      <ToastContainer 
        toasts={toasts} 
        onDismiss={handleDismissToast} 
      />
    </div>
  );
}
