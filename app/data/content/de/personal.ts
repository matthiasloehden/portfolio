import { createCaseStudyListItems } from '@/data/caseStudies';
import { site } from '@/data/site';
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
  listTitle: 'Open-Source-Beiträge',
  listCategory: 'Funktionen & Fehlerbehebungen',
  category: 'Open Source',
  type: 'Nützliche Änderungen, zurückgegeben',
  title: ['Werkzeuge', ['verbessern,', ' die ich'], 'selbst nutze.'],
  accent: [false, true, false],
  lead: 'Meine persönlichen Projekte beginnen oft mit einem praktischen Bedarf. Manchmal lässt sich dieser am besten direkt im Ursprungsprojekt lösen.',
  paragraphs: [
    'Ich trage Funktionen und Fehlerbehebungen zu Werkzeugen bei, die ich selbst verwende – von Smart-Home- und Fernsteuerungssoftware bis zur Verwaltung von Gameservern.',
    'Die Arbeit in bestehenden Codebasen hat mich gelehrt, unbekannte Systeme zu verstehen, unterschiedliche Ansätze zu vergleichen und Lösungen zu finden, die sich natürlich in das jeweilige Projekt einfügen.',
  ],
  tags: ['Open Source', 'Docker', 'Netzwerke', 'Debugging'],
};

export const homelabSection: PersonalSectionContent = {
  id: 'homelab',
  number: '02',
  listTitle: 'Selbst gehostete Systeme',
  listCategory: 'Docker & lokale KI',
  category: 'Homelab',
  type: 'Infrastruktur zu Hause',
  title: ['Software', 'betreiben', 'jenseits von localhost.'],
  accent: [false, true, false],
  lead: 'Auf meinem eigenen PC lerne ich, wie sich Anwendungen verhalten, wenn sie von Containern, Diensten und den verfügbaren Ressourcen abhängen.',
  paragraphs: [
    'Mit Docker betreibe und isoliere ich Dienste auf eigener Hardware, hoste Anwendungen und Gameserver-Workloads und experimentiere mit der lokalen Ausführung großer Sprachmodelle.',
    'Die eigenständige Verwaltung dieser Umgebung vermittelt mir praktische Erfahrung mit Deployment, Netzwerken, Speicher und Ressourcenbeschränkungen außerhalb einer Entwicklungsumgebung.',
  ],
  tags: ['Docker', 'Serverhosting', 'Lokale LLMs', 'Self-Hosting'],
};

export const learningSection: PersonalSectionContent = {
  id: 'learning',
  number: '03',
  listTitle: 'Von Transistoren zur Architektur',
  listCategory: 'Lernen von den Grundlagen aus',
  category: 'Lernen',
  type: 'Von Low Level bis Architektur',
  title: ['Von', ['Transistoren', ' zur'], ['Software', 'architektur.']],
  accent: [false, true, false],
  lead: 'Ich verstehe Technologie gerne von ihren untersten Ebenen an.',
  paragraphs: [
    'Um Softwareabstraktionen zu verstehen, lohnt sich oft ein Blick auf die darunterliegenden Schichten. Die Inhalte, denen ich folge, untersuchen diesen Stack anhand digitaler Logik, Computerarchitektur, Betriebssystemen, Algorithmen, Mathematik und Ingenieurwesen.',
    'Die Themen wechseln, doch die Frage bleibt dieselbe: Wie funktioniert das System tatsächlich? Der Weg von Transistoren und Logikgattern bis zu höheren Ebenen hilft mir, Entscheidungen in Softwaredesign und -architektur bewusster zu treffen.',
  ],
  tags: ['Informatik', 'Ingenieurwesen', 'Mathematik'],
};

export const hardwareSection: PersonalSectionContent = {
  id: 'hardware',
  number: '04',
  listTitle: 'Individuelle PC-Hardware',
  listCategory: 'Bau & Kühlung',
  category: 'Hardware',
  type: 'Gebaut, abgestimmt, verstanden',
  title: ['Auch die', 'Maschine zählt.'],
  accent: [true, false],
  lead: 'Mein Interesse an Technologie endet nicht bei Software. Ich beschäftige mich leidenschaftlich mit PC-Hardware und baue Systeme gerne selbst.',
  paragraphs: [
    'Mein PC nutzt einen individuellen Wasserkühlungskreislauf mit vier Radiatoren und zwei Pumpen. Planung und Aufbau verbinden das, was mich an Hardware besonders interessiert: Präzision, Leistung und das Verständnis dafür, wie jedes Teil das Gesamtsystem beeinflusst.',
    'Der PC-Bau ist für mich das physische Gegenstück zur Softwareentwicklung. Jede Komponente erfüllt eine Aufgabe, jede Einschränkung beeinflusst das System und kleine Details sind entscheidend.',
  ],
  tags: ['PC-Bau', 'Custom Loop', '4 Radiatoren', '2 Pumpen'],
};

export const personalSections = [openSourceSection, homelabSection, learningSection, hardwareSection];

export const personalHero: PersonalHeroContent = {
  kickerPrefix: '[ OFFEN / NEUGIERIG ]',
  kicker: 'Persönliche Projekte & Interessen',
  title: ['Entstanden aus', 'Neugier.'],
  accent: [false, true],
  introduction: [
    'Neben Beruf und Studium trage ich zu selbst genutzten Werkzeugen bei, betreibe Systeme zu Hause, lerne kontinuierlich weiter und baue PCs bis hin zum eigenen Kühlkreislauf.',
  ],
  facts: [
    { label: 'Code', value: 'Java, TypeScript & Open Source' },
    { label: 'Systeme', value: 'Docker, Hosting & lokale KI' },
    { label: 'Hardware', value: 'Selbst gebaut & wassergekühlt' },
  ],
  scrollLabel: 'Projekte & Interessen ansehen',
  scrollHref: '#personal-list',
};

export const personalOverview: PersonalOverviewContent = {
  id: 'personal-list',
  titleId: 'personal-list-title',
  label: 'Außerhalb von Kundenprojekten & Studium',
  title: ['Projekte,', ['Systeme', ' &'], 'technische Interessen.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(personalSections),
};

export const personalClosing: PageClosingContent = {
  kickerPrefix: '/ IMMER WEITERLERNEN',
  kicker: 'Neugier in der Praxis',
  title: ['Die besten', ['Projekte', ' beginnen'], 'mit dem Wunsch,', 'mehr zu verstehen.'],
  accent: [false, true, false, true],
  description:
    'Ob Pull Request, Container oder Kühlkreislauf: Ich lerne, indem ich das System verstehe und für einen konkreten Zweck zum Laufen bringe.',
  actions: [
    { label: 'Kontakt aufnehmen', href: `mailto:${site.email}` },
    {
      label: 'Quellcode ansehen',
      symbol: '→',
      href: site.sourceUrl,
      variant: 'text',
    },
  ],
};

export const contributions: OpenSourceContribution[] = [
  {
    status: 'Zusammengeführt',
    category: 'Fernsteuerungsbibliothek',
    title: 'Smart-Home-Steuerung',
    description: 'TCP-Unterstützung zur Steuerung von Netzwerkgeräten zu einer Fernsteuerungsbibliothek hinzugefügt.',
    href: 'https://github.com/andrewfraley/magic_mapper/pull/22',
  },
  {
    status: 'Offen',
    category: 'Gameserver-Panel',
    title: 'Gameserver bei Bedarf',
    description:
      'Den vorhandenen Proxy erweitert, damit gestoppte Server beim Verbindungsversuch eines Spielers gestartet werden.',
    href: 'https://github.com/discohaus/discopanel/pull/128',
  },
  {
    status: 'Behoben',
    category: 'Gameserver-Plugin',
    title: 'Plugin-Fehlerbehebung',
    description: 'Einen Fehler in einem Gameserver-Plugin analysiert und behoben.',
  },
];

export const learningGroups: LearningGroup[] = [
  {
    category: 'Informatik',
    sources: [
      {
        name: 'Ben Eater',
        focus: 'Elektrotechnik, digitale Logik und Computerarchitektur anhand von Breadboard-Computern',
        href: 'https://www.youtube.com/@BenEater',
      },
      {
        name: 'Core Dumped',
        focus: 'Betriebssysteme, Speicherverwaltung, Compiler und weitere Low-Level-Softwarekonzepte',
        href: 'https://www.youtube.com/@CoreDumpped',
      },
      {
        name: 'Sebastian Lague',
        focus: 'Algorithmen, Simulationen und Computergrafik anhand von Programmierprojekten',
        href: 'https://www.youtube.com/@SebastianLague',
      },
    ],
  },
  {
    category: 'Mathematik',
    sources: [
      {
        name: '3Blue1Brown',
        focus: 'Visuelle Zugänge zu den mathematischen Grundlagen von Algorithmen, Grafik und maschinellem Lernen',
        href: 'https://www.youtube.com/@3blue1brown',
      },
    ],
  },
  {
    category: 'Ingenieurwesen',
    sources: [
      {
        name: 'Branch Education',
        focus: 'Animierte Erklärungen dazu, wie Prozessoren, Speicher und andere Hardware Software ausführen',
        href: 'https://www.youtube.com/@BranchEducation',
      },
      {
        name: 'Practical Engineering',
        focus: 'Wie technische Einschränkungen, Abwägungen, Ausfallarten und Wartung Infrastruktur prägen',
        href: 'https://www.youtube.com/@PracticalEngineeringChannel',
      },
    ],
  },
];

export const contributionPanel: PersonalContributionPanelContent = {
  frame: { title: 'contributions.log', meta: '3 ausgewählte Änderungen' },
  ariaLabel: 'Ausgewählte Open-Source-Beiträge',
  items: contributions,
};

export const homelabPanel: PersonalHomelabPanelContent = {
  frame: { title: 'home.systems', meta: 'lokale Infrastruktur' },
  ariaLabel: 'Ein persönlicher Computer betreibt Docker-Workloads, Serverdienste und lokale große Sprachmodelle',
  host: { code: 'HOST / 01', title: 'Eigener PC', description: 'Lokale Hardware' },
  services: [
    { type: 'CONTAINER', title: 'Docker', description: 'Isolierte Workloads' },
    { type: 'DIENST', title: 'Hosting', description: 'Server-Workloads' },
    { type: 'MODELL', title: 'Lokales LLM', description: 'KI auf dem Gerät' },
  ],
  status: 'Selbst verwaltet',
  process: 'Bereitstellen → beobachten → verstehen → verbessern',
};

export const learningPanel: PersonalLearningPanelContent = {
  frame: { title: 'watch.list', meta: '6 Kanäle / 3 Themen' },
  ariaLabel: 'Bevorzugte YouTube-Bildungskanäle nach Themen gruppiert',
  groups: learningGroups,
};

export const coolingPanel: PersonalCoolingPanelContent = {
  frame: { title: 'cooling.loop', meta: '4 Radiatoren / 2 Pumpen' },
  ariaLabel: 'Individuelle PC-Wasserkühlung mit vier Radiatoren, zwei Pumpen sowie Wasserblöcken für CPU, RAM und GPU',
  status: { label: 'WASSERKÜHLUNG', title: 'Custom Loop' },
  facts: [
    { label: 'Radiatoren', value: '04×' },
    { label: 'Pumpen', value: '02×' },
    { label: 'Blöcke', value: 'CPU / RAM / GPU' },
  ],
};

export const personalMeta = {
  title: 'Persönliche Projekte & Interessen | Matthias Löhden',
  description:
    'Open-Source-Beiträge, selbst gehostete Systeme, lokale KI, bevorzugte Bildungskanäle und individuelle PC-Hardware von Matthias Löhden.',
};
