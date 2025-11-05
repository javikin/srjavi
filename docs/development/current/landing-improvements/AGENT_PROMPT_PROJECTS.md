# 🤖 Prompt para Agent - Recopilar Info de Proyectos

Usa este prompt con un agente para que te ayude a organizar la información de tus proyectos.

---

## 📋 Prompt para Agent

```
Necesito ayuda para documentar mi proyecto [NOMBRE DEL PROYECTO] para
mi landing page de portfolio.

Por favor, ayúdame a:

1. Crear una descripción compelling del proyecto (2-3 oraciones) que:
   - Explique qué hace el proyecto
   - Destaque el problema que resuelve
   - Mencione el resultado/impacto

2. Identificar las top 3-5 features más importantes que debería destacar

3. Generar un tagline memorable (1 oración)

4. Sugerir qué métricas o resultados destacar (usuarios, tiempo de dev, etc.)

5. Recomendar qué screenshots tomar para mostrar el proyecto de la mejor manera

INFORMACIÓN DEL PROYECTO:
- Nombre: [nombre]
- Tipo: [web app, mobile app, SaaS, etc.]
- Target audience: [para quién es]
- Stack principal: [tecnologías usadas]
- Estado: [live, beta, mvp]
- Features principales que tiene: [listar features]
- Problema que resuelve: [pain point]
- Tiempo que tomó desarrollar: [duración]
- Resultados hasta ahora: [usuarios, métricas, etc.]

Por favor, estructura la información de manera que sea fácil de usar en
una landing page profesional.
```

---

## 📸 Prompt para Screenshots - Guía

```
Necesito tomar screenshots de mi proyecto [NOMBRE] para mi portfolio.

Por favor, ayúdame a crear una guía de:

1. ¿Qué pantallas/screens tomar screenshots?
   - Prioriza las más impactantes visualmente
   - Las que mejor muestran el value proposition

2. ¿Qué preparar antes de tomar cada screenshot?
   - Datos de ejemplo a mostrar
   - Estados de la UI (empty state, con datos, etc.)
   - Dark mode o light mode

3. ¿Qué tamaños/formatos necesito?
   - Para landing page preview
   - Para página individual del proyecto
   - Para diferentes devices (mobile, tablet, desktop)

4. Especificaciones técnicas:
   - Resolución recomendada
   - Aspect ratios
   - Formato de archivo
   - Optimización de peso

CONTEXTO DEL PROYECTO:
- Tipo: [web, mobile, ambos]
- Plataformas: [iOS, Android, web]
- Features visuales clave: [listar]
- Público objetivo: [para quién es]
- Vibe del proyecto: [minimal, colorful, professional, etc.]

Dame una checklist paso a paso de screenshots a tomar, con guía de
preparación para cada uno.
```

---

## 🎨 Prompt para Diseño de Página Individual

```
Necesito diseñar una página individual para mi proyecto [NOMBRE] dentro
de mi portfolio.

Por favor, ayúdame a:

1. Sugerir un estilo de diseño que:
   - Sea coherente con el proyecto mismo
   - Se diferencie de mi landing principal (que es dark minimal)
   - Sea apropiado para el target audience
   - Refleje la naturaleza del producto

2. Proponer una estructura de secciones:
   - Hero
   - Problema/Solución
   - Features
   - Screenshots showcase
   - Tech stack
   - Resultados
   - CTA

3. Recomendar una paleta de colores que:
   - Funcione con el producto
   - Sea diferente a la landing principal (black + purple/blue)
   - Mantenga coherencia con el brand general

4. Sugerir qué información destacar más prominentemente

INFORMACIÓN DEL PROYECTO:
- Tipo: [tipo de producto]
- Para quién: [target audience]
- Industria: [fintech, health, productivity, etc.]
- Personalidad del producto: [fun, serious, elegant, bold]
- Competencia similar: [referencias si tienes]

Dame recomendaciones específicas de diseño, colores, y estructura.
```

---

## 💡 Tips para Usar Estos Prompts

### Con ChatGPT/Claude:
1. Copia el prompt base
2. Rellena la información entre [corchetes]
3. Pega en el chat
4. Itera según las respuestas

### Para Screenshots:
1. Usa el prompt de screenshots
2. Sigue la guía que genere
3. Toma screenshots en alta resolución
4. Optimiza después con Squoosh.app

### Para Iteración:
- Si la primera respuesta no es perfecta, pide variaciones
- Ejemplo: "Dame 3 opciones diferentes de tagline"
- Ejemplo: "Hazlo más conciso" o "Hazlo más técnico"

---

## 📦 Output Ideal del Agent

Deberías obtener algo como:

```markdown
## paga.one - Información Compilada

**Tagline:** "Un link para todas tus cuentas de pago"

**Descripción:**
"paga.one elimina la fricción de cobros para freelancers y creadores.
En lugar de enviar múltiples links de pago (PayPal, Stripe, Zelle),
tus clientes eligen su método preferido en una sola página."

**Top Features:**
- Link personalizado (paga.one/tunombre)
- 10+ métodos de pago integrados
- QR code automático para pagos presenciales
- Analytics de conversión
- Mobile-first responsive

**Métricas:**
- Desarrollado en 10 días
- 500+ usuarios activos
- Estado: Live en producción

**Screenshots a tomar:**
1. Dashboard principal (con datos de ejemplo)
2. Página de pago pública (vista del cliente)
3. Analytics screen
4. Mobile view (vertical)
5. QR code feature
```

---

**¿Listo para darme la info de paga.one?** 🚀
