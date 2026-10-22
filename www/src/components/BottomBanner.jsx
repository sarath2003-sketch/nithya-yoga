import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function BottomBanner({ onExplore, lang = 'en' }) {
  return (
    <div className="pastel-bottom-banner">
      <div className="bottom-banner-blob"></div>
      <div className="bottom-banner-left">
        <div className="bottom-banner-star-badge-3d">
          <img 
            src="assets/images/pastel/star_3d.png" 
            alt="3D Star" 
            className="bottom-banner-star-img-3d" 
          />
        </div>
        <div className="bottom-banner-text">
          <h3 className="bottom-banner-title">
            {lang === 'ta' ? 'புதிய யோகா & இசை வகுப்புகளைக் கண்டறியுங்கள்' : 'Discover New Music & Yoga Classes'}
          </h3>
          <p className="bottom-banner-sub">
            {lang === 'ta'
              ? 'உங்களுக்குப் பிடித்த யோகா மற்றும் பிராணாயாம அமர்வுகளை இப்போதே தொடங்குங்கள்.'
              : "Play sessions we think you'll love • Explore curated practices"}
          </p>
        </div>
      </div>

      <div className="bottom-banner-right">
        <button
          type="button"
          className="btn-bottom-banner-cta ya-ripple"
          onClick={onExplore}
        >
          <Compass size={16} />
          <span>{lang === 'ta' ? 'இப்போதே ஆராய்க' : 'Explore Now'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
