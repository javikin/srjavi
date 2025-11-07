'use client';

import { useEffect } from 'react';

export default function DarkModeScript() {
  useEffect(() => {
    // Apply dark mode from localStorage on mount
    const theme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = theme === 'dark' || (!theme && systemDark);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
}
