import type { Locator, Page } from '@playwright/test';

import { expect } from './app-test';

/** Opens the display panel through its public, accessible trigger contract. */
export async function openDisplaySettings(
  page: Page,
  labels = {
    open: 'Open display settings',
    dialog: 'Display settings',
    close: 'Close display settings',
  },
): Promise<Locator> {
  await page.getByRole('button', { name: labels.open }).click();

  const dialog = page.getByRole('dialog', { name: labels.dialog });
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await expect(page.getByRole('button', { name: labels.close })).toHaveAttribute('aria-expanded', 'true');

  return dialog;
}

/** Expands one accordion and waits for its ARIA state before using its content. */
export async function expandSettingsAccordion(scope: Locator, name: string | RegExp, exact = true): Promise<Locator> {
  const trigger = scope.getByRole('button', { name, exact });

  if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  return trigger;
}
