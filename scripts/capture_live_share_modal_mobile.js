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
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
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

  // If update modal scrim appears, dismiss it
  const updateScrim = await page.$('.update-modal-backdrop-scrim, .update-btn-dismiss');
  if (updateScrim) {
    console.log('Dismissing update modal scrim...');
    await page.evaluate(() => {
      const scrim = document.querySelector('.update-modal-backdrop-scrim');
      if (scrim) scrim.remove();
    });
    await page.waitForTimeout(500);
  }

  // Switch to Live Class tab via bottom navigation
  console.log('Switching to live tab...');
  await page.evaluate(() => {
    const liveBtn = Array.from(document.querySelectorAll('.mobile-dock-item, .pill-nav-btn, button')).find(
      el => el.textContent.includes('Live') || el.getAttribute('aria-label')?.includes('Live')
    );
    if (liveBtn) liveBtn.click();
  });
  await page.waitForTimeout(1200);

  // Click Start Live Class
  console.log('Looking for start class button...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent.includes('Start Live') || b.textContent.includes('Create Live') || b.classList.contains('btn-start-class-live')
    );
    if (btn) btn.click();
  });
  await page.waitForTimeout(1000);

  // Check if modal is visible
  const modalEl = await page.$('.live-share-modal-overlay');
  console.log('Share modal visible:', !!modalEl);

  // Capture full screen screenshot at initial scroll
  const screenshotTop = path.join(artifactDir, 'mobile_share_modal_fixed_top.png');
  await page.screenshot({ path: screenshotTop, fullPage: false });
  console.log('✓ Captured top of share modal on mobile:', screenshotTop);

  // Scroll overlay down to verify action buttons
  if (modalEl) {
    await page.evaluate(() => {
      const overlay = document.querySelector('.live-share-modal-overlay');
      if (overlay) {
        overlay.scrollTop = overlay.scrollHeight;
      }
    });
    await page.waitForTimeout(500);

    const screenshotBottom = path.join(artifactDir, 'mobile_share_modal_fixed_scrolled.png');
    await page.screenshot({ path: screenshotBottom, fullPage: false });
    console.log('✓ Captured bottom action buttons on mobile:', screenshotBottom);
  }

  await browser.close();
  console.log('Done!');
})();
