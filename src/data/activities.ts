import { Activity, QuizQuestion, Metric } from '../types';

export const ACTIVITIES: Activity[] = [
  {
    id: 'bingo-didactico',
    title: 'Bingo Pedagógico de Modelos de Aprendizaje',
    category: 'juegos',
    categoryLabel: 'Juegos Didácticos',
    tag: 'Gamificación Educativa',
    description: 'Un bingo interactivo adaptado para repasar paradigmas clásicos y contemporáneos de la educación. Las casillas contienen conceptos clave (Vygotsky, conductismo, andamiaje, ensayo y error). En lugar de cantar números, el docente lee escenarios prácticos, problemas reales de aula o definiciones directas, y los alumnos identifican a qué teoría pedagógica corresponde el ejemplo para marcarlo en sus cartones.',
    objective: 'Consolidar de forma lúdica y colaborativa el vocabulario de las teorías pedagógicas antes de las evaluaciones prácticas, fomentando la retroalimentación inmediata frente al error común.',
    materials: ['Cartones de bingo personalizados', 'Fichas plásticas recicladas', 'Banco de preguntas teóricas', 'Premios motivacionales simbólicos (pegatinas de mérito)'],
    targetGroup: 'Estudiantes de Licenciatura en Pedagogía y Docentes en Formación',
    difficulty: 'Fácil',
    preparationTime: '45 mins',
    pedagogicalParadigm: 'Constructivismo y Gamificación Cohesiva (Karl Kapp)',
    learnings: [
      'La gamificación activa la memoria asociativa de forma mucho más eficaz que la repetición de definiciones abstractas.',
      'El juego estimula el debate inmediato entre compañeros al justificar por qué una descripción pertenece a Piaget y no a Watson.',
      'El error en el juego de mesa disminuye la frustración y se convierte en tutoría de pares.'
    ],
    reflection: 'Desarrollar y probar este bingo pedagógico demostró que el rigor académico no es enemigo del juego. Al principio temíamos que la actividad se volviera caótica, pero las reglas claras y la competencia sana canalizaron la energía de forma increíble. Comprendimos que el reto real del educador no está solo en preparar el contenido, sino en estructurar las dinámicas que guiarán la atención consciente de los participantes.',
    evidenceImages: [
      '/src/assets/images/educational_games_1779653642724.png',
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'torre-consenso',
    title: 'La Torre del Consenso y Ajuste Pedagógico',
    category: 'dinamicas',
    categoryLabel: 'Dinámicas Grupales',
    tag: 'Aprendizaje Experiencial',
    description: 'Una dinámica clásica de resolución cooperativa que consiste en construir la torre estructural más alta y estable posible con fideos de pasta crudos, hilo y cinta de papel, coronada por un malvavisco. La variable didáctica radica en que, cada cierto tiempo, el facilitador introduce "imposiciones adaptativas" aleatorias (p.ej. un miembro no puede hablar, otro entra en "ceguera sensorial", o la estructura sufre un sismo de recursos) para simular barreras en el aula.',
    objective: 'Sensibilizar sobre el trabajo cooperativo, la toma de decisiones ágiles ante la incertidumbre y el impacto de las adecuaciones curriculares y de acceso frente a la diversidad del alumnado.',
    materials: ['Spaghetti crudo', 'Hilos fuertes', 'Cinta de papel (masking tape)', 'Malvaviscos dulces', 'Tarjetas de limitación curricular/sensorial'],
    targetGroup: 'Estudiantes Universitarios y Equipos Docentes Cooperativos',
    difficulty: 'Medio',
    preparationTime: '20 mins',
    pedagogicalParadigm: 'Teoría del Desarrollo Cognitivo y Social (Bruner y Vygotsky)',
    learnings: [
      'La empatía de equipo brota naturalmente cuando obligas a los participantes a entender y suplir la vulnerabilidad del otro.',
      'El andamiaje de Bruner se comprende de golpe en lo físico al sostener las bases antes de atreverse a empujar hacia lo alto.',
      'El fracaso temprano de los prototipos es mucho más nutritivo que la planeación rígida sin retroalimentación.'
    ],
    reflection: 'Ver cómo se derrumbaban las torres fue divertido pero inmensamente revelador. Cuando un compañero de nuestro subgrupo fue "privado de su voz", la dinámica se ralentizó. Fue allí donde el resto tuvimos que crear un código gestual rápido. Comprendimos en carne viva lo que es un aula sin un diseño universal para el aprendizaje (DUAL). Si no creamos canales de juego múltiples, dejamos a alumnos brillantes en el silencio.',
    evidenceImages: [
      '/src/assets/images/group_dynamics_1779653658761.png',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'rompecabezas-aronson',
    title: 'Rompecabezas Metodológico de Expertos (Jigsaw)',
    category: 'aula',
    categoryLabel: 'Actividades de Aula',
    tag: 'Aprendizaje Cooperativo Estratégico',
    description: 'Estructuración didáctica del debate en clase para asimilar un dossier denso sobre "Estrategias de Evaluación Innovadora" (Rúbricas, Coevaluación, Portafolios y Evaluación Auténtica). Se divide al grupo en Equipos Base; cada integrante recibe una subtemática diferenciada. Posteriormente, se reúnen en el "Grupo de Expertos" del mismo tema para analizarlo a fondo, sintetizarlo colectivamente y acordar cómo enseñarlo a sus equipos base al regresar, donde cada uno actúa como maestro de sus compañeros.',
    objective: 'Promover la interdependencia positiva, asegurar la responsabilidad individual y ejercitar las destrezas explicativas y retóricas de los estudiantes en un ambiente controlado.',
    materials: ['Fichas de lectura temática curada', 'Organizadores gráficos de síntesis', 'Rúbricas de autoevaluación expositiva'],
    targetGroup: 'Educación Superior, Formación de Adultos (Andragogía)',
    difficulty: 'Avanzado',
    preparationTime: '1.5 horas',
    pedagogicalParadigm: 'Interdependencia Positiva (David y Roger Johnson)',
    learnings: [
      'Un alumno aprende el 90% de lo que enseña formalmente a otros, en comparación al 20% de lo que únicamente lee.',
      'La estructura Jigsaw nulifica la pasividad académica de los "alumnos polizones" que dejan todo en manos del líder clásico.',
      'El papel del maestro cambia notablemente de depositario central de cátedra a un creador sutil de infraestructuras de intercambio.'
    ],
    reflection: 'La metodología Jigsaw requirió que confiáramos los unos en los otros. Al principio hubo recelos: ¿qué pasa si el compañero que explica mi tema se traba o lo explica mal? Esa vulnerabilidad inicial nos obligó a los "expertos" a redoblar el rigor para no decepcionar a nuestro grupo. Nos demostró que la motivación social y ética es un motor de aprendizaje infinitamente más valioso que la nota externa de un examen solitario.',
    evidenceImages: [
      '/src/assets/images/didactics_hero_1779653625677.png',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'titeres-reciclaje',
    title: 'Teatrillo Didáctico de Títeres Reciclados',
    category: 'proyectos',
    categoryLabel: 'Proyectos Creativos',
    tag: 'Diseño de Recursos Creativos',
    description: 'Proyecto interdisciplinario y hands-on que busca guiar a los alumnos en el diseño y manufactura de títeres con materiales ecológicos o sobrantes (calcetines, fieltro, cartón, plástico usado). Posteriormente, los equipos deben planificar un libreto con un argumento didáctico sobre educación cívica, acoso escolar o resolución de conflictos para presentarlo ante niños reales.',
    objective: 'Estimular el pensamiento creativo, la dramatización como estrategia narrativa didáctica (storytelling) y el ensamblaje de materiales funcionales sin incurrir en costes económicos elevados.',
    materials: ['Retazos textiles de descarte', 'Botellas de plástico', 'Silicona fría', 'Caja de cartón grande para el retablo escénico', 'Pinturas acrílicas no tóxicas'],
    targetGroup: 'Estudiantes de Educación Infantil, Primaria y Artes Plásticas',
    difficulty: 'Avanzado',
    preparationTime: '3 horas',
    pedagogicalParadigm: 'Expresión Dramática y Juego Simbólico (Jean Piaget / Rudolf Steiner)',
    learnings: [
      'La escasez material despierta y potencia la recursividad lúdica de los futuros educadores de campo.',
      'La modulación y el títere canalizan temas tabú o complejos de forma mucho más empática y digerible para la infancia.',
      'El recurso material didáctico debe contar con excelente ergonomía y resistencia física antes de ser llevado a un ambiente real.'
    ],
    reflection: 'Este fue el proyecto más laborioso pero el que mayor ternura desató. Ver viejos calcetines y cajas de cartón cobrando vida en forma de dragones éticos o conejos asertivos nos reconectó con la artesanía de educar. No todo necesita pantallas LED o inteligencias artificiales para enganchar. La magia de la luz, el cartón, la voz oculta y el juego teatral rompe cualquier filtro defensivo de un niño.',
    evidenceImages: [
      '/src/assets/images/creative_projects_1779653675469.png',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'exposicion-feria',
    title: 'Feria Abierta de Artefactos de Aprendizaje',
    category: 'evidencias',
    categoryLabel: 'Evidencias del Proceso',
    tag: 'Evaluación Auténtica',
    description: 'Un hito integrador consistente en una jornada expositiva pública donde el colectivo de didáctica abre sus puertas a toda la comunidad universitaria. Cada equipo monta un stand interactivo de "diseños instruccionales interactivos". Los visitantes formulan preguntas, juegan y prueban la efectividad de las soluciones del curso, mientras docentes externos evalúan la destreza de los alumnos mediante rúbricas institucionales.',
    objective: 'Dar visibilidad y validación social real a los trabajos elaborados por los estudiantes universitarios mediante la defensa oral de su sustento teórico y pedagógico.',
    materials: ['Mobiliario plegable', 'Cabinas informativas', 'Códigos QR para guías de uso digitales', 'Cuestionarios de coevaluación para visitantes'],
    targetGroup: 'Comunidad Educativa en General, Directores Escolares y Padres de Familia',
    difficulty: 'Avanzado',
    preparationTime: '4 horas (montaje)',
    pedagogicalParadigm: 'Evaluación de Impacto Auténtico (Grant Wiggins)',
    learnings: [
      'La sustentación ante públicos con criterio escolar real dota a las actividades de un propósito comunitario inmediato.',
      'La comunicación no verbal y el discurso del docente deben ser veloces, persuasivos y basados firmemente en leyes educativas.',
      'La feria actúa como una incubadora de innovación colectiva: los grupos absorben las propuestas de sus pares.'
    ],
    reflection: 'El día del montaje del stand estuvimos muy ansiosos. No obstante, en cuanto entraron los alumnos de otras carreras y comenzaron a desafiarse con nuestro mapa didáctico y los títeres de reciclaje, el ambiente cobró vida. Que un profesor real de escuela primaria se acercara a pedirnos los códigos de descarga para aplicarlo en su escuela rural nos demostró que nuestro trabajo universitario tiene valor real inmediata fuera de los portones de la universidad.',
    evidenceImages: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'bitacora-doble-entrada',
    title: 'Bitácora de Metacognición y Doble Entrada',
    category: 'reflexiones',
    categoryLabel: 'Reflexiones y Aprendizajes',
    tag: 'Práctica Reflexiva',
    description: 'Un ejercicio regular de registro metacognitivo desarrollado al cierre de cada tema didáctico. El diario se compone de dos columnas paralelas: de un lado se vuelca la "Crónica del Evento" de modo objetivo e histórico; del otro lado se analiza la "Evolución Conceptual Personal": qué desafíos cognitivos representó, qué miedos docentes detonó y cómo ese nuevo conocimiento altera el imaginario inicial que el estudiante poseía sobre el acto pedagógico.',
    objective: 'Desarrollar la competencia reflexiva y la metacognición sistemática en el estudiantado, logrando la asimilación profunda por encima de la memorización evaluativa.',
    materials: ['Diario interactivo digital', 'Estructuras de preguntas de inducción metacognitiva', 'Rúbrica de niveles de profundidad crítica'],
    targetGroup: 'Docentes en Formación y Profesionales Educativos',
    difficulty: 'Fácil',
    preparationTime: '15 mins',
    pedagogicalParadigm: 'El Profesional Reflexivo y la Metacognición (Donald Schön / John Flavell)',
    learnings: [
      'Sin reflexión estructurada, la práctica pedagógica corre el riesgo latente de degenerar en repetición burocrática ciega.',
      'Escribir a mano o digitar ordenadamente ayuda a visibilizar brechas, vacíos metodológicos y prejuicios didácticos heredados.',
      'La autoevaluación sincera fomenta la autonomía estudiantil absoluta sobre los objetivos curriculares.'
    ],
    reflection: 'Entregar la bitácora cada viernes nos parecía al principio un deber aburrido de rutina universitaria. Pero hoy, releyendo mis entradas del inicio de año, mi madurez metodológica salta a la vista de manera nítida. Pasé de creer que un docente era un orador simpático a comprender que es un cirujano cognitivo del entorno escolar, un estratega instruccional silencioso. Ese cambio de paradigma está anotado de mi puño y letra en mi bitácora pedagógica.',
    evidenceImages: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const DIDACTIC_METRICS: Metric[] = [
  {
    label: 'Actividades Realizadas',
    value: '12+',
    icon: 'Sparkles',
    description: 'Estrategias lúdicas, dinámicas y proyectos de aula completados en el semestre.'
  },
  {
    label: 'Horas Prácticas',
    value: '48h',
    icon: 'Clock',
    description: 'Tiempo invertido en diseño instruccional, testeo colectivo y debates didácticos.'
  },
  {
    label: 'Materiales Creados',
    value: '35+',
    icon: 'Layers',
    description: 'Fichas, cartones, títeres ecológicos y rúbricas auténticas listas para el campo.'
  },
  {
    label: 'Público Beneficiado',
    value: '180+',
    icon: 'Users',
    description: 'Niños, docentes invitados y compañeros que experimentaron los talleres didácticos.'
  }
];

export const DIDACTIC_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Si un docente utiliza un sistema de puntos y niveles basado en la estética de videojuegos para elevar la participación de tareas áridas, ¿qué enfoque aplica primordialmente?',
    options: [
      'Andamiaje Cognitivo puro',
      'Gamificación de Aula',
      'Transmisión Tradicional Expositiva',
      'Aprendizaje de Servicio'
    ],
    correctOptionIndex: 1,
    explanation: 'La gamificación consiste en el uso de dinámicas, mecánicas y componentes lúdicos en contextos que no son inherentemente de juego con el fin de incrementar la motivación interna y externa de los participantes.'
  },
  {
    id: 2,
    question: '¿Qué autor y concepto justifican que los estudiantes adquieran mayor dominio de un subtema cuando deben enseñárselo obligatoriamente a sus propios pares (Interdependencia Positiva)?',
    options: [
      'Jean Piaget y el Egocentrismo Cognitivo',
      'B.F. Skinner y el Refuerzo Intermitente',
      'Lev Vygotsky y el Aprendizaje Colaborativo / Jigsaw (Johnson & Johnson)',
      'John Watson y el Condicionamiento Clásico'
    ],
    correctOptionIndex: 2,
    explanation: 'El socioconstructivismo y los modelos de aprendizaje cooperativo estructurado demuestran que la interdependencia positiva estimula la asimilación conceptual interactiva en la Zona de Desarrollo Próximo (ZDP).'
  },
  {
    id: 3,
    question: '¿Qué caracteriza primordialmente a la "Evaluación Auténtica" según Grant Wiggins?',
    options: [
      'Pruebas estrictas de respuesta única de opción múltiple al final del semestre.',
      'Evaluar el desempeño mediante tareas prácticas realistas, imitando desafíos profesionales éticos.',
      'No calificar nada y dejar que los estudiantes decidan de forma informal.',
      'Someter al alumno a la memorización literal de manuales teóricos sin demostración.'
    ],
    correctOptionIndex: 1,
    explanation: 'La evaluación auténtica busca verificar si el alumno es capaz de aplicar el conocimiento de forma flexible frente a retos contextualizados reales del mundo profesional o escolar.'
  }
];
