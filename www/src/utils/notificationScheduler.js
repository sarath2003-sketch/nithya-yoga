import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = 'nithya_yoga_reminders';
const CHANNEL_NAME = 'NITHYA Yoga Reminders';

// Hash string id (e.g. 'rem-1') to a 32-bit positive integer safe for Android Notification IDs
export function getNotificationId(reminderId) {
  if (!reminderId) return 1001;
  if (typeof reminderId === 'number') return Math.abs(reminderId) % 2147483647;
  let hash = 0;
  for (let i = 0; i < reminderId.length; i++) {
    hash = ((hash << 5) - hash) + reminderId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2147483640 + 1;
}

// Parse reminder time string ("06:00 PM", "6:00 AM", "18:00") into { hours, minutes }
export function parseTimeString(timeStr, rawTime) {
  if (rawTime && rawTime.includes(':')) {
    const parts = rawTime.trim().split(':');
    return {
      hours: parseInt(parts[0], 10) || 0,
      minutes: parseInt(parts[1], 10) || 0
    };
  }

  if (!timeStr) return { hours: 8, minutes: 0 };

  const str = timeStr.trim();
  if (str.toUpperCase().includes('AM') || str.toUpperCase().includes('PM')) {
    const parts = str.split(/\s+/);
    const [hStr, mStr] = (parts[0] || '08:00').split(':');
    let h = parseInt(hStr, 10) || 0;
    const m = parseInt(mStr || '0', 10) || 0;
    const isPM = (parts[1] || '').toUpperCase() === 'PM';
    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return { hours: h, minutes: m };
  }

  const [hStr, mStr] = str.split(':');
  return {
    hours: parseInt(hStr, 10) || 0,
    minutes: parseInt(mStr, 10) || 0
  };
}

// Calculate the next Date object when the reminder should trigger
export function calculateNextTriggerDate(hours, minutes, specificDateStr = null) {
  const now = new Date();
  const target = new Date();

  if (specificDateStr) {
    const [y, m, d] = specificDateStr.split('-').map(Number);
    if (y && m && d) {
      target.setFullYear(y, m - 1, d);
    }
  }

  target.setHours(hours, minutes, 0, 0);

  // If target time has already passed today and no specific future date is given, schedule for tomorrow
  if (!specificDateStr && target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target;
}

/**
 * Initialize native Android notification channel and request permissions
 */
export async function initNotificationSystem() {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      // 1. Create High-Priority Android Notification Channel (shows on lock screen, sound, vibration)
      await LocalNotifications.createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        description: 'Daily yoga practice & mindful habit alerts',
        importance: 5, // IMPORTANCE_HIGH (banner + heads-up + sound)
        visibility: 1, // VISIBILITY_PUBLIC (shows on lock screen)
        sound: 'beep.wav',
        vibration: true,
        lights: true,
        lightColor: '#7c3aed'
      });

      // 2. Request native permissions (Android 13+ POST_NOTIFICATIONS & SCHEDULE_EXACT_ALARM)
      const permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        await LocalNotifications.requestPermissions();
      }

      // 3. Register tap listener: when user taps notification outside app
      LocalNotifications.removeAllListeners();
      LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
        console.log('[Notification] Action performed outside app:', notificationAction);
        try {
          if (typeof window !== 'undefined') {
            window.focus();
          }
        } catch (_) {}
      });
    } catch (err) {
      console.warn('[Notification] Native init error:', err);
    }
  } else {
    // Web / PWA browser environment
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    } catch (_) {}
  }
}

/**
 * Request notification permissions explicitly with user prompt
 */
export async function requestSystemNotificationPermission() {
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await LocalNotifications.requestPermissions();
      return res.display === 'granted';
    } catch (e) {
      console.warn('[Notification] requestPermissions native error:', e);
      return false;
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const res = await Notification.requestPermission();
      return res === 'granted';
    } catch (e) {
      return false;
    }
  }

  return false;
}

/**
 * Synchronize all enabled reminders with native Android AlarmManager / LocalNotifications
 * This ensures notifications trigger in the system status bar and lock screen even when
 * the app is completely closed or screen is turned off!
 */
export async function syncAllRemindersWithSystem(reminders, lang = 'en') {
  if (!reminders || !Array.isArray(reminders)) return;

  const isNative = Capacitor.isNativePlatform();
  if (!isNative) {
    // Web / PWA: Sync enabled reminders with backend /api/reminders for persistent server storage
    try {
      const enabledReminders = reminders.filter(r => r.enabled !== false && !r.completed);
      for (const r of enabledReminders.slice(0, 5)) {
        fetch('./api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: r.title,
            time: r.time,
            repeat: r.repeat || 'Daily',
            sound: r.sound || 'Soft Bell'
          })
        }).catch(() => {});
      }
    } catch (_) {}
    return;
  }

  try {
    // 1. Get currently pending notifications to cancel obsolete ones
    const pending = await LocalNotifications.getPending();
    const activeEnabledIds = new Set(
      reminders
        .filter(r => r.enabled !== false && !r.completed)
        .map(r => getNotificationId(r.id))
    );

    const toCancel = (pending.notifications || [])
      .filter(p => !activeEnabledIds.has(p.id))
      .map(p => ({ id: p.id }));

    if (toCancel.length > 0) {
      await LocalNotifications.cancel({ notifications: toCancel });
    }

    // 2. Schedule each enabled reminder with native exact alarm
    const notificationsToSchedule = [];

    for (const r of reminders) {
      if (r.enabled === false || r.completed) continue;

      const notifId = getNotificationId(r.id);
      const { hours, minutes } = parseTimeString(r.time, r.rawTime);
      const targetDate = calculateNextTriggerDate(
        hours, 
        minutes, 
        r.repeat === 'Once' ? r.date : null
      );

      // Skip expired one-time reminders
      if (r.repeat === 'Once' && targetDate.getTime() <= Date.now()) {
        continue;
      }

      const title = lang === 'ta'
        ? `🧘‍♀️ NITHYA யோகா: ${r.titleTa || r.title}`
        : `🧘‍♀️ NITHYA Yoga: ${r.title}`;

      const body = lang === 'ta'
        ? (r.messageTa || r.message || 'நினைவூட்டல் நேரம்! உங்கள் யோகா மற்றும் ஆரோக்கியத்தைக் கவனியுங்கள் 💜')
        : (r.message || 'Time for your healthy yoga habit! 💜');

      // Schedule configuration based on repeat setting
      const scheduleConfig = {
        at: targetDate,
        allowWhileIdle: true // Wakes up device in Android Doze mode
      };

      if (r.repeat === 'Daily') {
        scheduleConfig.repeats = true;
        scheduleConfig.every = 'day';
      } else if (r.repeat === 'Weekly') {
        scheduleConfig.repeats = true;
        scheduleConfig.every = 'week';
      }

      notificationsToSchedule.push({
        id: notifId,
        title,
        body,
        channelId: CHANNEL_ID,
        smallIcon: 'ic_launcher',
        iconColor: '#7c3aed',
        sound: 'beep.wav',
        extra: {
          reminderId: r.id,
          title: r.title,
          category: r.category
        },
        schedule: scheduleConfig
      });
    }

    if (notificationsToSchedule.length > 0) {
      await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      console.log(`[Notification] Successfully scheduled ${notificationsToSchedule.length} native alarms with Android OS.`);
    }
  } catch (err) {
    console.warn('[Notification] Failed to sync reminders with Android OS:', err);
  }
}

/**
 * Trigger an immediate native or system status bar notification
 * Useful when an alarm rings, so it pops up in the Android notification tray immediately
 */
export async function triggerImmediateSystemNotification(reminder, lang = 'en') {
  if (!reminder) return;

  const notifId = (Date.now() + Math.floor(Math.random() * 1000)) % 2147483640 + 1;
  const title = lang === 'ta'
    ? `🔔 NITHYA யோகா: ${reminder.titleTa || reminder.title}`
    : `🔔 NITHYA Yoga: ${reminder.title}`;

  const body = lang === 'ta'
    ? (reminder.messageTa || reminder.message || 'நினைவூட்டல் நேரம்! 💜')
    : (reminder.message || 'Time for your healthy habit! 💜');

  // Direct Android Native JavascriptInterface Trigger (Heads-up Status Bar Popup)
  if (typeof window !== 'undefined' && window.AndroidNativeUpdater && typeof window.AndroidNativeUpdater.showNativePopupNotification === 'function') {
    try {
      window.AndroidNativeUpdater.showNativePopupNotification(title, body);
    } catch (_) {}
  }

  if (Capacitor.isNativePlatform()) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            title,
            body,
            channelId: CHANNEL_ID,
            smallIcon: 'ic_launcher',
            iconColor: '#7c3aed',
            sound: 'beep.wav',
            schedule: {
              at: new Date(Date.now() + 200),
              allowWhileIdle: true
            },
            extra: {
              reminderId: reminder.id
            }
          }
        ]
      });
      return;
    } catch (e) {
      console.warn('[Notification] Native immediate schedule error:', e);
    }
  }

  // Web fallback with ServiceWorker or Notification API
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body,
          icon: 'assets/images/logo.png',
          badge: 'assets/images/logo.png',
          vibrate: [300, 150, 300],
          tag: `rem-${reminder.id}-${Date.now()}`,
          renotify: true
        });
      }).catch(() => {
        try {
          new Notification(title, { body, icon: 'assets/images/logo.png' });
        } catch (_) {}
      });
    } else {
      try {
        new Notification(title, { body, icon: 'assets/images/logo.png' });
      } catch (_) {}
    }
  }
}
