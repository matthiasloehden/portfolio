import type { Page } from '@playwright/test';

import { expect, test, waitForApp } from './support/app-test';

async function installControlledIdleCallbacks(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const idleCallbacks = new Map<number, IdleRequestCallback>();
    let nextIdleCallbackId = 1;

    window.requestIdleCallback = (callback) => {
      const id = nextIdleCallbackId++;
      idleCallbacks.set(id, callback);
      return id;
    };
    window.cancelIdleCallback = (id) => {
      idleCallbacks.delete(id);
    };
    Object.assign(window, {
      getPortfolioIdleCallbackCount: () => idleCallbacks.size,
      runPortfolioIdleCallbacks: () => {
        const callbacks = [...idleCallbacks.values()];
        idleCallbacks.clear();
        callbacks.forEach((callback) => callback({ didTimeout: false, timeRemaining: () => 50 }));
      },
    });
  });
}

async function runIdleCallbacks(page: Page): Promise<void> {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const idleWindow = window as typeof window & { getPortfolioIdleCallbackCount: () => number };
        return idleWindow.getPortfolioIdleCallbackCount();
      }),
    )
    .toBeGreaterThanOrEqual(1);
  await page.evaluate(() => {
    const idleWindow = window as typeof window & { runPortfolioIdleCallbacks: () => void };
    idleWindow.runPortfolioIdleCallbacks();
  });
}

test.describe('Idle loading', () => {
  test.beforeEach(async ({ page }) => installControlledIdleCallbacks(page));

  test('loads the active background immediately and prewarms the others during idle', async ({ page }) => {
    await page.goto('/work');
    await waitForApp(page);
    await expect(page.locator('.background-scene')).toHaveCount(1);
    await expect(page.locator('.triangle-background.background-scene-active')).toBeVisible();

    await runIdleCallbacks(page);
    await expect(page.locator('.background-scene')).toHaveCount(1);

    for (const expectedSceneCount of [2, 3, 4]) {
      await runIdleCallbacks(page);
      await expect(page.locator('.background-scene')).toHaveCount(expectedSceneCount);
    }
    await expect(page.locator('.background-scene-active')).toHaveCount(1);
  });

  test('loads and mounts display settings during idle without showing the dialog', async ({ page }) => {
    await page.goto('/work');
    await waitForApp(page);

    await expect(page.getByRole('button', { name: 'Open display settings' })).toBeVisible();
    const mountedDialog = page.locator('#display-settings');
    await expect(mountedDialog).toHaveCount(0);

    await runIdleCallbacks(page);

    await expect(mountedDialog).toHaveCount(1);
    await expect(mountedDialog).toBeHidden();

    await page.getByRole('button', { name: 'Open display settings' }).click();
    const dialog = page.getByRole('dialog', { name: 'Display settings' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toBeFocused();
  });

  test('loads and opens display settings when clicked before idle', async ({ page }) => {
    await page.goto('/work');
    await waitForApp(page);

    await expect(page.locator('#display-settings')).toHaveCount(0);
    await page.getByRole('button', { name: 'Open display settings' }).click();

    const dialog = page.getByRole('dialog', { name: 'Display settings' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toBeFocused();
  });
});
