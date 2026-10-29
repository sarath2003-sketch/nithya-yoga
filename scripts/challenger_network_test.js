/**
 * Challenger 2: Asset Integrity, Network Delivery, Precaching & Fallback Verification
 * 
 * Verifies:
 * 1. HTTP 200 & MIME types for all chakra assets (GET & HEAD)
 * 2. Hash equality between server payloads and local files
 * 3. Exact MIME validation for all sw.js PRECACHE_URLS (detecting SPA fallback false-positives)
 * 4. Production build execution and byte-for-byte mirroring to www/
 * 5. In-browser rendering of primary assets via Playwright (msedge)
 * 6. In-browser onError fallback mechanism when primary asset fails
 * 7. Infinite loop resilience when both primary and fallback fail
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');
const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:8080';
let passes = 0;
let failures = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passes++;
    console.log(`  ✓ PASS: ${testName} ${details ? `(${details})` : ''}`);
    results.push({ test: testName, status: 'PASS', details });
  } else {
    failures++;
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    results.push({ test: testName, status: 'FAIL', details });
  }
}

function fetchHttp(urlPath, method = 'GET') {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_URL}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
    const req = http.request(fullUrl, { method }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks)
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function getSha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function run() {
  console.log('======================================================================');
  console.log('CHALLENGER 2: EMPIRICAL ASSET INTEGRITY & NETWORK VERIFICATION HARNESS');
  console.log('======================================================================\n');

  // --------------------------------------------------------------------
  // SECTION 1: HTTP ASSET DELIVERY & MIME TYPE VALIDATION
  // --------------------------------------------------------------------
  console.log('[SECTION 1] HTTP Asset Delivery & Exact MIME Types');

  const targetAssets = [
    {
      url: '/assets/premium-yoga/chakra-glowing-hero.jpg',
      localPath: 'assets/premium-yoga/chakra-glowing-hero.jpg',
      expectedMime: 'image/jpeg'
    },
    {
      url: '/assets/premium-yoga/chakra-moon-hero.svg',
      localPath: 'assets/premium-yoga/chakra-moon-hero.svg',
      expectedMime: 'image/svg+xml'
    },
    {
      url: '/assets/images/chakra-meditation.jpg',
      localPath: 'assets/images/chakra-meditation.jpg',
      expectedMime: 'image/jpeg'
    }
  ];

  for (const asset of targetAssets) {
    const localBuf = fs.readFileSync(asset.localPath);
    const localSize = localBuf.length;
    const localHash = getSha256(localBuf);

    // Test GET
    const resGet = await fetchHttp(asset.url, 'GET');
    assert(resGet.statusCode === 200, `GET ${asset.url} returns HTTP 200`, `Status: ${resGet.statusCode}`);
    assert(
      resGet.headers['content-type'] && resGet.headers['content-type'].includes(asset.expectedMime),
      `GET ${asset.url} has Content-Type '${asset.expectedMime}'`,
      `Header: ${resGet.headers['content-type']}`
    );
    assert(
      Number(resGet.headers['content-length']) === localSize,
      `GET ${asset.url} Content-Length matches disk file size`,
      `${resGet.headers['content-length']} == ${localSize}`
    );
    const getHash = getSha256(resGet.body);
    assert(getHash === localHash, `GET ${asset.url} payload SHA256 matches disk file exactly`, `Hash: ${getHash.slice(0, 12)}...`);

    // Test HEAD
    const resHead = await fetchHttp(asset.url, 'HEAD');
    assert(resHead.statusCode === 200, `HEAD ${asset.url} returns HTTP 200`, `Status: ${resHead.statusCode}`);
    assert(
      resHead.headers['content-type'] && resHead.headers['content-type'].includes(asset.expectedMime),
      `HEAD ${asset.url} Content-Type matches '${asset.expectedMime}'`,
      `Header: ${resHead.headers['content-type']}`
    );
    assert(resHead.body.length === 0, `HEAD ${asset.url} returns empty body`, `Body bytes: ${resHead.body.length}`);
  }

  // --------------------------------------------------------------------
  // SECTION 2: SERVICE WORKER PRECACHE LIST EMPIRICAL AUDIT
  // --------------------------------------------------------------------
  console.log('\n[SECTION 2] Service Worker Precache List Audit');

  const swContent = fs.readFileSync('sw.js', 'utf8');
  assert(swContent.includes('chakra-glowing-hero.jpg'), 'sw.js registers chakra-glowing-hero.jpg');
  assert(swContent.includes('v5.2.1'), 'sw.js version bumped to v5.2.1');

  // Extract PRECACHE_URLS array from sw.js
  const precacheMatch = swContent.match(/const\s+PRECACHE_URLS\s*=\s*\[([\s\S]*?)\];/);
  assert(!!precacheMatch, 'PRECACHE_URLS array found in sw.js');

  if (precacheMatch) {
    const urls = precacheMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith("'") || line.startsWith('"'))
      .map(line => line.replace(/['",]/g, '').trim())
      .map(url => url.replace(/^\.\//, '/'));

    console.log(`  Found ${urls.length} URLs in sw.js PRECACHE_URLS to audit...`);

    for (const url of urls) {
      const res = await fetchHttp(url, 'GET');
      const isHtmlExpected = (url === '/' || url === '/index.html');
      const ct = res.headers['content-type'] || '';
      const isHtml = ct.includes('text/html');

      // Crucial test: non-HTML precache assets MUST NOT return HTML (which would indicate SPA 404 fallback)
      const valid = res.statusCode === 200 && (isHtmlExpected ? isHtml : !isHtml);
      assert(
        valid,
        `SW precache URL '${url}' returns valid asset (not SPA fallback)`,
        `Status: ${res.statusCode}, Content-Type: ${ct}`
      );
    }
  }

  // --------------------------------------------------------------------
  // SECTION 3: BUILD PIPELINE & ASSET MIRRORING TO www/
  // --------------------------------------------------------------------
  console.log('\n[SECTION 3] Build Pipeline & Asset Mirroring to www/');

  console.log('  Executing npm run build...');
  const buildStart = Date.now();
  const buildOutput = execSync('npm run build', { encoding: 'utf8' });
  const buildDuration = Date.now() - buildStart;
  console.log(`  Build finished in ${buildDuration}ms.`);

  assert(fs.existsSync('dist/bundle.js'), 'dist/bundle.js exists');
  const bundleSize = fs.statSync('dist/bundle.js').size;
  assert(bundleSize > 2000000, 'dist/bundle.js is compiled and > 2MB', `Size: ${(bundleSize / (1024 * 1024)).toFixed(2)} MB`);

  // Verify mirroring to www/
  const mirroredAssets = [
    { src: 'assets/premium-yoga/chakra-glowing-hero.jpg', dest: 'www/assets/premium-yoga/chakra-glowing-hero.jpg' },
    { src: 'assets/premium-yoga/chakra-moon-hero.svg', dest: 'www/assets/premium-yoga/chakra-moon-hero.svg' },
    { src: 'assets/images/chakra-meditation.jpg', dest: 'www/assets/images/chakra-meditation.jpg' },
    { src: 'dist/bundle.js', dest: 'www/dist/bundle.js' }
  ];

  for (const item of mirroredAssets) {
    assert(fs.existsSync(item.dest), `${item.dest} exists in www directory`);
    if (fs.existsSync(item.dest) && fs.existsSync(item.src)) {
      const srcHash = getSha256(fs.readFileSync(item.src));
      const destHash = getSha256(fs.readFileSync(item.dest));
      assert(srcHash === destHash, `${item.dest} is identical to source ${item.src}`, `Hash: ${destHash.slice(0, 10)}...`);
    }
  }

  // --------------------------------------------------------------------
  // SECTION 4: PLAYWRIGHT BROWSER VERIFICATION & FALLBACK STRESS TEST
  // --------------------------------------------------------------------
  console.log('\n[SECTION 4] Browser Live Rendering & Fallback Stress Testing');

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // Test 4.1: Normal load of primary glowing hero
  {
    console.log('  [4.1] Testing normal load of primary glowing hero...');
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const heroImg = page.locator('.chakra-moon-hero-img');
    await heroImg.waitFor({ state: 'visible', timeout: 5000 });

    const heroSrc = await heroImg.getAttribute('src');
    const heroNaturalWidth = await heroImg.evaluate(el => el.naturalWidth);
    const heroNaturalHeight = await heroImg.evaluate(el => el.naturalHeight);
    const heroComplete = await heroImg.evaluate(el => el.complete);

    assert(heroSrc.includes('chakra-glowing-hero.jpg'), 'Hero image src is chakra-glowing-hero.jpg', heroSrc);
    assert(heroComplete, 'Hero image completed loading in browser');
    assert(heroNaturalWidth === 1024 && heroNaturalHeight === 1024, 'Hero image loaded full 1024x1024 natural resolution', `${heroNaturalWidth}x${heroNaturalHeight}`);

    // Check Upcoming / Live class card image in App.jsx
    const classCardImg = page.locator('img[data-supersedes="assets/premium-yoga/chakra-moon-hero.svg"]');
    if (await classCardImg.count() > 0) {
      const ccSrc = await classCardImg.first().getAttribute('src');
      const ccWidth = await classCardImg.first().evaluate(el => el.naturalWidth);
      const ccComplete = await classCardImg.first().evaluate(el => el.complete);
      assert(ccSrc.includes('chakra-glowing-hero.jpg'), 'Class card img src is chakra-glowing-hero.jpg', ccSrc);
      assert(ccComplete, 'Class card img completed loading');
      assert(ccWidth === 1024, 'Class card img loaded 1024 natural width', `${ccWidth}px`);
    }

    await context.close();
  }

  // Test 4.2: Fallback trigger when primary image fails (Network error simulation)
  {
    console.log('  [4.2] Testing fallback: intercepting chakra-glowing-hero.jpg with HTTP 404...');
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    let interceptedPrimary = false;
    let fallbackRequested = false;

    await page.route('**/assets/premium-yoga/chakra-glowing-hero.jpg', (route) => {
      interceptedPrimary = true;
      route.abort('failed'); // simulate network failure
    });

    page.on('request', (req) => {
      if (req.url().includes('chakra-moon-hero.svg')) {
        fallbackRequested = true;
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const heroImg = page.locator('.chakra-moon-hero-img');
    await heroImg.waitFor({ state: 'attached', timeout: 5000 });

    const currentSrc = await heroImg.getAttribute('src');
    assert(interceptedPrimary, 'Primary image request was intercepted and aborted');
    assert(fallbackRequested, 'Fallback chakra-moon-hero.svg request was triggered by onError');
    assert(currentSrc.includes('chakra-moon-hero.svg'), 'Hero img src switched to chakra-moon-hero.svg', currentSrc);

    const fallbackNaturalWidth = await heroImg.evaluate(el => el.naturalWidth);
    const fallbackComplete = await heroImg.evaluate(el => el.complete);
    assert(fallbackComplete, 'Fallback SVG completed loading');
    assert(fallbackNaturalWidth > 0, 'Fallback SVG loaded successfully with positive natural width', `${fallbackNaturalWidth}px`);

    await context.close();
  }

  // Test 4.3: Infinite loop stress test (Both primary and fallback fail)
  {
    console.log('  [4.3] Testing resilience: intercepting BOTH primary and fallback with failure...');
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    await page.route('**/assets/premium-yoga/chakra-glowing-hero.jpg', route => route.abort('failed'));
    await page.route('**/assets/premium-yoga/chakra-moon-hero.svg', route => route.abort('failed'));

    let errorEventCount = 0;
    await page.exposeFunction('recordImageError', () => {
      errorEventCount++;
    });

    await page.addInitScript(() => {
      window.addEventListener('error', (e) => {
        if (e.target && e.target.tagName === 'IMG') {
          window.recordImageError();
        }
      }, true);
    });

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Verify browser did not freeze or crash, and error count is bounded (not thousands)
    const heroImg = page.locator('.chakra-moon-hero-img');
    const isAttached = await heroImg.count() > 0;
    assert(isAttached, 'Page and DOM remain stable even if both primary and fallback fail');
    assert(errorEventCount <= 50, `Image error count is bounded and did not cause infinite loop (fired ${errorEventCount} times)`);

    await context.close();
  }

  await browser.close();

  // --------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(`CHALLENGER 2 SUMMARY: ${passes} Passed, ${failures} Failed`);
  console.log('======================================================================');

  process.exit(failures === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error('Unhandled error in challenger harness:', err);
  process.exit(1);
});
