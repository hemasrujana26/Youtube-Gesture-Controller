import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Gestures from './components/Gestures';
import Demo from './components/Demo';
import Documentation from './components/Documentation';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Gestures />
        <Demo />
        <Documentation />
      </main>
      <Footer />
    </div>
  );
}

export default App; 