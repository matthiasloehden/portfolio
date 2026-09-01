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
    'Il nostro team ha creato una piattaforma centrale in cui i dipendenti del negozio ricevevano e completavano le attività operative, inclusa la documentazione del lavoro completato con caricamenti di foto.',
    'Ogni negozio aveva il proprio profilo contenente dati sulla posizione, disposizione dei piani, orari di apertura, attività aperte e chiuse e flussi di lavoro per modifiche di posizione e postali.',
    "L'analisi della piattaforma ha riunito i dati del negozio, delle attività e della piattaforma correlata nei report Excel. Il flusso funzionava anche al contrario: i fogli di calcolo modificati potevano essere caricati e sincronizzati nuovamente nel database.",
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
  title: ['Sistema di', ['controllo ', 'digital signage']],
  accent: [false, true],
  summary:
    'Servizio Python e interfaccia utente Electron per il controllo remoto del display e il monitoraggio operativo.',
  paragraphs: [
    'Ero responsabile di un servizio Python con un Electron frontend che funzionava su lettori di segnaletica digitale e controllava i loro display collegati durante la riproduzione degli annunci pubblicitari.',
    "Il servizio comunicava con ciascun display tramite RS-232 e inviava lo stato del giocatore alla piattaforma centrale delle operazioni di vendita al dettaglio per l'analisi. Gli operatori potevano connettersi tramite amministrazione remota e utilizzare l'interfaccia Electron per controllare il servizio.",
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
    'Una base applicativa condivisa con moduli specifici del cliente per contenuto, comunicazione e controllo degli accessi.',
  paragraphs: [
    'Il nostro team ha consolidato pacchetti e funzionalità riutilizzabili di altri progetti in una piattaforma di prodotto configurabile che TopRed Media ha offerto ai clienti. Moduli come contenuti CMS, articoli, chat dal vivo, eventi, team, ruoli e autorizzazioni possono essere abilitati e configurati individualmente per ciascun cliente.',
    "La stessa fondazione ha supportato casi d'uso diversi come la comunicazione tra un personal trainer e i clienti o il coordinamento all'interno di un asilo nido, senza mantenere un prodotto separato per ciascun cliente.",
  ],
  facts: [
    { label: 'Scopo', value: 'Contenuti e comunicazione' },
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
    "Presso TopRed Media GmbH, ho contribuito all'intero ciclo di vita delle applicazioni aziendali di produzione, dallo sviluppo iniziale attraverso anni di sviluppo di funzionalità, refactoring, integrazioni e manutenzione.",
    'Lavorando in un team di tre sviluppatori, ho contribuito a tutti i livelli man mano che i requisiti, i flussi di lavoro e i prodotti stessi si evolvevano continuamente.',
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
    'Architettura backend, modellazione dei dati e flussi di lavoro delle applicazioni',
    'Applicazioni a pagina singola con Laravel, Vue e Inertia.js',
    'Memorizzazione nella cache e valutazione di autorizzazioni utente complesse con Redis',
    'Ricerca e filtraggio di set di dati di grandi dimensioni con Meilisearch',
    'Sincronizzazione bidirezionale di Excel e database',
    'Integrazione di applicazioni con servizi esterni e sistemi fisici',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Ambito professionale',
  title: ['Dietro questi', 'progetti.'],
  accent: [false, true],
  description:
    "Questi progetti dei clienti e il prodotto di proprietà dell'azienda sono intenzionalmente descritti a livello di sistema. Insieme, rappresentano la gamma di software di produzione su cui ho lavorato: flussi di lavoro applicativi, interfacce utente, dati, autorizzazioni, ricerca, integrazioni, manutenzione e software che interagisce con i sistemi fisici.",
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
