import { expect, expectPageContract, test } from './support/app-test';

test.describe('Home page', () => {
  test('introduces the profile and provides the three capability paths', async ({ page }) => {
    await expectPageContract(page, {
      path: '/',
      title: 'Matthias Löhden | Software Engineer',
      heading: 'I build applications.',
      background: '.wave-background',
    });

    await expect(page.getByText('Professional software development', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Practical experience, backed by strong fundamentals\./i }),
    ).toBeAttached();
    await expect(page.getByRole('heading', { name: /Experience, in context\./i })).toBeAttached();

    const capabilities = page.locator('#capabilities');
    const capabilityLinks = capabilities.getByRole('link');
    await expect(capabilityLinks).toHaveCount(3);
    await expect(capabilities.getByRole('link', { name: 'View Professional section' })).toHaveAttribute(
      'href',
      '/work',
    );
    await expect(capabilities.getByRole('link', { name: 'View Academic section' })).toHaveAttribute(
      'href',
      '/academic',
    );
    await expect(capabilities.getByRole('link', { name: 'View Personal section' })).toHaveAttribute(
      'href',
      '/personal',
    );

    await capabilities.getByRole('link', { name: 'View Professional section' }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Software for work that matters.' })).toBeVisible();
  });
});
