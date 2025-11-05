import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Minimal Palette
        'primary': '#a78bfa',       // Soft Purple
        'secondary': '#60a5fa',     // Sky Blue
        'accent': '#ec4899',        // Pink accent
        'background': '#000000',    // Pure Black
        'surface': '#0a0a0a',       // Almost Black
        'surface-light': '#1a1a1a', // Dark Gray
        'text-primary': '#ffffff',  // Pure White
        'text-secondary': '#a1a1aa', // Zinc 400

        // Legacy colors (keep for reference)
        'off-white': '#f8f7f3',
        'electric-cyan': '#00d9ff',
        'deep-purple': '#8b3dff',
        'dark-bg': '#0a0a0a',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
