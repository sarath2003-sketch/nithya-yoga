import React, { useState } from 'react';
import { Play, Pause, Disc3, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function RecentlyPlayedDailyMix({ onSelectClass, showToast, lang = 'en' }) {
  const [playingId, setPlayingId] = useState(null);

  const recentItems = [
    {
      id: 'recent-1',
      title: 'Sunset Drive',
      titleTa: 'சூரிய அஸ்தமனப் பாதை',
      subtitle: 'Chill & Focus Flow • 45m',
      subtitleTa: 'அமைதியான ஆசனப் பயிற்சி • 45 நிமிடம்',
      thumbnail: 'assets/images/pastel/thumb_sunset_hd.jpg',
      tag: 'Yoga'
    },
    {
      id: 'recent-2',
      title: 'Golden Hour',
      titleTa: 'தங்க மாலை நேரம்',
      subtitle: 'Deep Breath & Calm • 30m',
      subtitleTa: 'ஆழ்ந்த சுவாசம் & அமைதி • 30 நிமிடம்',
      thumbnail: 'assets/images/pastel/thumb_golden_hd.jpg',
      tag: 'Breathe'
    },
    {
      id: 'recent-3',
      title: 'Coffee Shop Vibes',
      titleTa: 'லோ-ஃபை அமைதி இசை',
      subtitle: 'Lofi Ambient Chimes • 20m',
      subtitleTa: 'அமைதியான தியான ஒலி • 20 நிமிடம்',
      thumbnail: 'assets/images/pastel/thumb_coffee_hd.jpg',
      tag: 'Music'
    }
  ];

  const handlePlayToggle = (item) => {
    if (playingId === item.id) {
      setPlayingId(null);
      if (showToast) {
        showToast(
          lang === 'ta' ? 'இடைநிறுத்தப்பட்டது' : 'Paused',
          item.title,
          'info'
        );
      }
    } else {
      setPlayingId(item.id);
      audioEngine.playSoftBell();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'இசை ஒலிக்கிறது 🎵' : 'Playing Track 🎵',
          `${item.title} (${item.subtitle})`,
          'success'
        );
      }
    }
  };

  const handlePlayDailyMix = () => {
    if (playingId === 'daily-mix') {
      setPlayingId(null);
    } else {
      setPlayingId('daily-mix');
      audioEngine.playGentleChime();
      if (showToast) {
        showToast(
          lang === 'ta' ? 'தினசரி கலவை ஒலிக்கிறது 🎶' : 'Daily Mix Started 🎶',
          lang === 'ta' ? 'Chill Vibes & Mindful Flow' : 'Chill Vibes & Mindful Flow • 80 tracks',
          'success'
        );
      }
    }
  };

  return (
    <div className="recently-daily-mix-wrapper">
      <div className="recently-daily-grid">
        {/* Left Card: Recently Played List */}
        <div className="dashboard-card recent-played-card">
          <div className="recent-card-header">
            <div>
              <h4 className="recent-card-title">
                {lang === 'ta' ? 'சமீபத்தில் பயிற்சி செய்தவை' : 'Recently Played'}
              </h4>
              <span className="recent-card-sub">
                {lang === 'ta' ? 'மீண்டும் தொடரவும் • விரைவுப் பயிற்சி' : 'Pick up where you left off'}
              </span>
            </div>
            <button 
              type="button" 
              className="btn-recent-see-all ya-ripple"
              onClick={() => onSelectClass && onSelectClass({ id: 'all-classes' })}
            >
              <span>{lang === 'ta' ? 'அனைத்தும்' : 'See all'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="recent-played-items-list">
            {recentItems.map((item) => {
              const isPlaying = playingId === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`recent-item-row ${isPlaying ? 'recent-item-playing' : ''}`}
                  onClick={() => handlePlayToggle(item)}
                >
                  <div className="recent-item-thumb-wrap">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="recent-item-thumb-img" 
                    />
                    {isPlaying && (
                      <span className="recent-thumb-eq-indicator">
                        <span className="eq-bar eq-bar-1"></span>
                        <span className="eq-bar eq-bar-2"></span>
                        <span className="eq-bar eq-bar-3"></span>
                      </span>
                    )}
                  </div>

                  <div className="recent-item-info">
                    <h5 className="recent-item-name">
                      {lang === 'ta' ? item.titleTa : item.title}
                    </h5>
                    <p className="recent-item-desc">
                      {lang === 'ta' ? item.subtitleTa : item.subtitle}
                    </p>
                  </div>

                  <button 
                    type="button"
                    className={`btn-recent-play-circle ${isPlaying ? 'playing' : ''}`}
                    aria-label={`Play ${item.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayToggle(item);
                    }}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Daily Mix (Cozy Room) */}
        <div className="dashboard-card daily-mix-card">
          <div className="daily-mix-header">
            <div>
              <h4 className="daily-mix-title">
                {lang === 'ta' ? 'தினசரி யோகா கலவை' : 'Daily Mix'}
              </h4>
              <span className="daily-mix-badge">
                <Sparkles size={12} className="sparkle-gold" />
                <span>{lang === 'ta' ? 'உங்களுக்காக உருவானது' : 'Made for you'}</span>
              </span>
            </div>
          </div>

          <div className="daily-mix-artwork-container" onClick={handlePlayDailyMix}>
            <img 
              src="assets/images/pastel/daily_mix_room_hd.jpg" 
              alt="Daily Mix Cozy Meditation Room" 
              className="daily-mix-cover-img" 
            />
            <div className="daily-mix-overlay-gradient"></div>

            <button 
              type="button"
              className={`btn-daily-mix-play-float ${playingId === 'daily-mix' ? 'playing' : ''}`}
              aria-label="Play Daily Mix"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayDailyMix();
              }}
            >
              {playingId === 'daily-mix' ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            <div className="daily-mix-bottom-meta">
              <span className="daily-mix-pill-tag">
                <Volume2 size={12} />
                <span>{lang === 'ta' ? '80 பாடல்கள் & ஆசனங்கள்' : 'Chill Vibes • 80 tracks'}</span>
              </span>
              <h4 className="daily-mix-track-title">
                {lang === 'ta' ? 'அமைதியான சுவாசம் & பாய்வு' : 'Chill Vibes & Mindful Flow'}
              </h4>
              <p className="daily-mix-track-desc">
                {lang === 'ta' 
                  ? 'லோ-ஃபை இசை • அமைதி அலைகள் • யோகா விழிப்புணர்வு'
                  : 'Lo-Fi Beats • Ambient Waves • Yoga Mind'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
