import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors (default)
        'background': 'rgb(var(--color-background) / <alpha-value>)',
        'surface': 'rgb(var(--color-surface) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',

        // Pastel Accents (Jason Briscoe palette) - same in both modes
        'mint': '#8AD8C0',
        'coral': '#F39A8E',
        'sky': '#85CBDA',
        'lavender': '#B295CE',
        'lime': '#C6F459',

        // Primary/Secondary for CTAs
        'primary': '#8AD8C0',
        'secondary': '#85CBDA',
        'accent': '#F39A8E',

        // Neutral grays
        'gray-50': '#F8F9FA',
        'gray-100': '#F1F3F5',
        'gray-200': '#E9ECEF',
        'gray-300': '#DEE2E6',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
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
