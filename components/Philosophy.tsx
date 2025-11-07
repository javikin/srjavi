'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from '@/lib/i18n-context';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const t = useTranslations('philosophy');
  const tHero = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quoteRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Quote animation
      gsap.fromTo(
        quoteRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 80%',
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-surface to-background"
    >
      {/* Fade from FeaturedWork section (surface background) */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-surface to-transparent pointer-events-none z-10" />

      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '-2s' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32">
        {/* Not Your Average Builder - Now as Hero */}
        <div ref={contentRef} className="max-w-5xl mx-auto space-y-12">
          {/* Title with YC badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <span className="text-sm font-medium gradient-text">YC Experience · 2 Weeks Avg · 10K+ Users</span>
            </div>
          </motion.div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
              {t('title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mb-8" />
          </div>

          {/* Main content */}
          <div className="space-y-8 text-xl md:text-2xl text-text-secondary leading-relaxed max-w-3xl">
            <p>
              {t('p1')}
              <br />
              {t('p2')}
            </p>

            <p>
              {t('p3_1')} <span className="text-text-primary font-semibold">+$100K</span> {t('p3_2')}{' '}
              <span className="text-text-primary font-semibold">6 {t('p3_2') === 'and take' ? 'months' : 'meses'}</span>, {t('p3_3')}{' '}
              <span className="gradient-text font-bold">2 {t('p3_3').includes('ship') ? 'weeks' : 'semanas'}</span> {t('p3_4')}
            </p>

            <p>
              {t('p4_1')}{' '}
              <span className="text-text-primary font-semibold">{t('p4_2')}</span>
            </p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-8"
          >
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 text-center glow-purple"
            >
              {tHero('cta1')}
            </a>
            <a
              href="#work"
              className="px-8 py-4 rounded-full border-2 border-text-primary/20 text-text-primary font-medium hover:border-primary hover:text-primary transition-all duration-300 text-center"
            >
              {tHero('cta2')}
            </a>
          </motion.div>

          {/* What You Get */}
          <div className="pt-8">
            <h3 className="text-2xl font-bold text-text-primary mb-6">{t('whatYouGet')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: t('deliverable1'), purpose: t('deliverable1Desc') },
                { name: t('deliverable2'), purpose: t('deliverable2Desc') },
                { name: t('deliverable3'), purpose: t('deliverable3Desc') },
                { name: t('deliverable4'), purpose: t('deliverable4Desc') },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-light/30 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-text-primary">{item.name}</div>
                    <div className="text-text-secondary text-base">{item.purpose}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom statement */}
          <div className="pt-8 border-t border-text-primary/10">
            <p className="text-2xl md:text-3xl font-bold text-text-primary">
              {t('bottomStatement1')} <span className="gradient-text">{t('bottomStatement2')}</span> {t('bottomStatement3')}{' '}
              <span className="gradient-text">{t('bottomStatement4')}</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
