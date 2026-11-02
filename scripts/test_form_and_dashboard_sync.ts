import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== TEST 1: SUBMIT PUBLIC CONTACT FORM & VERIFY DASHBOARD COUNT RISE ===');

  // Check initial contacts count in DB
  const initialContactsCount = await prisma.contact.count();
  console.log(`Initial DB contacts count: ${initialContactsCount}`);

  // Navigate to contact page
  console.log('Navigating to http://localhost:5173/contact');
  await page.goto('http://localhost:5173/contact');
  await page.waitForLoadState('networkidle');

  const testName = 'Automated QA Test Contact';
  const testEmail = `qa.test.${Date.now()}@example.com`;
  const testPhone = '1234567890';
  const testSubject = 'QA Audit Verification Inquiry';
  const testMessage = 'Testing form write path and dashboard count synchronization.';

  console.log(`Filling contact form for: ${testEmail}`);
  await page.fill('input[name="name"], input[placeholder*="Name" i], #name', testName);
  await page.fill('input[name="email"], input[placeholder*="Email" i], #email', testEmail);
  await page.fill('input[name="phone"], input[placeholder*="Phone" i], #phone', testPhone);
  await page.fill('input[name="subject"], input[placeholder*="Subject" i], #subject', testSubject);
  await page.fill('textarea[name="message"], textarea[placeholder*="Message" i], #message', testMessage);

  await page.click('button[type="submit"]');

  // Wait for submission response
  await page.waitForTimeout(3000);

  // Check DB for new row
  const newContactsCount = await prisma.contact.count();
  console.log(`New DB contacts count: ${newContactsCount}`);
  if (newContactsCount !== initialContactsCount + 1) {
    console.error('ERROR: DB contacts count did not increase by 1!');
    process.exit(1);
  }
  console.log('PASS: Contact saved to MySQL database successfully!');

  // Navigate to Admin Dashboard and check that Contact Messages card reflects the rise
  console.log('\nNavigating to Admin Dashboard http://localhost:5173/login');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"]', 'admin@codex.com');
  await page.fill('input[type="password"]', 'admin@123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin**', { timeout: 10000 });
  await page.waitForTimeout(2000);

  const contactCardText = await page.locator('a:has-text("Contact Messages")').innerText();
  console.log(`Contact Messages card on Admin Dashboard:\n${contactCardText}`);

  if (contactCardText.includes(String(newContactsCount))) {
    console.log(`PASS: Admin Dashboard successfully displays updated count (${newContactsCount})!`);
  } else {
    console.error(`ERROR: Dashboard did not display expected count ${newContactsCount}!`);
  }

  // Cleanup the single test row created
  console.log(`\nCleaning up single test row: ${testEmail}`);
  const deleted = await prisma.contact.deleteMany({
    where: { email: testEmail }
  });
  console.log(`Cleaned up ${deleted.count} test row.`);

  await browser.close();
}

main()
  .catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
