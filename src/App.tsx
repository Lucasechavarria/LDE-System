import { useState } from 'react';
import TerminalLoader from './components/TerminalLoader';
import Navbar from './components/Navbar';
import KungFuHero from './components/KungFuHero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E7EB]">
      <TerminalLoader onComplete={() => setIsLoading(false)} />

      {isLoading && (
        <div className="fixed inset-0 bg-[#050505] z-30 pointer-events-none" />
      )}

      <Navbar />

      <main>
        <KungFuHero />
        <About />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;