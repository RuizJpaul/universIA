const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function insertarModulo1() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    console.log('🚀 Insertando Módulo 1 del curso de IA (ID: 5)...\n')

    // Insertar el módulo
    console.log('📖 Creando Módulo 1: Introducción a la Programación en Python')
    const modulo = await client.query(`
      INSERT INTO modulos (id_curso, titulo, descripcion, orden, duracion_estimada)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_modulo
    `, [
      5, // ID del curso de IA que ya creamos
      'Introducción a la Programación en Python',
      'Adquiere la base de programación esencial en Python, el lenguaje estándar en Ciencia de Datos, y conoce su aplicación inicial en el entorno de la IA.',
      1,
      14
    ])
    const idModulo = modulo.rows[0].id_modulo
    console.log(`✅ Módulo creado con ID: ${idModulo}\n`)

    // Lección 1
    console.log('  📝 Insertando Lección 1...')
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo,
      '¿Qué es Programar? y Primeros Pasos con Python',
      'Entender la programación y configurar el entorno de trabajo usando herramientas clave para Data Science.',
      'INTERACTIVO',
      'Aprende qué es la programación, por qué Python es el lenguaje ideal para IA, y ejecuta tu primer programa.',
      1,
      90,
      ['Comprender qué es la programación', 'Conocer las ventajas de Python', 'Configurar el entorno', 'Ejecutar tu primer programa'],
      ['Algoritmo', 'Python', 'Jupyter Notebook', 'Google Colab', 'print()']
    ])

    // Lección 2
    console.log('  📝 Insertando Lección 2...')
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo,
      'Variables, Tipos de Datos y Operadores',
      'Comprender cómo almacenar y manipular los diferentes tipos de información en Python.',
      'INTERACTIVO',
      'Aprende a crear variables, usar diferentes tipos de datos (int, float, str, bool) y aplicar operadores.',
      2,
      100,
      ['Crear y utilizar variables', 'Identificar tipos de datos', 'Aplicar operadores', 'Recibir datos con input()'],
      ['Variables', 'int', 'float', 'str', 'bool', 'Operadores', 'input()']
    ])

    // Lección 3
    console.log('  📝 Insertando Lección 3...')
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo,
      'Estructuras Condicionales',
      'Aprender a implementar la lógica para la toma de decisiones en el código.',
      'INTERACTIVO',
      'Domina if, elif, else para crear programas que tomen decisiones basadas en condiciones.',
      3,
      95,
      ['Implementar estructuras if', 'Usar elif y else', 'Comprender la indentación', 'Crear lógica condicional'],
      ['if', 'elif', 'else', 'Indentación', 'Condiciones', 'Lógica de decisión']
    ])

    // Lección 4
    console.log('  📝 Insertando Lección 4...')
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo,
      'Estructuras de Control y Funciones',
      'Dominar las estructuras repetitivas y aprender a organizar el código en bloques reutilizables.',
      'INTERACTIVO',
      'Aprende bucles for y while, cómo crear funciones con def, y organizar código reutilizable.',
      4,
      110,
      ['Implementar bucles for', 'Usar bucles while', 'Crear funciones con def', 'Manejar parámetros y retorno'],
      ['for', 'while', 'range()', 'Funciones', 'def', 'return', 'break', 'continue']
    ])

    // Lección 5
    console.log('  📝 Insertando Lección 5...')
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo,
      'Listas, Diccionarios y Estructuras de Datos',
      'Manejar las colecciones de datos fundamentales para la manipulación y el análisis.',
      'INTERACTIVO',
      'Domina listas, diccionarios, tuplas y sets. Aprende métodos esenciales y cuándo usar cada estructura.',
      5,
      120,
      ['Crear y manipular listas', 'Usar diccionarios', 'Entender tuplas y sets', 'Aplicar métodos de colecciones'],
      ['Listas', 'Diccionarios', 'Tuplas', 'Sets', 'append()', 'pop()', 'keys()', 'values()']
    ])

    // Lección 6
    console.log('  📝 Insertando Lección 6...')
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo,
      'Primer Contacto con Librerías: Pandas y NumPy',
      'Introducir las librerías especializadas que se usan para trabajar con grandes volúmenes de datos.',
      'INTERACTIVO',
      'Aprende a importar librerías, usar NumPy para cálculos numéricos y Pandas para análisis de datos.',
      6,
      115,
      ['Importar y usar librerías', 'Crear arrays de NumPy', 'Usar funciones estadísticas', 'Crear DataFrames de Pandas'],
      ['Librerías', 'import', 'NumPy', 'Pandas', 'DataFrame', 'Array', 'np.mean()']
    ])

    // Lección 7 - Mini Proyecto
    console.log('  📝 Insertando Lección 7 (Mini Proyecto)...')
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo,
      'Mini Proyecto 1: Análisis Básico de Datos en Python',
      'Aplicar los fundamentos de Python, las estructuras de datos y el uso básico de librerías para un análisis simple.',
      'PROYECTO',
      'Proyecto integrador: Crea un sistema de análisis de ventas usando listas, diccionarios, funciones, NumPy y Pandas.',
      7,
      150,
      ['Integrar estructuras de datos y funciones', 'Modelar datos de negocio', 'Aplicar NumPy y Pandas', 'Crear reportes automatizados'],
      ['Proyecto', 'Integración', 'Análisis de datos', 'NumPy', 'Pandas', 'DataFrames']
    ])

    await client.query('COMMIT')
    console.log('\n✅ ¡Módulo 1 completado con 7 lecciones!')
    console.log('\n📊 Resumen:')
    console.log('  • Curso: Inteligencia Artificial y Machine Learning (ID: 5)')
    console.log(`  • Módulo: ${modulo.rows[0].id_modulo}`)
    console.log('  • Lecciones: 7')
    console.log('  • Duración total: 14 horas\n')

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

insertarModulo1()
