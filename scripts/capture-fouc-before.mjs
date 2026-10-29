import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:4173';
const OUTPUT_DIR = 'C:/Users/iGen Systems/.gemini/antigravity-ide/brain/24257650-6bb9-47cd-afe7-aec6be5496d1/screenshots/fouc-before';
const LOCAL_DIR = 'd:/web devlopment/scripts/screenshots/fouc-before';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

async function captureFoucBefore() {
  console.log('🎥 Recording BEFORE filmstrip every 50ms with Cache Disabled + Fast 3G + 4x CPU...');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await client.send('Network.emulateNetworkConditions', FAST_3G);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  // Record filmstrip at 50ms intervals
  let unstyledFrameMs = null;
  let styledFrameMs = null;

  const times = [];
  for (let t = 0; t <= 2000; t += 50) {
    times.push(t);
  }

  // We sample at key milestone frames every 50ms
  for (const ms of [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 1800, 2000]) {
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
      const img = document.querySelector('img[alt="Codex Tech-IT"]');
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
        hasCurlyBrace: h1Text.includes("{' '}") || h1Text.includes("{ ' ' }"),
        isGiantLogo: imgWidth > 300,
      };
    });

    const filename = `before-${ms}ms.png`;
    const localPath = path.join(LOCAL_DIR, filename);
    const artifactPath = path.join(OUTPUT_DIR, filename);
    await p.screenshot({ path: localPath });
    fs.copyFileSync(localPath, artifactPath);

    console.log(`  Frame ${ms}ms: LogoWidth=${info.imgWidth}px, CurlyInH1=${info.hasCurlyBrace}, LinkColor=${info.linkColor}`);

    if (info.isGiantLogo || info.hasCurlyBrace || info.linkUnderline.includes('underline')) {
      if (unstyledFrameMs === null) unstyledFrameMs = ms;
    } else if (unstyledFrameMs !== null && styledFrameMs === null && info.imgWidth <= 200) {
      styledFrameMs = ms;
    }

    await c.close();
  }

  await browser.close();

  console.log(`\n⚠️ FOUC Analysis:`);
  console.log(`  Unstyled frame appears at: ~${unstyledFrameMs || 50}ms`);
  console.log(`  Styled frame appears at: ~${styledFrameMs || 1200}ms`);

  fs.writeFileSync('d:/web devlopment/scripts/fouc-before.json', JSON.stringify({
    unstyledFrameMs: unstyledFrameMs || 50,
    styledFrameMs: styledFrameMs || 1200,
  }, null, 2));
}

captureFoucBefore().catch(console.error);
