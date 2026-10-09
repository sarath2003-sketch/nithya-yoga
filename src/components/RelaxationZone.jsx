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
  Music2
} from 'lucide-react';
import { ThreeDMusic } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';
import { loadStorage, saveStorage, DEFAULT_PLAYLIST } from '../utils/storage';

export default function RelaxationZone({ lang = 'en' }) {
  const [subMode, setSubMode] = useState('curated'); // 'curated', 'upload', 'url'
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [playlist, setPlaylist] = useState(() => loadStorage('nithya_playlist', DEFAULT_PLAYLIST));
  const [currentIndex, setCurrentIndex] = useState(0);

  // In-card Upload state
  const [localFileTitle, setLocalFileTitle] = useState('');
  const [localFileName, setLocalFileName] = useState('');
  const [localDataUrl, setLocalDataUrl] = useState('');

  // In-card URL state
  const [urlTrackTitle, setUrlTrackTitle] = useState('');
  const [audioUrlInput, setAudioUrlInput] = useState('');

  // Progress state
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

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

  // Timer simulation for playback progress
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const playTrackAtIndex = (index) => {
    if (index < 0 || index >= playlist.length) return;
    setCurrentIndex(index);
    setPlaybackSeconds(0);
    const track = playlist[index];

    audioEngine.stopAllAmbient();

    if (track.audioUrl) {
      audioEngine.playAudioFile(track.audioUrl, () => {
        handleNext();
      });
    } else {
      audioEngine.startAmbient(track.ambientType || 'bowl');
    }
    setIsPlaying(true);
  };

  const togglePlay = (track) => {
    if (track) {
      const idx = playlist.findIndex(p => p.id === track.id || p.title === track.title);
      if (idx !== -1) {
        if (idx === currentIndex && isPlaying) {
          handleStop();
          return;
        }
        playTrackAtIndex(idx);
        return;
      }
    }

    if (isPlaying) {
      handleStop();
    } else {
      playTrackAtIndex(currentIndex);
    }
  };

  const handleStop = () => {
    audioEngine.stopAllAmbient();
    setIsPlaying(false);
    setPlaybackSeconds(0);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % playlist.length;
    playTrackAtIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrackAtIndex(prevIdx);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
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

    setPlaylist(prev => [newTrack, ...prev]);
    setCurrentIndex(0);
    setPlaybackSeconds(0);
    audioEngine.stopAllAmbient();
    audioEngine.playAudioFile(localDataUrl, () => handleNext());
    setIsPlaying(true);
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

    setPlaylist(prev => [newTrack, ...prev]);
    setCurrentIndex(0);
    setPlaybackSeconds(0);
    audioEngine.stopAllAmbient();
    audioEngine.playAudioFile(audioUrlInput.trim(), () => handleNext());
    setIsPlaying(true);
  };

  const handleDeleteCurrentTrack = (id) => {
    if (playlist.length <= 1) return;
    setPlaylist(prev => prev.filter(t => t.id !== id));
    setCurrentIndex(0);
    handleStop();
  };

  return (
    <div className="dashboard-card relaxation-zone-card modern-zen-relaxation">
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
            <span>{lang === 'ta' ? 'ஒலிக்கிறது' : 'Playing'}</span>
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
          {/* Hero Track Card */}
          <div 
            className="guided-meditation-box modern-sound-hero cursor-pointer relative overflow-hidden rounded-xl"
            onClick={() => togglePlay({
              id: 'track-2',
              title: 'Guided Meditation',
              titleTa: 'வழிகாட்டப்பட்ட தியானம்',
              category: '10 min • Calm Mind',
              categoryTa: '10 நிமிடம் • அமைதி மனம்',
              ambientType: 'om'
            })}
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
              {isPlaying && currentTrack.title.includes('Meditation') ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>

          {/* 3 Quick Audio Pills */}
          <div className="audio-chips-row grid grid-cols-3 gap-2">
            <div 
              className={`audio-chip-item chip-green cursor-pointer p-2 rounded-xl transition-all ${currentTrack.title.includes('Breathing') && isPlaying ? 'ring-2 ring-green' : ''}`}
              onClick={() => togglePlay({
                id: 'track-3',
                title: 'Deep Breathing',
                titleTa: 'ஆழ்ந்த சுவாசம்',
                category: '5 min • Focus',
                ambientType: 'music'
              })}
            >
              <div className="chip-meta">
                <strong className="text-xs block">{lang === 'ta' ? 'சுவாசம்' : 'Pranayama'}</strong>
                <small className="text-[10px] text-muted">432 Hz Healing</small>
              </div>
            </div>

            <div 
              className={`audio-chip-item chip-purple cursor-pointer p-2 rounded-xl transition-all ${currentTrack.title.includes('Relaxing') && isPlaying ? 'ring-2 ring-purple' : ''}`}
              onClick={() => togglePlay({
                id: 'track-1',
                title: 'Peaceful Mind',
                titleTa: 'அமைதியான மனம்',
                category: 'Relaxing Music',
                ambientType: 'bowl'
              })}
            >
              <div className="chip-meta">
                <strong className="text-xs block">{lang === 'ta' ? 'இசை' : 'Singing Bowl'}</strong>
                <small className="text-[10px] text-muted">Tibetan Resonant</small>
              </div>
            </div>

            <div 
              className={`audio-chip-item chip-blue cursor-pointer p-2 rounded-xl transition-all ${currentTrack.title.includes('Sleep') && isPlaying ? 'ring-2 ring-blue' : ''}`}
              onClick={() => togglePlay({
                id: 'track-4',
                title: 'Sleep Sounds',
                titleTa: 'உறக்க ஒலிகள்',
                category: '45 min • Good Sleep',
                ambientType: 'rain'
              })}
            >
              <div className="chip-meta">
                <strong className="text-xs block">{lang === 'ta' ? 'உறக்கம்' : 'Sleep Zen'}</strong>
                <small className="text-[10px] text-muted">White Rain Waves</small>
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
          {isPlaying ? formatSec(playbackSeconds) : '00:00'}
        </span>
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
              {lang === 'ta' && currentTrack.categoryTa ? currentTrack.categoryTa : currentTrack.category}
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
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
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
