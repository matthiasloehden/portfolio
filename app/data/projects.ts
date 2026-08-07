import type { CaseStudyListItem, ProjectCaseStudyContent } from '@/types/content';

export const projectList: CaseStudyListItem[] = [
  { href: '#streaming', number: '01', title: 'Event-streaming analytics', category: 'Distributed systems' },
  { href: '#passkeys', number: '02', title: 'FIDO2 passkeys', category: 'Web security' },
  { href: '#itsm', number: '03', title: 'IT service management', category: 'ITIL & FitSM' },
];

export const streamingCase: ProjectCaseStudyContent = {
  id: 'streaming',
  number: '01',
  category: 'Distributed systems',
  type: 'Streaming prototype',
  title: 'From raw events to a live operational view.',
  lead: 'A proof of concept for processing continuous event data with a pipeline built around Apache Kafka, Apache Flink, ClickHouse, and Grafana.',
  description:
    'Kafka decoupled event producers from downstream consumers. Flink validated, enriched, and aggregated the stream before writing query-ready records to ClickHouse. Grafana turned that data into an operational dashboard for inspecting volume, trends, and processing health.',
  notes: [
    {
      title: 'Question',
      text: 'How can a modular pipeline turn an unbounded event stream into information that is useful immediately?',
    },
    {
      title: 'What I explored',
      text: 'Topic design, stream transformations, event-time thinking, column-oriented analytics, and observability.',
    },
  ],
};

export const passkeysCase: ProjectCaseStudyContent = {
  id: 'passkeys',
  number: '02',
  category: 'Web security',
  type: 'Authentication prototype',
  title: 'Passwordless sign-in with FIDO2 passkeys.',
  lead: 'A prototype examining passkey registration and authentication through WebAuthn and the FIDO2 model.',
  description:
    'The project replaced password knowledge with asymmetric cryptography. Registration associated a public key with the user, while authentication used a scoped challenge-response ceremony protected by the browser and authenticator.',
  notes: [
    {
      title: 'Question',
      text: 'How can authentication become easier for users while reducing exposure to phishing and credential reuse?',
    },
    {
      title: 'What I explored',
      text: 'WebAuthn ceremonies, relying-party boundaries, challenge validation, credential storage, and recovery UX.',
    },
  ],
};

export const itsmCase: ProjectCaseStudyContent = {
  id: 'itsm',
  number: '03',
  category: 'Service management',
  type: 'Process concept',
  title: 'Turning framework guidance into workable service operations.',
  lead: 'A service-management concept translating ITIL principles and FitSM requirements into a concise operating model for a fictional IT organization.',
  description:
    'The work defined ownership, escalation paths, service records, and improvement loops without treating the frameworks as rigid checklists. ITIL provided the broader practice perspective; FitSM helped reduce it to a lightweight and auditable minimum.',
  notes: [
    {
      title: 'Question',
      text: 'What is the smallest useful process model that still creates clear ownership and repeatable service quality?',
    },
    {
      title: 'What I explored',
      text: 'Incident flow, service requests, roles, escalation, service-level thinking, and continual improvement.',
    },
  ],
};
