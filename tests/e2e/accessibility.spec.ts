import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';

import { expect, test, waitForApp } from './support/app-test';
import { expandSettingsAccordion, openDisplaySettings } from './support/display-settings';
import { SITE_PAGES, THEMES } from './support/pages';

async function expectNoAccessibilityViolations(page: Page, testInfo: TestInfo, include?: string): Promise<void> {
  let analysis = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (include) analysis = analysis.include(include);

  const results = await analysis.analyze();

  await testInfo.attach('accessibility-violations', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const violationSummary = results.violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    targets: violation.nodes.flatMap((node) => node.target),
  }));

  expect(violationSummary, 'Automatically detectable accessibility violations').toEqual([]);
}

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

        await expectNoAccessibilityViolations(page, testInfo);
      });
    }
  }

  test('expanded display controls have no automatically detectable WCAG A or AA violations', async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/work');
    await waitForApp(page);

    const dialog = await openDisplaySettings(page);
    await expandSettingsAccordion(dialog, 'Advanced background settings');
    await expandSettingsAccordion(dialog, 'Animations');
    await expandSettingsAccordion(dialog, /Configure active background/);
    await expandSettingsAccordion(dialog, 'Appearance');
    await expandSettingsAccordion(dialog, 'Interactions');

    await expectNoAccessibilityViolations(page, testInfo, '#display-settings');
  });
});
