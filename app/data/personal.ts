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
  title: ['Improving the', ['tools', ' I already use.']],
  accent: [false, true],
  lead: 'My personal projects often begin with a practical need. Sometimes the best place to solve it is upstream.',
  paragraphs: [
    'I contribute features and fixes to tools I actually use, from smart-home and remote-control software to game-server management.',
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
  title: ['Running', 'software', 'beyond localhost.'],
  accent: [false, true, false],
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
  title: ['From', ['transistors', ' to'], 'software architecture.'],
  accent: [false, true, false],
  lead: 'I enjoy understanding technology from the lowest levels up.',
  paragraphs: [
    'Understanding software abstractions often requires examining the layers beneath them. The creators I follow explore that stack through digital logic, computer architecture, operating systems, algorithms, mathematics, and engineering.',
    'The subjects vary, but the question stays the same: how does the system actually work? Following it from transistors and logic gates upward helps me make more deliberate decisions in software design and architecture.',
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
  title: ['The machine', 'matters too.'],
  accent: [true, false],
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
  title: ['Built from', 'curiosity.'],
  accent: [false, true],
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
  title: ['Projects,', ['systems', ' &'], 'technical interests.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(personalSections),
};

export const personalClosing: PageClosingContent = {
  kickerPrefix: '/ ALWAYS LEARNING',
  kicker: 'Curiosity in practice',
  title: ['The best', ['projects', ' start'], 'with wanting', 'to know more.'],
  accent: [false, true, false, false],
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
    title: 'Smart Home Control',
    description: 'Added TCP support to a remote-control library for controlling network devices.',
    href: 'https://github.com/andrewfraley/magic_mapper/pull/22',
  },
  {
    status: 'Open',
    category: 'Game-server panel',
    title: 'On-Demand Game Servers',
    description: 'Extended the existing proxy to wake stopped servers on player connection.',
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
    sources: [
      {
        name: 'Ben Eater',
        focus: 'Electrical engineering, digital logic, and computer architecture through breadboard computers',
        href: 'https://www.youtube.com/@BenEater',
      },
      {
        name: 'Core Dumped',
        focus: 'Operating systems, memory management, compilers, and other low-level software concepts',
        href: 'https://www.youtube.com/@CoreDumpped',
      },
      {
        name: 'Sebastian Lague',
        focus: 'Algorithms, simulations, and computer graphics explored through programming projects',
        href: 'https://www.youtube.com/@SebastianLague',
      },
    ],
  },
  {
    category: 'Mathematics',
    sources: [
      {
        name: '3Blue1Brown',
        focus: 'Visual approaches to the mathematical foundations of algorithms, graphics, and machine learning',
        href: 'https://www.youtube.com/@3blue1brown',
      },
    ],
  },
  {
    category: 'Engineering',
    sources: [
      {
        name: 'Branch Education',
        focus: 'Animated explanations of how processors, memory, and other hardware execute software',
        href: 'https://www.youtube.com/@BranchEducation',
      },
      {
        name: 'Practical Engineering',
        focus: 'How engineering constraints, trade-offs, failure modes, and maintenance shape infrastructure',
        href: 'https://www.youtube.com/@PracticalEngineeringChannel',
      },
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
