import { streamingCase } from '@/data/academic';
import { hardwareSection } from '@/data/personal';
import { expect, getDisplayHeadingText, test, waitForApp } from './support/app-test';

test.describe('Motion preferences and scroll reveal', () => {
  test('reveals content again whenever it re-enters the viewport', async ({ page }) => {
    await page.goto('/academic');
    await waitForApp(page);

    const target = page.locator(`#${streamingCase.id} header [data-reveal="up"]`).first();
    await expect(target).not.toHaveClass(/is-revealed/);

    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/is-revealed/);
    await expect(target).toHaveCSS('opacity', '1');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(target).not.toHaveClass(/is-revealed/);

    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/is-revealed/);
  });

  test('shows reveal content immediately when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/personal');
    await waitForApp(page);

    await expect.poll(() => page.locator('[data-reveal]:not(.is-revealed)').count()).toBe(0);
    await expect(
      page.getByRole('heading', { name: getDisplayHeadingText(hardwareSection.titleLines), exact: true }),
    ).toBeAttached();
  });
});
