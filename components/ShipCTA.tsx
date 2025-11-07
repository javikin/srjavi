'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from '@/lib/i18n-context';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function ShipCTA() {
  const t = useTranslations('footer');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            delay: 0.1,
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            delay: 0.2,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-background">
      {/* Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-surface pointer-events-none z-10" />

      {/* Subtle pastel orbs for depth (matching About section) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-mint/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-coral/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary"
          >
            {t('title')}
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </p>
          <div ref={ctaRef} className="pt-6">
            <Link
              href="/ship/form"
              className="inline-flex items-center gap-3 text-2xl md:text-3xl font-bold text-text-primary hover:text-emerald-400 transition-colors group"
            >
              {t('cta')}
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
