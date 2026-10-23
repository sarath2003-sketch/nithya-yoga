const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  
  p.on('console', m => console.log('CONSOLE:', m.text()));
  p.on('pageerror', e => console.log('PAGE_ERROR:', e.message));

  await p.goto('http://localhost:8080/');
  await p.waitForTimeout(1500);

  const items = await p.$$('.col-classes .class-row-item');
  console.log('Found items:', items.length);

  if (items.length > 0) {
    await items[0].scrollIntoViewIfNeeded();
    await items[0].click();
    console.log('Clicked item 0');
    await p.waitForTimeout(600);
    const modal = await p.$('.ya-modal-overlay');
    console.log('Found modal:', Boolean(modal));
    if (modal) {
      await p.screenshot({ path: 'C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf/updated_class_curriculum_modal_mobile.png' });
      console.log('Captured modal successfully!');
    }
  }

  await b.close();
})();
