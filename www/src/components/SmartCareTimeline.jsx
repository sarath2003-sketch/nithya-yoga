import React from 'react';
import { 
  Calendar, 
  Check, 
  Trash2, 
  Clock,
  Edit3,
  Volume2,
  Sparkles,
  Bell
} from 'lucide-react';
import { 
  ThreeDWater, 
  ThreeDBell, 
  ThreeDMeal, 
  ThreeDHeart, 
  ThreeDPhone, 
  ThreeDLotus,
  KitBell
} from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';

export default function SmartCareTimeline({
  reminders,
  onToggleComplete,
  onToggleEnable,
  onDeleteReminder,
  onEditReminder,
  onShowAll,
  lang = 'en'
}) {
  const defaultCareCards = [
    {
      id: 'rem-yoga-1',
      title: 'Next Yoga Class',
      titleTa: 'அடுத்த யோகா வகுப்பு',
      time: '06:00 PM',
      category: 'Yoga',
      message: "Keep going! You're doing great! 💜",
      messageTa: "தொடர்ந்து செய்யுங்கள்! நீங்கள் சிறப்பாக செய்கிறீர்கள்! 💜",
      themeClass: 'care-card-purple',
      sound: 'Soft Bell'
    },
    {
      id: 'rem-water-1',
      title: 'Water Reminder',
      titleTa: 'தண்ணீர் நினைவூட்டல்',
      time: '05:30 PM',
      category: 'Water',
      message: "Drink water... Stay fresh! 💧",
      messageTa: "தண்ணீர் குடியுங்கள்... புத்துணர்ச்சியுடன் இருங்கள்! 💧",
      themeClass: 'care-card-cyan',
      sound: 'Gentle Chime'
    },
    {
      id: 'rem-meal-1',
      title: 'Meal Reminder',
      titleTa: 'உணவு நினைவூட்டல்',
      time: '01:00 PM',
      category: 'Meal',
      message: "Healthy food = Happy you! 🥗",
      messageTa: "ஆரோக்கிய உணவு = மகிழ்ச்சியான நீங்கள்! 🥗",
      themeClass: 'care-card-yellow',
      sound: 'Peaceful Nature'
    },
    {
      id: 'rem-call-1',
      title: 'Call Reminder',
      titleTa: 'அழைப்பு நினைவூட்டல்',
      time: '07:00 PM',
      category: 'Call',
      message: "Don't forget to call your loved ones. 📞",
      messageTa: "உங்கள் அன்புக்குரியவர்களை அழைக்க மறக்காதீர்கள். 📞",
      themeClass: 'care-card-green',
      sound: 'Soft Bell'
    },
    {
      id: 'rem-care-1',
      title: 'Personal Care',
      titleTa: 'சுய பராமரிப்பு',
      time: '09:00 PM',
      category: 'Personal Care',
      message: "Take care of yourself. You matter! 💕",
      messageTa: "உங்களை கவனித்துக் கொள்ளுங்கள். நீங்களும் முக்கியம்! 💕",
      themeClass: 'care-card-pink',
      sound: 'Meditation Tone'
    }
  ];

  const allCards = reminders && reminders.length > 0 
    ? reminders.slice(0, 5).map((r, idx) => ({
        ...r,
        themeClass: idx === 0 ? 'care-card-purple'
                  : idx === 1 ? 'care-card-cyan'
                  : idx === 2 ? 'care-card-yellow'
                  : idx === 3 ? 'care-card-green' : 'care-card-pink'
      }))
    : defaultCareCards;

  const get3DBadge = (category) => {
    switch (category) {
      case 'Water': return <ThreeDWater size={38} />;
      case 'Meal': return <ThreeDMeal size={38} />;
      case 'Call': return <ThreeDPhone size={38} />;
      case 'Personal Care': return <ThreeDHeart size={38} />;
      case 'Yoga':
      default:
        return <ThreeDLotus size={38} />;
    }
  };

  const handlePlayCardSound = (e, sound) => {
    e.stopPropagation();
    audioEngine.playSoundByName(sound || 'Soft Bell');
  };

  return (
    <section className="dashboard-section today-reminders-section">
      <div className="section-title-bar flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <ThreeDBell size={28} />
          <div>
            <h3 className="section-heading-with-icon m-0 font-bold text-base">
              <span>{lang === 'ta' ? 'இன்றைய ஸ்மார்ட் நினைவூட்டல்கள்' : "Today's Smart Reminders"}</span>
            </h3>
            <span className="text-xs text-muted">
              {lang === 'ta' ? 'உங்கள் தினசரி ஆரோக்கிய வழக்கத்தைக் கண்காணிக்கவும்' : 'Mindful reminders with 3D audio chimes'}
            </span>
          </div>
        </div>

        <button 
          type="button" 
          className="link-view-all modern-pill-action text-xs font-semibold px-3 py-1.5 rounded-full bg-subtle hover-accent cursor-pointer flex items-center gap-1" 
          onClick={onShowAll}
        >
          <span>{lang === 'ta' ? 'அனைத்தும் பார்க்க' : 'Manage All'}</span>
          <span>→</span>
        </button>
      </div>

      {/* 5 Cards Row with 3D Badges */}
      <div className="reminders-carousel-row">
        {allCards.map((card) => (
          <div 
            key={card.id} 
            className={`reminder-pastel-card modern-3d-card ${card.themeClass} ${card.completed ? 'is-completed' : ''} ${card.enabled === false ? 'opacity-60 grayscale-[0.2]' : ''}`}
            onClick={() => onToggleComplete && onToggleComplete(card.id)}
            role="button"
            tabIndex={0}
            title={lang === 'ta' ? 'முடிந்தது என மாற்ற கிளிக் செய்யவும்' : 'Click to toggle done / undo'}
          >
            <div className="card-top-header-flex flex items-center justify-between w-full mb-1">
              {/* 3D Animated Icon Badge */}
              <div className="card-3d-badge-container">
                {get3DBadge(card.category)}
              </div>

              {/* Modern Action Cluster */}
              <div className="card-action-mini-cluster flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="card-mini-action-btn ya-icon-btn"
                  onClick={(e) => handlePlayCardSound(e, card.sound)}
                  title={`Chime sound: ${card.sound || 'Soft Bell'}`}
                >
                  <Volume2 size={13} />
                </button>
                {onToggleEnable && (
                  <button
                    type="button"
                    className={`card-mini-action-btn ya-icon-btn ${card.enabled === false ? 'opacity-40 text-muted' : 'text-primary'}`}
                    onClick={() => onToggleEnable(card.id)}
                    title={card.enabled === false ? (lang === 'ta' ? 'இயக்குக' : 'Enable reminder') : (lang === 'ta' ? 'இடைநிறுத்துக' : 'Pause reminder')}
                  >
                    <Bell size={13} />
                  </button>
                )}
                {onEditReminder && (
                  <button
                    type="button"
                    className="card-mini-action-btn ya-icon-btn"
                    onClick={() => onEditReminder(card)}
                    title="Edit reminder"
                  >
                    <Edit3 size={13} />
                  </button>
                )}
                {onDeleteReminder && (
                  <button
                    type="button"
                    className="card-mini-action-btn ya-icon-btn hover-red"
                    onClick={() => onDeleteReminder(card.id)}
                    title="Delete reminder"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            <div className="card-inner-info mt-1">
              <h4 className="care-card-title text-sm font-bold text-slate-800 m-0">
                {lang === 'ta' && card.titleTa ? card.titleTa : card.title}
              </h4>
              
              <div className="care-card-time-row flex items-center gap-2 my-1">
                <span className="care-time-text font-bold text-xs">{card.time}</span>
                {card.enabled === false ? (
                  <span className="care-sound-badge text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200/80 text-slate-500 font-semibold">
                    {lang === 'ta' ? 'இடைநிறுத்தப்பட்டது' : 'Paused'}
                  </span>
                ) : card.sound ? (
                  <span className="care-sound-badge text-[10px] px-1.5 py-0.5 rounded-full bg-white/60 text-slate-600 font-medium inline-flex items-center gap-1">
                    <KitBell size={10} />
                    <span>{card.sound}</span>
                  </span>
                ) : null}
              </div>

              <p className="care-card-quote-text text-xs text-slate-600 m-0 line-clamp-2">
                {lang === 'ta' && card.messageTa ? card.messageTa : card.message}
              </p>
            </div>

            {/* Completed Badge */}
            {card.completed && (
              <div className="completed-check-tag flex items-center gap-1">
                <Check size={12} strokeWidth={3} />
                <span>Done</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Browser Timers vs Background Notifications Explanation Hint */}
      <div className="reminder-info-hint-banner p-2.5 rounded-xl bg-subtle text-[11px] text-muted flex items-center justify-between mt-2 border border-subtle">
        <span>
          💡 {lang === 'ta' 
            ? 'உலவி நினைவூட்டல்கள் பக்கம் இயங்கும்போது துல்லியமாக ஒலிக்கும். உலவி மூடப்பட்டிருக்கும் போதும் அறிவிப்புகள் வர இந்த தளத்தை PWA அல்லது APK ஆக நிறுவிக்கொள்ளலாம்.'
            : 'Browser timers chime accurately while the app is open. For alerts when browser is closed, install NITHYA as a PWA / Android APK.'}
        </span>
      </div>
    </section>
  );
}
