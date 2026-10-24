const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const artifactDir = path.resolve('C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  
  // 1. Mobile viewport
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 }).catch(async () => {
    await mobilePage.goto('http://localhost:8080/', { waitUntil: 'load' });
  });
  await mobilePage.waitForTimeout(2000);
  
  const mobilePath = path.join(artifactDir, 'chatgpt_deployed_site_mobile.png');
  await mobilePage.screenshot({ path: mobilePath, fullPage: false });
  console.log('Mobile screenshot saved to:', mobilePath);

  // Live class tab on mobile
  try {
    const liveNav = await mobilePage.$('button[aria-label*="நேரலை"], button[aria-label*="Live"]');
    if (liveNav) {
      await liveNav.click();
      await mobilePage.waitForTimeout(1500);
      const liveMobilePath = path.join(artifactDir, 'chatgpt_deployed_live_studio_mobile.png');
      await mobilePage.screenshot({ path: liveMobilePath, fullPage: false });
      console.log('Live studio mobile screenshot saved to:', liveMobilePath);
    }
  } catch (e) {
    console.error('Live tab click error:', e.message);
  }

  // 2. Desktop viewport
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 15000 }).catch(async () => {
    await desktopPage.goto('http://localhost:8080/', { waitUntil: 'load' });
  });
  await desktopPage.waitForTimeout(2000);
  
  const desktopPath = path.join(artifactDir, 'chatgpt_deployed_site_desktop.png');
  await desktopPage.screenshot({ path: desktopPath, fullPage: false });
  console.log('Desktop screenshot saved to:', desktopPath);

  await browser.close();
  console.log('Done capturing screenshots!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
