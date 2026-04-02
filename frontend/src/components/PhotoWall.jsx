import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const photos = [
  { src: '/photos/photo1.png', caption: 'That waffle we shared 💕', rotation: -3 },
  { src: '/photos/photo2.png', caption: 'want to dance with you 💕', rotation: 2 },
  { src: '/photos/photo3.png', caption: 'temple dates with you ✨', rotation: -1.5 },
  { src: '/photos/photo4.png', caption: 'traditional together ✨', rotation: 3 },
];

export default function PhotoWall() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.photo-wall-section',
          start: 'top 80%',
          end: 'center center',
          toggleActions: 'play none none none',
        }
      });

      // Title sweeps in with a fade + scale
      tl.fromTo('.photo-wall-section .section-title',
        { opacity: 0, y: 50, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' }
      );

      // Polaroids fly in from different directions
      photos.forEach((photo, i) => {
        const fromX = i % 2 === 0 ? -120 : 120;
        tl.fromTo(`.polaroid:nth-child(${i + 1})`,
          { opacity: 0, x: fromX, y: 80, scale: 0.6, rotateZ: (i % 2 === 0 ? -20 : 20) },
          {
            opacity: 1, x: 0, y: 0, scale: 1, rotateZ: photo.rotation,
            duration: 0.8,
            ease: 'back.out(1.6)',
          },
          '-=0.5'
        );
      });

      // After all polaroids are in, add a subtle wiggle
      gsap.to('.polaroid', {
        rotateZ: '+=1.5',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.4, from: 'random' },
        delay: 2,
      });

      // Parallax-like float on scroll
      gsap.to('.polaroid-grid', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.photo-wall-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="photo-wall-section" ref={sectionRef}>
      <h2 className="section-title">Our Memories 📸</h2>
      <div className="polaroid-grid">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="polaroid"
            style={{ transform: `rotate(${photo.rotation}deg)` }}
          >
            <div className="polaroid-tape"></div>
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <p className="polaroid-caption">{photo.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
