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
  listTitle: 'Análisis de transmisión de eventos',
  listCategory: 'Escalabilidad y big data',
  category: 'Escalabilidad y big data',
  type: 'Arquitectura de transmisión',
  title: [['De ', 'eventos crudos'], 'a una vida', ['operacional', ' vista.']],
  accent: [false, false, true],
  lead: 'Un prototipo de procesamiento de eventos distribuido para ingerir, transformar y analizar datos en tiempo real.',
  description:
    'Kafka desvinculó a los productores de eventos de los consumidores intermedios. Flink validó, enriqueció y agregó la transmisión antes de escribir registros listos para consulta en ClickHouse. Grafana convirtió esos datos en un panel operativo para inspeccionar el volumen, las tendencias y el estado del procesamiento.',
  notes: [
    {
      title: 'pregunta de ingenieria',
      text: '¿Cómo puede una canalización modular convertir un flujo ilimitado de eventos en información que sea útil de inmediato?',
    },
    {
      title: 'Enfocar',
      text: 'Escalabilidad, transformaciones de flujo, pensamiento en el momento del evento, análisis orientado a columnas y observabilidad.',
    },
  ],
};

export const passkeysCase: AcademicCaseStudyContent = {
  id: 'passkeys',
  number: '03',
  listTitle: 'Claves de acceso FIDO2',
  listCategory: 'Diseño de seguridad',
  category: 'Diseño de seguridad',
  type: 'Arquitectura de autenticación',
  title: [
    ['Sin contraseña', ' iniciar sesión'],
    ['con ', 'Claves de acceso FIDO2.'],
  ],
  accent: [true, false],
  lead: 'Una prueba de concepto que explora el diseño de sistemas seguros y la autenticación moderna, construida alrededor de un sistema de inicio de sesión sin contraseña basado en FIDO2.',
  description:
    'En lugar de tratar la seguridad como una capa adicional, el sistema se diseñó en torno a flujos de autenticación, credenciales, límites de confianza y operaciones confidenciales. El registro asociaba una clave pública con el usuario, mientras que la autenticación utilizaba una ceremonia de desafío-respuesta protegida por el navegador y el autenticador.',
  notes: [
    {
      title: 'pregunta de ingenieria',
      text: '¿Cómo puede la autenticación resultar más fácil para los usuarios y al mismo tiempo reducir la exposición al phishing y la reutilización de credenciales?',
    },
    {
      title: 'Enfocar',
      text: 'Seguridad por diseño, ceremonias WebAuthn, límites de partes de confianza, validación de desafíos, almacenamiento de credenciales y recuperación de UX.',
    },
  ],
};

export const softwareEngineeringCase: AcademicCaseStudyContent = {
  id: 'software-engineering',
  number: '01',
  listTitle: 'proyecto de ingenieria de software',
  listCategory: 'Ciclo de vida y calidad',
  category: 'Ingeniería de software',
  type: 'proyecto de equipo',
  title: [['De ', 'requisitos'], 'a un', ['probado', ' liberar.']],
  accent: [false, false, true],
  lead: 'Un proyecto grupal completado que reúne métodos de cursos anteriores de ingeniería de software a lo largo de todo el ciclo de vida de desarrollo.',
  description:
    'Nuestro equipo desarrolló una aplicación web TypeScript para planificar y rastrear el tiempo de aprendizaje, organizando el trabajo a través de tickets e hitos. Colaboramos en requisitos, especificaciones, diseño, implementación, pruebas y documentación. Contribuí en estas etapas mientras asumía la responsabilidad principal de la arquitectura y la gestión de calidad.',
  notes: [
    {
      title: 'pregunta de ingenieria',
      text: '¿Cómo puede un equipo aplicar métodos de ingeniería de software para ofrecer una aplicación rastreable y de calidad garantizada durante todo el ciclo de vida?',
    },
    {
      title: 'Enfocar',
      text: 'Ciclo de vida del software, arquitectura, gestión de calidad, pruebas, documentación y entrega iterativa.',
    },
  ],
};

export const itsmCase: AcademicCaseStudyContent = {
  id: 'itsm',
  number: '04',
  listTitle: 'gestión de servicios de TI',
  listCategory: 'Operaciones de servicio',
  category: 'Operaciones de servicio',
  type: 'Modelo operativo',
  title: ['Diseñando un', ['ligero', ' servicio de TI'], 'modelo de gestión.'],
  accent: [false, true, false],
  lead: 'Un concepto de gestión de servicios basado en ITIL y FitSM, que define la propiedad, los flujos de incidentes y solicitudes, las rutas de escalamiento y la mejora continua.',
  description:
    'El modelo tradujo una orientación marco más amplia en un enfoque operativo ligero y auditable. ITIL proporcionó el contexto práctico, mientras que FitSM ayudó a definir un mínimo práctico para una calidad de servicio repetible.',
  notes: [
    {
      title: 'pregunta de ingenieria',
      text: '¿Cuál es el modelo de proceso útil más pequeño que aún crea una propiedad clara y una calidad de servicio repetible?',
    },
    {
      title: 'Enfocar',
      text: 'Operaciones de servicio, flujo de incidentes, solicitudes de servicio, roles, rutas de escalamiento, pensamiento a nivel de servicio y mejora continua.',
    },
  ],
};

export const academicCases = [softwareEngineeringCase, streamingCase, passkeysCase, itsmCase];

export const academicHero: AcademicHeroContent = {
  kickerPrefix: '[ CIENCIAS DE LA COMPUTACIÓN ]',
  kicker: 'Trabajo académico seleccionado',
  title: ['Software,', ['sistemas', ' &'], 'seguridad.'],
  accent: [false, true, false],
  introduction: [
    'Cuatro proyectos seleccionados cubren ingeniería de software a lo largo de todo el ciclo de vida, procesamiento de datos distribuidos, autenticación y seguridad del sistema, y ​​operaciones de servicios confiables.',
  ],
  facts: [
    { label: 'Trabajo de curso', value: 'JavaScript, Java, Python, Prolog y R' },
    { label: 'Sistemas y herramientas', value: 'Kafka, Flink, ClickHouse, Grafana y WebAuthn' },
    { label: 'Enfocar', value: 'Ingeniería de software, sistemas y seguridad.' },
  ],
  scrollLabel: 'Ver proyectos',
  scrollHref: '#academic-list',
};

export const academicOverview: AcademicOverviewContent = {
  id: 'academic-list',
  titleId: 'academic-list-title',
  label: 'Proyectos universitarios seleccionados',
  title: ['Cuatro seleccionados', 'universidad', 'proyectos.'],
  accent: [false, true, false],
  items: createCaseStudyListItems(academicCases),
};

export const academicClosing: PageClosingContent = {
  kickerPrefix: '/',
  kicker: 'Ámbito académico',
  title: [['Computadora ', 'ciencia'], 'más allá del', ['solicitud ', 'capa.']],
  accent: [false, false, false],
  description:
    'Estos proyectos conectan mi experiencia profesional con el trabajo académico en todo el ciclo de vida del software, procesamiento de datos distribuidos, autenticación y seguridad del sistema, y ​​operaciones de servicios de TI.',
  actions: [
    { label: 'iniciar una conversación', href: `mailto:${site.email}` },
    { label: 'Ver proyectos personales', symbol: '→', to: APP_ROUTES.personal, variant: 'text' },
  ],
};

export const streamingPanel: AcademicStreamingPanelContent = {
  frame: { title: 'flujo.de.tuberia', meta: 'evento → percepción' },
  ariaLabel: 'Los datos fluyen desde los productores a través de Kafka y Flink hacia ClickHouse y Grafana',
  nodes: [
    { name: 'Producers', description: 'Fuente del evento' },
    { name: 'Kafka', description: 'Transporte' },
    { name: 'Flink', description: 'Tratamiento' },
    { name: 'ClickHouse', description: 'Analítica' },
    { name: 'Grafana', description: 'Visibilidad' },
  ],
};

export const engineeringPanel: AcademicEngineeringPanelContent = {
  frame: { title: 'lernzeit.manager', meta: 'planificación de estudio personal' },
  ariaLabel: 'Vista previa de la aplicación web de gestión del tiempo de aprendizaje completa',
  navigation: [
    'Descripción general',
    'Objetivos de aprendizaje',
    'Planificación',
    'tiempo de concentración',
    'Analítica',
    'Recordatorios',
  ],
  metrics: [
    { label: 'Metas activas', value: '2' },
    { label: 'plan mensual', value: '38 horas' },
    { label: 'tiempo de concentración', value: '8,1 horas' },
  ],
  goals: [
    { title: 'Modelado de datos', status: 'En curso' },
    { title: 'Álgebra lineal', status: 'Planificado' },
  ],
  schedule: [
    { date: '26.07', title: 'Ejercicios de normalización' },
    { date: '29.07', title: 'Ejercicios de espacio vectorial' },
  ],
  facts: [
    { label: 'Proyecto', value: 'Trabajo colaborativo en grupo' },
    { label: 'Responsabilidad primaria', value: 'Arquitectura y gestión de calidad.' },
    { label: 'Entrega', value: 'Entradas, hitos y reseñas' },
  ],
  demo: {
    label: 'Ver demostración en vivo',
    href: 'https://struperto.github.io/isef01-lernzeit-manager/',
  },
  status: 'Ciclo de vida completo completado',
};

export const authenticationPanel: AcademicAuthenticationPanelContent = {
  frame: { title: 'ceremonia.de.autenticación', meta: 'flujo de clave pública' },
  steps: [
    { number: '01', title: 'Pedido', description: 'El servidor crea un nuevo desafío.' },
    {
      number: '02',
      title: 'Verificar localmente',
      description: 'El usuario desbloquea un autenticador vinculado al dispositivo.',
    },
    {
      number: '03',
      title: 'Firmar',
      description: 'La clave privada firma el desafío sin salir del autenticador.',
    },
    { number: '04', title: 'Validar', description: 'El servidor verifica el origen, la impugnación y la firma.' },
  ],
  status: 'No se transmite ninguna contraseña compartida',
};

export const servicePanel: AcademicServicePanelContent = {
  frame: { title: 'modelo.de.servicio', meta: 'mapeo del marco' },
  stages: [
    { number: '01', title: 'Captura', description: 'Registrar y reconocer' },
    { number: '02', title: 'Clasificar', description: 'Priorizar y asignar' },
    { number: '03', title: 'Resolver', description: 'Restaurar o cumplir' },
    { number: '04', title: 'Aprender', description: 'Revisar y mejorar' },
  ],
  frameworks: [
    { name: 'ITIL', description: 'Practices, value, and continual improvement' },
    { name: 'FitSM', description: 'Lightweight requirements and clear accountability' },
  ],
};

export const academicMeta = {
  title: 'Proyectos Universitarios | Matthias Löhden',
  description:
    'Trabajos de informática seleccionados de Matthias Löhden en procesamiento de eventos escalables, autenticación FIDO2, ingeniería de software aplicada y operaciones de servicios.',
};
