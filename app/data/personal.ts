import type { CaseStudyListItem, LearningGroup, OpenSourceContribution, PersonalSectionContent } from '@/types/content';

export const personalList: CaseStudyListItem[] = [
  { href: '#open-source', number: '01', title: 'Open-source contributions', category: 'Features & fixes' },
  { href: '#homelab', number: '02', title: 'Self-hosted systems', category: 'Docker & local AI' },
  { href: '#learning', number: '03', title: 'Channels I return to', category: 'Learning & inspiration' },
  { href: '#hardware', number: '04', title: 'Custom PC hardware', category: 'Building & cooling' },
];

export const openSourceSection: PersonalSectionContent = {
  id: 'open-source',
  number: '01',
  category: 'Open source',
  type: 'Useful changes, shared back',
  title: 'Improving the tools I already use.',
  lead: 'My personal projects often begin with a practical need—and sometimes the best place to solve it is upstream.',
  paragraphs: [
    'I have contributed features and fixes across a remote-control library, a game-server management panel, and a game-server plugin. One of those changes—a smart-home function for controlling my smart bulb—was accepted and merged into the library.',
    'Working in existing codebases has taught me to understand unfamiliar structures, keep changes focused, and fit new behavior into an established project.',
  ],
  tags: ['Open source', 'Frontend', 'Smart home', 'Debugging'],
};

export const homelabSection: PersonalSectionContent = {
  id: 'homelab',
  number: '02',
  category: 'Homelab',
  type: 'Infrastructure at home',
  title: 'Running software beyond localhost.',
  lead: 'I use my own PC as a place to learn how applications behave once they need containers, services, and resources around them.',
  paragraphs: [
    'My hands-on experience includes working with Docker, hosting server workloads, and setting up local large language models.',
    'That environment gives me room to experiment with deployment and operations while keeping the entire system under my own control.',
  ],
  tags: ['Docker', 'Server hosting', 'Local LLMs', 'Self-hosting'],
};

export const learningSection: PersonalSectionContent = {
  id: 'learning',
  number: '03',
  category: 'Learning',
  type: 'Channels worth returning to',
  title: 'Ideas explained from first principles.',
  lead: 'The creators I value most make complex systems tangible through careful explanation, visual thinking, and hands-on exploration.',
  paragraphs: [
    'My favourites form three complementary groups: computer science from code down to hardware, engineering in the physical world, and visual mathematics.',
    'Together they are a steady source of new questions—and a reminder that the clearest explanations usually come from understanding a subject deeply.',
  ],
  tags: ['Computer science', 'Engineering', 'Mathematics', 'Creative coding'],
};

export const hardwareSection: PersonalSectionContent = {
  id: 'hardware',
  number: '04',
  category: 'Hardware',
  type: 'Built, tuned, understood',
  title: 'The machine matters too.',
  lead: 'My interest in technology does not stop at software: I am passionate about PC hardware and enjoy building systems myself.',
  paragraphs: [
    'My own PC uses a custom water-cooling setup with four radiators and two pumps. Planning and assembling it combines the things I enjoy most about hardware: precision, performance, and a system-level view.',
    'Building PCs also gives me a physical counterpart to software work—every component has a role, every constraint affects the whole, and details matter.',
  ],
  tags: ['PC building', 'Custom loop', '4 radiators', '2 pumps'],
};

export const contributions: OpenSourceContribution[] = [
  {
    status: 'Merged',
    category: 'Remote-control library',
    title: 'Smart-home control',
    description: 'Added a function for controlling my smart bulb and contributed it back to the library.',
  },
  {
    status: 'Implemented',
    category: 'Game-server panel',
    title: 'Frontend feature',
    description: 'Extended the panel frontend with an additional function.',
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
      {
        name: 'Ben Eater',
        focus: 'Digital electronics, computer architecture & networking',
      },
      {
        name: 'Core Dumped',
        focus: 'Operating systems & low-level computer science',
      },
      {
        name: 'Sebastian Lague',
        focus: 'Algorithms, simulations & computer graphics',
      },
    ],
  },
  {
    category: 'Mathematics',
    description:
      'Building visual intuition for mathematical ideas across linear algebra, calculus, probability, and beyond.',
    sources: [
      {
        name: '3Blue1Brown',
        focus: 'Visual intuition for higher mathematics',
      },
    ],
  },
  {
    category: 'Engineering',
    description:
      'Understanding how physical infrastructure, electronics, and engineered systems work from the inside out.',
    sources: [
      {
        name: 'Branch Education',
        focus: 'Hardware, electronics & engineering systems',
      },
      {
        name: 'Practical Engineering',
        focus: 'Civil infrastructure & public works',
      },
    ],
  },
];
