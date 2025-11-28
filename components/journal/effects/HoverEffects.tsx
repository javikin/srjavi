'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

/**
 * ADVANCED HOVER EFFECTS LIBRARY
 * Collection of creative hover interactions
 */

// 1. MAGNETIC CARD - Follows cursor with physics
export function MagneticCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 2. LIQUID CURSOR GLOW - Blob that follows cursor
export function LiquidGlow({ children, color = '#8AD8C0' }: { children: React.ReactNode; color?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none rounded-full blur-3xl"
          style={{
            width: 200,
            height: 200,
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            background: `radial-gradient(circle, ${color}40, transparent 70%)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {children}
    </div>
  );
}

// 3. SPLIT REVEAL - Image splits on hover
export function SplitReveal({
  imageSrc,
  title,
  className = ''
}: {
  imageSrc: string;
  title: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Half */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
        animate={{ x: isHovered ? -20 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative w-[200%] h-full">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        </div>
      </motion.div>

      {/* Right Half */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
        animate={{ x: isHovered ? 20 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative w-[200%] h-full -translate-x-1/2">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        </div>
      </motion.div>

      {/* Title Reveal */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-4xl font-bold text-mint">{title}</h3>
      </motion.div>
    </div>
  );
}

// 4. MORPHING BORDER - Animated gradient border
export function MorphingBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-[2px] rounded-2xl overflow-hidden ${className}`}>
      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, #8AD8C0, #85CBDA, #B295CE, #F39A8E, #8AD8C0)',
          backgroundSize: '300% 300%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Content */}
      <div className="relative bg-background rounded-2xl h-full">
        {children}
      </div>
    </div>
  );
}

// 5. RIPPLE EFFECT - Click ripple animation
export function RippleEffect({ children }: { children: React.ReactNode }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="relative overflow-hidden" onClick={handleClick}>
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-mint/30"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// 6. PARALLAX LAYERS - Multi-layer depth on hover
export function ParallaxLayers({
  imageSrc,
  title,
  subtitle,
  className = ''
}: {
  imageSrc: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const layer1X = useSpring(useTransform(x, [-100, 100], [-20, 20]), { stiffness: 300, damping: 30 });
  const layer1Y = useSpring(useTransform(y, [-100, 100], [-20, 20]), { stiffness: 300, damping: 30 });
  const layer2X = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });
  const layer2Y = useSpring(useTransform(y, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Layer */}
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="absolute inset-0 scale-110"
      >
        <Image src={imageSrc} alt={title} fill className="object-cover blur-sm" />
      </motion.div>

      {/* Middle Layer - Image */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute inset-0"
      >
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </motion.div>

      {/* Front Layer - Text */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 bg-gradient-to-t from-background via-background/50 to-transparent">
        <motion.h3
          style={{ x: layer1X, y: layer1Y }}
          className="text-3xl font-bold text-text-primary mb-2"
        >
          {title}
        </motion.h3>
        <motion.p
          style={{ x: layer2X, y: layer2Y }}
          className="text-text-secondary"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}

// 7. GOOEY EFFECT - Blob morph on hover
export function GooeyCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* SVG Filter for gooey effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: 'url(#gooey)' }}>
        {children}
      </div>
    </motion.div>
  );
}

// 8. TEXT SCRAMBLE - Cyberpunk text reveal
export function TextScramble({ text, className = '' }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <span
      className={`font-mono ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
}
