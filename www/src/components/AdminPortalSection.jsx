import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Calendar, 
  Plus, 
  Link, 
  Copy, 
  Check, 
  Users, 
  Clock, 
  Video, 
  RefreshCw, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  Settings,
  Sparkles
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { ThreeDLotus } from './ThreeDIcons';
import { apiFetch } from '../utils/api';

export default function AdminPortalSection({
  onLaunchInstructorStudio,
  showToast,
  lang = 'en'
}) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('nithya_admin_token') || '');
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'attendance' | 'settings'

  // Login form state
  const [email, setEmail] = useState('admin@nithyayoga.com');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Classes state
  const [classesList, setClassesList] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStartsAt, setNewStartsAt] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [newDuration, setNewDuration] = useState('60');
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [inviteUrls, setInviteUrls] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Attendance state
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Settings state
  const [livekitStatus, setLivekitStatus] = useState(null);
  const [configUrl, setConfigUrl] = useState('');
  const [configApiKey, setConfigApiKey] = useState('');
  const [configApiSecret, setConfigApiSecret] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  // Fetch classes when admin token is available
  const fetchClasses = async () => {
    if (!adminToken) return;
    setClassesLoading(true);
    try {
      const data = await apiFetch('/api/admin/classes', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (Array.isArray(data)) {
        setClassesList(data);
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        handleLogout();
        return;
      }
      console.error('Error fetching admin classes:', err);
    } finally {
      setClassesLoading(false);
    }
  };

  // Fetch attendance report
  const fetchAttendance = async () => {
    if (!adminToken) return;
    setAttendanceLoading(true);
    try {
      const data = await apiFetch('/api/admin/attendance', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (Array.isArray(data)) {
        setAttendanceLogs(data);
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        handleLogout();
        return;
      }
      console.error('Error fetching admin attendance:', err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Fetch LiveKit status
  const fetchLiveKitStatus = async () => {
    try {
      const data = await apiFetch('/api/livekit/status');
      setLivekitStatus(data);
      if (data.serverUrl) setConfigUrl(data.serverUrl);
    } catch (e) {}
  };

  useEffect(() => {
    if (adminToken) {
      fetchClasses();
      fetchAttendance();
      fetchLiveKitStatus();
    }
  }, [adminToken]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const data = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      setAdminToken(data.token);
      localStorage.setItem('nithya_admin_token', data.token);
      audioEngine.playTempleBell();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'நிர்வாகி உள்நுழைவு வெற்றிகரமானது ✓' : 'Admin Login Successful ✓',
          `${data.email} (Instructor Verified)`,
          'success'
        );
      }
    } catch (err) {
      setLoginError(err.message);
      audioEngine.playSoundByName('Soft Bell');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    localStorage.removeItem('nithya_admin_token');
    audioEngine.playGentleChime();
    if (showToast) {
      showToast(
        lang === 'ta' ? 'வெளியேறினீர்கள்' : 'Logged Out',
        lang === 'ta' ? 'நிர்வாகி அமர்வு முடிந்தது' : 'Admin session ended',
        'info'
      );
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreatingClass(true);
    try {
      const data = await apiFetch('/api/admin/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          startsAt: new Date(newStartsAt).toISOString(),
          durationMinutes: Number(newDuration) || 60
        })
      });

      setClassesList(prev => [data, ...prev]);
      setNewTitle('');
      audioEngine.playMeditationTone();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'வகுப்பு உருவாக்கப்பட்டது ✓' : 'Yoga Class Created ✓',
          data.title,
          'success'
        );
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCreatingClass(false);
    }
  };

  const handleGenerateInvite = async (classId) => {
    try {
      const data = await apiFetch(`/api/admin/classes/${classId}/invites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const resolvedUrl = (window.location.origin && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
        ? `${window.location.origin}/?invite=${encodeURIComponent(data.token)}`
        : data.inviteUrl;

      setInviteUrls(prev => ({ ...prev, [classId]: resolvedUrl }));
      audioEngine.playSoftBell();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'அழைப்பு லிங்க் உருவாக்கப்பட்டது 🔗' : 'Invite Link Generated 🔗',
          data.classTitle || '7-day secure access token',
          'success'
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCopyLink = (url, classId) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(classId);
      setTimeout(() => setCopiedId(null), 2500);
      audioEngine.playSoftBell();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'லிங்க் காப்பி செய்யப்பட்டது ✓' : 'Copied to Clipboard ✓',
          url,
          'success'
        );
      }
    });
  };

  const handleSaveLiveKitConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const data = await apiFetch('/api/livekit/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          serverUrl: configUrl.trim(),
          apiKey: configApiKey.trim(),
          apiSecret: configApiSecret.trim()
        })
      });

      setLivekitStatus(prev => ({
        ...prev,
        configured: data.configured,
        serverUrl: data.serverUrl,
        hasApiKey: Boolean(configApiKey),
        hasApiSecret: Boolean(configApiSecret)
      }));
      audioEngine.playTempleBell();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'லைவ்கிட் அமைப்புகள் சேமிக்கப்பட்டன ✓' : 'LiveKit Credentials Saved ✓',
          data.serverUrl,
          'success'
        );
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingConfig(false);
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: ADMIN LOGIN SCREEN
  // -------------------------------------------------------------
  if (!adminToken) {
    return (
      <div className="dashboard-card admin-login-card max-w-lg mx-auto my-6 p-6">
        <div className="card-header-block text-center pb-4 border-b border-subtle">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-heading m-0">
            {lang === 'ta' ? 'நிர்வாகி உள்நுழைவு (Admin Portal)' : 'NITHYA Yoga Admin Portal'}
          </h2>
          <p className="text-xs text-muted mt-1">
            {lang === 'ta' 
              ? 'வகுப்புகளை உருவாக்க, அழைப்பு லிங்க்களை நிர்வகிக்க மற்றும் வருகையைக் கண்காணிக்க உள்நுழையவும்.' 
              : 'Secure instructor dashboard to schedule classes, generate invite links & monitor attendance.'}
          </p>
        </div>

        {loginError && (
          <div className="alert-box-error flex items-center gap-2 p-3 my-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle size={16} />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-heading">
              {lang === 'ta' ? 'நிர்வாகி ஈமெயில் (Admin Email)' : 'Admin Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="ya-input w-full text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading"
              placeholder="admin@nithyayoga.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-heading">
              {lang === 'ta' ? 'கடவுச்சொல் (Password)' : 'Admin Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="ya-input w-full text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading"
              placeholder="••••••••••••"
            />
            <small className="text-[11px] text-muted">
              {lang === 'ta' ? 'இயல்புநிலை டெவலப்மென்ட் கடவுச்சொல்: NithyaAdmin2026!' : 'Default development password: NithyaAdmin2026!'}
            </small>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="ya-btn ya-btn--primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loginLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Key size={14} />
            )}
            <span>{lang === 'ta' ? 'நிர்வாகியாக உள்நுழையவும்' : 'Sign In as Admin'}</span>
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="dashboard-card admin-dashboard-portal p-6">
      {/* Top Banner */}
      <div className="admin-portal-header flex items-center justify-between pb-4 border-b border-subtle flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-heading m-0">
                {lang === 'ta' ? 'நிர்வாகி கட்டுப்பாட்டு அறை' : 'Instructor & Admin Portal'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                ✓ Verified Admin
              </span>
            </div>
            <p className="text-xs text-muted m-0">
              {lang === 'ta' ? 'வகுப்புகள், அழைப்புகள் மற்றும் நேரலை வருகை மேலாண்மை' : 'Classes, shareable invites, LiveKit and server-backed attendance.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="ya-btn ya-btn--soft text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-subtle hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>{lang === 'ta' ? 'வெளியேறு' : 'Log Out'}</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="admin-subtabs flex items-center gap-2 my-4 bg-subtle p-1 rounded-xl">
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'classes' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('classes')}
        >
          <Calendar size={14} />
          <span>{lang === 'ta' ? 'வகுப்புகள் & அழைப்பு லிங்க்' : 'Classes & Invites'}</span>
        </button>

        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'attendance' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('attendance')}
        >
          <Users size={14} />
          <span>{lang === 'ta' ? 'சர்வர் வருகை பதிவேடு' : 'Server Attendance Audit'}</span>
        </button>

        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={14} />
          <span>{lang === 'ta' ? 'லைவ்கிட் அமைப்புகள்' : 'LiveKit Server Config'}</span>
        </button>
      </div>

      {/* TAB A: CLASSES & INVITES */}
      {activeTab === 'classes' && (
        <div className="flex flex-col gap-6">
          {/* Create New Class Card */}
          <div className="create-class-card p-4 rounded-xl border border-subtle bg-card/50">
            <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0 mb-3">
              <Plus size={16} className="text-primary" />
              <span>{lang === 'ta' ? 'புதிய நேரலை வகுப்பு அட்டவணைப்படுத்துக' : 'Schedule New Live Yoga Class'}</span>
            </h3>

            <form onSubmit={handleCreateClass} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">
                  {lang === 'ta' ? 'வகுப்பு தலைப்பு' : 'Class Title'}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Morning Surya Namaskar & Pranayama"
                  required
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">
                  {lang === 'ta' ? 'நேரம் மற்றும் தேதி' : 'Date & Start Time'}
                </label>
                <input
                  type="datetime-local"
                  value={newStartsAt}
                  onChange={(e) => setNewStartsAt(e.target.value)}
                  required
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">
                  {lang === 'ta' ? 'கால அளவு (நிமிடம்)' : 'Duration (Minutes)'}
                </label>
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  required
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading"
                />
              </div>

              <div className="md:col-span-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingClass}
                  className="ya-btn ya-btn--primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  {isCreatingClass ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{lang === 'ta' ? 'வகுப்பைச் சேமிக்கவும்' : 'Save & Schedule Class'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Scheduled Classes List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-heading m-0 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'அட்டவணைப்படுத்தப்பட்ட வகுப்புகள்' : 'Scheduled Classes & Active Invites'}</span>
              </h3>
              <button
                type="button"
                onClick={fetchClasses}
                className="text-xs text-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RefreshCw size={12} className={classesLoading ? 'animate-spin' : ''} />
                <span>{lang === 'ta' ? 'புதுப்பி' : 'Refresh'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {classesList.length === 0 ? (
                <div className="text-center p-6 text-xs text-muted rounded-xl border border-subtle">
                  {lang === 'ta' ? 'இன்னும் வகுப்புகள் எதுவும் உருவாக்கப்படவில்லை.' : 'No scheduled classes found. Create your first class above!'}
                </div>
              ) : (
                classesList.map((c) => {
                  const currentInvite = inviteUrls[c.id];
                  return (
                    <div key={c.id} className="p-3.5 rounded-xl border border-subtle bg-card flex flex-col gap-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-heading m-0">{c.title}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="text-primary" />
                              <span>{new Date(c.starts_at).toLocaleString()}</span>
                            </span>
                            <span>•</span>
                            <span>{c.duration_minutes} mins</span>
                            <span>•</span>
                            <span className="font-mono text-[10px] bg-subtle px-1.5 py-0.5 rounded">
                              Room: {c.room_name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleGenerateInvite(c.id)}
                            className="ya-btn ya-btn--soft text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Link size={13} className="text-primary" />
                            <span>{lang === 'ta' ? 'அழைப்பு லிங்க் பெறுக' : 'Get Invite Link'}</span>
                          </button>

                          {onLaunchInstructorStudio && (
                            <button
                              type="button"
                              onClick={() => onLaunchInstructorStudio(c)}
                              className="ya-btn ya-btn--primary text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                            >
                              <Video size={13} />
                              <span>{lang === 'ta' ? 'பயிற்றுநராக துவங்க' : 'Launch as Instructor'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Display generated invite URL */}
                      {currentInvite && (
                        <div className="p-2 rounded-lg bg-subtle border border-primary/20 flex items-center justify-between gap-2 mt-1">
                          <div className="flex items-center gap-2 flex-1 overflow-hidden">
                            <Link size={13} className="text-primary flex-shrink-0" />
                            <span className="text-[11px] font-mono text-heading truncate">
                              {currentInvite}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(currentInvite, c.id)}
                            className="ya-btn ya-btn--primary text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer flex-shrink-0"
                          >
                            {copiedId === c.id ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedId === c.id ? (lang === 'ta' ? 'காப்பி ஆனது' : 'Copied!') : (lang === 'ta' ? 'காப்பி' : 'Copy')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: SERVER-BACKED ATTENDANCE AUDIT */}
      {activeTab === 'attendance' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-heading m-0 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'சர்வர் நேரலை வருகைப் பதிவேடு (SQLite)' : 'Server-Backed Attendance Audit (SQLite)'}</span>
              </h3>
              <p className="text-[11px] text-muted m-0">
                {lang === 'ta' ? 'மாணவர்களின் நேரலை அமர்வு நேரம் மற்றும் வருகை விகிதம்' : 'Real-time verified WebRTC session logs calculated on class duration.'}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchAttendance}
              className="text-xs text-primary flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw size={12} className={attendanceLoading ? 'animate-spin' : ''} />
              <span>{lang === 'ta' ? 'புதுப்பி' : 'Refresh Logs'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-subtle bg-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-subtle bg-subtle/50 text-muted font-bold text-[11px]">
                  <th className="p-2.5">{lang === 'ta' ? 'மாணவர் பெயர்' : 'Student Name'}</th>
                  <th className="p-2.5">{lang === 'ta' ? 'ஈமெயில் / தொலைபேசி' : 'Email / Phone'}</th>
                  <th className="p-2.5">{lang === 'ta' ? 'வகுப்பு' : 'Class'}</th>
                  <th className="p-2.5">{lang === 'ta' ? 'இணைந்த நேரம்' : 'Joined At'}</th>
                  <th className="p-2.5">{lang === 'ta' ? 'நேரம் (நிமிடம்)' : 'Duration'}</th>
                  <th className="p-2.5">{lang === 'ta' ? 'வருகை %' : 'Attendance Rate'}</th>
                  <th className="p-2.5">{lang === 'ta' ? 'நிலை' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-muted">
                      {lang === 'ta' ? 'வருகைப் பதிவுகள் எதுவும் இல்லை.' : 'No verified attendance sessions recorded yet.'}
                    </td>
                  </tr>
                ) : (
                  attendanceLogs.map((log, idx) => (
                    <tr key={idx} className="border-b border-subtle/50 hover:bg-subtle/30">
                      <td className="p-2.5 font-bold text-heading">{log.name}</td>
                      <td className="p-2.5 text-muted">
                        <div>{log.email}</div>
                        <div className="text-[10px]">{log.phone}</div>
                      </td>
                      <td className="p-2.5 font-medium">{log.classTitle}</td>
                      <td className="p-2.5 text-muted">
                        {log.joinedAt ? new Date(log.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="p-2.5 font-semibold text-heading">
                        {Math.round((log.durationSeconds || 0) / 60)} mins
                      </td>
                      <td className="p-2.5 font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (log.attendancePercent || 0) >= 70
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {log.attendancePercent || 0}%
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          log.status === 'joined' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-muted'
                        }`}>
                          {log.status === 'joined' ? '● Live Now' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: LIVEKIT SERVER CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="p-3.5 rounded-xl border border-subtle bg-card flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${livekitStatus?.configured ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <div>
                <strong className="text-xs text-heading block">
                  {livekitStatus?.configured ? 'LiveKit Cloud Connected' : 'LiveKit Credentials Needed'}
                </strong>
                <span className="text-[11px] text-muted font-mono">
                  {livekitStatus?.serverUrl || 'wss://your-project.livekit.cloud'}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              livekitStatus?.configured ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {livekitStatus?.configured ? 'Active' : 'Setup Required'}
            </span>
          </div>

          <form onSubmit={handleSaveLiveKitConfig} className="flex flex-col gap-3 p-4 rounded-xl border border-subtle bg-card">
            <h4 className="text-xs font-bold text-heading m-0">
              {lang === 'ta' ? 'லைவ்கிட் சர்வர் நற்சான்றிதழ்கள்' : 'Configure LiveKit Cloud Server'}
            </h4>
            <p className="text-[11px] text-muted m-0">
              {lang === 'ta'
                ? 'இலவச லைவ்கிட் கணக்கை https://cloud.livekit.io தளத்தில் துவங்கி உங்கள் URL மற்றும் கீகளை இங்கே உள்ளிடலாம்.'
                : 'Get free real-time video credentials at https://cloud.livekit.io and paste them below.'}
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted">LIVEKIT_URL</label>
              <input
                type="text"
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
                placeholder="wss://your-project.livekit.cloud"
                required
                className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted">LIVEKIT_API_KEY</label>
              <input
                type="text"
                value={configApiKey}
                onChange={(e) => setConfigApiKey(e.target.value)}
                placeholder="APIxxxxxxxxx"
                required
                className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted">LIVEKIT_API_SECRET</label>
              <input
                type="password"
                value={configApiSecret}
                onChange={(e) => setConfigApiSecret(e.target.value)}
                placeholder="secretxxxxxxxx"
                required
                className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={savingConfig}
              className="ya-btn ya-btn--primary py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              {savingConfig ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>{lang === 'ta' ? 'அமைப்புகளைச் சேமிக்கவும்' : 'Save LiveKit Credentials'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
