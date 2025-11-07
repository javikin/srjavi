import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedWork from '@/components/FeaturedWork';
import Pricing from '@/components/Pricing';
import ShipCTA from '@/components/ShipCTA';
import Footer from '@/components/Footer';

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
