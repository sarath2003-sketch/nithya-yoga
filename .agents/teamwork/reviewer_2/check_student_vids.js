const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://127.0.0.1:8080/?tab=student', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  const vids = await page.evaluate(() => {
    const imgs = document.querySelectorAll('.student-dashboard-portal img');
    return Array.from(imgs).map(img => ({
      src: img.src,
      width: img.clientWidth,
      height: img.clientHeight,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      parentWidth: img.parentElement ? img.parentElement.clientWidth : null,
      parentHeight: img.parentElement ? img.parentElement.clientHeight : null
    }));
  });
  console.log('Student dashboard images:', JSON.stringify(vids, null, 2));
  await browser.close();
})();
