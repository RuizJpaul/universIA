import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedCursosCompletos() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🎓 Iniciando seed de cursos completos...\n');

    // 1. Obtener IDs necesarios
    let adminQuery = await client.query(
      `SELECT id_usuario FROM usuarios WHERE correo LIKE '%admin%' OR rol = 'ADMIN' LIMIT 1`
    );
    
    if (adminQuery.rows.length === 0) {
      // Si no hay admin, usar el primer usuario disponible
      adminQuery = await client.query(
        `SELECT id_usuario FROM usuarios LIMIT 1`
      );
    }
    
    if (adminQuery.rows.length === 0) {
      throw new Error('❌ No se encontró ningún usuario en la base de datos');
    }
    
    const adminId = adminQuery.rows[0].id_usuario;
    console.log('✓ Usuario encontrado:', adminId);

    // Obtener o crear categoría de Tecnología
    let categoriaQuery = await client.query(
      `SELECT id_categoria FROM categorias_curso WHERE nombre = 'Tecnología' LIMIT 1`
    );
    
    let categoriaId;
    if (categoriaQuery.rows.length === 0) {
      console.log('⚙️  Creando categoría Tecnología...');
      const nuevaCategoria = await client.query(
        `INSERT INTO categorias_curso (nombre, descripcion, icono, slug, orden)
         VALUES ('Tecnología', 'Cursos de tecnología, programación y ciencias de la computación', 
                 'laptop-code', 'tecnologia', 1)
         RETURNING id_categoria`
      );
      categoriaId = nuevaCategoria.rows[0].id_categoria;
      console.log('✓ Categoría Tecnología creada');
    } else {
      categoriaId = categoriaQuery.rows[0].id_categoria;
      console.log('✓ Categoría Tecnología encontrada');
    }

    // Obtener o crear tutor IA
    let tutorQuery = await client.query(
      `SELECT id_tutor FROM tutores_ia LIMIT 1`
    );
    
    let tutorId;
    if (tutorQuery.rows.length === 0) {
      console.log('🤖 Creando tutor IA...');
      const nuevoTutor = await client.query(
        `INSERT INTO tutores_ia (nombre, especialidad, modelo_ia, personalidad, activo)
         VALUES ('TutorIA Universal', 'Tecnología y Ciencias', 'GPT-4', 
                 'Amigable, paciente y motivador con enfoque práctico', true)
         RETURNING id_tutor`
      );
      tutorId = nuevoTutor.rows[0].id_tutor;
      console.log('✓ Tutor IA creado');
    } else {
      tutorId = tutorQuery.rows[0].id_tutor;
      console.log('✓ Tutor IA encontrado');
    }

    // ==================================================================
    // CURSO 1: COMPUTACIÓN CUÁNTICA
    // ==================================================================
    
    console.log('\n📚 Insertando curso: Computación Cuántica...');
    
    const curso1 = await client.query(
      `INSERT INTO cursos (
        id_categoria,
        id_tutor,
        nombre,
        slug,
        descripcion,
        descripcion_corta,
        nivel,
        duracion_horas,
        imagen_portada,
        objetivos,
        requisitos,
        tags,
        precio_base,
        destacado,
        estado,
        creado_por
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING id_curso`,
      [
        categoriaId,
        tutorId,
        'Fundamentos de Computación Cuántica',
        'fundamentos-computacion-cuantica',
        `La computación cuántica representa un cambio de paradigma en el procesamiento de información, 
        utilizando los principios de la mecánica cuántica para resolver problemas que son intratables 
        para las computadoras clásicas. Este curso te introducirá a los conceptos fundamentales de 
        qubits, superposición, entrelazamiento cuántico y algoritmos cuánticos como Shor y Grover.
        
        Aprenderás a programar circuitos cuánticos utilizando Qiskit de IBM y comprenderás las 
        aplicaciones prácticas en criptografía, optimización y simulación molecular.`,
        'Aprende los fundamentos de la computación cuántica y programa tus primeros circuitos cuánticos con Qiskit.',
        'INTERMEDIO',
        40,
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        [
          'Comprender los principios fundamentales de la mecánica cuántica aplicada a la computación',
          'Dominar los conceptos de qubits, superposición y entrelazamiento cuántico',
          'Diseñar e implementar circuitos cuánticos básicos',
          'Programar algoritmos cuánticos usando Qiskit',
          'Analizar las ventajas de la computación cuántica sobre la clásica',
          'Explorar aplicaciones reales en criptografía y optimización'
        ],
        [
          'Conocimientos básicos de álgebra lineal (vectores y matrices)',
          'Fundamentos de programación en Python',
          'Nociones básicas de física cuántica (recomendado)',
          'Familiaridad con números complejos'
        ],
        [
          'Computación Cuántica',
          'Qiskit',
          'IBM Quantum',
          'Algoritmos Cuánticos',
          'Física Cuántica',
          'Python'
        ],
        0.00,
        true,
        'PUBLICADO',
        adminId
      ]
    );

    const cursoQuantumId = curso1.rows[0].id_curso;
    console.log('✓ Curso Computación Cuántica creado con ID:', cursoQuantumId);

    // MÓDULOS DEL CURSO DE COMPUTACIÓN CUÁNTICA
    
    console.log('  📖 Insertando módulos...');

    // Módulo 1: Fundamentos de Computación Cuántica
    const modulo1Quantum = await client.query(
      `INSERT INTO modulos (id_curso, titulo, descripcion, orden, duracion_estimada)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_modulo`,
      [
        cursoQuantumId,
        'Introducción a la Mecánica Cuántica para Computación',
        `Este módulo establece las bases teóricas necesarias para comprender la computación cuántica. 
        Exploraremos los principios fundamentales de la mecánica cuántica que hacen posible el 
        procesamiento cuántico de información.`,
        1,
        600 // 10 horas
      ]
    );

    const mod1QuantumId = modulo1Quantum.rows[0].id_modulo;

    // Lecciones del Módulo 1
    const leccionesModulo1 = [
      {
        titulo: '¿Qué es la Computación Cuántica?',
        descripcion: 'Introducción histórica y conceptual a la computación cuántica. Diferencias entre computación clásica y cuántica.',
        tipo: 'VIDEO',
        contenido: 'Exploración de los orígenes de la computación cuántica y su evolución.',
        conceptos: ['Computación Clásica vs Cuántica', 'Historia', 'Aplicaciones'],
        duracion: 45,
        orden: 1
      },
      {
        titulo: 'Principios de Mecánica Cuántica',
        descripcion: 'Superposición, entrelazamiento y el principio de incertidumbre de Heisenberg.',
        tipo: 'VIDEO',
        contenido: 'Fundamentos teóricos de la mecánica cuántica aplicados a la computación.',
        conceptos: ['Superposición', 'Entrelazamiento', 'Incertidumbre'],
        duracion: 60,
        orden: 2
      },
      {
        titulo: 'El Qubit: Unidad Básica Cuántica',
        descripcion: 'Diferencias entre bits clásicos y qubits. Representación matemática con la esfera de Bloch.',
        tipo: 'INTERACTIVO',
        contenido: 'Visualización interactiva de qubits y estados cuánticos.',
        conceptos: ['Qubit', 'Esfera de Bloch', 'Estados Cuánticos'],
        duracion: 75,
        orden: 3
      },
      {
        titulo: 'Notación de Dirac y Álgebra Lineal',
        descripcion: 'Herramientas matemáticas esenciales: notación bra-ket, vectores y matrices.',
        tipo: 'TEXTO',
        contenido: 'Fundamentos matemáticos para trabajar con estados cuánticos.',
        conceptos: ['Notación Dirac', 'Álgebra Lineal', 'Vectores de Estado'],
        duracion: 90,
        orden: 4
      },
      {
        titulo: 'Medición Cuántica y Colapso de la Función de Onda',
        descripcion: 'El proceso de medición en sistemas cuánticos y sus implicaciones.',
        tipo: 'VIDEO',
        contenido: 'Cómo la medición afecta a los estados cuánticos.',
        conceptos: ['Medición', 'Colapso', 'Probabilidad'],
        duracion: 50,
        orden: 5
      },
      {
        titulo: 'Puertas Lógicas Cuánticas',
        descripcion: 'Introducción a las puertas cuánticas: Pauli X, Y, Z, Hadamard, CNOT.',
        tipo: 'INTERACTIVO',
        contenido: 'Simulador interactivo de puertas cuánticas básicas.',
        conceptos: ['Puertas Cuánticas', 'Hadamard', 'CNOT', 'Pauli'],
        duracion: 80,
        orden: 6
      },
      {
        titulo: 'Circuitos Cuánticos Básicos',
        descripcion: 'Construcción y análisis de circuitos cuánticos simples.',
        tipo: 'CODIGO',
        contenido: 'Práctica con construcción de circuitos usando Qiskit.',
        conceptos: ['Circuitos Cuánticos', 'Simulación', 'Qiskit'],
        duracion: 100,
        orden: 7
      },
      {
        titulo: 'Quiz: Fundamentos de Mecánica Cuántica',
        descripcion: 'Evaluación de conceptos fundamentales del módulo.',
        tipo: 'QUIZ',
        contenido: 'Preguntas sobre qubits, superposición, puertas cuánticas.',
        conceptos: ['Evaluación'],
        duracion: 30,
        orden: 8
      },
      {
        titulo: 'Proyecto: Simulador de Qubit',
        descripcion: 'Crea un simulador básico de qubit usando Python y visualiza estados en la esfera de Bloch.',
        tipo: 'PROYECTO',
        contenido: 'Proyecto práctico de implementación de simulador.',
        conceptos: ['Proyecto', 'Simulación', 'Python'],
        duracion: 120,
        orden: 9
      }
    ];

    for (const leccion of leccionesModulo1) {
      await client.query(
        `INSERT INTO lecciones (
          id_modulo, titulo, descripcion, tipo_contenido, contenido,
          conceptos_clave, orden, duracion_minutos, es_gratuita
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          mod1QuantumId,
          leccion.titulo,
          leccion.descripcion,
          leccion.tipo,
          leccion.contenido,
          leccion.conceptos,
          leccion.orden,
          leccion.duracion,
          leccion.orden <= 2 // Primeras 2 lecciones gratuitas
        ]
      );
    }

    console.log(`  ✓ Módulo 1: ${leccionesModulo1.length} lecciones creadas`);

    // Módulo 2: Programación Cuántica con Qiskit
    const modulo2Quantum = await client.query(
      `INSERT INTO modulos (id_curso, titulo, descripcion, orden, duracion_estimada)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_modulo`,
      [
        cursoQuantumId,
        'Programación Cuántica con Qiskit',
        `Aprende a programar computadoras cuánticas reales usando Qiskit, el framework de código 
        abierto de IBM. Implementarás algoritmos cuánticos y ejecutarás tus programas en 
        simuladores y hardware cuántico real.`,
        2,
        700 // 11.6 horas
      ]
    );

    const mod2QuantumId = modulo2Quantum.rows[0].id_modulo;

    const leccionesModulo2 = [
      {
        titulo: 'Introducción a Qiskit',
        descripcion: 'Instalación y configuración de Qiskit. Estructura del framework.',
        tipo: 'VIDEO',
        contenido: 'Setup completo del entorno de desarrollo cuántico.',
        conceptos: ['Qiskit', 'Setup', 'Ambiente de Desarrollo'],
        duracion: 40,
        orden: 1
      },
      {
        titulo: 'Tu Primer Circuito Cuántico',
        descripcion: 'Crea y ejecuta tu primer circuito cuántico usando Qiskit.',
        tipo: 'CODIGO',
        contenido: 'Tutorial paso a paso para crear circuitos básicos.',
        conceptos: ['Circuito', 'Ejecución', 'Simulador'],
        duracion: 60,
        orden: 2
      },
      {
        titulo: 'Trabajando con Qubits Múltiples',
        descripcion: 'Operaciones con múltiples qubits y entrelazamiento.',
        tipo: 'INTERACTIVO',
        contenido: 'Ejercicios prácticos con sistemas multi-qubit.',
        conceptos: ['Multi-Qubit', 'Entrelazamiento', 'Bell States'],
        duracion: 80,
        orden: 3
      },
      {
        titulo: 'Algoritmo de Deutsch-Jozsa',
        descripcion: 'Implementación del primer algoritmo cuántico que supera a los clásicos.',
        tipo: 'CODIGO',
        contenido: 'Código completo y análisis del algoritmo.',
        conceptos: ['Algoritmo Cuántico', 'Deutsch-Jozsa', 'Ventaja Cuántica'],
        duracion: 90,
        orden: 4
      },
      {
        titulo: 'Algoritmo de Grover',
        descripcion: 'Búsqueda cuántica no estructurada con ventaja cuadrática.',
        tipo: 'VIDEO',
        contenido: 'Teoría y aplicaciones del algoritmo de búsqueda de Grover.',
        conceptos: ['Grover', 'Búsqueda', 'Amplificación de Amplitud'],
        duracion: 75,
        orden: 5
      },
      {
        titulo: 'Implementación de Grover en Qiskit',
        descripcion: 'Programa el algoritmo de Grover paso a paso.',
        tipo: 'CODIGO',
        contenido: 'Implementación práctica con ejemplos.',
        conceptos: ['Implementación', 'Optimización'],
        duracion: 100,
        orden: 6
      },
      {
        titulo: 'Introducción al Algoritmo de Shor',
        descripcion: 'Factorización cuántica de números enteros.',
        tipo: 'VIDEO',
        contenido: 'Fundamentos teóricos del algoritmo más famoso de la computación cuántica.',
        conceptos: ['Shor', 'Factorización', 'Criptografía'],
        duracion: 85,
        orden: 7
      },
      {
        titulo: 'Ejecutando en Hardware Cuántico Real',
        descripcion: 'Accede a computadoras cuánticas de IBM y ejecuta tus circuitos.',
        tipo: 'INTERACTIVO',
        contenido: 'Tutorial de acceso a IBM Quantum Experience.',
        conceptos: ['Hardware Real', 'IBM Quantum', 'Cloud'],
        duracion: 70,
        orden: 8
      },
      {
        titulo: 'Mitigación de Errores Cuánticos',
        descripcion: 'Técnicas para reducir el impacto del ruido en computadoras cuánticas NISQ.',
        tipo: 'TEXTO',
        contenido: 'Estrategias de corrección y mitigación de errores.',
        conceptos: ['Error Mitigation', 'NISQ', 'Ruido'],
        duracion: 60,
        orden: 9
      },
      {
        titulo: 'Proyecto Final: Algoritmo Cuántico Completo',
        descripcion: 'Implementa un algoritmo cuántico completo desde cero y ejecútalo en hardware real.',
        tipo: 'PROYECTO',
        contenido: 'Proyecto integrador del curso.',
        conceptos: ['Proyecto Final', 'Integración'],
        duracion: 140,
        orden: 10
      }
    ];

    for (const leccion of leccionesModulo2) {
      await client.query(
        `INSERT INTO lecciones (
          id_modulo, titulo, descripcion, tipo_contenido, contenido,
          conceptos_clave, orden, duracion_minutos, es_gratuita
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          mod2QuantumId,
          leccion.titulo,
          leccion.descripcion,
          leccion.tipo,
          leccion.contenido,
          leccion.conceptos,
          leccion.orden,
          leccion.duracion,
          false
        ]
      );
    }

    console.log(`  ✓ Módulo 2: ${leccionesModulo2.length} lecciones creadas`);

    // ==================================================================
    // CURSO 2: ELECTRÓNICA, IoT Y ROBÓTICA
    // ==================================================================
    
    console.log('\n📚 Insertando curso: Electrónica, IoT y Robótica...');
    
    const curso2 = await client.query(
      `INSERT INTO cursos (
        id_categoria,
        id_tutor,
        nombre,
        slug,
        descripcion,
        descripcion_corta,
        nivel,
        duracion_horas,
        imagen_portada,
        objetivos,
        requisitos,
        tags,
        precio_base,
        destacado,
        estado,
        creado_por
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING id_curso`,
      [
        categoriaId,
        tutorId,
        'Electrónica, IoT y Robótica: De Cero a Experto',
        'electronica-iot-robotica',
        `Sumérgete en el fascinante mundo de la electrónica moderna, el Internet de las Cosas (IoT) 
        y la robótica. Este curso integral te llevará desde los fundamentos de circuitos electrónicos 
        hasta la construcción de robots autónomos conectados a la nube.
        
        Aprenderás a diseñar circuitos, programar microcontroladores como Arduino y ESP32, crear 
        dispositivos IoT que se comunican mediante WiFi, Bluetooth y MQTT, e integrar sensores y 
        actuadores para construir sistemas robóticos inteligentes. Al finalizar, serás capaz de 
        desarrollar proyectos completos de automatización y robótica.`,
        'Domina la electrónica, IoT y robótica construyendo proyectos reales con Arduino, ESP32 y sensores.',
        'PRINCIPIANTE',
        50,
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        [
          'Comprender los fundamentos de circuitos electrónicos analógicos y digitales',
          'Programar microcontroladores Arduino y ESP32',
          'Diseñar y construir dispositivos IoT conectados a internet',
          'Integrar sensores y actuadores en proyectos reales',
          'Implementar protocolos de comunicación: I2C, SPI, UART, WiFi, Bluetooth',
          'Construir robots autónomos con capacidades de navegación',
          'Crear dashboards y sistemas de monitoreo remoto',
          'Aplicar buenas prácticas de diseño y documentación de hardware'
        ],
        [
          'Conocimientos básicos de física (electricidad)',
          'Programación básica (cualquier lenguaje)',
          'Matemáticas de secundaria',
          'Ningún conocimiento previo de electrónica necesario'
        ],
        [
          'Arduino',
          'ESP32',
          'IoT',
          'Robótica',
          'Electrónica',
          'Sensores',
          'MQTT',
          'WiFi'
        ],
        0.00,
        true,
        'PUBLICADO',
        adminId
      ]
    );

    const cursoIoTId = curso2.rows[0].id_curso;
    console.log('✓ Curso Electrónica, IoT y Robótica creado con ID:', cursoIoTId);

    console.log('  📖 Insertando módulos...');

    // Módulo 1: Fundamentos de Electrónica
    const modulo1IoT = await client.query(
      `INSERT INTO modulos (id_curso, titulo, descripcion, orden, duracion_estimada)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_modulo`,
      [
        cursoIoTId,
        'Fundamentos de Electrónica y Circuitos',
        `Establece una base sólida en electrónica aprendiendo sobre componentes, leyes fundamentales, 
        y diseño de circuitos. Trabajarás con LEDs, resistencias, capacitores, transistores y 
        construirás tus primeros circuitos funcionales.`,
        1,
        720 // 12 horas
      ]
    );

    const mod1IoTId = modulo1IoT.rows[0].id_modulo;

    const leccionesModulo1IoT = [
      {
        titulo: 'Introducción a la Electrónica',
        descripcion: 'Conceptos básicos: voltaje, corriente, resistencia y potencia.',
        tipo: 'VIDEO',
        contenido: 'Fundamentos teóricos de electricidad y electrónica.',
        conceptos: ['Voltaje', 'Corriente', 'Resistencia', 'Ley de Ohm'],
        duracion: 45,
        orden: 1
      },
      {
        titulo: 'Componentes Pasivos: Resistencias',
        descripcion: 'Tipos de resistencias, código de colores, aplicaciones.',
        tipo: 'INTERACTIVO',
        contenido: 'Calculadora interactiva de código de colores.',
        conceptos: ['Resistencias', 'Código de Colores', 'Divisor de Voltaje'],
        duracion: 50,
        orden: 2
      },
      {
        titulo: 'Capacitores e Inductores',
        descripcion: 'Funcionamiento, tipos y aplicaciones de capacitores e inductores.',
        tipo: 'VIDEO',
        contenido: 'Teoría y práctica de componentes reactivos.',
        conceptos: ['Capacitores', 'Inductores', 'Filtros'],
        duracion: 60,
        orden: 3
      },
      {
        titulo: 'El LED: Tu Primer Componente Activo',
        descripcion: 'Características, polaridad y cálculo de resistencia limitadora.',
        tipo: 'CODIGO',
        contenido: 'Primer proyecto: encender un LED.',
        conceptos: ['LED', 'Diodo', 'Corriente Limitadora'],
        duracion: 40,
        orden: 4
      },
      {
        titulo: 'Diodos y Rectificadores',
        descripcion: 'Funcionamiento de diodos, rectificación de corriente alterna.',
        tipo: 'VIDEO',
        contenido: 'Aplicaciones de diodos en circuitos.',
        conceptos: ['Diodo', 'Rectificación', 'Puente de Diodos'],
        duracion: 55,
        orden: 5
      },
      {
        titulo: 'Transistores: Amplificación y Conmutación',
        descripcion: 'BJT y MOSFET: funcionamiento y aplicaciones básicas.',
        tipo: 'INTERACTIVO',
        contenido: 'Simulador de circuitos con transistores.',
        conceptos: ['Transistor', 'BJT', 'MOSFET', 'Amplificación'],
        duracion: 75,
        orden: 6
      },
      {
        titulo: 'Fuentes de Alimentación',
        descripcion: 'Reguladores de voltaje, fuentes lineales y conmutadas.',
        tipo: 'TEXTO',
        contenido: 'Diseño de fuentes de alimentación estables.',
        conceptos: ['Regulador', 'LM7805', 'Buck Converter'],
        duracion: 70,
        orden: 7
      },
      {
        titulo: 'Protoboard y Soldadura Básica',
        descripcion: 'Técnicas de prototipado y soldadura de componentes.',
        tipo: 'VIDEO',
        contenido: 'Tutorial práctico de soldadura.',
        conceptos: ['Protoboard', 'Soldadura', 'PCB'],
        duracion: 65,
        orden: 8
      },
      {
        titulo: 'Multímetro: Mediciones Electrónicas',
        descripcion: 'Uso correcto del multímetro para medir voltaje, corriente y resistencia.',
        tipo: 'VIDEO',
        contenido: 'Guía completa de uso del multímetro.',
        conceptos: ['Multímetro', 'Medición', 'Troubleshooting'],
        duracion: 50,
        orden: 9
      },
      {
        titulo: 'Quiz: Fundamentos de Electrónica',
        descripcion: 'Evaluación de conceptos del módulo.',
        tipo: 'QUIZ',
        contenido: 'Preguntas sobre componentes y circuitos básicos.',
        conceptos: ['Evaluación'],
        duracion: 30,
        orden: 10
      },
      {
        titulo: 'Proyecto: Circuito de Luces Secuenciales',
        descripcion: 'Construye un circuito que haga parpadear LEDs en secuencia usando un 555.',
        tipo: 'PROYECTO',
        contenido: 'Proyecto integrador del módulo.',
        conceptos: ['Timer 555', 'Proyecto', 'LEDs'],
        duracion: 180,
        orden: 11
      }
    ];

    for (const leccion of leccionesModulo1IoT) {
      await client.query(
        `INSERT INTO lecciones (
          id_modulo, titulo, descripcion, tipo_contenido, contenido,
          conceptos_clave, orden, duracion_minutos, es_gratuita
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          mod1IoTId,
          leccion.titulo,
          leccion.descripcion,
          leccion.tipo,
          leccion.contenido,
          leccion.conceptos,
          leccion.orden,
          leccion.duracion,
          leccion.orden <= 3 // Primeras 3 lecciones gratuitas
        ]
      );
    }

    console.log(`  ✓ Módulo 1: ${leccionesModulo1IoT.length} lecciones creadas`);

    // Módulo 2: Arduino y Programación de Microcontroladores
    const modulo2IoT = await client.query(
      `INSERT INTO modulos (id_curso, titulo, descripcion, orden, duracion_estimada)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_modulo`,
      [
        cursoIoTId,
        'Arduino y Programación de Microcontroladores',
        `Aprende a programar microcontroladores usando Arduino. Dominarás entradas/salidas digitales 
        y analógicas, comunicación serial, PWM, y crearás proyectos interactivos con sensores y 
        actuadores.`,
        2,
        780 // 13 horas
      ]
    );

    const mod2IoTId = modulo2IoT.rows[0].id_modulo;

    const leccionesModulo2IoT = [
      {
        titulo: 'Introducción a Arduino',
        descripcion: 'Qué es Arduino, placas disponibles, instalación del IDE.',
        tipo: 'VIDEO',
        contenido: 'Setup completo del entorno Arduino.',
        conceptos: ['Arduino', 'IDE', 'Microcontrolador'],
        duracion: 45,
        orden: 1
      },
      {
        titulo: 'Estructura de un Programa Arduino',
        descripcion: 'setup(), loop(), variables y funciones básicas.',
        tipo: 'CODIGO',
        contenido: 'Tu primer sketch: Blink.',
        conceptos: ['Setup', 'Loop', 'Sintaxis C++'],
        duracion: 50,
        orden: 2
      },
      {
        titulo: 'Entradas y Salidas Digitales',
        descripcion: 'pinMode, digitalWrite, digitalRead.',
        tipo: 'INTERACTIVO',
        contenido: 'Control de LEDs y lectura de botones.',
        conceptos: ['Digital I/O', 'Pull-up', 'Debouncing'],
        duracion: 70,
        orden: 3
      },
      {
        titulo: 'PWM: Control de Intensidad',
        descripcion: 'Modulación por ancho de pulso para controlar LEDs y motores.',
        tipo: 'CODIGO',
        contenido: 'Fade de LED y control de velocidad de motor.',
        conceptos: ['PWM', 'analogWrite', 'Duty Cycle'],
        duracion: 60,
        orden: 4
      },
      {
        titulo: 'Entradas Analógicas',
        descripcion: 'analogRead, conversión ADC, lectura de sensores analógicos.',
        tipo: 'INTERACTIVO',
        contenido: 'Lectura de potenciómetro y sensor de temperatura.',
        conceptos: ['ADC', 'analogRead', 'Sensores Analógicos'],
        duracion: 65,
        orden: 5
      },
      {
        titulo: 'Comunicación Serial',
        descripcion: 'Serial.begin, print, read. Comunicación con la PC.',
        tipo: 'CODIGO',
        contenido: 'Monitor serial y ploteo de datos.',
        conceptos: ['UART', 'Serial', 'Debugging'],
        duracion: 55,
        orden: 6
      },
      {
        titulo: 'Sensores Digitales: Temperatura y Humedad',
        descripcion: 'DHT11/DHT22: lectura de temperatura y humedad.',
        tipo: 'CODIGO',
        contenido: 'Proyecto de estación meteorológica básica.',
        conceptos: ['DHT11', 'DHT22', 'Sensores Digitales'],
        duracion: 75,
        orden: 7
      },
      {
        titulo: 'Control de Motores DC y Servos',
        descripcion: 'Puente H, driver L298N, biblioteca Servo.',
        tipo: 'INTERACTIVO',
        contenido: 'Control de dirección y velocidad de motores.',
        conceptos: ['Motor DC', 'Servo', 'L298N', 'PWM'],
        duracion: 85,
        orden: 8
      },
      {
        titulo: 'Display LCD 16x2',
        descripcion: 'Conexión I2C, biblioteca LiquidCrystal, mostrar datos.',
        tipo: 'CODIGO',
        contenido: 'Display de información de sensores.',
        conceptos: ['LCD', 'I2C', 'Display'],
        duracion: 60,
        orden: 9
      },
      {
        titulo: 'Interrupciones y Timers',
        descripcion: 'Manejo de eventos asíncronos y temporizadores.',
        tipo: 'TEXTO',
        contenido: 'Programación avanzada de Arduino.',
        conceptos: ['Interrupciones', 'Timers', 'ISR'],
        duracion: 70,
        orden: 10
      },
      {
        titulo: 'Proyecto: Sistema de Riego Automático',
        descripcion: 'Construye un sistema que riega plantas basado en humedad del suelo.',
        tipo: 'PROYECTO',
        contenido: 'Proyecto integrador con sensores y actuadores.',
        conceptos: ['Automatización', 'Sensores', 'Proyecto'],
        duracion: 145,
        orden: 11
      }
    ];

    for (const leccion of leccionesModulo2IoT) {
      await client.query(
        `INSERT INTO lecciones (
          id_modulo, titulo, descripcion, tipo_contenido, contenido,
          conceptos_clave, orden, duracion_minutos, es_gratuita
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          mod2IoTId,
          leccion.titulo,
          leccion.descripcion,
          leccion.tipo,
          leccion.contenido,
          leccion.conceptos,
          leccion.orden,
          leccion.duracion,
          false
        ]
      );
    }

    console.log(`  ✓ Módulo 2: ${leccionesModulo2IoT.length} lecciones creadas`);

    await client.query('COMMIT');
    
    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('  - 2 cursos creados');
    console.log('  - 4 módulos creados');
    console.log(`  - ${leccionesModulo1.length + leccionesModulo2.length + leccionesModulo1IoT.length + leccionesModulo2IoT.length} lecciones creadas`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedCursosCompletos()
  .then(() => {
    console.log('\n✨ Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
