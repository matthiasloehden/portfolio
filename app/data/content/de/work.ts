import { createCaseStudyListItems } from '@/data/caseStudies';
import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';
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
  listTitle: 'Lernplattform',
  listCategory: 'Lernplattform',
  category: 'Unternehmenskunde',
  type: 'Lernen & Inhalte',
  title: ['Enterprise-', 'Lernplattform'],
  accent: [false, true],
  summary: 'Lernplattform mit individuellem CMS, rollenbasiertem Zugriff und mehreren Inhaltsformaten.',
  paragraphs: [
    'Unser Team bei TopRed Media war für die Entwicklung der Anwendung und die Pflege ihrer Inhalte verantwortlich. Das individuelle CMS vereinte Veranstaltungen, Videos, Podcasts und Artikel in einem System.',
    'Individuelle Zugriffsrechte steuerten, welche Bereiche der Plattform erreichbar waren. Berechtigungen bildeten damit neben der Veröffentlichung eine zentrale Produktfunktion.',
  ],
  facts: [
    { label: 'Zweck', value: 'Lernen und Wissen' },
    { label: 'Umsetzung', value: 'Individuelles CMS und Zugriffsrechte' },
    { label: 'Formate', value: 'Veranstaltungen, Videos, Podcasts, Artikel' },
  ],
};

export const retailCase: WorkCaseStudyContent = {
  id: 'retail-operations',
  number: '02',
  listTitle: 'Filialprozesse',
  listCategory: 'Filialverwaltung',
  category: 'Unternehmenskunde',
  type: 'Filialprozesse',
  title: [['Plattform', ' für'], 'Filialprozesse'],
  accent: [true, false],
  summary: 'Operative Plattform für Filialdaten, Aufgaben, Workflows und Excel-basierte Auswertungen.',
  paragraphs: [
    'Unser Team entwickelte eine zentrale Plattform zur Verwaltung von Filialdaten, operativen Aufgaben und Workflows. Jede Filiale verfügte über ein strukturiertes Profil mit Standortdaten, Grundrissen, Öffnungszeiten und Prozessen wie Standort- und Postleitzahlenänderungen.',
    'Filial-, Aufgaben- und weitere Plattformdaten konnten zur weiteren Analyse in Excel-Berichte exportiert werden. Der Prozess funktionierte auch in Gegenrichtung: Bearbeitete Tabellen konnten hochgeladen und zurück in die Datenbank synchronisiert werden.',
  ],
  facts: [
    { label: 'Zweck', value: 'Filial- und Aufgabenverwaltung' },
    { label: 'Daten', value: 'Standorte, Grundrisse, Zeiten, Aufgaben' },
    { label: 'Auswertung', value: 'Bidirektionale Excel-/Datenbanksynchronisation' },
  ],
};

export const signageCase: WorkCaseStudyContent = {
  id: 'signage-control',
  number: '03',
  listTitle: 'Signage-Steuerung',
  listCategory: 'Digital Signage',
  category: 'Unternehmenskunde',
  type: 'Digital Signage',
  title: [['Digital ', 'Signage'], 'Steuerungssystem'],
  accent: [false, false],
  summary: 'Python-Dienst und Electron-Oberfläche zur entfernten Displaysteuerung und Betriebsüberwachung.',
  paragraphs: [
    'Ich war für einen Python-Dienst mit Electron-Frontend verantwortlich, der auf Digital-Signage-Playern lief und angeschlossene Displays während der Werbewiedergabe steuerte.',
    'Der Dienst kommunizierte über RS-232 mit den Displays, übermittelte den Playerstatus an die zentrale Plattform und konnte über die Electron-Oberfläche aus der Ferne verwaltet werden.',
  ],
  facts: [
    { label: 'Meine Verantwortung', value: 'Python-Dienst und Electron-Oberfläche' },
    { label: 'Hardwareanbindung', value: 'Displaysteuerung über RS-232' },
    { label: 'Betrieb', value: 'Statusberichte und Fernsteuerung' },
  ],
};

export const clientCase: WorkCaseStudyContent = {
  id: 'client-platform',
  number: '04',
  listTitle: 'Kundenplattform',
  listCategory: 'CMS & Kommunikation',
  category: 'TopRed Media',
  type: 'Unternehmenseigenes Produkt',
  title: ['Konfigurierbare', 'Kundenplattform'],
  accent: [true, false],
  summary:
    'Wiederverwendbare Anwendungspakete, kombiniert zu kundenspezifischen Plattformen für Inhalte, Kommunikation und Zugriffskontrolle.',
  paragraphs: [
    'Projektübergreifend wurden wiederkehrende Funktionen als wiederverwendbare Pakete entwickelt, statt sie für jede Anwendung neu zu erstellen.',
    'Diese Pakete bildeten die Grundlage einer konfigurierbaren Plattform, die TopRed Media an individuelle Kundenanforderungen anpassen konnte.',
    'Funktionen wie CMS-Inhalte, Live-Chat, Veranstaltungen, Teams, Rollen und Berechtigungen ließen sich für jeden Kunden kombinieren und konfigurieren. So unterstützte die Plattform unterschiedliche Anwendungsfälle, vom Personal Training bis zur Kommunikation in Kindergärten.',
  ],
  facts: [
    { label: 'Architektur', value: 'Modulare Anwendungsgrundlage' },
    { label: 'Module', value: 'Inhalte, Chat, Veranstaltungen, Teams, Zugriff' },
    { label: 'Modell', value: 'Funktionen pro Kunde aktiviert' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[ 2019–2025 ]',
  kicker: 'Professionelle Softwareentwicklung',
  title: ['Produktive', 'Software.'],
  accent: [false, true],
  introduction: [
    'Bei der TopRed Media GmbH arbeitete ich über den gesamten Lebenszyklus produktiver Unternehmensanwendungen hinweg, von der initialen Entwicklung über Jahre kontinuierlicher Weiterentwicklung bis zur Wartung.',
  ],
  facts: [
    { label: 'Unternehmen', value: 'TopRed Media GmbH' },
    { label: 'Rolle', value: 'Auszubildender → Full-Stack-Entwickler' },
    { label: 'Systeme', value: 'Vier ausgewählte Projekte' },
  ],
  scrollLabel: 'Ausgewählte Arbeiten ansehen',
  scrollHref: '#work-list',
};

export const workOverview: WorkOverviewContent = {
  id: 'work-list',
  titleId: 'work-list-title',
  label: 'Ausgewählte berufliche Arbeiten',
  title: ['Vier ausgewählte', 'Produktiv-', 'systeme.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(workCases),
};

export const workContext: WorkContextContent = {
  kicker: 'Technologieübersicht',
  title: ['Zentrale', 'Technologien', 'in diesen', 'Projekten.'],
  accent: [false, true, false, false],
  stack: {
    Sprachen: ['PHP', 'SQL', 'JavaScript'],
    Backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    Frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Schwerpunkte',
  highlights: [
    'Backend-Entwicklung, wiederverwendbare Pakete und modularer Anwendungsentwurf',
    'Automatisierte Tests, CI/CD, Deployment und Serverkonfiguration',
    'Single-Page-Anwendungen mit Laravel, Vue und Inertia.js',
    'Caching und Auswertung komplexer Benutzerberechtigungen mit Redis',
    'Suche und Filterung großer Datenmengen mit Meilisearch',
    'Integration von Anwendungen mit externen Diensten und physischen Systemen',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Beruflicher Umfang',
  title: ['Über diese', 'Projekte.'],
  accent: [false, true],
  description:
    'Zusammen zeigen diese Projekte die Bandbreite der Systeme, an denen ich in sechs Jahren professioneller Softwareentwicklung gearbeitet habe, von Unternehmens-Webanwendungen bis zu Software, die mit physischer Hardware interagiert.',
  actions: [
    { label: 'Kontakt aufnehmen', href: `mailto:${site.email}` },
    { label: 'Studienprojekte ansehen', symbol: '→', to: APP_ROUTES.academic, variant: 'text' },
  ],
};

export const learningPanel: WorkLearningPanelContent = {
  frame: { title: 'content.library', meta: 'zugriffsgesteuerte Veröffentlichung' },
  navigation: ['Übersicht', 'Veranstaltungen', 'Medien', 'Artikel'],
  featured: { title: 'Lernveranstaltung', description: 'Anmeldung · Abzeichen · Feedback' },
  formats: [
    { symbol: '▶', title: 'Video', description: 'Auf Abruf' },
    { symbol: '◉', title: 'Podcast', description: 'Audioserie' },
    { symbol: '¶', title: 'Artikel', description: 'Redaktionell' },
  ],
  status: 'Rollenbasierte Inhaltsauslieferung',
};

export const retailPanel: WorkRetailPanelContent = {
  frame: { title: 'shop.record', meta: 'zentrale operative Datenquelle' },
  code: 'FILIALE / 042',
  title: 'Standortprofil',
  status: 'Datensatz aktiv',
  fields: [
    { label: 'Öffnungszeiten', value: 'Konfiguriert' },
    { label: 'Grundriss', value: 'Verfügbar' },
    { label: 'Postdaten', value: 'Verwaltet' },
    { label: 'Aufgaben', value: 'Zugewiesen' },
  ],
  sync: {
    label: 'Excel-Tabellen konnten Daten exportieren und hochgeladene Änderungen synchronisieren',
    source: 'Datenbank',
    target: '.XLSX',
  },
};

export const signagePanel: WorkSignagePanelContent = {
  frame: { title: 'display.control', meta: 'Player online' },
  remote: { label: 'REMOTE', title: 'Administration' },
  player: [
    { label: 'STEUERUNG', title: 'Electron' },
    { label: 'DIENST', title: 'Python' },
  ],
  outputs: [
    { connection: 'RS-232 →', title: 'Display', description: 'Wiedergabesteuerung' },
    { connection: 'Status →', title: 'Betrieb', description: 'Auswertung' },
  ],
};

export const clientPanel: WorkClientPanelContent = {
  frame: { title: 'platform.modules', meta: 'pro Kunde konfiguriert' },
  modules: [
    { number: '01', title: 'CMS', description: 'Inhalte veröffentlichen' },
    { number: '02', title: 'Live-Chat', description: 'In Verbindung bleiben' },
    { number: '03', title: 'Veranstaltungen', description: 'Aktivitäten koordinieren' },
    { number: '04', title: 'Teams', description: 'Gruppen verwalten' },
  ],
  audiences: ['Personal Training', 'Kindergarten'],
};

export const workMeta = {
  title: 'Berufliche Projekte | Matthias Löhden',
  description:
    'Berufliche Softwareprojekte von Matthias Löhden bei der TopRed Media GmbH, darunter Lern-, Filialverwaltungs-, Digital-Signage- und Kommunikationsplattformen.',
};
