import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { ThreeDLotus } from './ThreeDIcons';

export const CURRENT_APP_VERSION = '1.1.0';
export const CURRENT_BUILD_NUMBER = 2;

export default function InAppUpdateBanner({ lang = 'en', onDismiss }) {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkRemoteUpdate();
  }, []);

  const checkRemoteUpdate = async () => {
    try {
      const res = await fetch(`https://sarath2003-sketch.github.io/nithya-yoga/version.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        const remoteVer = data.version || '1.1.0';
        const remoteBuild = data.versionCode || 2;
        const localVersion = localStorage.getItem('nithya_installed_version') || CURRENT_APP_VERSION;
        const localBuild = parseInt(localStorage.getItem('nithya_installed_build') || CURRENT_BUILD_NUMBER.toString(), 10);
        
        // Show update modal only if remote build is strictly greater than local build OR remote version is higher
        const isNewer = (remoteBuild > localBuild) || (remoteVer !== localVersion && remoteBuild > CURRENT_BUILD_NUMBER);
        
        if (isNewer) {
          setUpdateInfo(data);
        } else {
          setUpdateInfo(null);
        }
      }
    } catch (err) {
      console.warn('Could not check remote version:', err);
    }
  };

  const handleUpdateNow = async () => {
    setIsUpdating(true);

    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }

      if (updateInfo?.version) {
        localStorage.setItem('nithya_installed_version', updateInfo.version);
      }

      setUpdateDone(true);

      setTimeout(() => {
        window.location.replace(`https://sarath2003-sketch.github.io/nithya-yoga/?live_sync=${Date.now()}`);
      }, 700);
    } catch (err) {
      console.error('Update error:', err);
      window.location.replace(`https://sarath2003-sketch.github.io/nithya-yoga/?live_sync=${Date.now()}`);
    }
  };

  if (!updateInfo || dismissed) return null;

  return (
    <div className="update-modal-backdrop-scrim ya-reveal" onClick={() => setDismissed(true)}>
      <div className="update-modal-centered-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Floating Badge & Close Button */}
        <div className="update-modal-top-bar">
          <div className="update-badge-pill">
            <Sparkles size={14} className="badge-sparkle-icon" />
            <span>{lang === 'ta' ? 'புதிய பதிப்பு v' + updateInfo.version : 'NEW UPDATE v' + updateInfo.version}</span>
          </div>

          <button
            type="button"
            className="update-close-round-btn"
            onClick={() => {
              setDismissed(true);
              if (onDismiss) onDismiss();
            }}
            title={lang === 'ta' ? 'மூடு' : 'Close'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Lotus Icon Cluster */}
        <div className="update-hero-icon-container">
          <div className="update-lotus-glow-circle">
            <ThreeDLotus size={52} />
          </div>
        </div>

        {/* Modal Titles */}
        <div className="update-text-content">
          <h2 className="update-modal-heading">
            {lang === 'ta' ? 'நித்யா யோகா புதிய அப்டேட்!' : 'NITHYA Yoga New Update!'}
          </h2>
          <p className="update-modal-subtitle">
            {lang === 'ta' 
              ? 'உங்கள் பயன்பாட்டை மேலும் சிறப்பாக்க புதிய மேம்பாடுகள் தயாராக உள்ளன.' 
              : 'Exciting enhancements and performance fixes are ready for you.'}
          </p>
        </div>

        {/* Highlights List Box */}
        <div className="update-highlights-box">
          <div className="update-feature-item">
            <span className="feature-item-icon">🔕</span>
            <div className="feature-item-text">
              <strong>{lang === 'ta' ? 'அலாரம் சத்தம் மட்டும்' : 'Silenced Click Sounds'}</strong>
              <p>{lang === 'ta' ? 'தேவையற்ற பட்டன் சத்தங்கள் நீக்கப்பட்டு, அலாரத்தின்போது மட்டுமே ஒலிக்கும்.' : 'Unwanted button sounds silenced. Chimes only when real alarms fire.'}</p>
            </div>
          </div>

          <div className="update-feature-item">
            <span className="feature-item-icon">🧘‍♀️</span>
            <div className="feature-item-text">
              <strong>{lang === 'ta' ? 'மாணவர் நேரலை இணைப்பு' : 'Instant Student Live Class'}</strong>
              <p>{lang === 'ta' ? 'நண்பர்கள் லிங்க் கிளிக் செய்து பெயர், மொபைல் என்டர் செய்து நேரடியாக இணையலாம்.' : 'Friends join directly via link by entering name & mobile number.'}</p>
            </div>
          </div>

          <div className="update-feature-item">
            <span className="feature-item-icon">⚡</span>
            <div className="feature-item-text">
              <strong>{lang === 'ta' ? 'நேரலை தானியங்கி அப்டேட்' : 'Instant OTA Live Updates'}</strong>
              <p>{lang === 'ta' ? '404 பிழைகள் இன்றி ஆப் உள்ளேயே நேரடியாக அப்டேட் ஆகும்.' : 'Seamless in-app refresh with zero 404 errors.'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="update-actions-footer">
          <button
            type="button"
            className="update-btn-primary"
            onClick={handleUpdateNow}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>{lang === 'ta' ? 'அப்டேட் செய்யப்படுகிறது...' : 'Updating in-place...'}</span>
              </>
            ) : updateDone ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-300" />
                <span>{lang === 'ta' ? 'அப்டேட் முடிந்தது! ✓' : 'Updated Successfully! ✓'}</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>{lang === 'ta' ? 'இப்போதே அப்டேட் செய் (Update Now)' : 'Update Now (Live Sync)'}</span>
              </>
            )}
          </button>

          <div className="update-secondary-row">
            <a
              href="https://sarath2003-sketch.github.io/nithya-yoga/NITHYA-Yoga-v1.0.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="update-btn-apk-download"
              download="NITHYA-Yoga-v1.0.apk"
            >
              <Download size={13} />
              <span>{lang === 'ta' ? 'APK டவுன்லோட்' : 'Download APK'}</span>
            </a>

            <button
              type="button"
              className="update-btn-dismiss"
              onClick={() => {
                setDismissed(true);
                if (onDismiss) onDismiss();
              }}
            >
              {lang === 'ta' ? 'பிறகு' : 'Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
