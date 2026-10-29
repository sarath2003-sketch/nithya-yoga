const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://127.0.0.1:8080', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  const info = await page.evaluate(() => {
    const img = document.querySelector('.col-live img[src*="chakra"]');
    if (!img) return 'Image not found';
    const parent = img.parentElement;
    const grandParent = parent ? parent.parentElement : null;
    return {
      imgWidth: img.clientWidth,
      imgHeight: img.clientHeight,
      imgNaturalWidth: img.naturalWidth,
      imgNaturalHeight: img.naturalHeight,
      parentWidth: parent ? parent.clientWidth : null,
      parentHeight: parent ? parent.clientHeight : null,
      parentClasses: parent ? parent.className : '',
      grandParentClasses: grandParent ? grandParent.className : '',
      parentComputed: parent ? {
        width: window.getComputedStyle(parent).width,
        height: window.getComputedStyle(parent).height,
        display: window.getComputedStyle(parent).display
      } : null,
      imgComputed: {
        width: window.getComputedStyle(img).width,
        height: window.getComputedStyle(img).height,
        objectFit: window.getComputedStyle(img).objectFit
      }
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
