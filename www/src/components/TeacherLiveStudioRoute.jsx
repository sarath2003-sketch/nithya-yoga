import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';
import LiveYogaClassRoom from './LiveYogaClassRoom';
import { apiFetch } from '../utils/api';
import { DEFAULT_USER } from '../utils/storage';

export default function TeacherLiveStudioRoute({ lang = 'en' }) {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(true);
  const [authError, setAuthError] = useState('');
  const [teacher, setTeacher] = useState(null);
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyAndLoad() {
      const token = localStorage.getItem('nithya_teacher_token') || localStorage.getItem('nithya_admin_token');

      if (!token) {
        if (isMounted) {
          navigate('/teacher/login');
        }
        return;
      }

      try {
        // Strict server-side verification of teacher JWT
        const verifyRes = await apiFetch('/api/teacher/verify', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!isMounted) return;

        if (!verifyRes || !verifyRes.ok || !verifyRes.user) {
          throw new Error('Teacher authorization rejected.');
        }

        setTeacher(verifyRes.user);

        // Fetch or create class session info
        try {
          const sessRes = await apiFetch(`/api/live/session/${encodeURIComponent(sessionId)}`);
          if (isMounted && sessRes && sessRes.class) {
            setClassData(sessRes.class);
          }
        } catch (_) {}

        setIsVerifying(false);
      } catch (err) {
        console.warn('Teacher live access denied:', err);
        if (isMounted) {
          localStorage.removeItem('nithya_teacher_token');
          localStorage.removeItem('nithya_admin_token');
          setAuthError(lang === 'ta' ? 'அனுமதி மறுக்கப்பட்டது. உள்நுழையவும்.' : 'Unauthorized. Please log in as a teacher.');
          setIsVerifying(false);
          setTimeout(() => navigate('/teacher/login'), 1200);
        }
      }
    }

    verifyAndLoad();
    return () => { isMounted = false; };
  }, [sessionId, navigate, lang]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#070514] text-white flex flex-col items-center justify-center p-4">
        <RefreshCw size={36} className="text-purple-400 animate-spin mb-4" />
        <h3 className="text-base font-bold text-purple-200">
          {lang === 'ta' ? 'பயிற்றுநர் அனுமதி சரிபார்க்கப்படுகிறது...' : 'Verifying Teacher Authorization on Server...'}
        </h3>
        <p className="text-xs text-purple-300/50 mt-1">Host Studio Security Guard</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#070514] text-white flex flex-col items-center justify-center p-4">
        <ShieldAlert size={44} className="text-rose-400 mb-3" />
        <h3 className="text-lg font-bold text-rose-300 mb-2">{authError}</h3>
        <button
          onClick={() => navigate('/teacher/login')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white"
        >
          {lang === 'ta' ? 'பயிற்றுநர் உள்நுழைவு' : 'Go to Teacher Login'}
        </button>
      </div>
    );
  }

  const activeClass = classData || {
    id: sessionId,
    title: 'Hatha Yoga Flow & Alignment',
    name: 'Hatha Yoga Flow & Alignment',
    courseName: 'Live Yoga Studio',
    room_name: sessionId?.startsWith('nithya-') ? sessionId : `nithya-${sessionId}`,
    status: 'live',
    instructor: teacher?.name || 'NITHYA Master'
  };

  const user = {
    ...DEFAULT_USER,
    name: teacher?.name || 'NITHYA Master',
    email: teacher?.email || 'master@nithyayoga.com',
    role: 'trainer',
    isInstructor: true
  };

  return (
    <div className="min-h-screen bg-[#05051B] text-white">
      {/* Studio Top Banner Bar */}
      <div className="bg-[#120E2C] border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'ta' ? 'கட்டுப்பாட்டு அறைக்குத் திரும்பு' : 'Back to Teacher Dashboard'}</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-purple-200">
            {lang === 'ta' ? 'பயிற்றுநர் கட்டுப்பாட்டு அறை (Host)' : 'Host Studio: Teacher Mode'}
          </span>
        </div>
      </div>

      <div className="p-2 sm:p-4 max-w-7xl mx-auto">
        <LiveYogaClassRoom
          activeClass={activeClass}
          user={user}
          sessionId={sessionId}
          isTeacherMode={true}
          onLeaveClass={() => navigate('/teacher/dashboard')}
          onNavigateAdmin={() => navigate('/teacher/dashboard')}
          onRecordAttendance={() => {}}
          lang={lang}
        />
      </div>
    </div>
  );
}
