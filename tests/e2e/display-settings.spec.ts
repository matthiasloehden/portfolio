import { expect, test, waitForApp } from './support/app-test';

test.describe('Display settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work');
    await waitForApp(page);
    await page.getByRole('button', { name: 'Display settings' }).click();
    await expect(page.getByRole('dialog', { name: 'Display settings' })).toBeVisible();
  });

  test('applies and persists the selected theme', async ({ page }) => {
    await page.getByLabel('Theme', { exact: true }).selectOption('dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('dark');

    await page.reload();
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Display settings' }).click();
    await expect(page.getByLabel('Theme', { exact: true })).toHaveValue('dark');

    await page.getByRole('button', { name: 'Restore default settings' }).click();
    await expect(page.getByLabel('Theme', { exact: true })).toHaveValue('system');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBeNull();
  });

  test('disables irrelevant controls when backgrounds are turned off', async ({ page }) => {
    await page.getByLabel('Background', { exact: true }).selectOption('none');

    await expect(page.locator('.background-scene-active')).toHaveCount(0);
    await expect(page.getByLabel('Performance', { exact: true })).toBeDisabled();
    await expect(page.getByRole('checkbox', { name: 'Performance stats' })).toBeDisabled();
    await expect(page.getByRole('checkbox', { name: 'Background idle animation' })).toBeDisabled();

    await page.getByRole('button', { name: 'Restore default settings' }).click();
    await expect(page.getByLabel('Background', { exact: true })).toHaveValue('auto');
    await expect(page.getByLabel('Performance', { exact: true })).toBeEnabled();
    await expect(page.locator('.triangle-background.background-scene-active')).toBeVisible();
  });

  test('persists independent animation preferences', async ({ page }) => {
    const animationNames = [
      'Background idle animation',
      'Cursor movement animation',
      'Cursor click animation',
      'Scroll animation',
    ];

    for (const name of animationNames) {
      await page.getByRole('checkbox', { name }).uncheck();
    }

    await expect(page.locator('html')).toHaveAttribute('data-background-motion', 'paused');

    await page.reload();
    await waitForApp(page);
    await page.getByRole('button', { name: 'Display settings' }).click();

    for (const name of animationNames) {
      await expect(page.getByRole('checkbox', { name })).not.toBeChecked();
    }

    await page.getByRole('checkbox', { name: 'Scroll animation' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-background-motion', 'playing');
  });
});
