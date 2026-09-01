import { workHero, workMeta } from '@/data/content/de/work';
import { workHero as spanishWorkHero, workMeta as spanishWorkMeta } from '@/data/content/es/work';
import { workHero as frenchWorkHero, workMeta as frenchWorkMeta } from '@/data/content/fr/work';
import { workHero as italianWorkHero, workMeta as italianWorkMeta } from '@/data/content/it/work';
import { workHero as polishWorkHero, workMeta as polishWorkMeta } from '@/data/content/pl/work';
import { expect, getDisplayHeadingText, test, waitForApp } from './support/app-test';
import { openDisplaySettings } from './support/display-settings';

const machineTranslatedLocales = [
  { code: 'fr', language: 'fr-FR', hero: frenchWorkHero, meta: frenchWorkMeta },
  { code: 'es', language: 'es-ES', hero: spanishWorkHero, meta: spanishWorkMeta },
  { code: 'it', language: 'it-IT', hero: italianWorkHero, meta: italianWorkMeta },
  { code: 'pl', language: 'pl-PL', hero: polishWorkHero, meta: polishWorkMeta },
] as const;

test.describe('Localization', () => {
  for (const locale of machineTranslatedLocales) {
    test(`serves the ${locale.code} content and metadata on its localized route`, async ({ page }) => {
      await page.goto(`/${locale.code}/work`);
      await waitForApp(page);

      await expect(page.locator('html')).toHaveAttribute('lang', locale.language);
      await expect(page).toHaveTitle(locale.meta.title);
      await expect(
        page.getByRole('heading', { level: 1, name: getDisplayHeadingText(locale.hero.title) }),
      ).toBeVisible();
    });
  }

  test('switches language in display settings while preserving the current page', async ({ page }, testInfo) => {
    await page.goto('/work');
    await waitForApp(page);

    let dialog = await openDisplaySettings(page);
    const language = dialog.getByRole('combobox', { name: 'Language', exact: true });
    await expect(language).toContainText('English');
    await expect(language.getByLabel('Recommended original version')).toBeVisible();
    await language.click();
    await expect(page.getByRole('listbox').getByRole('option')).toHaveCount(7);
    await expect(
      page
        .getByRole('listbox')
        .getByRole('option', { name: /^Français/ })
        .getByLabel('Automatically translated'),
    ).toBeVisible();
    await page.getByRole('listbox').getByRole('option', { name: 'Deutsch', exact: true }).click();

    await expect(page).toHaveURL((url) => url.pathname === '/de/work');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de-DE');
    await expect(page).toHaveTitle(workMeta.title);
    await expect(page.getByRole('heading', { level: 1, name: getDisplayHeadingText(workHero.title) })).toBeVisible();

    if (testInfo.project.name === 'mobile-chromium') {
      await page.getByRole('button', { name: 'Navigation öffnen' }).click();
      await expect(page.locator('#site-navigation')).toBeVisible();
    }

    await expect(
      page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Beruf' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('link[rel="alternate"][hreflang="de-DE"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="en-US"]')).toHaveCount(1);

    dialog = await openDisplaySettings(page, {
      open: 'Darstellungseinstellungen öffnen',
      dialog: 'Darstellungseinstellungen',
      close: 'Darstellungseinstellungen schließen',
    });
    const sprache = dialog.getByRole('combobox', { name: 'Sprache', exact: true });
    await expect(sprache).toHaveText('Deutsch');
    const restoreDefaults = dialog.getByRole('button', {
      name: 'Standardeinstellungen wiederherstellen',
    });
    await expect(restoreDefaults).toBeEnabled();
    await restoreDefaults.click();

    await expect(page).toHaveURL((url) => url.pathname === '/work');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  });

  test('uses browser language negotiation only after automatic mode is selected', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { get: () => 'es-MX' });
      Object.defineProperty(navigator, 'languages', { get: () => ['es-MX', 'en-US'] });
    });

    await page.goto('/work');
    await waitForApp(page);
    await expect(page).toHaveURL((url) => url.pathname === '/work');

    let dialog = await openDisplaySettings(page);
    await dialog.getByRole('combobox', { name: 'Language', exact: true }).click();
    await page.getByRole('listbox').getByRole('option', { name: 'Automatic', exact: true }).click();

    await expect(page).toHaveURL((url) => url.pathname === '/es/work');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES');

    await page.reload();
    await waitForApp(page);
    await expect(page).toHaveURL((url) => url.pathname === '/es/work');

    dialog = await openDisplaySettings(page, {
      open: 'Abrir configuración de pantalla',
      dialog: 'Configuración de pantalla',
      close: 'Cerrar configuración de pantalla',
    });
    await expect(dialog.getByRole('combobox', { name: 'Idioma', exact: true })).toContainText('Automático');
    await dialog.getByRole('button', { name: 'Restaurar la configuración predeterminada' }).click();

    await expect(page).toHaveURL((url) => url.pathname === '/work');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    await page.reload();
    await waitForApp(page);
    await expect(page).toHaveURL((url) => url.pathname === '/work');
  });
});
