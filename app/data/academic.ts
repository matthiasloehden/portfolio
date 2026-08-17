import { site } from '@/data/site';
import type {
  AcademicAuthenticationPanelContent,
  AcademicCaseStudyContent,
  AcademicHeroContent,
  AcademicOverviewContent,
  AcademicServicePanelContent,
  AcademicStreamingPanelContent,
  PageClosingContent,
} from '@/types/content';

export const streamingCase: AcademicCaseStudyContent = {
  id: 'streaming',
  number: '01',
  listTitle: 'Event-streaming analytics',
  listCategory: 'Scalability & big data',
  category: 'Scalability & big data',
  type: 'Streaming architecture',
  title: 'From raw events to a live operational view.',
  lead: 'A prototype centered on distributed systems and real-time data processing, built around a streaming pipeline for live operational insight.',
  description:
    'Kafka decoupled event producers from downstream consumers. Flink validated, enriched, and aggregated the stream before writing query-ready records to ClickHouse. Grafana turned that data into an operational dashboard for inspecting volume, trends, and processing health.',
  notes: [
    {
      title: 'Question',
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
  number: '02',
  listTitle: 'FIDO2 passkeys',
  listCategory: 'Security design',
  category: 'Security design',
  type: 'Authentication architecture',
  title: 'Passwordless sign-in with FIDO2 passkeys.',
  lead: 'A proof of concept exploring secure system design and modern authentication, built around a FIDO2-based passwordless sign-in system.',
  description:
    'Rather than treating security as an additional layer, the system was designed around authentication flows, credentials, trust boundaries, and sensitive operations. Registration associated a public key with the user, while authentication used a scoped challenge-response ceremony protected by the browser and authenticator.',
  notes: [
    {
      title: 'Question',
      text: 'How can authentication become easier for users while reducing exposure to phishing and credential reuse?',
    },
    {
      title: 'Focus',
      text: 'Security by design, WebAuthn ceremonies, relying-party boundaries, challenge validation, credential storage, and recovery UX.',
    },
  ],
};

export const itsmCase: AcademicCaseStudyContent = {
  id: 'itsm',
  number: '03',
  listTitle: 'IT service management',
  listCategory: 'Service operations',
  category: 'Service operations',
  type: 'Operating model',
  title: 'Turning framework guidance into workable service operations.',
  lead: 'A service-management concept focused on operational reliability, clear ownership, and repeatable service quality.',
  description:
    'The work defined ownership, escalation paths, service records, and improvement loops without treating the frameworks as rigid checklists. ITIL provided the broader practice perspective; FitSM helped reduce it to a lightweight and auditable minimum.',
  notes: [
    {
      title: 'Question',
      text: 'What is the smallest useful process model that still creates clear ownership and repeatable service quality?',
    },
    {
      title: 'Focus',
      text: 'Service operations, incident flow, service requests, roles, escalation paths, service-level thinking, and continual improvement.',
    },
  ],
};

export const academicCases = [streamingCase, passkeysCase, itsmCase];

export const academicHero: AcademicHeroContent = {
  kickerPrefix: '[ 01—03 ]',
  kicker: 'Selected academic work',
  titleBeforeAccent: 'Systems,',
  titleAccent: 'security',
  titleConnector: ' &',
  titleAfterAccent: 'service.',
  introduction:
    'Three selected projects show different application concerns: scalable data processing, authentication security, and reliable service operations.',
  facts: [
    { label: 'Languages', value: 'JavaScript, Java, Python & Prolog' },
    { label: 'Systems', value: 'Kafka, Flink, ClickHouse & WebAuthn' },
    { label: 'Focus', value: 'Scalability, security & operations' },
  ],
  scrollLabel: 'View projects',
  scrollHref: '#academic-list',
};

export const academicOverview: AcademicOverviewContent = {
  id: 'academic-list',
  titleId: 'academic-list-title',
  label: 'Selected university projects',
  title: 'Three perspectives on dependable digital systems.',
  titleLines: ['Three', 'perspectives', 'on dependable', 'digital', 'systems.'],
  items: academicCases.map(({ id, number, listTitle, listCategory }) => ({
    href: `#${id}`,
    number,
    title: listTitle,
    category: listCategory,
  })),
};

export const academicClosing: PageClosingContent = {
  kickerPrefix: '/ END',
  kicker: 'More work ahead',
  title: 'Curiosity is the common stack.',
  description: 'These projects connect technical implementation with the systems, standards, and people around it.',
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
  title: 'University Projects — Matthias Löhden',
  description:
    'Selected computer science work by Matthias Löhden across scalable event processing, FIDO2 authentication, service operations, and applied software design.',
};
