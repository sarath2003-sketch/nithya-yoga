const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('======================================================================');
console.log('🧘 Verifying Live Deep Link, App Launch & Update Glitch Fixes');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`PASS: ${description}`);
    passed++;
  } catch (err) {
    console.error(`FAIL: ${description}`);
    console.error(`  -> ${err.message}`);
    failed++;
  }
}

const rootDir = path.resolve(__dirname, '..');
const versionManagerPath = path.join(rootDir, 'src', 'utils', 'versionManager.js');
const inAppUpdateBannerPath = path.join(rootDir, 'src', 'components', 'InAppUpdateBanner.jsx');
const studentJoinModalPath = path.join(rootDir, 'src', 'components', 'StudentJoinModal.jsx');
const appPath = path.join(rootDir, 'src', 'App.jsx');
const liveRoomPath = path.join(rootDir, 'src', 'components', 'LiveYogaClassRoom.jsx');
const mainActivityPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'java', 'com', 'nithya', 'yoga', 'MainActivity.java');
const manifestPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const assetLinksPath = path.join(rootDir, '.well-known', 'assetlinks.json');
const versionJsonPath = path.join(rootDir, 'version.json');

const versionManagerSrc = fs.readFileSync(versionManagerPath, 'utf8');
const inAppUpdateBannerSrc = fs.readFileSync(inAppUpdateBannerPath, 'utf8');
const studentJoinModalSrc = fs.readFileSync(studentJoinModalPath, 'utf8');
const appSrc = fs.readFileSync(appPath, 'utf8');
const liveRoomSrc = fs.readFileSync(liveRoomPath, 'utf8');
const mainActivitySrc = fs.readFileSync(mainActivityPath, 'utf8');
const manifestSrc = fs.readFileSync(manifestPath, 'utf8');
const assetLinksSrc = fs.readFileSync(assetLinksPath, 'utf8');
const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));

// 1. Version Manager Alignment
test('versionManager APP_VERSION matches version.json version 1.6.0', () => {
  assert.ok(versionManagerSrc.includes("APP_VERSION = '1.6.0'"), 'Expected APP_VERSION 1.6.0');
  assert.strictEqual(versionJson.version, '1.6.0');
});

test('versionManager APP_BUILD_NUMBER matches version.json versionCode 10', () => {
  assert.ok(versionManagerSrc.includes("APP_BUILD_NUMBER = 10"), 'Expected APP_BUILD_NUMBER 10');
  assert.strictEqual(versionJson.versionCode, 10);
});

test('versionManager applyAppUpdate preserves live class URL search parameters', () => {
  assert.ok(versionManagerSrc.includes('currentSearch'), 'Expected search parameter retention');
  assert.ok(versionManagerSrc.includes('searchWithoutUpdated'), 'Expected updated query cleanup');
});

// 2. InAppUpdateBanner Fixes
test('InAppUpdateBanner strictly suppresses APK update modal for web browser users', () => {
  assert.ok(inAppUpdateBannerSrc.includes('isNativeApp'), 'Expected isNativeApp check');
  assert.ok(inAppUpdateBannerSrc.includes('if (!isNativeApp)'), 'Expected early return when not running native app');
});

test('InAppUpdateBanner suppresses update prompt when arriving via Live Class link', () => {
  assert.ok(inAppUpdateBannerSrc.includes("search.includes('live=')"), 'Expected live= suppression check');
  assert.ok(inAppUpdateBannerSrc.includes("search.includes('join=student')"), 'Expected join=student suppression check');
});

test('InAppUpdateBanner persists dismiss in sessionStorage to prevent loop', () => {
  assert.ok(inAppUpdateBannerSrc.includes("sessionStorage.setItem('nithya_update_dismissed'"), 'Expected dismissal persistence');
  assert.ok(inAppUpdateBannerSrc.includes("sessionStorage.getItem('nithya_update_dismissed')"), 'Expected dismissal check on mount');
});

// 3. StudentJoinModal Fixes
test('StudentJoinModal defines handleJoinConfirmed preventing undefined function crash', () => {
  assert.ok(studentJoinModalSrc.includes('const handleJoinConfirmed = () =>'), 'Expected handleJoinConfirmed definition');
});

test('StudentJoinModal includes Open in App and Download APK options', () => {
  assert.ok(studentJoinModalSrc.includes('handleLaunchApp'), 'Expected handleLaunchApp');
  assert.ok(studentJoinModalSrc.includes('nithyayoga://live'), 'Expected custom scheme trigger');
  assert.ok(studentJoinModalSrc.includes('intent://sarath2003-sketch.github.io'), 'Expected Android intent trigger');
});

// 4. App.jsx Deep Link & Tab Routing
test('App.jsx initializes currentTab to live immediately when ?live= or ?room= is present', () => {
  assert.ok(appSrc.includes("params.get('live') || params.get('room')"), 'Expected live param detection in initial state');
  assert.ok(appSrc.includes("return 'live'"), 'Expected initial tab to be live');
});

test('App.jsx implements processDeepLinkUrl handling custom scheme and http URLs', () => {
  assert.ok(appSrc.includes('processDeepLinkUrl'), 'Expected processDeepLinkUrl function');
  assert.ok(appSrc.includes("rawUrl.startsWith('nithyayoga://')"), 'Expected nithyayoga custom scheme parsing');
});

test('App.jsx registers Android native cold start and warm start listeners', () => {
  assert.ok(appSrc.includes('AndroidNativeUpdater.getInitialDeepLink'), 'Expected getInitialDeepLink call');
  assert.ok(appSrc.includes('window.__handleDeepLink'), 'Expected window.__handleDeepLink global hook');
});

// 5. LiveYogaClassRoom Smart Handoff & WhatsApp Share
test('LiveYogaClassRoom WhatsApp share message includes both Web link and Direct App scheme', () => {
  assert.ok(liveRoomSrc.includes('appLaunchScheme'), 'Expected appLaunchScheme in WhatsApp text');
  assert.ok(liveRoomSrc.includes('nithyayoga://live'), 'Expected nithyayoga scheme in share message');
});

test('LiveYogaClassRoom includes Smart App Handoff banner for mobile web browsers', () => {
  assert.ok(liveRoomSrc.includes('mobile-web-app-handoff-banner'), 'Expected mobile-web-app-handoff-banner element');
  assert.ok(liveRoomSrc.includes('handleLaunchNativeApp'), 'Expected handleLaunchNativeApp handler');
});

// 6. Native Android Deep Link & Manifest
test('MainActivity.java captures cold start intent in pendingDeepLinkUrl', () => {
  assert.ok(mainActivitySrc.includes('pendingDeepLinkUrl'), 'Expected pendingDeepLinkUrl field');
  assert.ok(mainActivitySrc.includes('getInitialDeepLink'), 'Expected getInitialDeepLink JavascriptInterface');
});

test('MainActivity.java overrides onNewIntent for warm start deep links', () => {
  assert.ok(mainActivitySrc.includes('protected void onNewIntent(Intent intent)'), 'Expected onNewIntent override');
  assert.ok(mainActivitySrc.includes('window.__handleDeepLink'), 'Expected evaluateJavascript call');
});

test('AndroidManifest.xml declares HTTPS web deep link and nithyayoga custom scheme', () => {
  assert.ok(manifestSrc.includes('android:scheme="nithyayoga"'), 'Expected nithyayoga custom scheme');
  assert.ok(manifestSrc.includes('android:host="sarath2003-sketch.github.io"'), 'Expected host in intent filter');
  assert.ok(manifestSrc.includes('android:pathPrefix="/nithya-yoga"'), 'Expected pathPrefix in intent filter');
});

test('Digital Asset Links file is configured with com.nithya.yoga package and fingerprint', () => {
  const assetLinks = JSON.parse(assetLinksSrc);
  assert.strictEqual(assetLinks[0].target.package_name, 'com.nithya.yoga');
  assert.ok(assetLinks[0].target.sha256_cert_fingerprints[0].startsWith('3B:D4:27:1E'));
});

console.log('\n======================================================================');
console.log(`TOTAL: ${passed} Passed, ${failed} Failed`);
console.log('======================================================================');

if (failed > 0) {
  process.exit(1);
}
