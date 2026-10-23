const { chromium } = require('playwright');
const path = require('path');
const Database = require('better-sqlite3');

const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

function setDbClassStatus(status) {
  const db = new Database('nithya-yoga.sqlite');
  db.prepare("UPDATE classes SET status=? WHERE id='cls-1'").run(status);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Idle Dark Mobile with glowing lotus
  setDbClassStatus('scheduled');
  const contextIdle = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageIdle = await contextIdle.newPage();
  await pageIdle.addInitScript(() => {
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_theme', 'dark');
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });
  await pageIdle.goto('http://localhost:8080/');
  await pageIdle.waitForTimeout(1800);
  const studioElIdle = await pageIdle.$('.live-studio-card-container');
  if (studioElIdle) {
    await studioElIdle.scrollIntoViewIfNeeded();
    await pageIdle.waitForTimeout(300);
    const boxMobileIdleDark = path.join(artifactDir, 'live_studio_instructor_idle_dark_mobile.png');
    await studioElIdle.screenshot({ path: boxMobileIdleDark });
    console.log('✓ Captured mobile instructor idle dark with glowing lotus:', boxMobileIdleDark);
  }
  await contextIdle.close();

  // 2. Set class status to 'live'
  setDbClassStatus('live');

  // 3. Mobile Live State (Dark Theme)
  const contextMobileLive = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageMobileLive = await contextMobileLive.newPage();
  await pageMobileLive.addInitScript(() => {
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_theme', 'dark');
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });
  await pageMobileLive.goto('http://localhost:8080/');
  await pageMobileLive.waitForTimeout(2000);
  const studioElLive = await pageMobileLive.$('.live-studio-card-container');
  if (studioElLive) {
    await studioElLive.scrollIntoViewIfNeeded();
    await pageMobileLive.waitForTimeout(400);
    const boxMobileLiveDark = path.join(artifactDir, 'live_studio_instructor_live_dark_mobile.png');
    await studioElLive.screenshot({ path: boxMobileLiveDark });
    console.log('✓ Captured mobile instructor live dark state:', boxMobileLiveDark);

    // Also light theme live
    await pageMobileLive.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('nithya_theme', 'light');
    });
    await pageMobileLive.waitForTimeout(400);
    const boxMobileLiveLight = path.join(artifactDir, 'live_studio_instructor_live_light_mobile.png');
    await studioElLive.screenshot({ path: boxMobileLiveLight });
    console.log('✓ Captured mobile instructor live light state:', boxMobileLiveLight);
  }
  await contextMobileLive.close();

  // 4. Desktop Live State (Dark Theme)
  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.addInitScript(() => {
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_theme', 'dark');
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });
  await pageDesktop.goto('http://localhost:8080/');
  await pageDesktop.waitForTimeout(2000);
  const studioDesktopLive = await pageDesktop.$('.live-studio-card-container');
  if (studioDesktopLive) {
    await studioDesktopLive.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(400);
    const boxDesktopLive = path.join(artifactDir, 'live_studio_instructor_live_desktop.png');
    await studioDesktopLive.screenshot({ path: boxDesktopLive });
    console.log('✓ Captured desktop live state:', boxDesktopLive);
  }
  await contextDesktop.close();

  // Reset database back to scheduled for normal use
  setDbClassStatus('scheduled');

  await browser.close();
  console.log('All live state screenshots captured successfully!');
})();
