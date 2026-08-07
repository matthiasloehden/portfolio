import { expect, test, type Page } from '@playwright/test';

function captureRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

async function openParticlePage(page: Page): Promise<string[]> {
  const runtimeErrors = captureRuntimeErrors(page);
  await page.goto('/projects?particlesDebug=1');
  await expect(page.getByRole('heading', { name: 'Systems, security & service.' })).toBeVisible();
  await expect(page.locator('.particle-debug')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('.particle-debug')).toContainText('WebGL2 / GPGPU', { timeout: 20000 });
  return runtimeErrors;
}

test('renders and responds to desktop pointer and scroll input', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop interaction test');
  const runtimeErrors = await openParticlePage(page);
  const canvas = page.locator('.particle-background canvas');

  await expect(canvas).toBeVisible();
  const canvasSize = await canvas.evaluate((element) => ({ width: element.width, height: element.height }));
  expect(canvasSize.width).toBeGreaterThan(1000);
  expect(canvasSize.height).toBeGreaterThan(600);

  // Idle, slow movement, fast movement, viewport exit/re-entry, then wheel input.
  await page.waitForTimeout(500);
  await page.mouse.move(220, 300);
  await page.mouse.move(320, 340, { steps: 18 });
  await page.mouse.move(1120, 220, { steps: 2 });
  await page.mouse.move(-10, 200);
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(500);

  await expect(page.locator('.particle-debug')).toContainText(/pointerSpeed/);
  await expect(page.locator('.particle-debug')).toContainText(/scrollVelocity/);
  await expect(page.locator('#project-list')).toBeInViewport();
  expect(runtimeErrors).toEqual([]);
});

test('keeps touch scrolling and links native on mobile', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile interaction test');
  const runtimeErrors = await openParticlePage(page);
  const session = await context.newCDPSession(page);

  const touch = async (type: 'touchStart' | 'touchMove' | 'touchEnd', x: number, y: number): Promise<void> => {
    await session.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: type === 'touchEnd' ? [] : [{ x, y }],
    });
  };

  // Slow drag, pause, direction change, and repeated fast flicks.
  await touch('touchStart', 210, 650);
  await touch('touchMove', 215, 590);
  await page.waitForTimeout(180);
  await touch('touchMove', 205, 625);
  await touch('touchMove', 220, 430);
  await touch('touchMove', 225, 220);
  await touch('touchEnd', 225, 220);
  await page.waitForTimeout(250);

  for (let index = 0; index < 2; index += 1) {
    await touch('touchStart', 210, 650);
    await touch('touchMove', 210, 260);
    await touch('touchEnd', 210, 260);
    await page.waitForTimeout(120);
  }

  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(page.locator('.particle-debug')).toContainText('touchActive');

  await page.locator('#project-list').scrollIntoViewIfNeeded();
  await page.locator('#project-list a').first().click();
  await page.waitForURL(/#streaming$/, { timeout: 10000 });
  expect(runtimeErrors).toEqual([]);
});

test('uses a static state when reduced motion is requested', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One reduced-motion browser is sufficient');
  const runtimeErrors = captureRuntimeErrors(page);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects?particlesDebug=1');
  await expect(page.locator('.particle-background canvas')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Systems, security & service.' })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});
