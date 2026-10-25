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
    <div className="min-h-screen bg-[#070514] text-white flex flex-col justify-center items-center p-4 sm:p-6 font-['Poppins',sans-serif]">
      {/* Background celestial glow elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-800/15 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181236]/90 to-[#0e0a24]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl my-6">
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
            <span>{lang === 'ta' ? 'பயிற்றுநர் பதிவு' : 'Teacher Registration'}</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-2xl">❀</span>
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white font-['Georgia',serif]">
            {lang === 'ta' ? 'பயிற்றுநர் கணக்கு தொடங்கு' : 'Create Teacher Account'}
          </h2>
          <p className="text-xs text-purple-200/70 mt-1">
            {lang === 'ta' ? 'புதிய யோகா வகுப்புகளை உருவாக்க பதிவு செய்க' : 'Register to host live sessions and guide students'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2.5 text-rose-200 text-xs">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2.5 text-emerald-200 text-xs">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">
              {lang === 'ta' ? 'முழு பெயர்' : 'Full Name'}
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nithya Teacher"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">
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
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">
              {lang === 'ta' ? 'மொபைல் எண் (10 இலக்கம்)' : 'Mobile Number (10 Digits)'}
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">
              {lang === 'ta' ? 'கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்)' : 'Password (min. 6 characters)'}
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-2.5 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
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

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">
              {lang === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்து' : 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/70" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-2.5 bg-[#0d0922]/80 border border-purple-500/30 rounded-xl text-white text-sm placeholder-purple-300/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400/70 hover:text-white p-1"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>{lang === 'ta' ? 'பதிவு செய்யப்படுகிறது...' : 'Registering Account...'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'ta' ? 'கணக்கை உருவாக்கு' : 'Create Teacher Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Navigation to Login */}
        <div className="mt-5 pt-4 border-t border-purple-500/20 text-center">
          <p className="text-xs text-purple-200/70 mb-1.5">
            {lang === 'ta' ? 'ஏற்கனவே பயிற்றுநர் கணக்கு உள்ளதா?' : 'Already have a teacher account?'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/teacher/login')}
            className="text-xs font-bold text-purple-300 hover:text-white hover:underline cursor-pointer"
          >
            {lang === 'ta' ? 'இங்கே உள்நுழையவும் ➡️' : 'Sign In here ➡️'}
          </button>
        </div>
      </div>
    </div>
  );
}
