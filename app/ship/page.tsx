import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedWork from '@/components/FeaturedWork';
import Pricing from '@/components/Pricing';
import ShipCTA from '@/components/ShipCTA';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Javi - AI Product Builder | Ship MVPs in 2 Weeks',
  description: 'YC-experienced builder helping startups validate ideas and ship production-ready MVPs in 2 weeks. AI-first development that scales.',
  keywords: ['AI', 'Product Builder', 'MVP', 'Startup', 'Tech Founder', 'YC'],
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

export default function ShipPage() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <About />
      <FeaturedWork showCTA={false} />
      <Pricing />
      <ShipCTA />
      <Footer />
    </main>
  );
}
