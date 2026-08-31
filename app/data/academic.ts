import { createCaseStudyListItems } from '@/data/caseStudies';
import { site } from '@/data/site';
import type {
  AcademicAuthenticationPanelContent,
  AcademicCaseStudyContent,
  AcademicEngineeringPanelContent,
  AcademicHeroContent,
  AcademicOverviewContent,
  AcademicServicePanelContent,
  AcademicStreamingPanelContent,
  PageClosingContent,
} from '@/types/content';

export const streamingCase: AcademicCaseStudyContent = {
  id: 'streaming',
  number: '02',
  listTitle: 'Event-streaming analytics',
  listCategory: 'Scalability & big data',
  category: 'Scalability & big data',
  type: 'Streaming architecture',
  title: ['From raw events', 'to a live', ['operational', ' view.']],
  accent: [false, false, true],
  lead: 'A distributed event-processing prototype for ingesting, transforming, and analyzing streaming data in real time.',
  description:
    'Kafka decoupled event producers from downstream consumers. Flink validated, enriched, and aggregated the stream before writing query-ready records to ClickHouse. Grafana turned that data into an operational dashboard for inspecting volume, trends, and processing health.',
  notes: [
    {
      title: 'Engineering question',
      text: 'How can a modular pipeline turn an unbounded event stream into information that is useful immediately?',
    },
    {
      title: 'Focus',
      text: 'Scalability, stream transformations, event-time thinking, column-oriented analytics, and observability.',
    },
  ],
};

export const passkeysCase: AcademicCaseStudyContent = {
  id: 'passkeys',
  number: '03',
  listTitle: 'FIDO2 passkeys',
  listCategory: 'Security design',
  category: 'Security design',
  type: 'Authentication architecture',
  title: [['Passwordless', ' sign-in'], 'with FIDO2 passkeys.'],
  accent: [true, false],
  lead: 'A proof of concept exploring secure system design and modern authentication, built around a FIDO2-based passwordless sign-in system.',
  description:
    'Rather than treating security as an additional layer, the system was designed around authentication flows, credentials, trust boundaries, and sensitive operations. Registration associated a public key with the user, while authentication used a scoped challenge-response ceremony protected by the browser and authenticator.',
  notes: [
    {
      title: 'Engineering question',
      text: 'How can authentication become easier for users while reducing exposure to phishing and credential reuse?',
    },
    {
      title: 'Focus',
      text: 'Security by design, WebAuthn ceremonies, relying-party boundaries, challenge validation, credential storage, and recovery UX.',
    },
  ],
};

export const softwareEngineeringCase: AcademicCaseStudyContent = {
  id: 'software-engineering',
  number: '01',
  listTitle: 'Software engineering project',
  listCategory: 'Lifecycle & quality',
  category: 'Software engineering',
  type: 'Team project',
  title: ['From requirements', 'to a', ['tested', ' release.']],
  accent: [false, false, true],
  lead: 'A completed group project bringing methods from earlier software-engineering courses together across the full development lifecycle.',
  description:
    'Our team developed a TypeScript web application for planning and tracking learning time, organizing the work through tickets and milestones. We collaborated on requirements, specification, design, implementation, testing, and documentation. I contributed across these stages while taking primary responsibility for architecture and quality management.',
  notes: [
    {
      title: 'Engineering question',
      text: 'How can a team apply software-engineering methods to deliver a traceable, quality-assured application across the complete lifecycle?',
    },
    {
      title: 'Focus',
      text: 'Software lifecycle, architecture, quality management, testing, documentation, and iterative delivery.',
    },
  ],
};

export const itsmCase: AcademicCaseStudyContent = {
  id: 'itsm',
  number: '04',
  listTitle: 'IT service management',
  listCategory: 'Service operations',
  category: 'Service operations',
  type: 'Operating model',
  title: ['Designing a', ['lightweight', ' IT service'], 'management model.'],
  accent: [false, true, false],
  lead: 'A service-management concept based on ITIL and FitSM, defining ownership, incident and request flows, escalation paths, and continual improvement.',
  description:
    'The model translated broader framework guidance into a lightweight and auditable operating approach. ITIL provided the practice context, while FitSM helped define a practical minimum for repeatable service quality.',
  notes: [
    {
      title: 'Engineering question',
      text: 'What is the smallest useful process model that still creates clear ownership and repeatable service quality?',
    },
    {
      title: 'Focus',
      text: 'Service operations, incident flow, service requests, roles, escalation paths, service-level thinking, and continual improvement.',
    },
  ],
};

export const academicCases = [softwareEngineeringCase, streamingCase, passkeysCase, itsmCase];

export const academicHero: AcademicHeroContent = {
  kickerPrefix: '[ COMPUTER SCIENCE ]',
  kicker: 'Selected academic work',
  title: ['Software,', ['systems', ' &'], 'security.'],
  accent: [false, true, false],
  introduction: [
    'Four selected projects cover software engineering across the full lifecycle, distributed data processing, authentication and system security, and reliable service operations.',
  ],
  facts: [
    { label: 'Coursework', value: 'JavaScript, Java, Python, Prolog & R' },
    { label: 'Systems & tools', value: 'Kafka, Flink, ClickHouse, Grafana & WebAuthn' },
    { label: 'Focus', value: 'Software engineering, systems & security' },
  ],
  scrollLabel: 'View projects',
  scrollHref: '#academic-list',
};

export const academicOverview: AcademicOverviewContent = {
  id: 'academic-list',
  titleId: 'academic-list-title',
  label: 'Selected university projects',
  title: ['Four selected', 'university', 'projects.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(academicCases),
};

export const academicClosing: PageClosingContent = {
  kickerPrefix: '/',
  kicker: 'Academic scope',
  title: ['Computer science', 'beyond the', 'application', 'layer.'],
  accent: [false, false, true, false],
  description:
    'These projects connect my professional experience with academic work across the complete software lifecycle, distributed data processing, authentication and system security, and IT service operations.',
  actions: [
    { label: 'Start a conversation', href: `mailto:${site.email}` },
    { label: 'View personal projects', symbol: '→', to: '/personal', variant: 'text' },
  ],
};

export const streamingPanel: AcademicStreamingPanelContent = {
  frame: { title: 'pipeline.flow', meta: 'event → insight' },
  ariaLabel: 'Data flows from producers through Kafka and Flink into ClickHouse and Grafana',
  nodes: [
    { name: 'Producers', description: 'Event source' },
    { name: 'Kafka', description: 'Transport' },
    { name: 'Flink', description: 'Processing' },
    { name: 'ClickHouse', description: 'Analytics' },
    { name: 'Grafana', description: 'Visibility' },
  ],
};

export const engineeringPanel: AcademicEngineeringPanelContent = {
  frame: { title: 'lernzeit.manager', meta: 'personal study planning' },
  ariaLabel: 'Preview of the completed learning-time manager web application',
  navigation: ['Overview', 'Learning goals', 'Planning', 'Focus time', 'Analytics', 'Reminders'],
  metrics: [
    { label: 'Active goals', value: '2' },
    { label: 'Monthly plan', value: '38 h' },
    { label: 'Focus time', value: '8.1 h' },
  ],
  goals: [
    { title: 'Data modeling', status: 'In progress' },
    { title: 'Linear algebra', status: 'Planned' },
  ],
  schedule: [
    { date: '26.07', title: 'Normalization exercises' },
    { date: '29.07', title: 'Vector space exercises' },
  ],
  facts: [
    { label: 'Project', value: 'Collaborative group work' },
    { label: 'Primary responsibility', value: 'Architecture & quality management' },
    { label: 'Delivery', value: 'Tickets, milestones & reviews' },
  ],
  demo: {
    label: 'View live demo',
    href: 'https://struperto.github.io/isef01-lernzeit-manager/',
  },
  status: 'Full lifecycle completed',
};

export const authenticationPanel: AcademicAuthenticationPanelContent = {
  frame: { title: 'authentication.ceremony', meta: 'public-key flow' },
  steps: [
    { number: '01', title: 'Request', description: 'The server creates a fresh challenge.' },
    { number: '02', title: 'Verify locally', description: 'The user unlocks a device-bound authenticator.' },
    {
      number: '03',
      title: 'Sign',
      description: 'The private key signs the challenge without leaving the authenticator.',
    },
    { number: '04', title: 'Validate', description: 'The server verifies origin, challenge, and signature.' },
  ],
  status: 'No shared password transmitted',
};

export const servicePanel: AcademicServicePanelContent = {
  frame: { title: 'service.model', meta: 'framework mapping' },
  stages: [
    { number: '01', title: 'Capture', description: 'Record and acknowledge' },
    { number: '02', title: 'Classify', description: 'Prioritize and assign' },
    { number: '03', title: 'Resolve', description: 'Restore or fulfil' },
    { number: '04', title: 'Learn', description: 'Review and improve' },
  ],
  frameworks: [
    { name: 'ITIL', description: 'Practices, value, and continual improvement' },
    { name: 'FitSM', description: 'Lightweight requirements and clear accountability' },
  ],
};

export const academicMeta = {
  title: 'University Projects | Matthias Löhden',
  description:
    'Selected computer science work by Matthias Löhden across scalable event processing, FIDO2 authentication, applied software engineering, and service operations.',
};
