import { site } from '@/data/site';
import type {
  WorkCaseStudyContent,
  WorkClientPanelContent,
  WorkClosingContent,
  WorkContextContent,
  WorkHeroContent,
  WorkLearningPanelContent,
  WorkOverviewContent,
  WorkRetailPanelContent,
  WorkSignagePanelContent,
} from '@/types/content';

export const learningCase: WorkCaseStudyContent = {
  id: 'learning-platform',
  number: '01',
  listTitle: 'Learning platform',
  listCategory: 'Learning platform',
  category: 'Enterprise client',
  type: 'Learning & content',
  title: 'Enterprise learning platform',
  summary: 'A learning application backed by a purpose-built publishing and permissions system.',
  paragraphs: [
    'Our team at TopRed Media was responsible for an application that brought multiple learning formats into one managed experience. Its custom CMS supported events, videos, podcasts, and articles instead of forcing very different content into one generic model.',
    'Custom access rights controlled who could reach specific parts of the platform, making permissions a core product capability alongside publishing.',
  ],
  facts: [
    { label: 'Purpose', value: 'Learning and knowledge' },
    { label: 'Delivery', value: 'Custom CMS and access rights' },
    { label: 'Formats', value: 'Events, video, podcasts, articles' },
  ],
};

export const retailCase: WorkCaseStudyContent = {
  id: 'retail-operations',
  number: '02',
  listTitle: 'Retail operations',
  listCategory: 'Shop operations',
  category: 'Enterprise client',
  type: 'Retail operations',
  title: 'Retail operations platform',
  summary: 'A data-heavy operational workspace for tasks, shop records, changes, and reporting.',
  paragraphs: [
    'Our team built the platform that gave employees a central place to receive and complete tasks while maintaining the operational record for each shop. Individual shop pages collected opening times, floor layouts, location data, and location or postal-change workflows.',
    'Its analytics brought shop, task, and related platform data together in Excel reports. The flow also worked in reverse: edited spreadsheets could be uploaded and synchronized back to the database.',
  ],
  facts: [
    { label: 'Purpose', value: 'Shop and task management' },
    { label: 'Data', value: 'Locations, layouts, hours, tasks' },
    { label: 'Reporting', value: 'Excel export and import sync' },
  ],
};

export const signageCase: WorkCaseStudyContent = {
  id: 'signage-control',
  number: '03',
  listTitle: 'Signage control',
  listCategory: 'Digital signage',
  category: 'Enterprise client',
  type: 'Digital signage',
  title: 'Digital signage control system',
  summary: 'Player software connecting remote operations, physical displays, and platform analytics.',
  paragraphs: [
    'I was responsible for a Python service with an Electron frontend that ran on digital-signage players and controlled their connected displays while advertisements were playing.',
    'The service communicated with each display over RS-232 and sent player status back to the central retail operations platform for analytics. Operators could connect through remote administration and use the Electron interface to control the service.',
  ],
  facts: [
    { label: 'My responsibility', value: 'Python service and Electron UI' },
    { label: 'Hardware link', value: 'RS-232 display control' },
    { label: 'Operations', value: 'Status reporting and remote control' },
  ],
};

export const clientCase: WorkCaseStudyContent = {
  id: 'client-platform',
  number: '04',
  listTitle: 'Client platform',
  listCategory: 'CMS & communication',
  category: 'TopRed Media',
  type: 'Internal product',
  title: 'One platform, different communities.',
  summary: 'A configurable application foundation for content, communication, and client-specific workflows.',
  paragraphs: [
    'Alongside the client work, our team developed an internal platform combining a custom CMS with live chat, event management, team management, and related communication tools.',
    'It was adaptable to very different organizations: examples included a personal trainer communicating with customers and a kindergarten coordinating its community. The shared product foundation could serve both without reducing them to the same workflow.',
  ],
  facts: [
    { label: 'Purpose', value: 'Content and communication' },
    { label: 'Modules', value: 'CMS, live chat, events, teams' },
    { label: 'Model', value: 'Configurable for client contexts' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[ 2019—2025 ]',
  kicker: 'Client & product systems',
  titleLines: ['Software for', 'work that'],
  titleAccent: 'matters.',
  introduction:
    'At TopRed Media GmbH, I contributed across the full lifecycle of production enterprise applications, from initial development through years of feature development, refactoring, integrations, and maintenance. Working in a three-developer team, I contributed across the stack as requirements, workflows, and the products themselves continuously evolved.',
  facts: [
    { label: 'Company', value: 'TopRed Media GmbH' },
    { label: 'Role', value: 'Apprentice → full-stack developer' },
    { label: 'Systems', value: 'Four selected projects' },
  ],
  scrollLabel: 'Explore the systems',
  scrollHref: '#work-list',
};

export const workOverview: WorkOverviewContent = {
  id: 'work-list',
  titleId: 'work-list-title',
  label: 'Selected professional work',
  title: 'Platforms built around real operations.',
  items: workCases.map(({ id, number, listTitle, listCategory }) => ({
    href: `#${id}`,
    number,
    title: listTitle,
    category: listCategory,
  })),
};

export const workContext: WorkContextContent = {
  kicker: 'Core stack across these products',
  title: 'One foundation, different systems.',
  stack: {
    languages: ['PHP', 'SQL', 'JavaScript'],
    backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Highlights',
  highlights: [
    'Backend architecture, data modeling, and application workflows',
    'Single-page applications with Inertia.js',
    'Caching and evaluating complex user permissions with Redis',
    'Search and filtering of large datasets with Meilisearch',
    'Integrating applications with external services and physical systems',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/ CONTEXT',
  kicker: 'A note on client work',
  title: 'Built for the people operating it every day.',
  description:
    'These projects are described at a system level. The common thread is practical software that connects content, workflows, data, and physical operations.',
  actions: [
    { label: 'Start a conversation', href: `mailto:${site.email}` },
    { label: 'View university work', symbol: '→', to: '/academic', variant: 'text' },
  ],
};

export const learningPanel: WorkLearningPanelContent = {
  frame: { title: 'content.library', meta: 'access-aware publishing' },
  navigation: ['Overview', 'Events', 'Media', 'Articles'],
  featured: { title: 'Learning event', description: 'Registration · badges · feedback' },
  formats: [
    { symbol: '▶', title: 'Video', description: 'On demand' },
    { symbol: '◉', title: 'Podcast', description: 'Audio series' },
    { symbol: '¶', title: 'Article', description: 'Editorial' },
  ],
  status: 'Role-aware content delivery',
};

export const retailPanel: WorkRetailPanelContent = {
  frame: { title: 'shop.record', meta: 'operational source of truth' },
  code: 'SHOP / 042',
  title: 'Location profile',
  status: 'Record active',
  fields: [
    { label: 'Opening hours', value: 'Configured' },
    { label: 'Floor layout', value: 'Available' },
    { label: 'Postal data', value: 'Managed' },
    { label: 'Tasks', value: 'Assigned' },
  ],
  sync: {
    label: 'Excel sheets could export data and synchronize uploaded changes',
    source: 'Database',
    target: '.XLSX',
  },
};

export const signagePanel: WorkSignagePanelContent = {
  frame: { title: 'display.control', meta: 'player online' },
  remote: { label: 'REMOTE', title: 'Administration' },
  player: [
    { label: 'CONTROL UI', title: 'Electron' },
    { label: 'SERVICE', title: 'Python' },
  ],
  outputs: [
    { connection: 'RS-232 →', title: 'Display', description: 'Playback control' },
    { connection: 'Status →', title: 'Operations', description: 'Analytics' },
  ],
};

export const clientPanel: WorkClientPanelContent = {
  frame: { title: 'platform.modules', meta: 'configured per client' },
  modules: [
    { number: '01', title: 'CMS', description: 'Publish content' },
    { number: '02', title: 'Live chat', description: 'Stay connected' },
    { number: '03', title: 'Events', description: 'Coordinate activity' },
    { number: '04', title: 'Teams', description: 'Manage groups' },
  ],
  audiences: ['Personal training', 'Kindergarten'],
};

export const workMeta = {
  title: 'Professional Work — Matthias Löhden',
  description:
    'Professional software projects by Matthias Löhden at TopRed Media GmbH, including learning, shop management, digital signage, and communication platforms.',
};
