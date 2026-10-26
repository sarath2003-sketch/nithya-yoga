const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 8093;
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
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 950 }
    });
    const page = await desktopContext.newPage();

    console.log('Navigating to Admin Portal...');
    await page.goto(`http://localhost:${PORT}/?tab=admin`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Sign in as default admin
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    if (emailInput && passwordInput) {
      console.log('Logging in as trainer...');
      await emailInput.fill('admin@nithyayoga.com');
      await passwordInput.fill('NithyaAdmin2026!');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await page.waitForTimeout(2000);
    }

    // 1. Capture Main Luxury Classes & KPIs Tab
    console.log('1. Capturing Main Luxury Classes & KPIs Tab...');
    await page.screenshot({
      path: path.join(artifactDir, 'trainer_dashboard_luxury_ui.png'),
      fullPage: false
    });
    console.log('Captured trainer_dashboard_luxury_ui.png');

    // 2. Capture Pre-Flight Studio Checklist Tab
    console.log('2. Capturing Studio Checklist Tab...');
    const checklistTabBtn = await page.$('button:has-text("Studio Checklist"), button:has-text("ஸ்டுடியோ சோதனை")');
    if (checklistTabBtn) {
      await checklistTabBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(artifactDir, 'trainer_dashboard_studio_checklist.png'),
        fullPage: false
      });
      console.log('Captured trainer_dashboard_studio_checklist.png');
    }

    // 3. Capture Asana Curriculum Tab
    console.log('3. Capturing Asana Curriculum Tab...');
    const curriculumTabBtn = await page.$('button:has-text("Asana Curriculum"), button:has-text("பாடத்திட்டம்")');
    if (curriculumTabBtn) {
      await curriculumTabBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(artifactDir, 'trainer_dashboard_asana_curriculum.png'),
        fullPage: false
      });
      console.log('Captured trainer_dashboard_asana_curriculum.png');
    }

    // 4. Capture Studio Themes Tab
    console.log('4. Capturing Studio Themes Tab...');
    const themesTabBtn = await page.$('button:has-text("Studio Themes"), button:has-text("ஸ்டுடியோ தீம்கள்")');
    if (themesTabBtn) {
      await themesTabBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(artifactDir, 'trainer_dashboard_studio_themes.png'),
        fullPage: false
      });
      console.log('Captured trainer_dashboard_studio_themes.png');

      // Click on Ayurvedic Emerald theme to activate it
      console.log('5. Activating Ayurvedic Emerald theme...');
      const emeraldCard = await page.$('h4:has-text("Ayurvedic Emerald Forest")');
      if (emeraldCard) {
        await emeraldCard.click();
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(artifactDir, 'trainer_dashboard_emerald_theme.png'),
          fullPage: false
        });
        console.log('Captured trainer_dashboard_emerald_theme.png');
      }
    }

    // 6. Mobile Viewport (390x844)
    console.log('6. Capturing Mobile Viewport...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`http://localhost:${PORT}/?tab=admin`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    const mEmail = await mobilePage.$('input[type="email"]');
    const mPass = await mobilePage.$('input[type="password"]');
    if (mEmail && mPass) {
      await mEmail.fill('admin@nithyayoga.com');
      await mPass.fill('NithyaAdmin2026!');
      const mSubmit = await mobilePage.$('button[type="submit"]');
      if (mSubmit) await mSubmit.click();
      await mobilePage.waitForTimeout(2000);
    }

    await mobilePage.screenshot({
      path: path.join(artifactDir, 'trainer_dashboard_mobile_view.png'),
      fullPage: false
    });
    console.log('Captured trainer_dashboard_mobile_view.png');

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
