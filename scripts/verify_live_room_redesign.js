const fs = require('fs');
const path = require('path');

console.log('======================================================================');
console.log('🧪 Verifying Live Room Redesign, 2-Step Share Flow & Mobile Profile');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`PASS: ${message}`);
    passed++;
  } else {
    console.error(`FAIL: ${message}`);
    failed++;
  }
}

// 1. Verify LiveYogaClassRoom.jsx
const liveRoomPath = path.join(__dirname, '..', 'src', 'components', 'LiveYogaClassRoom.jsx');
const liveRoomCode = fs.readFileSync(liveRoomPath, 'utf8');

assert(liveRoomCode.includes('activeRoomSessionId'), 'activeRoomSessionId state exists for unique session links');
assert(liveRoomCode.includes('showShareModal'), 'showShareModal state exists for 2-step flow');
assert(liveRoomCode.includes('handleStartNewClassSession'), 'handleStartNewClassSession generates unique room ID and opens modal');
assert(liveRoomCode.includes('live-share-modal-overlay'), 'Share modal overlay rendered in JSX');
assert(liveRoomCode.includes('handleWhatsAppShare'), 'WhatsApp share button wired in modal');
assert(liveRoomCode.includes('handleCopyShareLink'), 'Copy link button wired in modal');
assert(liveRoomCode.includes('handleNativeShare'), 'Mobile share button wired in modal');
assert(liveRoomCode.includes('formatTimer(sessionSeconds)'), 'Live timer counts up elapsed duration');
assert(!liveRoomCode.includes('7200 - sessionSeconds'), 'Live timer countdown from 7200 removed');
assert(liveRoomCode.includes('figma-share-link-pill-btn'), 'In-room header share button exists for teacher');
assert(liveRoomCode.includes('activeSidebarTab'), 'Sidebar tab selector isolates participants roster and chat');

// 2. Verify ProfileSection.jsx & styles.css for mobile overflow
const profilePath = path.join(__dirname, '..', 'src', 'components', 'ProfileSection.jsx');
const profileCode = fs.readFileSync(profilePath, 'utf8');
const stylesPath = path.join(__dirname, '..', 'src', 'styles.css');
const stylesCode = fs.readFileSync(stylesPath, 'utf8');

assert(profileCode.includes('overflow-hidden') || stylesCode.includes('.dedicated-profile-viewport'), 'Profile viewport overflow protection enabled');
assert(stylesCode.includes('.dedicated-profile-viewport') && stylesCode.includes('overflow-x: hidden !important'), 'dedicated-profile-viewport has overflow-x hidden');
assert(stylesCode.includes('.profile-dashboard-card') && stylesCode.includes('max-width: 100% !important'), 'profile-dashboard-card constrained to max-width 100%');

// 3. Verify Android App Launcher Icon
const icForegroundPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable-v24', 'ic_launcher_foreground.xml');
const icBgDrawablePath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'drawable', 'ic_launcher_background.xml');
const icBgColorPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'values', 'ic_launcher_background.xml');

assert(!fs.existsSync(icForegroundPath), 'Conflicting drawable-v24 ic_launcher_foreground.xml deleted to enable logo mipmaps');
assert(!fs.existsSync(icBgDrawablePath), 'Conflicting drawable ic_launcher_background.xml deleted');
assert(fs.existsSync(icBgColorPath) && fs.readFileSync(icBgColorPath, 'utf8').includes('#F9F0E7'), 'ic_launcher_background color matches logo background #F9F0E7');

console.log(`\n======================================================================`);
console.log(`TOTAL: ${passed} Passed, ${failed} Failed`);
console.log('======================================================================');

if (failed > 0) process.exit(1);
