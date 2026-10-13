import React, { useEffect, useRef } from 'react';
import { Bell, Check, Clock, Volume2, VolumeX, Square, RefreshCw } from 'lucide-react';
import { ThreeDBell } from './ThreeDIcons';
import { audioEngine } from '../utils/audioEngine';

export default function ActiveAlarmModal({
  alarm,
  onDismiss,
  onSnooze,
  lang = 'en'
}) {
  if (!alarm) return null;

  const intervalRef = useRef(null);

  useEffect(() => {
    // Play reminder alert chime periodically while alarm modal is visible
    intervalRef.current = setInterval(() => {
      audioEngine.playAlarmChime();
    }, 4500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      audioEngine.stopAlarmSound();
    };
  }, []);

  const handleStopAndDismiss = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    audioEngine.stopAlarmSound();
    if (onDismiss) onDismiss();
  };

  const handleStopAndSnooze = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    audioEngine.stopAlarmSound();
    if (onSnooze) onSnooze();
  };

  return (
    <div className="modal-backdrop-scrim ya-reveal z-50 flex items-center justify-center p-4">
      <div 
        className="modal-bottom-sheet max-w-sm w-full mx-auto bg-card rounded-2xl p-6 shadow-2xl border border-primary/30 text-center flex flex-col items-center gap-4 animate-bounce-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Bell Ringing Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative">
            <ThreeDBell size={52} />
          </div>
        </div>

        {/* Alarm Banner & Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-2">
            <Volume2 size={13} className="animate-pulse" />
            <span>{lang === 'ta' ? 'நினைவூட்டல் மணி ஒலிக்கிறது!' : 'REMINDER ALARM ACTIVE!'}</span>
          </div>

          <h3 className="text-xl font-extrabold text-heading">
            {alarm.titleTa || alarm.title}
          </h3>

          <div className="flex items-center justify-center gap-1 text-xs text-muted font-medium mt-1">
            <Clock size={12} />
            <span>{alarm.time} • {alarm.category || 'Wellness'}</span>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-heading/90 bg-subtle p-3 rounded-xl border border-subtle max-w-xs leading-relaxed">
          {alarm.messageTa || alarm.message || (lang === 'ta' ? 'உங்கள் ஆரோக்கியத்தைக் கவனிக்கவும் ❤️' : 'Take care of your health & wellness ❤️')}
        </p>

        {/* Actions: Stop Alarm (Primary Red/Accent), Dismiss, Snooze */}
        <div className="flex flex-col gap-2 w-full mt-1">
          {/* Main STOP ALARM button */}
          <button
            type="button"
            className="w-full py-2.5 text-xs font-extrabold rounded-xl bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            onClick={handleStopAndDismiss}
          >
            <Square size={13} fill="currentColor" />
            <span>{lang === 'ta' ? 'மணியை நிறுத்து (STOP ALARM)' : 'STOP ALARM'}</span>
          </button>

          <div className="flex gap-2 w-full">
            <button
              type="button"
              className="flex-1 py-2 text-xs font-semibold rounded-xl border border-subtle text-heading hover:bg-subtle transition-all cursor-pointer flex items-center justify-center gap-1.5"
              onClick={handleStopAndSnooze}
            >
              <RefreshCw size={12} />
              <span>{lang === 'ta' ? '5 நிமிடம் தள்ளிவை' : 'Snooze (5 min)'}</span>
            </button>

            <button
              type="button"
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-primary text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              onClick={handleStopAndDismiss}
            >
              <Check size={14} />
              <span>{lang === 'ta' ? 'முடிந்தது' : 'Dismiss'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
