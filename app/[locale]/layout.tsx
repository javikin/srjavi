import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { locales } from '@/i18n';

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  return {
    title: isSpanish
      ? 'Javi - Constructor de Productos AI | Lanza MVPs en 2 Semanas'
      : 'Javi - AI Product Builder | Ship MVPs in 2 Weeks',
    description: isSpanish
      ? 'Constructor con experiencia YC ayudando a startups a validar ideas y lanzar MVPs listos para producción en 2 semanas. Desarrollo AI-first que escala.'
      : 'YC-experienced builder helping startups validate ideas and ship production-ready MVPs in 2 weeks. AI-first development that scales.',
    keywords: ['AI', 'Product Builder', 'MVP', 'Startup', 'Tech Founder', 'YC'],
    authors: [{ name: 'Javi', url: 'https://github.com/javikin' }],
    openGraph: {
      title: isSpanish
        ? 'Javi - Constructor de Productos AI | Lanza MVPs en 2 Semanas'
        : 'Javi - AI Product Builder | Ship MVPs in 2 Weeks',
      description: isSpanish
        ? 'Constructor con experiencia YC. Desarrollo AI-first que escala.'
        : 'YC-experienced builder. AI-first development that scales.',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>{children}</SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
