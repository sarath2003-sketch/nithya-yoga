import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { ThreeDLotus } from './ThreeDIcons';
import { APP_VERSION, APP_BUILD_NUMBER, checkRemoteAppVersion, applyAppUpdate } from '../utils/versionManager';

export const CURRENT_APP_VERSION = APP_VERSION;
export const CURRENT_BUILD_NUMBER = APP_BUILD_NUMBER;

export const triggerApkDownload = (url) => {
  const downloadTarget = url || 'https://sarath2003-sketch.github.io/nithya-yoga/NITHYA-Yoga-v1.0.apk';
  
  // 1. Direct Android Native Updater Bridge (instant Chrome activity intent via OS)
  if (typeof window !== 'undefined' && window.AndroidNativeUpdater) {
    try {
      if (typeof window.AndroidNativeUpdater.openInChrome === 'function') {
        window.AndroidNativeUpdater.openInChrome(downloadTarget);
        return true;
      }
    } catch (e) {
      console.warn('Native bridge openInChrome failed:', e);
    }
  }

  // 2. Capacitor / System Browser Intent
  try {
    if (typeof window !== 'undefined' && window.open) {
      window.open(downloadTarget, '_system');
    }
  } catch (_) {}

  // 3. DOM link click fallback
  try {
    const a = document.createElement('a');
    a.href = downloadTarget;
    a.download = 'NITHYA-Yoga-v1.0.apk';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) document.body.removeChild(a);
    }, 500);
  } catch (_) {
    window.location.href = downloadTarget;
  }
  return true;
};

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
      const res = await checkRemoteAppVersion();
      if (res && res.isUpdateAvailable) {
        setUpdateInfo(res);
      } else {
        setUpdateInfo(null);
      }
    } catch (err) {
      console.warn('Could not check remote version:', err);
    }
  };

  const handleUpdateNow = async () => {
    setIsUpdating(true);
    setUpdateDone(true);

    try {
      // Trigger instant APK download if native Android
      triggerApkDownload(updateInfo?.apkUrl);
      await applyAppUpdate(updateInfo?.remoteVersion, updateInfo?.remoteBuild);
    } catch (err) {
      console.error('Update error:', err);
      setTimeout(() => window.location.reload(), 900);
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 1500);
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
                <span>{lang === 'ta' ? 'பதிவிறக்கம் தொடங்கப்பட்டது! ✓' : 'Download Started in Chrome! ✓'}</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>{lang === 'ta' ? 'இப்போதே அப்டேட் செய் (Update Now)' : 'Update Now (Live Sync)'}</span>
              </>
            )}
          </button>

          {updateDone && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 font-semibold text-center my-1">
              {lang === 'ta' 
                ? '✓ குரோமில் APK பதிவிறக்கம் தொடங்கப்பட்டது. பதிவிறக்கம் முடிந்ததும் Notification-ஐ கிளிக் செய்து Install செய்யவும்.' 
                : '✓ APK download started in Chrome. Once finished, tap the notification to Install.'}
            </div>
          )}

          <div className="update-secondary-row">
            <button
              type="button"
              className="update-btn-apk-download cursor-pointer flex items-center gap-1.5"
              onClick={() => {
                setUpdateDone(true);
                triggerApkDownload(updateInfo?.apkUrl);
              }}
            >
              <Download size={13} />
              <span>{lang === 'ta' ? 'குரோமில் APK பதிவிறக்கு' : 'Download APK in Chrome'}</span>
            </button>

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
