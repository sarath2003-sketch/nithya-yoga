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
  Sparkles
} from 'lucide-react';
import { apiFetch } from '../utils/api';

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

  // Validate session on backend on mount
  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      if (!resolvedSessionId) {
        if (isMounted) {
          setSessionError(lang === 'ta' ? 'செல்லுபடியாகும் நேரலை அமர்வு ஐடி கிடைக்கவில்லை.' : 'No live session ID specified in the link.');
          setIsLoadingSession(false);
        }
        return;
      }

      setIsLoadingSession(true);
      setSessionError('');
      setIsClassEnded(false);

      try {
        const res = await apiFetch(`/api/live/session/${encodeURIComponent(resolvedSessionId)}`);

        if (isMounted) {
          if (res && res.exists && res.class) {
            setSessionData(res.class);
            if (res.status === 'ended' || res.ended) {
              setIsClassEnded(true);
            }
          } else {
            setSessionError(res?.error || (lang === 'ta' ? 'நேரலை வகுப்பு காணப்படவில்லை அல்லது காலாவதியானது.' : 'Live session not found or link is invalid.'));
          }
        }
      } catch (err) {
        console.warn('Session verification failed:', err);
        if (isMounted) {
          setSessionError(err.message || (lang === 'ta' ? 'அமர்வை சரிபார்க்க முடியவில்லை.' : 'Failed to verify live class session.'));
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
    e.preventDefault();
    setFormError('');

    const cleanName = name.trim().replace(/\s+/g, ' ');
    const cleanPhone = phone.replace(/[^\d+]/g, '');

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
      // 1. Submit join request to server
      const res = await apiFetch('/api/student/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: resolvedSessionId,
          name: cleanName,
          phone: cleanPhone
        })
      });

      if (!res || !res.allowed) {
        if (res?.ended) {
          setIsClassEnded(true);
          throw new Error(lang === 'ta' ? 'இந்த யோகா வகுப்பு முடிந்துவிட்டது.' : 'This yoga class has already ended.');
        }
        throw new Error(res?.error || 'Unable to join live class.');
      }

      // 2. Save student session locally
      const studentSession = {
        name: cleanName,
        phone: cleanPhone,
        role: 'student',
        sessionId: resolvedSessionId,
        micActive,
        cameraActive,
        joinedAt: new Date().toISOString()
      };

      localStorage.setItem('nithya_student_session', JSON.stringify(studentSession));
      localStorage.setItem('nithya_student_name', cleanName);
      localStorage.setItem('nithya_student_phone', cleanPhone);
      localStorage.setItem('nithya_active_role', 'student');

      // CRITICAL SECURITY: Discard any teacher token so student cannot masquerade as instructor
      localStorage.removeItem('nithya_teacher_token');
      localStorage.removeItem('nithya_admin_token');

      // 3. Enter the live class room in student mode
      if (onJoinClass) {
        onJoinClass(res.class || sessionData, studentSession);
      } else if (onNavigate) {
        onNavigate(`/student/live/${resolvedSessionId}`);
      }
    } catch (err) {
      setFormError(err.message || 'Error joining class.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070514] text-white flex flex-col justify-center items-center p-4 sm:p-6 font-['Poppins',sans-serif]">
      {/* Background glow elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-800/15 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#181236]/90 to-[#0e0a24]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
            <Radio size={13} className="text-indigo-400" />
            <span>{lang === 'ta' ? 'மாணவர் நேரலை இணைப்பு' : 'Student Live Join'}</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoadingSession && (
          <div className="text-center py-12 flex flex-col items-center">
            <RefreshCw size={36} className="text-purple-400 animate-spin mb-4" />
            <h3 className="font-bold text-base text-purple-200">
              {lang === 'ta' ? 'நேரலை வகுப்பு சரிபார்க்கப்படுகிறது...' : 'Validating Live Yoga Class Link...'}
            </h3>
            <p className="text-xs text-purple-300/50 mt-1">Connecting to NITHYA Yoga Studio</p>
          </div>
        )}

        {/* INVALID LINK STATE */}
        {!isLoadingSession && sessionError && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ta' ? 'செல்லுபடியாகாத இணைப்பு' : 'Invalid Live Class Link'}
            </h3>
            <p className="text-xs text-purple-200/70 max-w-sm mx-auto leading-relaxed mb-6">
              {sessionError}
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {lang === 'ta' ? 'முகப்பிற்குச் செல்லவும்' : 'Return to Home'}
            </button>
          </div>
        )}

        {/* CLASS ENDED STATE */}
        {!isLoadingSession && !sessionError && isClassEnded && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ta' ? 'நேரலை வகுப்பு முடிந்துவிட்டது' : 'Live Class Has Ended'}
            </h3>
            <p className="text-xs text-purple-200/70 max-w-sm mx-auto leading-relaxed mb-6">
              {lang === 'ta'
                ? 'பயிற்றுநர் இந்த யோகா வகுப்பை முடித்துவிட்டார். புதிய நேரலை வகுப்புகளுக்கு உங்கள் டாஷ்போர்டைப் பார்க்கவும்.'
                : 'The instructor has concluded this live yoga session. Thank you for your practice. Check the schedule for upcoming classes.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {lang === 'ta' ? 'முகப்பிற்குச் செல்லவும்' : 'Go to Home'}
            </button>
          </div>
        )}

        {/* ACTIVE CLASS: STUDENT JOIN FORM */}
        {!isLoadingSession && !sessionError && !isClassEnded && sessionData && (
          <div>
            {/* Class Info Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-black tracking-wider text-purple-300">
                  {lang === 'ta' ? 'நேரலை யோகா வகுப்பு' : 'LIVE YOGA CLASS'}
                </span>
                <h3 className="font-bold text-base text-white truncate">
                  {sessionData.title || sessionData.name || 'Hatha Yoga Flow'}
                </h3>
                <p className="text-xs text-purple-200/70 truncate">
                  Instructor: <strong>{sessionData.instructor || 'NITHYA Master'}</strong>
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

            {/* Student Registration & Join Form */}
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                  {lang === 'ta' ? 'உங்கள் பெயர்' : 'Your Full Name'}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Priya Sundar"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                  {lang === 'ta' ? 'மொபைல் எண் (10 இலக்கம்)' : 'Mobile Phone Number (10 Digits)'}
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Pre-Join Device Checks */}
              <div className="flex items-center justify-center gap-3 py-2">
                <button
                  type="button"
                  onClick={() => setMicActive(!micActive)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    micActive
                      ? 'bg-purple-900/40 border-purple-400/50 text-purple-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {micActive ? <Mic size={14} /> : <MicOff size={14} />}
                  <span>{micActive ? 'Mic Ready' : 'Mic Muted'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    cameraActive
                      ? 'bg-purple-900/40 border-purple-400/50 text-purple-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {cameraActive ? <Video size={14} /> : <VideoOff size={14} />}
                  <span>{cameraActive ? 'Camera Ready' : 'Camera Off'}</span>
                </button>
              </div>

              {/* Join CTA */}
              <button
                type="submit"
                disabled={isJoining}
                className="w-full mt-2 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isJoining ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>{lang === 'ta' ? 'இணைகிறது...' : 'Entering Classroom...'}</span>
                  </>
                ) : (
                  <>
                    <Radio size={18} className="animate-pulse" />
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
