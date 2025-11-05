# ⚡ Tareas de Funcionalidad

**Categoría:** Features y Funcionalidad
**Estado:** 🔴 Pendiente

---

## 📊 Progreso: 0/6 tareas completadas

---

## 🔴 FUNCTIONALITY-001: Diseñar formulario de validación de idea

**Prioridad:** Alta
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #2

### Descripción
Crear un formulario inteligente donde potenciales clientes puedan validar su idea y obtener una cotización más rápida.

### Objetivo
Reemplazar simple "contact form" con un wizard/form que:
- Califique leads automáticamente
- Recopile información necesaria para cotización
- Eduque al cliente sobre el proceso
- Facilite respuestas más rápidas y precisas

### Preguntas a incluir (por definir)

#### Básicas
- [ ] Nombre y email
- [ ] Empresa/Proyecto
- [ ] ¿Cómo me encontraste?

#### Sobre la idea
- [ ] ¿Cuál es tu idea en 1-2 oraciones?
- [ ] ¿Qué problema resuelve?
- [ ] ¿Ya tienes usuarios/validación inicial?
- [ ] ¿Cuál es tu target audience?

#### Scope técnico
- [ ] ¿Qué tipo de producto? (Web app, Mobile, Ambos, API, etc.)
- [ ] ¿Necesitas AI/ML? (Sí/No/No sé)
- [ ] ¿Tienes diseños/wireframes? (Sí/No/En proceso)
- [ ] ¿Qué features son must-have vs nice-to-have?

#### Timeline y presupuesto
- [ ] ¿Cuándo necesitas lanzar? (< 1 mes, 1-3 meses, 3-6 meses, Flexible)
- [ ] ¿Cuál es tu presupuesto aproximado? (Rangos)
- [ ] ¿Es un MVP o producto completo?

### Flujo propuesto
```
1. Intro screen
   ↓
2. Sobre ti (nombre, email, empresa)
   ↓
3. Sobre tu idea (descripción, problema, validación)
   ↓
4. Especificaciones técnicas (tipo, features, AI)
   ↓
5. Timeline y presupuesto
   ↓
6. Resumen y envío
   ↓
7. Confirmación + próximos pasos
```

### Wireframe
- [ ] Crear wireframe simple del formulario
- [ ] Decidir: ¿Multi-step o single page?
- [ ] Decidir: ¿Progreso bar?
- [ ] Diseñar error states
- [ ] Diseñar success state

### Stack técnico
Opciones:
1. **React Hook Form + Zod** - Validación client-side
2. **Formspree/Formsubmit** - Backend simple sin servidor
3. **Resend + React Email** - Emails transaccionales
4. **Supabase** - Si queremos guardar submissions

### Tareas técnicas
- [ ] Definir preguntas finales
- [ ] Crear wireframe/mockup
- [ ] Implementar componente de formulario
- [ ] Configurar backend/email sending
- [ ] Implementar validaciones
- [ ] Diseñar email template para submissions
- [ ] Testing completo
- [ ] Analytics (track conversions)

### Entregables
- [ ] Documento con preguntas definidas
- [ ] Wireframe del flujo
- [ ] Componente implementado
- [ ] Email template
- [ ] Testing checklist

### Archivos a crear/modificar
- Crear `components/IdeaValidationForm.tsx`
- Crear `components/FormSteps/*.tsx`
- Posiblemente `app/api/submit-idea/route.ts` (API route)
- Actualizar `components/Footer.tsx` o crear página dedicada

---

## 🟢 FUNCTIONALITY-002: Configurar Analytics

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #3

### Descripción
Implementar analytics para trackear visitantes y conversiones.

### Opciones de Analytics
1. **Google Analytics 4** - Gratis, completo, estándar
2. **Plausible** - Privacy-friendly, simple
3. **Umami** - Self-hosted, open source
4. **Vercel Analytics** - Si deployamos en Vercel

### Eventos a trackear
- [ ] Page views
- [ ] CTA clicks ("Let's Build Together")
- [ ] Social link clicks
- [ ] Form submissions
- [ ] Project card interactions
- [ ] Scroll depth
- [ ] Time on page

### Tareas
- [ ] Elegir plataforma de analytics
- [ ] Crear cuenta y obtener tracking ID
- [ ] Implementar script/SDK
- [ ] Configurar eventos custom
- [ ] Testear en desarrollo
- [ ] Verificar datos en producción
- [ ] Crear dashboard básico

### Archivos a modificar
- `app/layout.tsx` - Analytics script
- Posiblemente crear `lib/analytics.ts`
- Componentes con eventos custom

### Compliance
- [ ] Verificar GDPR compliance si es necesario
- [ ] Cookie banner (si se requiere)

---

## 🟢 FUNCTIONALITY-003: Mejorar smooth scroll anchors

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #3

### Descripción
Mejorar la navegación a secciones mediante anchors.

### Issues actuales
- Anchors funcionan pero no tienen offset para header
- No hay highlight del link activo en nav
- Mobile menu no se cierra al navegar

### Mejoras a implementar
- [ ] Scroll con offset para header sticky
- [ ] Active link highlighting en navigation
- [ ] Cerrar mobile menu al hacer click en link
- [ ] Smooth scroll perfecto con Lenis
- [ ] Hash en URL (#about, #work, etc.)

### Tareas técnicas
- [ ] Implementar scroll offset
- [ ] Track active section con Intersection Observer
- [ ] Update navigation active state
- [ ] Testear en todos los navegadores
- [ ] Asegurar accesibilidad (keyboard navigation)

### Archivos a modificar
- `components/Navigation.tsx`
- `components/SmoothScroll.tsx`
- Crear hook `useActiveSection.ts` (opcional)

---

## 🟡 FUNCTIONALITY-004: Mejorar mobile menu

**Prioridad:** Media
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #3

### Descripción
Refinar el comportamiento del mobile menu.

### Mejoras a implementar
- [ ] Animación más suave al abrir/cerrar
- [ ] Bloquear scroll del body cuando menu está abierto
- [ ] Cerrar con ESC key
- [ ] Cerrar al hacer click fuera
- [ ] Transición mejorada de overlay
- [ ] Focus trap dentro del menu

### Accesibilidad
- [ ] ARIA labels correctos
- [ ] Focus management
- [ ] Keyboard navigation (Tab, Shift+Tab, ESC)
- [ ] Anunciar estado a screen readers

### Tareas
- [ ] Implementar mejoras de UX
- [ ] Implementar mejoras de accesibilidad
- [ ] Testear en devices reales
- [ ] Testear con screen readers

### Archivos a modificar
- `components/Navigation.tsx`

---

## 🟢 FUNCTIONALITY-005: Implementar dark mode (opcional)

**Prioridad:** Baja
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #4+

### Descripción
Implementar dark mode toggle (opcional, no es prioritario).

### Consideraciones
- Next.js 15 tiene soporte built-in con next-themes
- Tailwind tiene dark mode class-based
- Diseño actual está optimizado para light mode

### Tareas
- [ ] Decidir si implementar dark mode
- [ ] Diseñar paleta dark mode
- [ ] Implementar toggle
- [ ] Adaptar todos los componentes
- [ ] Persistir preferencia
- [ ] Respetar system preference

### Archivos a modificar
- Casi todos los componentes
- `tailwind.config.ts`
- `app/layout.tsx`

---

## 🟢 FUNCTIONALITY-006: Progressive Web App (PWA) (opcional)

**Prioridad:** Baja
**Estado:** 🔴 Pendiente
**Sesión objetivo:** #5+

### Descripción
Convertir la landing en PWA para mejor experiencia mobile (opcional).

### Features PWA
- [ ] Manifest.json
- [ ] Service worker
- [ ] Offline support
- [ ] Install prompt
- [ ] App icons

### Beneficios
- Installable en mobile
- Offline access
- Mejor performance
- App-like experience

### Tareas
- [ ] Crear manifest.json
- [ ] Configurar service worker
- [ ] Testear install prompt
- [ ] Optimizar offline experience

### Herramientas
- next-pwa plugin
- Workbox

---

## 📋 Checklist de Funcionalidad

Antes de marcar la categoría como completa:
- [ ] Formulario de validación funcionando y testeado
- [ ] Analytics configurado y trackeando
- [ ] Navegación smooth funcionando perfectamente
- [ ] Mobile menu con UX excelente
- [ ] Toda funcionalidad accesible (keyboard, screen readers)
- [ ] Sin errores en consola
- [ ] Testado en Chrome, Firefox, Safari
- [ ] Testado en iOS y Android (real devices)

---

**Última actualización:** 2025-11-04
**Tareas completadas:** 0/6
**Próxima tarea:** FUNCTIONALITY-001
