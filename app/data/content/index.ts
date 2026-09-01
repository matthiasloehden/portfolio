import type { SupportedLocale } from '@/config/locales';
import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import it from './it';
import pl from './pl';

export type PortfolioContent = typeof en;

export const contentByLocale = {
  de,
  en,
  es,
  fr,
  it,
  pl,
} satisfies Record<SupportedLocale, PortfolioContent>;
