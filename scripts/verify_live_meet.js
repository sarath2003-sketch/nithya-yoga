const assert = require('assert');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:8080';

async function runTests() {
  console.log('====================================================');
  console.log('🧘 NITHYA YOGA — LIVE CLASS & GOOGLE MEET SUITE TEST');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    return fn()
      .then(() => {
        passed++;
        console.log(`✓ [PASS] ${name}`);
      })
      .catch((err) => {
        console.error(`✕ [FAIL] ${name}:`, err.message);
      });
  }

  // TEST 1: Backend Health & LiveKit Readiness
  await test('1. Backend Health & Service Online', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.service, 'nithya-yoga-api');
    assert.strictEqual(data.livekitConfigured, true);
  });

  // TEST 2: Course Name Integration in Classes Schema & API
  await test('2. Course Name Integration in Classes Endpoints', async () => {
    const res = await fetch(`${BASE_URL}/api/classes`);
    assert.strictEqual(res.status, 200);
    const classes = await res.json();
    assert(Array.isArray(classes), 'Classes should be an array');
    assert(classes.length >= 3, 'Should have classes configured');

    const first = classes[0];
    assert(first.course_name, 'First class should have a course_name');
    console.log(`   -> Found course_name: "${first.course_name}" for class "${first.title || first.name}"`);

    // Verify detail endpoint returns course_name
    const detailRes = await fetch(`${BASE_URL}/api/classes/${first.id}`);
    assert.strictEqual(detailRes.status, 200);
    const detail = await detailRes.json();
    assert.strictEqual(detail.course_name, first.course_name);
  });

  // TEST 3: Student Registration & Validation Endpoint (Role Enforcement)
  await test('3. Student Join Validation & Token Generation', async () => {
    const res = await fetch(`${BASE_URL}/api/student/validate-join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: 'cls-1',
        name: 'Priya Sundaram',
        phone: '9876543210'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.token, 'Should return student JWT token');
    assert.strictEqual(data.role, 'student', 'Token role must be student');
    assert.strictEqual(data.name, 'Priya Sundaram');
  });

  // TEST 4: LiveKit Token API returns Course Name & Class Status
  await test('4. LiveKit Token API returns Course Name & Role', async () => {
    const res = await fetch(`${BASE_URL}/api/livekit/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: 'yoga-cls-1',
        participantName: 'Priya Sundaram',
        classId: 'cls-1'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.token, 'Should return LiveKit token');
    assert(data.courseName, 'Should include courseName');
    assert(data.classStatus === 'live' || data.classStatus === 'scheduled', 'Class status should be live or scheduled');
    console.log(`   -> LiveKit room token created for course: "${data.courseName}" (Status: ${data.classStatus})`);
  });

  // TEST 5: Heartbeat for Student Session
  await test('5. Student Heartbeat Upsert & Session Tracking', async () => {
    const res = await fetch(`${BASE_URL}/api/live/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: 'cls-1',
        participantId: 'student-9876543210',
        identity: 'student:9876543210',
        name: 'Priya Sundaram',
        role: 'student',
        tabId: 'tab-priya-1'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.classId, 'cls-1');
    assert(data.activeCount >= 1, 'Should reflect active session');
    assert.strictEqual(data.teacherConnected, false);
    assert(typeof data.teacherGraceRemainingSeconds === 'number', 'Should report grace remaining seconds');
  });

  // TEST 6: Heartbeat for Teacher Session & Grace Cancellation
  await test('6. Teacher Heartbeat Upsert & Grace Cancellation', async () => {
    const res = await fetch(`${BASE_URL}/api/live/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: 'cls-1',
        participantId: 'instructor-primary',
        identity: 'instructor:nithya',
        name: 'NITHYA Master',
        role: 'instructor',
        tabId: 'tab-teacher-1'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.teacherConnected, true);
    assert.strictEqual(data.teacherGraceRemainingSeconds, null, 'Grace period cancelled when teacher connects');
    assert(data.activeCount >= 2, 'Should reflect both student and teacher sessions');
    console.log(`   -> Active participant count: ${data.activeCount}, Teacher connected: ${data.teacherConnected}`);
  });

  // TEST 7: Query Class Live Sessions List
  await test('7. Active Sessions Roster Query', async () => {
    const res = await fetch(`${BASE_URL}/api/live/sessions/cls-1`);
    assert.strictEqual(res.status, 200);
    const roster = await res.json();
    assert(Array.isArray(roster), 'Roster should be an array');
    assert(roster.length >= 2, 'Roster should have at least 2 sessions');
    const teacherSession = roster.find(s => s.role === 'instructor');
    assert(teacherSession, 'Roster must include teacher session');
    assert.strictEqual(teacherSession.status, 'active');
  });

  // TEST 8: Temporary Leave vs Grace Period
  await test('8. Temporary Leave triggers Grace Period without terminating class', async () => {
    const leaveRes = await fetch(`${BASE_URL}/api/live/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: 'cls-1',
        participantId: 'instructor-primary',
        identity: 'instructor:nithya',
        tabId: 'tab-teacher-1',
        temporary: true
      })
    });
    assert.strictEqual(leaveRes.status, 200);
    const leaveData = await leaveRes.json();
    assert.strictEqual(leaveData.ok, true);

    // Now check student heartbeat: teacher should be disconnected and grace period active
    const studentHb = await fetch(`${BASE_URL}/api/live/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: 'cls-1',
        participantId: 'student-9876543210',
        identity: 'student:9876543210',
        name: 'Priya Sundaram',
        role: 'student',
        tabId: 'tab-priya-1'
      })
    });
    const hbData = await studentHb.json();
    assert.strictEqual(hbData.teacherConnected, false, 'Teacher should now be disconnected');
    assert(hbData.teacherGraceRemainingSeconds > 0 && hbData.teacherGraceRemainingSeconds <= 600,
      'Teacher grace period should be active between 0 and 600 seconds');
    console.log(`   -> Teacher disconnected. Grace remaining: ${hbData.teacherGraceRemainingSeconds}s`);
  });

  // TEST 9: Student Permanent Leave
  await test('9. Student Permanent Leave cleanly terminates session', async () => {
    const leaveRes = await fetch(`${BASE_URL}/api/live/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: 'cls-1',
        participantId: 'student-9876543210',
        tabId: 'tab-priya-1',
        temporary: false
      })
    });
    assert.strictEqual(leaveRes.status, 200);
    const leaveData = await leaveRes.json();
    assert.strictEqual(leaveData.ok, true);
  });

  // TEST 10: App Version File & APK Update Verification
  await test('10. App Update version.json & APK Download Path', async () => {
    const versionPath = path.resolve(__dirname, '..', 'version.json');
    assert(fs.existsSync(versionPath), 'version.json must exist');
    const versionInfo = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    assert(versionInfo.version, 'version.json must contain version');
    assert(versionInfo.versionCode, 'version.json must contain versionCode');
    assert(versionInfo.apkUrl, 'version.json must contain apkUrl');
    console.log(`   -> Current Version: v${versionInfo.version} (Build ${versionInfo.versionCode}), APK: ${versionInfo.apkUrl}`);
  });

  console.log('\n====================================================');
  console.log(`RESULT: ${passed}/${total} Live Class Verification Tests Passed!`);
  console.log('====================================================\n');
}

runTests().catch(e => {
  console.error('Test script error:', e);
  process.exit(1);
});
