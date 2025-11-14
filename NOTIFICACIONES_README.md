# 📰 Sistema de Noticias y Notificaciones

## 🌱 Poblar Base de Datos

Para poblar la base de datos con noticias y eventos de prueba, ejecuta:

```bash
npm run db:seed
```

Este comando insertará:
- ✅ 6 noticias de ejemplo (con diferentes categorías)
- ✅ 6 eventos próximos (webinars, talleres, hackathons)
- ✅ Datos realistas con contenido detallado
- ✅ Fechas dinámicas (eventos futuros)

## 📊 Datos Insertados

### Noticias
1. **Nueva funcionalidad**: Laboratorios Virtuales de Electrónica
2. **Actualización**: Sistema de IA Tutora mejorado
3. **Cursos**: 15 nuevos cursos de certificación
4. **Concurso**: Innovación Tecnológica 2025
5. **Alianza**: Google Cloud Platform
6. **Sistema**: Mentorías personalizadas

### Eventos
1. **Webinar**: Inteligencia Artificial en la Educación (20 Nov)
2. **Workshop**: Machine Learning con Python (25-29 Nov)
3. **Hackathon**: Soluciones EdTech (6-9 Dic)
4. **Q&A**: Tech Leaders (18 Nov)
5. **Networking**: Tech Students Night (22 Nov)
6. **Certificación**: AWS Solutions Architect (3-27 Dic)

## 🔔 Sistema de Notificaciones

### API Endpoint
- **GET** `/api/estudiante/notificaciones` - Obtener notificaciones
- **PUT** `/api/estudiante/notificaciones` - Marcar como leída

### Tipos de Notificaciones
1. **Noticias** - Últimas noticias publicadas (7 días)
2. **Eventos** - Eventos próximos (próximos 7 días)
3. **Evaluaciones** - Evaluaciones pendientes
4. **Logros** - Logros recientemente desbloqueados

### Prioridades
- 🔴 **Urgente**: Evaluaciones en menos de 2 días
- 🟣 **Importante**: Noticias destacadas, eventos destacados
- 🟢 **Éxito**: Logros desbloqueados
- 🔵 **Info**: Información general

## 🎨 Componente NotificationBell

### Uso
```tsx
import NotificationBell from "@/components/notification-bell"

<NotificationBell />
```

### Características
- ✅ Badge con contador de no leídas
- ✅ Popover con lista de notificaciones
- ✅ Auto-refresh cada 30 segundos
- ✅ Animaciones con Framer Motion
- ✅ Marcar todas como leídas
- ✅ Iconos y colores por tipo/prioridad
- ✅ Formato de tiempo relativo

## 🔄 Integración en Navbar

Para integrar el bell de notificaciones en el navbar, reemplaza el botón de Bell existente con:

```tsx
import NotificationBell from "@/components/notification-bell"

// En lugar de:
<Button variant="ghost" size="icon">
  <Bell className="w-5 h-5" />
</Button>

// Usa:
<NotificationBell />
```

## 📝 Ejemplo de Respuesta API

```json
{
  "success": true,
  "notifications": [
    {
      "tipo": "noticia",
      "categoria": "Tecnología",
      "titulo": "Nueva funcionalidad: Laboratorios Virtuales",
      "mensaje": "Simulación de circuitos en tiempo real",
      "fecha": "2025-11-14T10:30:00Z",
      "leido": false,
      "prioridad": "importante"
    },
    {
      "tipo": "evento",
      "categoria": "Evento",
      "titulo": "Webinar: IA en Educación",
      "mensaje": "Evento próximo: WEBINAR",
      "fecha": "2025-11-20T18:00:00Z",
      "leido": false,
      "prioridad": "importante"
    }
  ],
  "unreadCount": 12
}
```

## 🎯 Próximos Pasos

### Mejoras Sugeridas
1. **Tabla de Notificaciones Personales**
   - Crear tabla `notificaciones_estudiante` para tracking individual
   - Persistir estado de leído/no leído por usuario

2. **WebSockets / SSE**
   - Notificaciones en tiempo real sin polling
   - Socket.io o Server-Sent Events

3. **Preferencias de Notificaciones**
   - Configuración por tipo de notificación
   - Horarios de notificaciones
   - Canales (email, push, in-app)

4. **Push Notifications**
   - Service Workers para notificaciones del navegador
   - Firebase Cloud Messaging para móvil

5. **Filtros y Búsqueda**
   - Filtrar por tipo/categoría
   - Búsqueda en historial de notificaciones
   - Archivar notificaciones

## 🐛 Troubleshooting

### Error: "Administrador no encontrado"
El seed creará automáticamente un administrador si no existe.

### Error de conexión a base de datos
Verifica que `DATABASE_URL` esté configurado en `.env.local`

### Notificaciones no aparecen
1. Verifica que haya datos en las tablas `noticias` y `eventos`
2. Ejecuta `npm run db:seed` para poblar datos
3. Revisa la consola del navegador para errores

## 📚 Recursos

- [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover)
- [Framer Motion](https://www.framer.com/motion/)
- [PostgreSQL Intervals](https://www.postgresql.org/docs/current/datatype-datetime.html)
