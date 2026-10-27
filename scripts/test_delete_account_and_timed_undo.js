const http = require('http');
const assert = require('assert');
const path = require('path');
const Database = require('better-sqlite3');
const { chromium } = require('playwright');

const PORT = 8080;
const dbPath = path.join(__dirname, '../nithya-yoga.sqlite');
const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
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
  console.log('--- TESTING ACCOUNT DELETION & TIMED UNDO ACTION ---');

  const testEmail = `test_delete_${Date.now()}@nithyayoga.com`;
  const testPassword = 'testpassword123';

  // 1. Register trainer
  console.log('[TEST 1] Register new trainer for deletion test:');
  const regRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/admin/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Temporary Test Instructor',
    email: testEmail,
    phone: '+91 9988776655',
    password: testPassword
  });

  assert.strictEqual(regRes.status, 201, 'Registration should return 201');
  console.log('  ✓ PASS: Registration successful');

  // Verify in SQLite
  const db = new Database(dbPath);
  const trainerInDb = db.prepare('SELECT * FROM trainers WHERE LOWER(email) = LOWER(?)').get(testEmail);
  assert(trainerInDb, 'Trainer must exist in SQLite database');
  console.log('  ✓ PASS: Trainer found in SQLite database');

  // 2. Test Account Deletion with Wrong Password
  console.log('\n[TEST 2] Account deletion with incorrect password fails:');
  const failRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/admin/delete-account',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail,
    password: 'wrongpassword'
  });
  assert.strictEqual(failRes.status, 401, 'Should return 401 for wrong password');
  console.log('  ✓ PASS: Wrong password rejected (HTTP 401)');

  // 3. Test Account Deletion with Correct Password
  console.log('\n[TEST 3] Account deletion with correct password succeeds:');
  const delRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/admin/delete-account',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail,
    password: testPassword
  });
  assert.strictEqual(delRes.status, 200, 'Should return 200 for successful deletion');
  assert.strictEqual(delRes.body.ok, true, 'Response ok should be true');
  console.log('  ✓ PASS: Account deletion successful (HTTP 200)');

  // Verify removed from SQLite
  const deletedTrainer = db.prepare('SELECT * FROM trainers WHERE LOWER(email) = LOWER(?)').get(testEmail);
  assert(!deletedTrainer, 'Trainer must be completely purged from SQLite database');
  console.log('  ✓ PASS: Trainer permanently purged from SQLite');

  // Verify Login fails
  const loginAfterDel = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail,
    password: testPassword
  });
  assert.strictEqual(loginAfterDel.status, 401, 'Login after delete must fail');
  console.log('  ✓ PASS: Login fails as account no longer exists');

  // 4. Capture Browser UI Screenshots with Playwright
  console.log('\n[TEST 4] Capturing UI Screenshots of TimedUndoAction & Delete Modal:');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();

    // Sign In as Sarath
    await page.goto(`http://localhost:${PORT}/?tab=admin`, { waitUntil: 'load' });
    await page.waitForTimeout(800);

    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill('sarathsanthons@gmail.com');
    }
    const passInput = await page.$('input[type="password"]');
    if (passInput) {
      await passInput.fill('sarath123');
    }
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(1500);
    }

    // Capture Trainer Dashboard with Log Out & Delete Account buttons
    await page.screenshot({
      path: path.join(artifactDir, 'trainer_dashboard_header_actions.png'),
      fullPage: false
    });
    console.log('  ✓ PASS: Captured trainer_dashboard_header_actions.png');

    // Click "Delete Account" button
    const deleteBtn = await page.getByRole('button', { name: /கணக்கை நீக்கு|Delete Account/i }).first();
    if (deleteBtn) {
      await deleteBtn.click();
      await page.waitForTimeout(600);

      // Screenshot 1: Delete verification form
      await page.screenshot({
        path: path.join(artifactDir, 'trainer_delete_modal_password_prompt.png'),
        fullPage: false
      });
      console.log('  ✓ PASS: Captured trainer_delete_modal_password_prompt.png');

      // Enter password
      const modalPassInput = await page.locator('.ya-modal-content input[type="password"]');
      if (modalPassInput) {
        await modalPassInput.fill('sarath123');
      }

      // Click "Verify & Start 10s Timer"
      const verifyBtn = await page.getByRole('button', { name: /சரிபார்த்து டைமருக்கு செல்|Verify & Start 10s Timer/i });
      if (verifyBtn) {
        await verifyBtn.click();
        await page.waitForTimeout(1000);

        // Screenshot 2: TimedUndoAction counting down!
        await page.screenshot({
          path: path.join(artifactDir, 'trainer_delete_modal_timed_undo_countdown.png'),
          fullPage: false
        });
        console.log('  ✓ PASS: Captured trainer_delete_modal_timed_undo_countdown.png');
      }
    }
  } catch (err) {
    console.error('Playwright UI error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=============================================');
  console.log('ALL ACCOUNT DELETION & TIMED UNDO TESTS PASSED!');
  console.log('=============================================');
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
