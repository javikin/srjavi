'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(/^\/(en|es)/, '');
    const newPath = `/${newLocale}${pathnameWithoutLocale || ''}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 bg-surface/50 rounded-full p-1 border border-text-primary/10">
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          locale === 'en'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('es')}
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
