const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf');

async function main() {
  console.log('--- CAPTURING UI VERIFICATION SCREENSHOTS ---');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    // 1. Student Join Page on Mobile (iPhone 14 viewport 390x844)
    console.log('[1] Capturing Student Join Page with FloatingInput...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
    });
    const page1 = await mobileContext.newPage();
    await page1.goto('http://localhost:8080/#/student/join/cls-1', { waitUntil: 'networkidle' });
    await page1.waitForTimeout(1000);

    // Fill in Student details with FloatingInput
    await page1.fill('#student-name-input', 'Sarath Santhosh');
    await page1.fill('#student-phone-input', '9876543210');
    await page1.waitForTimeout(600);

    const joinPageScreenshot = path.join(ARTIFACT_DIR, 'student_join_page_luxury_floating_input.png');
    await page1.screenshot({ path: joinPageScreenshot });
    console.log(`  ✓ Saved: ${joinPageScreenshot}`);

    // 2. Student Live Classroom on Mobile (Google Meet Layout)
    console.log('[2] Capturing Student Live Studio (Google Meet layout)...');
    await page1.click('button[type="submit"]');
    await page1.waitForTimeout(2500);

    const meetStudioScreenshot = path.join(ARTIFACT_DIR, 'student_live_classroom_google_meet_mobile.png');
    await page1.screenshot({ path: meetStudioScreenshot });
    console.log(`  ✓ Saved: ${meetStudioScreenshot}`);
    await mobileContext.close();

    // 3. Profile & Settings Account Management (Desktop 1280x800)
    console.log('[3] Capturing Profile Settings with Log Out and Delete Account...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page2 = await desktopContext.newPage();
    await page2.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page2.waitForTimeout(1000);

    // Click Profile tab / button
    const profileBtn = page2.locator('button:has-text("Profile"), a:has-text("Profile"), button:has-text("சுயவிவரம்")').first();
    if (await profileBtn.isVisible()) {
      await profileBtn.click();
      await page2.waitForTimeout(800);
    }

    // Switch to Settings tab in Profile
    const settingsTab = page2.locator('button:has-text("Settings"), button:has-text("அமைப்புகள்")').first();
    if (await settingsTab.isVisible()) {
      await settingsTab.click();
      await page2.waitForTimeout(800);
    }

    const profileSettingsScreenshot = path.join(ARTIFACT_DIR, 'profile_settings_account_management.png');
    await page2.screenshot({ path: profileSettingsScreenshot });
    console.log(`  ✓ Saved: ${profileSettingsScreenshot}`);

    // Click "Delete Account" button to show Delete Modal with TimedUndoAction
    const deleteBtn = page2.locator('button:has-text("Delete Account"), button:has-text("கணக்கை நீக்கு")').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page2.waitForTimeout(600);

      const deleteModalScreenshot = path.join(ARTIFACT_DIR, 'profile_delete_modal_timed_undo.png');
      await page2.screenshot({ path: deleteModalScreenshot });
      console.log(`  ✓ Saved: ${deleteModalScreenshot}`);
    }

    await desktopContext.close();
    console.log('\n🎉 ALL SCREENSHOTS SUCCESSFULLY CAPTURED!');
  } catch (err) {
    console.error('Screenshot capture error:', err);
  } finally {
    await browser.close();
  }
}

main();
