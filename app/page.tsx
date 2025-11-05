import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import FeaturedWork from '@/components/FeaturedWork';
import Footer from '@/components/Footer';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Philosophy />
      <FeaturedWork />
      <Footer />
      <PerformanceMonitor />
    </main>
  );
}
