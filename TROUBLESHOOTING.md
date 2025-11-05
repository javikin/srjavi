# 🔧 Troubleshooting Guide

Soluciones a problemas comunes en la landing page.

## ❌ Error: "Cannot read properties of undefined (reading 'ReactCurrentOwner')"

### Causa
Este error ocurre cuando hay problemas con:
- Cache corrupto de Next.js
- Server-side rendering de componentes Three.js
- Múltiples versiones de React (raro)

### Solución
```bash
# 1. Detener el servidor (Ctrl+C)

# 2. Limpiar cache y node_modules
rm -rf .next node_modules package-lock.json

# 3. Reinstalar dependencias
npm install

# 4. Reiniciar servidor
npm run dev
```

### Prevención
- El componente `Scene3D` ya incluye `Suspense` boundary
- Siempre importa Scene3D con `dynamic` y `ssr: false`

---

## ❌ Error: Build Failed - ESLint Errors

### Causa
ESLint detecta apóstrofes sin escapar en JSX.

### Solución
Reemplaza `'` con `&apos;` en strings JSX:
```jsx
// ❌ Incorrecto
<p>Let's build</p>

// ✅ Correcto
<p>Let&apos;s build</p>
```

---

## ❌ Error: "smoothTouch does not exist in type LenisOptions"

### Causa
Propiedad deprecada en versión nueva de Lenis.

### Solución
Ya está arreglado en `components/SmoothScroll.tsx`. Si aparece de nuevo:
```typescript
// Remover esta línea
smoothTouch: false,  // ❌

// El resto del config está bien
const lenis = new Lenis({
  duration: 1.2,
  orientation: 'vertical',
  smoothWheel: true,
  // ... etc
});
```

---

## ⚠️ Animaciones Lentas / FPS Bajo

### Diagnóstico
- Revisa el monitor de FPS (esquina inferior derecha en dev)
- Abre Chrome DevTools > Performance
- Graba mientras scrolleas
- Busca "Long Tasks" > 50ms

### Soluciones

#### 1. Reducir complejidad de 3D
```typescript
// En Scene3D.tsx
<icosahedronGeometry args={[2, 2]} /> // Reducir detalle de 4 a 2
<MeshDistortMaterial distort={0.2} /> // Reducir distorsión
```

#### 2. Limitar animaciones simultáneas
```typescript
// Desactivar algunas animaciones en mobile
const isMobile = window.innerWidth < 768;

{!isMobile && <Scene3D />} // Solo desktop
```

#### 3. Reducir blur en glassmorphism
```css
/* En globals.css */
.glass {
  backdrop-filter: blur(10px); /* Reducir de 20px a 10px */
}
```

---

## ❌ Página en Blanco / No Carga

### Solución 1: Revisar Console
```
Abre DevTools (F12) > Console
Busca errores en rojo
```

### Solución 2: Verificar Puerto
```bash
# Si puerto 3000/3001 está ocupado
lsof -ti:3000 | xargs kill -9  # Mac/Linux
# Reinicia servidor
npm run dev
```

### Solución 3: Cache del Navegador
```
1. Abre DevTools (F12)
2. Click derecho en botón Reload
3. "Empty Cache and Hard Reload"
```

---

## ❌ Error: Module not found

### Causa
Problema con imports o dependencias faltantes.

### Solución
```bash
# Verificar que todas las dependencias estén instaladas
npm install

# Si persiste, reinstalar todo
rm -rf node_modules package-lock.json
npm install
```

---

## ❌ TypeScript Errors

### Error: "Property does not exist on type"

**Solución**: Verificar imports y tipos
```typescript
// Asegurar que todos los componentes tengan tipos
interface Props {
  title: string;
  description?: string; // opcional con ?
}
```

### Error: "Cannot find module"

**Solución**: Verificar alias de paths en `tsconfig.json`
```json
{
  "paths": {
    "@/*": ["./*"]  // Debe estar presente
  }
}
```

---

## 🐛 Scene3D No Se Ve / Pantalla Negra

### Causa
- Problema con WebGL
- GPU no soportada
- Error en Three.js

### Solución 1: Verificar WebGL
Visita: https://get.webgl.org/

Si no funciona, añadir fallback:
```typescript
// En Hero.tsx
const [webglSupported, setWebglSupported] = useState(true);

useEffect(() => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  setWebglSupported(!!gl);
}, []);

// Renderizar
{webglSupported ? <Scene3D /> : <StaticImage />}
```

### Solución 2: Fallback Estático
```typescript
// Crear componente placeholder
function Scene3DFallback() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-electric-cyan/20 to-deep-purple/20 rounded-3xl flex items-center justify-center">
      <div className="text-6xl opacity-20">✨</div>
    </div>
  );
}
```

---

## ⚠️ Scroll No es Suave

### Causa
Lenis no está inicializado correctamente.

### Solución
Verificar que `SmoothScroll` envuelve todo en `layout.tsx`:
```typescript
<body>
  <SmoothScroll>
    {children}
  </SmoothScroll>
</body>
```

Si no funciona, desactivar temporalmente:
```typescript
// En layout.tsx
// <SmoothScroll>{children}</SmoothScroll>
{children}
```

---

## 📱 Mobile: Animaciones No Funcionan

### Causa
`prefers-reduced-motion` activo o performance issue.

### Solución
Verificar en DevTools > Settings > Rendering:
- Desactivar "Emulate CSS media feature prefers-reduced-motion"

Para debugging mobile:
```typescript
// Añadir en componente
useEffect(() => {
  console.log('Reduced motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}, []);
```

---

## 🔥 Hot Reload No Funciona

### Solución
```bash
# 1. Detener servidor
# 2. Limpiar cache
rm -rf .next

# 3. Reiniciar
npm run dev

# Si persiste, verificar watchman (Mac)
brew install watchman
```

---

## ❌ Build Funciona pero Dev No (o viceversa)

### Causa
Diferencias entre dev y production.

### Solución
```bash
# Probar build localmente
npm run build
npm start

# Verificar warnings en build
npm run build 2>&1 | grep -i warn
```

---

## 🎨 Estilos Tailwind No Se Aplican

### Solución
Verificar `tailwind.config.ts`:
```typescript
content: [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

Reiniciar servidor después de cambios en config:
```bash
# Ctrl+C para detener
npm run dev
```

---

## 🚀 Deploy Issues

### Vercel

**Error: Build timeout**
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 60
      }
    }
  ]
}
```

**Error: Out of memory**
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### Netlify

Configurar `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 🆘 Último Recurso

Si nada funciona:

### Opción 1: Reinstalación Completa
```bash
# Eliminar todo
rm -rf node_modules package-lock.json .next

# Reinstalar
npm install

# Rebuild
npm run build
npm run dev
```

### Opción 2: Verificar Node Version
```bash
# Verificar versión
node -v  # Debe ser >= 18.17.0

# Si es menor, actualizar
nvm install 20
nvm use 20
```

### Opción 3: Revisar Logs Completos
```bash
# Dev con logs detallados
npm run dev 2>&1 | tee dev.log

# Build con logs
npm run build 2>&1 | tee build.log

# Revisar archivos dev.log y build.log
```

---

## 📞 ¿Necesitas Más Ayuda?

1. **Revisa Console Errors**: F12 > Console
2. **Revisa Network Tab**: F12 > Network (ver qué falla)
3. **Revisa Performance**: F12 > Performance (grabar + scroll)
4. **Google el error específico**: Copia el mensaje exacto
5. **Next.js Docs**: https://nextjs.org/docs

---

## 🎯 Checklist Pre-Deploy

Antes de hacer deploy, verifica:

- [ ] `npm run build` exitoso sin errores
- [ ] `npm run lint` sin errores
- [ ] Todas las imágenes optimizadas
- [ ] Variables de entorno configuradas
- [ ] SEO metadata actualizado
- [ ] Links sociales correctos
- [ ] Tested en Chrome, Firefox, Safari
- [ ] Tested en mobile (real device)
- [ ] Lighthouse score > 90
- [ ] No console.logs en producción

---

**Happy debugging! 🐛✨**
