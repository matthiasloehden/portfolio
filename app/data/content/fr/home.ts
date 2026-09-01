import type { HomeAboutContent, HomeCapabilitiesContent, HomeHeroContent } from '@/types/content';
import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';

export const homeHero = {
  kicker: 'Ingénieur logiciel · Étudiant en informatique · Allemagne',
  title: ['Je développe', 'des applications.'],
  accent: [false, true],
  introduction: [
    "Je m'appelle Matthias, un développeur d'applications formé avec trois ans d'expérience professionnelle, étudiant actuellement l'informatique à IU.",
    'Mon expérience couvre les applications de production, le développement backend et frontend, les bases de données, les intégrations, la maintenance du système et DevOps.',
  ],
  actions: [
    { label: 'Démarrer une conversation', href: `mailto:${site.email}` },
    { label: "Voir l'expérience", symbol: '↓', to: { ...APP_ROUTES.home, hash: '#about' }, variant: 'text' },
  ],
  profile: {
    filename: 'profile.ts',
    name: 'Matthias',
    role: 'ingénieur logiciel',
    focus: ['applications', 'systèmes', 'performance', 'maintenabilité'],
    status: 'Systèmes opérationnels',
    location: 'DE / CET',
  },
  highlights: [
    { number: '01', title: 'Depuis 2019', description: 'Développement de logiciels professionnels' },
    { number: '02', title: 'B.Sc. Informatique', description: "Étudiant actuellement à l'IU" },
    { number: '03', title: 'De la conception à la maintenance', description: 'Conception, livraison, évolution' },
  ],
} satisfies HomeHeroContent;

export const homeAbout = {
  number: '01',
  label: 'À propos',
  title: [['Une expérience ', 'concrète,'], 'appuyée par', ['de solides ', 'fondamentaux.']],
  accent: [false, false, false],
  paragraphs: [
    "J'ai effectué mon apprentissage en développement d'applications chez TopRed Media de 2019 à 2022 et y ai continué en tant que développeur full-stack jusqu'en 2025. Depuis 2022, j'ai associé cette expérience pratique à des études d'informatique à IU, avec des cours sur les systèmes distribués, la sécurité et la conception de logiciels.",
    "J'aime comprendre comment fonctionnent les systèmes et pourquoi ils sont construits tels qu'ils sont. Je veux comprendre le problème réel, prendre des décisions techniques délibérées et créer des solutions fiables, maintenables et adaptées à l'objectif.",
  ],
  principles: ['Applications', 'Systèmes', 'Performance', 'Maintenabilité'],
} satisfies HomeAboutContent;

export const homeCapabilities = {
  number: '02',
  label: 'Capacités',
  title: ['Expérience,', 'dans le contexte.'],
  accent: [false, true],
  introduction:
    "Technologies regroupées selon l'endroit où je les ai utilisées : en production, dans le cadre de travaux académiques et dans des projets que je poursuis de manière indépendante.",
  items: [
    {
      number: '01',
      layer: 'Expérience en production',
      title: 'Professionnel',
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
      layer: 'Cours',
      title: 'Académique',
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
      layer: 'Pratique indépendante',
      title: 'Personnel',
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
  title: 'Matthias Löhden | Ingénieur logiciel',
  description:
    'Portfolio de Matthias Löhden, un ingénieur logiciel qui crée des applications et des systèmes rapides, fiables et maintenables.',
};
