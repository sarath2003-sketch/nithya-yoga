const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(1000);
  const chain = await page.evaluate(() => {
    const card = document.querySelector('.col-live');
    const img = card ? card.querySelector('img[src*="chakra"]') : null;
    let el = img;
    const res = [];
    while (el) {
      const comp = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      res.push({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        overflow: comp.overflow,
        overflowX: comp.overflowX,
        overflowY: comp.overflowY,
        width: comp.width,
        height: comp.height,
        rectWidth: rect.width,
        rectHeight: rect.height,
        rectLeft: rect.left,
        rectRight: rect.right
      });
      el = el.parentElement;
    }
    return res;
  });
  console.log(JSON.stringify(chain, null, 2));
  await browser.close();
})();
