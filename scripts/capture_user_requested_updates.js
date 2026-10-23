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

  // 1. Mobile Home View (390x844)
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.addInitScript(() => {
    localStorage.setItem('nithya_theme', JSON.stringify('dark'));
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });
  await pageMobile.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await pageMobile.waitForTimeout(2000);

  // Screenshot Hero section with 4 interactive cards
  const heroEl = await pageMobile.$('.pastel-hero-container');
  if (heroEl) {
    const heroOut = path.join(artifactDir, 'updated_hero_interactive_cards_mobile.png');
    await heroEl.screenshot({ path: heroOut });
    console.log('✓ Captured Hero interactive cards:', heroOut);
  }

  // Screenshot Live Class Studio with official logo
  const studioEl = await pageMobile.$('.live-studio-card-container');
  if (studioEl) {
    await studioEl.scrollIntoViewIfNeeded();
    await pageMobile.waitForTimeout(300);
    const studioOut = path.join(artifactDir, 'updated_live_studio_official_logo_mobile.png');
    await studioEl.screenshot({ path: studioOut });
    console.log('✓ Captured Live Studio with official logo:', studioOut);
  }

  // Click a class to show curriculum modal
  const classItem = await pageMobile.$('.class-row-item');
  if (classItem) {
    await classItem.scrollIntoViewIfNeeded();
    await pageMobile.waitForTimeout(300);
    console.log('Clicking class item to open curriculum modal...');
    await classItem.click();
    await pageMobile.waitForTimeout(500);
    const modalOut = path.join(artifactDir, 'updated_class_curriculum_modal_mobile.png');
    await pageMobile.screenshot({ path: modalOut });
    console.log('✓ Captured Class Curriculum modal:', modalOut);
  }

  // 2. Desktop View (1440x960) showing sidebar with official logo
  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.addInitScript(() => {
    localStorage.setItem('nithya_theme', JSON.stringify('dark'));
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });
  await pageDesktop.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await pageDesktop.waitForTimeout(2000);

  const sidebarEl = await pageDesktop.$('.app-sidebar-nav');
  if (sidebarEl) {
    const sidebarOut = path.join(artifactDir, 'updated_sidebar_official_logo_desktop.png');
    await sidebarEl.screenshot({ path: sidebarOut });
    console.log('✓ Captured Sidebar with official logo:', sidebarOut);
  }

  await browser.close();
  console.log('All verification screenshots saved successfully!');
})();
