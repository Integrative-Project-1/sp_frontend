# Sprint 3 — Casos de Prueba

## Contexto

Sprint 3 implementa **T3: Reprogramar + Detección y Resolución de Conflictos**.
Historias cubiertas: **US-06**, **US-07**, **US-08**, **TS-06**.

**Prerequisitos:**
- Backend corriendo en `http://localhost:8000`
- Frontend corriendo en `http://localhost:5173`
- Usuario autenticado con al menos una actividad que tenga subtareas creadas

---

## US-06 — Reprogramar subtarea

### CP-01: Reprogramación exitosa con fecha válida

**Pasos:**
1. Ir a `/hoy`
2. Expandir una actividad que tenga subtareas
3. Hacer clic en el ícono de calendario de cualquier subtarea
4. En el modal, seleccionar una fecha futura válida
5. Dejar las horas estimadas como están
6. Hacer clic en **Guardar**

**Resultado esperado:**
- El modal se cierra
- Aparece el toast "Subtarea reprogramada correctamente"
- La subtarea muestra la nueva fecha en la tarjeta
- La subtarea aparece en el grupo correcto de `/hoy` (vencidas / para hoy / próximas)

---

### CP-02: Reprogramación con cambio de horas estimadas

**Pasos:**
1. Abrir el modal de reprogramar en cualquier subtarea
2. Cambiar la fecha
3. Cambiar las horas estimadas a un valor distinto (ej. de 2h a 4h)
4. Hacer clic en **Guardar**

**Resultado esperado:**
- La subtarea se actualiza con la nueva fecha y las nuevas horas
- El cambio persiste al recargar la página

---

### CP-03: Botón Cancelar no guarda cambios

**Pasos:**
1. Abrir el modal de reprogramar
2. Cambiar la fecha y las horas
3. Hacer clic en **Cancelar**

**Resultado esperado:**
- El modal se cierra
- La subtarea conserva su fecha y horas originales

---

### CP-04: Cerrar modal con Escape

**Pasos:**
1. Abrir el modal de reprogramar
2. Presionar la tecla **Escape**

**Resultado esperado:**
- El modal se cierra sin guardar cambios

---

### CP-05: Cerrar modal haciendo clic en el fondo

**Pasos:**
1. Abrir el modal de reprogramar
2. Hacer clic fuera del panel del modal (en el área oscura)

**Resultado esperado:**
- El modal se cierra sin guardar cambios

---

## US-07 — Detectar conflicto por sobrecarga

### CP-06: Sin conflicto — barra verde

**Pasos:**
1. Abrir el modal de reprogramar en una subtarea
2. Seleccionar una fecha donde la carga total del día (incluyendo esta subtarea) sea menor o igual al límite diario

**Resultado esperado:**
- La barra de progreso se muestra en **verde**
- Aparece el mensaje "Sin sobrecarga para ese día"
- El botón **Guardar** está habilitado

---

### CP-07: Con conflicto — barra roja y mensaje de alerta

**Pasos:**
1. Asegurarse de tener varias subtareas planificadas en un mismo día que sumen más horas que el límite (por defecto 6h)
2. Abrir el modal de reprogramar en otra subtarea
3. Seleccionar ese día cargado

**Resultado esperado:**
- La barra de progreso se muestra en **rojo**
- Aparece el mensaje: *"Quedarías con Xh planificadas (límite 6h). Ajusta la fecha o reduce las horas estimadas."*
- El botón **Guardar** sigue habilitado (el usuario puede guardar de todas formas)

---

### CP-08: Cambio de fecha actualiza el indicador en tiempo real

**Pasos:**
1. Abrir el modal de reprogramar
2. Seleccionar una fecha con conflicto → verificar barra roja
3. Cambiar a una fecha sin conflicto

**Resultado esperado:**
- La barra cambia de rojo a verde sin necesidad de recargar

---

### CP-09: El cálculo excluye la subtarea que se está reprogramando

**Pasos:**
1. Tener una subtarea A con 4h en el día X
2. Abrir el modal de reprogramar para esa misma subtarea A
3. Seleccionar el día X como nueva fecha

**Resultado esperado:**
- El indicador de carga NO cuenta las horas de A dos veces
- Si el total del día X sin A es menor al límite, no debe haber conflicto

---

## US-08 — Resolver conflicto

### CP-10: Resolver moviendo a otro día

**Pasos:**
1. Con el modal abierto y conflicto detectado (barra roja)
2. Cambiar la fecha a un día sin sobrecarga

**Resultado esperado:**
- La barra cambia a verde
- El mensaje de alerta desaparece
- Al guardar, la subtarea queda en el nuevo día sin conflicto

---

### CP-11: Resolver reduciendo horas estimadas

**Pasos:**
1. Con el modal abierto y conflicto detectado (barra roja)
2. Reducir el valor de horas estimadas hasta que el total del día quede dentro del límite

**Resultado esperado:**
- La barra cambia a verde progresivamente al reducir las horas
- Al guardar, la subtarea queda con las nuevas horas y sin conflicto

---

### CP-12: Conflicto persiste si las horas siguen siendo altas

**Pasos:**
1. Con conflicto detectado
2. Reducir las horas pero no lo suficiente para estar dentro del límite

**Resultado esperado:**
- La barra sigue en rojo
- El mensaje de alerta permanece visible

---

## TS-06 — Accesibilidad

### CP-13: Focus trap dentro del modal

**Pasos:**
1. Abrir el modal de reprogramar
2. Presionar **Tab** repetidamente

**Resultado esperado:**
- El foco cicla únicamente entre los elementos del modal (fecha, horas, cancelar, guardar)
- El foco nunca escapa hacia elementos detrás del modal

---

### CP-14: Shift+Tab navega en orden inverso

**Pasos:**
1. Abrir el modal
2. Presionar **Shift+Tab** desde el primer elemento

**Resultado esperado:**
- El foco va al último elemento del modal (botón Guardar)

---

### CP-15: Mensajes de conflicto anunciados por lector de pantalla

**Pasos:**
1. Abrir el modal con un lector de pantalla activo (NVDA, VoiceOver, etc.)
2. Seleccionar una fecha con conflicto

**Resultado esperado:**
- El lector de pantalla anuncia el mensaje de conflicto automáticamente (el elemento tiene `role="alert"`)

---

### CP-16: Botones con labels descriptivos

**Verificar en el código / inspector:**
- El ícono de calendario en cada subtarea tiene `aria-label="Reprogramar subtarea: [nombre]"`
- El botón cerrar del modal tiene `aria-label="Cerrar modal"`
- El botón guardar tiene `aria-label="Guardar nueva fecha y horas"`

---

## Casos de error

### CP-17: Error de red al guardar

**Pasos:**
1. Detener el backend
2. Abrir el modal y hacer clic en **Guardar**

**Resultado esperado:**
- Aparece un mensaje de error en rojo dentro del modal
- El modal no se cierra
- El usuario puede reintentar

---

### CP-18: Guardar sin seleccionar fecha

**Pasos:**
1. Abrir el modal (la fecha puede estar vacía si la subtarea no tenía fecha)
2. No seleccionar ninguna fecha
3. Intentar hacer clic en **Guardar**

**Resultado esperado:**
- El botón **Guardar** está deshabilitado (no se puede hacer clic)
