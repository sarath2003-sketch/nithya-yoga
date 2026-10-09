import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Tag, Calendar, Trash2, X } from 'lucide-react';
import { loadStorage, saveStorage, DEFAULT_NOTES } from '../utils/storage';

export default function YogaNotesSection({ lang = 'en' }) {
  const [notes, setNotes] = useState(() => loadStorage('nithya_notes', DEFAULT_NOTES));
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Yoga');

  useEffect(() => {
    saveStorage('nithya_notes', notes);
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const colors = ['icon-orange-note', 'icon-red-note', 'icon-blue-note', 'icon-teal-note'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setNotes(prev => [
      {
        id: `note-${Date.now()}`,
        title: newTitle.trim(),
        content: newContent.trim() || 'Mindful reflection...',
        date: 'Today',
        tag: newTag,
        colorClass: randomColor
      },
      ...prev
    ]);

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
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
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          <span>{isAdding ? (lang === 'ta' ? 'ரத்து' : 'Cancel') : (lang === 'ta' ? 'குறிப்பு சேர்க்க' : '+ Add Note')}</span>
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
          <div className="flex items-center justify-between mt-2">
            <select 
              className="select-field-custom text-xs py-1"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            >
              <option value="Yoga">Yoga</option>
              <option value="Health">Health</option>
              <option value="Routine">Routine</option>
              <option value="Wellness">Wellness</option>
            </select>
            <button type="submit" className="btn-save-note">
              {lang === 'ta' ? 'சேமி' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="notes-vertical-stack">
        {notes.map((note) => (
          <div key={note.id} className="note-item-row group relative">
            <div className={`note-icon-badge ${note.colorClass || 'icon-orange-note'}`}>
              <BookOpen size={15} />
            </div>

            <div className="note-text-block">
              <div className="note-title-line">
                <strong className="note-title-strong">
                  {lang === 'ta' && note.titleTa ? note.titleTa : note.title}
                </strong>
              </div>
              <p className="note-excerpt-p">
                {lang === 'ta' && note.contentTa ? note.contentTa : (note.content || note.body)}
              </p>
              <div className="note-date-sub">
                <span>🗓 {note.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="note-tag-pill">
                {lang === 'ta' && note.tagTa ? note.tagTa : (note.tag || note.category)}
              </div>
              <button
                type="button"
                className="btn-delete-note-mini text-muted hover-red p-1 cursor-pointer"
                onClick={() => handleDeleteNote(note.id)}
                title="Delete note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
