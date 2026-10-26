const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

async function main() {
  console.log('--- Starting Server on Port 8080 ---');
  const server = spawn('node', ['serve.js'], {
    env: { ...process.env, PORT: '8080' },
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe'
  });

  server.stdout.on('data', d => console.log('[Server]', d.toString().trim()));
  server.stderr.on('data', d => console.error('[Server Err]', d.toString().trim()));

  // Wait for server to print ready message
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server boot timeout')), 12000);
    server.stdout.on('data', d => {
      const text = d.toString();
      if (text.includes('running on http')) {
        clearTimeout(timer);
        resolve();
      }
    });
  });

  console.log('✓ Server is live and ready on port 8080');

  console.log('--- Launching Browser ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    // 1. Desktop Light Mode — Create Account Tab (User's Exact Screen)
    console.log('Capturing Desktop Create Account Screen...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.addInitScript(() => {
      localStorage.removeItem('nithya_admin_token');
      localStorage.removeItem('nithya_teacher_token');
      localStorage.setItem('nithya_theme', 'light');
      localStorage.setItem('nithya_active_tab', 'admin');
    });

    await desktopPage.goto('http://localhost:8080/?tab=admin', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(600);

    // If still not on admin tab, click sidebar Trainer Portal button
    const trainerPortalBtn = await desktopPage.$('button:has-text("Trainer Portal"), aside div:has-text("Trainer Portal")');
    if (trainerPortalBtn) {
      await trainerPortalBtn.click();
      await desktopPage.waitForTimeout(600);
    }

    // Click "Create Account" tab
    const createAccountTab = await desktopPage.$('.admin-auth-tab-btn:has-text("Create Account"), button:has-text("Create Account")');
    if (createAccountTab) {
      await createAccountTab.click();
      await desktopPage.waitForTimeout(400);
    }

    const createAccountPath = path.join(artifactDir, 'trainer_portal_create_account_redesign.png');
    await desktopPage.screenshot({ path: createAccountPath, fullPage: false });
    console.log('Saved:', createAccountPath);

    // 2. Desktop Light Mode — Sign In Tab
    console.log('Capturing Desktop Sign In Screen...');
    const signInTab = await desktopPage.$('button:has-text("Sign In")');
    if (signInTab) {
      await signInTab.click();
      await desktopPage.waitForTimeout(400);
    }
    const signInPath = path.join(artifactDir, 'trainer_portal_signin_redesign.png');
    await desktopPage.screenshot({ path: signInPath, fullPage: false });
    console.log('Saved:', signInPath);

    // 3. Mobile View (390 x 844) — Create Account
    console.log('Capturing Mobile Create Account Screen...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      deviceScaleFactor: 2
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.addInitScript(() => {
      localStorage.removeItem('nithya_admin_token');
      localStorage.removeItem('nithya_teacher_token');
      localStorage.setItem('nithya_theme', 'light');
      localStorage.setItem('nithya_active_tab', 'admin');
    });

    await mobilePage.goto('http://localhost:8080/?tab=admin', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(600);

    const mobileCreateTab = await mobilePage.$('.admin-auth-tab-btn:has-text("Create Account"), button:has-text("Create Account")');
    if (mobileCreateTab) {
      await mobileCreateTab.click();
      await mobilePage.waitForTimeout(400);
    }
    const mobilePath = path.join(artifactDir, 'trainer_portal_mobile_redesign.png');
    await mobilePage.screenshot({ path: mobilePath, fullPage: false });
    console.log('Saved:', mobilePath);

    console.log('--- ALL SCREENSHOTS CAPTURED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main();
