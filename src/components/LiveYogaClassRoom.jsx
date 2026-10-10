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
  Crown
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { ThreeDLotus, ThreeDBell, ThreeDHeart } from './ThreeDIcons';
import { apiFetch, getApiBaseUrl, setApiBaseUrl } from '../utils/api';

// Single Participant Video Tile with real track attachment
function ParticipantTile({
  participant,
  isLocal = false,
  isSpotlight = false,
  isSpeaking = false,
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
        .find(pub => pub.source === Track.Source.Camera || pub.track?.kind === 'video');
      
      const audioPub = Array.from(participant.audioTrackPublications?.values() || [])
        .find(pub => pub.source === Track.Source.Microphone || pub.track?.kind === 'audio');

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

    participant.on('trackMuted', onTrackMuted);
    participant.on('trackUnmuted', onTrackUnmuted);
    participant.on('trackSubscribed', onTrackSubscribed);
    participant.on('trackUnsubscribed', onTrackUnsubscribed);

    return () => {
      participant.off('trackMuted', onTrackMuted);
      participant.off('trackUnmuted', onTrackUnmuted);
      participant.off('trackSubscribed', onTrackSubscribed);
      participant.off('trackUnsubscribed', onTrackUnsubscribed);
    };
  }, [participant]);

  // Attach video to DOM
  useEffect(() => {
    const el = videoRef.current;
    if (el && videoTrack) {
      videoTrack.attach(el);
      return () => {
        try {
          videoTrack.detach(el);
        } catch (e) {}
      };
    }
  }, [videoTrack]);

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

  const isInstructor = meta.role === 'instructor' || participant.identity?.includes('instructor') || participant.name?.toLowerCase().includes('instructor') || participant.name?.toLowerCase().includes('priya');
  const displayName = participant.name || participant.identity || (isLocal ? 'You' : 'Practitioner');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`livekit-participant-card ${isSpotlight ? 'is-spotlight' : ''} ${isSpeaking ? 'is-speaking' : ''} ${isLocal ? 'is-local' : ''}`}
      onClick={onPin}
      title={isSpotlight ? undefined : `Click to spotlight ${displayName}`}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // Avoid local echo
        className={`participant-video-stream ${hasVideo ? 'visible' : 'hidden'}`}
      />

      {/* Hidden audio element for remote stream */}
      {!isLocal && <audio ref={audioRef} autoPlay />}

      {/* Avatar Fallback when camera is off */}
      {!hasVideo && (
        <div className="participant-avatar-fallback">
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
          {hasAudio ? (
            <span className={`status-icon-pill ${isSpeaking ? 'active-speaking' : 'audio-on'}`} title="Mic on">
              <Mic size={12} />
            </span>
          ) : (
            <span className="status-icon-pill audio-muted" title="Mic muted">
              <MicOff size={12} />
            </span>
          )}
          {!hasVideo && (
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

  // Role: Instructor or Student
  const [isInstructorRole, setIsInstructorRole] = useState(() => {
    return user?.role === 'instructor' || user?.isInstructor === true || false;
  });

  // Class session timer
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [hasAttendanceRecorded, setHasAttendanceRecorded] = useState(false);

  // In-room LiveKit WebRTC Data Chat
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'NITHYA Yoga Bot',
      text: lang === 'ta' ? 'நேரலை வகுப்பிற்கு நல்வரவு! ஆடியோ, வீடியோ செயல்படுகிறது.' : 'Welcome to Live Yoga Class! Real-time WebRTC audio & video active.',
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

  // Connect to LiveKit Room via secure backend token
  const connectToRoom = useCallback(async () => {
    setConnectionState('connecting');
    setErrorMessage('');
    audioEngine.playGentleChime();

    try {
      const roomName = (activeClass?.id ? `yoga-${activeClass.id}` : 'nithya-live-studio').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const participantName = (user?.name || 'Sarah').trim();

      // Step 1: Request token from secure backend with verified credentials (JWT)
      const authToken = localStorage.getItem('nithya_admin_token') || localStorage.getItem('nithya_auth_token');
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
          classId: activeClass?.id
        })
      });

      if (data.needsConfig) {
        setNeedsSetup(true);
        setShowConfigModal(true);
        throw new Error(data.error || 'LiveKit server credentials required. Please configure below.');
      }

      const { token, serverUrl } = data;
      if (!token || !serverUrl) {
        throw new Error('Invalid token response from backend: missing token or serverUrl');
      }

      // Step 2: Initialize LiveKit Room
      const liveRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: VideoPresets.h720.resolution
        }
      });

      // Step 3: Wire Room Events
      liveRoom.on(RoomEvent.Connected, () => {
        setConnectionState('connected');
        setParticipants(Array.from(liveRoom.remoteParticipants.values()));
        audioEngine.playTempleBell();

        // Server-backed attendance start for registered members
        const memberToken = localStorage.getItem('nithya_auth_token');
        if (memberToken) {
          apiFetch('/api/attendance/join', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${memberToken}`
            },
            body: JSON.stringify({ classId: activeClass?.id })
          }).catch(err => console.warn('Attendance join logging note:', err.message));
        }
      });

      liveRoom.on(RoomEvent.Disconnected, () => {
        setConnectionState('disconnected');
        setParticipants([]);
      });

      liveRoom.on(RoomEvent.Reconnecting, () => {
        setConnectionState('reconnecting');
      });

      liveRoom.on(RoomEvent.Reconnected, () => {
        setConnectionState('connected');
      });

      liveRoom.on(RoomEvent.ParticipantConnected, (p) => {
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

      // Receive real-time chat & hand raises via LiveKit Data Channel
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
            audioEngine.playSoftBell();
          } else if (dataObj.type === 'raise-hand') {
            setRaisedHands(prev => new Set(prev).add(participant.identity));
            audioEngine.playMeditationTone();
          }
        } catch (e) {}
      });

      // Step 4: Connect to Server
      await liveRoom.connect(serverUrl, token);

      // Step 5: Enable Camera and Microphone
      try {
        await liveRoom.localParticipant.setMicrophoneEnabled(isMicOn);
      } catch (err) {
        console.warn('Microphone permission or hardware not available:', err);
      }

      try {
        await liveRoom.localParticipant.setCameraEnabled(isVideoOn);
      } catch (err) {
        console.warn('Camera permission or hardware not available:', err);
      }

      setRoom(liveRoom);
    } catch (err) {
      console.error('LiveKit connection error:', err);
      setConnectionState('error');
      setErrorMessage(err.message || 'Unable to connect to LiveKit yoga studio.');
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
    if (!room?.localParticipant) return;
    const nextState = !isMicOn;
    try {
      await room.localParticipant.setMicrophoneEnabled(nextState);
      setIsMicOn(nextState);
    } catch (e) {
      console.error('Mic toggle error:', e);
    }
  };

  // Handle Turn On/Off Camera
  const handleToggleVideo = async () => {
    if (!room?.localParticipant) return;
    const nextState = !isVideoOn;
    try {
      await room.localParticipant.setCameraEnabled(nextState);
      setIsVideoOn(nextState);
    } catch (e) {
      console.error('Video toggle error:', e);
    }
  };

  // Handle Screen Share (Instructor)
  const handleToggleScreenShare = async () => {
    if (!room?.localParticipant) return;
    const nextState = !isScreenSharing;
    try {
      await room.localParticipant.setScreenShareEnabled(nextState);
      setIsScreenSharing(nextState);
    } catch (e) {
      console.error('Screen share error:', e);
    }
  };

  // Raise Hand Reaction (LiveKit Data Packet)
  const handleRaiseHand = () => {
    if (!room?.localParticipant) return;
    try {
      const payload = new TextEncoder().encode(JSON.stringify({ type: 'raise-hand' }));
      room.localParticipant.publishData(payload, { reliable: true });
      audioEngine.playMeditationTone();
      setRaisedHands(prev => new Set(prev).add(room.localParticipant.identity));
    } catch (e) {}
  };

  // Send in-room chat message via LiveKit Data Channel
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !room?.localParticipant) return;

    try {
      const payload = new TextEncoder().encode(JSON.stringify({
        type: 'chat',
        message: chatInput.trim()
      }));
      room.localParticipant.publishData(payload, { reliable: true });

      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: user?.name || 'You',
          text: chatInput.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLocal: true
        }
      ]);
      setChatInput('');
    } catch (e) {
      console.error('Chat error:', e);
    }
  };

  // Leave Class
  const handleLeave = () => {
    audioEngine.playGentleChime();

    // Server-backed attendance leave
    const memberToken = localStorage.getItem('nithya_auth_token');
    if (memberToken) {
      apiFetch('/api/attendance/leave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${memberToken}`
        },
        body: JSON.stringify({ classId: activeClass?.id })
      }).catch(err => console.warn('Attendance leave logging note:', err.message));
    }

    if (room) {
      try {
        room.disconnect();
      } catch (e) {}
    }
    setRoom(null);
    setConnectionState('disconnected');
    if (onLeaveClass) onLeaveClass();
  };

  // Verify and Record Attendance
  const handleVerifyAttendance = () => {
    setHasAttendanceRecorded(true);
    audioEngine.playTempleBell();
    const durationMins = Math.max(1, Math.round(sessionSeconds / 60));

    if (onRecordAttendance) {
      onRecordAttendance({
        id: `att-livekit-${Date.now()}`,
        studentName: user?.name || 'Sarah',
        classId: activeClass?.id || 'cls-1',
        className: activeClass?.title || activeClass?.name || 'Hatha Yoga',
        instructor: activeClass?.instructor || 'Priya',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: durationMins,
        status: 'Verified LiveKit WebRTC Session',
        timestamp: new Date().toISOString()
      });
    }
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

  // Determine spotlighted participant
  const allParticipants = room ? [room.localParticipant, ...participants] : [];
  const spotlightParticipant = spotlightParticipantId
    ? allParticipants.find(p => p.identity === spotlightParticipantId)
    : (allParticipants.find(p => p.metadata?.includes('instructor') || p.name?.toLowerCase().includes('priya') || p.identity?.includes('instructor')) || allParticipants[0]);

  const otherParticipants = allParticipants.filter(p => p?.identity !== spotlightParticipant?.identity);

  return (
    <div className={`livekit-yoga-studio-container ${isFullscreen ? 'fullscreen-mode' : ''}`} ref={containerRef}>
      {/* Studio Header */}
      <div className="livekit-studio-header">
        <div className="header-left-title-cluster">
          <div className="live-status-pill-indicator">
            <span className={`live-pulse-dot ${connectionState === 'connected' ? 'active-green' : 'connecting-amber'}`}></span>
            <span className="live-pill-text">
              {connectionState === 'connected' ? (lang === 'ta' ? 'நேரலை யோகா ஸ்டுடியோ' : 'LiveKit WebRTC HD') : (lang === 'ta' ? 'இணைக்கிறது...' : 'Connecting...')}
            </span>
          </div>

          <div className="class-title-meta">
            <h3 className="live-class-heading">
              {activeClass?.title || activeClass?.name || 'Hatha Yoga Flow'}
            </h3>
            <span className="live-instructor-subtitle">
              {lang === 'ta' ? 'பயிற்றுநர்:' : 'Led by'} <strong>{activeClass?.instructor || 'Priya'}</strong>
            </span>
          </div>
        </div>

        {/* Top Controls: Role selector, Timer, Settings */}
        <div className="header-right-tools">
          {/* Role badge / switcher */}
          <button
            type="button"
            className={`role-toggle-pill ${isInstructorRole ? 'as-instructor' : 'as-student'}`}
            onClick={() => {
              if (connectionState === 'idle' || connectionState === 'disconnected') {
                setIsInstructorRole(!isInstructorRole);
              }
            }}
            title={connectionState === 'connected' ? 'Role locked during call' : 'Switch instructor / student role'}
          >
            {isInstructorRole ? <Crown size={13} /> : <Users size={13} />}
            <span>{isInstructorRole ? (lang === 'ta' ? 'பயிற்றுநர் முறை' : 'Instructor Mode') : (lang === 'ta' ? 'மாணவர் முறை' : 'Student Mode')}</span>
          </button>

          {/* Live Timer */}
          {connectionState === 'connected' && (
            <div className="live-timer-chip">
              <Radio size={13} className="timer-radio-icon" />
              <span>{formatTimer(sessionSeconds)}</span>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            className="header-icon-tool-btn ya-icon-btn"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Credentials / Config Button */}
          <button
            type="button"
            className="header-icon-tool-btn ya-icon-btn"
            onClick={() => setShowConfigModal(true)}
            title="LiveKit Server Credentials"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="livekit-studio-body">
        {/* State 1: IDLE / NOT CONNECTED */}
        {connectionState === 'idle' && (
          <div className="livekit-lobby-card">
            <div className="lobby-artwork-wrap">
              <ThreeDLotus size={64} />
            </div>

            <h3 className="lobby-headline">
              {lang === 'ta' ? 'லைவ்கிட் நேரலை யோகா வகுப்பில் இணைக' : 'Ready for your Live Yoga Class'}
            </h3>
            <p className="lobby-subtext">
              {lang === 'ta'
                ? 'உயர்தர வீடியோ மற்றும் ஆடியோவுடன் உங்கள் பயிற்றுநர் மற்றும் வகுப்புத் தோழர்களுடன் நேரடியாக இணையுங்கள்.'
                : 'Real-time peer-to-peer WebRTC video & crystal-clear audio with your instructor and classmates.'}
            </p>

            {/* Role Radio Picker */}
            <div className="lobby-role-selector">
              <button
                type="button"
                className={`role-card-btn ${!isInstructorRole ? 'selected' : ''}`}
                onClick={() => setIsInstructorRole(false)}
              >
                <Users size={18} />
                <div>
                  <strong>{lang === 'ta' ? 'மாணவர் (Student)' : 'Student Practitioner'}</strong>
                  <span>{lang === 'ta' ? 'வகுப்பில் பங்கேற்று ஆசனங்களைப் பயிற்சி செய்யுங்கள்' : 'Join class & follow instructor guidance'}</span>
                </div>
              </button>

              <button
                type="button"
                className={`role-card-btn ${isInstructorRole ? 'selected' : ''}`}
                onClick={() => setIsInstructorRole(true)}
              >
                <Crown size={18} />
                <div>
                  <strong>{lang === 'ta' ? 'யோகா பயிற்றுநர் (Instructor)' : 'Yoga Instructor / Host'}</strong>
                  <span>{lang === 'ta' ? 'வகுப்பை வழிநடத்துங்கள் & மாணவர்களுக்கு வழிகாட்டுங்கள்' : 'Lead class, broadcast & moderate students'}</span>
                </div>
              </button>
            </div>

            {/* Quick Media Check */}
            <div className="lobby-media-preview-row">
              <button
                type="button"
                className={`media-check-toggle ${isMicOn ? 'active' : 'muted'}`}
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? <Mic size={15} /> : <MicOff size={15} />}
                <span>{isMicOn ? (lang === 'ta' ? 'மைக் ஆன்' : 'Mic On') : (lang === 'ta' ? 'மைக் ஆஃப்' : 'Mic Muted')}</span>
              </button>

              <button
                type="button"
                className={`media-check-toggle ${isVideoOn ? 'active' : 'muted'}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <VideoIcon size={15} /> : <VideoOff size={15} />}
                <span>{isVideoOn ? (lang === 'ta' ? 'கேமரா ஆன்' : 'Camera On') : (lang === 'ta' ? 'கேமரா ஆஃப்' : 'Camera Off')}</span>
              </button>
            </div>

            <div className="lobby-actions-row">
              <button
                type="button"
                className="btn-join-studio ya-btn ya-ripple"
                onClick={connectToRoom}
              >
                <Radio size={16} />
                <span>{lang === 'ta' ? 'லைவ் வகுப்பில் இணைக' : 'Enter Live Yoga Room'}</span>
              </button>
            </div>

            {needsSetup && (
              <div className="needs-config-banner" onClick={() => setShowConfigModal(true)}>
                <AlertCircle size={15} />
                <span>{lang === 'ta' ? 'லைவ்கிட் சர்வர் நற்சான்றிதழ்களை அமைக்க இங்கே கிளிக் செய்யவும்.' : 'LiveKit server credentials needed — Click here to configure.'}</span>
              </div>
            )}
          </div>
        )}

        {/* State 2: CONNECTING / LOADING */}
        {connectionState === 'connecting' && (
          <div className="livekit-loading-state">
            <div className="spinner-lotus-wrap">
              <div className="outer-pulse-ring"></div>
              <ThreeDLotus size={52} />
            </div>
            <h4 className="loading-title">
              {lang === 'ta' ? 'யோகா ஸ்டுடியோவுடன் இணைகிறது...' : 'Connecting to LiveKit WebRTC Studio...'}
            </h4>
            <p className="loading-sub">
              {lang === 'ta' ? 'பாதுகாப்பான டோக்கன் சரிபார்க்கப்படுகிறது & ஆடியோ/வீடியோ பரிமாற்றம் தொடங்குகிறது...' : 'Negotiating secure media channels & joining room...'}
            </p>
          </div>
        )}

        {/* State 3: ERROR STATE */}
        {connectionState === 'error' && (
          <div className="livekit-error-state">
            <AlertCircle size={42} className="error-icon" />
            <h4 className="error-heading">
              {lang === 'ta' ? 'இணைப்பு தோல்வி' : 'Connection Failed'}
            </h4>
            <p className="error-detail-text">{errorMessage}</p>

            <div className="error-actions-row">
              <button
                type="button"
                className="ya-btn ya-ripple"
                onClick={connectToRoom}
              >
                <RefreshCw size={15} />
                <span>{lang === 'ta' ? 'மீண்டும் முயற்சிக்க' : 'Retry Connection'}</span>
              </button>

              <button
                type="button"
                className="ya-btn ya-btn--soft"
                onClick={() => setShowConfigModal(true)}
              >
                <Settings size={15} />
                <span>{lang === 'ta' ? 'சர்வர் அமைப்புகள்' : 'Configure LiveKit'}</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: CONNECTED VIDEO ROOM */}
        {connectionState === 'connected' && (
          <div className="livekit-active-room-layout">
            <div className={`video-stage-area ${layoutMode === 'grid' ? 'grid-view' : 'spotlight-view'}`}>
              {layoutMode === 'spotlight' ? (
                <>
                  {/* Spotlight Main Stage */}
                  <div className="spotlight-main-stage">
                    {spotlightParticipant ? (
                      <ParticipantTile
                        participant={spotlightParticipant}
                        isLocal={spotlightParticipant === room?.localParticipant}
                        isSpotlight={true}
                        isSpeaking={activeSpeakers.includes(spotlightParticipant.identity)}
                        lang={lang}
                      />
                    ) : (
                      <div className="waiting-for-teacher-placeholder">
                        <ThreeDLotus size={48} />
                        <p>{lang === 'ta' ? 'பயிற்றுநருக்காக காத்திருக்கிறது...' : 'Waiting for instructor to enter the stage...'}</p>
                      </div>
                    )}
                  </div>

                  {/* Filmstrip for remaining peers / students */}
                  {otherParticipants.length > 0 && (
                    <div className="spotlight-filmstrip-row">
                      {otherParticipants.map((p) => (
                        <div key={p.identity} className="filmstrip-tile-wrapper">
                          <ParticipantTile
                            participant={p}
                            isLocal={p === room?.localParticipant}
                            isSpotlight={false}
                            isSpeaking={activeSpeakers.includes(p.identity)}
                            lang={lang}
                            onPin={() => setSpotlightParticipantId(p.identity)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Gallery Grid View */
                <div className={`gallery-participants-grid count-${allParticipants.length}`}>
                  {allParticipants.map((p) => (
                    <ParticipantTile
                      key={p.identity}
                      participant={p}
                      isLocal={p === room?.localParticipant}
                      isSpotlight={false}
                      isSpeaking={activeSpeakers.includes(p.identity)}
                      lang={lang}
                      onPin={() => {
                        setSpotlightParticipantId(p.identity);
                        setLayoutMode('spotlight');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* In-Room Real-time Chat Drawer */}
            {showChat && (
              <aside className="in-room-chat-drawer">
                <div className="chat-drawer-header">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <strong>{lang === 'ta' ? 'வகுப்பு அரட்டை (Chat)' : 'Class Real-Time Chat'}</strong>
                  </div>
                  <button
                    type="button"
                    className="close-chat-btn"
                    onClick={() => setShowChat(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="chat-messages-container">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble-item ${msg.isLocal ? 'sent-by-me' : 'received-by-peer'} ${msg.isSystem ? 'system-msg' : ''}`}>
                      <div className="bubble-meta">
                        <span className="bubble-author">{msg.sender}</span>
                        <span className="bubble-time">{msg.time}</span>
                      </div>
                      <p className="bubble-text-content">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                  <input
                    type="text"
                    placeholder={lang === 'ta' ? 'செய்தியைத் தட்டச்சு செய்க...' : 'Type a mindful message...'}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn" aria-label="Send">
                    <Send size={15} />
                  </button>
                </form>
              </aside>
            )}
          </div>
        )}
      </div>

      {/* Persistent Bottom Controls Bar */}
      {connectionState === 'connected' && (
        <div className="livekit-controls-dock">
          {/* Audio Toggle */}
          <button
            type="button"
            className={`dock-control-btn ${isMicOn ? 'active-audio' : 'muted-danger'}`}
            onClick={handleToggleMic}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            <span className="dock-label">{isMicOn ? 'Mute' : 'Unmute'}</span>
          </button>

          {/* Video Toggle */}
          <button
            type="button"
            className={`dock-control-btn ${isVideoOn ? 'active-video' : 'muted-danger'}`}
            onClick={handleToggleVideo}
            title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoOn ? <VideoIcon size={18} /> : <VideoOff size={18} />}
            <span className="dock-label">{isVideoOn ? 'Stop Video' : 'Start Video'}</span>
          </button>

          {/* Screen Share (Instructor only) */}
          {isInstructorRole && (
            <button
              type="button"
              className={`dock-control-btn ${isScreenSharing ? 'active-share' : ''}`}
              onClick={handleToggleScreenShare}
              title="Share Screen"
            >
              <Share2 size={18} />
              <span className="dock-label">Share</span>
            </button>
          )}

          {/* Raise Hand (Student) */}
          {!isInstructorRole && (
            <button
              type="button"
              className={`dock-control-btn ${raisedHands.has(room?.localParticipant?.identity) ? 'hand-raised' : ''}`}
              onClick={handleRaiseHand}
              title="Raise Hand"
            >
              <Hand size={18} />
              <span className="dock-label">Raise Hand</span>
            </button>
          )}

          {/* Layout Mode Switcher */}
          <button
            type="button"
            className="dock-control-btn"
            onClick={() => setLayoutMode(layoutMode === 'spotlight' ? 'grid' : 'spotlight')}
            title="Toggle Stage / Grid Layout"
          >
            <Layers size={18} />
            <span className="dock-label">{layoutMode === 'spotlight' ? 'Grid' : 'Speaker'}</span>
          </button>

          {/* Real-Time Chat Toggle */}
          <button
            type="button"
            className={`dock-control-btn ${showChat ? 'active-chat' : ''}`}
            onClick={() => setShowChat(!showChat)}
            title="Class Chat"
          >
            <MessageSquare size={18} />
            <span className="dock-label">Chat</span>
          </button>

          {/* Verify Attendance Button */}
          <button
            type="button"
            className={`dock-control-btn ${hasAttendanceRecorded ? 'attendance-verified' : 'attendance-btn'}`}
            onClick={handleVerifyAttendance}
            title="Log Verified Attendance"
          >
            {hasAttendanceRecorded ? <CheckCircle2 size={18} /> : <Award size={18} />}
            <span className="dock-label">{hasAttendanceRecorded ? 'Logged' : 'Attendance'}</span>
          </button>

          {/* Red Leave Class Button */}
          <button
            type="button"
            className="dock-control-btn leave-call-btn"
            onClick={handleLeave}
            title="Leave Class"
          >
            <PhoneOff size={18} />
            <span className="dock-label">{lang === 'ta' ? 'வெளியேறு' : 'Leave'}</span>
          </button>
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
