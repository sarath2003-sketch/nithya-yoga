import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Video,
  RefreshCw
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { ThreeDLotus } from './ThreeDIcons';
import { apiFetch } from '../utils/api';

export default function InviteRegistrationModal({
  inviteToken,
  onClose,
  onRegistrationSuccess,
  lang = 'en'
}) {
  const [loading, setLoading] = useState(true);
  const [classInfo, setClassInfo] = useState(null);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!inviteToken) return;

    const fetchInvite = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch(`/api/invites/${encodeURIComponent(inviteToken)}`);
        setClassInfo(data.class);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [inviteToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const data = await apiFetch('/api/members/register', {
        method: 'POST',
        body: JSON.stringify({
          inviteToken,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim()
        })
      });

      // Save member token
      localStorage.setItem('nithya_auth_token', data.token);
      localStorage.setItem('nithya_member', JSON.stringify(data.member));

      if (onRegistrationSuccess) {
        onRegistrationSuccess({
          token: data.token,
          member: data.member,
          classId: data.classId,
          classInfo
        });
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!inviteToken) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ya-modal-overlay">
      <div className="relative w-full max-w-md p-6 rounded-2xl border border-subtle bg-card shadow-2xl ya-modal-content">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-muted hover:text-heading hover:bg-subtle transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <RefreshCw size={28} className="animate-spin text-primary" />
            <p className="text-xs text-muted m-0">
              {lang === 'ta' ? 'அழைப்பு சரிபார்க்கப்படுகிறது...' : 'Verifying class invitation...'}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 mb-3">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-sm font-bold text-heading m-0 mb-1">
              {lang === 'ta' ? 'அழைப்பு காலாவதியானது' : 'Invitation Expired or Invalid'}
            </h3>
            <p className="text-xs text-muted mb-4">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="ya-btn ya-btn--primary px-4 py-2 rounded-xl text-xs font-bold"
            >
              {lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Continue to Dashboard'}
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center pb-4 border-b border-subtle">
              <div className="inline-flex p-2.5 rounded-2xl bg-primary/10 text-primary mb-2">
                <ThreeDLotus size={32} />
              </div>
              <h3 className="text-base font-bold text-heading m-0">
                {lang === 'ta' ? 'நேரலை யோகா வகுப்பிற்கான அழைப்பு' : "You're Invited to Live Yoga Class!"}
              </h3>
              <p className="text-xs text-muted mt-1 m-0">
                {lang === 'ta' 
                  ? 'வகுப்பில் இணைய உங்கள் விவரங்களை உள்ளிட்டு பதிவு செய்யுங்கள்.' 
                  : 'Complete your registration to join this verified instructor session.'}
              </p>
            </div>

            {/* Class Card */}
            {classInfo && (
              <div className="my-3 p-3 rounded-xl bg-subtle border border-primary/20">
                <h4 className="text-xs font-bold text-heading m-0 flex items-center gap-1.5">
                  <Video size={13} className="text-primary" />
                  <span>{classInfo.title}</span>
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-muted mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-primary" />
                    <span>{classInfo.durationMinutes || 60} mins</span>
                  </span>
                  <span>•</span>
                  <span>{new Date(classInfo.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            )}

            {submitError && (
              <div className="alert-box-error flex items-center gap-2 p-2.5 my-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle size={14} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-heading flex items-center gap-1">
                  <User size={12} className="text-primary" />
                  <span>{lang === 'ta' ? 'உங்கள் முழு பெயர்' : 'Full Name'}</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kavitha Ram"
                  required
                  className="ya-input text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-heading flex items-center gap-1">
                  <Mail size={12} className="text-primary" />
                  <span>{lang === 'ta' ? 'ஈமெயில் முகவரி (Gmail)' : 'Email Address (Gmail)'}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kavitha@example.com"
                  required
                  className="ya-input text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-heading flex items-center gap-1">
                  <Phone size={12} className="text-primary" />
                  <span>{lang === 'ta' ? 'மொபைல் எண்' : 'Mobile Number (10 digits)'}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="ya-input text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="ya-btn ya-btn--primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {submitting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                <span>
                  {lang === 'ta' ? 'பதிவு செய்து வகுப்பில் இணையவும்' : 'Register & Join Live Class'}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
