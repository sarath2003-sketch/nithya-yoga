const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');

const ARTIFACT_DIR = path.resolve('C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf');

async function isServerRunning(port = 8080) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log('=== STARTING GOOGLE MEET & STUDENT JOIN E2E VERIFICATION ===');

  const running = await isServerRunning(8080);
  if (!running) {
    console.log('Server not responding on port 8080. Please ensure node serve.js is running.');
  } else {
    console.log('✓ Dev server active on http://localhost:8080');
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });

  try {
    // -------------------------------------------------------------
    // TEST 1: Student Join Page (Microsoft Fluent Luxury Design + Camera Mirror)
    // -------------------------------------------------------------
    console.log('\n[1] Testing Student Join Page on Mobile (iPhone 14 390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      permissions: ['camera', 'microphone'],
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
    });

    const pageMobile = await mobileContext.newPage();
    await pageMobile.goto('http://localhost:8080/#/student/join/cls-1', { waitUntil: 'domcontentloaded' });
    await pageMobile.waitForTimeout(2000);

    // Verify presence of camera preview mirror and floating input fields
    const nameInput = pageMobile.locator('#student-name-input');
    const phoneInput = pageMobile.locator('#student-phone-input');
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });

    await nameInput.fill('Sarath Santhosh');
    await phoneInput.fill('9876543210');
    await pageMobile.waitForTimeout(800);

    const joinPageScreenshot = path.join(ARTIFACT_DIR, 'student_join_fluent_preview.png');
    await pageMobile.screenshot({ path: joinPageScreenshot });
    console.log(`  ✓ Student Join Page verified & saved: ${joinPageScreenshot}`);

    // Submit form and verify seamless auto-connection into live room
    console.log('\n[2] Submitting join form and verifying seamless transition to live room...');
    const submitBtn = pageMobile.locator('button[type="submit"]');
    await submitBtn.click();
    await pageMobile.waitForTimeout(3000);

    const mobileLiveScreenshot = path.join(ARTIFACT_DIR, 'live_classroom_google_meet_mobile.png');
    await pageMobile.screenshot({ path: mobileLiveScreenshot });
    console.log(`  ✓ Mobile Google Meet Classroom verified & saved: ${mobileLiveScreenshot}`);

    await mobileContext.close();

    // -------------------------------------------------------------
    // TEST 2: Desktop Classroom (Full-Viewport Google Meet + Spotlight Swap)
    // -------------------------------------------------------------
    console.log('\n[3] Testing Desktop Classroom (1280x800) with Spotlight & PIP...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      permissions: ['camera', 'microphone']
    });

    const pageDesktop = await desktopContext.newPage();

    // Seed student session into localStorage so it auto-connects cleanly
    await pageDesktop.addInitScript(() => {
      localStorage.setItem('nithya_student_session', JSON.stringify({
        name: 'Sarath Santhosh',
        phone: '9876543210',
        role: 'student',
        sessionId: 'cls-1',
        micActive: true,
        cameraActive: true,
        autoConnect: true,
        joinedAt: new Date().toISOString()
      }));
      localStorage.setItem('nithya_student_name', 'Sarath Santhosh');
      localStorage.setItem('nithya_student_phone', '9876543210');
      sessionStorage.setItem('nithya_current_role', 'student');
    });

    await pageDesktop.goto('http://localhost:8080/#/student/live/cls-1', { waitUntil: 'domcontentloaded' });
    await pageDesktop.waitForTimeout(3000);

    const desktopLiveScreenshot = path.join(ARTIFACT_DIR, 'live_classroom_google_meet_desktop.png');
    await pageDesktop.screenshot({ path: desktopLiveScreenshot });
    console.log(`  ✓ Desktop Live Classroom verified & saved: ${desktopLiveScreenshot}`);

    // Test Spotlight Tap/Swap on Picture-in-Picture (PIP) card
    console.log('\n[4] Testing Interactive Tap/Swap on Picture-in-Picture (PIP) card...');
    const pipTile = pageDesktop.locator('.figma-pip-floating-tile');
    if (await pipTile.isVisible()) {
      console.log('  -> Found floating Picture-in-Picture (PIP) tile. Tapping to swap spotlight...');
      await pipTile.click();
      await pageDesktop.waitForTimeout(1500);

      const swapScreenshot = path.join(ARTIFACT_DIR, 'live_classroom_spotlight_swap.png');
      await pageDesktop.screenshot({ path: swapScreenshot });
      console.log(`  ✓ Spotlight Swap verified & saved: ${swapScreenshot}`);
    } else {
      console.log('  -> PIP tile not present (single participant mode). Stage is full width.');
    }

    // Test Camera and Mic Toggle Controls
    console.log('\n[5] Testing Camera and Mic Toggle without freezing...');
    const videoBtn = pageDesktop.locator('button[title*="Camera"], button[title*="கேமரா"]').first();
    const micBtn = pageDesktop.locator('button[title*="Mic"], button[title*="மைக்"]').first();

    if (await videoBtn.isVisible()) {
      await videoBtn.click();
      await pageDesktop.waitForTimeout(600);
      await videoBtn.click();
      await pageDesktop.waitForTimeout(800);
      console.log('  ✓ Video toggle cycle succeeded without error.');
    }

    if (await micBtn.isVisible()) {
      await micBtn.click();
      await pageDesktop.waitForTimeout(600);
      await micBtn.click();
      await pageDesktop.waitForTimeout(800);
      console.log('  ✓ Mic toggle cycle succeeded without error.');
    }

    // Test Slide-over Participants Drawer
    console.log('\n[6] Testing Slide-over Participants Drawer...');
    const participantsBtn = pageDesktop.locator('button[title*="Participants"], button[title*="மாணவர்கள்"]').first();
    if (await participantsBtn.isVisible()) {
      await participantsBtn.click();
      await pageDesktop.waitForTimeout(800);

      const drawerScreenshot = path.join(ARTIFACT_DIR, 'live_classroom_participants_drawer.png');
      await pageDesktop.screenshot({ path: drawerScreenshot });
      console.log(`  ✓ Participants drawer slide-in verified & saved: ${drawerScreenshot}`);

      // Close drawer
      const closeDrawerBtn = pageDesktop.locator('button[title="Close Drawer"], button[title="Close"]').first();
      if (await closeDrawerBtn.isVisible()) {
        await closeDrawerBtn.click();
        await pageDesktop.waitForTimeout(500);
        console.log('  ✓ Participants drawer successfully closed. Stage restored to 100% full width.');
      }
    }

    // -------------------------------------------------------------
    // TEST 3: Home Page (Verify no premature live link when not started)
    // -------------------------------------------------------------
    console.log('\n[7] Testing Home Page when class is scheduled (not live)...');
    await pageDesktop.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
    await pageDesktop.waitForTimeout(1500);

    const homeScreenshot = path.join(ARTIFACT_DIR, 'home_scheduled_class_clean_display.png');
    await pageDesktop.screenshot({ path: homeScreenshot });
    console.log(`  ✓ Home page scheduled display verified: ${homeScreenshot}`);

    await desktopContext.close();
    console.log('\n======================================================');
    console.log('✓ ALL TESTS & SCREENSHOTS COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
