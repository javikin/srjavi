import About from '@/components/About';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="relative">
      <Navigation />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
    </main>
  );
}
