import { expect, expectHeadingInViewport, expectPageContract, test } from './support/app-test';

test.describe('Personal page', () => {
  test('presents all personal projects with their supporting panels', async ({ page }) => {
    await expectPageContract(page, {
      path: '/personal',
      title: 'Personal Projects & Interests | Matthias Löhden',
      heading: 'Built from curiosity.',
      background: '.mesh-background',
    });

    const overview = page.locator('#personal-list');
    await expect(overview.getByRole('link')).toHaveCount(4);

    const projects = [
      'Improving the tools I already use.',
      'Running software beyond localhost.',
      'From transistors to software architecture.',
      'The machine matters too.',
    ];

    for (const heading of projects) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeAttached();
    }

    await expect(page.getByLabel('Selected open-source contributions')).toBeAttached();
    await expect(page.getByLabel(/A personal computer hosts Docker workloads/i)).toBeAttached();
    await expect(page.getByLabel(/Favorite educational YouTube creators/i)).toBeAttached();
    await expect(page.getByLabel(/Custom PC water-cooling system/i)).toBeAttached();

    await overview.getByRole('link', { name: /Custom PC hardware/i }).click();
    await expect(page).toHaveURL(/#hardware$/);
    await expectHeadingInViewport(page, 'The machine matters too.');

    await expect(page.getByRole('link', { name: 'View source', exact: true }).last()).toHaveAttribute(
      'href',
      'https://github.com/matthiasloehden/portfolio',
    );
  });
});
