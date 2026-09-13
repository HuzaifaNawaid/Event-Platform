import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   FONTS & GLOBAL STYLES
   ========================================================= */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;800;900&display=swap');

  .font-anton { font-family: 'Anton', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }

  .offset-shadow {
    position: relative;
    display: inline-block;
  }
  .offset-shadow .shadow-text {
    position: absolute;
    top: -8px;
    left: -8px;
    z-index: 1;
    opacity: 0.3;
    user-select: none;
  }
  .offset-shadow .front-text {
    position: relative;
    z-index: 2;
  }
`;

/* =========================================================
   COMPONENTS
   ========================================================= */

function SpotifyFooter({ color }: { color: string }) {
  return (
    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-10">
      <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
        <circle cx="12" cy="12" r="12" />
        <path
          d="M18 9.5C15.5 8.5 11 8.5 8.5 9.5C8 9.7 7.5 9.3 7.3 8.8C7.1 8.3 7.5 7.8 8 7.6C11 6.4 16 6.4 19 7.6C19.5 7.8 19.9 8.3 19.7 8.8C19.5 9.3 19 9.7 18 9.5ZM17.5 12.5C15.5 11.7 11.5 11.7 9.5 12.5C9 12.7 8.6 12.3 8.4 11.8C8.2 11.3 8.6 10.9 9.1 10.7C11.6 9.7 16 9.7 18.5 10.7C19 10.9 19.4 11.3 19.2 11.8C19 12.3 18.5 12.7 17.5 12.5ZM17 15.5C15.5 14.9 12.5 14.9 11 15.5C10.5 15.7 10.1 15.3 9.9 14.8C9.7 14.3 10.1 13.9 10.6 13.7C12.6 13 16 13 18 13.7C18.5 13.9 18.9 14.3 18.7 14.8C18.5 15.3 18 15.7 17 15.5Z"
          fill={color === "#FFFFFF" || color === "rgba(255,255,255,0.6)" ? "#121212" : "#FFFFFF"}
        />
      </svg>
      <span className="font-inter text-[10px] font-bold tracking-widest uppercase" style={{ color }}>
        SPOTIFY.COM/WRAPPED
      </span>
    </div>
  );
}

function WaveDecoration({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-full h-[90px] pointer-events-none opacity-40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M-20 50 C 40 20, 80 20, 140 50 S 240 80, 300 50 S 400 20, 460 50"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M-20 70 C 40 40, 80 40, 140 70 S 240 100, 300 70 S 400 40, 460 70"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/* =========================================================
   MAIN SECTION
   ========================================================= */
export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      if (prefersReduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 50 });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            overwrite: true,
          }),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative w-full bg-[#121212] py-16 sm:py-24"
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6">
        {/* Header Area */}
        <div className="mb-10 sm:mb-14 text-center">
          <h2 className="font-anton text-[48px] sm:text-[72px] leading-none text-white tracking-tight">
            By Builders, For Builders.
          </h2>
          <p className="font-inter text-white/50 text-sm sm:text-base mt-4 font-medium tracking-wide max-w-[600px] mx-auto">
            A look back at everything we've built, shipped, and accomplished together so far in 2026.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Card 1: Dark / Purple */}
          <div ref={(el) => { cardRefs.current[0] = el; }} className="relative overflow-hidden rounded-[20px] p-6 sm:p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[400px] bg-[#121212]">
            {/* Top Right Pattern */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 right-0 opacity-20" fill="none">
              <path d="M120 0 L40 120 M120 20 L60 120 M120 40 L80 120 M120 60 L100 120 M120 80 L120 120" stroke="#FFFFFF" strokeWidth="8" />
            </svg>
            
            <div className="relative z-10">
              <p className="font-inter font-extrabold text-[15px] sm:text-[17px] tracking-tight uppercase text-[#A99FF5]">
                Hours Building
              </p>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center my-4">
              <div className="offset-shadow">
                <span className="font-anton text-[90px] sm:text-[130px] leading-[0.8] tracking-tight shadow-text text-[#A99FF5]">
                  55,173
                </span>
                <span className="font-anton text-[90px] sm:text-[130px] leading-[0.8] tracking-tight front-text text-[#A99FF5]">
                  55,173
                </span>
              </div>
            </div>

            <div className="relative z-10 max-w-[80%] mt-4">
              <p className="font-inter font-medium text-[13px] sm:text-[15px] leading-snug text-white/70">
                That's 38 days of pure craft and collaboration.
              </p>
            </div>

            <WaveDecoration color="rgba(255,255,255,0.2)" />
            <SpotifyFooter color="rgba(255,255,255,0.6)" />
          </div>

          {/* Card 2: Beige / Red */}
          <div ref={(el) => { cardRefs.current[1] = el; }} className="relative overflow-hidden rounded-[20px] p-6 sm:p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[400px] bg-[#F2EFE9]">
            {/* Top Right Pattern */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 right-0 opacity-10" fill="none">
              <circle cx="120" cy="0" r="40" stroke="#121212" strokeWidth="4" />
              <circle cx="120" cy="0" r="60" stroke="#121212" strokeWidth="4" />
              <circle cx="120" cy="0" r="80" stroke="#121212" strokeWidth="4" />
              <circle cx="120" cy="0" r="100" stroke="#121212" strokeWidth="4" />
            </svg>

            <div className="relative z-10">
              <p className="font-inter font-extrabold text-[15px] sm:text-[17px] tracking-tight uppercase text-[#121212]">
                Our Community Age
              </p>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center my-4">
              <div className="offset-shadow">
                <span className="font-anton text-[120px] sm:text-[180px] leading-[0.8] tracking-tight shadow-text text-[#F5503E]">
                  70
                </span>
                <span className="font-anton text-[120px] sm:text-[180px] leading-[0.8] tracking-tight front-text text-[#F5503E]">
                  70
                </span>
              </div>
            </div>

            <div className="relative z-10 max-w-[80%] mt-4">
              <p className="font-inter font-medium text-[13px] sm:text-[15px] leading-snug text-[#121212]/70">
                Since we started building from the ground up in 2026.
              </p>
            </div>

            <WaveDecoration color="rgba(18,18,18,0.15)" />
            <SpotifyFooter color="rgba(18,18,18,0.6)" />
          </div>

          {/* Card 3: Purple / Illustration */}
          <div ref={(el) => { cardRefs.current[2] = el; }} className="relative overflow-hidden rounded-[20px] p-6 sm:p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[400px] bg-[#A99FF5]">
            {/* Top Right Pattern */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 right-0 opacity-10" fill="none">
              <rect x="60" y="0" width="20" height="20" fill="#121212" />
              <rect x="100" y="0" width="20" height="20" fill="#121212" />
              <rect x="80" y="20" width="20" height="20" fill="#121212" />
              <rect x="60" y="40" width="20" height="20" fill="#121212" />
              <rect x="100" y="40" width="20" height="20" fill="#121212" />
              <rect x="80" y="60" width="20" height="20" fill="#121212" />
              <rect x="60" y="80" width="20" height="20" fill="#121212" />
              <rect x="100" y="80" width="20" height="20" fill="#121212" />
            </svg>

            <div className="relative z-10">
              <p className="font-inter font-extrabold text-[15px] sm:text-[17px] tracking-tight uppercase text-[#121212]">
                Core Builders Club
              </p>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 gap-4 text-center">
              {/* Simple SVG illustration mimicking the Genie Lamp */}
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="drop-shadow-sm">
                <path d="M30 70 Q50 90 70 70" stroke="#121212" strokeWidth="4" fill="none" />
                <path d="M40 40 Q50 20 60 40" stroke="#121212" strokeWidth="4" fill="none" />
                <path d="M20 60 Q50 80 80 60" stroke="#121212" strokeWidth="6" fill="none" />
                <circle cx="50" cy="60" r="15" fill="#121212" />
                <circle cx="45" cy="58" r="2" fill="#A99FF5" />
                <circle cx="55" cy="58" r="2" fill="#A99FF5" />
                <path d="M45 65 Q50 70 55 65" stroke="#A99FF5" strokeWidth="2" fill="none" />
              </svg>
              <div className="font-anton text-[32px] sm:text-[42px] leading-[0.9] tracking-tight text-[#121212]">
                My Role: Collector
              </div>
            </div>

            <div className="relative z-10 max-w-[80%] mt-4">
              <p className="font-inter font-medium text-[13px] sm:text-[15px] leading-snug text-[#121212]/80">
                You often save code, building a massive open-source collection.
              </p>
            </div>

            <WaveDecoration color="rgba(18,18,18,0.2)" />
            <SpotifyFooter color="rgba(18,18,18,0.6)" />
          </div>

          {/* Card 4: Dark / Grid */}
          <div ref={(el) => { cardRefs.current[3] = el; }} className="relative overflow-hidden rounded-[20px] p-6 sm:p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[400px] bg-[#121212]">
            {/* Top Right Pattern */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 right-0 opacity-20" fill="none">
              <path d="M120 0 L40 120 M120 20 L60 120 M120 40 L80 120 M120 60 L100 120 M120 80 L120 120" stroke="#FFFFFF" strokeWidth="8" />
            </svg>

            <div className="relative z-10">
              <p className="font-inter font-extrabold text-[15px] sm:text-[17px] tracking-tight uppercase text-white">
                You're in great company.
              </p>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center my-4">
              <div className="offset-shadow">
                <span className="font-anton text-[90px] sm:text-[130px] leading-[0.8] tracking-tight shadow-text text-[#A99FF5]">
                  34%
                </span>
                <span className="font-anton text-[90px] sm:text-[130px] leading-[0.8] tracking-tight front-text text-[#A99FF5]">
                  34%
                </span>
              </div>
              <p className="font-inter font-medium text-[13px] sm:text-[15px] leading-snug text-white/70 mt-2">
                of global listeners are in your club.
              </p>
            </div>

            <div className="relative z-10 mt-4">
              <p className="font-inter font-bold text-[11px] tracking-widest uppercase text-white/50 mb-3">
                Your club favorites
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-80" />
                </div>
                <div className="aspect-square rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 opacity-80" />
                </div>
                <div className="aspect-square rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-80" />
                </div>
                <div className="aspect-square rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-red-400 to-rose-500 opacity-80" />
                </div>
                <div className="aspect-square rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-80" />
                </div>
                <div className="aspect-square rounded bg-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-violet-500 opacity-80" />
                </div>
              </div>
            </div>

            <WaveDecoration color="rgba(255,255,255,0.2)" />
            <SpotifyFooter color="rgba(255,255,255,0.6)" />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Stats;