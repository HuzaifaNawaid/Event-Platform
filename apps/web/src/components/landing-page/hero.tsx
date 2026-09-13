import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    // =========================================================
    // INTRO ANIMATION
    // =========================================================
    const intro = gsap.timeline({
      defaults: {
        ease: "power4.out",
      },
    });

    intro
      .from(".hero-line-1", {
        y: 50,
        opacity: 0,
        duration: 0.9,
      })
      .from(
        ".hero-line-2",
        {
          y: 60,
          opacity: 0,
          duration: 1.0,
        },
        "-=0.65",
      )
      .from(
        ".hero-line-3",
        {
          y: 70,
          opacity: 0,
          duration: 1.1,
        },
        "-=0.75",
      )
      .from(
        ".hero-sticker",
        {
          scale: 0,
          rotation: -25,
          opacity: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: "back.out(2)",
        },
        "-=0.8",
      );

    // =========================================================
    // INDEPENDENT GOOGLE-EYE CURSOR TRACKING
    // =========================================================
    const leftPupil = hero.querySelector(
      ".eye-pupil-left",
    ) as SVGGElement | null;

    const rightPupil = hero.querySelector(
      ".eye-pupil-right",
    ) as SVGGElement | null;

    const leftEyeSocket = hero.querySelector(
      ".eye-socket-left",
    ) as SVGGElement | null;

    const rightEyeSocket = hero.querySelector(
      ".eye-socket-right",
    ) as SVGGElement | null;

    let removeEyeListener: (() => void) | null = null;

    if (
      leftPupil &&
      rightPupil &&
      leftEyeSocket &&
      rightEyeSocket
    ) {
      const movePupil = (
        pupil: SVGGElement,
        socket: SVGGElement,
        mouseX: number,
        mouseY: number,
      ) => {
        const rect = socket.getBoundingClientRect();

        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = mouseX - eyeCenterX;
        const dy = mouseY - eyeCenterY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxX = 6;
        const maxY = 5;

        if (distance < 0.01) {
          gsap.to(pupil, {
            attr: {
              transform: "translate(0, 0)",
            },
            duration: 0.12,
            ease: "power2.out",
            overwrite: true,
          });

          return;
        }

        const directionX = dx / distance;
        const directionY = dy / distance;

        const intensity = Math.min(distance / 140, 1);

        const targetX = directionX * maxX * intensity;
        const targetY = directionY * maxY * intensity;

        gsap.to(pupil, {
          attr: {
            transform: `translate(${targetX}, ${targetY})`,
          },
          duration: 0.12,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const handleMouseMoveEyes = (e: MouseEvent) => {
        movePupil(
          leftPupil,
          leftEyeSocket,
          e.clientX,
          e.clientY,
        );

        movePupil(
          rightPupil,
          rightEyeSocket,
          e.clientX,
          e.clientY,
        );
      };

      window.addEventListener(
        "mousemove",
        handleMouseMoveEyes,
        { passive: true },
      );

      removeEyeListener = () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMoveEyes,
        );
      };
    }

    // =========================================================
    // LETTER MICRO-INTERACTIONS
    //
    // UNITE & stays completely static.
    // =========================================================
    const interactiveChars = hero.querySelectorAll(
      ".interactive-char:not(.static-char)",
    );

    const charListeners: Array<() => void> = [];

    interactiveChars.forEach((char) => {
      const onMouseEnter = () => {
        gsap
          .timeline()
          .to(char, {
            y: -18,
            rotation: (Math.random() - 0.5) * 24,
            scaleY: 1.15,
            scaleX: 1.08,
            duration: 0.18,
            ease: "power2.out",
          })
          .to(char, {
            y: 0,
            rotation: 0,
            scaleY: 1,
            scaleX: 1,
            duration: 0.45,
            ease: "elastic.out(1.2, 0.4)",
          });
      };

      char.addEventListener("mouseenter", onMouseEnter);

      charListeners.push(() => {
        char.removeEventListener(
          "mouseenter",
          onMouseEnter,
        );
      });
    });

    // =========================================================
    // SUBTLE MOUSE PARALLAX
    // =========================================================
    const stickers = hero.querySelectorAll(".hero-sticker");

    const handleMouseMoveParallax = (e: MouseEvent) => {
      const normX =
        (e.clientX / window.innerWidth - 0.5) * 2;

      const normY =
        (e.clientY / window.innerHeight - 0.5) * 2;

      stickers.forEach((sticker, i) => {
        const depth = ((i % 3) + 1) * 7;

        gsap.to(sticker, {
          x: normX * depth,
          y: normY * depth,
          duration: 0.7,
          ease: "power1.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMoveParallax,
      { passive: true },
    );

    // =========================================================
    // CLEANUP
    // =========================================================
    return () => {
      intro.kill();

      removeEyeListener?.();

      window.removeEventListener(
        "mousemove",
        handleMouseMoveParallax,
      );

      charListeners.forEach((remove) => remove());

      gsap.killTweensOf(stickers);

      gsap.killTweensOf([
        leftPupil,
        rightPupil,
      ]);

      gsap.killTweensOf(interactiveChars);
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col selection:bg-[#ec4899] selection:text-white relative overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Bebas+Neue&family=Space+Grotesk:wght@700;900&display=swap');

            :root {
              --bg: #000000;
            }

            body {
              background-color: var(--bg);
              color: #ffffff;
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              overflow-x: hidden;
              margin: 0;
              padding: 0;
            }

            .hero-font {
              font-family: 'Anton', 'Bebas Neue', -apple-system, sans-serif;
              font-weight: 400;
              letter-spacing: 0.01em;
              line-height: 0.86;
              text-transform: uppercase;
            }

            .purple-oval-loop {
              position: absolute;
              inset: -16% -7%;
              width: 114%;
              height: 132%;
              pointer-events: none;
              z-index: 25;
              filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.45));
            }

            .ideas-starburst-badge {
              filter: drop-shadow(5px 7px 0px #000000);
              transition:
                transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                filter 0.28s ease;
            }

            .ideas-starburst-badge:hover {
              transform: scale(1.08) rotate(-4deg);
              filter: drop-shadow(7px 10px 0px #000000);
            }

            .interactive-char {
              display: inline-block;
              transition:
                transform 0.18s cubic-bezier(0.2, 1, 0.3, 1),
                color 0.15s ease,
                text-shadow 0.15s ease;
              cursor: default;
              will-change: transform;
            }

            .interactive-char:hover {
              transform: translateY(-16px) scaleY(1.1) scaleX(1.05) rotate(-3deg);
              color: #facc15 !important;
              text-shadow: 0 4px 20px rgba(250, 204, 21, 0.6);
            }

            .interactive-char-ignite:hover {
              transform: translateY(-16px) scale(1.12) rotate(4deg);
              color: #f43f5e !important;
              text-shadow: 0 4px 25px rgba(244, 63, 94, 0.7);
            }

            .static-char {
              display: inline-block;
              cursor: default;
            }

            .unite-gradient {
              background: linear-gradient(
                90deg,
                #ff7a00 0%,
                #ff9f1c 34%,
                #ffffff 78%,
                #ffffff 100%
              );
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }

            @keyframes float-subtle-1 {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }

              50% {
                transform: translateY(-8px) rotate(3deg);
              }
            }

            @keyframes float-subtle-2 {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }

              50% {
                transform: translateY(9px) rotate(-4deg);
              }
            }

            .anim-float-1 {
              animation: float-subtle-1 3.8s ease-in-out infinite;
            }

            .anim-float-2 {
              animation: float-subtle-2 4.4s ease-in-out infinite 0.3s;
            }

            .character-card-shadow {
              box-shadow:
                0 14px 28px -6px rgba(0, 0, 0, 0.6),
                0 0 0 3px #000000;
            }
          `,
        }}
      />

      <main
        ref={heroRef}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 lg:py-24 select-none overflow-hidden"
        id="hero-container"
      >
        <div className="relative z-30 flex flex-col items-center justify-center text-center max-w-[1400px] mx-auto w-full px-2">

          {/* =================================================
              LINE 1
              ================================================= */}
          <div className="hero-line-1 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-7 md:gap-x-9 leading-none relative z-30">

            {/* Blue Plus */}
            <div className="hero-sticker inline-flex items-center justify-center cursor-pointer group transform hover:rotate-90 transition-transform duration-300 mr-1 sm:mr-2">
              <svg
                className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                fill="none"
                viewBox="0 0 60 60"
              >
                <path
                  d="M30 6V54M6 30H54"
                  stroke="#3b82f6"
                  strokeLinecap="square"
                  strokeWidth="12"
                />
              </svg>
            </div>

            {/* WHERE */}
            <h1 className="hero-font text-white text-[clamp(3.5rem,10.5vw,9.5rem)] tracking-tight flex items-center">
              <span
                className="interactive-word"
                data-word="WHERE"
              >
                <span className="interactive-char">W</span>
                <span className="interactive-char">H</span>
                <span className="interactive-char">E</span>
                <span className="interactive-char">R</span>
                <span className="interactive-char">E</span>
              </span>
            </h1>

            {/* Yellow Smiley */}
            <div className="hero-sticker relative -my-4 -mx-1 sm:-mx-2 z-40 cursor-pointer group anim-float-1">
              <div className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-[0_8px_20px_rgba(250,204,21,0.55)]"
                  viewBox="0 0 90 90"
                >
                  <circle
                    cx="45"
                    cy="45"
                    fill="#facc15"
                    r="41"
                    stroke="#000000"
                    strokeWidth="4.5"
                  />

                  <ellipse
                    cx="32"
                    cy="36"
                    fill="#000000"
                    rx="4.5"
                    ry="6"
                  />

                  <ellipse
                    cx="58"
                    cy="36"
                    fill="#000000"
                    rx="4.5"
                    ry="6"
                  />

                  <path
                    d="M28 52 C35 68 55 68 62 52"
                    fill="none"
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeWidth="5.5"
                  />
                </svg>
              </div>
            </div>

            {/* BUILDERS */}
            <div className="relative inline-flex items-center">
              <svg
                className="purple-oval-loop"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 520 180"
              >
                <path
                  d="M 45 92 C 28 32, 140 12, 270 12 C 420 12, 498 38, 494 92 C 490 148, 380 170, 245 168 C 110 166, 25 142, 38 78 C 48 24, 175 16, 290 18"
                  stroke="#a855f7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="6.5"
                />
              </svg>

              <span className="hero-font text-white text-[clamp(3.5rem,10.5vw,9.5rem)] tracking-tight px-3 py-1 relative z-30">
                <span
                  className="interactive-word"
                  data-word="BUILDERS"
                >
                  <span className="interactive-char">B</span>
                  <span className="interactive-char">U</span>
                  <span className="interactive-char">I</span>
                  <span className="interactive-char">L</span>
                  <span className="interactive-char">D</span>
                  <span className="interactive-char">E</span>
                  <span className="interactive-char">R</span>
                  <span className="interactive-char">S</span>
                </span>
              </span>

              {/* CORE */}
              <div className="absolute -top-3 -right-2 sm:-top-5 sm:-right-4 z-40 rotate-12 cursor-pointer hover:rotate-45 transition-transform duration-300">
                <span className="bg-[#10b981] text-black font-extrabold font-mono text-[9px] sm:text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  ✦ CORE
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              LINE 2
              ================================================= */}
          <div className="hero-line-2 mt-2 sm:mt-4 md:mt-5 flex items-center justify-center gap-x-3 sm:gap-x-6 leading-none relative z-30 group">

            {/* Top Left Arrow */}
            <svg
              className="absolute -top-12 -left-12 w-16 h-16 text-orange-500 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out delay-75 pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="50" cy="50" r="40" />
              <path d="M30 50 L70 50 M50 30 L70 50 L50 70" />
            </svg>

            {/* Top Right Half Circle */}
            <svg
              className="absolute -top-10 -right-10 w-14 h-14 text-purple-500 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out delay-150 pointer-events-none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M50 10 A 40 40 0 0 1 50 90 Z" />
            </svg>

            {/* Bottom Left Green Line */}
            <svg
              className="absolute -bottom-10 -left-10 w-14 h-14 text-green-500 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out delay-200 pointer-events-none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            >
              <path d="M20 50 H80" />
              <circle
                cx="50"
                cy="50"
                r="5"
                fill="currentColor"
              />
            </svg>

            {/* Bottom Right Cursive Line */}
            <svg
              className="absolute -bottom-12 -right-12 w-20 h-16 text-[#facc15] opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:-rotate-6 transition-all duration-500 ease-out delay-100 pointer-events-none"
              viewBox="0 0 120 90"
              fill="none"
            >
              <path
                d="M8 68 C22 18, 58 12, 78 30 C96 46, 88 67, 66 64 C47 61, 42 43, 56 35"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M72 56 C86 48, 99 48, 112 57"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            {/* UNITE */}
            <span className="hero-font unite-gradient text-[clamp(3.5rem,10.5vw,9.5rem)] tracking-tight static-char">
              UNITE
            </span>

            {/* & */}
            <div className="relative inline-flex items-center">
              <span className="hero-font unite-gradient text-[clamp(3.5rem,10.5vw,9.5rem)] tracking-tight static-char">
                &
              </span>

              {/* Character Sticker */}
              <div className="hero-sticker absolute -top-12 -right-14 sm:-top-16 sm:-right-20 md:-top-20 md:-right-24 z-40 cursor-pointer group anim-float-1">
                <div className="relative transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6">

                  {/* Question Bubble */}
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-50">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#2563eb] border-2 border-black rounded-lg sm:rounded-xl flex items-center justify-center shadow-[2px_3px_0px_#000000] transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6">
                      <span className="text-white font-extrabold text-xs sm:text-sm font-mono">
                        ?
                      </span>
                    </div>
                  </div>

                  {/* Pink Character */}
                  <div className="w-24 sm:w-32 md:w-36 h-16 sm:h-20 md:h-22 rounded-2xl bg-[#ff2a6d] border-[3.5px] border-black character-card-shadow flex items-center justify-center px-2 py-1 relative rotate-[6deg] transition-transform duration-300 group-hover:-rotate-1">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      viewBox="0 0 110 60"
                    >
                      <g className="character-eye-pair">

                        {/* LEFT EYE SOCKET */}
                        <g
                          className="eye-socket-left"
                          transform="translate(12, 6)"
                        >
                          <ellipse
                            cx="20"
                            cy="24"
                            fill="#FFFFFF"
                            rx="18"
                            ry="22"
                            stroke="#000000"
                            strokeWidth="3.5"
                          />

                          {/* LEFT PUPIL */}
                          <g className="eye-pupil-left">
                            <circle
                              cx="20"
                              cy="24"
                              fill="#000000"
                              r="8.5"
                            />

                            <circle
                              cx="23"
                              cy="20"
                              fill="#FFFFFF"
                              r="3"
                            />
                          </g>

                          {/* EYELID */}
                          <path
                            d="M 2 20 C 10 9, 30 9, 38 20 L 38 6 L 2 6 Z"
                            fill="#ff2a6d"
                            stroke="#000000"
                            strokeWidth="3"
                          />
                        </g>

                        {/* RIGHT EYE SOCKET */}
                        <g
                          className="eye-socket-right"
                          transform="translate(56, 6)"
                        >
                          <ellipse
                            cx="20"
                            cy="24"
                            fill="#FFFFFF"
                            rx="18"
                            ry="22"
                            stroke="#000000"
                            strokeWidth="3.5"
                          />

                          {/* RIGHT PUPIL */}
                          <g className="eye-pupil-right">
                            <circle
                              cx="20"
                              cy="24"
                              fill="#000000"
                              r="8.5"
                            />

                            <circle
                              cx="23"
                              cy="20"
                              fill="#FFFFFF"
                              r="3"
                            />
                          </g>

                          {/* EYELID */}
                          <path
                            d="M 2 20 C 10 9, 30 9, 38 20 L 38 6 L 2 6 Z"
                            fill="#ff2a6d"
                            stroke="#000000"
                            strokeWidth="3"
                          />
                        </g>

                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              LINE 3
              ================================================= */}
          <div className="hero-line-3 mt-3 sm:mt-5 md:mt-7 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-9 leading-none relative z-30">

            {/* IDEAS */}
            <div className="ideas-starburst-badge cursor-pointer inline-flex items-center justify-center relative select-none">
              <div className="relative flex items-center justify-center">

                <svg
                  className="w-44 sm:w-60 md:w-76 h-22 sm:h-30 md:h-36 overflow-visible"
                  fill="none"
                  viewBox="0 0 320 160"
                >
                  <path
                    d="
                      M 160 4
                      L 182 28
                      L 214 12
                      L 226 40
                      L 258 32
                      L 260 62
                      L 294 66
                      L 284 96
                      L 314 110
                      L 292 132
                      L 310 156
                      L 278 162
                      L 276 190
                      L 244 182
                      L 230 208
                      L 202 190
                      L 180 212
                      L 160 190
                      L 140 212
                      L 118 190
                      L 90 208
                      L 76 182
                      L 44 190
                      L 42 162
                      L 10 156
                      L 28 132
                      L 6 110
                      L 36 96
                      L 26 66
                      L 60 62
                      L 62 32
                      L 94 40
                      L 106 12
                      L 138 28
                      Z
                    "
                    fill="#facc15"
                    stroke="#000000"
                    strokeLinejoin="round"
                    strokeWidth="7"
                    transform="translate(0, -26) scale(1, 0.88)"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="hero-font text-black text-[clamp(2.2rem,6.5vw,5rem)] tracking-wider font-extrabold uppercase -rotate-2">
                    IDEAS
                  </span>
                </div>
              </div>
            </div>

            {/* IGNITE */}
            <div className="relative inline-flex items-center">
              <h2 className="hero-font text-white text-[clamp(3.5rem,10.5vw,9.5rem)] tracking-tight flex items-center">
                <span
                  className="interactive-word"
                  data-word="IGNITE."
                >
                  <span className="interactive-char interactive-char-ignite">
                    I
                  </span>

                  <span className="interactive-char interactive-char-ignite">
                    G
                  </span>

                  <span className="interactive-char interactive-char-ignite">
                    N
                  </span>

                  <span className="interactive-char interactive-char-ignite">
                    I
                  </span>

                  <span className="interactive-char interactive-char-ignite">
                    T
                  </span>

                  <span className="interactive-char interactive-char-ignite">
                    E
                  </span>

                  <span className="interactive-char interactive-char-ignite text-[#facc15]">
                    .
                  </span>
                </span>
              </h2>

              {/* Quotes */}
              <div className="hero-sticker absolute -top-8 -right-8 sm:-top-12 sm:-right-14 md:-top-16 md:-right-18 z-40 cursor-pointer group anim-float-2">
                <div className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">

                  <svg
                    className="w-12 h-10 sm:w-16 sm:h-12 md:w-20 md:h-16 drop-shadow-[0_6px_18px_rgba(250,204,21,0.65)]"
                    fill="none"
                    viewBox="0 0 100 80"
                  >
                    <path
                      d="M12 46 C12 28, 24 14, 44 8 L46 20 C34 25, 29 32, 29 40 L44 40 L44 68 L12 68 Z"
                      fill="#facc15"
                    />

                    <path
                      d="M58 46 C58 28, 70 14, 90 8 L92 20 C80 25, 75 32, 75 40 L90 40 L90 68 L58 68 Z"
                      fill="#facc15"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}