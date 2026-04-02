import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const emojisRef = useRef(null);
  const scrollRef = useRef(null);

  const heroEmojis = [
    { emoji: '💕', left: '10%', top: '20%' },
    { emoji: '✨', left: '85%', top: '15%' },
    { emoji: '🌸', left: '15%', top: '70%' },
    { emoji: '💫', left: '75%', top: '65%' },
    { emoji: '🦋', left: '50%', top: '10%' },
    { emoji: '💗', left: '90%', top: '45%' },
    { emoji: '🌷', left: '5%', top: '45%' },
    { emoji: '⭐', left: '60%', top: '80%' },
    { emoji: '🌙', left: '30%', top: '85%' },
    { emoji: '💐', left: '70%', top: '30%' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Title entrance: scale + blur reveal ──
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(titleRef.current,
        { opacity: 0, y: 80, scale: 0.7, filter: 'blur(12px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4 }
      )
      // subtitle slides up after title
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 30, letterSpacing: '8px' },
        { opacity: 0.8, y: 0, letterSpacing: '2px', duration: 1 },
        '-=0.6'
      )
      // scroll indicator fades in
      .fromTo(scrollRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      );

      // ── Emoji stagger entrance with elastic bounce ──
      gsap.fromTo('.hero-emoji',
        { scale: 0, opacity: 0, rotation: -30 },
        {
          scale: 1,
          opacity: 0.6,
          rotation: 0,
          duration: 1.2,
          stagger: { each: 0.12, from: 'random' },
          ease: 'elastic.out(1, 0.4)',
          delay: 0.4,
        }
      );

      // ── Continuous floating for emojis — slower, dreamier ──
      document.querySelectorAll('.hero-emoji').forEach((emoji, i) => {
        // Primary float
        gsap.to(emoji, {
          y: `-=${25 + Math.random() * 25}`,
          x: `+=${-15 + Math.random() * 30}`,
          rotation: -10 + Math.random() * 20,
          duration: 4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
        // Secondary slow scale pulse
        gsap.to(emoji, {
          scale: 0.85 + Math.random() * 0.3,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2 + 1,
        });
      });

      // ── Scroll indicator bounce ──
      gsap.to('.scroll-arrow', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // ── Background glow pulse ──
      gsap.to('.hero-section::before', {
        rotation: 5,
        scale: 1.05,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, emojisRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-section" ref={emojisRef}>
      <div className="hero-emojis">
        {heroEmojis.map((item, i) => (
          <span
            key={i}
            className="hero-emoji"
            style={{
              left: item.left,
              top: item.top,
              fontSize: `${1.5 + Math.random() * 1.5}rem`,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="hero-title-container">
        <h1 className="hero-title" ref={titleRef} style={{ opacity: 0 }}>I'm Sorry 🥺</h1>
        <p className="hero-subtitle" ref={subtitleRef} style={{ opacity: 0 }}>please scroll down... I have something to say</p>
      </div>

      <div className="scroll-indicator" ref={scrollRef} style={{ opacity: 0 }}>
        <span>scroll</span>
        <div className="scroll-arrow"></div>
      </div>
    </div>
  );
}
