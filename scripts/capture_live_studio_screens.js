const { chromium } = require('playwright');
const path = require('path');
const Database = require('better-sqlite3');

const artifactDir = 'C:\\Users\\acer\\.gemini\\antigravity\\brain\\56f62506-da3e-42f6-abfd-03ebe0644bcf';

function setDbClassStatus(status) {
  const db = new Database('nithya-yoga.sqlite');
  db.prepare("UPDATE classes SET status=? WHERE id='cls-1'").run(status);
}

(async () => {
  // Reset cls-1 to scheduled before test
  setDbClassStatus('scheduled');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Mobile Instructor Idle State (Light Theme)
  const contextInstructor = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageInstructor = await contextInstructor.newPage();
  
  await pageInstructor.addInitScript(() => {
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_theme', 'light');
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });

  await pageInstructor.goto('http://localhost:8080/');
  await pageInstructor.waitForTimeout(1800);
  
  const studioEl = await pageInstructor.$('.live-studio-card-container');
  if (studioEl) {
    await studioEl.scrollIntoViewIfNeeded();
    await pageInstructor.waitForTimeout(400);
    const boxMobileIdle = path.join(artifactDir, 'live_studio_instructor_idle_mobile.png');
    await studioEl.screenshot({ path: boxMobileIdle });
    console.log('✓ Captured mobile instructor idle state (light):', boxMobileIdle);

    // 2. Mobile Instructor Idle State (Dark Theme)
    await pageInstructor.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('nithya_theme', 'dark');
    });
    await pageInstructor.waitForTimeout(400);
    const boxMobileIdleDark = path.join(artifactDir, 'live_studio_instructor_idle_dark_mobile.png');
    await studioEl.screenshot({ path: boxMobileIdleDark });
    console.log('✓ Captured mobile instructor idle state (dark):', boxMobileIdleDark);

    // Reset to light
    await pageInstructor.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('nithya_theme', 'light');
    });
  }

  // 3. Mobile Student Idle State (Waiting for Instructor - Standby)
  const contextStudent = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageStudent = await contextStudent.newPage();
  await pageStudent.addInitScript(() => {
    localStorage.removeItem('nithya_trainer_token');
    localStorage.removeItem('nithya_admin_token');
    localStorage.setItem('nithya_active_role', 'student');
    localStorage.setItem('nithya_theme', 'light');
    localStorage.setItem('nithya_student_session', JSON.stringify({
      name: 'Priya Yoga',
      phone: '9876543210'
    }));
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'Priya Yoga',
      role: 'student',
      isInstructor: false
    }));
  });

  await pageStudent.goto('http://localhost:8080/');
  await pageStudent.waitForTimeout(1800);
  const studentStudioEl = await pageStudent.$('.live-studio-card-container');
  if (studentStudioEl) {
    await studentStudioEl.scrollIntoViewIfNeeded();
    await pageStudent.waitForTimeout(400);
    const boxStudentIdle = path.join(artifactDir, 'live_studio_student_idle_mobile.png');
    await studentStudioEl.screenshot({ path: boxStudentIdle });
    console.log('✓ Captured mobile student standby idle state:', boxStudentIdle);
  }

  // 4. Start Live Class as instructor on pageInstructor
  const startBtn = await pageInstructor.$('.btn-start-live-studio');
  if (startBtn) {
    console.log('Starting Live Class as instructor...');
    await startBtn.click();
    await pageInstructor.waitForTimeout(2000);
    
    // Screenshot Live Class card (Light)
    const boxMobileLive = path.join(artifactDir, 'live_studio_instructor_live_mobile.png');
    await studioEl.screenshot({ path: boxMobileLive });
    console.log('✓ Captured mobile instructor live state (light):', boxMobileLive);

    // Screenshot Live Class card (Dark)
    await pageInstructor.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('nithya_theme', 'dark');
    });
    await pageInstructor.waitForTimeout(400);
    const boxMobileLiveDark = path.join(artifactDir, 'live_studio_instructor_live_dark_mobile.png');
    await studioEl.screenshot({ path: boxMobileLiveDark });
    console.log('✓ Captured mobile instructor live state (dark):', boxMobileLiveDark);
  }

  // 5. Desktop Live State (Dark Theme)
  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.addInitScript(() => {
    localStorage.setItem('nithya_trainer_token', 'token-instructor-demo');
    localStorage.setItem('nithya_admin_token', 'token-instructor-demo');
    localStorage.setItem('nithya_active_role', 'trainer');
    localStorage.setItem('nithya_theme', 'dark');
    localStorage.setItem('nithya_user', JSON.stringify({
      name: 'NITHYA Master',
      role: 'trainer',
      isInstructor: true
    }));
  });
  await pageDesktop.goto('http://localhost:8080/');
  await pageDesktop.waitForTimeout(2000);
  const desktopStudio = await pageDesktop.$('.live-studio-card-container');
  if (desktopStudio) {
    await desktopStudio.scrollIntoViewIfNeeded();
    const boxDesktopLive = path.join(artifactDir, 'live_studio_instructor_live_desktop.png');
    await desktopStudio.screenshot({ path: boxDesktopLive });
    console.log('✓ Captured desktop live state (dark):', boxDesktopLive);
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
})();
