import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  CheckCircle, 
  ShieldCheck, 
  Copy, 
  Crown, 
  User, 
  Clock, 
  Calendar, 
  PhoneOff, 
  AlertCircle,
  ExternalLink,
  Share2
} from 'lucide-react';
import { getProductionLiveUrl, apiFetch } from '../utils/api';
import LotusMark from './LotusMark';

export default function LiveClassStudio({
  activeClass,
  user,
  showToast,
  onLeaveClass,
  onRecordAttendance,
  onScheduleClass,
  onOpenFullStudio,
  lang = 'en'
}) {
  // Determine if current user is an authorized instructor/trainer
  const isInstructorRole = Boolean(
    user?.role === 'trainer' || 
    user?.role === 'instructor' || 
    user?.isInstructor || 
    (typeof localStorage !== 'undefined' && Boolean(localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token')))
  );

  // Flow states: 'idle' | 'starting' | 'live' | 'ended'
  const [sessionStatus, setSessionStatus] = useState(() => {
    if (activeClass?.status === 'live') return 'live';
    if (activeClass?.status === 'ended') return 'ended';
    return 'idle';
  });

  const [isStartingSession, setIsStartingSession] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [attendanceVerified, setAttendanceVerified] = useState(false);

  // Sync actual status with backend API / LiveKit state
  useEffect(() => {
    let isMounted = true;
    const syncServerStatus = async () => {
      if (!activeClass?.id) return;
      try {
        const cls = await apiFetch(`/api/classes/${activeClass.id}`);
        if (!isMounted) return;
        if (cls && cls.status) {
          if (cls.status === 'live') {
            setSessionStatus('live');
          } else if (cls.status === 'ended') {
            setSessionStatus('ended');
          } else if (!isStartingSession) {
            setSessionStatus('idle');
          }
        }
      } catch (_) {
        // Fallback gracefully in offline / static environments
      }
    };

    syncServerStatus();
    const interval = setInterval(syncServerStatus, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeClass?.id, isStartingSession]);

  // Session elapsed timer when live
  useEffect(() => {
    let interval = null;
    if (sessionStatus === 'live') {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Instructor initiates live session
  const handleStartLiveClass = async () => {
    if (!isInstructorRole) return;
    if (isStartingSession || sessionStatus === 'live') return;

    setIsStartingSession(true);
    setSessionStatus('starting');
    try {
      const adminToken = localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token');
      if (!adminToken) {
        throw new Error(lang === 'ta'
          ? 'பயிற்றுநர் உள்நுழைவு இல்லை. முதலில் அங்கீகரிக்கப்பட்ட பயிற்றுநராக உள்நுழையவும்.'
          : 'Instructor session missing. Please sign in with an authorized instructor account.');
      }

      // apiFetch returns parsed JSON and throws for HTTP/network errors.
      // Never mark a class live when the backend request fails.
      await apiFetch(`/api/trainer/classes/${activeClass?.id || 'cls-1'}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      setSessionStatus('live');
      setSessionSeconds(0);
      if (showToast) {
        showToast(
          lang === 'ta' ? 'வகுப்பு தொடங்கியது!' : 'Live Class Started!',
          lang === 'ta' ? 'சர்வர் வகுப்பைத் தொடங்கியதை உறுதிப்படுத்தியது.' : 'The server confirmed the class started.',
          'success'
        );
      }
    } catch (err) {
      setSessionStatus('idle');
      if (showToast) {
        showToast(
          lang === 'ta' ? 'நேரலை தொடங்கவில்லை' : 'Could Not Start Live Class',
          err?.message || (lang === 'ta' ? 'சர்வரைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.' : 'Check the backend connection and try again.'),
          'error'
        );
      }
    } finally {
      setIsStartingSession(false);
    }
  };

  // Instructor ends live session
  const handleEndLiveClass = async () => {
    if (sessionStatus === 'ended') return;
    try {
      const adminToken = localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token');
      if (!adminToken) {
        throw new Error(lang === 'ta' ? 'பயிற்றுநர் உள்நுழைவு இல்லை.' : 'Instructor session missing.');
      }
      await apiFetch(`/api/trainer/classes/${activeClass?.id || 'cls-1'}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      setSessionStatus('ended');
      if (showToast) {
        showToast(
          lang === 'ta' ? 'வகுப்பு முடிந்தது' : 'Class Ended',
          lang === 'ta' ? 'சர்வர் வகுப்பை முடித்ததை உறுதிப்படுத்தியது.' : 'The server confirmed the class ended.',
          'info'
        );
      }
      if (onLeaveClass) onLeaveClass();
    } catch (err) {
      if (showToast) {
        showToast(
          lang === 'ta' ? 'வகுப்பை முடிக்க முடியவில்லை' : 'Could Not End Class',
          err?.message || (lang === 'ta' ? 'மீண்டும் முயற்சிக்கவும்.' : 'Please try again.'),
          'error'
        );
      }
    }
  };

  const handleResetSession = () => {
    setSessionStatus('idle');
    setSessionSeconds(0);
  };

  // Student invitation link (guaranteed student role only, zero instructor tokens)
  const studentInviteUrl = getProductionLiveUrl(activeClass?.id || 'cls-1', { join: 'student' });

  const handleCopyLiveLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(studentInviteUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        if (showToast) {
          showToast(lang === 'ta' ? 'லிங்க் நகலெடுக்கப்பட்டது ✓' : 'Link Copied ✓', studentInviteUrl, 'success');
        }
      }).catch(() => {
        prompt('Student Join Link:', studentInviteUrl);
      });
    } else {
      prompt('Student Join Link:', studentInviteUrl);
    }
  };

  const handleWhatsAppShare = () => {
    const className = activeClass?.title || activeClass?.name || 'Live Yoga Class';
    const text = encodeURIComponent(
      lang === 'ta'
        ? `🧘‍♀️ NITHYA Yoga ${sessionStatus === 'live' ? 'நேரலை வகுப்பு தொடங்கப்பட்டது!' : 'வகுப்பு இணைப்பு'}\nவகுப்பு: ${className}\nபயிற்றுநர்: ${activeClass?.instructor || 'NITHYA Master'}\n\nமாணவர்கள் இணைய இந்த லிங்க்கை பயன்படுத்தவும்:\n${studentInviteUrl}`
        : `🧘‍♀️ NITHYA Yoga ${sessionStatus === 'live' ? 'Live Class is NOW LIVE!' : 'Class Invitation'}\nClass: ${className}\nInstructor: ${activeClass?.instructor || 'NITHYA Master'}\n\nJoin as a student (the class opens when the instructor starts):\n${studentInviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    const className = activeClass?.title || activeClass?.name || 'Live Yoga Class';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NITHYA Yoga: ${className}`,
          text: lang === 'ta' ? `🧘‍♀️ நித்யா யோகா நேரலை வகுப்பில் இணையுங்கள்:` : `🧘‍♀️ Join NITHYA Yoga Live Class:`,
          url: studentInviteUrl
        });
      } catch (_) {}
    } else {
      handleWhatsAppShare();
    }
  };

  const handleVerifyAttendance = () => {
    const studentSession = (() => {
      try { return JSON.parse(localStorage.getItem('nithya_student_session') || '{}'); } catch (_) { return {}; }
    })();
    const studentName = studentSession.name || localStorage.getItem('nithya_student_name') || user?.name || 'Student';
    const minutesSpent = Math.max(1, Math.floor(sessionSeconds / 60));

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
    setAttendanceVerified(true);
    if (showToast) {
      showToast(lang === 'ta' ? 'வருகை பதிவு செய்யப்பட்டது' : 'Attendance Verified', 'Your attendance was logged in database.', 'success');
    }
  };

  const instructorName = activeClass?.instructor || 'NITHYA Master';
  const studentDisplayName = user?.name || (lang === 'ta' ? 'யோகா மாணவர்' : 'Yoga Student');

  return (
    <div className="live-studio-card-container">
      {/* 1. Premium Class Header */}
      <div className="live-studio-head">
        <div className="live-studio-brand">
          <div className="live-studio-logo-emblem-wrap">
            <img src="assets/images/logo.png?v=20261024" alt="Nithya Yoga" className="live-studio-logo-img" />
          </div>
          <div className="live-studio-meta">
            <h3 className="live-studio-title">
              {activeClass?.title || activeClass?.name || 'Hatha Yoga Flow'}
            </h3>
            <span className="live-studio-subtitle">
              {lang === 'ta' ? `பயிற்றுநர்: ${instructorName}` : `Lead Instructor: ${instructorName}`}
            </span>
          </div>
        </div>

        {/* State-Based Status Pill Badge */}
        <div className="live-studio-badge-wrapper">
          {sessionStatus === 'idle' && (
            <span className="live-badge-pill badge-idle">
              <Calendar size={13} />
              <span>{lang === 'ta' ? 'திட்டமிடப்பட்டது' : 'Scheduled'}</span>
            </span>
          )}
          {sessionStatus === 'starting' && (
            <span className="live-badge-pill badge-starting">
              <span className="live-pulse-dot amber"></span>
              <span>{lang === 'ta' ? 'தொடங்குகிறது...' : 'Connecting...'}</span>
            </span>
          )}
          {sessionStatus === 'live' && (
            <span className="live-badge-pill badge-live">
              <span className="live-pulse-dot red"></span>
              <span>LIVE NOW</span>
            </span>
          )}
          {sessionStatus === 'ended' && (
            <span className="live-badge-pill badge-ended">
              <CheckCircle size={13} />
              <span>{lang === 'ta' ? 'வகுப்பு முடிந்தது' : 'Class Ended'}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Visual Stage Screen with Ambient Meditation Orbit Layer */}
      <div className="live-studio-stage">
        <div className="live-studio-stage-orbit" aria-hidden="true"></div>

        {/* Live Active Session Timer (Visible ONLY when LIVE) */}
        {sessionStatus === 'live' && (
          <div className="live-stage-timer">
            <span className="timer-dot">🔴</span>
            <span>{formatTimer(sessionSeconds)}</span>
          </div>
        )}

        {/* Center Stage State Indicator */}
        <div className="live-stage-center-box">
          {sessionStatus === 'idle' && (
            <div className="stage-idle-message">
              <div className="stage-icon-circle">🧘‍♀️</div>
              <h4 className="stage-heading">
                {isInstructorRole
                  ? (lang === 'ta' ? 'வகுப்பைத் தொடங்கத் தயாரா?' : 'Ready to Start Live Class?')
                  : (lang === 'ta' ? 'பயிற்றுநரின் நேரலைக்காக காத்திருக்கிறது...' : 'Waiting for Instructor to Start...')}
              </h4>
              <p className="stage-subtext">
                {isInstructorRole
                  ? (lang === 'ta' ? 'கீழே உள்ள பட்டனை அழுத்தி மாணவர்களுக்கான வகுப்பைத் தொடங்குங்கள்.' : 'Click below to initiate the live WebRTC studio session.')
                  : (lang === 'ta' ? 'ஆசிரியர் வகுப்பைத் தொடங்கியவுடன் தானாக நேரலை தோன்றும்.' : 'The live video stream will connect automatically once the teacher is live.')}
              </p>
            </div>
          )}

          {sessionStatus === 'starting' && (
            <div className="stage-starting-message">
              <div className="stage-spinner"></div>
              <h4 className="stage-heading">
                {lang === 'ta' ? 'நேரலை ஸ்டுடியோ இணைப்பு தொடங்குகிறது...' : 'Connecting to Live Studio...'}
              </h4>
              <p className="stage-subtext">
                {lang === 'ta' ? 'வீடியோ மற்றும் ஆடியோ அமைப்புகள் தயாராகின்றன.' : 'Establishing low-latency peer media channels.'}
              </p>
            </div>
          )}

          {sessionStatus === 'live' && (
            <div className="stage-live-message">
              <div className="stage-icon-circle live-pulse">✨</div>
              <h4 className="stage-heading">
                {lang === 'ta' ? 'நேரலை வகுப்பு தீவிரமாக இயங்குகிறது' : 'Live Class is Actively Streaming'}
              </h4>
              <p className="stage-subtext">
                {lang === 'ta' ? 'முழுத்திரை HD வகுப்பறைக்கு செல்ல கீழே உள்ள பட்டனை அழுத்தவும்.' : 'Tap below to enter the full interactive HD classroom.'}
              </p>
            </div>
          )}

          {sessionStatus === 'ended' && (
            <div className="stage-ended-message">
              <div className="stage-icon-circle ended">🏁</div>
              <h4 className="stage-heading">
                {lang === 'ta' ? 'இன்றைய வகுப்பு நிறைவடைந்தது' : 'Session Has Concluded'}
              </h4>
              <p className="stage-subtext">
                {lang === 'ta' ? 'பங்கேற்றமைக்கு நன்றி. அடுத்த வகுப்பின் நேரம் விரைவில் அறிவிக்கப்படும்.' : 'Thank you for your practice. Check the schedule for upcoming batches.'}
              </p>
            </div>
          )}
        </div>

        {/* Media Controls Dock */}
        <div className="live-stage-dock">
          <div className="dock-media-toggles">
            <button
              type="button"
              className={`stage-dock-btn ${isMicOn ? 'active' : 'muted'}`}
              onClick={() => setIsMicOn(!isMicOn)}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              aria-label="Toggle Microphone"
            >
              {isMicOn ? <Mic size={15} /> : <MicOff size={15} />}
            </button>
            <button
              type="button"
              className={`stage-dock-btn ${isVideoOn ? 'active' : 'muted'}`}
              onClick={() => setIsVideoOn(!isVideoOn)}
              title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              aria-label="Toggle Camera"
            >
              {isVideoOn ? <VideoIcon size={15} /> : <VideoOff size={15} />}
            </button>
          </div>

          {sessionStatus === 'live' && (
            <button
              type="button"
              className="btn-dock-leave"
              onClick={isInstructorRole ? handleEndLiveClass : onLeaveClass}
              title={lang === 'ta' ? 'வெளியேறு' : 'Leave'}
            >
              <PhoneOff size={14} />
              <span>{isInstructorRole ? (lang === 'ta' ? 'முடிக்கவும்' : 'End') : (lang === 'ta' ? 'வெளியேறு' : 'Leave')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Primary Start / Join Action Buttons (Flow-Driven) */}
      <div className="live-primary-actions-row">
        {sessionStatus === 'idle' && isInstructorRole && (
          <button
            type="button"
            className="btn-live-flow-primary ya-ripple"
            onClick={handleStartLiveClass}
          >
            <Play size={16} fill="currentColor" />
            <span>{lang === 'ta' ? '🚀 நேரலை வகுப்பைத் தொடங்கு' : 'Start Live Class'}</span>
          </button>
        )}

        {sessionStatus === 'idle' && !isInstructorRole && (
          <div className="student-waiting-status-notice">
            <Clock size={16} className="text-violet-400" />
            <span>{lang === 'ta' ? 'ஆசிரியரின் நேரலைக்காக காத்திருக்கிறது (Standby)' : 'Waiting for instructor to start the live class'}</span>
          </div>
        )}

        {sessionStatus === 'starting' && (
          <button
            type="button"
            disabled
            className="btn-live-flow-primary is-loading"
          >
            <span className="btn-loading-spinner"></span>
            <span>{lang === 'ta' ? 'இணைப்பு தொடங்குகிறது...' : 'Starting Live Class...'}</span>
          </button>
        )}

        {sessionStatus === 'live' && (
          <div className="live-active-actions-group">
            <button
              type="button"
              className="btn-live-flow-primary ya-ripple"
              onClick={onOpenFullStudio}
            >
              <Radio size={16} className="animate-pulse" />
              <span>{lang === 'ta' ? 'HD நேரலை ஸ்டுடியோவுக்குள் செல் 🧘‍♀️' : 'Enter HD Live Studio 🧘‍♀️'}</span>
            </button>

            {isInstructorRole && (
              <button
                type="button"
                className="btn-live-flow-danger ya-ripple"
                onClick={handleEndLiveClass}
                title="End Class for All"
              >
                <PhoneOff size={15} />
                <span>{lang === 'ta' ? 'அனைவருக்கும் வகுப்பை முடி' : 'End Class for All'}</span>
              </button>
            )}

            {!isInstructorRole && !attendanceVerified && (
              <button
                type="button"
                className="btn-live-flow-attendance"
                onClick={handleVerifyAttendance}
              >
                <ShieldCheck size={15} />
                <span>{lang === 'ta' ? 'வருகையை சரிபார் ✓' : 'Verify Attendance ✓'}</span>
              </button>
            )}

            {!isInstructorRole && attendanceVerified && (
              <div className="attendance-logged-tag">
                <CheckCircle size={14} />
                <span>{lang === 'ta' ? 'வருகை பதிவானது ✓' : 'Attendance Logged ✓'}</span>
              </div>
            )}
          </div>
        )}

        {sessionStatus === 'ended' && (
          <div className="live-ended-actions-group">
            {isInstructorRole ? (
              <button
                type="button"
                className="btn-live-flow-secondary ya-ripple"
                onClick={handleResetSession}
              >
                <span>{lang === 'ta' ? '🔄 புதிய அமர்வுக்கு மீட்டமை' : '🔄 Reset for New Session'}</span>
              </button>
            ) : (
              <div className="session-ended-notice">
                <span>{lang === 'ta' ? '🏁 இந்த வகுப்பு நிறைவடைந்தது.' : '🏁 This session has ended.'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Separate Roles Display Cards (Instructor & Student) */}
      <div className="live-roles-card-grid">
        {/* Role Card 1: Instructor */}
        <div className="live-role-card instructor-card">
          <div className="role-card-top">
            <div className="role-avatar-circle crown-gold">
              <Crown size={16} />
            </div>
            <div className="role-meta">
              <span className="role-name">{instructorName}</span>
              <span className="role-label">{lang === 'ta' ? 'தலைமை பயிற்றுநர்' : 'Lead Instructor'}</span>
            </div>
          </div>
          <div className="role-status-indicators">
            <span className={`status-pill ${isMicOn ? 'ready' : 'off'}`}>
              <Mic size={11} /> {isMicOn ? 'Mic On' : 'Muted'}
            </span>
            <span className={`status-pill ${isVideoOn ? 'ready' : 'off'}`}>
              <VideoIcon size={11} /> {isVideoOn ? 'Cam On' : 'Off'}
            </span>
          </div>
        </div>

        {/* Role Card 2: Student */}
        <div className="live-role-card student-card">
          <div className="role-card-top">
            <div className="role-avatar-circle student-teal">
              <User size={16} />
            </div>
            <div className="role-meta">
              <span className="role-name">{studentDisplayName}</span>
              <span className="role-label">{isInstructorRole ? (lang === 'ta' ? 'நிர்வாகி (Host)' : 'Host Account') : (lang === 'ta' ? 'பதிவு செய்த மாணவர்' : 'Enrolled Student')}</span>
            </div>
          </div>
          <div className="role-status-indicators">
            <span className="status-pill ready">
              <ShieldCheck size={11} /> {sessionStatus === 'live' ? (lang === 'ta' ? 'நேரலை அணுகல்' : 'Live Access') : (lang === 'ta' ? 'தயார் நிலை' : 'Standby')}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Student invitation link is available before class starts; the room is still gated by actual session state. */}
      {sessionStatus !== 'ended' && (
        <div className="live-invitation-card ya-reveal">
          <div className="invitation-card-head">
            <div className="flex items-center gap-2">
              <span className="invitation-icon">🔗</span>
              <div>
                <h4 className="invitation-title">
                  {lang === 'ta' ? 'மாணவர் நேரலை இணைப்பு லிங்க்' : 'Student Class Invitation Link'}
                </h4>
                <p className="invitation-sub">
                  {sessionStatus === 'live' ? (lang === 'ta' ? 'வகுப்பு நேரலையில் உள்ளது. இந்த இணைப்பை மாணவர்களுடன் பகிரலாம்.' : 'Class is live. Share this student-only link.') : (lang === 'ta' ? 'இணைப்பை முன்கூட்டியே பகிரலாம்; பயிற்றுநர் வகுப்பைத் தொடங்கியதும் மாணவர்கள் இணையலாம்.' : 'Share ahead of time; students can join when the instructor starts the class.')}
                </p>
              </div>
            </div>
            <span className="badge-student-only">Student Role Only</span>
          </div>

        <div className="invitation-input-bar">
          <input 
            type="text" 
            readOnly 
            value={studentInviteUrl} 
            className="invitation-url-field"
            title="Student Join URL"
            onClick={(e) => e.target.select()}
          />
          <div className="invitation-action-buttons">
            <button
              type="button"
              className="btn-invite-copy"
              onClick={handleCopyLiveLink}
              title="Copy Link"
            >
              <Copy size={13} />
              <span>{copiedLink ? (lang === 'ta' ? '✓ நகலெடுக்கப்பட்டது' : '✓ Copied') : (lang === 'ta' ? 'நகலெடு' : 'Copy')}</span>
            </button>

            <button
              type="button"
              className="btn-invite-whatsapp"
              onClick={handleWhatsAppShare}
              title="Share via WhatsApp"
            >
              <span>📲 WhatsApp</span>
            </button>

            <button
              type="button"
              className="btn-invite-share"
              onClick={handleNativeShare}
              title="Share Link"
            >
              <Share2 size={13} />
              <span>{lang === 'ta' ? 'பகிர்' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
