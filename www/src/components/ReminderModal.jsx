import React, { useState, useEffect } from 'react';
import { X, Bell, Clock, Calendar, Repeat, MessageSquare, Tag, Trash2, Volume2, Upload } from 'lucide-react';
import { audioEngine, BUILT_IN_SOUNDS } from '../utils/audioEngine';
import { ThreeDWater, ThreeDLotus, ThreeDMeal, ThreeDPhone, ThreeDHeart, ThreeDBell } from './ThreeDIcons';

export default function ReminderModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  lang = 'en'
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Water');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [repeat, setRepeat] = useState('Daily');
  const [message, setMessage] = useState('');
  const [sound, setSound] = useState('Soft Bell');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [customAudioName, setCustomAudioName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [errors, setErrors] = useState({});

  // Helper to parse "08:00 AM" or "18:00" into 24-hr format "HH:MM" for <input type="time">
  const to24h = (timeStr) => {
    if (!timeStr) return '08:00';
    if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
      return timeStr.slice(0, 5);
    }
    const parts = timeStr.trim().split(' ');
    const timeParts = parts[0].split(':');
    let hours = parseInt(timeParts[0], 10);
    const mins = timeParts[1] || '00';
    const period = parts[1] || 'AM';

    if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${mins.slice(0, 2)}`;
  };

  const formatTime12h = (time24) => {
    if (!time24) return '08:00 AM';
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hours12 = h % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')} ${period}`;
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'Water');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setTime(to24h(initialData.rawTime || initialData.time || '08:00 AM'));
      setRepeat(initialData.repeat || 'Daily');
      setMessage(initialData.message || '');
      setSound(initialData.sound || 'Soft Bell');
      setCustomAudioUrl(initialData.customAudioUrl || '');
      setCustomAudioName(initialData.customAudioUrl ? (initialData.sound || 'Custom Chime') : '');
      setEnabled(initialData.enabled !== undefined ? initialData.enabled : true);
    } else {
      setTitle('');
      setCategory('Water');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('08:00');
      setRepeat('Daily');
      setMessage('');
      setSound('Soft Bell');
      setCustomAudioUrl('');
      setCustomAudioName('');
      setEnabled(true);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTestSound = () => {
    if (customAudioUrl) {
      audioEngine.playAudioFile(customAudioUrl);
    } else {
      audioEngine.playSoundByName(sound);
    }
  };

  const handleCustomAudioUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setCustomAudioUrl(dataUrl);
        setCustomAudioName(file.name);
        setSound(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = lang === 'ta' ? 'தலைப்பு அவசியம்' : 'Title is required';
    }
    if (!time) {
      newErrors.time = lang === 'ta' ? 'நேரம் தேர்ந்தெடுக்கவும்' : 'Time is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedTime = formatTime12h(time);

    onSave({
      id: initialData?.id || `rem-${Date.now()}`,
      title: title.trim(),
      category,
      date,
      time: formattedTime,
      rawTime: time,
      repeat,
      message: message.trim() || getDefaultMessage(category),
      sound: customAudioName || sound,
      customAudioUrl: customAudioUrl || undefined,
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

        <div className="modal-header-bar flex items-center justify-between pb-3 border-b border-subtle">
          <div className="modal-title-group flex items-center gap-2">
            <ThreeDBell size={26} />
            <h3 className="m-0 font-bold text-base text-heading">
              {initialData 
                ? (lang === 'ta' ? 'நினைவூட்டலைத் திருத்துக' : 'Edit Smart Reminder')
                : (lang === 'ta' ? 'புதிய நினைவூட்டல் சேர்க்க' : 'Add Smart Reminder')}
            </h3>
          </div>
          <button 
            type="button" 
            className="btn-modal-close p-1.5 rounded-full hover:bg-subtle text-muted" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-flow pt-3">
          {/* Title */}
          <div className="form-field-unit mb-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-1">
              <Tag size={14} className="text-primary" />
              <span>{lang === 'ta' ? 'நினைவூட்டல் தலைப்பு' : 'What do you want to remind about?'}</span>
            </label>
            <input 
              type="text" 
              className={`form-input w-full ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Drink water / Morning Yoga" 
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: null })); }}
            />
            {errors.title && <span className="field-error-text text-xs text-red mt-1">{errors.title}</span>}
          </div>

          {/* Category Picker with 3D Badges */}
          <div className="form-field-unit mb-3">
            <label className="text-xs font-semibold text-muted mb-1 block">
              <span>{lang === 'ta' ? 'வகை (3D பிரிவுகள்)' : 'Category (3D Icons)'}</span>
            </label>
            <div className="category-select-chips grid grid-cols-5 gap-1.5">
              {[
                { id: 'Water', label: 'Water', labelTa: 'தண்ணீர்', Icon: ThreeDWater },
                { id: 'Yoga', label: 'Yoga', labelTa: 'யோகா', Icon: ThreeDLotus },
                { id: 'Meal', label: 'Meal', labelTa: 'உணவு', Icon: ThreeDMeal },
                { id: 'Call', label: 'Call', labelTa: 'அழைப்பு', Icon: ThreeDPhone },
                { id: 'Personal Care', label: 'Care', labelTa: 'சுயநலம்', Icon: ThreeDHeart }
              ].map(catItem => {
                const IconComp = catItem.Icon;
                const isSelected = category === catItem.id;
                return (
                  <button
                    key={catItem.id}
                    type="button"
                    className={`cat-chip-btn flex flex-col items-center justify-center p-2 rounded-xl transition-all border cursor-pointer ${isSelected ? 'border-primary bg-primary-subtle shadow-sm scale-105 font-bold' : 'border-subtle bg-card hover:bg-subtle text-muted'}`}
                    onClick={() => {
                      setCategory(catItem.id);
                      if (!title || title === 'Drink water' || title === 'Daily Yoga Practice' || title === 'Healthy Meal' || title === 'Call Loved Ones' || title === 'Personal Care Time') {
                        setTitle(catItem.id === 'Water' ? 'Drink water' : catItem.id === 'Yoga' ? 'Daily Yoga Practice' : catItem.id === 'Meal' ? 'Healthy Meal' : catItem.id === 'Call' ? 'Call Loved Ones' : 'Personal Care Time');
                      }
                    }}
                  >
                    <IconComp size={22} />
                    <span className="text-[10px] mt-1 truncate">{lang === 'ta' ? catItem.labelTa : catItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="form-row-2col mb-2">
            <div className="form-field-unit">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-1">
                <Calendar size={14} className="text-primary" />
                <span>{lang === 'ta' ? 'தேதி' : 'Date'}</span>
              </label>
              <input 
                type="date" 
                className="form-input w-full" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-field-unit">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-1">
                <Clock size={14} className="text-primary" />
                <span>{lang === 'ta' ? 'நேரம்' : 'Time'}</span>
              </label>
              <input 
                type="time" 
                className={`form-input w-full ${errors.time ? 'error' : ''}`}
                value={time}
                onChange={(e) => { setTime(e.target.value); setErrors(prev => ({ ...prev, time: null })); }}
                required
              />
              {errors.time && <span className="field-error-text text-xs text-red mt-1">{errors.time}</span>}
            </div>
          </div>

          {/* Quick Time Presets for effortless editing */}
          <div className="time-presets-row flex items-center gap-1 mb-3 flex-wrap">
            <span className="text-[10px] text-muted font-medium mr-1">{lang === 'ta' ? 'விரைவு நேரம்:' : 'Quick Time:'}</span>
            {[
              { l: '06:30 AM', v: '06:30' },
              { l: '01:00 PM', v: '13:00' },
              { l: '06:00 PM', v: '18:00' },
              { l: '09:00 PM', v: '21:00' }
            ].map(tp => (
              <button
                key={tp.v}
                type="button"
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${time === tp.v ? 'bg-primary text-white border-primary font-bold' : 'bg-subtle text-muted border-subtle hover:text-heading'}`}
                onClick={() => setTime(tp.v)}
              >
                {tp.l}
              </button>
            ))}
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
                  title="Test Sound"
                >
                  <Volume2 size={13} />
                  <span>{lang === 'ta' ? 'ஒலி கேட்க' : 'Preview'}</span>
                </button>
              </label>
              <select 
                className="form-select"
                value={customAudioName ? 'custom' : sound}
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    setSound(e.target.value);
                    setCustomAudioName('');
                    setCustomAudioUrl('');
                    audioEngine.playSoundByName(e.target.value);
                  }
                }}
              >
                {BUILT_IN_SOUNDS.map(s => (
                  <option key={s.id} value={s.id}>
                    {lang === 'ta' ? `${s.nameTa} (${s.name})` : `${s.name} - ${s.desc}`}
                  </option>
                ))}
                {customAudioName && (
                  <option value="custom">🎵 {customAudioName}</option>
                )}
              </select>
            </div>
          </div>

          {/* Custom Chime Upload */}
          <div className="custom-sound-upload-row flex items-center justify-between text-xs text-muted">
            <label className="cursor-pointer hover-accent flex items-center gap-1">
              <Upload size={12} />
              <span>{customAudioName ? `Selected: ${customAudioName}` : (lang === 'ta' ? 'சொந்த ஒலி கோப்பு பதிவேற்றுக (.mp3)' : 'Upload custom sound (.mp3/.wav)')}</span>
              <input 
                type="file" 
                accept="audio/*" 
                className="hidden-file-input" 
                onChange={handleCustomAudioUpload} 
              />
            </label>
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
              <small>{lang === 'ta' ? 'நேரம் வரும்போது ஒலி எழுப்பப்படும்' : 'Plays notification sound at scheduled time'}</small>
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
            {initialData && onDelete && (
              <button 
                type="button" 
                className="btn-modal-delete flex items-center gap-1"
                onClick={() => {
                  onDelete(initialData.id);
                  onClose();
                }}
              >
                <Trash2 size={14} />
                <span>{lang === 'ta' ? 'நீக்குக' : 'Delete'}</span>
              </button>
            )}
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
