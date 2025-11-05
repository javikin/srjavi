# 🚀 Quick Start Guide

## ¡Tu landing page está lista!

El servidor de desarrollo está corriendo en: **http://localhost:3001**

## 📋 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye versión de producción
npm start            # Inicia servidor de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🎨 Personalización Rápida

### 1. Colores
Edita `tailwind.config.ts`:
```typescript
colors: {
  'off-white': '#f8f7f3',    // Fondo principal
  'electric-cyan': '#00d9ff', // Color de acento 1
  'deep-purple': '#8b3dff',   // Color de acento 2
  'dark-bg': '#0a0a0a',       // Texto oscuro
}
```

### 2. Contenido

#### Hero Section (`components/Hero.tsx`)
- Título principal
- Subtítulo
- CTAs
- Estadísticas

#### About Cards (`components/AboutCards.tsx`)
- 3 cards con glassmorphism
- Iconos (emojis o puedes usar React Icons)
- Títulos y descripciones

#### Featured Work (`components/FeaturedWork.tsx`)
- Array `projects` con tus proyectos
- Añade imágenes reales en `/public/images/`
- Actualiza titles, descriptions, tags

#### Photography (`components/Photography.tsx`)
- Sección "The Reality"
- Información personal
- Grid de 4 iconos/stats

#### Footer (`components/Footer.tsx`)
- Links sociales
- Email de contacto
- Links del footer

### 3. Imágenes

Coloca tus imágenes en `/public/images/`:
```
public/
  images/
    fit.jpg           # Proyecto Fit
    punto-blanco.jpg  # Proyecto Punto Blanco
    carrillo.jpg      # Foto de Carrillo Puerto
```

Luego actualiza las rutas en los componentes.

### 4. Información de Contacto

Actualiza en `components/Footer.tsx`:
```typescript
const socialLinks = [
  { name: 'Email', href: 'mailto:tu-email@ejemplo.com' },
  { name: 'Twitter', href: 'https://twitter.com/tu-usuario' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/tu-perfil' },
  { name: 'GitHub', href: 'https://github.com/tu-usuario' },
];
```

### 5. SEO y Metadata

Edita `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Tu Nombre - Tu Título',
  description: 'Tu descripción',
  keywords: ['tus', 'palabras', 'clave'],
  // ... más metadata
};
```

## 🎯 Características Principales

### ✨ Animaciones
- **Hero**: Forma 3D morphing con Three.js
- **Scroll**: Animaciones suaves con GSAP
- **Magnetic Buttons**: Efecto magnético en botones
- **Parallax**: Efectos de parallax en imágenes
- **Text Reveal**: Revelación de texto letra por letra

### 🎨 Diseño
- **Glassmorphism**: Cards con efecto de vidrio esmerilado
- **Gradientes**: Colores vibrantes cyan y purple
- **Grid Asimétrico**: Layout moderno y único
- **Mobile First**: Totalmente responsive

### ⚡ Performance
- **60 FPS**: Animaciones optimizadas
- **Lazy Loading**: Carga diferida de 3D
- **Code Splitting**: División de código automática
- **Web Vitals**: Optimizado para Core Web Vitals

### ♿ Accesibilidad
- **Reduced Motion**: Respeta preferencias del usuario
- **Semantic HTML**: Estructura semántica correcta
- **ARIA Labels**: Etiquetas de accesibilidad
- **Keyboard Navigation**: Navegación por teclado

## 🛠️ Próximos Pasos

1. **Añadir imágenes reales**
   - Reemplaza los placeholders de imágenes
   - Optimiza con Next.js Image component

2. **Personalizar contenido**
   - Actualiza textos con tu información
   - Ajusta proyectos y experiencia

3. **Configurar dominio**
   - Deploy a Vercel/Netlify
   - Configura DNS

4. **Analytics**
   - Añade Google Analytics
   - Configura tracking de conversiones

5. **Formulario de contacto**
   - Integra con servicio de email (Resend, SendGrid)
   - Añade validación

## 📦 Estructura de Archivos

```
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página home
│   └── globals.css     # Estilos globales
│
├── components/
│   ├── Navigation.tsx      # Header navegación
│   ├── Hero.tsx           # Hero con 3D
│   ├── Scene3D.tsx        # Escena Three.js
│   ├── AboutCards.tsx     # Cards glassmorphism
│   ├── FeaturedWork.tsx   # Proyectos
│   ├── Photography.tsx    # Sección personal
│   ├── Footer.tsx         # Footer CTA
│   ├── MagneticButton.tsx # Botón magnético
│   └── SmoothScroll.tsx   # Smooth scroll
│
├── hooks/
│   └── useMousePosition.ts # Hook mouse
│
└── lib/
    └── animation-utils.ts  # Utils animación
```

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Limpiar caché y node_modules
rm -rf .next node_modules
npm install
npm run dev
```

### Errores de TypeScript
```bash
# Verificar tipos
npm run build
```

### Animaciones lentas
- El monitor de FPS (solo dev) aparece abajo a la derecha
- Si FPS < 60, revisa DevTools Performance tab

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://greensock.com/gsap/)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🎉 ¡Listo!

Tu landing page está lista para impresionar. Personaliza, ajusta y despliega.

**Happy coding! 🚀**
