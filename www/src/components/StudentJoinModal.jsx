import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, Radio, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Clock, RefreshCw, Check, Download } from 'lucide-react';
import { ThreeDLotus } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';
import { apiFetch } from '../utils/api';

export default function StudentJoinModal({
  isOpen,
  onClose,
  onJoin,
  activeClass,
  lang = 'en'
}) {
  const [name, setName] = useState(() => {
    return localStorage.getItem('nithya_student_name') || '';
  });
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('nithya_student_phone') || '';
  });
  const [isValidated, setIsValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [classStatus, setClassStatus] = useState('unknown'); // 'scheduled' | 'live' | 'ended' | 'unknown'
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const pollTimerRef = useRef(null);

  // Poll class status while in waiting screen
  useEffect(() => {
    if (!isOpen) return;
    const classId = activeClass?.id || 'cls-1';
    const checkClassState = async () => {
      try {
        const cls = await apiFetch(`/api/classes/${classId}`);
        if (cls && cls.status) {
          setClassStatus(cls.status);
          if (cls.status === 'live') {
            setStatusMessage(lang === 'ta' ? 'பயிற்றுநர் வகுப்பைத் தொடங்கிவிட்டார்! இப்போது நீங்கள் இணையலாம் 🧘‍♀️' : 'Trainer has started the class! You can now enter the live studio.');
          } else if (cls.status === 'ended') {
            setStatusMessage(lang === 'ta' ? 'இந்த யோகா வகுப்பு முடிந்துவிட்டது.' : 'This yoga class has already ended.');
          }
        }
      } catch (_) {}
    };

    checkClassState();

    if (isValidated && classStatus === 'scheduled') {
      pollTimerRef.current = setInterval(checkClassState, 3500);
    }

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isOpen, isValidated, classStatus, activeClass?.id, lang]);

  if (!isOpen) return null;

  // Submit Name & Mobile Number and directly join the live class as Student
  const handleValidate = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    if (cleanName.length < 2) {
      setError(lang === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்).' : 'Please enter your full name (at least 2 letters).');
      return;
    }

    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setError(lang === 'ta' ? 'தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setIsValidating(true);

    try {
      localStorage.setItem('nithya_student_name', cleanName);
      localStorage.setItem('nithya_student_phone', cleanPhone);
      // Ensure student does not have trainer privileges
      localStorage.removeItem('nithya_admin_token');
      localStorage.removeItem('nithya_trainer_token');

      const studentSession = {
        name: cleanName,
        phone: cleanPhone,
        role: 'student',
        joinedAt: new Date().toISOString()
      };
      localStorage.setItem('nithya_student_session', JSON.stringify(studentSession));

      const newParticipant = {
        id: `p-${cleanPhone.replace(/\D/g, '')}`,
        name: cleanName,
        phone: cleanPhone,
        role: 'student',
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      try {
        const existing = JSON.parse(localStorage.getItem('nithya_live_participants') || '[]');
        const cleanExisting = existing.filter(p => 
          p && 
          p.name && 
          !['Yoga Member', 'Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram', 'NITHYA Master', 'Student'].includes(p.name) &&
          (p.phone || '').replace(/\D/g, '').length >= 10 &&
          (p.phone || '').replace(/\D/g, '') !== cleanPhone.replace(/\D/g, '')
        );
        const updated = [newParticipant, ...cleanExisting];
        localStorage.setItem('nithya_live_participants', JSON.stringify(updated));
      } catch (_) {}

      // Pre-register student attendance record in local storage for Admin & Trainer Portal
      try {
        const classId = activeClass?.id || 'cls-1';
        const classTitle = activeClass?.title || activeClass?.name || 'Live Yoga Flow';
        const logs = JSON.parse(localStorage.getItem('nithya_attendance_logs') || '[]');
        const newLog = {
          id: `att-${cleanPhone.replace(/\D/g, '')}-${Date.now()}`,
          classId,
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
        const updatedLogs = [newLog, ...logs.filter(l => !((l.phone || l.studentPhone || '').replace(/\D/g, '') === cleanPhone.replace(/\D/g, '') && l.classId === classId))];
        localStorage.setItem('nithya_attendance_logs', JSON.stringify(updatedLogs));
      } catch (_) {}

      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('nithya_live_class_channel');
          bc.postMessage({ type: 'student_joined', student: newParticipant });
          setTimeout(() => { try { bc.close(); } catch (_) {} }, 150);
        }
      } catch (_) {}

      // Attempt background record with backend if running
      try {
        const classId = activeClass?.id || 'cls-1';
        apiFetch('/api/student/validate-join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId,
            name: cleanName,
            phone: cleanPhone
          })
        }).then(data => {
          if (data?.token) localStorage.setItem('nithya_auth_token', data.token);
        }).catch(() => {});
      } catch (_) {}

      // Immediately enter classroom as Student!
      onJoin(studentSession);
    } catch (e) {
      setError(e.message || 'Error joining class');
    } finally {
      setIsValidating(false);
    }
  };

  const handleJoinConfirmed = () => {
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').replace(/[^\d+]/g, '');
    const session = {
      name: cleanName || 'Student',
      phone: cleanPhone || '9876543210',
      role: 'student',
      joinedAt: new Date().toISOString()
    };
    onJoin(session);
  };

  const handleLaunchApp = () => {
    const classId = activeClass?.id || 'cls-1';
    const intentUrl = `intent://sarath2003-sketch.github.io/nithya-yoga/?live=${encodeURIComponent(classId)}&join=student#Intent;scheme=https;package=com.nithya.yoga;end`;
    const customSchemeUrl = `nithyayoga://live?id=${encodeURIComponent(classId)}&join=student`;

    try {
      window.location.href = customSchemeUrl;
      setTimeout(() => {
        window.location.href = intentUrl;
      }, 400);
    } catch (_) {
      window.location.href = intentUrl;
    }
  };

  return (
    <div className="modal-backdrop-scrim ya-reveal" onClick={onClose}>
      <div className="modal-bottom-sheet max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle"></div>

        {/* Header */}
        <div className="modal-header-bar flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Radio size={16} className="text-primary animate-pulse" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 mb-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold tracking-wide uppercase">
                {activeClass?.courseName || activeClass?.course_name || 'Morning Yoga Flow'}
              </span>
              <h3 className="modal-title-bold text-base font-bold text-heading">
                {lang === 'ta' ? 'மாணவர் பதிவு & நேரலை வகுப்பு' : 'Student Live Yoga Registration'}
              </h3>
              <p className="text-[11px] text-muted">
                {activeClass?.title || activeClass?.name || 'Hatha Yoga Flow'} • {activeClass?.instructor || 'NITHYA Master'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-modal-close text-muted hover:text-heading cursor-pointer" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lotus Icon Badge */}
        <div className="flex justify-center my-3">
          <ThreeDLotus size={48} />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-2 mb-3 bg-red-subtle text-red rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 2 to 4: Registration & Validation Form */}
        {!isValidated ? (
          <form onSubmit={handleValidate} className="modal-form-flow flex flex-col gap-3">
            <div className="text-xs text-muted">
              {lang === 'ta' 
                ? 'நேரலை வகுப்பில் இணைய உங்கள் விவரங்களை உள்ளிடவும்:' 
                : 'Enter your details below to register and verify your live class access:'}
            </div>

            {/* Field 1: Name */}
            <div className="form-field-unit flex flex-col gap-1">
              <label className="text-xs font-semibold text-heading flex items-center gap-1.5">
                <User size={13} className="text-primary" />
                <span>{lang === 'ta' ? 'மாணவர் முழுப் பெயர் (Student Name):' : 'Student Full Name:'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="ya-input w-full text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading focus:border-primary outline-none"
                placeholder={lang === 'ta' ? 'உங்கள் பெயர் (எ.கா. சரத்)' : 'Your Name (e.g. Sarath)'}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                required
                autoFocus
              />
            </div>

            {/* Field 2: Mobile Number */}
            <div className="form-field-unit flex flex-col gap-1">
              <label className="text-xs font-semibold text-heading flex items-center gap-1.5">
                <Phone size={13} className="text-primary" />
                <span>{lang === 'ta' ? 'மொபைல் எண் (Mobile Number):' : 'Mobile Number:'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="ya-input w-full text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading focus:border-primary outline-none"
                placeholder={lang === 'ta' ? 'எ.கா. 9876543210' : 'e.g. 9876543210'}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>

            {/* Attendance Notice */}
            <div className="p-2.5 bg-subtle/80 rounded-xl text-[11px] text-muted flex items-start gap-2 border border-subtle">
              <ShieldCheck size={16} className="text-green shrink-0 mt-0.5" />
              <span>
                {lang === 'ta' 
                  ? 'வகுப்பில் நீங்கள் இருக்கும் நேரம் வருகைப் பதிவிற்காகக் (70%+) கணக்கிடப்படும்.' 
                  : 'Your live session attendance will be tracked for 70%+ completion certificate.'}
              </span>
            </div>

            {/* Actions */}
            <div className="modal-actions-bar flex gap-2 mt-2">
              <button
                type="button"
                className="btn-modal-cancel w-1/3 py-2 text-xs rounded-xl border border-subtle text-muted hover:bg-subtle cursor-pointer"
                onClick={onClose}
              >
                {lang === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isValidating}
                className="btn-modal-save w-2/3 py-2 text-xs rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer disabled:opacity-60"
              >
                {isValidating ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>{lang === 'ta' ? 'இணைகிறது...' : 'Connecting...'}</span>
                  </>
                ) : (
                  <>
                    <Radio size={14} className="text-white animate-pulse" />
                    <span>{lang === 'ta' ? 'பதிவு செய்து வகுப்பில் இணைக 🧘‍♀️' : 'Register & Enter Live Class 🧘‍♀️'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Smart App Handoff / Direct APK Download */}
            <div className="pt-2 border-t border-subtle/50 text-center flex flex-col gap-1.5">
              <span className="text-[11px] text-muted block">
                {lang === 'ta' ? 'மொபைலில் ஆப் பயன்படுத்த விரும்புகிறீர்களா?' : 'Prefer using the Android mobile app?'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLaunchApp}
                  className="w-1/2 py-2 px-2 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary/20 transition-all cursor-pointer"
                >
                  <span>📲</span>
                  <span>{lang === 'ta' ? 'ஆப்பில் திறக்க' : 'Open in App'}</span>
                </button>
                <a
                  href="https://sarath2003-sketch.github.io/nithya-yoga/NITHYA-Yoga-v1.0.apk"
                  download="NITHYA-Yoga-v1.0.apk"
                  className="w-1/2 py-2 px-2 rounded-xl border border-subtle bg-subtle/40 text-heading text-xs font-semibold flex items-center justify-center gap-1 hover:bg-subtle/70 transition-all"
                >
                  <Download size={12} />
                  <span>{lang === 'ta' ? 'APK டவுன்லோட்' : 'Download APK'}</span>
                </a>
              </div>
            </div>
          </form>
        ) : classStatus === 'ended' ? (
          /* Notice: Class has ended */
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <h4 className="text-base font-bold text-heading">
              {lang === 'ta' ? 'யோகா வகுப்பு முடிந்துவிட்டது' : 'Yoga Class Ended'}
            </h4>
            <p className="text-xs text-muted max-w-xs">
              {lang === 'ta' 
                ? 'இந்த யோகா வகுப்பு பயிற்றுநரால் நிறைவு செய்யப்பட்டுவிட்டது. பதிவு செய்யப்பட்ட வீடியோக்கள் அல்லது குறிப்புகளைக் காணவும்.' 
                : 'This live session has already concluded. You can watch recorded yoga flows or view class notes.'}
            </p>
            <div className="flex gap-2 w-full mt-2">
              <button
                type="button"
                className="w-1/2 py-2.5 text-xs rounded-xl border border-subtle text-heading font-semibold hover:bg-subtle cursor-pointer flex items-center justify-center gap-1.5"
                onClick={async () => {
                  try {
                    const classId = activeClass?.id || 'cls-1';
                    const cls = await apiFetch(`/api/classes/${classId}`);
                    if (cls && cls.status === 'live') {
                      setClassStatus('live');
                      onJoin({ name, phone, role: 'student' });
                    } else {
                      alert(lang === 'ta' ? 'வகுப்பு இன்னும் தொடங்கப்படவில்லை அல்லது நிறைவடைந்துள்ளது.' : 'Class has not started yet or has concluded.');
                    }
                  } catch (_) {}
                }}
              >
                <RefreshCw size={13} />
                <span>{lang === 'ta' ? 'மீண்டும் சரிபார்' : 'Check Status'}</span>
              </button>
              <button
                type="button"
                className="w-1/2 py-2.5 text-xs rounded-xl bg-primary text-white font-bold hover:opacity-95 cursor-pointer"
                onClick={onClose}
              >
                {lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Return to Home'}
              </button>
            </div>
          </div>
        ) : classStatus === 'scheduled' ? (
          /* Waiting Screen: Trainer has not started yet */
          <div className="flex flex-col items-center text-center gap-3 py-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              <Clock size={24} className="relative z-10" />
            </div>

            <div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 text-[11px] font-bold inline-block mb-1">
                ⏳ {lang === 'ta' ? 'பயிற்றுநருக்காகக் காத்திருக்கிறது' : 'WAITING FOR TRAINER'}
              </span>
              <h4 className="text-base font-bold text-heading">
                {lang === 'ta' ? 'வகுப்பு இன்னும் தொடங்கப்படவில்லை' : 'Trainer Has Not Started Yet'}
              </h4>
              <p className="text-xs text-muted max-w-xs mt-1">
                {lang === 'ta' 
                  ? 'உங்கள் விவரங்கள் சரிபார்க்கப்பட்டன. பயிற்றுநர் வகுப்பைத் தொடங்கியவுடன் தானாகவே இணைக்கப்படுவீர்கள்.' 
                  : `Welcome, ${name}! Your details are verified. Please wait — the class will begin as soon as the trainer starts the session.`}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-primary font-semibold py-1">
              <RefreshCw size={13} className="animate-spin" />
              <span>{lang === 'ta' ? 'நேரலை இணைப்பைத் தேடுகிறது...' : 'Checking live room status...'}</span>
            </div>

            {/* Manual Join if trainer just started */}
            <div className="flex gap-2 w-full mt-2">
              <button
                type="button"
                className="w-1/2 py-2 text-xs rounded-xl border border-subtle text-muted hover:bg-subtle cursor-pointer"
                onClick={onClose}
              >
                {lang === 'ta' ? 'வெளியேறு' : 'Leave Waiting Room'}
              </button>
              <button
                type="button"
                className="w-1/2 py-2 text-xs rounded-xl bg-primary text-white font-bold hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                onClick={handleJoinConfirmed}
              >
                <Radio size={14} />
                <span>{lang === 'ta' ? 'இப்போதே இணை' : 'Enter Studio Now'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 5 & 6: Class is LIVE -> Verified Join Class Button */
          <div className="flex flex-col items-center text-center gap-3 py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Check size={24} />
            </div>

            <div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-[11px] font-bold inline-block mb-1">
                ● {lang === 'ta' ? 'வகுப்பு நேரலையில் உள்ளது!' : 'CLASS IS LIVE NOW'}
              </span>
              <h4 className="text-base font-bold text-heading">
                {lang === 'ta' ? 'சரிபார்க்கப்பட்டது: வகுப்பில் இணைக' : 'Verified: Ready to Join Class'}
              </h4>
              <p className="text-xs text-muted max-w-xs mt-1">
                {lang === 'ta' 
                  ? `வணக்கம் ${name}, உங்கள் 10-இலக்க எண் சரிபார்க்கப்பட்டது. நேரலை வீடியோ மற்றும் ஆடியோவுடன் இணைய கீழே உள்ள பட்டனைக் கிளிக் செய்க.` 
                  : `Welcome, ${name}! Your details have been verified. Click below to enter the live yoga studio.`}
              </p>
            </div>

            <div className="w-full p-3 rounded-xl bg-subtle/60 border border-subtle text-left text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-muted">Student:</span>
                <strong className="text-heading">{name}</strong>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-muted">Phone:</span>
                <span className="font-mono text-heading">{phone}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-muted">Class:</span>
                <span className="text-primary font-semibold">{activeClass?.title || activeClass?.name || 'Hatha Flow'}</span>
              </div>
            </div>

            {/* Step 5 & 6: JOIN CLASS Button */}
            <div className="flex gap-2 w-full mt-2">
              <button
                type="button"
                className="w-1/3 py-2.5 text-xs rounded-xl border border-subtle text-muted hover:bg-subtle cursor-pointer"
                onClick={onClose}
              >
                {lang === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>
              <button
                type="button"
                className="w-2/3 py-2.5 text-xs rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                onClick={handleJoinConfirmed}
              >
                <Radio size={15} className="animate-pulse" />
                <span>{lang === 'ta' ? 'நேரலை வகுப்பில் இணைக (Join Class)' : 'JOIN CLASS NOW 🧘‍♀️'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
