import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

export default function FloatingElements() {
  const containerRef = useRef(null);

  const elements = useMemo(() => {
    const items = ['💕', '✨', '🌸', '💫', '⭐', '🦋', '💗', '🌷', '🌙', '💐', '🌺', '💖'];
    const generated = [];

    for (let i = 0; i < 25; i++) {
      generated.push({
        emoji: items[Math.floor(Math.random() * items.length)],
        left: `${Math.random() * 100}%`,
        size: `${0.8 + Math.random() * 1.5}rem`,
      });
    }
    return generated;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each floating element with GSAP instead of CSS keyframes
      const floaters = containerRef.current?.querySelectorAll('.floating-element');
      if (!floaters) return;

      floaters.forEach((el, i) => {
        const duration = 18 + Math.random() * 20; // slower: 18-38s
        const delay = Math.random() * 15;

        // Start below viewport, float up and out
        const animateFloat = () => {
          gsap.set(el, {
            y: window.innerHeight + 50,
            x: 0,
            scale: 0.4 + Math.random() * 0.4,
            rotation: Math.random() * 30 - 15,
            opacity: 0,
          });

          gsap.to(el, {
            y: -(window.innerHeight + 100),
            x: `+=${(Math.random() - 0.5) * 150}`,
            rotation: `+=${Math.random() * 360 - 180}`,
            scale: 0.8 + Math.random() * 0.5,
            opacity: 0.2 + Math.random() * 0.15,
            duration: duration,
            ease: 'none',
            onComplete: animateFloat,
          });

          // Gentle sinusoidal side-sway
          gsap.to(el, {
            x: `+=${(Math.random() - 0.5) * 80}`,
            duration: 4 + Math.random() * 3,
            repeat: Math.ceil(duration / 5),
            yoyo: true,
            ease: 'sine.inOut',
          });
        };

        gsap.delayedCall(delay, animateFloat);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="floating-elements-container" ref={containerRef}>
      {elements.map((el, i) => (
        <div
          key={i}
          className="floating-element"
          style={{
            left: el.left,
            bottom: '-5%',
            fontSize: el.size,
            opacity: 0,
            animation: 'none', // override CSS animation, GSAP handles it
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
}
