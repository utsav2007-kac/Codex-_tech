import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.fill('input[placeholder="Jane Smith"]', 'Enterprise Hiring Director');
  await page.fill('input[placeholder="jane@example.com"]', 'director@globaltech.com');
  await page.fill('input[placeholder="+1 (555) 000-0000"]', '+1 (469) 555-9000');
  await page.fill('input[placeholder="e.g. Hiring Consultation / Career Placement"]', 'Urgent Hiring: 2 Cloud Architects');
  await page.fill('textarea[placeholder*="Please describe"]', 'Hello Codex team, we urgently need 2 Cloud Architects for a 6-month contract. Please reply with availability.');

  await page.click('button:has-text("Send Inquiry Message")');
  await page.waitForSelector('text=Message Received!', { timeout: 15000 });
  console.log('BROWSER_SUBMISSION_SUCCESS: "Message Received!" displayed on the screen!');
  await browser.close();
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

