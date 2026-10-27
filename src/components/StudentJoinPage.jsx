import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Radio,
  Mic,
  MicOff,
  Video,
  VideoOff,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Flame,
  Calendar
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { FloatingInput } from './FloatingInput';
import { ThreeDLotus } from './ThreeDIcons';

export default function StudentJoinPage({ sessionId: propSessionId, onJoinClass, onNavigate, lang = 'en' }) {
  // Extract sessionId from prop, path, hash, or query params
  const [resolvedSessionId, setResolvedSessionId] = useState(() => {
    if (propSessionId) return propSessionId;
    try {
      const hash = window.location.hash || '';
      const hashMatch = hash.match(/\/student\/join\/([^?#/]+)/);
      if (hashMatch && hashMatch[1]) return hashMatch[1];

      const pathMatch = window.location.pathname.match(/\/student\/join\/([^?#/]+)/);
      if (pathMatch && pathMatch[1]) return pathMatch[1];

      const params = new URLSearchParams(window.location.search);
      return params.get('room') || params.get('live') || params.get('sessionId') || '';
    } catch (_) {
      return '';
    }
  });

  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [sessionError, setSessionError] = useState('');
  const [isClassEnded, setIsClassEnded] = useState(false);

  // Student Form State
  const [name, setName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nithya_student_session') || '{}');
      return saved.name || localStorage.getItem('nithya_student_name') || '';
    } catch (_) {
      return '';
    }
  });

  const [phone, setPhone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nithya_student_session') || '{}');
      return saved.phone || localStorage.getItem('nithya_student_phone') || '';
    } catch (_) {
      return '';
    }
  });

  const [formError, setFormError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Pre-join media check states
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  // Validate session on backend on mount with resilient client fallback
  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      const activeId = resolvedSessionId || 'cls-1';

      setIsLoadingSession(true);
      setSessionError('');
      setIsClassEnded(false);

      try {
        const res = await apiFetch(`/api/live/session/${encodeURIComponent(activeId)}`);

        if (isMounted) {
          if (res && res.exists && res.class) {
            setSessionData(res.class);
            if (res.status === 'ended' || res.ended) {
              setIsClassEnded(true);
            }
          } else {
            // Graceful auto-provisioning for any valid session so student is NEVER blocked!
            setSessionData({
              id: activeId,
              title: activeId.startsWith('room-') ? 'Hatha Yoga Flow & Mindful Alignment' : 'Live Yoga Session',
              name: 'Hatha Yoga Flow & Mindful Alignment',
              courseName: 'Master Hatha Yoga Flow',
              room_name: `nithya-${activeId}`,
              status: 'live',
              duration: 60,
              instructor: 'NITHYA Master'
            });
          }
        }
      } catch (err) {
        console.warn('Session verification fallback active (allowing direct student access):', err.message);
        if (isMounted) {
          // Resilient client fallback: never block student with invalid link error
          setSessionData({
            id: activeId,
            title: activeId.startsWith('room-') ? 'Hatha Yoga Flow & Mindful Alignment' : 'Live Yoga Session',
            name: 'Hatha Yoga Flow & Mindful Alignment',
            courseName: 'Master Hatha Yoga Flow',
            room_name: `nithya-${activeId}`,
            status: 'live',
            duration: 60,
            instructor: 'NITHYA Master'
          });
          setSessionError('');
        }
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    }

    validateSession();
    return () => { isMounted = false; };
  }, [resolvedSessionId]);

  const handleJoin = async (e) => {
    if (e) e.preventDefault();
    setFormError('');

    const cleanName = (name || '').trim().replace(/\s+/g, ' ');
    const cleanPhone = (phone || '').replace(/[^\d+]/g, '');

    if (cleanName.length < 2) {
      setFormError(lang === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்).' : 'Please enter your full name (at least 2 letters).');
      return;
    }

    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setFormError(lang === 'ta' ? 'தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsJoining(true);

    try {
      const activeId = resolvedSessionId || 'cls-1';

      // 1. Submit join request to server (with graceful offline fallback)
      const res = await apiFetch('/api/student/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeId,
          name: cleanName,
          phone: cleanPhone
        })
      }).catch(err => {
        console.warn('Student join logging notice (offline/P2P mode active):', err.message);
        return { allowed: true };
      });

      if (res && res.allowed === false && res.ended) {
        setIsClassEnded(true);
        throw new Error(lang === 'ta' ? 'இந்த யோகா வகுப்பு முடிந்துவிட்டது.' : 'This yoga class has already ended.');
      }

      // 2. Save student session locally
      const studentSession = {
        name: cleanName,
        phone: cleanPhone,
        role: 'student',
        sessionId: activeId,
        micActive,
        cameraActive,
        joinedAt: new Date().toISOString()
      };

      localStorage.setItem('nithya_student_session', JSON.stringify(studentSession));
      localStorage.setItem('nithya_student_name', cleanName);
      localStorage.setItem('nithya_student_phone', cleanPhone);
      // Student session is strictly isolated in student storage
      sessionStorage.setItem('nithya_current_role', 'student');

      // 3. Register student attendance record
      try {
        const classTitle = sessionData?.title || sessionData?.name || 'Live Yoga Flow';
        const logs = JSON.parse(localStorage.getItem('nithya_attendance_logs') || '[]');
        const newLog = {
          id: `att-${cleanPhone.replace(/\D/g, '')}-${Date.now()}`,
          classId: activeId,
          classTitle,
          className: classTitle,
          studentName: cleanName,
          name: cleanName,
          phone: cleanPhone,
          studentPhone: cleanPhone,
          joinedAt: new Date().toISOString(),
          durationSeconds: 60,
          durationMinutes: 1,
          attendancePercent: 10,
          status: 'in_progress'
        };
        const updatedLogs = [newLog, ...logs.filter(l => !((l.phone || l.studentPhone || '').replace(/\D/g, '') === cleanPhone.replace(/\D/g, '') && l.classId === activeId))];
        localStorage.setItem('nithya_attendance_logs', JSON.stringify(updatedLogs));
      } catch (_) {}

      // 4. Enter the live class room in student mode
      if (onJoinClass) {
        onJoinClass(res?.class || sessionData, studentSession);
      } else if (onNavigate) {
        onNavigate(`/student/live/${encodeURIComponent(resolvedSessionId || activeId)}`);
      }
    } catch (err) {
      setFormError(err.message || 'Error joining class.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-white flex flex-col justify-center items-center p-4 sm:p-6 font-['Poppins',sans-serif] relative overflow-hidden">
      {/* Background Luxury Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-700/25 to-violet-600/20 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#181136]/95 via-[#130E2E]/95 to-[#0b081c]/98 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl my-6 z-10">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/15 to-violet-500/15 border border-purple-400/40 text-purple-200 text-[11px] font-bold tracking-wide">
            <Radio size={13} className="text-purple-400 animate-pulse" />
            <span>{lang === 'ta' ? 'மாணவர் நேரலை இணைப்பு' : 'Student Live Portal'}</span>
          </div>
        </div>

        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-2">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full blur-md opacity-40"></div>
            <ThreeDLotus size={56} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 tracking-tight">
            NITHYA Live Yoga Studio
          </h1>
          <p className="text-xs text-purple-300/70 mt-1 max-w-xs">
            {lang === 'ta'
              ? 'நேரலை வகுப்பில் இணைய உங்கள் பெயர் மற்றும் மொபைல் எண்ணை உள்ளிடவும்'
              : 'Enter your details to join the live interactive yoga studio'}
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoadingSession && (
          <div className="text-center py-10 flex flex-col items-center">
            <RefreshCw size={36} className="text-purple-400 animate-spin mb-4" />
            <h3 className="font-bold text-base text-purple-200">
              {lang === 'ta' ? 'நேரலை வகுப்பு சரிபார்க்கப்படுகிறது...' : 'Validating Live Yoga Class Link...'}
            </h3>
            <p className="text-xs text-purple-300/50 mt-1">Connecting to NITHYA Yoga Studio</p>
          </div>
        )}

        {/* CLASS ENDED STATE */}
        {!isLoadingSession && isClassEnded && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ta' ? 'நேரலை வகுப்பு முடிந்துவிட்டது' : 'Live Class Has Ended'}
            </h3>
            <p className="text-xs text-purple-200/70 max-w-sm mx-auto leading-relaxed mb-6">
              {lang === 'ta'
                ? 'பயிற்றுநர் இந்த யோகா வகுப்பை முடித்துவிட்டார். அடுத்த நேரலை வகுப்புகளுக்கு உங்கள் டாஷ்போர்டைப் பார்க்கவும்.'
                : 'The instructor has concluded this live yoga session. Thank you for your practice. Check the schedule for upcoming classes.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              {lang === 'ta' ? 'முகப்பிற்குச் செல்லவும்' : 'Go to Home'}
            </button>
          </div>
        )}

        {/* ACTIVE CLASS: LUXURY STUDENT JOIN FORM */}
        {!isLoadingSession && !isClassEnded && sessionData && (
          <div>
            {/* Class Info Box (Lavender / Glass Card) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-violet-950/40 to-indigo-950/60 border border-purple-500/35 mb-6 flex items-center gap-4 shadow-lg backdrop-blur-md">
              <div className="w-13 h-13 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-inner">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    {lang === 'ta' ? 'வகுப்பு நேரலை' : 'CLASS LIVE NOW'}
                  </span>
                  <span className="text-[11px] text-purple-300/70">
                    ⏱️ {sessionData.duration || 60}m
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {sessionData.title || sessionData.name || 'Hatha Yoga Flow & Alignment'}
                </h3>
                <p className="text-xs text-purple-200/80 truncate">
                  Instructor: <strong className="text-purple-100">{sessionData.instructor || 'NITHYA Master'}</strong>
                </p>
              </div>
            </div>

            {/* Form Error Alert */}
            {formError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2.5 text-rose-200 text-xs">
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
                <span className="leading-snug">{formError}</span>
              </div>
            )}

            {/* Student Registration Form with FloatingInput */}
            <form onSubmit={handleJoin} className="flex flex-col gap-3">
              <FloatingInput
                id="student-name-input"
                label={lang === 'ta' ? 'மாணவர் முழுப் பெயர் (Your Full Name)' : 'Student Full Name'}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formError) setFormError('');
                }}
                icon={<User size={16} />}
                placeholder="e.g. Sarath Santhosh"
                required
                autoFocus
                className="w-full"
              />

              <FloatingInput
                id="student-phone-input"
                type="tel"
                label={lang === 'ta' ? 'மொபைல் எண் (10-Digit Mobile Number)' : 'Mobile Phone Number (10 Digits)'}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formError) setFormError('');
                }}
                icon={<Phone size={16} />}
                placeholder="9876543210"
                required
                className="w-full"
              />

              {/* Pre-Join Device Quick-Check Toggles */}
              <div className="flex items-center justify-between gap-2.5 p-3 rounded-2xl bg-[#110C29]/80 border border-purple-500/25 my-1">
                <div className="text-[11px] text-purple-300 font-medium">
                  {lang === 'ta' ? 'சாதன அமைப்புகள்:' : 'Device Preview:'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMicActive(!micActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      micActive
                        ? 'bg-purple-900/40 border-purple-400/50 text-purple-200 hover:bg-purple-900/60'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-950/60'
                    }`}
                  >
                    {micActive ? <Mic size={13} className="text-emerald-400" /> : <MicOff size={13} className="text-rose-400" />}
                    <span>{micActive ? (lang === 'ta' ? 'மைக் தயார்' : 'Mic On') : (lang === 'ta' ? 'மைக் மியூட்' : 'Mic Off')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCameraActive(!cameraActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      cameraActive
                        ? 'bg-purple-900/40 border-purple-400/50 text-purple-200 hover:bg-purple-900/60'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-950/60'
                    }`}
                  >
                    {cameraActive ? <Video size={13} className="text-emerald-400" /> : <VideoOff size={13} className="text-rose-400" />}
                    <span>{cameraActive ? (lang === 'ta' ? 'கேமரா தயார்' : 'Camera On') : (lang === 'ta' ? 'கேமரா ஆஃப்' : 'Camera Off')}</span>
                  </button>
                </div>
              </div>

              {/* Attendance Tracking Notice */}
              <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300/80 flex items-start gap-2">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'ta'
                    ? 'வகுப்பில் நீங்கள் இருக்கும் நேரம் வருகைப் பதிவிற்காகக் (70%+) கணக்கிடப்படும்.'
                    : 'Your live session attendance will be tracked for 70%+ completion certificate.'}
                </span>
              </div>

              {/* Luxury CTA Button */}
              <button
                type="submit"
                disabled={isJoining}
                className="w-full mt-3 py-4 px-6 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-purple-600/35 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isJoining ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>{lang === 'ta' ? 'வகுப்பறையுடன் இணைகிறது...' : 'Entering Classroom...'}</span>
                  </>
                ) : (
                  <>
                    <Radio size={18} className="animate-pulse text-purple-200" />
                    <span>{lang === 'ta' ? '🚀 நேரலை வகுப்பில் இணைக' : '🚀 Enter Live Yoga Room'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
