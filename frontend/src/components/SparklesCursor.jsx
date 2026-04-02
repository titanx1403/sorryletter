import { useEffect, useCallback } from 'react';
import gsap from 'gsap';

export default function SparklesCursor() {
  const createSparkle = useCallback((x, y) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const emojis = ['✨', '💕', '⭐', '💫', '🌸'];
    sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const size = 10 + Math.random() * 15;
    sparkle.style.cssText = `
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      font-size: ${size}px;
      pointer-events: none;
      position: fixed;
      z-index: 10000;
      opacity: 0;
    `;

    document.body.appendChild(sparkle);

    // Use GSAP for a smoother, slower sparkle animation
    gsap.fromTo(sparkle,
      { opacity: 0, scale: 0.3, rotation: 0 },
      {
        opacity: 1,
        scale: 1,
        rotation: 90 + Math.random() * 90,
        y: -(20 + Math.random() * 40),
        x: (Math.random() - 0.5) * 30,
        duration: 1.4,        // slower fade
        ease: 'power2.out',
        onComplete: () => sparkle.remove(),
      }
    );
    // Separate fade-out tween so sparkle lingers then fades
    gsap.to(sparkle, {
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'power1.in',
    });
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const throttle = 150; // much slower sparkle rate (was 80ms)

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttle) return;
      lastTime = now;

      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      createSparkle(e.clientX + offsetX, e.clientY + offsetY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createSparkle]);

  return null;
}
