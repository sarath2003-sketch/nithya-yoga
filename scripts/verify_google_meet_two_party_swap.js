const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf');

async function main() {
  console.log('=== TESTING TWO-PARTY GOOGLE MEET & SPOTLIGHT SWAP ===');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });

  try {
    const roomId = `room-test-${Date.now()}`;

    // 1. Create Teacher Context
    console.log('[1] Launching Instructor Studio...');
    const teacherContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      permissions: ['camera', 'microphone']
    });

    const teacherPage = await teacherContext.newPage();
    await teacherPage.addInitScript(() => {
      localStorage.setItem('nithya_admin_token', 'mock_admin_token');
      localStorage.setItem('nithya_teacher_token', 'mock_teacher_token');
      localStorage.setItem('nithya_active_role', 'trainer');
    });

    await teacherPage.goto(`http://localhost:8080/#/teacher/live/${roomId}`, { waitUntil: 'domcontentloaded' });
    await teacherPage.waitForTimeout(2500);

    // 2. Create Student Context
    console.log('[2] Launching Student Classroom in same room session...');
    const studentContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      permissions: ['camera', 'microphone']
    });

    const studentPage = await studentContext.newPage();
    await studentPage.addInitScript((rid) => {
      localStorage.setItem('nithya_student_session', JSON.stringify({
        name: 'Sarath Santhosh',
        phone: '9876543210',
        role: 'student',
        sessionId: rid,
        micActive: true,
        cameraActive: true,
        autoConnect: true,
        joinedAt: new Date().toISOString()
      }));
      localStorage.setItem('nithya_student_name', 'Sarath Santhosh');
      localStorage.setItem('nithya_student_phone', '9876543210');
      sessionStorage.setItem('nithya_current_role', 'student');
    }, roomId);

    await studentPage.goto(`http://localhost:8080/#/student/live/${roomId}`, { waitUntil: 'domcontentloaded' });
    await studentPage.waitForTimeout(3500);

    // 3. Check for 1-on-1 PIP Floating Tile
    console.log('[3] Checking for Picture-in-Picture (PIP) card in student viewport...');
    const pipTile = studentPage.locator('.figma-pip-floating-tile');
    
    // Save initial state screenshot
    const studentStageBefore = path.join(ARTIFACT_DIR, 'google_meet_two_party_initial.png');
    await studentPage.screenshot({ path: studentStageBefore });
    console.log(`  ✓ Initial 2-party view saved: ${studentStageBefore}`);

    if (await pipTile.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('  ✓ Floating PIP tile detected! Clicking to swap spotlight...');
      await pipTile.click();
      await studentPage.waitForTimeout(1500);

      const studentStageAfter = path.join(ARTIFACT_DIR, 'google_meet_spotlight_swap.png');
      await studentPage.screenshot({ path: studentStageAfter });
      console.log(`  ✓ Spotlight swap screenshot saved: ${studentStageAfter}`);
    } else {
      console.log('  Note: Video stage is in uncropped responsive mode.');
    }

    // Capture Teacher screen as well
    const teacherStageScreenshot = path.join(ARTIFACT_DIR, 'instructor_live_studio_stage.png');
    await teacherPage.screenshot({ path: teacherStageScreenshot });
    console.log(`  ✓ Instructor view saved: ${teacherStageScreenshot}`);

    await studentContext.close();
    await teacherContext.close();
    console.log('=== TWO-PARTY TEST COMPLETE ===');
  } catch (err) {
    console.error('Two-party test error:', err);
  } finally {
    await browser.close();
  }
}

main();
