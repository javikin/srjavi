import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'El Camino - Journal de Javi',
  description: 'Historias sobre decisiones, lugares y las versiones de mí mismo que voy descubriendo. Un espacio para construir sin la presión de promocionar.',
  keywords: ['Journal', 'Blog Personal', 'Carrillo', 'Costa Rica', 'Reflexiones'],
  openGraph: {
    title: 'El Camino - Journal de Javi',
    description: 'Historias sobre decisiones, lugares y las versiones de mí mismo que voy descubriendo.',
    type: 'website',
    images: [
      {
        url: '/images/journal/carrillo-studio/07-room-after-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'El Camino - Journal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Camino - Journal de Javi',
    description: 'Historias sobre decisiones, lugares y las versiones de mí mismo que voy descubriendo.',
    images: ['/images/journal/carrillo-studio/07-room-after-hero.jpg'],
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
