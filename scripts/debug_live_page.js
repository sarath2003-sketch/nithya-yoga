const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['camera', 'microphone']
  });

  const page = await context.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  const liveUrl = 'http://127.0.0.1:8080/?live=room-test-live-123&join=student';
  await page.goto(liveUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const state = await page.evaluate(() => {
    return {
      activeTab: localStorage.getItem('nithya_active_tab'),
      activeRole: localStorage.getItem('nithya_active_role'),
      studentSession: localStorage.getItem('nithya_student_session'),
      currentUrl: window.location.href,
      bodyClasses: Array.from(document.querySelectorAll('*')).map(e => e.className).filter(Boolean).slice(0, 20)
    };
  });
  console.log('App state on page:', JSON.stringify(state, null, 2));

  await browser.close();
})();
