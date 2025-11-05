# 🎨 Tareas de Diseño

**Categoría:** Diseño Visual
**Estado:** 🔴 Pendiente

---

## 📊 Progreso: 1/4 tareas completadas

---

## 🔴 DESIGN-001: Investigar y elegir mejor paleta de colores

**Prioridad:** Alta
**Estado:** ✅ Completado
**Sesión objetivo:** #1
**Inicio:** 2025-11-04
**Completado:** 2025-11-04

### Descripción
Investigar mejores opciones de paleta de colores para la landing page. La paleta actual es:
- Off White: `#f8f7f3`
- Electric Cyan: `#00d9ff`
- Deep Purple: `#8b3dff`
- Dark BG: `#0a0a0a`

### Objetivo
Determinar si mantener la paleta actual o cambiar a algo más:
- Profesional para target B2B
- Moderno y trending
- Que transmita confianza + innovación
- Buena accesibilidad (contraste WCAG AA)

### Investigación
- [ ] Buscar landing pages de AI/tech exitosas
- [ ] Analizar paletas de competidores
- [ ] Revisar trends 2025 en web design
- [ ] Verificar significado de colores en tech/AI
- [ ] Herramientas: Coolors, Adobe Color, Realtime Colors

### Opciones a considerar
1. **Mantener actual** (cyan + purple)
   - Pros: Ya implementado, vibrante, moderno
   - Contras: ¿Demasiado "playful" para B2B?

2. **Explorar alternativas:**
   - [ ] Blue + Orange (confianza + energía)
   - [ ] Green + Blue (crecimiento + tech)
   - [ ] Purple + Gold (premium + innovación)
   - [ ] Monochrome + accent (minimalista)

### Criterios de decisión
- [ ] Contraste suficiente (WCAG AA mínimo)
- [ ] Funciona en dark mode (opcional)
- [ ] Se ve bien en glassmorphism
- [ ] Diferenciación de competencia
- [ ] Alineación con brand identity

### Entregables
- [ ] Documento con 3-5 opciones de paleta
- [ ] Screenshots de referencias
- [ ] Paleta final elegida con justificación
- [ ] Variables de Tailwind actualizadas

### Archivos a modificar
- `tailwind.config.ts` - Color variables
- `app/globals.css` - Custom colors
- Posiblemente todos los componentes si cambia radicalmente

---

## 🟡 DESIGN-002: Revisar y mejorar tipografía

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #2

### Descripción
Revisar la jerarquía tipográfica actual y hacer ajustes si es necesario.

### Tipografía actual
- **Sans:** Inter (via Google Fonts)
- **Mono:** JetBrains Mono (via Google Fonts)

### Tareas
- [ ] Verificar que la jerarquía sea clara (H1 > H2 > H3 > body)
- [ ] Revisar tamaños en mobile vs desktop
- [ ] Asegurar legibilidad (line-height, letter-spacing)
- [ ] Considerar si cambiar fuentes o mantener
- [ ] Optimizar font loading (subset, display: swap)

### Aspectos a revisar
- [ ] Hero headline - ¿Tamaño correcto?
- [ ] Body text - ¿Legible en párrafos largos?
- [ ] Cards - ¿Jerarquía clara?
- [ ] Buttons - ¿Font weight correcto?
- [ ] Mobile - ¿Se adapta bien?

### Archivos a modificar (si es necesario)
- `app/layout.tsx` - Font imports
- `tailwind.config.ts` - Font family config
- Componentes individuales - Font sizes

### Notas
Usuario mencionó que le gusta la tipografía actual, así que cambios mínimos.

---

## 🟢 DESIGN-003: Mejorar espaciado entre secciones

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #2

### Descripción
Revisar y mejorar el "breathing room" entre secciones para mejor flow visual.

### Espaciado actual
- Secciones usan: `py-32` (128px vertical padding)
- Elementos internos: variado

### Tareas
- [ ] Revisar toda la landing en mobile y desktop
- [ ] Identificar áreas que se sienten "cramped"
- [ ] Identificar áreas con demasiado espacio vacío
- [ ] Establecer sistema de espaciado consistente
- [ ] Documentar espaciado estándar

### Sistema de espaciado propuesto
```
- Hero: py-32 lg:py-40
- Sections: py-24 lg:py-32
- Between elements: space-y-8 lg:space-y-12
- Cards padding: p-8 lg:p-10
```

### Áreas a revisar específicamente
- [ ] Espacio entre Hero y About Cards
- [ ] Espacio entre proyectos en Featured Work
- [ ] Espacio interno en Photography section
- [ ] Espacio en Footer

### Archivos a modificar
- Todos los componentes de secciones
- Posiblemente `tailwind.config.ts` para custom spacing

---

## 🟢 DESIGN-004: Revisar cards según trending research

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #2

### Descripción
Una vez completada la investigación de trending (CONTENT-001), revisar si los cards necesitan cambios de diseño.

### Depende de
- CONTENT-001: Investigación de trending

### Aspectos a considerar
- [ ] ¿Los iconos actuales (emojis) son apropiados?
  - Opción: Cambiar a iconos profesionales (Lucide, Heroicons)
- [ ] ¿El grid asimétrico funciona o es confuso?
- [ ] ¿El glassmorphism es apropiado para el target?
- [ ] ¿Los hover effects son sutiles o exagerados?

### Tareas
- [ ] Revisar referencias de cards en landing pages similares
- [ ] Decidir si mantener emojis o usar iconos
- [ ] Ajustar grid si es necesario
- [ ] Refinar hover effects
- [ ] Asegurar accesibilidad (focus states)

### Opciones de iconos
1. **Mantener emojis** - Más casual y friendly
2. **Lucide Icons** - Profesional, ligero
3. **Heroicons** - Clean, diseñado por Tailwind team
4. **Custom SVG** - Único pero más trabajo

### Archivos a modificar
- `components/AboutCards.tsx`
- Posiblemente crear componente de Icon wrapper

---

## 📋 Checklist de Diseño

Antes de marcar la categoría como completa:
- [ ] Paleta de colores decidida e implementada
- [ ] Contraste WCAG AA en todos los textos
- [ ] Tipografía optimizada y legible
- [ ] Espaciado consistente y con buen breathing room
- [ ] Cards con diseño profesional
- [ ] Hover states en todos los elementos interactivos
- [ ] Focus states para accesibilidad
- [ ] Responsive en mobile, tablet, desktop
- [ ] Design system documentado

---

**Última actualización:** 2025-11-04
**Tareas completadas:** 0/4
**Próxima tarea:** DESIGN-001
