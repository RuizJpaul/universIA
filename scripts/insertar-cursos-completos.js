const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function insertarCursosCompletos() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    console.log('🚀 Iniciando inserción de cursos completos...\n')

    // ============================================
    // CURSO 1: INTELIGENCIA ARTIFICIAL Y MACHINE LEARNING
    // ============================================

    console.log('📚 Insertando curso: Inteligencia Artificial y Machine Learning')

    // Crear tabla categorias si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id_categoria SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icono VARCHAR(50),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear la categoría
    const categoria = await client.query(`
      INSERT INTO categorias (nombre, slug, icono)
      VALUES ('Tecnología', 'tecnologia', 'cpu')
      ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id_categoria
    `)
    const idCategoria = categoria.rows[0].id_categoria

    // Crear tabla de tutores si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS tutores (
        id_tutor SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        especialidad VARCHAR(100),
        biografia TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear o obtener tutor
    const tutor = await client.query(`
      INSERT INTO tutores (nombre, especialidad, biografia)
      VALUES ('IA Tutor', 'Inteligencia Artificial', 'Tutor especializado en IA y Machine Learning')
      ON CONFLICT DO NOTHING
      RETURNING id_tutor
    `)
    
    // Si no se insertó (conflicto), obtener el primero
    let idTutor
    if (tutor.rows.length > 0) {
      idTutor = tutor.rows[0].id_tutor
    } else {
      const existingTutor = await client.query(`SELECT id_tutor FROM tutores LIMIT 1`)
      idTutor = existingTutor.rows[0].id_tutor
    }

    const cursoIA = await client.query(`
      INSERT INTO cursos (
        id_categoria,
        id_tutor,
        nombre, 
        descripcion, 
        nivel, 
        duracion_horas, 
        imagen_portada,
        tags,
        estado
      ) VALUES (
        $1, $2,
        'Inteligencia Artificial y Machine Learning',
        'Domina los fundamentos de la Inteligencia Artificial desde cero. Aprende Python para Data Science, manipulación de datos con Pandas y NumPy, algoritmos de Machine Learning supervisado y no supervisado, y Deep Learning con redes neuronales.',
        'PRINCIPIANTE',
        60,
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
        ARRAY['Python', 'Machine Learning', 'Deep Learning', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'IA'],
        'PUBLICADO'
      ) RETURNING id_curso
    `, [idCategoria, idTutor])
    const idCursoIA = cursoIA.rows[0].id_curso
    console.log(`✅ Curso IA creado con ID: ${idCursoIA}`)

    // MÓDULO 1: Introducción a Python
    console.log('\n📖 Módulo 1: Introducción a la Programación en Python')
    const modulo1 = await client.query(`
      INSERT INTO modulos (id_curso, titulo, descripcion, orden, duracion_estimada)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_modulo
    `, [
      idCursoIA,
      'Introducción a la Programación en Python',
      'Adquiere la base de programación esencial en Python, el lenguaje estándar en Ciencia de Datos, y conoce su aplicación inicial en el entorno de la IA.',
      1,
      14
    ])
    const idModulo1 = modulo1.rows[0].id_modulo

    // Lección 1.1
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo1,
      '¿Qué es Programar? y Primeros Pasos con Python',
      'Entender la programación y configurar el entorno de trabajo usando herramientas clave para Data Science.',
      'INTERACTIVO',
      `# ¿Qué es Programar?

La programación es el arte de dar instrucciones precisas a una computadora para resolver problemas. Las máquinas siguen algoritmos (secuencias de pasos lógicos) para ejecutar tareas.

## ¿Por qué Python?

Python es el lenguaje más popular en Ciencia de Datos e Inteligencia Artificial por:
- **Sintaxis clara y legible**: Fácil de aprender y escribir
- **Ecosistema robusto**: Miles de librerías especializadas (NumPy, Pandas, TensorFlow)
- **Gran comunidad**: Soporte y recursos abundantes
- **Versatilidad**: Desde análisis de datos hasta desarrollo web

## Configuración del Entorno

### Herramientas principales:
1. **Python 3.x**: El intérprete del lenguaje
2. **Jupyter Notebooks**: Entorno interactivo ideal para experimentar con código
3. **Google Colab**: Jupyter en la nube, sin instalación necesaria

## Tu Primer Programa

\`\`\`python
print("¡Hola Mundo!")
\`\`\`

Este simple comando hace que Python muestre texto en pantalla. La función \`print()\` es fundamental para mostrar resultados.

### Ejercicio práctico:
Ejecuta estos comandos y observa los resultados:

\`\`\`python
print("Mi primer programa en Python")
print("Python es genial para IA")
print(2 + 2)
\`\`\``,
      1,
      90,
      ARRAY[
        'Comprender qué es la programación y cómo las máquinas ejecutan algoritmos',
        'Conocer las ventajas de Python para Ciencia de Datos',
        'Configurar el entorno de desarrollo (Jupyter/Colab)',
        'Ejecutar tu primer programa en Python'
      ],
      ARRAY['Algoritmo', 'Python', 'Jupyter Notebook', 'Google Colab', 'print()', 'Sintaxis']
    ])
    console.log('  ✓ Lección 1.1 creada')

    // Lección 1.2
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo1,
      'Variables, Tipos de Datos y Operadores',
      'Comprender cómo almacenar y manipular los diferentes tipos de información en Python.',
      'INTERACTIVO',
      `# Variables y Tipos de Datos

## ¿Qué es una Variable?

Una variable es un contenedor que almacena información en la memoria. En Python, no necesitas declarar el tipo de dato (tipado dinámico).

\`\`\`python
nombre = "Ana"
edad = 25
altura = 1.65
es_estudiante = True
\`\`\`

## Tipos de Datos Esenciales

### 1. **int** (Enteros)
Números sin decimales:
\`\`\`python
estudiantes = 30
año = 2025
\`\`\`

### 2. **float** (Decimales)
Números con punto decimal:
\`\`\`python
precio = 99.99
pi = 3.14159
\`\`\`

### 3. **str** (Cadenas de texto)
Texto entre comillas:
\`\`\`python
mensaje = "Hola Python"
nombre = 'María'
\`\`\`

### 4. **bool** (Booleanos)
Verdadero o Falso:
\`\`\`python
aprobado = True
llueve = False
\`\`\`

## Operadores Aritméticos

\`\`\`python
suma = 5 + 3        # 8
resta = 10 - 4      # 6
multiplicacion = 6 * 7  # 42
division = 20 / 4   # 5.0
potencia = 2 ** 3   # 8 (2 elevado al cubo)
modulo = 17 % 5     # 2 (resto de la división)
\`\`\`

## Operadores de Comparación

\`\`\`python
5 == 5    # True (igualdad)
7 > 3     # True (mayor que)
4 < 2     # False (menor que)
10 >= 10  # True (mayor o igual)
\`\`\`

## Operadores Lógicos

\`\`\`python
True and False  # False
True or False   # True
not True        # False
\`\`\`

## Entrada de Datos

La función \`input()\` permite recibir datos del usuario:

\`\`\`python
nombre = input("¿Cómo te llamas? ")
print("Hola, " + nombre)
\`\`\`

### Ejercicio Práctico

Crea un programa que calcule el promedio de dos números:

\`\`\`python
num1 = float(input("Ingresa el primer número: "))
num2 = float(input("Ingresa el segundo número: "))
promedio = (num1 + num2) / 2
print("El promedio es:", promedio)
\`\`\``,
      2,
      100,
      ARRAY[
        'Crear y utilizar variables en Python',
        'Identificar y usar los tipos de datos fundamentales',
        'Aplicar operadores aritméticos, lógicos y de comparación',
        'Recibir datos del usuario con input()'
      ],
      ARRAY['Variables', 'int', 'float', 'str', 'bool', 'Operadores', 'input()', 'Tipado dinámico']
    ])
    console.log('  ✓ Lección 1.2 creada')

    // Lección 1.3
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo1,
      'Estructuras Condicionales',
      'Aprender a implementar la lógica para la toma de decisiones en el código.',
      'INTERACTIVO',
      `# Estructuras Condicionales

Las estructuras condicionales permiten que el programa tome decisiones y ejecute diferentes bloques de código según condiciones.

## Estructura if

La estructura más básica para tomar decisiones:

\`\`\`python
edad = 18

if edad >= 18:
    print("Eres mayor de edad")
\`\`\`

⚠️ **Indentación es CRUCIAL**: Python usa espacios (4 espacios o 1 tab) para definir bloques de código.

## Estructura if-else

Ejecuta un bloque si la condición es verdadera, otro si es falsa:

\`\`\`python
temperatura = 25

if temperatura > 30:
    print("Hace calor")
else:
    print("Temperatura agradable")
\`\`\`

## Estructura elif

Para múltiples condiciones:

\`\`\`python
nota = 85

if nota >= 90:
    print("Excelente - A")
elif nota >= 80:
    print("Muy bien - B")
elif nota >= 70:
    print("Bien - C")
else:
    print("Necesitas mejorar")
\`\`\`

## Condiciones Compuestas

Usa operadores lógicos para combinar condiciones:

\`\`\`python
edad = 20
tiene_licencia = True

if edad >= 18 and tiene_licencia:
    print("Puedes conducir")
else:
    print("No puedes conducir")
\`\`\`

## Ejercicio Interactivo: Sistema de Votación

\`\`\`python
edad = int(input("¿Cuál es tu edad? "))

if edad >= 18:
    print("✅ Puedes votar")
    print("No olvides tu DNI")
else:
    años_faltantes = 18 - edad
    print(f"❌ No puedes votar aún")
    print(f"Te faltan {años_faltantes} años")
\`\`\`

## Anidación de Condicionales

\`\`\`python
hora = 14

if hora < 12:
    print("Buenos días")
else:
    if hora < 18:
        print("Buenas tardes")
    else:
        print("Buenas noches")
\`\`\`

### Práctica Adicional

Crea un programa que determine si un número es positivo, negativo o cero:

\`\`\`python
numero = float(input("Ingresa un número: "))

if numero > 0:
    print("El número es positivo")
elif numero < 0:
    print("El número es negativo")
else:
    print("El número es cero")
\`\`\``,
      3,
      95,
      ARRAY[
        'Implementar estructuras if para tomar decisiones',
        'Usar elif y else para múltiples condiciones',
        'Comprender la importancia de la indentación en Python',
        'Crear programas con lógica condicional'
      ],
      ARRAY['if', 'elif', 'else', 'Indentación', 'Condiciones', 'Lógica de decisión', 'Bloques de código']
    ])
    console.log('  ✓ Lección 1.3 creada')

    // Lección 1.4
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo1,
      'Estructuras de Control y Funciones',
      'Dominar las estructuras repetitivas y aprender a organizar el código en bloques reutilizables.',
      'INTERACTIVO',
      `# Estructuras de Control: Bucles

Los bucles permiten ejecutar un bloque de código repetidamente.

## Bucle for

Itera sobre una secuencia (lista, rango, etc.):

\`\`\`python
# Repetir 5 veces
for i in range(5):
    print(f"Iteración {i}")

# Recorrer una lista
frutas = ["manzana", "banana", "naranja"]
for fruta in frutas:
    print(f"Me gusta la {fruta}")
\`\`\`

### La función range()

\`\`\`python
range(5)        # 0, 1, 2, 3, 4
range(1, 6)     # 1, 2, 3, 4, 5
range(0, 10, 2) # 0, 2, 4, 6, 8 (de 2 en 2)
\`\`\`

## Bucle while

Se ejecuta mientras la condición sea verdadera:

\`\`\`python
contador = 0
while contador < 5:
    print(f"Contador: {contador}")
    contador += 1  # Incrementa en 1
\`\`\`

⚠️ **Cuidado**: Asegúrate de que la condición eventualmente sea falsa, o tendrás un bucle infinito.

## Control de Flujo: break y continue

\`\`\`python
# break: Sale del bucle
for i in range(10):
    if i == 5:
        break
    print(i)  # Imprime 0,1,2,3,4

# continue: Salta a la siguiente iteración
for i in range(5):
    if i == 2:
        continue
    print(i)  # Imprime 0,1,3,4
\`\`\`

# Funciones

Las funciones son bloques de código reutilizables que realizan una tarea específica.

## Definir una Función

\`\`\`python
def saludar():
    print("¡Hola!")
    print("Bienvenido a Python")

# Llamar la función
saludar()
\`\`\`

## Funciones con Parámetros

\`\`\`python
def saludar_persona(nombre):
    print(f"¡Hola, {nombre}!")

saludar_persona("Ana")
saludar_persona("Carlos")
\`\`\`

## Funciones con Retorno

\`\`\`python
def sumar(a, b):
    resultado = a + b
    return resultado

total = sumar(5, 3)
print(total)  # 8
\`\`\`

## Múltiples Parámetros y Valores por Defecto

\`\`\`python
def calcular_area(base, altura=10):
    return base * altura

area1 = calcular_area(5, 4)   # 20
area2 = calcular_area(5)      # 50 (usa altura=10)
\`\`\`

## Ejercicio Práctico: Suma de Lista

Crea una función que reciba una lista de números y retorne su suma:

\`\`\`python
def sumar_lista(numeros):
    suma = 0
    for numero in numeros:
        suma += numero
    return suma

# Probar la función
lista = [10, 20, 30, 40, 50]
resultado = sumar_lista(lista)
print(f"La suma es: {resultado}")  # 150
\`\`\`

## Función Mejorada con while

\`\`\`python
def pedir_numeros():
    numeros = []
    while True:
        entrada = input("Ingresa un número (o 'fin' para terminar): ")
        if entrada.lower() == 'fin':
            break
        numeros.append(float(entrada))
    return numeros

mis_numeros = pedir_numeros()
print(f"Ingresaste: {mis_numeros}")
print(f"La suma es: {sumar_lista(mis_numeros)}")
\`\`\``,
      4,
      110,
      ARRAY[
        'Implementar bucles for para iterar sobre secuencias',
        'Usar bucles while con condiciones',
        'Crear funciones reutilizables con def',
        'Manejar parámetros y valores de retorno',
        'Controlar el flujo con break y continue'
      ],
      ARRAY['for', 'while', 'range()', 'Funciones', 'def', 'return', 'Parámetros', 'break', 'continue']
    ])
    console.log('  ✓ Lección 1.4 creada')

    // Lección 1.5
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo1,
      'Listas, Diccionarios y Estructuras de Datos',
      'Manejar las colecciones de datos fundamentales para la manipulación y el análisis.',
      'INTERACTIVO',
      `# Estructuras de Datos en Python

Python ofrece varias estructuras para organizar colecciones de datos.

## Listas

Las listas son colecciones ordenadas y mutables (modificables):

\`\`\`python
# Crear una lista
frutas = ["manzana", "banana", "naranja"]
numeros = [1, 2, 3, 4, 5]
mixta = [1, "texto", True, 3.14]

# Acceder por índice (comienza en 0)
print(frutas[0])   # "manzana"
print(frutas[-1])  # "naranja" (último elemento)
\`\`\`

### Métodos de Listas

\`\`\`python
frutas = ["manzana", "banana"]

# Agregar elementos
frutas.append("naranja")     # ["manzana", "banana", "naranja"]
frutas.insert(1, "pera")     # Inserta en posición 1

# Eliminar elementos
frutas.remove("banana")      # Elimina por valor
ultimo = frutas.pop()        # Elimina y retorna el último
del frutas[0]                # Elimina por índice

# Otras operaciones
len(frutas)                  # Longitud de la lista
frutas.sort()                # Ordenar
frutas.reverse()             # Invertir orden
\`\`\`

### Slicing (Rebanadas)

\`\`\`python
numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

numeros[2:5]     # [2, 3, 4]
numeros[:3]      # [0, 1, 2] (desde el inicio)
numeros[7:]      # [7, 8, 9] (hasta el final)
numeros[::2]     # [0, 2, 4, 6, 8] (cada 2 elementos)
\`\`\`

## Diccionarios

Los diccionarios almacenan pares clave-valor:

\`\`\`python
# Crear un diccionario
estudiante = {
    "nombre": "Ana García",
    "edad": 20,
    "carrera": "Ingeniería",
    "promedio": 16.5
}

# Acceder a valores
print(estudiante["nombre"])  # "Ana García"
print(estudiante.get("edad")) # 20
\`\`\`

### Métodos de Diccionarios

\`\`\`python
# Agregar o modificar
estudiante["email"] = "ana@email.com"
estudiante["edad"] = 21

# Eliminar
del estudiante["carrera"]
promedio = estudiante.pop("promedio")

# Obtener claves y valores
claves = estudiante.keys()
valores = estudiante.values()
items = estudiante.items()

# Verificar existencia
if "nombre" in estudiante:
    print("La clave existe")
\`\`\`

### Iterar sobre Diccionarios

\`\`\`python
for clave, valor in estudiante.items():
    print(f"{clave}: {valor}")
\`\`\`

## Tuplas

Las tuplas son listas inmutables (no se pueden modificar):

\`\`\`python
coordenadas = (10, 20)
punto = (5.0, 3.5, 2.1)

# Acceder por índice
x = coordenadas[0]  # 10
y = coordenadas[1]  # 20

# Desempaquetado
lat, lon = coordenadas
\`\`\`

## Sets (Conjuntos)

Colecciones no ordenadas sin duplicados:

\`\`\`python
numeros = {1, 2, 3, 3, 4, 4, 5}
print(numeros)  # {1, 2, 3, 4, 5}

# Operaciones de conjuntos
a = {1, 2, 3}
b = {3, 4, 5}

union = a | b           # {1, 2, 3, 4, 5}
interseccion = a & b    # {3}
diferencia = a - b      # {1, 2}
\`\`\`

## Ejercicio Interactivo

Crea un sistema de gestión de estudiantes:

\`\`\`python
# Información de un estudiante con lista de calificaciones
estudiante = {
    "nombre": "Carlos Pérez",
    "edad": 22,
    "calificaciones": [16, 18, 17, 19, 15]
}

# Calcular promedio
promedio = sum(estudiante["calificaciones"]) / len(estudiante["calificaciones"])

# Agregar nueva calificación
estudiante["calificaciones"].append(20)

# Mostrar información
print(f"Estudiante: {estudiante['nombre']}")
print(f"Edad: {estudiante['edad']}")
print(f"Calificaciones: {estudiante['calificaciones']}")
print(f"Promedio: {promedio:.2f}")
\`\`\`

## List Comprehensions (Avanzado)

Crear listas de forma concisa:

\`\`\`python
# Forma tradicional
cuadrados = []
for i in range(10):
    cuadrados.append(i ** 2)

# Con list comprehension
cuadrados = [i ** 2 for i in range(10)]

# Con condición
pares = [x for x in range(20) if x % 2 == 0]
\`\`\``,
      5,
      120,
      ARRAY[
        'Crear y manipular listas de forma efectiva',
        'Usar diccionarios para almacenar datos estructurados',
        'Entender las diferencias entre listas, tuplas y sets',
        'Aplicar métodos esenciales de cada estructura de datos',
        'Acceder y modificar elementos en colecciones'
      ],
      ARRAY['Listas', 'Diccionarios', 'Tuplas', 'Sets', 'append()', 'pop()', 'keys()', 'values()', 'Slicing', 'Mutabilidad']
    ])
    console.log('  ✓ Lección 1.5 creada')

    // Lección 1.6
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo1,
      'Primer Contacto con Librerías: Pandas y NumPy',
      'Introducir las librerías especializadas que se usan para trabajar con grandes volúmenes de datos.',
      'INTERACTIVO',
      `# Librerías en Python para Data Science

Las librerías son colecciones de código pre-escrito que extienden las capacidades de Python.

## ¿Qué son las Librerías?

En lugar de escribir todo desde cero, usamos librerías especializadas que ya tienen funciones complejas implementadas.

### Instalación

\`\`\`bash
pip install numpy pandas
\`\`\`

### Importar Librerías

\`\`\`python
import numpy as np
import pandas as pd
\`\`\`

El \`as\` crea un alias para escribir menos código.

## NumPy: Computación Numérica

NumPy (Numerical Python) es fundamental para cálculos con arrays multidimensionales.

### Arrays de NumPy

\`\`\`python
import numpy as np

# Crear arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

# Operaciones vectorizadas (muy rápidas)
arr1 * 2        # [2, 4, 6, 8, 10]
arr1 + 10       # [11, 12, 13, 14, 15]
arr1 ** 2       # [1, 4, 9, 16, 25]
\`\`\`

### Funciones Estadísticas

\`\`\`python
datos = np.array([10, 20, 30, 40, 50])

np.mean(datos)     # 30.0 (promedio)
np.median(datos)   # 30.0 (mediana)
np.std(datos)      # Desviación estándar
np.min(datos)      # 10
np.max(datos)      # 50
np.sum(datos)      # 150
\`\`\`

### Crear Arrays Especiales

\`\`\`python
np.zeros(5)           # [0, 0, 0, 0, 0]
np.ones(3)            # [1, 1, 1]
np.arange(0, 10, 2)   # [0, 2, 4, 6, 8]
np.linspace(0, 1, 5)  # 5 números entre 0 y 1
np.random.rand(3)     # 3 números aleatorios entre 0 y 1
\`\`\`

## Pandas: Manipulación de Datos

Pandas es la librería principal para análisis de datos en Python.

### DataFrame: La Estructura Principal

Un DataFrame es como una tabla de Excel en Python:

\`\`\`python
import pandas as pd

# Crear DataFrame desde un diccionario
datos = {
    'nombre': ['Ana', 'Carlos', 'María', 'Juan'],
    'edad': [25, 30, 28, 35],
    'ciudad': ['Lima', 'Cusco', 'Lima', 'Arequipa']
}

df = pd.DataFrame(datos)
print(df)
\`\`\`

Salida:
\`\`\`
   nombre  edad    ciudad
0     Ana    25      Lima
1  Carlos    30     Cusco
2   María    28      Lima
3    Juan    35  Arequipa
\`\`\`

### Operaciones Básicas con DataFrames

\`\`\`python
# Ver las primeras filas
df.head()

# Información del DataFrame
df.info()

# Estadísticas descriptivas
df.describe()

# Seleccionar columna
edades = df['edad']
nombres = df.nombre  # Forma alternativa

# Seleccionar varias columnas
subset = df[['nombre', 'edad']]

# Filtrar filas
mayores_30 = df[df['edad'] > 30]
limeños = df[df['ciudad'] == 'Lima']
\`\`\`

### Agregar y Modificar Datos

\`\`\`python
# Nueva columna
df['pais'] = 'Perú'
df['mayor_edad'] = df['edad'] > 18

# Modificar valores
df.loc[0, 'edad'] = 26

# Agregar fila
nueva_persona = {'nombre': 'Luis', 'edad': 27, 'ciudad': 'Trujillo'}
df = df.append(nueva_persona, ignore_index=True)
\`\`\`

## Ejercicio Práctico: Análisis de Edades

\`\`\`python
import numpy as np
import pandas as pd

# Datos de estudiantes
estudiantes = {
    'nombre': ['Ana', 'Carlos', 'María', 'Juan', 'Sofia'],
    'edad': [20, 22, 21, 23, 20]
}

# Crear DataFrame
df = pd.DataFrame(estudiantes)

# Usar NumPy para calcular estadísticas
edades_array = np.array(df['edad'])

print(f"Promedio de edad: {np.mean(edades_array):.1f}")
print(f"Edad mínima: {np.min(edades_array)}")
print(f"Edad máxima: {np.max(edades_array)}")
print(f"Desviación estándar: {np.std(edades_array):.2f}")

# Usando Pandas
print(f"\nEstadísticas con Pandas:")
print(df['edad'].describe())
\`\`\`

## Leer Datos Externos

Pandas puede leer datos desde archivos:

\`\`\`python
# CSV
df = pd.read_csv('datos.csv')

# Excel
df = pd.read_excel('datos.xlsx')

# JSON
df = pd.read_json('datos.json')
\`\`\`

## Comparación: Listas vs NumPy vs Pandas

\`\`\`python
# Lista de Python
lista = [1, 2, 3, 4, 5]
suma_lista = sum(lista)

# Array de NumPy (más rápido para cálculos)
array = np.array(lista)
suma_array = np.sum(array)
promedio = np.mean(array)

# DataFrame de Pandas (mejor para datos tabulares)
df = pd.DataFrame({'valores': lista})
suma_df = df['valores'].sum()
estadisticas = df.describe()
\`\`\`

### ¿Cuándo usar cada uno?

- **Listas**: Datos simples, mezcla de tipos
- **NumPy**: Cálculos numéricos rápidos, álgebra lineal
- **Pandas**: Datos tabulares, análisis estadístico, limpieza de datos`,
      6,
      115,
      ARRAY[
        'Comprender qué son las librerías y cómo importarlas',
        'Crear y manipular arrays de NumPy',
        'Realizar operaciones estadísticas básicas con NumPy',
        'Crear DataFrames de Pandas',
        'Realizar operaciones básicas de selección y filtrado',
        'Entender cuándo usar listas, NumPy o Pandas'
      ],
      ARRAY['Librerías', 'import', 'NumPy', 'Pandas', 'DataFrame', 'Array', 'np.mean()', 'pd.read_csv()', 'Vectorización']
    ])
    console.log('  ✓ Lección 1.6 creada')

    // Lección 1.7 - Mini Proyecto
    await client.query(`
      INSERT INTO lecciones (
        id_modulo, titulo, descripcion, tipo_contenido, contenido, orden, duracion_minutos,
        objetivos_aprendizaje, conceptos_clave
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      idModulo1,
      'Mini Proyecto 1: Análisis Básico de Datos en Python',
      'Aplicar los fundamentos de Python, las estructuras de datos y el uso básico de librerías para un análisis simple.',
      'PROYECTO',
      '# Mini Proyecto: Sistema de Análisis de Ventas\n\nCrea un programa completo que analice ventas de una tienda usando todo lo aprendido en este módulo.',
      7,
      150,
      ARRAY[
        'Integrar estructuras de datos, funciones y librerías en un proyecto real',
        'Modelar datos de negocio usando diccionarios y listas',
        'Aplicar NumPy para cálculos estadísticos',
        'Usar Pandas para análisis de datos tabulares',
        'Crear reportes automatizados de análisis'
      ],
      ARRAY['Proyecto', 'Integración', 'Análisis de datos', 'NumPy', 'Pandas', 'Funciones', 'DataFrames']
    ])
    console.log('  ✓ Lección 1.7 (Mini Proyecto) creada')

    console.log('\n✅ Módulo 1 completado con 7 lecciones\n')

    await client.query('COMMIT')
    console.log('\n🎉 ¡Cursos insertados exitosamente!')

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

insertarCursosCompletos()
