import { expect, expectHeadingInViewport, expectPageContract, test } from './support/app-test';

test.describe('Academic page', () => {
  test('presents all university projects and their essential system information', async ({ page }) => {
    await expectPageContract(page, {
      path: '/academic',
      title: 'University Projects | Matthias Löhden',
      heading: 'Systems, security & service.',
      background: '.particle-background',
    });

    const overview = page.locator('#academic-list');
    await expect(overview.getByRole('link')).toHaveCount(3);

    const projects = [
      'From raw events to a live operational view.',
      'Passwordless sign-in with FIDO2 passkeys.',
      'Turning framework guidance into workable service operations.',
    ];

    for (const heading of projects) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeAttached();
    }

    await expect(page.getByLabel(/Data flows from producers through Kafka and Flink/i)).toBeAttached();
    await expect(page.getByText('No shared password transmitted', { exact: true })).toBeAttached();
    await expect(page.getByText('FitSM', { exact: true })).toBeAttached();

    await overview.getByRole('link', { name: /FIDO2 passkeys/i }).click();
    await expect(page).toHaveURL(/#passkeys$/);
    await expectHeadingInViewport(page, 'Passwordless sign-in with FIDO2 passkeys.');
  });
});
