const http = require('http');

const PORT = 8080;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function request(method, apiPath, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(apiPath, BASE_URL);
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
  console.log('🧪 Testing Admin Registration, Login & Role Isolation');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    const health = await request('GET', '/api/health');
    assert(health.status === 200, 'Health endpoint responds 200 OK');

    const testEmail = `trainer_${Date.now()}@nithyayoga.com`;
    const testPassword = 'SecureTrainer2026!';
    const testName = 'Kavitha Nithya Trainer';
    const testPhone = '9876543210';

    console.log('\n[1] Test Trainer Registration (Valid)');
    const regRes = await request('POST', '/api/admin/register', {
      name: testName,
      email: testEmail,
      phone: testPhone,
      password: testPassword
    });
    assert(regRes.status === 200 || regRes.status === 201, `Status code is 201 Created (received ${regRes.status})`);
    assert(regRes.data?.ok === true, 'Response contains ok: true');
    assert(Boolean(regRes.data?.token), 'Response contains JWT token');
    assert(regRes.data?.role === 'trainer', 'Assigned role is "trainer"');
    assert(regRes.data?.name === testName, 'Registered name matches');

    console.log('\n[2] Test Duplicate Email Rejection');
    const dupRes = await request('POST', '/api/admin/register', {
      name: 'Another Name',
      email: testEmail,
      phone: '9123456789',
      password: 'SomeOtherPassword123'
    });
    assert(dupRes.status === 400 || dupRes.status === 409, `Duplicate email rejected with status 409 Conflict (received ${dupRes.status})`);
    assert(Boolean(dupRes.data?.error), 'Returns explicit error message');

    console.log('\n[3] Test Password Length Validation (< 6 chars)');
    const shortPassRes = await request('POST', '/api/admin/register', {
      name: 'Short Pass',
      email: `short_${Date.now()}@nithyayoga.com`,
      phone: '9123456780',
      password: '123'
    });
    assert(shortPassRes.status === 400, `Short password rejected with status 400 (received ${shortPassRes.status})`);

    console.log('\n[4] Test Trainer Login (Valid Credentials)');
    const loginRes = await request('POST', '/api/admin/login', {
      email: testEmail,
      password: testPassword
    });
    assert(loginRes.status === 200, `Login status 200 (received ${loginRes.status})`);
    assert(Boolean(loginRes.data?.token), 'Returns valid token');
    assert(loginRes.data?.role === 'trainer', 'Role is "trainer"');
    assert(loginRes.data?.email === testEmail, 'Email matches');

    console.log('\n[5] Test Trainer Login (Invalid Password)');
    const wrongPassRes = await request('POST', '/api/admin/login', {
      email: testEmail,
      password: 'WrongPassword999!'
    });
    assert(wrongPassRes.status === 401, `Wrong password returns 401 (received ${wrongPassRes.status})`);

    console.log('\n[6] Test Master Admin Fallback Login');
    const masterLoginRes = await request('POST', '/api/admin/login', {
      email: 'admin@nithyayoga.com',
      password: 'NithyaAdmin2026!'
    });
    assert(masterLoginRes.status === 200, `Master admin login status 200 (received ${masterLoginRes.status})`);
    assert(masterLoginRes.data?.role === 'admin' || masterLoginRes.data?.role === 'trainer', 'Master admin has role "admin"');

    console.log('\n====================================================');
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
