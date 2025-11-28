'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n-context';
import LanguageSwitcher from './LanguageSwitcher';
import type { WizardData, PaymentModel } from './ProjectWizard';

interface ProjectEstimateProps {
  data: WizardData;
  onReset?: () => void;
}

// Pricing calculation logic
export function calculateEstimate(data: WizardData) {
  const BASE_COST = 15000;

  // Feature costs
  const featureCosts: Record<string, number> = {
    auth: 3000,
    payments: 5000,
    upload: 2000,
    dashboard: 4000,
    notifications: 3000,
    calendar: 3000,
    chat: 4000,
    gamification: 5000,
    api: 3000,
    ai: 8000,
    i18n: 2000,
    native: 10000,
  };

  const featureTotal = data.features.reduce((sum, featureId) => {
    return sum + (featureCosts[featureId] || 0);
  }, 0);

  const subtotal = BASE_COST + featureTotal;

  // Timeline multiplier
  const timelineMultipliers: Record<string, number> = {
    urgent: 1.3,
    soon: 1.1,
    planned: 1.0,
    flexible: 0.95,
  };
  const timelineMultiplier = data.timeline ? timelineMultipliers[data.timeline] : 1.0;

  // Project type multiplier
  const projectTypeMultipliers: Record<string, number> = {
    mvp: 1.0,
    mobile: 1.2,
    web: 1.0,
    feature: 0.8,
    unsure: 1.0,
  };
  const projectTypeMultiplier = data.projectType
    ? projectTypeMultipliers[data.projectType]
    : 1.0;

  const estimatedCost = subtotal * timelineMultiplier * projectTypeMultiplier;
  const minEstimate = Math.round(estimatedCost);
  const maxEstimate = Math.round(estimatedCost * 1.3);

  return {
    minEstimate,
    maxEstimate,
    breakdown: {
      base: BASE_COST,
      features: featureTotal,
      timelineMultiplier,
      projectTypeMultiplier,
    },
  };
}

// These helper functions will be called from within the component where we have access to translations

// Feature labels
const featureLabels: Record<string, { label: string; icon: string }> = {
  auth: { label: 'User Login/Signup', icon: '🔐' },
  payments: { label: 'Accept Payments', icon: '💳' },
  upload: { label: 'Photo/File Upload', icon: '📸' },
  dashboard: { label: 'Admin Dashboard', icon: '📊' },
  notifications: { label: 'Push Notifications', icon: '🔔' },
  search: { label: 'Search & Filters', icon: '🔍' },
  chat: { label: 'In-App Messaging', icon: '💬' },
  social: { label: 'Social Features', icon: '👥' },
  maps: { label: 'Maps & Location', icon: '🗺️' },
  ai: { label: 'AI/Smart Features', icon: '🤖' },
  analytics: { label: 'Analytics & Reports', icon: '📈' },
  native: { label: 'iOS/Android App', icon: '📱' },
};

export default function ProjectEstimate({ data, onReset }: ProjectEstimateProps) {
  const t = useTranslations('estimate');
  const tWizard = useTranslations('wizard');
  const estimate = calculateEstimate(data);
  const [paymentModel, setPaymentModel] = useState<PaymentModel | null>(data.paymentModel || null);

  // Timeline labels from translations
  const getTimelineLabel = (timeline: string) => {
    const map: Record<string, string> = {
      urgent: t('timelineUrgent'),
      soon: t('timelineSoon'),
      planned: t('timelinePlanned'),
      flexible: t('timelineFlexible'),
    };
    return map[timeline] || t('notSpecified');
  };

  // Project type labels from translations
  const getProjectTypeLabel = (projectType: string) => {
    const map: Record<string, string> = {
      mvp: t('projectTypeMvp'),
      mobile: t('projectTypeMobile'),
      web: t('projectTypeWeb'),
      feature: t('projectTypeFeature'),
      unsure: t('projectTypeUnsure'),
    };
    return map[projectType] || t('notSpecified');
  };

  const getPaymentModelLabel = (paymentModel: string) => {
    const map: Record<string, string> = {
      committed: t('paymentModelCommitted'),
      subscription: t('paymentModelSubscription'),
    };
    return map[paymentModel] || t('notSpecified');
  };

  // Generate WhatsApp message with project details
  const generateWhatsAppMessage = () => {
    const featuresText = data.features
      .map((featureId) => {
        const feature = featureLabels[featureId];
        return `- ${feature?.label || featureId}`;
      })
      .join('\n');

    // Nota sobre suscripción dependiendo del modelo elegido
    let paymentModelInfo = '';
    if (paymentModel === 'committed') {
      paymentModelInfo = `\n\n*Nota:* El pago comprometido se divide en cuotas mensuales durante el desarrollo. Despues de la entrega, el mantenimiento y monitoreo pasan a ser responsabilidad del cliente.`;
    } else if (paymentModel === 'subscription') {
      paymentModelInfo = `\n\n*Nota sobre suscripcion:* Incluye monitoreo y mantenimiento 24/7 del sistema. Durante Noviembre - Requests ilimitados. Despues transicionara a sistema basado en tokens donde cada request consume creditos segun complejidad.`;
    }

    const message = `*ESTIMACION DE PROYECTO*

*Tipo:* ${data.projectType ? getProjectTypeLabel(data.projectType) : t('notSpecified')}
*Timeline:* ${data.timeline ? getTimelineLabel(data.timeline) : t('notSpecified')}
*Modelo de pago:* ${paymentModel ? getPaymentModelLabel(paymentModel) : 'Por definir'}

*Problema a resolver:*
${data.problem || 'No especificado'}

*Usuario objetivo:*
${data.targetUser || 'No especificado'}

*Features seleccionadas (${data.features.length}):*
${featuresText}

*Estimacion:*
$${estimate.minEstimate.toLocaleString()} - $${estimate.maxEstimate.toLocaleString()} MXN

*Equivalente en suscripcion:*
${Math.ceil(estimate.minEstimate / 10000)} - ${Math.ceil(estimate.maxEstimate / 10000)} meses a $10,000 MXN/mes${paymentModelInfo}

---
Hablamos del proyecto?`;

    return encodeURIComponent(message);
  };

  const whatsappLink = `https://wa.me/5219993155345?text=${generateWhatsAppMessage()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-20 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Language Switcher */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-end mb-8"
        >
          <LanguageSwitcher />
        </motion.div>

        {/* Confetti effect */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-7xl">🎯</div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-text-secondary">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Main Estimate Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-8 rounded-3xl bg-surface border-2 border-surface"
        >
          {/* Project Type & Timeline */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-text-muted mb-1">{t('projectType')}</p>
              <p className="text-xl font-bold text-text-primary">
                {data.projectType ? getProjectTypeLabel(data.projectType) : t('notSpecified')}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">{t('timeline')}</p>
              <p className="text-xl font-bold text-text-primary">
                {data.timeline ? getTimelineLabel(data.timeline) : t('notSpecified')}
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="mb-8">
            <p className="text-sm text-text-muted mb-3">{t('selectedFeatures')} ({data.features.length})</p>
            <div className="flex flex-wrap gap-2">
              {data.features.map((featureId) => {
                const feature = featureLabels[featureId];
                return (
                  <span
                    key={featureId}
                    className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-sm font-medium text-emerald-400 flex items-center gap-2"
                  >
                    <span>{feature?.icon}</span>
                    <span>{feature?.label || featureId}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Price Estimate */}
          <div className="pt-8 border-t border-surface">
            <p className="text-sm text-text-muted mb-2">{t('estimatedCost')}</p>
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent mb-2"
            >
              ${estimate.minEstimate.toLocaleString()} - ${estimate.maxEstimate.toLocaleString()}
            </motion.p>
            <p className="text-text-muted mb-4">{t('currency')}</p>

            {/* Credits-based subscription breakdown */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-400 font-semibold mb-2">{t('subscriptionModel')}</p>
              <p className="text-text-secondary text-sm">
                {t('subscriptionDesc')} <strong className="text-blue-400">{Math.ceil(estimate.minEstimate / 10000)} - {Math.ceil(estimate.maxEstimate / 10000)} {t('subscriptionDesc2')}</strong> {t('subscriptionDesc3')}
              </p>
              <p className="text-text-muted text-xs mt-3 pt-3 border-t border-blue-500/10">
                {t('subscriptionNote')}
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="mt-8 pt-8 border-t border-surface">
            <p className="font-bold text-text-primary mb-4">{t('whatsIncluded')}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                t('includedItem1'),
                t('includedItem2'),
                t('includedItem3'),
                t('includedItem4'),
                t('includedItem5'),
                t('includedItem6'),
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center gap-2 text-text-secondary"
                >
                  <span className="text-emerald-400">✓</span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Subscription Model Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8 p-8 rounded-3xl bg-surface border-2 border-surface"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t('subscriptionTitle')}
              </h3>
              <p className="text-text-secondary">
                {t('subscriptionSubtitle')}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface/20 border border-surface mb-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold text-blue-400">$10,000</span>
              <span className="text-text-muted">{t('perMonth')}</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: '🔍', text: t('subscriptionFeature0') },
                { icon: '💳', text: t('subscriptionFeature1') },
                { icon: '⚡', text: t('subscriptionFeature2') },
                { icon: '🔥', text: t('subscriptionFeature3') },
                { icon: '🚨', text: t('subscriptionFeature4') },
                { icon: '🎯', text: t('subscriptionFeature5') },
                { icon: '💬', text: t('subscriptionFeature6') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-text-secondary">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400 mb-2">
              <strong>{t('howItWorks')}</strong> {t('howItWorksDesc')}
            </p>
            <p className="text-sm text-blue-300">
              <strong>{t('example')}</strong> {t('exampleDesc')}
            </p>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-12 p-8 rounded-3xl bg-surface border-2 border-surface"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            {t('comparisonTitle')}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-text-muted mb-2">{t('comparisonCost')}</p>
              <p className="text-2xl font-bold text-emerald-400">
                ${estimate.maxEstimate.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted mt-1">{t('comparisonCostVs')}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-2">{t('comparisonTimeline')}</p>
              <p className="text-2xl font-bold text-emerald-400">
                {data.timeline ? getTimelineLabel(data.timeline) : t('timelineSoon')}
              </p>
              <p className="text-xs text-text-muted mt-1">{t('comparisonTimelineVs')}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-2">{t('comparisonQuality')}</p>
              <p className="text-2xl font-bold text-emerald-400">{t('comparisonQualityValue')}</p>
              <p className="text-xs text-text-muted mt-1">{t('comparisonQualityVs')}</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Model Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-text-primary text-center mb-2">
            {tWizard('step7Title')}
          </h3>
          <p className="text-text-secondary text-center mb-8">
            {tWizard('step7Subtitle')}
          </p>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Committed Payment Option */}
            <motion.button
              onClick={() => setPaymentModel('committed')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                paymentModel === 'committed'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-surface border-surface hover:border-emerald-500/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl mb-3">💳</div>
              <h4 className="text-xl font-bold text-text-primary mb-2">
                {tWizard('step7Committed')}
              </h4>
              <p className="text-text-secondary mb-4">
                {tWizard('step7CommittedDesc')}
              </p>
              <div className="p-3 rounded-lg bg-background/50 border border-surface">
                <p className="text-sm text-text-secondary">
                  {tWizard('step7CommittedInsight')}
                </p>
              </div>
            </motion.button>

            {/* Flexible Subscription Option */}
            <motion.button
              onClick={() => setPaymentModel('subscription')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                paymentModel === 'subscription'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-surface border-surface hover:border-emerald-500/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl mb-3">🔄</div>
              <h4 className="text-xl font-bold text-text-primary mb-2">
                {tWizard('step7Subscription')}
              </h4>
              <p className="text-text-secondary mb-4">
                {tWizard('step7SubscriptionDesc')}
              </p>
              <div className="p-3 rounded-lg bg-background/50 border border-surface">
                <p className="text-sm text-text-secondary">
                  {tWizard('step7SubscriptionInsight')}
                </p>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col gap-4"
        >
          {/* Mensaje de advertencia si no seleccionó payment model */}
          {!paymentModel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <p className="text-amber-500 font-medium">
                ⚠️ Por favor selecciona un modelo de pago arriba para continuar
              </p>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {paymentModel ? (
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  {t('emailCTA')}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </motion.a>
            ) : (
              <motion.button
                disabled
                className="px-10 py-5 rounded-full bg-gray-400 text-gray-600 font-bold text-lg cursor-not-allowed opacity-50 text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  {t('emailCTA')}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </motion.button>
            )}

            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 rounded-full border-2 border-emerald-500/30 text-text-primary font-bold text-lg hover:bg-emerald-500/10 backdrop-blur-sm transition-all duration-300"
            >
              {t('startOver')}
            </motion.button>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-full border-2 border-surface text-text-secondary font-bold text-lg hover:text-text-primary hover:border-emerald-500/30 transition-all duration-300"
              >
                {t('backToHome')}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Fine Print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center text-sm text-text-muted mt-12"
        >
          {t('disclaimer')}
        </motion.p>
      </div>
    </motion.div>
  );
}
