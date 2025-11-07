'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import MagneticButton from './MagneticButton';
import AnimatedShape from './AnimatedShape';
import { useTranslations } from '@/lib/i18n-context';

// Dynamically import Scene3DSimple to avoid SSR issues
const Scene3DSimple = dynamic(() => import('./Scene3DSimple'), {
  ssr: false,
  loading: () => <AnimatedShape />,
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Parallax for orbs (subtle movement)
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -100]);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Subtle pastel orbs with parallax (Jason Briscoe style) */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute top-1/4 -left-40 w-80 h-80 bg-mint/10 rounded-full blur-3xl animate-float"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="absolute bottom-1/4 -right-40 w-96 h-96 bg-coral/10 rounded-full blur-3xl animate-float"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lavender/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 py-32 text-center">
        {/* Content */}
        <div className="space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <span className="text-sm font-medium text-text-muted">{t('badge')}</span>
          </motion.div>

          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-text-primary perspective-1000"
          >
            {t('title')}
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 pt-8 justify-center items-center"
          >
            <a
              href="/ship/form"
              className="text-2xl md:text-3xl font-bold text-text-primary hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group"
            >
              {t('cta')}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex gap-12 pt-12 flex-wrap justify-center"
          >
            {[
              { value: t('stat1Value'), label: t('stat1Label') },
              { value: t('stat2Value'), label: t('stat2Label') },
              { value: t('stat3Value'), label: t('stat3Label') },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-3xl font-bold text-text-primary">{stat.value}</span>
                <span className="text-sm text-text-secondary">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
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
            className="w-1.5 h-1.5 bg-text-primary/40 rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
