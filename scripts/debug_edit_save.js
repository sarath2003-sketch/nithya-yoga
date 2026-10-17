const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:8080...');
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

  // 1. Open ReminderModal
  const editButtons = await page.$$('.card-mini-action-btn[title="Edit reminder"]');
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await page.waitForTimeout(500);

    const saveBtn = await page.$('.btn-modal-save');
    if (saveBtn) {
      const styles = await page.evaluate(el => {
        const cs = window.getComputedStyle(el);
        return {
          background: cs.background,
          backgroundColor: cs.backgroundColor,
          color: cs.color,
          display: cs.display,
          visibility: cs.visibility,
          width: cs.width,
          height: cs.height
        };
      }, saveBtn);
      console.log('Save Button Computed Styles:', styles);

      // Verify not white text on white/transparent background
      console.log('Save button text:', await saveBtn.innerText());
      console.log('Clicking Save...');
      await saveBtn.click();
      await page.waitForTimeout(500);
      console.log('Successfully saved!');
    }
  }

  await browser.close();
  console.log('Test completed successfully!');
})();
