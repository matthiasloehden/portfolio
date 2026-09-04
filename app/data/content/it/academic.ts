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
  listTitle: 'Analisi dello streaming di eventi',
  listCategory: 'Scalabilità e big data',
  category: 'Scalabilità e big data',
  type: 'Architettura dello streaming',
  title: [['Dagli ', 'eventi grezzi'], 'a una vista', ['operativa ', 'in tempo reale.']],
  accent: [false, false, true],
  lead: "Un prototipo di elaborazione di eventi distribuito per l'acquisizione, la trasformazione e l'analisi dei dati in streaming in tempo reale.",
  description:
    "Kafka ha disaccoppiato i produttori di eventi dai consumatori a valle. Flink ha convalidato, arricchito e aggregato il flusso prima di scrivere record pronti per la query su ClickHouse. Grafana ha trasformato questi dati in un dashboard operativo per l'ispezione del volume, delle tendenze e dello stato dell'elaborazione.",
  notes: [
    {
      title: 'Domanda di ingegneria',
      text: 'Come può una pipeline modulare trasformare un flusso illimitato di eventi in informazioni immediatamente utili?',
    },
    {
      title: 'Messa a fuoco',
      text: 'Scalabilità, trasformazioni dei flussi, approccio event-time, analisi orientata alle colonne e osservabilità.',
    },
  ],
};

export const passkeysCase: AcademicCaseStudyContent = {
  id: 'passkeys',
  number: '03',
  listTitle: 'Chiavi di accesso FIDO2',
  listCategory: 'Progettazione della sicurezza',
  category: 'Progettazione della sicurezza',
  type: 'Architettura di autenticazione',
  title: [
    ['Accesso ', 'senza password'],
    ['con passkey ', 'FIDO2.'],
  ],
  accent: [true, false],
  lead: 'Una prova di concetto che esplora la progettazione sicura dei sistemi attraverso un sistema di autenticazione senza password basato su FIDO2.',
  description:
    "La sicurezza è stata trattata come un vincolo fondamentale di progettazione, determinando i flussi di autenticazione, la gestione delle credenziali, i confini di fiducia e le operazioni sensibili. L'autenticazione si basava su credenziali a chiave pubblica e flussi challenge-response con ambito definito.",
  notes: [
    {
      title: 'Domanda di ingegneria',
      text: "In che modo l'autenticazione può diventare più semplice per gli utenti riducendo al tempo stesso l'esposizione al phishing e al riutilizzo delle credenziali?",
    },
    {
      title: 'Messa a fuoco',
      text: 'Sicurezza fin dalla progettazione, cerimonie WebAuthn, limiti delle parti coinvolte, convalida delle sfide, archiviazione delle credenziali e UX di ripristino.',
    },
  ],
};

export const softwareEngineeringCase: AcademicCaseStudyContent = {
  id: 'software-engineering',
  number: '01',
  listTitle: 'Progetto di ingegneria del software',
  listCategory: 'Ciclo di vita e qualità',
  category: 'Ingegneria del software',
  type: 'Progetto di squadra',
  title: [['Dai ', 'requisiti'], 'a una release', ['testata ', 'e pronta.']],
  accent: [false, false, true],
  lead: "Un progetto di gruppo completato che riunisce i metodi dei precedenti corsi di ingegneria del software attraverso l'intero ciclo di vita dello sviluppo.",
  description:
    "Il nostro team ha sviluppato un'applicazione web per monitorare il tempo di apprendimento, organizzando il lavoro tramite ticket e traguardi. Abbiamo collaborato su requisiti, specifiche, progettazione, implementazione, test e documentazione. La mia responsabilità principale riguardava l'architettura e la gestione della qualità.",
  notes: [
    {
      title: 'Domanda di ingegneria',
      text: "Come può un team applicare metodi di ingegneria del software per fornire un'applicazione tracciabile e di qualità garantita durante l'intero ciclo di vita?",
    },
    {
      title: 'Messa a fuoco',
      text: 'Ciclo di vita del software, architettura, gestione della qualità, test, documentazione e distribuzione iterativa.',
    },
  ],
};

export const itsmCase: AcademicCaseStudyContent = {
  id: 'itsm',
  number: '04',
  listTitle: 'Gestione dei servizi informatici',
  listCategory: 'Operazioni di servizio',
  category: 'Operazioni di servizio',
  type: 'Modello operativo',
  title: ['Un modello', ['leggero ', 'di gestione'], 'dei servizi IT.'],
  accent: [false, true, false],
  lead: 'Un concetto di gestione dei servizi basato su ITIL e FitSM, che definisce proprietà, flussi di incidenti e richieste, percorsi di escalation e miglioramento continuo.',
  description:
    'Il modello ha tradotto una guida quadro più ampia in un approccio operativo leggero e verificabile. ITIL ha fornito il contesto pratico, mentre FitSM ha contribuito a definire un minimo pratico per una qualità del servizio ripetibile.',
  notes: [
    {
      title: 'Domanda di ingegneria',
      text: 'Qual è il più piccolo modello di processo utile che crea comunque una proprietà chiara e una qualità del servizio ripetibile?',
    },
    {
      title: 'Messa a fuoco',
      text: 'Operazioni di servizio, flusso di incidenti, richieste di servizio, ruoli, percorsi di escalation, pensiero sul livello di servizio e miglioramento continuo.',
    },
  ],
};

export const academicCases = [softwareEngineeringCase, streamingCase, passkeysCase, itsmCase];

export const academicHero: AcademicHeroContent = {
  kickerPrefix: '[ INFORMATICA ]',
  kicker: 'Lavoro accademico selezionato',
  title: ['Software,', ['sistemi', ' e'], 'sicurezza.'],
  accent: [false, true, false],
  introduction: [
    "Quattro progetti selezionati riguardano l'ingegneria del software nell'intero ciclo di vita, l'elaborazione distribuita dei dati, l'autenticazione e la sicurezza del sistema e le operazioni di servizio affidabili.",
  ],
  facts: [
    { label: 'Corsi', value: 'JavaScript, Java, Python, Prolog e R' },
    { label: 'Sistemi e strumenti', value: 'Kafka, Flink, ClickHouse, Grafana e WebAuthn' },
    { label: 'Messa a fuoco', value: 'Ingegneria del software, sistemi e sicurezza' },
  ],
  scrollLabel: 'Visualizza progetti',
  scrollHref: '#academic-list',
};

export const academicOverview: AcademicOverviewContent = {
  id: 'academic-list',
  titleId: 'academic-list-title',
  label: 'Progetti universitari selezionati',
  title: ['Quattro progetti', 'universitari', 'selezionati.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(academicCases),
};

export const academicClosing: PageClosingContent = {
  kickerPrefix: '/',
  kicker: 'Ambito accademico',
  title: [['Informatica ', 'oltre'], 'il livello', ['delle ', 'applicazioni.']],
  accent: [false, false, false],
  description:
    "Questi progetti collegano la mia esperienza professionale con il lavoro accademico attraverso l'intero ciclo di vita del software, l'elaborazione distribuita dei dati, l'autenticazione e la sicurezza del sistema e le operazioni dei servizi IT.",
  actions: [
    { label: 'Inizia una conversazione', href: `mailto:${site.email}` },
    { label: 'Visualizza progetti personali', symbol: '→', to: APP_ROUTES.personal, variant: 'text' },
  ],
};

export const streamingPanel: AcademicStreamingPanelContent = {
  frame: { title: 'pipeline.flusso', meta: 'evento → intuizione' },
  ariaLabel: 'I dati fluiscono dai produttori attraverso Kafka e Flink in ClickHouse e Grafana',
  nodes: [
    { name: 'Producers', description: 'Origine evento' },
    { name: 'Kafka', description: 'Trasporto' },
    { name: 'Flink', description: 'Elaborazione' },
    { name: 'ClickHouse', description: 'Analitica' },
    { name: 'Grafana', description: 'Visibilità' },
  ],
};

export const engineeringPanel: AcademicEngineeringPanelContent = {
  frame: { title: 'lernzeit.manager', meta: 'pianificazione personale dello studio' },
  ariaLabel: "Anteprima dell'applicazione web di gestione del tempo di apprendimento completata",
  navigation: [
    'Panoramica',
    'Obiettivi di apprendimento',
    'Pianificazione',
    'Tempo di concentrazione',
    'Analitica',
    'Promemoria',
  ],
  metrics: [
    { label: 'Obiettivi attivi', value: '2' },
    { label: 'Piano mensile', value: '38 ore' },
    { label: 'Tempo di concentrazione', value: '8,1 ore' },
  ],
  goals: [
    { title: 'Modellazione dei dati', status: 'In corso' },
    { title: 'Algebra lineare', status: 'Pianificato' },
  ],
  schedule: [
    { date: '26.07', title: 'Esercizi di normalizzazione' },
    { date: '29.07', title: 'Esercizi sullo spazio vettoriale' },
  ],
  facts: [
    { label: 'Progetto', value: 'Lavoro di gruppo collaborativo' },
    { label: 'Responsabilità primaria', value: 'Architettura e gestione della qualità' },
    { label: 'Consegna', value: 'Biglietti, traguardi e recensioni' },
  ],
  demo: {
    label: 'Visualizza la demo dal vivo',
    href: 'https://struperto.github.io/isef01-lernzeit-manager/',
  },
  status: 'Ciclo di vita completo completato',
};

export const authenticationPanel: AcademicAuthenticationPanelContent = {
  frame: { title: 'autenticazione.cerimonia', meta: 'flusso di chiave pubblica' },
  steps: [
    { number: '01', title: 'Richiesta', description: 'Il server crea una nuova sfida.' },
    {
      number: '02',
      title: 'Verificare localmente',
      description: "L'utente sblocca un autenticatore associato al dispositivo.",
    },
    {
      number: '03',
      title: 'Cartello',
      description: "La chiave privata firma la sfida senza lasciare l'autenticatore.",
    },
    { number: '04', title: 'Convalidare', description: "Il server verifica l'origine, la sfida e la firma." },
  ],
  status: 'Nessuna password condivisa trasmessa',
};

export const servicePanel: AcademicServicePanelContent = {
  frame: { title: 'modello.di.servizio', meta: 'mappatura del quadro' },
  stages: [
    { number: '01', title: 'Catturare', description: 'Registra e riconosci' },
    { number: '02', title: 'Classificare', description: 'Dare priorità e assegnare' },
    { number: '03', title: 'Risolvere', description: 'Ripristina o soddisfa' },
    { number: '04', title: 'Imparare', description: 'Revisionare e migliorare' },
  ],
  frameworks: [
    { name: 'ITIL', description: 'Practices, value, and continual improvement' },
    { name: 'FitSM', description: 'Lightweight requirements and clear accountability' },
  ],
};

export const academicMeta = {
  title: 'Progetti universitari | Matthias Löhden',
  description:
    "Lavori informatici selezionati di Matthias Löhden nell'ambito dell'elaborazione scalabile degli eventi, dell'autenticazione FIDO2, dell'ingegneria del software applicata e delle operazioni di servizio.",
};
