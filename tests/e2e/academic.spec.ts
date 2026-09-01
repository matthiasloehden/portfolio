import {
  academicCases,
  academicHero,
  academicMeta,
  academicOverview,
  authenticationPanel,
  passkeysCase,
  servicePanel,
  streamingPanel,
} from '@/data/content/en/academic';
import { expect, expectHeadingInViewport, expectPageContract, getDisplayHeadingText, test } from './support/app-test';

test.describe('Academic page', () => {
  test('presents all university projects and their essential system information', async ({ page }) => {
    await expectPageContract(page, {
      path: '/academic',
      title: academicMeta.title,
      heading: getDisplayHeadingText(academicHero.title),
      background: '.mesh-background',
      themePreset: 'aurora',
    });

    const overview = page.locator(`#${academicOverview.id}`);
    await expect(overview.getByRole('link')).toHaveCount(academicOverview.items.length);

    for (const project of academicCases) {
      await expect(
        page.getByRole('heading', { name: getDisplayHeadingText(project.title), exact: true }),
      ).toBeAttached();
    }

    await expect(page.getByLabel(streamingPanel.ariaLabel, { exact: true })).toBeAttached();
    await expect(page.getByText(authenticationPanel.status, { exact: true })).toBeAttached();
    await expect(page.getByText(servicePanel.frameworks[1].name, { exact: true })).toBeAttached();

    await overview.getByRole('link', { name: passkeysCase.listTitle }).click();
    await expect(page).toHaveURL((url) => url.hash === `#${passkeysCase.id}`);
    await expectHeadingInViewport(page, getDisplayHeadingText(passkeysCase.title));
  });
});
