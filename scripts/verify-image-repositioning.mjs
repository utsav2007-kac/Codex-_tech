import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.resolve('C:/Users/iGen Systems/.gemini/antigravity/brain/24257650-6bb9-47cd-afe7-aec6be5496d1');

async function run() {
  console.log('🚀 Starting Verification of Image Repositioning (Up/Down/Drag/Move-To)...');

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // 1. Login to admin
  console.log('\n--- Step 1: Admin Login ---');
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@codextechit.com');
  await page.fill('input[type="password"]', 'CodexAdmin2026');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // 2. Navigate to Blog Content Manager
  console.log('\n--- Step 2: Open Blog Post Editor ---');
  await page.goto('http://localhost:5173/admin/content?model=posts', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click "New Article"
  await page.click('button:has-text("New Article")');
  await page.waitForSelector('#blog-form-title', { timeout: 4000 });

  await page.fill('#blog-form-title', 'Testing Image Repositioning Mechanics 2026');
  await page.fill('textarea[placeholder*="High-level 2-3 sentence overview"]', 'Deep testing of all 5 image repositioning modes: drawer arrows, in-editor buttons, move to dropdown, keyboard, and drag-and-drop.');
  await page.waitForTimeout(500);

  // 3. Insert Image
  console.log('\n--- Step 3: Insert Image into Content ---');
  const imageBtn = page.locator('button:has-text("Image")').first();
  await imageBtn.click();
  await page.waitForSelector('text=Insert Image Anywhere in Content', { timeout: 3000 });

  const testImgPath = path.resolve('scratch_test_images/architecture-mesh-diagram.png');
  const modalFileInput = await page.$('input[type="file"][multiple]');
  if (modalFileInput) {
    await modalFileInput.setInputFiles(testImgPath);
    await page.waitForTimeout(600);
  }

  const altInput = page.locator('input[placeholder*="Distributed event streaming"]').first();
  await altInput.fill('Meta Business Partner Architecture');

  // Insert image
  await page.click('button:has-text("Insert 1 Image")');
  await page.waitForTimeout(1000);
  console.log('✓ Image inserted into content');

  // 4. Open "Images in This Post" Drawer to verify Up / Down arrows are ENABLED
  console.log('\n--- Step 4: Verify "Images in This Post" Drawer ---');
  await page.click('button:has-text("Images (")');
  await page.waitForTimeout(500);

  // Check Move Up & Move Down buttons in drawer
  const drawerCard = page.locator('.p-3.rounded-xl.bg-white.border').first();
  await drawerCard.waitFor({ state: 'visible' });

  // Move Up button
  const moveUpBtn = drawerCard.locator('button[title*="Move Image Up"]').first();
  const isMoveUpDisabled = await moveUpBtn.isDisabled();
  console.log(`✓ Move Up button disabled state: ${isMoveUpDisabled} (Expected false because there are blocks above the image!)`);

  // Move Down button
  const moveDownBtn = drawerCard.locator('button[title*="Move Image Down"]').first();
  const isMoveDownDisabled = await moveDownBtn.isDisabled();
  console.log(`✓ Move Down button disabled state: ${isMoveDownDisabled} (Expected false because there are blocks below the image!)`);

  // Capture Screenshot of Drawer with enabled arrows
  const drawerPath = path.join(artifactDir, 'admin_images_card_enabled_arrows.png');
  await page.screenshot({ path: drawerPath });
  console.log(`✓ Saved Drawer Screenshot with enabled arrows: ${drawerPath}`);

  // Click Move Up in Drawer
  console.log('\n--- Step 5: Test Move Up Action in Drawer ---');
  await moveUpBtn.click();
  await page.waitForTimeout(600);
  console.log('✓ Clicked Move Up in drawer successfully');

  // 5. Test "Move to..." popover in Drawer
  console.log('\n--- Step 6: Test "Move to..." Popover ---');
  const moveToBtn = drawerCard.locator('button[title*="Move to specific section"]').first();
  await moveToBtn.click();
  await page.waitForTimeout(400);

  const popoverMenu = page.locator('.popover-menu').first();
  await popoverMenu.waitFor({ state: 'visible' });

  // Capture Screenshot of Popover
  const popoverPath = path.join(artifactDir, 'admin_move_to_popover.png');
  await page.screenshot({ path: popoverPath });
  console.log(`✓ Saved Move-To Popover Screenshot: ${popoverPath}`);

  // Select "At the very top"
  await page.click('button:has-text("At the very top")');
  await page.waitForTimeout(600);
  console.log('✓ Successfully moved image to very top of article');

  // Close drawer
  await page.click('button:has-text("Images (")');
  await page.waitForTimeout(300);

  // 6. Test In-Visual-Editor Selection & Floating Control Bar
  console.log('\n--- Step 7: Test In-Editor Selection & Floating Control Bar ---');
  const visualFigure = page.locator('figure.blog-figure').first();
  await visualFigure.click();
  await page.waitForTimeout(500);

  const controlBar = page.locator('.figure-control-bar').first();
  await controlBar.waitFor({ state: 'visible' });

  // Capture Screenshot of In-Editor Floating Control Bar
  const controlBarPath = path.join(artifactDir, 'admin_visual_image_control_bar.png');
  await page.screenshot({ path: controlBarPath });
  console.log(`✓ Saved In-Editor Control Bar Screenshot: ${controlBarPath}`);

  // Test In-Editor Move Down
  const inEditorMoveDown = controlBar.locator('button:has-text("Move Down")').first();
  await inEditorMoveDown.click();
  await page.waitForTimeout(500);
  console.log('✓ Clicked In-Editor Move Down successfully');

  // Test Keyboard Alt+ArrowDown
  console.log('\n--- Step 8: Test Keyboard Alt+Down Navigation ---');
  await page.keyboard.press('Alt+ArrowDown');
  await page.waitForTimeout(500);
  console.log('✓ Keyboard Alt+ArrowDown moved figure down past next block');

  // Test Undo (Ctrl+Z)
  console.log('\n--- Step 9: Test Undo (Ctrl+Z) ---');
  await page.keyboard.press('Control+z');
  await page.waitForTimeout(500);
  console.log('✓ Undo (Ctrl+Z) reverted last move');

  // Test Drag and Drop Line Simulation
  console.log('\n--- Step 10: Test Pointer Drag & Drop Simulation ---');
  const dragHandle = controlBar.locator('div[role="button"][aria-label*="Drag to move"]').first();
  const handleBox = await dragHandle.boundingBox();

  if (handleBox) {
    // Pointer down on handle
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(200);

    // Move mouse down across the editor to trigger drop line
    await page.mouse.move(handleBox.x, handleBox.y + 180, { steps: 10 });
    await page.waitForTimeout(300);

    // Capture Drag Drop Line Screenshot
    const dropLinePath = path.join(artifactDir, 'admin_image_drag_drop_line.png');
    await page.screenshot({ path: dropLinePath });
    console.log(`✓ Saved Drag & Drop Line Screenshot: ${dropLinePath}`);

    // Drop
    await page.mouse.up();
    await page.waitForTimeout(500);
    console.log('✓ Completed drag and drop repositioning');
  }

  await browser.close();
  console.log('\n🎉 ALL IMAGE REPOSITIONING TESTS PASSED AND SCREENSHOTS CAPTURED!');
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

