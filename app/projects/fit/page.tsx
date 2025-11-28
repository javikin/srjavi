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

export default function FitPage() {
  const t = useTranslations('fit');
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 400]);
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
    'Flutter 3.35',
    'Dart 3.9',
    'Riverpod',
    'Material 3',
    'Drift (SQLite)',
    'Supabase',
    'PWA',
  ];

  const techniques = [
    {
      title: t('technique1'),
      description: t('technique1Desc'),
      icon: '🔵',
    },
    {
      title: t('technique2'),
      description: t('technique2Desc'),
      icon: '🟠',
    },
  ];

  const volumeMetrics = [
    {
      label: t('volumeMetric1'),
      description: t('volumeMetric1Desc'),
      color: 'from-gray-500 to-gray-600',
    },
    {
      label: t('volumeMetric2'),
      description: t('volumeMetric2Desc'),
      color: 'from-yellow-500 to-orange-500',
    },
    {
      label: t('volumeMetric3'),
      description: t('volumeMetric3Desc'),
      color: 'from-orange-500 to-red-500',
    },
    {
      label: t('volumeMetric4'),
      description: t('volumeMetric4Desc'),
      color: 'from-red-500 to-pink-600',
    },
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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Neon gradient background - gym/tech theme (cyan/lime/pink) */}
        <div className="absolute inset-0">
          {/* Animated neon orbs */}
          <motion.div
            className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-lime-500/20 via-green-400/10 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.8, 0.6, 0.8],
              x: [0, -40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.7, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32 z-30 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/40 backdrop-blur-sm mb-8 shadow-lg shadow-cyan-500/20"
          >
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-cyan-300 tracking-wider">{t('badge')}</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-7xl lg:text-9xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-lime-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
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
            {/* Primary CTA - Try Gainz */}
            <motion.a
              href="https://gainzw.app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(34,211,238,0.8)" }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl md:text-3xl font-black text-cyan-400 hover:text-lime-400 transition-all duration-300 inline-flex items-center gap-3 group"
            >
              {t('cta1')}
              <motion.span
                className="group-hover:translate-x-2 transition-transform"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>

            {/* Secondary CTA - Learn More */}
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-gray-400 hover:text-cyan-300 transition-colors font-medium flex items-center gap-2"
            >
              {t('cta2')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
              { value: t('stat1'), label: t('stat1Label'), icon: "🏋️" },
              { value: t('stat2'), label: t('stat2Label'), icon: "💪" },
              { value: t('stat3'), label: t('stat3Label'), icon: "🔬" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 0 30px rgba(34,211,238,0.3)",
                }}
                className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-black/40 to-lime-950/40 backdrop-blur-sm border border-cyan-500/30 hover:border-lime-400/50 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-lime-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="text-4xl mb-2 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{stat.icon}</div>
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-lime-300 bg-clip-text text-transparent mb-1 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, 10, 0],
          }}
          transition={{
            opacity: { delay: 1 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-cyan-300 font-bold tracking-wider">SCROLL</span>
            <motion.svg
              className="w-6 h-6 text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                filter: [
                  "drop-shadow(0 0 10px rgba(163,230,53,0.8))",
                  "drop-shadow(0 0 20px rgba(34,211,238,0.8))",
                  "drop-shadow(0 0 10px rgba(163,230,53,0.8))",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </div>
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white">{t('problemTitle')}</h2>
              <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                <p>{t('problemP1')}</p>
                <p>{t('problemP2')}</p>
                <p>{t('problemP3')}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-pink-500/20 border border-pink-500/10"
            >
              <Image
                src="/images/projects/fit-stripping.png"
                alt="The Problem"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-lime-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-500/10 order-2 lg:order-1"
            >
              <Image
                src="/images/projects/fit-hero.png"
                alt="The Solution"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white">{t('solutionTitle')}</h2>
              <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
                <p>{t('solutionP1')}</p>
                <p>{t('solutionP2')}</p>
                <p>{t('solutionP3')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 overflow-hidden bg-black">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-lime-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-pink-500/5 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-cyan-400 font-black text-sm uppercase tracking-[0.3em] mb-4 block">{t('featuresTitle')}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t('featuresSubtitle')}
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-lime-400 to-pink-400 bg-clip-text text-transparent">{t('featuresSubtitle2')}</span>
            </h2>
          </motion.div>

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
                <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-black/40 to-lime-950/20 backdrop-blur-md border border-cyan-500/20 hover:border-lime-400/40 transition-all duration-500 overflow-hidden group/card">
                  {/* Animated neon glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-lime-500/0 to-pink-500/0 group-hover/card:from-cyan-500/5 group-hover/card:via-lime-500/5 group-hover/card:to-pink-500/5 transition-all duration-500" />

                  {/* Neon border pulse effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-pulse" />
                  </div>

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-lime-500/30 flex items-center justify-center mb-6 group-hover/card:shadow-2xl group-hover/card:shadow-cyan-500/40 transition-all duration-300 border border-cyan-400/20"
                    >
                      <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">{['💪', '🧠', '⚡', '📊'][index]}</span>
                    </motion.div>

                    <h3 className="text-2xl font-black mb-3 text-white group-hover/card:text-cyan-300 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-lg text-gray-400 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="flex items-center gap-2 text-lime-400 font-bold"
                    >
                      <span className="text-sm uppercase tracking-wider">Explore</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Number indicator with neon effect */}
                  <div className="absolute top-4 right-4 text-7xl font-black text-cyan-500/5 group-hover/card:text-lime-400/10 transition-colors duration-500">
                    0{index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Techniques */}
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-pink-400 font-black text-sm uppercase tracking-[0.3em] mb-4 block">
              {t('techniqueTitle')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
                {t('techniqueSubtitle')}
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              {t('techniqueDesc')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {techniques.map((technique, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group/tech"
              >
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-pink-950/20 via-black/40 to-cyan-950/20 backdrop-blur-sm border border-pink-500/20 group-hover/tech:border-cyan-400/40 transition-all duration-500 overflow-hidden">
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-cyan-500/0 to-lime-500/0 group-hover/tech:from-pink-500/5 group-hover/tech:via-cyan-500/5 group-hover/tech:to-lime-500/5 transition-all duration-500" />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl mb-4 filter drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]"
                    >
                      {technique.icon}
                    </motion.div>
                    <h3 className="text-2xl font-black mb-3 text-white group-hover/tech:text-pink-300 transition-colors duration-300">{technique.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{technique.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Double Dip Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative max-w-3xl mx-auto mt-16"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-cyan-500/20 to-lime-500/30 blur-3xl scale-90" />
            <div className="relative">
              <Image
                src="/images/projects/fit-doubledip.png"
                alt="Double Dip Feature"
                width={800}
                height={1600}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Volume Landmarks */}
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/10 via-lime-500/10 to-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-black text-sm uppercase tracking-[0.3em] mb-4 block">{t('volumeTitle')}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-lime-400 to-pink-400 bg-clip-text text-transparent">{t('volumeSubtitle')}</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              {t('volumeDesc')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {volumeMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="relative group/metric"
              >
                <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-black/40 to-lime-950/30 backdrop-blur-sm border border-cyan-500/20 group-hover/metric:border-lime-400/40 transition-all duration-300 overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-lime-500/0 to-pink-500/0 group-hover/metric:from-cyan-500/5 group-hover/metric:via-lime-500/5 group-hover/metric:to-pink-500/5 transition-all duration-300" />

                  <div className="relative z-10">
                    <div className={`text-3xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]`}>
                      {metric.label}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{metric.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-lime-500/10 via-cyan-500/10 to-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-lime-400 font-black text-sm uppercase tracking-[0.3em] mb-4 block">{t('techTitle')}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t('techSubtitle')}
              <br />
              <span className="bg-gradient-to-r from-lime-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">{t('techSubtitle2')}</span>
            </h2>
          </motion.div>

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
                <div className="px-8 py-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-black/40 to-lime-950/40 backdrop-blur-sm border border-lime-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                  <span className="text-lime-400 font-bold text-lg group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_10px_rgba(163,230,53,0.3)]">
                    {tech}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-500/0 to-cyan-500/0 group-hover:from-lime-500/10 group-hover:to-cyan-500/10 blur-xl transition-all duration-300 -z-10" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-black/40 to-lime-950/30 backdrop-blur-sm border border-cyan-500/20 hover:border-lime-400/40 transition-all duration-500 overflow-hidden group">
              {/* Animated glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-lime-500/0 to-pink-500/0 group-hover:from-cyan-500/5 group-hover:via-lime-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500/30 to-cyan-500/30 flex items-center justify-center border border-lime-400/20">
                    <span className="text-2xl filter drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]">⚡</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{t('whyStackTitle')}</h3>
                </div>

                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  {t('whyStackDesc')}
                </p>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent mb-1 drop-shadow-[0_0_20px_rgba(163,230,53,0.3)]">{'< 1s'}</div>
                    <div className="text-sm text-gray-500 font-medium">{t('loadTime')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent mb-1 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">100%</div>
                    <div className="text-sm text-gray-500 font-medium">{t('uptime')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-lime-400 to-pink-400 bg-clip-text text-transparent mb-1 drop-shadow-[0_0_20px_rgba(163,230,53,0.3)]">All</div>
                    <div className="text-sm text-gray-500 font-medium">{t('network')}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden bg-black">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 8,
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/40 backdrop-blur-sm mb-8 shadow-lg shadow-cyan-500/20"
            >
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-cyan-300 tracking-wider">{t('ctaBadge')}</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              {t('ctaTitle')}
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-lime-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                {t('ctaTitle2')}
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('ctaDesc')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="https://gainzw.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-lime-500 text-black font-black text-lg shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-lime-500/40 transition-all duration-300"
                >
                  <span>{t('ctaButton1')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  onClick={() => sessionStorage.setItem('pageTransition', 'overlay')}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full border-2 border-cyan-500/30 text-white font-bold text-lg hover:bg-cyan-500/10 hover:border-lime-400/40 backdrop-blur-sm transition-all duration-300"
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
