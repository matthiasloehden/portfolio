import { site } from '@/data/site';
import { createCaseStudyListItems } from '@/data/caseStudies';
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
  summary: 'Learning platform with a custom CMS, role-based access, and multiple content formats.',
  paragraphs: [
    'Our team at TopRed Media was responsible for developing the application and managing its content. Its custom CMS supported events, videos, podcasts, and articles in one system.',
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
  summary: 'Operational platform for shop data, tasks, workflows, and Excel-based reporting.',
  paragraphs: [
    'Our team built a central platform where shop employees received and completed operational tasks, including documenting completed work with photo uploads.',
    'Each shop had its own profile containing location data, floor layouts, opening hours, open and closed tasks, and workflows for location and postal changes.',
    'The platform’s analytics brought shop, task, and related platform data together in Excel reports. The flow also worked in reverse: edited spreadsheets could be uploaded and synchronized back to the database.',
  ],
  facts: [
    { label: 'Purpose', value: 'Shop and task management' },
    { label: 'Data', value: 'Locations, layouts, hours, tasks' },
    { label: 'Reporting', value: 'Bidirectional Excel/database sync' },
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
  summary: 'Python service and Electron UI for remote display control and operational monitoring.',
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
  type: 'Company product',
  title: 'Configurable client platform',
  summary: 'A shared application foundation with client-specific modules for content, communication, and access control.',
  paragraphs: [
    'Our team consolidated reusable packages and features from other projects into a configurable product platform that TopRed Media offered to clients. Modules such as CMS content, articles, live chat, events, teams, roles, and permissions could be enabled and configured individually for each client.',
    'The same foundation supported use cases as different as communication between a personal trainer and customers or coordination within a kindergarten, without maintaining a separate product for each client.',
  ],
  facts: [
    { label: 'Purpose', value: 'Content and communication' },
    { label: 'Modules', value: 'Content, chat, events, teams, access' },
    { label: 'Model', value: 'Features enabled per client' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[ 2019–2025 ]',
  kicker: 'Professional software development',
  titleLines: [{ text: 'Production' }, { text: 'software.', accent: true }],
  introduction: [
    'At TopRed Media GmbH, I contributed across the full lifecycle of production enterprise applications, from initial development through years of feature development, refactoring, integrations, and maintenance.',
    'Working in a three-developer team, I contributed across the stack as requirements, workflows, and the products themselves continuously evolved.',
  ],
  facts: [
    { label: 'Company', value: 'TopRed Media GmbH' },
    { label: 'Role', value: 'Apprentice → full-stack developer' },
    { label: 'Systems', value: 'Four selected projects' },
  ],
  scrollLabel: 'Explore selected work',
  scrollHref: '#work-list',
};

export const workOverview: WorkOverviewContent = {
  id: 'work-list',
  titleId: 'work-list-title',
  label: 'Selected professional work',
  title: 'Four selected production systems.',
  items: createCaseStudyListItems(workCases),
};

export const workContext: WorkContextContent = {
  kicker: 'Technology overview',
  title: 'Core technologies across these projects.',
  stack: {
    languages: ['PHP', 'SQL', 'JavaScript'],
    backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Highlights',
  highlights: [
    'Backend architecture, data modeling, and application workflows',
    'Single-page applications with Laravel, Vue, and Inertia.js',
    'Caching and evaluating complex user permissions with Redis',
    'Search and filtering of large datasets with Meilisearch',
    'Bidirectional Excel and database synchronization',
    'Integrating applications with external services and physical systems',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Professional scope',
  title: 'About these projects.',
  description:
    'These client projects and the company-owned product are intentionally described at a system level. Together, they represent the range of production software I worked on: application workflows, user interfaces, data, permissions, search, integrations, maintenance, and software interacting with physical systems.',
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
  title: 'Professional Work | Matthias Löhden',
  description:
    'Professional software projects by Matthias Löhden at TopRed Media GmbH, including learning, shop management, digital signage, and communication platforms.',
};
