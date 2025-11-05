/**
 * Animation utilities for performance optimization and accessibility
 */

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Spring configuration for 60 FPS animations
export const springConfig = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 20,
  mass: 0.5,
};

// Smooth spring for magnetic effects
export const magneticSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 15,
  mass: 0.1,
};

// Easing functions optimized for performance
export const easing = {
  smooth: [0.22, 1, 0.36, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  gentle: [0.16, 1, 0.3, 1] as const,
};

// Fade in animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

// Fade in animation variants (reduced motion)
export const fadeInUpReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Get appropriate animation based on user preference
export const getAnimation = (animation: any) => {
  return prefersReducedMotion() ? { initial: { opacity: 0 }, animate: { opacity: 1 } } : animation;
};

// Stagger children animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Will-change optimization helper
export const optimizeAnimation = (element: HTMLElement | null) => {
  if (!element) return;

  // Add will-change before animation
  element.style.willChange = 'transform, opacity';

  // Remove will-change after animation completes
  setTimeout(() => {
    element.style.willChange = 'auto';
  }, 1000);
};

// RequestAnimationFrame wrapper for smooth animations
export const smoothRAF = (callback: FrameRequestCallback) => {
  if (prefersReducedMotion()) {
    callback(0);
    return;
  }
  requestAnimationFrame(callback);
};

// Intersection Observer options for lazy animations
export const intersectionOptions: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -10% 0px',
};

// Create optimized GSAP defaults
export const gsapDefaults = {
  ease: 'power3.out',
  duration: 0.8,
  force3D: true,
  lazy: false,
};

// Performance monitoring
export const monitorFPS = (callback: (fps: number) => void) => {
  let lastTime = performance.now();
  let frames = 0;

  const checkFPS = () => {
    const currentTime = performance.now();
    frames++;

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      callback(fps);
      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
  };

  checkFPS();
};
