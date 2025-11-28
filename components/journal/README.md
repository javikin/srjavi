# Journal Component Library - Creative Implementations

Advanced React components for an immersive journal/blog experience using Next.js 14, Framer Motion, and Tailwind CSS.

## Table of Contents
- [Views](#views)
- [Effects](#effects)
- [Usage Examples](#usage-examples)
- [Performance Considerations](#performance-considerations)
- [Accessibility](#accessibility)

---

## Views

### 1. MasonryView
**File:** `/components/journal/views/MasonryView.tsx`

Pinterest-style masonry layout with dynamic columns and parallax effects.

**Features:**
- Responsive columns (1-4 based on screen size)
- Parallax scroll on images
- Staggered reveal animations
- Variable card heights for visual interest

**Usage:**
```tsx
import { MasonryView } from '@/components/journal/views/MasonryView';

<MasonryView posts={posts} />
```

**Props:**
- `posts`: Array of post objects

---

### 2. TimelineView
**File:** `/components/journal/views/TimelineView.tsx`

Horizontal scrolling timeline with Instagram Stories-style interaction.

**Features:**
- Horizontal scroll with progress indicator
- Snap scrolling
- Scale animations based on active card
- Timeline connector line
- Depth parallax effect

**Usage:**
```tsx
import { TimelineView } from '@/components/journal/views/TimelineView';

<TimelineView posts={posts} />
```

**Best for:** Chronological content, photo journals

---

### 3. StoryView
**File:** `/components/journal/views/StoryView.tsx`

Full-screen scroll storytelling (Apple/Airbnb style).

**Features:**
- Scroll-triggered animations
- Multi-layer parallax with depth
- Text word-by-word reveals
- Image zoom/pan on scroll
- Floating background elements
- Alternating layouts

**Usage:**
```tsx
import { StoryView } from '@/components/journal/views/StoryView';

<StoryView posts={posts} />
```

**Best for:** Long-form content, photo essays

---

### 4. ShowcaseView
**File:** `/components/journal/views/ShowcaseView.tsx`

Full-featured view combining all techniques with tag filtering and view modes.

**Features:**
- Featured + Grid view modes
- Tag filtering
- Glassmorphism UI
- Animated backgrounds
- All hover effects integrated

**Usage:**
```tsx
import { ShowcaseView } from '@/components/journal/views/ShowcaseView';

<ShowcaseView posts={posts} />
```

---

## Effects

### Hover Effects
**File:** `/components/journal/effects/HoverEffects.tsx`

#### 1. MagneticCard
Card that follows cursor with physics-based movement.

```tsx
import { MagneticCard } from '@/components/journal/effects/HoverEffects';

<MagneticCard className="p-6 rounded-xl bg-surface">
  <YourContent />
</MagneticCard>
```

#### 2. LiquidGlow
Blob-like glow that follows cursor.

```tsx
<LiquidGlow color="#8AD8C0">
  <YourCard />
</LiquidGlow>
```

#### 3. SplitReveal
Image splits on hover revealing title.

```tsx
<SplitReveal
  imageSrc="/image.jpg"
  title="Post Title"
  className="h-96 rounded-2xl"
/>
```

#### 4. MorphingBorder
Animated gradient border.

```tsx
<MorphingBorder className="p-6">
  <YourContent />
</MorphingBorder>
```

#### 5. RippleEffect
Click ripple animation.

```tsx
<RippleEffect>
  <button>Click me</button>
</RippleEffect>
```

#### 6. ParallaxLayers
Multi-layer depth on hover.

```tsx
<ParallaxLayers
  imageSrc="/image.jpg"
  title="Title"
  subtitle="Subtitle"
  className="h-96"
/>
```

#### 7. GooeyCard
Blob morph effect.

```tsx
<GooeyCard className="p-6 bg-surface rounded-xl">
  <YourContent />
</GooeyCard>
```

#### 8. TextScramble
Cyberpunk text reveal on hover.

```tsx
<TextScramble text="Journal" className="text-4xl font-bold" />
```

---

### Page Transitions
**File:** `/components/journal/effects/PageTransitions.tsx`

#### Available Transitions:
1. **MorphingCircle** - Expands from clicked card
2. **Curtain** - Multiple layers sliding
3. **ScaleBlur** - Elegant fade with blur
4. **LiquidSwipe** - Organic blob transition
5. **ZoomStack** - Cards stack and zoom
6. **SplitScreen** - Slides from sides
7. **DiagonalWipe** - Diagonal reveal

**Usage with Next.js:**
```tsx
// app/journal/layout.tsx
import { PageTransitionWrapper } from '@/components/journal/effects/PageTransitions';

export default function JournalLayout({ children }) {
  return (
    <PageTransitionWrapper type="scale-blur">
      {children}
    </PageTransitionWrapper>
  );
}
```

**Card to Page Transition:**
```tsx
import { useCardToPageTransition } from '@/components/journal/effects/PageTransitions';

function Card() {
  const { handleCardClick } = useCardToPageTransition();

  return (
    <Link href="/post" onClick={handleCardClick}>
      <div>Card Content</div>
    </Link>
  );
}
```

---

### Immersive Effects
**File:** `/components/journal/effects/ImmersiveEffects.tsx`

#### 1. AnimatedGradientBg
```tsx
<AnimatedGradientBg />
```

#### 2. FloatingParticles
```tsx
<FloatingParticles count={20} />
```

#### 3. CustomCursor
```tsx
<CustomCursor />
```

#### 4. ScrollProgress
```tsx
<ScrollProgress color="#8AD8C0" />
```

#### 5. GlassmorphCard
```tsx
<GlassmorphCard intensity="medium">
  <YourContent />
</GlassmorphCard>
```

#### 6. NoiseTexture
```tsx
<NoiseTexture opacity={0.03} />
```

#### 7. SpotlightEffect
```tsx
<SpotlightEffect />
```

#### 8. DepthBlur
```tsx
<DepthBlur>
  <YourContent />
</DepthBlur>
```

#### 9. AuroraBackground
```tsx
<AuroraBackground />
```

#### 10. StaggerReveal
```tsx
<StaggerReveal staggerDelay={0.1}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerReveal>
```

---

## Usage Examples

### Complete Journal Page Setup

```tsx
// app/journal/page.tsx
'use client';

import { useState } from 'react';
import { ShowcaseView } from '@/components/journal/views/ShowcaseView';
import { AnimatedGradientBg, FloatingParticles, CustomCursor } from '@/components/journal/effects/ImmersiveEffects';

export default function JournalPage() {
  const posts = [...]; // Your posts data

  return (
    <>
      {/* Background effects */}
      <AnimatedGradientBg />
      <FloatingParticles count={15} />
      <CustomCursor />

      {/* Main content */}
      <ShowcaseView posts={posts} />
    </>
  );
}
```

### Mix and Match Effects

```tsx
import { MagneticCard, LiquidGlow } from '@/components/journal/effects/HoverEffects';
import { GlassmorphCard } from '@/components/journal/effects/ImmersiveEffects';

<LiquidGlow color="#8AD8C0">
  <MagneticCard>
    <GlassmorphCard intensity="high">
      <YourCard />
    </GlassmorphCard>
  </MagneticCard>
</LiquidGlow>
```

---

## Performance Considerations

### Optimization Tips:

1. **Use `useInView` for expensive animations:**
```tsx
const isInView = useInView(ref, { once: true, margin: '-100px' });
```

2. **Lazy load images:**
```tsx
<Image
  src={src}
  alt={alt}
  fill
  loading="lazy"
  placeholder="blur"
/>
```

3. **Limit particle count on mobile:**
```tsx
const particleCount = isMobile ? 5 : 20;
<FloatingParticles count={particleCount} />
```

4. **Disable complex effects on low-end devices:**
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

5. **Use `will-change` sparingly:**
Only on actively animating elements.

---

## Accessibility

### Built-in Features:

1. **Keyboard Navigation:**
   - All interactive elements are keyboard accessible
   - Focus states clearly visible

2. **Screen Readers:**
   - Semantic HTML used throughout
   - ARIA labels on interactive elements

3. **Reduced Motion:**
   - Respects `prefers-reduced-motion`
   - Add this to disable animations:

```tsx
const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={shouldReduceMotion ? {} : { y: -10 }}
>
  ...
</motion.div>
```

4. **Color Contrast:**
   - All text meets WCAG AA standards
   - Test with browser DevTools

### Accessibility Checklist:

- [ ] All images have alt text
- [ ] Interactive elements are keyboard accessible
- [ ] Focus indicators visible
- [ ] Animations can be disabled
- [ ] Color contrast ratios meet WCAG AA
- [ ] Semantic HTML used
- [ ] ARIA labels on custom components
- [ ] Screen reader tested

---

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS 14+, Android 10+

**Note:** Some effects use modern CSS features. Test thoroughly on target browsers.

---

## Dependencies

```json
{
  "framer-motion": "^10.x",
  "next": "^14.x",
  "react": "^18.x",
  "tailwindcss": "^3.x"
}
```

---

## Credits

Created by: Claude (Anthropic)
Design inspiration: Apple, Airbnb, Stripe, Linear
Color palette: Jason Briscoe inspired (mint, coral, lavender)

---

## License

Use freely in your projects.
