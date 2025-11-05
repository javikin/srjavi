import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { I18nProvider } from '@/lib/i18n-context';

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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <I18nProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
