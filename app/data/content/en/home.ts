import type { HomeAboutContent, HomeCapabilitiesContent, HomeHeroContent } from '@/types/content';
import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';

export const homeHero = {
  kicker: 'Software Engineer · CS Student · Germany',
  title: ['I build', 'applications.'],
  accent: [false, true],
  introduction: [
    'I’m Matthias, a trained application developer with three years of professional experience, currently studying computer science at IU.',
    'My background spans production applications, backend and frontend development, databases, integrations, system maintenance, and DevOps.',
  ],
  actions: [
    { label: 'Start a conversation', href: `mailto:${site.email}` },
    { label: 'View experience', symbol: '↓', to: { ...APP_ROUTES.home, hash: '#about' }, variant: 'text' },
  ],
  profile: {
    filename: 'profile.ts',
    name: 'Matthias',
    role: 'software engineer',
    focus: ['applications', 'systems', 'performance', 'maintainability'],
    status: 'Systems operational',
    location: 'DE / CET',
  },
  highlights: [
    { number: '01', title: 'Since 2019', description: 'Professional software development' },
    { number: '02', title: 'B.Sc. Computer Science', description: 'Currently studying at IU' },
    { number: '03', title: 'From concept to maintenance', description: 'Design, delivery, evolution' },
  ],
} satisfies HomeHeroContent;

export const homeAbout = {
  number: '01',
  label: 'About',
  title: [['Practical ', 'experience,'], 'backed by', ['strong ', 'fundamentals.']],
  accent: [false, false, false],
  paragraphs: [
    'I completed my application-development apprenticeship at TopRed Media from 2019 to 2022 and continued there as a full-stack developer until 2025. Since 2022, I have paired that hands-on experience with computer science studies at IU, with coursework in distributed systems, security and software design.',
    'I like understanding how systems work and why they are built the way they are. I want to understand the actual problem, make deliberate technical decisions, and build solutions that are reliable, maintainable, and fit for purpose.',
  ],
  principles: ['Applications', 'Systems', 'Performance', 'Maintainability'],
} satisfies HomeAboutContent;

export const homeCapabilities = {
  number: '02',
  label: 'Capabilities',
  title: ['Experience,', 'in context.'],
  accent: [false, true],
  introduction:
    'Technologies grouped by where I have used them: in production, through academic work, and in projects I pursue independently.',
  items: [
    {
      number: '01',
      layer: 'Production experience',
      title: 'Professional',
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
      layer: 'Coursework',
      title: 'Academic',
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
      layer: 'Independent practice',
      title: 'Personal',
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
  title: 'Matthias Löhden | Software Engineer',
  description:
    'Portfolio of Matthias Löhden, a software engineer building fast, reliable, and maintainable applications and systems.',
};
