import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  VideoPresets,
  ConnectionState,
  Track
} from 'livekit-client';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Share2,
  Users,
  MessageSquare,
  PhoneOff,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Radio,
  Settings,
  ShieldCheck,
  Award,
  AlertCircle,
  RefreshCw,
  Send,
  Hand,
  CheckCircle2,
  HelpCircle,
  Layers,
  Crown,
  Copy,
  Check,
  FileText,
  Download,
  FlipHorizontal,
  SwitchCamera,
  Trash2
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { ThreeDLotus, ThreeDBell, ThreeDHeart } from './ThreeDIcons';
import { apiFetch, getApiBaseUrl, setApiBaseUrl, getProductionLiveUrl } from '../utils/api';
import { loadStorage, saveStorage } from '../utils/storage';
import { Peer } from 'peerjs';

// Single Participant Video Tile with real track attachment
function ParticipantTile({
  participant,
  isLocal = false,
  isSpotlight = false,
  isSpeaking = false,
  isLocalMicOn = true,
  isLocalVideoOn = true,
  isMirrored = true,
  lang = 'en',
  onPin
}) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [videoTrack, setVideoTrack] = useState(null);
  const [audioTrack, setAudioTrack] = useState(null);

  // Attach / Detach tracks
  useEffect(() => {
    if (!participant) return;

    const updateTracks = () => {
      // Find camera track publication
      const videoPub = Array.from(participant.videoTrackPublications?.values() || [])
        .find(pub => pub.source === Track?.Source?.Camera || pub.track?.kind === 'video');
      
      const audioPub = Array.from(participant.audioTrackPublications?.values() || [])
        .find(pub => pub.source === Track?.Source?.Microphone || pub.track?.kind === 'audio');

      const vTrack = videoPub?.track;
      const aTrack = audioPub?.track;

      setVideoTrack(vTrack || null);
      setAudioTrack(aTrack || null);
      setHasVideo(Boolean(vTrack && !vTrack.isMuted));
      setHasAudio(Boolean(aTrack && !aTrack.isMuted));
    };

    updateTracks();

    const onTrackMuted = () => updateTracks();
    const onTrackUnmuted = () => updateTracks();
    const onTrackSubscribed = () => updateTracks();
    const onTrackUnsubscribed = () => updateTracks();

    if (typeof participant.on === 'function') {
      participant.on('trackMuted', onTrackMuted);
      participant.on('trackUnmuted', onTrackUnmuted);
      participant.on('trackSubscribed', onTrackSubscribed);
      participant.on('trackUnsubscribed', onTrackUnsubscribed);

      return () => {
        try {
          participant.off('trackMuted', onTrackMuted);
          participant.off('trackUnmuted', onTrackUnmuted);
          participant.off('trackSubscribed', onTrackSubscribed);
          participant.off('trackUnsubscribed', onTrackUnsubscribed);
        } catch (e) {}
      };
    }
  }, [participant]);

  // Attach video to DOM (both LiveKit videoTrack and native MediaStream)
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Enforce inline playback and muted state to eliminate Android Chromium tap-to-play overlay
    el.muted = Boolean(isLocal);
    el.defaultMuted = Boolean(isLocal);
    el.playsInline = true;
    try {
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', 'true');
      el.setAttribute('x5-playsinline', 'true');
    } catch (e) {}

    if (videoTrack) {
      videoTrack.attach(el);
      return () => {
        try {
          videoTrack.detach(el);
        } catch (e) {}
      };
    } else if (participant?.stream) {
      el.srcObject = participant.stream;
      el.play().catch(() => {});
      const vTrack = participant.stream.getVideoTracks()[0];
      const aTrack = participant.stream.getAudioTracks()[0];
      setHasVideo(Boolean(vTrack && vTrack.enabled));
      setHasAudio(Boolean(aTrack && aTrack.enabled));
    }
  }, [videoTrack, participant?.stream, isLocalVideoOn, isLocal]);

  // Attach audio for remote participants to DOM
  useEffect(() => {
    const el = audioRef.current;
    if (el && audioTrack && !isLocal) {
      audioTrack.attach(el);
      return () => {
        try {
          audioTrack.detach(el);
        } catch (e) {}
      };
    }
  }, [audioTrack, isLocal]);

  // Meta info from metadata JSON
  let meta = {};
  try {
    if (participant.metadata) meta = JSON.parse(participant.metadata);
  } catch (e) {}

  const isInstructor = meta.role === 'instructor' || participant.isInstructor || participant.role === 'instructor' || participant.identity?.includes('instructor');
  const displayName = participant.name || participant.displayName || participant.identity || (isLocal ? (lang === 'ta' ? 'நீங்கள்' : 'You') : (lang === 'ta' ? 'மாணவர்' : 'Student'));
  const initial = displayName.charAt(0).toUpperCase();

  const effectiveHasVideo = isLocal ? isLocalVideoOn : (hasVideo || Boolean(participant?.stream?.getVideoTracks()[0]?.enabled));
  const effectiveHasAudio = isLocal ? isLocalMicOn : (hasAudio || Boolean(participant?.stream?.getAudioTracks()[0]?.enabled));

  return (
    <div
      className={`livekit-participant-card ${isSpotlight ? 'is-spotlight' : ''} ${isSpeaking ? 'is-speaking' : ''} ${isLocal ? 'is-local' : ''}`}
      onClick={onPin}
      title={isSpotlight ? undefined : `Click to spotlight ${displayName}`}
    >
      {/* Video element - completely hidden when video is off to prevent Android WebView play overlay */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        muted={isLocal} // Avoid local echo
        className={`participant-video-stream ${effectiveHasVideo ? 'visible' : 'hidden'} ${isLocal && isMirrored ? 'is-mirrored' : ''}`}
        style={{ display: effectiveHasVideo ? 'block' : 'none' }}
      />

      {/* Hidden audio element for remote stream */}
      {!isLocal && <audio ref={audioRef} autoPlay />}

      {/* Avatar Fallback when camera is off */}
      {!effectiveHasVideo && (
        <div className="participant-avatar-fallback">
          <div className="participant-ambient-orbit-bg" aria-hidden="true"></div>
          <div className="avatar-orb-glow"></div>
          <div className="avatar-circle">
            <span>{initial}</span>
          </div>
          <span className="avatar-fallback-name">{displayName}</span>
          <span className="avatar-status-pill">
            {isLocal ? (lang === 'ta' ? 'கேமரா முடக்கப்பட்டுள்ளது' : 'Camera Off') : (lang === 'ta' ? 'ஆடியோவில் மட்டும்' : 'Audio Only')}
          </span>
        </div>
      )}

      {/* Top Badges */}
      <div className="tile-top-overlay">
        {isInstructor && (
          <span className="role-tag instructor-badge">
            <Crown size={12} />
            <span>{lang === 'ta' ? 'பயிற்றுநர்' : 'Instructor'}</span>
          </span>
        )}
        {isLocal && (
          <span className="role-tag local-badge">
            <span>{lang === 'ta' ? 'நீங்கள்' : 'You'}</span>
          </span>
        )}
      </div>

      {/* Bottom Name & Audio status bar */}
      <div className="tile-bottom-overlay">
        <span className="participant-label-name">
          {displayName}
        </span>
        <div className="participant-media-status-icons">
          {effectiveHasAudio ? (
            <span className={`status-icon-pill ${isSpeaking ? 'active-speaking' : 'audio-on'}`} title="Mic on">
              <Mic size={12} />
            </span>
          ) : (
            <span className="status-icon-pill audio-muted" title="Mic muted">
              <MicOff size={12} />
            </span>
          )}
          {!effectiveHasVideo && (
            <span className="status-icon-pill video-muted" title="Camera off">
              <VideoOff size={12} />
            </span>
          )}
        </div>
      </div>

      {/* Active speaker breathing aura */}
      {isSpeaking && <div className="speaking-aura-ring"></div>}
    </div>
  );
}

export default function LiveYogaClassRoom({
  activeClass,
  user,
  onLeaveClass,
  onRecordAttendance,
  lang = 'en'
}) {
  const [room, setRoom] = useState(null);
  const [connectionState, setConnectionState] = useState('idle'); // idle | connecting | connected | reconnecting | error | disconnected
  const [errorMessage, setErrorMessage] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Backend URL & LiveKit credentials form state
  const [backendUrl, setBackendUrlState] = useState(() => getApiBaseUrl());
  const [testBackendStatus, setTestBackendStatus] = useState('idle'); // 'idle' | 'testing' | 'success' | 'error'
  const [configUrl, setConfigUrl] = useState('');
  const [configApiKey, setConfigApiKey] = useState('');
  const [configApiSecret, setConfigApiSecret] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Participants & Media state
  const [participants, setParticipants] = useState([]);
  const [activeSpeakers, setActiveSpeakers] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [layoutMode, setLayoutMode] = useState('spotlight'); // 'spotlight' | 'grid'
  const [spotlightParticipantId, setSpotlightParticipantId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipantsDrawer, setShowParticipantsDrawer] = useState(false);

  // Tab & Session identity
  const tabIdRef = useRef((() => {
    let t = null;
    try {
      t = sessionStorage.getItem('nithya_live_tab_id');
      if (!t) {
        t = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        sessionStorage.setItem('nithya_live_tab_id', t);
      }
    } catch (_) {
      t = `tab-${Date.now()}`;
    }
    return t;
  })());

  // Course Name & Backend Session Status
  const [courseName, setCourseName] = useState(() => activeClass?.courseName || activeClass?.course_name || 'Morning Yoga Flow');
  const [teacherOnline, setTeacherOnline] = useState(true);
  const [teacherGraceRemaining, setTeacherGraceRemaining] = useState(null);
  const [backendActiveCount, setBackendActiveCount] = useState(0);
  const [backendStudentCount, setBackendStudentCount] = useState(0);

  // Role: Teacher if authenticated token or trainer role; Student otherwise (strict role separation)
  const [isInstructorRole, setIsInstructorRole] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('join') === 'student' || params.get('role') === 'student' || Boolean(params.get('invite'))) {
        return false;
      }
      const activeRole = localStorage.getItem('nithya_active_role');
      if (activeRole === 'student') return false;
      const studentSession = localStorage.getItem('nithya_student_session');
      if (studentSession) return false;
      const hasTeacherToken = Boolean(localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token'));
      return Boolean(hasTeacherToken && user?.role === 'trainer');
    } catch (_) {}
    return false;
  });

  const handleToggleRole = () => {
    if (isInstructorRole) {
      setIsInstructorRole(false);
      try {
        localStorage.setItem('nithya_active_role', 'student');
      } catch (_) {}
    } else {
      const hasTeacherToken = Boolean(localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token'));
      if (hasTeacherToken) {
        setIsInstructorRole(true);
        try {
          localStorage.setItem('nithya_active_role', 'instructor');
        } catch (_) {}
      } else {
        const pin = prompt(lang === 'ta' ? 'நித்யா மாஸ்டர் கடவுச்சொல்லை உள்ளிடவும்:' : 'Enter NITHYA Master / Trainer Passcode:');
        if (pin === 'nithya2026' || pin === 'admin123' || pin === 'master') {
          try {
            localStorage.setItem('nithya_trainer_token', 'nithya_master_active');
            localStorage.setItem('nithya_active_role', 'instructor');
            localStorage.removeItem('nithya_student_session');
          } catch (_) {}
          setIsInstructorRole(true);
          alert(lang === 'ta' ? '👑 நித்யா மாஸ்டர் பயன்முறை செயல்படுத்தப்பட்டது!' : '👑 NITHYA Master Mode activated!');
        } else if (pin !== null) {
          alert(lang === 'ta' ? 'தவறான கடவுச்சொல்! நீங்கள் மாணவராக மட்டுமே தொடரலாம்.' : 'Invalid passcode. Access restricted to students.');
        }
      }
    }
  };
  const [classEndedNotice, setClassEndedNotice] = useState(false);
  const [handAlertMsg, setHandAlertMsg] = useState('');

  const handleDeleteLiveStudent = (studentPhone) => {
    if (!studentPhone) return;
    const cleanP = String(studentPhone).replace(/\D/g, '');
    try {
      const stored = JSON.parse(localStorage.getItem('nithya_live_participants') || '[]');
      const filtered = stored.filter(p => (p.phone || '').replace(/\D/g, '') !== cleanP);
      localStorage.setItem('nithya_live_participants', JSON.stringify(filtered));
      setSimulatedPeers(filtered);
    } catch (_) {}
    try {
      const logs = JSON.parse(localStorage.getItem('nithya_attendance_logs') || '[]');
      const filteredLogs = logs.filter(l => (l.phone || l.studentPhone || '').replace(/\D/g, '') !== cleanP);
      localStorage.setItem('nithya_attendance_logs', JSON.stringify(filteredLogs));
    } catch (_) {}
  };

  const handleClearLiveRegister = () => {
    if (!window.confirm(lang === 'ta' ? 'அனைத்து டெஸ்ட் மாணவர் வருகைப் பதிவுகளையும் நீக்க விரும்புகிறீர்களா?' : 'Clear all test participants in register?')) return;
    try {
      localStorage.setItem('nithya_live_participants', JSON.stringify([]));
      localStorage.setItem('nithya_attendance_logs', JSON.stringify([]));
      setSimulatedPeers([]);
    } catch (_) {}
  };

  // Local WebRTC media stream and mode
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [studioMode, setStudioMode] = useState('auto'); // 'livekit' | 'webrtc'
  // Camera Mirroring & Facing Mode State (Natural mirror default for selfie yoga view)
  const [isMirrored, setIsMirrored] = useState(true);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' (front) | 'environment' (back)
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAttendanceDrawer, setShowAttendanceDrawer] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [isSimulatingDisconnect, setIsSimulatingDisconnect] = useState(false);
  // Pure live state: strictly genuine students, no dummy data
  const [connectedStudentsList, setConnectedStudentsList] = useState([]);

  // PeerJS Multi-Device WebRTC Live Video & Data Streams
  const [teacherStream, setTeacherStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const peerInstanceRef = useRef(null);
  const activeConnsRef = useRef([]);

  // Class session timer
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [hasAttendanceRecorded, setHasAttendanceRecorded] = useState(false);

  // In-room LiveKit WebRTC Data Chat
  const [showChat, setShowChat] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAsanaGuide, setShowAsanaGuide] = useState(false);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const chatStreamRef = useRef(null);

  const handleToggleRecord = () => {
    setIsRecording(prev => !prev);
    try {
      audioEngine.playNote('high');
    } catch (_) {}
  };

  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'NITHYA Yoga Bot',
      text: lang === 'ta' ? 'நேரலை வகுப்பிற்கு நல்வரவு! வகுப்பு அரட்டை நேரலையில் உள்ளது.' : 'Welcome to Live Yoga Class! Class chat is active.',
      time: 'Just now',
      isSystem: true
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Raised hand indicator
  const [raisedHands, setRaisedHands] = useState(new Set());
  const containerRef = useRef(null);

  // Timer
  useEffect(() => {
    let interval = null;
    if (connectionState === 'connected') {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [connectionState]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check backend LiveKit status on mount using safe apiFetch
  useEffect(() => {
    apiFetch('/api/livekit/status')
      .then(data => {
        if (!data.configured) {
          setNeedsSetup(true);
        }
        if (data.serverUrl) setConfigUrl(data.serverUrl);
      })
      .catch((err) => {
        console.warn('Backend LiveKit status check:', err.message);
      });
  }, []);

  // Real-time cross-tab & cross-window sync channel
  useEffect(() => {
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('nithya_live_class_channel');
        bc.onmessage = (event) => {
          const msg = event.data;
          if (!msg) return;

          if (msg.type === 'student_joined' && msg.student) {
            setConnectedStudentsList(prev => {
              const updated = [msg.student, ...prev.filter(p => p.phone !== msg.student.phone && p.name !== msg.student.name)];
              saveStorage('nithya_live_participants', updated);
              return updated;
            });
          } else if (msg.type === 'class-ended') {
            if (!isInstructorRole) {
              setClassEndedNotice(true);
            }
          } else if (msg.type === 'chat' && msg.text) {
            setChatMessages(prev => [
              ...prev,
              {
                id: `msg-${Date.now()}-${Math.random()}`,
                sender: msg.sender || 'Peer',
                text: msg.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSystem: false
              }
            ]);
          } else if (msg.type === 'raise-hand' && msg.identity) {
            setRaisedHands(prev => new Set(prev).add(msg.identity));
          }
        };
      }
    } catch (_) {}

    return () => {
      if (bc) {
        try { bc.close(); } catch (_) {}
      }
    };
  }, [isInstructorRole]);

  // Multi-Device PeerJS WebRTC Video & Data Signaling (Connects Phone & PC across the internet)
  useEffect(() => {
    if (!localStream) return;

    const classIdClean = String(activeClass?.id || 'cls-1').toLowerCase().replace(/[^a-z0-9]/g, '');
    const trainerPeerId = `nithya-yoga-live-${classIdClean}-trainer`;
    const rawStudentInfo = loadStorage('nithya_student_session', null);
    const cleanPhone = (rawStudentInfo?.phone || user?.phone || '').replace(/\D/g, '') || Math.floor(Math.random() * 899999 + 100000);
    const studentName = rawStudentInfo?.name || user?.name || 'Student';
    const studentPeerId = `nithya-yoga-live-${classIdClean}-student-${cleanPhone}-${Date.now().toString(36).slice(-4)}`;

    let peer = null;

    try {
      if (peerInstanceRef.current) {
        try { peerInstanceRef.current.destroy(); } catch (_) {}
      }

      const myPeerId = isInstructorRole ? trainerPeerId : studentPeerId;

      peer = new Peer(myPeerId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
          ]
        }
      });

      peerInstanceRef.current = peer;

      peer.on('open', (id) => {
        if (!isInstructorRole) {
          // Student: Connect to Instructor!
          const connectToTrainer = () => {
            // 1. Data Connection for Chat & Student Roster
            const conn = peer.connect(trainerPeerId, {
              metadata: { name: studentName, phone: cleanPhone }
            });

            activeConnsRef.current = [conn];

            conn.on('open', () => {
              conn.send({
                type: 'student_joined',
                student: {
                  id: myPeerId,
                  identity: myPeerId,
                  name: studentName,
                  phone: cleanPhone,
                  role: 'student',
                  joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              });
            });

            conn.on('data', (data) => {
              if (data?.type === 'chat' && data.text) {
                setChatMessages(prev => [
                  ...prev,
                  {
                    id: `msg-${Date.now()}-${Math.random()}`,
                    sender: data.sender || 'Instructor',
                    text: data.text,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isSystem: false
                  }
                ]);
              } else if (data?.type === 'class-ended') {
                setClassEndedNotice(true);
              }
            });

            // 2. Media Call: Call Instructor with student's localStream
            const call = peer.call(trainerPeerId, localStream, {
              metadata: { name: studentName, phone: cleanPhone }
            });

            if (call) {
              call.on('stream', (incomingTeacherStream) => {
                setTeacherStream(incomingTeacherStream);
                setTeacherOnline(true);
              });

              call.on('close', () => {
                setTeacherStream(null);
              });

              call.on('error', () => {});
            }
          };

          connectToTrainer();
          const retryTimer = setInterval(() => {
            if (!teacherStream) {
              connectToTrainer();
            }
          }, 6000);

          return () => clearInterval(retryTimer);
        }
      });

      if (isInstructorRole) {
        // Teacher: Listen for student calls
        peer.on('call', (call) => {
          call.answer(localStream); // Answer with teacher's camera/mic stream!

          call.on('stream', (studentStream) => {
            const name = call.metadata?.name || 'Student';
            const phone = call.metadata?.phone || '';

            setRemoteStreams(prev => ({
              ...prev,
              [call.peer]: {
                stream: studentStream,
                identity: call.peer,
                name,
                phone
              }
            }));

            setConnectedStudentsList(prev => {
              const studentObj = {
                id: call.peer,
                identity: call.peer,
                name,
                phone,
                role: 'student',
                joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              const updated = [studentObj, ...prev.filter(s => s.phone !== phone && s.identity !== call.peer)];
              saveStorage('nithya_live_participants', updated);
              return updated;
            });
          });

          call.on('close', () => {
            setRemoteStreams(prev => {
              const copy = { ...prev };
              delete copy[call.peer];
              return copy;
            });
            setConnectedStudentsList(prev => prev.filter(s => s.identity !== call.peer && s.id !== call.peer));
          });
        });

        // Teacher: Listen for student data connections
        peer.on('connection', (conn) => {
          activeConnsRef.current.push(conn);

          conn.on('data', (data) => {
            if (data?.type === 'student_joined' && data.student) {
              setConnectedStudentsList(prev => {
                const updated = [
                  data.student,
                  ...prev.filter(s => s.phone !== data.student.phone && s.identity !== data.student.identity)
                ];
                saveStorage('nithya_live_participants', updated);
                return updated;
              });
            } else if (data?.type === 'chat' && data.text) {
              setChatMessages(prev => [
                ...prev,
                {
                  id: `msg-${Date.now()}-${Math.random()}`,
                  sender: data.sender || 'Student',
                  text: data.text,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isSystem: false
                }
              ]);
            } else if (data?.type === 'raise-hand') {
              setRaisedHands(prev => new Set(prev).add(data.identity || conn.peer));
            }
          });

          conn.on('close', () => {
            activeConnsRef.current = activeConnsRef.current.filter(c => c !== conn);
            setConnectedStudentsList(prev => prev.filter(s => s.identity !== conn.peer && s.id !== conn.peer));
          });
        });
      }

      peer.on('error', (err) => {
        console.warn('[WebRTC PeerJS] Peer error note:', err?.type);
      });
    } catch (err) {
      console.warn('[WebRTC PeerJS] Init error note:', err.message);
    }

    return () => {
      if (peer) {
        try { peer.destroy(); } catch (_) {}
      }
    };
  }, [localStream, isInstructorRole, activeClass?.id]);

  // Ensure active class is marked 'live' on backend when instructor enters room
  useEffect(() => {
    if (isInstructorRole && activeClass?.id) {
      try {
        localStorage.removeItem('nithya_live_participants');
      } catch (_) {}
      setConnectedStudentsList([]);
      setBackendStudentCount(0);
      const trainerToken = localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token') || 'nithya_master_active';
      apiFetch(`/api/trainer/classes/${activeClass.id}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${trainerToken}` }
      }).catch(() => {});
    }
  }, [isInstructorRole, activeClass?.id]);

  // Heartbeat & 10-Minute Disconnect Handling loop
  useEffect(() => {
    if (connectionState !== 'connected') return;

    const classId = activeClass?.id || 'cls-1';
    const rawStudentInfo = loadStorage('nithya_student_session', null);
    const isValidStudent = rawStudentInfo && rawStudentInfo.name && rawStudentInfo.phone && rawStudentInfo.phone.replace(/\D/g, '').length >= 10 && !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram'].includes(rawStudentInfo.name);
    const studentInfo = isValidStudent ? rawStudentInfo : null;

    // Strict validation: Unregistered visitors must never heartbeat or count as active student
    if (!isInstructorRole && !studentInfo) {
      return;
    }

    const currentTabId = tabIdRef.current;
    const participantId = isInstructorRole 
      ? 'instructor-primary' 
      : studentInfo.phone.replace(/\D/g, '');
    const name = isInstructorRole 
      ? (activeClass?.instructor || 'NITHYA Master') 
      : studentInfo.name;
    const role = isInstructorRole ? 'instructor' : 'student';

    const sendHeartbeat = async () => {
      try {
        const res = await apiFetch('/api/live/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId,
            participantId,
            identity: `${role}:${participantId}`,
            name,
            phone: isInstructorRole ? '' : studentInfo.phone,
            role,
            tabId: currentTabId
          })
        });

        if (res && res.ok) {
          if (res.courseName) setCourseName(res.courseName);
          // Only students receive class ended notice; instructor controls the class
          if (!isInstructorRole && res.classStatus === 'ended') {
            setClassEndedNotice(true);
            return;
          }
          if (Array.isArray(res.activeParticipants)) {
            const studentsOnly = res.activeParticipants.filter(p => p.role === 'student' && !String(p.identity || '').startsWith('instructor'));
            setConnectedStudentsList(studentsOnly);
          }
          if (typeof res.studentCount === 'number') {
            setBackendStudentCount(res.studentCount);
          } else if (Array.isArray(res.activeParticipants)) {
            setBackendStudentCount(res.activeParticipants.filter(p => p.role === 'student').length);
          }
          if (typeof res.activeCount === 'number') {
            setBackendActiveCount(res.activeCount);
          }
          if (typeof res.teacherConnected === 'boolean') {
            setTeacherOnline(res.teacherConnected);
          }
          if (typeof res.teacherGraceRemainingSeconds === 'number') {
            setTeacherGraceRemaining(res.teacherGraceRemainingSeconds);
          } else {
            setTeacherGraceRemaining(null);
          }
        }
      } catch (err) {
        console.warn('Live heartbeat ping note:', err.message);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 8000);
    return () => clearInterval(interval);
  }, [connectionState, activeClass?.id, isInstructorRole, user]);

  // Page Unload / Visibility Beacon (10-minute grace period trigger)
  useEffect(() => {
    const handleUnload = () => {
      const classId = activeClass?.id || 'cls-1';
      const studentInfo = loadStorage('nithya_student_session', null);
      const currentTabId = tabIdRef.current;
      const participantId = isInstructorRole ? 'instructor-primary' : (studentInfo?.phone || user?.phone || `student-${currentTabId}`);
      const baseUrl = getApiBaseUrl() || '';
      const url = `${baseUrl}/api/live/leave`;
      const payload = JSON.stringify({
        classId,
        participantId,
        tabId: currentTabId,
        temporary: true
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [activeClass?.id, isInstructorRole, user]);

  // Connect to Live Room (LiveKit server if available, otherwise Resilient NITHYA WebRTC Studio)
  const connectToRoom = useCallback(async () => {
    setConnectionState('connecting');
    setErrorMessage('');

    const roomName = (activeClass?.room_name || activeClass?.roomName || (activeClass?.id ? (activeClass.id.startsWith('nithya-') ? activeClass.id : `nithya-${activeClass.id}`) : 'nithya-live-studio')).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const studentInfo = loadStorage('nithya_student_session', null);
    const participantName = (isInstructorRole 
      ? 'NITHYA Master' 
      : (studentInfo?.name || (user?.name && user.name !== 'Kavitha Ram' && user.name !== 'Yoga Practitioner' && user.name !== 'NITHYA Master' ? user.name : 'Yoga Student'))).trim();

    let connectedViaLiveKit = false;
    const hasBackend = Boolean(getApiBaseUrl()) || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

    // Attempt LiveKit token negotiation only when a backend server is reachable
    if (hasBackend) {
      try {
        const authToken = isInstructorRole
          ? (localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token'))
          : localStorage.getItem('nithya_auth_token');
        const reqHeaders = {};
        if (authToken) {
          reqHeaders['Authorization'] = `Bearer ${authToken}`;
        }

        const data = await apiFetch('/api/livekit/token', {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify({
            roomName,
            participantName,
            classId: activeClass?.id,
            isInstructor: isInstructorRole
          })
        });

        if (data.token && data.serverUrl && !data.needsConfig) {
          const liveRoom = new Room({
            adaptiveStream: true,
            dynacast: true,
            videoCaptureDefaults: {
              resolution: VideoPresets.h720.resolution
            }
          });

          liveRoom.on(RoomEvent.Connected, () => {
            setConnectionState('connected');
            setStudioMode('livekit');
            setParticipants(Array.from(liveRoom.remoteParticipants.values()));

            const memberToken = localStorage.getItem('nithya_auth_token');
            if (memberToken) {
              apiFetch('/api/attendance/join', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${memberToken}` },
                body: JSON.stringify({ classId: activeClass?.id })
              }).catch(() => {});
            }
          });

          liveRoom.on(RoomEvent.Disconnected, () => {
            setConnectionState('disconnected');
            setParticipants([]);
          });

          liveRoom.on(RoomEvent.Reconnecting, () => {
            setConnectionState('reconnecting');
            setReconnectCount(prev => prev + 1);
          });

          liveRoom.on(RoomEvent.Reconnected, () => {
            setConnectionState('connected');
          });

          liveRoom.on(RoomEvent.ParticipantConnected, () => {
            setParticipants(Array.from(liveRoom.remoteParticipants.values()));
          });

          liveRoom.on(RoomEvent.ParticipantDisconnected, (p) => {
            setParticipants(Array.from(liveRoom.remoteParticipants.values()));
            setRaisedHands(prev => {
              const next = new Set(prev);
              next.delete(p.identity);
              return next;
            });
          });

          liveRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
            setActiveSpeakers(speakers.map(s => s.identity));
          });

          liveRoom.on(RoomEvent.DataReceived, (payload, participant) => {
            try {
              const text = new TextDecoder().decode(payload);
              const dataObj = JSON.parse(text);
              if (dataObj.type === 'chat') {
                setChatMessages(prev => [
                  ...prev,
                  {
                    id: `msg-${Date.now()}-${Math.random()}`,
                    sender: participant?.name || participant?.identity || 'Peer',
                    text: dataObj.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isSystem: false
                  }
                ]);
              } else if (dataObj.type === 'raise-hand') {
                setRaisedHands(prev => new Set(prev).add(participant.identity));
              } else if (dataObj.type === 'class-ended') {
                if (!isInstructorRole) {
                  setClassEndedNotice(true);
                }
              }
            } catch (_) {}
          });

          await liveRoom.connect(data.serverUrl, data.token);
          await liveRoom.localParticipant.setMicrophoneEnabled(isMicOn).catch(() => {});
          await liveRoom.localParticipant.setCameraEnabled(isVideoOn, { facingMode: cameraFacing }).catch(() => {});
          setRoom(liveRoom);
          connectedViaLiveKit = true;
        }
      } catch (err) {
        console.warn('LiveKit token negotiation not available. Falling back to NITHYA Resilient WebRTC Studio:', err.message);
      }
    }

    // Resilient Fallback: NITHYA WebRTC Native Studio (zero HTTP 405 error on static GitHub Pages)
    if (!connectedViaLiveKit) {
      try {
        let stream = null;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: isVideoOn ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: { ideal: cameraFacing } } : false,
              audio: isMicOn
            });
          } catch (mediaErr) {
            console.warn('Media hardware access note:', mediaErr.message);
          }
        }

        setLocalStream(stream);
        setStudioMode('webrtc');
        setConnectionState('connected');

        // Register participant in live roster
        if (!isInstructorRole) {
          const newStudent = {
            id: `p-${Date.now()}`,
            name: participantName,
            phone: studentInfo?.phone || user?.phone || 'N/A',
            role: 'Student',
            joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          try {
            const existing = loadStorage('nithya_live_participants', []);
            const updated = [newStudent, ...existing.filter(p => p.phone !== newStudent.phone)];
            saveStorage('nithya_live_participants', updated);
            setConnectedStudentsList(updated);

            // Broadcast to any other open window (e.g. instructor screen)
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const bc = new BroadcastChannel('nithya_live_class_channel');
              bc.postMessage({ type: 'student_joined', student: newStudent });
              setTimeout(() => { try { bc.close(); } catch (_) {} }, 200);
            }
          } catch (_) {}
        }
      } catch (fallbackErr) {
        console.error('Studio startup error:', fallbackErr);
        setConnectionState('error');
        setErrorMessage(fallbackErr.message || 'Could not start yoga studio.');
      }
    }
  }, [activeClass, user, isInstructorRole, isMicOn, isVideoOn]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (room) {
        try {
          room.disconnect();
        } catch (e) {}
      }
    };
  }, [room]);

  // Handle Mute/Unmute Mic
  const handleToggleMic = async () => {
    const nextState = !isMicOn;
    if (localStream) {
      localStream.getAudioTracks().forEach(track => { track.enabled = nextState; });
    }
    if (room?.localParticipant) {
      try {
        await room.localParticipant.setMicrophoneEnabled(nextState);
      } catch (e) {
        console.error('Mic toggle error:', e);
      }
    }
    setIsMicOn(nextState);
  };

  // Handle Turn On/Off Camera
  const handleToggleVideo = async () => {
    const nextState = !isVideoOn;
    if (localStream) {
      localStream.getVideoTracks().forEach(track => { track.enabled = nextState; });
    }
    if (room?.localParticipant) {
      try {
        await room.localParticipant.setCameraEnabled(nextState, { facingMode: cameraFacing });
      } catch (e) {
        console.error('Video toggle error:', e);
      }
    }
    setIsVideoOn(nextState);
  };

  // Toggle Camera Mirroring (கண்ணாடி வியூ: ஆன்/ஆஃப் - Natural Studio Reflection)
  const handleToggleMirror = () => {
    setIsMirrored(prev => !prev);
  };

  // Switch between Front (Selfie) and Rear (Back) Camera (முன்/பின் கேமரா மாற்று)
  const handleSwitchCamera = async () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);

    // Front camera is mirrored by default; back camera is natural unmirrored
    if (nextFacing === 'environment') {
      setIsMirrored(false);
    } else {
      setIsMirrored(true);
    }

    // 1. If using LiveKit local participant
    if (room?.localParticipant) {
      try {
        await room.localParticipant.setCameraEnabled(false);
        if (isVideoOn) {
          await room.localParticipant.setCameraEnabled(true, {
            facingMode: nextFacing
          });
        }
      } catch (err) {
        console.warn('[LiveKit] Switch camera warning:', err);
      }
    }

    // 2. If using WebRTC fallback localStream
    if (localStream) {
      try {
        localStream.getVideoTracks().forEach(t => t.stop());
        if (isVideoOn && navigator.mediaDevices?.getUserMedia) {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: nextFacing },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
          const newVTrack = newStream.getVideoTracks()[0];
          if (newVTrack) {
            const oldVTrack = localStream.getVideoTracks()[0];
            if (oldVTrack) localStream.removeTrack(oldVTrack);
            localStream.addTrack(newVTrack);
            setLocalStream(new MediaStream(localStream.getTracks()));
          }
        }
      } catch (err) {
        console.warn('[WebRTC] Switch camera fallback error:', err);
      }
    }
  };

  // Handle Screen Share (Instructor)
  const handleToggleScreenShare = async () => {
    const nextState = !isScreenSharing;
    if (room?.localParticipant) {
      try {
        await room.localParticipant.setScreenShareEnabled(nextState);
        setIsScreenSharing(nextState);
      } catch (e) {
        console.error('Screen share error:', e);
      }
    } else if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        if (nextState) {
          const scr = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setScreenStream(scr);
          setIsScreenSharing(true);
          scr.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            setScreenStream(null);
          };
        } else {
          if (screenStream) {
            screenStream.getTracks().forEach(t => t.stop());
            setScreenStream(null);
          }
          setIsScreenSharing(false);
        }
      } catch (e) {
        console.warn('Screen share note:', e.message);
        setIsScreenSharing(false);
      }
    }
  };

  // Raise Hand Reaction (LiveKit Data Packet or In-app)
  const handleRaiseHand = () => {
    if (room?.localParticipant) {
      try {
        const payload = new TextEncoder().encode(JSON.stringify({ type: 'raise-hand' }));
        room.localParticipant.publishData(payload, { reliable: true });
        setRaisedHands(prev => new Set(prev).add(room.localParticipant.identity));
      } catch (e) {}
    } else {
      setRaisedHands(prev => new Set(prev).add('local-hand'));
      setTimeout(() => {
        setRaisedHands(prev => {
          const next = new Set(prev);
          next.delete('local-hand');
          return next;
        });
      }, 5000);
    }

    // Broadcast raise-hand via PeerJS multi-device data channel
    activeConnsRef.current.forEach(conn => {
      try {
        if (conn && conn.open) {
          conn.send({ type: 'raise-hand', identity: participantName });
        }
      } catch (_) {}
    });

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('nithya_live_class_channel');
        bc.postMessage({ type: 'raise-hand', identity: participantName });
        setTimeout(() => { try { bc.close(); } catch (_) {} }, 100);
      }
    } catch (_) {}
  };

  // Send in-room chat message via LiveKit Data Channel or WebRTC
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (room?.localParticipant) {
      try {
        const payload = new TextEncoder().encode(JSON.stringify({
          type: 'chat',
          message: chatInput.trim()
        }));
        room.localParticipant.publishData(payload, { reliable: true });
      } catch (e) {
        console.error('Chat error:', e);
      }
    }

    // Broadcast chat message via PeerJS multi-device data channel
    activeConnsRef.current.forEach(conn => {
      try {
        if (conn && conn.open) {
          conn.send({
            type: 'chat',
            text: chatInput.trim(),
            sender: user?.name || (isInstructorRole ? (activeClass?.instructor || 'NITHYA Master') : 'Student')
          });
        }
      } catch (_) {}
    });

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('nithya_live_class_channel');
        bc.postMessage({
          type: 'chat',
          text: chatInput.trim(),
          sender: user?.name || (isInstructorRole ? 'Instructor' : 'Student')
        });
        setTimeout(() => { try { bc.close(); } catch (_) {} }, 100);
      }
    } catch (_) {}

    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: user?.name || (isInstructorRole ? 'Instructor' : 'You'),
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLocal: true
      }
    ]);
    setChatInput('');
  };

  // Leave Class (with immediate hardware camera & mic teardown)
  const handleLeave = async () => {
    const classId = activeClass?.id || 'cls-1';
    const studentInfo = loadStorage('nithya_student_session', null);
    const currentTabId = tabIdRef.current;
    const participantId = isInstructorRole ? 'instructor-primary' : (studentInfo?.phone || user?.phone || `student-${currentTabId}`);

    // 1. Explicitly notify backend session manager of leave
    try {
      await apiFetch('/api/live/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          participantId,
          tabId: currentTabId,
          temporary: false
        })
      });
    } catch (_) {}

    // 2. Server-backed attendance leave
    const memberToken = localStorage.getItem('nithya_auth_token');
    if (memberToken) {
      apiFetch('/api/attendance/leave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${memberToken}`
        },
        body: JSON.stringify({ classId })
      }).catch(err => console.warn('Attendance leave logging note:', err.message));
    }

    // 3. Disconnect LiveKit room
    if (room) {
      try {
        room.disconnect();
      } catch (e) {}
    }

    // 4. Release all hardware camera & microphone tracks immediately
    if (localStream) {
      try {
        localStream.getTracks().forEach(t => {
          t.stop();
          t.enabled = false;
        });
      } catch (_) {}
    }
    if (screenStream) {
      try {
        screenStream.getTracks().forEach(t => {
          t.stop();
          t.enabled = false;
        });
      } catch (_) {}
    }

    setRoom(null);
    setLocalStream(null);
    setScreenStream(null);
    setConnectionState('disconnected');
    if (onLeaveClass) onLeaveClass();
  };

  // End Class For All Participants (Instructor Only)
  const handleEndClassForAll = async () => {
    const confirmMsg = lang === 'ta'
      ? 'அனைத்து மாணவர்களுக்கும் இந்த வகுப்பை நிறைவு செய்ய விரும்புகிறீர்களா?'
      : 'Are you sure you want to end this yoga class for all participants?';
    if (!window.confirm(confirmMsg)) return;

    // Broadcast class-ended via PeerJS multi-device data channel
    activeConnsRef.current.forEach(conn => {
      try {
        if (conn && conn.open) {
          conn.send({ type: 'class-ended' });
        }
      } catch (_) {}
    });

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('nithya_live_class_channel');
        bc.postMessage({ type: 'class-ended' });
        setTimeout(() => { try { bc.close(); } catch (_) {} }, 100);
      }
    } catch (_) {}

    // 1. Broadcast end-class packet to all connected students
    if (room?.localParticipant) {
      try {
        const payload = new TextEncoder().encode(JSON.stringify({ type: 'class-ended' }));
        room.localParticipant.publishData(payload, { reliable: true });
      } catch (err) {
        console.warn('Broadcast class-ended note:', err.message);
      }
    }

    // 2. Call backend trainer end class endpoint
    const trainerToken = localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_trainer_token');
    const classId = activeClass?.id;
    if (trainerToken && classId) {
      try {
        await apiFetch(`/api/trainer/classes/${classId}/end`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${trainerToken}` }
        });
      } catch (apiErr) {
        console.warn('Backend end class error:', apiErr.message);
      }
    }

    // 3. Update localStorage classes status
    try {
      const stored = loadStorage('nithya_classes', []);
      const updated = stored.map(c => c.id === classId ? { ...c, status: 'ended' } : c);
      saveStorage('nithya_classes', updated);
    } catch (_) {}

    // 4. Terminate studio session and leave
    handleLeave();
  };

  const classDurationMins = Number(activeClass?.duration) || 45;
  const currentAttendancePct = Math.min(100, Math.round((sessionSeconds / (classDurationMins * 60)) * 100));

  // Verify and Record Attendance (Phase 6: 70% threshold rule)
  const handleVerifyAttendance = (forcedPresent = false) => {
    setHasAttendanceRecorded(true);
    const durationMins = Math.max(1, Math.round(sessionSeconds / 60));
    const isPresent = forcedPresent || currentAttendancePct >= 70;
    const finalPct = forcedPresent ? Math.max(currentAttendancePct, 75) : currentAttendancePct;

    const studentInfo = loadStorage('nithya_student_session', null);
    const logRecord = {
      id: `att-live-${Date.now()}`,
      studentName: studentInfo?.name || (user?.name && user.name !== 'Yoga Practitioner' && user.name !== 'Yoga Member' ? user.name : 'Yoga Student'),
      phone: studentInfo?.phone || user?.phone || '',
      classId: activeClass?.id || 'cls-1',
      className: activeClass?.title || activeClass?.name || 'Hatha Yoga Flow',
      instructor: activeClass?.instructor || 'NITHYA Master',
      date: new Date().toISOString().split('T')[0],
      durationMinutes: durationMins,
      attendancePercent: finalPct,
      status: isPresent ? 'Present (70%+)' : `Incomplete (${finalPct}%)`,
      timestamp: new Date().toISOString()
    };

    try {
      const existingLogs = loadStorage('nithya_attendance_logs', []);
      const updatedLogs = [logRecord, ...existingLogs.filter(l => !(l.phone === logRecord.phone && l.classId === logRecord.classId && l.date === logRecord.date))];
      saveStorage('nithya_attendance_logs', updatedLogs);
    } catch (_) {}

    // Send to backend SQLite if available
    const memberToken = localStorage.getItem('nithya_auth_token') || localStorage.getItem('nithya_admin_token');
    if (memberToken) {
      apiFetch('/api/attendance', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${memberToken}` },
        body: JSON.stringify({
          classId: logRecord.classId,
          durationSeconds: sessionSeconds,
          status: isPresent ? 'present' : 'incomplete'
        })
      }).catch(() => {});
    }

    if (onRecordAttendance) {
      onRecordAttendance(logRecord);
    }
  };

  // Continuous background attendance logging for students
  useEffect(() => {
    if (isInstructorRole || connectionState !== 'connected' || sessionSeconds < 5) return;

    const rawStudentInfo = loadStorage('nithya_student_session', null);
    const cleanPhone = (rawStudentInfo?.phone || user?.phone || '').replace(/\D/g, '');
    const cleanName = rawStudentInfo?.name || user?.name;
    if (!cleanName || cleanPhone.length < 10) return;

    const classId = activeClass?.id || 'cls-1';
    const classTitle = activeClass?.title || activeClass?.name || 'Morning Yoga Flow';
    const totalExpectedSec = (activeClass?.duration || 60) * 60;
    const currentPct = Math.min(100, Math.max(5, Math.round((sessionSeconds / totalExpectedSec) * 100)));
    const durationMins = Math.max(1, Math.round(sessionSeconds / 60));

    try {
      const existingLogs = loadStorage('nithya_attendance_logs', []);
      const currentLog = {
        id: `att-${cleanPhone}-${classId}`,
        studentName: cleanName,
        name: cleanName,
        phone: cleanPhone,
        studentPhone: cleanPhone,
        classId,
        className: classTitle,
        classTitle,
        instructor: activeClass?.instructor || 'NITHYA Master',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: durationMins,
        durationSeconds: sessionSeconds,
        attendancePercent: currentPct,
        status: currentPct >= 70 ? 'Present (70%+)' : `Incomplete (${currentPct}%)`,
        joinedAt: rawStudentInfo?.joinedAt || new Date().toISOString()
      };

      const updated = [currentLog, ...existingLogs.filter(l => !((l.phone || l.studentPhone || '').replace(/\D/g, '') === cleanPhone && l.classId === classId))];
      saveStorage('nithya_attendance_logs', updated);
    } catch (_) {}
  }, [sessionSeconds, connectionState, isInstructorRole, activeClass, user]);

  // Generate shareable live class link (uses production URL with student parameter)
  const getShareableClassLink = () => {
    const classId = activeClass?.id || 'cls-1';
    return getProductionLiveUrl(classId, { join: 'student' });
  };

  // Phase 4: Copy link with feedback
  const handleCopyShareLink = () => {
    const url = getShareableClassLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        prompt('Copy class link:', url);
      });
    } else {
      prompt('Copy class link:', url);
    }
  };

  // Phase 4: Share via WhatsApp
  const handleWhatsAppShare = () => {
    const url = getShareableClassLink();
    const title = activeClass?.title || activeClass?.name || 'Hatha Yoga Flow';
    const instructor = activeClass?.instructor || 'NITHYA Master';
    const text = `🧘 *Join Live Yoga Class with NITHYA Yoga Studio*\n\nClass: *${title}*\nInstructor: *${instructor}*\n\nTap here to register and enter the live yoga room:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async () => {
    const url = getShareableClassLink();
    const title = activeClass?.title || activeClass?.name || 'Hatha Yoga Flow';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NITHYA Yoga: ${title}`,
          text: lang === 'ta' ? `🧘 நித்யா யோகா நேரலை வகுப்பில் இணையுங்கள்:` : `🧘 Join NITHYA Yoga Live Class:`,
          url
        });
      } catch (_) {}
    } else {
      handleWhatsAppShare();
    }
  };

  // Phase 10 Test 12: Network drop & reconnect simulation
  const handleSimulateNetworkDrop = () => {
    setIsSimulatingDisconnect(true);
    setConnectionState('connecting');
    setTimeout(() => {
      setIsSimulatingDisconnect(false);
      setConnectionState('connected');
      setReconnectCount(prev => prev + 1);
    }, 1200);
  };

  // Test backend connection
  const handleTestBackend = async () => {
    setTestBackendStatus('testing');
    try {
      const clean = (backendUrl || '').trim().replace(/\/+$/, '');
      const testUrl = clean ? `${clean}/api/health` : '/api/health';
      const res = await fetch(testUrl);
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.status === 'ok' || data.name)) {
        setTestBackendStatus('success');
      } else {
        setTestBackendStatus('error');
      }
    } catch (_) {
      setTestBackendStatus('error');
    }
  };

  // Save LiveKit Server Credentials dynamically
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);

    try {
      setApiBaseUrl(backendUrl);

      if (configApiKey || configApiSecret || configUrl) {
        const adminToken = localStorage.getItem('nithya_admin_token');
        const headers = {};
        if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;

        const data = await apiFetch('/api/livekit/config', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            serverUrl: configUrl,
            apiKey: configApiKey,
            apiSecret: configApiSecret
          })
        });

        if (data.success) {
          setNeedsSetup(false);
        }
      }

      setShowConfigModal(false);
      connectToRoom();
    } catch (err) {
      alert(err.message || 'Error saving LiveKit configuration');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Determine spotlighted participant & resilient local presence
  const studentInfoForPresence = loadStorage('nithya_student_session', null);
  const localWebrtcParticipant = {
    identity: isInstructorRole ? 'instructor-local' : (studentInfoForPresence?.phone || user?.id || 'student-local'),
    name: isInstructorRole 
      ? 'NITHYA Master' 
      : (studentInfoForPresence?.name || (user?.name && user.name !== 'Kavitha Ram' && user.name !== 'Yoga Practitioner' && user.name !== 'NITHYA Master' ? user.name : 'Yoga Student')),
    role: isInstructorRole ? 'instructor' : 'student',
    phone: studentInfoForPresence?.phone || (isInstructorRole ? '' : user?.phone || ''),
    stream: localStream,
    isLocal: true,
    isInstructor: isInstructorRole
  };

  const simulatedPeers = (!room && connectedStudentsList && connectedStudentsList.length > 0)
    ? connectedStudentsList
        .filter(s => 
          s && 
          s.role !== 'instructor' && 
          !String(s.identity || '').startsWith('instructor') && 
          !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram', 'Yoga Member', 'Yoga Student', 'Student', 'NITHYA Master'].includes(s.name) &&
          Boolean(s.phone && String(s.phone).replace(/\D/g, '').length >= 10)
        )
        .map(s => {
          const remoteObj = Object.values(remoteStreams).find(r => r && (r.phone === s.phone || r.identity === s.identity || r.name === s.name));
          return {
            identity: s.identity || s.id || s.phone || s.name,
            name: s.name,
            role: 'student',
            phone: s.phone,
            joinedAt: s.joinedAt,
            stream: remoteObj ? remoteObj.stream : null,
            isLocal: false,
            isInstructor: false
          };
        })
    : [];

  const instructorPeer = !isInstructorRole ? [{
    identity: 'instructor-lead',
    name: activeClass?.instructor || 'NITHYA Master (Leader)',
    role: 'instructor',
    isInstructor: true,
    isLocal: false,
    stream: teacherStream || null
  }] : [];

  const allParticipants = room
    ? [room.localParticipant, ...participants.filter(p => p && p.role !== 'instructor' && !String(p.identity || '').startsWith('instructor') && !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram'].includes(p.name))]
    : (isInstructorRole
        ? (localStream ? [localWebrtcParticipant, ...simulatedPeers.filter(p => p.name !== localWebrtcParticipant.name)] : [localWebrtcParticipant, ...simulatedPeers])
        : (localStream 
            ? [localWebrtcParticipant, ...instructorPeer, ...simulatedPeers.filter(p => p.name !== localWebrtcParticipant.name)] 
            : [...instructorPeer, localWebrtcParticipant, ...simulatedPeers]));

  const spotlightParticipant = isInstructorRole
    ? localWebrtcParticipant
    : (spotlightParticipantId
        ? allParticipants.find(p => p.identity === spotlightParticipantId)
        : (allParticipants.find(p => p.isInstructor) || allParticipants[0]));

  const otherParticipants = isInstructorRole
    ? allParticipants.filter(p => 
        p && 
        p.identity !== spotlightParticipant?.identity && 
        p.name !== spotlightParticipant?.name && 
        p.role !== 'instructor' && 
        !p.isInstructor && 
        !String(p.identity || '').startsWith('instructor') && 
        !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram', 'NITHYA Master', 'Yoga Member', 'Yoga Student', 'Student'].includes(p.name) &&
        (p.isLocal || (p.phone && String(p.phone).replace(/\D/g, '').length >= 10))
      )
    : allParticipants.filter(p => p?.identity !== spotlightParticipant?.identity);

  // Student count calculation: strictly genuine students only, excluding instructor
  const realStudentsList = connectedStudentsList.filter(s => 
    s && 
    s.role !== 'instructor' && 
    !String(s.identity || '').startsWith('instructor') && 
    s.identity !== 'instructor-lead' && 
    s.identity !== 'instructor-local' &&
    !['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram', 'NITHYA Master', 'Yoga Member', 'Yoga Student', 'Student'].includes(s.name) &&
    Boolean(s.phone && String(s.phone).replace(/\D/g, '').length >= 10)
  );

  const currentStudentCount = isInstructorRole
    ? realStudentsList.length
    : Math.max(1, realStudentsList.length);

  return (
    <div className={`livekit-yoga-studio-container ${isFullscreen ? 'fullscreen-mode' : ''}`} ref={containerRef}>
      {/* Floating Hand Raise Notification */}
      {handAlertMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur flex items-center gap-2 animate-bounce border border-amber-200">
          <Hand size={18} className="text-slate-950" />
          <span className="text-xs">{handAlertMsg}</span>
        </div>
      )}

      {/* State 1: IDLE / NOT CONNECTED (Lobby View) */}
      {connectionState === 'idle' && (
        <div className="livekit-lobby-card p-6 md:p-10 max-w-2xl mx-auto my-6 text-center bg-white rounded-3xl border border-[#EAE3F2] shadow-xl">
          <div className="lobby-artwork-wrap flex justify-center mb-4">
            <ThreeDLotus size={64} />
          </div>

          <h3 className="lobby-headline font-bold text-2xl text-[#29233D] mb-2 font-['Poppins']">
            {lang === 'ta' ? 'நேரலை யோகா வகுப்பறை' : 'Live Yoga & Asanas Flow'}
          </h3>
          <p className="lobby-subtext text-sm text-[#777184] mb-6 max-w-md mx-auto">
            {lang === 'ta'
              ? 'உயர்தர வீடியோ மற்றும் ஆடியோவுடன் உங்கள் பயிற்றுநர் மற்றும் வகுப்புத் தோழர்களுடன் நேரடியாக இணையுங்கள்.'
              : 'Interactive low-latency WebRTC live stream with certified instructor NITHYA Master.'}
          </p>

          {/* Role Radio Picker */}
          <div className="lobby-role-selector grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                isInstructorRole
                  ? 'border-[#9B7AE8] bg-[#F8F5FF] shadow-sm'
                  : 'border-[#EAE3F2] bg-white hover:border-[#9B7AE8]/40'
              }`}
              onClick={() => {
                setIsInstructorRole(true);
                try {
                  localStorage.setItem('nithya_active_role', 'instructor');
                  localStorage.removeItem('nithya_student_session');
                  localStorage.setItem('nithya_trainer_token', 'nithya_master_active');
                } catch (_) {}
              }}
            >
              <Crown size={22} className="text-amber-500 shrink-0" />
              <div>
                <strong className="block text-xs font-bold text-[#29233D]">
                  {lang === 'ta' ? '👑 நித்யா மாஸ்டர்' : '👑 Host (Trainer)'}
                </strong>
                <span className="text-[11px] text-[#777184]">
                  {lang === 'ta' ? 'வகுப்பைத் தொடங்குங்கள்' : 'Broadcast camera & guide'}
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                !isInstructorRole
                  ? 'border-[#9B7AE8] bg-[#F8F5FF] shadow-sm'
                  : 'border-[#EAE3F2] bg-white hover:border-[#9B7AE8]/40'
              }`}
              onClick={() => {
                setIsInstructorRole(false);
                try {
                  localStorage.setItem('nithya_active_role', 'student');
                } catch (_) {}
              }}
            >
              <Users size={22} className="text-indigo-500 shrink-0" />
              <div>
                <strong className="block text-xs font-bold text-[#29233D]">
                  {lang === 'ta' ? '👥 மாணவர் முறை' : '👥 Student Practitioner'}
                </strong>
                <span className="text-[11px] text-[#777184]">
                  {lang === 'ta' ? 'பயிற்சியில் இணைக' : 'Join class & follow guidance'}
                </span>
              </div>
            </button>
          </div>

          {/* Quick Media Check */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                isMicOn ? 'bg-[#EAF7EE] border-[#C3EBCF] text-[#10B981]' : 'bg-[#FFF1F0] border-[#FFD8D6] text-[#EF4444]'
              }`}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic size={15} /> : <MicOff size={15} />}
              <span>{isMicOn ? (lang === 'ta' ? 'மைக் ஆன்' : 'Mic On') : (lang === 'ta' ? 'மைக் ஆஃப்' : 'Mic Muted')}</span>
            </button>

            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                isVideoOn ? 'bg-[#EAF7EE] border-[#C3EBCF] text-[#10B981]' : 'bg-[#FFF1F0] border-[#FFD8D6] text-[#EF4444]'
              }`}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <VideoIcon size={15} /> : <VideoOff size={15} />}
              <span>{isVideoOn ? (lang === 'ta' ? 'கேமரா ஆன்' : 'Camera On') : (lang === 'ta' ? 'கேமரா ஆஃப்' : 'Camera Off')}</span>
            </button>
          </div>

          <div className="mb-4">
            <button
              type="button"
              className="btn-join-studio ya-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#9B7AE8] to-[#7C3AED] text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer flex items-center justify-center gap-2"
              onClick={connectToRoom}
            >
              <Radio size={18} />
              <span>{lang === 'ta' ? 'லைவ் வகுப்பில் இணைக' : 'Enter Live Yoga Room'}</span>
            </button>
          </div>

          {/* Share Live Link Box */}
          <div className="mt-4 p-3.5 bg-[#F8F5FF] rounded-2xl border border-[#EAE3F2] text-left">
            <span className="block text-xs font-bold text-[#29233D] mb-1">
              {lang === 'ta' ? '🔗 நேரலை வகுப்பு அழைப்பு லிங்க்:' : '🔗 Class Invite Link:'}
            </span>
            <div className="p-2 bg-white rounded-xl border border-[#EAE3F2] text-[11px] text-[#777184] truncate mb-2 select-all font-mono">
              {getShareableClassLink()}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-[#9B7AE8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                onClick={handleCopyShareLink}
              >
                {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedLink ? 'Copied!' : 'Copy Live Link'}</span>
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                onClick={handleWhatsAppShare}
              >
                <Share2 size={13} />
                <span>Share WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 2: CONNECTING / LOADING */}
      {connectionState === 'connecting' && (
        <div className="livekit-loading-state p-12 text-center max-w-md mx-auto my-12 bg-white rounded-3xl border border-[#EAE3F2] shadow-xl">
          <div className="spinner-lotus-wrap flex justify-center mb-4">
            <ThreeDLotus size={56} />
          </div>
          <h4 className="loading-title font-bold text-lg text-[#29233D] mb-2 font-['Poppins']">
            {lang === 'ta' ? 'யோகா ஸ்டுடியோவுடன் இணைகிறது...' : 'Connecting to Live Studio...'}
          </h4>
          <p className="loading-sub text-xs text-[#777184]">
            {lang === 'ta' ? 'பாதுகாப்பான வீடியோ பரிமாற்றம் தொடங்குகிறது...' : 'Negotiating secure WebRTC channels & connecting live feed...'}
          </p>
        </div>
      )}

      {/* State 3: ERROR STATE */}
      {connectionState === 'error' && (
        <div className="livekit-error-state p-8 text-center max-w-md mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-xl">
          <AlertCircle size={42} className="error-icon text-rose-500 mx-auto mb-3" />
          <h4 className="error-heading font-bold text-lg text-[#29233D] mb-2">
            {lang === 'ta' ? 'இணைப்பு தோல்வி' : 'Connection Failed'}
          </h4>
          <p className="error-detail-text text-xs text-[#777184] mb-6">{errorMessage}</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-[#9B7AE8] text-white font-bold text-xs cursor-pointer flex items-center gap-2"
              onClick={connectToRoom}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* State 4: CONNECTED VIDEO ROOM (Figma Frame 2955 Design) */}
      {connectionState === 'connected' && (
        <div className="figma-live-classroom-container">
          {/* Header Bar matching Figma Frame 2955 */}
          <div className="figma-live-class-header">
            <div className="figma-header-title-col">
              <div className="figma-header-badge-row">
                <span className="figma-live-indicator">
                  <span className="figma-live-pulse-dot"></span>
                  LIVE
                </span>
                <span className="figma-course-tag">
                  {courseName || activeClass?.courseName || activeClass?.course_name || 'Live Yoga & Asanas Flow'}
                </span>
              </div>
              <h2 className="figma-class-main-title">
                {activeClass?.title || activeClass?.name || 'Hatha Yoga Flow & Alignment'}
              </h2>
              <div className="figma-instructor-pill">
                <div className="figma-instructor-avatar-mini">
                  <span>👑</span>
                </div>
                <span className="figma-instructor-name">
                  {lang === 'ta' ? 'பயிற்றுநர்:' : 'Instructor:'} <strong>{activeClass?.instructor || 'NITHYA Master'}</strong>
                </span>
                <span className="figma-role-chip">{isInstructorRole ? 'Host (You)' : 'Certified Master'}</span>
              </div>
            </div>

            <div className="figma-header-controls-col">
              {/* Time remaining chip matching Figma Frame 2955 */}
              <div className="figma-time-remaining-card">
                <span>{lang === 'ta' ? 'மீதமுள்ள நேரம்:' : 'Time remaining:'}</span>
                <span className="time-val">⏱ {formatTimer(Math.max(0, 7200 - sessionSeconds))}</span>
              </div>

              {/* Attendance Progress Pill */}
              <div
                className={`figma-attendance-pill ${currentAttendancePct >= 70 ? 'present' : ''}`}
                onClick={() => handleVerifyAttendance(false)}
                title="Class Attendance Status"
              >
                <Award size={15} />
                <span>{currentAttendancePct >= 70 ? '✓ Present (70%+)' : `${currentAttendancePct}% Attendance`}</span>
              </div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                className="figma-glass-icon-btn"
                onClick={handleToggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Server Config Button (Instructor) */}
              {isInstructorRole && (
                <button
                  type="button"
                  className="figma-glass-icon-btn"
                  onClick={() => setShowConfigModal(true)}
                  title="Server Configuration"
                >
                  <Settings size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Teacher Grace Period Warning if teacher disconnected */}
          {!teacherOnline && teacherGraceRemaining !== null && !isInstructorRole && (
            <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center gap-2 text-amber-800 text-xs font-semibold">
              <AlertCircle size={15} className="shrink-0 text-amber-600" />
              <span>
                {lang === 'ta'
                  ? `⚠️ பயிற்றுநர் தற்காலிகமாக துண்டிக்கப்பட்டுள்ளார். மீதமுள்ள அவகாச நேரம்: ${formatTimer(teacherGraceRemaining)}.`
                  : `⚠️ Instructor temporarily disconnected. Grace period remaining: ${formatTimer(teacherGraceRemaining)}.`}
              </span>
            </div>
          )}

          {/* Main 2-Column Split Grid */}
          <div className="figma-live-main-grid">
            {/* Left Column (Stage, Tiles, Actions, Meeting Cards) */}
            <div className="figma-left-stage-column">
              {/* Featured Primary Stage Card (Widescreen Teacher Video) */}
              <div className="figma-featured-video-card">
                <div className="figma-video-viewport-wrapper">
                  {spotlightParticipant ? (
                    <ParticipantTile
                      participant={spotlightParticipant}
                      isLocal={spotlightParticipant === room?.localParticipant || spotlightParticipant.isLocal}
                      isSpotlight={true}
                      isSpeaking={activeSpeakers.includes(spotlightParticipant.identity)}
                      isLocalMicOn={isMicOn}
                      isLocalVideoOn={isVideoOn}
                      isMirrored={isMirrored}
                      lang={lang}
                    />
                  ) : (
                    <div className="figma-live-connecting-placeholder">
                      <div className="figma-ambient-orbit-bg-layer" aria-hidden="true"></div>
                      <div className="figma-placeholder-content">
                        <div className="flex justify-center mb-3">
                          <ThreeDLotus size={64} />
                        </div>
                        <h4 className="font-bold text-base text-white mb-1">
                          {lang === 'ta' ? 'பயிற்றுநர் வீடியோ தயாராகிறது...' : 'Connecting to Live Teacher Video...'}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {lang === 'ta' ? 'நித்யா யோகா ஸ்டுடியோ நேரலை ஸ்ட்ரீம்' : 'Low-latency peer-to-peer WebRTC video active'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Instructor Name Tag Overlay at Bottom-Left */}
                  <div className="figma-stage-name-badge">
                    <span>👤</span>
                    <span>{activeClass?.instructor || 'NITHYA Master'}</span>
                    <span className="figma-badge-role-tag">Host</span>
                  </div>

                  {/* Floating Glassy Dock Centered at Bottom of Video */}
                  <div className="figma-stage-floating-dock">
                    {/* Audio Toggle */}
                    <button
                      type="button"
                      className={`figma-dock-round-btn ${!isMicOn ? 'btn-danger-muted' : ''}`}
                      onClick={handleToggleMic}
                      title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                    >
                      {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                    </button>

                    {/* Video Toggle */}
                    <button
                      type="button"
                      className={`figma-dock-round-btn ${!isVideoOn ? 'btn-danger-muted' : ''}`}
                      onClick={handleToggleVideo}
                      title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                    >
                      {isVideoOn ? <VideoIcon size={18} /> : <VideoOff size={18} />}
                    </button>

                    {/* Red End Call Button */}
                    {isInstructorRole ? (
                      <button
                        type="button"
                        className="figma-dock-end-pill-btn"
                        onClick={handleEndClassForAll}
                        title={lang === 'ta' ? 'அனைவருக்கும் வகுப்பை முடி' : 'End Class for All'}
                      >
                        <PhoneOff size={16} />
                        <span>{lang === 'ta' ? 'வகுப்பை முடி' : 'End Call'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="figma-dock-end-pill-btn"
                        onClick={handleLeave}
                        title={lang === 'ta' ? 'வெளியேறு' : 'Leave Class'}
                      >
                        <PhoneOff size={16} />
                        <span>{lang === 'ta' ? 'வெளியேறு' : 'Leave'}</span>
                      </button>
                    )}

                    {/* Raise Hand Button */}
                    {!isInstructorRole && (
                      <button
                        type="button"
                        className={`figma-dock-round-btn ${raisedHands.has(room?.localParticipant?.identity) || raisedHands.has('local-hand') ? 'btn-amber-active' : ''}`}
                        onClick={handleRaiseHand}
                        title="Raise Hand"
                      >
                        <Hand size={18} />
                      </button>
                    )}

                    {/* Settings / Extra Tools */}
                    <button
                      type="button"
                      className="figma-dock-round-btn"
                      onClick={() => setShowToolMenu(!showToolMenu)}
                      title="Settings & Camera Switch"
                    >
                      <Settings size={18} />
                    </button>

                    {/* Preserved Test 11 Fast Trigger: Mark 70%+ Attendance */}
                    <button
                      type="button"
                      className="dock-control-btn test-attendance-btn"
                      style={{ display: 'none' }}
                      onClick={() => handleVerifyAttendance(true)}
                      title="Simulate 70%+ Attendance (Test 11)"
                    >
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      <span className="dock-label">70% Mark</span>
                    </button>

                    {/* Preserved Test 12 Fast Trigger: Network Drop & Reconnect */}
                    <button
                      type="button"
                      className="dock-control-btn test-reconnect-btn"
                      style={{ display: 'none' }}
                      onClick={handleSimulateNetworkDrop}
                      title="Simulate Disconnect & Reconnect (Test 12)"
                    >
                      <RefreshCw size={15} className={isSimulatingDisconnect ? 'animate-spin text-amber-400' : ''} />
                      <span className="dock-label">{reconnectCount > 0 ? `Reconn (${reconnectCount})` : 'Drop/Reconn'}</span>
                    </button>
                  </div>

                  {/* Tool Menu Dropdown */}
                  {showToolMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '72px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#FFFFFF',
                        border: '1px solid #EAE3F2',
                        borderRadius: '16px',
                        padding: '8px',
                        boxShadow: '0 12px 32px rgba(100, 80, 160, 0.2)',
                        zIndex: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        minWidth: '220px'
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#29233D',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onClick={() => {
                          handleSwitchCamera();
                          setShowToolMenu(false);
                        }}
                      >
                        <SwitchCamera size={15} className="text-violet-500" />
                        <span>{cameraFacing === 'user' ? 'Switch to Rear Camera' : 'Switch to Front Camera'}</span>
                      </button>

                      <button
                        type="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          color: '#29233D',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onClick={() => {
                          handleToggleMirror();
                          setShowToolMenu(false);
                        }}
                      >
                        <FlipHorizontal size={15} className="text-violet-500" />
                        <span>{isMirrored ? 'Disable Mirror View' : 'Enable Natural Mirror'}</span>
                      </button>

                      {isInstructorRole && (
                        <button
                          type="button"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'transparent',
                            color: '#29233D',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                          onClick={() => {
                            setShowConfigModal(true);
                            setShowToolMenu(false);
                          }}
                        >
                          <Settings size={15} className="text-violet-500" />
                          <span>Server Credentials</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Row of 3 Participant Video Tiles (underneath teacher video) */}
              <div className="figma-participant-tiles-grid">
                {isInstructorRole ? (
                  /* Instructor Mode: 3 Student Slots (Real students or clean waiting slots) */
                  <>
                    {/* Slot 1 */}
                    {realStudentsList[0] ? (
                      <div className="figma-student-tile">
                        {realStudentsList[0].stream ? (
                          <video
                            ref={el => {
                              if (el && realStudentsList[0].stream) {
                                el.srcObject = realStudentsList[0].stream;
                                el.playsInline = true;
                                el.play().catch(() => {});
                              }
                            }}
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="participant-avatar-fallback">
                            <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16, background: 'linear-gradient(135deg, #0284C7, #0369A1)' }}>
                              <span>{(realStudentsList[0].name || 'S').charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="avatar-fallback-name" style={{ fontSize: 11 }}>
                              {realStudentsList[0].name}
                            </span>
                          </div>
                        )}
                        <div className="figma-student-tile-overlay-bottom">
                          <span>👤 {realStudentsList[0].name}</span>
                          <span className="status-icon-pill active-speaking" style={{ width: 18, height: 18 }}>
                            <Mic size={10} />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="figma-student-tile figma-empty-waiting-slot">
                        <div className="figma-empty-waiting-content">
                          <div className="figma-empty-waiting-icon">1</div>
                          <span className="figma-empty-waiting-title">
                            {lang === 'ta' ? 'மாணவர் இடம் 1' : 'Student Slot 1'}
                          </span>
                          <span className="figma-empty-waiting-desc">
                            {lang === 'ta' ? 'இணைப்புக்காக காத்திருக்கிறது...' : 'Waiting to join...'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Slot 2 */}
                    {realStudentsList[1] ? (
                      <div className="figma-student-tile">
                        {realStudentsList[1].stream ? (
                          <video
                            ref={el => {
                              if (el && realStudentsList[1].stream) {
                                el.srcObject = realStudentsList[1].stream;
                                el.playsInline = true;
                                el.play().catch(() => {});
                              }
                            }}
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="participant-avatar-fallback">
                            <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16, background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
                              <span>{(realStudentsList[1].name || 'S').charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="avatar-fallback-name" style={{ fontSize: 11 }}>
                              {realStudentsList[1].name}
                            </span>
                          </div>
                        )}
                        <div className="figma-student-tile-overlay-bottom">
                          <span>👤 {realStudentsList[1].name}</span>
                          <span className="status-icon-pill active-speaking" style={{ width: 18, height: 18 }}>
                            <Mic size={10} />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="figma-student-tile figma-empty-waiting-slot">
                        <div className="figma-empty-waiting-content">
                          <div className="figma-empty-waiting-icon">2</div>
                          <span className="figma-empty-waiting-title">
                            {lang === 'ta' ? 'மாணவர் இடம் 2' : 'Student Slot 2'}
                          </span>
                          <span className="figma-empty-waiting-desc">
                            {lang === 'ta' ? 'இணைப்புக்காக காத்திருக்கிறது...' : 'Waiting to join...'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Slot 3 */}
                    {realStudentsList[2] ? (
                      <div className="figma-student-tile">
                        {realStudentsList[2].stream ? (
                          <video
                            ref={el => {
                              if (el && realStudentsList[2].stream) {
                                el.srcObject = realStudentsList[2].stream;
                                el.playsInline = true;
                                el.play().catch(() => {});
                              }
                            }}
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="participant-avatar-fallback">
                            <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16, background: 'linear-gradient(135deg, #DB2777, #9D174D)' }}>
                              <span>{(realStudentsList[2].name || 'S').charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="avatar-fallback-name" style={{ fontSize: 11 }}>
                              {realStudentsList[2].name}
                            </span>
                          </div>
                        )}
                        <div className="figma-student-tile-overlay-bottom">
                          <span>👤 {realStudentsList[2].name}</span>
                          <span className="status-icon-pill active-speaking" style={{ width: 18, height: 18 }}>
                            <Mic size={10} />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="figma-student-tile figma-empty-waiting-slot">
                        <div className="figma-empty-waiting-content">
                          <div className="figma-empty-waiting-icon">3</div>
                          <span className="figma-empty-waiting-title">
                            {lang === 'ta' ? 'மாணவர் இடம் 3' : 'Student Slot 3'}
                          </span>
                          <span className="figma-empty-waiting-desc">
                            {lang === 'ta' ? 'இணைப்புக்காக காத்திருக்கிறது...' : 'Waiting to join...'}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Student Mode: Tile 1 is You, Tile 2 & 3 are other real classmates */
                  <>
                    {/* Tile 1: You */}
                    <div className="figma-student-tile is-active-speaker">
                      {localStream && isVideoOn ? (
                        <video
                          ref={el => {
                            if (el && localStream) {
                              el.srcObject = localStream;
                              el.muted = true;
                              el.playsInline = true;
                              el.play().catch(() => {});
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          className={`participant-video-stream ${isMirrored ? 'is-mirrored' : ''}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="participant-avatar-fallback">
                          <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16 }}>
                            <span>{(user?.name || 'Y').charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="avatar-fallback-name" style={{ fontSize: 11 }}>
                            {user?.name || (lang === 'ta' ? 'நீங்கள்' : 'You')}
                          </span>
                        </div>
                      )}
                      <div className="figma-student-tile-overlay-bottom">
                        <span>👤 {lang === 'ta' ? 'நீங்கள்' : 'You'}</span>
                        <span className={`status-icon-pill ${isMicOn ? 'active-speaking' : 'audio-muted'}`} style={{ width: 18, height: 18 }}>
                          {isMicOn ? <Mic size={10} /> : <MicOff size={10} />}
                        </span>
                      </div>
                    </div>

                    {/* Tile 2: Classmate 1 */}
                    {realStudentsList[0] ? (
                      <div className="figma-student-tile">
                        {realStudentsList[0].stream ? (
                          <video
                            ref={el => {
                              if (el && realStudentsList[0].stream) {
                                el.srcObject = realStudentsList[0].stream;
                                el.playsInline = true;
                                el.play().catch(() => {});
                              }
                            }}
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="participant-avatar-fallback">
                            <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16, background: 'linear-gradient(135deg, #0284C7, #0369A1)' }}>
                              <span>{(realStudentsList[0].name || 'S').charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="avatar-fallback-name" style={{ fontSize: 11 }}>
                              {realStudentsList[0].name}
                            </span>
                          </div>
                        )}
                        <div className="figma-student-tile-overlay-bottom">
                          <span>👤 {realStudentsList[0].name}</span>
                          <span className="status-icon-pill active-speaking" style={{ width: 18, height: 18 }}>
                            <Mic size={10} />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="figma-student-tile figma-empty-waiting-slot">
                        <div className="figma-empty-waiting-content">
                          <div className="figma-empty-waiting-icon">1</div>
                          <span className="figma-empty-waiting-title">
                            {lang === 'ta' ? 'வகுப்புத் தோழர் இடம் 1' : 'Classmate Slot 1'}
                          </span>
                          <span className="figma-empty-waiting-desc">
                            {lang === 'ta' ? 'இணைப்புக்காக காத்திருக்கிறது...' : 'Waiting to join...'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tile 3: Classmate 2 */}
                    {realStudentsList[1] ? (
                      <div className="figma-student-tile">
                        {realStudentsList[1].stream ? (
                          <video
                            ref={el => {
                              if (el && realStudentsList[1].stream) {
                                el.srcObject = realStudentsList[1].stream;
                                el.playsInline = true;
                                el.play().catch(() => {});
                              }
                            }}
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="participant-avatar-fallback">
                            <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16, background: 'linear-gradient(135deg, #DB2777, #9D174D)' }}>
                              <span>{(realStudentsList[1].name || 'S').charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="avatar-fallback-name" style={{ fontSize: 11 }}>
                              {realStudentsList[1].name}
                            </span>
                          </div>
                        )}
                        <div className="figma-student-tile-overlay-bottom">
                          <span>👤 {realStudentsList[1].name}</span>
                          <span className="status-icon-pill active-speaking" style={{ width: 18, height: 18 }}>
                            <Mic size={10} />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="figma-student-tile figma-empty-waiting-slot">
                        <div className="figma-empty-waiting-content">
                          <div className="figma-empty-waiting-icon">2</div>
                          <span className="figma-empty-waiting-title">
                            {lang === 'ta' ? 'வகுப்புத் தோழர் இடம் 2' : 'Classmate Slot 2'}
                          </span>
                          <span className="figma-empty-waiting-desc">
                            {lang === 'ta' ? 'இணைப்புக்காக காத்திருக்கிறது...' : 'Waiting to join...'}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Control Actions Toolbar Bar */}
              <div className="figma-actions-toolbar">
                <button
                  type="button"
                  className="figma-toolbar-action-btn"
                  onClick={() => {
                    const el = document.getElementById('figma-participants-roster');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Users size={15} className="text-violet-500" />
                  <span>Participants ({currentStudentCount})</span>
                </button>

                <button
                  type="button"
                  className={`figma-toolbar-action-btn ${isRecording ? 'is-recording' : ''}`}
                  onClick={handleToggleRecord}
                >
                  <span className="figma-record-dot"></span>
                  <span>{isRecording ? 'Recording (00:14)' : 'Record'}</span>
                </button>

                <button
                  type="button"
                  className="figma-toolbar-action-btn"
                  onClick={handleToggleScreenShare}
                >
                  <Share2 size={15} />
                  <span>Share screen</span>
                </button>

                <button
                  type="button"
                  className="figma-toolbar-action-btn"
                  onClick={() => setShowAsanaGuide(true)}
                >
                  <Layers size={15} />
                  <span>Asana Guide</span>
                </button>

                <button
                  type="button"
                  className="figma-toolbar-action-btn"
                  onClick={handleCopyShareLink}
                >
                  {copiedLink ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Invite Link'}</span>
                </button>

                <button
                  type="button"
                  className="figma-toolbar-action-btn"
                  onClick={() => setShowToolMenu(!showToolMenu)}
                >
                  <span>⋯ More</span>
                </button>
              </div>

              {/* Bottom 3 Meeting Cards matching Figma Frame 2955 */}
              <div className="figma-meeting-cards-grid">
                {/* Card 1: Meeting Room */}
                <div className="figma-meeting-card">
                  <div className="figma-meeting-card-head">
                    <h4 className="figma-card-title">Meeting Room</h4>
                    <span className="figma-card-date">
                      📅 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="figma-avatar-stack-row">
                    <div className="figma-avatar-stack">
                      <span className="figma-stack-avatar" style={{ background: '#F59E0B' }} title={activeClass?.instructor || 'Host'}>👑</span>
                      {realStudentsList.slice(0, 3).map((st, i) => (
                        <span key={st.phone || i} className="figma-stack-avatar" style={{ background: ['#8B5CF6', '#0EA5E9', '#10B981'][i % 3] }} title={st.name}>
                          {(st.name || 'S').charAt(0).toUpperCase()}
                        </span>
                      ))}
                      {realStudentsList.length > 3 && (
                        <span className="figma-stack-avatar figma-stack-more">+{realStudentsList.length - 3}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="figma-btn-create-meeting"
                      onClick={() => {
                        handleCopyShareLink();
                        handleNativeShare();
                      }}
                      title="Copy & Share Live Meeting Link"
                    >
                      {copiedLink ? '✓ Link Copied!' : '+ Share Meeting'}
                    </button>
                  </div>
                </div>

                {/* Card 2: Weekly Meetings */}
                <div className="figma-meeting-card">
                  <div className="figma-meeting-card-head">
                    <h4 className="figma-card-title">Weekly Meetings</h4>
                    <span className="figma-card-date">📅 Every Morning 06:00 AM</span>
                  </div>
                  <div className="figma-avatar-stack-row">
                    <div className="figma-avatar-stack">
                      <span className="figma-stack-avatar" style={{ background: '#7C3AED' }} title="Nithya Yoga">🧘‍♀️</span>
                      <span className="figma-stack-avatar" style={{ background: '#F59E0B' }} title="Master Class">👑</span>
                    </div>
                    <span className="figma-waiting-badge">
                      {lang === 'ta' ? 'காலை 06:00 AM' : 'Daily 06:00 AM'}
                    </span>
                  </div>
                </div>

                {/* Card 3: Gradient Purple Course Card */}
                <div className="figma-promo-course-card">
                  <div className="figma-promo-top">
                    <span className="figma-promo-badge">🎓 43 Courses</span>
                  </div>
                  <h4 className="figma-promo-title">Elevate your yoga practice</h4>
                  <p className="figma-promo-sub">Guided Asanas &amp; Pranayama Modules</p>
                  <button
                    type="button"
                    className="figma-promo-btn"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.hash = '#classes';
                      }
                    }}
                  >
                    Add Course
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (Meeting Participants & Chats Cards) */}
            <div className="figma-right-sidebar-column">
              {/* Card 1: Meeting Participants (${currentStudentCount}) */}
              <div className="figma-participants-roster-card" id="figma-participants-roster">
                <div className="figma-roster-header">
                  <div className="figma-roster-title-wrap">
                    <h3 className="figma-roster-heading">Meeting Participants</h3>
                    <span className="figma-roster-count-badge">{currentStudentCount}</span>
                  </div>
                  <button type="button" className="figma-dots-btn">⋯</button>
                </div>

                <div className="figma-roster-list">
                  {/* Host Row */}
                  <div className="figma-participant-item">
                    <div className="figma-item-left">
                      <div className="figma-item-avatar" style={{ background: '#F59E0B', color: '#FFF' }}>👑</div>
                      <div className="figma-item-info">
                        <div className="figma-item-name-row">
                          <span className="figma-item-name">{activeClass?.instructor || 'NITHYA Master'}</span>
                          <span className="figma-host-tag">Host</span>
                        </div>
                        <span className="figma-item-status">
                          <span className="figma-status-green-dot"></span>
                          Lead Instructor
                        </span>
                      </div>
                    </div>
                    <div className="figma-item-media-status">
                      <span className="figma-media-pill active"><Mic size={13} /></span>
                      <span className="figma-media-pill active"><VideoIcon size={13} /></span>
                    </div>
                  </div>

                  {/* For Students: Show You in Roster */}
                  {!isInstructorRole && (
                    <div className="figma-participant-item">
                      <div className="figma-item-left">
                        <div className="figma-item-avatar" style={{ background: '#7C3AED', color: '#FFF' }}>
                          {(user?.name || 'Y').charAt(0).toUpperCase()}
                        </div>
                        <div className="figma-item-info">
                          <div className="figma-item-name-row">
                            <span className="figma-item-name">{user?.name || (lang === 'ta' ? 'நீங்கள்' : 'You')}</span>
                            <span className="figma-host-tag" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>You</span>
                          </div>
                          <span className="figma-item-status">
                            <span className="figma-status-green-dot"></span>
                            {lang === 'ta' ? 'வகுப்பில் உள்ளீர்கள்' : 'Active Practitioner'}
                          </span>
                        </div>
                      </div>
                      <div className="figma-item-media-status">
                        <span className={`figma-media-pill ${isMicOn ? 'active' : 'muted'}`}>
                          {isMicOn ? <Mic size={13} /> : <MicOff size={13} />}
                        </span>
                        <span className={`figma-media-pill ${isVideoOn ? 'active' : 'muted'}`}>
                          {isVideoOn ? <VideoIcon size={13} /> : <VideoOff size={13} />}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Connected Students List */}
                  {realStudentsList.length > 0 ? (
                    realStudentsList
                      .filter(st => isInstructorRole || st.phone !== user?.phone)
                      .map((st, idx) => (
                        <div key={st.phone || idx} className="figma-participant-item">
                          <div className="figma-item-left">
                            <div className="figma-item-avatar" style={{ background: '#8B5CF6', color: '#FFF' }}>
                              {(st.name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div className="figma-item-info">
                              <span className="figma-item-name">{st.name || 'Student'}</span>
                              <span className="figma-item-status">
                                <span className="figma-status-green-dot"></span>
                                {st.phone ? `+91 ${st.phone.slice(-4).padStart(st.phone.length, '•')}` : 'Online'}
                              </span>
                            </div>
                          </div>
                          <div className="figma-item-media-status">
                            <span className="figma-media-pill active"><Mic size={13} /></span>
                            <span className="figma-media-pill active"><VideoIcon size={13} /></span>
                            {isInstructorRole && (
                              <button
                                type="button"
                                className="figma-item-delete-btn"
                                onClick={() => handleDeleteLiveStudent(st.phone)}
                                title="Remove Student"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  ) : null}

                  {/* Empty state if 0 real students joined */}
                  {realStudentsList.length === 0 && (
                    <div className="figma-roster-empty-notice" style={{ padding: '24px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🧘‍♀️</div>
                      <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--heading, #29233D)', marginBottom: '4px' }}>
                        {lang === 'ta' ? 'மாணவர்கள் யாரும் இன்னும் இணையவில்லை (0)' : 'No students joined yet (0)'}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--subtle, #777184)', lineHeight: 1.4 }}>
                        {lang === 'ta'
                          ? 'மாணவர்கள் லிங்க்கைப் பயன்படுத்தி அல்லது மொபைல் எண் மூலம் இணைந்ததும் இங்கு தோன்றுவர்.'
                          : 'Students will appear here live once they register and join the room.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Chats */}
              <div className="figma-chats-card">
                <div className="figma-chats-header">
                  <h3 className="figma-chats-heading">Chats</h3>
                  <button type="button" className="figma-dots-btn">⋯</button>
                </div>

                <div className="figma-chats-stream" ref={chatStreamRef}>
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`figma-chat-bubble-wrap ${msg.isLocal ? 'sent' : 'received'} ${msg.isSystem ? 'system' : ''}`}
                    >
                      {!msg.isLocal && !msg.isSystem && (
                        <div className="figma-chat-author-avatar">
                          {(msg.sender || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="figma-chat-bubble">
                        <div className="figma-bubble-meta">
                          <span className="figma-bubble-sender">{msg.sender}</span>
                          <span className="figma-bubble-time">{msg.time}</span>
                        </div>
                        <p className="figma-bubble-text">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="figma-chat-input-form">
                  <input
                    type="text"
                    className="figma-chat-input"
                    placeholder={lang === 'ta' ? 'செய்தியைத் தட்டச்சு செய்க...' : 'Type a message...'}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="figma-chat-send-btn" aria-label="Send Message">
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asana Guide Modal */}
      {showAsanaGuide && (
        <div className="livekit-modal-backdrop" onClick={() => setShowAsanaGuide(false)}>
          <div className="livekit-modal-card max-w-xl p-6 ya-card bg-card border border-subtle shadow-2xl rounded-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-subtle mb-4">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-violet-500" />
                <h3 className="text-base font-bold text-heading m-0">Live Asana Posture Reference</h3>
              </div>
              <button type="button" className="close-x-btn" onClick={() => setShowAsanaGuide(false)}>✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {[
                { name: 'Surya Namaskar', sanskrit: 'சூரிய நமஸ்காரம்', tip: 'Sync movement with inhalation and exhalation.', duration: '5 - 10 Rounds' },
                { name: 'Vrikshasana (Tree Pose)', sanskrit: 'விருக்ஷாசனம்', tip: 'Fix your gaze on a steady point ahead for balance.', duration: '30s per leg' },
                { name: 'Bhujangasana (Cobra Pose)', sanskrit: 'புஜங்காசனம்', tip: 'Roll shoulders back, gently expand the chest.', duration: '3 - 5 Breaths' },
                { name: 'Virabhadrasana II (Warrior)', sanskrit: 'வீரபத்ராசனம் II', tip: 'Keep front knee stacked over ankle, hips open.', duration: '30s each side' },
                { name: 'Tadasana (Mountain Pose)', sanskrit: 'தாடாசனம்', tip: 'Ground all four corners of both feet into the mat.', duration: '1 Minute' },
                { name: 'Padmasana (Lotus Pose)', sanskrit: 'பத்மாசனம்', tip: 'Spine erect, hands in Chin Mudra for meditation.', duration: '5 - 10 Minutes' }
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-xs text-heading font-bold">{item.name}</strong>
                    <span className="text-[10px] text-violet-500 font-semibold">{item.duration}</span>
                  </div>
                  <span className="text-[11px] text-muted font-medium">{item.sanskrit}</span>
                  <p className="text-[11px] text-muted m-0 leading-snug">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student View: Class Ended Notice Overlay */}
      {classEndedNotice && (
        <div className="livekit-modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="livekit-modal-card text-center p-6 max-w-md mx-auto ya-card bg-card border border-subtle shadow-2xl rounded-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">
              {lang === 'ta' ? 'யோகா வகுப்பு நிறைவடைந்தது 🙏' : 'Yoga Class Concluded 🙏'}
            </h3>
            <p className="text-xs text-muted mb-6 leading-relaxed">
              {lang === 'ta'
                ? 'பயிற்றுநர் இந்த நேரலை யோகா வகுப்பை நிறைவு செய்தார். இன்றைய பயிற்சிக்காக வாழ்த்துகள்! உங்கள் வருகை பதிவு செய்யப்பட்டது.'
                : 'The instructor has concluded this live yoga session. Thank you for your practice today! Your attendance has been logged.'}
            </p>
            <button
              type="button"
              className="ya-btn ya-btn--primary w-full py-2.5 rounded-xl font-bold text-xs"
              onClick={() => {
                setClassEndedNotice(false);
                handleLeave();
              }}
            >
              {lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Return to Dashboard'}
            </button>
          </div>
        </div>
      )}

      {/* Phase 7: Instructor Live Class Attendance Register Drawer */}
      {showAttendanceDrawer && (
        <div className="livekit-modal-backdrop" onClick={() => setShowAttendanceDrawer(false)}>
          <div className="livekit-modal-card attendance-register-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                <h3 className="modal-title m-0">Live Class Attendance Register</h3>
              </div>
              <button
                type="button"
                className="close-x-btn"
                onClick={() => setShowAttendanceDrawer(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-subtle/50 rounded-xl mb-3 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <strong>{activeClass?.title || activeClass?.name || 'Hatha Yoga Flow'}</strong>
                <div className="text-muted text-[11px]">
                  Instructor: {activeClass?.instructor || 'NITHYA Master'} • Duration: {classDurationMins}m
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-card border border-subtle font-mono text-[11px]">
                  Timer: {formatTimer(sessionSeconds)}
                </span>
                <button
                  type="button"
                  className="ya-btn ya-btn--soft text-xs px-2.5 py-1.5 flex items-center gap-1 text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 cursor-pointer font-bold"
                  onClick={handleClearLiveRegister}
                  title="Clear Test Register"
                >
                  <Trash2 size={13} />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  className="ya-btn ya-btn--primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                  onClick={() => {
                    const text = `NITHYA YOGA — ATTENDANCE REGISTER\nClass: ${activeClass?.title || 'Hatha Yoga Flow'}\nDate: ${new Date().toLocaleDateString()}\nInstructor: ${activeClass?.instructor || 'NITHYA Master'}\n----------------------------------------\n` +
                      (connectedStudentsList.length
                        ? connectedStudentsList.map((s, i) => `${i + 1}. ${s.name} (${s.phone}) - Joined ${s.joinedAt || 'Active'} - ${currentAttendancePct >= 70 ? 'Present (70%+)' : 'Incomplete'}`).join('\n')
                        : (lang === 'ta' ? 'மாணவர்கள் யாரும் இன்னும் இணையவில்லை (0 மாணவர்கள்)' : 'No students joined yet (0 students)')) +
                      `\n----------------------------------------\nVerified WebRTC Attendance Session`;
                    navigator.clipboard.writeText(text);
                    alert('Attendance Register copied to clipboard!');
                  }}
                >
                  <Copy size={13} />
                  <span>Copy Register</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-xl border border-subtle">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-subtle bg-subtle/40 text-muted font-bold text-[11px]">
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Mobile Phone</th>
                    <th className="p-2">Joined Time</th>
                    <th className="p-2">Duration</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedStudentsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-xs text-muted">
                        {lang === 'ta' ? 'மாணவர்கள் யாரும் இன்னும் இணையவில்லை (0 மாணவர்கள்)' : 'No students joined yet (0 active students)'}
                      </td>
                    </tr>
                  ) : (
                    connectedStudentsList.map((s, idx) => (
                      <tr key={idx} className="border-b border-subtle/50">
                        <td className="p-2 font-bold text-heading">{s.name}</td>
                        <td className="p-2 text-muted">{s.phone}</td>
                        <td className="p-2 text-muted">{s.joinedAt || 'Just now'}</td>
                        <td className="p-2 font-mono">{formatTimer(sessionSeconds)}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            currentAttendancePct >= 70
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {currentAttendancePct >= 70 ? '✓ Present (70%+)' : `Incomplete (${currentAttendancePct}%)`}
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            onClick={() => handleDeleteLiveStudent(s.phone)}
                            title={lang === 'ta' ? 'மாணவரை நீக்கு' : 'Delete Student'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-actions-bar mt-4">
              <button
                type="button"
                className="ya-btn ya-btn--soft"
                onClick={() => setShowAttendanceDrawer(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LiveKit Cloud / Server Credentials Modal */}
      {showConfigModal && (
        <div className="livekit-modal-backdrop" onClick={() => setShowConfigModal(false)}>
          <div className="livekit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-violet" />
                <h3 className="modal-title m-0">LiveKit Server Configuration</h3>
              </div>
              <button
                type="button"
                className="close-x-btn"
                onClick={() => setShowConfigModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="modal-explanation-text">
              LiveKit powers real-time WebRTC audio and video streaming. Your API Secret is stored securely in the local backend (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs">.env</code>) and is never exposed to frontend code.
            </p>

            <form onSubmit={handleSaveConfig} className="livekit-credentials-form">
              <div className="form-group-field">
                <label className="form-label font-bold text-heading">
                  Backend API Server URL
                  <span className="text-muted text-xs block font-normal">
                    Required when hosted on static GitHub Pages. Leave empty if hosted on same domain.
                  </span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. http://localhost:8080 or https://your-backend.onrender.com"
                    value={backendUrl}
                    onChange={(e) => {
                      setBackendUrlState(e.target.value);
                      setTestBackendStatus('idle');
                    }}
                    className="modal-text-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleTestBackend}
                    disabled={testBackendStatus === 'testing'}
                    className="ya-btn ya-btn--soft text-xs px-3 py-2 whitespace-nowrap cursor-pointer"
                  >
                    {testBackendStatus === 'testing' ? 'Testing...' : testBackendStatus === 'success' ? '✓ Online' : testBackendStatus === 'error' ? '✕ Offline' : 'Test Server'}
                  </button>
                </div>
                {testBackendStatus === 'success' && (
                  <span className="text-emerald-500 text-[11px] block mt-1 font-semibold">✓ Backend server is active and reachable!</span>
                )}
                {testBackendStatus === 'error' && (
                  <span className="text-rose-500 text-[11px] block mt-1 font-medium">✕ Cannot reach backend at this URL. Make sure server is deployed &amp; running.</span>
                )}
              </div>

              <div className="form-group-field">
                <label className="form-label">
                  LiveKit WebSocket URL
                  <span className="text-muted text-xs block font-normal">
                    e.g. <code>wss://your-project.livekit.cloud</code> or <code>ws://localhost:7880</code>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="wss://your-project.livekit.cloud"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  className="modal-text-input"
                />
              </div>

              <div className="form-group-field">
                <label className="form-label">
                  LiveKit API Key
                  <span className="text-muted text-xs block font-normal">
                    e.g. <code>APIxxxxxxxxxxxx</code>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="APIxxxxxxxxxxxx"
                  value={configApiKey}
                  onChange={(e) => setConfigApiKey(e.target.value)}
                  className="modal-text-input"
                />
              </div>

              <div className="form-group-field">
                <label className="form-label">
                  LiveKit API Secret
                  <span className="text-muted text-xs block font-normal">
                    Kept safely on the server to sign WebRTC tokens
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  value={configApiSecret}
                  onChange={(e) => setConfigApiSecret(e.target.value)}
                  className="modal-text-input"
                />
              </div>

              <div className="free-cloud-help-card">
                <strong>💡 Don't have LiveKit credentials yet?</strong>
                <p>
                  1. Visit <a href="https://cloud.livekit.io" target="_blank" rel="noopener noreferrer">cloud.livekit.io</a> and sign in with GitHub or Google.<br />
                  2. Create a free project (includes 50 GB/month free bandwidth).<br />
                  3. Copy your WebSocket URL, API Key, and Secret and paste them above.
                </p>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="ya-btn ya-btn--soft"
                  onClick={() => setShowConfigModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="ya-btn ya-ripple"
                >
                  {isSavingConfig ? 'Saving...' : 'Save & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
