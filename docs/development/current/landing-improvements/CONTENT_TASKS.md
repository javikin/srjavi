# 📝 Tareas de Contenido

**Categoría:** Contenido y Copy
**Estado:** 🟡 En Progreso

---

## 📊 Progreso: 3/5 tareas completadas

---

## 🔴 CONTENT-001: Investigar trending copy para AI product builders

**Prioridad:** Alta
**Estado:** ✅ Completado
**Sesión objetivo:** #1
**Inicio:** 2025-11-04
**Completado:** 2025-11-04

### Descripción
Investigar en internet qué copy y messaging están usando otros AI product builders exitosos. Buscar referencias de:
- Landing pages de fundadores con background YC
- AI consultants / freelancers
- Product builders especializados en AI

### Objetivo
Encontrar patterns de copy que conviertan mejor y actualizar:
- Hero headline
- About cards descriptions
- Evitar menciones a FlutterFlow (no lo usamos)
- Enfocarse en validación rápida de MVPs con AI

### Referencias a buscar
- [x] Landing pages de YC founders en AI/product
- [x] Perfiles de LinkedIn trending en "AI Product Builder"
- [x] Landing pages de AI consultants exitosos
- [x] Copy de productos/servicios similares

### Entregables
- [x] Documento con 5-10 referencias de copy efectivo
- [x] Análisis de patterns comunes
- [x] Propuestas de nuevo copy para Hero y About

### Hallazgos Clave
**Ver:** `trending-copy-research.md`

**Patterns encontrados:**
1. Speed + Specificity ("2 weeks" > "quickly")
2. Benefit-first ("Ship MVPs" > "I build products")
3. Credibility sin pomposity (YC experience, casos reales)
4. Problem → Solution framework

**3 Opciones de copy propuestas:**
- Opción 1 (Bold): "Ship Your Startup MVP in 2 Weeks"
- Opción 2 (Benefit-heavy): "Validate & Launch Your MVP Before Competitors"
- Opción 3 (Balanced): "Build MVPs That Scale in Weeks, Not Months" ⭐ Recomendado

### Archivos a modificar
- `components/Hero.tsx` - Headline y subtitle
- `components/AboutCards.tsx` - Descriptions de cards

---

## 🟡 CONTENT-002: Mejorar copy de "The Reality" section

**Prioridad:** Alta
**Estado:** ✅ Completado
**Sesión objetivo:** #1
**Inicio:** 2025-11-04
**Completado:** 2025-11-04

### Descripción
El copy actual de "The Reality" section necesita mejorarse para ser más compelling y conectar mejor con el target audience.

### Copy actual a mejorar
```
"I live in a quiet pueblo in Carrillo Puerto, Mexico, but build products
for a global audience. This balance keeps me grounded and focused..."
```

### Objetivo
- Buscar referencias de "about me" sections efectivas
- Hacer el copy más orientado a beneficios para el cliente
- Mantener autenticidad pero enfocar en value proposition
- Menos sobre ubicación, más sobre approach/filosofía

### Referencias a buscar
- [ ] About sections de freelancers/consultants exitosos
- [ ] Personal brands de tech founders
- [ ] Storytelling efectivo en landing pages

### Entregables
- [ ] 3-5 propuestas de nuevo copy
- [ ] Análisis de qué funciona en las referencias
- [ ] Copy final decidido

### Archivos a modificar
- `components/Photography.tsx` - Section "The Reality"

### Notas
- Considerar si "Carrillo Puerto" debe ser el enfoque o moverlo a about page
- Tal vez crear sección separada "About Me" más personal

---

## 🟢 CONTENT-003: Configurar links sociales y contacto

**Prioridad:** Alta
**Estado:** ✅ Completado
**Sesión objetivo:** #1
**Inicio:** 2025-11-04
**Completado:** 2025-11-04

### Descripción
Actualizar todos los links sociales y de contacto con información real.

### Información proporcionada
- **Email:** javierolan@gmail.com
- **Ubicación:** FCP, QRoo (usar este estilo minúsculas/abreviado)
- **Social links:** Por configurar

### Tareas
- [x] Actualizar email en Footer
- [x] Actualizar ubicación en Footer
- [x] Configurar links sociales:
  - [x] LinkedIn - https://www.linkedin.com/in/javierolan/
  - [x] GitHub - https://github.com/javikin
  - [x] Instagram - https://instagram.com/srjavi.arw
  - [x] Email - javierolan@gmail.com

### Archivos modificados
- `components/Footer.tsx` - Social links y email actualizados
- `app/layout.tsx` - Metadata con GitHub author link
- Footer copyright: "© 2025 Javi. Built from FCP, QRoo."

### Información configurada
- [x] Email: javierolan@gmail.com
- [x] LinkedIn: javierolan
- [x] GitHub: javikin
- [x] Instagram: srjavi.arw
- [x] Ubicación: FCP, QRoo (estilo minúsculas)

---

## 🟡 CONTENT-004: Actualizar información de proyectos

**Prioridad:** Media
**Estado:** 🟡 En Progreso
**Sesión objetivo:** #2 (iniciado en #1)
**Inicio:** 2025-11-04

### Descripción
Actualizar la sección de proyectos con información real y completa.

### Proyectos actuales
1. **Fit AI** - Placeholder info
2. **Punto Blanco** - Placeholder info

### Proyectos a agregar/actualizar
- **Fit** - Info real del proyecto
- **Punto Blanco** - Info real del proyecto
- **paga.one** - Sitio para almacenar cuentas de pago
- ¿Otros proyectos?

### Información necesaria por proyecto
- [ ] Nombre completo
- [ ] Descripción compelling (1-2 oraciones)
- [ ] Stack tecnológico (tags)
- [ ] Link al proyecto (si es público)
- [ ] Resultados/métricas (si hay)
- [ ] Imagen/screenshot

### Tareas
- [ ] Recopilar información de cada proyecto
- [ ] Escribir descriptions optimizadas
- [ ] Definir tags/tecnologías a mostrar
- [ ] Decidir orden de proyectos (prioridad)

### Archivos a modificar
- `components/FeaturedWork.tsx` - Array de projects

### Notas
- Considerar agregar más de 2 proyectos si hay más relevantes
- Balancear entre mostrar variedad y no saturar

---

## 🟢 CONTENT-005: Actualizar textos personalizados generales

**Prioridad:** Baja
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #3

### Descripción
Revisar y actualizar todos los textos pequeños en la landing:
- Biografía corta
- Meta descriptions
- Títulos de secciones
- Micro-copy en botones
- Stats en Hero

### Textos a revisar
- [ ] Hero stats (4+ Apps, 2 weeks, YC) - ¿Son precisos?
- [ ] About cards icons (¿usar iconos reales en lugar de emojis?)
- [ ] Footer copy "Ready to validate your idea?"
- [ ] CTA buttons text
- [ ] Section titles

### Tareas
- [ ] Listar todos los textos actuales
- [ ] Verificar precisión de stats
- [ ] Optimizar micro-copy para conversión
- [ ] Asegurar consistencia de tono

### Archivos potenciales
- Múltiples componentes
- `app/layout.tsx` - Metadata

---

## 📋 Checklist de Contenido

Antes de marcar la categoría como completa:
- [ ] Todo el copy ha sido actualizado con información real
- [ ] Referencias y research documentados
- [ ] Copy optimizado para conversión
- [ ] Tono consistente en toda la landing
- [ ] Información de contacto correcta
- [ ] No hay placeholders o lorem ipsum
- [ ] Copy revisado por alguien más (opcional)

---

**Última actualización:** 2025-11-04
**Tareas completadas:** 0/5
**Próxima tarea:** CONTENT-001
