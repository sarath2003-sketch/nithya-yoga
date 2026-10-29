import React, { useState, useEffect } from 'react';
import { 
  Flower2, 
  Video, 
  FileText, 
  Calendar, 
  Clock, 
  Award, 
  Play, 
  Download, 
  Bell, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  Radio,
  Eye,
  X
} from 'lucide-react';
import { ThreeDLotus, ThreeDBell, ThreeDHeart } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';
import { apiFetch } from '../utils/api';
import { loadStorage } from '../utils/storage';

export default function StudentDashboard({
  user,
  classes = [],
  reminders = [],
  onJoinLiveClass,
  onOpenReminderModal,
  lang = 'en'
}) {
  const [studentSession, setStudentSession] = useState(() => {
    return loadStorage('nithya_student_session', null);
  });
  const [materials, setMaterials] = useState([]);
  const [videos, setVideos] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeNoteModal, setActiveNoteModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const studentName = studentSession?.name || user?.name || 'Yoga Student';
  const studentPhone = studentSession?.phone || user?.phone || '';

  // Fetch materials, videos, and student attendance
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch materials
        try {
          const mats = await apiFetch('/api/materials');
          if (Array.isArray(mats)) setMaterials(mats);
        } catch (_) {}

        // Fetch videos
        try {
          const vids = await apiFetch('/api/videos');
          if (Array.isArray(vids)) setVideos(vids);
        } catch (_) {}

        // Fetch student attendance
        try {
          const att = await apiFetch(`/api/student/attendance?phone=${encodeURIComponent(studentPhone)}`);
          if (Array.isArray(att)) setAttendanceHistory(att);
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentPhone]);

  // Fallback materials if backend has not loaded
  const displayMaterials = materials.length > 0 ? materials : [
    {
      id: 'mat-1',
      title: 'Pranayama & Breathwork Guide',
      category: 'Breathing',
      description: 'Complete guide to Nadi Shodhana and Kapalabhati breathing techniques for nervous balance.',
      content: 'Pranayama breath regulation balances autonomic nervous system and calms the active mind.',
      file_url: 'assets/docs/pranayama_guide.pdf'
    },
    {
      id: 'mat-2',
      title: 'Surya Namaskar Asana Sequences',
      category: 'Asana',
      description: '12 Step Sun Salutation illustrated breakdown with alignment notes and breath cues.',
      content: 'Classical 12-step Surya Namaskar alignment instructions and modifications.',
      file_url: 'assets/docs/surya_namaskar.pdf'
    },
    {
      id: 'mat-3',
      title: 'Sattvic Nutrition & Mindful Diet',
      category: 'Diet',
      description: 'Ayurvedic dietary principles to increase prana, vitality, and mental calmness.',
      content: 'Sattvic eating principles for yoga practitioners: pure, light, nourishing meals.',
      file_url: 'assets/docs/sattvic_diet.pdf'
    }
  ];

  // Fallback videos if backend has not loaded
  const displayVideos = videos.length > 0 ? videos : [
    {
      id: 'vid-1',
      title: 'Morning Prana Flow (Full Session)',
      description: 'Awaken energy channels and release spinal tension with gentle standing flow.',
      video_url: 'https://www.youtube.com/embed/v7AYKMP6rOE',
      thumbnail_url: 'assets/images/class-thumb.jpg',
      duration_minutes: 30,
      level: 'Beginner',
      category: 'Hatha'
    },
    {
      id: 'vid-2',
      title: 'Vinyasa Core Strength & Alignment',
      description: 'Build deep core stamina and steady concentration through dynamic vinyasa flow.',
      video_url: 'https://www.youtube.com/embed/sTANio_2E0Q',
      thumbnail_url: 'assets/images/hero-yoga.jpg',
      duration_minutes: 45,
      level: 'Intermediate',
      category: 'Vinyasa'
    },
    {
      id: 'vid-3',
      title: 'Deep Yin Stillness & Hip Opening',
      description: 'Slow floor poses held for 3-5 minutes for fascial release and meditative peace.',
      video_url: 'https://www.youtube.com/embed/4C-gxOE0j7s',
      thumbnail_url: 'assets/images/chakra-meditation.jpg',
      duration_minutes: 40,
      level: 'All Levels',
      category: 'Yin'
    }
  ];

  // Find currently live class
  const liveClass = classes.find(c => c.status === 'live');

  return (
    <div className="student-dashboard-portal flex flex-col gap-6 max-w-7xl mx-auto ya-reveal pb-12">
      {/* 1. Student Hero Welcome Banner */}
      <div className="dashboard-card student-welcome-banner p-6 bg-gradient-to-r from-teal-900/40 via-emerald-900/30 to-slate-900/60 border border-primary/20 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <ThreeDLotus size={48} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-wider uppercase">
                  {lang === 'ta' ? 'மாணவர் போர்ட்டல்' : 'STUDENT PORTAL'}
                </span>
                <span className="text-xs text-muted">
                  {studentPhone ? `• +91 ${studentPhone}` : ''}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-heading mt-1">
                {lang === 'ta' ? `வணக்கம், ${studentName}!` : `Welcome back, ${studentName}!`}
              </h2>
              <p className="text-xs text-muted mt-0.5 max-w-xl">
                {lang === 'ta' 
                  ? 'உங்கள் தினசரி யோகா அமர்வுகளில் இணையுங்கள், பாடக் குறிப்புகளைப் பதிவிறக்குங்கள் மற்றும் வீடியோக்களைப் பயிற்சி செய்யுங்கள்.' 
                  : 'Join live instructor-led sessions, practice on-demand flows, access class notes, and track your attendance progress.'}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-card border border-subtle text-center min-w-[90px]">
              <span className="text-[10px] text-muted block font-semibold">Classes</span>
              <strong className="text-base text-heading font-extrabold">{user?.classesAttended || attendanceHistory.length || 1}</strong>
            </div>
            <div className="p-3 rounded-xl bg-card border border-subtle text-center min-w-[90px]">
              <span className="text-[10px] text-muted block font-semibold">Attendance</span>
              <strong className="text-base text-primary font-extrabold">{user?.attendanceRate || 85}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Class Alert Banner (if class is live) */}
      {liveClass ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/20 via-primary/20 to-emerald-500/10 border-2 border-red-500/40 flex items-center justify-between flex-wrap gap-3 animate-pulse-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-wide">
                  ● LIVE NOW
                </span>
                <span className="text-xs font-bold text-heading">{liveClass.title || liveClass.name}</span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Instructor is currently streaming live. Tap to enter the studio!
              </p>
            </div>
          </div>

          <button
            type="button"
            className="ya-btn ya-btn--primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            onClick={() => onJoinLiveClass && onJoinLiveClass(liveClass)}
          >
            <Radio size={14} />
            <span>{lang === 'ta' ? 'லைவ் வகுப்பில் இணைக' : 'Join Live Class Now 🧘‍♀️'}</span>
          </button>
        </div>
      ) : null}

      {/* 3. Main Grid: Classes & Videos (Left 2 cols) + Notes & Attendance (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Upcoming Classes & Video Library */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Upcoming Live Classes Card */}
          <div className="dashboard-card p-5 bg-card rounded-2xl border border-subtle">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-subtle">
              <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0">
                <Calendar size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'அட்டவணைப்படுத்தப்பட்ட யோகா வகுப்புகள்' : 'Live Class Schedule'}</span>
              </h3>
              <span className="text-[11px] text-muted">
                {classes.length} {lang === 'ta' ? 'வகுப்புகள்' : 'sessions scheduled'}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {classes.slice(0, 4).map((cls) => {
                const isLive = cls.status === 'live';
                return (
                  <div 
                    key={cls.id}
                    className="p-3.5 rounded-xl border border-subtle bg-subtle/40 hover:bg-subtle/80 transition-all flex items-center justify-between flex-wrap gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-heading m-0">{cls.title || cls.name}</h4>
                        {isLive && (
                          <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] font-bold">
                            ● LIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-primary" />
                          <span>{cls.time || new Date(cls.starts_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                        <span>•</span>
                        <span>{cls.duration || cls.duration_minutes || 60}m</span>
                        <span>•</span>
                        <span className="text-heading font-medium">{cls.instructor || 'NITHYA Master'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        isLive 
                          ? 'bg-red-500 text-white shadow hover:bg-red-600' 
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      }`}
                      onClick={() => onJoinLiveClass && onJoinLiveClass(cls)}
                    >
                      <Play size={12} fill="currentColor" />
                      <span>{isLive ? (lang === 'ta' ? 'இப்போதே இணை' : 'Join Live') : (lang === 'ta' ? 'வகுப்பறை' : 'Enter Class')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Yoga Video Library Card */}
          <div className="dashboard-card p-5 bg-card rounded-2xl border border-subtle">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-subtle">
              <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0">
                <Video size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'சுயபயிற்சி யோகா வீடியோக்கள்' : 'On-Demand Yoga Video Library'}</span>
              </h3>
              <span className="text-[11px] text-muted">
                {displayVideos.length} {lang === 'ta' ? 'பாடங்கள்' : 'lessons available'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {displayVideos.map((vid) => (
                <div 
                  key={vid.id}
                  className="rounded-xl border border-subtle bg-subtle/30 overflow-hidden flex flex-col group hover:border-primary/40 transition-all cursor-pointer"
                  onClick={() => setActiveVideoModal(vid)}
                >
                  <div className="relative aspect-video bg-black/40 overflow-hidden flex items-center justify-center">
                    <img 
                      src={vid.thumbnail_url || 'assets/images/class-thumb.jpg'} 
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 opacity-90"
                      onError={(e) => {
                        e.target.onerror = null;
                        if (!e.target.src.includes('class-thumb.jpg')) {
                          e.target.src = 'assets/images/class-thumb.jpg';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                        <Play size={16} fill="white" className="ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                      {vid.duration_minutes || 30}m
                    </span>
                  </div>

                  <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-primary block uppercase">
                        {vid.category || 'Yoga'} • {vid.level || 'All Levels'}
                      </span>
                      <h4 className="text-xs font-bold text-heading line-clamp-1 mt-0.5">
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-muted line-clamp-2 mt-1">
                        {vid.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="text-xs text-primary font-bold flex items-center gap-1 hover:underline pt-1"
                    >
                      <span>{lang === 'ta' ? 'வீடியோவைப் பார்' : 'Watch Session'}</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Permitted Learning Materials & Attendance History */}
        <div className="flex flex-col gap-6">
          {/* Permitted Yoga Notes & PDF Downloads Card */}
          <div className="dashboard-card p-5 bg-card rounded-2xl border border-subtle">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-subtle">
              <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0">
                <FileText size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'பாடக் குறிப்புகள் & PDF' : 'Yoga Notes & PDF Guides'}</span>
              </h3>
              <span className="text-[11px] text-muted">
                {displayMaterials.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {displayMaterials.map((mat) => (
                <div 
                  key={mat.id}
                  className="p-3 rounded-xl border border-subtle bg-subtle/30 flex items-start justify-between gap-2 hover:bg-subtle/60 transition-all"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                      <BookOpen size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-heading m-0 leading-tight">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-muted line-clamp-2 mt-1">
                        {mat.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ya-btn ya-btn--soft text-[11px] px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                    onClick={() => setActiveNoteModal(mat)}
                    title="Read Note"
                  >
                    <Eye size={12} />
                    <span>{lang === 'ta' ? 'படி' : 'Read'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Student Verified Attendance History Card */}
          <div className="dashboard-card p-5 bg-card rounded-2xl border border-subtle">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-subtle">
              <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0">
                <Award size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'எனது வருகைப் பதிவு' : 'My Attendance History'}</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                ✓ Verified
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {attendanceHistory.length === 0 ? (
                <div className="text-center p-4 text-xs text-muted">
                  {lang === 'ta' 
                    ? 'நேரலை வகுப்பில் 70%+ கலந்துகொள்ளும்போது உங்கள் வருகைப் பதிவு இங்கே காட்டப்படும்.' 
                    : 'Attend live classes for 70%+ duration to log your verified attendance records here.'}
                </div>
              ) : (
                attendanceHistory.map((att, idx) => {
                  const isPresent = att.status?.includes('70') || att.attendancePercent >= 70;
                  return (
                    <div 
                      key={att.id || idx}
                      className="p-2.5 rounded-xl border border-subtle bg-subtle/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-heading block">{att.classTitle || 'Hatha Yoga Flow'}</strong>
                        <span className="text-[10px] text-muted font-mono">
                          {att.joinedAt ? new Date(att.joinedAt).toLocaleDateString() : 'Recent'} • {Math.round((att.durationSeconds || 3600) / 60)} mins
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPresent 
                          ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' 
                          : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                      }`}>
                        {isPresent ? '✓ Present (70%+)' : 'Incomplete'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="modal-backdrop-scrim ya-reveal z-50 flex items-center justify-center p-4" onClick={() => setActiveVideoModal(null)}>
          <div className="modal-bottom-sheet max-w-2xl w-full bg-card rounded-2xl p-5 shadow-2xl border border-subtle" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-subtle">
              <div>
                <h3 className="text-sm font-bold text-heading m-0">{activeVideoModal.title}</h3>
                <span className="text-[11px] text-muted">{activeVideoModal.category} • {activeVideoModal.level}</span>
              </div>
              <button 
                type="button" 
                className="text-muted hover:text-heading cursor-pointer p-1"
                onClick={() => setActiveVideoModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-3">
              <iframe
                src={activeVideoModal.video_url}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {activeVideoModal.description}
            </p>
          </div>
        </div>
      )}

      {/* Note & PDF Document Reader Modal */}
      {activeNoteModal && (
        <div className="modal-backdrop-scrim ya-reveal z-50 flex items-center justify-center p-4 fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setActiveNoteModal(null)}>
          <div className="modal-bottom-sheet max-w-xl w-full bg-card rounded-3xl p-6 shadow-2xl border border-subtle max-h-[90vh] flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-heading m-0">{activeNoteModal.title}</h3>
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{activeNoteModal.category || 'Yoga'}</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="text-muted hover:text-heading cursor-pointer p-1 rounded-full hover:bg-subtle/50 transition-colors"
                  onClick={() => setActiveNoteModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Note Content / Overview */}
              <div className="p-4 rounded-2xl bg-subtle/40 text-xs text-heading leading-relaxed mb-4 border border-subtle overflow-y-auto max-h-48">
                <p className="font-semibold text-primary mb-2">
                  {lang === 'ta' ? 'பாடக் குறிப்புகள் & வழிகாட்டுதல்:' : 'Learning Notes & Practice Breakdown:'}
                </p>
                {activeNoteModal.content || activeNoteModal.description}
              </div>

              {/* Embedded Document / PDF Details */}
              {activeNoteModal.file_url && (
                <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={18} className="text-primary shrink-0" />
                    <div className="truncate">
                      <strong className="text-xs text-heading block truncate">
                        {activeNoteModal.file_url.split('/').pop() || 'guide.pdf'}
                      </strong>
                      <span className="text-[11px] text-muted block">
                        PDF Document • Official NITHYA Yoga Guide
                      </span>
                    </div>
                  </div>
                  <a
                    href={activeNoteModal.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ya-btn ya-btn--soft text-xs px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5 font-bold"
                  >
                    <ExternalLink size={13} />
                    <span>{lang === 'ta' ? 'திறக்க' : 'Open PDF'}</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-subtle gap-2">
              <span>{lang === 'ta' ? 'பிரிவு:' : 'Category:'} <strong className="text-heading">{activeNoteModal.category || 'Yoga'}</strong></span>
              
              <div className="flex items-center gap-2">
                {activeNoteModal.file_url && (
                  <a
                    href={activeNoteModal.file_url}
                    download={activeNoteModal.file_url.split('/').pop() || 'nithya_yoga_guide.pdf'}
                    className="ya-btn ya-btn--primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20"
                  >
                    <Download size={13} />
                    <span>{lang === 'ta' ? 'PDF பதிவிறக்கு' : 'Download PDF'}</span>
                  </a>
                )}
                <button
                  type="button"
                  className="ya-btn ya-btn--soft px-3 py-1.5 rounded-xl text-xs"
                  onClick={() => setActiveNoteModal(null)}
                >
                  {lang === 'ta' ? 'மூடு' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
