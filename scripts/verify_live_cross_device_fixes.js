const fs = require('fs');

const liveRoom = fs.readFileSync('src/components/LiveYogaClassRoom.jsx', 'utf8');
const studentModal = fs.readFileSync('src/components/StudentJoinModal.jsx', 'utf8');
const hero = fs.readFileSync('src/components/HeroSection.jsx', 'utf8');
const admin = fs.readFileSync('src/components/AdminPortalSection.jsx', 'utf8');
const liveStudio = fs.readFileSync('src/components/LiveClassStudio.jsx', 'utf8');
const storage = fs.readFileSync('src/utils/storage.js', 'utf8');

let pass = 0;
let fail = 0;

function assert(cond, msg) {
  if (cond) {
    console.log('PASS:', msg);
    pass++;
  } else {
    console.error('FAIL:', msg);
    fail++;
  }
}

// 1. Zero Yoga Member as simulated peer
assert(!storage.includes("val.name = 'Yoga Member'"), 'storage has no Yoga Member override');
assert(!liveStudio.includes("'Yoga Member'"), 'LiveClassStudio has no Yoga Member fallback');
assert(liveRoom.includes("!['Yoga Practitioner', 'Yoga Practice', 'Practitioner', 'Kavitha Ram', 'NITHYA Master', 'Yoga Member', 'Yoga Student', 'Student'].includes(s.name)"), 'simulated peers strictly filters out Yoga Member');

// 2. PeerJS Multi-device live connection
assert(liveRoom.includes("import { Peer } from 'peerjs';"), 'PeerJS imported for multi-device cross-internet live video');
assert(liveRoom.includes('trainerPeerId'), 'Trainer peer ID defined');
assert(liveRoom.includes('teacherStream'), 'teacherStream state defined for student stage');
assert(liveRoom.includes('setTeacherStream(incomingTeacherStream)'), 'incoming teacher stream attached');

// 3. Teacher student count starts at 0
assert(liveRoom.includes('currentStudentCount = isInstructorRole\n    ? realStudentsList.length') || liveRoom.includes('currentStudentCount = isInstructorRole ? realStudentsList.length') || liveRoom.includes('isInstructorRole\n    ? realStudentsList.length'), 'instructor student count is strictly realStudentsList.length');

// 4. Hero section 7 chakra artwork
assert(hero.includes('hero-right-visual-wrapper') && hero.includes('chakra-meditation.jpg'), 'HeroSection includes 7 chakra meditation visual');

// 5. Admin portal attendance metrics
assert(admin.includes('Registered Students') && admin.includes('Total Practice Time'), 'AdminPortal includes student attendance metrics');

// 6. Google Meet options
assert(liveStudio.includes('btn-launch-google-meet-prominent'), 'LiveClassStudio has prominent Google Meet button');
assert(liveRoom.includes('as-google-meet-pill'), 'LiveYogaClassRoom header has Google Meet button');

console.log(`\nTOTAL: ${pass} Passed, ${fail} Failed`);
process.exit(fail === 0 ? 0 : 1);
