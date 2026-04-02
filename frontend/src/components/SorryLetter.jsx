import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fullLetter = `Dear Love,

I know maine galti ki… and I'm really sorry yaar.

Us din situation thodi weird thi, main bas friends ke saath tha, aur kuch cheezein unexpectedly ho gayi. Maine tumhe us time pe sab clearly nahi bataya… mujhe laga baad mein calmly explain kar dunga. But wahi meri mistake thi.

Mera intention kabhi galat nahi tha, aur na hi main kuch hide karna chahta tha… bas timing aur handling dono galat ho gaye.

Mujhe pata hai tumhe hurt hua hai, and honestly, mujhe uska bohot bura lag raha hai.

Tum mere liye bohot important ho… aur main kabhi bhi jaan ke tumhe hurt nahi karunga.

Please samajhne ki koshish karo… aur agar possible ho toh mujhe ek chance de do. 🥺💕

Forever yours,  
Tumhara gadha ❤️ 
(kardo yarr maaf)`;

export default function SorryLetter() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance
      gsap.fromTo('.letter-section .section-title',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.letter-section', start: 'top 80%' },
        }
      );

      // Letter container: float up from below with rotation + shadow grow
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 80, rotateX: 8, scale: 0.9, boxShadow: '0 0 0 rgba(0,0,0,0)' },
        {
          opacity: 1, y: 0, rotateX: 0, scale: 1,
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%',
            onEnter: () => {
              if (!hasStarted) {
                setHasStarted(true);
                setIsTyping(true);
              }
            }
          },
        }
      );

      // Gentle continuous float for the letter
      gsap.to(containerRef.current, {
        y: -8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [hasStarted]);

  useEffect(() => {
    if (!isTyping) return;

    const interval = setInterval(() => {
      if (charIndexRef.current < fullLetter.length) {
        charIndexRef.current++;
        setDisplayedText(fullLetter.slice(0, charIndexRef.current));
      } else {
        setIsTyping(false);
        clearInterval(interval);
        // Celebrate finishing the letter
        gsap.fromTo('.letter-container',
          { boxShadow: '0 10px 40px rgba(0,0,0,0.06)' },
          {
            boxShadow: '0 10px 50px rgba(233,30,99,0.15)',
            duration: 1.5,
            ease: 'power2.out',
          }
        );
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <div className="letter-section" ref={sectionRef}>
      <h2 className="section-title">A Letter For You 💌</h2>
      <div className="letter-container" ref={containerRef} style={{ opacity: 0 }}>
        <div className="letter-lines">
          <p className="letter-text">
            {displayedText}
            {isTyping && <span className="letter-cursor"></span>}
          </p>
        </div>
      </div>
    </div>
  );
}
