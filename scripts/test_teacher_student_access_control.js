const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const TEST_PORT = 8095;
let serverProcess = null;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers
    };
    if (payload) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {
          json = data;
        }
        resolve({ status: res.statusCode, data: json, headers: res.headers });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING NITHYA YOGA TEACHER & STUDENT ACCESS CONTROL TESTS ---');

  // 1. Start server process on isolated port
  serverProcess = spawn('node', ['serve.js'], {
    env: { ...process.env, PORT: String(TEST_PORT) },
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', d => {
    console.log('[Server]', d.toString().trim());
  });
  serverProcess.stderr.on('data', d => {
    console.error('[Server Err]', d.toString().trim());
  });

  // Wait for server to boot
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await request('GET', '/api/health');
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch (_) {}
    await new Promise(r => setTimeout(r, 250));
  }

  if (!ready) {
    throw new Error('Server failed to start on port ' + TEST_PORT);
  }
  console.log('✓ Test server listening on port ' + TEST_PORT);

  let passed = 0;
  let failed = 0;

  function assert(condition, desc) {
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
    }
  }

  const testEmail = `teacher_${Date.now()}@nithyayoga.com`;
  const testPassword = 'SecurePassword123!';
  let teacherToken = null;
  let createdSessionId = null;

  try {
    // Test 1: Teacher Registration with valid inputs
    console.log('\n[Phase 1: Teacher Registration & Validation]');
    const regRes = await request('POST', '/api/admin/register', {
      name: 'Nithya Senior Instructor',
      email: testEmail,
      phone: '9876543210',
      password: testPassword
    });
    assert(regRes.status === 201 && regRes.data.token, 'Teacher registration returns 201 Created and signed JWT');
    teacherToken = regRes.data.token;

    // Test 2: Reject duplicate teacher registration
    const dupRes = await request('POST', '/api/admin/register', {
      name: 'Duplicate Teacher',
      email: testEmail,
      phone: '9876543210',
      password: testPassword
    });
    assert(dupRes.status === 409, 'Duplicate teacher registration returns 409 Conflict');

    // Test 3: Teacher Login
    console.log('\n[Phase 2: Teacher Login & Authentication]');
    const loginRes = await request('POST', '/api/admin/login', {
      email: testEmail,
      password: testPassword
    });
    assert(loginRes.status === 200 && loginRes.data.token, 'Teacher login returns 200 OK and JWT');

    // Test 4: Reject login with wrong password
    const wrongLoginRes = await request('POST', '/api/admin/login', {
      email: testEmail,
      password: 'WrongPassword!'
    });
    assert(wrongLoginRes.status === 401, 'Login with invalid password returns 401 Unauthorized');

    // Test 5: Teacher Server-Side Verification (/api/teacher/verify)
    console.log('\n[Phase 3: Server-Side Role Verification]');
    const verifyRes = await request('GET', '/api/teacher/verify', null, {
      'Authorization': `Bearer ${teacherToken}`
    });
    assert(verifyRes.status === 200 && verifyRes.data.ok && verifyRes.data.user.role === 'trainer', 'Server verifies teacher JWT role as trainer');

    // Test 6: Reject unauthenticated teacher verification
    const unauthVerify = await request('GET', '/api/teacher/verify');
    assert(unauthVerify.status === 401, 'Unauthenticated verification request returns 401');

    // Test 7: Reject forged token verification
    const forgedVerify = await request('GET', '/api/teacher/verify', null, {
      'Authorization': 'Bearer forged_fake_token_12345'
    });
    assert(forgedVerify.status === 401, 'Forged token verification request returns 401');

    // Test 8: Teacher Live Class Creation
    console.log('\n[Phase 4: Teacher Live Class Creation & Session ID]');
    const createClassRes = await request('POST', '/api/teacher/live/create', {
      title: 'Hatha Yoga Flow Morning Alignment',
      courseName: 'Morning Yoga Flow',
      durationMinutes: 60
    }, {
      'Authorization': `Bearer ${teacherToken}`
    });
    assert((createClassRes.status === 200 || createClassRes.status === 201) && createClassRes.data && createClassRes.data.sessionId, 'Authorized teacher creates live class with unique session ID');
    assert(createClassRes.data && createClassRes.data.sessionId && createClassRes.data.sessionId.startsWith('room-'), 'Session ID follows unique "room-..." format');
    assert(createClassRes.data && createClassRes.data.inviteUrl && createClassRes.data.inviteUrl.includes(createClassRes.data.sessionId), 'Invitation URL includes unique session ID');
    createdSessionId = createClassRes.data?.sessionId;

    // Test 9: Reject class creation without teacher authorization
    const unauthCreate = await request('POST', '/api/teacher/live/create', {
      title: 'Hacker Session'
    });
    assert(unauthCreate.status === 401, 'Unauthenticated class creation is blocked with 401');

    // Test 10: Student Session Validation
    console.log('\n[Phase 5: Student Invitation Link & Session Validation]');
    const sessionRes = await request('GET', `/api/live/session/${encodeURIComponent(createdSessionId)}`);
    assert(sessionRes.status === 200 && sessionRes.data.exists && sessionRes.data.status === 'live', 'Live session query returns exists=true and status=live');

    // Test 11: Invalid session ID returns exists=false
    const invalidSessionRes = await request('GET', '/api/live/session/nonexistent-session-id-9999');
    assert((invalidSessionRes.status === 404 || invalidSessionRes.status === 200) && invalidSessionRes.data.exists === false, 'Invalid session query returns exists=false');

    // Test 12: Student Joining Class with Valid Credentials
    console.log('\n[Phase 6: Student Joining & Input Validation]');
    const studentJoinRes = await request('POST', '/api/student/join', {
      name: 'Ananya Sharma',
      phone: '9123456789',
      sessionId: createdSessionId
    });
    assert(studentJoinRes.status === 200 && studentJoinRes.data.ok, 'Student can join valid active session with Name & 10-digit Phone');

    // Test 13: Reject student join with invalid phone number
    const invalidPhoneRes = await request('POST', '/api/student/join', {
      name: 'Ananya Sharma',
      phone: '12345',
      sessionId: createdSessionId
    });
    assert(invalidPhoneRes.status === 400, 'Student join with <10 digit phone is rejected with 400 Bad Request');

    // Test 14: Reject student join with missing name
    const missingNameRes = await request('POST', '/api/student/join', {
      name: '   ',
      phone: '9123456789',
      sessionId: createdSessionId
    });
    assert(missingNameRes.status === 400, 'Student join with empty name is rejected with 400 Bad Request');

    // Test 15: Teacher Ends Class
    console.log('\n[Phase 7: End Class & Post-Class Access Control]');
    const endClassRes = await request('POST', `/api/teacher/classes/${encodeURIComponent(createdSessionId)}/end`, null, {
      'Authorization': `Bearer ${teacherToken}`
    });
    assert(endClassRes.status === 200 && endClassRes.data.ok, 'Authorized teacher can end live class for all participants');

    // Test 16: Check session status after class ended
    const endedSessionRes = await request('GET', `/api/live/session/${encodeURIComponent(createdSessionId)}`);
    assert(endedSessionRes.status === 200 && endedSessionRes.data.exists && endedSessionRes.data.status === 'ended', 'Ended session returns status="ended"');

    // Test 17: Students cannot join an ended class
    const joinEndedRes = await request('POST', '/api/student/join', {
      name: 'Rahul Kumar',
      phone: '9876501234',
      sessionId: createdSessionId
    });
    assert(joinEndedRes.status === 400 && joinEndedRes.data.ended === true, 'Student cannot join an ended class; returns ended=true');

    console.log('\n=======================================================');
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('=======================================================');

  } catch (err) {
    console.error('Test execution failed with error:', err);
    failed++;
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGINT');
      serverProcess = null;
    }
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
