const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function insertarCursoCompleto() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    console.log('\n🚀 Insertando curso de IA con Módulo 1 completo...\n')

    // 0. Crear tablas si no existen
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id_categoria SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icono VARCHAR(50)
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS tutores (
        id_tutor SERIAL PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        especialidad VARCHAR(200),
        biografia TEXT
      )
    `)

    // 1. Verificar/crear categoría
    let categoria = await client.query(`SELECT id_categoria FROM categorias WHERE slug = 'tecnologia'`)
    if (categoria.rows.length === 0) {
      categoria = await client.query(`
        INSERT INTO categorias (nombre, slug, icono)
        VALUES ('Tecnología', 'tecnologia', 'cpu')
        RETURNING id_categoria
      `)
      console.log('✅ Categoría creada')
    }
    const idCategoria = categoria.rows[0].id_categoria

    // 2. Verificar/crear tutor
    let tutor = await client.query(`SELECT id_tutor FROM tutores WHERE nombre = 'IA Tutor'`)
    if (tutor.rows.length === 0) {
      tutor = await client.query(`
        INSERT INTO tutores (nombre, especialidad, biografia)
        VALUES ('IA Tutor', 'Inteligencia Artificial', 'Tutor especializado en enseñanza de IA y Machine Learning')
        RETURNING id_tutor
      `)
      console.log('✅ Tutor creado')
    }
    const idTutor = tutor.rows[0].id_tutor

    // 3. Insertar el curso
    console.log('📚 Creando curso: Inteligencia Artificial y Machine Learning')
    const curso = await client.query(`
      INSERT INTO cursos (
        id_categoria, id_tutor, nombre, slug, descripcion, descripcion_corta,
        nivel, duracion_horas, imagen_portada, objetivos, requisitos, tags, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id_curso
    `, [
      idCategoria,
      idTutor,
      'Inteligencia Artificial y Machine Learning',
      'inteligencia-artificial-machine-learning',
      'Aprende los fundamentos de la Inteligencia Artificial y Machine Learning desde cero. Domina Python, análisis de datos, algoritmos de ML y Deep Learning para construir soluciones reales.',
      'Aprende IA y ML desde cero con Python',
      'PRINCIPIANTE',
      60,
      '/images/cursos/ia-ml.jpg',
      ['Dominar Python para IA', 'Entender algoritmos de Machine Learning', 'Crear modelos predictivos', 'Aplicar Deep Learning'],
      ['Matemáticas básicas', 'Conocimientos de computación básica', 'Ganas de aprender'],
      ['Python', 'Machine Learning', 'Deep Learning', 'NumPy', 'Pandas', 'TensorFlow', 'Redes Neuronales', 'IA'],
      'PUBLICADO'
    ])
    const idCurso = curso.rows[0].id_curso
    console.log(`✅ Curso creado con ID: ${idCurso}\n`)

    // 4. Insertar Módulo 1
    console.log('📖 Creando Módulo 1: Introducción a la Programación en Python')
    const modulo = await client.query(`
      INSERT INTO modulos (id_curso, titulo, descripcion, orden, duracion_estimada)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_modulo
    `, [
      idCurso,
      'Introducción a la Programación en Python',
      'Adquiere la base de programación esencial en Python, el lenguaje estándar en Ciencia de Datos, y conoce su aplicación inicial en el entorno de la IA.',
      1,
      14
    ])
    const idModulo = modulo.rows[0].id_modulo
    console.log(`✅ Módulo creado con ID: ${idModulo}\n`)

    // 5. Insertar las 7 lecciones
    const lecciones = [
      {
        titulo: '¿Qué es Programar? y Primeros Pasos con Python',
        descripcion: 'Entender la programación y configurar el entorno de trabajo usando herramientas clave para Data Science.',
        contenido: 'Aprende qué es la programación, por qué Python es el lenguaje ideal para IA, y ejecuta tu primer programa.',
        duracion: 90,
        objetivos: ['Comprender qué es la programación', 'Conocer las ventajas de Python', 'Configurar el entorno', 'Ejecutar tu primer programa'],
        conceptos: ['Algoritmo', 'Python', 'Jupyter Notebook', 'Google Colab', 'print()']
      },
      {
        titulo: 'Variables, Tipos de Datos y Operadores',
        descripcion: 'Comprender cómo almacenar y manipular los diferentes tipos de información en Python.',
        contenido: 'Aprende a crear variables, usar diferentes tipos de datos (int, float, str, bool) y aplicar operadores.',
        duracion: 100,
        objetivos: ['Crear y utilizar variables', 'Identificar tipos de datos', 'Aplicar operadores', 'Recibir datos con input()'],
        conceptos: ['Variables', 'int', 'float', 'str', 'bool', 'Operadores', 'input()']
      },
      {
        titulo: 'Estructuras Condicionales',
        descripcion: 'Aprender a implementar la lógica para la toma de decisiones en el código.',
        contenido: 'Domina if, elif, else para crear programas que tomen decisiones basadas en condiciones.',
        duracion: 95,
        objetivos: ['Implementar estructuras if', 'Usar elif y else', 'Comprender la indentación', 'Crear lógica condicional'],
        conceptos: ['if', 'elif', 'else', 'Indentación', 'Condiciones', 'Lógica de decisión']
      },
      {
        titulo: 'Estructuras de Control y Funciones',
        descripcion: 'Dominar las estructuras repetitivas y aprender a organizar el código en bloques reutilizables.',
        contenido: 'Aprende bucles for y while, cómo crear funciones con def, y organizar código reutilizable.',
        duracion: 110,
        objetivos: ['Implementar bucles for', 'Usar bucles while', 'Crear funciones con def', 'Manejar parámetros y retorno'],
        conceptos: ['for', 'while', 'range()', 'Funciones', 'def', 'return', 'break', 'continue']
      },
      {
        titulo: 'Listas, Diccionarios y Estructuras de Datos',
        descripcion: 'Manejar las colecciones de datos fundamentales para la manipulación y el análisis.',
        contenido: 'Domina listas, diccionarios, tuplas y sets. Aprende métodos esenciales y cuándo usar cada estructura.',
        duracion: 120,
        objetivos: ['Crear y manipular listas', 'Usar diccionarios', 'Entender tuplas y sets', 'Aplicar métodos de colecciones'],
        conceptos: ['Listas', 'Diccionarios', 'Tuplas', 'Sets', 'append()', 'pop()', 'keys()', 'values()']
      },
      {
        titulo: 'Primer Contacto con Librerías: Pandas y NumPy',
        descripcion: 'Introducir las librerías especializadas que se usan para trabajar con grandes volúmenes de datos.',
        contenido: 'Aprende a importar librerías, usar NumPy para cálculos numéricos y Pandas para análisis de datos.',
        duracion: 115,
        objetivos: ['Importar y usar librerías', 'Crear arrays de NumPy', 'Usar funciones estadísticas', 'Crear DataFrames de Pandas'],
        conceptos: ['Librerías', 'import', 'NumPy', 'Pandas', 'DataFrame', 'Array', 'np.mean()']
      },
      {
        titulo: 'Mini Proyecto 1: Análisis Básico de Datos en Python',
        descripcion: 'Aplicar los fundamentos de Python, las estructuras de datos y el uso básico de librerías para un análisis simple.',
        contenido: 'Proyecto integrador: Crea un sistema de análisis de ventas usando listas, diccionarios, funciones, NumPy y Pandas.',
        duracion: 150,
        objetivos: ['Integrar estructuras de datos y funciones', 'Modelar datos de negocio', 'Aplicar NumPy y Pandas', 'Crear reportes automatizados'],
        conceptos: ['Proyecto', 'Integración', 'Análisis de datos', 'NumPy', 'Pandas', 'DataFrames']
      }
    ]

    for (let i = 0; i < lecciones.length; i++) {
      const leccion = lecciones[i]
      console.log(`  📝 Lección ${i + 1}/7: ${leccion.titulo}`)
      
      await client.query(`
        INSERT INTO lecciones (
          id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
          objetivos_aprendizaje, conceptos_clave
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        idModulo,
        leccion.titulo,
        leccion.descripcion,
        i === 6 ? 'PROYECTO' : 'INTERACTIVO',
        leccion.contenido,
        i + 1,
        leccion.duracion,
        leccion.objetivos,
        leccion.conceptos
      ])
    }

    await client.query('COMMIT')
    
    console.log('\n✅ ¡Curso completo insertado exitosamente!\n')
    console.log('📊 Resumen:')
    console.log(`  • Curso ID: ${idCurso}`)
    console.log(`  • Nombre: Inteligencia Artificial y Machine Learning`)
    console.log(`  • Módulos: 1`)
    console.log(`  • Lecciones: 7`)
    console.log(`  • Duración total: 14 horas\n`)

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('\n❌ Error:', error.message)
    console.error('Detalle:', error.detail || 'N/A')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

insertarCursoCompleto()
