const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/acer/.gemini/antigravity/brain/56f62506-da3e-42f6-abfd-03ebe0644bcf');
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function checkHttp(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:8080${urlPath}`, (res) => {
      let len = 0;
      res.on('data', chunk => len += chunk.length);
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          bytes: len
        });
      });
    }).on('error', (err) => {
      resolve({ path: urlPath, error: err.message });
    });
  });
}

async function runEmpiricalStressTest() {
  console.log('================================================================');
  console.log('🕉️ EMPIRICAL CHALLENGER: CHAKRA ARTWORK VIEWPORT & LAYOUT HARNESS');
  console.log('================================================================\n');

  let totalAssertions = 0;
  let passedAssertions = 0;
  let failedAssertions = 0;

  function assert(condition, description, details = '') {
    totalAssertions++;
    if (condition) {
      console.log(`  ✓ PASS: ${description} ${details ? `(${details})` : ''}`);
      passedAssertions++;
    } else {
      console.error(`  ❌ FAIL: ${description} ${details ? `(${details})` : ''}`);
      failedAssertions++;
    }
  }

  // --- PHASE 1: HTTP 200 ASSET INTEGRITY CHECKS ---
  console.log('[PHASE 1] Checking HTTP 200 Responses & Byte Integrity of Chakra Assets...');
  const assetPaths = [
    '/assets/premium-yoga/chakra-glowing-hero.jpg',
    '/assets/premium-yoga/chakra-moon-hero.svg',
    '/assets/images/chakra-meditation.jpg'
  ];

  for (const p of assetPaths) {
    const res = await checkHttp(p);
    assert(res.statusCode === 200, `Asset HTTP 200: ${p}`, `Status: ${res.statusCode}, Size: ${res.bytes} bytes, Type: ${res.contentType}`);
    assert(res.bytes > 0, `Asset Content Non-Empty: ${p}`, `${res.bytes} bytes`);
  }

  // --- PHASE 2: MULTI-VIEWPORT EMPIRICAL RENDERING & BOUNDING BOX CHECKS ---
  console.log('\n[PHASE 2] Multi-Viewport Rendering, Aspect Ratio, & Layout Stability Testing...');
  const targetViewports = [
    { name: 'Mobile-320px (iPhone SE 1st gen / Small Android)', width: 320, height: 658 },
    { name: 'Mobile-360px (Galaxy S-series compact)', width: 360, height: 740 },
    { name: 'Mobile-375px (iPhone SE 2nd gen / iPhone 8)', width: 375, height: 667 },
    { name: 'Mobile-390px (iPhone 12/13/14)', width: 390, height: 844 },
    { name: 'Mobile-412px (Pixel 7 / Galaxy S23 standard)', width: 412, height: 915 },
    { name: 'Tablet-768px (iPad Mini / Portrait Tablet)', width: 768, height: 1024 },
    { name: 'Desktop-1280px (Standard Desktop / Laptop)', width: 1280, height: 800 }
  ];

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  for (const vp of targetViewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.width <= 412 ? 2 : 1
    });

    await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    // 1. Check Document Horizontal Scrolling
    const pageScroll = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth
    }));

    assert(
      pageScroll.scrollWidth <= pageScroll.innerWidth,
      `[${vp.name}] Zero horizontal page overflow`,
      `scrollWidth: ${pageScroll.scrollWidth} <= innerWidth: ${pageScroll.innerWidth}`
    );

    // 2. Measure Hero Chakra Artwork (HeroSection.jsx)
    const heroChakraMetrics = await page.evaluate(() => {
      const img = document.querySelector('img.chakra-moon-hero-img');
      const frame = document.querySelector('.chakra-moon-hero-frame');
      const wrapper = document.querySelector('.welcome-banner-art-wrap.hero-right-visual-wrapper');

      if (!img) return null;

      const rect = img.getBoundingClientRect();
      const frameRect = frame ? frame.getBoundingClientRect() : null;
      const comp = window.getComputedStyle(img);
      const frameComp = frame ? window.getComputedStyle(frame) : null;
      const wrapComp = wrapper ? window.getComputedStyle(wrapper) : null;

      return {
        exists: true,
        src: img.currentSrc || img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: rect.width,
        renderedHeight: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        aspectRatio: rect.height > 0 ? (rect.width / rect.height) : 0,
        naturalAspectRatio: img.naturalHeight > 0 ? (img.naturalWidth / img.naturalHeight) : 0,
        objectFit: comp.objectFit,
        display: comp.display,
        visibility: comp.visibility,
        frameWidth: frameRect ? frameRect.width : 0,
        frameHeight: frameRect ? frameRect.height : 0,
        wrapperDisplay: wrapComp ? wrapComp.display : 'none'
      };
    });

    assert(heroChakraMetrics !== null, `[${vp.name}] Hero chakra image element exists in DOM`);

    if (heroChakraMetrics) {
      assert(heroChakraMetrics.complete, `[${vp.name}] Hero chakra image loaded successfully (complete = true)`);
      assert(heroChakraMetrics.naturalWidth === 1024, `[${vp.name}] Hero chakra naturalWidth is 1024px`, `got ${heroChakraMetrics.naturalWidth}`);
      assert(heroChakraMetrics.naturalHeight === 1024, `[${vp.name}] Hero chakra naturalHeight is 1024px`, `got ${heroChakraMetrics.naturalHeight}`);
      assert(
        Math.abs(heroChakraMetrics.naturalAspectRatio - 1.0) < 0.001,
        `[${vp.name}] Natural aspect ratio is perfectly 1:1 (square)`,
        `ratio: ${heroChakraMetrics.naturalAspectRatio}`
      );
      assert(
        Math.abs(heroChakraMetrics.aspectRatio - 1.0) <= 0.05,
        `[${vp.name}] Rendered aspect ratio is 1:1 (no stretch/distortion)`,
        `${heroChakraMetrics.renderedWidth}x${heroChakraMetrics.renderedHeight} (ratio: ${heroChakraMetrics.aspectRatio.toFixed(3)})`
      );
      assert(
        heroChakraMetrics.right <= vp.width,
        `[${vp.name}] Hero chakra bounding right does not overflow viewport`,
        `right: ${heroChakraMetrics.right.toFixed(1)}px <= vp: ${vp.width}px`
      );
      assert(
        heroChakraMetrics.left >= 0,
        `[${vp.name}] Hero chakra bounding left is inside viewport`,
        `left: ${heroChakraMetrics.left.toFixed(1)}px`
      );
      assert(
        heroChakraMetrics.objectFit === 'cover',
        `[${vp.name}] CSS object-fit is cover to prevent distortion`,
        `got ${heroChakraMetrics.objectFit}`
      );
      assert(
        heroChakraMetrics.wrapperDisplay === 'flex',
        `[${vp.name}] Artwork wrapper display is flex (visible)`,
        `got ${heroChakraMetrics.wrapperDisplay}`
      );

      // Verify responsive sizing: <=768px frame is 105px, >768px frame is 145px
      const expectedFrameDim = vp.width <= 768 ? 105 : 145;
      assert(
        Math.abs(heroChakraMetrics.frameWidth - expectedFrameDim) <= 2,
        `[${vp.name}] Container frame width matches responsive CSS spec (${expectedFrameDim}px)`,
        `got ${heroChakraMetrics.frameWidth.toFixed(1)}px`
      );
      assert(
        Math.abs(heroChakraMetrics.frameHeight - expectedFrameDim) <= 2,
        `[${vp.name}] Container frame height matches responsive CSS spec (${expectedFrameDim}px)`,
        `got ${heroChakraMetrics.frameHeight.toFixed(1)}px`
      );
    }

    // 3. Measure Dashboard Class Card Chakra Artwork (App.jsx .col-live)
    const cardChakraMetrics = await page.evaluate(() => {
      const card = document.querySelector('.col-live');
      if (!card) return null;
      const img = card.querySelector('img[src*="chakra"]');
      if (!img) return null;

      const rect = img.getBoundingClientRect();
      const comp = window.getComputedStyle(img);

      return {
        exists: true,
        src: img.currentSrc || img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: rect.width,
        renderedHeight: rect.height,
        left: rect.left,
        right: rect.right,
        aspectRatio: rect.height > 0 ? (rect.width / rect.height) : 0,
        objectFit: comp.objectFit,
        supersedesAttr: img.getAttribute('data-supersedes')
      };
    });

    assert(cardChakraMetrics !== null, `[${vp.name}] Dashboard card chakra image element exists in DOM`);
    if (cardChakraMetrics) {
      assert(cardChakraMetrics.complete, `[${vp.name}] Dashboard card chakra image loaded successfully`);
      assert(cardChakraMetrics.naturalWidth === 1024, `[${vp.name}] Card chakra naturalWidth is 1024px`, `got ${cardChakraMetrics.naturalWidth}`);
      assert(cardChakraMetrics.naturalHeight === 1024, `[${vp.name}] Card chakra naturalHeight is 1024px`, `got ${cardChakraMetrics.naturalHeight}`);
      assert(
        Math.abs(cardChakraMetrics.aspectRatio - 1.0) <= 0.05,
        `[${vp.name}] Card chakra rendered aspect ratio is 1:1 square`,
        `${cardChakraMetrics.renderedWidth}x${cardChakraMetrics.renderedHeight} (ratio: ${cardChakraMetrics.aspectRatio.toFixed(3)})`
      );
      assert(
        cardChakraMetrics.right <= vp.width,
        `[${vp.name}] Card chakra image right edge inside viewport`,
        `right: ${cardChakraMetrics.right.toFixed(1)}px <= vp: ${vp.width}px`
      );
      assert(
        cardChakraMetrics.supersedesAttr === 'assets/premium-yoga/chakra-moon-hero.svg',
        `[${vp.name}] Preserves data-supersedes attribute for legacy test contract`,
        `got ${cardChakraMetrics.supersedesAttr}`
      );
    }

    // Capture visual verification snapshots
    if (vp.width === 320 || vp.width === 412 || vp.width === 768 || vp.width === 1280) {
      const snapName = `chakra_artwork_vp_${vp.width}px.png`;
      const snapPath = path.join(ARTIFACT_DIR, snapName);
      await page.screenshot({ path: snapPath, fullPage: false });
      console.log(`  📸 Captured snapshot for ${vp.name}: ${snapName}`);
    }

    await page.close();
  }

  // --- PHASE 3: STRESS-TEST DYNAMIC RESIZE REFLOW & FALLBACK ORACLE ---
  console.log('\n[PHASE 3] Stress-Testing Dynamic Resize Reflow & Fallback Oracle...');

  // Test 1: Dynamic Resize Stress
  const dynamicPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await dynamicPage.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
  await dynamicPage.waitForTimeout(1000);

  const resizeSequence = [1280, 768, 412, 360, 320, 375, 390, 1024, 1280];
  let resizeOverflowDetected = false;

  for (const w of resizeSequence) {
    await dynamicPage.setViewportSize({ width: w, height: 800 });
    await dynamicPage.waitForTimeout(200);
    const overflow = await dynamicPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) resizeOverflowDetected = true;
  }

  assert(!resizeOverflowDetected, 'Dynamic viewport resize sequence (1280->320->1280) triggered NO horizontal overflow');

  // Test 2: Fallback onError Oracle
  // If the primary image fails, does onError swap cleanly to chakra-moon-hero.svg without crashing?
  const fallbackResult = await dynamicPage.evaluate(() => {
    const heroImg = document.querySelector('img.chakra-moon-hero-img');
    if (!heroImg) return { error: 'No hero img' };
    
    // Simulate error event
    heroImg.dispatchEvent(new Event('error'));
    return {
      srcAfterError: heroImg.src,
      hasFallbackSvg: heroImg.src.includes('chakra-moon-hero.svg')
    };
  });

  assert(
    fallbackResult.hasFallbackSvg,
    'Hero chakra image onError handler successfully falls back to chakra-moon-hero.svg',
    `src: ${fallbackResult.srcAfterError}`
  );

  await dynamicPage.close();
  await browser.close();

  // --- SUMMARY ---
  console.log('\n================================================================');
  console.log(`CHALLENGER 1 VERIFICATION RESULTS: ${passedAssertions} / ${totalAssertions} PASSED`);
  if (failedAssertions > 0) {
    console.error(`❌ FAILED: ${failedAssertions} assertions failed!`);
  } else {
    console.log('🎉 VERDICT: ALL EMPIRICAL CHALLENGES SATISFIED WITHOUT DEFECTS.');
  }
  console.log('================================================================\n');

  if (failedAssertions > 0) process.exit(1);
}

runEmpiricalStressTest().catch(err => {
  console.error('Fatal stress test failure:', err);
  process.exit(1);
});
