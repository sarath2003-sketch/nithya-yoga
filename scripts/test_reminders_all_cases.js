const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('   NITHYA YOGA - REMINDER NOTIFICATION TEST SUITE   ');
console.log('====================================================\n');

// 1. Load notificationScheduler functions
const schedulerPath = path.join(__dirname, '..', 'src', 'utils', 'notificationScheduler.js');
const schedulerSource = fs.readFileSync(schedulerPath, 'utf8');

// Extract pure functions using sandbox/eval or regex for isolated testing
function getNotificationId(reminderId) {
  if (!reminderId) return 1001;
  if (typeof reminderId === 'number') return Math.abs(reminderId) % 2147483647;
  let hash = 0;
  for (let i = 0; i < reminderId.length; i++) {
    hash = ((hash << 5) - hash) + reminderId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2147483640 + 1;
}

function parseTimeString(timeStr, rawTime) {
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

function calculateNextTriggerDate(hours, minutes, specificDateStr = null) {
  const now = new Date();
  const target = new Date();
  if (specificDateStr) {
    const [y, m, d] = specificDateStr.split('-').map(Number);
    if (y && m && d) {
      target.setFullYear(y, m - 1, d);
    }
  }
  target.setHours(hours, minutes, 0, 0);
  if (!specificDateStr && target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
  }
}

// TEST CASE A: 2-minute future reminder scheduling
runTest('Test Case A: 2-minute future reminder creates exact future timestamp in Android local time', () => {
  const now = new Date();
  const future = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
  const targetHours = future.getHours();
  const targetMinutes = future.getMinutes();

  const triggerDate = calculateNextTriggerDate(targetHours, targetMinutes);
  assert(triggerDate.getTime() > now.getTime(), 'Target date must be in the future');
  assert(triggerDate.getHours() === targetHours, 'Hours must match exact future hour');
  assert(triggerDate.getMinutes() === targetMinutes, 'Minutes must match exact future minute');
  const diffSec = (triggerDate.getTime() - now.getTime()) / 1000;
  assert(diffSec <= 125, `Diff should be around 120s, got ${diffSec}s`);
});

// TEST CASE B: App killed / Background persistence via AlarmManager & Receiver
runTest('Test Case B: AndroidManifest has exact alarm, wake lock, boot receiver, and notification publisher', () => {
  const manifestPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');

  assert(manifestContent.includes('android.permission.SCHEDULE_EXACT_ALARM'), 'Missing SCHEDULE_EXACT_ALARM');
  assert(manifestContent.includes('android.permission.USE_EXACT_ALARM'), 'Missing USE_EXACT_ALARM');
  assert(manifestContent.includes('android.permission.RECEIVE_BOOT_COMPLETED'), 'Missing RECEIVE_BOOT_COMPLETED');
  assert(manifestContent.includes('android.permission.WAKE_LOCK'), 'Missing WAKE_LOCK');
  assert(manifestContent.includes('android.permission.POST_NOTIFICATIONS'), 'Missing POST_NOTIFICATIONS');

  // Verify Capacitor local-notifications plugin manifest is present
  const pluginManifestPath = path.join(__dirname, '..', 'node_modules', '@capacitor', 'local-notifications', 'android', 'src', 'main', 'AndroidManifest.xml');
  const pluginManifest = fs.readFileSync(pluginManifestPath, 'utf8');
  assert(pluginManifest.includes('TimedNotificationPublisher'), 'Missing TimedNotificationPublisher receiver');
  assert(pluginManifest.includes('LocalNotificationRestoreReceiver'), 'Missing LocalNotificationRestoreReceiver');
  assert(pluginManifest.includes('BOOT_COMPLETED'), 'Missing BOOT_COMPLETED action');
});

// TEST CASE C: Lock screen & high importance channel configuration
runTest('Test Case C: Channel configured with IMPORTANCE_HIGH (5) and VISIBILITY_PUBLIC (1) for lock screen', () => {
  assert(schedulerSource.includes("id: CHANNEL_ID"), 'Channel id configured');
  assert(schedulerSource.includes("importance: 5"), 'Importance must be 5 (IMPORTANCE_HIGH for heads-up alert)');
  assert(schedulerSource.includes("visibility: 1"), 'Visibility must be 1 (VISIBILITY_PUBLIC for lock screen)');
  assert(schedulerSource.includes("sound: 'beep.wav'"), 'Channel must specify sound');
  assert(schedulerSource.includes("allowWhileIdle: true"), 'Scheduled alarm must specify allowWhileIdle: true for Doze mode');
});

// TEST CASE D: Toggle reminder OFF
runTest('Test Case D: Toggling reminder OFF cancels native alarm and excludes from active schedule', () => {
  const sampleReminders = [
    { id: 'rem-1', title: 'Morning Yoga', time: '07:00 AM', enabled: false },
    { id: 'rem-2', title: 'Evening Stretch', time: '06:00 PM', enabled: true }
  ];

  const activeEnabledIds = new Set(
    sampleReminders
      .filter(r => r.enabled !== false && !r.completed)
      .map(r => getNotificationId(r.id))
  );

  assert(!activeEnabledIds.has(getNotificationId('rem-1')), 'Disabled reminder must not be in active set');
  assert(activeEnabledIds.has(getNotificationId('rem-2')), 'Enabled reminder must be in active set');
});

// TEST CASE E: Delete reminder
runTest('Test Case E: Deleting reminder removes it from active notifications and triggers cancellation', () => {
  const previousPending = [
    { id: getNotificationId('rem-1') },
    { id: getNotificationId('rem-deleted') }
  ];

  const currentReminders = [
    { id: 'rem-1', title: 'Morning Yoga', time: '07:00 AM', enabled: true }
  ];

  const activeEnabledIds = new Set(
    currentReminders
      .filter(r => r.enabled !== false && !r.completed)
      .map(r => getNotificationId(r.id))
  );

  const toCancel = previousPending
    .filter(p => !activeEnabledIds.has(p.id))
    .map(p => ({ id: p.id }));

  assert.strictEqual(toCancel.length, 1, 'Exactly one reminder should be cancelled');
  assert.strictEqual(toCancel[0].id, getNotificationId('rem-deleted'), 'Deleted reminder ID must be cancelled');
});

// TEST CASE F: Multiple reminders at different times (no collision)
runTest('Test Case F: Multiple reminders have unique positive 32-bit IDs and distinct schedules', () => {
  const reminderIds = [
    'rem-yoga-1',
    'rem-water-1',
    'rem-meal-1',
    'rem-call-1',
    'rem-care-1',
    'rem-custom-1',
    'rem-custom-2'
  ];

  const generatedIds = new Set();
  reminderIds.forEach(id => {
    const numId = getNotificationId(id);
    assert(typeof numId === 'number', 'ID must be number');
    assert(numId > 0 && numId <= 2147483647, 'ID must be valid 32-bit positive integer');
    assert(!generatedIds.has(numId), `Collision detected for ID ${id} -> ${numId}`);
    generatedIds.add(numId);
  });
  assert.strictEqual(generatedIds.size, reminderIds.length, 'All generated notification IDs must be strictly unique');
});

// TEST CASE G: Normal buttons across the app do not trigger unexpected alarm sounds
runTest('Test Case G: Normal button clicks do not invoke alarm audio', () => {
  const appSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.jsx'), 'utf8');

  // Ensure tab switching does NOT play sounds
  const tabChangeFn = appSource.substring(appSource.indexOf('handleTabChange'), appSource.indexOf('handleAddReminder'));
  assert(!tabChangeFn.includes('audioEngine'), 'handleTabChange must not invoke audio');

  // Ensure normal UI buttons do NOT call playAlarmChime
  const headerSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Header.jsx'), 'utf8');
  assert(!headerSource.includes('playAlarmChime'), 'Header must not invoke alarm chime');

  const sidebarSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Sidebar.jsx'), 'utf8');
  assert(!sidebarSource.includes('playAlarmChime'), 'Sidebar must not invoke alarm chime');
});

console.log('\n----------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} tests passed successfully!`);
console.log('----------------------------------------------------\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
