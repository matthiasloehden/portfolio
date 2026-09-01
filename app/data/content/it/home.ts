import type { HomeAboutContent, HomeCapabilitiesContent, HomeHeroContent } from '@/types/content';
import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';

export const homeHero = {
  kicker: 'Ingegnere del software · Studente di informatica · Germania',
  title: ['Sviluppo', 'applicazioni.'],
  accent: [false, true],
  introduction: [
    'Sono Matthias, uno sviluppatore di applicazioni qualificato con tre anni di esperienza professionale, attualmente studio informatica presso IU.',
    'Il mio background spazia da applicazioni di produzione, sviluppo di backend e frontend, database, integrazioni, manutenzione di sistema e DevOps.',
  ],
  actions: [
    { label: 'Inizia una conversazione', href: `mailto:${site.email}` },
    { label: "Visualizza l'esperienza", symbol: '↓', to: { ...APP_ROUTES.home, hash: '#about' }, variant: 'text' },
  ],
  profile: {
    filename: 'profile.ts',
    name: 'Matthias',
    role: 'ingegnere del software',
    focus: ['applicazioni', 'sistemi', 'prestazioni', 'manutenibilità'],
    status: 'Sistemi in funzione',
    location: 'DE/CET',
  },
  highlights: [
    { number: '01', title: 'Dal 2019', description: 'Sviluppo software professionale' },
    { number: '02', title: 'B.Sc. Informatica', description: 'Attualmente studio presso IU' },
    { number: '03', title: "Dall'ideazione alla manutenzione", description: 'Progettazione, consegna, evoluzione' },
  ],
} satisfies HomeHeroContent;

export const homeAbout = {
  number: '01',
  label: 'Di',
  title: [['Esperienza ', 'pratica,'], 'fondata su', ['solide ', 'competenze.']],
  accent: [false, false, false],
  paragraphs: [
    "Ho completato il mio apprendistato di sviluppo di applicazioni presso TopRed Media dal 2019 al 2022 e ho continuato lì come sviluppatore full-stack fino al 2025. Dal 2022, ho abbinato quell'esperienza pratica con studi di informatica presso IU, con corsi su sistemi distribuiti, sicurezza e progettazione software.",
    'Mi piace capire come funzionano i sistemi e perché sono costruiti così come sono. Voglio comprendere il problema reale, prendere decisioni tecniche ponderate e creare soluzioni affidabili, manutenibili e adatte allo scopo.',
  ],
  principles: ['Applicazioni', 'Sistemi', 'Prestazioni', 'Manutenibilità'],
} satisfies HomeAboutContent;

export const homeCapabilities = {
  number: '02',
  label: 'Capacità',
  title: ['Esperienza,', 'nel contesto.'],
  accent: [false, true],
  introduction:
    'Tecnologie raggruppate in base a dove le ho utilizzate: nella produzione, attraverso il lavoro accademico e nei progetti che perseguo in modo indipendente.',
  items: [
    {
      number: '01',
      layer: 'Esperienza di produzione',
      title: 'Professionale',
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
      layer: 'Corsi',
      title: 'Accademico',
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
      layer: 'Pratica indipendente',
      title: 'Personale',
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
  title: 'Matthias Löhden | Ingegnere del software',
  description:
    'Portfolio di Matthias Löhden, un ingegnere del software che crea applicazioni e sistemi veloci, affidabili e manutenibili.',
};
