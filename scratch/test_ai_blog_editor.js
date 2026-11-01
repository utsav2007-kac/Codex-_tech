const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const artifactDir = 'C:\\Users\\iGen Systems\\.gemini\\antigravity\\brain\\24257650-6bb9-47cd-afe7-aec6be5496d1';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  console.log('1. Fetching admin token from API...');
  const loginRes = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@codextechit.com', password: 'CodexAdmin2026' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.data?.token) {
    throw new Error('Failed to login via API: ' + JSON.stringify(loginData));
  }
  const token = loginData.data.token;
  const user = loginData.data.user;
  console.log('2. Authenticated as:', user.email);

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });
  const page = await context.newPage();

  console.log('3. Setting auth state in browser...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('codex_admin_token', token);
    localStorage.setItem('codex_admin_user', JSON.stringify(user));
  }, { token, user });

  console.log('4. Navigating to Content Manager...');
  await page.goto('http://localhost:5173/admin/content', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click "+ Create New Article" or "New Article"
  console.log('5. Opening Create New Article view...');
  const createBtn = await page.waitForSelector('button:has-text("New Article")', { timeout: 8000 });
  await createBtn.click();
  await page.waitForTimeout(1000);

  // Capture screenshot of the new AI-powered editor form
  const editorPath = path.join(artifactDir, 'ai_blog_editor_visual.png');
  await page.screenshot({ path: editorPath, fullPage: false });
  console.log('6. Saved AI editor screenshot to:', editorPath);

  // Fill in AI prompt
  console.log('7. Throwing prompt into AI generator...');
  const promptInput = await page.waitForSelector('textarea[placeholder*="Write a comprehensive guide"]', { timeout: 5000 });
  await promptInput.fill('Senior AWS Cloud Architect Guide: Multi-Region Kubernetes, Zero-Trust IAM and Enterprise P99 Latency Optimization in 2026');

  // Click "Generate & Insert Article"
  console.log('8. Triggering AI Generation...');
  const genBtn = await page.waitForSelector('text=Generate & Insert Article', { timeout: 5000 });
  await genBtn.click();

  // Wait for success message
  console.log('9. Waiting for AI article synthesis...');
  await page.waitForSelector('text=Article generated successfully', { timeout: 15000 });
  console.log('10. AI Article generation completed successfully!');

  await page.waitForTimeout(1500);

  // Scroll down slightly to show visual editor content with formatting toolbar
  await page.evaluate(() => {
    window.scrollBy(0, 480);
  });
  await page.waitForTimeout(1000);

  // Capture screenshot of the generated content in the Visual Editor
  const generatedPath = path.join(artifactDir, 'ai_blog_generated_content.png');
  await page.screenshot({ path: generatedPath, fullPage: false });
  console.log('11. Saved generated article screenshot to:', generatedPath);

  await browser.close();
  console.log('Verification script completed cleanly!');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
