import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Footer from '@/components/Footer';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <About />
      <Footer showEasterEgg={true} />
      <PerformanceMonitor />
    </main>
  );
}
