import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Plus, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Settings, 
  Send, 
  Pause, 
  Play, 
  Users, 
  MessageSquare,
  LogOut,
  ExternalLink,
  CheckCircle,
  Calendar,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { getProductionLiveUrl } from '../utils/api';
import LiveYogaClassRoom from './LiveYogaClassRoom';

export default function LiveClassStudio({
  activeClass,
  onLeaveClass,
  onRecordAttendance,
  onScheduleClass,
  onOpenFullStudio,
  lang = 'en'
}) {
  const [isLiveKitActive, setIsLiveKitActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [attendanceVerified, setAttendanceVerified] = useState(false);
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  
  // Teacher Class Scheduling State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('Morning Yoga Flow');
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassInstructor, setNewClassInstructor] = useState('NITHYA Master');
  const [newClassTime, setNewClassTime] = useState('07:00 AM');
  const [newClassDate, setNewClassDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newMeetUrl, setNewMeetUrl] = useState('https://meet.google.com/new');
  const [newClassDuration, setNewClassDuration] = useState('60');

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: activeClass?.instructor || 'NITHYA Master', 
      text: lang === 'ta' ? 'அனைவருக்கும் நல்வரவு! யோகா பாயை விரித்து அமரவும். 🧘‍♀️' : 'Welcome everyone! Unroll your mat and sit comfortably. 🧘‍♀️', 
      time: 'Just now' 
    }
  ]);

  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic participants roster
  const [participants, setParticipants] = useState(() => {
    const host = { id: 1, name: `${activeClass?.instructor || 'NITHYA Master'} (${lang === 'ta' ? 'பயிற்றுநர்' : 'Instructor'})`, role: 'Host', isHost: true };
    try {
      const stored = localStorage.getItem('nithya_live_participants');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validStudents = parsed.filter(p => p && p.name && !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram'].includes(p.name));
          return [host, ...validStudents];
        }
      }
    } catch (_) {}
    return [host];
  });

  // Listen for participant updates across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'nithya_live_participants') {
        try {
          const parsed = JSON.parse(e.newValue || '[]');
          const host = { id: 1, name: `${activeClass?.instructor || 'NITHYA Master'} (${lang === 'ta' ? 'பயிற்றுநர்' : 'Instructor'})`, role: 'Host', isHost: true };
          setParticipants([host, ...parsed]);
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [activeClass, lang]);

  // Timer effect for active session
  useEffect(() => {
    let interval = null;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLaunchGoogleMeet = () => {
    setIsSessionActive(true);
    const meetUrl = activeClass?.meetUrl || 'https://meet.google.com/new';
    window.open(meetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLiveLink = () => {
    const link = getProductionLiveUrl(activeClass?.id || 'cls-1');
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      prompt('Copy class link:', link);
    });
  };

  const handleWhatsAppShare = () => {
    const link = getProductionLiveUrl(activeClass?.id || 'cls-1');
    const text = encodeURIComponent(
      lang === 'ta'
        ? `வணக்கம்! NITHYA யோகா நேரலை வகுப்பில் இணையுங்கள்: ${activeClass?.title || activeClass?.name || 'Live Class'}\nஇணைய இந்த லிங்க்கை கிளிக் செய்யவும்: ${link}`
        : `Namaste! Join NITHYA Live Yoga Class: ${activeClass?.title || activeClass?.name || 'Live Class'}\nClick to join: ${link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleVerifyAttendance = () => {
    const studentSession = (() => {
      try { return JSON.parse(localStorage.getItem('nithya_student_session') || '{}'); } catch (_) { return {}; }
    })();
    const studentName = studentSession.name || localStorage.getItem('nithya_student_name') || 'Student';
    
    if (onRecordAttendance) {
      onRecordAttendance({
        id: `att-${Date.now()}`,
        studentName,
        classId: activeClass?.id || 'cls-1',
        className: activeClass?.title || activeClass?.name || 'Hatha Yoga',
        instructor: activeClass?.instructor || 'NITHYA Master',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: minutesSpent,
        status: minutesSpent >= 1 ? 'Verified (Present)' : 'Verified',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'You',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!newClassTitle.trim()) return;

    const newClass = {
      id: `cls-${Date.now()}`,
      name: newClassTitle.trim(),
      title: newClassTitle.trim(),
      courseName: newCourseName.trim(),
      course_name: newCourseName.trim(),
      instructor: newClassInstructor.trim(),
      duration: parseInt(newClassDuration, 10) || 60,
      level: 'All Levels',
      time: newClassTime,
      date: newClassDate,
      meetUrl: newMeetUrl.trim() || 'https://meet.google.com/new',
      description: 'Scheduled live yoga session.',
      attended: false,
      category: 'Beginner'
    };

    if (onScheduleClass) {
      onScheduleClass(newClass);
    }
    setShowScheduleModal(false);
    setNewClassTitle('');
  };

  const handleLeave = () => {
    setIsSessionActive(false);
    if (onLeaveClass) onLeaveClass();
  };

  if (isLiveKitActive) {
    return (
      <div className="dashboard-card live-class-card p-0 overflow-hidden ya-reveal">
        <LiveYogaClassRoom
          activeClass={activeClass}
          user={{
            name: isTeacherMode ? (activeClass?.instructor || 'NITHYA Master') : (user?.name || 'Yoga Student'),
            role: isTeacherMode ? 'instructor' : 'student'
          }}
          onLeaveClass={() => {
            setIsLiveKitActive(false);
            if (onLeaveClass) onLeaveClass();
          }}
          onRecordAttendance={onRecordAttendance}
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-card live-class-card">
      {/* Header */}
      <div className="card-header-row live-header-row">
        <div className="live-title-group">
          <span className="live-pulse-icon">((•))</span>
          <h3 className="card-title-main">
            <span>{lang === 'ta' ? 'லைவ் வகுப்பு ஸ்டுடியோ' : 'Live Class Studio'}</span>
          </h3>
        </div>

        <div className="live-header-actions flex items-center gap-2">
          {/* Mode Badge / Switch */}
          <button
            type="button"
            className={`btn-mode-toggle text-xs px-2 py-1 rounded-full ${isTeacherMode ? 'bg-purple text-white' : 'bg-subtle text-muted'}`}
            onClick={() => setIsTeacherMode(!isTeacherMode)}
            title="Switch Teacher / Student Mode"
          >
            {isTeacherMode ? '👨‍🏫 Teacher Mode' : '🧘 Student Mode'}
          </button>

          <span className="live-status-badge">
            <span className="green-dot-pulse">●</span>
            <span>Live</span>
          </span>

          {isTeacherMode && (
            <button 
              type="button" 
              className="btn-icon-square" 
              title="Schedule New Class"
              onClick={() => setShowScheduleModal(true)}
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Video Screen Feed & LiveKit Launcher */}
      <div className="live-video-screen relative">
        <img 
          src="assets/images/live-class.jpg" 
          alt="Live Yoga Stream" 
          className="live-video-bg-img" 
        />
        
        {/* Top-Right Timer */}
        <div className="video-timer-badge">
          <span>{formatTimer(sessionSeconds)}</span>
          <span className="red-record-dot">🔴</span>
        </div>

        {/* Top-Left Active Class Meta */}
        <div className="video-class-meta-overlay">
          <span className="class-course-tag inline-block px-2 py-0.5 mb-1 rounded-full bg-violet-500/30 text-violet-200 border border-violet-400/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
            {activeClass?.courseName || activeClass?.course_name || 'Morning Yoga Flow'}
          </span>
          <span className="class-name-tag block font-bold text-sm text-white">{activeClass?.title || activeClass?.name || 'Hatha Yoga Flow'}</span>
          <span className="class-teacher-tag text-xs text-white/80">by {activeClass?.instructor || 'NITHYA Master'}</span>
        </div>

        {/* Center LiveKit Quick Launcher Button */}
        <div className="video-center-launcher-box">
          <button
            type="button"
            className="btn-launch-meet-gold ya-btn ya-ripple mb-2"
            onClick={() => {
              if (onOpenFullStudio) {
                onOpenFullStudio();
              } else {
                setIsLiveKitActive(true);
              }
            }}
          >
            <Radio size={16} />
            <span>{lang === 'ta' ? 'HD நேரலை யோகா ஸ்டுடியோ 🧘‍♀️' : 'Enter HD Live Studio 🧘‍♀️'}</span>
          </button>

          <button
            type="button"
            className="btn-launch-google-meet-prominent ya-btn ya-ripple mb-2"
            onClick={handleLaunchGoogleMeet}
          >
            <ExternalLink size={14} />
            <span>{lang === 'ta' ? 'Google Meet மூலம் இணைக 📹' : 'Join via Google Meet 📹'}</span>
          </button>

          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur flex items-center gap-1 cursor-pointer transition-all border border-white/20 shadow-sm"
              onClick={handleCopyLiveLink}
              title="Copy Live Class Join Link"
            >
              <span>{copiedLink ? (lang === 'ta' ? '✓ நகலெடுக்கப்பட்டது' : '✓ Copied') : (lang === 'ta' ? '🔗 லிங்க் நகலெடு' : '🔗 Copy Link')}</span>
            </button>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold backdrop-blur flex items-center gap-1 cursor-pointer transition-all shadow-sm"
              onClick={handleWhatsAppShare}
              title="Share Live Class via WhatsApp"
            >
              <span>📲 WhatsApp</span>
            </button>
          </div>
          
          {isSessionActive && !attendanceVerified && (
            <button
              type="button"
              className="btn-verify-attendance-green mt-2"
              onClick={handleVerifyAttendance}
            >
              <ShieldCheck size={15} />
              <span>{lang === 'ta' ? 'வருகையை சரிபார்க்கவும் ✓' : 'Verify Attendance ✓'}</span>
            </button>
          )}

          {attendanceVerified && (
            <div className="attendance-verified-chip mt-2">
              <CheckCircle size={14} />
              <span>{lang === 'ta' ? 'வருகை பதிவு செய்யப்பட்டது ✓' : 'Attendance Verified & Logged ✓'}</span>
            </div>
          )}
        </div>

        {/* Video Control Bar */}
        <div className="video-bottom-controls-bar">
          <div className="controls-left-icons">
            <button 
              type="button" 
              className="ctrl-btn"
              onClick={() => setIsSessionActive(!isSessionActive)}
              title={isSessionActive ? "Pause Timer" : "Start Timer"}
            >
              {isSessionActive ? <Pause size={15} /> : <Play size={15} />}
            </button>

            <button 
              type="button" 
              className={`ctrl-btn ${!isMicOn ? 'muted' : ''}`}
              onClick={() => setIsMicOn(!isMicOn)}
              title="Toggle Mic"
            >
              {isMicOn ? <Mic size={15} /> : <MicOff size={15} />}
            </button>

            <button 
              type="button" 
              className={`ctrl-btn ${!isVideoOn ? 'muted' : ''}`}
              onClick={() => setIsVideoOn(!isVideoOn)}
              title="Toggle Video"
            >
              {isVideoOn ? <VideoIcon size={15} /> : <VideoOff size={15} />}
            </button>

            <button 
              type="button" 
              className="ctrl-btn" 
              title="Google Meet Link"
              onClick={() => window.open(activeClass?.meetUrl || 'https://meet.google.com/new', '_blank')}
            >
              <ExternalLink size={15} />
            </button>
          </div>

          <button 
            type="button" 
            className="btn-leave-class-pill"
            onClick={handleLeave}
          >
            {lang === 'ta' ? 'வெளியேறு' : 'Leave Class'}
          </button>
        </div>
      </div>

      {/* Honest Technical Integration Notice */}
      <div className="meet-tech-notice-bar text-xs text-muted p-2 bg-subtle rounded mt-2 flex items-center gap-1">
        <span>ℹ️</span>
        <span>
          {lang === 'ta' 
            ? 'பாதுகாப்புக் காரணங்களால் Google Meet பிரத்யேக சாளரத்தில் திறக்கும். உங்கள் வருகை மற்றும் நேரம் இங்கே துல்லியமாகப் பதியப்படும்.' 
            : 'For security (CSP policy), Google Meet opens securely in a dedicated window while attendance and practice time are verified here.'}
        </span>
      </div>

      {/* Split Below Video: Participants (Left) + Chat (Right) */}
      <div className="live-split-footer">
        {/* Participants Column */}
        <div className="participants-col">
          <div className="split-col-header">
            <h4>{lang === 'ta' ? `பங்கேற்பாளர்கள் (${participants.length})` : `Participants (${participants.length})`}</h4>
          </div>
          <div className="participants-list-scroll">
            {participants.map(p => (
              <div key={p.id} className="participant-item-row">
                <div className="participant-info">
                  <span className="participant-name">{p.name}</span>
                </div>
                <span className="online-green-indicator">●</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Column */}
        <div className="chat-col">
          <div className="split-col-header">
            <h4>{lang === 'ta' ? 'நேரலை அரட்டை' : 'Live Chat'}</h4>
          </div>

          <div className="chat-messages-scroll">
            {messages.map(m => (
              <div key={m.id} className="chat-message-bubble">
                <span className="chat-sender-name">{m.sender}:</span>
                <span className="chat-text-content">{m.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form-bar">
            <input
              type="text"
              placeholder={lang === 'ta' ? 'செய்தியைத் தட்டச்சு செய்க...' : 'Type a message...'}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" aria-label="Send">
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Teacher Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop-scrim" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle"></div>
            <div className="modal-header-bar">
              <h3 className="modal-title-bold">
                {lang === 'ta' ? 'புதிய யோகா வகுப்பு திட்டமிடுக' : 'Schedule New Live Class (Teacher)'}
              </h3>
              <button type="button" className="btn-modal-close" onClick={() => setShowScheduleModal(false)}>✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="modal-form-flow">
              <div className="form-field-unit">
                <label>{lang === 'ta' ? 'பாடத்திட்டம் / பயிற்சி வகை (Course Name):' : 'Course Name:'}</label>
                <select
                  className="form-input"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                >
                  <option value="Morning Yoga Flow">Morning Yoga Flow</option>
                  <option value="Pranayama & Meditation">Pranayama & Meditation</option>
                  <option value="Ashtanga Yoga Basics">Ashtanga Yoga Basics</option>
                  <option value="Evening Relaxation Yoga">Evening Relaxation Yoga</option>
                  <option value="Stress Relief Yoga">Stress Relief Yoga</option>
                </select>
              </div>

              <div className="form-field-unit">
                <label>{lang === 'ta' ? 'வகுப்பு தலைப்பு:' : 'Class Title:'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Morning Vinyasa Flow"
                  value={newClassTitle}
                  onChange={(e) => setNewClassTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-field-unit">
                  <label>{lang === 'ta' ? 'ஆசிரியர் பெயர்:' : 'Instructor Name:'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newClassInstructor}
                    onChange={(e) => setNewClassInstructor(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field-unit">
                  <label>{lang === 'ta' ? 'நேரம்:' : 'Time:'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newClassTime}
                    onChange={(e) => setNewClassTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-unit">
                <label>Google Meet Link:</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={newMeetUrl}
                  onChange={(e) => setNewMeetUrl(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowScheduleModal(false)}>
                  {lang === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button type="submit" className="btn-modal-save">
                  {lang === 'ta' ? 'வகுப்பு உருவாக்குக' : 'Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
