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
    <div className="min-h-screen bg-[#070514] text-white flex flex-col justify-center items-center p-4 sm:p-6 font-['Poppins',sans-serif]">
      {/* Background celestial glow elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-800/15 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181236]/90 to-[#0e0a24]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/')}
            className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-[11px] font-bold">
            <ShieldCheck size={13} className="text-purple-400" />
            <span>{lang === 'ta' ? 'பயிற்றுநர் பகுதி' : 'Teacher Portal'}</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-2xl">❀</span>
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white font-['Georgia',serif]">
            {lang === 'ta' ? 'பயிற்றுநர் உள்நுழைவு' : 'Teacher Login'}
          </h2>
          <p className="text-xs text-purple-200/70 mt-1">
            {lang === 'ta' ? 'நேரலை வகுப்புகளை நிர்வகிக்க உங்கள் கணக்கில் உள்நுழையவும்' : 'Sign in to create & host live yoga classes'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2.5 text-rose-200 text-xs">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              {lang === 'ta' ? 'ஜிமெயில் / மின்னஞ்சல் முகவரி' : 'Gmail / Email Address'}
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@nithyayoga.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              {lang === 'ta' ? 'கடவுச்சொல்' : 'Password'}
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-3 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400/70 hover:text-white p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>{lang === 'ta' ? 'உள்நுழைகிறது...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'ta' ? 'உள்நுழைக' : 'Sign In as Teacher'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Navigation to Register */}
        <div className="mt-6 pt-5 border-t border-purple-500/20 text-center">
          <p className="text-xs text-purple-200/70 mb-2">
            {lang === 'ta' ? 'பயிற்றுநர் கணக்கு இல்லையா?' : "Don't have a teacher account?"}
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/teacher/register')}
            className="text-xs font-bold text-purple-300 hover:text-white hover:underline cursor-pointer"
          >
            {lang === 'ta' ? 'இங்கே புதிய கணக்கை பதிவு செய்யவும் ➡️' : 'Register New Teacher Account ➡️'}
          </button>
        </div>
      </div>
    </div>
  );
}
