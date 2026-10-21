const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureTabs() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 13/14 / Android Standard
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const outDir = path.resolve(__dirname, '../dist/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Navigating to http://localhost:8080/ ...');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Home
  await page.screenshot({ path: path.join(outDir, 'tab-home.png') });
  console.log('✓ Captured tab-home.png');

  // 2. Yoga Classes
  await page.click('button.pill-nav-btn:has-text("Yoga")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'tab-yoga.png') });
  console.log('✓ Captured tab-yoga.png');

  // 3. Reminders
  await page.click('button.pill-nav-btn:has-text("Reminders")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'tab-reminders.png') });
  console.log('✓ Captured tab-reminders.png');

  // 4. Profile
  await page.click('button.pill-nav-btn:has-text("Profile")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'tab-profile.png') });
  console.log('✓ Captured tab-profile.png');

  await browser.close();
  console.log('✓ All tab screenshots captured successfully!');
}

captureTabs().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
