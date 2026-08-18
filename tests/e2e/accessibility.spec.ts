import AxeBuilder from '@axe-core/playwright';
import { expect, test, waitForApp } from './support/app-test';
import { SITE_PAGES, THEMES } from './support/pages';

test.describe('Accessibility', () => {
  test.describe.configure({ timeout: 90_000 });

  for (const sitePage of SITE_PAGES) {
    for (const theme of THEMES) {
      test(`${sitePage.name} has no automatically detectable WCAG A or AA violations in ${theme} mode`, async ({
        page,
      }, testInfo) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('portfolio-theme', selectedTheme);
        }, theme);

        await page.goto(sitePage.path, { waitUntil: 'domcontentloaded' });
        await waitForApp(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

        await testInfo.attach('accessibility-violations', {
          body: JSON.stringify(results.violations, null, 2),
          contentType: 'application/json',
        });

        const violationSummary = results.violations.map((violation) => ({
          rule: violation.id,
          impact: violation.impact,
          targets: violation.nodes.flatMap((node) => node.target),
        }));

        expect(violationSummary, `Accessibility violations on ${sitePage.name} in ${theme} mode`).toEqual([]);
      });
    }
  }
});
