import React, { useState } from 'react';
import { Plus, Calendar, Clock, Volume2, Save, Upload, Check, AlertCircle, Music, Sparkles } from 'lucide-react';
import { ThreeDWater, ThreeDLotus, ThreeDMeal, ThreeDPhone, ThreeDHeart, ThreeDBell } from './ThreeDIcons';
import { audioEngine, BUILT_IN_SOUNDS } from '../utils/audioEngine';

export default function QuickAddReminderCard({ onAddReminder, lang = 'en' }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Water');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [message, setMessage] = useState('');
  const [repeat, setRepeat] = useState('Daily');
  const [sound, setSound] = useState('Soft Bell');
  const [customAudioName, setCustomAudioName] = useState('');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 3D Category presets
  const categoryPresets = [
    { id: 'Water', name: 'Water', nameTa: 'தண்ணீர்', Icon: ThreeDWater, defaultTitle: 'Drink Water', defaultTitleTa: 'தண்ணீர் குடிக்கவும்', defaultMsg: 'Drink water... Stay fresh! 💧', defaultMsgTa: 'தண்ணீர் குடியுங்கள்... புத்துணர்ச்சியுடன் இருங்கள்! 💧' },
    { id: 'Yoga', name: 'Yoga', nameTa: 'யோகா', Icon: ThreeDLotus, defaultTitle: 'Daily Yoga Practice', defaultTitleTa: 'தினசரி யோகா பயிற்சி', defaultMsg: "Keep going! You're doing great! 💜", defaultMsgTa: 'தொடர்ந்து செய்யுங்கள்! சிறப்பாக செய்கிறீர்கள்! 💜' },
    { id: 'Meal', name: 'Meal', nameTa: 'உணவு', Icon: ThreeDMeal, defaultTitle: 'Healthy Meal', defaultTitleTa: 'ஆரோக்கிய உணவு', defaultMsg: 'Healthy food = Happy you! 🥗', defaultMsgTa: 'ஆரோக்கிய உணவு = மகிழ்ச்சியான நீங்கள்! 🥗' },
    { id: 'Call', name: 'Call', nameTa: 'அழைப்பு', Icon: ThreeDPhone, defaultTitle: 'Call Loved Ones', defaultTitleTa: 'அன்புக்குரியவரை அழைக்கவும்', defaultMsg: "Don't forget to call your loved ones 📞", defaultMsgTa: 'அன்பானவர்களை அழைக்க மறக்காதீர்கள் 📞' },
    { id: 'Personal Care', name: 'Care', nameTa: 'சுயநலம்', Icon: ThreeDHeart, defaultTitle: 'Personal Care Time', defaultTitleTa: 'சுய பராமரிப்பு நேரம்', defaultMsg: 'Take care of yourself. You matter! 💕', defaultMsgTa: 'உங்களை கவனித்துக் கொள்ளுங்கள்! 💕' },
  ];

  // Quick Time Presets
  const timePresets = [
    { label: 'Morning', labelTa: 'காலை', val: '06:30' },
    { label: 'Noon', labelTa: 'மதியம்', val: '13:00' },
    { label: 'Evening', labelTa: 'மாலை', val: '18:00' },
    { label: 'Night', labelTa: 'இரவு', val: '21:00' },
  ];

  // Format 24-hr time input to clean 12-hr format
  const formatTime12h = (time24) => {
    if (!time24) return '08:00 AM';
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hours12 = h % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')} ${period}`;
  };

  const handleSelectCategory = (preset) => {
    setCategory(preset.id);
    setTitle(lang === 'ta' ? preset.defaultTitleTa : preset.defaultTitle);
    setMessage(lang === 'ta' ? preset.defaultMsgTa : preset.defaultMsg);
    setErrorMsg('');
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

  const handleTestSound = () => {
    if (customAudioUrl) {
      audioEngine.playAudioFile(customAudioUrl);
    } else {
      audioEngine.playSoundByName(sound);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(lang === 'ta' ? 'தயவுசெய்து நினைவூட்டல் தலைப்பை உள்ளிடவும்' : 'Please enter a reminder title');
      return;
    }

    setErrorMsg('');
    const formattedTime = formatTime12h(time);

    onAddReminder({
      id: `rem-${Date.now()}`,
      title: title.trim(),
      date,
      time: formattedTime,
      rawTime: time,
      message: message.trim() || (lang === 'ta' ? "உடம்பையும் மனசையும் நல்லா கவனிச்சுக்கோங்க ❤️" : "Take care of your health & mind ❤️"),
      repeat,
      sound: customAudioName || sound,
      customAudioUrl: customAudioUrl || undefined,
      category,
      enabled: true,
      completed: false
    });

    setTitle('');
    setMessage('');
    setCustomAudioUrl('');
    setCustomAudioName('');
  };

  return (
    <div className="dashboard-card quick-add-card">
      <div className="card-header-row flex items-center justify-between pb-2 border-b border-subtle">
        <h3 className="card-title-main flex items-center gap-2 m-0 text-base font-bold">
          <ThreeDBell size={22} />
          <span>{lang === 'ta' ? 'ஸ்மார்ட் நினைவூட்டல் சேர்க்க' : 'Quick Add Reminder'}</span>
        </h3>
        <span className="badge-3d-sub text-[11px] px-2 py-0.5 rounded-full bg-teal-subtle text-teal font-semibold">
          3D Smart
        </span>
      </div>

      <form onSubmit={handleSubmit} className="quick-add-form pt-3">
        {errorMsg && (
          <div className="reminder-error-banner text-xs text-red p-2 bg-red-subtle rounded-lg mb-3 flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 3D Category Badges Quick Picker */}
        <div className="form-group-item mb-3">
          <label className="form-label-sub block text-xs font-semibold mb-1.5 text-muted">
            {lang === 'ta' ? 'வகை தேர்ந்தெடு (3D பிரிவுகள்)' : 'Quick Category Preset'}
          </label>
          <div className="quick-category-3d-row grid grid-cols-5 gap-1.5">
            {categoryPresets.map((preset) => {
              const IconComp = preset.Icon;
              const isSelected = category === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`category-preset-btn flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer border ${isSelected ? 'border-primary bg-primary-subtle shadow-sm scale-105' : 'border-subtle bg-card hover:bg-subtle'}`}
                  onClick={() => handleSelectCategory(preset)}
                  title={preset.name}
                >
                  <IconComp size={24} />
                  <span className="text-[10px] font-medium mt-1 truncate max-w-full">
                    {lang === 'ta' ? preset.nameTa : preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title input */}
        <div className="form-group-item mb-3">
          <label className="form-label-sub block text-xs font-semibold mb-1 text-muted">
            {lang === 'ta' ? 'நினைவூட்டல் தலைப்பு' : 'Reminder Title'}
          </label>
          <input
            type="text"
            className="input-field-custom w-full"
            placeholder={lang === 'ta' ? 'எ.கா. தண்ணீர் குடிக்கவும்' : 'e.g. Drink water / Morning Yoga'}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrorMsg(''); }}
            required
          />
        </div>

        {/* Date and Time with Quick Presets */}
        <div className="form-grid-2col grid grid-cols-2 gap-2 mb-3">
          <div className="form-group-item">
            <label className="form-label-sub block text-xs font-semibold mb-1 text-muted">
              {lang === 'ta' ? 'தேதி' : 'Date'}
            </label>
            <input
              type="date"
              className="input-field-custom w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group-item">
            <label className="form-label-sub block text-xs font-semibold mb-1 text-muted">
              {lang === 'ta' ? 'நேரம்' : 'Time'}
            </label>
            <input
              type="time"
              className="input-field-custom w-full"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Quick Time Presets Pills */}
        <div className="time-presets-pill-row flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="text-[10px] text-muted font-medium mr-1">{lang === 'ta' ? 'நேரம்:' : 'Presets:'}</span>
          {timePresets.map((tp) => (
            <button
              key={tp.val}
              type="button"
              className={`pill-mini-btn text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${time === tp.val ? 'bg-primary text-white border-primary' : 'bg-subtle text-muted border-subtle hover:text-heading'}`}
              onClick={() => setTime(tp.val)}
            >
              {lang === 'ta' ? `${tp.labelTa} (${tp.val})` : `${tp.label} (${tp.val})`}
            </button>
          ))}
        </div>

        {/* Caring Message */}
        <div className="form-group-item mb-3">
          <label className="form-label-sub block text-xs font-semibold mb-1 text-muted">
            {lang === 'ta' ? 'அக்கறை வாசகம் (விருப்பத்தேர்வு)' : 'Care Message (Optional)'}
          </label>
          <input
            type="text"
            className="input-field-custom w-full"
            placeholder={lang === 'ta' ? 'ஒரு அன்பான செய்தி...' : 'Write an encouraging reminder...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Repeat & Chime Selection */}
        <div className="form-grid-2col grid grid-cols-2 gap-2 mb-3">
          <div className="form-group-item">
            <label className="form-label-sub block text-xs font-semibold mb-1 text-muted">
              {lang === 'ta' ? 'மீண்டும் செய்' : 'Repeat'}
            </label>
            <select
              className="select-field-custom w-full"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <option value="Daily">{lang === 'ta' ? 'தினமும் (Daily)' : 'Daily'}</option>
              <option value="Weekdays">{lang === 'ta' ? 'வார நாட்கள் (Weekdays)' : 'Weekdays'}</option>
              <option value="Weekends">{lang === 'ta' ? 'வார இறுதி (Weekends)' : 'Weekends'}</option>
              <option value="Once">{lang === 'ta' ? 'ஒருமுறை (Once)' : 'Once'}</option>
            </select>
          </div>

          <div className="form-group-item">
            <div className="flex-between-label flex justify-between items-center mb-1">
              <label className="form-label-sub text-xs font-semibold text-muted">{lang === 'ta' ? 'ஒலி' : 'Sound'}</label>
              <button 
                type="button" 
                className="test-sound-link flex items-center gap-1 text-[11px] text-primary cursor-pointer hover:underline" 
                onClick={handleTestSound}
                title="Preview Sound"
              >
                <Volume2 size={12} />
                <span>{lang === 'ta' ? 'கேட்க' : 'Test'}</span>
              </button>
            </div>
            <select
              className="select-field-custom w-full"
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
                  {lang === 'ta' ? `${s.nameTa} (${s.name})` : s.name}
                </option>
              ))}
              {customAudioName && (
                <option value="custom">🎵 {customAudioName}</option>
              )}
            </select>
          </div>
        </div>

        {/* Optional Custom Audio Upload */}
        <div className="custom-sound-upload-row flex items-center justify-between text-xs text-muted mb-3 pt-1">
          <label className="cursor-pointer hover-accent flex items-center gap-1.5">
            <Upload size={13} className="text-primary" />
            <span>{customAudioName ? `Selected: ${customAudioName}` : (lang === 'ta' ? 'சொந்த ஒலி பதிவேற்றுக (.mp3)' : 'Upload custom chime (.mp3/.wav)')}</span>
            <input 
              type="file" 
              accept="audio/*" 
              className="hidden-file-input hidden" 
              onChange={handleCustomAudioUpload} 
            />
          </label>
        </div>

        {/* Modern Flagship Floating Pill Save Button */}
        <button type="submit" className="btn-save-reminder-main modern-save-pill w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs text-white shadow-md active:scale-95 transition-all cursor-pointer">
          <Save size={15} />
          <span>{lang === 'ta' ? 'நினைவூட்டலை சேமிக்கவும்' : 'Save Reminder'}</span>
        </button>
      </form>
    </div>
  );
}
