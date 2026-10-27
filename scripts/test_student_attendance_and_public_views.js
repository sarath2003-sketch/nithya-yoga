/**
 * Verification Test Suite:
 * 1. Public Portal vs Admin Portal (No Live class creation in public view)
 * 2. Teacher Registration with Name, Email, Phone, Password
 * 3. Teacher Login, Token, Verification, and Logout
 * 4. Student Attendance & Duration Analytics (Kumar: 2 hours today, 100%, 18 days this month, start date Oct 1)
 * 5. Student Join (No account needed, enters freely)
 * 6. Automated SQLite & JSON Database Backup
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 8080;
let server = null;

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (_) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('--- STARTING VERIFICATION TEST SUITE ---');

  // 1. Static UI Architecture Assertions
  console.log('\n[TEST 1] Public UI Navigation & Layout Verification:');
  const bottomNavContent = fs.readFileSync(path.join(__dirname, '../src/components/MobileBottomNav.jsx'), 'utf8');
  assert(!bottomNavContent.includes("{ id: 'live',"), 'MobileBottomNav does NOT contain public Live Class option');
  assert(bottomNavContent.includes("{ id: 'admin', labelEn: 'Admin Portal'"), 'MobileBottomNav contains Admin Portal button');
  assert(bottomNavContent.includes("{ id: 'home', labelEn: 'Public Portal'"), 'MobileBottomNav contains Public Portal button');
  assert(bottomNavContent.includes("{ id: 'reminders', labelEn: 'Reminders'"), 'MobileBottomNav retains Reminders button');

  const sidebarContent = fs.readFileSync(path.join(__dirname, '../src/components/Sidebar.jsx'), 'utf8');
  assert(!sidebarContent.includes("{ id: 'live',"), 'Sidebar does NOT contain public Live Studio tab');
  assert(sidebarContent.includes("{ id: 'admin', label: 'Admin Portal'"), 'Sidebar contains Admin Portal tab');

  const appContent = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf8');
  assert(appContent.includes("user?.role === 'trainer' || Boolean(localStorage.getItem('nithya_admin_token'))"), 'App.jsx restricts LiveClassStudio rendering to verified trainers only');
  assert(appContent.includes('Daily Routine & Reminders'), 'App.jsx presents Mindful Reminders on public home page');

  // 2. Connect to Running Backend or Start Test Server
  console.log('\n[TEST 2] Verifying Backend Server on port ' + PORT + '...');
  let isAlreadyRunning = false;
  try {
    const health = await request({ hostname: '127.0.0.1', port: PORT, path: '/api/health', method: 'GET' });
    if (health.status === 200) {
      isAlreadyRunning = true;
      console.log('  ✓ Connected to running server on port ' + PORT);
    }
  } catch (_) {}

  if (!isAlreadyRunning) {
    PORT = 8089;
    server = spawn('node', ['serve.js'], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    for (let attempt = 0; attempt < 15; attempt++) {
      try {
        await request({ hostname: '127.0.0.1', port: PORT, path: '/api/health', method: 'GET' });
        break;
      } catch (_) {
        await new Promise(r => setTimeout(r, 400));
      }
    }
  }

  try {
    // 3. Teacher Registration Test
    console.log('\n[TEST 3] Teacher Registration (Name, Email, Phone, Password):');
    const testEmail = `teacher_${Date.now()}@nithyayoga.com`;
    const regRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/admin/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Kavitha Ram',
      email: testEmail,
      phone: '9840112233',
      password: 'YogaTeacher2026!'
    });

    assert(regRes.status === 201, `Registration returned HTTP 201 (got ${regRes.status})`);
    assert(regRes.body?.ok === true, 'Registration succeeded with ok: true');
    assert(Boolean(regRes.body?.token), 'JWT authentication token issued upon registration');
    assert(regRes.body?.role === 'trainer', 'Assigned role is trainer');
    const teacherToken = regRes.body?.token;

    // 4. Teacher Login Test
    console.log('\n[TEST 4] Teacher Login Verification:');
    const loginRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: testEmail,
      password: 'YogaTeacher2026!'
    });

    assert(loginRes.status === 200, `Login returned HTTP 200 (got ${loginRes.status})`);
    assert(loginRes.body?.ok === true, 'Login succeeded with ok: true');
    assert(Boolean(loginRes.body?.token), 'Login issued verified JWT token');

    // 5. Teacher Token Verification Guard
    console.log('\n[TEST 5] Teacher Token Verification Guard:');
    const verifyRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/teacher/verify',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    assert(verifyRes.status === 200, 'Teacher verification returned HTTP 200');
    assert(verifyRes.body?.ok === true, 'Teacher authenticated successfully on backend');

    // 6. Student Attendance & Duration Analytics (Kumar's 2-hour record & monthly stats)
    console.log('\n[TEST 6] Student Attendance & Monthly Duration Analytics:');
    const analyticsRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/trainer/attendance/analytics',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });

    assert(analyticsRes.status === 200, `Analytics API returned HTTP 200 (got ${analyticsRes.status})`);
    assert(analyticsRes.body?.ok === true, 'Analytics returned ok: true');
    assert(Array.isArray(analyticsRes.body?.students), 'Students array returned in analytics');
    assert(analyticsRes.body?.monthStartDate === '2026-10-01', 'Month start date correctly reflects 2026-10-01');

    const kumar = analyticsRes.body?.students?.find(s => 
      (s.studentName || '').toLowerCase().includes('kumar') || s.studentPhone === '9876543210'
    );
    assert(Boolean(kumar), 'Student Kumar (குமார்) is present in analytics dashboard');
    if (kumar) {
      assert(kumar.todayDurationSeconds >= 7200, `Kumar today duration is 2 hours (got ${kumar.todayDurationSeconds}s / ${kumar.todayDurationFormatted})`);
      assert(kumar.todayAttendancePercent === 100, `Kumar today attendance rate is 100% (got ${kumar.todayAttendancePercent}%)`);
      assert(kumar.daysAttendedThisMonth >= 17, `Kumar days attended this month is 17+ days (got ${kumar.daysAttendedThisMonth} days)`);
      assert(kumar.monthlyAttendancePercent >= 80, `Kumar monthly rate is >= 80% (got ${kumar.monthlyAttendancePercent}%)`);
      assert(Number(kumar.totalHoursThisMonth) >= 20, `Kumar total hours this month is >= 20 hrs (got ${kumar.totalHoursThisMonth} hrs)`);
    }

    // 7. Student Free Joining (No Teacher Account Needed)
    console.log('\n[TEST 7] Student Invite Link Joining (No Account Needed):');
    const studentJoinRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/student/validate-join',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      classId: 'cls-1',
      name: 'Priya Sundaram',
      phone: '9840998877'
    });
    assert(studentJoinRes.status === 200, 'Student validation returned HTTP 200');
    assert(studentJoinRes.body?.allowed === true, 'Student is permitted to join live room');
    assert(studentJoinRes.body?.role === 'student', 'Student role is student');

    // 8. Log Priya Attendance & Verify Multi-Student Real-time Tracking
    console.log('\n[TEST 8] Student Attendance Logging & Multi-Student Tracking:');
    const logRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/attendance/log',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      classId: 'cls-1',
      studentName: 'Priya Sundaram',
      studentPhone: '9840998877',
      durationSeconds: 3600
    });
    assert(logRes.status === 200, 'Student attendance log returned HTTP 200');
    assert(logRes.body?.studentName === 'Priya Sundaram', 'Student name preserved');
    assert(logRes.body?.studentPhone === '9840998877', 'Student phone preserved');

    // 9. Automated Database & File Backup Verification
    console.log('\n[TEST 9] Automated SQLite & JSON Database Backup:');
    const backupRes = await request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/admin/backup',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    assert(backupRes.status === 200, 'Database backup API returned HTTP 200');
    assert(backupRes.body?.ok === true, 'Database backup succeeded');

    const backupJsonPath = path.join(__dirname, '../data/backup_attendance.json');
    assert(fs.existsSync(backupJsonPath), 'Persistent JSON backup file exists on disk (data/backup_attendance.json)');
    if (fs.existsSync(backupJsonPath)) {
      const backupContent = JSON.parse(fs.readFileSync(backupJsonPath, 'utf8'));
      assert(backupContent.counts?.attendance > 0, `Backup contains ${backupContent.counts?.attendance} attendance records`);
    }

    const backupSqlitePath = path.join(__dirname, '../data/nithya-yoga-backup.sqlite');
    assert(fs.existsSync(backupSqlitePath), 'Persistent SQLite database backup snapshot exists on disk');

    console.log(`\n==========================================`);
    console.log(`TEST RESULTS: ${passedCount} / ${totalCount} PASSED`);
    console.log(`==========================================`);

    if (passedCount === totalCount) {
      console.log('🎉 ALL REQUIREMENTS FULLY SATISFIED!');
      process.exit(0);
    } else {
      console.error('Some tests failed.');
      process.exit(1);
    }
  } finally {
    if (server) {
      try { server.kill(); } catch (_) {}
    }
  }
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
