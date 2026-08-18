import { expect, expectHeadingInViewport, expectPageContract, test } from './support/app-test';

test.describe('Work page', () => {
  test('presents all professional case studies and links the overview to them', async ({ page }) => {
    await expectPageContract(page, {
      path: '/work',
      title: 'Professional Work | Matthias Löhden',
      heading: 'Software for work that matters.',
      background: '.triangle-background',
    });

    const overview = page.locator('#work-list');
    await expect(overview.getByRole('link')).toHaveCount(4);

    const caseStudies = [
      'Enterprise learning platform',
      'Retail operations platform',
      'Digital signage control system',
      'One platform, different communities.',
    ];

    for (const heading of caseStudies) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeAttached();
    }

    await overview.getByRole('link', { name: /Client platform/i }).click();
    await expect(page).toHaveURL(/#client-platform$/);
    await expectHeadingInViewport(page, 'One platform, different communities.');

    await expect(page.getByRole('heading', { name: 'Built for the people operating it every day.' })).toBeAttached();
  });
});
