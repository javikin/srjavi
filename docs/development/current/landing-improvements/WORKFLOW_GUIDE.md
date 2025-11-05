# 🔄 Workflow Guide - Cómo usar este sistema

**Última actualización:** 2025-11-04

---

## 🎯 Propósito

Este sistema de documentación te permite:
- **Trackear progreso** entre múltiples sesiones
- **Mantener contexto** de lo que hiciste y por qué
- **Priorizar** tareas de manera clara
- **No perder información** importante
- **Colaborar** (si más adelante trabajas con alguien)

---

## 📁 Estructura de Archivos

```
docs/
└── development/
    └── current/
        └── landing-improvements/
            ├── README.md                   # 📊 Dashboard principal
            ├── SESSION_LOG.md              # 📝 Log de sesiones
            ├── CONTENT_TASKS.md            # 📝 Tareas de contenido
            ├── DESIGN_TASKS.md             # 🎨 Tareas de diseño
            ├── VISUAL_TASKS.md             # 🖼️ Tareas visuales
            ├── FUNCTIONALITY_TASKS.md      # ⚡ Tareas de funcionalidad
            ├── OPTIMIZATION_TASKS.md       # 🚀 Tareas de optimización
            └── WORKFLOW_GUIDE.md           # 🔄 Esta guía
```

---

## 🚀 Cómo empezar una sesión

### 1. Revisa el README principal
```bash
# Abre el dashboard
open docs/development/current/landing-improvements/README.md
```

Esto te muestra:
- Estadísticas de progreso
- Prioridades actuales
- Próximos pasos

### 2. Revisa el SESSION_LOG
```bash
# Ve qué pasó en la última sesión
open docs/development/current/landing-improvements/SESSION_LOG.md
```

Esto te recuerda:
- Qué completaste
- Qué quedó pendiente
- Decisiones tomadas
- Notas importantes

### 3. Elige tu tarea
Según prioridades en README, abre el archivo correspondiente:
- Contenido → `CONTENT_TASKS.md`
- Diseño → `DESIGN_TASKS.md`
- Visual → `VISUAL_TASKS.md`
- Funcionalidad → `FUNCTIONALITY_TASKS.md`
- Optimización → `OPTIMIZATION_TASKS.md`

---

## ✅ Durante la sesión

### Marcar tarea como "En Progreso"
```markdown
## 🔴 TASK-001: Título de la tarea

**Prioridad:** Alta
**Estado:** 🔴 Pendiente → 🟡 En Progreso  # Cambiar esto
**Sesión objetivo:** #1
```

### Ir completando checklist items
```markdown
### Tareas
- [x] Item completado        # Marcar con x
- [ ] Item pendiente
- [x] Otro item completado
```

### Tomar notas
Añade secciones de "Notas" si encuentras algo importante:
```markdown
### Notas de implementación
- Decidí usar X en lugar de Y porque...
- Bug encontrado: ...
- Referencia útil: https://...
```

---

## 🎯 Al completar una tarea

### 1. Marca la tarea como completada
```markdown
**Estado:** 🟡 En Progreso → ✅ Completado
```

### 2. Documenta en SESSION_LOG
```markdown
### ✅ Completado
- [CONTENT-001] Investigación de trending copy
  - Encontradas 8 referencias
  - Decidido usar approach X
  - Actualizado Hero y About sections
```

### 3. Actualiza estadísticas en README
```markdown
### Por Categoría
| Categoría | Total | Completadas | Pendientes |
|-----------|-------|-------------|------------|
| 📝 Contenido | 5 | 1 | 4 |  # Actualizar números
```

---

## 🔚 Al terminar una sesión

### Checklist de cierre
- [ ] Todas las tareas completadas marcadas
- [ ] SESSION_LOG actualizado con:
  - [ ] Lista de completados
  - [ ] Decisiones tomadas
  - [ ] Próximos pasos
  - [ ] Notas importantes
- [ ] README actualizado con:
  - [ ] Estadísticas de progreso
  - [ ] Nueva sesión en timeline
- [ ] Commits hechos con mensajes descriptivos

### Template para SESSION_LOG
```markdown
## Sesión #X - 2025-MM-DD

**Duración:** 2h
**Objetivos:** Mejorar copy y configurar social links

### ✅ Completado
- [CONTENT-001] Investigación trending copy
- [CONTENT-003] Social links configurados

### 🚧 En Progreso
- [DESIGN-001] Paleta de colores (50% completado)

### 📌 Decisiones
- **Copy approach:** Decidido usar benefit-focused copy
- **Colores:** Mantener cyan/purple por ahora

### 🎯 Tareas para Próxima Sesión
1. Terminar investigación de colores
2. Actualizar proyectos
3. Crear favicon

### 📝 Notas
- Encontradas excelentes referencias de copy en X, Y, Z
- Paleta actual funciona bien, solo ajustar opacidades
```

---

## 🔍 Búsqueda rápida

### Encontrar tarea específica
```bash
# Buscar en todos los archivos de tareas
grep -r "TASK-001" docs/development/current/landing-improvements/
```

### Ver todas las tareas pendientes
```bash
# Ver todas las tareas con estado Pendiente
grep -A 3 "Estado.*Pendiente" docs/development/current/landing-improvements/*.md
```

### Ver progreso total
```bash
# Abrir README para ver dashboard
cat docs/development/current/landing-improvements/README.md | grep -A 20 "Progreso General"
```

---

## 💡 Tips y Best Practices

### 1. Sesiones cortas y focalizadas
- 1-2 horas por sesión
- Enfócate en 1-3 tareas relacionadas
- Documenta al terminar, no días después

### 2. Prioriza correctamente
- 🔴 Alta: Bloqueante o muy visible
- 🟡 Media: Importante pero no urgente
- 🟢 Baja: Nice to have

### 3. Documenta decisiones
Siempre documenta **por qué** tomaste una decisión:
```markdown
### 📌 Decisiones
- **Three.js:** Decidido NO usar por problemas de React.
  Razón: Múltiples errores insolubles, AnimatedShape funciona perfecto.
```

### 4. Sé específico en entregables
```markdown
### Entregables
- [ ] Documento "trending-copy-research.md" con 5+ referencias
- [ ] Nuevo copy en Hero.tsx
- [ ] Nuevo copy en AboutCards.tsx
```

### 5. Linkea archivos modificados
```markdown
### Archivos modificados
- `components/Hero.tsx:129` - Actualizado headline
- `components/AboutCards.tsx:45-52` - Nuevas descriptions
```

### 6. Actualiza regularmente
- Actualiza SESSION_LOG después de cada tarea completada
- Actualiza README al final de cada sesión
- No esperes a "terminar todo" para documentar

---

## 🔄 Workflow Completo Ejemplo

```
1. Abrir sesión
   ├─ Revisar README.md
   ├─ Leer SESSION_LOG.md (última sesión)
   └─ Decidir tarea a trabajar

2. Durante trabajo
   ├─ Marcar tarea como "En Progreso"
   ├─ Ir completando checklist items
   └─ Tomar notas de decisiones

3. Completar tarea
   ├─ Marcar como "Completado"
   ├─ Documentar en SESSION_LOG
   └─ Actualizar estadísticas en README

4. Cerrar sesión
   ├─ Verificar checklist de cierre
   ├─ Hacer commits
   └─ Actualizar "Próximos pasos"

5. Próxima sesión
   └─ Repetir desde paso 1
```

---

## 🆘 Troubleshooting

### "No sé por dónde empezar"
→ Mira "Prioridades" en README.md, siempre hay 3-5 tareas marcadas como alta prioridad

### "Olvidé qué estaba haciendo"
→ Lee el SESSION_LOG.md, específicamente "Próximos pasos" y "Notas"

### "Una tarea está bloqueada"
→ Márcala en SESSION_LOG:
```markdown
### ❌ Bloqueado
- [VISUAL-001] Imágenes de proyectos
  Razón: Esperando screenshots del cliente
```

### "Necesito cambiar prioridades"
→ Actualiza el campo "Prioridad" en el archivo de tareas correspondiente

### "Quiero agregar una tarea nueva"
→ Agrégala en el archivo correspondiente con el siguiente formato:
```markdown
## 🟢 CATEGORY-00X: Título de tarea nueva

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #X

### Descripción
...

### Tareas
- [ ] ...
```

---

## 📊 Métricas de Éxito

### Al completar el feature
Deberías tener:
- ✅ 28/28 tareas completadas
- ✅ SESSION_LOG con todas las sesiones documentadas
- ✅ README con estadísticas finales
- ✅ Decisiones importantes documentadas
- ✅ Aprendizajes capturados

### Mover a completed/
```bash
# Una vez todo esté completo
mv docs/development/current/landing-improvements \
   docs/development/completed/landing-improvements-2025-11
```

---

## 🎓 Recursos

- [CLAUDE.md](/.claude/CLAUDE.md) - Instrucciones globales del proyecto
- [README principal](/README.md) - Overview del proyecto
- [QUICK_START.md](/QUICK_START.md) - Guía de inicio

---

**Happy tracking! 📝✨**
