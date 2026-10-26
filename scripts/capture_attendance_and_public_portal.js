const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 8092;
const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

async function capture() {
  console.log('Starting server on port ' + PORT + '...');
  const server = spawn('node', ['serve.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      if (data.toString().includes('NITHYA Yoga & Wellness Full Server running')) {
        resolve();
      }
    });
    setTimeout(resolve, 3000);
  });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    // 1. Mobile Public View (Bottom Bar showing Public Portal, Reminders, Yoga, Admin Portal)
    console.log('Capturing Mobile Public Portal...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`http://localhost:${PORT}/?tab=home`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: path.join(artifactDir, 'public_portal_mobile_view.png'),
      fullPage: false
    });
    console.log('Captured public_portal_mobile_view.png');

    // 2. Desktop Public View
    console.log('Capturing Desktop Public Portal...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(`http://localhost:${PORT}/?tab=home`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(artifactDir, 'public_portal_desktop_view.png')
    });
    console.log('Captured public_portal_desktop_view.png');

    // 3. Admin Portal Authenticated View with Student Attendance & Duration Analytics (Kumar)
    console.log('Capturing Admin Portal Student Attendance Analytics...');
    const adminPage = await desktopContext.newPage();
    await adminPage.goto(`http://localhost:${PORT}/?tab=admin`, { waitUntil: 'networkidle' });
    await adminPage.waitForTimeout(800);

    // Sign in as default admin
    const emailInput = await adminPage.$('input[type="email"]');
    const passwordInput = await adminPage.$('input[type="password"]');
    if (emailInput && passwordInput) {
      await emailInput.fill('admin@nithyayoga.com');
      await passwordInput.fill('NithyaAdmin2026!');
      const submitBtn = await adminPage.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await adminPage.waitForTimeout(1500);
    }

    // Click on Attendance Tab inside Admin Portal
    const attendanceTabBtn = await adminPage.$('button:has-text("Attendance"), button:has-text("வருகைப் பதிவு")');
    if (attendanceTabBtn) {
      await attendanceTabBtn.click();
      await adminPage.waitForTimeout(1200);
    }

    await adminPage.screenshot({
      path: path.join(artifactDir, 'admin_portal_student_attendance_analytics.png'),
      fullPage: true
    });
    console.log('Captured admin_portal_student_attendance_analytics.png');

    // 4. Admin Portal Live Classes Tab (Showing Create & Launch Live Class)
    const classesTabBtn = await adminPage.$('button:has-text("Live Classes"), button:has-text("வகுப்புகள்")');
    if (classesTabBtn) {
      await classesTabBtn.click();
      await adminPage.waitForTimeout(800);
      await adminPage.screenshot({
        path: path.join(artifactDir, 'admin_portal_live_class_creator.png')
      });
      console.log('Captured admin_portal_live_class_creator.png');
    }

    await mobileContext.close();
    await desktopContext.close();
  } finally {
    await browser.close();
    server.kill();
  }
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
