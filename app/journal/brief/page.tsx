import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import ClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Dos Años - Una breve historia | Journal de Javi',
  description: 'Después de dos años viviendo en incertidumbre, entre decisiones y versiones de mí mismo, me di cuenta que no se trata de buscar, sino de construir.',
  keywords: ['Carrillo', 'Costa Rica', 'Reflexiones', 'Vida', 'Viaje'],
  openGraph: {
    title: 'Dos Años - Una breve historia',
    description: 'Después de dos años en incertidumbre, me di cuenta que no se trata de buscar, sino de construir.',
    type: 'article',
    images: [
      {
        url: '/images/journal/carrillo-studio/07-room-after-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Dos Años - Journal de Javi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dos Años - Una breve historia',
    description: 'Después de dos años en incertidumbre, me di cuenta que no se trata de buscar, sino de construir.',
    images: ['/images/journal/carrillo-studio/07-room-after-hero.jpg'],
  },
};

export default async function BriefPage() {
  // Read the JSON file directly instead of using TinaCMS client
  const filePath = path.join(process.cwd(), 'content/posts/dos-anos.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const postData = JSON.parse(fileContents);

  return (
    <ClientPage data={postData} />
  );
}
