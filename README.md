# Javi - AI Product Builder Landing Page

A modern, high-performance landing page built with Next.js 15, featuring cutting-edge animations and 3D effects.

## 🚀 Features

- **Next.js 15** with App Router and TypeScript
- **Framer Motion** for smooth, 60 FPS animations
- **GSAP** for advanced scroll-triggered effects
- **Three.js** for interactive 3D graphics
- **Lenis** for buttery smooth scrolling
- **Tailwind CSS** for utility-first styling
- **Glassmorphism** design with modern aesthetics
- **Fully responsive** across all devices
- **Accessibility-first** with prefers-reduced-motion support
- **Performance optimized** for Core Web Vitals

## 🎨 Design Features

### Animations
- Morphing 3D icosahedron with gradient colors
- Magnetic button effects that follow cursor
- Scroll-triggered text reveals
- Parallax image effects
- Smooth page transitions
- Stagger animations for lists

### Color Palette
- Off White: `#f8f7f3`
- Electric Cyan: `#00d9ff`
- Deep Purple: `#8b3dff`
- Dark Background: `#0a0a0a`

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Animated header
│   ├── Hero.tsx            # Hero section with 3D
│   ├── Scene3D.tsx         # Three.js 3D scene
│   ├── AboutCards.tsx      # Glassmorphism cards
│   ├── FeaturedWork.tsx    # Project showcase
│   ├── Photography.tsx     # Photography section
│   ├── Footer.tsx          # Footer with CTA
│   ├── MagneticButton.tsx  # Magnetic button component
│   ├── SmoothScroll.tsx    # Lenis smooth scroll
│   └── PerformanceMonitor.tsx  # FPS monitor (dev only)
├── hooks/
│   └── useMousePosition.ts # Mouse position hook
└── lib/
    └── animation-utils.ts  # Animation utilities
```

## 🎯 Performance

- Optimized for 60 FPS animations
- Lazy loading for 3D components
- Will-change optimization
- Reduced motion support
- Efficient scroll handling
- Code splitting
- Image optimization

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Reduced motion support
- Color contrast compliance
- Screen reader friendly

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Smooth Scroll**: Lenis
- **Font**: Inter, JetBrains Mono

## 📱 Sections

1. **Hero** - Animated headline with 3D morphing shape
2. **About** - Three glassmorphism cards in asymmetric grid
3. **Featured Work** - Showcase of Fit and Punto Blanco projects
4. **Photography** - Carrillo Puerto lifestyle section
5. **Footer** - Contact CTA with social links

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  'off-white': '#f8f7f3',
  'electric-cyan': '#00d9ff',
  'deep-purple': '#8b3dff',
  'dark-bg': '#0a0a0a',
}
```

### Animations
Adjust animation settings in `lib/animation-utils.ts`:

```typescript
export const springConfig = {
  stiffness: 150,
  damping: 20,
  mass: 0.5,
};
```

## 📄 License

© 2025 Javi. All rights reserved.

## 🤝 Contact

- Email: hello@javi.dev
- Twitter: [@javi](https://twitter.com/javi)
- LinkedIn: [/in/javi](https://linkedin.com/in/javi)

---

Built with ❤️ using AI-powered development
