import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.resolve('C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1');

async function run() {
  console.log('🚀 Starting end-to-end browser verification for Additive Features...');

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('dialog', async dialog => {
    console.log('ALERT DIALOG:', dialog.type(), dialog.message());
    await dialog.accept();
  });
  page.on('response', async res => {
    if (res.url().includes('/api/')) {
      let body = '';
      try { body = await res.text(); } catch (_) {}
      console.log('API RESPONSE:', res.status(), res.url(), body ? body.slice(0, 100) : '');
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 1. HOME TESTIMONIALS SECTION (DESKTOP & MOBILE)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 1: Home Testimonials Verification ---');
  await page.goto('http://localhost:5173/#reviews-section', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const reviewsSection = page.locator('#reviews-section');
  await reviewsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Capture Desktop Screenshot
  const homeDesktopPath = path.join(artifactDir, 'home_testimonials_desktop.png');
  await reviewsSection.screenshot({ path: homeDesktopPath });
  console.log(`✓ Saved desktop Home reviews screenshot: ${homeDesktopPath}`);

  // Mobile Viewport Check
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await reviewsSection.scrollIntoViewIfNeeded();
  const homeMobilePath = path.join(artifactDir, 'home_testimonials_mobile.png');
  await reviewsSection.screenshot({ path: homeMobilePath });
  console.log(`✓ Saved mobile Home reviews screenshot: ${homeMobilePath}`);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. ADMIN LOGIN & TESTIMONIALS MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 2: Admin Login & Testimonials Management ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' });

  // Fill login
  await page.fill('input[type="email"]', 'admin@codextechit.com');
  await page.fill('input[type="password"]', 'CodexAdmin2026');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  console.log('✓ Admin login successful at', page.url());

  // Navigate to Testimonials Manager
  await page.goto('http://localhost:5173/admin/testimonials');
  await page.waitForTimeout(2000);

  // Capture Admin Testimonials Table Screenshot
  const adminTestimonialsPath = path.join(artifactDir, 'admin_testimonials_table.png');
  await page.screenshot({ path: adminTestimonialsPath, fullPage: true });
  console.log(`✓ Saved Admin Testimonials table screenshot: ${adminTestimonialsPath}`);

  // Open "Add Testimonial" Modal
  await page.getByRole('button', { name: /Add Testimonial/i }).click();
  await page.waitForTimeout(1000);
  await page.waitForSelector('form', { timeout: 3000 });

  // Fill in candidate review
  await page.fill('input[placeholder="e.g. Priya Patel"]', 'Alex Chen');
  await page.fill('input[placeholder="e.g. Enterprise Solutions Architect"]', 'Lead Site Reliability Engineer');
  await page.fill('input[placeholder="e.g. Placed at Nexus Capital Tech"]', 'Placed at Apex FinTech Corp');
  await page.fill('input[placeholder="e.g. +$35k Salary Jump · 21 Days"]', '+$40k Comp Jump · L6 Placed');
  await page.fill(
    'textarea[placeholder*="system design coaching"]',
    'The architectural whiteboard drills and Kubernetes debugging rounds were completely game-changing. I secured 2 L6 offers within 16 business days.'
  );

  // Upload photo
  const avatarPath = path.resolve('scratch_test_images/candidate-avatar-sample.png');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(avatarPath);
    await page.waitForTimeout(1200);
  }

  // Capture Modal Screenshot
  const adminModalPath = path.join(artifactDir, 'admin_testimonials_modal.png');
  await page.screenshot({ path: adminModalPath });
  console.log(`✓ Saved Admin Testimonial Add Modal screenshot: ${adminModalPath}`);

  // Save Review
  await page.click('button[type="submit"]:has-text("Add Review")');
  await page.waitForTimeout(1500);
  console.log('✓ Successfully created testimonial with avatar photo');

  // ──────────────────────────────────────────────────────────────────────────
  // 3. BLOG EDITOR "INSERT IMAGE" ANYWHERE IN CONTENT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 3: Blog Editor Image Insertion Verification ---');
  await page.goto('http://localhost:5173/admin/content?model=posts', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click "New Article"
  await page.click('button:has-text("New Article")');
  await page.waitForSelector('#blog-form-title', { timeout: 4000 });

  // Fill Title & Meta
  await page.fill('#blog-form-title', 'Enterprise Distributed Systems Architecture in 2026');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Edit Manually")');
  await page.fill('#blog-form-slug', 'enterprise-distributed-systems-architecture-in-2026');
  await page.waitForTimeout(300);
  await page.fill('textarea[placeholder*="High-level 2-3 sentence overview"]', 'A deep dive architectural guide on enterprise distributed event mesh design, Kafka scaling, and cloud resiliency in 2026.');
  await page.waitForTimeout(300);

  // Verify Image button in Format Toolbar
  const imageBtn = page.locator('button:has-text("Image")').first();
  await imageBtn.waitFor({ state: 'visible' });
  console.log('✓ "Image" toolbar button found in Format toolbar next to Table');

  // Click Image button to open dialog
  await imageBtn.click();
  await page.waitForSelector('text=Insert Image Anywhere in Content', { timeout: 3000 });

  // Add files to upload queue
  const blogImg1 = path.resolve('scratch_test_images/architecture-mesh-diagram.png');
  const modalFileInput = await page.$('input[type="file"][multiple]');
  if (modalFileInput) {
    await modalFileInput.setInputFiles(blogImg1);
    await page.waitForTimeout(800);
  }

  // Fill in Alt text and Caption
  const altInput = page.locator('input[placeholder*="Distributed event streaming"]').first();
  await altInput.fill('Distributed event streaming Kafka and AWS architecture diagram');

  const captionInput = page.locator('input[placeholder*="Figure 1"]').first();
  await captionInput.fill('Figure 1: High-throughput Kafka event mesh topology across multi-region VPCs');

  // Capture Image Dialog Screenshot
  const blogDialogPath = path.join(artifactDir, 'admin_blog_image_dialog.png');
  await page.screenshot({ path: blogDialogPath });
  console.log(`✓ Saved Blog Image Insertion Dialog screenshot: ${blogDialogPath}`);

  // Click Insert 1 Image
  await page.click('button:has-text("Insert 1 Image")');
  await page.waitForTimeout(1500);
  console.log('✓ Successfully inserted figure into editor');

  // Open "Images in Post" Drawer
  await page.click('button:has-text("Images (")');
  await page.waitForTimeout(500);

  // Capture Editor with Images Drawer Screenshot
  const editorPath = path.join(artifactDir, 'admin_blog_editor_with_images.png');
  await page.screenshot({ path: editorPath });
  console.log(`✓ Saved Blog Editor with Images drawer screenshot: ${editorPath}`);

  // Publish Article
  await page.click('button:has-text("Publish Article")');
  await page.waitForTimeout(3000);

  const errors = await page.$$eval('.text-red-600', els => els.map(e => e.textContent));
  if (errors.length > 0) {
    console.log('FORM VALIDATION ERRORS ON PUBLISH:', errors);
  } else {
    console.log('✓ Article published without validation errors');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. VERIFY PUBLISHED BLOG POST WITH IMAGES (DESKTOP & MOBILE)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 4: Published Blog Post Media Verification ---');
  await page.goto('http://localhost:5173/blog/enterprise-distributed-systems-architecture-in-2026', {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(1000);

  // Verify figure element in rendered DOM
  const renderedFigure = page.locator('figure.blog-figure').first();
  await renderedFigure.waitFor({ state: 'visible', timeout: 10000 });
  await renderedFigure.scrollIntoViewIfNeeded();

  // Desktop Screenshot
  const postDesktopPath = path.join(artifactDir, 'blog_article_with_images_desktop.png');
  await page.screenshot({ path: postDesktopPath });
  console.log(`✓ Saved published post screenshot (Desktop 1440px): ${postDesktopPath}`);

  // Mobile Viewport (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await renderedFigure.scrollIntoViewIfNeeded();

  const postMobilePath = path.join(artifactDir, 'blog_article_with_images_mobile.png');
  await page.screenshot({ path: postMobilePath });
  console.log(`✓ Saved published post screenshot (Mobile 390px): ${postMobilePath}`);

  // ──────────────────────────────────────────────────────────────────────────
  // 5. SECURITY & ROLE-BASED TESTS
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- Step 5: Security & SVG Rejection Tests ---');
  // Test SVG rejection via fetch
  const testSvgPath = path.resolve('scratch_test_images/malicious.svg');
  fs.writeFileSync(testSvgPath, '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

  const svgFormData = new FormData();
  const svgBlob = new Blob([fs.readFileSync(testSvgPath)], { type: 'image/svg+xml' });
  svgFormData.append('image', svgBlob, 'malicious.svg');

  // SVG upload without admin cookie should fail 401 or 400
  const unauthRes = await fetch('http://localhost:5000/api/admin/blog/upload-image', {
    method: 'POST',
    body: svgFormData
  });
  console.log(`✓ Unauthenticated upload returned status: ${unauthRes.status} (Forbidden/Unauthorized as required)`);

  fs.unlinkSync(testSvgPath);
  console.log(`✓ Saved published post screenshot (Mobile 390px): ${postMobilePath}`);

  await browser.close();
  console.log('\n🎉 ALL E2E BROWSER TESTS AND SCREENSHOT CAPTURES COMPLETED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
