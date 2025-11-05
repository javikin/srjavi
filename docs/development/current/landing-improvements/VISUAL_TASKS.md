# 🖼️ Tareas Visuales

**Categoría:** Assets e Imágenes
**Estado:** 🔴 Pendiente

---

## 📊 Progreso: 0/4 tareas completadas

---

## 🟡 VISUAL-001: Crear/obtener imágenes de proyectos

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #2

### Descripción
Reemplazar los placeholders actuales con imágenes reales de los proyectos.

### Proyectos que necesitan imágenes
- [ ] **Fit** - Screenshot o mockup
- [ ] **Punto Blanco** - Screenshot o mockup
- [ ] **paga.one** - Screenshot o mockup
- [ ] ¿Otros proyectos?

### Opciones para imágenes
1. **Screenshots reales**
   - Tomar screenshots de apps/sitios
   - Optimizar tamaño y calidad

2. **Mockups profesionales**
   - Usar herramientas como Rotato, Mockuuups
   - Screenshots en dispositivos (iPhone, MacBook)

3. **Diseño custom**
   - Crear gráficos en Figma/Canva
   - Cards con branding del proyecto

### Especificaciones técnicas
- **Formato:** WebP (con fallback JPG)
- **Tamaño:** 1200x800px mínimo (aspect ratio 3:2)
- **Peso:** < 200KB por imagen (optimizado)
- **Naming:** `proyecto-nombre.webp`

### Tareas
- [ ] Decidir qué tipo de imagen para cada proyecto
- [ ] Tomar/crear imágenes
- [ ] Optimizar imágenes (TinyPNG, Squoosh)
- [ ] Convertir a WebP
- [ ] Añadir a `/public/images/projects/`
- [ ] Actualizar componente con rutas correctas

### Herramientas sugeridas
- **Screenshots:** CleanShot X, Snagit
- **Mockups:** Rotato, Mockuuups, Smart Mockups
- **Optimización:** Squoosh.app, TinyPNG
- **Conversión:** Squoosh, cwebp command line

### Archivos a modificar
- `components/FeaturedWork.tsx` - Image paths
- Agregar archivos en `/public/images/projects/`

---

## 🟢 VISUAL-002: Reestructurar Photography section como About Me

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #3

### Descripción
Convertir la actual "Photography/Reality" section en una sección "About Me" más enfocada en bio personal, con posible foto.

### Cambios conceptuales
- **De:** Enfoque en Carrillo Puerto + Photography
- **A:** About Me + Personal philosophy + Foto personal

### Contenido nuevo
- [ ] Foto personal profesional (opcional)
- [ ] Bio más enfocada en valores/approach
- [ ] Stats personales (gym, hobbies que sean relevantes)
- [ ] Menos geografía, más filosofía

### Estructura propuesta
```
[Foto personal]  |  [Bio text]
                 |  [Grid de intereses/valores]
```

### Tareas
- [ ] Decidir si incluir foto personal
- [ ] Escribir nueva bio (ver CONTENT-002)
- [ ] Rediseñar grid de stats (quitar locales, añadir relevantes)
- [ ] Crear/obtener foto si se decide incluir

### Foto personal (si se incluye)
- **Especificaciones:**
  - Profesional pero approachable
  - Fondo neutral o relevante
  - Formato: Square o portrait
  - Tamaño: 800x800px mínimo
  - Optimizado < 150KB

### Archivos a modificar
- `components/Photography.tsx` → Renombrar a `AboutMe.tsx`
- Actualizar imports en `app/page.tsx`
- Actualizar copy y estructura

---

## 🟡 VISUAL-003: Crear favicon y app icons

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #2

### Descripción
Crear un favicon profesional y app icons para la landing page.

### Iconos necesarios
- [ ] **Favicon:**
  - favicon.ico (32x32, 16x16)
  - favicon.svg (vectorial, preferred)
- [ ] **Apple Touch Icon:** 180x180px
- [ ] **Android Icons:** 192x192px, 512x512px
- [ ] **OG Image preview:** 1200x630px (ver VISUAL-004)

### Opciones de diseño
1. **Inicial "J"** - Minimalista
2. **Logo abstracto** - Geométrico con gradient
3. **Icono relacionado a AI/Product** - Conceptual

### Inspiración
- [ ] Revisar favicons de referencias
- [ ] Buscar iconografía de AI/tech
- [ ] Mantener consistencia con paleta de colores

### Herramientas
- **Diseño:** Figma, Canva, Illustrator
- **Generación:** Favicon.io, RealFaviconGenerator
- **Optimización:** SVGO, ImageOptim

### Tareas
- [ ] Diseñar icono base
- [ ] Generar todos los tamaños
- [ ] Optimizar archivos
- [ ] Añadir a `/app/` (Next.js App Router convention)
- [ ] Actualizar metadata en layout.tsx

### Archivos a crear/modificar
- `/app/favicon.ico`
- `/app/icon.svg` (o icon.png)
- `/app/apple-icon.png`
- `app/layout.tsx` - Metadata

---

## 🟡 VISUAL-004: Crear OG Images para social sharing

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #3

### Descripción
Crear imágenes optimizadas para compartir en redes sociales (Open Graph).

### OG Images necesarios
- [ ] **Principal (Home):** 1200x630px
- [ ] **Por proyecto (opcional):** 1200x630px cada uno

### Contenido de OG Image principal
- Nombre/Brand
- Tagline: "AI Product Builder"
- Visual element (gradient, shape, logo)
- URL del sitio (opcional)

### Especificaciones técnicas
- **Tamaño:** Exactamente 1200x630px
- **Formato:** JPG o PNG
- **Peso:** < 300KB
- **Aspect ratio:** 1.91:1 (Facebook/LinkedIn/Twitter)

### Herramientas
- **Diseño:** Figma, Canva
- **Preview:** OpenGraph.xyz, MetaTags.io
- **Optimización:** TinyPNG

### Tareas
- [ ] Diseñar OG image principal
- [ ] Crear variantes si es necesario
- [ ] Optimizar peso
- [ ] Testear preview en diferentes plataformas
- [ ] Añadir a `/public/og/`
- [ ] Actualizar metadata

### Archivos a crear/modificar
- `/public/og/og-image.jpg` (o .png)
- `app/layout.tsx` - OpenGraph metadata

### Testing
- [ ] Facebook Sharing Debugger
- [ ] Twitter Card Validator
- [ ] LinkedIn Post Inspector

---

## 📋 Checklist Visual

Antes de marcar la categoría como completa:
- [ ] Todas las imágenes de proyectos en su lugar
- [ ] Favicon creado y funcionando
- [ ] OG images creadas y testeadas
- [ ] About Me section diseñada (si aplica)
- [ ] Todas las imágenes optimizadas (< 200KB)
- [ ] Formatos modernos (WebP) con fallbacks
- [ ] Alt text en todas las imágenes
- [ ] Loading lazy en imágenes below fold
- [ ] Responsive images (srcset si es necesario)

---

**Última actualización:** 2025-11-04
**Tareas completadas:** 0/4
**Próxima tarea:** VISUAL-001
