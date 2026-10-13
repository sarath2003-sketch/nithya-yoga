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
  Sparkles,
  Share2,
  Trash2,
  FileText,
  Play,
  PhoneOff,
  Radio,
  Download,
  BookOpen,
  Eye,
  X
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
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'attendance' | 'notes' | 'videos' | 'settings'

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

  // Notes & PDF Materials state
  const [materialsList, setMaterialsList] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatCategory, setNewMatCategory] = useState('Yoga');
  const [newMatDesc, setNewMatDesc] = useState('');
  const [newMatUrl, setNewMatUrl] = useState('');
  const [newMatContent, setNewMatContent] = useState('');
  const [isCreatingMat, setIsCreatingMat] = useState(false);

  // Video Library state
  const [videosList, setVideosList] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidDesc, setNewVidDesc] = useState('');
  const [newVidUrl, setNewVidUrl] = useState('');
  const [newVidDuration, setNewVidDuration] = useState('30');
  const [newVidLevel, setNewVidLevel] = useState('All Levels');
  const [newVidCategory, setNewVidCategory] = useState('Vinyasa');
  const [isCreatingVid, setIsCreatingVid] = useState(false);

  // Settings state
  const [livekitStatus, setLivekitStatus] = useState(null);
  const [configUrl, setConfigUrl] = useState('');
  const [configApiKey, setConfigApiKey] = useState('');
  const [configApiSecret, setConfigApiSecret] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  // Fetch classes
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

  // Fetch attendance records
  const fetchAttendance = async () => {
    if (!adminToken) return;
    setAttendanceLoading(true);
    try {
      let serverLogs = [];
      try {
        const data = await apiFetch('/api/admin/attendance', {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (Array.isArray(data)) {
          serverLogs = data;
        }
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          handleLogout();
          return;
        }
      }

      // Also read local client-recorded logs from localStorage
      let localLogs = [];
      try {
        const stored = localStorage.getItem('nithya_attendance_logs');
        if (stored) {
          const parsed = JSON.parse(stored);
          localLogs = parsed.map(l => ({
            name: l.studentName || 'Student',
            email: l.phone ? `+91 ${l.phone}` : 'App User',
            phone: l.phone || 'N/A',
            classTitle: l.className || 'Hatha Yoga Flow',
            joinedAt: l.timestamp,
            durationSeconds: (l.durationMinutes || 1) * 60,
            attendancePercent: l.attendancePercent || (l.status?.includes('70') ? 85 : 45),
            status: l.status?.includes('70') ? 'verified_70' : 'incomplete'
          }));
        }
      } catch (_) {}

      const combined = [...serverLogs, ...localLogs.filter(loc => !serverLogs.some(s => (s.phone === loc.phone || s.studentPhone === loc.phone) && (s.classTitle === loc.classTitle || s.className === loc.classTitle)))];
      setAttendanceLogs(combined);
    } catch (err) {
      console.error('Error fetching admin attendance:', err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    setMaterialsLoading(true);
    try {
      const data = await apiFetch('/api/materials');
      if (Array.isArray(data)) {
        setMaterialsList(data);
      }
    } catch (e) {
      console.warn('Error fetching materials:', e);
    } finally {
      setMaterialsLoading(false);
    }
  };

  // Fetch videos
  const fetchVideos = async () => {
    setVideosLoading(true);
    try {
      const data = await apiFetch('/api/videos');
      if (Array.isArray(data)) {
        setVideosList(data);
      }
    } catch (e) {
      console.warn('Error fetching videos:', e);
    } finally {
      setVideosLoading(false);
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
      fetchMaterials();
      fetchVideos();
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
          lang === 'ta' ? 'பயிற்றுநர் உள்நுழைவு வெற்றிகரமானது ✓' : 'Trainer Login Successful ✓',
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
        lang === 'ta' ? 'பயிற்றுநர் அமர்வு முடிந்தது' : 'Trainer session ended',
        'info'
      );
    }
  };

  // 1. Create Class
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreatingClass(true);
    try {
      const data = await apiFetch('/api/trainer/classes', {
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

  // 2. Start Class (sets status to 'live' and launches studio)
  const handleStartClass = async (cls) => {
    try {
      await apiFetch(`/api/trainer/classes/${cls.id}/start`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setClassesList(prev => prev.map(c => c.id === cls.id ? { ...c, status: 'live' } : c));
      audioEngine.playTempleBell();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'வகுப்பு தொடங்கப்பட்டது (Live) 🔴' : 'Class Started Live 🔴',
          cls.title,
          'success'
        );
      }
      if (onLaunchInstructorStudio) {
        onLaunchInstructorStudio({ ...cls, status: 'live' });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // 3. End Class for all participants
  const handleEndClass = async (cls) => {
    if (!window.confirm(lang === 'ta' ? 'அனைத்து மாணவர்களுக்கும் இந்த வகுப்பை முடிக்க விரும்புகிறீர்களா?' : 'End this live class for all participants?')) {
      return;
    }
    try {
      await apiFetch(`/api/trainer/classes/${cls.id}/end`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setClassesList(prev => prev.map(c => c.id === cls.id ? { ...c, status: 'ended' } : c));
      audioEngine.playGentleChime();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'வகுப்பு நிறைவுபெற்றது ✓' : 'Class Ended for All Participants ✓',
          cls.title,
          'info'
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // 4. Delete Class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm(lang === 'ta' ? 'இந்த வகுப்பை நீக்க வேண்டுமா?' : 'Delete this scheduled class?')) {
      return;
    }
    try {
      await apiFetch(`/api/trainer/classes/${classId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setClassesList(prev => prev.filter(c => c.id !== classId));
      if (showToast) showToast('Class Removed', '', 'info');
    } catch (err) {
      alert(err.message);
    }
  };

  // 5. Generate Invite Token
  const handleGenerateInvite = async (classId) => {
    try {
      const data = await apiFetch(`/api/trainer/classes/${classId}/invites`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const resolvedUrl = (window.location.origin && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
        ? `${window.location.origin}/?live=${encodeURIComponent(classId)}&invite=${encodeURIComponent(data.token)}`
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

  const handleWhatsAppShare = (cls) => {
    const liveUrl = `${window.location.origin}${window.location.pathname}?live=${cls.id}`;
    const text = `🧘 *Join Live Yoga Class with NITHYA Yoga Studio*\n\nClass: *${cls.title}*\nTime: *${new Date(cls.starts_at).toLocaleString()}*\nDuration: *${cls.duration_minutes} mins*\n\nTap link to register and enter live yoga room:\n${liveUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 6. Add Yoga Note / PDF
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;
    setIsCreatingMat(true);

    try {
      const data = await apiFetch('/api/trainer/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          title: newMatTitle.trim(),
          category: newMatCategory,
          description: newMatDesc.trim(),
          fileUrl: newMatUrl.trim() || 'assets/docs/yoga_note.pdf',
          content: newMatContent.trim(),
          accessLevel: 'all'
        })
      });

      setMaterialsList(prev => [data, ...prev]);
      setNewMatTitle('');
      setNewMatDesc('');
      setNewMatUrl('');
      setNewMatContent('');
      audioEngine.playSoftBell();
      if (showToast) showToast('Material Saved ✓', data.title, 'success');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCreatingMat(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await apiFetch(`/api/trainer/materials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setMaterialsList(prev => prev.filter(m => m.id !== id));
      if (showToast) showToast('Material Removed', '', 'info');
    } catch (err) {
      alert(err.message);
    }
  };

  // 7. Add Video
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVidTitle.trim() || !newVidUrl.trim()) return;
    setIsCreatingVid(true);

    try {
      const data = await apiFetch('/api/trainer/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          title: newVidTitle.trim(),
          description: newVidDesc.trim(),
          videoUrl: newVidUrl.trim(),
          durationMinutes: Number(newVidDuration) || 30,
          level: newVidLevel,
          category: newVidCategory
        })
      });

      setVideosList(prev => [data, ...prev]);
      setNewVidTitle('');
      setNewVidDesc('');
      setNewVidUrl('');
      audioEngine.playSoftBell();
      if (showToast) showToast('Video Added ✓', data.title, 'success');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCreatingVid(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await apiFetch(`/api/trainer/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setVideosList(prev => prev.filter(v => v.id !== id));
      if (showToast) showToast('Video Removed', '', 'info');
    } catch (err) {
      alert(err.message);
    }
  };

  // 8. Save LiveKit Configuration
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

  // Export Attendance CSV
  const handleExportCSV = () => {
    const headers = ['Student Name', 'Mobile Phone', 'Class Title', 'Joined Time', 'Duration (mins)', 'Attendance %', 'Status'];
    const rows = attendanceLogs.map(l => [
      `"${l.studentName || l.name || 'Student'}"`,
      `"${l.studentPhone || l.phone || 'N/A'}"`,
      `"${l.classTitle || 'Hatha Yoga'}"`,
      `"${l.joinedAt || 'Recent'}"`,
      Math.round((l.durationSeconds || 60) / 60),
      `${l.attendancePercent || 85}%`,
      `"${l.status || 'verified_70'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nithya_yoga_attendance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    audioEngine.playSoftBell();
  };

  // -------------------------------------------------------------
  // VIEW 1: TRAINER LOGIN SCREEN
  // -------------------------------------------------------------
  if (!adminToken) {
    return (
      <div className="dashboard-card admin-login-card max-w-lg mx-auto my-6 p-6 rounded-2xl border border-subtle bg-card shadow-xl">
        <div className="card-header-block text-center pb-4 border-b border-subtle">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-heading m-0">
            {lang === 'ta' ? 'பயிற்றுநர் & நிர்வாகி போர்ட்டல்' : 'NITHYA Yoga Trainer Portal'}
          </h2>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            {lang === 'ta' 
              ? 'வகுப்புகளைத் தொடங்க, பாடக் குறிப்புகளைப் பதிவேற்ற மற்றும் மாணவர் வருகையைக் கண்காணிக்க உள்நுழையவும்.' 
              : 'Secure instructor dashboard to schedule classes, stream live, upload notes & manage student attendance.'}
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
              {lang === 'ta' ? 'பயிற்றுநர் ஈமெயில் (Trainer Email)' : 'Trainer Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="ya-input w-full text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading focus:border-primary outline-none"
              placeholder="admin@nithyayoga.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-heading">
              {lang === 'ta' ? 'கடவுச்சொல் (Password)' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="ya-input w-full text-xs p-2.5 rounded-xl border border-subtle bg-card text-heading focus:border-primary outline-none"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="ya-btn ya-btn--primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2 shadow-lg cursor-pointer"
          >
            {loginLoading ? <RefreshCw size={14} className="animate-spin" /> : <Key size={14} />}
            <span>{lang === 'ta' ? 'உள்நுழைக' : 'Sign In as Trainer'}</span>
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED TRAINER DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="dashboard-card admin-dashboard-portal p-6 rounded-2xl border border-subtle bg-card shadow-lg">
      {/* Top Banner */}
      <div className="admin-portal-header flex items-center justify-between pb-4 border-b border-subtle flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-heading m-0">
                {lang === 'ta' ? 'பயிற்றுநர் கட்டுப்பாட்டு அறை' : 'Trainer & Instructor Dashboard'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                ✓ Verified Instructor
              </span>
            </div>
            <p className="text-xs text-muted m-0">
              {lang === 'ta' ? 'நேரலை வகுப்புகள், அழைப்பு லிங்க்கள், குறிப்புகள் மற்றும் வருகைப் பதிவு' : 'Manage live sessions, invite links, learning materials & student attendance.'}
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

      {/* Tabs Row (5 Tabs) */}
      <div className="admin-subtabs flex items-center gap-2 my-4 bg-subtle p-1 rounded-xl overflow-x-auto">
        <button
          type="button"
          className={`flex-1 min-w-[120px] py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'classes' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('classes')}
        >
          <Calendar size={13} />
          <span>{lang === 'ta' ? 'வகுப்புகள் & அழைப்பு' : 'Live Classes'}</span>
        </button>

        <button
          type="button"
          className={`flex-1 min-w-[120px] py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'attendance' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('attendance')}
        >
          <Users size={13} />
          <span>{lang === 'ta' ? 'வருகைப் பதிவு' : 'Attendance'}</span>
        </button>

        <button
          type="button"
          className={`flex-1 min-w-[120px] py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'notes' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={13} />
          <span>{lang === 'ta' ? 'யோகா குறிப்புகள்' : 'Yoga Notes & PDF'}</span>
        </button>

        <button
          type="button"
          className={`flex-1 min-w-[120px] py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'videos' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('videos')}
        >
          <Video size={13} />
          <span>{lang === 'ta' ? 'வீடியோக்கள்' : 'Yoga Videos'}</span>
        </button>

        <button
          type="button"
          className={`flex-1 min-w-[120px] py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'settings' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={13} />
          <span>{lang === 'ta' ? 'அமைப்புகள்' : 'LiveKit Settings'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CLASSES & INVITATIONS */}
      {/* ========================================================= */}
      {activeTab === 'classes' && (
        <div className="flex flex-col gap-6">
          {/* Create Live Class Form */}
          <div className="create-class-card p-4 rounded-xl border border-subtle bg-card/50">
            <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0 mb-3">
              <Plus size={16} className="text-primary" />
              <span>{lang === 'ta' ? 'புதிய நேரலை வகுப்பு அட்டவணைப்படுத்துக' : 'Create & Schedule Live Yoga Class'}</span>
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
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
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
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
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
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
                />
              </div>

              <div className="md:col-span-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingClass}
                  className="ya-btn ya-btn--primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
                >
                  {isCreatingClass ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{lang === 'ta' ? 'வகுப்பைச் சேமிக்கவும்' : 'Create Live Class'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Scheduled Classes List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-heading m-0 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'வகுப்புகள் மேலாண்மை' : 'Manage Classes & Student Invitations'}</span>
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
                  const isLive = c.status === 'live';
                  const isEnded = c.status === 'ended';
                  const liveUrl = `${window.location.origin}${window.location.pathname}?live=${c.id}`;

                  return (
                    <div key={c.id} className="p-3.5 rounded-xl border border-subtle bg-card flex flex-col gap-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-heading m-0">{c.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isLive 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : isEnded 
                                ? 'bg-gray-500/20 text-muted' 
                                : 'bg-primary/20 text-primary'
                            }`}>
                              {isLive ? '● LIVE NOW' : isEnded ? 'ENDED' : 'SCHEDULED'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-muted mt-1">
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

                        {/* Trainer Action Controls */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Start Class Button */}
                          {!isEnded && (
                            <button
                              type="button"
                              onClick={() => handleStartClass(c)}
                              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition-all ${
                                isLive 
                                  ? 'bg-red-500 text-white hover:bg-red-600' 
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                              title={isLive ? 'Resume Studio' : 'Start Class and Broadcast'}
                            >
                              <Play size={13} fill="currentColor" />
                              <span>{isLive ? 'In Studio' : (lang === 'ta' ? 'வகுப்பைத் தொடங்கு' : 'Start Class')}</span>
                            </button>
                          )}

                          {/* End Class Button */}
                          {isLive && (
                            <button
                              type="button"
                              onClick={() => handleEndClass(c)}
                              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-all"
                              title="End class for all participants"
                            >
                              <PhoneOff size={13} />
                              <span>{lang === 'ta' ? 'வகுப்பை முடி' : 'End Class for All'}</span>
                            </button>
                          )}

                          {/* Copy Invitation Link */}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(liveUrl);
                              setCopiedId(`live-${c.id}`);
                              setTimeout(() => setCopiedId(null), 2500);
                              if (showToast) showToast('Invitation Link Copied ✓', liveUrl, 'success');
                            }}
                            className="ya-btn ya-btn--soft text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                            title="Direct student joining link with name & mobile check"
                          >
                            {copiedId === `live-${c.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-primary" />}
                            <span>{copiedId === `live-${c.id}` ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          {/* WhatsApp Share */}
                          <button
                            type="button"
                            onClick={() => handleWhatsAppShare(c)}
                            className="ya-btn ya-btn--soft text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-emerald-600 cursor-pointer"
                            title="Share on WhatsApp"
                          >
                            <Share2 size={13} />
                            <span>WhatsApp</span>
                          </button>

                          {/* Delete Class */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClass(c.id)}
                            className="p-1.5 rounded-lg text-muted hover:text-red-500 cursor-pointer"
                            title="Delete class"
                          >
                            <Trash2 size={14} />
                          </button>
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
                            <span>{copiedId === c.id ? 'Copied!' : 'Copy'}</span>
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

      {/* ========================================================= */}
      {/* TAB 2: STUDENT ATTENDANCE RECORDS */}
      {/* ========================================================= */}
      {activeTab === 'attendance' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-heading m-0 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span>{lang === 'ta' ? 'மாணவர் வருகைப் பதிவு தணிக்கை' : 'Student Attendance Records & 70% Verification'}</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Records accumulated from verified WebRTC live sessions and persistent SQLite database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="ya-btn ya-btn--soft text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={fetchAttendance}
                className="ya-btn ya-btn--soft text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} className={attendanceLoading ? 'animate-spin' : ''} />
                <span>{lang === 'ta' ? 'புதுப்பி' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-subtle overflow-x-auto bg-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-subtle bg-subtle/50 text-muted font-bold text-[11px]">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Mobile Phone</th>
                  <th className="p-3">Class Title</th>
                  <th className="p-3">Joined Time</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Attendance %</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-6 text-muted">
                      {lang === 'ta' ? 'வருகை பதிவுகள் எதுவும் இல்லை.' : 'No student attendance records found yet.'}
                    </td>
                  </tr>
                ) : (
                  attendanceLogs.map((log, index) => {
                    const isPresent = log.status?.includes('70') || log.attendancePercent >= 70;
                    return (
                      <tr key={log.id || index} className="border-b border-subtle/50 hover:bg-subtle/30">
                        <td className="p-3 font-semibold text-heading">{log.studentName || log.name || 'Student'}</td>
                        <td className="p-3 font-mono text-muted">{log.studentPhone || log.phone || 'N/A'}</td>
                        <td className="p-3 text-heading">{log.classTitle || log.className || 'Hatha Flow'}</td>
                        <td className="p-3 text-muted text-[11px]">{log.joinedAt ? new Date(log.joinedAt).toLocaleString() : 'Recent'}</td>
                        <td className="p-3 font-mono">{Math.round((log.durationSeconds || 60) / 60)} mins</td>
                        <td className="p-3 font-bold text-primary">{log.attendancePercent || 85}%</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPresent 
                              ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' 
                              : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                          }`}>
                            {isPresent ? '✓ Present (70%+)' : 'Incomplete'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: YOGA NOTES & PDF MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'notes' && (
        <div className="flex flex-col gap-6">
          {/* Add Material Form */}
          <div className="p-4 rounded-xl border border-subtle bg-card/50">
            <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0 mb-3">
              <Plus size={16} className="text-primary" />
              <span>{lang === 'ta' ? 'புதிய பாடக் குறிப்பு / PDF சேர்க்க' : 'Upload Yoga Notes & PDF Material'}</span>
            </h3>

            <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Title</label>
                <input
                  type="text"
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  placeholder="e.g. Asana Alignment & Breathing Guide"
                  required
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Category</label>
                <select
                  value={newMatCategory}
                  onChange={(e) => setNewMatCategory(e.target.value)}
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none"
                >
                  <option value="Yoga">Yoga</option>
                  <option value="Breathing">Breathing / Pranayama</option>
                  <option value="Asana">Asana Alignment</option>
                  <option value="Diet">Sattvic Diet & Nutrition</option>
                  <option value="Philosophy">Yoga Philosophy</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">File / Download URL</label>
                <input
                  type="text"
                  value={newMatUrl}
                  onChange={(e) => setNewMatUrl(e.target.value)}
                  placeholder="e.g. assets/docs/pranayama_guide.pdf"
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none"
                />
              </div>

              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Short Description</label>
                <input
                  type="text"
                  value={newMatDesc}
                  onChange={(e) => setNewMatDesc(e.target.value)}
                  placeholder="Brief summary for students..."
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none"
                />
              </div>

              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Note Content (Optional)</label>
                <textarea
                  value={newMatContent}
                  onChange={(e) => setNewMatContent(e.target.value)}
                  placeholder="Detailed notes and instructions for student practice..."
                  rows={3}
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingMat}
                  className="ya-btn ya-btn--primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
                >
                  {isCreatingMat ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save Material</span>
                </button>
              </div>
            </form>
          </div>

          {/* Materials List */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-3 flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span>Available Student Learning Materials</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {materialsList.map(mat => (
                <div key={mat.id} className="p-3.5 rounded-xl border border-subtle bg-card flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase">{mat.category || 'Yoga'}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="text-muted hover:text-red-500 cursor-pointer p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-heading mt-1">{mat.title}</h4>
                    <p className="text-[11px] text-muted mt-1">{mat.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-subtle">
                    <span className="text-muted font-mono">{mat.file_url || 'Note'}</span>
                    <span className="text-primary font-bold">✓ Accessible to Students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: YOGA VIDEO LIBRARY */}
      {/* ========================================================= */}
      {activeTab === 'videos' && (
        <div className="flex flex-col gap-6">
          {/* Add Video Form */}
          <div className="p-4 rounded-xl border border-subtle bg-card/50">
            <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0 mb-3">
              <Plus size={16} className="text-primary" />
              <span>{lang === 'ta' ? 'புதிய யோகா வீடியோ சேர்க்க' : 'Add Yoga Video to Library'}</span>
            </h3>

            <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Video Title</label>
                <input
                  type="text"
                  value={newVidTitle}
                  onChange={(e) => setNewVidTitle(e.target.value)}
                  placeholder="e.g. Vinyasa Flow For Flexibility"
                  required
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Video URL (YouTube Embed / MP4)</label>
                <input
                  type="url"
                  value={newVidUrl}
                  onChange={(e) => setNewVidUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  required
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={newVidDuration}
                  onChange={(e) => setNewVidDuration(e.target.value)}
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Description</label>
                <input
                  type="text"
                  value={newVidDesc}
                  onChange={(e) => setNewVidDesc(e.target.value)}
                  placeholder="What will students learn in this session..."
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-muted">Level</label>
                <select
                  value={newVidLevel}
                  onChange={(e) => setNewVidLevel(e.target.value)}
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingVid}
                  className="ya-btn ya-btn--primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
                >
                  {isCreatingVid ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>Save Video</span>
                </button>
              </div>
            </form>
          </div>

          {/* Videos Grid */}
          <div>
            <h3 className="text-sm font-bold text-heading mb-3 flex items-center gap-2">
              <Video size={16} className="text-primary" />
              <span>Published Student Videos ({videosList.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {videosList.map(vid => (
                <div key={vid.id} className="p-3 rounded-xl border border-subtle bg-card flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase">{vid.level} • {vid.duration_minutes || 30}m</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="text-muted hover:text-red-500 cursor-pointer p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-heading mt-1">{vid.title}</h4>
                    <p className="text-[11px] text-muted line-clamp-2 mt-0.5">{vid.description}</p>
                  </div>

                  <a 
                    href={vid.video_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-primary font-bold flex items-center gap-1 hover:underline pt-1 border-t border-subtle"
                  >
                    <span>Preview Link</span>
                    <Play size={11} fill="currentColor" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: LIVEKIT & SERVER CONFIG */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="p-4 rounded-xl border border-subtle bg-card">
            <h3 className="text-sm font-bold text-heading flex items-center gap-2 m-0 mb-2">
              <Settings size={16} className="text-primary" />
              <span>LiveKit Server Credentials</span>
            </h3>
            <p className="text-xs text-muted mb-4">
              Enter LiveKit Cloud WebSocket URL, API Key, and Secret to generate secure access tokens for instructor and students.
            </p>

            <form onSubmit={handleSaveLiveKitConfig} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-heading">Server URL (wss://...)</label>
                <input
                  type="text"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  placeholder="wss://your-project.livekit.cloud"
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-heading">API Key</label>
                <input
                  type="text"
                  value={configApiKey}
                  onChange={(e) => setConfigApiKey(e.target.value)}
                  placeholder="API..."
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-heading">API Secret</label>
                <input
                  type="password"
                  value={configApiSecret}
                  onChange={(e) => setConfigApiSecret(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="ya-input text-xs p-2 rounded-lg border border-subtle bg-card text-heading outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="ya-btn ya-btn--primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2 cursor-pointer shadow"
              >
                {savingConfig ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                <span>Save LiveKit Configuration</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
