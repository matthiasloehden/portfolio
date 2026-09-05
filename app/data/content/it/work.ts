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
  listTitle: 'Piattaforma di apprendimento',
  listCategory: 'Piattaforma di apprendimento',
  category: 'Cliente aziendale',
  type: 'Apprendimento e contenuti',
  title: ['Piattaforma', ['di formazione ', 'aziendale']],
  accent: [false, true],
  summary: 'Piattaforma di apprendimento con CMS personalizzato, accesso basato sui ruoli e più formati di contenuto.',
  paragraphs: [
    "Il nostro team di TopRed Media era responsabile dello sviluppo dell'applicazione e della gestione dei suoi contenuti. Il suo CMS personalizzato supportava eventi, video, podcast e articoli in un unico sistema.",
    'I diritti di accesso personalizzati controllavano chi poteva raggiungere parti specifiche della piattaforma, rendendo le autorizzazioni una funzionalità fondamentale del prodotto insieme alla pubblicazione.',
  ],
  facts: [
    { label: 'Scopo', value: 'Apprendimento e conoscenza' },
    { label: 'Consegna', value: 'CMS personalizzato e diritti di accesso' },
    { label: 'Formati', value: 'Eventi, video, podcast, articoli' },
  ],
};

export const retailCase: WorkCaseStudyContent = {
  id: 'retail-operations',
  number: '02',
  listTitle: 'Operazioni al dettaglio',
  listCategory: 'Operazioni di negozio',
  category: 'Cliente aziendale',
  type: 'Operazioni al dettaglio',
  title: ['Piattaforma', ['operativa ', 'per il retail']],
  accent: [false, true],
  summary: 'Piattaforma operativa per dati del negozio, attività, flussi di lavoro e reporting basato su Excel.',
  paragraphs: [
    'Il nostro team ha sviluppato una piattaforma centrale per gestire i dati dei negozi, le attività operative e i flussi di lavoro.',
    'Ogni negozio aveva un profilo strutturato con dati sulla posizione, planimetrie, orari di apertura e procedure come le modifiche di sede e codice postale.',
    'I dati dei negozi, delle attività e della piattaforma potevano essere esportati in report Excel per ulteriori analisi. Il processo funzionava anche al contrario: i fogli di calcolo modificati potevano essere caricati e sincronizzati nuovamente con il database.',
  ],
  facts: [
    { label: 'Scopo', value: 'Gestione del negozio e delle attività' },
    { label: 'Dati', value: 'Sedi, layout, orari, compiti' },
    { label: 'Segnalazione', value: 'Sincronizzazione bidirezionale di Excel/database' },
  ],
};

export const signageCase: WorkCaseStudyContent = {
  id: 'signage-control',
  number: '03',
  listTitle: 'Controllo della segnaletica',
  listCategory: 'Segnaletica digitale',
  category: 'Cliente aziendale',
  type: 'Segnaletica digitale',
  title: [['Segnaletica ', 'digitale'], 'sistema di controllo'],
  accent: [false, false],
  summary:
    'Servizio Python e interfaccia utente Electron per il controllo remoto del display e il monitoraggio operativo.',
  paragraphs: [
    'Ero responsabile di un servizio Python con interfaccia Electron che funzionava su lettori di segnaletica digitale e controllava i display collegati durante la riproduzione pubblicitaria.',
    "Il servizio comunicava con i display tramite RS-232, trasmetteva lo stato del lettore alla piattaforma centrale e poteva essere gestito da remoto tramite l'interfaccia Electron.",
  ],
  facts: [
    { label: 'La mia responsabilità', value: 'Servizio Python e interfaccia utente Electron' },
    { label: 'Collegamento hardware', value: 'Controllo display RS-232' },
    { label: 'Operazioni', value: 'Segnalazione dello stato e controllo remoto' },
  ],
};

export const clientCase: WorkCaseStudyContent = {
  id: 'client-platform',
  number: '04',
  listTitle: 'Piattaforma cliente',
  listCategory: 'CMS e comunicazione',
  category: 'TopRed Media',
  type: 'Prodotto aziendale',
  title: ['Piattaforma per clienti', 'configurabile'],
  accent: [false, true],
  summary:
    'Pacchetti applicativi riutilizzabili combinati in piattaforme specifiche per ogni cliente per contenuti, comunicazione e controllo degli accessi.',
  paragraphs: [
    'Nei nostri progetti, le funzionalità ricorrenti venivano sviluppate come pacchetti riutilizzabili invece di essere ricostruite per ogni applicazione.',
    'Questi pacchetti sono diventati la base di una piattaforma configurabile che TopRed Media poteva adattare ai singoli clienti.',
    "Funzionalità come contenuti CMS, chat dal vivo, eventi, team, ruoli e autorizzazioni potevano essere combinate e configurate per ciascun cliente, supportando casi d'uso diversi, dal personal training alla comunicazione negli asili.",
  ],
  facts: [
    { label: 'Architettura', value: 'Base applicativa modulare' },
    { label: 'Moduli', value: 'Contenuti, chat, eventi, team, accesso' },
    { label: 'Modello', value: 'Funzionalità abilitate per client' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[2019–2025]',
  kicker: 'Sviluppo software professionale',
  title: ['Software', 'in produzione.'],
  accent: [false, true],
  introduction: [
    "Presso TopRed Media GmbH, ho contribuito all'intero ciclo di vita di applicazioni aziendali in produzione, dallo sviluppo iniziale attraverso anni di sviluppo continuo e manutenzione.",
  ],
  facts: [
    { label: 'Azienda', value: 'TopRed Media GmbH' },
    { label: 'Ruolo', value: 'Apprendista → Sviluppatore full-stack' },
    { label: 'Sistemi', value: 'Quattro progetti selezionati' },
  ],
  scrollLabel: 'Esplora il lavoro selezionato',
  scrollHref: '#work-list',
};

export const workOverview: WorkOverviewContent = {
  id: 'work-list',
  titleId: 'work-list-title',
  label: 'Lavoro professionale selezionato',
  title: ['Quattro sistemi', 'di produzione', 'selezionati.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(workCases),
};

export const workContext: WorkContextContent = {
  kicker: 'Panoramica della tecnologia',
  title: ['Tecnologie', 'principali', 'in questi', 'progetti.'],
  accent: [false, true, false, false],
  stack: {
    languages: ['PHP', 'SQL', 'JavaScript'],
    backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Punti salienti',
  highlights: [
    'Sviluppo backend, pacchetti riutilizzabili e progettazione modulare delle applicazioni',
    'Test automatizzati, CI/CD, deployment e configurazione dei server',
    'Applicazioni a pagina singola con Laravel, Vue e Inertia.js',
    'Memorizzazione nella cache e valutazione di autorizzazioni utente complesse con Redis',
    'Ricerca e filtraggio di set di dati di grandi dimensioni con Meilisearch',
    'Integrazione di applicazioni con servizi esterni e sistemi fisici',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Ambito professionale',
  title: ['Dietro questi', 'progetti.'],
  accent: [false, true],
  description:
    'Nel loro insieme, questi progetti mostrano la varietà dei sistemi su cui ho lavorato in sei anni di sviluppo software professionale, dalle applicazioni web aziendali al software che interagisce con hardware fisico.',
  actions: [
    { label: 'Inizia una conversazione', href: `mailto:${site.email}` },
    { label: 'Visualizza il lavoro universitario', symbol: '→', to: APP_ROUTES.academic, variant: 'text' },
  ],
};

export const learningPanel: WorkLearningPanelContent = {
  frame: { title: 'content.library', meta: 'pubblicazione con accesso consapevole' },
  navigation: ['Panoramica', 'Eventi', 'Media', 'Articoli'],
  featured: { title: 'Evento di apprendimento', description: 'Registrazione · badge · feedback' },
  formats: [
    { symbol: '▶', title: 'Video', description: 'Su richiesta' },
    { symbol: '◉', title: 'Podcast', description: 'Serie audio' },
    { symbol: '¶', title: 'Articolo', description: 'Editoriale' },
  ],
  status: 'Distribuzione di contenuti in base al ruolo',
};

export const retailPanel: WorkRetailPanelContent = {
  frame: { title: 'negozio.record', meta: 'fonte operativa di verità' },
  code: 'SHOP / 042',
  title: 'Profilo della posizione',
  status: 'Registrazione attiva',
  fields: [
    { label: 'Orari di apertura', value: 'Configurato' },
    { label: 'Disposizione del pavimento', value: 'Disponibile' },
    { label: 'Dati postali', value: 'Gestito' },
    { label: 'Compiti', value: 'Assegnato' },
  ],
  sync: {
    label: 'I fogli Excel potrebbero esportare dati e sincronizzare le modifiche caricate',
    source: 'Banca dati',
    target: '.XLSX',
  },
};

export const signagePanel: WorkSignagePanelContent = {
  frame: { title: 'controllo.visualizzazione', meta: 'giocatore in linea' },
  remote: { label: 'REMOTO', title: 'Amministrazione' },
  player: [
    { label: 'IU DI CONTROLLO', title: 'Elettrone' },
    { label: 'SERVIZIO', title: 'Pitone' },
  ],
  outputs: [
    { connection: 'RS-232→', title: 'Display', description: 'Controllo della riproduzione' },
    { connection: 'Stato→', title: 'Operazioni', description: 'Analitica' },
  ],
};

export const clientPanel: WorkClientPanelContent = {
  frame: { title: 'platform.modules', meta: 'configurato per cliente' },
  modules: [
    { number: '01', title: 'CMS', description: 'Pubblica contenuti' },
    { number: '02', title: 'Chatta dal vivo', description: 'Rimani connesso' },
    { number: '03', title: 'Eventi', description: "Coordinare l'attività" },
    { number: '04', title: 'Squadre', description: 'Gestisci gruppi' },
  ],
  audiences: ['Formazione personale', 'Asilo nido'],
};

export const workMeta = {
  title: 'Lavoro professionale | Matthias Löhden',
  description:
    'Progetti software professionali di Matthias Löhden presso TopRed Media GmbH, tra cui apprendimento, gestione del negozio, segnaletica digitale e piattaforme di comunicazione.',
};
