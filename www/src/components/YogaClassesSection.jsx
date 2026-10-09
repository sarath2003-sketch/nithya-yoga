import React, { useState } from 'react';
import { Clock, User, ChevronRight, Sparkles, Compass } from 'lucide-react';
import { ThreeDLotus } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';

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
      instructor: 'Priya',
      instructorTa: 'பிரியா',
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
      instructor: 'Anu',
      instructorTa: 'அனு',
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
      instructor: 'Meena',
      instructorTa: 'மீனா',
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
      instructor: 'Lakshmi',
      instructorTa: 'லட்சுமி',
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

  const handlePracticeAsana = (asana) => {
    audioEngine.playMeditationTone();
    if (onSelectClass) {
      onSelectClass({
        id: asana.id,
        name: asana.name,
        title: asana.name,
        instructor: 'Asana Guide',
        duration: asana.duration,
        level: 'All Levels',
        desc: asana.benefit
      });
    }
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
          onClick={onShowAll}
        >
          {lang === 'ta' ? 'அனைத்தும் பார்க்க →' : 'View All →'}
        </button>
      </div>

      {/* Segmented Switch: Classes vs Daily Asanas */}
      <div className="yoga-view-switch-tabs flex p-1 bg-subtle rounded-xl my-2.5">
        <button
          type="button"
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'classes' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('classes')}
        >
          {lang === 'ta' ? '🧘 நேரலை வகுப்புகள்' : '🧘 Live Classes (4)'}
        </button>
        <button
          type="button"
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'asanas' ? 'bg-card text-heading shadow-sm' : 'text-muted hover:text-heading'}`}
          onClick={() => setActiveTab('asanas')}
        >
          {lang === 'ta' ? '🪷 5 சக்கர ஆசனங்கள்' : '🪷 Daily Asanas (5)'}
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
              <div key={item.id} className="class-row-item flex items-center gap-3 p-2.5 rounded-xl border border-subtle bg-card hover:border-primary transition-all">
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
                  className="btn-join-live-pill text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
                  onClick={() => onSelectClass && onSelectClass(item)}
                >
                  {lang === 'ta' ? 'இணையவும்' : 'Join Live'}
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
    </div>
  );
}
