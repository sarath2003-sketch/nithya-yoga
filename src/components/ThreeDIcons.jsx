import React from 'react';

/* ==========================================================================
   ADVANCED YOGA UI KIT — 3D Specular Badges & Exact Geometry Icons
   Matches preview.html and yoga-ui.css from advanced_yoga_ui_kit
   ========================================================================== */

// Exact UI Kit SVG Paths
export const KIT_PATHS = {
  heart: "M20.8 8.7c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9",
  bellClapper: "M10 21h4",
  call: "M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.9L6.7 9.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 1.9-.6l2.8.5a2 2 0 0 1 1.7 2.6Z",
  water: "M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z",
  waterDrop: "M9 16a3 3 0 0 0 3 2",
  music: "M9 18V5l12-2v13",
  play: "m8 5 11 7-11 7z"
};

// 1. Raw SVG Kit Icons (for .ya-icon-btn inline use)
export function KitHeart({ size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={KIT_PATHS.heart} />
    </svg>
  );
}

export function KitBell({ size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={KIT_PATHS.bell} />
      <path d={KIT_PATHS.bellClapper} />
    </svg>
  );
}

export function KitCall({ size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={KIT_PATHS.call} />
    </svg>
  );
}

export function KitWater({ size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={KIT_PATHS.water} />
      <path d={KIT_PATHS.waterDrop} />
    </svg>
  );
}

export function KitMusic({ size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={KIT_PATHS.music} />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

// 2. 3D Illuminated Glass Badges (High polish with specular highlights & gradients)

// 3D Water Droplet (Hydration)
export function ThreeDWater({ size = 38, className = '' }) {
  return (
    <div className={`three-d-badge water-3d ya-icon-badge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" className="three-d-svg">
        <defs>
          <linearGradient id="waterKitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="45%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="waterGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#0284C7" floodOpacity="0.38" />
          </filter>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#waterKitGrad)" filter="url(#waterGlow)" />
        <path d="M4 4 H28 V13 Q16 16 4 13 Z" fill="url(#waterGloss)" rx="8" opacity="0.35" />
        <g transform="translate(4, 4)">
          <path
            d={KIT_PATHS.water}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255, 255, 255, 0.22)"
          />
          <path
            d={KIT_PATHS.waterDrop}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <circle cx="23" cy="8" r="1.5" fill="#FFFFFF" opacity="0.85" />
      </svg>
    </div>
  );
}

// 3D Harmony Golden Bell (Smart Reminder)
export function ThreeDBell({ size = 38, className = '' }) {
  return (
    <div className={`three-d-badge bell-3d ya-icon-badge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" className="three-d-svg">
        <defs>
          <linearGradient id="bellKitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="bellGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="bellGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#F59E0B" floodOpacity="0.4" />
          </filter>
        </defs>
        <circle cx="16" cy="16" r="14" fill="url(#bellKitGrad)" filter="url(#bellGlow)" />
        <ellipse cx="16" cy="8" rx="8" ry="4" fill="url(#bellGloss)" opacity="0.45" />
        <g transform="translate(4, 4)">
          <path
            d={KIT_PATHS.bell}
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255, 255, 255, 0.2)"
          />
          <path
            d={KIT_PATHS.bellClapper}
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
        <circle cx="22" cy="9" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}

// 3D Ruby Loving Heart (Personal Care & Love)
export function ThreeDHeart({ size = 38, className = '' }) {
  return (
    <div className={`three-d-badge heart-3d ya-icon-badge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" className="three-d-svg">
        <defs>
          <linearGradient id="heartKitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="45%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#9D174D" />
          </linearGradient>
          <linearGradient id="heartGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#EC4899" floodOpacity="0.4" />
          </filter>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#heartKitGrad)" filter="url(#heartGlow)" />
        <path d="M4 4 H28 V13 Q16 16 4 13 Z" fill="url(#heartGloss)" rx="8" opacity="0.35" />
        <g transform="translate(4, 4)">
          <path
            d={KIT_PATHS.heart}
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255, 255, 255, 0.3)"
          />
        </g>
        <circle cx="23" cy="8" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}

// 3D Indigo Connection Phone (Call Loved Ones)
export function ThreeDPhone({ size = 38, className = '' }) {
  return (
    <div className={`three-d-badge phone-3d ya-icon-badge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" className="three-d-svg">
        <defs>
          <linearGradient id="phoneKitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="45%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
          <linearGradient id="phoneGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="phoneGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#8B5CF6" floodOpacity="0.4" />
          </filter>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#phoneKitGrad)" filter="url(#phoneGlow)" />
        <path d="M4 4 H28 V13 Q16 16 4 13 Z" fill="url(#phoneGloss)" rx="8" opacity="0.35" />
        <g transform="translate(4, 4)">
          <path
            d={KIT_PATHS.call}
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255, 255, 255, 0.22)"
          />
        </g>
        <circle cx="23" cy="8" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}

// 3D Emerald Nourishing Meal Bowl
export function ThreeDMeal({ size = 38, className = '' }) {
  return (
    <div className={`three-d-badge meal-3d ya-icon-badge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" className="three-d-svg">
        <defs>
          <linearGradient id="mealKitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="45%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="mealGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="mealGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#16A34A" floodOpacity="0.4" />
          </filter>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#mealKitGrad)" filter="url(#mealGlow)" />
        <path d="M4 4 H28 V13 Q16 16 4 13 Z" fill="url(#mealGloss)" rx="8" opacity="0.35" />
        <g transform="translate(4, 4)">
          {/* Bowl and steam */}
          <path d="M4 12 C4 18 8 20 12 20 C16 20 20 18 20 12 Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.25)" />
          <path d="M4 12 H20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 8 Q7 6 8 4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M12 7 Q11 5 12 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M16 8 Q15 6 16 4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
        <circle cx="23" cy="8" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}

// 3D Sacred Lotus (Yoga & Peace)
export function ThreeDLotus({ size = 38, className = '' }) {
  return (
    <div className={`three-d-badge lotus-3d ya-icon-badge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" className="three-d-svg">
        <defs>
          <linearGradient id="lotusKitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
          <linearGradient id="lotusGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="lotusGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#A855F7" floodOpacity="0.4" />
          </filter>
        </defs>
        <circle cx="16" cy="16" r="14" fill="url(#lotusKitGrad)" filter="url(#lotusGlow)" />
        <ellipse cx="16" cy="8" rx="8" ry="4" fill="url(#lotusGloss)" opacity="0.45" />
        <g transform="translate(4, 4)">
          <path d="M12 3 C10 9 7 14 7 18 C7 20 9 21 12 21 C15 21 17 20 17 18 C17 14 14 9 12 3 Z" fill="#FFFFFF" opacity="0.95" />
          <path d="M12 10 C8 11.5 4 14.5 4 18.5 C4 20.5 6 21.2 9 21.2 C10.5 21.2 12 20.8 12 20.8 Z" fill="#FFFFFF" opacity="0.8" />
          <path d="M12 10 C16 11.5 20 14.5 20 18.5 C20 20.5 18 21.2 15 21.2 C13.5 21.2 12 20.8 12 20.8 Z" fill="#FFFFFF" opacity="0.8" />
          <circle cx="12" cy="18" r="1.8" fill="#FEF08A" />
        </g>
        <circle cx="22" cy="9" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}

// 3D Floating Music Wave Note
export function ThreeDMusic({ size = 38, className = '' }) {
  return (
    <div className={`three-d-badge music-3d ya-icon-badge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" className="three-d-svg">
        <defs>
          <linearGradient id="musicKitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="musicGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="musicGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#818CF8" floodOpacity="0.4" />
          </filter>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#musicKitGrad)" filter="url(#musicGlow)" />
        <path d="M4 4 H28 V13 Q16 16 4 13 Z" fill="url(#musicGloss)" rx="8" opacity="0.35" />
        <g transform="translate(4, 4)">
          <path
            d={KIT_PATHS.music}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="6" cy="18" r="3" fill="#FFFFFF" />
          <circle cx="18" cy="16" r="3" fill="#FFFFFF" />
        </g>
        <circle cx="23" cy="8" r="1.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}


// ==========================================================================
// ULTRA-CRISP 3D VECTOR ICONS (Infinite Resolution, Retina & AMOLED Ready)
// ==========================================================================

export function Stat3DMusicNote({ size = 32, className = '' }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={className} fill="none">
      <defs>
        <radialGradient id="musicBallGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </radialGradient>
        <linearGradient id="musicStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <filter id="music3dDrop" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#6D28D9" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#music3dDrop)">
        <path d="M12 7 L28 4 V9 L12 12 Z" fill="url(#musicStemGrad)" />
        <rect x="12" y="7" width="3.5" height="17" rx="1.75" fill="url(#musicStemGrad)" />
        <rect x="24.5" y="4" width="3.5" height="17" rx="1.75" fill="url(#musicStemGrad)" />
        <ellipse cx="10" cy="24" rx="5.5" ry="4.2" transform="rotate(-20 10 24)" fill="url(#musicBallGrad)" />
        <ellipse cx="9" cy="22.5" rx="2.5" ry="1.4" transform="rotate(-20 9 22.5)" fill="#FFFFFF" opacity="0.75" />
        <ellipse cx="22.5" cy="21" rx="5.5" ry="4.2" transform="rotate(-20 22.5 21)" fill="url(#musicBallGrad)" />
        <ellipse cx="21.5" cy="19.5" rx="2.5" ry="1.4" transform="rotate(-20 21.5 19.5)" fill="#FFFFFF" opacity="0.75" />
      </g>
    </svg>
  );
}

export function Stat3DHeart({ size = 32, className = '' }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={className} fill="none">
      <defs>
        <radialGradient id="heartSphereGrad" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="40%" stopColor="#F43F5E" />
          <stop offset="85%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
        <linearGradient id="heartSheen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="heart3dDrop" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#BE123C" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#heart3dDrop)">
        <path
          d="M18 31 C18 31 4 21.5 4 11.5 C4 6.5 8 2.5 13 2.5 C15.8 2.5 17.5 4 18 5 C18.5 4 20.2 2.5 23 2.5 C28 2.5 32 6.5 32 11.5 C32 21.5 18 31 18 31 Z"
          fill="url(#heartSphereGrad)"
        />
        <path
          d="M7 11 C7 7.5 10 4.5 13.5 4.5 C14.8 4.5 16 5.2 17 6.2 C15 7.5 13.5 10.5 13 14 C9.5 13.8 7 12.8 7 11 Z"
          fill="url(#heartSheen)"
          opacity="0.65"
        />
        <circle cx="11" cy="7.5" r="1.8" fill="#FFFFFF" opacity="0.9" />
      </g>
    </svg>
  );
}

export function Stat3DClock({ size = 32, className = '' }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={className} fill="none">
      <defs>
        <radialGradient id="clockDialGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#EAB308" />
          <stop offset="85%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#854D0E" />
        </radialGradient>
        <radialGradient id="clockFaceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FEF9C3" />
        </radialGradient>
        <filter id="clock3dDrop" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#CA8A04" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#clock3dDrop)">
        <rect x="16" y="2" width="4" height="3" rx="1.5" fill="#CA8A04" />
        <circle cx="18" cy="19" r="14.5" fill="url(#clockDialGrad)" />
        <circle cx="18" cy="19" r="11" fill="url(#clockFaceGrad)" />
        <ellipse cx="18" cy="11" rx="7.5" ry="3" fill="#FFFFFF" opacity="0.5" />
        <line x1="18" y1="19" x2="18" y2="12" stroke="#854D0E" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="18" y1="19" x2="23" y2="19" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="19" r="1.8" fill="#CA8A04" />
        <circle cx="18" cy="19" r="0.7" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function Stat3DFlame({ size = 32, className = '' }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={className} fill="none">
      <defs>
        <radialGradient id="flameOuterGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="85%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
        <radialGradient id="flameInnerGrad" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <filter id="flame3dDrop" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#EA580C" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#flame3dDrop)">
        <path
          d="M18 2 C18 2 24 9 24 15 C24 17 23 18.5 22 19.5 C25 18 28 20.5 28 24 C28 28.5 23.5 33 18 33 C12.5 33 8 28.5 8 24 C8 17 14 10 18 2 Z"
          fill="url(#flameOuterGrad)"
        />
        <path
          d="M18 13 C18 13 22 17.5 22 21.5 C22 23 21 24.2 20 25 C21.5 24 23 25.5 23 27 C23 29.5 20.8 31.5 18 31.5 C15.2 31.5 13 29.5 13 27 C13 22 16.5 18 18 13 Z"
          fill="url(#flameInnerGrad)"
        />
        <path
          d="M12 21 C11.5 18 13.5 14 15.5 11 C14.5 14 13.8 17.5 14.5 21 Z"
          fill="#FFFFFF"
          opacity="0.65"
        />
      </g>
    </svg>
  );
}
