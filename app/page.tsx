import Navigation from '@/components/Navigation';
import About from '@/components/About';
import LandingCTA from '@/components/LandingCTA';
import Footer from '@/components/Footer';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <About />
      <LandingCTA />
      <Footer showEasterEgg={true} />
      <PerformanceMonitor />
    </main>
  );
}
