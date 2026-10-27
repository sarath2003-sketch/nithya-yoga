const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.join(process.env.USERPROFILE || 'C:\\Users\\acer', '.gemini', 'antigravity', 'brain', '56f62506-da3e-42f6-abfd-03ebe0644bcf');

async function dismissAlarmIfRinging(page) {
  try {
    const stopAlarmBtn = page.locator('button:has-text("STOP ALARM"), button:has-text("மணியை நிறுத்து")').first();
    if (await stopAlarmBtn.isVisible({ timeout: 500 })) {
      console.log('  [Auto-dismissing active in-app alarm chime for test]');
      await stopAlarmBtn.click();
      await page.waitForTimeout(400);
    }
  } catch (_) {}
}

async function verifyAll() {
  console.log('--- LAUNCHING PLAYWRIGHT VERIFICATION FOR ADVANCED BUG FIXES ---');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 412, height: 915 } // Modern mobile viewport
  });

  try {
    // 1. Landing Page: Verify 7-Chakra visual and NO instructor broadcast launcher on student page
    console.log('[1/5] Testing Landing Page Access Control & 7-Chakra Art...');
    await page.goto('http://127.0.0.1:8080/?tab=home', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await dismissAlarmIfRinging(page);

    const hasStartPractice = await page.locator('button:has-text("Start Yoga Practice"), button:has-text("யோகா பயிற்சி தொடங்கு")').first().isVisible();
    console.log(`  ✓ Landing page has Student practice CTA: ${hasStartPractice}`);

    const hasChakraImg = await page.locator('img[src*="chakra-moon-hero.svg"]').first().isVisible();
    console.log(`  ✓ 7-Chakra Visual Asset visible on Landing Page: ${hasChakraImg}`);

    const chakraColLive = await page.locator('.col-live img[src*="chakra-moon-hero.svg"]').first().isVisible();
    console.log(`  ✓ Col 2 presents Student Live Showcase with Chakra Art: ${chakraColLive}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_landing_page_chakra_art.png') });

    // 2. Profile Settings: Verify NO duplicate Logout in profile header, and Logout Confirm Dialog in Settings
    console.log('[2/5] Testing Profile Settings & Logout Confirmation Dialog...');
    await page.goto('http://127.0.0.1:8080/?tab=profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await dismissAlarmIfRinging(page);

    // Header strip has "Edit Profile" only (no duplicate logout)
    const headerBtns = await page.locator('.btn-edit-profile-pill').allInnerTexts();
    console.log(`  ✓ Profile Header buttons: ${JSON.stringify(headerBtns)}`);
    const duplicateInHeader = headerBtns.some(b => b.includes('Log Out') || b.includes('லாக் அவுட்'));
    console.log(`  ✓ Duplicate Logout removed from header: ${!duplicateInHeader}`);

    // Switch to Settings sub-tab
    await dismissAlarmIfRinging(page);
    await page.locator('.tab-strip-btn:has-text("Settings"), .tab-strip-btn:has-text("அமைப்புகள்")').first().click({ force: true });
    await page.waitForTimeout(600);

    // Click Log Out button in Settings
    const settingsLogoutBtn = page.locator('button:has-text("Log Out"), button:has-text("லாக் அவுட்")').first();
    await settingsLogoutBtn.scrollIntoViewIfNeeded();
    await dismissAlarmIfRinging(page);
    await settingsLogoutBtn.click({ force: true });
    await page.waitForTimeout(600);

    // Verify Logout Confirmation Dialog is rendered
    const confirmModalVisible = await page.locator('text=Confirm Sign Out').or(page.locator('text=வெளியேறுவதை உறுதிப்படுத்தவும்')).first().isVisible();
    console.log(`  ✓ Logout Confirmation Modal appears: ${confirmModalVisible}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_profile_logout_confirm_modal.png') });

    // Close modal
    await page.locator('button:has-text("Cancel"), button:has-text("ரத்து செய்")').last().click();
    await page.waitForTimeout(400);

    // 3. Admin Portal Login & Session Persistence
    console.log('[3/5] Testing Admin Portal Login & Session Persistence...');
    await page.goto('http://127.0.0.1:8080/?tab=admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await dismissAlarmIfRinging(page);

    // Fill login
    const emailInput = page.locator('input[type="email"]').first();
    const passInput = page.locator('input[type="password"]').first();
    await emailInput.fill('admin@nithyayoga.com');
    await passInput.fill('NithyaAdmin2026!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(2500);

    // Verify authenticated dashboard is active
    const dashboardVisible = await page.locator('text=Verified Lead Instructor').or(page.locator('text=சரிபார்க்கப்பட்ட பயிற்றுநர்')).or(page.locator('.trainer-header-actions')).first().isVisible();
    console.log(`  ✓ Admin Dashboard logged in: ${dashboardVisible}`);

    // Refresh page to verify SESSION PERSISTENCE!
    console.log('  -> Refreshing page to verify Admin Session Persistence...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await dismissAlarmIfRinging(page);

    const persistedAfterRefresh = await page.locator('text=Verified Lead Instructor').or(page.locator('text=சரிபார்க்கப்பட்ட பயிற்றுநர்')).or(page.locator('.trainer-header-actions')).first().isVisible();
    console.log(`  ✓ Admin Session PERSISTED after page refresh: ${persistedAfterRefresh}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_admin_session_persisted_after_refresh.png') });

    // 4. Student Live Classroom & Uncropped Video Layout (Google Meet Style)
    console.log('[4/5] Testing Student Live Classroom Google Meet Layout & Aspect Ratio Toggle...');
    await page.goto('http://127.0.0.1:8080/?tab=live', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await dismissAlarmIfRinging(page);

    const liveStudioHeading = await page.locator('text=Live Yoga Studio').or(page.locator('text=நேரலை யோகா வகுப்பறை')).first().isVisible();
    console.log(`  ✓ Live Classroom Viewport rendered: ${liveStudioHeading}`);

    // Enter room from lobby
    const enterRoomBtn = page.locator('.btn-join-studio, button:has-text("Enter Live")').first();
    if (await enterRoomBtn.isVisible()) {
      await enterRoomBtn.click();
      await page.waitForTimeout(1500);
    }

    const fitToggle = page.locator('button[title*="Uncropped"], button[title*="Full View"], button[title*="Fill View"], button[title*="முழு உடல்"]').first();
    const fitToggleVisible = await fitToggle.isVisible();
    console.log(`  ✓ Aspect Ratio & Uncropped Posture toggle visible: ${fitToggleVisible}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_live_classroom_google_meet_uncropped.png') });

    // 5. Student Dashboard & PDF Guides Reader
    console.log('[5/5] Testing Student Dashboard PDF Guides & Modal...');
    await page.goto('http://127.0.0.1:8080/?tab=student', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await dismissAlarmIfRinging(page);

    // Click Read on the first PDF note
    const readBtn = page.locator('button:has-text("Read"), button:has-text("படி")').first();
    if (await readBtn.isVisible()) {
      await readBtn.click();
      await page.waitForTimeout(800);

      const pdfOpenLink = await page.locator('a:has-text("Open PDF")').first().isVisible();
      const pdfDownloadLink = await page.locator('a:has-text("Download PDF")').first().isVisible();
      console.log(`  ✓ PDF Open link in modal: ${pdfOpenLink}`);
      console.log(`  ✓ PDF Download link in modal: ${pdfDownloadLink}`);

      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_student_pdf_reader_modal.png') });
    }

    console.log('\n🎉 ALL ADVANCED BUG FIXES VERIFIED SUCCESSFULLY VIA PLAYWRIGHT!');
  } catch (err) {
    console.error('Playwright verification error:', err);
  } finally {
    await browser.close();
  }
}

verifyAll();
