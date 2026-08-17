import { expect, test, type Page } from '@playwright/test';

function captureRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test('uses the Living Mesh on the personal page', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop interaction test');
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto('/personal');
  await expect(page.getByRole('heading', { name: 'Built from curiosity.' })).toBeVisible();

  const background = page.locator('.mesh-background');
  const canvas = background.locator('canvas');
  await expect(background).toHaveClass(/background-scene-active/);
  await expect(background).toHaveCSS('position', 'fixed');
  await expect.poll(() => canvas.evaluate((element) => element.width)).toBeGreaterThan(1_000);
  await expect.poll(() => canvas.evaluate((element) => element.height)).toBeGreaterThan(700);
  await expect
    .poll(() =>
      canvas.evaluate((element) => {
        const context = element.getContext('2d');
        if (!context) return 0;
        const pixels = context.getImageData(0, 0, element.width, element.height).data;
        let paintedPixels = 0;
        for (let index = 3; index < pixels.length; index += 64) {
          if ((pixels[index] ?? 0) > 0) paintedPixels += 1;
        }
        return paintedPixels;
      }),
    )
    .toBeGreaterThan(100);

  await page.mouse.move(180, 280);
  await page.mouse.move(1_080, 420, { steps: 14 });
  await page.waitForTimeout(350);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => background.evaluate((element) => element.getBoundingClientRect().top)).toBe(0);
  expect(runtimeErrors).toEqual([]);
});

test('keeps a static mesh when reduced motion is requested', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One reduced-motion browser is sufficient');
  const runtimeErrors = captureRuntimeErrors(page);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/personal');

  await expect(page.locator('.mesh-background canvas')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Built from curiosity.' })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test('does not block native touch scrolling', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile touch interaction test');
  const runtimeErrors = captureRuntimeErrors(page);
  const session = await context.newCDPSession(page);

  await page.goto('/personal');
  await expect(page.locator('.mesh-background canvas')).toBeVisible();

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 210, y: 690 }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 212, y: 340 }],
  });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(runtimeErrors).toEqual([]);
});
