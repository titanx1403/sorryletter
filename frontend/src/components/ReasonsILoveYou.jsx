import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { icon: '😊', reason: 'Teri smile na… literally mera pura din better kar deti hai. Ek baar dekh lu toh sab tension gayab.' },

  { icon: '🤣', reason: 'Tere saath lipton pe hasne mein jo maza aata hai… uska koi comparison hi nahi. Aur agar thoda sa tera mazak uda du toh aur bhi jyada 😂❤️' },

  { icon: '🧁', reason: 'Tu chhoti chhoti cheezo mein itni khush ho jati hai… mujhe shayad utna nahi hota, but tujhe khush dekhna hi best part hota hai. Jaise koi chhoti si good news ho aur tu full excited ho jaye 🥺✨' },

  { icon: '💫', reason: 'Tu woh insaan hai jo sabke saath kaise achha behave karte hai wo sikha sakti hai… bas rude wala part mat sikhana, usse mujhe sach mein darr lagta hai 😭❤️' },

  { icon: '📱', reason: 'Hum late night talks jyada nahi karte, but tere saath video call pe baat karna hi alag level ka sukoon deta hai 💕' },

  { icon: '🫶', reason: 'Tu literally har chhoti cheez mein mujhe motivate karti hai… chahe GFG ke tasks ho ya kuch bhi, “ye kar, wo kar” — tu meri personal motivator hai 😭🔥' },

  { icon: '🍦', reason: 'Mujhe ice cream itni pasand nahi thi… but ice cream khane wale log ab bohot pasand aane lage hai 😌🍦❤️' },

  { icon: '🥺', reason: 'Main har baar sorry bol deta hu… kabhi kabhi lagta hai kya main hi galat hu hamesha? But chhod na… galti kisi ki bhi ho, sorry main hi bol dunga. Don’t worry… ice cream bhi saath mein khayenge ❤️' },
];

export default function ReasonsILoveYou() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title with character split effect
      gsap.fromTo('.reasons-section .section-title',
        { opacity: 0, y: 50, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.reasons-section', start: 'top 80%' },
        }
      );

      // Cards cascade in with 3D rotation
      const cards = gsap.utils.toArray('.reason-card');
      cards.forEach((card, i) => {
        const fromRotateY = i % 2 === 0 ? -25 : 25;
        const fromX = i % 2 === 0 ? -60 : 60;

        gsap.fromTo(card,
          { opacity: 0, y: 60, x: fromX, rotateY: fromRotateY, scale: 0.8 },
          {
            opacity: 1, y: 0, x: 0, rotateY: 0, scale: 1,
            duration: 0.9,
            ease: 'back.out(1.3)',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
            },
          }
        );
      });

      // Icons inside cards get a continuous pulse
      gsap.to('.reason-front .icon', {
        scale: 1.15,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.2, from: 'random' },
      });

      // "hover me" hint fades in and out
      gsap.to('.reason-front .hint', {
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.15,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="reasons-section" ref={sectionRef}>
      <h2 className="section-title">Reasons I Love You 💝</h2>
      <div className="reasons-grid">
        {reasons.map((item, i) => (
          <div key={i} className="reason-card">
            <div className="reason-card-inner">
              <div className="reason-front">
                <span className="icon">{item.icon}</span>
                <span className="hint">hover me 💕</span>
              </div>
              <div className="reason-back">
                <p>{item.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
