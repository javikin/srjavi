# 🎨 Scene3D - Guía de Personalización

Tienes 3 opciones de hero visual. Aquí te explico cómo cambiar entre ellas y personalizarlas.

## 🔀 Cambiar entre opciones

### Opción 1: AnimatedShape (CSS - Más rápido)
```typescript
// En components/Hero.tsx línea 174
<AnimatedShape />
```

### Opción 2: Scene3DSimple (3D básico - Actual)
```typescript
// En components/Hero.tsx línea 174
<Scene3DSimple />
```

### Opción 3: Scene3D Full (3D con morphing)
```typescript
// En components/Hero.tsx línea 174
<Scene3D />
```

---

## ⚙️ Personalizar Scene3DSimple (actual)

Edita `components/Scene3DSimple.tsx`:

### Cambiar velocidad de rotación
```typescript
// Línea 17
meshRef.current.rotation.y = time * 0.5;  // Más rápido (0.3 → 0.5)
meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.2;  // Más rápido
```

### Cambiar colores
```typescript
// Línea 21 - Ajustar saturación y luminosidad
color.setHSL(
  (time * 0.05) % 1,  // Hue (0-1 = todo el espectro)
  0.9,                // Saturation (0.7 → 0.9 = más vibrante)
  0.5                 // Lightness (0.6 → 0.5 = más oscuro)
);
```

### Cambiar tamaño
```typescript
// Línea 32
<icosahedronGeometry args={[3, 1]} />  // [2, 1] → [3, 1] = más grande
```

### Cambiar detalle (facetas)
```typescript
// Línea 32
<icosahedronGeometry args={[2, 3]} />  // [2, 1] → [2, 3] = más facetas
```

### Cambiar material
```typescript
// Línea 33-37
<meshStandardMaterial
  color="#00d9ff"
  roughness={0.1}    // 0.3 → 0.1 = más brillante
  metalness={0.9}    // 0.7 → 0.9 = más metálico
  wireframe={false}  // false → true = solo wireframe
/>
```

### Cambiar intensidad de respiración
```typescript
// Línea 25
const scale = 1 + Math.sin(time * 0.5) * 0.2;  // 0.1 → 0.2 = más dramático
```

### Añadir más luces
```typescript
// Después de línea 75
<pointLight position={[5, 0, 0]} intensity={0.3} color="#ff00ff" />
<spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} />
```

---

## ⚙️ Personalizar AnimatedShape

Edita `components/AnimatedShape.tsx`:

### Cambiar velocidad de orbs
```typescript
// Línea 18
duration: 15,  // 20 → 15 = más rápido
```

### Cambiar colores de gradiente
```typescript
// Línea 15
className="... from-electric-cyan/40 to-deep-purple/40 ..."
// Cambiar a:
className="... from-red-500/40 to-blue-500/40 ..."
```

### Añadir más orbs
```typescript
// Después de línea 37
<motion.div
  className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/40 to-pink-400/40 blur-3xl"
  animate={{
    scale: [1, 1.4, 1],
    rotate: [0, 360],
    x: [0, 100, 0],
    y: [0, 100, 0],
  }}
  transition={{
    duration: 30,
    repeat: Infinity,
    ease: 'linear',
  }}
/>
```

### Cambiar tamaño del diamante
```typescript
// Línea 56-57
border-l-[200px]  // 160px → 200px = más grande
border-r-[200px]
border-b-[200px]
```

---

## ⚙️ Personalizar Scene3D Full (con morphing)

Edita `components/Scene3D.tsx`:

### Cambiar intensidad de distorsión
```typescript
// Línea 44
<MeshDistortMaterial
  distort={0.6}   // 0.4 → 0.6 = más distorsión
  speed={3}       // 2 → 3 = más rápido
/>
```

### Cambiar geometría base
```typescript
// Línea 43 - Opciones:
<icosahedronGeometry args={[2, 4]} />  // Actual
<sphereGeometry args={[2, 32, 32]} />  // Esfera
<torusKnotGeometry args={[1, 0.3, 128, 16]} />  // Nudo
<dodecahedronGeometry args={[2, 0]} />  // Dodecaedro
<octahedronGeometry args={[2, 0]} />  // Octaedro
```

---

## 🎯 Casos de Uso

### Para landing page corporativa
```typescript
// Scene3DSimple con:
roughness: 0.1,
metalness: 0.9,
color: "#0066cc"  // Azul corporativo
```

### Para landing page creativa
```typescript
// Scene3D Full con:
distort: 0.8,
speed: 4,
// Colores vibrantes
```

### Para máxima performance
```typescript
// AnimatedShape
// Sin cambios, ya es la opción más ligera
```

### Para wow factor máximo
```typescript
// Scene3D Full con:
<icosahedronGeometry args={[2, 6]} />  // Más detalle
distort: 0.6,
speed: 2,
metalness: 0.9
```

---

## 🐛 Troubleshooting

### Scene3D da error
**Solución**: Usar Scene3DSimple o AnimatedShape

### Performance lento
**Solución**: Reducir detalle
```typescript
<icosahedronGeometry args={[2, 0]} />  // Mínimo detalle
```

### No se ve en mobile
**Solución**: Añadir fallback
```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

{isMobile ? <AnimatedShape /> : <Scene3DSimple />}
```

### Colores no cambian
**Solución**: Verificar que el material sea MeshStandardMaterial, no MeshBasicMaterial

---

## 💡 Tips Pro

1. **Combinar efectos**: Puedes usar AnimatedShape de fondo y Scene3DSimple encima
2. **Responsive**: Usar Scene3DSimple en desktop y AnimatedShape en mobile
3. **Dark mode**: Ajustar colors según el tema
4. **Interaction**: Añadir mouse control para rotación manual

---

**Experimenta y encuentra tu estilo único! ✨**
