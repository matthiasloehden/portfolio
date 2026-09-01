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
  listTitle: 'Plataforma de aprendizaje',
  listCategory: 'Plataforma de aprendizaje',
  category: 'Cliente empresarial',
  type: 'Aprendizaje y contenido',
  title: ['Empresa', ['aprendiendo', ' plataforma']],
  accent: [false, true],
  summary:
    'Plataforma de aprendizaje con un CMS personalizado, acceso basado en roles y múltiples formatos de contenido.',
  paragraphs: [
    'Nuestro equipo en TopRed Media fue responsable de desarrollar la aplicación y administrar su contenido. Su CMS personalizado admitía eventos, vídeos, podcasts y artículos en un solo sistema.',
    'Los derechos de acceso personalizados controlaban quién podía acceder a partes específicas de la plataforma, lo que convertía los permisos en una capacidad central del producto junto con la publicación.',
  ],
  facts: [
    { label: 'Objetivo', value: 'Aprendizaje y conocimiento' },
    { label: 'Entrega', value: 'CMS personalizado y derechos de acceso' },
    { label: 'Formatos', value: 'Eventos, vídeos, podcasts, artículos.' },
  ],
};

export const retailCase: WorkCaseStudyContent = {
  id: 'retail-operations',
  number: '02',
  listTitle: 'Operaciones minoristas',
  listCategory: 'Operaciones de tienda',
  category: 'Cliente empresarial',
  type: 'Operaciones minoristas',
  title: [['Minorista', ' operaciones'], 'plataforma'],
  accent: [true, false],
  summary: 'Plataforma operativa para datos de tienda, tareas, flujos de trabajo e informes basados ​​en Excel.',
  paragraphs: [
    'Nuestro equipo creó una plataforma central donde los empleados del taller recibieron y completaron tareas operativas, incluida la documentación del trabajo completado con la carga de fotografías.',
    'Cada tienda tenía su propio perfil que contenía datos de ubicación, distribución de plantas, horarios de apertura, tareas abiertas y cerradas y flujos de trabajo para cambios postales y de ubicación.',
    'Los análisis de la plataforma reunieron datos de tiendas, tareas y plataformas relacionadas en informes de Excel. El flujo también funcionó a la inversa: las hojas de cálculo editadas se podían cargar y sincronizar nuevamente con la base de datos.',
  ],
  facts: [
    { label: 'Objetivo', value: 'Gestión de tiendas y tareas.' },
    { label: 'Datos', value: 'Ubicaciones, diseños, horarios, tareas.' },
    { label: 'Informes', value: 'Sincronización bidireccional de Excel/base de datos' },
  ],
};

export const signageCase: WorkCaseStudyContent = {
  id: 'signage-control',
  number: '03',
  listTitle: 'Control de señalización',
  listCategory: 'Señalización digital',
  category: 'Cliente empresarial',
  type: 'Señalización digital',
  title: ['Digital', ['señalización', ' control'], 'sistema'],
  accent: [false, true, false],
  summary: 'Servicio Python y UI Electron para control remoto de pantalla y monitoreo operativo.',
  paragraphs: [
    'Fui responsable de un servicio Python con un Electron frontend que se ejecutaba en reproductores de señalización digital y controlaba sus pantallas conectadas mientras se reproducían los anuncios.',
    'El servicio se comunicaba con cada pantalla a través de RS-232 y enviaba el estado del jugador a la plataforma central de operaciones minoristas para su análisis. Los operadores podrían conectarse a través de administración remota y utilizar la interfaz Electron para controlar el servicio.',
  ],
  facts: [
    { label: 'mi responsabilidad', value: 'Servicio Python y UI electrónica' },
    { label: 'Enlace de hardware', value: 'Control de pantalla RS-232' },
    { label: 'Operaciones', value: 'Informes de estado y control remoto' },
  ],
};

export const clientCase: WorkCaseStudyContent = {
  id: 'client-platform',
  number: '04',
  listTitle: 'Plataforma de cliente',
  listCategory: 'CMS y comunicación',
  category: 'TopRed Media',
  type: 'Producto de la empresa',
  title: ['Configurable', 'plataforma de cliente'],
  accent: [true, false],
  summary:
    'Una base de aplicación compartida con módulos específicos del cliente para contenido, comunicación y control de acceso.',
  paragraphs: [
    'Nuestro equipo consolidó paquetes reutilizables y funciones de otros proyectos en una plataforma de producto configurable que TopRed Media ofreció a los clientes. Módulos como contenido CMS, artículos, chat en vivo, eventos, equipos, roles y permisos se pueden habilitar y configurar individualmente para cada cliente.',
    'La misma fundación apoyó casos de uso tan diferentes como la comunicación entre un entrenador personal y los clientes o la coordinación dentro de una guardería, sin mantener un producto separado para cada cliente.',
  ],
  facts: [
    { label: 'Objetivo', value: 'Contenido y comunicación' },
    { label: 'Módulos', value: 'Contenido, chat, eventos, equipos, acceso.' },
    { label: 'Modelo', value: 'Funciones habilitadas por cliente' },
  ],
};

export const workCases = [learningCase, retailCase, signageCase, clientCase];

export const workHero: WorkHeroContent = {
  kickerPrefix: '[ 2019-2025 ]',
  kicker: 'Desarrollo de software profesional',
  title: ['Producción', 'software.'],
  accent: [false, true],
  introduction: [
    'En TopRed Media GmbH, contribuí a lo largo de todo el ciclo de vida de las aplicaciones empresariales de producción, desde el desarrollo inicial hasta años de desarrollo de funciones, refactorización, integraciones y mantenimiento.',
    'Trabajando en un equipo de tres desarrolladores, contribuí en todo el conjunto a medida que los requisitos, los flujos de trabajo y los productos mismos evolucionaban continuamente.',
  ],
  facts: [
    { label: 'Compañía', value: 'TopRed Media GmbH' },
    { label: 'Role', value: 'Aprendiz → Desarrollador full-stack' },
    { label: 'Sistemas', value: 'Cuatro proyectos seleccionados' },
  ],
  scrollLabel: 'Explora el trabajo seleccionado',
  scrollHref: '#work-list',
};

export const workOverview: WorkOverviewContent = {
  id: 'work-list',
  titleId: 'work-list-title',
  label: 'Trabajo profesional seleccionado',
  title: ['Cuatro seleccionados', 'producción', 'sistemas.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(workCases),
};

export const workContext: WorkContextContent = {
  kicker: 'Descripción general de la tecnología',
  title: ['Centro', 'tecnologías', 'a través de estos', 'proyectos.'],
  accent: [false, true, false, false],
  stack: {
    languages: ['PHP', 'SQL', 'JavaScript'],
    backend: ['Laravel', 'MySQL', 'Redis', 'Meilisearch'],
    frontend: ['Vue', 'Inertia.js', 'Tailwind CSS'],
  },
  highlightsLabel: 'Reflejos',
  highlights: [
    'Arquitectura backend, modelado de datos y flujos de trabajo de aplicaciones',
    'Aplicaciones de una sola página con Laravel, Vue e Inertia.js',
    'Almacenamiento en caché y evaluación de permisos de usuario complejos con Redis',
    'Búsqueda y filtrado de grandes conjuntos de datos con Meilisearch',
    'Excel bidireccional y sincronización de bases de datos.',
    'Integración de aplicaciones con servicios externos y sistemas físicos.',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Ámbito profesional',
  title: ['Acerca de estos', 'proyectos.'],
  accent: [false, true],
  description:
    'Estos proyectos de clientes y el producto propiedad de la empresa se describen intencionalmente a nivel de sistema. Juntos, representan la gama de software de producción en el que trabajé: flujos de trabajo de aplicaciones, interfaces de usuario, datos, permisos, búsqueda, integraciones, mantenimiento y software que interactúa con sistemas físicos.',
  actions: [
    { label: 'iniciar una conversación', href: `mailto:${site.email}` },
    { label: 'Ver trabajos universitarios', symbol: '→', to: APP_ROUTES.academic, variant: 'text' },
  ],
};

export const learningPanel: WorkLearningPanelContent = {
  frame: { title: 'biblioteca.de.contenido', meta: 'publicación con reconocimiento de acceso' },
  navigation: ['Descripción general', 'Eventos', 'Medios de comunicación', 'Artículos'],
  featured: { title: 'Evento de aprendizaje', description: 'Registro · insignias · comentarios' },
  formats: [
    { symbol: '▶', title: 'Video', description: 'Bajo demanda' },
    { symbol: '◉', title: 'Podcast', description: 'series de audio' },
    { symbol: '¶', title: 'Artículo', description: 'Editorial' },
  ],
  status: 'Entrega de contenido basada en roles',
};

export const retailPanel: WorkRetailPanelContent = {
  frame: { title: 'tienda.registro', meta: 'fuente operativa de verdad' },
  code: 'SHOP / 042',
  title: 'Perfil de ubicación',
  status: 'Registro activo',
  fields: [
    { label: 'Horario de apertura', value: 'Configurado' },
    { label: 'Distribución del piso', value: 'Disponible' },
    { label: 'Datos postales', value: 'Administrado' },
    { label: 'Tareas', value: 'Asignado' },
  ],
  sync: {
    label: 'Las hojas de Excel podrían exportar datos y sincronizar los cambios cargados',
    source: 'Base de datos',
    target: '.XLSX',
  },
};

export const signagePanel: WorkSignagePanelContent = {
  frame: { title: 'control.de.pantalla', meta: 'jugador en línea' },
  remote: { label: 'REMOTO', title: 'Administración' },
  player: [
    { label: 'IU DE CONTROL', title: 'Electrón' },
    { label: 'SERVICIO', title: 'Pitón' },
  ],
  outputs: [
    { connection: 'RS-232 →', title: 'Mostrar', description: 'Control de reproducción' },
    { connection: 'Estado →', title: 'Operaciones', description: 'Analítica' },
  ],
};

export const clientPanel: WorkClientPanelContent = {
  frame: { title: 'módulos.de.plataforma', meta: 'configurado por cliente' },
  modules: [
    { number: '01', title: 'CMS', description: 'Publicar contenido' },
    { number: '02', title: 'chat en vivo', description: 'Mantente conectado' },
    { number: '03', title: 'Eventos', description: 'Coordinar actividad' },
    { number: '04', title: 'equipos', description: 'Administrar grupos' },
  ],
  audiences: ['entrenamiento personal', 'Kindergarten'],
};

export const workMeta = {
  title: 'Trabajo Profesional | Matthias Löhden',
  description:
    'Proyectos de software profesionales de Matthias Löhden en TopRed Media GmbH, que incluyen aprendizaje, gestión de tiendas, señalización digital y plataformas de comunicación.',
};
