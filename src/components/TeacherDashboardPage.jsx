import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Video,
  Radio,
  Share2,
  Copy,
  Check,
  LogOut,
  ArrowRight,
  RefreshCw,
  Users,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
  ExternalLink
} from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function TeacherDashboardPage({ onNavigate, onLaunchLive, lang = 'en' }) {
  const [teacher, setTeacher] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [authError, setAuthError] = useState('');

  // Class Creation State
  const [classTitle, setClassTitle] = useState('Hatha Yoga Flow & Alignment');
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [createdSession, setCreatedSession] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Past / Active Classes
  const [classList, setClassList] = useState([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  // Strict Server-Side Verification on Mount
  useEffect(() => {
    let isMounted = true;

    async function verifyTeacher() {
      const token = localStorage.getItem('nithya_teacher_token') || localStorage.getItem('nithya_admin_token');

      if (!token) {
        if (isMounted) {
          setAuthError(lang === 'ta' ? 'அங்கீகரிக்கப்பட்ட பயிற்றுநர் அனுமதி இல்லை. உள்நுழையவும்.' : 'Unauthorized. Please sign in as a teacher.');
          setIsVerifying(false);
          if (onNavigate) onNavigate('/teacher/login');
        }
        return;
      }

      try {
        const res = await apiFetch('/api/teacher/verify', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (isMounted) {
          if (res && res.ok && res.user) {
            setTeacher(res.user);
            setIsVerifying(false);
            loadClasses();
          } else {
            throw new Error(res?.error || 'Server rejected authorization.');
          }
        }
      } catch (err) {
        console.warn('Teacher authorization rejected by server:', err);
        if (isMounted) {
          // Invalidate stored token if rejected by server
          localStorage.removeItem('nithya_teacher_token');
          localStorage.removeItem('nithya_admin_token');
          setAuthError(err.message || 'Session expired. Please log in again.');
          setIsVerifying(false);
          if (onNavigate) onNavigate('/teacher/login');
        }
      }
    }

    verifyTeacher();
    return () => { isMounted = false; };
  }, []);

  const loadClasses = async () => {
    setIsLoadingClasses(true);
    try {
      const data = await apiFetch('/api/classes');
      if (Array.isArray(data)) {
        setClassList(data);
      }
    } catch (_) {
      // Fallback to locally cached classes
      const cached = JSON.parse(localStorage.getItem('nithya_classes') || '[]');
      setClassList(cached);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const handleCreateLiveClass = async () => {
    setIsCreatingClass(true);
    setCreatedSession(null);
    setCopiedLink(false);

    const token = localStorage.getItem('nithya_teacher_token') || localStorage.getItem('nithya_admin_token');

    try {
      // Call backend protected endpoint
      const res = await apiFetch('/api/teacher/live/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: classTitle.trim() || 'Hatha Yoga Flow & Alignment',
          courseName: 'Master Hatha Yoga Flow',
          durationMinutes: 60
        })
      });

      if (!res || !res.sessionId) {
        throw new Error(res?.error || 'Failed to create live class session.');
      }

      // Generate universal student invite link (compatible with GitHub Pages, Capacitor, and Express)
      const origin = window.location.origin;
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const inviteUrl = `${origin}${pathname}/#/student/join/${res.sessionId}`;

      setCreatedSession({
        sessionId: res.sessionId,
        class: res.class,
        inviteUrl
      });

      loadClasses();
    } catch (err) {
      alert(err.message || 'Failed to create live class.');
    } finally {
      setIsCreatingClass(false);
    }
  };

  const handleCopyLink = async (url) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (_) {
      prompt('Copy student invitation link:', url);
    }
  };

  const handleWhatsAppShare = (url, title) => {
    const text = encodeURIComponent(
      `🧘‍♀️ *NITHYA Yoga Live Class Invitation*\n\n` +
      `You are invited to join a live yoga class: *${title || classTitle}*.\n\n` +
      `🔗 *Tap to Join as Student:*\n${url}\n\n` +
      `Please have your water bottle and yoga mat ready! Namaste 🙏`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async (url, title) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NITHYA Yoga Live Class',
          text: `Join our live yoga class: ${title}`,
          url
        });
      } catch (_) {}
    } else {
      handleCopyLink(url);
    }
  };

  const handleEndClass = async (classId) => {
    if (!confirm(lang === 'ta' ? 'இந்த நேரலை வகுப்பை அனைத்து மாணவர்களுக்கும் முடிக்க வேண்டுமா?' : 'End this live class for all participants?')) {
      return;
    }

    const token = localStorage.getItem('nithya_teacher_token') || localStorage.getItem('nithya_admin_token');

    try {
      await apiFetch(`/api/teacher/classes/${classId}/end`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadClasses();
      if (createdSession && createdSession.sessionId === classId) {
        setCreatedSession(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to end class.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nithya_teacher_token');
    localStorage.removeItem('nithya_admin_token');
    localStorage.removeItem('nithya_active_role');
    if (onNavigate) onNavigate('/teacher/login');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#070514] text-white flex flex-col items-center justify-center p-4">
        <RefreshCw size={36} className="text-purple-400 animate-spin mb-4" />
        <h3 className="text-base font-bold text-purple-200">
          {lang === 'ta' ? 'பயிற்றுநர் அனுமதி சரிபார்க்கப்படுகிறது...' : 'Verifying Teacher Authorization on Server...'}
        </h3>
        <p className="text-xs text-purple-300/50 mt-1">NITHYA Yoga Security Guard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070514] text-white font-['Poppins',sans-serif] p-4 sm:p-6 md:p-8">
      {/* Background glow elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-800/15 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top Navbar */}
        <header className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#181236]/90 to-[#0e0a24]/90 border border-purple-500/30 backdrop-blur-xl shadow-xl flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center shadow-md">
              <span className="text-xl">❀</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white font-['Georgia',serif]">NITHYA Yoga</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] font-black text-purple-300 tracking-wider">
                  TEACHER
                </span>
              </div>
              <p className="text-xs text-purple-300/70">
                {teacher?.name || 'Verified Instructor'} · {teacher?.email || 'teacher@nithyayoga.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/')}
              className="text-xs px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-200 hover:text-white transition-all cursor-pointer"
            >
              {lang === 'ta' ? 'மாணவர் பார்வை' : 'Public App'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>{lang === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
            </button>
          </div>
        </header>

        {/* HERO CARD: Create & Start Live Yoga Class */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-950/90 via-purple-900/90 to-indigo-950/90 border border-purple-400/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3">
                <Radio size={14} className="text-purple-300 animate-pulse" />
                <span>{lang === 'ta' ? 'நேரலை வகுப்பறை கட்டுப்பாடு' : 'EXCLUSIVE INSTRUCTOR PRIVILEGE'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-['Georgia',serif]">
                {lang === 'ta' ? 'புதிய நேரலை யோகா வகுப்பைத் தொடங்குங்கள்' : 'Create & Host Live Yoga Class'}
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                {lang === 'ta'
                  ? 'நீங்கள் வகுப்பைத் தொடங்கியவுடன் தனித்துவமான ரூம் ஐடி உருவாக்கப்பட்டு, மாணவர்களுக்கு பகிரக்கூடிய அழைப்பு லிங்க் உடனடியாக தயாராகும்.'
                  : 'Start a fresh live session with real-time video streaming. A unique student invitation link will be generated automatically.'}
              </p>

              {/* Class Title Input */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="text"
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  placeholder="Class Title (e.g., Hatha Yoga Flow)"
                  className="flex-1 px-4 py-2.5 bg-[#0b081e]/80 border border-purple-500/40 rounded-xl text-white text-xs placeholder-purple-300/30 focus:outline-none focus:border-purple-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCreateLiveClass}
                disabled={isCreatingClass}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-violet-600 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {isCreatingClass ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>{lang === 'ta' ? 'உருவாக்குகிறது...' : 'Creating Room...'}</span>
                  </>
                ) : (
                  <>
                    <Video size={20} />
                    <span>{lang === 'ta' ? '🎥 நேரலை வகுப்பைத் தொடங்கு' : '🎥 Start Live Class as Host'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ACTIVE CREATED SESSION INVITATION CARD (Displayed when teacher creates class) */}
        {createdSession && (
          <section className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1442] to-[#120c2e] border-2 border-purple-400/60 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="font-bold text-lg text-white">
                  {lang === 'ta' ? '🎉 நேரலை வகுப்பு உருவாக்கப்பட்டது!' : '🎉 Live Class Session Active!'}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
                Session ID: {createdSession.sessionId}
              </span>
            </div>

            <p className="text-xs text-purple-200/80 mb-4">
              {lang === 'ta'
                ? 'கீழே உள்ள மாணவர் அழைப்பு லிங்கை மாணவர்களுக்கு வாட்ஸ்அப் அல்லது லிங்க் மூலம் பகிரவும். அவர்கள் நேரடியாக மாணவர் சேர்க்கைப் பக்கத்திற்குச் சென்று இணைவார்கள்.'
                : 'Share this student invitation link with your students. Tapping this link will open the Student Join page directly.'}
            </p>

            {/* Invite Link Box */}
            <div className="p-3 bg-[#0a071c] border border-purple-500/40 rounded-2xl flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-mono text-purple-200 truncate select-all">
                {createdSession.inviteUrl}
              </span>
              <button
                type="button"
                onClick={() => handleCopyLink(createdSession.inviteUrl)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                <span>{copiedLink ? (lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (lang === 'ta' ? 'லிங்க் காப்பி' : 'Copy Link')}</span>
              </button>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleWhatsAppShare(createdSession.inviteUrl, createdSession.class?.title)}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <span>☎ Share on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleNativeShare(createdSession.inviteUrl, createdSession.class?.title)}
                className="py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 size={15} />
                <span>Share Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onLaunchLive) {
                    onLaunchLive(createdSession.class);
                  } else if (onNavigate) {
                    onNavigate(`/teacher/live/${createdSession.sessionId}`);
                  }
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-violet-600/20"
              >
                <span>🚀 Enter Live Room as Host</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
        )}

        {/* Classes Table / List */}
        <section className="p-6 rounded-3xl bg-[#130e2e]/90 border border-purple-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-purple-400" />
              <h3 className="font-bold text-base text-white">
                {lang === 'ta' ? 'யோகா வகுப்புகள் வரலாறு & நேரலை நிலை' : 'Yoga Classes & Session Status'}
              </h3>
            </div>
            <button
              type="button"
              onClick={loadClasses}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} className={isLoadingClasses ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {classList.length === 0 ? (
            <div className="text-center py-8 text-xs text-purple-300/50">
              {lang === 'ta' ? 'வகுப்புகள் எதுவும் பதிவு செய்யப்படவில்லை.' : 'No yoga classes found. Create your first live class above.'}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {classList.slice(0, 8).map((cls) => {
                const isLive = cls.status === 'live';
                const isEnded = cls.status === 'ended';

                return (
                  <div
                    key={cls.id}
                    className="p-4 rounded-2xl bg-[#0b071e]/80 border border-purple-500/20 flex items-center justify-between flex-wrap gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{cls.title || cls.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isLive
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : isEnded
                              ? 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {cls.status || 'scheduled'}
                        </span>
                      </div>
                      <p className="text-xs text-purple-300/60 mt-0.5">
                        Instructor: {cls.instructor || 'NITHYA Master'} · ID: <span className="font-mono">{cls.id}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isLive && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const origin = window.location.origin;
                              const pathname = window.location.pathname.replace(/\/+$/, '');
                              handleCopyLink(`${origin}${pathname}/#/student/join/${cls.id}`);
                            }}
                            className="text-xs px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-200"
                          >
                            Copy Student Link
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onLaunchLive) {
                                onLaunchLive(cls);
                              } else if (onNavigate) {
                                onNavigate(`/teacher/live/${cls.id}`);
                              }
                            }}
                            className="text-xs px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                          >
                            Enter Host Room
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEndClass(cls.id)}
                            className="text-xs px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold"
                          >
                            End Class
                          </button>
                        </>
                      )}

                      {!isLive && (
                        <button
                          type="button"
                          onClick={() => {
                            setClassTitle(cls.title || cls.name || 'Hatha Yoga Flow');
                            handleCreateLiveClass();
                          }}
                          className="text-xs px-3 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900 border border-purple-500/30 text-purple-200"
                        >
                          Start New Session
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
