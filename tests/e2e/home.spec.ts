import { homeAbout, homeCapabilities, homeHero } from '@/data/content/en/home';
import { site } from '@/data/site';
import { workHero } from '@/data/content/en/work';
import { APP_ROUTE_PATHS } from '@/config/routes';
import { expect, expectPageContract, getDisplayHeadingText, test } from './support/app-test';

test.describe('Home page', () => {
  test('introduces the profile and provides the three capability paths', async ({ page }) => {
    await expectPageContract(page, {
      path: '/',
      title: `${site.name} | ${site.role}`,
      heading: getDisplayHeadingText(homeHero.title),
      background: '.wave-background',
      themePreset: 'arctic',
    });

    await expect(page.getByText(homeHero.highlights[0].description, { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: getDisplayHeadingText(homeAbout.title), exact: true }),
    ).toBeAttached();
    await expect(
      page.getByRole('heading', {
        name: getDisplayHeadingText(homeCapabilities.title),
        exact: true,
      }),
    ).toBeAttached();

    const capabilities = page.locator('#capabilities');
    const capabilityLinks = capabilities.getByRole('link');
    await expect(capabilityLinks).toHaveCount(homeCapabilities.items.length);

    for (const capability of homeCapabilities.items) {
      await expect(
        capabilities.getByRole('link', { name: `View ${capability.title} section`, exact: true }),
      ).toHaveAttribute('href', APP_ROUTE_PATHS[capability.to.name]);
    }

    const firstCapability = homeCapabilities.items[0];
    await capabilities.getByRole('link', { name: `View ${firstCapability.title} section`, exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === APP_ROUTE_PATHS[firstCapability.to.name]);
    await expect(page.getByRole('heading', { level: 1, name: getDisplayHeadingText(workHero.title) })).toBeVisible();
  });
});
