import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
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
import BottomBanner from './components/BottomBanner';
import RecentlyPlayedDailyMix from './components/RecentlyPlayedDailyMix';
import TeacherLoginPage from './components/TeacherLoginPage';
import TeacherRegisterPage from './components/TeacherRegisterPage';
import TeacherDashboardPage from './components/TeacherDashboardPage';
import StudentJoinPage from './components/StudentJoinPage';
import TeacherLiveStudioRoute from './components/TeacherLiveStudioRoute';
import StudentLiveStudioRoute from './components/StudentLiveStudioRoute';
import { ArrowLeft, Play } from 'lucide-react';

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
import { 
  APP_VERSION, 
  APP_BUILD_NUMBER, 
  checkRemoteAppVersion, 
  applyAppUpdate 
} from './utils/versionManager';

function TeacherRegisterRoute({ lang }) {
  const navigate = useNavigate();
  return (
    <TeacherRegisterPage
      onNavigate={(path) => navigate(path)}
      onRegisterSuccess={() => navigate('/teacher/dashboard')}
      lang={lang}
    />
  );
}

function TeacherLoginRoute({ lang }) {
  const navigate = useNavigate();
  return (
    <TeacherLoginPage
      onNavigate={(path) => navigate(path)}
      onLoginSuccess={() => navigate('/teacher/dashboard')}
      lang={lang}
    />
  );
}

function TeacherDashboardRoute({ lang }) {
  const navigate = useNavigate();
  return (
    <TeacherDashboardPage
      onNavigate={(path) => navigate(path)}
      onLaunchLive={(cls) => navigate(`/teacher/live/${encodeURIComponent(cls?.id || cls?.sessionId || 'session')}`)}
      lang={lang}
    />
  );
}

function StudentJoinRoute({ lang }) {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  return (
    <StudentJoinPage
      sessionId={sessionId}
      onNavigate={(path) => navigate(path)}
      onJoinClass={(cls, session) => navigate(`/student/live/${encodeURIComponent(sessionId)}`)}
      lang={lang}
    />
  );
}

function MainPublicApp({ lang, setLang, theme, setTheme }) {
  const navigate = useNavigate();

  // Forward student query parameters or deep links to canonical student join route
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const liveParam = params.get('live') || params.get('room');
      const isStudent = params.get('join') === 'student' || params.get('role') === 'student';
      if (liveParam && isStudent) {
        navigate(`/student/join/${encodeURIComponent(liveParam)}`);
      }
    } catch (_) {}
  }, [navigate]);

  const [currentTab, setCurrentTab] = useState(() => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (params) {
        if (params.get('live') || params.get('room')) return 'live';
        const tabParam = params.get('tab');
        if (tabParam) return tabParam;
      }
    } catch (_) {}
    return loadStorage('nithya_active_tab', 'home');
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [updateAvailable, setUpdateAvailable] = useState(false);

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
  const [showStudentJoinModal, setShowStudentJoinModal] = useState(() => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      if (params && (params.get('live') || params.get('room') || params.get('join') === 'student')) {
        const rawSession = loadStorage('nithya_student_session', null);
        const isValid = rawSession && rawSession.name && rawSession.phone && rawSession.phone.replace(/\D/g, '').length >= 10 && !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram'].includes(rawSession.name);
        return !isValid;
      }
    } catch (_) {}
    return false;
  });

  // States - Default role is Yoga Student; trainer only when verified with trainer/admin token
  const [user, setUser] = useState(() => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const isStudentQuery = params && (params.get('join') === 'student' || params.get('role') === 'student' || Boolean(params.get('live')));
      const activeRole = typeof localStorage !== 'undefined' ? localStorage.getItem('nithya_active_role') : null;
      const studentSession = loadStorage('nithya_student_session', null);
      const hasTeacherToken = typeof localStorage !== 'undefined' && Boolean(
        localStorage.getItem('nithya_admin_token') || 
        localStorage.getItem('nithya_teacher_token') || 
        localStorage.getItem('nithya_trainer_token')
      );
      
      // If arriving via live link or explicitly in student mode, strictly initialize as student
      if (isStudentQuery || activeRole === 'student' || (!hasTeacherToken && studentSession)) {
        if (studentSession) {
          return {
            ...DEFAULT_USER,
            name: studentSession.name || 'Yoga Student',
            phone: studentSession.phone || '',
            role: 'student',
            isInstructor: false
          };
        }
        return {
          ...DEFAULT_USER,
          name: 'Yoga Student',
          role: 'student',
          isInstructor: false
        };
      }

      // If user has verified teacher credentials and is not in student mode
      if (hasTeacherToken && activeRole !== 'student') {
        const stored = loadStorage('nithya_user', null);
        if (stored && stored.role === 'trainer') return stored;
        return {
          ...DEFAULT_USER,
          name: 'NITHYA Master',
          role: 'trainer',
          isInstructor: true
        };
      }

      const stored = loadStorage('nithya_user', null);
      if (stored && stored.role === 'trainer' && !hasTeacherToken) {
        return {
          ...DEFAULT_USER,
          name: stored.name || 'Yoga Student',
          role: 'student',
          isInstructor: false
        };
      }
      if (stored) return stored;
    } catch (_) {}

    return {
      ...DEFAULT_USER,
      name: 'Yoga Student',
      role: 'student',
      isInstructor: false
    };
  });
  const [reminders, setReminders] = useState(() => loadStorage('nithya_reminders', DEFAULT_REMINDERS));
  const [classes, setClasses] = useState(() => loadStorage('nithya_classes', DEFAULT_CLASSES));
  const [activeClass, setActiveClass] = useState(() => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const liveId = params ? (params.get('live') || params.get('room')) : null;
      if (liveId) {
        const initialClasses = loadStorage('nithya_classes', DEFAULT_CLASSES);
        const match = initialClasses.find(c => c.id === liveId);
        if (match) return match;
        return {
          id: liveId,
          title: 'Live Yoga Class',
          name: 'Live Yoga Class',
          courseName: 'Live Yoga Flow',
          room_name: liveId.startsWith('nithya-') ? liveId : `nithya-${liveId}`,
          status: 'live',
          duration: 60,
          instructor: 'NITHYA Master'
        };
      }
    } catch (_) {}
    return classes[0] || DEFAULT_CLASSES[0];
  });
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

  // Purge any legacy dummy participants from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nithya_live_participants');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => 
            p && 
            p.name && 
            !['Yoga Member', 'Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram', 'NITHYA Master', 'Student'].includes(p.name) &&
            (p.phone || '').replace(/\D/g, '').length >= 10
          );
          localStorage.setItem('nithya_live_participants', JSON.stringify(cleaned));
        }
      }
    } catch (_) {}
  }, []);

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

  // Persist active tab to LocalStorage
  useEffect(() => {
    saveStorage('nithya_active_tab', currentTab);
  }, [currentTab]);

  // Check remote app version on mount to keep update indicator accurate without loops
  useEffect(() => {
    checkRemoteAppVersion().then(res => {
      if (res && res.isUpdateAvailable) {
        setUpdateAvailable(true);
      } else {
        setUpdateAvailable(false);
      }
    }).catch(() => {});
  }, []);

  // Initialize native Android notification channel and pre-request permission on mount
  useEffect(() => {
    initNotificationSystem();
  }, []);

  // Validate and restore administrator session with backend on mount
  useEffect(() => {
    const token = typeof localStorage !== 'undefined' ? (
      localStorage.getItem('nithya_admin_token') || 
      localStorage.getItem('nithya_teacher_token') || 
      localStorage.getItem('nithya_trainer_token')
    ) : null;
    if (!token) return;

    fetch('./api/teacher/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.ok && data.user) {
          setUser(prev => ({
            ...prev,
            name: data.user.name || 'NITHYA Master',
            email: data.user.email || prev.email,
            role: 'trainer',
            isInstructor: true
          }));
        }
      })
      .catch(() => {});
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

  // URL query parameter (?live=cls-1 or ?room=... or ?join=student) and Android Deep Link listener
  useEffect(() => {
    const processDeepLinkUrl = (rawUrl) => {
      try {
        if (!rawUrl) return;
        let liveId = '';
        let isStudentExplicit = false;

        if (rawUrl.startsWith('nithyayoga://')) {
          const fakeUrl = rawUrl.replace('nithyayoga://', 'https://nithya.local/');
          const parsed = new URL(fakeUrl);
          liveId = (parsed.searchParams.get('id') || parsed.searchParams.get('live') || parsed.searchParams.get('room') || '').trim();
          isStudentExplicit = parsed.searchParams.get('join') === 'student' || parsed.searchParams.get('role') === 'student' || Boolean(parsed.searchParams.get('invite'));
        } else if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
          const parsed = new URL(rawUrl);
          liveId = (parsed.searchParams.get('live') || parsed.searchParams.get('room') || parsed.searchParams.get('id') || '').trim();
          isStudentExplicit = parsed.searchParams.get('join') === 'student' || parsed.searchParams.get('role') === 'student' || Boolean(parsed.searchParams.get('invite'));
        }

        const hasTeacherToken = Boolean(localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token'));

        if (liveId || isStudentExplicit) {
          setCurrentTab('live');
          if (liveId) {
            const found = classes.find(c => c.id === liveId);
            if (found) {
              setActiveClass(found);
            } else {
              apiFetch(`/api/classes/${encodeURIComponent(liveId)}`)
                .then(backendCls => {
                  if (backendCls && backendCls.id) {
                    const clsObj = {
                      id: backendCls.id,
                      title: backendCls.title,
                      name: backendCls.title,
                      courseName: backendCls.course_name,
                      course_name: backendCls.course_name,
                      room_name: backendCls.room_name || (backendCls.id.startsWith('nithya-') ? backendCls.id : `nithya-${backendCls.id}`),
                      status: backendCls.status || 'live',
                      duration: backendCls.duration_minutes || 60,
                      instructor: 'NITHYA Master'
                    };
                    setActiveClass(clsObj);
                    setClasses(prev => [clsObj, ...prev.filter(c => c.id !== clsObj.id)]);
                  } else {
                    const dynCls = {
                      id: liveId,
                      title: 'Live Yoga Class',
                      name: 'Live Yoga Class',
                      courseName: 'Live Yoga Flow',
                      room_name: liveId.startsWith('nithya-') ? liveId : `nithya-${liveId}`,
                      status: 'live',
                      duration: 60,
                      instructor: 'NITHYA Master'
                    };
                    setActiveClass(dynCls);
                  }
                })
                .catch(() => {
                  const dynCls = {
                    id: liveId,
                    title: 'Live Yoga Class',
                    name: 'Live Yoga Class',
                    courseName: 'Live Yoga Flow',
                    room_name: liveId.startsWith('nithya-') ? liveId : `nithya-${liveId}`,
                    status: 'live',
                    duration: 60,
                    instructor: 'NITHYA Master'
                  };
                  setActiveClass(dynCls);
                });
            }
          }

          // Check if user is instructor or student:
          const rawSession = loadStorage('nithya_student_session', null);
          const isValidSession = rawSession && rawSession.name && rawSession.phone && rawSession.phone.replace(/\D/g, '').length >= 10 && !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram'].includes(rawSession.name);
          const session = isValidSession ? rawSession : null;
          if (!isValidSession) {
            try {
              localStorage.removeItem('nithya_student_session');
            } catch (_) {}
          }

          const activeRole = localStorage.getItem('nithya_active_role');
          const isTrainerMode = !isStudentExplicit && activeRole !== 'student' && hasTeacherToken && user?.role === 'trainer';

          if (isTrainerMode) {
            localStorage.setItem('nithya_active_role', 'instructor');
            setShowStudentJoinModal(false);
            setCurrentTab('live');
          } else {
            localStorage.setItem('nithya_active_role', 'student');
            if (isStudentExplicit || !session) {
              setShowStudentJoinModal(true);
            } else {
              setUser(prev => ({
                ...prev,
                name: session.name,
                phone: session.phone,
                role: 'student',
                isInstructor: false
              }));
              setShowStudentJoinModal(false);
              setCurrentTab('live');
            }
          }
        }
      } catch (err) {
        console.warn('Error processing deep link / URL params:', err);
      }
    };

    // 1. Initial page load URL
    if (typeof window !== 'undefined' && window.location) {
      processDeepLinkUrl(window.location.href);
    }

    // 2. Android cold-start deep link
    if (typeof window !== 'undefined' && window.AndroidNativeUpdater && typeof window.AndroidNativeUpdater.getInitialDeepLink === 'function') {
      const initialLink = window.AndroidNativeUpdater.getInitialDeepLink();
      if (initialLink) {
        processDeepLinkUrl(initialLink);
      }
    }

    // 3. Android warm-start deep link (onNewIntent)
    if (typeof window !== 'undefined') {
      window.__handleDeepLink = (deepLinkUri) => {
        processDeepLinkUrl(deepLinkUri);
      };
    }
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
    saveStorage('nithya_active_tab', tabId);

    // Live Class tab security & routing:
    if (tabId === 'live' || tabId === 'live-classes') {
      const hasTeacherToken = typeof localStorage !== 'undefined' && Boolean(
        localStorage.getItem('nithya_admin_token') || 
        localStorage.getItem('nithya_teacher_token') || 
        localStorage.getItem('nithya_trainer_token')
      );
      const isTrainer = hasTeacherToken && user?.role === 'trainer';
      if (isTrainer) {
        setCurrentTab('live');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Check if student has valid session from an invitation link
      const rawSession = loadStorage('nithya_student_session', null);
      const isValid = rawSession && rawSession.name && rawSession.phone && rawSession.phone.replace(/\D/g, '').length >= 10 && !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram'].includes(rawSession.name);
      if (isValid) {
        setCurrentTab('live');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // General public visitor: live class creation is teacher-only in Admin Portal
      showToast(
        lang === 'ta' ? 'அட்மின் & பயிற்றுநர் பகுதி' : 'Instructor Access Required',
        lang === 'ta' ? 'நேரலை வகுப்பைத் தொடங்க அட்மின் போர்ட்டலில் பதிவு/உள்நுழையவும்.' : 'Please sign in to the Admin Portal to create or host live classes.',
        'info'
      );
      setCurrentTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const hasTeacherToken = Boolean(localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token'));
    const isTrainer = hasTeacherToken && user?.role === 'trainer';
    if (isTrainer) {
      setCurrentTab('live');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const rawSession = loadStorage('nithya_student_session', null);
      const isValid = rawSession && rawSession.name && rawSession.phone && rawSession.phone.replace(/\D/g, '').length >= 10 && !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram'].includes(rawSession.name);
      if (!isValid) {
        setShowStudentJoinModal(true);
      } else {
        setCurrentTab('live');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleTriggerAppUpdate = async () => {
    showToast(
      lang === 'ta' ? '🔍 அப்டேட் சரிபார்க்கப்படுகிறது...' : '🔍 Checking for updates...',
      lang === 'ta' ? 'சர்வர் பதிப்பு சோதிக்கப்படுகிறது...' : 'Contacting update server...',
      'info'
    );
    try {
      const res = await checkRemoteAppVersion();
      if (res && res.isUpdateAvailable) {
        showToast(
          lang === 'ta' ? '🔄 ஆப் புதுப்பிக்கப்படுகிறது...' : '🔄 Updating app & syncing...',
          lang === 'ta' ? `பதிப்பு v${res.remoteVersion} செயல்படுத்தப்படுகிறது...` : `Applying v${res.remoteVersion}...`,
          'info'
        );
        setUpdateAvailable(true);
        await applyAppUpdate(res.remoteVersion, res.remoteBuild);
      } else {
        setUpdateAvailable(false);
        showToast(
          lang === 'ta' ? '✅ ஆப் புதுப்பித்த நிலையில் உள்ளது!' : '✅ App is already up to date!',
          lang === 'ta' ? `தற்போதைய பதிப்பு v${APP_VERSION} முழுமையாக ஒத்திசைக்கப்பட்டுள்ளது.` : `Current version v${APP_VERSION} is the latest available.`,
          'success'
        );
      }
    } catch (_) {
      showToast(
        lang === 'ta' ? '✅ ஆப் புதுப்பித்த நிலையில் உள்ளது!' : '✅ App is current!',
        `Version v${APP_VERSION}`,
        'success'
      );
    }
  };

  const handleViewSchedule = () => {
    const remEl = document.querySelector('.today-reminders-section');
    if (remEl) {
      remEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Listen for Service Worker messages (e.g. notification click navigating to reminders tab)
  useEffect(() => {
    const handleSwMessage = (e) => {
      if (e.data && e.data.type === 'NAVIGATE_TAB') {
        handleTabChange(e.data.tab);
      }
    };
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }
    return () => {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, []);

  return (
    <div className="nithya-app-root yoga-advanced">
      {/* Smart Deep Link Banner for Android Mobile Web Viewers: Open in Installed App */}
      {typeof window !== 'undefined' && !window.Capacitor?.isNativePlatform() && /Android/i.test(navigator.userAgent) && (
        <div className="open-in-native-app-banner bg-gradient-to-r from-violet-900 to-indigo-900 text-white px-3 py-2 text-xs flex items-center justify-between shadow-md sticky top-0 z-50 border-b border-violet-500/30">
          <div className="flex items-center gap-2">
            <span className="text-base animate-pulse">📱</span>
            <span className="font-semibold">{lang === 'ta' ? 'NITHYA Yoga App மொபைலில் உள்ளதா?' : 'Open in NITHYA Yoga App:'}</span>
          </div>
          <a
            href={`intent://sarath2003-sketch.github.io/nithya-yoga/${window.location.search || ''}#Intent;scheme=https;package=com.nithya.yoga;end`}
            className="px-3 py-1 bg-white text-purple-900 font-bold rounded-full text-xs shadow hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'ta' ? 'ஆப்பில் திற' : 'Open App'}</span>
            <span>➔</span>
          </a>
        </div>
      )}

      {/* Real-time In-App Remote Update Notification */}
      <InAppUpdateBanner lang={lang} />

      <div className="app-main-layout">
        {/* Left Pastel Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={handleTabChange} 
          lang={lang} 
          user={user}
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
            onOpenNotifications={handleViewSchedule}
            onTestSound={handleViewSchedule}
            onOpenProfile={handleOpenProfile}
            onQuickUpdate={handleTriggerAppUpdate}
            updateAvailable={updateAvailable}
          />

          {currentTab === 'student' ? (
            <main className="dedicated-page-viewport dedicated-student-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => handleTabChange('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
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
                    handleTabChange('live');
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
            <main className="dedicated-page-viewport dedicated-admin-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => handleTabChange('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  🛡️ {lang === 'ta' ? 'பயிற்றுநர் & நிர்வாகி பகுதி' : 'Instructor & Admin Portal'}
                </span>
              </div>
              <AdminPortalSection
                theme={theme}
                setTheme={setTheme}
                onAuthSuccess={(trainer) => {
                  setUser(prev => ({
                    ...prev,
                    name: trainer?.name || 'NITHYA Master',
                    email: trainer?.email || prev.email,
                    role: 'trainer',
                    isInstructor: true
                  }));
                }}
                onLaunchInstructorStudio={(cls) => {
                  setUser(prev => ({
                    ...prev,
                    role: 'trainer',
                    isInstructor: true,
                    name: cls?.instructor || 'NITHYA Master'
                  }));
                  if (cls) setActiveClass(cls);
                  handleTabChange('live');
                }}
                showToast={showToast}
                lang={lang}
              />
            </main>
          ) : (currentTab === 'live' || currentTab === 'live-classes') ? (
            <main className="dedicated-live-class-viewport p-4 max-w-7xl mx-auto ya-reveal">
              {/* Luxury Studio Frame Header & Switcher */}
              <div className="live-studio-premium-frame mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    type="button" 
                    className="btn-back-dashboard-modern"
                    onClick={() => handleTabChange('home')}
                  >
                    <ArrowLeft size={14} className="back-arrow-icon" />
                    <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                  </button>
                  <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <span className="live-indicator-dot animate-pulse"></span>
                    <span className="live-studio-heading-title font-black text-sm sm:text-base tracking-wide text-white">
                      {lang === 'ta' ? 'நேரலை யோகா வகுப்பறை' : 'Live Yoga Studio'}
                    </span>
                    <span className="badge-private-hd">HD WebRTC</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="studio-class-label text-xs text-[#E2D9F3] font-bold hidden sm:inline">
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
                  handleTabChange('home');
                }}
                onRecordAttendance={handleRecordAttendance}
                onNavigateAdmin={() => handleTabChange('admin')}
                lang={lang}
              />
            </main>
          ) : (currentTab === 'yoga' || currentTab === 'classes' || currentTab === 'yoga-classes') ? (
            <main className="dedicated-page-viewport dedicated-yoga-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => handleTabChange('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  🧘‍♀️ {lang === 'ta' ? 'யோகா வகுப்புகள் & ஆசனங்கள்' : 'Yoga Classes & Asanas Library'}
                </span>
              </div>

              <YogaClassesSection
                onSelectClass={(cls) => {
                  handleJoinLive(cls);
                }}
                onShowAll={() => {}}
                lang={lang}
              />
            </main>
          ) : (currentTab === 'reminders') ? (
            <main className="dedicated-page-viewport dedicated-reminders-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    className="btn-back-dashboard-modern"
                    onClick={() => handleTabChange('home')}
                  >
                    <ArrowLeft size={14} className="back-arrow-icon" />
                    <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                  </button>
                  <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                  <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                    🔔 {lang === 'ta' ? 'யோகா நினைவூட்டல்கள் & அலாரங்கள்' : 'Mindful Reminders & Daily Alarms'}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-hero-primary py-2 px-4 text-xs font-bold"
                  onClick={() => {
                    setEditingReminder(null);
                    setIsReminderModalOpen(true);
                  }}
                >
                  + {lang === 'ta' ? 'புதிய நினைவூட்டல்' : 'Add Reminder'}
                </button>
              </div>

              {/* Today's Reminders Cards */}
              <div className="mb-6">
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
              </div>

              {/* Quick Add Custom Reminder */}
              <div className="max-w-xl mx-auto">
                <QuickAddReminderCard
                  onAddReminder={handleAddReminder}
                  lang={lang}
                />
              </div>
            </main>
          ) : (currentTab === 'profile') ? (
            <main className="dedicated-page-viewport dedicated-profile-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => handleTabChange('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  👤 {lang === 'ta' ? 'உறுப்பினர் சுயவிவரம் & அமைப்புகள்' : 'Member Profile & App Settings'}
                </span>
              </div>

              <ProfileSection
                user={user}
                onUpdateUser={handleUpdateUser}
                onNavigateAdmin={() => handleTabChange('admin')}
                onNavigateHome={() => handleTabChange('home')}
                showToast={showToast}
                lang={lang}
              />
            </main>
          ) : (currentTab === 'notes') ? (
            <main className="dedicated-page-viewport dedicated-notes-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => handleTabChange('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  📝 {lang === 'ta' ? 'யோகா குறிப்புகள்' : 'Yoga Practice Notes'}
                </span>
              </div>
              <YogaNotesSection lang={lang} />
            </main>
          ) : (currentTab === 'attendance') ? (
            <main className="dedicated-page-viewport dedicated-attendance-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => handleTabChange('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  📊 {lang === 'ta' ? 'வருகை புள்ளிவிவரங்கள்' : 'Attendance Analytics'}
                </span>
              </div>
              <AttendanceProgressSection
                user={user}
                attendanceLogs={attendanceLogs}
                lang={lang}
              />
            </main>
          ) : (currentTab === 'relaxation') ? (
            <main className="dedicated-page-viewport dedicated-relaxation-viewport p-4 max-w-7xl mx-auto ya-reveal">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <button 
                  type="button" 
                  className="btn-back-dashboard-modern"
                  onClick={() => handleTabChange('home')}
                >
                  <ArrowLeft size={14} className="back-arrow-icon" />
                  <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
                </button>
                <div className="h-4 w-px bg-subtle hidden sm:block"></div>
                <span className="font-bold text-sm text-heading flex items-center gap-1.5">
                  🎵 {lang === 'ta' ? 'ரிலாக்சேஷன் & பிராணாயாமம்' : 'Relaxation & Pranayama'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PranayamaBreathingOrb lang={lang} />
                <RelaxationZone lang={lang} />
              </div>
            </main>
          ) : (
            <main className="dashboard-content-grid-wrapper ya-reveal">
              {/* Row 1: Panoramic 3D Hero Banner + 4 Pastel Stat Cards (Master Reference Design) */}
              <HeroSection
                user={user}
                onJoinLive={() => handleJoinLive(activeClass)}
                onViewSchedule={handleViewSchedule}
                onTabChange={handleTabChange}
                lang={lang}
              />

              {/* Row 2: Practice Overview & Focus Areas Charts (Master Reference Design) */}
              <AttendanceProgressSection
                user={user}
                attendanceLogs={attendanceLogs}
                lang={lang}
              />

              {/* Row 3: Recently Played & Daily Mix (Master Reference Design) */}
              <RecentlyPlayedDailyMix
                onSelectClass={(cls) => {
                  if (cls?.id === 'all-classes') {
                    handleTabChange('yoga');
                  } else {
                    handleJoinLive(activeClass);
                  }
                }}
                showToast={showToast}
                lang={lang}
              />

              {/* Row 4: Today's Reminders (5 Pastel Cards) */}
              <SmartCareTimeline
                reminders={reminders}
                onToggleComplete={handleToggleComplete}
                onToggleEnable={handleToggleEnable}
                onDeleteReminder={handleDeleteReminder}
                onEditReminder={handleEditReminder}
                onTestSystemNotification={handleTestSystemNotification}
                onShowAll={() => handleTabChange('reminders')}
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
                    onShowAll={() => handleTabChange('yoga')}
                    lang={lang}
                  />
                </div>

                {/* Col 2: Student-facing Live Class & Mindful Habits Showcase with 7-Chakra Visual Asset */}
                <div className="grid-col col-live">
                  <div className="glass-card p-6 rounded-3xl flex flex-col justify-between h-full border border-purple-500/20 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-violet-900/20 shadow-xl backdrop-blur-md relative overflow-hidden">
                    <div className="relative z-10">
                      {/* Header with separated heading badge & distinct status pill */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-purple-500/15">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center gap-1.5 shrink-0 shadow-sm">
                          🧘‍♀️ {activeClass?.status === 'live' ? (lang === 'ta' ? 'நேரலை யோகா வகுப்பு' : 'Live Yoga Stream') : (lang === 'ta' ? 'அடுத்த யோகா வகுப்பு' : 'Upcoming Yoga Class')}
                        </span>
                        <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 shrink-0 ${
                          activeClass?.status === 'live' 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                        }`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${activeClass?.status === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                          <span>
                            {activeClass?.status === 'live' 
                              ? (lang === 'ta' ? 'இப்போது நேரலை' : 'Live Now') 
                              : (lang === 'ta' ? 'திட்டமிடப்பட்டது' : 'Scheduled')}
                          </span>
                        </div>
                      </div>

                      {/* Featured 7-Chakra Visual Artwork & Non-wrapping Metadata */}
                      <div className="flex items-center gap-3.5 mb-4 p-3 rounded-2xl bg-purple-900/25 border border-purple-500/20">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-purple-950/70 border border-purple-500/30 flex items-center justify-center p-1.5 shadow-inner">
                          <img 
                            src="assets/premium-yoga/chakra-moon-hero.svg" 
                            alt="Nithya Yoga 7 Chakras Moon" 
                            className="w-full h-full object-contain drop-shadow"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-heading m-0 leading-tight truncate">
                            {activeClass?.title || activeClass?.name || 'Hatha Yoga & Prana Flow'}
                          </h4>
                          <span className="text-xs text-primary font-semibold block mt-1">
                            👤 {activeClass?.instructor || 'NITHYA Master'}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-muted">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-500/20 whitespace-nowrap">
                              ⏱️ {activeClass?.duration_minutes || activeClass?.duration || 60} {lang === 'ta' ? 'நிமிடங்கள்' : 'Mins'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-500/20 whitespace-nowrap font-medium text-emerald-300">
                              🎥 1080p HD
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted leading-relaxed mb-4">
                        {lang === 'ta'
                          ? 'ஆசனங்கள், பிராணாயாம மூச்சுப் பயிற்சி மற்றும் சக்ரா தியானம் ஆகியவற்றில் இணையுங்கள்.'
                          : 'Experience balanced asanas, guided pranayama breathing, and peaceful chakra meditation.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-2 relative z-10">
                      {activeClass?.status === 'live' ? (
                        <button
                          type="button"
                          className="btn-hero-primary w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/25 animate-pulse"
                          onClick={() => handleJoinLive(activeClass)}
                        >
                          <Play size={14} fill="currentColor" />
                          <span>{lang === 'ta' ? 'நேரலை வகுப்பில் இணையவும் (Join Live)' : 'Join Live Class'}</span>
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn-hero-primary flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                            onClick={() => handleTabChange('yoga')}
                          >
                            <span>🧘‍♀️</span>
                            <span>{lang === 'ta' ? 'யோகா விவரங்கள்' : 'Yoga Details'}</span>
                          </button>
                          <button
                            type="button"
                            className="py-2.5 px-3 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-bold border border-purple-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            onClick={() => handleTabChange('reminders')}
                            title={lang === 'ta' ? 'ரிமைண்டர் அமை' : 'Set Class Reminder'}
                          >
                            <span>⏰</span>
                            <span>{lang === 'ta' ? 'ரிமைண்டர்' : 'Reminder'}</span>
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        className="w-full py-2 text-xs font-semibold text-muted hover:text-heading transition-colors"
                        onClick={() => handleTabChange('admin')}
                      >
                        🛡️ {lang === 'ta' ? 'பயிற்றுநரா? அட்மின் போர்ட்டலில் நுழைய' : 'Instructor? Enter Admin Portal'} ➔
                      </button>
                    </div>
                  </div>
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

            {/* Row 6: 2 Columns Grid (Yoga Notes | Profile) */}
            <div className="dashboard-row-4-grid">
              {/* Col 1: Yoga Notes */}
              <div className="grid-col col-notes">
                <YogaNotesSection
                  lang={lang}
                />
              </div>

              {/* Col 2: Member Profile */}
              <div className="grid-col col-profile">
                <ProfileSection
                  user={user}
                  onUpdateUser={handleUpdateUser}
                  onNavigateAdmin={() => handleTabChange('admin')}
                  onNavigateHome={() => handleTabChange('home')}
                  showToast={showToast}
                  lang={lang}
                />
              </div>
            </div>

            {/* Row 7: Full-Width Pastel Bottom Banner */}
            <BottomBanner
              onExplore={() => handleTabChange('yoga')}
              lang={lang}
            />
          </main>
        )}
        </div>
      </div>

      {/* Floating Safe-Area Bottom Nav on Mobile (hidden during Live Studio / Class to avoid covering WebRTC call controls) */}
      {currentTab !== 'live' && currentTab !== 'live-classes' && (
        <MobileBottomNav 
          currentTab={currentTab} 
          setCurrentTab={handleTabChange} 
          lang={lang} 
        />
      )}

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
          setUser(prev => ({
            ...prev,
            name: student.name,
            phone: student.phone,
            role: 'student',
            isInstructor: false
          }));
          try {
            localStorage.setItem('nithya_active_role', 'student');
            localStorage.setItem('nithya_student_session', JSON.stringify(student));
            localStorage.removeItem('nithya_admin_token');
            localStorage.removeItem('nithya_trainer_token');
          } catch (_) {}
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

export default function App() {
  const [theme, setTheme] = useState(() => loadStorage('nithya_theme', 'light'));
  const [lang, setLang] = useState(() => loadStorage('nithya_lang', 'en'));

  useEffect(() => {
    saveStorage('nithya_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    saveStorage('nithya_lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/teacher/register" element={<TeacherRegisterRoute lang={lang} />} />
        <Route path="/teacher/login" element={<TeacherLoginRoute lang={lang} />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboardRoute lang={lang} />} />
        <Route path="/teacher/live/:sessionId" element={<TeacherLiveStudioRoute lang={lang} />} />
        <Route path="/teacher/live" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />

        <Route path="/student/join/:sessionId" element={<StudentJoinRoute lang={lang} />} />
        <Route path="/student/join" element={<Navigate to="/" replace />} />
        <Route path="/student/live/:sessionId" element={<StudentLiveStudioRoute lang={lang} />} />
        <Route path="/student/live" element={<Navigate to="/" replace />} />
        <Route path="/student" element={<Navigate to="/" replace />} />

        <Route
          path="*"
          element={
            <MainPublicApp
              lang={lang}
              setLang={setLang}
              theme={theme}
              setTheme={setTheme}
            />
          }
        />
      </Routes>
    </HashRouter>
  );
}
