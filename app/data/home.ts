import type { HomeAboutContent, HomeCapabilitiesContent, HomeHeroContent } from '@/types/content';
import { site } from '@/data/site';

export const homeHero = {
  kicker: 'Based in Germany · Building software',
  title: 'I build',
  titleAccent: 'applications.',
  introduction:
    'I’m Matthias, a software engineer focused on building reliable applications and the systems behind them, from backend architecture and data to interfaces, integrations, and long-term maintainability.',
  actions: [
    { label: 'Start a conversation', href: `mailto:${site.email}` },
    { label: 'Explore profile', symbol: '↓', to: '/#about', variant: 'text' },
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
    { number: '02', title: 'B.Sc. Informatics', description: 'Currently studying at IU' },
    { number: '03', title: 'From concept to maintenance', description: 'Design, delivery, evolution' },
  ],
} satisfies HomeHeroContent;

export const homeAbout = {
  number: '01',
  label: 'About',
  title: 'Practical experience, backed by',
  titleAccent: 'strong fundamentals.',
  paragraphs: [
    'I completed my application-development apprenticeship at TopRed Media from 2019 to 2022 and continued there as a software developer until 2025. Since 2022, I have paired that hands-on experience with computer science studies at IU.',
    'I like understanding how systems work and why they are built the way they are. I want to understand the actual problem, make deliberate technical decisions, and build solutions that are reliable, maintainable, and fit for purpose.',
  ],
  principles: ['Applications', 'Systems', 'Performance', 'Maintainability'],
} satisfies HomeAboutContent;

export const homeCapabilities = {
  number: '02',
  label: 'Capabilities',
  title: 'Experience,',
  titleAccent: 'in context.',
  introduction:
    'Technologies grouped by where I have used them: in production, through academic work, and in projects I pursue independently.',
  items: [
    {
      number: '01',
      layer: 'Production experience',
      title: 'Professional',
      to: '/work',
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
      to: '/academic',
      skills: ['Java', 'Python', 'JavaScript', 'Prolog', 'Apache Kafka', 'Apache Flink', 'ClickHouse', 'FIDO2'],
    },
    {
      number: '03',
      layer: 'Independent practice',
      title: 'Personal',
      to: '/personal',
      skills: [
        'Open Source',
        'Docker',
        'TypeScript',
        'Nuxt',
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
