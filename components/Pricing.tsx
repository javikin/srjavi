'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from '@/lib/i18n-context';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const t = useTranslations('pricing');
  const tPhilosophy = useTranslations('philosophy');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pricing-card',
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.pricing-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const priorityTiers = [
    {
      time: '48h',
      label: t('standard'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/5',
      borderColor: 'border-blue-500/20',
    },
    {
      time: '24h',
      label: t('priority'),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/5',
      borderColor: 'border-purple-500/20',
    },
    {
      time: '12h',
      label: t('express'),
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/5',
      borderColor: 'border-orange-500/20',
    },
    {
      time: 'Urgent',
      label: t('urgent'),
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-500/5',
      borderColor: 'border-red-500/20',
    },
  ];

  const lifecycleSteps = [
    {
      number: '01',
      title: t('buildTitle'),
      desc: t('buildDesc'),
      color: 'from-emerald-400 to-teal-400',
      bgColor: 'bg-emerald-500/5',
      borderColor: 'border-emerald-500/20',
    },
    {
      number: '02',
      title: t('launchTitle'),
      desc: t('launchDesc'),
      color: 'from-sky-400 to-blue-400',
      bgColor: 'bg-sky-500/5',
      borderColor: 'border-sky-500/20',
    },
    {
      number: '03',
      title: t('growTitle'),
      desc: t('growDesc'),
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-500/5',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-surface/30 to-background"
    >
      {/* Background effects */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '-2s' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Philosophy Introduction - Minimal Letter Style */}
        <div className="min-h-screen flex items-center py-20 mb-32">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-12 leading-tight"
            >
              {tPhilosophy('title')}
            </motion.h2>

            <div className="space-y-8 text-xl md:text-2xl text-text-secondary leading-relaxed font-light">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {tPhilosophy('p1')}
                <br />
                {tPhilosophy('p2')}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {tPhilosophy('p3_1')} <span className="text-text-primary font-normal">+$100K</span> {tPhilosophy('p3_2')}{' '}
                <span className="text-text-primary font-normal">6 {tPhilosophy('p3_2') === 'and take' ? 'months' : 'meses'}</span>, {tPhilosophy('p3_3')}{' '}
                <span className="text-text-primary font-normal">
                  2 {tPhilosophy('p3_3').includes('ship') ? 'weeks' : 'semanas'}
                </span> {tPhilosophy('p3_4')}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* How It Works - Lifecycle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {t('howItWorksTitle')}
          </h3>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-24">
          <div className="grid md:grid-cols-3 gap-0">
            {lifecycleSteps.map((step, index) => (
              <div key={index} className="flex items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`flex-1 p-6 rounded-2xl ${step.bgColor} border ${step.borderColor}`}
                >
                  <div className={`text-4xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-3`}>
                    {step.number}
                  </div>
                  <h4 className="text-lg font-bold text-text-primary mb-2 uppercase tracking-wider">
                    {step.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
                {index < lifecycleSteps.length - 1 && (
                  <div className="hidden md:flex items-center px-2 text-text-muted">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards - 2 tiers */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="pricing-grid grid md:grid-cols-2 gap-6">
            {/* Esencial */}
            <motion.div
              className="pricing-card relative p-8 rounded-3xl bg-surface border border-white/10"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-1">{t('esencial')}</h3>
                <div className="flex items-baseline gap-2 mt-4 mb-1">
                  <span className="text-4xl font-bold text-text-primary">$10,000</span>
                  <span className="text-text-secondary text-sm">MXN + IVA</span>
                </div>
                <p className="text-text-muted text-sm">{t('perMonth')}</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{t('esencialCredits')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{t('esencialResponse')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{t('esencialConcurrent')}</span>
                </li>
              </ul>
            </motion.div>

            {/* Crecimiento - highlighted */}
            <motion.div
              className="pricing-card relative p-8 rounded-3xl bg-surface border border-emerald-500/40"
            >
              <div className="absolute top-4 right-4">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium">
                  {t('recommended')}
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
                  {t('crecimiento')}
                </h3>
                <div className="flex items-baseline gap-2 mt-4 mb-1">
                  <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">$16,000</span>
                  <span className="text-text-secondary text-sm">MXN + IVA</span>
                </div>
                <p className="text-text-muted text-sm">{t('perMonth')}</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{t('crecimientoCredits')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{t('crecimientoResponse')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{t('crecimientoConcurrent')}</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-text-muted mt-6"
          >
            {t('pauseCancel')}
          </motion.p>
        </div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto mb-24"
        >
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { title: t('feature1'), desc: t('feature1Desc') },
              { title: t('feature2'), desc: t('feature2Desc') },
              { title: t('feature3'), desc: t('feature3Desc') },
              { title: t('feature4'), desc: t('feature4Desc') },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Priority Tiers - Simplified */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {t('priorityTitle')}
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-2">
              {t('priorityDesc')}
            </p>
            <p className="text-sm text-text-muted">
              {t('priorityNote')}
            </p>
          </motion.div>

          <div className="pricing-grid grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {priorityTiers.map((tier, index) => (
              <motion.div
                key={index}
                className={`pricing-card relative p-6 rounded-2xl ${tier.bgColor} border ${tier.borderColor}`}
              >
                <div className="text-center">
                  <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                    {tier.time}
                  </div>
                  <div className="text-sm text-text-secondary">{tier.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What You Get */}
        <div className="max-w-4xl mx-auto mt-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-12"
          >
            {tPhilosophy('whatYouGet')}
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: tPhilosophy('deliverable1'), purpose: tPhilosophy('deliverable1Desc') },
              { name: tPhilosophy('deliverable2'), purpose: tPhilosophy('deliverable2Desc') },
              { name: tPhilosophy('deliverable3'), purpose: tPhilosophy('deliverable3Desc') },
              { name: tPhilosophy('deliverable4'), purpose: tPhilosophy('deliverable4Desc') },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-2 flex-shrink-0" />
                <div>
                  <div className="font-bold text-text-primary mb-1">{item.name}</div>
                  <div className="text-text-secondary text-sm">{item.purpose}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
