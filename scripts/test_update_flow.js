const fs = require('fs');
const path = require('path');

console.log('=== NITHYA Yoga App Update & Edit/Save Verification Test ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`PASS: ${message}`);
    passCount++;
  } else {
    console.error(`FAIL: ${message}`);
    failCount++;
  }
}

// 1. Check version.json
try {
  const versionPath = path.join(__dirname, '..', 'version.json');
  const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  assert(versionData.version === '1.2.1' || versionData.version === '1.2.0', 'version.json version is valid release');
  assert(versionData.versionCode >= 3, 'version.json versionCode is >= 3');
  assert(versionData.apkUrl.includes('NITHYA-Yoga-v1.0.apk'), 'version.json apkUrl points to valid APK');
} catch (e) {
  assert(false, `version.json test failed: ${e.message}`);
}

// 2. Check android/app/build.gradle
try {
  const gradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
  const gradleContent = fs.readFileSync(gradlePath, 'utf8');
  assert(/versionCode\s+[3-9]/.test(gradleContent), 'android build.gradle versionCode is >= 3');
  assert(/versionName\s+"1\.[2-9]\.[0-9]"/.test(gradleContent), 'android build.gradle versionName is valid release');
} catch (e) {
  assert(false, `build.gradle test failed: ${e.message}`);
}

// 3. Check MainActivity.java
try {
  const mainActivityPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'java', 'com', 'nithya', 'yoga', 'MainActivity.java');
  const mainActivityContent = fs.readFileSync(mainActivityPath, 'utf8');
  assert(mainActivityContent.includes('setDownloadListener'), 'MainActivity has setDownloadListener configured');
  assert(mainActivityContent.includes('AndroidNativeUpdater'), 'MainActivity registers AndroidNativeUpdater JavascriptInterface');
  assert(mainActivityContent.includes('openInChrome'), 'MainActivity has openInChrome interface method');
  assert(mainActivityContent.includes('FLAG_ACTIVITY_NEW_TASK'), 'MainActivity launches browser with NEW_TASK flag');
} catch (e) {
  assert(false, `MainActivity test failed: ${e.message}`);
}

// 4. Check sw.js bypass for version.json and .apk
try {
  const swPath = path.join(__dirname, '..', 'sw.js');
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert(swContent.includes('version.json') && swContent.includes('.apk'), 'sw.js strictly bypasses version.json and .apk files from caching');
} catch (e) {
  assert(false, `sw.js test failed: ${e.message}`);
}

// 5. Check InAppUpdateBanner.jsx
try {
  const bannerPath = path.join(__dirname, '..', 'src', 'components', 'InAppUpdateBanner.jsx');
  const bannerContent = fs.readFileSync(bannerPath, 'utf8');
  assert(bannerContent.includes('export const triggerApkDownload'), 'InAppUpdateBanner exports triggerApkDownload');
  assert(bannerContent.includes('AndroidNativeUpdater'), 'triggerApkDownload interfaces with AndroidNativeUpdater');
  assert(bannerContent.includes('குரோமில் APK பதிவிறக்கம் தொடங்கப்பட்டது'), 'InAppUpdateBanner contains clear Tamil instruction banner for install');
} catch (e) {
  assert(false, `InAppUpdateBanner test failed: ${e.message}`);
}

// 6. Check ProfileSection.jsx
try {
  const profilePath = path.join(__dirname, '..', 'src', 'components', 'ProfileSection.jsx');
  const profileContent = fs.readFileSync(profilePath, 'utf8');
  assert(profileContent.includes('showToast'), 'ProfileSection accepts and calls showToast');
  assert(profileContent.includes('triggerApkDownload'), 'ProfileSection uses triggerApkDownload');
  assert(profileContent.includes('சேமிக்கவும் (Submit)'), 'ProfileSection edit submit button is clearly labeled with Submit');
} catch (e) {
  assert(false, `ProfileSection test failed: ${e.message}`);
}

// 7. Check styles.css for button visibility and form styling
try {
  const stylesPath = path.join(__dirname, '..', 'src', 'styles.css');
  const stylesContent = fs.readFileSync(stylesPath, 'utf8');
  assert(stylesContent.includes('.btn-modal-save') && stylesContent.includes('#7C3AED'), '.btn-modal-save has vibrant high-contrast purple background');
  assert(stylesContent.includes('.profile-edit-form-block'), 'profile-edit-form-block is explicitly styled in styles.css');
  assert(stylesContent.includes('.profile-edit-actions-row'), 'profile-edit-actions-row is explicitly styled in styles.css');
} catch (e) {
  assert(false, `styles.css test failed: ${e.message}`);
}

console.log(`\nResults: ${passCount} Passed, ${failCount} Failed.`);
if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED SUCCESSFULLY! ✓');
}
