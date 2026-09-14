import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   Word-by-word reveal helpers (same pattern as Manifesto)
   ========================================================= */
function wrapWordsForReveal(element: HTMLElement): HTMLElement[] {
  const innerSpans: HTMLElement[] = [];
  const textNodes: Text[] = [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = (node as Text).parentElement;
      if (parent?.closest(".reveal-skip")) return NodeFilter.FILTER_REJECT;
      if (!node.textContent || !node.textContent.trim())
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node as Text);

  textNodes.forEach((textNode) => {
    const parts = (textNode.textContent || "").split(/(\s+)/);
    const fragment = document.createDocumentFragment();

    parts.forEach((part) => {
      if (part === "" || /^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
      } else {
        const mask = document.createElement("span");
        mask.className = "reveal-mask";

        const inner = document.createElement("span");
        inner.className = "reveal-inner";
        inner.textContent = part;

        mask.appendChild(inner);
        fragment.appendChild(mask);
        innerSpans.push(inner);
      }
    });

    textNode.parentNode?.replaceChild(fragment, textNode);
  });

  return innerSpans;
}

function unwrapRevealWords(root: HTMLElement) {
  root.querySelectorAll(".reveal-mask").forEach((mask) => {
    const inner = mask.querySelector(".reveal-inner");
    if (inner) {
      mask.parentNode?.replaceChild(
        document.createTextNode(inner.textContent || ""),
        mask
      );
    }
  });
  root.normalize();
}

/* =========================================================
   GLOBAL STYLES
   ========================================================= */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,400;1,600&display=swap');

  .font-inter { font-family: 'Inter', sans-serif; }

  .font-serif-light {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-weight: 400;
    text-transform: none;
    letter-spacing: normal;
  }

  .reveal-mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    line-height: inherit;
    padding-bottom: 0.15em;
    margin-bottom: -0.15em;
  }
  .reveal-inner {
    display: inline-block;
    line-height: inherit;
    will-change: transform;
    transform: translateY(110%);
  }

  .stat-number { color: #ffffff; }
  .stat-suffix { color: #ffffff; }

  .stat-label {
    display: inline-block;
    padding: 0.14em 0.42em;
    transform: rotate(-2deg);
    border-radius: 8px;
    line-height: 1;
    color: var(--stat-text-color, #ffffff);
    background-color: var(--stat-color, #F97316);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6);
  }
`;

/* =========================================================
   PATH GEOMETRY — only the entry segment changed.
   Starts higher (y=50) so the sweep to the right passes
   well ABOVE card 1 instead of grazing its top edge.
   ========================================================= */
const PATH_D =
  "M -50 50 " +
  "C 300 50, 700 150, 850 450 " +
  "C 960 620, 800 780, 500 900 " +
  "C 220 1020, 150 1000, 150 1150 " +
  "C 150 1350, 500 1450, 750 1600 " +
  "C 960 1720, 880 1800, 880 1900 " +
  "C 880 2100, 500 2220, 250 2400 " +
  "C 150 2500, 150 2550, 150 2650 " +
  "C 150 2850, 500 2900, 1050 2950";

/* =========================================================
   STATS DATA
   ========================================================= */
const STATS = [
  {
    value: 2500,
    suffix: "+",
    label: "Community Members",
    desc: "Builders from every corner of the world, shipping and learning together.",
    color: "#FACC15",
    textColor: "#000000",
  },
  {
    value: 50,
    suffix: "",
    label: "Team Members",
    desc: "Core maintainers, mentors and organizers keeping the wheels turning.",
    color: "#3B82F6",
    textColor: "#FFFFFF",
  },
  {
    value: 14,
    suffix: "",
    label: "Events",
    desc: "Online and onsite hands-on workshops, deep dives and in-person meetups hosted this year.",
    color: "#e63981",
    textColor: "#FFFFFF",
  },
  {
    value: null,
    override: "Coming Soon",
    label: "Hackathon",
    desc: "We're cooking up the next big weekend sprint. Stay tuned.",
    color: "#22C55E",
    textColor: "#FFFFFF",
  },
];

/* =========================================================
   MAIN SECTION
   ========================================================= */
export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const pathAreaRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardLabelRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const cardDescRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const cardNumRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pathArea = pathAreaRef.current;
    const path = pathRef.current;
    if (!section || !pathArea || !path) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const wrappedEls: HTMLElement[] = [];

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const counters = cardNumRefs.current.filter(Boolean) as HTMLSpanElement[];

      if (prefersReduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.set(path, { strokeDashoffset: 0 });
        counters.forEach((el) => {
          el.textContent = Number(el.dataset.count ?? 0).toLocaleString();
        });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 70 });
      counters.forEach((el) => {
        el.textContent = "0";
      });

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: `${length} ${length}`,
        strokeDashoffset: length,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: pathArea,
          start: "top 72%",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      type RevealTarget = { el: HTMLElement | null; stagger: number };
      const targets: RevealTarget[] = [
        { el: headlineRef.current, stagger: 0.06 },
        { el: descRef.current, stagger: 0.03 },
      ];
      cardLabelRefs.current.forEach((el) =>
        targets.push({ el, stagger: 0.05 })
      );
      cardDescRefs.current.forEach((el) =>
        targets.push({ el, stagger: 0.025 })
      );

      targets.forEach(({ el, stagger }) => {
        if (!el) return;
        const words = wrapWordsForReveal(el);
        if (!words.length) return;

        wrappedEls.push(el);
        gsap.set(words, { y: "110%" });

        const play = () => {
          gsap.to(words, {
            y: "0%",
            duration: 0.9,
            ease: "power3.out",
            stagger,
            overwrite: true,
          });
        };
        const reset = () => {
          gsap.to(words, {
            y: "110%",
            duration: 0.45,
            ease: "power2.in",
            stagger: stagger * 0.6,
            overwrite: true,
          });
        };

        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: play,
          onEnterBack: play,
          onLeaveBack: reset,
        });
      });

      cards.forEach((card) => {
        const enter = () =>
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });
        const leave = () =>
          gsap.to(card, {
            opacity: 0,
            y: 70,
            duration: 0.5,
            ease: "power2.in",
            overwrite: true,
          });

        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          onEnter: enter,
          onEnterBack: enter,
          onLeaveBack: leave,
        });
      });

      cardNumRefs.current.forEach((el, idx) => {
        if (!el) return;
        const card = cardRefs.current[idx];
        if (!card) return;

        const target = Number(el.dataset.count ?? 0);
        if (!target) return;
        const obj = { v: 0 };

        const start = () => {
          gsap.killTweensOf(obj);
          obj.v = 0;
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toLocaleString();
            },
          });
        };
        const reset = () => {
          gsap.killTweensOf(obj);
          obj.v = 0;
          el.textContent = "0";
        };

        ScrollTrigger.create({
          trigger: card,
          start: "top 82%",
          onEnter: start,
          onEnterBack: start,
          onLeaveBack: reset,
        });
      });

      return () => {
        wrappedEls.forEach((el) => unwrapRevealWords(el));
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative w-full overflow-hidden bg-black text-white"
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 pt-24 text-center sm:pt-32">
        <h2
          ref={headlineRef}
          className="font-inter whitespace-nowrap text-[26px] font-black uppercase leading-none tracking-tighter text-white sm:text-[44px] md:text-[64px] lg:text-[80px]"
        >
          <span className="font-serif-light">By</span> Builders,{" "}
          <span className="font-serif-light">For</span> Builders.
        </h2>

        <p
          ref={descRef}
          className="font-inter mx-auto mt-8 max-w-[540px] text-sm font-medium tracking-wide text-zinc-400 sm:text-base"
        >
          A look back at everything we've built, shipped, and accomplished
          together so far in 2026.
        </p>
      </div>

      <div ref={pathAreaRef} className="relative w-full">
        <svg
          viewBox="0 0 1000 3000"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke="#f9ae44"
            strokeWidth="60"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
          {STATS.map((stat, i) => {
            const isLeft = i % 2 === 0;
            const hasCounter = stat.value !== null && stat.value !== undefined;

            return (
              <div
                key={stat.label}
                className={`flex min-h-[60vh] w-full items-center md:min-h-[75vh] ${
                  isLeft ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`relative w-full max-w-[340px] rounded-2xl bg-black/70 p-5 backdrop-blur-sm md:max-w-[400px] md:bg-transparent md:p-0 md:backdrop-blur-none ${
                    isLeft ? "text-left" : "text-right"
                  }`}
                  style={
                    {
                      "--stat-color": stat.color,
                      "--stat-text-color": stat.textColor ?? "#FFFFFF",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={`flex items-baseline gap-1 ${
                      isLeft ? "" : "justify-end"
                    }`}
                  >
                    {hasCounter ? (
                      <>
                        <span
                          ref={(el) => {
                            cardNumRefs.current[i] = el;
                          }}
                          data-count={stat.value}
                          className="stat-number font-inter text-[56px] font-black leading-none tracking-tighter sm:text-[72px]"
                        >
                          0
                        </span>
                        {stat.suffix && (
                          <span className="stat-suffix font-inter text-3xl font-black leading-none sm:text-4xl">
                            {stat.suffix}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="stat-number font-inter text-[36px] font-black leading-none tracking-tighter sm:text-[48px]">
                        {stat.override}
                      </span>
                    )}
                  </div>

                  <h3
                    ref={(el) => {
                      cardLabelRefs.current[i] = el;
                    }}
                    className="font-inter mt-5 text-[22px] font-black uppercase leading-none tracking-tighter sm:text-[30px]"
                  >
                    <span className="stat-label">{stat.label}</span>
                  </h3>

                  <p
                    ref={(el) => {
                      cardDescRefs.current[i] = el;
                    }}
                    className="font-inter mt-4 text-[13px] font-medium leading-snug text-zinc-400 sm:text-[15px]"
                  >
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Stats;