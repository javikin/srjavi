'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * PAGE TRANSITIONS - Creative transitions between journal and post
 * Features:
 * - Morphing shapes
 * - Slide & scale
 * - Curtain reveal
 * - Circular wipe
 * - Liquid swipe
 */

// 1. MORPHING CIRCLE - Expands from clicked card
export function MorphingCircleTransition({
  children,
  origin = { x: 50, y: 50 }
}: {
  children: React.ReactNode;
  origin?: { x: number; y: number };
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          clipPath: `circle(0% at ${origin.x}% ${origin.y}%)`,
          opacity: 0,
        }}
        animate={{
          clipPath: 'circle(150% at 50% 50%)',
          opacity: 1,
        }}
        exit={{
          clipPath: `circle(0% at ${origin.x}% ${origin.y}%)`,
          opacity: 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// 2. CURTAIN REVEAL - Multiple layers sliding
export function CurtainTransition({ children }: { children: React.ReactNode }) {
  const curtains = [
    { color: '#8AD8C0', delay: 0 },
    { color: '#85CBDA', delay: 0.1 },
    { color: '#B295CE', delay: 0.2 },
  ];

  return (
    <div className="relative">
      {curtains.map((curtain, index) => (
        <motion.div
          key={index}
          className="fixed inset-0 z-50"
          style={{ backgroundColor: curtain.color }}
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          animate={{ scaleY: 0, transformOrigin: 'top' }}
          exit={{ scaleY: 1, transformOrigin: 'top' }}
          transition={{
            duration: 0.6,
            delay: curtain.delay,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}
      {children}
    </div>
  );
}

// 3. SCALE & BLUR - Elegant fade with blur
export function ScaleBlurTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(10px)',
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// 4. LIQUID SWIPE - Organic blob transition
export function LiquidSwipeTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <clipPath id="liquidPath">
            <motion.path
              initial={{
                d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z',
              }}
              animate={{
                d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z',
              }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </clipPath>
        </defs>
      </svg>
      <motion.div
        initial={{ clipPath: 'url(#liquidPath)' }}
        animate={{ clipPath: 'none' }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// 5. ZOOM STACK - Cards stack and zoom
export function ZoomStackTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        scale: 0.8,
        y: 100,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        y: 0,
        opacity: 1,
      }}
      exit={{
        scale: 0.8,
        y: -100,
        opacity: 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      {children}
    </motion.div>
  );
}

// 6. SPLIT SCREEN - Slides from sides
export function SplitScreenTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-mint z-50"
        initial={{ x: '0%' }}
        animate={{ x: '-100%' }}
        exit={{ x: '0%' }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-lavender z-50"
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        exit={{ x: '0%' }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// 7. DIAGONAL WIPE - Sleek diagonal reveal
export function DiagonalWipeTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
      transition={{
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// 8. PAGE TRANSITION WRAPPER - Use with Next.js router
export function PageTransitionWrapper({
  children,
  type = 'scale-blur'
}: {
  children: React.ReactNode;
  type?: 'morph' | 'curtain' | 'scale-blur' | 'liquid' | 'zoom' | 'split' | 'diagonal';
}) {
  const pathname = usePathname();

  const transitions = {
    morph: MorphingCircleTransition,
    curtain: CurtainTransition,
    'scale-blur': ScaleBlurTransition,
    liquid: LiquidSwipeTransition,
    zoom: ZoomStackTransition,
    split: SplitScreenTransition,
    diagonal: DiagonalWipeTransition,
  };

  const TransitionComponent = transitions[type];

  return (
    <AnimatePresence mode="wait">
      <TransitionComponent key={pathname}>
        {children}
      </TransitionComponent>
    </AnimatePresence>
  );
}

// USAGE IN LAYOUT:
/*
// app/journal/layout.tsx
import { PageTransitionWrapper } from '@/components/journal/effects/PageTransitions';

export default function JournalLayout({ children }) {
  return (
    <PageTransitionWrapper type="scale-blur">
      {children}
    </PageTransitionWrapper>
  );
}
*/

// 9. CARD TO PAGE TRANSITION - Smooth morph from card click
export function useCardToPageTransition() {
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleCardClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });

    // Store in sessionStorage for the next page
    sessionStorage.setItem('transitionOrigin', JSON.stringify({ x, y }));
  };

  const getStoredOrigin = () => {
    const stored = sessionStorage.getItem('transitionOrigin');
    if (stored) {
      sessionStorage.removeItem('transitionOrigin');
      return JSON.parse(stored);
    }
    return { x: 50, y: 50 };
  };

  return { origin, handleCardClick, getStoredOrigin };
}
