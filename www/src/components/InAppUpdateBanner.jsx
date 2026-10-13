import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const CURRENT_APP_VERSION = '1.0.0';
export const CURRENT_BUILD_NUMBER = 1;

export default function InAppUpdateBanner({ lang = 'en', onDismiss }) {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check remote version from GitHub Pages
  useEffect(() => {
    checkRemoteUpdate();
  }, []);

  const checkRemoteUpdate = async () => {
    setIsChecking(true);
    try {
      // Bypass cache with timestamp
      const res = await fetch(`https://sarath2003-sketch.github.io/nithya-yoga/version.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        // Check if remote version is newer or if remote build is higher
        const remoteVer = data.version || '1.0.0';
        const remoteBuild = data.versionCode || 1;
        const localVersion = localStorage.getItem('nithya_installed_version') || CURRENT_APP_VERSION;
        
        if (remoteVer !== localVersion || remoteBuild > CURRENT_BUILD_NUMBER) {
          setUpdateInfo(data);
        }
      }
    } catch (err) {
      console.warn('Could not check remote version:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpdateNow = async () => {
    setIsUpdating(true);
    audioEngine.playTempleBell();

    try {
      // 1. Clear Service Worker caches for fresh web code
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // 2. Unregister service workers to force reload newest code
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }

      // 3. Mark version updated in localStorage
      if (updateInfo?.version) {
        localStorage.setItem('nithya_installed_version', updateInfo.version);
      }

      // 4. If running in Android APK, provide direct APK download link
      const isAndroidApp = typeof window !== 'undefined' && 
        (window.location.protocol === 'capacitor:' || window.location.hostname === 'localhost');

      if (isAndroidApp && updateInfo?.apkUrl) {
        window.open(updateInfo.apkUrl, '_system');
      }

      setTimeout(() => {
        window.location.reload(true);
      }, 800);
    } catch (err) {
      console.error('Update error:', err);
      window.location.reload(true);
    }
  };

  if (!updateInfo || dismissed) return null;

  return (
    <div className="in-app-update-floating-bar fixed top-3 left-1/2 -translate-x-1/2 z-[9999] w-[94%] max-w-lg shadow-2xl rounded-2xl p-3.5 bg-gradient-to-r from-violet-900/95 via-indigo-900/95 to-purple-900/95 border-2 border-violet-400/50 backdrop-blur-md text-white animate-bounce-subtle">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-500/30 border border-violet-300/40 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                {lang === 'ta' ? 'புதிய அப்டேட்!' : 'NEW UPDATE!'}
              </span>
              <span className="text-xs font-bold text-violet-200">
                v{updateInfo.version}
              </span>
            </div>
            <p className="text-xs font-semibold text-white mt-1 leading-snug">
              {lang === 'ta' ? (updateInfo.titleTa || updateInfo.notesTa) : (updateInfo.title || updateInfo.notes)}
            </p>
          </div>
        </div>

        <button 
          type="button" 
          onClick={() => {
            setDismissed(true);
            if (onDismiss) onDismiss();
          }}
          className="text-white/60 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-white/10">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-lg cursor-pointer"
        >
          {lang === 'ta' ? 'பிறகு' : 'Later'}
        </button>

        <button
          type="button"
          onClick={handleUpdateNow}
          disabled={isUpdating}
          className="text-xs font-black px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
        >
          {isUpdating ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>{lang === 'ta' ? 'அப்டேட் ஆகிறது...' : 'Updating...'}</span>
            </>
          ) : (
            <>
              <Download size={13} />
              <span>{lang === 'ta' ? 'அப்டேட் நவ் (Update Now)' : 'Update Now'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
