'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * IMMERSIVE EFFECTS - Advanced visual effects
 * Features:
 * - Animated gradients
 * - Particle systems
 * - Smooth cursor followers
 * - Ambient background effects
 * - Glassmorphism with depth
 */

// 1. ANIMATED GRADIENT BACKGROUND
export function AnimatedGradientBg({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed inset-0 -z-20 ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(138, 216, 192, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(178, 149, 206, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(133, 203, 218, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: [
            '0% 0%',
            '100% 100%',
            '0% 100%',
            '100% 0%',
            '0% 0%',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(138,216,192,0.05),transparent_50%)]" />
    </div>
  );
}

// 2. FLOATING PARTICLES - Ambient background particles
export function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 20,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-mint/20 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// 3. CUSTOM CURSOR - Smooth following cursor
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(x, springConfig);
  const cursorY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-mint rounded-full"
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-mint rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
}

// 4. SCROLL PROGRESS INDICATOR - Creative progress bar
export function ScrollProgress({ color = '#8AD8C0' }: { color?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Top Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{
          scaleX,
          background: `linear-gradient(90deg, ${color}, #85CBDA, #B295CE)`,
        }}
      />

      {/* Circular Progress */}
      <motion.div className="fixed bottom-8 right-8 w-16 h-16 z-50">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{
              pathLength: scrollYProgress,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xs font-mono text-text-muted"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
            }}
          >
            {useTransform(scrollYProgress, (v) => Math.round(v * 100))}%
          </motion.span>
        </div>
      </motion.div>
    </>
  );
}

// 5. GLASSMORPHISM CARD - Modern glass effect
export function GlassmorphCard({
  children,
  className = '',
  intensity = 'medium',
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}) {
  const intensityMap = {
    low: 'backdrop-blur-sm bg-white/5 border-white/10',
    medium: 'backdrop-blur-md bg-white/10 border-white/20',
    high: 'backdrop-blur-xl bg-white/15 border-white/30',
  };

  return (
    <div
      className={`${intensityMap[intensity]} border rounded-2xl shadow-xl ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(138, 216, 192, 0.1)',
      }}
    >
      {children}
    </div>
  );
}

// 6. NOISE TEXTURE OVERLAY
export function NoiseTexture({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  );
}

// 7. SPOTLIGHT EFFECT - Follows cursor
export function SpotlightEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(138, 216, 192, 0.08), transparent 80%)`,
      }}
    />
  );
}

// 8. DEPTH BLUR - Parallax blur on scroll
export function DepthBlur({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const blur = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        filter: useTransform(blur, (value) => `blur(${value}px)`),
        opacity,
      }}
    >
      {children}
    </motion.div>
  );
}

// 9. AURORA BACKGROUND - Northern lights effect
export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(45deg,
              rgba(138, 216, 192, 0.1) 0%,
              rgba(133, 203, 218, 0.1) 50%,
              rgba(178, 149, 206, 0.1) 100%
            )
          `,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%,
              rgba(138, 216, 192, 0.15) 0%,
              transparent 50%
            )
          `,
          filter: 'blur(40px)',
        }}
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['0%', '10%', '0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// 10. STAGGER REVEAL - Reveal children with stagger
export function StaggerReveal({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Child component for StaggerReveal
export const StaggerItem = motion.div;

StaggerItem.defaultProps = {
  variants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

// USAGE EXAMPLE:
/*
<StaggerReveal className="space-y-4">
  <StaggerItem>First item</StaggerItem>
  <StaggerItem>Second item</StaggerItem>
  <StaggerItem>Third item</StaggerItem>
</StaggerReveal>
*/
