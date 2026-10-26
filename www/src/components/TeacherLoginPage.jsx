import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function TeacherLoginPage({ onLoginSuccess, onNavigate, lang = 'en' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail) {
      setErrorMessage(lang === 'ta' ? 'தயவுசெய்து உங்கள் ஜிமெயில் / மின்னஞ்சலை உள்ளிடவும்.' : 'Please enter your Gmail / email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage(lang === 'ta' ? 'சரியான ஜிமெயில் / மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please enter a valid email address.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage(lang === 'ta' ? 'தயவுசெய்து கடவுச்சொல்லை உள்ளிடவும்.' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate with backend API
      const data = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      if (!data || !data.token) {
        throw new Error(data?.error || (lang === 'ta' ? 'உள்நுழைவு தோல்வியடைந்தது.' : 'Login failed. Invalid response from server.'));
      }

      // 2. Strict Server-Side Verification: Ensure JWT is valid and role is teacher/admin
      const verifyRes = await apiFetch('/api/teacher/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });

      if (!verifyRes || !verifyRes.ok || !verifyRes.user) {
        throw new Error(lang === 'ta' ? 'பயிற்றுநர் அனுமதி சரிபார்ப்பு தோல்வியடைந்தது.' : 'Server rejected teacher authorization.');
      }

      // 3. Store ONLY the server-signed token and user metadata (NEVER store password!)
      localStorage.setItem('nithya_teacher_token', data.token);
      localStorage.setItem('nithya_admin_token', data.token);
      localStorage.setItem('nithya_active_role', 'instructor');
      localStorage.removeItem('nithya_student_session');

      if (onLoginSuccess) {
        onLoginSuccess(verifyRes.user);
      } else if (onNavigate) {
        onNavigate('/teacher/dashboard');
      }
    } catch (err) {
      console.error('Teacher login failed:', err);
      setErrorMessage(err.message || (lang === 'ta' ? 'மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது.' : 'Invalid email or password.'));
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
            <span>{lang === 'ta' ? 'பயிற்றுநர் பகுதி' : 'Teacher Portal'}</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="admin-auth-header">
          <div className="admin-auth-shield-wrap">
            <ShieldCheck size={32} />
          </div>
          <h2 className="admin-auth-title">
            {lang === 'ta' ? 'பயிற்றுநர் உள்நுழைவு' : 'Teacher Login'}
          </h2>
          <p className="admin-auth-subtitle">
            {lang === 'ta' 
              ? 'நேரலை வகுப்புகளை நிர்வகிக்க உங்கள் பயிற்றுநர் கணக்கில் உள்நுழையவும்.' 
              : 'Sign in to create, schedule, and host live yoga sessions.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="admin-auth-alert-error">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="admin-auth-form">
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
              <span className="admin-auth-label-icon"><Lock size={14} /></span>
              <span>{lang === 'ta' ? 'கடவுச்சொல்' : 'Password'}</span>
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

          <button
            type="submit"
            disabled={isLoading}
            className="admin-auth-submit-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                <span>{lang === 'ta' ? 'உள்நுழைகிறது...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'ta' ? 'உள்நுழைக' : 'Sign In as Teacher'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <div className="admin-auth-switch-wrap">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/teacher/register')}
              className="admin-auth-switch-link"
            >
              <span>{lang === 'ta' ? 'புதிய பயிற்றுநரா? புதிய கணக்கு தொடங்கவும்' : "Don't have an account? Register here"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
