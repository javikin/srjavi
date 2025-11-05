import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

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
  keywords: ['AI', 'Product Builder', 'MVP', 'Startup', 'Tech Founder', 'YC', 'AI Development', 'MVP Development'],
  authors: [{ name: 'Javi', url: 'https://github.com/javikin' }],
  openGraph: {
    title: 'Javi - AI Product Builder | Ship MVPs in 2 Weeks',
    description: 'YC-experienced builder helping startups validate ideas and ship production-ready MVPs in 2 weeks.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Javi - AI Product Builder',
    description: 'Ship MVPs in 2 weeks. AI-first development for startups.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
