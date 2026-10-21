import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/contact', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  // Scroll down to contact section
  await page.locator('#contact-form-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const data = await page.evaluate(() => {
    const section = document.querySelector('#contact-form-section');
    const form = document.querySelector('form');
    const leftCol = section ? section.querySelector('.space-y-8') : null;
    const rightCol = section ? section.querySelector('.lg\\:col-span-2') : null;
    const cards = Array.from(document.querySelectorAll('#contact-form-section .rounded-3xl'));
    const footer = document.querySelector('footer');

    return {
      section: section ? {
        top: section.offsetTop,
        offsetHeight: section.offsetHeight,
        rect: section.getBoundingClientRect()
      } : null,
      leftCol: leftCol ? {
        offsetHeight: leftCol.offsetHeight,
        rect: leftCol.getBoundingClientRect()
      } : null,
      rightCol: rightCol ? {
        offsetHeight: rightCol.offsetHeight,
        rect: rightCol.getBoundingClientRect()
      } : null,
      form: form ? {
        offsetHeight: form.offsetHeight,
        rect: form.getBoundingClientRect()
      } : null,
      cards: cards.map((c, i) => ({
        index: i,
        classes: c.className,
        offsetHeight: c.offsetHeight,
        rect: c.getBoundingClientRect(),
        snippet: c.innerText.slice(0, 35).replace(/\n/g, ' ')
      })),
      footer: footer ? {
        offsetTop: footer.offsetTop,
        offsetHeight: footer.offsetHeight,
        rect: footer.getBoundingClientRect()
      } : null,
      docHeight: document.documentElement.scrollHeight
    };
  });

  console.log('CONTACT PAGE MEASUREMENTS:');
  console.log(JSON.stringify(data, null, 2));

  await page.screenshot({ path: 'scripts/contact-viewport.png' });
  await page.screenshot({ path: 'scripts/contact-fullpage.png', fullPage: true });
  console.log('Screenshots saved to scripts/contact-viewport.png and scripts/contact-fullpage.png');

  await browser.close();
}

main().catch(console.error);
