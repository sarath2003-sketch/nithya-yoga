const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Testing student live link in mobile web browser with Playwright...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    permissions: ['camera', 'microphone']
  });

  const page = await context.newPage();

  // Test 1: Open student live class link
  const liveUrl = 'http://127.0.0.1:8080/?live=room-test-live-123&join=student';
  console.log(`Navigating to ${liveUrl}...`);
  await page.goto(liveUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Verify NO InAppUpdateBanner modal scrim exists
  const updateModal = await page.$('.update-modal-backdrop-scrim');
  console.log(`Update modal visible on web? ${updateModal !== null ? 'YES (BUG!)' : 'NO (CORRECT! ✓)'}`);

  // Verify Student Join Modal is visible
  const studentModal = await page.$('.modal-bottom-sheet');
  console.log(`Student join modal visible? ${studentModal !== null ? 'YES (CORRECT! ✓)' : 'NO (ERROR!)'}`);

  // Take screenshot of student join screen
  const ss1 = path.join('C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf', 'student_join_modal_verified.png');
  await page.screenshot({ path: ss1 });
  console.log(`Saved screenshot 1 to: ${ss1}`);

  // Fill student name & mobile
  const nameInput = await page.$('input[placeholder*="பெயர்"], input[placeholder*="Name"]');
  const phoneInput = await page.$('input[type="tel"]');
  if (nameInput && phoneInput) {
    await nameInput.fill('Kavitha');
    await phoneInput.fill('9876543210');
    console.log('Filled student credentials...');

    // Submit join
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(2000);

      // Verify entering live classroom
      const liveContainer = await page.$('.figma-live-classroom-container, .dedicated-live-class-viewport');
      console.log(`Successfully entered live classroom? ${liveContainer !== null ? 'YES (CORRECT! ✓)' : 'NO'}`);

      // Check smart app banner
      const handoffBanner = await page.$('.mobile-web-app-handoff-banner');
      console.log(`Smart app handoff banner displayed? ${handoffBanner !== null ? 'YES (CORRECT! ✓)' : 'NO'}`);

      const ss2 = path.join('C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf', 'student_classroom_entered_verified.png');
      await page.screenshot({ path: ss2 });
      console.log(`Saved screenshot 2 to: ${ss2}`);
    }
  }

  await browser.close();
  console.log('Test completed successfully!');
})();
