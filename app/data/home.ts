import type { Capability } from '@/types/content';

export const capabilities: Capability[] = [
  {
    number: '01',
    layer: 'Production experience',
    title: 'Professional',
    skills: [
      'PHP',
      'Laravel',
      'JavaScript',
      'Inertia.js',
      'Vue.js',
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
    skills: ['Java', 'Python', 'JavaScript', 'Prolog', 'Apache Kafka', 'Apache Flink', 'ClickHouse', 'FIDO2'],
  },
  {
    number: '03',
    layer: 'Independent practice',
    title: 'Personal',
    skills: [
      'Open Source',
      'C#',
      'Unity',
      'C',
      'Assembly',
      'TypeScript',
      'Nuxt',
      'Docker',
      'Local LLMs',
      'Codex',
      'Claude',
      'Gemini',
    ],
  },
];
