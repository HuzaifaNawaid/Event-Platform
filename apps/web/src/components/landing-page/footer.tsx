"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   Word reveal helper (skips .reveal-skip)
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

const WORDMARK_TEXT = "AWSSBGBUKC";

const SOCIAL_LINKS = [
  { label: "LinkTree",  href: "http://linktr.ee/awscloudclub_bahria" },
  { label: "Instagram", href: "https://www.instagram.com/aws_sbg_bahria" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/aws-sbg-bahria/" },
  { label: "Meetup",    href: "https://meetup.com/aws-sbg-at-bahria-university" },
  { label: "Whatsapp",  href: "https://chat.whatsapp.com/DhSgaX7J6FyJ70d9EnVNq8" },
];

export function Footer() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const wordmarkRef  = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section  = sectionRef.current;
    const card     = cardRef.current;
    const content  = contentRef.current;
    const wordmark = wordmarkRef.current;

    if (!section || !card || !content || !wordmark) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const wrappedElements: HTMLElement[] = [];
    const allInners: HTMLElement[] = [];
    const letters: HTMLElement[] = [];

    const ctx = gsap.context(() => {
      // 1. Split wordmark into letters
      wordmark.innerHTML = "";
      Array.from(WORDMARK_TEXT).forEach((ch) => {
        const mask = document.createElement("span");
        mask.className = "wordmark-mask";
        const inner = document.createElement("span");
        inner.textContent = ch;
        mask.appendChild(inner);
        wordmark.appendChild(mask);
        letters.push(inner);
      });
      wordmark.classList.add("reveal-skip");

      // 2. Wrap every word in the content area
      const words = wrapWordsForReveal(content);
      if (words.length) {
        allInners.push(...words);
        wrappedElements.push(content);
      }

      // 3. Initial states
      if (!prefersReducedMotion) {
        gsap.set(section, {
          clipPath: "inset(100% 0% 0% 0%)",
          willChange: "clip-path",
        });
        gsap.set(card, {
          clipPath: "inset(100% 0% 0% 0%)",
          willChange: "clip-path",
        });
        if (allInners.length) gsap.set(allInners, { y: "110%" });
        if (letters.length)   gsap.set(letters,   { y: "110%" });
      }

      // 4. Master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      if (!prefersReducedMotion) {
        tl.to(section, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "power3.out",
        });

        tl.to(
          card,
          {
            clipPath: "inset(-4% -4% -4% -4%)",
            duration: 1.0,
            ease: "power3.out",
          },
          "-=0.6"
        );

        if (allInners.length) {
          tl.to(
            allInners,
            {
              y: "0%",
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.025,
            },
            "-=0.6"
          );
        }

        if (letters.length) {
          tl.to(
            letters,
            {
              y: "0%",
              duration: 1.0,
              ease: "power4.out",
              stagger: 0.045,
            },
            "-=0.5"
          );
        }
      }
    }, section);

    return () => {
      ctx.revert();
      wrappedElements.forEach((el) => unwrapRevealWords(el));
      wordmark.classList.remove("reveal-skip");
      wordmark.textContent = WORDMARK_TEXT;
      gsap.killTweensOf([...allInners, ...letters]);
      gsap.set([section, card], { clearProps: "clipPath,willChange" });
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full bg-[#0e0e0e] p-1.5 sm:p-2.5 lg:p-3"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap');

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
            }
            .wordmark-mask {
              display: inline-block;
              overflow: hidden;
              vertical-align: top;
              line-height: 1;
              padding-bottom: 0.06em;
              margin-bottom: -0.06em;
            }
            .wordmark-mask > span {
              display: inline-block;
              line-height: 1;
              will-change: transform;
            }
          `,
        }}
      />

      <footer
        ref={cardRef}
        className="w-full bg-[#f9ae44] rounded-2xl sm:rounded-[24px] overflow-hidden"
      >
        <div
          ref={contentRef}
          className="px-8 sm:px-14 lg:px-20 py-12 sm:py-16 lg:py-20"
        >
          {/* ── Top info row ──────────────────────────────── */}
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 text-black text-[10px] sm:text-[11px] font-['Inter'] font-medium leading-[1.55]">
            <div>
              <div>Mail Us</div>
              <a
                href="mailto:hi@aws-sbgbu.com"
                className="mt-1 inline-block hover:opacity-70 transition-opacity"
              >
                hi@aws-sbgbu.com
              </a>
            </div>
            <div className="sm:text-right">
              <div>Call Us At</div>
              <a
                href="tel:+923132458545"
                className="mt-1 inline-block hover:opacity-70 transition-opacity"
              >
                +92 313 2458545
              </a>
            </div>
          </div>

          {/* ── Giant wordmark ─────────────────────────────── */}
          <h1
            ref={wordmarkRef}
            className="text-black text-center select-none mt-8 sm:mt-12 lg:mt-14"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(3rem, 16vw, 20rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.02em",
            }}
          >
            {WORDMARK_TEXT}
          </h1>

          {/* ── Bottom row ─────────────────────────────────── */}
          <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 text-black text-[10px] sm:text-[11px] font-['Inter'] font-medium uppercase tracking-wider">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
              <span>© 2026</span>
              <span className="opacity-50">•</span>
              <span>
                All Rights Reserved by{" "}
                <a
                  href="https://tahahassan.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity underline-offset-2 hover:underline"
                >
                  Taha Hassan
                </a>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="opacity-70">Connect With Us</span>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

// "use client";

// import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
// import React, { useEffect, useRef, useState } from "react";

// const VB_X = -400;
// const VB_Y = -107;
// const VB_W = 1800;
// const VB_H = 500;

// const PATH =
//   "M-400 209.434 L1 209.434 " +
//   "C58.5872 255.935 387.926 325.938 482.583 209.434 " +
//   "C600.905 63.8051 525.516 -43.2211 427.332 19.9613 " +
//   "C329.149 83.1436 352.902 242.723 515.041 267.302 " +
//   "C644.752 286.966 943.56 181.94 995 156.5 " +
//   "L1400 156.5";

// const imgs = [
//   "https://cdn.cosmos.so/b9909337-7a53-48bc-9672-33fbd0f040a1?format=jpeg",
//   "https://cdn.cosmos.so/ecdc9dd7-2862-4c28-abb1-dcc0947390f3?format=jpeg",
//   "https://cdn.cosmos.so/79de41ec-baa4-4ac0-a9a4-c090005ca640?format=jpeg",
//   "https://cdn.cosmos.so/1a18b312-21cd-4484-bce5-9fb7ed1c5e01?format=jpeg",
//   "https://cdn.cosmos.so/d765f64f-7a66-462f-8b2d-3d7bc8d7db55?format=jpeg",
//   "https://cdn.cosmos.so/6b9f08ea-f0c5-471f-a620-71221ff1fb65?format=jpeg",
//   "https://cdn.cosmos.so/40a09525-4b00-4666-86f0-3c45f5d77605?format=jpeg",
//   "https://cdn.cosmos.so/14f05ab6-b4d0-4605-9007-8a2190a249d0?format=jpeg",
//   "https://cdn.cosmos.so/d05009a2-a2f8-4a4c-a0de-e1b0379dddb8?format=jpeg",
//   "https://cdn.cosmos.so/ba646e35-efc2-494a-961b-b40f597e6fc9?format=jpeg",
//   "https://cdn.cosmos.so/e899f9c3-ed48-4899-8c16-fbd5a60705da?format=jpeg",
//   "https://cdn.cosmos.so/24e83c11-c607-45cd-88fb-5059960b56a0?format=jpeg",
//   "https://cdn.cosmos.so/cd346bce-f415-4ea7-8060-99c5f7c1741a?format=jpeg",
// ];

// interface ItemProps {
//   pathRef: React.RefObject<SVGPathElement | null>;
//   pathLength: number;
//   index: number;
//   total: number;
//   offset: ReturnType<typeof useMotionValue<number>>;
//   children: React.ReactNode;
// }

// function MarqueeItem({
//   pathRef,
//   pathLength,
//   index,
//   total,
//   offset,
//   children,
// }: ItemProps) {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   useAnimationFrame(() => {
//     const path = pathRef.current;
//     if (!path || !pathLength) return;
//     const base = (index / total) * 100;
//     const wrapped = (((base + offset.get()) % 100) + 100) % 100;
//     const dist = (wrapped / 100) * pathLength;
//     const p = path.getPointAtLength(dist);
//     x.set(p.x - VB_X);
//     y.set(p.y - VB_Y);
//   });

//   return (
//     <motion.div
//       className="absolute top-0 left-0 will-change-transform"
//       style={{ x, y, translateX: "-50%", translateY: "-50%" }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// function MarqueeAlongSvgPath({
//   children,
//   baseVelocity = 8,
//   repeat = 2,
//   slowdownOnHover = true,
//   draggable = true,
//   grabCursor = true,
// }: {
//   children: React.ReactNode;
//   baseVelocity?: number;
//   repeat?: number;
//   slowdownOnHover?: boolean;
//   draggable?: boolean;
//   grabCursor?: boolean;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const pathRef = useRef<SVGPathElement | null>(null);
//   const [pathLength, setPathLength] = useState(0);
//   const [scale, setScale] = useState(1);
//   const [dragging, setDragging] = useState(false);

//   const baseOffset = useMotionValue(0);
//   const isHovered = useRef(false);
//   const isDragging = useRef(false);
//   const dragStart = useRef({ x: 0, offset: 0 });
//   const dragVel = useRef(0);
//   const lastX = useRef(0);
//   const lastT = useRef(0);
//   const visible = useRef(true);

//   useEffect(() => {
//     if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
//   }, []);

//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const update = () => setScale(el.clientHeight / VB_H);
//     update();
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([e]) => (visible.current = e.isIntersecting),
//       { threshold: 0 }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, []);

//   useAnimationFrame((_, delta) => {
//     if (!visible.current || !pathLength || isDragging.current) return;
//     const dt = delta / 1000;

//     let move = baseVelocity * dt;
//     if (slowdownOnHover && isHovered.current) move *= 0.25;

//     if (Math.abs(dragVel.current) > 0.001) {
//       move += -(dragVel.current * 1000 * (100 / VB_W)) * dt;
//       dragVel.current *= Math.pow(0.94, delta / 16.67);
//     } else {
//       dragVel.current = 0;
//     }

//     baseOffset.set(baseOffset.get() + move);
//   });

//   const onDown = (e: React.PointerEvent) => {
//     if (!draggable) return;
//     isDragging.current = true;
//     setDragging(true);
//     dragStart.current = { x: e.clientX, offset: baseOffset.get() };
//     lastX.current = e.clientX;
//     lastT.current = performance.now();
//     dragVel.current = 0;
//     (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
//   };

//   const onMove = (e: React.PointerEvent) => {
//     if (!draggable || !isDragging.current) return;
//     const delta = e.clientX - dragStart.current.x;
//     const factor = 100 / (VB_W * scale || 1);
//     baseOffset.set(dragStart.current.offset - delta * factor);

//     const now = performance.now();
//     const dt = now - lastT.current;
//     if (dt > 0) dragVel.current = (e.clientX - lastX.current) / dt;
//     lastX.current = e.clientX;
//     lastT.current = now;
//   };

//   const onUp = (e: React.PointerEvent) => {
//     if (!draggable) return;
//     isDragging.current = false;
//     setDragging(false);
//     (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
//   };

//   const childArray = React.Children.toArray(children);
//   const items = Array.from({ length: repeat }).flatMap((_, r) =>
//     childArray.map((c, i) => ({ key: `${r}-${i}`, node: c }))
//   );
//   const total = items.length;

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-full overflow-hidden"
//       style={{
//         cursor: grabCursor ? (dragging ? "grabbing" : "grab") : undefined,
//       }}
//       onPointerDown={onDown}
//       onPointerMove={onMove}
//       onPointerUp={onUp}
//       onPointerCancel={onUp}
//       onMouseEnter={() => (isHovered.current = true)}
//       onMouseLeave={() => (isHovered.current = false)}
//     >
//       <div
//         className="absolute top-1/2 left-1/2"
//         style={{
//           width: VB_W,
//           height: VB_H,
//           transform: `translate(-50%, -50%) scale(${scale})`,
//           transformOrigin: "center center",
//         }}
//       >
//         <svg
//           width={VB_W}
//           height={VB_H}
//           viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
//           className="absolute inset-0 pointer-events-none"
//           aria-hidden
//         >
//           <path ref={pathRef} d={PATH} fill="none" stroke="none" />
//         </svg>

//         {pathLength > 0 &&
//           items.map(({ key, node }, i) => (
//             <MarqueeItem
//               key={key}
//               pathRef={pathRef}
//               pathLength={pathLength}
//               index={i}
//               total={total}
//               offset={baseOffset}
//             >
//               {node}
//             </MarqueeItem>
//           ))}
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------
//    Footer
//    ------------------------------------------------------------------ */
// export function Footer() {
//   return (
//     <footer
//       id="contact"
//       className="relative w-full bg-[#050505] border-t border-white/10 overflow-hidden"
//     >
//       {/* Warm glow */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0"
//         style={{
//           background:
//             "radial-gradient(60% 70% at 50% 50%, rgba(255,153,0,0.10) 0%, rgba(255,153,0,0.03) 40%, transparent 75%)",
//         }}
//       />

//       {/* ── Marquee band with top/bottom margins ───────────── */}
//       <div
//         className="relative w-full overflow-hidden"
//         style={{
//           height: "clamp(320px, 42vw, 620px)",
//           marginTop: "clamp(48px, 6vw, 96px)",
//           marginBottom: "clamp(48px, 6vw, 96px)",
//         }}
//       >
//         <MarqueeAlongSvgPath
//           baseVelocity={9}
//           repeat={5}
//           slowdownOnHover
//           draggable
//           grabCursor
//         >
//           {imgs.map((src, i) => (
//             <div
//               key={i}
//               className="w-12 h-18 sm:w-14 sm:h-20 hover:scale-125 duration-300 ease-out"
//             >
//               <img
//                 src={src}
//                 alt=""
//                 className="w-full h-full object-cover rounded-[3px] select-none"
//                 draggable={false}
//               />
//             </div>
//           ))}
//         </MarqueeAlongSvgPath>
//       </div>

//       {/* ── Footer content ────────────────────────────────── */}
//       <div className="relative px-6 lg:px-16 pb-12">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 pb-16 border-b border-white/10">
//           <div>
//             <span className="text-[#FF9900] font-mono text-xs uppercase tracking-widest block mb-3">
//               {"// Let's Connect"}
//             </span>
//             <h2 className="font-['Syne'] font-extrabold text-4xl md:text-6xl uppercase mb-6 leading-[0.95]">
//               Let&apos;s bring your <br /> ideas to life!
//             </h2>
//             <p className="text-white/60 font-light max-w-md">
//               Ready to ship secure cloud systems and build world-class tech?
//               Reach out to our core team directly.
//             </p>
//           </div>

//           <div className="flex flex-col justify-start space-y-6">
//             <div>
//               <span className="text-xs font-mono text-white/40 uppercase block mb-1">
//                 Mail Us
//               </span>
//               <a
//                 href="mailto:hi@aws-sbgbu.com"
//                 className="font-['Syne'] font-bold text-xl md:text-2xl text-white hover:text-[#FF9900] transition-colors"
//               >
//                 hi@aws-sbgbu.com
//               </a>
//             </div>
//             <div>
//               <span className="text-xs font-mono text-white/40 uppercase block mb-1">
//                 Call Us At
//               </span>
//               <a
//                 href="tel:+923132458545"
//                 className="font-['Syne'] font-bold text-xl md:text-2xl text-white hover:text-[#FF9900] transition-colors"
//               >
//                 +92 313 2458545
//               </a>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
//           <div className="flex flex-wrap gap-6 uppercase tracking-widest font-semibold">
//             <a href="#" className="hover:text-white transition-colors">LinkTree</a>
//             <a href="#" className="hover:text-white transition-colors">Instagram</a>
//             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
//             <a href="#" className="hover:text-white transition-colors">Meetup</a>
//             <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
//           </div>
//           <div>Built with ♥︎ by Waqas Ishaque</div>
//         </div>
//       </div>
//     </footer>
//   );
// }