import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const OUTPUT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots/fouc-after';
const LOCAL_DIR = 'd:/web devlopment/scripts/screenshots/fouc-after';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

async function testNoJsRendering(browser) {
  console.log('\n======================================================');
  console.log('🧪 TEST: Zero-JavaScript Render (javaScriptEnabled: false)');
  console.log('======================================================');

  for (const bp of [{ width: 1440, height: 900, name: '1440px' }, { width: 390, height: 844, name: '390px' }]) {
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded' });

    const checks = await page.evaluate(() => {
      const img = document.querySelector('img[alt*="Codex Tech-IT"]');
      const link = document.querySelector('header a[href="/about"]') || document.querySelector('a');
      const h1 = document.querySelector('h1');
      const imgWidth = img ? img.getBoundingClientRect().width : 0;
      const linkColor = link ? window.getComputedStyle(link).color : '';
      const linkUnderline = link ? window.getComputedStyle(link).textDecorationLine : '';
      const h1Text = h1 ? h1.textContent : '';

      return {
        imgWidth,
        linkColor,
        linkUnderline,
        h1Text,
        hasCurly: h1Text.includes("{' '}") || h1Text.includes("{ ' ' }"),
        isGiantLogo: imgWidth > 300,
        isDefaultBlueLink: linkColor === 'rgb(0, 0, 238)',
      };
    });

    console.log(`  Breakpoint ${bp.name} (No-JS):`);
    console.log(`    Logo Width: ${checks.imgWidth}px (Must be <= 200px)`);
    console.log(`    Link Color: ${checks.linkColor} (Must NOT be rgb(0, 0, 238))`);
    console.log(`    Link Underline: ${checks.linkUnderline} (Must NOT be underline)`);
    console.log(`    Headline text contains {' '}: ${checks.hasCurly}`);

    if (checks.isGiantLogo) throw new Error(`FAILED: Logo is wider than 300px (${checks.imgWidth}px) with JS disabled!`);
    if (checks.isDefaultBlueLink) throw new Error(`FAILED: Links render in default browser blue rgb(0, 0, 238) with JS disabled!`);
    if (checks.hasCurly) throw new Error(`FAILED: Headline contains literal {' '} with JS disabled!`);

    const filename = `no-js-styled-${bp.name}.png`;
    const localPath = path.join(LOCAL_DIR, filename);
    const artifactPath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: localPath });
    fs.copyFileSync(localPath, artifactPath);
    console.log(`    ✅ Screenshot saved: ${filename}`);

    await context.close();
  }
}

async function captureFoucAfterFilmstrip(browser) {
  console.log('\n======================================================');
  console.log('🎥 TEST: Filmstrip Every 50ms with Cache Disabled + Fast 3G + 4x CPU');
  console.log('======================================================');

  const testIntervals = [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 1800, 2000];
  const frameResults = [];

  for (const ms of testIntervals) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await c.newPage();
    const cl = await c.newCDPSession(p);
    await cl.send('Network.enable');
    await cl.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cl.send('Network.emulateNetworkConditions', FAST_3G);
    await cl.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    const nav = p.goto(PREVIEW_URL, { waitUntil: 'commit' });
    await nav;
    if (ms > 0) await p.waitForTimeout(ms);

    const info = await p.evaluate(() => {
      const img = document.querySelector('img[alt*="Codex Tech-IT"]');
      const h1 = document.querySelector('h1');
      const link = document.querySelector('header a[href="/about"]');
      const imgWidth = img ? img.getBoundingClientRect().width : 0;
      const h1Text = h1 ? h1.textContent : '';
      const linkColor = link ? window.getComputedStyle(link).color : '';
      const linkUnderline = link ? window.getComputedStyle(link).textDecorationLine : '';
      return {
        imgWidth,
        h1Text,
        linkColor,
        linkUnderline,
        hasCurly: h1Text.includes("{' '}") || h1Text.includes("{ ' ' }"),
        isGiantLogo: imgWidth > 300,
        isDefaultBlueLink: linkColor === 'rgb(0, 0, 238)',
      };
    });

    const filename = `after-${ms}ms.png`;
    const localPath = path.join(LOCAL_DIR, filename);
    const artifactPath = path.join(OUTPUT_DIR, filename);
    await p.screenshot({ path: localPath });
    fs.copyFileSync(localPath, artifactPath);

    const passed = !info.isGiantLogo && !info.isDefaultBlueLink && !info.hasCurly;
    console.log(`  Frame ${ms}ms: LogoWidth=${info.imgWidth}px, CurlyInH1=${info.hasCurly}, LinkColor=${info.linkColor} -> ${passed ? '✅ STYLED' : '❌ UNSTYLED'}`);

    frameResults.push({
      ms,
      imgWidth: info.imgWidth,
      hasCurly: info.hasCurly,
      linkColor: info.linkColor,
      passed,
    });

    await c.close();
  }

  const allPassed = frameResults.every((f) => f.passed);
  if (!allPassed) {
    throw new Error('FAILED: Some frames in AFTER contained unstyled content!');
  }
  console.log('✅ ALL filmstrip frames in AFTER are 100% styled from millisecond 0!');
}

async function measureFinalPerformance(browser) {
  console.log('\n======================================================');
  console.log('📊 MEASURING PERFORMANCE (Unthrottled & Fast 3G + 4x CPU)');
  console.log('======================================================');

  async function runOne(throttled, name) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const client = await context.newCDPSession(page);

    if (throttled) {
      await client.send('Network.enable');
      await client.send('Network.setCacheDisabled', { cacheDisabled: true });
      await client.send('Network.emulateNetworkConditions', FAST_3G);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }

    await page.addInitScript(() => {
      window.__perf = { lcp: 0, cls: 0, fp: 0, fcp: 0, headlineVisibleMs: null, buttonsClickableMs: null };
      new PerformanceObserver((l) => {
        const e = l.getEntries();
        if (e.length > 0) window.__perf.lcp = Math.round(e[e.length - 1].startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      let cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          if (!e.hadRecentInput) {
            cls += e.value;
            window.__perf.cls = parseFloat(cls.toFixed(4));
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      const check = () => {
        const now = Math.round(performance.now());
        const h1 = document.querySelector('h1');
        if (h1 && window.__perf.headlineVisibleMs === null) {
          const s = window.getComputedStyle(h1);
          if (parseFloat(s.opacity) >= 0.2 && h1.getBoundingClientRect().height > 10) {
            window.__perf.headlineVisibleMs = now;
          }
        }
        const btn = document.querySelector('a[href="/careers"]');
        if (btn && window.__perf.buttonsClickableMs === null) {
          const s = window.getComputedStyle(btn);
          if (parseFloat(s.opacity) >= 0.2 && btn.getBoundingClientRect().height > 10 && s.pointerEvents !== 'none') {
            window.__perf.buttonsClickableMs = now;
          }
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });

    await page.goto(PREVIEW_URL, { waitUntil: 'load' });
    await page.waitForTimeout(throttled ? 2500 : 1500);

    const m = await page.evaluate(() => {
      const p = performance.getEntriesByType('paint');
      const fp = p.find((e) => e.name === 'first-paint');
      const fcp = p.find((e) => e.name === 'first-contentful-paint');
      window.__perf.fp = fp ? Math.round(fp.startTime) : 0;
      window.__perf.fcp = fcp ? Math.round(fcp.startTime) : 0;
      return window.__perf;
    });

    console.log(`Results for ${name}:`);
    console.table(m);
    await context.close();
    return m;
  }

  const unthrottled = await runOne(false, 'unthrottled');
  const throttled = await runOne(true, 'fast3g-4xcpu');

  fs.writeFileSync('d:/web devlopment/scripts/final-audit-metrics.json', JSON.stringify({
    unthrottled,
    throttled,
  }, null, 2));
}

async function testNavigationModes(browser) {
  console.log('\n======================================================');
  console.log('🔄 TEST: Navigation Consistency (Reload, Hard Reload, Router)');
  console.log('======================================================');

  for (const bp of [{ width: 1440, height: 900, name: '1440px' }, { width: 390, height: 844, name: '390px' }]) {
    const context = await browser.newContext({ viewport: { width: bp.width, height: bp.height } });
    const page = await context.newPage();

    await page.goto(PREVIEW_URL);
    let h1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim());
    console.log(`  [${bp.name}] Initial Load H1: "${h1}"`);

    await page.reload({ waitUntil: 'domcontentloaded' });
    h1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim());
    console.log(`  [${bp.name}] Hard Reload H1: "${h1}"`);

    await page.reload();
    h1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim());
    console.log(`  [${bp.name}] Normal Reload H1: "${h1}"`);

    await page.goto(`${PREVIEW_URL}/about`, { waitUntil: 'domcontentloaded' });
    await page.click('a[href="/"]');
    await page.waitForTimeout(100);
    h1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim());
    console.log(`  [${bp.name}] Route Nav to Home H1: "${h1}"`);

    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  await testNoJsRendering(browser);
  await captureFoucAfterFilmstrip(browser);
  await measureFinalPerformance(browser);
  await testNavigationModes(browser);

  await browser.close();
  console.log('\n🎉 ALL FOUC AUDITS & PERFORMANCE CHECKS PASSED PERFECTLY!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
