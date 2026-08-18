import { expect, test as base, type Page } from '@playwright/test';

type AppFixtures = {
  runtimeErrorGuard: void;
};

function isNuxtServerTimingNoise(message: string): boolean {
  return (
    (message.includes("Warning: Label '[nuxt-app]") && message.includes('already exists for console.time()')) ||
    (message.includes("Warning: No such label '[nuxt-app]") && message.includes('for console.timeEnd()'))
  );
}

/**
 * Every acceptance test also checks the browser for uncaught exceptions and
 * console errors. A page that looks complete but fails during hydration is not
 * considered healthy.
 */
export const test = base.extend<AppFixtures>({
  runtimeErrorGuard: [
    async ({ page }, use) => {
      const errors: string[] = [];

      // Each local run may start many WebGL-heavy pages in parallel. The low
      // profile keeps the actual backgrounds enabled while reducing rendering
      // load that is irrelevant to the acceptance criteria.
      await page.addInitScript(() => {
        localStorage.setItem('portfolio-background-performance', JSON.stringify({ mode: 'low', showStats: false }));
      });

      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        const text = message.text();

        // Concurrent SSR requests can make Nuxt's development timing labels
        // overlap. This is framework diagnostics noise, not a browser failure.
        if (message.type() === 'error' && !isNuxtServerTimingNoise(text)) errors.push(text);
      });

      await use();

      expect(errors, 'The page emitted runtime errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';

/** Waits for Nuxt hydration and the client-side preference setup. */
export async function waitForApp(page: Page): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('data-background-motion', /playing|paused/, {
    timeout: 20_000,
  });
  await expect(page.locator('html')).toHaveClass(/motion-ready/, { timeout: 20_000 });
}

type PageContract = {
  path: string;
  title: string;
  heading: string | RegExp;
  background: string;
};

/**
 * Shared page-level acceptance criteria. These assertions deliberately cover
 * observable outcomes rather than canvas internals or Vue implementation
 * details.
 */
export async function expectPageContract(page: Page, contract: PageContract): Promise<void> {
  await page.goto(contract.path);
  await waitForApp(page);

  await expect(page).toHaveTitle(contract.title);
  await expect(page.locator('main#content')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  const heading = page.getByRole('heading', { level: 1, name: contract.heading });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('opacity', '1');

  await expect(page.locator('.background-scene-active')).toHaveCount(1);
  const background = page.locator(`${contract.background}.background-scene-active`);
  await expect(background).toBeVisible();
  await expect(background).toHaveCSS('position', 'fixed');

  await expect
    .poll(
      () =>
        page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)),
      { message: 'The page must not overflow horizontally' },
    )
    .toBeLessThanOrEqual(1);
}

export async function expectHeadingInViewport(page: Page, name: string | RegExp): Promise<void> {
  const heading = page.getByRole('heading', { name });
  await expect(heading).toBeInViewport();
}
