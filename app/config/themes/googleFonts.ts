export const GOOGLE_FONTS_ENDPOINT = 'https://fonts.googleapis.com/css2';
export const GOOGLE_FONTS_LINK_ATTRIBUTE = 'data-portfolio-google-fonts';
export const GOOGLE_FONT_PRECONNECT_ATTRIBUTE = 'data-portfolio-google-font-preconnect';
export const GOOGLE_FONT_PRECONNECTS = [
  { origin: 'https://fonts.googleapis.com', crossOrigin: false },
  { origin: 'https://fonts.gstatic.com', crossOrigin: true },
] as const;

export function getGoogleFontsStylesheet(queries: readonly string[]): string | undefined {
  if (queries.length === 0) return undefined;

  const search = queries.map((query) => `family=${query}`).join('&');
  return `${GOOGLE_FONTS_ENDPOINT}?${search}&display=swap`;
}
