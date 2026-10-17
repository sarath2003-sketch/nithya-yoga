const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const outDir = path.resolve(__dirname, '../dist/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Navigating to http://localhost:8080/ ...');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Capture light theme
  const lightPath = path.join(outDir, 'dashboard-light-theme.png');
  await page.screenshot({ path: lightPath, fullPage: false });
  console.log('✓ Captured light theme screenshot:', lightPath);

  // Toggle dark mode via theme button
  const themeToggle = await page.$('.theme-toggle-btn');
  if (themeToggle) {
    await themeToggle.click();
    await page.waitForTimeout(500);
    const darkPath = path.join(outDir, 'dashboard-dark-theme.png');
    await page.screenshot({ path: darkPath, fullPage: false });
    console.log('✓ Captured dark theme screenshot:', darkPath);
  }

  // Mobile viewport test (390x844 - iPhone 13/14)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const mobilePath = path.join(outDir, 'mobile-viewport.png');
  await page.screenshot({ path: mobilePath, fullPage: false });
  console.log('✓ Captured mobile viewport screenshot:', mobilePath);

  await browser.close();
  console.log('✓ All visual screenshot captures completed successfully!');
}

captureScreenshots().catch(err => {
  console.error('Screenshot capture error:', err);
  process.exit(1);
});
