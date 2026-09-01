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
  listTitle: 'Contributi open source',
  listCategory: 'Funzionalità e correzioni',
  category: 'Fonte aperta',
  type: 'Modifiche utili, condivise',
  title: ['Migliorare', ['gli strumenti', ' che uso già.']],
  accent: [false, true],
  lead: 'I miei progetti personali spesso iniziano con un’esigenza pratica. A volte il posto migliore per risolverlo è a monte.',
  paragraphs: [
    'Fornisco funzionalità e correzioni agli strumenti che utilizzo effettivamente, dai software per la casa intelligente e il controllo remoto alla gestione dei server di gioco.',
    'Lavorare su basi di codice esistenti mi ha insegnato a comprendere sistemi non familiari, confrontare approcci diversi e trovare soluzioni che si adattino naturalmente al progetto esistente.',
  ],
  tags: ['Open source', 'Docker', 'Networking', 'Debugging'],
};

export const homelabSection: PersonalSectionContent = {
  id: 'homelab',
  number: '02',
  listTitle: 'Sistemi self-hosted',
  listCategory: 'Docker e IA locale',
  category: 'Laboratorio domestico',
  type: 'Infrastrutture a casa',
  title: ['Eseguire', 'software', 'oltre localhost.'],
  accent: [false, true, false],
  lead: 'Utilizzo il mio PC per apprendere come si comportano le applicazioni quando dipendono da contenitori, servizi e risorse che le circondano.',
  paragraphs: [
    "Utilizzo Docker per eseguire e isolare servizi sul mio hardware, ospitare applicazioni e carichi di lavoro di server di gioco e sperimentare l'esecuzione locale di modelli linguistici di grandi dimensioni.",
    "Gestire personalmente l'ambiente mi offre un'esperienza pratica con i vincoli di distribuzione, rete, archiviazione e risorse all'esterno di una macchina di sviluppo.",
  ],
  tags: ['Docker', 'Server hosting', 'Local LLMs', 'Self-hosting'],
};

export const learningSection: PersonalSectionContent = {
  id: 'learning',
  number: '03',
  listTitle: "Dai transistor all'architettura",
  listCategory: 'Imparare dai principi primi',
  category: 'Apprendimento',
  type: "Dal basso livello all'architettura",
  title: ['Dai', ['transistor', ' all’architettura'], ['del ', 'software.']],
  accent: [false, true, false],
  lead: "Mi piace comprendere la tecnologia dai livelli più bassi verso l'alto.",
  paragraphs: [
    "Per comprendere le astrazioni del software spesso è necessario esaminare gli strati sottostanti. I creatori che seguo esplorano questo stack attraverso la logica digitale, l'architettura dei computer, i sistemi operativi, gli algoritmi, la matematica e l'ingegneria.",
    "Gli argomenti variano, ma la domanda rimane la stessa: come funziona effettivamente il sistema? Seguirlo dai transistor e dalle porte logiche verso l'alto mi aiuta a prendere decisioni più ponderate nella progettazione e nell'architettura del software.",
  ],
  tags: ['Computer science', 'Engineering', 'Mathematics'],
};

export const hardwareSection: PersonalSectionContent = {
  id: 'hardware',
  number: '04',
  listTitle: 'Hardware PC personalizzato',
  listCategory: 'Costruzione e raffreddamento',
  category: 'Hardware',
  type: 'Costruito, sintonizzato, compreso',
  title: ['La macchina', 'conta anche.'],
  accent: [true, false],
  lead: 'Il mio interesse per la tecnologia non si ferma al software. Sono appassionato di hardware per PC e mi diverto a costruire sistemi da solo.',
  paragraphs: [
    "Il mio PC utilizza un circuito di raffreddamento ad acqua personalizzato con quattro radiatori e due pompe. Pianificarlo e costruirlo riunisce ciò che mi piace di più dell'hardware: precisione, prestazioni e comprensione di come ogni parte influisce sul tutto.",
    'Costruire PC mi offre una controparte fisica del lavoro con il software. Ogni componente ha un ruolo, ogni vincolo influisce sul sistema e i piccoli dettagli contano.',
  ],
  tags: ['PC building', 'Custom loop', '4 radiators', '2 pumps'],
};

export const personalSections = [openSourceSection, homelabSection, learningSection, hardwareSection];

export const personalHero: PersonalHeroContent = {
  kickerPrefix: '[ APERTO / CURIOSO ]',
  kicker: 'Progetti e interessi personali',
  title: ['Nato dalla', 'curiosità.'],
  accent: [false, true],
  introduction: [
    'Oltre al lavoro professionale e universitario, contribuisco agli strumenti che utilizzo, eseguo i sistemi a casa, continuo a imparare e costruisco i PC fino al circuito di raffreddamento.',
  ],
  facts: [
    { label: 'Codice', value: 'Java, TypeScript e open source' },
    { label: 'Sistemi', value: 'Docker, hosting e IA locale' },
    { label: 'Hardware', value: 'Costruito su misura e raffreddato ad acqua' },
  ],
  scrollLabel: 'Esplora progetti e interessi',
  scrollHref: '#personal-list',
};

export const personalOverview: PersonalOverviewContent = {
  id: 'personal-list',
  titleId: 'personal-list-title',
  label: 'Cliente esterno e lavoro universitario',
  title: ['Progetti,', ['sistemi', ' e'], 'interessi tecnici.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(personalSections),
};

export const personalClosing: PageClosingContent = {
  kickerPrefix: '/ ALWAYS LEARNING',
  kicker: 'Curiosità in pratica',
  title: ['I progetti', ['migliori', ' nascono'], 'dalla voglia', 'di saperne di più.'],
  accent: [false, true, false, true],
  description:
    'Che si tratti di una richiesta pull, di un contenitore o di un circuito di raffreddamento, imparo comprendendo il sistema e facendolo funzionare per uno scopo reale.',
  actions: [
    { label: 'Inizia una conversazione', href: `mailto:${site.email}` },
    {
      label: 'Visualizza fonte',
      symbol: '→',
      href: site.sourceUrl,
      variant: 'text',
    },
  ],
};

export const contributions: OpenSourceContribution[] = [
  {
    status: 'Uniti',
    category: 'Libreria di controllo remoto',
    title: 'Controllo della casa intelligente',
    description:
      'Aggiunto il supporto TCP a una libreria di controllo remoto per il controllo dei dispositivi di rete.',
    href: 'https://github.com/andrewfraley/magic_mapper/pull/22',
  },
  {
    status: 'Aprire',
    category: 'Pannello del server di gioco',
    title: 'Server di gioco su richiesta',
    description: 'Esteso il proxy esistente per riattivare i server arrestati alla connessione del giocatore.',
    href: 'https://github.com/discohaus/discopanel/pull/128',
  },
  {
    status: 'Fisso',
    category: 'Plugin per server di gioco',
    title: 'Correzione bug del plugin',
    description: 'Rintracciato e corretto un bug in un plug-in del server di gioco.',
  },
];

export const learningGroups: LearningGroup[] = [
  {
    category: 'Informatica',
    sources: [
      {
        name: 'Ben Eater',
        focus: 'Ingegneria elettrica, logica digitale e architettura informatica attraverso computer breadboard',
        href: 'https://www.youtube.com/@BenEater',
      },
      {
        name: 'Core Dumped',
        focus: 'Sistemi operativi, gestione della memoria, compilatori e altri concetti software di basso livello',
        href: 'https://www.youtube.com/@CoreDumpped',
      },
      {
        name: 'Sebastian Lague',
        focus: 'Algoritmi, simulazioni e computer grafica esplorati attraverso progetti di programmazione',
        href: 'https://www.youtube.com/@SebastianLague',
      },
    ],
  },
  {
    category: 'Matematica',
    sources: [
      {
        name: '3Blue1Brown',
        focus: 'Approcci visivi ai fondamenti matematici di algoritmi, grafica e apprendimento automatico',
        href: 'https://www.youtube.com/@3blue1brown',
      },
    ],
  },
  {
    category: 'Ingegneria',
    sources: [
      {
        name: 'Branch Education',
        focus: 'Spiegazioni animate di come i processori, la memoria e altro hardware eseguono il software',
        href: 'https://www.youtube.com/@BranchEducation',
      },
      {
        name: 'Practical Engineering',
        focus:
          "In che modo i vincoli ingegneristici, i compromessi, le modalità di guasto e la manutenzione modellano l'infrastruttura",
        href: 'https://www.youtube.com/@PracticalEngineeringChannel',
      },
    ],
  },
];

export const contributionPanel: PersonalContributionPanelContent = {
  frame: { title: 'contributi.log', meta: '3 modifiche selezionate' },
  ariaLabel: 'Contributi open source selezionati',
  items: contributions,
};

export const homelabPanel: PersonalHomelabPanelContent = {
  frame: { title: 'sistemi.domestici', meta: 'infrastrutture locali' },
  ariaLabel:
    'Un personal computer ospita carichi di lavoro Docker, servizi server e modelli linguistici di grandi dimensioni locali',
  host: { code: 'HOST / 01', title: 'PC personale', description: 'Hardware locale' },
  services: [
    { type: 'CONTAINER', title: 'Docker', description: 'Isolated workloads' },
    { type: 'SERVICE', title: 'Hosting', description: 'Server workloads' },
    { type: 'MODEL', title: 'Local LLM', description: 'AI on-device' },
  ],
  status: 'Autogestito',
  process: 'Distribuire → osservare → comprendere → migliorare',
};

export const learningPanel: PersonalLearningPanelContent = {
  frame: { title: 'watch.list', meta: '6 creatori / 3 soggetti' },
  ariaLabel: 'Creatori YouTube didattici preferiti raggruppati per argomento',
  groups: learningGroups,
};

export const coolingPanel: PersonalCoolingPanelContent = {
  frame: { title: 'circuito.di.raffreddamento', meta: '4 radiatori / 2 pompe' },
  ariaLabel:
    "Sistema di raffreddamento ad acqua per PC personalizzato con quattro radiatori, doppie pompe, blocchi d'acqua CPU, RAM e GPU",
  status: { label: 'RAFFREDDAMENTO A LIQUIDO', title: 'Ciclo personalizzato' },
  facts: [
    { label: 'Radiatori', value: '04×' },
    { label: 'Pompe', value: '02×' },
    { label: 'Blocchi', value: 'CPU/RAM/GPU' },
  ],
};

export const personalMeta = {
  title: 'Progetti e interessi personali | Matthias Löhden',
  description:
    'Contributi open source, sistemi self-hosted, intelligenza artificiale locale, creatori didattici preferiti e hardware PC personalizzato di Matthias Löhden.',
};
