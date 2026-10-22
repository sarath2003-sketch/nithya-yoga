const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // 1. Desktop 1440x960
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  await page.goto('http://localhost:8080/?tab=live');
  await page.waitForTimeout(2000);

  // If in lobby, click Enter Live Yoga Room
  const joinBtn = await page.$('.btn-join-studio');
  if (joinBtn) {
    console.log('Clicking Enter Live Yoga Room on desktop...');
    await joinBtn.click();
    await page.waitForTimeout(3000);
  }

  const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';
  const desktopOut = path.join(artifactDir, 'figma_live_class_desktop.png');
  await page.screenshot({ path: desktopOut, fullPage: true });
  console.log('Desktop screenshot saved to:', desktopOut);

  // 2. Mobile 390x844
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:8080/?tab=live');
  await mobilePage.waitForTimeout(2000);

  const mJoinBtn = await mobilePage.$('.btn-join-studio');
  if (mJoinBtn) {
    console.log('Clicking Enter Live Yoga Room on mobile...');
    await mJoinBtn.click();
    await mobilePage.waitForSelector('.figma-live-classroom-container', { timeout: 10000 }).catch(() => {});
    await mobilePage.waitForTimeout(1500);
  }

  const mobileOut = path.join(artifactDir, 'figma_live_class_mobile.png');
  await mobilePage.screenshot({ path: mobileOut, fullPage: false });
  console.log('Mobile screenshot saved to:', mobileOut);

  await browser.close();
  console.log('Done capturing live class Figma screenshots!');
})();
