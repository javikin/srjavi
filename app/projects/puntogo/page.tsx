'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function PuntoGoPage() {
  const heroRef = useRef<HTMLElement>(null);

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

  return (
    <main className="relative bg-background text-text-primary">
      {/* Back to home */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-text-primary/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background with orange/fire theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-orange-950/20 to-background" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '-2s' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30"
            >
              <span className="text-sm font-medium text-orange-400">Loyalty & Gamification</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              PuntoGo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent"
            >
              Loyalty meets gamification.
              <br />
              Every peso becomes a reward.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-text-secondary leading-relaxed"
            >
              Sistema de recompensas inteligente que convierte cada visita en una experiencia
              de juego, multiplicando el valor de tu lealtad hasta 10X.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 pt-4"
            >
              {[
                { value: '1:1', label: '1 Punto = $1 MXN' },
                { value: '10X', label: 'Max Multiplier' },
                { value: '30 days', label: 'Development' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-sm text-text-secondary">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-8"
            >
              {/* Primary CTA - View Project */}
              <a
                href="#features"
                className="text-2xl md:text-3xl font-bold text-text-primary hover:text-orange-400 transition-colors inline-flex items-center gap-2 group"
              >
                Explore Features
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              {/* Secondary link - Tech Stack */}
              <a
                href="#tech"
                className="text-text-secondary hover:text-text-primary transition-colors font-medium"
              >
                Tech Stack
              </a>
            </motion.div>
          </div>

          {/* Mockup placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto aspect-[9/19] rounded-[3rem] bg-gradient-to-br from-surface to-surface-light p-4 border border-text-primary/10 shadow-2xl">
              {/* Phone mockup */}
              <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-orange-500/20 via-background to-blue-500/20 flex items-center justify-center overflow-hidden relative">
                {/* Simulated UI */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-white mb-2">2,500</div>
                    <div className="text-sm text-white/60">puntos</div>
                  </div>
                  <div className="flex-1 bg-orange-500/10 rounded-2xl border border-orange-500/30 flex items-center justify-center">
                    <div className="text-6xl">🎰</div>
                  </div>
                  <div className="mt-auto text-center text-white/40 text-xs">PuntoGo Dashboard</div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-[3rem] blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-text-primary">The Problem</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="space-y-4 text-lg text-text-secondary">
                <p>Traditional loyalty programs are boring and forgettable.</p>
                <p>Customers collect points slowly, rewards feel distant, and daily engagement is zero.</p>
                <p>Result? Low retention and missed revenue opportunities.</p>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-text-primary">The Solution</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500" />
              <div className="space-y-4 text-lg text-text-secondary">
                <p>PuntoGo gamifies loyalty with daily engagement mechanics.</p>
                <p>Spin the wheel every 24h for 2X-10X multipliers. Turn a $100 meal into 1,000 points.</p>
                <p>Result? Customers come back daily, spend more, and love the experience.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-surface/50" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-text-primary mb-20 text-center"
          >
            Core Features
          </motion.h2>

          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '💰',
                title: 'Smart Points System',
                desc: '1 punto = $1 MXN. Direct redemption at checkout. Simple, transparent, valuable.',
                color: 'from-green-500 to-emerald-600',
              },
              {
                icon: '🎰',
                title: 'Daily Drops',
                desc: 'Spin the wheel every 24h. Win 2X, 3X, 5X, or legendary 10X multipliers.',
                color: 'from-orange-500 to-red-600',
              },
              {
                icon: '🔥',
                title: 'Temporary Multipliers',
                desc: 'Activate your multiplier and watch your points explode. Limited time = urgency.',
                color: 'from-red-500 to-pink-600',
              },
              {
                icon: '🍽️',
                title: 'Integrated Menu',
                desc: 'Real-time menu with Polo Tab API. Browse, order, and earn points seamlessly.',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: '📸',
                title: 'OCR Ticket Scan',
                desc: 'Upload receipt photo. Google Vision OCR extracts totals. Auto-awards points.',
                color: 'from-purple-500 to-indigo-600',
              },
              {
                icon: '⚙️',
                title: 'Admin Dashboard',
                desc: '6 modules: QR scanner, menu management, points control, analytics, and more.',
                color: 'from-slate-500 to-zinc-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card relative p-8 rounded-3xl bg-surface border border-text-primary/10 hover:border-orange-500/50 transition-all duration-300 group"
                whileHover={{ y: -10 }}
              >
                <div className={`text-6xl mb-6`}>{feature.icon}</div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>

                {/* Gradient accent on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Showcase */}
      <section className="relative py-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-text-primary mb-20 text-center"
          >
            In Action
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 mb-32">
            {[
              { src: '/images/projects/puntogo-menu.png', alt: 'Menu Integration', label: 'Real-time Menu' },
              { src: '/images/projects/puntogo-cart.png', alt: 'Cart with Multipliers', label: 'Smart Cart' },
            ].map((screenshot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative rounded-3xl overflow-hidden border border-text-primary/10 hover:border-orange-500/50 transition-all duration-500">
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span className="text-text-primary font-medium">{screenshot.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-32 overflow-hidden bg-surface/50">
        <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-text-primary mb-20 text-center"
          >
            How It Works
          </motion.h2>

          <div className="space-y-16">
            {[
              {
                step: '01',
                title: 'Customer Visits & Orders',
                desc: 'Browse menu, order food, pay at checkout. Every peso = 1 point automatically.',
              },
              {
                step: '02',
                title: 'Daily Engagement',
                desc: 'Open app, spin Daily Drop wheel. Win multipliers: 2X (common), 5X (rare), 10X (legendary).',
              },
              {
                step: '03',
                title: 'Activate & Multiply',
                desc: 'Multiplier active for 24h. Next purchase: $500 × 5X = 2,500 points. Magic.',
              },
              {
                step: '04',
                title: 'Redeem Rewards',
                desc: 'Points = money. Redeem at checkout. 1,000 points = $1,000 MXN off. Simple.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-8 items-start"
              >
                <div className="text-6xl font-bold text-orange-500/20">{item.step}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-3">{item.title}</h3>
                  <p className="text-lg text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="relative py-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-text-primary mb-20 text-center"
          >
            Built With
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Flutter 3.29', purpose: 'Cross-platform (iOS, Android, Web)' },
              { name: 'Supabase', purpose: 'PostgreSQL + Realtime + Auth' },
              { name: 'Polo Tab API', purpose: 'Menu & orders integration' },
              { name: 'Google Cloud Vision', purpose: 'OCR ticket processing' },
              { name: 'FCM', purpose: 'Push notifications' },
              { name: 'Clean Architecture', purpose: '100% of new features' },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-surface border border-text-primary/10 hover:border-primary/50 transition-all"
              >
                <div className="font-bold text-text-primary mb-2">{tech.name}</div>
                <div className="text-sm text-text-secondary">{tech.purpose}</div>
              </motion.div>
            ))}
          </div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20"
          >
            <h3 className="text-2xl font-bold text-text-primary mb-6">Technical Highlights</h3>
            <div className="grid md:grid-cols-2 gap-6 text-text-secondary">
              <div className="flex items-start gap-3">
                <span className="text-orange-500">✓</span>
                <span>15 database migrations with optimizations</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500">✓</span>
                <span>9 performance indexes in PostgreSQL</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500">✓</span>
                <span>Row Level Security on all tables</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500">✓</span>
                <span>Real-time subscriptions with Supabase</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500">✓</span>
                <span>Multi-tenant ready architecture</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500">✓</span>
                <span>CI/CD with Fastlane configured</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="relative py-32 overflow-hidden bg-surface/50">
        <div className="relative max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-text-primary mb-12"
          >
            Built in 30 Days
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl text-text-secondary mb-16 leading-relaxed"
          >
            From concept to beta with real users. Complete gamification system, admin dashboard,
            and production-ready infrastructure.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: 'Core Features', value: '85%', color: 'text-green-400' },
              { label: 'Admin System', value: '74%', color: 'text-blue-400' },
              { label: 'Production Ready', value: '100%', color: 'text-orange-400' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-surface border border-text-primary/10"
              >
                <div className={`text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-surface" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-8"
          >
            Want a loyalty system like this?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-text-secondary mb-12"
          >
            Custom gamification, mobile apps, and admin tools in weeks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/#contact"
              className="text-2xl md:text-3xl font-bold text-text-primary hover:text-orange-400 transition-colors inline-flex items-center gap-2 group"
            >
              Let&apos;s Build Yours
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
