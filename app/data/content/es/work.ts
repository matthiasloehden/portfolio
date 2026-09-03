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
    'Nuestro equipo desarrolló una plataforma central para gestionar datos de las tiendas, tareas operativas y flujos de trabajo. Cada tienda tenía un perfil estructurado con datos de ubicación, planos, horarios de apertura y procesos como cambios de ubicación y código postal.',
    'Los datos de las tiendas, las tareas y otros datos de la plataforma podían exportarse a informes de Excel para su posterior análisis. El proceso también funcionaba a la inversa: las hojas de cálculo editadas podían cargarse y sincronizarse de nuevo con la base de datos.',
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
  title: [['Señalización ', 'digital'], 'sistema de control'],
  accent: [false, false],
  summary: 'Servicio Python y UI Electron para control remoto de pantalla y monitoreo operativo.',
  paragraphs: [
    'Fui responsable de un servicio Python con una interfaz Electron que se ejecutaba en reproductores de señalización digital y controlaba las pantallas conectadas durante la reproducción de anuncios.',
    'El servicio se comunicaba con las pantallas mediante RS-232, enviaba el estado del reproductor a la plataforma central y podía administrarse de forma remota mediante la interfaz Electron.',
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
    'Paquetes de aplicación reutilizables combinados en plataformas específicas para cada cliente con funciones de contenido, comunicación y control de acceso.',
  paragraphs: [
    'En nuestros proyectos, las funciones recurrentes se desarrollaban como paquetes reutilizables en lugar de volver a implementarlas para cada aplicación.',
    'Estos paquetes se convirtieron en la base de una plataforma configurable que TopRed Media podía adaptar a cada cliente.',
    'Funciones como contenido CMS, chat en vivo, eventos, equipos, roles y permisos podían combinarse y configurarse para cada cliente, lo que permitía distintos casos de uso, desde el entrenamiento personal hasta la comunicación en guarderías.',
  ],
  facts: [
    { label: 'Arquitectura', value: 'Base de aplicación modular' },
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
    'En TopRed Media GmbH, contribuí a lo largo de todo el ciclo de vida de aplicaciones empresariales en producción, desde su desarrollo inicial hasta años de desarrollo continuo y mantenimiento.',
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
    'Desarrollo backend, paquetes reutilizables y diseño modular de aplicaciones',
    'Pruebas automatizadas, CI/CD, despliegue y configuración de servidores',
    'Aplicaciones de una sola página con Laravel, Vue e Inertia.js',
    'Almacenamiento en caché y evaluación de permisos de usuario complejos con Redis',
    'Búsqueda y filtrado de grandes conjuntos de datos con Meilisearch',
    'Integración de aplicaciones con servicios externos y sistemas físicos.',
  ],
};

export const workClosing: WorkClosingContent = {
  kickerPrefix: '/',
  kicker: 'Ámbito profesional',
  title: ['Acerca de estos', 'proyectos.'],
  accent: [false, true],
  description:
    'En conjunto, estos proyectos muestran la variedad de sistemas en los que trabajé durante seis años de desarrollo profesional de software, desde aplicaciones web empresariales hasta software que interactúa con hardware físico.',
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
