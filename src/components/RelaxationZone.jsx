import React, { useState } from 'react';
import { 
  Flower2, 
  Play, 
  Pause, 
  Wind, 
  Music as MusicIcon, 
  Moon, 
  Volume2, 
  SkipBack, 
  SkipForward 
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function RelaxationZone({ lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('Meditation');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Peaceful Mind',
    titleTa: 'அமைதியான மனம்',
    category: 'Relaxing Music',
    categoryTa: 'நிம்மதியான இசை'
  });

  const filterTabs = ['Meditation', 'Breathing', 'Music', 'Sleep'];

  const togglePlay = (track) => {
    if (track) setCurrentTrack(track);

    if (isPlaying) {
      audioEngine.stopAllAmbient();
      setIsPlaying(false);
    } else {
      audioEngine.playTibetanSingingBowl();
      setIsPlaying(true);
    }
  };

  return (
    <div className="dashboard-card relaxation-zone-card">
      {/* Header */}
      <div className="card-header-block">
        <h3 className="card-title-main">
          <Flower2 size={18} className="text-teal" />
          <span>{lang === 'ta' ? 'ரிலாக்சேஷன் மண்டலம்' : 'Relaxation Zone'}</span>
        </h3>
        <p className="card-sub-motto">
          {lang === 'ta' ? 'மனதை அமைதிப்படுத்துங்கள். ஆன்மாவை குணப்படுத்துங்கள்.' : 'Calm your mind. Heal your soul.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="pill-filters-row">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`filter-pill-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Guided Meditation Hero Card */}
      <div 
        className="guided-meditation-box"
        onClick={() => togglePlay({
          title: 'Guided Meditation',
          titleTa: 'வழிகாட்டப்பட்ட தியானம்',
          category: '10 min • Calm Mind',
          categoryTa: '10 நிமிடம் • அமைதி மனம்'
        })}
      >
        <img 
          src="assets/images/meditation.jpg" 
          alt="Guided Meditation" 
          className="meditation-bg-img" 
        />
        <div className="meditation-overlay-gradient"></div>

        <div className="meditation-text-meta">
          <h4 className="meditation-title-bold">
            {lang === 'ta' ? 'வழிகாட்டப்பட்ட தியானம்' : 'Guided Meditation'}
          </h4>
          <span className="meditation-duration-tag">
            {lang === 'ta' ? '10 நிமிடம் • அமைதி மனம்' : '10 min • Calm Mind'}
          </span>
        </div>

        <button 
          type="button" 
          className="meditation-play-circle" 
          aria-label="Play Meditation"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      {/* 3 Quick Audio Pills */}
      <div className="audio-chips-row">
        {/* Chip 1 */}
        <div 
          className="audio-chip-item chip-green"
          onClick={() => togglePlay({
            title: 'Deep Breathing',
            titleTa: 'ஆழ்ந்த சுவாசம்',
            category: '5 min • Focus',
            categoryTa: '5 நிமிடம் • கவனம்'
          })}
        >
          <div className="chip-icon-box bg-green-light">
            <Wind size={16} className="text-green" />
          </div>
          <div className="chip-meta">
            <strong>{lang === 'ta' ? 'ஆழ்ந்த சுவாசம்' : 'Deep Breathing'}</strong>
            <small>5 min • Focus</small>
          </div>
        </div>

        {/* Chip 2 */}
        <div 
          className="audio-chip-item chip-purple"
          onClick={() => togglePlay({
            title: 'Relaxing Music',
            titleTa: 'நிம்மதியான இசை',
            category: '30 min • Calm',
            categoryTa: '30 நிமிடம் • அமைதி'
          })}
        >
          <div className="chip-icon-box bg-purple-light">
            <MusicIcon size={16} className="text-purple" />
          </div>
          <div className="chip-meta">
            <strong>{lang === 'ta' ? 'நிம்மதியான இசை' : 'Relaxing Music'}</strong>
            <small>30 min • Calm</small>
          </div>
        </div>

        {/* Chip 3 */}
        <div 
          className="audio-chip-item chip-blue"
          onClick={() => togglePlay({
            title: 'Sleep Sounds',
            titleTa: 'உறக்க ஒலிகள்',
            category: '45 min • Good Sleep',
            categoryTa: '45 நிமிடம் • ஆழ்ந்த உறக்கம்'
          })}
        >
          <div className="chip-icon-box bg-blue-light">
            <Moon size={16} className="text-blue" />
          </div>
          <div className="chip-meta">
            <strong>{lang === 'ta' ? 'உறக்க ஒலிகள்' : 'Sleep Sounds'}</strong>
            <small>45 min • Good Sleep</small>
          </div>
        </div>
      </div>

      {/* Mini Music Player Dock */}
      <div className="mini-player-dock-bar">
        <div className="player-track-info">
          <div className="player-album-thumb">
            <img src="assets/images/class-thumb.jpg" alt="Track Art" />
          </div>
          <div className="player-text">
            <strong>{lang === 'ta' && currentTrack.titleTa ? currentTrack.titleTa : currentTrack.title}</strong>
            <small>{lang === 'ta' && currentTrack.categoryTa ? currentTrack.categoryTa : currentTrack.category}</small>
          </div>
        </div>

        <div className="player-controls-cluster">
          <button type="button" className="btn-player-mini" aria-label="Previous">
            <SkipBack size={14} />
          </button>
          <button 
            type="button" 
            className="btn-player-mini play-accent" 
            onClick={() => togglePlay()}
            aria-label="Play"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button type="button" className="btn-player-mini" aria-label="Next">
            <SkipForward size={14} />
          </button>
        </div>

        <div className="player-volume-slider-wrap">
          <Volume2 size={14} className="vol-icon" />
          <div className="volume-track-line">
            <div className="volume-fill-bar" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
