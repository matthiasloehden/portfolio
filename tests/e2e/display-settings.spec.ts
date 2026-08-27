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

async function selectThemePreset(dialog: Locator, preset: string | RegExp): Promise<void> {
  await dialog.getByRole('button', { name: /^Color scheme:/ }).click();
  await dialog.getByRole('option', { name: preset }).click();
}

test.describe('Display settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work');
    await waitForApp(page);
    await openDisplaySettings(page);
  });

  test('applies, persists, and restores the selected theme', async ({ page }) => {
    const theme = page.getByLabel('Theme', { exact: true });
    await expect(getSelectMeta(theme)).toHaveText(/Dark|Light/);
    await theme.selectOption('dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(getSelectMeta(theme)).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('dark');

    await page.reload();
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const dialog = await openDisplaySettings(page);
    await expect(dialog.getByLabel('Theme', { exact: true })).toHaveValue('dark');

    await dialog.getByRole('button', { name: 'Restore default settings' }).click();
    await expect(dialog.getByLabel('Theme', { exact: true })).toHaveValue('system');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBeNull();
  });

  test('applies theme presets, typography and mode-specific color overrides', async ({ page }) => {
    let dialog = page.getByRole('dialog', { name: 'Display settings' });
    await dialog.getByLabel('Theme', { exact: true }).selectOption('dark');

    await selectThemePreset(dialog, /Crimson signal/);
    await expect(page.locator('html')).toHaveAttribute('data-theme-preset', 'crimson');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--primary')))
      .toBe('#ef4444');

    await expandSettingsAccordion(dialog, /Advanced theme settings/);
    const headingFont = dialog.getByLabel('Heading font');
    const bodyFont = dialog.getByLabel('Body font');
    await expect(headingFont.locator('option')).toHaveText([
      'Barlow Condensed',
      'Archivo Narrow',
      'Cinzel',
      'Oswald',
      'Playfair Display',
      'Roboto Condensed',
      'Space Grotesk',
    ]);
    await expect(bodyFont.locator('option')).toHaveText([
      'Inter',
      'IBM Plex Sans',
      'JetBrains Mono',
      'Lora',
      'Merriweather',
      'Nunito Sans',
      'Roboto',
      'Source Sans 3',
    ]);

    await headingFont.selectOption('roboto-condensed');
    await bodyFont.selectOption('ibm-plex-sans');
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

    await expandSettingsAccordion(dialog, 'Accents & states');
    const primary = dialog.getByRole('textbox', { name: 'Primary hex color', exact: true });
    await primary.fill('#123456');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--primary')))
      .toBe('#123456');

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
    await expandSettingsAccordion(dialog, 'Accents & states');
    await expect(dialog.getByRole('textbox', { name: 'Primary hex color', exact: true })).toHaveValue('#123456');

    await selectThemePreset(dialog, /Arctic blue/);
    await expect(dialog.getByRole('textbox', { name: 'Primary hex color', exact: true })).toHaveValue('#123456');
    await dialog.getByRole('button', { name: 'Primary: Use Arctic blue dark value' }).click();
    await expect(dialog.getByRole('textbox', { name: 'Primary hex color', exact: true })).toHaveValue('#3284ff');
  });

  test('shows the automatic scene and disables irrelevant controls when backgrounds are off', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Display settings' });
    const background = dialog.getByLabel('Background', { exact: true });

    await expect(background.locator('option:checked')).toHaveText('Automatic per page — Triangles');
    await expandSettingsAccordion(dialog, 'Advanced background settings');
    await expandSettingsAccordion(dialog, 'Animations');

    await background.selectOption('none');
    await expect(page.locator('.background-scene-active')).toHaveCount(0);
    await expect(getPerformanceSelect(dialog)).toBeDisabled();
    await expect(dialog.getByRole('checkbox', { name: 'Performance stats' })).toBeDisabled();
    await expect(dialog.getByRole('checkbox', { name: 'Idle motion' })).toBeDisabled();

    await dialog.getByRole('button', { name: 'Restore default settings' }).click();
    await expect(background).toHaveValue('auto');
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
    let density = dialog.getByRole('spinbutton', { name: 'Triangle density value' });

    await expect(performance).toHaveValue('low');
    await expect(performance).toHaveAccessibleName('Background performance');
    await expect(getSelectMeta(performance)).toHaveCount(0);
    await expect(performance.locator('option[value="auto"]')).toHaveText('Auto');
    await expect(density).toHaveValue('0.48');
    await expect(dialog.getByRole('listitem', { name: 'Low preset: 0.48 (active)' })).toBeVisible();

    await performance.selectOption('auto');
    await expect(performance).toHaveAccessibleName('Background performance');
    await expect(getSelectMeta(performance)).toHaveText(/High|Medium|Low/);
    await expect(getSelectMeta(performance)).not.toContainText('Auto:');
    await performance.selectOption('low');
    await expect(performance).toHaveAccessibleName('Background performance');
    await expect(getSelectMeta(performance)).toHaveCount(0);

    await performance.selectOption('high');
    await expect(density).toHaveValue('1');
    await expect(dialog.getByRole('listitem', { name: 'High preset: 1 (active)' })).toBeVisible();
    await performance.selectOption('low');
    await expect(density).toHaveValue('0.48');

    await density.fill('1.2');
    await density.press('Tab');
    await performance.selectOption('high');
    await expect(density).toHaveValue('1.2');

    await page.reload();
    await waitForApp(page);
    dialog = await openDisplaySettings(page);
    await openTriangleAppearanceSettings(dialog);
    density = dialog.getByRole('spinbutton', { name: 'Triangle density value' });

    await expect(getPerformanceSelect(dialog)).toHaveValue('high');
    await expect(density).toHaveValue('1.2');

    await dialog.getByRole('button', { name: 'Triangle density: Use high performance value' }).click();
    await expect(density).toHaveValue('1');

    await getPerformanceSelect(dialog).selectOption('low');
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

  await expect(dialog.getByLabel('Background', { exact: true })).toHaveValue('triangles');
  await expect(getPerformanceSelect(dialog)).toHaveValue('medium');
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
