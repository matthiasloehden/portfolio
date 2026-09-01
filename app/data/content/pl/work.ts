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
  listTitle: 'Platforma edukacyjna',
  listCategory: 'Platforma edukacyjna',
  category: 'Klient korporacyjny',
  type: 'Nauka i treść',
  title: ['Przedsiębiorstwo', ['nauka', ' platforma']],
  accent: [false, true],
  summary:
    'Platforma edukacyjna z niestandardowym systemem CMS, dostępem opartym na rolach i wieloma formatami treści.',
  paragraphs: [
    'Za rozwój aplikacji i zarządzanie jej zawartością odpowiadał nasz zespół w TopRed Media. Niestandardowy CMS obsługuje wydarzenia, filmy, podcasty i artykuły w jednym systemie.',
    'Niestandardowe prawa dostępu pozwalają kontrolować, kto może uzyskać dostęp do określonych części platformy, dzięki czemu uprawnienia stają się podstawową funkcją produktu obok publikowania.',
  ],
  facts: [
    { label: 'Zamiar', value: 'Nauka i wiedza' },
    { label: 'Dostawa', value: 'Niestandardowy CMS i prawa dostępu' },
    { label: 'Formaty', value: 'Wydarzenia, wideo, podcasty, artykuły' },
  ],
};

export const retailCase: WorkCaseStudyContent = {
  id: 'retail-operations',
  number: '02',
  listTitle: 'Działalność detaliczna',
  listCategory: 'Działalność sklepu',
  category: 'Klient korporacyjny',
  type: 'Działalność detaliczna',
  title: [['Sprzedaż detaliczna', ' operacje'], 'platforma'],
  accent: [true, false],
  summary: 'Platforma operacyjna dla danych sklepu, zadań, przepływów pracy i raportowania w oparciu o Excel.',
  paragraphs: [
    'Nasz zespół zbudował centralną platformę, na której pracownicy sklepu otrzymywali i realizowali zadania operacyjne, w tym dokumentowali wykonaną pracę za pomocą przesyłania zdjęć.',
    'Każdy sklep miał swój własny profil zawierający dane o lokalizacji, układy pięter, godziny otwarcia, otwarte i zamknięte zadania oraz przepływy pracy związane ze zmianami lokalizacji i przesyłek pocztowych.',
    'Analityka platformy zebrała dane dotyczące sklepów, zadań i powiązanych platform w raportach Excel. Przebieg działał również w odwrotną stronę: edytowane arkusze kalkulacyjne można było przesyłać i synchronizować z powrotem z bazą danych.',
  ],
  facts: [
    { label: 'Zamiar', value: 'Zarządzanie sklepem i zadaniami' },
    { label: 'Dane', value: 'Lokalizacje, układy, godziny, zadania' },
    { label: 'Raportowanie', value: 'Dwukierunkowa synchronizacja programu Excel/bazy danych' },
  ],
};

export const signageCase: WorkCaseStudyContent = {
  id: 'signage-control',
  number: '03',
  listTitle: 'Kontrola oznakowania',
  listCategory: 'Oznakowanie cyfrowe',
  category: 'Klient korporacyjny',
  type: 'Oznakowanie cyfrowe',
  title: ['Cyfrowy', ['oznakowanie', ' kontrola'], 'system'],
  accent: [false, true, false],
  summary:
    'Usługa Python i interfejs użytkownika Electron do zdalnego sterowania wyświetlaczem i monitorowania operacyjnego.',
  paragraphs: [
    'Byłem odpowiedzialny za usługę w języku Python za pomocą urządzenia Electron frontend, które działało na odtwarzaczach Digital Signage i sterowało podłączonymi do nich wyświetlaczami podczas odtwarzania reklam.',
    'Usługa komunikowała się z każdym wyświetlaczem poprzez RS-232 i przesyłała status odtwarzacza z powrotem do centralnej platformy operacji detalicznych w celu przeprowadzenia analiz. Operatorzy mogli łączyć się poprzez zdalną administrację i używać interfejsu Electron do kontrolowania usługi.',
  ],
  facts: [
    { label: 'Moja odpowiedzialność', value: 'Usługa Python i interfejs użytkownika Electron' },
    { label: 'Łącze sprzętowe', value: 'Sterowanie wyświetlaczem RS-232' },
    { label: 'Operacje', value: 'Raportowanie stanu i zdalne sterowanie' },
  ],
};

export const clientCase: WorkCaseStudyContent = {
  id: 'client-platform',
  number: '04',
  listTitle: 'Platforma klienta',
  listCategory: 'CMS i komunikacja',
  category: 'TopRed Media',
  type: 'Produkt firmowy',
  title: ['Konfigurowalne', 'platforma klienta'],
  accent: [true, false],
  summary:
    'Wspólna podstawa aplikacji z modułami specyficznymi dla klienta dotyczącymi treści, komunikacji i kontroli dostępu.',
  paragraphs: [
    'Nasz zespół połączył pakiety i funkcje wielokrotnego użytku z innych projektów w konfigurowalną platformę produktów, którą TopRed Media oferował klientom. Moduły takie jak treść CMS, artykuły, czat na żywo, wydarzenia, zespoły, role i uprawnienia można włączać i konfigurować indywidualnie dla każdego klienta.',
    'Ten sam fundament wspierał przypadki użycia tak różne, jak komunikacja trenera personalnego z klientami czy koordynacja w przedszkolu, bez utrzymywania osobnego produktu dla każdego klienta.',
  ],
  facts: [
    { label: 'Zamiar', value: 'Treść i komunikacja' },
    { label: 'Moduły', value: 'Treść, czat, wydarzenia, zespoły, dostęp' },
    { label: 'Model', value: 'Funkcje włączone dla każdego klienta' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[ 2019–2025 ]',
  kicker: 'Profesjonalne tworzenie oprogramowania',
  title: ['Produkcja', 'oprogramowanie.'],
  accent: [false, true],
  introduction: [
    'W firmie TopRed Media GmbH brałem udział w całym cyklu życia produkcyjnych aplikacji dla przedsiębiorstw, od początkowego rozwoju poprzez lata opracowywania funkcji, refaktoryzacji, integracji i konserwacji.',
    'Pracując w zespole składającym się z trzech programistów, brałem udział w całym stosie, ponieważ wymagania, przepływy pracy i same produkty stale ewoluowały.',
  ],
  facts: [
    { label: 'Firma', value: 'TopRed Media GmbH' },
    { label: 'Rola', value: 'Praktykant → Programista full-stack' },
    { label: 'Systemy', value: 'Cztery wybrane projekty' },
  ],
  scrollLabel: 'Zapoznaj się z wybraną pracą',
  scrollHref: '#work-list',
};

export const workOverview: WorkOverviewContent = {
  id: 'work-list',
  titleId: 'work-list-title',
  label: 'Wybrana praca zawodowa',
  title: ['Cztery wybrane', 'produkcja', 'systemy.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(workCases),
};

export const workContext: WorkContextContent = {
  kicker: 'Przegląd technologii',
  title: ['Rdzeń', 'technologie', 'przez te', 'projektowanie.'],
  accent: [false, true, false, false],
  stack: {
    languages: ['PHP', 'SQL', 'JavaScript'],
    backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Przegląd najważniejszych wydarzeń',
  highlights: [
    'Architektura backendu, modelowanie danych i przepływy pracy aplikacji',
    'Aplikacje jednostronicowe z Laravel, Vue i Inertia.js',
    'Buforowanie i ocena złożonych uprawnień użytkowników za pomocą Redis',
    'Wyszukiwanie i filtrowanie dużych zbiorów danych za pomocą Meilisearch',
    'Dwukierunkowa synchronizacja programu Excel i bazy danych',
    'Integracja aplikacji z usługami zewnętrznymi i systemami fizycznymi',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Zakres profesjonalny',
  title: ['O tych', 'projektowanie.'],
  accent: [false, true],
  description:
    'Te projekty klientów i produkt będący własnością firmy są celowo opisywane na poziomie systemowym. Razem reprezentują one zakres oprogramowania produkcyjnego, nad którym pracowałem: przepływy pracy aplikacji, interfejsy użytkownika, dane, uprawnienia, wyszukiwanie, integracje, konserwację i interakcję oprogramowania z systemami fizycznymi.',
  actions: [
    { label: 'Rozpocznij rozmowę', href: `mailto:${site.email}` },
    { label: 'Zobacz pracę na uniwersytecie', symbol: '→', to: APP_ROUTES.academic, variant: 'text' },
  ],
};

export const learningPanel: WorkLearningPanelContent = {
  frame: { title: 'zawartość.biblioteka', meta: 'publikowanie z uwzględnieniem dostępu' },
  navigation: ['Przegląd', 'Wydarzenia', 'Głoska bezdźwięczna', 'Artykuły'],
  featured: { title: 'Wydarzenie edukacyjne', description: 'Rejestracja · odznaki · opinia' },
  formats: [
    { symbol: '▶', title: 'Wideo', description: 'Na żądanie' },
    { symbol: '◉', title: 'Podcast', description: 'Seria audio' },
    { symbol: '¶', title: 'Artykuł', description: 'Redakcyjny' },
  ],
  status: 'Dostarczanie treści uwzględniające role',
};

export const retailPanel: WorkRetailPanelContent = {
  frame: { title: 'sklep.rekord', meta: 'operacyjne źródło prawdy' },
  code: 'SHOP / 042',
  title: 'Profil lokalizacji',
  status: 'Zapis aktywny',
  fields: [
    { label: 'Godziny otwarcia', value: 'Skonfigurowane' },
    { label: 'Układ piętra', value: 'Dostępny' },
    { label: 'Dane pocztowe', value: 'Zarządzany' },
    { label: 'Zadania', value: 'Przydzielony' },
  ],
  sync: {
    label: 'Arkusze Excel mogą eksportować dane i synchronizować przesłane zmiany',
    source: 'Baza danych',
    target: '.XLSX',
  },
};

export const signagePanel: WorkSignagePanelContent = {
  frame: { title: 'wyświetlacz.kontrola', meta: 'gracz w Internecie' },
  remote: { label: 'ZDALNY', title: 'Administracja' },
  player: [
    { label: 'Interfejs KONTROLNY', title: 'Elektron' },
    { label: 'PRACA', title: 'Pyton' },
  ],
  outputs: [
    { connection: 'RS-232 →', title: 'Wyświetlacz', description: 'Kontrola odtwarzania' },
    { connection: 'Stan →', title: 'Operacje', description: 'Analityka' },
  ],
};

export const clientPanel: WorkClientPanelContent = {
  frame: { title: 'platforma.moduły', meta: 'skonfigurowane dla każdego klienta' },
  modules: [
    { number: '01', title: 'CMS-a', description: 'Publikuj treści' },
    { number: '02', title: 'Czat na żywo', description: 'Pozostań w kontakcie' },
    { number: '03', title: 'Wydarzenia', description: 'Koordynuj działania' },
    { number: '04', title: 'Zespoły', description: 'Zarządzaj grupami' },
  ],
  audiences: ['Trening personalny', 'Przedszkole'],
};

export const workMeta = {
  title: 'Praca zawodowa | Matthias Löhden',
  description:
    'Profesjonalne projekty oprogramowania autorstwa Matthiasa Löhdena w TopRed Media GmbH, obejmujące naukę, zarządzanie sklepem, Digital Signage i platformy komunikacyjne.',
};
