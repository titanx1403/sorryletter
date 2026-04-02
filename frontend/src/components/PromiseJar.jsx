import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const promises = [
  'I promise ki main hamesha tumhari baat sununga 💬',

  'I promise roz tumhe hostel gate tak leave karne aaunga… jitna possible hoga utna pakka 🏫❤️',

  'I promise ki bina baat solve kiye kabhi sone nahi jaunga 🌙',

  'I promise tumhe hasata rahunga… kabhi kabhi tum mujhpe gussa bhi ho jaogi, but phir bhi try karta rahunga 😂🥺',

  'I promise main hamesha tumhara biggest supporter rahunga 📣',

  'I promise har situation mein tumhara haath pakad ke rahunga 🤝',

  'I promise har baar “us” ko choose karunga, no matter what 💕',
];

const scrollColors = ['#f48fb1', '#ce93d8', '#ef9a9a', '#f8bbd0', '#e1bee7', '#ffab91', '#f48fb1', '#b39ddb'];

export default function PromiseJar() {
  const [activePromise, setActivePromise] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const jarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.promise-section .section-title',
        { opacity: 0, y: 50, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.promise-section', start: 'top 80%' },
        }
      );

      gsap.fromTo('.promise-section > p',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: '.promise-section', start: 'top 80%' },
        }
      );

      // Jar entrance: float up with bounce
      gsap.fromTo(jarRef.current,
        { opacity: 0, y: 80, scale: 0.6, rotation: -5 },
        {
          opacity: 1, y: 0, scale: 1, rotation: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: jarRef.current, start: 'top 85%' },
        }
      );

      // Promise scrolls: stagger pop-in
      gsap.fromTo('.promise-scroll',
        { opacity: 0, scale: 0 },
        {
          opacity: 1, scale: 1,
          duration: 0.6,
          stagger: { each: 0.1, from: 'random' },
          ease: 'back.out(2)',
          scrollTrigger: { trigger: jarRef.current, start: 'top 82%' },
          delay: 0.5,
        }
      );

      // Continuous gentle float for each scroll
      document.querySelectorAll('.promise-scroll').forEach((scroll, i) => {
        gsap.to(scroll, {
          y: `-=${5 + Math.random() * 8}`,
          x: `+=${-3 + Math.random() * 6}`,
          rotation: `+=${-5 + Math.random() * 10}`,
          duration: 2.5 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });

      // Gentle jar wobble
      gsap.to(jarRef.current, {
        rotation: 1.5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollHover = (index, e) => {
    setActivePromise(index);
    const rect = e.target.getBoundingClientRect();
    const jarRect = e.target.closest('.jar-container').getBoundingClientRect();
    setTooltipPos({
      x: rect.left - jarRect.left + rect.width / 2,
      y: rect.top - jarRect.top - 10,
    });
    // Scale up the hovered scroll
    gsap.to(e.target, { scale: 1.4, duration: 0.3, ease: 'back.out(2)' });
  };

  const handleScrollLeave = (e) => {
    setActivePromise(null);
    gsap.to(e.target, { scale: 1, duration: 0.3, ease: 'power2.out' });
  };

  const scrollPositions = [
    { left: '22%', top: '45%', rotate: -15 },
    { left: '55%', top: '50%', rotate: 20 },
    { left: '35%', top: '60%', rotate: -5 },
    { left: '60%', top: '65%', rotate: 12 },
    { left: '25%', top: '72%', rotate: -20 },
    { left: '50%', top: '75%', rotate: 8 },
    { left: '40%', top: '55%', rotate: -10 },
    { left: '30%', top: '80%', rotate: 15 },
  ];

  return (
    <div className="promise-section" ref={sectionRef}>
      <h2 className="section-title">My Promise Jar 🫙</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
        Hover over the tiny scrolls to read my promises to you ✨
      </p>

      <div className="jar-container" ref={jarRef} style={{ opacity: 0 }}>
        <svg className="jar-svg" viewBox="0 0 280 380" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M55 120 C55 120 40 140 38 180 C36 220 36 300 45 340 C50 355 65 365 90 368 C120 372 160 372 190 368 C215 365 230 355 235 340 C244 300 244 220 242 180 C240 140 225 120 225 120"
            fill="url(#jarGradient)"
            stroke="rgba(200,180,220,0.5)"
            strokeWidth="2"
          />
          <path
            d="M65 140 C65 140 58 170 58 220 C58 260 60 310 68 340"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="45" y="105" width="190" height="20" rx="4" fill="url(#lidGradient)" stroke="rgba(180,160,200,0.5)" strokeWidth="1.5"/>
          <rect x="50" y="98" width="180" height="12" rx="6" fill="url(#lidTopGradient)" stroke="rgba(180,160,200,0.4)" strokeWidth="1"/>
          <ellipse cx="140" cy="96" rx="20" ry="6" fill="url(#knobGradient)" stroke="rgba(180,160,200,0.4)" strokeWidth="1"/>
          <path d="M60 118 Q80 130 100 118 Q120 106 140 118 Q160 130 180 118 Q200 106 220 118" fill="none" stroke="#f48fb1" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
          <path d="M130 115 C120 100 105 102 110 115 C115 128 125 125 130 115" fill="#f48fb1" opacity="0.6"/>
          <path d="M130 115 C140 100 155 102 150 115 C145 128 135 125 130 115" fill="#f48fb1" opacity="0.6"/>
          <defs>
            <linearGradient id="jarGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(248,230,240,0.6)" />
              <stop offset="50%" stopColor="rgba(240,220,235,0.4)" />
              <stop offset="100%" stopColor="rgba(232,218,239,0.5)" />
            </linearGradient>
            <linearGradient id="lidGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8daef" />
              <stop offset="100%" stopColor="#d1b3e0" />
            </linearGradient>
            <linearGradient id="lidTopGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3e5f5" />
              <stop offset="100%" stopColor="#e8daef" />
            </linearGradient>
            <linearGradient id="knobGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3e5f5" />
              <stop offset="100%" stopColor="#ce93d8" />
            </linearGradient>
          </defs>
        </svg>

        {scrollPositions.map((pos, i) => (
          <div
            key={i}
            className="promise-scroll"
            style={{
              left: pos.left,
              top: pos.top,
              transform: `rotate(${pos.rotate}deg)`,
              fontSize: '1.2rem',
              opacity: 0,
            }}
            onMouseEnter={(e) => handleScrollHover(i, e)}
            onMouseLeave={handleScrollLeave}
          >
            <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
              <rect x="2" y="2" width="24" height="12" rx="6" fill={scrollColors[i]} opacity="0.85"/>
              <rect x="4" y="4" width="20" height="8" rx="4" fill="white" opacity="0.3"/>
              <circle cx="6" cy="8" r="2" fill="white" opacity="0.5"/>
              <circle cx="22" cy="8" r="2" fill="white" opacity="0.5"/>
            </svg>
          </div>
        ))}

        {activePromise !== null && (
          <div
            className="promise-tooltip"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 40}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {promises[activePromise]}
          </div>
        )}
      </div>
    </div>
  );
}
