import { SUPPORTED_LOCALES } from '@/config/locales';

export function getCanonicalContentPath(path: string): string {
  const normalizedPath = path.replace(/\/+$/, '') || '/';
  const segments = normalizedPath.split('/');

  if (segments[1] && SUPPORTED_LOCALES.some((locale) => locale === segments[1])) {
    return `/${segments.slice(2).join('/')}`.replace(/\/+$/, '') || '/';
  }

  return normalizedPath;
}
