import React, { useState } from 'react';
import { Plus, Calendar, Clock, Volume2, Save } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function QuickAddReminderCard({ onAddReminder, lang = 'en' }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00 AM');
  const [message, setMessage] = useState('');
  const [repeat, setRepeat] = useState('Daily');
  const [sound, setSound] = useState('Gentle Bell');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      id: `rem-${Date.now()}`,
      title: title.trim(),
      date,
      time,
      message: message.trim() || (lang === 'ta' ? "உடம்பையும் மனசையும் நல்லா கவனிச்சுக்கோங்க ❤️" : "Take care of your health & mind ❤️"),
      repeat,
      sound,
      category: title.toLowerCase().includes('water') ? 'Water' 
              : title.toLowerCase().includes('meal') || title.toLowerCase().includes('food') ? 'Meal'
              : title.toLowerCase().includes('yoga') ? 'Yoga'
              : title.toLowerCase().includes('call') ? 'Call' : 'Personal Care',
      enabled: true,
      completed: false
    });

    setTitle('');
    setMessage('');
  };

  const handleTestSound = () => {
    audioEngine.playSoundByType(sound);
  };

  return (
    <div className="dashboard-card quick-add-card">
      <div className="card-header-row">
        <h3 className="card-title-main">
          <span className="icon-blue-plus">➕</span>
          <span>{lang === 'ta' ? 'விரைவு நினைவூட்டல்' : 'Quick Add Reminder'}</span>
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="quick-add-form">
        <div className="form-group-item">
          <label className="form-label-sub">
            {lang === 'ta' ? 'எதைப் பற்றி நினைவூட்ட வேண்டும்?' : 'What do you want to remind about?'}
          </label>
          <input
            type="text"
            className="input-field-custom"
            placeholder={lang === 'ta' ? 'எ.கா. தண்ணீர் குடிக்கவும்' : 'e.g. Drink water'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-grid-2col">
          <div className="form-group-item">
            <label className="form-label-sub">
              {lang === 'ta' ? 'தேதி' : 'Date'}
            </label>
            <div className="input-with-icon">
              <input
                type="date"
                className="input-field-custom"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group-item">
            <label className="form-label-sub">
              {lang === 'ta' ? 'நேரம்' : 'Time'}
            </label>
            <div className="input-with-icon">
              <input
                type="text"
                className="input-field-custom"
                placeholder="08:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-group-item">
          <label className="form-label-sub">
            {lang === 'ta' ? 'அக்கறை வாசகம் (விருப்பத்தேர்வு)' : 'Message (Optional)'}
          </label>
          <input
            type="text"
            className="input-field-custom"
            placeholder={lang === 'ta' ? 'ஒரு செய்தி எழுதுங்கள்...' : 'Write a message...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="form-grid-2col">
          <div className="form-group-item">
            <label className="form-label-sub">
              {lang === 'ta' ? 'மீண்டும் செய்' : 'Repeat'}
            </label>
            <select
              className="select-field-custom"
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
            <div className="flex-between-label">
              <label className="form-label-sub">{lang === 'ta' ? 'ஒலி' : 'Sound'}</label>
              <button 
                type="button" 
                className="test-sound-link" 
                onClick={handleTestSound}
                title="Test Sound"
              >
                <Volume2 size={12} />
              </button>
            </div>
            <select
              className="select-field-custom"
              value={sound}
              onChange={(e) => setSound(e.target.value)}
            >
              <option value="Gentle Bell">Gentle Bell</option>
              <option value="Temple Bell">Temple Gong</option>
              <option value="Singing Bowl">Singing Bowl</option>
              <option value="Chakra Tone">Chakra Tone</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-save-reminder-main">
          <Save size={16} />
          <span>{lang === 'ta' ? 'நினைவூட்டலை சேமிக்கவும்' : 'Save Reminder'}</span>
        </button>
      </form>
    </div>
  );
}
