import type { HomeAboutContent, HomeCapabilitiesContent, HomeHeroContent } from '@/types/content';
import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';

export const homeHero = {
  kicker: 'Ingeniero de software · Estudiante de informática · Alemania',
  title: ['Desarrollo', 'aplicaciones.'],
  accent: [false, true],
  introduction: [
    'Soy Matthias, un desarrollador de aplicaciones capacitado con tres años de experiencia profesional, actualmente estudio informática en IU.',
    'Mi experiencia abarca aplicaciones de producción, desarrollo backend y frontend, bases de datos, integraciones, mantenimiento de sistemas y DevOps.',
  ],
  actions: [
    { label: 'Iniciar una conversación', href: `mailto:${site.email}` },
    { label: 'Ver experiencia', symbol: '↓', to: { ...APP_ROUTES.home, hash: '#about' }, variant: 'text' },
  ],
  profile: {
    filename: 'profile.ts',
    name: 'Matthias',
    role: 'ingeniero de software',
    focus: ['aplicaciones', 'sistemas', 'rendimiento', 'mantenibilidad'],
    status: 'Sistemas en funcionamiento',
    location: 'DE/CET',
  },
  highlights: [
    { number: '01', title: 'Desde 2019', description: 'Desarrollo de software profesional' },
    { number: '02', title: 'B.Sc. Ciencias de la Computación', description: 'Actualmente estudiando en IU' },
    { number: '03', title: 'Del concepto al mantenimiento', description: 'Diseño, entrega, evolución.' },
  ],
} satisfies HomeHeroContent;

export const homeAbout = {
  number: '01',
  label: 'Acerca de',
  title: [['Experiencia ', 'práctica,'], 'respaldada por', ['fundamentos ', 'sólidos.']],
  accent: [false, false, false],
  paragraphs: [
    'Completé mi aprendizaje de desarrollo de aplicaciones en TopRed Media de 2019 a 2022 y continué allí como desarrollador de full-stack hasta 2025. Desde 2022, he combinado esa experiencia práctica con estudios de informática en IU, con cursos en sistemas distribuidos, seguridad y diseño de software.',
    'Me gusta entender cómo funcionan los sistemas y por qué están construidos como están. Quiero comprender el problema real, tomar decisiones técnicas deliberadas y crear soluciones que sean confiables, mantenibles y adecuadas para su propósito.',
  ],
  principles: ['Aplicaciones', 'Sistemas', 'Rendimiento', 'Mantenibilidad'],
} satisfies HomeAboutContent;

export const homeCapabilities = {
  number: '02',
  label: 'Capacidades',
  title: ['Experiencia,', 'en contexto.'],
  accent: [false, true],
  introduction:
    'Tecnologías agrupadas según dónde las he utilizado: en producción, a través del trabajo académico y en proyectos que realizo de forma independiente.',
  items: [
    {
      number: '01',
      layer: 'experiencia de producción',
      title: 'Profesional',
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
      layer: 'Trabajo de curso',
      title: 'Académico',
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
      layer: 'Práctica independiente',
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
  title: 'Matías Löhden | Ingeniero de software',
  description:
    'Portafolio de Matthias Löhden, un ingeniero de software que crea aplicaciones y sistemas rápidos, confiables y fáciles de mantener.',
};
