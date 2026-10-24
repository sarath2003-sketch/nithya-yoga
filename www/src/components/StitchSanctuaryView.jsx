import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Calendar, 
  Heart, 
  Volume2, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Star, 
  Moon, 
  Bell, 
  ArrowRight, 
  Flower2, 
  Activity,
  Layers,
  Check,
  Zap,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

/**
 * Google Stitch Sanctuary UI — AI-Designed Mobile-First Yoga Experience
 * Matches the Google Stitch interactive preview specifications:
 * - Today's Focus Pill
 * - Daily Sanctuary Hero with dynamic actions
 * - The Seven Sacred Chakras with real 528 Hz Web Audio resonance
 * - Daily Practice & 7-Day Lotus Blossom Streak
 * - Embedded Upcoming Live Class Card
 * - Curated Classes Studio Grid
 * - Evening Breathwork wind-down reminder
 * - 1-Click UI Switcher (Stitch ⇋ Classic)
 */
export default function StitchSanctuaryView({
  user,
  activeClass,
  onJoinLive,
  onViewSchedule,
  onTabChange,
  onToggleUiMode,
  uiMode = 'stitch',
  lang = 'en',
  showToast
}) {
  const [selectedChakraId, setSelectedChakraId] = useState('heart');
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [eveningBreathworkActive, setEveningBreathworkActive] = useState(true);
  const [shakingBtn, setShakingBtn] = useState(null);

  const displayName = user?.name ? user.name.split(' ')[0] : 'Nithya';

  // The 7 Sacred Chakras matching Google Stitch module
  const CHAKRAS = [
    {
      id: 'crown',
      nameEn: 'Crown (Sahasrara)',
      nameTa: 'துரியம் (சஹஸ்ராரா)',
      freq: 963,
      freqLabel: '963 Hz Pure Crown',
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.45)',
      descEn: 'Divine consciousness, spiritual unity, and infinite cosmic peace. Restores spiritual clarity.',
      descTa: 'தெய்வீக விழிப்புணர்வு, ஆன்மீக ஒருமைப்பாடு மற்றும் பேரமைதி.'
    },
    {
      id: 'third-eye',
      nameEn: 'Third Eye (Ajna)',
      nameTa: 'ஆக்ஞா (புருவ மத்தி)',
      freq: 852,
      freqLabel: '852 Hz Visionary',
      color: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.45)',
      descEn: 'Intuition, deep wisdom, and inner guidance. Harmonizes mental focus and clears anxiety.',
      descTa: 'உள்ஞானம், ஆழ்ந்த கவனம் மற்றும் தெளிவான மனநிலை.'
    },
    {
      id: 'throat',
      nameEn: 'Throat (Vishuddha)',
      nameTa: 'விசுத்தி (தொண்டை)',
      freq: 741,
      freqLabel: '741 Hz Expression',
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.45)',
      descEn: 'Truthful communication, open expression, and conscious speech. Cleanses emotional stagnation.',
      descTa: 'உண்மைப் பேச்சு, சுதந்திரமான வெளிப்பாடு மற்றும் தைரியம்.'
    },
    {
      id: 'heart',
      nameEn: 'Heart (Anahata)',
      nameTa: 'அனாஹதா (இதயம்)',
      freq: 528,
      freqLabel: '528 Hz Harmonic',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.5)',
      descEn: 'Compassion, balance & unconditional love. Resonates through open thoracic breath and rhythmic calm.',
      descTa: 'கருணை, சமநிலை மற்றும் எல்லையற்ற அன்பு. ஆழ்ந்த இதய சுவாசம் மூலம் அமைதி அளிக்கிறது.'
    },
    {
      id: 'solar-plexus',
      nameEn: 'Solar Plexus (Manipura)',
      nameTa: 'மணிபூரகம் (தொப்புள்)',
      freq: 639,
      freqLabel: '639 Hz Radiance',
      color: '#eab308',
      glow: 'rgba(234, 179, 8, 0.45)',
      descEn: 'Inner fire, personal power, and unwavering confidence. Ignites digestion and vitality.',
      descTa: 'தன்னம்பிக்கை, ஆற்றல் மற்றும் அக்னி சக்தி.'
    },
    {
      id: 'sacral',
      nameEn: 'Sacral (Svadhisthana)',
      nameTa: 'சுவாதிஷ்டானம்',
      freq: 417,
      freqLabel: '417 Hz Flow',
      color: '#f97316',
      glow: 'rgba(249, 115, 22, 0.45)',
      descEn: 'Creative passion, emotional balance, and natural adaptability to change.',
      descTa: 'படைப்பாற்றல், உணர்ச்சி சமநிலை மற்றும் நெகிழ்வுத்தன்மை.'
    },
    {
      id: 'root',
      nameEn: 'Root (Muladhara)',
      nameTa: 'மூலாதாரம்',
      freq: 396,
      freqLabel: '396 Hz Grounding',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.45)',
      descEn: 'Earth foundation, safety, stability, and peaceful belonging in the physical world.',
      descTa: 'பூமித் தொடர்பு, பாதுகாப்பு, மன உறுதி மற்றும் நிலைத்தன்மை.'
    }
  ];

  const currentChakra = CHAKRAS.find(c => c.id === selectedChakraId) || CHAKRAS[3];

  // Curated Classes matching Stitch design
  const CURATED_CLASSES = [
    {
      id: 'vinyasa-vitality',
      titleEn: 'Vinyasa Flow: Awakening Vitality',
      titleTa: 'வின்யாசா ஃப்ளோ: விழிப்புணர்வு சக்தி',
      levelEn: 'Intermediate',
      levelTa: 'இடைநிலை',
      rating: '4.9',
      reviews: '128',
      durationEn: '45 min • Guided by Elena Sen',
      durationTa: '45 நிமி • எலினா சென் வழிகாட்டல்',
      tagColor: '#8b5cf6',
      badge: 'Active Flow'
    },
    {
      id: 'yin-deep-rest',
      titleEn: 'Yin Yoga for Deep Rest',
      titleTa: 'யின் யோகா: ஆழ்ந்த அமைதி',
      levelEn: 'Beginner',
      levelTa: 'தொடக்கநிலை',
      rating: '5.0',
      reviews: '94',
      durationEn: '30 min • Guided by Nithya Devi',
      durationTa: '30 நிமி • நித்யா தேவி வழிகாட்டல்',
      tagColor: '#10b981',
      badge: 'Tranquil'
    },
    {
      id: 'pranayama-alchemy',
      titleEn: 'Pranayama & Breath Alchemy',
      titleTa: 'பிராணாயாமம்: சுவாச ரசவாதம்',
      levelEn: 'All Levels',
      levelTa: 'அனைத்து நிலை',
      rating: '4.9',
      reviews: '176',
      durationEn: '15 min • Guided by Kabir Raj',
      durationTa: '15 நிமி • கபீர் ராஜ் வழிகாட்டல்',
      tagColor: '#38bdf8',
      badge: 'Breathwork'
    }
  ];

  // Button Click Shake Effect Handler
  const handleButtonClick = (btnId, callback) => {
    setShakingBtn(btnId);
    setTimeout(() => setShakingBtn(null), 350);
    if (callback) callback();
  };

  // Play Harmonic Solfeggio / Chakra Frequency Tone
  const handlePlayChakraTone = () => {
    setIsPlayingTone(true);
    if (audioEngine && typeof audioEngine.playChakraTone === 'function') {
      audioEngine.playChakraTone(currentChakra.freq, 4.0);
    } else if (audioEngine) {
      audioEngine.playMeditationTone();
    }
    if (showToast) {
      showToast(
        lang === 'ta' 
          ? `🎵 ${currentChakra.freqLabel} இசை ஒலிக்கிறது...` 
          : `🎵 Playing ${currentChakra.freqLabel} sound wave...`,
        'success'
      );
    }
    setTimeout(() => {
      setIsPlayingTone(false);
    }, 4000);
  };

  return (
    <div className="stitch-sanctuary-container ya-reveal" role="region" aria-label="Nithya Yoga Daily Sanctuary">
      {/* 1. Top Sanctuary Sub-Header with Brand & UI Switcher */}
      <header className="stitch-top-bar">
        <div className="stitch-brand-pill">
          <img 
            src="assets/images/logo.png?v=20261024" 
            alt="Nithya Yoga" 
            className="stitch-brand-logo-img" 
          />
          <div className="stitch-brand-titles">
            <span className="stitch-brand-title">{lang === 'ta' ? 'நித்யா யோகா' : 'Nithya'}</span>
            <span className="stitch-brand-badge">{lang === 'ta' ? 'முகப்பு' : 'Home'}</span>
          </div>
        </div>

        {/* UI Switcher Pill (Google Stitch ⇋ Classic Dashboard) */}
        <div className="stitch-top-actions">
          <button
            type="button"
            className={`btn-ui-switcher ${shakingBtn === 'switcher' ? 'stitch-shake' : ''}`}
            onClick={() => handleButtonClick('switcher', onToggleUiMode)}
            title={lang === 'ta' ? 'கிளாசிக் UI-க்கு மாற்றவும்' : 'Switch between Stitch & Classic UI'}
          >
            <Sparkles size={14} className="text-amber-300" />
            <span className="switcher-text">
              {uiMode === 'stitch'
                ? (lang === 'ta' ? '🌟 Stitch UI (ஆன்)' : '🌟 Stitch UI')
                : (lang === 'ta' ? '📊 Classic UI' : '📊 Classic UI')}
            </span>
          </button>

          <button
            type="button"
            className={`stitch-icon-btn ${shakingBtn === 'bell' ? 'stitch-shake' : ''}`}
            onClick={() => handleButtonClick('bell', () => {
              if (onTabChange) onTabChange('reminders');
            })}
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="stitch-badge-dot"></span>
          </button>

          <div 
            className="stitch-profile-avatar"
            onClick={() => {
              if (onTabChange) onTabChange('profile');
            }}
            title={user?.name || 'Profile'}
          >
            <span className="avatar-letter">{displayName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </header>

      {/* 2. Today's Focus Pill Banner */}
      <div className="stitch-focus-pill-wrap">
        <div className="stitch-focus-pill">
          <span className="stitch-focus-pulse-dot" aria-hidden="true"></span>
          <span className="stitch-focus-eyebrow">
            {lang === 'ta' ? "இன்றைய கவனம்:" : "Today's Focus:"}
          </span>
          <span className="stitch-focus-title">
            {lang === 'ta' ? "அனாஹதா & மென்மையான இதய யோகா" : "Anahata & Gentle Heart Flow"}
          </span>
        </div>
      </div>

      {/* 3. Daily Sanctuary Hero Section */}
      <section className="stitch-hero-card">
        <div className="stitch-hero-ambient-glow" aria-hidden="true"></div>
        
        <div className="stitch-hero-badge-row">
          <span className="stitch-hero-pill-tag">
            <Sparkles size={12} className="inline mr-1" />
            {lang === 'ta' ? "தினசரி புகலிடம்" : "Daily Sanctuary"}
          </span>
          <span className="stitch-hero-time-tag">
            {lang === 'ta' ? `வணக்கம், ${displayName}!` : `Namaste, ${displayName}!`}
          </span>
        </div>

        <h1 className="stitch-hero-heading">
          {lang === 'ta' 
            ? "உங்கள் சமநிலையைக் கண்டறியுங்கள். உள் அமைதியைப் பெறுங்கள்." 
            : "Find Your Balance. Discover Inner Peace."}
        </h1>

        <p className="stitch-hero-description">
          {lang === 'ta'
            ? "முழுமையான மனப்பயிற்சிகள், பாரம்பரிய மூச்சுப்பயிற்சி மற்றும் நிபுணத்துவ யோகா வழிகாட்டலில் மூழ்கி ஆன்ம நலம் பெறுங்கள்."
            : "Immerse in holistic mindful practices, traditional breathwork, and transformative wellness guided by master yogis."}
        </p>

        <div className="stitch-hero-cta-group">
          <button
            type="button"
            className={`btn-stitch-primary ${shakingBtn === 'start-journey' ? 'stitch-shake' : ''}`}
            onClick={() => handleButtonClick('start-journey', () => {
              if (onJoinLive) onJoinLive(activeClass);
            })}
          >
            <span>{lang === 'ta' ? "பயணத்தைத் தொடங்குங்கள்" : "Start Your Journey"}</span>
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className={`btn-stitch-secondary ${shakingBtn === 'explore-classes' ? 'stitch-shake' : ''}`}
            onClick={() => handleButtonClick('explore-classes', () => {
              if (onTabChange) onTabChange('yoga');
            })}
          >
            <Flower2 size={17} />
            <span>{lang === 'ta' ? "வகுப்புகளைக் காண்க" : "Explore Our Classes"}</span>
          </button>
        </div>
      </section>

      {/* 4. The Seven Sacred Chakras Interactive Resonator */}
      <section className="stitch-card-module stitch-chakra-module">
        <div className="stitch-card-header-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="stitch-module-icon-pill">
                <Layers size={16} />
              </span>
              <h2 className="stitch-module-title">
                {lang === 'ta' ? "ஏழு புனித சக்கரங்கள்" : "The Seven Sacred Chakras"}
              </h2>
            </div>
            <p className="stitch-module-subtitle">
              {lang === 'ta' ? "உங்கள் பிராண சக்தியை சமநிலைப்படுத்த ஒரு மையத்தைத் தொடுங்கள்" : "Tap an energy center to balance your prana"}
            </p>
          </div>
          
          <span className="stitch-live-freq-badge" style={{ borderColor: currentChakra.color, color: currentChakra.color }}>
            <span className="pulse-indicator-circle" style={{ backgroundColor: currentChakra.color }}></span>
            {currentChakra.freq} Hz Active
          </span>
        </div>

        {/* 7 Chakra Selector Pills */}
        <div className="stitch-chakra-selector-strip" role="tablist">
          {CHAKRAS.map((chakra) => {
            const isSelected = chakra.id === selectedChakraId;
            return (
              <button
                key={chakra.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`stitch-chakra-tab-btn ${isSelected ? 'active' : ''} ${shakingBtn === `chakra-${chakra.id}` ? 'stitch-shake' : ''}`}
                style={{
                  '--chakra-accent': chakra.color,
                  '--chakra-glow': chakra.glow
                }}
                onClick={() => handleButtonClick(`chakra-${chakra.id}`, () => {
                  setSelectedChakraId(chakra.id);
                  if (audioEngine && typeof audioEngine.playSoftBell === 'function') {
                    audioEngine.playSoftBell();
                  }
                })}
              >
                <span className="chakra-dot-indicator" style={{ backgroundColor: chakra.color }}></span>
                <span className="chakra-tab-name">
                  {lang === 'ta' ? chakra.nameTa.split(' ')[0] : chakra.nameEn.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Chakra Resonator Card */}
        <div 
          className="stitch-active-chakra-card"
          style={{
            borderColor: `${currentChakra.color}44`,
            boxShadow: `0 12px 30px ${currentChakra.glow}`
          }}
        >
          <div className="chakra-card-top">
            <div>
              <h3 className="active-chakra-name" style={{ color: currentChakra.color }}>
                {lang === 'ta' ? currentChakra.nameTa : currentChakra.nameEn}
              </h3>
              <span className="active-chakra-freq-tag">
                {currentChakra.freqLabel}
              </span>
            </div>
            <div className="chakra-halo-visual" style={{ background: `radial-gradient(circle, ${currentChakra.color} 0%, transparent 70%)` }}>
              <Heart size={22} className="text-white" />
            </div>
          </div>

          <p className="active-chakra-desc">
            {lang === 'ta' ? currentChakra.descTa : currentChakra.descEn}
          </p>

          <button
            type="button"
            className={`btn-stitch-tone ${isPlayingTone ? 'playing' : ''} ${shakingBtn === 'chakra-tone' ? 'stitch-shake' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${currentChakra.color}22 0%, ${currentChakra.color}44 100%)`,
              borderColor: currentChakra.color
            }}
            onClick={() => handleButtonClick('chakra-tone', handlePlayChakraTone)}
          >
            <Volume2 size={18} className={isPlayingTone ? 'animate-pulse' : ''} style={{ color: currentChakra.color }} />
            <span style={{ color: '#fff', fontWeight: 600 }}>
              {isPlayingTone
                ? (lang === 'ta' ? `ஒலிக்கிறது: ${currentChakra.freq} Hz...` : `Resonating ${currentChakra.freq} Hz...`)
                : (lang === 'ta' ? `${currentChakra.freq} Hz இசையைக் கேளுங்கள்` : `Listen to ${currentChakra.freq} Hz Tone`)}
            </span>
            {isPlayingTone && (
              <div className="stitch-equalizer-bars" aria-hidden="true">
                <span className="bar b1"></span>
                <span className="bar b2"></span>
                <span className="bar b3"></span>
              </div>
            )}
          </button>
        </div>
      </section>

      {/* 5. Daily Practice & 7-Day Lotus Streak + Embedded Live Class */}
      <section className="stitch-card-module stitch-practice-module">
        <div className="stitch-card-header-row">
          <div className="flex items-center gap-2">
            <span className="stitch-module-icon-pill">
              <Calendar size={16} />
            </span>
            <h2 className="stitch-module-title">
              {lang === 'ta' ? "தினசரி பயிற்சி & வருகை" : "Daily Practice"}
            </h2>
          </div>
          <button
            type="button"
            className="stitch-link-action"
            onClick={() => {
              if (onTabChange) onTabChange('attendance');
            }}
          >
            <span>{lang === 'ta' ? "வாராந்திர பதிவு" : "Weekly Log"}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="stitch-practice-grid">
          {/* 7-Day Lotus Streak Card */}
          <div className="stitch-streak-card">
            <div className="streak-card-content">
              <div className="streak-icon-wrap">
                <Flower2 size={26} className="text-violet-400" />
              </div>
              <div>
                <div className="streak-number-row">
                  <span className="streak-count">7-Day</span>
                  <span className="streak-label">{lang === 'ta' ? "தொடர்" : "Streak"}</span>
                </div>
                <p className="streak-status-text">
                  {lang === 'ta' ? "தாமரை தொடர்ந்து மலர்கிறது 🪷" : "Lotus blossoming consistently"}
                </p>
              </div>
            </div>

            {/* M T W T F S S Day Dots */}
            <div className="streak-days-row">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="streak-day-badge active" title={`Day ${day} Completed`}>
                  <span className="day-name">{day}</span>
                  <span className="day-check"><Check size={10} strokeWidth={3} /></span>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Live Class Alert Card */}
          <div className="stitch-live-alert-card">
            <div className="live-alert-badge-row">
              <span className="live-status-pill">
                <Radio size={12} className="animate-pulse" />
                {lang === 'ta' ? "35 நிமிடத்தில் தொடங்குகிறது" : "Starts in 35 mins"}
              </span>
              <span className="live-time-meta">8:00 AM Today</span>
            </div>

            <div className="live-alert-info">
              <h3 className="live-session-title">
                {lang === 'ta' ? "காலை பிராண சக்தி யோகா" : "Morning Prana Flow"}
              </h3>
              <p className="live-session-sub">
                {lang === 'ta' ? "25 நிமி • அனைத்து நிலைகள் • நேரலை" : "25 min • All Levels • Live Stream"}
              </p>
            </div>

            <button
              type="button"
              className={`btn-stitch-live-join ${shakingBtn === 'join-live-card' ? 'stitch-shake' : ''}`}
              onClick={() => handleButtonClick('join-live-card', () => {
                if (onJoinLive) onJoinLive(activeClass);
              })}
            >
              <Radio size={16} />
              <span>{lang === 'ta' ? "நேரலையில் இணை" : "Join Class"}</span>
            </button>
          </div>

          {/* Weekly Stats Counter */}
          <div className="stitch-mini-stats-grid">
            <div className="mini-stat-card">
              <span className="mini-stat-label">{lang === 'ta' ? "வார நேரம்" : "Weekly Time"}</span>
              <span className="mini-stat-val">48 mins</span>
            </div>
            <div className="mini-stat-card">
              <span className="mini-stat-label">{lang === 'ta' ? "நிறைவு" : "Completed"}</span>
              <span className="mini-stat-val">3 Sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Curated Classes Section (Studio Quality) */}
      <section className="stitch-card-module stitch-curated-module">
        <div className="stitch-card-header-row">
          <div className="flex items-center gap-2">
            <span className="stitch-module-icon-pill">
              <Sparkles size={16} />
            </span>
            <h2 className="stitch-module-title">
              {lang === 'ta' ? "தேர்ந்தெடுக்கப்பட்ட வகுப்புகள்" : "Curated Classes"}
            </h2>
          </div>
          <span className="stitch-curated-tag">Studio Quality</span>
        </div>

        <div className="stitch-curated-grid">
          {CURATED_CLASSES.map((cls) => (
            <div key={cls.id} className="stitch-class-card">
              <div className="class-card-top-row">
                <span className="class-level-badge" style={{ backgroundColor: `${cls.tagColor}22`, color: cls.tagColor }}>
                  {lang === 'ta' ? cls.levelTa : cls.levelEn}
                </span>
                <span className="class-rating-row">
                  <Star size={13} fill="#fbbf24" stroke="none" />
                  <span>{cls.rating} ({cls.reviews})</span>
                </span>
              </div>

              <h3 className="class-title">
                {lang === 'ta' ? cls.titleTa : cls.titleEn}
              </h3>
              <p className="class-meta">
                {lang === 'ta' ? cls.durationTa : cls.durationEn}
              </p>

              <button
                type="button"
                className={`btn-stitch-class-join ${shakingBtn === `class-${cls.id}` ? 'stitch-shake' : ''}`}
                onClick={() => handleButtonClick(`class-${cls.id}`, () => {
                  if (onJoinLive) onJoinLive(activeClass);
                })}
              >
                <Play size={14} fill="currentColor" />
                <span>{lang === 'ta' ? "வகுப்பில் சேர்" : "Join Class"}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Evening Breathwork Wind-Down Card */}
      <section className="stitch-evening-reminder-card">
        <div className="evening-card-left">
          <div className="evening-icon-wrap">
            <Moon size={22} className="text-indigo-300" />
          </div>
          <div>
            <h3 className="evening-title">
              {lang === 'ta' ? "இரவு மூச்சுப்பயிற்சி" : "Evening Breathwork"}
            </h3>
            <p className="evening-subtitle">
              {lang === 'ta' 
                ? "தினசரி இரவு 9:00 மணி • அமைதியான ஒலியமைப்பு" 
                : "Daily at 9:00 PM • Wind-down soundscape"}
            </p>
          </div>
        </div>

        <label className="stitch-switch-label" title="Toggle Evening Reminder">
          <input 
            type="checkbox" 
            checked={eveningBreathworkActive} 
            onChange={(e) => {
              const val = e.target.checked;
              setEveningBreathworkActive(val);
              if (showToast) {
                showToast(
                  val 
                    ? (lang === 'ta' ? '🌙 இரவு நினைவூட்டல் ஆன் செய்யப்பட்டது' : '🌙 Evening reminder enabled')
                    : (lang === 'ta' ? 'இரவு நினைவூட்டல் ஆஃப் செய்யப்பட்டது' : 'Evening reminder paused'),
                  'info'
                );
              }
            }} 
          />
          <span className="stitch-switch-slider"></span>
        </label>
      </section>

      <div className="stitch-reminder-chime-note">
        <Bell size={14} className="text-violet-400" />
        <span>
          {lang === 'ta'
            ? "பயிற்சியைத் தவறவிடாதீர்கள் — அமைதியான புஷ் நினைவூட்டல்கள் இயங்குகின்றன."
            : "Never miss a practice — tranquil gentle push chimes are active."}
        </span>
      </div>
    </div>
  );
}
