import { site } from '@/data/site';
import { createCaseStudyListItems } from '@/data/caseStudies';
import type {
  LearningGroup,
  OpenSourceContribution,
  PageClosingContent,
  PersonalContributionPanelContent,
  PersonalCoolingPanelContent,
  PersonalHeroContent,
  PersonalHomelabPanelContent,
  PersonalLearningPanelContent,
  PersonalOverviewContent,
  PersonalSectionContent,
} from '@/types/content';

export const openSourceSection: PersonalSectionContent = {
  id: 'open-source',
  number: '01',
  listTitle: 'Open-source contributions',
  listCategory: 'Features & fixes',
  category: 'Open source',
  type: 'Useful changes, shared back',
  title: 'Improving the tools I already use.',
  lead: 'My personal projects often begin with a practical need—and sometimes the best place to solve it is upstream.',
  paragraphs: [
    'I contribute features and fixes to tools I actually use. This includes adding lazy-server support to a game-server management panel and contributing a smart-home control feature back to a remote-control library.',
    'Working in existing codebases has taught me to understand unfamiliar systems, compare different approaches, and find solutions that fit naturally into the existing project.',
  ],
  tags: ['Open source', 'Docker', 'Networking', 'Debugging'],
};

export const homelabSection: PersonalSectionContent = {
  id: 'homelab',
  number: '02',
  listTitle: 'Self-hosted systems',
  listCategory: 'Docker & local AI',
  category: 'Homelab',
  type: 'Infrastructure at home',
  title: 'Running software beyond localhost.',
  lead: 'I use my own PC to learn how applications behave when they depend on containers, services, and the resources around them.',
  paragraphs: [
    'I use Docker to run and isolate services on my own hardware, host applications and game-server workloads, and experiment with running large language models locally.',
    'Managing the environment myself gives me hands-on experience with deployment, networking, storage, and resource constraints outside a development machine.',
  ],
  tags: ['Docker', 'Server hosting', 'Local LLMs', 'Self-hosting'],
};

export const learningSection: PersonalSectionContent = {
  id: 'learning',
  number: '03',
  listTitle: 'From transistors to architecture',
  listCategory: 'Learning from first principles',
  category: 'Learning',
  type: 'From low level to architecture',
  title: 'From transistors to software architecture.',
  lead: 'I enjoy understanding technology from the lowest levels up.',
  paragraphs: [
    'The channels I follow cover digital electronics, computer architecture, operating systems, algorithms, mathematics, and engineering.',
    'Across those topics, I keep coming back to the same question: how does the system actually work? That takes me from individual transistors and logic gates all the way to complex software architectures.',
  ],
  tags: ['Computer science', 'Engineering', 'Mathematics'],
};

export const hardwareSection: PersonalSectionContent = {
  id: 'hardware',
  number: '04',
  listTitle: 'Custom PC hardware',
  listCategory: 'Building & cooling',
  category: 'Hardware',
  type: 'Built, tuned, understood',
  title: 'The machine matters too.',
  lead: 'My interest in technology does not stop at software. I am passionate about PC hardware and enjoy building systems myself.',
  paragraphs: [
    'My PC uses a custom water-cooling loop with four radiators and two pumps. Planning and building it brings together what I enjoy most about hardware: precision, performance, and understanding how every part affects the whole.',
    'Building PCs gives me a physical counterpart to software work. Every component has a role, every constraint affects the system, and small details matter.',
  ],
  tags: ['PC building', 'Custom loop', '4 radiators', '2 pumps'],
};

export const personalSections = [openSourceSection, homelabSection, learningSection, hardwareSection];

export const personalHero: PersonalHeroContent = {
  kickerPrefix: '[ OPEN / CURIOUS ]',
  kicker: 'Personal projects & interests',
  titleLines: [{ text: 'Built from' }, { text: 'curiosity.', accent: true }],
  introduction: [
    'Beyond professional and university work, I contribute to tools I use, run systems at home, keep learning, and build PCs down to the cooling loop.',
  ],
  facts: [
    { label: 'Code', value: 'Java, TypeScript & open source' },
    { label: 'Systems', value: 'Docker, hosting & local AI' },
    { label: 'Hardware', value: 'Custom-built & water-cooled' },
  ],
  scrollLabel: 'Explore projects & interests',
  scrollHref: '#personal-list',
};

export const personalOverview: PersonalOverviewContent = {
  id: 'personal-list',
  titleId: 'personal-list-title',
  label: 'Outside client & university work',
  title: 'Projects, systems & technical interests.',
  items: createCaseStudyListItems(personalSections),
};

export const personalClosing: PageClosingContent = {
  kickerPrefix: '/ ALWAYS LEARNING',
  kicker: 'Curiosity in practice',
  title: 'The best projects start with wanting to know more.',
  description:
    'Whether it is a pull request, a container, or a cooling loop, I learn by understanding the system and making it work for a real purpose.',
  actions: [
    { label: 'Start a conversation', href: `mailto:${site.email}` },
    {
      label: 'View source',
      symbol: '→',
      href: site.sourceUrl,
      variant: 'text',
    },
  ],
};

export const contributions: OpenSourceContribution[] = [
  {
    status: 'Merged',
    category: 'Remote-control library',
    title: 'Smart-home control',
    description: 'Added a function for controlling my smart bulb and contributed it back to the library.',
    technicalDescription: 'Designed as reusable network command support for other devices as well.',
    href: 'https://github.com/andrewfraley/magic_mapper/pull/22',
  },
  {
    status: 'Open PR',
    category: 'Game-server panel',
    title: 'Lazy server support',
    description:
      'Added lazy-server support so idle game servers can shut down and automatically start again when someone connects.',
    technicalDescription: 'Integrated into the existing Auto-Stop and proxy system without adding another service.',
    href: 'https://github.com/discohaus/discopanel/pull/128',
  },
  {
    status: 'Fixed',
    category: 'Game-server plugin',
    title: 'Plugin bug fix',
    description: 'Tracked down and corrected a bug in a game-server plugin.',
  },
];

export const learningGroups: LearningGroup[] = [
  {
    category: 'Computer science',
    description:
      'How computers work beneath the abstractions, from digital logic and architecture to operating systems, algorithms, simulations, and graphics.',
    sources: [
      { name: 'Ben Eater', focus: 'Digital electronics, computer architecture & networking' },
      { name: 'Core Dumped', focus: 'Operating systems & low-level computer science' },
      { name: 'Sebastian Lague', focus: 'Algorithms, simulations & computer graphics' },
    ],
  },
  {
    category: 'Mathematics',
    description:
      'Building visual intuition for mathematical ideas across linear algebra, calculus, probability, and beyond.',
    sources: [{ name: '3Blue1Brown', focus: 'Visual intuition for higher mathematics' }],
  },
  {
    category: 'Engineering',
    description:
      'Understanding how physical infrastructure, electronics, and engineered systems work from the inside out.',
    sources: [
      { name: 'Branch Education', focus: 'Hardware, electronics & engineering systems' },
      { name: 'Practical Engineering', focus: 'Civil infrastructure & public works' },
    ],
  },
];

export const contributionPanel: PersonalContributionPanelContent = {
  frame: { title: 'contributions.log', meta: '3 selected changes' },
  ariaLabel: 'Selected open-source contributions',
  items: contributions,
};

export const homelabPanel: PersonalHomelabPanelContent = {
  frame: { title: 'home.systems', meta: 'local infrastructure' },
  ariaLabel: 'A personal computer hosts Docker workloads, server services, and local large language models',
  host: { code: 'HOST / 01', title: 'Personal PC', description: 'Local hardware' },
  services: [
    { type: 'CONTAINER', title: 'Docker', description: 'Isolated workloads' },
    { type: 'SERVICE', title: 'Hosting', description: 'Server workloads' },
    { type: 'MODEL', title: 'Local LLM', description: 'AI on-device' },
  ],
  status: 'Self-managed',
  process: 'Deploy → observe → understand → improve',
};

export const learningPanel: PersonalLearningPanelContent = {
  frame: { title: 'watch.list', meta: '6 creators / 3 subjects' },
  ariaLabel: 'Favorite educational YouTube creators grouped by subject',
  groups: learningGroups,
};

export const coolingPanel: PersonalCoolingPanelContent = {
  frame: { title: 'cooling.loop', meta: '4 radiators / 2 pumps' },
  ariaLabel: 'Custom PC water-cooling system with four radiators, dual pumps, CPU, RAM and GPU water blocks',
  status: { label: 'LIQUID COOLING', title: 'Custom loop' },
  facts: [
    { label: 'Radiators', value: '04×' },
    { label: 'Pumps', value: '02×' },
    { label: 'Blocks', value: 'CPU / RAM / GPU' },
  ],
};

export const personalMeta = {
  title: 'Personal Projects & Interests | Matthias Löhden',
  description:
    'Open-source contributions, self-hosted systems, local AI, favorite educational creators, and custom PC hardware by Matthias Löhden.',
};
