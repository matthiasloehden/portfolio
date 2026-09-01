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
  listTitle: 'Analityka strumieniowania zdarzeń',
  listCategory: 'Skalowalność i duże zbiory danych',
  category: 'Skalowalność i duże zbiory danych',
  type: 'Architektura strumieniowa',
  title: [['Z ', 'surowe wydarzenia'], 'na żywo', ['operacyjny', ' pogląd.']],
  accent: [false, false, true],
  lead: 'Prototyp rozproszonego przetwarzania zdarzeń umożliwiający pozyskiwanie, przekształcanie i analizowanie danych przesyłanych strumieniowo w czasie rzeczywistym.',
  description:
    'Kafka oddzielił producentów wydarzeń od dalszych konsumentów. Flink sprawdzał, wzbogacał i agregował strumień przed zapisaniem rekordów gotowych do zapytania w ClickHouse. Grafana przekształciła te dane w operacyjny pulpit nawigacyjny do sprawdzania wolumenu, trendów i stanu przetwarzania.',
  notes: [
    {
      title: 'Pytanie inżynierskie',
      text: 'W jaki sposób modułowy potok może zamienić nieograniczony strumień zdarzeń w informacje, które są natychmiast przydatne?',
    },
    {
      title: 'Centrum',
      text: 'Skalowalność, transformacja strumieni, myślenie w czasie zdarzenia, analityka zorientowana na kolumny i obserwowalność.',
    },
  ],
};

export const passkeysCase: AcademicCaseStudyContent = {
  id: 'passkeys',
  number: '03',
  listTitle: 'Klucze FIDO2',
  listCategory: 'Projekt zabezpieczeń',
  category: 'Projekt zabezpieczeń',
  type: 'Architektura uwierzytelniania',
  title: [
    ['Bez hasła', ' zalogować się'],
    ['z ', 'Klucze FIDO2.'],
  ],
  accent: [true, false],
  lead: 'Weryfikacja koncepcji badająca bezpieczny projekt systemu i nowoczesne uwierzytelnianie, zbudowana wokół systemu logowania bez hasła opartego na FIDO2.',
  description:
    'Zamiast traktować bezpieczeństwo jako dodatkową warstwę, system został zaprojektowany w oparciu o przepływy uwierzytelniania, dane uwierzytelniające, granice zaufania i wrażliwe operacje. Rejestracja wiązała klucz publiczny z użytkownikiem, podczas gdy uwierzytelnianie wykorzystywało ceremonię wyzwanie-odpowiedź o określonym zakresie, chronioną przez przeglądarkę i moduł uwierzytelniający.',
  notes: [
    {
      title: 'Pytanie inżynierskie',
      text: 'W jaki sposób uwierzytelnianie może stać się łatwiejsze dla użytkowników, jednocześnie ograniczając narażenie na phishing i ponowne wykorzystanie danych uwierzytelniających?',
    },
    {
      title: 'Centrum',
      text: 'Bezpieczeństwo już w fazie projektowania, ceremonie WebAuthn, granice stron uzależnionych, weryfikacja wyzwań, przechowywanie danych uwierzytelniających i interfejs użytkownika odzyskiwania.',
    },
  ],
};

export const softwareEngineeringCase: AcademicCaseStudyContent = {
  id: 'software-engineering',
  number: '01',
  listTitle: 'Projekt inżynierii oprogramowania',
  listCategory: 'Cykl życia i jakość',
  category: 'Inżynieria oprogramowania',
  type: 'Projekt zespołowy',
  title: [['Z ', 'wymagania'], 'do', ['przetestowany', ' uwolnienie.']],
  accent: [false, false, true],
  lead: 'Ukończony projekt grupowy łączący metody z wcześniejszych kursów inżynierii oprogramowania w całym cyklu życia oprogramowania.',
  description:
    'Nasz zespół opracował aplikację internetową TypeScript do planowania i śledzenia czasu nauki, organizowania pracy poprzez bilety i kamienie milowe. Współpracowaliśmy przy wymaganiach, specyfikacji, projektowaniu, wdrażaniu, testowaniu i dokumentacji. Brałem udział w tych etapach, biorąc jednocześnie główną odpowiedzialność za architekturę i zarządzanie jakością.',
  notes: [
    {
      title: 'Pytanie inżynierskie',
      text: 'W jaki sposób zespół może zastosować metody inżynierii oprogramowania, aby dostarczyć identyfikowalną aplikację o gwarantowanej jakości w całym cyklu życia?',
    },
    {
      title: 'Centrum',
      text: 'Cykl życia oprogramowania, architektura, zarządzanie jakością, testowanie, dokumentacja i dostarczanie iteracyjne.',
    },
  ],
};

export const itsmCase: AcademicCaseStudyContent = {
  id: 'itsm',
  number: '04',
  listTitle: 'Zarządzanie usługami IT',
  listCategory: 'Operacje serwisowe',
  category: 'Operacje serwisowe',
  type: 'Model operacyjny',
  title: ['Projektowanie', ['lekki', ' Obsługa informatyczna'], 'model zarządzania.'],
  accent: [false, true, false],
  lead: 'Koncepcja zarządzania usługami oparta na ITIL i FitSM, definiująca własność, przepływ incydentów i żądań, ścieżki eskalacji i ciągłe doskonalenie.',
  description:
    'W modelu przełożono szersze wytyczne ramowe na lekkie i podlegające kontroli podejście operacyjne. ITIL zapewnił kontekst praktyczny, natomiast FitSM pomógł zdefiniować praktyczne minimum dla powtarzalnej jakości usług.',
  notes: [
    {
      title: 'Pytanie inżynierskie',
      text: 'Jaki jest najmniejszy użyteczny model procesu, który nadal zapewnia wyraźną własność i powtarzalną jakość usług?',
    },
    {
      title: 'Centrum',
      text: 'Operacje usługowe, przepływ incydentów, żądania usług, role, ścieżki eskalacji, myślenie na poziomie usług i ciągłe doskonalenie.',
    },
  ],
};

export const academicCases = [softwareEngineeringCase, streamingCase, passkeysCase, itsmCase];

export const academicHero: AcademicHeroContent = {
  kickerPrefix: '[ INFORMATYKA ]',
  kicker: 'Wybrana praca naukowa',
  title: ['Oprogramowanie,', ['systemy', ' &'], 'bezpieczeństwo.'],
  accent: [false, true, false],
  introduction: [
    'Cztery wybrane projekty obejmują inżynierię oprogramowania w całym cyklu życia, rozproszone przetwarzanie danych, uwierzytelnianie i bezpieczeństwo systemu oraz niezawodne działanie usług.',
  ],
  facts: [
    { label: 'Zajęcia', value: 'JavaScript, Java, Python, Prolog i R' },
    { label: 'Systemy i narzędzia', value: 'Kafka, Flink, ClickHouse, Grafana i WebAuthn' },
    { label: 'Centrum', value: 'Inżynieria oprogramowania, systemy i bezpieczeństwo' },
  ],
  scrollLabel: 'Zobacz projekty',
  scrollHref: '#academic-list',
};

export const academicOverview: AcademicOverviewContent = {
  id: 'academic-list',
  titleId: 'academic-list-title',
  label: 'Wybrane projekty uniwersyteckie',
  title: ['Cztery wybrane', 'uniwersytet', 'projektowanie.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(academicCases),
};

export const academicClosing: PageClosingContent = {
  kickerPrefix: '/',
  kicker: 'Zakres akademicki',
  title: [['Komputer ', 'nauka'], 'poza', ['aplikacja ', 'warstwa.']],
  accent: [false, false, false],
  description:
    'Projekty te łączą moje doświadczenie zawodowe z pracą akademicką w całym cyklu życia oprogramowania, rozproszonym przetwarzaniu danych, uwierzytelnianiu i bezpieczeństwie systemów oraz operacjach usług IT.',
  actions: [
    { label: 'Rozpocznij rozmowę', href: `mailto:${site.email}` },
    { label: 'Zobacz projekty osobiste', symbol: '→', to: APP_ROUTES.personal, variant: 'text' },
  ],
};

export const streamingPanel: AcademicStreamingPanelContent = {
  frame: { title: 'rurociąg.przepływ', meta: 'wydarzenie → wgląd' },
  ariaLabel: 'Dane przepływają od producentów poprzez Kafkę i Flink do ClickHouse i Grafana',
  nodes: [
    { name: 'Producers', description: 'Źródło zdarzenia' },
    { name: 'Kafka', description: 'Transport' },
    { name: 'Flink', description: 'Przetwarzanie' },
    { name: 'ClickHouse', description: 'Analityka' },
    { name: 'Grafana', description: 'Widoczność' },
  ],
};

export const engineeringPanel: AcademicEngineeringPanelContent = {
  frame: { title: 'lernzeit.manager', meta: 'planowanie nauki osobistej' },
  ariaLabel: 'Podgląd gotowej aplikacji webowej do zarządzania czasem nauki',
  navigation: ['Przegląd', 'Cele uczenia się', 'Planowanie', 'Czas skupienia', 'Analityka', 'Przypomnienia'],
  metrics: [
    { label: 'Aktywne cele', value: '2' },
    { label: 'Plan miesięczny', value: '38 godz' },
    { label: 'Czas skupienia', value: '8,1 godz' },
  ],
  goals: [
    { title: 'Modelowanie danych', status: 'W toku' },
    { title: 'Algebra liniowa', status: 'Planowany' },
  ],
  schedule: [
    { date: '26.07', title: 'Ćwiczenia normalizacyjne' },
    { date: '29.07', title: 'Ćwiczenia z przestrzenią wektorową' },
  ],
  facts: [
    { label: 'Projekt', value: 'Współpraca w grupie' },
    { label: 'Podstawowa odpowiedzialność', value: 'Architektura i zarządzanie jakością' },
    { label: 'Dostawa', value: 'Bilety, kamienie milowe i recenzje' },
  ],
  demo: {
    label: 'Zobacz prezentację na żywo',
    href: 'https://struperto.github.io/isef01-lernzeit-manager/',
  },
  status: 'Zakończony pełny cykl życia',
};

export const authenticationPanel: AcademicAuthenticationPanelContent = {
  frame: { title: 'ceremonia uwierzytelnienia', meta: 'przepływ klucza publicznego' },
  steps: [
    { number: '01', title: 'Wniosek', description: 'Serwer tworzy nowe wyzwanie.' },
    {
      number: '02',
      title: 'Sprawdź lokalnie',
      description: 'Użytkownik odblokowuje moduł uwierzytelniający powiązany z urządzeniem.',
    },
    {
      number: '03',
      title: 'Podpisać',
      description: 'Klucz prywatny podpisuje wyzwanie bez opuszczania uwierzytelniającego.',
    },
    { number: '04', title: 'Uprawomocnić', description: 'Serwer weryfikuje pochodzenie, wyzwanie i podpis.' },
  ],
  status: 'Nie przesłano wspólnego hasła',
};

export const servicePanel: AcademicServicePanelContent = {
  frame: { title: 'model.usługi', meta: 'mapowanie ramowe' },
  stages: [
    { number: '01', title: 'Schwytać', description: 'Nagraj i potwierdź' },
    { number: '02', title: 'Klasyfikować', description: 'Ustal priorytety i przypisz' },
    { number: '03', title: 'Rozstrzygać', description: 'Przywróć lub spełnij' },
    { number: '04', title: 'Uczyć się', description: 'Przejrzyj i ulepsz' },
  ],
  frameworks: [
    { name: 'ITIL', description: 'Practices, value, and continual improvement' },
    { name: 'FitSM', description: 'Lightweight requirements and clear accountability' },
  ],
};

export const academicMeta = {
  title: 'Projekty uniwersyteckie | Matthias Löhden',
  description:
    'Wybrane prace Matthiasa Löhdena z informatyki dotyczące skalowalnego przetwarzania zdarzeń, uwierzytelniania FIDO2, inżynierii oprogramowania stosowanego i operacji usługowych.',
};
