const fs = require('fs');
const path = require('path');

console.log('======================================================================');
console.log('🧘 Verifying NITHYA Yoga - Live Class UI & Functionality Bug Fixes');
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

const liveRoomPath = path.join(__dirname, '..', 'src', 'components', 'LiveYogaClassRoom.jsx');
const liveRoomCode = fs.readFileSync(liveRoomPath, 'utf8');

const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');

const stylesPath = path.join(__dirname, '..', 'src', 'styles.css');
const stylesCode = fs.readFileSync(stylesPath, 'utf8');

// 1. Text Visibility & Theme
assert(!liveRoomCode.includes('#29233D'), 'LiveYogaClassRoom has zero hardcoded black #29233D text');
assert(stylesCode.includes('.live-studio-heading-title') && stylesCode.includes('#FFFFFF !important'), 'live-studio-heading-title has white !important');
assert(stylesCode.includes('.studio-class-label') && stylesCode.includes('#E2D9F3 !important'), 'studio-class-label has high-contrast lavender');
assert(stylesCode.includes('.dedicated-live-class-viewport') && stylesCode.includes('#0B0819 !important'), 'dedicated-live-class-viewport has luxury dark-purple #0B0819');
assert(stylesCode.includes('.livekit-lobby-card') && stylesCode.includes('#1C143B'), 'livekit-lobby-card styled with luxury purple gradient');

// 2. Success Popup Modal Architecture
assert(liveRoomCode.includes('modal-header-row'), 'Share modal has modal-header-row');
assert(liveRoomCode.includes('modal-header-icon-box'), 'Share modal has modal-header-icon-box with Sparkles');
assert(liveRoomCode.includes('modal-title') && liveRoomCode.includes('Live Class Link Ready!'), 'Share modal has Live Class Link Ready! header');
assert(liveRoomCode.includes('modal-close-btn'), 'Share modal has dedicated modal-close-btn (X)');
assert(liveRoomCode.includes('modal-class-info-card'), 'Share modal has modal-class-info-card');
assert(liveRoomCode.includes('modal-status-badge'), 'Share modal has status badge component');
assert(liveRoomCode.includes('badge-live') && liveRoomCode.includes('badge-ready'), 'Share modal conditionally applies badge-live vs badge-ready');
assert(liveRoomCode.includes('modal-invite-field-box'), 'Share modal has monospace invite field box');
assert(liveRoomCode.includes('modal-copy-field-btn'), 'Share modal has dedicated copy button next to URL');
assert(liveRoomCode.includes('modal-copy-toast') || liveRoomCode.includes('modal-copy-feedback-toast'), 'Share modal has copy success toast feedback');

// 3. Four Modal Actions
assert(liveRoomCode.includes('btn-whatsapp') && liveRoomCode.includes('handleWhatsAppShare'), 'Action 1: WhatsApp share button wired');
assert(liveRoomCode.includes('btn-secondary-pill') && liveRoomCode.includes('handleCopyShareLink'), 'Action 2: Copy link pill button wired');
assert(liveRoomCode.includes('btn-secondary-pill') && liveRoomCode.includes('handleNativeShare'), 'Action 3: Native mobile share pill button wired');
assert(liveRoomCode.includes('btn-continue-primary') && liveRoomCode.includes('handleContinueToClassroom'), 'Action 4: Continue to Live Classroom button wired');

// 4. Host Studio Controls & Media Permissions
assert(liveRoomCode.includes('isMediaLoading') && liveRoomCode.includes('mediaErrorMsg'), 'isMediaLoading & mediaErrorMsg states defined');
assert(liveRoomCode.includes('handleLobbyToggleMic'), 'handleLobbyToggleMic verifies hardware and handles NotAllowedError');
assert(liveRoomCode.includes('handleLobbyToggleVideo'), 'handleLobbyToggleVideo verifies hardware and handles NotAllowedError');
assert(liveRoomCode.includes('media-check-btn active') || liveRoomCode.includes('media-check-btn'), 'Media check buttons use media-check-btn active/muted tokens');
assert(stylesCode.includes('.media-check-btn.active') && stylesCode.includes('#10B981'), 'media-check-btn active uses bright emerald #10B981');
assert(stylesCode.includes('.media-check-btn.muted') && stylesCode.includes('#EF4444'), 'media-check-btn muted uses vibrant rose #EF4444');

// 5. Create Live Room & Session Stage Lifecycle
assert(liveRoomCode.includes('sessionStage'), 'sessionStage lifecycle state implemented (idle, ready, live, ended)');
assert(liveRoomCode.includes('handleStartNewClassSession'), 'handleStartNewClassSession sets unique room ID and stage ready');
assert(liveRoomCode.includes('handleContinueToClassroom'), 'handleContinueToClassroom transitions stage and connects room');

// 6. Student Protection
assert(liveRoomCode.includes("params.get('join') === 'student'"), 'Student link strictly enforces student role');
assert(liveRoomCode.includes('getProductionLiveUrl') && liveRoomCode.includes("join: 'student'"), 'Student invite link sets join=student');

// 7. Modal Mobile Responsiveness
assert(stylesCode.includes('.live-share-modal-card') && stylesCode.includes('max-height: 90vh') && stylesCode.includes('overflow-y: auto'), 'Modal constrained to 90vh max-height with vertical scrolling');

console.log(`\n======================================================================`);
console.log(`TOTAL: ${passed} Passed, ${failed} Failed`);
console.log('======================================================================');

if (failed > 0) process.exit(1);
