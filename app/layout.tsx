import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import PageLoader from '@/components/PageLoader';
import DarkModeScript from '@/components/DarkModeScript';
import PageTransition from '@/components/PageTransition';
import { I18nProvider } from '@/lib/i18n-context';
import PasswordProtect from '@/components/PasswordProtect';
import { Analytics } from '@vercel/analytics/react';

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
  title: 'Javi - AI Product Builder | Ship MVPs in 2 Weeks',
  description: 'YC-experienced builder helping startups validate ideas and ship production-ready MVPs in 2 weeks. AI-first development that scales.',
  keywords: ['AI', 'Product Builder', 'MVP', 'Startup', 'Tech Founder', 'YC'],
  authors: [{ name: 'Javi', url: 'https://github.com/javikin' }],
  openGraph: {
    title: 'Javi - AI Product Builder | Ship MVPs in 2 Weeks',
    description: 'YC-experienced builder. AI-first development that scales.',
    type: 'website',
    images: [
      {
        url: '/images/javi-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Javi - AI Product Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Javi - AI Product Builder | Ship MVPs in 2 Weeks',
    description: 'YC-experienced builder. AI-first development that scales.',
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
      </body>
    </html>
  );
}
