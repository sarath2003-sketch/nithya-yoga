const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const postData = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;
    const reqOpts = {
      hostname: 'localhost',
      port: 8080,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };
    if (postData) {
      reqOpts.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = http.request(reqOpts, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (_) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('====================================================');
  console.log('🧘 NITHYA YOGA — LIVE JOINING & CANCELLATION TEST');
  console.log('====================================================\n');

  const testClassId = 'cls-test-' + Date.now().toString(36);
  const testRoomName = 'nithya-' + testClassId;

  // 1. Create a class
  console.log('[Test 1] Create Live Class with Unique Room ID');
  const createRes = await request('/api/trainer/classes', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer nithya_master_active' },
    body: {
      title: 'Pranayama & Asana Masterclass',
      courseName: 'Kundalini Awakening Flow',
      startsAt: new Date().toISOString(),
      durationMinutes: 60,
      roomName: testRoomName
    }
  });
  if (createRes.status !== 201) throw new Error(`Create class failed: ${JSON.stringify(createRes.data)}`);
  const classId = createRes.data.id;
  console.log(`  ✓ Created class ID: ${classId}, Room: ${createRes.data.roomName}`);

  // 2. Start class as trainer
  console.log('\n[Test 2] Trainer Starts Class (POST /api/trainer/classes/:id/start)');
  const startRes = await request(`/api/trainer/classes/${classId}/start`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer nithya_master_active' }
  });
  if (startRes.status !== 200 || startRes.data.status !== 'live') {
    throw new Error(`Start class failed: ${JSON.stringify(startRes.data)}`);
  }
  console.log(`  ✓ Class status is now LIVE!`);

  // 3. Trainer sends heartbeat
  console.log('\n[Test 3] Trainer Heartbeat (Keeps Session Active)');
  const trainerHb = await request('/api/live/heartbeat', {
    method: 'POST',
    body: {
      classId,
      participantId: 'instructor-primary',
      identity: 'instructor:instructor-primary',
      name: 'NITHYA Master',
      role: 'instructor',
      tabId: 'tab-trainer-1'
    }
  });
  if (trainerHb.status !== 200 || !trainerHb.data.teacherConnected || trainerHb.data.classStatus !== 'live') {
    throw new Error(`Trainer heartbeat failed: ${JSON.stringify(trainerHb.data)}`);
  }
  console.log(`  ✓ Trainer active, classStatus: ${trainerHb.data.classStatus}, teacherConnected: ${trainerHb.data.teacherConnected}`);

  // 4. Student validates and joins class
  console.log('\n[Test 4] Student Registration Validation (Name + Mobile)');
  const studentReg = await request('/api/student/validate-join', {
    method: 'POST',
    body: {
      classId,
      name: 'Priya Sundaram',
      phone: '9876543210'
    }
  });
  if (studentReg.status !== 200 || studentReg.data.role !== 'student') {
    throw new Error(`Student validate failed: ${JSON.stringify(studentReg.data)}`);
  }
  console.log(`  ✓ Student registered as: ${studentReg.data.name} (${studentReg.data.phone}), Role: ${studentReg.data.role}`);

  // 5. Student sends heartbeat & synchronizes roster
  console.log('\n[Test 5] Student Heartbeat & Live Roster Synchronization');
  const studentHb = await request('/api/live/heartbeat', {
    method: 'POST',
    body: {
      classId,
      participantId: '9876543210',
      identity: 'student:9876543210',
      name: 'Priya Sundaram',
      role: 'student',
      tabId: 'tab-student-1'
    }
  });
  if (studentHb.status !== 200 || studentHb.data.classStatus !== 'live') {
    throw new Error(`Student heartbeat failed: ${JSON.stringify(studentHb.data)}`);
  }
  if (!studentHb.data.activeParticipants || studentHb.data.activeParticipants.length < 2) {
    throw new Error(`Roster sync failed: ${JSON.stringify(studentHb.data.activeParticipants)}`);
  }
  console.log(`  ✓ Roster synchronized with ${studentHb.data.activeParticipants.length} active participants:`);
  studentHb.data.activeParticipants.forEach(p => console.log(`     - [${p.role}] ${p.name} (${p.status})`));

  // 6. Temporary disconnect (switching tabs / minimizing app)
  console.log('\n[Test 6] Trainer Switches Tab / Temporarily Leaves (10-Minute Grace Period)');
  const tempLeave = await request('/api/live/leave', {
    method: 'POST',
    body: {
      classId,
      participantId: 'instructor-primary',
      tabId: 'tab-trainer-1',
      temporary: true
    }
  });
  if (tempLeave.status !== 200) throw new Error(`Temp leave failed: ${JSON.stringify(tempLeave.data)}`);

  // Student checks heartbeat during grace period
  const studentCheckHb = await request('/api/live/heartbeat', {
    method: 'POST',
    body: {
      classId,
      participantId: '9876543210',
      identity: 'student:9876543210',
      name: 'Priya Sundaram',
      role: 'student',
      tabId: 'tab-student-1'
    }
  });
  if (studentCheckHb.data.classStatus !== 'live' || studentCheckHb.data.teacherGraceRemainingSeconds === null) {
    throw new Error(`Class was falsely cancelled during grace period! ${JSON.stringify(studentCheckHb.data)}`);
  }
  console.log(`  ✓ Class remained LIVE! Grace period remaining: ${studentCheckHb.data.teacherGraceRemainingSeconds}s`);

  // 7. Trainer switches back to tab (reconnects)
  console.log('\n[Test 7] Trainer Reconnects');
  const trainerReconnect = await request('/api/live/heartbeat', {
    method: 'POST',
    body: {
      classId,
      participantId: 'instructor-primary',
      identity: 'instructor:instructor-primary',
      name: 'NITHYA Master',
      role: 'instructor',
      tabId: 'tab-trainer-1'
    }
  });
  if (!trainerReconnect.data.teacherConnected || trainerReconnect.data.classStatus !== 'live') {
    throw new Error(`Trainer reconnect failed: ${JSON.stringify(trainerReconnect.data)}`);
  }
  console.log(`  ✓ Trainer reconnected successfully, grace period cleared!`);

  // 8. Explicit permanent end class by trainer
  console.log('\n[Test 8] Trainer Explicitly Ends Class For All Participants');
  const endRes = await request(`/api/trainer/classes/${classId}/end`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer nithya_master_active' }
  });
  if (endRes.status !== 200 || endRes.data.status !== 'ended') {
    throw new Error(`End class failed: ${JSON.stringify(endRes.data)}`);
  }
  console.log(`  ✓ Class successfully ended by trainer!`);

  console.log('\n====================================================');
  console.log('🎉 ALL 8/8 JOINING & CANCELLATION TESTS PASSED!');
  console.log('====================================================');
}

run().catch(err => {
  console.error('\n❌ Test Error:', err);
  process.exit(1);
});
