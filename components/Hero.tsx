'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import MagneticButton from './MagneticButton';
import AnimatedShape from './AnimatedShape';

// Dynamically import Scene3DSimple to avoid SSR issues
const Scene3DSimple = dynamic(() => import('./Scene3DSimple'), {
  ssr: false,
  loading: () => <AnimatedShape />,
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation
      if (titleRef.current) {
        const chars = titleRef.current.textContent?.split('') || [];
        titleRef.current.innerHTML = chars
          .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');

        gsap.fromTo(
          titleRef.current.children,
          {
            y: 100,
            opacity: 0,
            rotateX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.02,
            ease: 'back.out(1.7)',
            delay: 0.3,
          }
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 1,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32 grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
          >
            <span className="text-sm font-medium gradient-text">AI Product Builder</span>
          </motion.div>

          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-text-primary perspective-1000"
          >
            Ship MVPs in 2 Weeks
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed"
          >
            YC-experienced builder. AI-first development. Production-ready.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <MagneticButton>
              <a
                href="#contact"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 text-center glow-purple"
              >
                Validate Your Idea
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href="#work"
                className="px-8 py-4 rounded-full border-2 border-text-primary/20 text-text-primary font-medium hover:border-primary hover:text-primary transition-all duration-300 text-center"
              >
                See Work
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex gap-8 pt-8 flex-wrap"
          >
            {[
              { value: '2 weeks', label: 'Avg. Delivery' },
              { value: '10K+', label: 'Users Reached' },
              { value: 'YC', label: 'Experience' },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-3xl font-bold gradient-text">{stat.value}</span>
                <span className="text-sm text-text-secondary">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full h-[500px] lg:h-[700px]"
        >
          <AnimatedShape />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-text-primary/20 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-secondary rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
