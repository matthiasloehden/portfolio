# Translation guide

English is the source language for portfolio content and interface messages. Translations should preserve the meaning, restrained technical tone, and first-person voice instead of following the English sentence structure literally.

Each locale declares its translation quality in `app/config/locales.ts`. English is the recommended original, German is reviewed, and machine-translated locales are identified in the language selector. Promote a machine translation to `reviewed` only after a fluent speaker has checked the complete interface, content, accessibility text, and metadata.

The current machine-translated locales are French, Spanish, Italian, and Polish. Their translation indicator must remain visible until each complete locale has been reviewed.

English remains the default locale. Automatic language selection is an explicit, persisted user preference: it negotiates the first supported entry from the browser's ordered language list, matches regional variants by their base language, and falls back to English. The site never enables automatic detection for a first-time visitor without their choice.

Language is part of the display-settings reset contract. Restoring defaults disables automatic detection, removes its persisted preference, and returns the equivalent localized route to English.

## Content structure

Long-form, typed content lives in `app/data/content/<locale>`. Every locale must export the same modules and named values as `app/data/content/en`. Type parity is checked by the locale index files.

When translating content:

- Translate prose, labels, descriptions, status text, accessibility text, and SEO metadata.
- Preserve object keys, export names, array order, IDs, `titleId`, `href`, `to`, and hash fragments exactly.
- Preserve personal names, company names, product names, library names, programming languages, and URLs unless an established localized name exists.
- Keep numeric identifiers such as `01` and technical notation such as `RS-232`, `FIDO2`, and `CPU / RAM / GPU` unchanged.
- Keep the intent of headings concise enough for the existing responsive layout.

Display headings use semantic arrays. Top-level array entries create visual lines. A nested array divides one line into alternating normal and accent-colored segments. The corresponding `accent` entry determines whether the first segment is accented. Translators may change line and segment boundaries to produce natural typography, but the title must remain complete when its segments are joined.

## Interface messages

Short interface and accessibility messages live in `i18n/locales/<locale>.ts`. Their semantic keys provide translation context. Keep interpolation variables such as `{name}`, `{label}`, and `{preset}` unchanged.

Background-control definitions retain English fallback labels beside their technical configuration. Translations use the semantic path `display.background.controls.<scene>.<control>`. A missing translation deliberately falls back to that English definition.

## Adding a locale

1. Add its metadata to `LOCALE_DEFINITIONS` in `app/config/locales.ts`.
2. Add a complete UI message file under `i18n/locales`.
3. Add typed content modules and an index under `app/data/content/<locale>`.
4. Register the content bundle in `app/data/content/index.ts`.
5. Review headings at mobile and desktop widths and review all localized SEO metadata.

Machine translation is suitable for a first draft only. Review domain terminology, first-person claims, line breaks, accessible names, and SEO descriptions before publishing.
