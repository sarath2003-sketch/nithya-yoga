import React, { useState } from 'react';
import { BookOpen, Plus, Tag, Calendar } from 'lucide-react';

export default function YogaNotesSection({ lang = 'en' }) {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Benefits of Yoga',
      titleTa: 'யோகாவின் நன்மைகள்',
      content: 'Yoga improves flexibility, reduces stress and increases focus...',
      contentTa: 'யோகா நெகிழ்வுத்தன்மையை மேம்படுத்துகிறது, மன அழுத்தத்தைக் குறைக்கிறது...',
      date: 'Oct 5, 2026',
      tag: 'Yoga',
      tagTa: 'யோகா',
      colorClass: 'icon-orange-note'
    },
    {
      id: 2,
      title: 'Healthy Food Habits',
      titleTa: 'ஆரோக்கிய உணவுப் பழக்கங்கள்',
      content: 'Eat clean, stay fit. Fresh food gives more energy...',
      contentTa: 'சுத்தமாக உண்ணுங்கள், ஆரோக்கியமாக இருங்கள். புதிய உணவு அதிக ஆற்றலைத் தரும்...',
      date: 'Oct 4, 2026',
      tag: 'Health',
      tagTa: 'ஆரோக்கியம்',
      colorClass: 'icon-red-note'
    },
    {
      id: 3,
      title: 'Morning Routine',
      titleTa: 'காலை வழக்கம்',
      content: 'Wake up early, do breathing exercises, drink water...',
      contentTa: 'அதிகாலையில் எழும்புங்கள், மூச்சுப் பயிற்சி செய்யுங்கள், தண்ணீர் குடியுங்கள்...',
      date: 'Oct 3, 2026',
      tag: 'Routine',
      tagTa: 'வழக்கம்',
      colorClass: 'icon-blue-note'
    },
    {
      id: 4,
      title: 'Self Care',
      titleTa: 'சுய பராமரிப்பு',
      content: "Take care of your mind. It's just as important as your body...",
      contentTa: 'உங்கள் மனதை கவனித்துக் கொள்ளுங்கள். அது உடலைப் போலவே முக்கியமானது...',
      date: 'Oct 2, 2026',
      tag: 'Wellness',
      tagTa: 'நல்வாழ்வு',
      colorClass: 'icon-teal-note'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setNotes(prev => [
      {
        id: Date.now(),
        title: newTitle.trim(),
        content: newContent.trim() || 'Mindful reflection...',
        date: 'Today',
        tag: 'Wellness',
        colorClass: 'icon-teal-note'
      },
      ...prev
    ]);

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="dashboard-card yoga-notes-card">
      {/* Header */}
      <div className="card-header-row">
        <div>
          <h3 className="card-title-main">
            <BookOpen size={18} className="text-violet" />
            <span>{lang === 'ta' ? 'யோகா குறிப்புகள்' : 'Yoga Notes'}</span>
          </h3>
          <p className="card-sub-motto">
            {lang === 'ta' ? 'உங்கள் எண்ணங்கள் மற்றும் ஆரோக்கிய குறிப்புகளை இங்கே வையுங்கள்.' : 'Keep your thoughts, learnings and wellness notes here.'}
          </p>
        </div>

        <button 
          type="button" 
          className="btn-add-note-pill"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={14} />
          <span>{lang === 'ta' ? 'குறிப்பு சேர்க்க' : '+ Add Note'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddNote} className="inline-add-note-form">
          <input
            type="text"
            className="input-field-custom"
            placeholder={lang === 'ta' ? 'தலைப்பு...' : 'Note Title...'}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            className="input-field-custom textarea-mini"
            placeholder={lang === 'ta' ? 'குறிப்பை எழுதுங்கள்...' : 'Write note...'}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button type="submit" className="btn-save-note">
            {lang === 'ta' ? 'சேமி' : 'Save'}
          </button>
        </form>
      )}

      {/* Notes List */}
      <div className="notes-vertical-stack">
        {notes.map((note) => (
          <div key={note.id} className="note-item-row">
            <div className={`note-icon-badge ${note.colorClass}`}>
              <BookOpen size={15} />
            </div>

            <div className="note-text-block">
              <div className="note-title-line">
                <strong className="note-title-strong">
                  {lang === 'ta' && note.titleTa ? note.titleTa : note.title}
                </strong>
              </div>
              <p className="note-excerpt-p">
                {lang === 'ta' && note.contentTa ? note.contentTa : note.content}
              </p>
              <div className="note-date-sub">
                <span>🗓 {note.date}</span>
              </div>
            </div>

            <div className="note-tag-pill">
              {lang === 'ta' && note.tagTa ? note.tagTa : note.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
