import { expect, test, type Page } from '@playwright/test';

function captureRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test('renders the home wave grid and responds to pointer and wheel input', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop interaction test');
  const runtimeErrors = captureRuntimeErrors(page);

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'I build web products that feel effortless.' })).toBeVisible();

  const background = page.locator('.wave-grid-background');
  const canvas = background.locator('canvas');
  await expect(background).not.toHaveClass(/is-fallback/);
  await expect(canvas).toBeVisible();

  await expect.poll(() => canvas.evaluate((element) => element.width)).toBeGreaterThan(1_000);
  await expect.poll(() => canvas.evaluate((element) => element.height)).toBeGreaterThan(700);
  await expect(background).toHaveCSS('position', 'fixed');

  await page.mouse.move(540, 320);
  await page.mouse.move(1_080, 520, { steps: 16 });
  await page.waitForTimeout(500);

  await page.mouse.wheel(0, 900);
  await expect.poll(() => background.evaluate((element) => element.getBoundingClientRect().top)).toBe(0);
  await page.mouse.wheel(0, -780);
  await page.waitForTimeout(300);
  expect(runtimeErrors).toEqual([]);
});

test('keeps a static grid when reduced motion is requested', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One reduced-motion browser is sufficient');
  const runtimeErrors = captureRuntimeErrors(page);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('.wave-grid-background canvas')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'I build applications.' })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test('creates touch ripples without blocking mobile scrolling', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile touch interaction test');
  const runtimeErrors = captureRuntimeErrors(page);
  const session = await context.newCDPSession(page);

  await page.goto('/');
  await expect(page.locator('.wave-grid-background canvas')).toBeVisible();

  const touch = async (type: 'touchStart' | 'touchMove' | 'touchEnd', x: number, y: number): Promise<void> => {
    await session.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: type === 'touchEnd' ? [] : [{ x, y }],
    });
  };

  await touch('touchStart', 210, 690);
  await touch('touchMove', 212, 610);
  await touch('touchMove', 208, 480);
  await touch('touchMove', 214, 290);
  await touch('touchEnd', 214, 290);
  await page.waitForTimeout(500);

  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(page.locator('.wave-grid-background')).toHaveCSS('position', 'fixed');
  expect(runtimeErrors).toEqual([]);
});
