'use client';

import { useI18n } from '@/lib/i18n-context';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-2 bg-surface/50 rounded-full p-1 border border-text-primary/10">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          locale === 'en'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('es')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          locale === 'es'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        ES
      </button>
    </div>
  );
}
