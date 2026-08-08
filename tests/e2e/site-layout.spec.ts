import { expect, test, type Page } from '@playwright/test';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator('html')).toHaveClass(/motion-ready/);
}

test('shares active navigation and persists the selected theme', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop navigation test');

  await page.goto('/work');
  await waitForHydration(page);

  const mainNavigation = page.getByRole('navigation', { name: 'Main navigation' });
  const footerNavigation = page.getByRole('navigation', { name: 'Footer navigation' });
  await expect(mainNavigation.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(footerNavigation.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await page.getByRole('button', { name: 'Display settings' }).click();
  await page.getByLabel('Theme').selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await waitForHydration(page);
  await page.getByRole('button', { name: 'Display settings' }).click();
  await expect(page.getByLabel('Theme')).toHaveValue('light');
});

test('uses a full-viewport triangle background on the work page', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop layout test');

  await page.goto('/work');
  await waitForHydration(page);

  const triangleBackground = page.locator('.triangle-background').first();
  await expect(triangleBackground).toBeVisible();
  await expect(triangleBackground).toHaveCSS('position', 'fixed');
});

test('offers the complete navigation in the mobile menu', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile navigation test');

  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'light'));
  await page.goto('/projects');
  await waitForHydration(page);

  const menu = page.locator('#site-navigation');
  const menuButton = page.locator('button[aria-controls="site-navigation"]');
  await expect(page.getByRole('button', { name: 'Display settings' })).toBeVisible();
  await expect(menu).toBeHidden();
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link')).toHaveCount(5);

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  await page.getByRole('button', { name: 'Open navigation' }).click();
  await menu.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(menu).toBeHidden();
});

test('presents personal projects and interests as a complete page', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'One content check is sufficient');

  await page.goto('/personal');
  await waitForHydration(page);

  await expect(page.getByRole('heading', { name: 'Built from curiosity.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Improving the tools I already use.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Running software beyond localhost.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'From transistors to software architecture.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The machine matters too.' })).toBeVisible();
  await expect(page.getByText('3Blue1Brown', { exact: true })).toBeVisible();
  await expect(page.getByText('4 radiators', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Personal', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});
