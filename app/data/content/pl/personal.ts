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
  listTitle: 'Wkłady typu open source',
  listCategory: 'Funkcje i poprawki',
  category: 'Otwarte źródło',
  type: 'Przydatne zmiany, udostępnione z powrotem',
  title: ['Ulepszanie', ['narzędzia', ' Już używam.']],
  accent: [false, true],
  lead: 'Moje osobiste projekty często zaczynają się od praktycznej potrzeby. Czasami najlepszym miejscem do rozwiązania tego problemu jest góra rzeki.',
  paragraphs: [
    'Wnoszę funkcje i poprawki do narzędzi, których faktycznie używam, od oprogramowania do inteligentnego domu i zdalnego sterowania po zarządzanie serwerami gier.',
    'Praca w istniejących bazach kodu nauczyła mnie rozumieć nieznane systemy, porównywać różne podejścia i znajdować rozwiązania, które w naturalny sposób pasują do istniejącego projektu.',
  ],
  tags: ['Open source', 'Docker', 'Networking', 'Debugging'],
};

export const homelabSection: PersonalSectionContent = {
  id: 'homelab',
  number: '02',
  listTitle: 'Systemy hostowane samodzielnie',
  listCategory: 'Docker i lokalna sztuczna inteligencja',
  category: 'Laboratorium domowe',
  type: 'Infrastruktura w domu',
  title: ['Działanie', 'oprogramowanie', 'poza lokalnym hostem.'],
  accent: [false, true, false],
  lead: 'Używam własnego komputera, aby dowiedzieć się, jak zachowują się aplikacje, gdy zależą od kontenerów, usług i otaczających je zasobów.',
  paragraphs: [
    'Używam Dockera do uruchamiania i izolowania usług na moim własnym sprzęcie, hostowania aplikacji i obciążeń serwerów gier oraz eksperymentuję z lokalnym uruchamianiem dużych modeli językowych.',
    'Samo zarządzanie środowiskiem daje mi praktyczne doświadczenie w zakresie wdrażania, sieci, przechowywania i ograniczeń zasobów poza maszyną programistyczną.',
  ],
  tags: ['Docker', 'Server hosting', 'Local LLMs', 'Self-hosting'],
};

export const learningSection: PersonalSectionContent = {
  id: 'learning',
  number: '03',
  listTitle: 'Od tranzystorów po architekturę',
  listCategory: 'Uczenie się od pierwszych zasad',
  category: 'Nauka',
  type: 'Od niskiego poziomu po architekturę',
  title: ['Z', ['tranzystory', ' Do'], ['oprogramowanie ', 'architektura.']],
  accent: [false, true, false],
  lead: 'Lubię rozumieć technologię od najniższych poziomów wzwyż.',
  paragraphs: [
    'Zrozumienie abstrakcji oprogramowania często wymaga zbadania warstw znajdujących się pod nimi. Twórcy, których obserwuję, badają ten stos poprzez logikę cyfrową, architekturę komputera, systemy operacyjne, algorytmy, matematykę i inżynierię.',
    'Tematyka jest różna, ale pytanie pozostaje takie samo: jak system faktycznie działa? Śledzenie jej od tranzystorów i bramek logicznych w górę pomaga mi podejmować bardziej przemyślane decyzje w projektowaniu i architekturze oprogramowania.',
  ],
  tags: ['Computer science', 'Engineering', 'Mathematics'],
};

export const hardwareSection: PersonalSectionContent = {
  id: 'hardware',
  number: '04',
  listTitle: 'Niestandardowy sprzęt komputerowy',
  listCategory: 'Budowanie i chłodzenie',
  category: 'Sprzęt komputerowy',
  type: 'Zbudowany, dostrojony, zrozumiały',
  title: ['Maszyna', 'też ma znaczenie.'],
  accent: [true, false],
  lead: 'Moje zainteresowanie technologią nie kończy się na oprogramowaniu. Pasjonuję się sprzętem komputerowym i lubię samodzielnie budować systemy.',
  paragraphs: [
    'Mój komputer wykorzystuje niestandardową pętlę chłodzenia wodą z czterema grzejnikami i dwiema pompami. Planowanie i budowanie łączy w sobie to, co lubię najbardziej w sprzęcie: precyzję, wydajność i zrozumienie, jak każda część wpływa na całość.',
    'Budowa komputerów PC daje mi fizyczny odpowiednik pracy z oprogramowaniem. Każdy komponent ma swoją rolę, każde ograniczenie wpływa na system, a drobne szczegóły mają znaczenie.',
  ],
  tags: ['PC building', 'Custom loop', '4 radiators', '2 pumps'],
};

export const personalSections = [openSourceSection, homelabSection, learningSection, hardwareSection];

export const personalHero: PersonalHeroContent = {
  kickerPrefix: '[ OTWARTE / CIEKAWY ]',
  kicker: 'Osobiste projekty i zainteresowania',
  title: ['Zbudowany z', 'ciekawość.'],
  accent: [false, true],
  introduction: [
    'Poza pracą zawodową i uniwersytecką, współtworzę narzędzia, których używam, uruchamiam systemy w domu, ciągle się uczę i składam komputery aż do pętli chłodzącej.',
  ],
  facts: [
    { label: 'Kod', value: 'Java, TypeScript i open source' },
    { label: 'Systemy', value: 'Docker, hosting i lokalna sztuczna inteligencja' },
    { label: 'Sprzęt komputerowy', value: 'Zbudowany na zamówienie i chłodzony wodą' },
  ],
  scrollLabel: 'Przeglądaj projekty i zainteresowania',
  scrollHref: '#personal-list',
};

export const personalOverview: PersonalOverviewContent = {
  id: 'personal-list',
  titleId: 'personal-list-title',
  label: 'Praca dla klientów zewnętrznych i na uniwersytecie',
  title: ['Projektowanie,', ['systemy', ' &'], 'zainteresowania techniczne.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(personalSections),
};

export const personalClosing: PageClosingContent = {
  kickerPrefix: '/ ALWAYS LEARNING',
  kicker: 'Ciekawostka w praktyce',
  title: ['Najlepsze', ['projektowanie', ' start'], 'z pragnieniem', 'wiedzieć więcej.'],
  accent: [false, true, false, true],
  description:
    'Niezależnie od tego, czy jest to żądanie ściągnięcia, kontener czy pętla chłodząca, uczę się, rozumiejąc system i sprawiając, że działa on w prawdziwym celu.',
  actions: [
    { label: 'Rozpocznij rozmowę', href: `mailto:${site.email}` },
    {
      label: 'Zobacz źródło',
      symbol: '→',
      href: site.sourceUrl,
      variant: 'text',
    },
  ],
};

export const contributions: OpenSourceContribution[] = [
  {
    status: 'Połączone',
    category: 'Biblioteka zdalnego sterowania',
    title: 'Inteligentne sterowanie domem',
    description:
      'Dodano obsługę protokołu TCP do biblioteki zdalnego sterowania w celu kontrolowania urządzeń sieciowych.',
    href: 'https://github.com/andrewfraley/magic_mapper/pull/22',
  },
  {
    status: 'Otwarte',
    category: 'Panel serwera gier',
    title: 'Serwery gier na żądanie',
    description: 'Rozszerzono istniejący serwer proxy, aby obudzić zatrzymane serwery podczas połączenia gracza.',
    href: 'https://github.com/discohaus/discopanel/pull/128',
  },
  {
    status: 'Naprawił',
    category: 'Wtyczka serwera gier',
    title: 'Poprawka błędu wtyczki',
    description: 'Wyśledzono i poprawiono błąd we wtyczce serwera gier.',
  },
];

export const learningGroups: LearningGroup[] = [
  {
    category: 'Informatyka',
    sources: [
      {
        name: 'Ben Eater',
        focus: 'Elektrotechnika, logika cyfrowa i architektura komputerowa poprzez komputery prototypowe',
        href: 'https://www.youtube.com/@BenEater',
      },
      {
        name: 'Core Dumped',
        focus: 'Systemy operacyjne, zarządzanie pamięcią, kompilatory i inne koncepcje oprogramowania niskiego poziomu',
        href: 'https://www.youtube.com/@CoreDumpped',
      },
      {
        name: 'Sebastian Lague',
        focus: 'Algorytmy, symulacje i grafika komputerowa badane w projektach programistycznych',
        href: 'https://www.youtube.com/@SebastianLague',
      },
    ],
  },
  {
    category: 'Matematyka',
    sources: [
      {
        name: '3Blue1Brown',
        focus: 'Wizualne podejście do matematycznych podstaw algorytmów, grafiki i uczenia maszynowego',
        href: 'https://www.youtube.com/@3blue1brown',
      },
    ],
  },
  {
    category: 'Inżynieria',
    sources: [
      {
        name: 'Branch Education',
        focus: 'Animowane wyjaśnienia, w jaki sposób procesory, pamięć i inny sprzęt wykonują oprogramowanie',
        href: 'https://www.youtube.com/@BranchEducation',
      },
      {
        name: 'Practical Engineering',
        focus: 'Jak ograniczenia inżynieryjne, kompromisy, tryby awarii i konserwacja kształtują infrastrukturę',
        href: 'https://www.youtube.com/@PracticalEngineeringChannel',
      },
    ],
  },
];

export const contributionPanel: PersonalContributionPanelContent = {
  frame: { title: 'wpisy.log', meta: '3 wybrane zmiany' },
  ariaLabel: 'Wybrane wkłady open source',
  items: contributions,
};

export const homelabPanel: PersonalHomelabPanelContent = {
  frame: { title: 'systemy domowe', meta: 'lokalna infrastruktura' },
  ariaLabel: 'Komputer osobisty obsługuje obciążenia Dockera, usługi serwerowe i lokalne modele wielojęzyczne',
  host: { code: 'HOST / 01', title: 'Komputer osobisty', description: 'Sprzęt lokalny' },
  services: [
    { type: 'CONTAINER', title: 'Docker', description: 'Isolated workloads' },
    { type: 'SERVICE', title: 'Hosting', description: 'Server workloads' },
    { type: 'MODEL', title: 'Local LLM', description: 'AI on-device' },
  ],
  status: 'Samodzielnie zarządzany',
  process: 'Wdrażaj → obserwuj → zrozum → ulepszaj',
};

export const learningPanel: PersonalLearningPanelContent = {
  frame: { title: 'lista.obserwowanych', meta: '6 twórców / 3 tematy' },
  ariaLabel: 'Ulubieni edukacyjni twórcy YouTube pogrupowani według tematów',
  groups: learningGroups,
};

export const coolingPanel: PersonalCoolingPanelContent = {
  frame: { title: 'pętla chłodząca', meta: '4 grzejniki / 2 pompy' },
  ariaLabel:
    'Niestandardowy system chłodzenia wodą komputera PC z czterema radiatorami, podwójną pompą, blokami wodnymi procesora, pamięci RAM i karty graficznej',
  status: { label: 'CHŁODZENIE CIECZĄ', title: 'Pętla niestandardowa' },
  facts: [
    { label: 'Grzejniki', value: '04×' },
    { label: 'Lakierki', value: '02×' },
    { label: 'Bloki', value: 'Procesor/RAM/GPU' },
  ],
};

export const personalMeta = {
  title: 'Projekty osobiste i zainteresowania | Matthias Löhden',
  description:
    'Wkłady typu open source, systemy hostowane samodzielnie, lokalna sztuczna inteligencja, ulubieni twórcy edukacyjni i niestandardowy sprzęt komputerowy autorstwa Matthiasa Löhdena.',
};
