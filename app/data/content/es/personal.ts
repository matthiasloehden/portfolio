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
  listTitle: 'Contribuciones de código abierto',
  listCategory: 'Funciones y correcciones',
  category: 'Código abierto',
  type: 'Cambios útiles, compartidos nuevamente.',
  title: ['Mejorando el', ['herramientas', ' Ya lo uso.']],
  accent: [false, true],
  lead: 'Mis proyectos personales suelen comenzar con una necesidad práctica. A veces el mejor lugar para solucionarlo es aguas arriba.',
  paragraphs: [
    'Contribuyo con funciones y correcciones a las herramientas que realmente uso, desde software de hogar inteligente y control remoto hasta administración de servidores de juegos.',
    'Trabajar en bases de código existentes me ha enseñado a comprender sistemas desconocidos, comparar diferentes enfoques y encontrar soluciones que encajan naturalmente en el proyecto existente.',
  ],
  tags: ['Open source', 'Docker', 'Networking', 'Debugging'],
};

export const homelabSection: PersonalSectionContent = {
  id: 'homelab',
  number: '02',
  listTitle: 'Sistemas autohospedados',
  listCategory: 'Docker e IA local',
  category: 'Laboratorio casero',
  type: 'Infraestructura en casa',
  title: ['Correr', 'software', 'más allá del host local.'],
  accent: [false, true, false],
  lead: 'Utilizo mi propia PC para aprender cómo se comportan las aplicaciones cuando dependen de contenedores, servicios y recursos que las rodean.',
  paragraphs: [
    'Utilizo Docker para ejecutar y aislar servicios en mi propio hardware, alojar aplicaciones y cargas de trabajo de servidores de juegos, y experimento ejecutando grandes modelos de lenguaje localmente.',
    'Administrar el entorno por mí mismo me brinda experiencia práctica con la implementación, las redes, el almacenamiento y las limitaciones de recursos fuera de una máquina de desarrollo.',
  ],
  tags: ['Docker', 'Server hosting', 'Local LLMs', 'Self-hosting'],
};

export const learningSection: PersonalSectionContent = {
  id: 'learning',
  number: '03',
  listTitle: 'De los transistores a la arquitectura',
  listCategory: 'Aprendiendo de los primeros principios',
  category: 'Aprendiendo',
  type: 'Del bajo nivel a la arquitectura',
  title: ['De', ['transistores', ' a'], ['software ', 'arquitectura.']],
  accent: [false, true, false],
  lead: 'Disfruto entendiendo la tecnología desde los niveles más bajos hacia arriba.',
  paragraphs: [
    'Comprender las abstracciones de software a menudo requiere examinar las capas debajo de ellas. Los creadores que sigo exploran esa pila a través de la lógica digital, la arquitectura informática, los sistemas operativos, los algoritmos, las matemáticas y la ingeniería.',
    'Los temas varían, pero la pregunta sigue siendo la misma: ¿cómo funciona realmente el sistema? Seguirlo desde los transistores y las puertas lógicas hacia arriba me ayuda a tomar decisiones más deliberadas en el diseño y la arquitectura del software.',
  ],
  tags: ['Computer science', 'Engineering', 'Mathematics'],
};

export const hardwareSection: PersonalSectionContent = {
  id: 'hardware',
  number: '04',
  listTitle: 'Hardware de PC personalizado',
  listCategory: 'Construcción y refrigeración',
  category: 'Hardware',
  type: 'Construido, afinado, comprendido',
  title: ['la maquina', 'también importa.'],
  accent: [true, false],
  lead: 'Mi interés por la tecnología no se limita al software. Me apasiona el hardware de PC y disfruto construyendo sistemas yo mismo.',
  paragraphs: [
    'Mi PC utiliza un circuito de refrigeración por agua personalizado con cuatro radiadores y dos bombas. Planificarlo y construirlo reúne lo que más disfruto del hardware: precisión, rendimiento y comprensión de cómo cada parte afecta al todo.',
    'Construir PC me brinda una contraparte física del trabajo de software. Cada componente tiene una función, cada restricción afecta al sistema y los pequeños detalles importan.',
  ],
  tags: ['PC building', 'Custom loop', '4 radiators', '2 pumps'],
};

export const personalSections = [openSourceSection, homelabSection, learningSection, hardwareSection];

export const personalHero: PersonalHeroContent = {
  kickerPrefix: '[ ABIERTO / CURIOSO ]',
  kicker: 'Proyectos e intereses personales',
  title: ['Construido a partir de', 'curiosidad.'],
  accent: [false, true],
  introduction: [
    'Más allá del trabajo profesional y universitario, contribuyo con las herramientas que uso, ejecuto sistemas en casa, sigo aprendiendo y construyo PC hasta el circuito de enfriamiento.',
  ],
  facts: [
    { label: 'Código', value: 'Java, TypeScript y código abierto' },
    { label: 'Sistemas', value: 'Docker, hosting e IA local' },
    { label: 'Hardware', value: 'Hecho a medida y refrigerado por agua' },
  ],
  scrollLabel: 'Explorar proyectos e intereses',
  scrollHref: '#personal-list',
};

export const personalOverview: PersonalOverviewContent = {
  id: 'personal-list',
  titleId: 'personal-list-title',
  label: 'Cliente externo y trabajo universitario.',
  title: ['Proyectos,', ['sistemas', ' &'], 'intereses técnicos.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(personalSections),
};

export const personalClosing: PageClosingContent = {
  kickerPrefix: '/ ALWAYS LEARNING',
  kicker: 'Curiosidad en la práctica.',
  title: ['El mejor', ['proyectos', ' comenzar'], 'con ganas', 'para saber más.'],
  accent: [false, true, false, true],
  description:
    'Ya sea una solicitud de extracción, un contenedor o un circuito de enfriamiento, aprendo entendiendo el sistema y haciéndolo funcionar para un propósito real.',
  actions: [
    { label: 'iniciar una conversación', href: `mailto:${site.email}` },
    {
      label: 'Ver fuente',
      symbol: '→',
      href: site.sourceUrl,
      variant: 'text',
    },
  ],
};

export const contributions: OpenSourceContribution[] = [
  {
    status: 'Fusionado',
    category: 'Biblioteca de control remoto',
    title: 'Control del hogar inteligente',
    description: 'Se agregó soporte TCP a una biblioteca de control remoto para controlar dispositivos de red.',
    href: 'https://github.com/andrewfraley/magic_mapper/pull/22',
  },
  {
    status: 'Abierto',
    category: 'Panel del servidor de juegos',
    title: 'Servidores de juegos bajo demanda',
    description: 'Se extendió el proxy existente para reactivar los servidores detenidos en la conexión del jugador.',
    href: 'https://github.com/discohaus/discopanel/pull/128',
  },
  {
    status: 'Fijado',
    category: 'Complemento de servidor de juegos',
    title: 'Corrección de errores del complemento',
    description: 'Localicé y corrigí un error en un complemento del servidor de juegos.',
  },
];

export const learningGroups: LearningGroup[] = [
  {
    category: 'Ciencias de la Computación',
    sources: [
      {
        name: 'Ben Eater',
        focus: 'Ingeniería eléctrica, lógica digital y arquitectura informática a través de ordenadores de placa.',
        href: 'https://www.youtube.com/@BenEater',
      },
      {
        name: 'Core Dumped',
        focus: 'Sistemas operativos, gestión de memoria, compiladores y otros conceptos de software de bajo nivel.',
        href: 'https://www.youtube.com/@CoreDumpped',
      },
      {
        name: 'Sebastian Lague',
        focus: 'Algoritmos, simulaciones y gráficos por computadora explorados a través de proyectos de programación.',
        href: 'https://www.youtube.com/@SebastianLague',
      },
    ],
  },
  {
    category: 'Matemáticas',
    sources: [
      {
        name: '3Blue1Brown',
        focus: 'Enfoques visuales de los fundamentos matemáticos de algoritmos, gráficos y aprendizaje automático.',
        href: 'https://www.youtube.com/@3blue1brown',
      },
    ],
  },
  {
    category: 'Ingeniería',
    sources: [
      {
        name: 'Branch Education',
        focus: 'Explicaciones animadas de cómo los procesadores, la memoria y otro hardware ejecutan el software.',
        href: 'https://www.youtube.com/@BranchEducation',
      },
      {
        name: 'Practical Engineering',
        focus:
          'Cómo las restricciones de ingeniería, las compensaciones, los modos de falla y el mantenimiento dan forma a la infraestructura',
        href: 'https://www.youtube.com/@PracticalEngineeringChannel',
      },
    ],
  },
];

export const contributionPanel: PersonalContributionPanelContent = {
  frame: { title: 'contribuciones.log', meta: '3 cambios seleccionados' },
  ariaLabel: 'Contribuciones seleccionadas de código abierto',
  items: contributions,
};

export const homelabPanel: PersonalHomelabPanelContent = {
  frame: { title: 'sistemas.hogar', meta: 'infraestructura local' },
  ariaLabel:
    'Una computadora personal aloja cargas de trabajo de Docker, servicios de servidor y modelos de lenguaje local de gran tamaño.',
  host: { code: 'HOST / 01', title: 'PC personal', description: 'Hardware local' },
  services: [
    { type: 'CONTAINER', title: 'Docker', description: 'Isolated workloads' },
    { type: 'SERVICE', title: 'Hosting', description: 'Server workloads' },
    { type: 'MODEL', title: 'Local LLM', description: 'AI on-device' },
  ],
  status: 'Autogestionado',
  process: 'Implementar → observar → comprender → mejorar',
};

export const learningPanel: PersonalLearningPanelContent = {
  frame: { title: 'lista de vigilancia', meta: '6 creadores / 3 sujetos' },
  ariaLabel: 'Creadores educativos favoritos de YouTube agrupados por tema',
  groups: learningGroups,
};

export const coolingPanel: PersonalCoolingPanelContent = {
  frame: { title: 'bucle.de.enfriamiento', meta: '4 radiadores / 2 bombas' },
  ariaLabel:
    'Sistema de refrigeración por agua personalizado para PC con cuatro radiadores, bombas duales, bloques de agua para CPU, RAM y GPU',
  status: { label: 'REFRIGERACIÓN LÍQUIDA', title: 'Bucle personalizado' },
  facts: [
    { label: 'Radiadores', value: '04×' },
    { label: 'Zapatillas', value: '02×' },
    { label: 'Bloques', value: 'CPU/RAM/GPU' },
  ],
};

export const personalMeta = {
  title: 'Proyectos e intereses personales | Matthias Löhden',
  description:
    'Contribuciones de código abierto, sistemas autohospedados, IA local, creadores educativos favoritos y hardware de PC personalizado de Matthias Löhden.',
};
