import { chromium } from '@playwright/test';

async function auditLongTasks(throttled = false) {
  const mode = throttled ? 'Fast 3G + 4x CPU' : 'Unthrottled';
  console.log(`\n======================================================`);
  console.log(`⚡ Long Tasks Audit: ${mode}`);
  console.log(`======================================================`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  if (throttled) {
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      connectionType: 'cellular3g',
    });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  await page.addInitScript(() => {
    window.__longTasks = [];
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const attribution = (entry.attribution || []).map((a) => ({
            name: a.name,
            entryType: a.entryType,
            containerType: a.containerType,
            containerSrc: a.containerSrc,
            containerId: a.containerId,
            containerName: a.containerName,
          }));
          window.__longTasks.push({
            name: entry.name,
            startTime: Math.round(entry.startTime),
            duration: Math.round(entry.duration),
            attribution,
          });
        }
      }).observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.error(e);
    }
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const longTasks = await page.evaluate(() => window.__longTasks);
  const tasksBefore2s = longTasks.filter((t) => t.startTime < 2000);

  console.log(`Total Long Tasks (>50ms) in first 2s: ${tasksBefore2s.length}`);
  tasksBefore2s.forEach((t, i) => {
    console.log(`Task #${i + 1}: startTime = ${t.startTime}ms, duration = ${t.duration}ms`);
    console.log(`  Attribution:`, JSON.stringify(t.attribution));
  });

  await browser.close();
  return tasksBefore2s;
}

async function main() {
  await auditLongTasks(false);
  await auditLongTasks(true);
}

main().catch(console.error);
