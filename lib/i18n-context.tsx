'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

type Locale = 'en' | 'es';
type Messages = typeof en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Messages>(en);

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    const preferredLocale = browserLang.startsWith('es') ? 'es' : 'en';

    // Check localStorage for saved preference
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    const initialLocale = savedLocale || preferredLocale;

    setLocaleState(initialLocale);
    setMessages(initialLocale === 'es' ? es : en);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setMessages(newLocale === 'es' ? es : en);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// Hook for easier translations
export function useTranslations(namespace: string) {
  const { t } = useI18n();
  return (key: string) => t(`${namespace}.${key}`);
}
