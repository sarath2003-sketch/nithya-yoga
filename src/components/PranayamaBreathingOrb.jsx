import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function PranayamaBreathingOrb({ lang = 'en' }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Inhale'); // 'Inhale', 'Hold', 'Exhale'
  const [timer, setTimer] = useState(4);
  const [technique, setTechnique] = useState('box'); // 'box', '478', 'calm'
  const [cycleCount, setCycleCount] = useState(0);

  const phaseRef = useRef('Inhale');
  const timerRef = useRef(4);

  const techniques = {
    box: {
      name: 'Box Breathing',
      nameTa: 'சதுர சுவாசம் (Box Breathing)',
      desc: 'Equal 4s breathing for focus and anxiety relief',
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4
    },
    '478': {
      name: '4-7-8 Relaxing Breath',
      nameTa: '4-7-8 அமைதி சுவாசம்',
      desc: 'Dr. Weil technique for deep nervous system relaxation',
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0
    },
    calm: {
      name: 'Deep Calm',
      nameTa: 'ஆழ்ந்த அமைதி (Calm Breath)',
      desc: 'Gentle 5s rhythm for meditative harmony',
      inhale: 5,
      hold1: 2,
      exhale: 5,
      hold2: 1
    }
  };

  const currentTech = techniques[technique];

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Transition phase
            const currentPhase = phaseRef.current;
            let nextPhase = 'Inhale';
            let nextDuration = currentTech.inhale;

            if (currentPhase === 'Inhale') {
              if (currentTech.hold1 > 0) {
                nextPhase = 'Hold';
                nextDuration = currentTech.hold1;
              } else {
                nextPhase = 'Exhale';
                nextDuration = currentTech.exhale;
              }
            } else if (currentPhase === 'Hold') {
              nextPhase = 'Exhale';
              nextDuration = currentTech.exhale;
            } else if (currentPhase === 'Exhale') {
              if (currentTech.hold2 > 0) {
                nextPhase = 'Hold';
                nextDuration = currentTech.hold2;
              } else {
                nextPhase = 'Inhale';
                nextDuration = currentTech.inhale;
                setCycleCount(c => c + 1);
              }
            }

            phaseRef.current = nextPhase;
            setPhase(nextPhase);
            audioEngine.playSoftBell();
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, technique]);

  const toggleActive = () => {
    if (!isActive) {
      phaseRef.current = 'Inhale';
      setPhase('Inhale');
      setTimer(currentTech.inhale);
      audioEngine.playSoftBell();
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    phaseRef.current = 'Inhale';
    setPhase('Inhale');
    setTimer(currentTech.inhale);
    setCycleCount(0);
  };

  return (
    <div className="pranayama-breathing-card">
      <div className="breathing-card-top flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="breathing-icon-glow">
            <Wind size={18} className="text-teal" />
          </div>
          <div>
            <h4 className="text-sm font-bold m-0 flex items-center gap-1.5">
              <span>{lang === 'ta' ? 'பிராணாயாமம் & சுவாசப் பயிற்சி' : 'Pranayama Breathing Orb'}</span>
              <span className="badge-live-pulse text-[10px] px-1.5 py-0.5 rounded-full bg-teal-subtle text-teal">3D Mind</span>
            </h4>
            <p className="text-xs text-muted m-0">{lang === 'ta' ? currentTech.nameTa : currentTech.desc}</p>
          </div>
        </div>

        {/* Technique Picker Pills */}
        <div className="technique-pills-row flex gap-1">
          {Object.keys(techniques).map(key => (
            <button
              key={key}
              type="button"
              className={`pill-mini-btn text-[11px] px-2 py-1 rounded-full ${technique === key ? 'active' : ''}`}
              onClick={() => {
                setTechnique(key);
                setIsActive(false);
                setPhase('Inhale');
                setTimer(techniques[key].inhale);
              }}
            >
              {key === 'box' ? 'Box (4-4)' : key === '478' ? '4-7-8' : 'Deep Calm'}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Animated Breathing Orb Visual */}
      <div className="breathing-visual-stage relative flex flex-col items-center justify-center my-3">
        <div className="breathing-orbit-backdrop" aria-hidden="true"></div>
        <div className={`breathing-outer-aura ${isActive ? phase.toLowerCase() : 'idle'}`}>
          <div className={`breathing-inner-orb ${isActive ? phase.toLowerCase() : 'idle'}`}>
            <div className="orb-center-content">
              <span className="orb-phase-text font-bold text-base">
                {lang === 'ta' 
                  ? (phase === 'Inhale' ? 'உள்ளிழுக்கவும்' : phase === 'Hold' ? 'நிறுத்தவும்' : 'வெளியிடவும்')
                  : phase}
              </span>
              <span className="orb-timer-countdown font-extrabold text-2xl">{timer}s</span>
            </div>
          </div>
        </div>

        <div className="cycle-badge-sub mt-2 text-xs text-muted">
          <span>{lang === 'ta' ? `முடிந்த சுற்றுகள்: ${cycleCount}` : `Cycles Completed: ${cycleCount}`}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="breathing-controls-row flex items-center justify-center gap-3 mt-2">
        <button
          type="button"
          className="btn-breathing-primary flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs"
          onClick={toggleActive}
        >
          {isActive ? <Pause size={15} /> : <Play size={15} />}
          <span>{isActive ? (lang === 'ta' ? 'நிறுத்து' : 'Pause Breath') : (lang === 'ta' ? 'சுவாசிக்கத் தொடங்கு' : 'Start Breathing')}</span>
        </button>

        <button
          type="button"
          className="btn-breathing-reset p-2 rounded-full text-muted hover-accent"
          onClick={handleReset}
          title="Reset Timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
