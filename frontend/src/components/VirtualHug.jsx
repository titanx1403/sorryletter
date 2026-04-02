import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VirtualHug({ onHugClicked }) {
  const [showPopup, setShowPopup] = useState(false);
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hug-section .section-title',
        { opacity: 0, y: 50, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.hug-section', start: 'top 80%' },
        }
      );

      gsap.fromTo('.hug-section > p',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out',
          scrollTrigger: { trigger: '.hug-section', start: 'top 80%' },
        }
      );

      // Button: dramatic elastic entrance
      gsap.fromTo(buttonRef.current,
        { opacity: 0, scale: 0, rotation: -10 },
        {
          opacity: 1, scale: 1, rotation: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.35)',
          scrollTrigger: { trigger: buttonRef.current, start: 'top 88%' },
        }
      );

      // Continuous gentle bounce + glow pulse
      gsap.to(buttonRef.current, {
        y: -8,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(buttonRef.current, {
        boxShadow: '0 12px 40px rgba(233,30,99,0.45), 0 6px 15px rgba(233,30,99,0.3)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleHug = () => {
    const colors = ['#ff6b9d', '#fce4ec', '#f48fb1', '#ce93d8', '#f8bbd0', '#e91e63'];

    // Button squeeze-and-release
    gsap.to(buttonRef.current, {
      scale: 0.85,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(buttonRef.current, {
          scale: 1.1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    });

    // Multi-burst confetti
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 }, colors, scalar: 1.2 });
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
    }, 150);
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
    }, 300);
    setTimeout(() => {
      confetti({ particleCount: 30, spread: 360, gravity: 0.5, decay: 0.94, startVelocity: 20, colors: ['#ff6b9d','#e91e63','#f48fb1'], origin: { x: 0.5, y: 0.3 }, scalar: 2 });
    }, 500);

    setShowPopup(true);
    onHugClicked?.();
  };

  // Animate popup when it appears
  useEffect(() => {
    if (showPopup) {
      gsap.fromTo('.hug-popup-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo('.hug-popup',
        { scale: 0.2, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)', delay: 0.15 }
      );
      gsap.fromTo('.hug-popup-emoji',
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.3)', delay: 0.3 }
      );
    }
  }, [showPopup]);

  const closePopup = () => {
    gsap.to('.hug-popup', {
      scale: 0.5, opacity: 0, y: -30, duration: 0.3, ease: 'power2.in',
    });
    gsap.to('.hug-popup-overlay', {
      opacity: 0, duration: 0.35, delay: 0.1, ease: 'power2.in',
      onComplete: () => setShowPopup(false),
    });
  };

  return (
    <div className="hug-section" ref={sectionRef}>
      <h2 className="section-title">Send Me a Hug? 🤗</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-light)', fontSize: '1rem' }}>
        Go ahead... press it... I need it 🥺
      </p>
      <button className="hug-button" ref={buttonRef} onClick={handleHug} id="hug-button" style={{ opacity: 0 }}>
        🤗 Send Virtual Hug 💕
      </button>

      {showPopup && (
        <div className="hug-popup-overlay" onClick={closePopup}>
          <div className="hug-popup" onClick={(e) => e.stopPropagation()}>
            <span className="hug-popup-emoji">💕</span>
            <h2>Hug Delivered to Your Heart!</h2>
            <p>I felt that across the universe 🌌</p>
            <button className="hug-popup-close" onClick={closePopup}>
              Close 💌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
