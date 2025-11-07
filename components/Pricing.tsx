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
          <p className="text-sm text-text-muted max-w-2xl mx-auto mt-4">
            {t('promoNote')}
          </p>
        </motion.div>

        {/* Compact Pricing Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto mb-24 text-center"
        >
          {/* Price */}
          <div className="mb-12">
            <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <span className="text-sm font-medium text-emerald-400">✨ {t('launchOffer')}</span>
            </div>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                $10K
              </span>
              <span className="text-2xl text-text-secondary">MXN + IVA</span>
            </div>
            <p className="text-text-secondary">{t('perMonth')} · {t('pauseCancel')}</p>
          </div>

          {/* Key Features - Compact Grid */}
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { icon: '🚀', title: t('feature1'), desc: t('feature1Desc') },
              { icon: '⚡', title: t('feature2'), desc: t('feature2Desc') },
              { icon: '🎯', title: t('feature3'), desc: t('feature3Desc') },
              { icon: '💎', title: t('feature4'), desc: t('feature4Desc') },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    {feature.title}
                    {index === 0 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-normal">
                        Promo
                      </span>
                    )}
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
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {t('priorityTitle')}
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t('priorityDesc')}
            </p>
          </motion.div>

          <div className="pricing-grid grid grid-cols-2 md:grid-cols-4 gap-4">
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
