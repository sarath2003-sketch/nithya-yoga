import React, { useState } from 'react';
import { Flower2, Clock, User, ChevronRight } from 'lucide-react';

export default function YogaClassesSection({ onSelectClass, onShowAll, lang = 'en' }) {
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
      desc: 'Build flexibility and balance.',
      descTa: 'நெகிழ்வுத்தன்மையையும் சமநிலையையும் உருவாக்குங்கள்.',
      img: 'assets/images/class-thumb.jpg'
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
      desc: 'Improve strength and stamina.',
      descTa: 'வலிமையையும் சகிப்புத்தன்மையையும் மேம்படுத்துங்கள்.',
      img: 'assets/images/class-thumb.jpg'
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
      desc: 'Boost energy and focus.',
      descTa: 'ஆற்றலையும் கவனத்தையும் அதிகரியுங்கள்.',
      img: 'assets/images/class-thumb.jpg'
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
      desc: 'Deep relaxation and flexibility.',
      descTa: 'ஆழ்ந்த ஓய்வும் நெகிழ்வுத்தன்மையும்.',
      img: 'assets/images/class-thumb.jpg'
    }
  ];

  const filterTabs = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = classesList.filter(c => {
    if (activeFilter === 'All') return true;
    return c.level.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="dashboard-card yoga-classes-card">
      <div className="card-header-row">
        <h3 className="card-title-main">
          <Flower2 size={18} className="text-violet" />
          <span>{lang === 'ta' ? 'யோகா வகுப்புகள்' : 'Yoga Classes'}</span>
        </h3>
        <button 
          type="button" 
          className="link-view-all" 
          onClick={onShowAll}
        >
          {lang === 'ta' ? 'அனைத்தும் பார்க்க →' : 'View All →'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="pill-filters-row">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`filter-pill-btn ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Class Items List */}
      <div className="classes-items-stack">
        {filtered.map((item) => (
          <div key={item.id} className="class-row-item">
            <div className="class-thumb-wrap">
              <img src={item.img} alt={item.title} className="class-thumb-img" />
            </div>

            <div className="class-meta-center">
              <h4 className="class-item-title">
                {lang === 'ta' && item.titleTa ? item.titleTa : item.title}
              </h4>
              <div className="class-item-tags">
                <span className="tag-meta">⏱ {item.duration}</span>
                <span className="bullet-sep">•</span>
                <span className="tag-meta">👤 {lang === 'ta' && item.levelTa ? item.levelTa : item.level}</span>
                <span className="bullet-sep">•</span>
                <span className="tag-meta">👤 {lang === 'ta' && item.instructorTa ? item.instructorTa : item.instructor}</span>
              </div>
              <p className="class-item-desc">
                {lang === 'ta' && item.descTa ? item.descTa : item.desc}
              </p>
            </div>

            <button
              type="button"
              className="btn-join-live-pill"
              onClick={() => onSelectClass && onSelectClass(item)}
            >
              {lang === 'ta' ? 'இணையவும்' : 'Join Live'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
