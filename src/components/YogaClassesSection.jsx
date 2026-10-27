import React, { useState, useEffect } from 'react';
import { Clock, User, ChevronRight, Sparkles, Compass, Play, Pause, RotateCcw, X, Video } from 'lucide-react';
import { ThreeDLotus } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';
import CardSplitAccordion from './CardSplitAccordion';

export default function YogaClassesSection({ onSelectClass, onShowAll, lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'asanas'
  const [activeFilter, setActiveFilter] = useState('All');

  const classesList = [
    {
      id: 'cls-1',
      title: 'Hatha Yoga',
      titleTa: 'ஹத யோகா',
      duration: '60 min',
      level: 'Beginner',
      levelTa: 'தொடக்கநிலை',
      instructor: 'NITHYA Master',
      instructorTa: 'நித்யா மாஸ்டர்',
      desc: 'Build flexibility, alignment and deep breathing balance.',
      descTa: 'நெகிழ்வுத்தன்மையையும் சமநிலையையும் உருவாக்குங்கள்.',
      img: 'assets/images/class-hatha.svg'
    },
    {
      id: 'cls-2',
      title: 'Vinyasa Flow',
      titleTa: 'வின்யாசா ஃப்ளோ',
      duration: '60 min',
      level: 'Intermediate',
      levelTa: 'இடைநிலை',
      instructor: 'NITHYA Master',
      instructorTa: 'நித்யா மாஸ்டர்',
      desc: 'Dynamic breath-to-movement sequences for stamina.',
      descTa: 'வலிமையையும் சகிப்புத்தன்மையையும் மேம்படுத்துங்கள்.',
      img: 'assets/images/class-vinyasa.svg'
    },
    {
      id: 'cls-3',
      title: 'Power Yoga',
      titleTa: 'பவர் யோகா',
      duration: '75 min',
      level: 'Advanced',
      levelTa: 'முதிர்ந்த நிலை',
      instructor: 'NITHYA Master',
      instructorTa: 'நித்யா மாஸ்டர்',
      desc: 'High energy core activation and cardiovascular heat.',
      descTa: 'ஆற்றலையும் கவனத்தையும் அதிகரியுங்கள்.',
      img: 'assets/images/class-power.svg'
    },
    {
      id: 'cls-4',
      title: 'Yin Yoga',
      titleTa: 'யின் யோகா',
      duration: '50 min',
      level: 'All Levels',
      levelTa: 'அனைத்து நிலைகளும்',
      instructor: 'NITHYA Master',
      instructorTa: 'நித்யா மாஸ்டர்',
      desc: 'Deep restorative fascia relaxation and meditative stillness.',
      descTa: 'ஆழ்ந்த ஓய்வும் நெகிழ்வுத்தன்மையும்.',
      img: 'assets/images/class-yin.svg'
    }
  ];

  // 5 Essential Daily Asanas with Chakra targeting
  const dailyAsanas = [
    {
      id: 'as-1',
      name: 'Vrikshasana (Tree Pose)',
      nameTa: 'விருக்ஷாசனம் (மரம் போன்ற நிலை)',
      sanskrit: 'वृक्षासन',
      chakra: 'Muladhara • Root Chakra 🔴',
      chakraTa: 'மூலாதார சக்கரம் 🔴',
      duration: '5 min',
      benefit: 'Rooted earth stability, balance & nervous system focus',
      benefitTa: 'நிலைத்தன்மை மற்றும் நரம்பு மண்டல அமைதி',
      bgGrad: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.1))'
    },
    {
      id: 'as-2',
      name: 'Bhujangasana (Cobra Pose)',
      nameTa: 'புஜங்காசனம் (நாக நிலை)',
      sanskrit: 'भुजङ्गासन',
      chakra: 'Anahata • Heart Chakra 💚',
      chakraTa: 'அனாகத சக்கரம் (இதயம்) 💚',
      duration: '7 min',
      benefit: 'Spinal mobility, chest expansion & heart opening',
      benefitTa: 'முதுகெலும்பு வளைவு மற்றும் நெஞ்சு விரிவு',
      bgGrad: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.1))'
    },
    {
      id: 'as-3',
      name: 'Adho Mukha Svanasana (Downward Dog)',
      nameTa: 'அதோ முக ஸ்வானாசனம்',
      sanskrit: 'अधोमुखश्वानासन',
      chakra: 'Manipura • Solar Plexus 🟡',
      chakraTa: 'மணிபூரக சக்கரம் (வயிறு) 🟡',
      duration: '6 min',
      benefit: 'Total hamstring lengthen, circulation & mental clarity',
      benefitTa: 'இரத்த ஓட்டம் மற்றும் மனத் தெளிவு',
      bgGrad: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(245,158,11,0.1))'
    },
    {
      id: 'as-4',
      name: 'Virabhadrasana II (Warrior 2)',
      nameTa: 'வீரபத்ராசனம் 2',
      sanskrit: 'वीरभद्रासन',
      chakra: 'Svadhisthana • Sacral Chakra 🟠',
      chakraTa: 'சுவாதிஷ்டான சக்கரம் 🟠',
      duration: '8 min',
      benefit: 'Hip opening, courage, inner warrior endurance',
      benefitTa: 'உடல் வலிமை மற்றும் தன்னம்பிக்கை',
      bgGrad: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.1))'
    },
    {
      id: 'as-5',
      name: 'Padmasana (Lotus Pose)',
      nameTa: 'பத்மாசனம் (தாமரை நிலை)',
      sanskrit: 'पद्मासन',
      chakra: 'Sahasrara • Crown Chakra 🟣',
      chakraTa: 'சஹஸ்ரார சக்கரம் (ஆன்மீகம்) 🟣',
      duration: '10 min',
      benefit: 'Deep meditative Dhyana, kundalini breath alignment',
      benefitTa: 'ஆழ்ந்த தியானம் மற்றும் பிராணாயாம ஒருமைப்பாடு',
      bgGrad: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(139,92,246,0.1))'
    }
  ];

  const filterTabs = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = classesList.filter(c => {
    if (activeFilter === 'All') return true;
    return c.level.toLowerCase() === activeFilter.toLowerCase();
  });

  const [activeAsanaModal, setActiveAsanaModal] = useState(null);
  const [activeClassModal, setActiveClassModal] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [asanaTimer, setAsanaTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && asanaTimer > 0) {
      interval = setInterval(() => {
        setAsanaTimer(prev => prev - 1);
      }, 1000);
    } else if (asanaTimer === 0 && isTimerRunning) {
      audioEngine.playTempleBell();
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, asanaTimer]);

  const handlePracticeAsana = (asana) => {
    setActiveAsanaModal(asana);
    setAsanaTimer(60);
    setIsTimerRunning(true);
  };

  const handleViewAllClick = () => {
    setShowAllModal(true);
  };

  return (
    <div className="dashboard-card yoga-classes-card">
      <div className="card-header-row flex items-center justify-between pb-2 border-b border-subtle">
        <h3 className="card-title-main flex items-center gap-2 m-0 text-base font-bold">
          <ThreeDLotus size={24} />
          <span>{lang === 'ta' ? 'யோகா & ஆசன வழிகாட்டி' : 'Yoga Classes & Asanas'}</span>
        </h3>
        <button 
          type="button" 
          className="link-view-all text-xs font-semibold text-primary hover:underline cursor-pointer" 
          onClick={handleViewAllClick}
        >
          {lang === 'ta' ? 'அனைத்தும் பார்க்க →' : 'View All →'}
        </button>
      </div>

      {/* Segmented Switch: Classes vs Daily Asanas vs Interactive Split Syllabus */}
      <div className="yoga-view-switch-tabs flex p-1 bg-subtle rounded-xl my-2.5">
        <button
          type="button"
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'classes' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('classes')}
        >
          {lang === 'ta' ? '🧘 நேரலை வகுப்புகள்' : '🧘 Live Classes (4)'}
        </button>
        <button
          type="button"
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'asanas' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('asanas')}
        >
          {lang === 'ta' ? '🪷 சக்கர ஆசனங்கள்' : '🪷 Daily Asanas (5)'}
        </button>
        <button
          type="button"
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'syllabus' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('syllabus')}
        >
          {lang === 'ta' ? '✨ ஸ்பிளிட் சிலபஸ்' : '✨ Split Syllabus'}
        </button>
      </div>

      {/* VIEW A: Standard Yoga Classes */}
      {activeTab === 'classes' && (
        <>
          {/* Filter Tabs */}
          <div className="pill-filters-row flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-pill-btn text-xs px-2.5 py-1 rounded-full cursor-pointer transition-all ${activeFilter === tab ? 'active bg-primary text-white font-bold' : 'bg-subtle text-muted hover:text-heading'}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Class Items Stack */}
          <div className="classes-items-stack flex flex-col gap-2.5">
            {filtered.map((item) => (
              <div 
                key={item.id} 
                className="class-row-item flex items-center gap-3 p-2.5 rounded-xl border border-subtle bg-card hover:border-primary transition-all cursor-pointer ya-ripple"
                onClick={() => setActiveClassModal(item)}
                title={lang === 'ta' ? 'பாடத்திட்டம் & நேரலை விவரங்களைக் காண' : 'View Curriculum & Class Details'}
              >
                <div className="class-thumb-wrap w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-subtle">
                  <img src={item.img} alt={item.title} className="class-thumb-img w-full h-full object-fit-cover" />
                </div>

                <div className="class-meta-center flex-1 overflow-hidden">
                  <h4 className="class-item-title text-xs font-bold text-heading m-0 truncate">
                    {lang === 'ta' && item.titleTa ? item.titleTa : item.title}
                  </h4>
                  <div className="class-item-tags flex items-center gap-1.5 text-[11px] text-muted my-0.5">
                    <span className="tag-meta flex items-center gap-1">
                      <Clock size={11} className="text-primary" />
                      <span>{item.duration}</span>
                    </span>
                    <span className="bullet-sep">•</span>
                    <span className="tag-meta flex items-center gap-1">
                      <User size={11} className="text-primary" />
                      <span>{lang === 'ta' && item.levelTa ? item.levelTa : item.level}</span>
                    </span>
                    <span className="bullet-sep">•</span>
                    <span className="tag-meta">{lang === 'ta' && item.instructorTa ? item.instructorTa : item.instructor}</span>
                  </div>
                  <p className="class-item-desc text-[11px] text-muted m-0 line-clamp-1">
                    {lang === 'ta' && item.descTa ? item.descTa : item.desc}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-curriculum-action flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full bg-primary text-white border-none cursor-pointer hover:opacity-90 active:scale-95 transition-all flex-shrink-0 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveClassModal(item);
                  }}
                >
                  <span>{lang === 'ta' ? 'பாடத்திட்டம்' : 'Curriculum'}</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW B: 5 Essential Daily Asanas with Chakra targeting */}
      {activeTab === 'asanas' && (
        <div className="daily-asanas-stack flex flex-col gap-2">
          {dailyAsanas.map((as) => (
            <div 
              key={as.id} 
              className="asana-card-item p-2.5 rounded-xl border border-subtle transition-all hover:border-primary flex items-center justify-between"
              style={{ background: as.bgGrad }}
            >
              <div className="asana-info-left flex-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <h5 className="m-0 text-xs font-bold text-heading">
                    {lang === 'ta' ? as.nameTa : as.name}
                  </h5>
                  <span className="text-[10px] text-muted italic font-mono">({as.sanskrit})</span>
                </div>
                <div className="chakra-badge-tag text-[10px] font-semibold text-primary my-0.5">
                  {lang === 'ta' ? as.chakraTa : as.chakra}
                </div>
                <p className="text-[11px] text-muted m-0 line-clamp-1">
                  {lang === 'ta' ? as.benefitTa : as.benefit}
                </p>
              </div>

              <div className="asana-action-right flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] font-bold text-muted bg-card px-1.5 py-0.5 rounded-md border border-subtle">
                  {as.duration}
                </span>
                <button
                  type="button"
                  className="btn-practice-asana px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
                  onClick={() => handlePracticeAsana(as)}
                >
                  <Sparkles size={11} />
                  <span>{lang === 'ta' ? 'பயிற்சி' : 'Practice'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW C: Watermelon Card Split Accordion Syllabus */}
      {activeTab === 'syllabus' && (
        <div className="py-2 animate-fadeIn" style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading, #1e1b4b)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} className="text-primary" />
              <span>{lang === 'ta' ? 'அதிநவீன ஸ்பிளிட் அக்கார்டியன் பாடத்திட்டம்' : 'Interactive Split-Radius Syllabus'}</span>
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #94a3b8)', background: 'var(--bg-subtle, #f1f5f9)', padding: '2px 8px', borderRadius: '12px' }}>
              Watermelon UI
            </span>
          </div>
          <CardSplitAccordion />
        </div>
      )}

      {/* MODAL 0: INTERACTIVE CLASS CURRICULUM & PRACTICE MODAL */}
      {activeClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ya-modal-overlay">
          <div className="relative w-full max-w-md p-6 rounded-2xl border border-subtle bg-card shadow-2xl ya-modal-content">
            <button
              type="button"
              onClick={() => setActiveClassModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-muted hover:text-heading hover:bg-subtle transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Head */}
            <div className="flex items-center gap-3 pb-3 border-b border-subtle">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0">
                🧘
              </div>
              <div className="overflow-hidden">
                <h3 className="text-base font-bold text-heading m-0 truncate">
                  {lang === 'ta' && activeClassModal.titleTa ? activeClassModal.titleTa : activeClassModal.title}
                </h3>
                <span className="text-xs text-muted font-medium">
                  {activeClassModal.duration} • {lang === 'ta' && activeClassModal.levelTa ? activeClassModal.levelTa : activeClassModal.level} • {lang === 'ta' && activeClassModal.instructorTa ? activeClassModal.instructorTa : activeClassModal.instructor}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-sub leading-relaxed my-3">
              {lang === 'ta' && activeClassModal.descTa ? activeClassModal.descTa : activeClassModal.desc}
            </p>

            {/* Detailed Curriculum Breakdown */}
            <div className="p-3.5 rounded-xl bg-subtle border border-subtle flex flex-col gap-2.5 my-3">
              <span className="text-xs font-black text-heading uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary" />
                <span>{lang === 'ta' ? 'வகுப்பு பாடத்திட்டம் (Curriculum Outline):' : 'Class Curriculum Outline:'}</span>
              </span>
              <ul className="text-xs text-sub space-y-1.5 m-0 pl-1 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>{lang === 'ta' ? 'சூரிய நமஸ்காரம் & மூட்டு தளர்வுப் பயிற்சிகள்' : 'Surya Namaskar & Gentle Joint Mobility Warmup'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>{lang === 'ta' ? 'ஆசன நிலைகள் & உடல் சமநிலை பயிற்சிகள்' : 'Core Asana Series & Balance Alignment'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>{lang === 'ta' ? 'பிராணாயாமம் & நாடி சுத்தி மூச்சுப் பயிற்சி' : 'Pranayama & Nadi Shodhana Breathing Flow'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>{lang === 'ta' ? 'சாந்தி ஆசனம் & ஆழ்ந்த தியான அமைதி' : 'Savasana Restorative Meditation & Stillness'}</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = activeClassModal;
                  setActiveClassModal(null);
                  if (onSelectClass) onSelectClass(target);
                }}
                className="ya-btn ya-btn--primary flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
              >
                <Video size={14} />
                <span>{lang === 'ta' ? 'வகுப்பைத் தொடங்கு / இணையவும்' : 'Start & Enter Live Studio'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveClassModal(null)}
                className="ya-btn ya-btn--soft px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                {lang === 'ta' ? 'மூடு' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: INTERACTIVE ASANA PRACTICE GUIDE */}
      {activeAsanaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ya-modal-overlay">
          <div className="relative w-full max-w-md p-6 rounded-2xl border border-subtle bg-card shadow-2xl ya-modal-content">
            <button
              type="button"
              onClick={() => {
                setActiveAsanaModal(null);
                setIsTimerRunning(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-muted hover:text-heading hover:bg-subtle transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center pb-3 border-b border-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                {lang === 'ta' ? activeAsanaModal.chakraTa : activeAsanaModal.chakra}
              </span>
              <h3 className="text-base font-bold text-heading m-0">
                {lang === 'ta' ? activeAsanaModal.nameTa : activeAsanaModal.name}
              </h3>
              <p className="text-xs text-muted font-mono italic mt-0.5">
                {activeAsanaModal.sanskrit} • {activeAsanaModal.duration}
              </p>
            </div>

            {/* Asana Benefit & Breathing Rhythm */}
            <div className="my-3 p-3 rounded-xl bg-subtle border border-subtle flex flex-col gap-2">
              <p className="text-xs text-heading font-medium m-0">
                ✨ <strong>{lang === 'ta' ? 'நன்மைகள்:' : 'Benefits:'}</strong>{' '}
                {lang === 'ta' ? activeAsanaModal.benefitTa : activeAsanaModal.benefit}
              </p>
              <div className="p-2 rounded-lg bg-card/60 text-[11px] text-muted flex items-center justify-between">
                <span>🌬️ {lang === 'ta' ? 'சுவாச முறை:' : 'Breath Alignment:'}</span>
                <span className="font-semibold text-heading">
                  {lang === 'ta' ? '4s மூச்சை உள்ளிழு • 4s நிலைநிறுத்து • 4s வெளிவிடு' : '4s Inhale • 4s Hold • 4s Exhale'}
                </span>
              </div>
            </div>

            {/* Practice Countdown Timer */}
            <div className="text-center p-4 rounded-2xl bg-card border border-primary/20 flex flex-col items-center justify-center my-3">
              <span className="text-[11px] text-muted font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'பயிற்சி டைமர்' : 'Posture Hold Timer'}
              </span>
              <div className="text-3xl font-extrabold text-primary font-mono my-1">
                {String(Math.floor(asanaTimer / 60)).padStart(2, '0')}:{String(asanaTimer % 60).padStart(2, '0')}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="ya-btn ya-btn--primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isTimerRunning ? (lang === 'ta' ? 'நிறுத்து' : 'Pause') : (lang === 'ta' ? 'துவங்கு' : 'Start')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAsanaTimer(60);
                    setIsTimerRunning(false);
                  }}
                  className="ya-btn ya-btn--soft px-2.5 py-1.5 rounded-full text-xs flex items-center gap-1 cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw size={12} />
                  <span>{lang === 'ta' ? 'மீட்டமை' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Join Full Live Studio Button */}
            <button
              type="button"
              onClick={() => {
                const targetClass = classesList[0];
                setActiveAsanaModal(null);
                setIsTimerRunning(false);
                if (onSelectClass) onSelectClass(targetClass);
              }}
              className="ya-btn ya-btn--primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Video size={14} />
              <span>{lang === 'ta' ? 'நேரலை வகுப்பறையில் இணையவும்' : 'Join Full Live Yoga Studio'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: ALL LESSONS & CLASSES OVERVIEW */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ya-modal-overlay">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-2xl border border-subtle bg-card shadow-2xl ya-modal-content">
            <button
              type="button"
              onClick={() => setShowAllModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-muted hover:text-heading hover:bg-subtle transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="pb-3 border-b border-subtle">
              <h3 className="text-base font-bold text-heading m-0 flex items-center gap-2">
                <ThreeDLotus size={22} />
                <span>{lang === 'ta' ? 'அனைத்து யோகா பாடங்கள் & வழிகாட்டி' : 'All Yoga Lessons & Full Curriculum'}</span>
              </h3>
              <p className="text-xs text-muted m-0 mt-0.5">
                {lang === 'ta' ? 'தொடக்க நிலை முதல் முதிர்ந்த நிலை வரையிலான பயிற்சிகள்' : 'Explore beginner to advanced sessions with certified yoga instructors.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
              {classesList.map(c => (
                <div key={c.id} className="p-3 rounded-xl border border-subtle bg-subtle/40 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-heading m-0">{lang === 'ta' && c.titleTa ? c.titleTa : c.title}</h4>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{c.duration}</span>
                    </div>
                    <p className="text-[11px] text-muted mt-1 m-0 line-clamp-2">{lang === 'ta' && c.descTa ? c.descTa : c.desc}</p>
                    <div className="text-[10px] text-muted mt-1.5">
                      <strong>{lang === 'ta' ? 'பயிற்றுநர்:' : 'Instructor:'}</strong> {lang === 'ta' && c.instructorTa ? c.instructorTa : c.instructor} • {lang === 'ta' && c.levelTa ? c.levelTa : c.level}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAllModal(false);
                      if (onSelectClass) onSelectClass(c);
                    }}
                    className="ya-btn ya-btn--primary text-xs py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold cursor-pointer mt-1"
                  >
                    <Video size={12} />
                    <span>{lang === 'ta' ? 'வகுப்பில் இணையவும்' : 'Join Live Class'}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-subtle">
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="ya-btn ya-btn--soft px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {lang === 'ta' ? 'மூடு' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
