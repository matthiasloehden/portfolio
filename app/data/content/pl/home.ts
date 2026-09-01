import type { HomeAboutContent, HomeCapabilitiesContent, HomeHeroContent } from '@/types/content';
import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';

export const homeHero = {
  kicker: 'Inżynier oprogramowania · Student informatyki · Niemcy',
  title: ['Tworzę', 'aplikacje.'],
  accent: [false, true],
  introduction: [
    'Nazywam się Matthias i jestem wyszkolonym programistą aplikacji z trzyletnim doświadczeniem zawodowym, obecnie studiuję informatykę na IU.',
    'Moje doświadczenie obejmuje aplikacje produkcyjne, rozwój backend i frontend, bazy danych, integracje, konserwację systemów i DevOps.',
  ],
  actions: [
    { label: 'Rozpocznij rozmowę', href: `mailto:${site.email}` },
    { label: 'Zobacz doświadczenie', symbol: '↓', to: { ...APP_ROUTES.home, hash: '#about' }, variant: 'text' },
  ],
  profile: {
    filename: 'profile.ts',
    name: 'Matthias',
    role: 'inżynier oprogramowania',
    focus: ['aplikacje', 'systemy', 'wydajność', 'łatwość konserwacji'],
    status: 'Systemy działają',
    location: 'DE/CET',
  },
  highlights: [
    { number: '01', title: 'Od 2019 r', description: 'Profesjonalne tworzenie oprogramowania' },
    { number: '02', title: 'B.Sc. Informatyka', description: 'Obecnie studiuję na IU' },
    { number: '03', title: 'Od koncepcji po utrzymanie', description: 'Projekt, dostawa, ewolucja' },
  ],
} satisfies HomeHeroContent;

export const homeAbout = {
  number: '01',
  label: 'O mnie',
  title: [['Praktyczne ', 'doświadczenie,'], 'oparte na', ['solidnych ', 'podstawach.']],
  accent: [false, false, false],
  paragraphs: [
    'Ukończyłem staż w zakresie tworzenia aplikacji w TopRed Media w latach 2019–2022 i kontynuowałem tam jako programista full-stack do 2025 r. Od 2022 r. łączę to praktyczne doświadczenie ze studiami z informatyki w IU, z zajęciami z zakresu systemów rozproszonych, bezpieczeństwa i projektowania oprogramowania.',
    'Lubię rozumieć, jak działają systemy i dlaczego są zbudowane w taki, a nie inny sposób. Chcę zrozumieć rzeczywisty problem, podejmować przemyślane decyzje techniczne i budować rozwiązania, które są niezawodne, łatwe w utrzymaniu i dostosowane do celu.',
  ],
  principles: ['Aplikacje', 'Systemy', 'Wydajność', 'Łatwość konserwacji'],
} satisfies HomeAboutContent;

export const homeCapabilities = {
  number: '02',
  label: 'Możliwości',
  title: ['Doświadczenie,', 'w kontekście.'],
  accent: [false, true],
  introduction:
    'Technologie pogrupowane według miejsca ich wykorzystania: w produkcji, w pracy akademickiej oraz w projektach, które realizuję samodzielnie.',
  items: [
    {
      number: '01',
      layer: 'Doświadczenie produkcyjne',
      title: 'Profesjonalny',
      to: APP_ROUTES.work,
      skills: [
        'PHP',
        'Laravel',
        'JavaScript',
        'Vue',
        'Inertia.js',
        'Tailwind CSS',
        'MySQL',
        'Redis',
        'Meilisearch',
        'Python',
      ],
    },
    {
      number: '02',
      layer: 'Zajęcia',
      title: 'Akademicki',
      to: APP_ROUTES.academic,
      skills: [
        'Java',
        'Python',
        'TypeScript',
        'R',
        'Prolog',
        'Apache Kafka',
        'Apache Flink',
        'ClickHouse',
        'Grafana',
        'FIDO2',
      ],
    },
    {
      number: '03',
      layer: 'Niezależna praktyka',
      title: 'Osobisty',
      to: APP_ROUTES.personal,
      skills: [
        'Open Source',
        'TypeScript',
        'Nuxt',
        'Docker',
        'C#',
        'Unity',
        'C',
        'Assembly',
        'Local LLMs',
        'Codex',
        'Claude',
        'Gemini',
      ],
    },
  ],
} satisfies HomeCapabilitiesContent;

export const homeMeta = {
  title: 'Matthias Löhden | Inżynier oprogramowania',
  description:
    'Portfolio Matthiasa Löhdena, inżyniera oprogramowania tworzącego szybkie, niezawodne i łatwe w utrzymaniu aplikacje i systemy.',
};
