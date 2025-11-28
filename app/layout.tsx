import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import PageLoader from '@/components/PageLoader';
import DarkModeScript from '@/components/DarkModeScript';
import PageTransition from '@/components/PageTransition';
import { I18nProvider } from '@/lib/i18n-context';
import PasswordProtect from '@/components/PasswordProtect';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Javi - Un humano más',
  description: 'Desarrollador full-stack con más de 14 años creando productos digitales. Sueño con producir cortometrajes y disfruto estar rodeado de naturaleza.',
  keywords: ['Desarrollador', 'Full-Stack', 'Creador', 'Costa Rica', 'Productos Digitales'],
  authors: [{ name: 'Javi', url: 'https://github.com/javikin' }],
  openGraph: {
    title: 'Javi - Un humano más',
    description: 'Más de 14 años creando productos digitales. Sueño con producir cortometrajes.',
    type: 'website',
    images: [
      {
        url: '/images/javi-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Javi - Desarrollador Full-Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Javi - Un humano más',
    description: 'Más de 14 años creando productos digitales. Sueño con producir cortometrajes.',
    images: ['/images/javi-profile.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <DarkModeScript />
        <PageLoader />
        <PasswordProtect>
          <I18nProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </I18nProvider>
        </PasswordProtect>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
