import { siteNavigation } from '@/data/site';
import { workHero, workMeta } from '@/data/work';
import { expect, expectPageContract, getDisplayHeadingText, test, waitForApp } from './support/app-test';

function routeAt(index: number): { label: string; to: string } {
  const route = siteNavigation.filter((item) => item.to)[index];
  if (!route?.to) throw new Error(`Missing page route at navigation index ${index}`);

  return { label: route.label, to: route.to };
}

const workRoute = routeAt(1);
const academicRoute = routeAt(2);
const personalRoute = routeAt(3);

test.describe('Shared navigation', () => {
  test('supports keyboard access and routes through header and footer navigation', async ({ page }, testInfo) => {
    const isMobile = testInfo.project.name === 'mobile-chromium';

    await expectPageContract(page, {
      path: workRoute.to,
      title: workMeta.title,
      heading: getDisplayHeadingText(workHero.titleLines),
      background: '.triangle-background',
    });

    const skipLink = page.getByRole('link', { name: 'Skip to content' });
    await page.keyboard.press('Home');
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute('href', '#content');

    const mainNavigation = page.getByRole('navigation', { name: 'Main navigation' });
    const mainMenu = page.locator('#site-navigation');
    const footerNavigation = page.getByRole('navigation', { name: 'Footer navigation' });

    if (isMobile) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(mainMenu).toBeVisible();
    }

    await expect(mainNavigation.getByRole('link', { name: workRoute.label, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(footerNavigation.getByRole('link', { name: workRoute.label, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await mainNavigation.getByRole('link', { name: academicRoute.label, exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === academicRoute.to);

    if (isMobile) {
      await expect(mainMenu).toBeHidden();
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(mainMenu).toBeVisible();
    }

    await expect(mainNavigation.getByRole('link', { name: academicRoute.label, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );

    if (isMobile) {
      await page.getByRole('button', { name: 'Close navigation' }).click();
    }

    await footerNavigation.scrollIntoViewIfNeeded();
    await footerNavigation.getByRole('link', { name: personalRoute.label, exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === personalRoute.to);
    await expect(footerNavigation.getByRole('link', { name: personalRoute.label, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('adapts the main navigation to the current viewport', async ({ page }, testInfo) => {
    await page.goto(academicRoute.to);
    await waitForApp(page);

    const menu = page.locator('#site-navigation');
    const menuButton = page.locator('button[aria-controls="site-navigation"]');

    if (testInfo.project.name === 'desktop-chromium') {
      await expect(menu).toBeVisible();
      await expect(menu.getByRole('link')).toHaveCount(siteNavigation.length);
      await expect(menuButton).toBeHidden();
      return;
    }

    await expect(menu).toBeHidden();

    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
    await expect(menu.getByRole('link')).toHaveCount(siteNavigation.length);

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();

    await page.getByRole('button', { name: 'Open navigation' }).click();
    const viewport = page.viewportSize();
    if (!viewport) throw new Error('The mobile viewport is unavailable');
    await page.mouse.click(10, viewport.height - 20);
    await expect(menu).toBeHidden();

    await page.getByRole('button', { name: 'Open navigation' }).click();
    await menu.getByRole('link', { name: workRoute.label, exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === workRoute.to);
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  });
});
