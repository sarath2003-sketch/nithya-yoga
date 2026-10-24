/**
 * Authoritative Application Version Management for NITHYA Yoga & Wellness
 * 
 * Maintains a single source of truth for versioning, robust semantic comparison,
 * and state-aware update checking (idle, checking, available, current, error).
 */

export const APP_VERSION = '1.5.0';
export const APP_BUILD_NUMBER = 9;

/**
 * Compare two semantic version strings (e.g. "1.2.1" vs "1.2.0")
 * Returns:
 *   1 if v1 > v2
 *  -1 if v1 < v2
 *   0 if v1 === v2
 */
export function compareVersions(v1, v2) {
  if (!v1 || !v2) return 0;
  const p1 = String(v1).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const p2 = String(v2).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(p1.length, p2.length);

  for (let i = 0; i < len; i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

/**
 * Check remote version against currently installed/bundled version.
 * Prevents unnecessary reloads and returns clear status.
 */
export async function checkRemoteAppVersion() {
  try {
    let data = null;

    // 1. Fetch current domain version.json with cache bust
    try {
      const res = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) data = await res.json();
    } catch (_) {}

    // 2. Fallback to production GitHub Pages version.json
    if (!data) {
      const res = await fetch(`https://sarath2003-sketch.github.io/nithya-yoga/version.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) data = await res.json();
    }

    if (!data) {
      return {
        status: 'error',
        error: 'Unable to reach update server.',
        currentVersion: APP_VERSION,
        currentBuild: APP_BUILD_NUMBER
      };
    }

    const remoteVer = data.version || APP_VERSION;
    const remoteBuild = parseInt(data.versionCode || APP_BUILD_NUMBER, 10);

    const storedVer = localStorage.getItem('nithya_installed_version') || APP_VERSION;
    const storedBuild = parseInt(localStorage.getItem('nithya_installed_build') || APP_BUILD_NUMBER.toString(), 10);

    // Is there a genuinely newer version deployed?
    // We compare remote build vs both bundled build and stored build
    const isBuildNewer = remoteBuild > Math.max(APP_BUILD_NUMBER, storedBuild);
    const isVersionNewer = compareVersions(remoteVer, APP_VERSION) > 0 && remoteBuild >= APP_BUILD_NUMBER;

    const isUpdateAvailable = isBuildNewer || isVersionNewer;

    if (isUpdateAvailable) {
      return {
        status: 'available',
        isUpdateAvailable: true,
        remoteVersion: remoteVer,
        remoteBuild,
        currentVersion: APP_VERSION,
        currentBuild: APP_BUILD_NUMBER,
        title: data.title || 'New Update Available',
        titleTa: data.titleTa || 'புதிய அப்டேட் கிடைக்கிறது',
        notes: data.notes || '',
        notesTa: data.notesTa || '',
        apkUrl: data.apkUrl || 'https://sarath2003-sketch.github.io/nithya-yoga/NITHYA-Yoga-v1.0.apk'
      };
    }

    // Installed version is current
    // Ensure localStorage is aligned with current version
    localStorage.setItem('nithya_installed_version', APP_VERSION);
    localStorage.setItem('nithya_installed_build', APP_BUILD_NUMBER.toString());

    return {
      status: 'current',
      isUpdateAvailable: false,
      remoteVersion: remoteVer,
      remoteBuild,
      currentVersion: APP_VERSION,
      currentBuild: APP_BUILD_NUMBER
    };
  } catch (err) {
    return {
      status: 'error',
      error: err.message || 'Check failed',
      currentVersion: APP_VERSION,
      currentBuild: APP_BUILD_NUMBER
    };
  }
}

/**
 * Safely applies an application update:
 * 1. Purges cache storage
 * 2. Unregisters service workers
 * 3. Updates stored version to match remote
 * 4. Sets pending update guard in sessionStorage so index.html reload doesn't loop
 * 5. Safely reloads the application
 */
export async function applyAppUpdate(remoteVersion = APP_VERSION, remoteBuild = APP_BUILD_NUMBER) {
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
    localStorage.setItem('nithya_installed_version', remoteVersion);
    localStorage.setItem('nithya_installed_build', remoteBuild.toString());
    sessionStorage.setItem('nithya_pending_update', '1');
  } catch (e) {
    console.warn('Update cleanup warning:', e);
  }

  // Reload page
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      if (window.AndroidNativeUpdater && typeof window.AndroidNativeUpdater.reloadAppFresh === 'function') {
        window.AndroidNativeUpdater.reloadAppFresh();
        return;
      }
      const isCapacitorOrLocal = 
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'capacitor:' ||
        window.location.protocol === 'file:';
      if (isCapacitorOrLocal) {
        window.location.reload();
      } else {
        window.location.replace(`${window.location.origin}${window.location.pathname}?updated=${Date.now()}`);
      }
    }
  }, 400);
}
