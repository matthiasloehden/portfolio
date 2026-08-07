import type { CaseStudyListItem, WorkCaseStudyContent } from '@/types/content';

export const workList: CaseStudyListItem[] = [
  { href: '#learning-platform', number: '01', title: 'Learning platform', category: 'Learning platform' },
  { href: '#retail-operations', number: '02', title: 'Retail operations', category: 'Shop operations' },
  { href: '#signage-control', number: '03', title: 'Signage control', category: 'Digital signage' },
  { href: '#client-platform', number: '04', title: 'Client platform', category: 'CMS & communication' },
];

export const learningCase: WorkCaseStudyContent = {
  id: 'learning-platform',
  number: '01',
  category: 'Enterprise client',
  type: 'Learning & content',
  title: 'Enterprise learning platform',
  summary: 'A learning platform backed by a purpose-built publishing and permissions system.',
  paragraphs: [
    'Our team at TopRed Media was responsible for a platform that brought multiple learning formats into one managed experience. Its custom CMS supported events, videos, podcasts, and articles instead of forcing very different content into one generic model.',
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
  category: 'Enterprise client',
  type: 'Retail operations',
  title: 'Retail operations platform',
  summary: 'A shared operational workspace for tasks, shop data, changes, and reporting.',
  paragraphs: [
    'The platform gave employees a central place to receive and complete tasks while maintaining the operational record for each shop. Individual shop pages collected opening times, floor layouts, location data, and location or postal-change workflows.',
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
  category: 'TopRed Media',
  type: 'Internal product',
  title: 'One platform, different communities.',
  summary: 'A configurable CMS and communication product designed for different client contexts.',
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
