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

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const feetSvgRef = useRef<SVGSVGElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const stickerRef = useRef<HTMLSpanElement>(null);
  const deepTechRef = useRef<HTMLSpanElement>(null);
  const wildIdeasRef = useRef<HTMLSpanElement>(null);
  const wildIdeasSvgRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const svgEl = feetSvgRef.current;
    if (!section || !svgEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const boxEl = section.querySelector(
      ".stacking-sheet-container"
    ) as HTMLElement | null;

    // =========================================================
    // WILD IDEAS SVG
    // =========================================================
    let wildIdeasPathLength = 0;
    if (wildIdeasSvgRef.current) {
      wildIdeasPathLength = wildIdeasSvgRef.current.getTotalLength();
      gsap.set(wildIdeasSvgRef.current, {
        strokeDasharray: wildIdeasPathLength,
        strokeDashoffset: wildIdeasPathLength,
      });
    }

    // =========================================================
    // INITIAL STATES
    // =========================================================
    if (!prefersReducedMotion) {
      [stickerRef.current, deepTechRef.current].forEach((el) => {
        if (el) {
          gsap.set(el, {
            clipPath: "inset(100% 0% 0% 0%)",
            willChange: "clip-path",
          });
        }
      });
      if (boxEl) {
        gsap.set(boxEl, {
          clipPath: "inset(100% 0% 0% 0%)",
          willChange: "clip-path",
        });
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 24 });
      }
    }

    // =========================================================
    // STICKY STACKING + BOX REVEAL
    // =========================================================
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero-container",
        start: "top top",
        end: "+=50%",
        pin: true,
        pinSpacing: false,
      });

      gsap.fromTo(
        "#initiative",
        { y: "0vh" },
        {
          y: "-50vh",
          ease: "none",
          scrollTrigger: {
            trigger: "#hero-container",
            start: "top top",
            end: "+=50%",
            scrub: true,
          },
        }
      );

      if (boxEl && !prefersReducedMotion) {
        gsap.to(boxEl, {
          clipPath: "inset(-5% -5% -5% -5%)",
          ease: "none",
          scrollTrigger: {
            trigger: "#hero-container",
            start: "top top",
            end: "+=50%",
            scrub: true,
          },
        });
      }
    }, section);

    // =========================================================
    // HOVER ANIMATIONS
    // =========================================================
    const handleStickerEnter = () => {
      gsap.to(stickerRef.current, {
        y: -8,
        rotate: -6,
        scale: 1.05,
        boxShadow: "6px 8px 0 #000, 0 0 15px rgba(0,0,0,0.3)",
        duration: 0.4,
        ease: "back.out(2)",
      });
    };
    const handleStickerLeave = () => {
      gsap.to(stickerRef.current, {
        y: 0,
        rotate: -2,
        scale: 1,
        boxShadow: "3px 3px 0 #000",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleDeepTechEnter = () => {
      gsap
        .timeline()
        .to(deepTechRef.current, {
          scale: 0.85,
          rotate: -8,
          duration: 0.1,
          ease: "power2.in",
        })
        .to(deepTechRef.current, {
          scale: 1.15,
          rotate: 4,
          backgroundColor: "#FF5500",
          color: "#000000",
          boxShadow: "4px 4px 0 #000",
          duration: 0.25,
          ease: "back.out(3)",
        })
        .to(deepTechRef.current, {
          scale: 1.05,
          rotate: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.3)",
        });
    };
    const handleDeepTechLeave = () => {
      gsap.to(deepTechRef.current, {
        scale: 1,
        rotate: 0,
        backgroundColor: "#000000",
        color: "#ffffff",
        boxShadow: "none",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleWildIdeasEnter = () => {
      gsap.to(wildIdeasSvgRef.current, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    const handleWildIdeasLeave = () => {
      gsap.to(wildIdeasSvgRef.current, {
        strokeDashoffset: wildIdeasPathLength,
        duration: 0.4,
        ease: "power2.in",
      });
    };

    stickerRef.current?.addEventListener("mouseenter", handleStickerEnter);
    stickerRef.current?.addEventListener("mouseleave", handleStickerLeave);
    deepTechRef.current?.addEventListener("mouseenter", handleDeepTechEnter);
    deepTechRef.current?.addEventListener("mouseleave", handleDeepTechLeave);
    wildIdeasRef.current?.addEventListener("mouseenter", handleWildIdeasEnter);
    wildIdeasRef.current?.addEventListener("mouseleave", handleWildIdeasLeave);

    // =========================================================
    // TEXT REVEAL
    // =========================================================
    const allRevealInners: HTMLElement[] = [];
    const wrappedElements: HTMLElement[] = [];

    if (!prefersReducedMotion) {
      [headlineRef.current, paragraphRef.current]
        .filter(Boolean)
        .forEach((el) => {
          const el2 = el as HTMLElement;
          const words = wrapWordsForReveal(el2);
          if (words.length) {
            allRevealInners.push(...words);
            wrappedElements.push(el2);
          }
        });
    }

    const playReveal = () => {
      if (prefersReducedMotion) return;

      if (allRevealInners.length) {
        gsap.to(allRevealInners, {
          y: "0%",
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.045,
          overwrite: true,
        });
      }

      gsap.killTweensOf([stickerRef.current, deepTechRef.current]);

      const pillTl = gsap.timeline();
      if (stickerRef.current) {
        pillTl.to(
          stickerRef.current,
          {
            clipPath: "inset(-50% -50% -50% -50%)",
            duration: 0.8,
            ease: "power3.out",
          },
          0.15
        );
      }
      if (deepTechRef.current) {
        pillTl.to(
          deepTechRef.current,
          {
            clipPath: "inset(-50% -50% -50% -50%)",
            duration: 0.8,
            ease: "power3.out",
          },
          0.65
        );
      }

      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 1.05,
          overwrite: true,
        });
      }
    };

    const resetReveal = () => {
      if (prefersReducedMotion) return;

      if (allRevealInners.length) {
        gsap.to(allRevealInners, {
          y: "110%",
          duration: 0.5,
          ease: "power2.in",
          overwrite: true,
        });
      }
      if (stickerRef.current) {
        gsap.to(stickerRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 0.4,
          ease: "power2.in",
          overwrite: true,
        });
      }
      if (deepTechRef.current) {
        gsap.to(deepTechRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 0.4,
          ease: "power2.in",
          overwrite: true,
        });
      }
      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.4,
          ease: "power2.in",
          overwrite: true,
        });
      }
    };

    const revealTrigger = ScrollTrigger.create({
      trigger: "#hero-container",
      start: "top top",
      end: "+=50%",
      onLeave: playReveal,
      onEnterBack: resetReveal,
    });

    // =========================================================
    // WALKING FEET BACKGROUND
    // =========================================================
    const FEET_STEPS = 9;
    const ICON_SIZE = 50;
    const MOUSE_REPEL = 35;
    const STEP_THRESHOLD = 70;
    const AGE_DECAY_MOVING = 0.05;
    const AGE_DECAY_STOPPED = 0.1;

    type FootPosition = { x: number; y: number; angle: number; age: number };
    type FootVisual = { opacity: number };

    const feetEls: SVGUseElement[] = [];
    const feetPositions: FootPosition[] = [];
    const feetVisual: FootVisual[] = [];

    const pointer = {
      x: 0,
      y: 0,
      angle: 0,
      moving: false,
      lastStampTime: 0,
    };

    let stepsCnt = 0;
    let accumDx = 0;
    let accumDy = 0;
    let introAnimationIsPlaying = false;
    let rafId = 0;
    let sectionVisible = true;

    const updateLayout = () => {
      const rect = section.getBoundingClientRect();
      svgEl.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);

    for (let i = 0; i < FEET_STEPS; i++) {
      const el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );
      el.setAttribute("href", i % 2 ? "#feet-left" : "#feet-right");
      el.setAttribute("x", `${-0.5 * ICON_SIZE}`);
      el.setAttribute("y", `${-0.5 * ICON_SIZE}`);
      el.setAttribute("width", `${ICON_SIZE}`);
      el.setAttribute("height", `${ICON_SIZE}`);
      el.setAttribute("fill", "rgba(0, 0, 0, 0.32)");
      el.style.opacity = "0";
      el.style.willChange = "transform, opacity";
      svgEl.appendChild(el);

      feetPositions.push({ x: 0, y: 0, angle: 0, age: 0 });
      feetVisual.push({ opacity: 0 });
      feetEls.push(el);
    }

    const applyFootTransform = (idx: number) => {
      const p = feetPositions[idx];
      const el = feetEls[idx];
      el.style.transform = `translate(${p.x - ICON_SIZE / 2}px, ${
        p.y - ICON_SIZE / 2
      }px) rotate(${p.angle}deg)`;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = svgEl.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const dx = x - pointer.x;
      const dy = y - pointer.y;
      pointer.x = x;
      pointer.y = y;
      pointer.angle = Math.atan2(dx, dy);
      pointer.moving = true;

      accumDx += dx;
      accumDy += dy;
      const accumDist = Math.sqrt(accumDx * accumDx + accumDy * accumDy);

      if (accumDist > STEP_THRESHOLD) {
        stepsCnt++;
        accumDx = 0;
        accumDy = 0;

        feetPositions.unshift({
          x: pointer.x - Math.sin(pointer.angle) * MOUSE_REPEL,
          y: pointer.y - Math.cos(pointer.angle) * MOUSE_REPEL,
          angle: (1 - pointer.angle / Math.PI) * 180,
          age: 1,
        });
        feetPositions.length = FEET_STEPS;

        for (let i = 1; i < FEET_STEPS; i++) {
          const isLeft = i % 2 === stepsCnt % 2;
          feetEls[i].setAttribute(
            "href",
            isLeft ? "#feet-left" : "#feet-right"
          );
          applyFootTransform(i);
        }
        feetEls[0].style.opacity = "0";
        applyFootTransform(0);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!introAnimationIsPlaying) onPointerMove(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!introAnimationIsPlaying && e.targetTouches[0]) {
        onPointerMove(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const stampFinalFeet = () => {
      gsap.killTweensOf([feetEls[0], feetEls[1]]);

      feetEls[0].setAttribute(
        "href",
        stepsCnt % 2 === 0 ? "#feet-left" : "#feet-right"
      );
      applyFootTransform(0);
      gsap.to(feetEls[0], {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });

      feetEls[1].setAttribute(
        "href",
        stepsCnt % 2 === 1 ? "#feet-left" : "#feet-right"
      );
      gsap.to(feetEls[1], {
        opacity: 1,
        duration: 0.25,
        delay: 0.1,
        ease: "power2.out",
      });
    };

    const render = () => {
      if (!sectionVisible) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const decay = pointer.moving ? AGE_DECAY_MOVING : AGE_DECAY_STOPPED;

      for (let i = 1; i < FEET_STEPS; i++) {
        const p = feetPositions[i];
        if (p.age > 0) {
          p.age -= decay;
          if (p.age < 0) p.age = 0;
        }
      }

      for (let i = 2; i < FEET_STEPS; i++) {
        const target = Math.max(0, feetPositions[i].age);
        const vis = feetVisual[i];
        if (Math.abs(target - vis.opacity) > 0.005) {
          feetEls[i].style.opacity = `${target}`;
          vis.opacity = target;
        }
      }

      if (pointer.moving) {
        pointer.moving = false;
      } else if (performance.now() - pointer.lastStampTime > 60) {
        if (stepsCnt > 0 && feetPositions[0].age > 0) {
          pointer.lastStampTime = performance.now();
          stampFinalFeet();
          feetPositions[0].age = 0;
        }
      }

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const io = new IntersectionObserver(
      (entries) => {
        sectionVisible = entries[0].isIntersecting;
      },
      { rootMargin: "200px" }
    );
    io.observe(section);

    const introAnimation = () => {
      introAnimationIsPlaying = true;
      const rect = svgEl.getBoundingClientRect();
      const mouseCoords = { x: -100, y: rect.height };

      gsap
        .timeline({
          onUpdate: () => {
            if (!introAnimationIsPlaying) return;
            onPointerMove(mouseCoords.x + rect.left, mouseCoords.y + rect.top);
          },
          onComplete: () => {
            introAnimationIsPlaying = false;
          },
        })
        .to(mouseCoords, { x: 0.4 * rect.width, ease: "power1.out" })
        .to(mouseCoords, { y: 0.6 * rect.height, ease: "back.out(3)" }, 0);
    };

    const introTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      once: true,
      onEnter: () => setTimeout(introAnimation, 300),
    });

    return () => {
      ctx.revert();
      introTrigger.kill();
      revealTrigger.kill();
      io.disconnect();
      cancelAnimationFrame(rafId);

      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);

      stickerRef.current?.removeEventListener("mouseenter", handleStickerEnter);
      stickerRef.current?.removeEventListener("mouseleave", handleStickerLeave);
      deepTechRef.current?.removeEventListener(
        "mouseenter",
        handleDeepTechEnter
      );
      deepTechRef.current?.removeEventListener(
        "mouseleave",
        handleDeepTechLeave
      );
      wildIdeasRef.current?.removeEventListener(
        "mouseenter",
        handleWildIdeasEnter
      );
      wildIdeasRef.current?.removeEventListener(
        "mouseleave",
        handleWildIdeasLeave
      );

      wrappedElements.forEach((el) => unwrapRevealWords(el));
      gsap.killTweensOf(allRevealInners);
      gsap.killTweensOf([stickerRef.current, deepTechRef.current, ctaRef.current]);

      if (stickerRef.current)
        gsap.set(stickerRef.current, { clearProps: "clipPath,willChange" });
      if (deepTechRef.current)
        gsap.set(deepTechRef.current, { clearProps: "clipPath,willChange" });
      if (boxEl) gsap.set(boxEl, { clearProps: "clipPath,willChange" });
      if (ctaRef.current)
        gsap.set(ctaRef.current, { clearProps: "opacity,transform" });

      gsap.killTweensOf(feetEls);
      feetEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="initiative"
      className="relative z-50 w-full pointer-events-auto"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

            .display-font {
              font-family: 'Anton', sans-serif;
              font-weight: 400;
              letter-spacing: -0.01em;
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
            }

            /* ============================================
               ANIMATED DRAWING-LINES CTA
               ============================================ */
            .manifesto-cta-btn {
              --line_color: #000000;
              --back_color: #FF5500;

              position: relative;
              z-index: 0;
              width: 240px;
              height: 56px;
              text-decoration: none;
              font-family: 'Plus Jakarta Sans', sans-serif;
              font-size: 14px;
              font-weight: 800;
              color: var(--line_color);
              letter-spacing: 2px;
              transition: all 0.3s ease;
              display: inline-block;
            }
            .manifesto-cta-btn .button__text {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              position: relative;
            }
            .manifesto-cta-btn::before,
            .manifesto-cta-btn::after,
            .manifesto-cta-btn .button__text::before,
            .manifesto-cta-btn .button__text::after {
              content: "";
              position: absolute;
              height: 3px;
              border-radius: 2px;
              background: var(--line_color);
              transition: all 0.5s ease;
            }
            .manifesto-cta-btn::before {
              top: 0;
              left: 54px;
              width: calc(100% - 56px * 2 - 16px);
            }
            .manifesto-cta-btn::after {
              top: 0;
              right: 54px;
              width: 8px;
            }
            .manifesto-cta-btn .button__text::before {
              bottom: 0;
              right: 54px;
              width: calc(100% - 56px * 2 - 16px);
            }
            .manifesto-cta-btn .button__text::after {
              bottom: 0;
              left: 54px;
              width: 8px;
            }
            .manifesto-cta-btn .button__line {
              position: absolute;
              top: 0;
              width: 56px;
              height: 100%;
              overflow: hidden;
            }
            .manifesto-cta-btn .button__line::before {
              content: "";
              position: absolute;
              top: 0;
              width: 150%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 300px;
              border: solid 3px var(--line_color);
            }
            .manifesto-cta-btn .button__line:nth-child(1),
            .manifesto-cta-btn .button__line:nth-child(1)::before {
              left: 0;
            }
            .manifesto-cta-btn .button__line:nth-child(2),
            .manifesto-cta-btn .button__line:nth-child(2)::before {
              right: 0;
            }
            .manifesto-cta-btn:hover {
              letter-spacing: 6px;
            }
            .manifesto-cta-btn:hover::before,
            .manifesto-cta-btn:hover .button__text::before {
              width: 8px;
            }
            .manifesto-cta-btn:hover::after,
            .manifesto-cta-btn:hover .button__text::after {
              width: calc(100% - 56px * 2 - 16px);
            }
            .manifesto-cta-btn .button__drow1,
            .manifesto-cta-btn .button__drow2 {
              position: absolute;
              z-index: -1;
              border-radius: 16px;
              transform-origin: 16px 16px;
            }
            .manifesto-cta-btn .button__drow1 {
              top: -16px;
              left: 40px;
              width: 32px;
              height: 0;
              transform: rotate(30deg);
            }
            .manifesto-cta-btn .button__drow2 {
              top: 44px;
              left: 77px;
              width: 32px;
              height: 0;
              transform: rotate(-127deg);
            }
            .manifesto-cta-btn .button__drow1::before,
            .manifesto-cta-btn .button__drow1::after,
            .manifesto-cta-btn .button__drow2::before,
            .manifesto-cta-btn .button__drow2::after {
              content: "";
              position: absolute;
            }
            .manifesto-cta-btn .button__drow1::before {
              bottom: 0;
              left: 0;
              width: 0;
              height: 32px;
              border-radius: 16px;
              transform-origin: 16px 16px;
              transform: rotate(-60deg);
            }
            .manifesto-cta-btn .button__drow1::after {
              top: -10px;
              left: 45px;
              width: 0;
              height: 32px;
              border-radius: 16px;
              transform-origin: 16px 16px;
              transform: rotate(69deg);
            }
            .manifesto-cta-btn .button__drow2::before {
              bottom: 0;
              left: 0;
              width: 0;
              height: 32px;
              border-radius: 16px;
              transform-origin: 16px 16px;
              transform: rotate(-146deg);
            }
            .manifesto-cta-btn .button__drow2::after {
              bottom: 26px;
              left: -40px;
              width: 0;
              height: 32px;
              border-radius: 16px;
              transform-origin: 16px 16px;
              transform: rotate(-262deg);
            }
            .manifesto-cta-btn .button__drow1,
            .manifesto-cta-btn .button__drow1::before,
            .manifesto-cta-btn .button__drow1::after,
            .manifesto-cta-btn .button__drow2,
            .manifesto-cta-btn .button__drow2::before,
            .manifesto-cta-btn .button__drow2::after {
              background: var(--back_color);
            }
            .manifesto-cta-btn:hover .button__drow1 {
              animation: cta-drow1 ease-in 0.06s forwards;
            }
            .manifesto-cta-btn:hover .button__drow1::before {
              animation: cta-drow2 linear 0.08s 0.06s forwards;
            }
            .manifesto-cta-btn:hover .button__drow1::after {
              animation: cta-drow3 linear 0.03s 0.14s forwards;
            }
            .manifesto-cta-btn:hover .button__drow2 {
              animation: cta-drow4 linear 0.06s 0.2s forwards;
            }
            .manifesto-cta-btn:hover .button__drow2::before {
              animation: cta-drow3 linear 0.03s 0.26s forwards;
            }
            .manifesto-cta-btn:hover .button__drow2::after {
              animation: cta-drow5 linear 0.06s 0.32s forwards;
            }
            @keyframes cta-drow1 { 0% { height: 0; } 100% { height: 100px; } }
            @keyframes cta-drow2 { 0% { width: 0; opacity: 0; } 10% { opacity: 0; } 11% { opacity: 1; } 100% { width: 120px; } }
            @keyframes cta-drow3 { 0% { width: 0; } 100% { width: 80px; } }
            @keyframes cta-drow4 { 0% { height: 0; } 100% { height: 120px; } }
            @keyframes cta-drow5 { 0% { width: 0; } 100% { width: 124px; } }

            @media (max-width: 480px) {
              .manifesto-cta-btn {
                width: 200px;
                height: 50px;
                font-size: 13px;
                letter-spacing: 1.6px;
              }
              .manifesto-cta-btn::before,
              .manifesto-cta-btn .button__text::before {
                left: 46px;
                right: 46px;
                width: calc(100% - 46px * 2 - 12px);
              }
              .manifesto-cta-btn::after,
              .manifesto-cta-btn .button__text::after {
                width: 6px;
                right: 46px;
                left: 46px;
              }
              .manifesto-cta-btn .button__line {
                width: 48px;
              }
            }
          `,
        }}
      />

      <div className="stacking-sheet-container relative w-full overflow-hidden rounded-t-[36px] rounded-b-[36px] sm:rounded-t-[52px] sm:rounded-b-[52px] lg:rounded-t-[60px] lg:rounded-b-[60px] border-4 border-black bg-[#F4A62A] text-black px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.8),0_-2px_0_1px_rgba(255,255,255,0.15)]">
        {/* 👣 FEET BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[inherit]">
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <path
                id="feet-shape"
                d="M41.5,30.2C36,24.6,4.7,26.1,7.7,49.4c.8,5.9,4,10.2,8,19.9,3,7.2-.1,15.7,5.8,20.8S43,91.6,38.6,75.9c-1.8-6.5-7.6-9.3-8.9-14.1C26.1,47.9,51.7,40.6,41.5,30.2Z M41.7,7.6c-2.6-.3-5.2,2.8-5.6,7s1.3,7.8,3.9,8.1,5.2-2.9,5.6-7.1S44.4,7.8,41.7,7.6Z M28.8,21.9c2.2.2,4.1-2.1,4.5-5.1s-1.1-5.7-3.2-6-4.1,2.1-4.5,5.1S26.7,21.6,28.8,21.9Z M20.1,23.3c1.6.1,3.1-1.8,3.4-4.4s-.8-4.7-2.4-4.9-3,1.8-3.3,4.3S18.5,23.1,20.1,23.3Z M14.9,25.5c1.4-.2,2.4-1.9,2.1-3.9s-1.6-3.4-3-3.3-2.4,2-2.2,3.9S13.4,25.7,14.9,25.5Z M10.9,29.2c1-.1,1.7-1.4,1.5-2.8s-1.1-2.5-2.2-2.4-1.7,1.4-1.6,2.8S9.8,29.3,10.9,29.2Z"
              />
              <symbol id="feet-left" viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" fill="none" />
                <use href="#feet-shape" />
              </symbol>
              <symbol id="feet-right" viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" fill="none" />
                <g transform="scale(-1, 1) translate(-100, 0)">
                  <use href="#feet-shape" />
                </g>
              </symbol>
            </defs>
          </svg>

          <svg
            ref={feetSvgRef}
            className="absolute inset-0 w-full h-full block"
            preserveAspectRatio="none"
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto max-w-[1280px] text-center">
          <div className="mb-4 inline-block rotate-[-2deg]">
            <span
              ref={stickerRef}
              className="reveal-skip inline-block cursor-pointer rounded-md border-2 border-black bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-black shadow-[3px_3px_0_#000] sm:text-sm"
            >
              ★ The Builder&apos;s Manifesto
            </span>
          </div>

          <h2
            ref={headlineRef}
            className="display-font mx-auto max-w-5xl text-3xl uppercase leading-[0.95] text-black sm:text-4xl md:text-5xl lg:text-[3.75rem]"
          >
            NO BOUNDARIES, NO LIMITS,{" "}
            <br className="hidden sm:block" />
            AND NO PREDEFINED BOXES.
          </h2>

          <p
            ref={paragraphRef}
            className="mx-auto mt-6 max-w-5xl font-['Plus_Jakarta_Sans'] text-lg font-bold leading-snug text-black/90 sm:mt-8 sm:text-2xl md:text-3xl sm:leading-normal"
          >
            Whether it&apos;s{" "}
            <span
              ref={deepTechRef}
              className="reveal-skip inline-block cursor-pointer -rotate-1 rounded-md bg-black px-2 py-0.5 text-white"
            >
              deep tech
            </span>
            , code, design, or{" "}
            <span
              ref={wildIdeasRef}
              className="relative inline-block cursor-pointer px-1"
            >
              wild ideas
              <svg
                className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] pointer-events-none z-0"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  ref={wildIdeasSvgRef}
                  d="M 12,25 C 12,8 40,2 70,5 C 95,8 98,25 95,40 C 90,55 60,48 40,48 C 15,48 5,40 12,25 Z"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>{" "}
            that haven&apos;t been named yet, we give every student the freedom
            to build, break, and bring tomorrow&apos;s world to life.
          </p>

          {/* CTA */}
          <div className="mt-14 flex items-center justify-center sm:mt-16">
            <a
              ref={ctaRef}
              href="#divisions"
              className="manifesto-cta-btn"
              aria-label="Enter"
            >
              <div className="button__line" />
              <div className="button__line" />
              <span className="button__text">Become Builder</span>
              <div className="button__drow1" />
              <div className="button__drow2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Manifesto;