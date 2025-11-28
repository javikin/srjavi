# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

---

## Development Commands

### Core Development Flow
```bash
# Development
npm run dev          # Start dev server (default: http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Run production build locally

# Code Quality
npm run lint         # Run ESLint (includes Next.js lint rules)
```

### Troubleshooting Commands
```bash
# Clean cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Check TypeScript errors
npm run build
```

---

## Tech Stack & Key Dependencies

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS + custom CSS variables for theme system
- **Animations**: 
  - Framer Motion (60 FPS optimized)
  - GSAP + ScrollTrigger (scroll-based animations)
  - Lenis (smooth scroll)
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **State**: Zustand (with persist middleware)
- **Rich Text**: TipTap (for journal entries)
- **AI Integration**: Groq API (free tier, llama-3.3-70b-versatile)
- **Database**: Supabase (dependency present, not yet integrated)
- **Forms**: Custom wizard with multi-step flow
- **Icons/Emojis**: Inline SVG + extensive emoji collection
- **ID Generation**: nanoid

---

## Project Architecture

### Core Application Structure

This is a **multi-app monorepo** with three main sub-applications:

1. **Main Landing Page** (`/`)
   - Portfolio/marketing site
   - Multi-lingual (EN/ES) with `I18nProvider` context
   - Theme switcher (light/dark mode via Tailwind `dark:` classes)
   - Password-protected via `NEXT_PUBLIC_SITE_PASSWORD` env var
   - Sections: Hero, About, LandingCTA, Footer
   - Navigation routes: `/`, `#about`, `#work`, `/journal`, `#contact`

2. **Project Wizard** (`/ship`)
   - Multi-step form for project estimation
   - 7-step wizard: Project Type → Problem → Target User → Features → Timeline → Budget → Payment Model
   - AI-powered text improvement via Groq API (see `hooks/useGemini.ts`)
   - Final estimate page with WhatsApp integration
   - **No Supabase integration yet**: Data lives in form state only

3. **Journal** (`/journal`)
   - Personal journal/blog with rich text editor
   - Full CRUD operations (Create, Read, Update, Delete)
   - TipTap editor with character count, images, links, placeholders
   - Photo uploads with drag-and-drop (local dataURL storage)
   - Mood tracking (8 moods: happy, excited, calm, reflective, grateful, sad, energetic, creative)
   - Tags, location, word count auto-calculation
   - **Storage**: Currently localStorage via Zustand persist (see `lib/journal/store.ts`)
   - **TODO**: Replace localStorage with Supabase backend

### Key Architectural Patterns

#### Theme System (Light/Dark Mode)
- Implemented via Tailwind's `dark:` class variant
- `DarkModeScript` component hydrates theme from `localStorage.theme` on mount
- CSS custom properties in `globals.css`:
  ```css
  :root { --color-background, --color-text-primary, etc. }
  .dark { --color-background (dark values), etc. }
  ```
- Tailwind config uses `rgb(var(--color-*) / <alpha-value>)` pattern

#### i18n (Internationalization)
- **Context**: `I18nProvider` in `lib/i18n-context.tsx`
- **Messages**: `messages/en.json`, `messages/es.json`
- **Usage**: `const t = useTranslations('namespace'); t('key')`
- Auto-detects browser language on first load
- Persists preference to `localStorage.locale`
- All user-facing strings should be externalized to message files

#### Animation Performance Strategy
- **60 FPS target**: See `components/PerformanceMonitor.tsx` (dev-only)
- Only animate `transform` and `opacity` (GPU-accelerated)
- `will-change` optimization applied before heavy animations
- `prefers-reduced-motion` support via `lib/animation-utils.ts`
- Three.js components lazy-loaded with `dynamic(() => import(), { ssr: false })`
- Lenis smooth scroll integrates with GSAP ScrollTrigger

#### Page Transitions & Loading
- `PageTransition` component wraps all pages with Framer Motion transitions
- `PageLoader` shows emoji animation on initial load (hidden on `/ship` routes)
- `PasswordProtect` wraps entire app if `NEXT_PUBLIC_SITE_PASSWORD` is set
- Transition types stored in `sessionStorage.pageTransition`: overlay, slide, scale, wipe, default

#### State Management
- **Global state**: Zustand stores (see `lib/journal/store.ts`)
- **Persist**: Uses `zustand/middleware` persist to localStorage
- **Server state**: None yet (TODO: integrate Supabase for journal)

---

## Important File Locations

### Configuration
- `next.config.ts` - Next.js config (optimizes framer-motion, three.js packages)
- `tsconfig.json` - TypeScript config (`@/*` path alias = project root)
- `tailwind.config.ts` - Theme colors, animations, custom utilities
- `.env.local.example` - Environment variable template (copy to `.env.local`)

### Core Layout & Providers
- `app/layout.tsx` - Root layout with fonts, metadata, all global providers
- `app/globals.css` - Global styles, Tailwind directives, CSS custom properties
- `lib/i18n-context.tsx` - i18n provider (EN/ES switching)

### Feature-Specific
- **Animations**: `lib/animation-utils.ts` (spring configs, easing, helpers)
- **Journal**: `lib/journal/*` (store, types, utils)
- **AI/Groq**: `hooks/useGemini.ts` (text generation, problem/user helpers)
- **3D**: `components/Scene3D*.tsx` (three variations: full, simple, animated shape)

### Routes
- `/` - Main landing page
- `/ship` - Project wizard landing
- `/ship/form` - Wizard multi-step form
- `/journal` - Journal entry list (empty state if no entries)
- `/journal/new` - Create new journal entry (TipTap editor)
- `/projects/paga-one` - Case study
- `/projects/fit` - Case study (Gainz app)
- `/projects/puntogo` - Case study

---

## Critical Development Practices

### 1. Server vs Client Components
- **Use `'use client'`** for:
  - Any component using hooks (useState, useEffect, etc.)
  - Components with event handlers
  - Framer Motion, GSAP, or browser APIs
- **Default to Server Components** for:
  - Static content (text, images)
  - Data fetching (when Supabase is integrated)
  - SEO-critical pages

### 2. Animation Guidelines
- **Respect `prefers-reduced-motion`**: Always check `prefersReducedMotion()` helper
- **Use GPU-accelerated properties**: `transform`, `opacity` only
- **Avoid layout shifts**: Animations should not trigger reflow/repaint
- **FPS target**: 60 FPS (monitor with `PerformanceMonitor` in dev)
- See `ANIMATIONS.md` for full animation guide

### 3. Three.js / 3D Components
- **Always wrap in Suspense**: `<Suspense fallback={null}>`
- **Disable SSR**: Use `dynamic(() => import(), { ssr: false })`
- **Provide fallback**: For browsers without WebGL support
- Three scene options documented in `SCENE3D_OPTIONS.md`

### 4. i18n (Translations)
- **Never hardcode user-facing strings**: Use `useTranslations` hook
- **Add to both message files**: `messages/en.json` and `messages/es.json`
- **Namespace keys**: `nav.about`, `hero.title`, `footer.copyright`, etc.
- Example:
  ```tsx
  const t = useTranslations('nav');
  <a>{t('about')}</a> // Reads from messages/en.json → nav.about
  ```

### 5. Dark Mode / Theme
- Use Tailwind `dark:` variant for dark mode styles
- For custom CSS: use CSS custom properties (`var(--color-text-primary)`)
- Test both light and dark themes before committing
- Theme toggle is in `ThemeToggle` component

### 6. Forms & Validation
- No external form library (React Hook Form, Formik) used
- State managed with `useState` in wizard components
- Validation is inline (example: `/ship/form` wizard)
- For complex forms in future: consider adding Zod + React Hook Form

### 7. Error Handling & Troubleshooting
- **Console logs**: Clean up `console.log` before production
- **Cache issues**: If hot reload breaks, run `rm -rf .next && npm run dev`
- **TypeScript errors**: Run `npm run build` to surface all type errors
- **ESLint**: Fix linting errors with `npm run lint`
- See `TROUBLESHOOTING.md` for common issues

---

## Environment Variables

### Required for Full Functionality
```bash
# AI Text Generation (Groq API)
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here

# Password Protection (optional)
NEXT_PUBLIC_SITE_PASSWORD=your_password
```

### How to Set Up
1. Copy `.env.local.example` to `.env.local`
2. Get free Groq API key: https://console.groq.com/keys
3. Add keys to `.env.local` (never commit this file)
4. For production (Vercel): Set in Vercel Environment Variables

---

## Common Workflows

### Adding a New Page
1. Create `app/[route]/page.tsx`
2. Add `'use client'` if using interactivity
3. Add i18n strings to `messages/en.json` and `messages/es.json`
4. Update `Navigation.tsx` if it should be in nav menu
5. Test in both light/dark themes
6. Test in both EN/ES languages

### Adding a New Component
1. Create in `components/` directory
2. Use `'use client'` directive if needed
3. Props should have TypeScript interfaces
4. Export as default export
5. For animations, follow patterns in existing components (see `ANIMATIONS.md`)

### Working with Journal Feature
- **Store**: `lib/journal/store.ts` (Zustand + localStorage)
- **Types**: `lib/journal/types.ts` (JournalEntry, Mood, Photo, etc.)
- **Utils**: `lib/journal/utils.ts` (formatters, mood colors/emojis)
- **Components**: `components/journal/` (core, effects, ui, views)
- **TODO**: Migrate from localStorage to Supabase

### Adding New Animations
1. Read `ANIMATIONS.md` for patterns and best practices
2. For scroll animations: Use GSAP ScrollTrigger
3. For micro-interactions: Use Framer Motion
4. For 3D: Use React Three Fiber (see `Scene3D*.tsx`)
5. Always test with `prefers-reduced-motion` enabled

### Deploying to Vercel
1. Push to main branch (auto-deploys on Vercel)
2. Set environment variables in Vercel dashboard
3. Check build logs for errors
4. Verify dark mode and i18n work in production

---

## Testing Checklist

Before merging changes, verify:
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] Both light and dark themes work
- [ ] Both EN and ES languages render correctly
- [ ] Animations run at 60 FPS (check `PerformanceMonitor` in dev)
- [ ] `prefers-reduced-motion` is respected
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] No console errors in browser DevTools
- [ ] Three.js components load without errors (check Scene3D)

---

## Known TODOs & Future Work

### High Priority
- [ ] **Integrate Supabase for Journal**: Replace localStorage with database
  - Auth (optional, currently no login)
  - CRUD operations for journal entries
  - Photo uploads to Supabase Storage
  - Real-time sync (optional)
- [ ] **Supabase for /ship wizard**: Persist form submissions to database
- [ ] **Email notifications**: Send estimation results via email (Resend, SendGrid)

### Medium Priority
- [ ] **Analytics**: Add Google Analytics 4 or Plausible
- [ ] **SEO**: Dynamic meta tags per page (Open Graph, Twitter Card)
- [ ] **Contact form**: Replace `mailto:` links with actual form
- [ ] **Testimonials**: Add client testimonials section
- [ ] **Blog/MDX**: Consider MDX blog if journal becomes public

### Low Priority / Nice-to-Have
- [ ] **Unit tests**: Vitest or Jest for utils/hooks
- [ ] **E2E tests**: Playwright for critical flows
- [ ] **Storybook**: Component documentation
- [ ] **Accessibility audit**: Run axe-core or Lighthouse
- [ ] **Performance budget**: Set Core Web Vitals targets

---

## Marketing & Strategy Context

This site is a **portfolio + lead generation tool** for a solo developer offering:
- **Service**: AI-first MVP development (subscription model)
- **Target**: Startups, founders, small businesses
- **Markets**: Mexico (Spanish) + USA (English)
- **Pricing**: ~$500-750 USD/month subscription

Key differentiators (keep in mind when making changes):
- Fast delivery (2-4 weeks for MVP)
- Senior-level quality
- Transparent pricing (vs. unpredictable agency costs)
- Real case studies (paga.one, Gainz/Fit)

See `MARKETING_STRATEGY.md` for full ad campaign strategy (LinkedIn, Google, Meta, Reddit).

---

## When in Doubt

1. **Read existing code first**: Patterns are established throughout the codebase
2. **Check documentation files**: `ANIMATIONS.md`, `SCENE3D_OPTIONS.md`, `TROUBLESHOOTING.md`
3. **Follow TypeScript types**: They are strictly enforced
4. **Preserve existing conventions**: Don't introduce new patterns without reason
5. **Test thoroughly**: Light/dark, EN/ES, mobile/desktop, animations

---

## Additional Resources

- **Next.js 15 Docs**: https://nextjs.org/docs
- **Framer Motion API**: https://www.framer.com/motion/
- **GSAP Docs**: https://greensock.com/docs/
- **Three.js Docs**: https://threejs.org/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber/
- **Tailwind CSS**: https://tailwindcss.com/
- **Groq API**: https://console.groq.com/docs
- **Zustand**: https://docs.pmnd.rs/zustand/getting-started/introduction

---

**Last Updated**: November 2025
