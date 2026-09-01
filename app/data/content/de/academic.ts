import { createCaseStudyListItems } from '@/data/caseStudies';
import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';
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
  listTitle: 'Event-Streaming-Analyse',
  listCategory: 'Skalierbarkeit & Big Data',
  category: 'Skalierbarkeit & Big Data',
  type: 'Streaming-Architektur',
  title: [['Von ', 'Rohereignissen'], 'zur operativen', ['Echtzeit-', 'ansicht.']],
  accent: [false, false, true],
  lead: 'Ein verteilter Prototyp zur Verarbeitung, Transformation und Analyse kontinuierlicher Ereignisdaten in Echtzeit.',
  description:
    'Kafka entkoppelte die Ereignisproduzenten von den nachgelagerten Konsumenten. Flink validierte, ergänzte und aggregierte den Datenstrom, bevor abfragebereite Datensätze in ClickHouse geschrieben wurden. Grafana stellte Volumen, Trends und Verarbeitungszustand in einem operativen Dashboard dar.',
  notes: [
    {
      title: 'Technische Fragestellung',
      text: 'Wie kann eine modulare Pipeline einen unbegrenzten Ereignisstrom in unmittelbar nutzbare Informationen verwandeln?',
    },
    {
      title: 'Schwerpunkt',
      text: 'Skalierbarkeit, Stream-Transformationen, Ereigniszeit, spaltenorientierte Analysen und Observability.',
    },
  ],
};

export const passkeysCase: AcademicCaseStudyContent = {
  id: 'passkeys',
  number: '03',
  listTitle: 'FIDO2-Passkeys',
  listCategory: 'Security Design',
  category: 'Security Design',
  type: 'Authentifizierungsarchitektur',
  title: [
    ['Passwortlose', ' Anmeldung'],
    ['mit ', 'FIDO2-Passkeys.'],
  ],
  accent: [true, false],
  lead: 'Ein Proof of Concept für sicheren Systementwurf und moderne Authentifizierung auf Basis einer passwortlosen Anmeldung mit FIDO2.',
  description:
    'Sicherheit wurde nicht als zusätzliche Schicht behandelt, sondern die Architektur konsequent um Authentifizierungsabläufe, Anmeldedaten, Vertrauensgrenzen und sensible Operationen aufgebaut. Bei der Registrierung wurde dem Benutzer ein öffentlicher Schlüssel zugeordnet; die Authentifizierung nutzte ein begrenztes Challenge-Response-Verfahren, das durch Browser und Authenticator geschützt wurde.',
  notes: [
    {
      title: 'Technische Fragestellung',
      text: 'Wie kann Authentifizierung für Benutzer einfacher werden und zugleich die Gefährdung durch Phishing und wiederverwendete Zugangsdaten verringern?',
    },
    {
      title: 'Schwerpunkt',
      text: 'Security by Design, WebAuthn-Abläufe, Relying-Party-Grenzen, Challenge-Validierung, Speicherung von Anmeldedaten und Wiederherstellungs-UX.',
    },
  ],
};

export const softwareEngineeringCase: AcademicCaseStudyContent = {
  id: 'software-engineering',
  number: '01',
  listTitle: 'Software-Engineering-Projekt',
  listCategory: 'Lebenszyklus & Qualität',
  category: 'Software Engineering',
  type: 'Teamprojekt',
  title: [['Von ', 'Anforderungen'], 'zu einem', ['getesteten', ' Release.']],
  accent: [false, false, true],
  lead: 'Ein abgeschlossenes Gruppenprojekt, das Methoden aus vorherigen Software-Engineering-Modulen über den gesamten Entwicklungslebenszyklus zusammenführte.',
  description:
    'Unser Team entwickelte eine TypeScript-Webanwendung zur Planung und Erfassung von Lernzeiten und organisierte die Arbeit über Tickets und Meilensteine. Gemeinsam bearbeiteten wir Anforderungsanalyse, Spezifikation, Entwurf, Implementierung, Tests und Dokumentation. Ich wirkte in allen Phasen mit und trug die Hauptverantwortung für Architektur und Qualitätsmanagement.',
  notes: [
    {
      title: 'Technische Fragestellung',
      text: 'Wie kann ein Team Software-Engineering-Methoden einsetzen, um über den gesamten Lebenszyklus eine nachvollziehbare und qualitätsgesicherte Anwendung auszuliefern?',
    },
    {
      title: 'Schwerpunkt',
      text: 'Softwarelebenszyklus, Architektur, Qualitätsmanagement, Tests, Dokumentation und iterative Auslieferung.',
    },
  ],
};

export const itsmCase: AcademicCaseStudyContent = {
  id: 'itsm',
  number: '04',
  listTitle: 'IT-Service-Management',
  listCategory: 'Servicebetrieb',
  category: 'Servicebetrieb',
  type: 'Betriebsmodell',
  title: ['Entwurf eines', ['schlanken', ' IT-Service-'], 'Managementmodells.'],
  accent: [false, true, false],
  lead: 'Ein Service-Management-Konzept auf Grundlage von ITIL und FitSM mit klaren Verantwortlichkeiten, Incident- und Request-Abläufen, Eskalationswegen und kontinuierlicher Verbesserung.',
  description:
    'Das Modell überführte umfassende Rahmenwerksempfehlungen in einen schlanken und prüfbaren Betriebsansatz. ITIL lieferte den fachlichen Kontext, während FitSM dabei half, ein praxistaugliches Minimum für wiederholbare Servicequalität zu definieren.',
  notes: [
    {
      title: 'Technische Fragestellung',
      text: 'Wie sieht das kleinste sinnvolle Prozessmodell aus, das dennoch klare Verantwortung und wiederholbare Servicequalität ermöglicht?',
    },
    {
      title: 'Schwerpunkt',
      text: 'Servicebetrieb, Incident-Ablauf, Serviceanfragen, Rollen, Eskalationswege, Service-Level-Denken und kontinuierliche Verbesserung.',
    },
  ],
};

export const academicCases = [softwareEngineeringCase, streamingCase, passkeysCase, itsmCase];

export const academicHero: AcademicHeroContent = {
  kickerPrefix: '[ INFORMATIK ]',
  kicker: 'Ausgewählte Studienprojekte',
  title: ['Software,', ['Systeme', ' &'], 'Sicherheit.'],
  accent: [false, true, false],
  introduction: [
    'Vier ausgewählte Projekte behandeln Software Engineering über den gesamten Lebenszyklus, verteilte Datenverarbeitung, Authentifizierung und Systemsicherheit sowie zuverlässigen Servicebetrieb.',
  ],
  facts: [
    { label: 'Studieninhalte', value: 'JavaScript, Java, Python, Prolog & R' },
    { label: 'Systeme & Werkzeuge', value: 'Kafka, Flink, ClickHouse, Grafana & WebAuthn' },
    { label: 'Schwerpunkt', value: 'Software Engineering, Systeme & Sicherheit' },
  ],
  scrollLabel: 'Projekte ansehen',
  scrollHref: '#academic-list',
};

export const academicOverview: AcademicOverviewContent = {
  id: 'academic-list',
  titleId: 'academic-list-title',
  label: 'Ausgewählte Hochschulprojekte',
  title: ['Vier ausgewählte', 'Studien-', 'projekte.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(academicCases),
};

export const academicClosing: PageClosingContent = {
  kickerPrefix: '/',
  kicker: 'Akademischer Umfang',
  title: ['Informatik', 'jenseits der', ['Anwendungs-', 'schicht.']],
  accent: [false, false, false],
  description:
    'Diese Projekte verbinden meine Berufserfahrung mit akademischer Arbeit über den gesamten Softwarelebenszyklus, verteilte Datenverarbeitung, Authentifizierung und Systemsicherheit sowie IT-Servicebetrieb hinweg.',
  actions: [
    { label: 'Kontakt aufnehmen', href: `mailto:${site.email}` },
    { label: 'Persönliche Projekte ansehen', symbol: '→', to: APP_ROUTES.personal, variant: 'text' },
  ],
};

export const streamingPanel: AcademicStreamingPanelContent = {
  frame: { title: 'pipeline.flow', meta: 'Ereignis → Erkenntnis' },
  ariaLabel: 'Daten fließen von Produzenten über Kafka und Flink in ClickHouse und Grafana',
  nodes: [
    { name: 'Produzenten', description: 'Ereignisquelle' },
    { name: 'Kafka', description: 'Transport' },
    { name: 'Flink', description: 'Verarbeitung' },
    { name: 'ClickHouse', description: 'Analyse' },
    { name: 'Grafana', description: 'Visualisierung' },
  ],
};

export const engineeringPanel: AcademicEngineeringPanelContent = {
  frame: { title: 'lernzeit.manager', meta: 'persönliche Studienplanung' },
  ariaLabel: 'Vorschau der fertiggestellten Webanwendung zur Lernzeitverwaltung',
  navigation: ['Übersicht', 'Lernziele', 'Planung', 'Fokuszeit', 'Analyse', 'Erinnerungen'],
  metrics: [
    { label: 'Aktive Ziele', value: '2' },
    { label: 'Monatsplan', value: '38 h' },
    { label: 'Fokuszeit', value: '8,1 h' },
  ],
  goals: [
    { title: 'Datenmodellierung', status: 'In Arbeit' },
    { title: 'Lineare Algebra', status: 'Geplant' },
  ],
  schedule: [
    { date: '26.07.', title: 'Übungen zur Normalisierung' },
    { date: '29.07.', title: 'Übungen zu Vektorräumen' },
  ],
  facts: [
    { label: 'Projekt', value: 'Gemeinsame Gruppenarbeit' },
    { label: 'Hauptverantwortung', value: 'Architektur & Qualitätsmanagement' },
    { label: 'Umsetzung', value: 'Tickets, Meilensteine & Reviews' },
  ],
  demo: {
    label: 'Live-Demo ansehen',
    href: 'https://struperto.github.io/isef01-lernzeit-manager/',
  },
  status: 'Gesamter Lebenszyklus abgeschlossen',
};

export const authenticationPanel: AcademicAuthenticationPanelContent = {
  frame: { title: 'authentication.ceremony', meta: 'Public-Key-Ablauf' },
  steps: [
    { number: '01', title: 'Anfordern', description: 'Der Server erstellt eine neue Challenge.' },
    {
      number: '02',
      title: 'Lokal prüfen',
      description: 'Der Benutzer entsperrt einen gerätegebundenen Authenticator.',
    },
    {
      number: '03',
      title: 'Signieren',
      description: 'Der private Schlüssel signiert die Challenge, ohne den Authenticator zu verlassen.',
    },
    { number: '04', title: 'Validieren', description: 'Der Server prüft Origin, Challenge und Signatur.' },
  ],
  status: 'Kein gemeinsames Passwort übertragen',
};

export const servicePanel: AcademicServicePanelContent = {
  frame: { title: 'service.model', meta: 'Rahmenwerkzuordnung' },
  stages: [
    { number: '01', title: 'Erfassen', description: 'Aufnehmen und bestätigen' },
    { number: '02', title: 'Klassifizieren', description: 'Priorisieren und zuweisen' },
    { number: '03', title: 'Lösen', description: 'Wiederherstellen oder erfüllen' },
    { number: '04', title: 'Lernen', description: 'Auswerten und verbessern' },
  ],
  frameworks: [
    { name: 'ITIL', description: 'Praktiken, Wertschöpfung und kontinuierliche Verbesserung' },
    { name: 'FitSM', description: 'Schlanke Anforderungen und klare Verantwortlichkeit' },
  ],
};

export const academicMeta = {
  title: 'Studienprojekte | Matthias Löhden',
  description:
    'Ausgewählte Informatikprojekte von Matthias Löhden zu skalierbarer Ereignisverarbeitung, FIDO2-Authentifizierung, angewandtem Software Engineering und Servicebetrieb.',
};
