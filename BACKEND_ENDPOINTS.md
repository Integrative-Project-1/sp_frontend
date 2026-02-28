# Backend API Endpoints Reference

## Estado: ✅ Implementado e Integrado

Estos endpoints han sido revisados contra las rutas Django del backend y están completamente implementados en `src/services/api.js`.

---

## 📋 ACTIVIDADES (US-01 / US-03)

### ✅ Listar todas las actividades

```javascript
getActivities();
// GET /activities/
```

### ✅ Obtener detalle de una actividad

```javascript
getActivityDetail(id);
// GET /activities/<id>/
```

### ✅ Crear nueva actividad

```javascript
createActivity(activityData);
// POST /activities/
// Body: { title, course, type, eventDate, startTime, deadline, milestones[] }
```

### ✅ Actualizar actividad

```javascript
updateActivity(id, activityData);
// PUT /activities/<id>/
// Body: { title, course, type, eventDate, startTime, deadline, milestones[] }
```

### ✅ Eliminar actividad

```javascript
deleteActivity(id);
// DELETE /activities/<id>/
// (El backend maneja cascada automáticamente)
```

---

## 📝 SUBTAREAS / TAREAS (US-02)

### ✅ Listar subtareas de una actividad

```javascript
getSubtasks(activityId);
// GET /activities/<activityId>/subtasks/
```

### ✅ Obtener detalle de una subtarea

```javascript
getSubtaskDetail(activityId, subtaskId);
// GET /activities/<activityId>/subtasks/<subtaskId>/
```

### ✅ Crear subtarea en una actividad

```javascript
createSubtask(activityId, subtaskData);
// POST /activities/<activityId>/subtasks/
// Body: { text, completed, targetDate, estimatedEffort }
```

### ✅ Actualizar subtarea

```javascript
updateSubtask(activityId, subtaskId, subtaskData);
// PUT /activities/<activityId>/subtasks/<subtaskId>/
// Body: { text, completed, targetDate, estimatedEffort }
```

### ✅ Eliminar subtarea

```javascript
deleteSubtask(activityId, subtaskId);
// DELETE /activities/<activityId>/subtasks/<subtaskId>/
```

---

## 🔧 Cambios Realizados

### 1. `src/services/api.js`

- ✅ Reorganizado y documentado
- ✅ Todos los endpoints CRUD para actividades implementados
- ✅ Todos los endpoints CRUD para subtareas implementados
- ✅ Rutas corregidas según especificación Django

### 2. `src/hooks/useActivities.js`

- ✅ Reemplazado sistema de mocks con llamadas reales al API
- ✅ Mantiene fallback a mocks si el backend no está disponible
- ✅ Sincronización con localStorage para persistencia local
- ✅ Error handling mejorado
- ✅ Agregado estado `loading`
- ✅ Funciones ahora retornan promesas para manejar estados asincronos

### 3. `src/pages/HomePage.jsx`

- ✅ Agregado manejo de estado `loading`
- ✅ Mejorado manejo de eliminar actividades (asincrónico)
- ✅ Error messages más informativos
- ✅ ImportLy agregado `LoadingSpinner`

### 4. `src/pages/CreateActivityPage.jsx`

- ✅ Implementado manejo de promesas para `addActivity`
- ✅ Agregado error handling
- ✅ Mensajes de error visibles al usuario

### 5. `src/pages/EditActivityPage.jsx`

- ✅ Implementado manejo de promesas para `updateActivity`
- ✅ Agregado error handling
- ✅ Mejorada busqueda de actividad (por id numérico o string)
- ✅ Mensajes de error visibles al usuario

---

## 🔌 Cómo Usar

### Importar en cualquier componente:

```javascript
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from '../services/api';
```

### O usar el hook:

```javascript
import { useActivities } from '../hooks/useActivities';

const MyComponent = () => {
  const { activities, addActivity, updateActivity, deleteActivity, error, loading } =
    useActivities();

  // activities: Array de actividades
  // loading: boolean - está cargando
  // error: string | null - mensaje de error si hay
};
```

---

## 📡 Configuración del API URL

Por defecto: `http://localhost:8000/api`

Para cambiar, edita la variable de entorno:

```javascript
// En .env
VITE_API_BASE_URL=http://tu-dominio.com/api
```

---

## ⚠️ Notas Importantes

1. **Mocks como fallback**: Si el backend no está disponible, automáticamente carga datos de ejemplo desde `src/mock/activitiesMock.js`

2. **Subtareas en Frontend**: Actualmente las subtareas se manejan cómo propiedad anidada `milestones` en la actividad. Los endpoints para operaciones CRUD independientes de subtareas están listos pero dependen de cómo el backend las devuelva.

3. **Persistencia**: Los datos se guardan en localStorage automáticamente para mejorar UX incluso con conexión lenta.

4. **Error Handling**: Todos los errores se manejan y se muestran al usuario. Revisa la consola para más detalles en desarrollo.

---

## 🚀 Próximos Pasos

- Los endpoints están BUILD READY para:
  - [ ] Gestión independiente de subtareas
  - [ ] Sincronización en tiempo real (WebSockets)
  - [ ] Caché inteligente con SWR/React Query
  - [ ] Offline-first con service workers
