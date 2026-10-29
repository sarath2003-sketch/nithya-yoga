const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  for (const w of [375, 1280]) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(1000);
    const colLive = page.locator('.col-live');
    if (await colLive.count() > 0) {
      await colLive.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const snapPath = path.resolve(`C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf/col_live_${w}px.png`);
      await colLive.screenshot({ path: snapPath });
      console.log(`Saved screenshot for ${w}px: ${snapPath}`);
    }
    await page.close();
  }
  await browser.close();
})();
