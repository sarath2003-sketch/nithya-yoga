const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const viewports = [320, 360, 390, 430, 768, 1280];
  for (const w of viewports) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.goto('http://127.0.0.1:8080', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const data = await page.evaluate(() => {
      const img = document.querySelector('.col-live img[src*="chakra"]');
      if (!img) return null;
      const r = img.getBoundingClientRect();
      const p = img.parentElement.getBoundingClientRect();
      return {
        imgWidth: r.width,
        imgHeight: r.height,
        parentWidth: p.width,
        parentHeight: p.height
      };
    });
    console.log(`Viewport ${w}px:`, JSON.stringify(data));
    await page.close();
  }
  await browser.close();
})();
