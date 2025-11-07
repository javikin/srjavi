'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n-context';
import LanguageSwitcher from '@/components/LanguageSwitcher';

gsap.registerPlugin(ScrollTrigger);

export default function PagaOnePage() {
  const t = useTranslations('pagaone');
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Different layers move at different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]); // Background orbs - slowest
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 400]); // Mid layer - medium
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 600]); // Foreground - fastest
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: t('feature1'),
      description: t('feature1Desc'),
    },
    {
      title: t('feature2'),
      description: t('feature2Desc'),
    },
    {
      title: t('feature3'),
      description: t('feature3Desc'),
    },
    {
      title: t('feature4'),
      description: t('feature4Desc'),
    },
  ];

  const techStack = [
    'Next.js 15',
    'React 19',
    'TypeScript',
    'Tailwind CSS',
    'Supabase',
    'Vercel',
    'PWA',
  ];

  return (
    <main className="relative bg-background text-text-primary" data-barba-namespace="project">
        {/* Back to home */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-text-primary/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => {
              sessionStorage.setItem('pageTransition', 'overlay');
            }}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>←</span>
            <span>{t('back')}</span>
          </Link>

          <LanguageSwitcher />
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Image */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/projects/ref2.jpg"
            alt="paga.one"
            fill
            className="object-cover"
            priority
          />
          {/* Dynamic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-background/90 to-blue-950/95" />

          {/* Animated glow effects */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32 z-30 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm mb-8"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">{t('badge')}</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-4 leading-tight"
          >
            {t('tagline')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-12"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex items-center justify-center gap-8 mb-16"
          >
            {/* Primary CTA - View Project */}
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl md:text-3xl font-bold text-text-primary hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group"
            >
              {t('cta2')}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.a>

            {/* Secondary CTA - Visit */}
            <motion.a
              href="https://paga.one"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-text-secondary hover:text-text-primary transition-colors font-medium flex items-center gap-2"
            >
              {t('cta1')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: t('stat1'), label: t('stat1Label'), icon: "🔗" },
              { value: t('stat2'), label: t('stat2Label'), icon: "⚡" },
              { value: t('stat3'), label: t('stat3Label'), icon: "📱" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-text-muted">Scroll</span>
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">{t('problemTitle')}</h2>
              <div className="space-y-4 text-lg text-text-secondary leading-relaxed">
                <p>{t('problemP1')}</p>
                <p>{t('problemP2')}</p>
                <p>{t('problemP3')}</p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/projects/ref2.jpg"
                alt="The Problem"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="relative py-32 overflow-hidden bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <Image
                src="/images/projects/ref3.jpg"
                alt="The Solution"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold">{t('solutionTitle')}</h2>
              <div className="space-y-4 text-lg text-text-secondary leading-relaxed">
                <p>{t('solutionP1')}</p>
                <p>{t('solutionP2')}</p>
                <p>{t('solutionP3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-emerald-950/5 to-background">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider mb-4 block">{t('featuresTitle')}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('featuresSubtitle')}
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{t('featuresSubtitle2')}</span>
            </h2>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-surface/50 via-surface/30 to-surface/50 backdrop-blur-sm border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-blue-500/5 transition-all duration-500" />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300"
                    >
                      <span className="text-4xl">{['🔗', '🧾', '📸', '✓'][index]}</span>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-text-secondary leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Arrow indicator */}
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="flex items-center gap-2 text-emerald-400 font-medium"
                    >
                      <span className="text-sm">Explore</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 text-6xl font-bold text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors duration-500">
                    0{index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-emerald-400 font-medium text-sm uppercase tracking-wider mb-4 block">{t('techTitle')}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('techSubtitle')}
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{t('techSubtitle2')}</span>
            </h2>
          </motion.div>

          {/* Tech Stack Grid */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <div className="px-8 py-4 rounded-2xl bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                  <span className="text-emerald-400 font-bold text-lg group-hover:text-emerald-300 transition-colors">
                    {tech}
                  </span>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 blur-xl transition-all duration-300 -z-10" />
              </motion.div>
            ))}
          </div>

          {/* Why This Stack Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-surface/20 to-blue-950/30 backdrop-blur-sm border border-emerald-500/20 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold">{t('whyStackTitle')}</h3>
                </div>

                <p className="text-lg text-text-secondary leading-relaxed mb-8">
                  {t('whyStackDesc')}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">{'< 1s'}</div>
                    <div className="text-sm text-text-muted">{t('loadTime')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">99.9%</div>
                    <div className="text-sm text-text-muted">{t('uptime')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">Edge</div>
                    <div className="text-sm text-text-muted">{t('network')}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <motion.a
              href="https://paga.one"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300"
            >
              <span>{t('cta1')}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-emerald-950/10 to-background">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm mb-8"
            >
              <span className="text-sm font-medium text-emerald-400">{t('ctaBadge')}</span>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('ctaTitle')}
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                {t('ctaTitle2')}
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('ctaDesc')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/ship/form"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300"
                >
                  <span>{t('ctaButton1')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  onClick={() => sessionStorage.setItem('pageTransition', 'overlay')}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full border-2 border-emerald-500/30 text-text-primary font-bold text-lg hover:bg-emerald-500/10 backdrop-blur-sm transition-all duration-300"
                >
                  <span>{t('ctaButton2')}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
