import { site } from '@/data/site';
import { createCaseStudyListItems } from '@/data/caseStudies';
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
  listTitle: 'Contributions open source',
  listCategory: 'Fonctionnalités et correctifs',
  category: 'Source ouverte',
  type: 'Modifications utiles, partagées',
  title: ['Améliorer le', ['outils', " J'utilise déjà."]],
  accent: [false, true],
  lead: 'Mes projets personnels commencent souvent par un besoin pratique. Parfois, le meilleur endroit pour résoudre ce problème est en amont.',
  paragraphs: [
    "J'apporte des fonctionnalités et des correctifs aux outils que j'utilise réellement, des logiciels de maison intelligente et de contrôle à distance à la gestion des serveurs de jeux.",
    "Travailler avec des bases de code existantes m'a appris à comprendre des systèmes inconnus, à comparer différentes approches et à trouver des solutions qui s'intègrent naturellement dans le projet existant.",
  ],
  tags: ['Open source', 'Docker', 'Networking', 'Debugging'],
};

export const homelabSection: PersonalSectionContent = {
  id: 'homelab',
  number: '02',
  listTitle: 'Systèmes auto-hébergés',
  listCategory: 'Docker et IA locale',
  category: 'Laboratoire à domicile',
  type: 'Infrastructures à la maison',
  title: ["En cours d'exécution", 'logiciel', 'au-delà de localhost.'],
  accent: [false, true, false],
  lead: "J'utilise mon propre PC pour découvrir comment les applications se comportent lorsqu'elles dépendent de conteneurs, de services et des ressources qui les entourent.",
  paragraphs: [
    "J'utilise Docker pour exécuter et isoler des services sur mon propre matériel, héberger des applications et des charges de travail de serveur de jeux, et expérimenter l'exécution de grands modèles de langage localement.",
    "La gestion moi-même de l'environnement me donne une expérience pratique des contraintes de déploiement, de mise en réseau, de stockage et de ressources en dehors d'une machine de développement.",
  ],
  tags: ['Docker', 'Server hosting', 'Local LLMs', 'Self-hosting'],
};

export const learningSection: PersonalSectionContent = {
  id: 'learning',
  number: '03',
  listTitle: "Des transistors à l'architecture",
  listCategory: 'Apprendre des premiers principes',
  category: 'Apprentissage',
  type: 'Du bas niveau à l’architecture',
  title: ['Depuis', ['transistor', ' à'], ['logiciel ', 'architecture.']],
  accent: [false, true, false],
  lead: "J'aime comprendre la technologie depuis les niveaux les plus bas.",
  paragraphs: [
    "Comprendre les abstractions logicielles nécessite souvent d’examiner les couches situées en dessous. Les créateurs que je suis explorent cette pile à travers la logique numérique, l'architecture informatique, les systèmes d'exploitation, les algorithmes, les mathématiques et l'ingénierie.",
    "Les sujets varient, mais la question reste la même : comment fonctionne réellement le système ? Le suivre depuis les transistors et les portes logiques vers le haut m'aide à prendre des décisions plus délibérées en matière de conception et d'architecture logicielle.",
  ],
  tags: ['Computer science', 'Engineering', 'Mathematics'],
};

export const hardwareSection: PersonalSectionContent = {
  id: 'hardware',
  number: '04',
  listTitle: 'Matériel PC personnalisé',
  listCategory: 'Bâtiment et refroidissement',
  category: 'Matériel',
  type: 'Construit, réglé, compris',
  title: ['La machine', 'compte aussi.'],
  accent: [true, false],
  lead: "Mon intérêt pour la technologie ne s'arrête pas aux logiciels. Je suis passionné par le matériel PC et j'aime construire moi-même des systèmes.",
  paragraphs: [
    "Mon PC utilise une boucle de refroidissement par eau personnalisée avec quatre radiateurs et deux pompes. La planification et la construction rassemblent ce que j'apprécie le plus dans le matériel : la précision, les performances et la compréhension de la manière dont chaque pièce affecte l'ensemble.",
    'Construire des PC me donne une contrepartie physique au travail logiciel. Chaque composant a un rôle, chaque contrainte affecte le système et les petits détails comptent.',
  ],
  tags: ['PC building', 'Custom loop', '4 radiators', '2 pumps'],
};

export const personalSections = [openSourceSection, homelabSection, learningSection, hardwareSection];

export const personalHero: PersonalHeroContent = {
  kickerPrefix: '[ OUVERT / CURIEUX ]',
  kicker: 'Projets et intérêts personnels',
  title: ['Construit à partir de', 'curiosité.'],
  accent: [false, true],
  introduction: [
    "Au-delà du travail professionnel et universitaire, je contribue aux outils que j'utilise, je fais fonctionner des systèmes à la maison, je continue à apprendre et je construis des PC jusqu'à la boucle de refroidissement.",
  ],
  facts: [
    { label: 'Code', value: 'Java, TypeScript et open source' },
    { label: 'Systèmes', value: 'Docker, hébergement et IA locale' },
    { label: 'Matériel', value: 'Construit sur mesure et refroidi par eau' },
  ],
  scrollLabel: 'Explorez les projets et les intérêts',
  scrollHref: '#personal-list',
};

export const personalOverview: PersonalOverviewContent = {
  id: 'personal-list',
  titleId: 'personal-list-title',
  label: "Travail externe auprès des clients et de l'université",
  title: ['Projets,', ['systèmes', ' &'], 'intérêts techniques.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(personalSections),
};

export const personalClosing: PageClosingContent = {
  kickerPrefix: '/ ALWAYS LEARNING',
  kicker: 'La curiosité en pratique',
  title: ['Le meilleur', ['projets', ' commencer'], 'avec vouloir', 'pour en savoir plus.'],
  accent: [false, true, false, true],
  description:
    "Qu'il s'agisse d'une pull request, d'un conteneur ou d'une boucle de refroidissement, j'apprends en comprenant le système et en le faisant fonctionner dans un but réel.",
  actions: [
    { label: 'Démarrer une conversation', href: `mailto:${site.email}` },
    {
      label: 'Voir la source',
      symbol: '→',
      href: site.sourceUrl,
      variant: 'text',
    },
  ],
};

export const contributions: OpenSourceContribution[] = [
  {
    status: 'Fusionné',
    category: 'Bibliothèque télécommandée',
    title: 'Contrôle de la maison intelligente',
    description:
      'Ajout du support TCP à une bibliothèque de contrôle à distance pour contrôler les périphériques réseau.',
    href: 'https://github.com/andrewfraley/magic_mapper/pull/22',
  },
  {
    status: 'Ouvrir',
    category: 'Panneau du serveur de jeu',
    title: 'Serveurs de jeux à la demande',
    description: 'Extension du proxy existant pour réveiller les serveurs arrêtés lors de la connexion du joueur.',
    href: 'https://github.com/discohaus/discopanel/pull/128',
  },
  {
    status: 'Fixé',
    category: 'Plugin de serveur de jeu',
    title: "Correction d'un bug du plugin",
    description: "Localisation et correction d'un bug dans un plugin de serveur de jeu.",
  },
];

export const learningGroups: LearningGroup[] = [
  {
    category: "L'informatique",
    sources: [
      {
        name: 'Ben Eater',
        focus: 'Génie électrique, logique numérique et architecture informatique via des ordinateurs de type maquette',
        href: 'https://www.youtube.com/@BenEater',
      },
      {
        name: 'Core Dumped',
        focus:
          "Systèmes d'exploitation, gestion de la mémoire, compilateurs et autres concepts logiciels de bas niveau",
        href: 'https://www.youtube.com/@CoreDumpped',
      },
      {
        name: 'Sebastian Lague',
        focus: 'Algorithmes, simulations et infographie explorés à travers des projets de programmation',
        href: 'https://www.youtube.com/@SebastianLague',
      },
    ],
  },
  {
    category: 'Mathématiques',
    sources: [
      {
        name: '3Blue1Brown',
        focus:
          "Approches visuelles des fondements mathématiques des algorithmes, des graphiques et de l'apprentissage automatique",
        href: 'https://www.youtube.com/@3blue1brown',
      },
    ],
  },
  {
    category: 'Ingénierie',
    sources: [
      {
        name: 'Branch Education',
        focus:
          'Explications animées sur la façon dont les processeurs, la mémoire et autres matériels exécutent les logiciels',
        href: 'https://www.youtube.com/@BranchEducation',
      },
      {
        name: 'Practical Engineering',
        focus:
          "Comment les contraintes techniques, les compromis, les modes de défaillance et la maintenance façonnent l'infrastructure",
        href: 'https://www.youtube.com/@PracticalEngineeringChannel',
      },
    ],
  },
];

export const contributionPanel: PersonalContributionPanelContent = {
  frame: { title: 'contributions.log', meta: '3 modifications sélectionnées' },
  ariaLabel: 'Contributions open source sélectionnées',
  items: contributions,
};

export const homelabPanel: PersonalHomelabPanelContent = {
  frame: { title: 'home.systems', meta: 'infrastructures locales' },
  ariaLabel:
    'Un ordinateur personnel héberge les charges de travail Docker, les services de serveur et les grands modèles de langage locaux',
  host: { code: 'HOST / 01', title: 'PC personnel', description: 'Matériel local' },
  services: [
    { type: 'CONTAINER', title: 'Docker', description: 'Isolated workloads' },
    { type: 'SERVICE', title: 'Hosting', description: 'Server workloads' },
    { type: 'MODEL', title: 'Local LLM', description: 'AI on-device' },
  ],
  status: 'Autogéré',
  process: 'Déployer → observer → comprendre → améliorer',
};

export const learningPanel: PersonalLearningPanelContent = {
  frame: { title: 'regarder.liste', meta: '6 créateurs / 3 sujets' },
  ariaLabel: 'Créateurs YouTube éducatifs préférés regroupés par sujet',
  groups: learningGroups,
};

export const coolingPanel: PersonalCoolingPanelContent = {
  frame: { title: 'boucle de refroidissement', meta: '4 radiateurs / 2 pompes' },
  ariaLabel:
    "Système de refroidissement par eau pour PC personnalisé avec quatre radiateurs, doubles pompes, blocs d'eau CPU, RAM et GPU",
  status: { label: 'REFROIDISSEMENT LIQUIDE', title: 'Boucle personnalisée' },
  facts: [
    { label: 'Radiateurs', value: '04×' },
    { label: 'Pompes', value: '02×' },
    { label: 'Blocs', value: 'Processeur/RAM/GPU' },
  ],
};

export const personalMeta = {
  title: 'Projets personnels et intérêts | Matthias Löhden',
  description:
    'Contributions open source, systèmes auto-hébergés, IA locale, créateurs pédagogiques préférés et matériel PC personnalisé par Matthias Löhden.',
};
