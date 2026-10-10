import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square,
  Volume2, 
  SkipBack, 
  SkipForward,
  Upload,
  Link as LinkIcon,
  Trash2,
  Check,
  Headphones,
  Music2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ThreeDMusic } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';
import { loadStorage, saveStorage, DEFAULT_PLAYLIST } from '../utils/storage';

export default function RelaxationZone({ lang = 'en' }) {
  const [subMode, setSubMode] = useState('curated'); // 'curated', 'upload', 'url'
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [playlist, setPlaylist] = useState(() => {
    const saved = loadStorage('nithya_playlist', DEFAULT_PLAYLIST);
    if (Array.isArray(saved) && saved.length > 0) {
      // Merge latest audioUrls from DEFAULT_PLAYLIST to prevent stale localStorage paths
      return saved.map(t => {
        const match = DEFAULT_PLAYLIST.find(d => d.id === t.id || d.title === t.title);
        return match ? { ...match, ...t, audioUrl: match.audioUrl, ambientType: match.ambientType } : t;
      });
    }
    return DEFAULT_PLAYLIST;
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // In-card Upload state
  const [localFileTitle, setLocalFileTitle] = useState('');
  const [localFileName, setLocalFileName] = useState('');
  const [localDataUrl, setLocalDataUrl] = useState('');

  // In-card URL state
  const [urlTrackTitle, setUrlTrackTitle] = useState('');
  const [audioUrlInput, setAudioUrlInput] = useState('');

  // Playback & Audio State
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const audioRef = useRef(null);

  const currentTrack = playlist[currentIndex] || playlist[0] || {
    id: 'track-1',
    title: 'Peaceful Mind',
    titleTa: 'அமைதியான மனம்',
    category: 'Relaxing Music',
    categoryTa: 'நிம்மதியான இசை',
    duration: '30:00'
  };

  useEffect(() => {
    saveStorage('nithya_playlist', playlist);
  }, [playlist]);

  // Clean up any audio or ambient synthesis on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioEngine.stopAllAmbient();
    };
  }, []);

  const formatSec = (sec) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const playTrackAtIndex = (index, autoPlay = true) => {
    if (index < 0 || index >= playlist.length) return;
    setCurrentIndex(index);
    setPlaybackSeconds(0);
    setAudioError(null);

    // Guarantee no overlapping ambient or previous track sounds
    audioEngine.stopAllAmbient();

    const track = playlist[index];
    if (!track) return;

    if (audioRef.current) {
      if (track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.volume = volume;
        if (autoPlay) {
          setIsAudioLoading(true);
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
              setIsAudioLoading(false);
            }).catch(err => {
              console.warn('Playback error or auto-play prevented:', err);
              setIsAudioLoading(false);
              // Fallback to Web Audio synth
              if (track.ambientType) {
                audioEngine.startAmbient(track.ambientType);
                setIsPlaying(true);
                setAudioError(lang === 'ta' ? 'சிந்தசைசர் ஒலி இயக்கப்படுகிறது' : 'Using ambient synthesizer');
              }
            });
          }
        }
      } else if (track.ambientType) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioEngine.startAmbient(track.ambientType);
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = (targetTrack) => {
    if (targetTrack) {
      const idx = playlist.findIndex(p => p.id === targetTrack.id || p.title === targetTrack.title);
      if (idx !== -1) {
        if (idx === currentIndex) {
          if (isPlaying) {
            pauseAudio();
          } else {
            resumeAudio();
          }
          return;
        }
        playTrackAtIndex(idx, true);
        return;
      }
    }

    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    audioEngine.stopAllAmbient();
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    const track = playlist[currentIndex];
    if (audioRef.current && track?.audioUrl) {
      setIsAudioLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
        setAudioError(null);
      }).catch(err => {
        console.warn('Playback error on resume:', err);
        setIsAudioLoading(false);
        if (track?.ambientType) {
          audioEngine.startAmbient(track.ambientType);
          setIsPlaying(true);
        }
      });
    } else if (track?.ambientType) {
      audioEngine.startAmbient(track.ambientType);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioEngine.stopAllAmbient();
    setIsPlaying(false);
    setPlaybackSeconds(0);
    setAudioError(null);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % playlist.length;
    playTrackAtIndex(nextIdx, true);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrackAtIndex(prevIdx, true);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    audioEngine.setVolume(newVol);
  };

  const handleSeek = (e) => {
    const newSec = Number(e.target.value);
    setPlaybackSeconds(newSec);
    if (audioRef.current && durationSeconds > 0) {
      audioRef.current.currentTime = newSec;
    }
  };

  // Direct File Upload from card
  const handleLocalFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setLocalFileName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setLocalFileTitle(cleanName);

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setLocalDataUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlayUploadedNow = () => {
    if (!localDataUrl) return;

    const newTrack = {
      id: `local-${Date.now()}`,
      title: localFileTitle.trim() || localFileName || 'Custom Track',
      category: 'My Uploads',
      duration: 'Custom',
      audioUrl: localDataUrl,
      isLocal: true
    };

    const newPlaylist = [newTrack, ...playlist];
    setPlaylist(newPlaylist);
    setCurrentIndex(0);
    setPlaybackSeconds(0);
    audioEngine.stopAllAmbient();

    if (audioRef.current) {
      audioRef.current.src = localDataUrl;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
      }).catch(e => console.warn(e));
    }
  };

  const handlePlayUrlNow = () => {
    if (!audioUrlInput.trim()) return;

    const newTrack = {
      id: `url-${Date.now()}`,
      title: urlTrackTitle.trim() || 'Online Audio Stream',
      category: 'Web Stream',
      duration: 'Live Stream',
      audioUrl: audioUrlInput.trim()
    };

    const newPlaylist = [newTrack, ...playlist];
    setPlaylist(newPlaylist);
    setCurrentIndex(0);
    setPlaybackSeconds(0);
    audioEngine.stopAllAmbient();

    if (audioRef.current) {
      audioRef.current.src = audioUrlInput.trim();
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAudioLoading(false);
      }).catch(e => {
        console.warn(e);
        setAudioError(lang === 'ta' ? 'URL ஆடியோவை ஏற்ற முடியவில்லை' : 'Could not stream audio URL');
      });
    }
  };

  return (
    <div className="dashboard-card relaxation-zone-card modern-zen-relaxation">
      {/* Native HTML5 Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={(e) => {
          setPlaybackSeconds(Math.floor(e.currentTarget.currentTime));
          if (e.currentTarget.duration && !isNaN(e.currentTarget.duration)) {
            setDurationSeconds(Math.floor(e.currentTarget.duration));
          }
        }}
        onLoadedMetadata={(e) => {
          if (e.currentTarget.duration && !isNaN(e.currentTarget.duration)) {
            setDurationSeconds(Math.floor(e.currentTarget.duration));
          }
          setIsAudioLoading(false);
        }}
        onWaiting={() => setIsAudioLoading(true)}
        onPlaying={() => {
          setIsAudioLoading(false);
          setIsPlaying(true);
          setAudioError(null);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleNext}
        onError={() => {
          setIsAudioLoading(false);
          setIsPlaying(false);
          const track = playlist[currentIndex];
          if (track?.ambientType) {
            audioEngine.startAmbient(track.ambientType);
            setIsPlaying(true);
            setAudioError(lang === 'ta' ? 'சிந்தசைசர் ஒலி இயக்கப்படுகிறது' : 'Ambient sound generator active');
          } else {
            setAudioError(lang === 'ta' ? 'ஆடியோ பிழை' : 'Playback error');
          }
        }}
      />

      {/* Header with 3D Music Badge */}
      <div className="card-header-block flex justify-between items-center mb-3">
        <div className="flex items-center gap-2.5">
          <ThreeDMusic size={34} />
          <div>
            <h3 className="card-title-main text-base font-extrabold m-0">
              <span>{lang === 'ta' ? 'தியான இசை & ரிலாக்சேஷன்' : 'Yoga Sound & Relaxation'}</span>
            </h3>
            <p className="card-sub-motto text-xs text-muted m-0">
              {lang === 'ta' ? 'மனதை அமைதிப்படுத்துங்கள். ஆன்மாவை குணப்படுத்துங்கள்.' : 'Calm your mind. Heal your soul in-place.'}
            </p>
          </div>
        </div>

        {/* Live Audio Playing Indicator */}
        {isPlaying && (
          <div className="audio-playing-indicator-pill flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-subtle text-purple text-xs font-bold">
            <span className="live-dot-pulse">●</span>
            <span>{isAudioLoading ? (lang === 'ta' ? 'ஏற்றுகிறது...' : 'Buffering...') : (lang === 'ta' ? 'ஒலிக்கிறது' : 'Playing')}</span>
          </div>
        )}
      </div>

      {/* 3 Direct In-Card Tabs */}
      <div className="in-card-audio-tabs-row flex gap-1 p-1 bg-subtle rounded-xl mb-3">
        <button
          type="button"
          className={`tab-pill-flex flex-1 text-xs py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${subMode === 'curated' ? 'active bg-card shadow-sm text-heading' : 'text-muted'}`}
          onClick={() => setSubMode('curated')}
        >
          <Headphones size={13} />
          <span>{lang === 'ta' ? 'தியான ஒலிகள்' : 'Curated Audio'}</span>
        </button>

        <button
          type="button"
          className={`tab-pill-flex flex-1 text-xs py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${subMode === 'upload' ? 'active bg-card shadow-sm text-heading' : 'text-muted'}`}
          onClick={() => setSubMode('upload')}
        >
          <Upload size={13} />
          <span>{lang === 'ta' ? 'ஆடியோ பதிவேற்றுக' : 'Upload Audio'}</span>
        </button>

        <button
          type="button"
          className={`tab-pill-flex flex-1 text-xs py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${subMode === 'url' ? 'active bg-card shadow-sm text-heading' : 'text-muted'}`}
          onClick={() => setSubMode('url')}
        >
          <LinkIcon size={13} />
          <span>{lang === 'ta' ? 'இணைய URL' : 'Audio URL'}</span>
        </button>
      </div>

      {/* TAB CONTENT A: Curated Audio Grid */}
      {subMode === 'curated' && (
        <div className="curated-tracks-deck mb-3 space-y-2">
          {/* Hero Track Card: Featured Meditation */}
          <div 
            className="guided-meditation-box modern-sound-hero cursor-pointer relative overflow-hidden rounded-xl"
            onClick={() => {
              const track = playlist.find(t => t.id === 'track-2') || playlist[1];
              togglePlay(track);
            }}
          >
            <img 
              src="assets/images/meditation.jpg" 
              alt="Guided Meditation" 
              className="meditation-bg-img" 
            />
            <div className="meditation-overlay-gradient"></div>

            <div className="meditation-text-meta">
              <span className="badge-sound-type text-[10px] font-bold uppercase tracking-wider text-teal">
                🧘‍♀️ {lang === 'ta' ? 'பிரத்யேக தியானம்' : 'Featured Meditation'}
              </span>
              <h4 className="meditation-title-bold text-sm font-bold text-white m-0">
                {lang === 'ta' ? 'வழிகாட்டப்பட்ட தியானம் (Om Vibration)' : 'Guided Meditation (136.1 Hz Om)'}
              </h4>
              <span className="meditation-duration-tag text-xs text-slate-300">
                {lang === 'ta' ? '10 நிமிடம் • ஆழ்ந்த அமைதி' : '10 min • Deep Peace & Centering'}
              </span>
            </div>

            <button 
              type="button" 
              className="meditation-play-circle" 
              aria-label="Play Meditation"
            >
              {isPlaying && currentTrack.id === 'track-2' ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>

          {/* 4 Quick Audio Pills: Pranayama, Singing Bowl, Sleep Zen, Peaceful Mind */}
          <div className="audio-chips-row grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Pranayama */}
            <div 
              className={`audio-chip-item chip-green cursor-pointer p-2 rounded-xl transition-all ${currentTrack.id === 'track-3' && isPlaying ? 'ring-2 ring-green' : ''}`}
              onClick={() => {
                const track = playlist.find(t => t.id === 'track-3') || playlist[2];
                togglePlay(track);
              }}
            >
              <div className="chip-meta">
                <strong className="text-xs block">{lang === 'ta' ? 'சுவாசம்' : 'Pranayama'}</strong>
                <small className="text-[10px] text-muted">432 Hz Healing</small>
              </div>
            </div>

            {/* 2. Singing Bowl */}
            <div 
              className={`audio-chip-item chip-purple cursor-pointer p-2 rounded-xl transition-all ${currentTrack.id === 'track-4' && isPlaying ? 'ring-2 ring-purple' : ''}`}
              onClick={() => {
                const track = playlist.find(t => t.id === 'track-4') || playlist[3];
                togglePlay(track);
              }}
            >
              <div className="chip-meta">
                <strong className="text-xs block">{lang === 'ta' ? 'பாடும் கிண்ணம்' : 'Singing Bowl'}</strong>
                <small className="text-[10px] text-muted">Tibetan Resonant</small>
              </div>
            </div>

            {/* 3. Sleep Zen */}
            <div 
              className={`audio-chip-item chip-blue cursor-pointer p-2 rounded-xl transition-all ${currentTrack.id === 'track-5' && isPlaying ? 'ring-2 ring-blue' : ''}`}
              onClick={() => {
                const track = playlist.find(t => t.id === 'track-5') || playlist[4];
                togglePlay(track);
              }}
            >
              <div className="chip-meta">
                <strong className="text-xs block">{lang === 'ta' ? 'உறக்கம்' : 'Sleep Zen'}</strong>
                <small className="text-[10px] text-muted">White Rain Waves</small>
              </div>
            </div>

            {/* 4. Peaceful Mind */}
            <div 
              className={`audio-chip-item chip-amber cursor-pointer p-2 rounded-xl transition-all ${currentTrack.id === 'track-1' && isPlaying ? 'ring-2 ring-amber' : ''}`}
              onClick={() => {
                const track = playlist.find(t => t.id === 'track-1') || playlist[0];
                togglePlay(track);
              }}
            >
              <div className="chip-meta">
                <strong className="text-xs block">{lang === 'ta' ? 'அமைதி மனம்' : 'Peaceful Mind'}</strong>
                <small className="text-[10px] text-muted">Harmonic Balance</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT B: Direct File Upload Right on the Card */}
      {subMode === 'upload' && (
        <div className="direct-upload-box p-3 bg-subtle rounded-xl mb-3 border border-dashed border-purple">
          <div className="flex items-center gap-2 mb-2">
            <Upload size={16} className="text-purple" />
            <h4 className="text-xs font-bold m-0">{lang === 'ta' ? 'உங்கள் சொந்த ஆடியோ கோப்பைப் பதிவேற்றவும்' : 'Upload Your Local Audio (.mp3 / .wav)'}</h4>
          </div>

          <p className="text-[11px] text-muted mb-2">
            {lang === 'ta' ? 'உங்கள் கணினியிலுள்ள எந்தவொரு தியானப் பாடலையும் தேர்ந்தெடுத்து உடனே இயக்கலாம்.' : 'Select any yoga music file from your device. Plays directly inside this browser.'}
          </p>

          <input 
            type="file" 
            accept="audio/*" 
            onChange={handleLocalFileChange} 
            className="block w-full text-xs text-muted file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple file:text-white hover:file:opacity-90 cursor-pointer" 
          />

          {localFileName && (
            <div className="uploaded-file-ready-strip mt-2 p-2 bg-card rounded-lg flex items-center justify-between">
              <div>
                <strong className="text-xs block text-heading">🎵 {localFileName}</strong>
                <span className="text-[10px] text-green font-medium">✓ Ready to play</span>
              </div>
              <button
                type="button"
                className="btn-play-now-mini px-3 py-1 rounded-full bg-purple text-white text-xs font-bold cursor-pointer hover:opacity-90 flex items-center gap-1"
                onClick={handlePlayUploadedNow}
              >
                <Play size={12} />
                <span>{lang === 'ta' ? 'உடனே இயக்கு' : 'Play Now'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT C: Direct Audio URL Right on the Card */}
      {subMode === 'url' && (
        <div className="direct-url-box p-3 bg-subtle rounded-xl mb-3 border border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon size={16} className="text-blue" />
            <h4 className="text-xs font-bold m-0">{lang === 'ta' ? 'நேரடி ஆடியோ URL இணைப்பு' : 'Paste Direct Audio Stream URL'}</h4>
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Track Title (e.g. Flute Meditation)"
              value={urlTrackTitle}
              onChange={(e) => setUrlTrackTitle(e.target.value)}
              className="form-input text-xs w-full"
            />
            <input 
              type="url" 
              placeholder="https://example.com/audio.mp3"
              value={audioUrlInput}
              onChange={(e) => setAudioUrlInput(e.target.value)}
              className="form-input text-xs w-full"
            />
            <button
              type="button"
              className="btn-play-url-now w-full py-1.5 rounded-lg bg-blue text-white text-xs font-bold cursor-pointer hover:opacity-90 flex items-center justify-center gap-1.5"
              onClick={handlePlayUrlNow}
            >
              <Play size={12} />
              <span>{lang === 'ta' ? 'ஸ்ட்ரீம் இயக்கு' : 'Play Stream in Page'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Error notice if audio fails */}
      {audioError && (
        <div className="flex items-center gap-1.5 p-2 mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px]">
          <AlertCircle size={13} className="flex-shrink-0" />
          <span className="truncate">{audioError}</span>
        </div>
      )}

      {/* Modern Waveform Visualizer Bar */}
      <div className="player-waveform-visualizer-bar flex items-center justify-center gap-1 py-1.5 px-3 bg-card rounded-lg mb-2">
        {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
          <span 
            key={i} 
            className={`wave-bar ${isPlaying ? 'animated' : 'idle'}`} 
            style={{ 
              height: isPlaying ? `${Math.max(6, (h * (i % 2 === 0 ? 0.9 : 1.1)) % 22)}px` : '4px',
              animationDelay: `${i * 0.08}s`
            }} 
          />
        ))}
        <span className="text-[10px] text-muted ml-2 font-mono">
          {formatSec(playbackSeconds)} / {durationSeconds > 0 ? formatSec(durationSeconds) : (currentTrack.duration || '--:--')}
        </span>
      </div>

      {/* Interactive Progress Scrubber Slider */}
      <div className="player-progress-container px-2 mb-2 flex items-center gap-2">
        <input
          type="range"
          min="0"
          max={durationSeconds > 0 ? durationSeconds : 180}
          value={playbackSeconds}
          onChange={handleSeek}
          className="w-full h-1.5 bg-subtle rounded-lg appearance-none cursor-pointer accent-purple"
          title={`${formatSec(playbackSeconds)} / ${durationSeconds > 0 ? formatSec(durationSeconds) : currentTrack.duration}`}
        />
      </div>

      {/* Mini Music Player Dock */}
      <div className="mini-player-dock-bar modern-dock p-2.5 rounded-xl bg-card flex items-center justify-between shadow-sm">
        <div className="player-track-info flex items-center gap-2.5 overflow-hidden">
          <div className="player-album-thumb w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img src="assets/images/class-thumb.jpg" alt="Track Art" className="w-full h-full object-fit-cover" />
          </div>
          <div className="player-text overflow-hidden">
            <strong className="text-xs block truncate text-heading">
              {lang === 'ta' && currentTrack.titleTa ? currentTrack.titleTa : currentTrack.title}
            </strong>
            <small className="text-[10px] text-muted block truncate">
              {isAudioLoading 
                ? (lang === 'ta' ? 'ஏற்றுகிறது...' : 'Buffering...')
                : (lang === 'ta' && currentTrack.categoryTa ? currentTrack.categoryTa : currentTrack.category)}
            </small>
          </div>
        </div>

        {/* Player Controls */}
        <div className="player-controls-cluster flex items-center gap-1.5">
          <button 
            type="button" 
            className="btn-player-mini p-1.5 rounded-full hover:bg-subtle cursor-pointer" 
            aria-label="Previous"
            onClick={handlePrev}
            title="Previous"
          >
            <SkipBack size={14} />
          </button>
          
          <button 
            type="button" 
            className="btn-player-mini play-accent p-2 rounded-full bg-purple text-white cursor-pointer shadow-md hover:scale-105 transition-transform" 
            onClick={() => togglePlay()}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isAudioLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
          </button>

          <button 
            type="button" 
            className="btn-player-mini p-1.5 rounded-full hover:bg-subtle cursor-pointer" 
            aria-label="Stop"
            onClick={handleStop}
            title="Stop Audio"
          >
            <Square size={12} />
          </button>

          <button 
            type="button" 
            className="btn-player-mini p-1.5 rounded-full hover:bg-subtle cursor-pointer" 
            aria-label="Next"
            onClick={handleNext}
            title="Next"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Interactive Volume Slider */}
        <div className="player-volume-slider-wrap flex items-center gap-1.5">
          <Volume2 size={13} className="text-muted" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="volume-range-slider w-14 cursor-pointer"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
}
