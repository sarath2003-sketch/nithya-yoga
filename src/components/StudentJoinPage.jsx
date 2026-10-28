import React, { useState, useEffect, useRef } from 'react';
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
  Calendar,
  Volume2,
  Crown
} from 'lucide-react';
import { apiFetch, getProductionLiveUrl } from '../utils/api';
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

  // Pre-join live device preview stream (Microsoft Teams / Google Meet style)
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [previewStream, setPreviewStream] = useState(null);
  const [deviceError, setDeviceError] = useState('');
  const previewVideoRef = useRef(null);

  // Start hardware camera/mic preview for pre-join self check
  useEffect(() => {
    let isMounted = true;
    let localMediaStream = null;

    async function initPreview() {
      if (!cameraActive && !micActive) {
        if (previewStream) {
          previewStream.getTracks().forEach(t => t.stop());
          setPreviewStream(null);
        }
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: cameraActive ? { width: { ideal: 640 }, height: { ideal: 360 }, facingMode: 'user' } : false,
            audio: micActive
          });

          if (isMounted) {
            localMediaStream = stream;
            setPreviewStream(stream);
            setDeviceError('');
            if (previewVideoRef.current && cameraActive) {
              previewVideoRef.current.srcObject = stream;
              previewVideoRef.current.play().catch(() => {});
            }
          } else {
            stream.getTracks().forEach(t => t.stop());
          }
        }
      } catch (err) {
        console.warn('Hardware preview acquisition notice:', err.message);
        if (isMounted) {
          setDeviceError(lang === 'ta' ? 'கேமரா/மைக் அணுகல் அனுமதியை சரிபார்க்கவும்' : 'Camera/mic permission needed');
        }
      }
    }

    initPreview();

    return () => {
      isMounted = false;
      if (localMediaStream) {
        localMediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraActive, micActive]);

  // Handle video element update when previewStream changes
  useEffect(() => {
    if (previewVideoRef.current && previewStream && cameraActive) {
      previewVideoRef.current.srcObject = previewStream;
      previewVideoRef.current.play().catch(() => {});
    }
  }, [previewStream, cameraActive]);

  // Toggle Camera
  const handleTogglePreviewCamera = () => {
    if (cameraActive) {
      if (previewStream) {
        previewStream.getVideoTracks().forEach(t => t.stop());
      }
      setCameraActive(false);
    } else {
      setCameraActive(true);
    }
  };

  // Toggle Mic
  const handleTogglePreviewMic = () => {
    if (micActive) {
      if (previewStream) {
        previewStream.getAudioTracks().forEach(t => { t.enabled = false; });
      }
      setMicActive(false);
    } else {
      if (previewStream) {
        previewStream.getAudioTracks().forEach(t => { t.enabled = true; });
      }
      setMicActive(true);
    }
  };

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
            // Graceful auto-provisioning for any valid session so student is NEVER blocked
            setSessionData({
              id: activeId,
              title: activeId.startsWith('room-') || activeId.startsWith('cls-') ? 'Hatha Yoga Flow & Mindful Alignment' : 'Live Yoga Session',
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
          setSessionData({
            id: activeId,
            title: activeId.startsWith('room-') || activeId.startsWith('cls-') ? 'Hatha Yoga Flow & Mindful Alignment' : 'Live Yoga Session',
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

    // Stop local preview stream before entering main classroom
    if (previewStream) {
      previewStream.getTracks().forEach(t => t.stop());
    }

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
        autoConnect: true,
        joinedAt: new Date().toISOString()
      };

      localStorage.setItem('nithya_student_session', JSON.stringify(studentSession));
      localStorage.setItem('nithya_student_name', cleanName);
      localStorage.setItem('nithya_student_phone', cleanPhone);
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

      // 4. Enter the live class room in student mode (DIRECT SEAMLESS TRANSITION)
      if (onJoinClass) {
        onJoinClass(res?.class || sessionData, studentSession);
      } else if (onNavigate) {
        onNavigate(`/student/live/${encodeURIComponent(resolvedSessionId || activeId)}`);
      } else {
        window.location.hash = `#/student/live/${encodeURIComponent(resolvedSessionId || activeId)}`;
      }
    } catch (err) {
      setFormError(err.message || 'Error joining class.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A071B] via-[#0E0A26] to-[#070512] text-white flex flex-col justify-center items-center p-4 sm:p-6 font-['Poppins',sans-serif] relative overflow-hidden">
      {/* Background Luxury Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-700/20 via-violet-600/15 to-indigo-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-900/25 rounded-full blur-[140px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-900/25 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#181136]/90 via-[#130E2E]/95 to-[#0b081c]/98 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl my-6 z-10">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
          <button
            type="button"
            onClick={() => {
              if (previewStream) previewStream.getTracks().forEach(t => t.stop());
              if (onNavigate) onNavigate('/');
              else window.location.hash = '#/';
            }}
            className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'ta' ? 'HD வெப்ஆர்டிசி ஸ்டுடியோ' : 'HD WebRTC Studio'}</span>
          </div>
        </div>

        {/* Brand Icon & Heading (Microsoft Fluent Style) */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-2">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <ThreeDLotus size={58} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 tracking-tight">
            NITHYA Live Yoga Studio
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-md">
            {lang === 'ta'
              ? 'நேரலை வகுப்பில் இணைய உங்கள் விவரங்களை உள்ளிட்டு சாதனங்களைச் சரிபார்க்கவும்'
              : 'Interactive Live Yoga Studio — Join certified masters in real-time practice'}
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoadingSession && (
          <div className="text-center py-12 flex flex-col items-center">
            <RefreshCw size={38} className="text-purple-400 animate-spin mb-4" />
            <h3 className="font-bold text-base text-purple-200">
              {lang === 'ta' ? 'நேரலை வகுப்பு சரிபார்க்கப்படுகிறது...' : 'Validating Live Yoga Class Link...'}
            </h3>
            <p className="text-xs text-purple-300/60 mt-1">Negotiating secure connection to NITHYA Studio</p>
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
                : 'The instructor has concluded this live yoga session. Check the schedule for upcoming live sessions.'}
            </p>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('/');
                else window.location.hash = '#/';
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              {lang === 'ta' ? 'முகப்பிற்குச் செல்லவும்' : 'Go to Home'}
            </button>
          </div>
        )}

        {/* ACTIVE CLASS: LUXURY STUDENT JOIN FORM */}
        {!isLoadingSession && !isClassEnded && sessionData && (
          <div>
            {/* Class Info Box (Glass Card) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-violet-950/40 to-indigo-950/60 border border-purple-500/35 mb-5 flex items-center gap-4 shadow-lg backdrop-blur-md">
              <div className="w-13 h-13 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-inner">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-wider uppercase">
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
                <p className="text-xs text-purple-200/80 truncate flex items-center gap-1 mt-0.5">
                  <Crown size={12} className="text-amber-400" />
                  <span>{lang === 'ta' ? 'பயிற்றுநர்:' : 'Instructor:'}</span>
                  <strong className="text-purple-100">{sessionData.instructor || 'NITHYA Master'}</strong>
                </p>
              </div>
            </div>

            {/* Live Camera & Mic Self-Check Mirror (Google Meet / Microsoft Teams Style) */}
            <div className="mb-5 p-3.5 rounded-2xl bg-[#0F0A24] border border-purple-500/30">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                  <Video size={14} className="text-purple-400" />
                  <span>{lang === 'ta' ? 'நேரலை கேமரா சோதனை (Self-Check):' : 'Camera & Audio Check:'}</span>
                </span>
                <span className="text-[10px] text-purple-300/60">
                  {lang === 'ta' ? 'வகுப்பிற்குள் நுழைவதற்கு முன் சரிபார்க்கவும்' : 'Preview before entering room'}
                </span>
              </div>

              {/* Video Preview Box */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 border border-purple-500/25 flex items-center justify-center shadow-inner">
                {cameraActive ? (
                  <video
                    ref={previewVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ transform: 'scaleX(-1)' }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xl font-bold mb-2">
                      {(name || 'Y').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-purple-200">{name || (lang === 'ta' ? 'நீங்கள்' : 'You')}</span>
                    <span className="text-[10px] text-rose-300 font-semibold mt-0.5 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded-full">
                      {lang === 'ta' ? 'கேமரா ஆஃப்' : 'Camera Off'}
                    </span>
                  </div>
                )}

                {/* Bottom Overlay Device Controls */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 z-10">
                  <button
                    type="button"
                    onClick={handleTogglePreviewMic}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      micActive
                        ? 'bg-purple-600/80 hover:bg-purple-600 text-white shadow-md'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                    }`}
                    title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePreviewCamera}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      cameraActive
                        ? 'bg-purple-600/80 hover:bg-purple-600 text-white shadow-md'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                    }`}
                    title={cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
                  >
                    {cameraActive ? <Video size={16} /> : <VideoOff size={16} />}
                  </button>
                </div>
              </div>

              {deviceError && (
                <p className="text-[11px] text-amber-300/80 text-center mt-2">
                  ⚠️ {deviceError}
                </p>
              )}
            </div>

            {/* Form Error Alert */}
            {formError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2.5 text-rose-200 text-xs">
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
                <span className="leading-snug">{formError}</span>
              </div>
            )}

            {/* Student Registration Form */}
            <form onSubmit={handleJoin} className="flex flex-col gap-3">
              <div className="bg-[#120D2C] p-4 rounded-2xl border border-purple-500/25 flex flex-col gap-3">
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
              </div>

              {/* Attendance Tracking Notice */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300/80 flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'ta'
                    ? 'வகுப்பில் நீங்கள் இருக்கும் நேரம் வருகைப் பதிவிற்காகக் (70%+) கணக்கிடப்படும்.'
                    : 'Your live session attendance will be logged automatically for 70%+ certificate verification.'}
                </span>
              </div>

              {/* Luxury CTA Button */}
              <button
                type="submit"
                disabled={isJoining}
                className="w-full mt-2 py-4 px-6 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-purple-600/35 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isJoining ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>{lang === 'ta' ? 'வகுப்பறையுடன் இணைகிறது...' : 'Entering Classroom...'}</span>
                  </>
                ) : (
                  <>
                    <Radio size={18} className="animate-pulse text-purple-200" />
                    <span>{lang === 'ta' ? '🚀 நேரலை யோகா வகுப்பில் இணையுங்கள்' : '🚀 Enter Live Yoga Room'}</span>
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
