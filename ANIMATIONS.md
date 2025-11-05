# 🎬 Guía de Animaciones - Landing Page Javi

Este documento explica todas las animaciones implementadas y cómo modificarlas.

## 🎯 Principios de Diseño

### Performance First
- Todas las animaciones corren a **60 FPS**
- Uso de `transform` y `opacity` (propiedades GPU-accelerated)
- `will-change` optimization en animaciones complejas
- Lazy loading de componentes pesados (Three.js)

### Accessibility First
- Respeto total de `prefers-reduced-motion`
- Animaciones se reducen automáticamente si el usuario lo prefiere
- Todas las animaciones tienen fallback accesible

## 🚀 Animaciones Implementadas

### 1. Hero - Forma 3D Morphing

**Archivo**: `components/Scene3D.tsx`

**Tecnología**: Three.js + React Three Fiber

**Características**:
- Icosahedron con distorsión MeshDistortMaterial
- Rotación suave continua
- Cambio de color gradual (cyan → purple)
- Efecto de "respiración" con scale
- Wireframe rotando en sentido opuesto

**Personalizar**:
```typescript
// Cambiar forma
<icosahedronGeometry args={[2, 4]} /> // [radio, detalle]

// Ajustar distorsión
<MeshDistortMaterial
  distort={0.4}  // Intensidad: 0-1
  speed={2}      // Velocidad: 0-10
/>

// Modificar rotación
meshRef.current.rotation.y = time * 0.15; // Velocidad
```

### 2. Text Reveal - Título Hero

**Archivo**: `components/Hero.tsx`

**Tecnología**: GSAP

**Características**:
- Split del texto carácter por carácter
- Animación 3D con `rotateX`
- Stagger effect (efecto cascada)
- Bounce personalizado con `back.out`

**Personalizar**:
```typescript
gsap.fromTo(
  titleRef.current.children,
  { y: 100, opacity: 0, rotateX: -90 },
  {
    y: 0,
    opacity: 1,
    rotateX: 0,
    duration: 1.2,      // Duración total
    stagger: 0.02,      // Delay entre letras
    ease: 'back.out(1.7)', // Tipo de easing
  }
);
```

### 3. Magnetic Buttons

**Archivo**: `components/MagneticButton.tsx`

**Tecnología**: Framer Motion

**Características**:
- Sigue la posición del cursor
- Efecto magnético suave
- Spring physics realista
- Reset al salir del hover

**Personalizar**:
```typescript
const handleMouse = (e: React.MouseEvent) => {
  const x = (clientX - center.x) * 0.3; // Factor de atracción
  const y = (clientY - center.y) * 0.3;
  setPosition({ x, y });
};

// Spring config
transition={{
  type: 'spring',
  stiffness: 150,  // Rigidez (mayor = más rápido)
  damping: 15,     // Amortiguación (mayor = menos rebote)
  mass: 0.1        // Masa (mayor = más lento)
}}
```

### 4. Glassmorphism Cards

**Archivo**: `components/AboutCards.tsx`

**Tecnología**: GSAP ScrollTrigger + Framer Motion

**Características**:
- Aparición al scroll con perspectiva 3D
- Hover con lift effect
- Gradient border animado
- Backdrop blur

**Personalizar CSS**:
```css
.glass {
  background: rgba(255, 255, 255, 0.05); /* Opacidad fondo */
  backdrop-filter: blur(20px);            /* Blur strength */
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Personalizar Animación**:
```typescript
// Scroll trigger
gsap.fromTo(
  cardRef.current,
  { y: 100, opacity: 0, rotateX: -15 },
  {
    scrollTrigger: {
      trigger: cardRef.current,
      start: 'top 80%',  // Cuando empieza
      end: 'top 50%',    // Cuando termina
      scrub: 1,          // Smoothness (0-3)
    },
  }
);

// Hover effect
whileHover={{
  y: -10,      // Lift vertical
  scale: 1.02  // Zoom sutil
}}
```

### 5. Parallax Images

**Archivo**: `components/FeaturedWork.tsx`, `components/Photography.tsx`

**Tecnología**: Framer Motion useScroll + useTransform

**Características**:
- Movimiento relativo al scroll
- Diferentes velocidades por layer
- Fade in/out en bordes

**Personalizar**:
```typescript
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start'] // Rango de activación
});

const y = useTransform(
  scrollYProgress,
  [0, 1],        // Rango input (scroll)
  [100, -100]    // Rango output (píxeles)
);

// Aplicar
<motion.div style={{ y }}>
```

### 6. Scroll Animations

**Archivo**: Múltiples componentes

**Tecnología**: GSAP ScrollTrigger

**Características**:
- Activación basada en viewport
- Scrub para animaciones ligadas al scroll
- Markers en desarrollo (comentados)

**Configuración Global**:
```typescript
gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(
  element,
  { /* estado inicial */ },
  {
    /* estado final */
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',     // Cuando top del elemento llega a 80% viewport
      end: 'top 50%',
      scrub: 1,             // Liga animación con scroll
      // markers: true,     // Debug markers
    },
  }
);
```

### 7. Smooth Scroll

**Archivo**: `components/SmoothScroll.tsx`

**Tecnología**: Lenis

**Características**:
- Scroll inercial suave
- Customizable duration y easing
- Compatible con GSAP ScrollTrigger

**Personalizar**:
```typescript
const lenis = new Lenis({
  duration: 1.2,                    // Duración de scroll (más = más lento)
  easing: (t) => t,                 // Función easing custom
  orientation: 'vertical',
  wheelMultiplier: 1,               // Sensibilidad rueda
  touchMultiplier: 2,
  infinite: false,
});
```

### 8. Gradient Animations

**Archivo**: `app/globals.css`, varios componentes

**Características**:
- Gradientes animados con keyframes
- Background position animation
- Transiciones de color suaves

**CSS**:
```css
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}
```

### 9. Stagger Animations

**Archivo**: Múltiples componentes

**Tecnología**: Framer Motion + GSAP

**Características**:
- Animaciones en cascada
- Delay incremental automático
- Sincronización perfecta

**Framer Motion**:
```typescript
const container = {
  animate: {
    transition: {
      staggerChildren: 0.1,    // Delay entre hijos
      delayChildren: 0.3,      // Delay inicial
    },
  },
};
```

**GSAP**:
```typescript
gsap.fromTo(
  elements,
  { y: 30, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    stagger: 0.1,  // Delay entre elementos
  }
);
```

### 10. Hover Effects

**Varios componentes**

**Características**:
- Scale subtle
- Shadow expansion
- Color transitions
- Transform 3D

**Ejemplos**:
```typescript
// Lift + shadow
whileHover={{
  y: -5,
  boxShadow: '0 20px 40px rgba(0,217,255,0.3)'
}}

// Scale + rotate
whileHover={{
  scale: 1.05,
  rotate: 2
}}

// Icon bounce
whileHover={{
  rotate: [0, -10, 10, -10, 0],
  scale: 1.1
}}
transition={{ duration: 0.5 }}
```

## 🎨 Color Animations

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #00d9ff 0%, #8b3dff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Glow Effects
```css
.glow-cyan {
  box-shadow: 0 0 40px rgba(0, 217, 255, 0.3);
}

.glow-purple {
  box-shadow: 0 0 40px rgba(139, 61, 255, 0.3);
}
```

## ⚡ Performance Tips

### 1. Use Transform & Opacity Only
```typescript
// ✅ GOOD - GPU accelerated
transform: 'translateY(10px)'
opacity: 0.5

// ❌ BAD - Triggers layout/paint
top: '10px'
height: '100px'
```

### 2. will-change
```typescript
// Antes de animación pesada
element.style.willChange = 'transform, opacity';

// Después de animación
setTimeout(() => {
  element.style.willChange = 'auto';
}, 1000);
```

### 3. Lazy Loading
```typescript
// Importar componentes pesados dinámicamente
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false  // Desactivar SSR
});
```

### 4. Reduce Motion
```typescript
// Automático en todos los componentes
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🛠️ Debugging

### FPS Monitor
En desarrollo, verás un monitor de FPS en la esquina inferior derecha.
- **Verde (55-60 FPS)**: Excelente
- **Amarillo (30-55 FPS)**: Aceptable
- **Rojo (<30 FPS)**: Revisar optimizaciones

### GSAP DevTools
```typescript
// Descomentar en desarrollo
scrollTrigger: {
  markers: true,  // Muestra triggers en pantalla
}
```

### Chrome DevTools
1. Performance tab
2. Record mientras scrolleas
3. Busca "Long Tasks" (>50ms)
4. Optimiza lo que encuentres

## 📚 Recursos

- [GSAP Docs](https://greensock.com/docs/)
- [Framer Motion API](https://www.framer.com/motion/)
- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Lenis Smooth Scroll](https://lenis.studiofreight.com/)

## 🎯 Próximas Mejoras

Ideas para expandir las animaciones:

1. **Cursor personalizado**
   - Dot que sigue el mouse
   - Hover states custom

2. **Page transitions**
   - Transiciones entre páginas
   - Loader animado

3. **Scroll progress**
   - Barra de progreso de lectura
   - Indicador de posición

4. **Interactive 3D**
   - Mouse controls en forma 3D
   - Click interactions

5. **Micro-interactions**
   - Button ripple effects
   - Toast notifications animadas
   - Form field animations

---

**¡Experimenta y crea animaciones únicas!** 🎨✨
