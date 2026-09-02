import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';
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
  title: ['Enterprise', ['learning', ' platform']],
  accent: [false, true],
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
  title: [['Retail', ' operations'], 'platform'],
  accent: [true, false],
  summary: 'Operational platform for shop data, tasks, workflows, and Excel-based reporting.',
  paragraphs: [
    'Our team built a central platform for managing shop data, operational tasks, and workflows. Each shop had a structured profile covering location data, floor layouts, opening hours, and processes such as location and postal changes.',
    'Shop, task, and related platform data could be exported into Excel reports for further analysis. The process also worked in reverse: edited spreadsheets could be uploaded and synchronized back to the database.',
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
  title: [['Digital ', 'signage'], 'control system'],
  accent: [false, false],
  summary: 'Python service and Electron UI for remote display control and operational monitoring.',
  paragraphs: [
    'I was responsible for a Python service with an Electron frontend that ran on digital-signage players and controlled connected displays during advertisement playback.',
    'The service communicated with displays over RS-232, reported player status to the central platform, and could be managed remotely through the Electron interface.',
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
  title: ['Configurable', 'client platform'],
  accent: [true, false],
  summary:
    'Reusable application packages combined into client-specific platforms for content, communication, and access control.',
  paragraphs: [
    'Across our projects, recurring functionality was developed as reusable packages instead of being rebuilt for each application.',
    'These packages became the foundation of a configurable platform that TopRed Media could adapt for individual clients.',
    'Features such as CMS content, live chat, events, teams, roles, and permissions could be combined and configured per client, supporting different use cases from personal training to kindergarten communication.',
  ],
  facts: [
    { label: 'Architecture', value: 'Reusable feature packages' },
    { label: 'Modules', value: 'Content, chat, events, teams, access' },
    { label: 'Model', value: 'Features enabled per client' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[ 2019–2025 ]',
  kicker: 'Professional software development',
  title: ['Production', 'software.'],
  accent: [false, true],
  introduction: [
    'At TopRed Media GmbH, I contributed across the full lifecycle of production enterprise applications, from initial development through years of feature development, reusable package development, CI/CD, and long-term maintenance.',
    'Working in a three-developer team, I contributed across the stack as requirements, workflows, infrastructure, and the products themselves continuously evolved.',
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
  title: ['Four selected', 'production', 'systems.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(workCases),
};

export const workContext: WorkContextContent = {
  kicker: 'Technology overview',
  title: ['Core', 'technologies', 'across these', 'projects.'],
  accent: [false, true, false, false],
  stack: {
    languages: ['PHP', 'SQL', 'JavaScript'],
    backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Highlights',
  highlights: [
    'Backend development, reusable packages, and modular application design',
    'Automated testing, CI/CD, deployment, and server configuration',
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
  title: ['About these', 'projects.'],
  accent: [false, true],
  description:
    'Together, these projects represent the breadth of my production software engineering work, from reusable packages and application workflows to integrations, deployment, long-term maintenance, and software interacting with physical systems.',
  actions: [
    { label: 'Start a conversation', href: `mailto:${site.email}` },
    { label: 'View university work', symbol: '→', to: APP_ROUTES.academic, variant: 'text' },
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
