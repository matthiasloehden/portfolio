import { site } from '@/data/site';
import { APP_ROUTES } from '@/config/routes';
import { createCaseStudyListItems } from '@/data/caseStudies';
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
  listTitle: "Plateforme d'apprentissage",
  listCategory: "Plateforme d'apprentissage",
  category: "Client d'entreprise",
  type: 'Apprentissage et contenu',
  title: ['Entreprise', ['apprentissage', ' plate-forme']],
  accent: [false, true],
  summary:
    "Plateforme d'apprentissage avec un CMS personnalisé, un accès basé sur les rôles et plusieurs formats de contenu.",
  paragraphs: [
    "Notre équipe chez TopRed Media était responsable du développement de l'application et de la gestion de son contenu. Son CMS personnalisé prend en charge les événements, vidéos, podcasts et articles dans un seul système.",
    "Des droits d'accès personnalisés contrôlaient qui pouvait accéder à des parties spécifiques de la plate-forme, faisant des autorisations une fonctionnalité essentielle du produit aux côtés de la publication.",
  ],
  facts: [
    { label: 'But', value: 'Apprentissage et connaissance' },
    { label: 'Livraison', value: "CMS personnalisé et droits d'accès" },
    { label: 'Formats', value: 'Événements, vidéos, podcasts, articles' },
  ],
};

export const retailCase: WorkCaseStudyContent = {
  id: 'retail-operations',
  number: '02',
  listTitle: 'Opérations de vente au détail',
  listCategory: 'Opérations de magasin',
  category: "Client d'entreprise",
  type: 'Opérations de vente au détail',
  title: [['Vente au détail', ' opérations'], 'plate-forme'],
  accent: [true, false],
  summary:
    "Plateforme opérationnelle pour les données d'atelier, les tâches, les flux de travail et les rapports basés sur Excel.",
  paragraphs: [
    "Notre équipe a développé une plateforme centrale pour gérer les données des magasins, les tâches opérationnelles et les flux de travail. Chaque magasin disposait d'un profil structuré regroupant les données de localisation, les plans d'étage, les horaires d'ouverture et des processus tels que les changements d'adresse et de code postal.",
    'Les données des magasins, des tâches et de la plateforme pouvaient être exportées dans des rapports Excel pour une analyse approfondie. Le processus fonctionnait également en sens inverse : les feuilles de calcul modifiées pouvaient être importées et resynchronisées avec la base de données.',
  ],
  facts: [
    { label: 'But', value: 'Gestion de la boutique et des tâches' },
    { label: 'Données', value: 'Emplacements, mises en page, horaires, tâches' },
    { label: 'Rapports', value: 'Synchronisation bidirectionnelle Excel/base de données' },
  ],
};

export const signageCase: WorkCaseStudyContent = {
  id: 'signage-control',
  number: '03',
  listTitle: 'Contrôle de la signalétique',
  listCategory: 'Affichage numérique',
  category: "Client d'entreprise",
  type: 'Affichage numérique',
  title: [['Affichage ', 'numérique'], 'système de contrôle'],
  accent: [false, false],
  summary:
    "Service Python et interface utilisateur Electron pour le contrôle de l'affichage à distance et la surveillance opérationnelle.",
  paragraphs: [
    "J'étais responsable d'un service Python avec une interface Electron qui fonctionnait sur des lecteurs d'affichage numérique et contrôlait les écrans connectés pendant la diffusion des publicités.",
    "Le service communiquait avec les écrans via RS-232, transmettait l'état du lecteur à la plateforme centrale et pouvait être administré à distance depuis l'interface Electron.",
  ],
  facts: [
    { label: 'Ma responsabilité', value: 'Service Python et interface utilisateur Electron' },
    { label: 'Lien matériel', value: "Contrôle d'affichage RS-232" },
    { label: 'Opérations', value: "Rapports d'état et contrôle à distance" },
  ],
};

export const clientCase: WorkCaseStudyContent = {
  id: 'client-platform',
  number: '04',
  listTitle: 'Plateforme client',
  listCategory: 'CMS et communication',
  category: 'TopRed Media',
  type: "Produit de l'entreprise",
  title: ['Configurable', 'plateforme client'],
  accent: [true, false],
  summary:
    "Des packages applicatifs réutilisables combinés en plateformes propres à chaque client pour le contenu, la communication et le contrôle d'accès.",
  paragraphs: [
    "Dans l'ensemble de nos projets, les fonctionnalités récurrentes étaient développées sous forme de packages réutilisables plutôt que recréées pour chaque application.",
    'Ces packages sont devenus la base d’une plateforme configurable que TopRed Media pouvait adapter à chaque client.',
    'Des fonctionnalités telles que le contenu CMS, le chat en direct, les événements, les équipes, les rôles et les autorisations pouvaient être combinées et configurées pour chaque client, afin de répondre à différents usages allant du coaching personnel à la communication en maternelle.',
  ],
  facts: [
    { label: 'Architecture', value: 'Base applicative modulaire' },
    { label: 'Modules', value: 'Contenu, chat, événements, équipes, accès' },
    { label: 'Modèle', value: 'Fonctionnalités activées par client' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[ 2019-2025 ]',
  kicker: 'Développement de logiciels professionnels',
  title: ['Production', 'logiciel.'],
  accent: [false, true],
  introduction: [
    "Chez TopRed Media GmbH, j'ai contribué à l'ensemble du cycle de vie d'applications métier en production, depuis leur développement initial jusqu'à plusieurs années d'évolution et de maintenance.",
  ],
  facts: [
    { label: 'Entreprise', value: 'TopRed Media GmbH' },
    { label: 'Rôle', value: 'Apprenti → Développeur full-stack' },
    { label: 'Systèmes', value: 'Quatre projets sélectionnés' },
  ],
  scrollLabel: 'Explorer les œuvres sélectionnées',
  scrollHref: '#work-list',
};

export const workOverview: WorkOverviewContent = {
  id: 'work-list',
  titleId: 'work-list-title',
  label: 'Travail professionnel sélectionné',
  title: ['Quatre sélectionnés', 'production', 'systèmes.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(workCases),
};

export const workContext: WorkContextContent = {
  kicker: 'Aperçu de la technologie',
  title: ['Cœur', 'technologies', 'à travers ces', 'projets.'],
  accent: [false, true, false, false],
  stack: {
    languages: ['PHP', 'SQL', 'JavaScript'],
    backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Points forts',
  highlights: [
    "Développement backend, packages réutilisables et conception modulaire d'applications",
    'Tests automatisés, CI/CD, déploiement et configuration de serveurs',
    "Applications d'une seule page avec Laravel, Vue et Inertia.js",
    'Mise en cache et évaluation des autorisations utilisateur complexes avec Redis',
    'Recherche et filtrage de grands ensembles de données avec Meilisearch',
    "Intégration d'applications avec des services externes et des systèmes physiques",
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Portée professionnelle',
  title: ['À propos de ceux-ci', 'projets.'],
  accent: [false, true],
  description:
    "Ensemble, ces projets illustrent la diversité des systèmes sur lesquels j'ai travaillé au cours de six années de développement logiciel professionnel, des applications web d'entreprise aux logiciels interagissant avec du matériel physique.",
  actions: [
    { label: 'Démarrer une conversation', href: `mailto:${site.email}` },
    { label: 'Voir les travaux universitaires', symbol: '→', to: APP_ROUTES.academic, variant: 'text' },
  ],
};

export const learningPanel: WorkLearningPanelContent = {
  frame: { title: 'contenu.bibliothèque', meta: 'publication avec accès' },
  navigation: ['Aperçu', 'Événements', 'Médias', 'Articles'],
  featured: { title: "Événement d'apprentissage", description: 'Inscription · badges · feedback' },
  formats: [
    { symbol: '▶', title: 'Vidéo', description: 'Sur demande' },
    { symbol: '◉', title: 'Podcast', description: 'Série audio' },
    { symbol: '¶', title: 'Article', description: 'Éditorial' },
  ],
  status: 'Diffusion de contenu sensible aux rôles',
};

export const retailPanel: WorkRetailPanelContent = {
  frame: { title: 'boutique.record', meta: 'source opérationnelle de vérité' },
  code: 'SHOP / 042',
  title: 'Profil de localisation',
  status: 'Enregistrement actif',
  fields: [
    { label: "Horaires d'ouverture", value: 'Configuré' },
    { label: 'Disposition du sol', value: 'Disponible' },
    { label: 'Données postales', value: 'Géré' },
    { label: 'Tâches', value: 'Attribué' },
  ],
  sync: {
    label: 'Les feuilles Excel pourraient exporter des données et synchroniser les modifications téléchargées',
    source: 'Base de données',
    target: '.XLSX',
  },
};

export const signagePanel: WorkSignagePanelContent = {
  frame: { title: 'affichage.contrôle', meta: 'joueur en ligne' },
  remote: { label: 'TÉLÉCOMMANDE', title: 'Administration' },
  player: [
    { label: "CONTRÔLE DE L'INTERFACE UTILISATEUR", title: 'Électron' },
    { label: 'SERVICE', title: 'Python' },
  ],
  outputs: [
    { connection: 'RS-232 →', title: 'Afficher', description: 'Contrôle de lecture' },
    { connection: 'Statut →', title: 'Opérations', description: 'Analytique' },
  ],
};

export const clientPanel: WorkClientPanelContent = {
  frame: { title: 'plateforme.modules', meta: 'configuré par client' },
  modules: [
    { number: '01', title: 'CMS', description: 'Publier du contenu' },
    { number: '02', title: 'Chat en direct', description: 'Restez connecté' },
    { number: '03', title: 'Événements', description: "Coordonner l'activité" },
    { number: '04', title: 'Équipes', description: 'Gérer les groupes' },
  ],
  audiences: ['Entraînement personnel', "Jardin d'enfants"],
};

export const workMeta = {
  title: 'Travail professionnel | Matthias Löhden',
  description:
    "Projets de logiciels professionnels de Matthias Löhden chez TopRed Media GmbH, comprenant l'apprentissage, la gestion de magasin, l'affichage numérique et les plateformes de communication.",
};
