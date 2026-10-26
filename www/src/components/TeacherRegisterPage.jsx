import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function TeacherRegisterPage({ onRegisterSuccess, onNavigate, lang = 'en' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanName = name.trim().replace(/\s+/g, ' ');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const cleanPassword = password;
    const cleanConfirm = confirmPassword;

    // 1. Validation checks
    if (cleanName.length < 2) {
      setErrorMessage(lang === 'ta' ? 'தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்).' : 'Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage(lang === 'ta' ? 'சரியான ஜிமெயில் / மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please enter a valid Gmail / email address.');
      return;
    }

    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage(lang === 'ta' ? 'தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMessage(lang === 'ta' ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்களாக இருக்க வேண்டும்.' : 'Password must be at least 6 characters long.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMessage(lang === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை. மீண்டும் சரிபார்க்கவும்.' : 'Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Call backend registration endpoint
      const data = await apiFetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: cleanPassword
        })
      });

      if (!data || !data.token) {
        throw new Error(data?.error || (lang === 'ta' ? 'பதிவு தோல்வியடைந்தது.' : 'Registration failed.'));
      }

      // 3. Verify server-side that token works
      const verifyRes = await apiFetch('/api/teacher/verify', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${data.token}` }
      });

      if (!verifyRes || !verifyRes.ok || !verifyRes.user) {
        throw new Error(lang === 'ta' ? 'பயிற்றுநர் அனுமதி சரிபார்ப்பு தோல்வியடைந்தது.' : 'Failed to verify teacher authorization token.');
      }

      // 4. Store ONLY the signed token (never store passwords in localStorage!)
      localStorage.setItem('nithya_teacher_token', data.token);
      localStorage.setItem('nithya_admin_token', data.token);
      localStorage.setItem('nithya_active_role', 'instructor');
      localStorage.removeItem('nithya_student_session');

      setSuccessMessage(lang === 'ta' ? 'பயிற்றுநர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! வழிநடத்தப்படுகிறது...' : 'Teacher account created successfully! Redirecting...');

      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(verifyRes.user);
        } else if (onNavigate) {
          onNavigate('/teacher/dashboard');
        }
      }, 700);
    } catch (err) {
      console.error('Teacher registration error:', err);
      setErrorMessage(err.message || (lang === 'ta' ? 'பதிவு செய்வதில் பிழை ஏற்பட்டது.' : 'Registration failed.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6" style={{ background: 'var(--bg-app)' }}>
      <div className="admin-auth-card ya-reveal">
        {/* Top Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="admin-auth-switch-link"
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            fontSize: '11px',
            fontWeight: 700
          }}>
            <ShieldCheck size={13} />
            <span>{lang === 'ta' ? 'பயிற்றுநர் பதிவு' : 'Teacher Registration'}</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="admin-auth-header">
          <div className="admin-auth-shield-wrap">
            <ShieldCheck size={32} />
          </div>
          <h2 className="admin-auth-title">
            {lang === 'ta' ? 'பயிற்றுநர் கணக்கு தொடங்கு' : 'Create Teacher Account'}
          </h2>
          <p className="admin-auth-subtitle">
            {lang === 'ta' 
              ? 'புதிய யோகா வகுப்புகளை உருவாக்கி மாணவர்களை வழிநடத்த பதிவு செய்க.' 
              : 'Register to host live sessions and guide students.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="admin-auth-alert-error">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="admin-auth-alert-success">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="admin-auth-form">
          <div className="admin-auth-field">
            <label className="admin-auth-label">
              <span className="admin-auth-label-icon"><User size={14} /></span>
              <span>{lang === 'ta' ? 'முழு பெயர்' : 'Full Name'}</span>
              <span className="admin-auth-req-star">*</span>
            </label>
            <div className="admin-auth-input-wrap">
              <User size={16} className="admin-auth-input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nithya Teacher"
                required
                className="admin-auth-input"
              />
            </div>
          </div>

          <div className="admin-auth-field">
            <label className="admin-auth-label">
              <span className="admin-auth-label-icon"><Mail size={14} /></span>
              <span>{lang === 'ta' ? 'ஜிமெயில் / மின்னஞ்சல் முகவரி' : 'Gmail / Email Address'}</span>
              <span className="admin-auth-req-star">*</span>
            </label>
            <div className="admin-auth-input-wrap">
              <Mail size={16} className="admin-auth-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@nithyayoga.com"
                required
                className="admin-auth-input"
              />
            </div>
          </div>

          <div className="admin-auth-field">
            <label className="admin-auth-label">
              <span className="admin-auth-label-icon"><Phone size={14} /></span>
              <span>{lang === 'ta' ? 'மொபைல் எண் (10 இலக்கம்)' : 'Mobile Number (10 Digits)'}</span>
              <span className="admin-auth-req-star">*</span>
            </label>
            <div className="admin-auth-input-wrap">
              <Phone size={16} className="admin-auth-input-icon" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                required
                className="admin-auth-input"
              />
            </div>
          </div>

          <div className="admin-auth-field">
            <label className="admin-auth-label">
              <span className="admin-auth-label-icon"><Lock size={14} /></span>
              <span>{lang === 'ta' ? 'கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்)' : 'Password (min. 6 characters)'}</span>
              <span className="admin-auth-req-star">*</span>
            </label>
            <div className="admin-auth-input-wrap">
              <Lock size={16} className="admin-auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="admin-auth-input has-eye"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="admin-auth-eye-btn"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="admin-auth-field">
            <label className="admin-auth-label">
              <span className="admin-auth-label-icon"><Lock size={14} /></span>
              <span>{lang === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்து' : 'Confirm Password'}</span>
              <span className="admin-auth-req-star">*</span>
            </label>
            <div className="admin-auth-input-wrap">
              <Lock size={16} className="admin-auth-input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="admin-auth-input has-eye"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="admin-auth-eye-btn"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="admin-auth-submit-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                <span>{lang === 'ta' ? 'பதிவு செய்யப்படுகிறது...' : 'Registering Account...'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'ta' ? 'கணக்கை உருவாக்கு' : 'Create Teacher Account'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <div className="admin-auth-switch-wrap">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/teacher/login')}
              className="admin-auth-switch-link"
            >
              <span>{lang === 'ta' ? 'ஏற்கனவே பயிற்றுநர் கணக்கு உள்ளதா? உள்நுழையவும்' : 'Already have an account? Sign In here'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
