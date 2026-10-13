import React, { useState } from 'react';
import { X, User, Phone, Radio, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThreeDLotus } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';

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
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
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
    localStorage.setItem('nithya_student_name', cleanName);
    localStorage.setItem('nithya_student_phone', cleanPhone);

    const studentSession = {
      name: cleanName,
      phone: cleanPhone,
      joinedAt: new Date().toISOString()
    };
    localStorage.setItem('nithya_student_session', JSON.stringify(studentSession));

    audioEngine.playTempleBell();
    onJoin(studentSession);
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
              <h3 className="modal-title-bold text-base font-bold text-heading">
                {lang === 'ta' ? 'நேரலை வகுப்பில் இணைக' : 'Join Live Yoga Studio'}
              </h3>
              <p className="text-[11px] text-muted">
                {activeClass?.title || activeClass?.name || 'Hatha Yoga'} • {activeClass?.instructor || 'NITHYA Master'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-modal-close text-muted hover:text-heading" 
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
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form-flow flex flex-col gap-3">
          {/* Field 1: Name */}
          <div className="form-field-unit flex flex-col gap-1">
            <label className="text-xs font-semibold text-heading flex items-center gap-1.5">
              <User size={13} className="text-primary" />
              <span>{lang === 'ta' ? 'உங்கள் முழுப் பெயர் (Full Name):' : 'Full Name:'}</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="ya-input w-full text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading focus:border-primary outline-none"
              placeholder={lang === 'ta' ? 'எ.கா. கவிதா ராம் / Kavitha Ram' : 'e.g. Kavitha Ram'}
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

          {/* Attendance Consent Notice */}
          <div className="p-2.5 bg-subtle/80 rounded-xl text-[11px] text-muted flex items-start gap-2 border border-subtle">
            <ShieldCheck size={16} className="text-green shrink-0 mt-0.5" />
            <span>
              {lang === 'ta' 
                ? 'வகுப்பில் நீங்கள் இருக்கும் நேரம் வருகைப் பதிவிற்காகக் (70%+) கணக்கிடப்படும். உங்கள் விவரங்கள் பாதுகாப்பாக வைக்கப்படும்.' 
                : 'Your session duration will be verified for attendance (70%+ completion). Your details remain confidential.'}
            </span>
          </div>

          {/* Actions */}
          <div className="modal-actions-bar flex gap-2 mt-2">
            <button
              type="button"
              className="btn-modal-cancel w-1/3 py-2 text-xs rounded-xl border border-subtle text-muted hover:bg-subtle"
              onClick={onClose}
            >
              {lang === 'ta' ? 'ரத்து' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="btn-modal-save w-2/3 py-2 text-xs rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95"
            >
              <CheckCircle2 size={14} />
              <span>{lang === 'ta' ? 'உறுதி செய்து இணையவும் 🧘‍♀️' : 'Confirm & Join Class 🧘‍♀️'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
