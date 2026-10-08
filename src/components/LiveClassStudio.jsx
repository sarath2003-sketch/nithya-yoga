import React, { useState } from 'react';
import { 
  Radio, 
  Plus, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Settings, 
  Send, 
  Pause, 
  Play, 
  Users, 
  MessageSquare,
  LogOut
} from 'lucide-react';

export default function LiveClassStudio({
  activeClass,
  onLeaveClass,
  lang = 'en'
}) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Meena', text: 'This is so relaxing! 💜', time: '10:24 AM' },
    { id: 2, sender: 'Karthik', text: 'Nice breathing technique!', time: '10:26 AM' },
    { id: 3, sender: 'You', text: 'Feeling so relaxed 😊', time: '10:34 AM' }
  ]);

  const participants = [
    { id: 1, name: 'Teacher (Host)', role: 'Host', isHost: true },
    { id: 2, name: 'You', role: 'Student' },
    { id: 3, name: 'Meena', role: 'Student' },
    { id: 4, name: 'Karthik', role: 'Student' },
    { id: 5, name: 'Divya', role: 'Student' },
    { id: 6, name: 'Ravi', role: 'Student' }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'You',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="dashboard-card live-class-card">
      {/* Header */}
      <div className="card-header-row live-header-row">
        <div className="live-title-group">
          <span className="live-pulse-icon">((•))</span>
          <h3 className="card-title-main">
            <span>{lang === 'ta' ? 'லைவ் வகுப்பு' : 'Live Class'}</span>
          </h3>
        </div>

        <div className="live-header-actions">
          <span className="live-status-badge">
            <span className="green-dot-pulse">●</span>
            <span>Live</span>
          </span>
          <button type="button" className="btn-icon-square" title="Add participant">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Video Screen Feed */}
      <div className="live-video-screen">
        <img 
          src="assets/images/live-class.jpg" 
          alt="Live Yoga Stream" 
          className="live-video-bg-img" 
        />
        
        {/* Top-Right Timer */}
        <div className="video-timer-badge">
          <span>00:32:16</span>
          <span className="red-record-dot">🔴</span>
        </div>

        {/* Video Control Bar */}
        <div className="video-bottom-controls-bar">
          <div className="controls-left-icons">
            <button 
              type="button" 
              className="ctrl-btn"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play size={15} /> : <Pause size={15} />}
            </button>

            <button 
              type="button" 
              className={`ctrl-btn ${!isMicOn ? 'muted' : ''}`}
              onClick={() => setIsMicOn(!isMicOn)}
              title="Toggle Mic"
            >
              {isMicOn ? <Mic size={15} /> : <MicOff size={15} />}
            </button>

            <button 
              type="button" 
              className={`ctrl-btn ${!isVideoOn ? 'muted' : ''}`}
              onClick={() => setIsVideoOn(!isVideoOn)}
              title="Toggle Video"
            >
              {isVideoOn ? <VideoIcon size={15} /> : <VideoOff size={15} />}
            </button>

            <button type="button" className="ctrl-btn" title="Settings">
              <Settings size={15} />
            </button>
          </div>

          <button 
            type="button" 
            className="btn-leave-class-pill"
            onClick={onLeaveClass}
          >
            {lang === 'ta' ? 'வெளியேறு' : 'Leave Class'}
          </button>
        </div>
      </div>

      {/* Split Below Video: Participants (Left) + Chat (Right) */}
      <div className="live-split-footer">
        {/* Participants Column */}
        <div className="participants-col">
          <div className="split-col-header">
            <h4>{lang === 'ta' ? 'பங்கேற்பாளர்கள் (12)' : 'Participants (12)'}</h4>
          </div>
          <div className="participants-list-scroll">
            {participants.map(p => (
              <div key={p.id} className="participant-item-row">
                <div className="participant-info">
                  <span className="participant-name">{p.name}</span>
                </div>
                <span className="online-green-indicator">●</span>
              </div>
            ))}
            <div className="more-participants-label">+7 more</div>
          </div>
        </div>

        {/* Chat Column */}
        <div className="chat-col">
          <div className="split-col-header">
            <h4>{lang === 'ta' ? 'அரட்டை' : 'Chat'}</h4>
          </div>

          <div className="chat-messages-scroll">
            {messages.map(m => (
              <div key={m.id} className="chat-message-bubble">
                <span className="chat-sender-name">{m.sender}:</span>
                <span className="chat-text-content">{m.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form-bar">
            <input
              type="text"
              placeholder={lang === 'ta' ? 'செய்தியைத் தட்டச்சு செய்க...' : 'Type a message...'}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" aria-label="Send">
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
