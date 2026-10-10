// Automated Backend & Security Verification Suite for NITHYA Yoga
const http = require('http');

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    let postData = null;
    if (body) {
      postData = JSON.stringify(body);
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(url, {
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting NITHYA Yoga Backend Integration Tests');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  try {
    // 1. Health Check
    console.log('[Test 1] Health Check');
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data.ok === true, 'GET /api/health returns 200 OK');

    // 2. Admin Security: Unauthorized Access Blocked
    console.log('\n[Test 2] Security: Unauthenticated Admin Request Blocked');
    const blockedClass = await request('POST', '/api/admin/classes', {
      title: 'Hacked Class',
      startsAt: new Date().toISOString(),
      durationMinutes: 60
    });
    assert(blockedClass.status === 401, 'POST /api/admin/classes rejects unauthenticated requests (HTTP 401)');

    // 3. Admin Login: Invalid Password Blocked
    console.log('\n[Test 3] Security: Invalid Admin Password Rejected');
    const badLogin = await request('POST', '/api/admin/login', {
      email: 'admin@nithyayoga.com',
      password: 'WrongPassword123'
    });
    assert(badLogin.status === 401, 'POST /api/admin/login rejects wrong password (HTTP 401)');

    // 4. Admin Login: Valid Credentials
    console.log('\n[Test 4] Admin Login with Valid Credentials');
    const loginRes = await request('POST', '/api/admin/login', {
      email: 'admin@nithyayoga.com',
      password: 'NithyaAdmin2026!'
    });
    assert(loginRes.status === 200 && Boolean(loginRes.data.token), 'Admin login returns JWT token');
    const adminToken = loginRes.data.token;

    // 5. Admin Create Class
    console.log('\n[Test 5] Admin Create Class');
    const newClassRes = await request('POST', '/api/admin/classes', {
      title: 'Morning Surya Namaskar & Pranayama',
      startsAt: new Date(Date.now() + 3600000).toISOString(),
      durationMinutes: 60
    }, { Authorization: `Bearer ${adminToken}` });
    assert(newClassRes.status === 201 && Boolean(newClassRes.data.id), 'Admin successfully creates class (HTTP 201)');
    const classId = newClassRes.data.id;

    // 6. Admin List Classes
    console.log('\n[Test 6] Admin List Classes');
    const listRes = await request('GET', '/api/admin/classes', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(listRes.status === 200 && Array.isArray(listRes.data), 'Admin lists classes successfully');

    // 7. Admin Create Class Invite Link
    console.log('\n[Test 7] Admin Generate One-Time Invite Link');
    const inviteRes = await request('POST', `/api/admin/classes/${classId}/invites`, null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(inviteRes.status === 201 && Boolean(inviteRes.data.token), 'Admin creates class invite token (HTTP 201)');
    const inviteToken = inviteRes.data.token;
    assert(inviteRes.data.inviteUrl.includes(encodeURIComponent(inviteToken)), 'Invite URL contains encoded token');

    // 8. Public Invite Resolution
    console.log('\n[Test 8] Public Invite Metadata Lookup');
    const resolveRes = await request('GET', `/api/invites/${inviteToken}`);
    assert(resolveRes.status === 200 && resolveRes.data.valid === true, 'Public invite resolves valid class info');
    assert(resolveRes.data.class.id === classId, 'Resolved class matches scheduled class ID');

    // 9. Member Registration
    console.log('\n[Test 9] Member Registration via Invite');
    const memberEmail = `test.member.${Date.now()}@gmail.com`;
    const regRes = await request('POST', '/api/members/register', {
      inviteToken,
      name: 'Nithya Student',
      email: memberEmail,
      phone: '+919876543210'
    });
    assert(regRes.status === 201 && Boolean(regRes.data.token), 'Member registers and receives JWT token (HTTP 201)');
    const memberToken = regRes.data.token;
    const memberId = regRes.data.member.id;

    // 10. Security: Member Cannot Create Classes
    console.log('\n[Test 10] Security: Member Role Forbidden from Admin Actions');
    const memberAdminAttempt = await request('POST', '/api/admin/classes', {
      title: 'Illegal Class',
      startsAt: new Date().toISOString(),
      durationMinutes: 60
    }, { Authorization: `Bearer ${memberToken}` });
    assert(memberAdminAttempt.status === 403, 'Member token is forbidden from admin routes (HTTP 403)');

    // 11. Attendance Join
    console.log('\n[Test 11] Member Attendance Join');
    const joinRes = await request('POST', '/api/attendance/join', { classId }, {
      Authorization: `Bearer ${memberToken}`
    });
    assert(joinRes.status === 200 && joinRes.data.ok === true, 'Member records attendance join');

    // 12. Attendance Leave
    console.log('\n[Test 12] Member Attendance Leave');
    const leaveRes = await request('POST', '/api/attendance/leave', { classId }, {
      Authorization: `Bearer ${memberToken}`
    });
    assert(leaveRes.status === 200 && leaveRes.data.ok === true, 'Member records attendance leave with calculated duration');

    // 13. Admin Attendance Report
    console.log('\n[Test 13] Admin Attendance Audit Report');
    const reportRes = await request('GET', '/api/admin/attendance', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(reportRes.status === 200 && Array.isArray(reportRes.data), 'Admin fetches attendance logs');
    const foundRecord = reportRes.data.find(r => r.email === memberEmail);
    assert(Boolean(foundRecord), 'Newly registered member attendance is logged in SQLite database');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passed}/${total} BACKEND INTEGRATION TESTS PASSED!`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ Test execution failed:', err.message);
    process.exit(1);
  }
}

runTests();
