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
  listTitle: "Analyse de flux d'événements",
  listCategory: 'Évolutivité et Big Data',
  category: 'Évolutivité et Big Data',
  type: 'Architecture de diffusion en continu',
  title: [['Depuis ', 'événements bruts'], 'à un live', ['opérationnel', ' voir.']],
  accent: [false, false, true],
  lead: "Un prototype de traitement d'événements distribué pour l'ingestion, la transformation et l'analyse de données en streaming en temps réel.",
  description:
    "Kafka a découplé les producteurs d'événements des consommateurs en aval. Flink a validé, enrichi et agrégé le flux avant d'écrire des enregistrements prêts à être interrogés sur ClickHouse. Grafana a transformé ces données en un tableau de bord opérationnel pour inspecter le volume, les tendances et l'état du traitement.",
  notes: [
    {
      title: "Question d'ingénierie",
      text: 'Comment un pipeline modulaire peut-il transformer un flux d’événements illimité en informations immédiatement utiles ?',
    },
    {
      title: 'Se concentrer',
      text: 'Évolutivité, transformations de flux, réflexion événementielle, analyses orientées colonnes et observabilité.',
    },
  ],
};

export const passkeysCase: AcademicCaseStudyContent = {
  id: 'passkeys',
  number: '03',
  listTitle: 'Mots-clés FIDO2',
  listCategory: 'Conception de sécurité',
  category: 'Conception de sécurité',
  type: "Architecture d'authentification",
  title: [
    ['Sans mot de passe', ' se connecter'],
    ['avec ', 'Mots-clés FIDO2.'],
  ],
  accent: [true, false],
  lead: "Une preuve de concept explorant la conception sécurisée de systèmes au moyen d'un système d'authentification sans mot de passe basé sur FIDO2.",
  description:
    "La sécurité a été considérée comme une contrainte de conception centrale, déterminant les flux d'authentification, la gestion des identifiants, les limites de confiance et les opérations sensibles. L'authentification reposait sur des identifiants à clé publique et des échanges défi-réponse à portée limitée.",
  notes: [
    {
      title: "Question d'ingénierie",
      text: 'Comment l’authentification peut-elle devenir plus facile pour les utilisateurs tout en réduisant l’exposition au phishing et à la réutilisation des informations d’identification ?',
    },
    {
      title: 'Se concentrer',
      text: "Sécurité dès la conception, cérémonies WebAuthn, limites des parties de confiance, validation des défis, stockage des informations d'identification et UX de récupération.",
    },
  ],
};

export const softwareEngineeringCase: AcademicCaseStudyContent = {
  id: 'software-engineering',
  number: '01',
  listTitle: 'Projet de génie logiciel',
  listCategory: 'Cycle de vie et qualité',
  category: 'Génie logiciel',
  type: "Projet d'équipe",
  title: [['Depuis ', 'exigences'], 'à un', ['testé', ' libérer.']],
  accent: [false, false, true],
  lead: 'Un projet de groupe terminé réunissant les méthodes des cours de génie logiciel antérieurs tout au long du cycle de vie complet du développement.',
  description:
    "Notre équipe a développé une application web pour suivre le temps d'apprentissage, en organisant le travail à l'aide de tickets et de jalons. Nous avons collaboré sur les exigences, les spécifications, la conception, la mise en œuvre, les tests et la documentation. Ma responsabilité principale portait sur l'architecture et la gestion de la qualité.",
  notes: [
    {
      title: "Question d'ingénierie",
      text: 'Comment une équipe peut-elle appliquer des méthodes d’ingénierie logicielle pour fournir une application traçable et de qualité garantie tout au long de son cycle de vie ?',
    },
    {
      title: 'Se concentrer',
      text: 'Cycle de vie des logiciels, architecture, gestion de la qualité, tests, documentation et livraison itérative.',
    },
  ],
};

export const itsmCase: AcademicCaseStudyContent = {
  id: 'itsm',
  number: '04',
  listTitle: 'Gestion des services informatiques',
  listCategory: 'Opérations de service',
  category: 'Opérations de service',
  type: 'Modèle opérationnel',
  title: ['Concevoir un', ['léger', ' Prestation informatique'], 'modèle de gestion.'],
  accent: [false, true, false],
  lead: "Un concept de gestion de services basé sur ITIL et FitSM, définissant la propriété, les flux d'incidents et de demandes, les chemins d'escalade et l'amélioration continue.",
  description:
    'Le modèle a traduit des orientations plus larges en une approche opérationnelle légère et vérifiable. ITIL a fourni le contexte de pratique, tandis que FitSM a aidé à définir un minimum pratique pour une qualité de service reproductible.',
  notes: [
    {
      title: "Question d'ingénierie",
      text: 'Quel est le plus petit modèle de processus utile qui crée encore une appropriation claire et une qualité de service reproductible ?',
    },
    {
      title: 'Se concentrer',
      text: "Opérations de service, flux d'incidents, demandes de service, rôles, voies d'escalade, réflexion au niveau du service et amélioration continue.",
    },
  ],
};

export const academicCases = [softwareEngineeringCase, streamingCase, passkeysCase, itsmCase];

export const academicHero: AcademicHeroContent = {
  kickerPrefix: "[ L'INFORMATIQUE ]",
  kicker: 'Travaux académiques sélectionnés',
  title: ['Logiciel,', ['systèmes', ' &'], 'sécurité.'],
  accent: [false, true, false],
  introduction: [
    "Quatre projets sélectionnés couvrent l'ingénierie logicielle tout au long du cycle de vie, le traitement distribué des données, l'authentification et la sécurité des systèmes, ainsi que les opérations de services fiables.",
  ],
  facts: [
    { label: 'Cours', value: 'JavaScript, Java, Python, Prologue et R' },
    { label: 'Systèmes et outils', value: 'Kafka, Flink, ClickHouse, Grafana et WebAuthn' },
    { label: 'Se concentrer', value: 'Génie logiciel, systèmes et sécurité' },
  ],
  scrollLabel: 'Voir les projets',
  scrollHref: '#academic-list',
};

export const academicOverview: AcademicOverviewContent = {
  id: 'academic-list',
  titleId: 'academic-list-title',
  label: 'Projets universitaires sélectionnés',
  title: ['Quatre sélectionnés', 'université', 'projets.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(academicCases),
};

export const academicClosing: PageClosingContent = {
  kickerPrefix: '/',
  kicker: 'Portée académique',
  title: [['Ordinateur ', 'science'], 'au-delà du', ['application ', 'couche.']],
  accent: [false, false, false],
  description:
    "Ces projets relient mon expérience professionnelle à des travaux universitaires tout au long du cycle de vie complet des logiciels, du traitement distribué des données, de l'authentification et de la sécurité des systèmes, ainsi que des opérations de services informatiques.",
  actions: [
    { label: 'Démarrer une conversation', href: `mailto:${site.email}` },
    { label: 'Voir les projets personnels', symbol: '→', to: APP_ROUTES.personal, variant: 'text' },
  ],
};

export const streamingPanel: AcademicStreamingPanelContent = {
  frame: { title: 'pipeline.flow', meta: 'événement → aperçu' },
  ariaLabel: 'Les données circulent des producteurs via Kafka et Flink vers ClickHouse et Grafana',
  nodes: [
    { name: 'Producers', description: "Source de l'événement" },
    { name: 'Kafka', description: 'Transport' },
    { name: 'Flink', description: 'Traitement' },
    { name: 'ClickHouse', description: 'Analytique' },
    { name: 'Grafana', description: 'Visibilité' },
  ],
};

export const engineeringPanel: AcademicEngineeringPanelContent = {
  frame: { title: 'lernzeit.manager', meta: "planification d'études personnelles" },
  ariaLabel: "Aperçu de l'application Web de gestion du temps d'apprentissage terminée",
  navigation: [
    'Aperçu',
    "Objectifs d'apprentissage",
    'Planification',
    'Temps de concentration',
    'Analytique',
    'Rappels',
  ],
  metrics: [
    { label: 'Objectifs actifs', value: '2' },
    { label: 'Forfait mensuel', value: '38 heures' },
    { label: 'Temps de concentration', value: '8,1 heures' },
  ],
  goals: [
    { title: 'Modélisation des données', status: 'En cours' },
    { title: 'Algèbre linéaire', status: 'Prévu' },
  ],
  schedule: [
    { date: '26.07', title: 'Exercices de normalisation' },
    { date: '29.07', title: "Exercices d'espace vectoriel" },
  ],
  facts: [
    { label: 'Projet', value: 'Travail de groupe collaboratif' },
    { label: 'Responsabilité principale', value: 'Architecture et gestion de la qualité' },
    { label: 'Livraison', value: 'Billets, jalons et avis' },
  ],
  demo: {
    label: 'Voir la démo en direct',
    href: 'https://struperto.github.io/isef01-lernzeit-manager/',
  },
  status: 'Cycle de vie complet terminé',
};

export const authenticationPanel: AcademicAuthenticationPanelContent = {
  frame: { title: 'authentification.ceremony', meta: 'flux de clé publique' },
  steps: [
    { number: '01', title: 'Demande', description: 'Le serveur crée un nouveau défi.' },
    {
      number: '02',
      title: 'Vérifier localement',
      description: "L'utilisateur déverrouille un authentificateur lié à l'appareil.",
    },
    {
      number: '03',
      title: 'Signe',
      description: "La clé privée signe le défi sans quitter l'authentificateur.",
    },
    { number: '04', title: 'Valider', description: "Le serveur vérifie l'origine, le défi et la signature." },
  ],
  status: 'Aucun mot de passe partagé transmis',
};

export const servicePanel: AcademicServicePanelContent = {
  frame: { title: 'service.modèle', meta: 'cartographie du cadre' },
  stages: [
    { number: '01', title: 'Capturer', description: 'Enregistrer et accuser réception' },
    { number: '02', title: 'Classer', description: 'Prioriser et attribuer' },
    { number: '03', title: 'Résoudre', description: 'Restaurer ou exécuter' },
    { number: '04', title: 'Apprendre', description: 'Réviser et améliorer' },
  ],
  frameworks: [
    { name: 'ITIL', description: 'Practices, value, and continual improvement' },
    { name: 'FitSM', description: 'Lightweight requirements and clear accountability' },
  ],
};

export const academicMeta = {
  title: 'Projets universitaires | Matthias Löhden',
  description:
    "Travaux informatiques sélectionnés de Matthias Löhden sur le traitement d'événements évolutifs, l'authentification FIDO2, l'ingénierie logicielle appliquée et les opérations de service.",
};
