const { chromium } = require('playwright');
const path = require('path');

const PORT = 8080;
const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();

    // 1. Trainer Portal with Floating Inputs
    await page.goto(`http://localhost:${PORT}/?tab=admin`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.removeItem('nithya_admin_token');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    await page.screenshot({
      path: path.join(artifactDir, 'trainer_portal_floating_input.png'),
      fullPage: false
    });
    console.log('✓ Captured trainer_portal_floating_input.png');

    // 2. Filled Floating Input
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill('sarathsanthons@gmail.com');
    }
    const passInput = await page.$('input[type="password"]');
    if (passInput) {
      await passInput.fill('sarath123');
    }
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(artifactDir, 'trainer_portal_floating_input_filled.png'),
      fullPage: false
    });
    console.log('✓ Captured trainer_portal_floating_input_filled.png');

    // 3. Log In to see Trainer Dashboard with FamilyReceiveComponent
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(1500);
    }

    const launcherBtn = await page.getByRole('button', { name: /Launch Live Studio/i }).first();
    if (launcherBtn) {
      await launcherBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(artifactDir, 'trainer_dashboard_live_launcher.png'),
        fullPage: false
      });
      console.log('✓ Captured trainer_dashboard_live_launcher.png');

      await launcherBtn.click();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(artifactDir, 'trainer_dashboard_live_launcher_modal.png'),
        fullPage: false
      });
      console.log('✓ Captured trainer_dashboard_live_launcher_modal.png');
    } else {
      await page.screenshot({
        path: path.join(artifactDir, 'trainer_dashboard_live_launcher.png'),
        fullPage: false
      });
      console.log('✓ Captured trainer_dashboard_live_launcher.png');
    }

    // 4. Public Classes with Watermelon Split Accordion
    await page.goto(`http://localhost:${PORT}/?tab=yoga`, { waitUntil: 'load' });
    await page.waitForTimeout(1000);

    // Switch to Syllabus tab
    const syllabusTab = await page.getByRole('button', { name: /Split Syllabus|ஸ்பிளிட் சிலபஸ்/i }).first();
    if (syllabusTab) {
      await syllabusTab.click();
      await page.waitForTimeout(800);
    }

    await page.screenshot({
      path: path.join(artifactDir, 'watermelon_split_accordion_collapsed.png'),
      fullPage: false
    });
    console.log('✓ Captured watermelon_split_accordion_collapsed.png');

    // Click on the first accordion item to expand
    const firstItem = await page.getByText('Surya Namaskar & Warmup Flow');
    if (firstItem) {
      await firstItem.click();
      await page.waitForTimeout(600);
    }

    await page.screenshot({
      path: path.join(artifactDir, 'watermelon_split_accordion_expanded.png'),
      fullPage: false
    });
    console.log('✓ Captured watermelon_split_accordion_expanded.png');

  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    await browser.close();
  }
}

run();
