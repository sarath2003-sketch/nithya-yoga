const { chromium } = require('playwright');
const path = require('path');
const Database = require('better-sqlite3');

const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

function setDbClassStatus(status) {
  const db = new Database('nithya-yoga.sqlite');
  db.prepare("UPDATE classes SET status=? WHERE id='cls-1'").run(status);
}

(async () => {
  setDbClassStatus('live');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Mobile Dark Theme Live (390x844)
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageMobile = await contextMobile.newPage();
  
  await pageMobile.addInitScript(() => {
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_theme', JSON.stringify('dark'));
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });

  await pageMobile.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await pageMobile.waitForTimeout(2000);
  
  const studioEl = await pageMobile.$('.live-studio-card-container');
  if (studioEl) {
    await studioEl.scrollIntoViewIfNeeded();
    await pageMobile.waitForTimeout(400);
    const mobileDarkLive = path.join(artifactDir, 'live_studio_instructor_live_dark_mobile.png');
    await studioEl.screenshot({ path: mobileDarkLive });
    console.log('✓ Captured mobile instructor dark theme live state:', mobileDarkLive);
  }

  // 2. Desktop Dark Theme Live (1440x960)
  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.addInitScript(() => {
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_theme', JSON.stringify('dark'));
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });

  await pageDesktop.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await pageDesktop.waitForTimeout(2000);
  const studioDesktop = await pageDesktop.$('.live-studio-card-container');
  if (studioDesktop) {
    await studioDesktop.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(400);
    const desktopDarkLive = path.join(artifactDir, 'live_studio_instructor_live_dark_desktop.png');
    await studioDesktop.screenshot({ path: desktopDarkLive });
    console.log('✓ Captured desktop instructor dark theme live state:', desktopDarkLive);
  }

  // 3. Reset db back to scheduled
  setDbClassStatus('scheduled');

  await browser.close();
  console.log('Verification finished successfully!');
})();
