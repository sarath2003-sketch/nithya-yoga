import React from 'react';
import { 
  Calendar, 
  Droplet, 
  Utensils, 
  Phone, 
  Heart, 
  Flower2, 
  Check, 
  Trash2, 
  Clock 
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function SmartCareTimeline({
  reminders,
  onToggleComplete,
  onDeleteReminder,
  onShowAll,
  lang = 'en'
}) {
  // Pre-configured reminder cards matching screenshot
  const defaultCareCards = [
    {
      id: 'rem-yoga-1',
      title: 'Next Yoga Class',
      titleTa: 'அடுத்த யோகா வகுப்பு',
      time: '6:00 PM',
      category: 'Yoga',
      message: "Keep going! You're doing great! 💜",
      messageTa: "தொடர்ந்து செய்யுங்கள்! நீங்கள் சிறப்பாக செய்கிறீர்கள்! 💜",
      themeClass: 'care-card-purple',
      icon: Flower2,
      iconColor: 'purple'
    },
    {
      id: 'rem-water-1',
      title: 'Water Reminder',
      titleTa: 'தண்ணீர் நினைவூட்டல்',
      time: '5:30 PM',
      category: 'Water',
      message: "Drink water... Stay fresh! 💧",
      messageTa: "தண்ணீர் குடியுங்கள்... புத்துணர்ச்சியுடன் இருங்கள்! 💧",
      themeClass: 'care-card-cyan',
      icon: Droplet,
      iconColor: 'cyan'
    },
    {
      id: 'rem-meal-1',
      title: 'Meal Reminder',
      titleTa: 'உணவு நினைவூட்டல்',
      time: '1:00 PM',
      category: 'Meal',
      message: "Healthy food = Happy you! 🥗",
      messageTa: "ஆரோக்கிய உணவு = மகிழ்ச்சியான நீங்கள்! 🥗",
      themeClass: 'care-card-yellow',
      icon: Utensils,
      iconColor: 'yellow'
    },
    {
      id: 'rem-call-1',
      title: 'Call Reminder',
      titleTa: 'அழைப்பு நினைவூட்டல்',
      time: '7:00 PM',
      category: 'Call',
      message: "Don't forget to call your loved ones. 📞",
      messageTa: "உங்கள் அன்புக்குரியவர்களை அழைக்க மறக்காதீர்கள். 📞",
      themeClass: 'care-card-green',
      icon: Phone,
      iconColor: 'green'
    },
    {
      id: 'rem-care-1',
      title: 'Personal Care',
      titleTa: 'சுய பராமரிப்பு',
      time: '9:00 PM',
      category: 'Personal Care',
      message: "Take care of yourself. You matter! 💕",
      messageTa: "உங்களை கவனித்துக் கொள்ளுங்கள். நீங்களும் முக்கியம்! 💕",
      themeClass: 'care-card-pink',
      icon: Heart,
      iconColor: 'pink'
    }
  ];

  // Merge default cards with any custom user reminders
  const allCards = reminders && reminders.length > 0 
    ? reminders.slice(0, 5).map((r, idx) => ({
        ...r,
        themeClass: idx === 0 ? 'care-card-purple'
                  : idx === 1 ? 'care-card-cyan'
                  : idx === 2 ? 'care-card-yellow'
                  : idx === 3 ? 'care-card-green' : 'care-card-pink',
        icon: r.category === 'Water' ? Droplet
            : r.category === 'Meal' ? Utensils
            : r.category === 'Call' ? Phone
            : r.category === 'Personal Care' ? Heart : Flower2,
        iconColor: idx === 0 ? 'purple' : idx === 1 ? 'cyan' : idx === 2 ? 'yellow' : idx === 3 ? 'green' : 'pink'
      }))
    : defaultCareCards;

  return (
    <section className="dashboard-section today-reminders-section">
      <div className="section-title-bar">
        <h3 className="section-heading-with-icon">
          <Calendar size={18} className="text-violet" />
          <span>{lang === 'ta' ? 'இன்றைய நினைவூட்டல்கள்' : "Today's Reminders"}</span>
        </h3>
        <button 
          type="button" 
          className="link-view-all" 
          onClick={onShowAll}
        >
          {lang === 'ta' ? 'அனைத்தும் பார்க்க →' : 'View All →'}
        </button>
      </div>

      {/* 5 Cards Row */}
      <div className="reminders-carousel-row">
        {allCards.map((card) => {
          const IconComponent = card.icon || Flower2;
          return (
            <div 
              key={card.id} 
              className={`reminder-pastel-card ${card.themeClass} ${card.completed ? 'is-completed' : ''}`}
              onClick={() => onToggleComplete && onToggleComplete(card.id)}
            >
              <div className="card-top-icon-badge">
                <IconComponent size={20} className={`icon-care-${card.iconColor}`} />
              </div>

              <div className="card-inner-info">
                <h4 className="care-card-title">
                  {lang === 'ta' && card.titleTa ? card.titleTa : card.title}
                </h4>
                <div className="care-card-time-row">
                  <span className="care-time-text">{card.time}</span>
                </div>
                <p className="care-card-quote-text">
                  {lang === 'ta' && card.messageTa ? card.messageTa : card.message}
                </p>
              </div>

              {card.completed && (
                <div className="completed-check-tag">✓ Done</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
