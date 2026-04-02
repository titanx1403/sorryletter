import { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero';
import PhotoWall from './components/PhotoWall';
import SorryLetter from './components/SorryLetter';
import ReasonsILoveYou from './components/ReasonsILoveYou';
import VirtualHug from './components/VirtualHug';
import PromiseJar from './components/PromiseJar';
import Footer from './components/Footer';
import SparklesCursor from './components/SparklesCursor';
import FloatingElements from './components/FloatingElements';
import { trackVisit, updateVisit } from './utils/tracking';
import './App.css';

function App() {
  const [visitId, setVisitId] = useState(null);
  const [sectionsViewed, setSectionsViewed] = useState({
    hero: true,
    photoWall: false,
    letter: false,
    reasons: false,
    hugButton: false,
    promiseJar: false,
  });
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Track the visit when website opens
    const initTracking = async () => {
      const id = await trackVisit();
      setVisitId(id);
    };
    initTracking();

    // Track time spent when leaving
    const handleBeforeUnload = () => {
      if (visitId) {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        updateVisit(visitId, { timeSpentSeconds: timeSpent, sections: sectionsViewed });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [visitId, sectionsViewed]);

  // Intersection Observer for section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.dataset.section;
            if (section) {
              setSectionsViewed((prev) => ({ ...prev, [section]: true }));
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleHugClicked = () => {
    if (visitId) {
      updateVisit(visitId, { hugClicked: true });
    }
  };

  return (
    <div className="app">
      <SparklesCursor />
      <FloatingElements />
      
      <section data-section="hero">
        <Hero />
      </section>
      
      <section data-section="photoWall">
        <PhotoWall />
      </section>
      
      <section data-section="letter">
        <SorryLetter />
      </section>
      
      <section data-section="reasons">
        <ReasonsILoveYou />
      </section>
      
      <section data-section="hugButton">
        <VirtualHug onHugClicked={handleHugClicked} />
      </section>
      
      <section data-section="promiseJar">
        <PromiseJar />
      </section>
      
      <Footer />
    </div>
  );
}

export default App;
