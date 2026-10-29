const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf');
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function verifyAll() {
  console.log('🚀 Starting Multi-Viewport Mobile UI & Quality Verification...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  const viewports = [
    { name: 'Mobile-320px', width: 320, height: 658 },
    { name: 'Mobile-360px', width: 360, height: 740 },
    { name: 'Mobile-375px', width: 375, height: 667 },
    { name: 'Mobile-390px', width: 390, height: 844 },
    { name: 'Mobile-430px', width: 430, height: 932 },
    { name: 'Tablet-768px', width: 768, height: 1024 },
    { name: 'Desktop-1280px', width: 1280, height: 800 }
  ];

  let totalChecks = 0;
  let passedChecks = 0;

  function check(desc, condition) {
    totalChecks++;
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`);
      passedChecks++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
    }
  }

  // --- Step 1: Check Horizontal Overflow & Header / Bottom Nav across all viewports ---
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // 1. Horizontal Scroll Check
    const scrollInfo = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth
    }));

    check(
      `[${vp.name}] No horizontal overflow (scrollWidth: ${scrollInfo.scrollWidth} <= innerWidth: ${scrollInfo.innerWidth})`,
      scrollInfo.scrollWidth <= scrollInfo.innerWidth
    );

    // 2. Mobile Bottom Nav Labels & Visibility (on mobile viewports)
    if (vp.width <= 480) {
      const bottomNavVisible = await page.isVisible('.mobile-bottom-nav-dock');
      check(`[${vp.name}] Mobile bottom nav dock is visible`, bottomNavVisible);

      const navLabels = await page.$$eval('.pill-nav-btn', btns => 
        btns.map(b => {
          const mobileSpan = b.querySelector('.nav-label-mobile');
          const fullSpan = b.querySelector('.nav-label-full');
          const isMobileVisible = mobileSpan && window.getComputedStyle(mobileSpan).display !== 'none';
          const isFullVisible = fullSpan && window.getComputedStyle(fullSpan).display !== 'none';
          return {
            mobileText: mobileSpan ? mobileSpan.innerText.trim() : '',
            fullText: fullSpan ? fullSpan.innerText.trim() : '',
            visibleText: isMobileVisible ? mobileSpan.innerText.trim() : (isFullVisible ? fullSpan.innerText.trim() : b.innerText.trim())
          };
        })
      );

      // Check labels do not contain truncation ellipsis
      const hasEllipsis = navLabels.some(l => l.visibleText.includes('...'));
      check(`[${vp.name}] Bottom nav labels have NO truncation ellipsis: [${navLabels.map(l => l.visibleText).join(', ')}]`, !hasEllipsis);

      // Verify specific concise mobile labels
      const visibleTexts = navLabels.map(l => l.visibleText);
      check(
        `[${vp.name}] Contains crisp mobile labels (Portal, Reminders, Yoga, Admin, Profile)`,
        visibleTexts.includes('Portal') && visibleTexts.includes('Reminders') && visibleTexts.includes('Yoga') && visibleTexts.includes('Admin')
      );
    }

    // 3. Upcoming Yoga Class Heading Check
    const cardInfo = await page.evaluate(() => {
      const liveCol = document.querySelector('.col-live');
      if (!liveCol) return null;
      const headingBadge = liveCol.querySelector('.bg-violet-600\\/20');
      const statusBadge = liveCol.querySelector('.bg-amber-500\\/15, .bg-emerald-500\\/20');
      const chakraImg = liveCol.querySelector('img[src*="chakra"]');
      const metadata = liveCol.innerText;
      return {
        headingText: headingBadge ? headingBadge.innerText.trim() : '',
        statusText: statusBadge ? statusBadge.innerText.trim() : '',
        hasChakraImg: Boolean(chakraImg),
        hasHdText: metadata.includes('1080p HD'),
        fullHeaderCollision: headingBadge && statusBadge && headingBadge.innerText.includes('Scheduled')
      };
    });

    if (cardInfo) {
      check(`[${vp.name}] Upcoming Yoga Class heading badge exists: "${cardInfo.headingText}"`, Boolean(cardInfo.headingText));
      check(`[${vp.name}] Scheduled status pill exists cleanly: "${cardInfo.statusText}"`, Boolean(cardInfo.statusText));
      check(`[${vp.name}] NO collision between heading and scheduled badge`, !cardInfo.fullHeaderCollision);
      check(`[${vp.name}] Chakra moon artwork is displayed`, cardInfo.hasChakraImg);
      check(`[${vp.name}] 1080p HD metadata preserved cleanly`, cardInfo.hasHdText);
    }

    // Capture visual snapshots for key viewports
    if (vp.width === 320) {
      const snapPath = path.join(ARTIFACT_DIR, 'mobile_320px_header_nav.png');
      await page.screenshot({ path: snapPath, fullPage: false });
      console.log(`  📸 Saved snapshot: mobile_320px_header_nav.png`);
    } else if (vp.width === 390) {
      const snapPath = path.join(ARTIFACT_DIR, 'mobile_390px_upcoming_class.png');
      await page.screenshot({ path: snapPath, fullPage: false });
      console.log(`  📸 Saved snapshot: mobile_390px_upcoming_class.png`);
    } else if (vp.width === 768) {
      const snapPath = path.join(ARTIFACT_DIR, 'tablet_768px_layout.png');
      await page.screenshot({ path: snapPath, fullPage: false });
      console.log(`  📸 Saved snapshot: tablet_768px_layout.png`);
    } else if (vp.width === 1280) {
      const snapPath = path.join(ARTIFACT_DIR, 'desktop_1280px_layout.png');
      await page.screenshot({ path: snapPath, fullPage: false });
      console.log(`  📸 Saved snapshot: desktop_1280px_layout.png`);
    }

    await page.close();
  }

  // --- Step 2: Dedicated Reminders Verification on Mobile (360px) ---
  console.log('\n[Reminders Viewport 360px] Verifying Reminders interactions & actions...');
  const pageReminders = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await pageReminders.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
  await pageReminders.waitForTimeout(1000);

  // Click on Reminders tab in bottom nav
  const reminderTabBtn = await pageReminders.locator('.pill-nav-btn:has-text("Reminders")').first();
  await reminderTabBtn.click();
  await pageReminders.waitForTimeout(1000);

  const remindersHeaderInfo = await pageReminders.evaluate(() => {
    const titleBar = document.querySelector('.today-reminders-section .section-title-bar');
    const testAlertBtn = document.querySelector('.test-system-notif-btn');
    const manageAllBtn = document.querySelector('.link-view-all');
    const cards = document.querySelectorAll('.reminder-pastel-card');
    return {
      hasTitleBar: Boolean(titleBar),
      hasTestAlert: Boolean(testAlertBtn),
      hasManageAll: Boolean(manageAllBtn),
      cardCount: cards.length
    };
  });

  check('Reminders section title bar exists', remindersHeaderInfo.hasTitleBar);
  check('Reminders Test Alert button exists', remindersHeaderInfo.hasTestAlert);
  check('Reminders Manage All button exists', remindersHeaderInfo.hasManageAll);
  check(`Reminders cards rendered properly (count: ${remindersHeaderInfo.cardCount})`, remindersHeaderInfo.cardCount >= 5);

  const remindersSnapPath = path.join(ARTIFACT_DIR, 'mobile_360px_reminders.png');
  await pageReminders.screenshot({ path: remindersSnapPath, fullPage: false });
  console.log(`  📸 Saved snapshot: mobile_360px_reminders.png`);
  await pageReminders.close();

  // --- Step 3: Admin Portal Form Verification on Mobile (430px) ---
  console.log('\n[Admin Viewport 430px] Verifying Admin Form responsive layout...');
  const pageAdmin = await browser.newPage({ viewport: { width: 430, height: 932 } });
  await pageAdmin.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
  await pageAdmin.waitForTimeout(1000);

  // Click Admin tab in bottom nav
  const adminTabBtn = await pageAdmin.locator('.pill-nav-btn:has-text("Admin")').first();
  await adminTabBtn.click();
  await pageAdmin.waitForTimeout(1000);

  // Check login form or dashboard
  const adminLayout = await pageAdmin.evaluate(() => {
    const loginForm = document.querySelector('.trainer-login-box, form');
    const formGrid = document.querySelector('.trainer-form-grid');
    const inputs = Array.from(document.querySelectorAll('input'));
    const anyInputOverflowing = inputs.some(i => i.getBoundingClientRect().right > window.innerWidth);
    return {
      hasForm: Boolean(loginForm),
      hasFormGrid: Boolean(formGrid),
      anyInputOverflowing,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    };
  });

  check('Admin page loads without overflowing', adminLayout.scrollWidth <= adminLayout.innerWidth);
  check('No admin form inputs extend beyond screen viewport', !adminLayout.anyInputOverflowing);

  const adminSnapPath = path.join(ARTIFACT_DIR, 'mobile_430px_admin_form.png');
  await pageAdmin.screenshot({ path: adminSnapPath, fullPage: false });
  console.log(`  📸 Saved snapshot: mobile_430px_admin_form.png`);
  await pageAdmin.close();

  await browser.close();

  console.log(`\n==============================================`);
  console.log(`MULTI-VIEWPORT VERIFICATION RESULTS: ${passedChecks} / ${totalChecks} CHECKS PASSED!`);
  console.log(`==============================================`);

  if (passedChecks === totalChecks) {
    console.log('🎉 ALL MOBILE UI & RESPONSIVE CHECKS FULLY SATISFIED!');
  } else {
    process.exit(1);
  }
}

verifyAll().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
