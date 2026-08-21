import {
  contributionPanel,
  coolingPanel,
  hardwareSection,
  homelabPanel,
  learningPanel,
  personalClosing,
  personalHero,
  personalMeta,
  personalOverview,
  personalSections,
} from '@/data/personal';
import { expect, expectHeadingInViewport, expectPageContract, getPageHeroTitle, test } from './support/app-test';

test.describe('Personal page', () => {
  test('presents all personal projects with their supporting panels', async ({ page }) => {
    await expectPageContract(page, {
      path: '/personal',
      title: personalMeta.title,
      heading: getPageHeroTitle(personalHero),
      background: '.mesh-background',
    });

    const overview = page.locator(`#${personalOverview.id}`);
    await expect(overview.getByRole('link')).toHaveCount(personalOverview.items.length);

    for (const project of personalSections) {
      await expect(page.getByRole('heading', { name: project.title, exact: true })).toBeAttached();
    }

    for (const panel of [contributionPanel, homelabPanel, learningPanel, coolingPanel]) {
      await expect(page.getByLabel(panel.ariaLabel, { exact: true })).toBeAttached();
    }

    await overview.getByRole('link', { name: hardwareSection.listTitle }).click();
    await expect(page).toHaveURL((url) => url.hash === `#${hardwareSection.id}`);
    await expectHeadingInViewport(page, hardwareSection.title);

    const sourceAction = personalClosing.actions.find((action) => action.href?.startsWith('http'));
    if (!sourceAction?.href) throw new Error('The personal page needs an external source action');

    await expect(page.getByRole('link', { name: sourceAction.label, exact: true }).last()).toHaveAttribute(
      'href',
      sourceAction.href,
    );
  });
});
