const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://127.0.0.1:8080', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  const res = await page.evaluate(() => {
    // Check if .col-live img has style
    const img = document.querySelector('.col-live img');
    return {
      rect: img.getBoundingClientRect(),
      parentRect: img.parentElement.getBoundingClientRect(),
      grandParentRect: img.parentElement.parentElement.getBoundingClientRect()
    };
  });
  console.log('Layout rects:', JSON.stringify(res, null, 2));
  await browser.close();
})();
