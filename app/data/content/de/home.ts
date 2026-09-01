import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';
import type { HomeAboutContent, HomeCapabilitiesContent, HomeHeroContent } from '@/types/content';

export const homeHero = {
  kicker: 'Softwareentwickler · Informatikstudent · Deutschland',
  title: ['Ich entwickle', 'Anwendungen.'],
  accent: [false, true],
  introduction: [
    'Ich bin Matthias, ausgebildeter Fachinformatiker für Anwendungsentwicklung mit drei Jahren Berufserfahrung und studiere derzeit Informatik an der IU.',
    'Meine Erfahrung reicht von produktiven Anwendungen über Backend- und Frontend-Entwicklung bis zu Datenbanken, Integrationen, Systemwartung und DevOps.',
  ],
  actions: [
    { label: 'Kontakt aufnehmen', href: `mailto:${site.email}` },
    { label: 'Erfahrung ansehen', symbol: '↓', to: { ...APP_ROUTES.home, hash: '#about' }, variant: 'text' },
  ],
  profile: {
    filename: 'profil.ts',
    name: 'Matthias',
    role: 'Softwareentwickler',
    focus: ['Anwendungen', 'Systeme', 'Performance', 'Wartbarkeit'],
    status: 'Systeme betriebsbereit',
    location: 'DE / MEZ',
  },
  highlights: [
    { number: '01', title: 'Seit 2019', description: 'Professionelle Softwareentwicklung' },
    { number: '02', title: 'B.Sc. Informatik', description: 'Derzeitiges Studium an der IU' },
    { number: '03', title: 'Von der Idee bis zur Wartung', description: 'Konzeption, Umsetzung, Weiterentwicklung' },
  ],
} satisfies HomeHeroContent;

export const homeAbout = {
  number: '01',
  label: 'Über mich',
  title: [['Praktische ', 'Erfahrung,'], 'gestützt durch', ['starke ', 'Grundlagen.']],
  accent: [false, false, false],
  paragraphs: [
    'Von 2019 bis 2022 absolvierte ich bei TopRed Media meine Ausbildung zum Fachinformatiker für Anwendungsentwicklung und arbeitete dort anschließend bis 2025 als Full-Stack-Entwickler. Seit 2022 verbinde ich diese praktische Erfahrung mit meinem Informatikstudium an der IU, unter anderem in den Bereichen verteilte Systeme, IT-Sicherheit und Softwaredesign.',
    'Ich möchte verstehen, wie Systeme funktionieren und warum sie so aufgebaut sind. Dabei geht es mir darum, das eigentliche Problem zu erfassen, technische Entscheidungen bewusst zu treffen und zuverlässige, wartbare sowie zweckmäßige Lösungen zu entwickeln.',
  ],
  principles: ['Anwendungen', 'Systeme', 'Performance', 'Wartbarkeit'],
} satisfies HomeAboutContent;

export const homeCapabilities = {
  number: '02',
  label: 'Kompetenzen',
  title: ['Erfahrung,', 'im Kontext.'],
  accent: [false, true],
  introduction:
    'Technologien, geordnet nach ihrem Einsatz: in der Produktion, im Studium und in Projekten, die ich selbstständig verfolge.',
  items: [
    {
      number: '01',
      layer: 'Produktionserfahrung',
      title: 'Beruflich',
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
      layer: 'Studieninhalte',
      title: 'Akademisch',
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
      layer: 'Eigenständige Praxis',
      title: 'Persönlich',
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
        'Lokale LLMs',
        'Codex',
        'Claude',
        'Gemini',
      ],
    },
  ],
} satisfies HomeCapabilitiesContent;

export const homeMeta = {
  title: 'Matthias Löhden | Softwareentwickler',
  description:
    'Portfolio von Matthias Löhden, einem Softwareentwickler für schnelle, zuverlässige und wartbare Anwendungen und Systeme.',
};
