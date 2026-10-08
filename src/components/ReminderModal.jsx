import React, { useState, useEffect } from 'react';
import { X, Bell, Clock, Calendar, Repeat, MessageSquare, Tag } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function ReminderModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  lang
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Water');
  const [date, setDate] = useState('2026-10-08');
  const [time, setTime] = useState('08:00 AM');
  const [repeat, setRepeat] = useState('Daily');
  const [message, setMessage] = useState('');
  const [sound, setSound] = useState('Gentle Bell');
  const [enabled, setEnabled] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Water');
      setDate(initialData.date || '2026-10-08');
      setTime(initialData.time || '08:00 AM');
      setRepeat(initialData.repeat || 'Daily');
      setMessage(initialData.message || '');
      setSound(initialData.sound || 'Gentle Bell');
      setEnabled(initialData.enabled !== undefined ? initialData.enabled : true);
    } else {
      setTitle('');
      setCategory('Water');
      setDate('2026-10-08');
      setTime('08:00 AM');
      setRepeat('Daily');
      setMessage('');
      setSound('Gentle Bell');
      setEnabled(true);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTestSound = () => {
    audioEngine.playSoundByType(sound);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = lang === 'ta' ? 'தலைப்பு அவசியம்' : 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialData?.id || `rem-${Date.now()}`,
      title: title.trim(),
      category,
      date,
      time,
      repeat,
      message: message.trim() || getDefaultMessage(category),
      sound,
      enabled,
      completed: initialData?.completed || false
    });

    onClose();
  };

  const getDefaultMessage = (cat) => {
    switch (cat) {
      case 'Water': return "கொஞ்சம் தண்ணி குடிச்சுக்கோங்க… உடம்புக்கு அது தேவை ❤️";
      case 'Yoga': return "யோகா டைம்… கொஞ்ச நேரம் உங்களுக்காக ஒதுக்கிக்கோங்க 🧘‍♀️";
      case 'Meal': return "சாப்பிடாம இருக்காதீங்க… நேரத்துக்கு சாப்பிடுங்க ❤️";
      case 'Call': return "குடும்பத்தினரிடம் ஒரு போன் போட்டு நலம் விசாரிங்க 📞";
      case 'Personal Care': return "கொஞ்சம் உங்களையும் கவனிச்சுக்கோங்க… நீங்களும் முக்கியம் 💕";
      default: return "ஆரோக்கியமான பழக்கங்களை தொடர்ந்து கடைப்பிடியுங்கள் ✨";
    }
  };

  return (
    <div className="modal-backdrop-scrim" onClick={onClose}>
      <div 
        className="modal-bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle"></div>

        <div className="modal-header-bar">
          <div className="modal-title-group">
            <span className="modal-category-icon">⏰</span>
            <h3>
              {initialData 
                ? (lang === 'ta' ? 'நினைவூட்டலைத் திருத்துக' : 'Edit Reminder')
                : (lang === 'ta' ? 'புதிய நினைவூட்டல் சேர்க்க' : 'Add Smart Reminder')}
            </h3>
          </div>
          <button 
            type="button" 
            className="btn-modal-close" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-flow">
          {/* Title */}
          <div className="form-field-unit">
            <label>
              <Tag size={14} />
              <span>{lang === 'ta' ? 'நினைவூட்டல் தலைப்பு' : 'What do you want to remind about?'}</span>
            </label>
            <input 
              type="text" 
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Drink water / Morning Yoga" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="field-error-text">{errors.title}</span>}
          </div>

          {/* Category Picker */}
          <div className="form-field-unit">
            <label>
              <span>{lang === 'ta' ? 'வகை (Category)' : 'Category'}</span>
            </label>
            <div className="category-select-chips">
              {['Water', 'Yoga', 'Meal', 'Call', 'Personal Care'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-chip-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="form-row-2col">
            <div className="form-field-unit">
              <label>
                <Calendar size={14} />
                <span>{lang === 'ta' ? 'தேதி' : 'Date'}</span>
              </label>
              <input 
                type="date" 
                className="form-input" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-field-unit">
              <label>
                <Clock size={14} />
                <span>{lang === 'ta' ? 'நேரம்' : 'Time'}</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="08:00 AM" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Repeat & Sound Row */}
          <div className="form-row-2col">
            <div className="form-field-unit">
              <label>
                <Repeat size={14} />
                <span>{lang === 'ta' ? 'மீண்டும் நினைவூட்டு' : 'Repeat'}</span>
              </label>
              <select 
                className="form-select"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              >
                <option value="Daily">Daily (தினமும்)</option>
                <option value="Weekdays">Weekdays (வார நாட்கள்)</option>
                <option value="Weekly">Weekly (வாரந்தோறும்)</option>
                <option value="Once">Once (ஒரு முறை மட்டும்)</option>
              </select>
            </div>

            <div className="form-field-unit">
              <label className="justify-between">
                <span className="flex-center gap-1">
                  <Bell size={14} />
                  <span>{lang === 'ta' ? 'ஒலி' : 'Sound'}</span>
                </span>
                <button 
                  type="button" 
                  className="test-sound-link"
                  onClick={handleTestSound}
                >
                  🔊 {lang === 'ta' ? 'ஒலி கேட்க' : 'Test'}
                </button>
              </label>
              <select 
                className="form-select"
                value={sound}
                onChange={(e) => setSound(e.target.value)}
              >
                <option value="Gentle Bell">Gentle Bell (மெல்லிய மணி)</option>
                <option value="Singing Bowl">Singing Bowl (திபெத்திய கிண்ணம்)</option>
                <option value="Temple Bell">Temple Bell (கோயில் மணி)</option>
                <option value="Electronic Beep">Electronic Beep (எலக்ட்ரானிக்)</option>
              </select>
            </div>
          </div>

          {/* Custom Caring Message */}
          <div className="form-field-unit">
            <label>
              <MessageSquare size={14} />
              <span>{lang === 'ta' ? 'அன்பான செய்தி (Caring Message)' : 'Caring Message (Optional)'}</span>
            </label>
            <textarea 
              className="form-textarea"
              rows={2}
              placeholder={getDefaultMessage(category)}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Toggle Notification */}
          <div className="form-toggle-row">
            <div>
              <strong>{lang === 'ta' ? 'அறிவிப்பு இயக்கத்தில் உள்ளதா?' : 'Enable Notification'}</strong>
              <small>{lang === 'ta' ? 'நேரம் வரும்போது ஒலி எழுப்பப்படும்' : 'Plays loud audio chime at scheduled time'}</small>
            </div>
            <label className="switch-toggle">
              <input 
                type="checkbox" 
                checked={enabled} 
                onChange={(e) => setEnabled(e.target.checked)} 
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-bar">
            <button 
              type="button" 
              className="btn-modal-cancel"
              onClick={onClose}
            >
              {lang === 'ta' ? 'ரத்து செய்' : 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="btn-modal-save"
            >
              {lang === 'ta' ? 'நினைவூட்டல் சேமி' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
