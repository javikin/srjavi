'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useI18n } from '@/lib/i18n-context';
import ProjectEstimate from './ProjectEstimate';
import { useGeminiProblemHelper, useGeminiUserHelper } from '@/hooks/useGemini';
import LanguageSwitcher from './LanguageSwitcher';

// Types
export type ProjectType = 'mvp' | 'mobile' | 'web' | 'feature' | 'unsure';
export type Timeline = 'urgent' | 'soon' | 'planned' | 'flexible';
export type BudgetRange = 'small' | 'medium' | 'large' | 'unsure';
export type PaymentModel = 'committed' | 'subscription';

export interface WizardData {
  projectType: ProjectType | null;
  problem: string;
  targetUser: string;
  features: string[];
  timeline: Timeline | null;
  budget: BudgetRange | null;
  paymentModel: PaymentModel | null;
}

interface ProjectWizardProps {
  onComplete?: (data: WizardData) => void;
}

const TOTAL_STEPS = 6;

export default function ProjectWizard({ onComplete }: ProjectWizardProps) {
  const t = useTranslations('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [showEstimate, setShowEstimate] = useState(false);
  const [data, setData] = useState<WizardData>({
    projectType: null,
    problem: '',
    targetUser: '',
    features: [],
    timeline: null,
    budget: null,
    paymentModel: null,
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateData = (field: keyof WizardData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Show estimate screen
      setShowEstimate(true);
      if (onComplete) {
        onComplete(data);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setShowEstimate(false);
    setData({
      projectType: null,
      problem: '',
      targetUser: '',
      features: [],
      timeline: null,
      budget: null,
    });
  };

  // Show estimate if completed
  if (showEstimate) {
    return <ProjectEstimate data={data} onReset={resetWizard} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar - Full Width Header */}
      <div className="w-full bg-background py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-secondary">
              Step {currentStep} {t('step4Of')} {TOTAL_STEPS}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {Math.round(progress)}%
              </span>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="h-px bg-text-primary/10 overflow-hidden">
            <motion.div
              className="h-full bg-text-primary/30"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Content with aesthetic margins */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-20">
        {/* Steps */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1
              key="step1"
              value={data.projectType}
              onChange={(value) => updateData('projectType', value)}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <Step2
              key="step2"
              value={data.problem}
              projectType={data.projectType}
              targetUser={data.targetUser}
              onChange={(value) => updateData('problem', value)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <Step3
              key="step3"
              value={data.targetUser}
              projectType={data.projectType}
              problem={data.problem}
              onChange={(value) => updateData('targetUser', value)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <Step4
              key="step4"
              value={data.features}
              onChange={(value) => updateData('features', value)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 && (
            <Step5
              key="step5"
              value={data.timeline}
              onChange={(value) => updateData('timeline', value)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 6 && (
            <Step6
              key="step6"
              value={data.budget}
              onChange={(value) => updateData('budget', value)}
              onNext={() => {
                setShowEstimate(true);
                if (onComplete) onComplete(data);
              }}
              onBack={prevStep}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Shared Components
const StepContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className="space-y-8"
  >
    {children}
  </motion.div>
);

const StepHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">{title}</h2>
    <p className="text-lg text-text-secondary">{subtitle}</p>
  </div>
);

const OptionCard = ({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full ${
      selected
        ? 'border-emerald-500 bg-emerald-500/10'
        : 'border-surface hover:border-emerald-500/30 bg-surface/30'
    }`}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary">{description}</p>
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
      >
        <span className="text-white text-sm">✓</span>
      </motion.div>
    )}
  </motion.button>
);

const NextButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
  const t = useTranslations('wizard');
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
        disabled
          ? 'bg-surface/30 text-text-muted cursor-not-allowed'
          : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/20'
      }`}
    >
      {t('continue')}
    </motion.button>
  );
};

const BackButton = ({ onClick }: { onClick: () => void }) => {
  const t = useTranslations('wizard');
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 text-text-secondary hover:text-text-primary transition-colors"
    >
      {t('back')}
    </button>
  );
};

// Step 1: Project Type
function Step1({
  value,
  onChange,
  onNext,
}: {
  value: ProjectType | null;
  onChange: (value: ProjectType) => void;
  onNext: () => void;
}) {
  const t = useTranslations('wizard');
  const options = [
    {
      id: 'mvp' as ProjectType,
      icon: '🚀',
      title: t('step1Mvp'),
      description: t('step1MvpDesc'),
    },
    {
      id: 'mobile' as ProjectType,
      icon: '📱',
      title: t('step1Mobile'),
      description: t('step1MobileDesc'),
    },
    {
      id: 'web' as ProjectType,
      icon: '🌐',
      title: t('step1Web'),
      description: t('step1WebDesc'),
    },
    {
      id: 'feature' as ProjectType,
      icon: '🔄',
      title: t('step1Feature'),
      description: t('step1FeatureDesc'),
    },
    {
      id: 'unsure' as ProjectType,
      icon: '🤔',
      title: t('step1Unsure'),
      description: t('step1UnsureDesc'),
    },
  ];

  const handleSelect = (type: ProjectType) => {
    onChange(type);
    setTimeout(onNext, 300);
  };

  return (
    <StepContainer>
      <StepHeader title={t('step1Title')} subtitle={t('step1Subtitle')} />
      <div className="grid md:grid-cols-2 gap-4">
        {options.map((option) => (
          <OptionCard
            key={option.id}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={value === option.id}
            onClick={() => handleSelect(option.id)}
          />
        ))}
      </div>
    </StepContainer>
  );
}

// Step 2: Problem Statement
function Step2({
  value,
  projectType,
  targetUser,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  projectType: ProjectType | null;
  targetUser: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations('wizard');
  const { locale } = useI18n();
  const [showTip, setShowTip] = useState(false);
  const { improveProblem, loading, error } = useGeminiProblemHelper();

  const handleImproveWithAI = async () => {
    if (value.length < 10) {
      alert('Please write at least a basic idea first (10+ characters)');
      return;
    }

    const improved = await improveProblem(value, locale, {
      projectType: projectType || undefined,
      targetUser: targetUser || undefined,
    });
    if (improved) {
      onChange(improved);
    }
  };

  return (
    <StepContainer>
      <StepHeader
        title={t('step2Title')}
        subtitle={t('step2Subtitle')}
      />
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-3">
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (e.target.value.length > 20 && !showTip) setShowTip(true);
            }}
            placeholder={t('step2Placeholder')}
            className="w-full h-40 px-6 py-4 rounded-2xl bg-surface/30 border-2 border-surface focus:border-emerald-500 text-text-primary placeholder:text-text-muted resize-none transition-colors"
            disabled={loading}
          />
          {value.length >= 10 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleImproveWithAI}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Improving...
                </>
              ) : (
                <>
                  ✨ Improve with AI
                </>
              )}
            </motion.button>
          )}
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <p className="text-sm text-red-400">⚠️ {error}</p>
          </motion.div>
        )}
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
            >
              <p className="text-sm text-emerald-400">
                💡 <strong>Tip:</strong> {t('step2Tip')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <BackButton onClick={onBack} />
        <NextButton onClick={onNext} disabled={value.length < 20} />
      </div>
    </StepContainer>
  );
}

// Step 3: Target User
function Step3({
  value,
  projectType,
  problem,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  projectType: ProjectType | null;
  problem: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations('wizard');
  const { locale } = useI18n();
  const [exampleIndex, setExampleIndex] = useState(0);
  const { improveTargetUser, loading, error } = useGeminiUserHelper();
  const examples = [
    t('step3Example1'),
    t('step3Example2'),
    t('step3Example3'),
    t('step3Example4'),
  ];

  useState(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(interval);
  });

  const handleImproveWithAI = async () => {
    if (value.length < 5) {
      alert('Please write at least a basic idea first (5+ characters)');
      return;
    }

    const improved = await improveTargetUser(value, locale, {
      projectType: projectType || undefined,
      problem: problem || undefined,
    });
    if (improved) {
      onChange(improved);
    }
  };

  return (
    <StepContainer>
      <StepHeader title={t('step3Title')} subtitle={t('step3Subtitle')} />
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={exampleIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-sm text-text-muted"
            >
              Example: &ldquo;{examples[exampleIndex]}&rdquo;
            </motion.p>
          </AnimatePresence>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('step3Placeholder')}
            className="w-full px-6 py-4 rounded-2xl bg-surface/30 border-2 border-surface focus:border-emerald-500 text-text-primary placeholder:text-text-muted transition-colors"
            disabled={loading}
          />
          {value.length >= 5 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleImproveWithAI}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Improving...
                </>
              ) : (
                <>
                  ✨ Improve with AI
                </>
              )}
            </motion.button>
          )}
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <p className="text-sm text-red-400">⚠️ {error}</p>
          </motion.div>
        )}
        {value.length > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
          >
            <p className="text-sm text-blue-400">
              📊 {t('step3Insight')}
            </p>
          </motion.div>
        )}
      </div>
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <BackButton onClick={onBack} />
        <NextButton onClick={onNext} disabled={value.length < 10} />
      </div>
    </StepContainer>
  );
}

// Step 4: Features Selection
function Step4({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations('wizard');
  const MAX_FEATURES = 5;
  const features = [
    { id: 'auth', label: 'User Login/Signup', icon: '🔐', cost: 3000 },
    { id: 'payments', label: 'Accept Payments', icon: '💳', cost: 5000 },
    { id: 'upload', label: 'Photo/File Upload', icon: '📸', cost: 2000 },
    { id: 'dashboard', label: 'Admin Dashboard', icon: '📊', cost: 4000 },
    { id: 'notifications', label: 'Push Notifications', icon: '🔔', cost: 3000 },
    { id: 'search', label: 'Search & Filters', icon: '🔍', cost: 3000 },
    { id: 'chat', label: 'In-App Messaging', icon: '💬', cost: 4000 },
    { id: 'social', label: 'Social Features', icon: '👥', cost: 4000 },
    { id: 'maps', label: 'Maps & Location', icon: '🗺️', cost: 4000 },
    { id: 'ai', label: 'AI/Smart Features', icon: '🤖', cost: 8000 },
    { id: 'analytics', label: 'Analytics & Reports', icon: '📈', cost: 3000 },
    { id: 'native', label: 'iOS/Android App', icon: '📱', cost: 10000 },
  ];

  const toggleFeature = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((f) => f !== id));
    } else if (value.length < MAX_FEATURES) {
      onChange([...value, id]);
    }
  };

  const baseCost = 15000;
  const featuresCost = value.reduce((sum, id) => {
    const feature = features.find((f) => f.id === id);
    return sum + (feature?.cost || 0);
  }, 0);
  const totalCost = baseCost + featuresCost;
  const minEstimate = totalCost;
  const maxEstimate = totalCost * 1.3;

  return (
    <StepContainer>
      <StepHeader title={t('step4Title')} subtitle={t('step4Subtitle')} />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature) => {
            const isSelected = value.includes(feature.id);
            const isDisabled = !isSelected && value.length >= MAX_FEATURES;
            return (
              <motion.button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                disabled={isDisabled}
                whileHover={{ scale: isDisabled ? 1 : 1.03 }}
                whileTap={{ scale: isDisabled ? 1 : 0.97 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : isDisabled
                    ? 'border-surface/30 bg-surface/10 opacity-40 cursor-not-allowed'
                    : 'border-surface bg-surface/30 hover:border-emerald-500/30'
                }`}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="text-sm font-medium text-text-primary">{feature.label}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Live Estimate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-surface border-2 border-surface"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">
                {value.length} {t('step4Of')} {MAX_FEATURES} {t('step4Selected')}
              </p>
              <p className="text-3xl font-bold text-emerald-400">
                ${minEstimate.toLocaleString()} - ${maxEstimate.toLocaleString()} MXN
              </p>
            </div>
            <div className="text-5xl">💰</div>
          </div>
        </motion.div>
      </div>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <BackButton onClick={onBack} />
        <NextButton onClick={onNext} disabled={value.length === 0} />
      </div>
    </StepContainer>
  );
}

// Step 5: Timeline
function Step5({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: Timeline | null;
  onChange: (value: Timeline) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations('wizard');
  const options = [
    {
      id: 'urgent' as Timeline,
      icon: '🔥',
      title: t('step5Urgent'),
      description: t('step5UrgentDesc'),
      insight: t('step5UrgentInsight'),
    },
    {
      id: 'soon' as Timeline,
      icon: '⚡',
      title: t('step5Soon'),
      description: t('step5SoonDesc'),
      insight: t('step5SoonInsight'),
    },
    {
      id: 'planned' as Timeline,
      icon: '📅',
      title: t('step5Planned'),
      description: t('step5PlannedDesc'),
      insight: t('step5PlannedInsight'),
    },
    {
      id: 'flexible' as Timeline,
      icon: '🤷',
      title: t('step5Flexible'),
      description: t('step5FlexibleDesc'),
      insight: t('step5FlexibleInsight'),
    },
  ];

  const handleSelect = (timeline: Timeline) => {
    onChange(timeline);
  };

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <StepContainer>
      <StepHeader title={t('step5Title')} subtitle={t('step5Subtitle')} />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {options.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={value === option.id}
              onClick={() => handleSelect(option.id)}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          {selectedOption && (
            <motion.div
              key={selectedOption.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30"
            >
              <p className="text-emerald-400">
                <strong>✨ {t('step5GreatChoice')}</strong> {selectedOption.insight}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <BackButton onClick={onBack} />
        <NextButton onClick={onNext} disabled={!value} />
      </div>
    </StepContainer>
  );
}

// Step 6: Budget
function Step6({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: BudgetRange | null;
  onChange: (value: BudgetRange) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations('wizard');
  const options = [
    {
      id: 'small' as BudgetRange,
      icon: '💸',
      title: t('step6Small'),
      description: t('step6SmallDesc'),
    },
    {
      id: 'medium' as BudgetRange,
      icon: '💰',
      title: t('step6Medium'),
      description: t('step6MediumDesc'),
    },
    {
      id: 'large' as BudgetRange,
      icon: '💎',
      title: t('step6Large'),
      description: t('step6LargeDesc'),
    },
    {
      id: 'unsure' as BudgetRange,
      icon: '🤔',
      title: t('step6Unsure'),
      description: t('step6UnsureDesc'),
    },
  ];

  const handleSelect = (budget: BudgetRange) => {
    onChange(budget);
    setTimeout(onNext, 500);
  };

  return (
    <StepContainer>
      <StepHeader
        title={t('step6Title')}
        subtitle={t('step6Subtitle')}
      />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {options.map((option) => (
            <OptionCard
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={value === option.id}
              onClick={() => handleSelect(option.id)}
            />
          ))}
        </div>
        <div className="p-4 rounded-xl bg-surface/30 border border-surface">
          <p className="text-sm text-text-secondary text-center">
            💚 {t('step6Note')}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <BackButton onClick={onBack} />
      </div>
    </StepContainer>
  );
}

// Step 7: Payment Model
function Step7({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: PaymentModel | null;
  onChange: (value: PaymentModel) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const t = useTranslations('wizard');
  const [selectedModel, setSelectedModel] = useState<PaymentModel | null>(value);

  const options = [
    {
      id: 'committed' as PaymentModel,
      icon: '💳',
      title: t('step7Committed'),
      description: t('step7CommittedDesc'),
      insight: t('step7CommittedInsight'),
    },
    {
      id: 'subscription' as PaymentModel,
      icon: '🔄',
      title: t('step7Subscription'),
      description: t('step7SubscriptionDesc'),
      insight: t('step7SubscriptionInsight'),
    },
  ];

  const handleSelect = (model: PaymentModel) => {
    setSelectedModel(model);
    onChange(model);
    setTimeout(onNext, 500);
  };

  return (
    <StepContainer>
      <StepHeader
        title={t('step7Title')}
        subtitle={t('step7Subtitle')}
      />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {options.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                selectedModel === option.id
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-surface border-surface hover:border-emerald-500/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {option.title}
              </h3>
              <p className="text-text-secondary mb-4">
                {option.description}
              </p>
              <div className="p-3 rounded-lg bg-background/50 border border-surface">
                <p className="text-sm text-text-secondary">
                  {option.insight}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <BackButton onClick={onBack} />
      </div>
    </StepContainer>
  );
}
