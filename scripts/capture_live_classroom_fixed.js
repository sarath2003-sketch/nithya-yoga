const { chromium } = require('playwright');
const path = require('path');
const Database = require('better-sqlite3');

const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

function setDbClassStatus(status) {
  const db = new Database('nithya-yoga.sqlite');
  db.prepare("UPDATE classes SET status=? WHERE id='cls-1'").run(status);
}

(async () => {
  setDbClassStatus('scheduled');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    permissions: ['camera', 'microphone']
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('nithya_theme', JSON.stringify('dark'));
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });

  console.log('Navigating to app...');
  await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Dismiss update modal scrim if present
  await page.evaluate(() => {
    const scrim = document.querySelector('.update-modal-backdrop-scrim');
    if (scrim) scrim.remove();
  });
  await page.waitForTimeout(400);

  // Switch to live tab
  console.log('Switching to live tab...');
  await page.evaluate(() => {
    const liveBtn = Array.from(document.querySelectorAll('.mobile-dock-item, .pill-nav-btn, button')).find(
      el => el.textContent.includes('Live') || el.getAttribute('aria-label')?.includes('Live')
    );
    if (liveBtn) liveBtn.click();
  });
  await page.waitForTimeout(1000);

  // Click start live class to open share modal
  console.log('Clicking start live class...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent.includes('Start Live') || b.textContent.includes('Create Live') || b.classList.contains('btn-start-class-live')
    );
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);

  // Click continue to classroom button
  console.log('Clicking continue to classroom...');
  await page.evaluate(() => {
    const continueBtn = document.querySelector('#continueBtn') || document.querySelector('.btn-continue-primary') || Array.from(document.querySelectorAll('button')).find(
      b => b.textContent.includes('Continue to Live')
    );
    if (continueBtn) continueBtn.click();
  });

  // Wait for WebRTC connection to complete
  console.log('Waiting for connected room to render...');
  await page.waitForSelector('.figma-live-classroom-container', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Capture full screen of the connected live classroom (initial scroll)
  const screenshotConnected = path.join(artifactDir, 'mobile_live_classroom_connected.png');
  await page.screenshot({ path: screenshotConnected, fullPage: false });
  console.log('✓ Captured mobile live classroom connected view:', screenshotConnected);

  // Scroll down slightly so video and floating call controls dock are visible
  await page.evaluate(() => {
    window.scrollTo({ top: 140, behavior: 'instant' });
  });
  await page.waitForTimeout(500);

  const screenshotControls = path.join(artifactDir, 'mobile_live_classroom_controls.png');
  await page.screenshot({ path: screenshotControls, fullPage: false });
  console.log('✓ Captured mobile live classroom call controls dock:', screenshotControls);

  await browser.close();
  console.log('Done!');
})();
