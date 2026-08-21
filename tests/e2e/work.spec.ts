import { clientCase, workCases, workClosing, workHero, workMeta, workOverview } from '@/data/work';
import { expect, expectHeadingInViewport, expectPageContract, getPageHeroTitle, test } from './support/app-test';

test.describe('Work page', () => {
  test('presents all professional case studies and links the overview to them', async ({ page }) => {
    await expectPageContract(page, {
      path: '/work',
      title: workMeta.title,
      heading: getPageHeroTitle(workHero),
      background: '.triangle-background',
    });

    const overview = page.locator(`#${workOverview.id}`);
    await expect(overview.getByRole('link')).toHaveCount(workOverview.items.length);

    for (const caseStudy of workCases) {
      await expect(page.getByRole('heading', { name: caseStudy.title, exact: true })).toBeAttached();
    }

    await overview.getByRole('link', { name: clientCase.listTitle }).click();
    await expect(page).toHaveURL((url) => url.hash === `#${clientCase.id}`);
    await expectHeadingInViewport(page, clientCase.title);

    await expect(page.getByRole('heading', { name: workClosing.title, exact: true })).toBeAttached();
  });
});
