const assert = require('assert');

const BASE_URL = 'http://localhost:8080';

async function run() {
  console.log('🧪 Starting Verification of Live Participant Fixes...');

  const classId = `cls-test-${Date.now()}`;

  // 1. Create a test class
  const db = require('better-sqlite3')('nithya-yoga.sqlite');
  db.prepare(`
    INSERT INTO classes (id, title, starts_at, duration_minutes, room_name, status, trainer_id, created_at)
    VALUES (?, 'Evening Hatha Masterclass', datetime('now'), 60, ?, 'scheduled', 'admin', datetime('now'))
  `).run(classId, `room-${classId}`);

  console.log(`✓ 1. Test class created: ${classId}`);

  // 2. Trainer starts the class via /api/trainer/classes/:id/start
  const startRes = await fetch(`${BASE_URL}/api/trainer/classes/${classId}/start`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer nithya_master_active',
      'Content-Type': 'application/json'
    }
  });
  const startData = await startRes.json();
  assert.strictEqual(startData.ok, true, 'Start class must succeed');
  console.log('✓ 2. Class started by trainer.');

  // 3. Trainer sends initial heartbeat
  const trainerHbRes = await fetch(`${BASE_URL}/api/live/heartbeat`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer nithya_master_active',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      classId,
      participantId: 'instructor-primary',
      identity: 'instructor:instructor-primary',
      name: 'NITHYA Master',
      role: 'instructor',
      tabId: 'trainer-tab-1'
    })
  });
  const trainerHbData = await trainerHbRes.json();
  assert.strictEqual(trainerHbData.ok, true, 'Trainer heartbeat must succeed');
  assert.strictEqual(trainerHbData.studentCount, 0, 'Initial student count MUST be 0 when trainer starts alone');
  assert.strictEqual(trainerHbData.activeCount, 1, 'Active total count is 1 (the trainer)');
  assert.strictEqual(trainerHbData.activeParticipants.length, 1, 'Only trainer is present');
  assert.strictEqual(trainerHbData.activeParticipants[0].role, 'instructor');
  
  // Verify no fake participants
  const fakeParticipants = trainerHbData.activeParticipants.filter(p => 
    p.name.includes('Practitioner') || p.name.includes('Practice') || p.name.includes('Kavitha')
  );
  assert.strictEqual(fakeParticipants.length, 0, 'No fake or dummy participants allowed');
  console.log('✓ 3. Verified: Trainer alone has studentCount === 0 and NO fake participants.');

  // 4. Student registration via /api/student/validate-join
  const studentRegRes = await fetch(`${BASE_URL}/api/student/validate-join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classId,
      name: 'Ananya Sundaram',
      phone: '9840123456'
    })
  });
  const studentRegData = await studentRegRes.json();
  assert.strictEqual(studentRegData.allowed, true, 'Student registration must be allowed');
  assert.strictEqual(studentRegData.name, 'Ananya Sundaram');
  assert.strictEqual(studentRegData.phone, '9840123456');
  console.log('✓ 4. Verified: Student registered with genuine Name & Phone.');

  // 5. Student sends heartbeat with genuine identity & phone
  const studentHbRes = await fetch(`${BASE_URL}/api/live/heartbeat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classId,
      participantId: '9840123456',
      identity: 'student:9840123456',
      name: 'Ananya Sundaram',
      phone: '9840123456',
      role: 'student',
      tabId: 'student-tab-1'
    })
  });
  const studentHbData = await studentHbRes.json();
  assert.strictEqual(studentHbData.ok, true);
  assert.strictEqual(studentHbData.studentCount, 1, 'Student count must now be 1');
  assert.strictEqual(studentHbData.activeCount, 2, 'Total active count must be 2 (trainer + 1 student)');

  const joinedStudent = studentHbData.activeParticipants.find(p => p.role === 'student');
  assert(joinedStudent, 'Joined student must be in active participants');
  assert.strictEqual(joinedStudent.name, 'Ananya Sundaram');
  assert.strictEqual(joinedStudent.phone, '9840123456');
  console.log('✓ 5. Verified: Student successfully joined, studentCount === 1 with actual Name & Mobile.');

  // 6. Test Deduplication on Refresh / Repeated Heartbeats
  for (let i = 0; i < 3; i++) {
    const repeatHbRes = await fetch(`${BASE_URL}/api/live/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId,
        participantId: '9840123456',
        identity: 'student:9840123456',
        name: 'Ananya Sundaram',
        phone: '9840123456',
        role: 'student',
        tabId: `student-tab-refresh-${i}`
      })
    });
    const repeatData = await repeatHbRes.json();
    assert.strictEqual(repeatData.studentCount, 1, 'Student count must REMAIN 1 on refreshes/repeats');
  }
  console.log('✓ 6. Verified: Repeated requests/refreshes do not create duplicate participants.');

  // 7. Student leaves
  const leaveRes = await fetch(`${BASE_URL}/api/live/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classId,
      identity: 'student:9840123456',
      participantId: '9840123456',
      temporary: false
    })
  });
  const leaveData = await leaveRes.json();
  assert.strictEqual(leaveData.ok, true);

  // Check heartbeat after student leave
  const afterLeaveHbRes = await fetch(`${BASE_URL}/api/live/heartbeat`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer nithya_master_active',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      classId,
      participantId: 'instructor-primary',
      identity: 'instructor:instructor-primary',
      name: 'NITHYA Master',
      role: 'instructor',
      tabId: 'trainer-tab-1'
    })
  });
  const afterLeaveHbData = await afterLeaveHbRes.json();
  assert.strictEqual(afterLeaveHbData.studentCount, 0, 'Student count must return to 0 after student leaves');
  console.log('✓ 7. Verified: Student leave accurately decrements student count back to 0.');

  // 8. Clean up test class
  db.prepare('DELETE FROM live_sessions WHERE class_id=?').run(classId);
  db.prepare('DELETE FROM classes WHERE id=?').run(classId);

  console.log('🎉 ALL LIVE PARTICIPANT TESTS PASSED WITH 100% SUCCESS!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
