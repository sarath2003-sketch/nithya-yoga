import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Radio } from 'lucide-react';
import LiveYogaClassRoom from './LiveYogaClassRoom';
import { apiFetch } from '../utils/api';
import { DEFAULT_USER } from '../utils/storage';

export default function StudentLiveStudioRoute({ lang = 'en' }) {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [studentSession, setStudentSession] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkStudentAndSession() {
      // 1. Check if student has filled their Name and Mobile Number
      let storedStudent = null;
      try {
        const raw = localStorage.getItem('nithya_student_session');
        if (raw) storedStudent = JSON.parse(raw);
      } catch (_) {}

      const cleanPhone = (storedStudent?.phone || '').replace(/\D/g, '');
      const isValidStudent = storedStudent && storedStudent.name && cleanPhone.length >= 10 &&
        !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram', 'NITHYA Master', 'Student'].includes(storedStudent.name);

      if (!isValidStudent) {
        if (isMounted) {
          navigate(`/student/join/${encodeURIComponent(sessionId)}`);
        }
        return;
      }

      setStudentSession(storedStudent);

      // 2. Verify session status on backend
      try {
        const res = await apiFetch(`/api/live/session/${encodeURIComponent(sessionId)}`);
        if (isMounted) {
          if (res && res.exists && res.class) {
            if (res.status === 'ended' || res.ended) {
              // Redirect to join page which shows "Class Ended" notice
              navigate(`/student/join/${encodeURIComponent(sessionId)}`);
              return;
            }
            setSessionData(res.class);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Live session lookup error:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkStudentAndSession();
    return () => { isMounted = false; };
  }, [sessionId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070514] text-white flex flex-col items-center justify-center p-4">
        <RefreshCw size={36} className="text-purple-400 animate-spin mb-4" />
        <h3 className="text-base font-bold text-purple-200">
          {lang === 'ta' ? 'வகுப்பறையுடன் இணைக்கப்படுகிறது...' : 'Connecting to Live Yoga Classroom...'}
        </h3>
        <p className="text-xs text-purple-300/50 mt-1">NITHYA Yoga Live Stream</p>
      </div>
    );
  }

  const activeClass = sessionData || {
    id: sessionId,
    title: 'Live Yoga Class',
    name: 'Live Yoga Class',
    courseName: 'Live Yoga Session',
    room_name: sessionId?.startsWith('nithya-') ? sessionId : `nithya-${sessionId}`,
    status: 'live',
    instructor: 'NITHYA Master'
  };

  const user = {
    ...DEFAULT_USER,
    name: studentSession?.name || 'Yoga Student',
    phone: studentSession?.phone || '',
    role: 'student',
    isInstructor: false
  };

  return (
    <div className="min-h-screen bg-[#05051B] text-white">
      {/* Student Studio Header */}
      <div className="bg-[#120E2C] border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
        </button>
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-purple-200">
            {lang === 'ta' ? 'நேரலை யோகா வகுப்பு (மாணவர் பகுதி)' : 'Live Yoga Classroom (Student)'}
          </span>
        </div>
      </div>

      <div className="p-2 sm:p-4 max-w-7xl mx-auto">
        <LiveYogaClassRoom
          activeClass={activeClass}
          user={user}
          sessionId={sessionId}
          isTeacherMode={false}
          onLeaveClass={() => navigate('/')}
          onNavigateAdmin={() => {}}
          onRecordAttendance={() => {}}
          lang={lang}
        />
      </div>
    </div>
  );
}
