const { chromium } = require('playwright');
const path = require('path');

const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Desktop Home - Light Theme (1440x960)
  const contextLight = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const pageLight = await contextLight.newPage();
  await pageLight.goto('http://localhost:8080/');
  await pageLight.waitForTimeout(2000);
  const homeLightOut = path.join(artifactDir, 'premium_yoga_home_desktop.png');
  await pageLight.screenshot({ path: homeLightOut, fullPage: false });
  console.log('✓ Desktop Home screenshot saved:', homeLightOut);

  // 2. Desktop Home - Dark Theme (Midnight Navy & Violet Aura)
  await pageLight.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('nithya_theme', 'dark');
  });
  await pageLight.waitForTimeout(1000);
  const homeDarkOut = path.join(artifactDir, 'premium_yoga_home_dark_desktop.png');
  await pageLight.screenshot({ path: homeDarkOut, fullPage: false });
  console.log('✓ Desktop Home Dark Theme screenshot saved:', homeDarkOut);

  // Reset back to light
  await pageLight.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('nithya_theme', 'light');
  });

  // 3. Mobile Home (390x844)
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:8080/');
  await pageMobile.waitForTimeout(2000);
  const mobileHomeOut = path.join(artifactDir, 'premium_yoga_home_mobile.png');
  await pageMobile.screenshot({ path: mobileHomeOut, fullPage: false });
  console.log('✓ Mobile Home screenshot saved:', mobileHomeOut);

  // 4. Desktop Live Classroom
  const pageLive = await contextLight.newPage();
  await pageLive.goto('http://localhost:8080/?tab=live');
  await pageLive.waitForTimeout(2000);
  const joinBtn = await pageLive.$('.btn-join-studio');
  if (joinBtn) {
    await joinBtn.click();
    await pageLive.waitForTimeout(2500);
  }
  const liveDesktopOut = path.join(artifactDir, 'premium_yoga_live_desktop.png');
  await pageLive.screenshot({ path: liveDesktopOut, fullPage: false });
  console.log('✓ Live Classroom Desktop screenshot saved:', liveDesktopOut);

  // 5. Mobile Live Classroom
  const pageLiveMobile = await contextMobile.newPage();
  await pageLiveMobile.goto('http://localhost:8080/?tab=live');
  await pageLiveMobile.waitForTimeout(2000);
  const mJoinBtn = await pageLiveMobile.$('.btn-join-studio');
  if (mJoinBtn) {
    await mJoinBtn.click();
    await pageLiveMobile.waitForTimeout(2500);
  }
  const liveMobileOut = path.join(artifactDir, 'premium_yoga_live_mobile.png');
  await pageLiveMobile.screenshot({ path: liveMobileOut, fullPage: false });
  console.log('✓ Live Classroom Mobile screenshot saved:', liveMobileOut);

  await browser.close();
  console.log('🎉 All premium yoga screenshots captured successfully!');
})();
