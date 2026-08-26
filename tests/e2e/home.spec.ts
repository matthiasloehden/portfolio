import { homeAbout, homeCapabilities, homeHero } from '@/data/home';
import { site } from '@/data/site';
import { workHero } from '@/data/work';
import { expect, expectPageContract, getDisplayHeadingText, test } from './support/app-test';

test.describe('Home page', () => {
  test('introduces the profile and provides the three capability paths', async ({ page }) => {
    await expectPageContract(page, {
      path: '/',
      title: `${site.name} | ${site.role}`,
      heading: getDisplayHeadingText(homeHero.titleLines),
      background: '.wave-background',
    });

    await expect(page.getByText(homeHero.highlights[0].description, { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: getDisplayHeadingText(homeAbout.titleLines), exact: true }),
    ).toBeAttached();
    await expect(
      page.getByRole('heading', {
        name: getDisplayHeadingText(homeCapabilities.titleLines),
        exact: true,
      }),
    ).toBeAttached();

    const capabilities = page.locator('#capabilities');
    const capabilityLinks = capabilities.getByRole('link');
    await expect(capabilityLinks).toHaveCount(homeCapabilities.items.length);

    for (const capability of homeCapabilities.items) {
      await expect(
        capabilities.getByRole('link', { name: `View ${capability.title} section`, exact: true }),
      ).toHaveAttribute('href', capability.to);
    }

    const firstCapability = homeCapabilities.items[0];
    await capabilities.getByRole('link', { name: `View ${firstCapability.title} section`, exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === firstCapability.to);
    await expect(
      page.getByRole('heading', { level: 1, name: getDisplayHeadingText(workHero.titleLines) }),
    ).toBeVisible();
  });
});
