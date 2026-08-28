import type { Locator } from '@playwright/test';

import { expect, test, waitForApp } from './support/app-test';
import { expandSettingsAccordion, openDisplaySettings } from './support/display-settings';

async function openTriangleAppearanceSettings(dialog: Locator): Promise<void> {
  await expandSettingsAccordion(dialog, 'Advanced background settings');
  await expandSettingsAccordion(dialog, /Configure active background/);
  await expandSettingsAccordion(dialog, 'Appearance');
}

function getPerformanceSelect(dialog: Locator): Locator {
  return dialog.getByRole('combobox', { name: 'Background performance' });
}

function getSelectMeta(select: Locator): Locator {
  return select.locator('xpath=preceding-sibling::span[1]/span/span[2]');
}

function getSelectListbox(select: Locator): Locator {
  return select.locator('xpath=following-sibling::*[@role="listbox"]');
}

function getSelectOptions(select: Locator): Locator {
  return getSelectListbox(select).getByRole('option');
}

async function chooseSelectOption(select: Locator, option: string | RegExp): Promise<void> {
  await select.click();
  await getSelectListbox(select)
    .getByRole('option', { name: option, exact: typeof option === 'string' })
    .click();
}

async function selectThemePreset(dialog: Locator, preset: string | RegExp): Promise<void> {
  await chooseSelectOption(dialog.getByLabel('Color scheme', { exact: true }), preset);
}

test.describe('Display settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work');
    await waitForApp(page);
    await openDisplaySettings(page);
  });

  test('restores focus to its trigger when dismissed with Escape', async ({ page }) => {
    await page.getByRole('dialog', { name: 'Display settings' }).press('Escape');

    const trigger = page.getByRole('button', { name: 'Open display settings' });
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('applies, persists, and restores the selected theme', async ({ page }) => {
    const theme = page.getByLabel('Theme', { exact: true });
    const restoreDefaults = page.getByRole('button', { name: 'Restore default settings' });
    await expect(getSelectMeta(theme)).toHaveText(/Dark|Light/);
    await chooseSelectOption(theme, 'Dark');
    await expect(restoreDefaults).toBeEnabled();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(getSelectMeta(theme)).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('dark');

    await page.reload();
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const dialog = await openDisplaySettings(page);
    await expect(dialog.getByLabel('Theme', { exact: true })).toHaveText('Dark');

    const reloadedRestoreDefaults = dialog.getByRole('button', { name: 'Restore default settings' });
    await reloadedRestoreDefaults.click();
    await expect(reloadedRestoreDefaults).toBeDisabled();
    await reloadedRestoreDefaults.focus();
    await expect(
      dialog.getByRole('tooltip', { name: 'All display settings already use their defaults.' }),
    ).toBeVisible();
    await reloadedRestoreDefaults.press('Escape');
    await expect(dialog.getByRole('tooltip')).toHaveCount(0);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Theme', { exact: true })).toHaveText('System');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBeNull();
  });

  test('exposes selection state and supports keyboard navigation', async ({ page }) => {
    const theme = page.getByLabel('Theme', { exact: true });

    await expect(theme).toHaveAttribute('aria-expanded', 'false');
    await theme.press('Enter');
    await expect(theme).toHaveAttribute('aria-expanded', 'true');

    const systemOption = getSelectListbox(theme).getByRole('option', { name: 'System', exact: true });
    const darkOption = getSelectListbox(theme).getByRole('option', { name: 'Dark', exact: true });
    await expect(systemOption).toHaveAttribute('aria-selected', 'true');
    await expect(darkOption).toHaveAttribute('aria-selected', 'false');

    await theme.press('ArrowDown');
    await expect(theme).toHaveAttribute('aria-activedescendant', /-option-1$/);
    await expect(systemOption).toHaveAttribute('aria-selected', 'false');
    await expect(darkOption).toHaveAttribute('aria-selected', 'true');

    await theme.press('Escape');
    await expect(theme).toHaveText('System');
    await expect(theme).toHaveAttribute('aria-expanded', 'false');

    await theme.press('d');
    await expect(theme).toHaveAttribute('aria-activedescendant', /-option-1$/);
    await theme.press('Enter');
    await expect(theme).toHaveText('Dark');
  });

  test('applies theme presets, typography and mode-specific color overrides', async ({ page }) => {
    let dialog = page.getByRole('dialog', { name: 'Display settings' });
    await chooseSelectOption(dialog.getByLabel('Theme', { exact: true }), 'Dark');

    await selectThemePreset(dialog, /Crimson signal/);
    await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'crimson');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--primary')))
      .toBe('#ef4444');

    await expandSettingsAccordion(dialog, /Advanced theme settings/);
    const headingFont = dialog.getByLabel('Heading font');
    const bodyFont = dialog.getByLabel('Body font');
    await headingFont.click();
    await expect(getSelectOptions(headingFont)).toHaveText([
      'Barlow Condensed',
      'Archivo Narrow',
      'Cinzel',
      'Oswald',
      'Playfair Display',
      'Roboto Condensed',
      'Space Grotesk',
    ]);
    await headingFont.press('Escape');
    await bodyFont.click();
    await expect(getSelectOptions(bodyFont)).toHaveText([
      'Inter',
      'IBM Plex Sans',
      'JetBrains Mono',
      'Lora',
      'Merriweather',
      'Nunito Sans',
      'Roboto',
      'Source Sans 3',
    ]);
    await expect
      .poll(() =>
        getSelectListbox(bodyFont).evaluate((listbox) => {
          const bounds = listbox.getBoundingClientRect();
          let top = bounds.top;
          let bottom = bounds.bottom;

          for (let ancestor = listbox.parentElement; ancestor; ancestor = ancestor.parentElement) {
            const overflow = getComputedStyle(ancestor).overflowY;
            if (!['auto', 'hidden', 'scroll', 'clip'].includes(overflow)) continue;

            const ancestorBounds = ancestor.getBoundingClientRect();
            top = Math.max(top, ancestorBounds.top);
            bottom = Math.min(bottom, ancestorBounds.bottom);
          }

          return Math.max(0, bottom - top);
        }),
      )
      .toBeGreaterThan(160);
    await expect
      .poll(() =>
        getSelectOptions(bodyFont)
          .first()
          .evaluate((option) => {
            const bounds = option.getBoundingClientRect();
            const topmostElement = document.elementFromPoint(
              bounds.left + bounds.width / 2,
              bounds.top + bounds.height / 2,
            );
            return topmostElement !== null && option.contains(topmostElement);
          }),
      )
      .toBe(true);
    await bodyFont.press('Escape');

    await chooseSelectOption(headingFont, 'Roboto Condensed');
    await chooseSelectOption(bodyFont, 'IBM Plex Sans');
    await expect(page.locator('html')).toHaveAttribute('data-display-font', 'roboto-condensed');
    await expect(page.locator('html')).toHaveAttribute('data-body-font', 'ibm-plex-sans');
    await expect
      .poll(() =>
        page.evaluate(() => ({
          heading: document.fonts.check('700 32px "Roboto Condensed"'),
          body: document.fonts.check('400 16px "IBM Plex Sans"'),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        })),
      )
      .toEqual({ heading: true, body: true, overflow: 0 });

    await expandSettingsAccordion(dialog, /Configure active color scheme/);
    await expandSettingsAccordion(dialog, 'Accents & states');
    const primary = dialog.getByRole('textbox', { name: 'Primary hex color', exact: true });
    await primary.fill('#123456');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--primary')))
      .toBe('#123456');

    const primaryPicker = dialog.getByLabel('Choose Primary color');
    await expect(primaryPicker).toHaveValue('#123456');
    await primaryPicker.evaluate((element) => {
      const input = element as HTMLInputElement;
      input.value = '#234567';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(primary).toHaveValue('#234567');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--primary')))
      .toBe('#234567');

    await primary.fill('#123456');

    await expect
      .poll(() =>
        page.evaluate(() => {
          const value = localStorage.getItem('portfolio-display-preferences');
          if (!value) return undefined;
          return JSON.parse(value).themeSettings?.colorOverrides?.dark?.primary as string | undefined;
        }),
      )
      .toBe('#123456');

    await page.reload();
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'crimson');
    await expect(page.locator('html')).toHaveAttribute('data-display-font', 'roboto-condensed');
    await expect(page.locator('html')).toHaveAttribute('data-body-font', 'ibm-plex-sans');

    dialog = await openDisplaySettings(page);
    await expandSettingsAccordion(dialog, /Advanced theme settings/);
    await expandSettingsAccordion(dialog, /Configure active color scheme/);
    await expandSettingsAccordion(dialog, 'Accents & states');
    const currentPrimary = dialog.getByRole('textbox', { name: 'Primary hex color', exact: true });
    const resetCurrentThemeColors = dialog.getByRole('button', { name: 'Reset current dark theme colors' });
    await expect(currentPrimary).toHaveValue('#123456');

    await selectThemePreset(dialog, /Arctic blue/);
    await expect(currentPrimary).toHaveValue('#123456');
    await dialog.getByRole('button', { name: 'Primary: Use Arctic blue dark value' }).click();
    await expect(currentPrimary).toHaveValue('#3284ff');
    await expect(resetCurrentThemeColors).toBeDisabled();

    await currentPrimary.fill('#123456');
    await expect(resetCurrentThemeColors).toBeEnabled();
    await resetCurrentThemeColors.click();
    await expect(currentPrimary).toHaveValue('#3284ff');
    await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'arctic');
    await expect(page.locator('html')).toHaveAttribute('data-display-font', 'roboto-condensed');
    await expect(page.locator('html')).toHaveAttribute('data-body-font', 'ibm-plex-sans');
  });

  test('shows the automatic scene and disables irrelevant controls when backgrounds are off', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Display settings' });
    const background = dialog.getByLabel('Background', { exact: true });

    await expect(background).toHaveText('Automatic per page — Triangles');
    await expandSettingsAccordion(dialog, 'Advanced background settings');
    await expandSettingsAccordion(dialog, 'Animations');

    await chooseSelectOption(background, 'None');
    await expect(page.locator('.background-scene-active')).toHaveCount(0);
    await expect(getPerformanceSelect(dialog)).toBeDisabled();
    await expect(dialog.getByRole('checkbox', { name: 'Performance stats' })).toBeDisabled();
    await expect(dialog.getByRole('checkbox', { name: 'Idle motion' })).toBeDisabled();

    await dialog.getByRole('button', { name: 'Restore default settings' }).click();
    await expect(background).toHaveText('Automatic per page — Triangles');
    await expect(getPerformanceSelect(dialog)).toBeEnabled();
    await expect(page.locator('.triangle-background.background-scene-active')).toBeVisible();
  });

  test('persists independent animation preferences', async ({ page }) => {
    let dialog = page.getByRole('dialog', { name: 'Display settings' });
    await expandSettingsAccordion(dialog, 'Advanced background settings');
    await expandSettingsAccordion(dialog, 'Animations');

    const animationNames = ['Idle motion', 'Pointer movement', 'Pointer presses', 'Scroll response'];

    for (const name of animationNames) {
      await dialog.getByRole('checkbox', { name }).uncheck();
    }

    await expect(page.locator('html')).toHaveAttribute('data-background-motion', 'paused');

    await page.reload();
    await waitForApp(page);
    dialog = await openDisplaySettings(page);
    await expandSettingsAccordion(dialog, 'Advanced background settings');
    await expandSettingsAccordion(dialog, 'Animations');

    for (const name of animationNames) {
      await expect(dialog.getByRole('checkbox', { name })).not.toBeChecked();
    }

    await dialog.getByRole('checkbox', { name: 'Scroll response' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-background-motion', 'playing');
  });

  test('keeps explicit values across performance changes and returns reset fields to inheritance', async ({ page }) => {
    let dialog = page.getByRole('dialog', { name: 'Display settings' });
    await openTriangleAppearanceSettings(dialog);

    const performance = getPerformanceSelect(dialog);
    let resetCurrentBackground = dialog.getByRole('button', { name: 'Reset current background settings' });
    let density = dialog.getByRole('spinbutton', { name: 'Triangle density value' });

    await expect(
      dialog.getByText('Editing Triangles settings. Overrides stay active when performance presets change.'),
    ).toBeVisible();
    await expect(resetCurrentBackground).toBeDisabled();
    await expect(performance).toHaveText('Low');
    await expect(performance).toHaveAccessibleName('Background performance');
    await expect(getSelectMeta(performance)).toHaveCount(0);
    await performance.click();
    await expect(getSelectOptions(performance)).toHaveText(['Auto', 'High', 'Medium', 'Low']);
    await performance.press('Escape');
    await expect(density).toHaveValue('0.48');

    const densitySlider = dialog.getByRole('slider', { name: 'Triangle density range' });
    await densitySlider.press('ArrowRight');
    await expect(density).toHaveValue('0.49');
    await dialog.getByRole('button', { name: 'Triangle density: Use low performance value' }).click();
    await expect(density).toHaveValue('0.48');
    await expect(resetCurrentBackground).toBeDisabled();
    await expect(dialog.getByRole('listitem', { name: 'Low preset: 0.48 (active)' })).toBeVisible();

    await chooseSelectOption(performance, 'Auto');
    await expect(performance).toHaveAccessibleName('Background performance');
    await expect(getSelectMeta(performance)).toHaveText(/High|Medium|Low/);
    await expect(getSelectMeta(performance)).not.toContainText('Auto:');
    await chooseSelectOption(performance, 'Low');
    await expect(performance).toHaveAccessibleName('Background performance');
    await expect(getSelectMeta(performance)).toHaveCount(0);

    await chooseSelectOption(performance, 'High');
    await expect(density).toHaveValue('1');
    await expect(dialog.getByRole('listitem', { name: 'High preset: 1 (active)' })).toBeVisible();
    await chooseSelectOption(performance, 'Low');
    await expect(density).toHaveValue('0.48');

    await density.fill('1.2');
    await density.press('Tab');
    await expect(resetCurrentBackground).toBeEnabled();
    await chooseSelectOption(performance, 'High');
    await expect(density).toHaveValue('1.2');

    await page.reload();
    await waitForApp(page);
    dialog = await openDisplaySettings(page);
    await openTriangleAppearanceSettings(dialog);
    density = dialog.getByRole('spinbutton', { name: 'Triangle density value' });
    resetCurrentBackground = dialog.getByRole('button', { name: 'Reset current background settings' });

    await expect(getPerformanceSelect(dialog)).toHaveText('High');
    await expect(density).toHaveValue('1.2');

    await dialog.getByRole('button', { name: 'Triangle density: Use high performance value' }).click();
    await expect(density).toHaveValue('1');
    await expect(resetCurrentBackground).toBeDisabled();

    await density.fill('1.2');
    await density.press('Tab');
    await resetCurrentBackground.click();
    await expect(density).toHaveValue('1');
    await expect(resetCurrentBackground).toBeDisabled();

    await chooseSelectOption(getPerformanceSelect(dialog), 'Low');
    await expect(density).toHaveValue('0.48');
  });

  test('applies slider changes immediately and persists the runtime-bounded value', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Display settings' });
    await openTriangleAppearanceSettings(dialog);

    const opacity = dialog.getByRole('spinbutton', { name: 'Triangle opacity value' });
    const opacitySlider = dialog.getByRole('slider', { name: 'Triangle opacity range' });

    await expect(opacitySlider).toHaveAttribute('min', '0');
    expect(Number(await opacitySlider.getAttribute('max'))).toBeGreaterThan(1.75);
    await opacitySlider.focus();
    await page.keyboard.press('Home');
    await expect(opacity).toHaveValue('0');

    await expect
      .poll(() =>
        page.evaluate(() => {
          const value = localStorage.getItem('portfolio-display-preferences');
          if (!value) return undefined;

          const document = JSON.parse(value) as {
            backgroundSettingOverrides?: { triangles?: { opacity?: number } };
          };
          return document.backgroundSettingOverrides?.triangles?.opacity;
        }),
      )
      .toBe(0);
  });
});

test('migrates one representative legacy background override into the versioned document', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('portfolio-display-preferences');
    localStorage.setItem('portfolio-background', 'triangles');
    localStorage.setItem('portfolio-background-performance', JSON.stringify({ mode: 'medium', showStats: false }));
    localStorage.setItem(
      'portfolio-background-advanced-settings',
      JSON.stringify({ triangles: { densityScale: 1.3 } }),
    );
    localStorage.setItem(
      'portfolio-background-advanced-setting-overrides',
      JSON.stringify({ triangles: { densityScale: true } }),
    );
  });

  await page.goto('/work');
  await waitForApp(page);
  const dialog = await openDisplaySettings(page);
  await openTriangleAppearanceSettings(dialog);

  await expect(dialog.getByLabel('Background', { exact: true })).toHaveText('Triangles');
  await expect(getPerformanceSelect(dialog)).toHaveText('Medium');
  await expect(dialog.getByRole('spinbutton', { name: 'Triangle density value' })).toHaveValue('1.3');

  const storedDocument = await page.evaluate(() => {
    const value = localStorage.getItem('portfolio-display-preferences');
    return value ? (JSON.parse(value) as unknown) : null;
  });

  expect(storedDocument).toMatchObject({
    version: 3,
    themeSettings: {
      preset: 'arctic',
      fonts: { display: 'barlow-condensed', body: 'inter' },
      colorOverrides: { dark: {}, light: {} },
    },
    backgroundPreference: 'triangles',
    backgroundPerformance: { mode: 'medium', showStats: false },
    backgroundSettingOverrides: { triangles: { densityScale: 1.3 } },
  });
  await expect
    .poll(() =>
      page.evaluate(() => [
        localStorage.getItem('portfolio-background'),
        localStorage.getItem('portfolio-background-performance'),
        localStorage.getItem('portfolio-background-advanced-settings'),
        localStorage.getItem('portfolio-background-advanced-setting-overrides'),
      ]),
    )
    .toEqual([null, null, null, null]);
});

test('replaces deprecated font profiles without losing versioned preferences', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('portfolio-theme', 'dark');
    localStorage.setItem(
      'portfolio-display-preferences',
      JSON.stringify({
        version: 2,
        themeSettings: {
          preset: 'aurora',
          font: 'editorial',
          colorOverrides: { dark: { primary: '#123456' }, light: {} },
        },
        backgroundPreference: 'auto',
        backgroundAnimations: {
          idle: true,
          cursorMovement: true,
          cursorClick: true,
          scroll: true,
        },
        backgroundPerformance: { mode: 'low', showStats: false },
        backgroundSettingOverrides: { wave: {}, particles: {}, triangles: {}, mesh: {} },
      }),
    );
  });

  await page.goto('/work');
  await waitForApp(page);

  await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'aurora');
  await expect(page.locator('html')).toHaveAttribute('data-display-font', 'barlow-condensed');
  await expect(page.locator('html')).toHaveAttribute('data-body-font', 'inter');
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--primary')))
    .toBe('#123456');

  const storedTheme = await page.evaluate(() => {
    const value = localStorage.getItem('portfolio-display-preferences');
    if (!value) return null;
    const preferences = JSON.parse(value);
    return { version: preferences.version, themeSettings: preferences.themeSettings };
  });

  expect(storedTheme).toMatchObject({
    version: 3,
    themeSettings: {
      preset: 'aurora',
      fonts: { display: 'barlow-condensed', body: 'inter' },
      colorOverrides: { dark: { primary: '#123456' }, light: {} },
    },
  });
});
