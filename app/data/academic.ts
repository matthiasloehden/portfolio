import type { CaseStudyListItem, AcademicCaseStudyContent } from '@/types/content';

export const academicList: CaseStudyListItem[] = [
  { href: '#streaming', number: '01', title: 'Event-streaming analytics', category: 'Scalability & big data' },
  { href: '#passkeys', number: '02', title: 'FIDO2 passkeys', category: 'Security design' },
  { href: '#itsm', number: '03', title: 'IT service management', category: 'Service operations' },
];

export const streamingCase: AcademicCaseStudyContent = {
  id: 'streaming',
  number: '01',
  category: 'Scalability & big data',
  type: 'Streaming architecture',
  title: 'From raw events to a live operational view.',
  lead: 'A proof of concept focused on scalable event processing and big-data analytics with Apache Kafka, Apache Flink, ClickHouse, and Grafana.',
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
  category: 'Security design',
  type: 'Authentication architecture',
  title: 'Passwordless sign-in with FIDO2 passkeys.',
  lead: 'A prototype focused on designing a more secure authentication system with FIDO2 and WebAuthn from the beginning.',
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
