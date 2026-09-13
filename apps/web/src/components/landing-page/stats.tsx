import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   TYPES + DATA
   ========================================================= */

type Shape = "crown" | "flower" | "rainbow" | "starburst" | "planet";

type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  hint: string;
  color: string;
  shape: Shape;
};

const STATS: Stat[] = [
  {
    id: "team",
    label: "Core Team",
    value: 24,
    suffix: "+",
    hint: "builders leading the community",
    color: "#38bdf8",
    shape: "crown",
  },
  {
    id: "members",
    label: "Active Members",
    value: 480,
    suffix: "+",
    hint: "students shipping every week",
    color: "#f472b6",
    shape: "flower",
  },
  {
    id: "events",
    label: "Events & Workshops",
    value: 36,
    suffix: "+",
    hint: "hands-on sessions delivered",
    color: "#a78bfa",
    shape: "rainbow",
  },
  {
    id: "hackathons",
    label: "Hackathons",
    value: 8,
    hint: "48-hour build sprints hosted",
    color: "#fde047",
    shape: "starburst",
  },
  {
    id: "community",
    label: "Community Day",
    value: 12,
    hint: "AWS-led mega meetups",
    color: "#34d399",
    shape: "planet",
  },
];

/* =========================================================
   LAYOUT MATH
   ========================================================= */

type Pt = { x: number; y: number };

type Layout = {
  width: number;
  height: number;
  d: string;
  nodes: Pt[];
  cards: { x: number; y: number; w: number; side: "left" | "right" }[];
};

const ROW_H = 260;
const PAD_TOP = 190;
const PAD_BOTTOM = 130;
const TAIL = 156;
const CORNER_R = 36;

/** Builds an SVG path from a polyline with rounded corners,
 *  and returns the midpoint of each corner curve. */
function roundedPolyline(pts: Pt[], r: number) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  const corners: Pt[] = [];

  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];

    const v1x = p1.x - p0.x;
    const v1y = p1.y - p0.y;
    const v2x = p2.x - p1.x;
    const v2y = p2.y - p1.y;

    const l1 = Math.hypot(v1x, v1y) || 1;
    const l2 = Math.hypot(v2x, v2y) || 1;

    const rr = Math.min(r, l1 / 2, l2 / 2);

    const ax = p1.x - (v1x / l1) * rr;
    const ay = p1.y - (v1y / l1) * rr;
    const bx = p1.x + (v2x / l2) * rr;
    const by = p1.y + (v2y / l2) * rr;

    d += ` L ${ax} ${ay} Q ${p1.x} ${p1.y} ${bx} ${by}`;

    corners.push({
      x: 0.25 * ax + 0.5 * p1.x + 0.25 * bx,
      y: 0.25 * ay + 0.5 * p1.y + 0.25 * by,
    });
  }

  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return { d, corners };
}

function computeLayout(W: number): Layout {
  const ys = STATS.map((_, i) => PAD_TOP + i * ROW_H);
  const height = PAD_TOP + (STATS.length - 1) * ROW_H + TAIL + PAD_BOTTOM;

  /* ---------- MOBILE: straight rail on the left, cards to the right ---------- */
  if (W < 768) {
    const railX = 26;
    const gap = 22;
    const cardX = railX + gap;
    const cardW = Math.max(180, W - cardX - 16);

    return {
      width: W,
      height,
      d: `M ${railX} 0 L ${railX} ${height}`,
      nodes: ys.map((y) => ({ x: railX, y })),
      cards: ys.map((y) => ({ x: cardX, y, w: cardW, side: "right" as const })),
    };
  }

  /* ---------- DESKTOP: snake across the full width ---------- */
  const xL = W * 0.34;
  const xR = W * 0.66;
  const gap = Math.max(40, W * 0.035);
  const cardW = Math.min(xL - gap, 460);

  const pts: Pt[] = [
    { x: -12, y: ys[0] }, // enters from the left edge of the screen
    { x: xR, y: ys[0] }, // node 0  → card right
    { x: xR, y: ys[1] },
    { x: xL, y: ys[1] }, // node 1  → card left
    { x: xL, y: ys[2] },
    { x: xR, y: ys[2] }, // node 2  → card right
    { x: xR, y: ys[3] },
    { x: xL, y: ys[3] }, // node 3  → card left
    { x: xL, y: ys[4] },
    { x: xR, y: ys[4] }, // node 4  → card right
    { x: xR, y: ys[4] + TAIL },
  ];

  const { d, corners } = roundedPolyline(pts, CORNER_R);
  const nodes = [corners[0], corners[2], corners[4], corners[6], corners[8]];

  const cards = ys.map((y, i) => {
    const side: "left" | "right" = i % 2 === 0 ? "right" : "left";
    const x = side === "right" ? xR + gap : xL - gap - cardW;
    return { x, y, w: cardW, side };
  });

  return { width: W, height, d, nodes, cards };
}

/* =========================================================
   ICONS
   ========================================================= */

function StatIcon({ shape, color, size = 52 }: { shape: Shape; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" className="shrink-0">
      {shape === "crown" && (
        <path d="M14 78 L10 30 L33 52 L50 18 L67 52 L90 30 L86 78 Z" fill={color} strokeLinejoin="round" />
      )}

      {shape === "flower" && (
        <g fill={color}>
          <circle cx="50" cy="26" r="17" />
          <circle cx="73" cy="42" r="17" />
          <circle cx="64" cy="70" r="17" />
          <circle cx="36" cy="70" r="17" />
          <circle cx="27" cy="42" r="17" />
          <circle cx="50" cy="50" r="10" fill="#0a0a0a" />
        </g>
      )}

      {shape === "rainbow" && (
        <g strokeLinecap="round" fill="none">
          <path d="M12 80 A38 38 0 0 1 88 80" stroke="#f472b6" strokeWidth="12" />
          <path d="M27 80 A23 23 0 0 1 73 80" stroke="#fde047" strokeWidth="12" />
          <path d="M42 80 A8 8 0 0 1 58 80" stroke="#34d399" strokeWidth="12" />
        </g>
      )}

      {shape === "starburst" && (
        <path
          d="M96 50 L65.7 56.5 L82.5 82.5 L56.5 65.7 L50 96 L43.5 65.7 L17.5 82.5 L34.3 56.5 L4 50 L34.3 43.5 L17.5 17.5 L43.5 34.3 L50 4 L56.5 34.3 L82.5 17.5 L65.7 43.5 Z"
          fill={color}
          strokeLinejoin="round"
        />
      )}

      {shape === "planet" && (
        <>
          <circle cx="50" cy="50" r="26" fill={color} />
          <ellipse
            cx="50"
            cy="50"
            rx="44"
            ry="13"
            fill="none"
            stroke="#fde047"
            strokeWidth="7"
            transform="rotate(-20 50 50)"
          />
        </>
      )}
    </svg>
  );
}

/* =========================================================
   BACKGROUND DECORATIONS
   ========================================================= */

function Deco({ kind, color }: { kind: string; color: string }) {
  if (kind === "squiggle") {
    return (
      <svg viewBox="0 0 124 60" fill="none" className="h-full w-full">
        <path
          d="M6 34 Q 20 4 34 34 T 62 34 T 90 34 T 118 34"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "sparkle") {
    return (
      <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
        <path d="M50 0 Q 56 44 100 50 Q 56 56 50 100 Q 44 56 0 50 Q 44 44 50 0 Z" fill={color} />
      </svg>
    );
  }
  if (kind === "flower") {
    return (
      <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
        <g fill={color}>
          <circle cx="50" cy="24" r="18" />
          <circle cx="75" cy="42" r="18" />
          <circle cx="65" cy="72" r="18" />
          <circle cx="35" cy="72" r="18" />
          <circle cx="25" cy="42" r="18" />
        </g>
      </svg>
    );
  }
  return null;
}

const DECOS = [
  { kind: "squiggle", color: "#ffffff", left: "32%", top: "2.5%", w: 150, opacity: 0.16 },
  { kind: "sparkle", color: "#fde047", left: "85%", top: "19%", w: 74, opacity: 0.6 },
  { kind: "flower", color: "#f472b6", left: "9%", top: "42%", w: 92, opacity: 0.32 },
  { kind: "sparkle", color: "#38bdf8", left: "88%", top: "66%", w: 62, opacity: 0.55 },
  { kind: "squiggle", color: "#34d399", left: "11%", top: "88%", w: 140, opacity: 0.2 },
];

/* =========================================================
   COMPONENT
   ========================================================= */

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const connRefs = useRef<Array<SVGLineElement | null>>([]);

  const [layout, setLayout] = useState<Layout | null>(null);

  /* ---------------- measure + build geometry ---------------- */
  useIsoLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      if (!w) return;
      setLayout(computeLayout(w));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------------- scroll animation ---------------- */
  useEffect(() => {
    if (!layout) return;

    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;

    const nums = numRefs.current;
    const cards = cardRefs.current;
    const nodes = nodeRefs.current;
    const conns = connRefs.current;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- reduced motion: everything static & visible ---------- */
    if (prefersReduced) {
      gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
      gsap.set(dotRef.current, { opacity: 0 });
      cards.forEach((c) => c && gsap.set(c, { opacity: 1, x: 0 }));
      nodes.forEach((n) => n && gsap.set(n, { opacity: 1, scale: 1 }));
      conns.forEach((c) => c && gsap.set(c, { opacity: 0.45 }));
      STATS.forEach((s, i) => {
        if (nums[i]) nums[i]!.textContent = `${s.value}${s.suffix ?? ""}`;
      });
      return;
    }

    const total = path.getTotalLength();

    /* Find the arc-length progress at which the path passes each node,
       so card reveals stay perfectly in sync with the drawing line. */
    const nodeProgress = layout.nodes.map((node) => {
      const STEPS = 320;
      let bestL = 0;
      let bestD = Infinity;
      for (let s = 0; s <= STEPS; s++) {
        const l = (s / STEPS) * total;
        const p = path.getPointAtLength(l);
        const d = (p.x - node.x) ** 2 + (p.y - node.y) ** 2;
        if (d < bestD) {
          bestD = d;
          bestL = l;
        }
      }
      return bestL / total;
    });

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: total, strokeDashoffset: total });
      gsap.set(dotRef.current, { opacity: 0 });

      const dot = dotRef.current;
      const proxy = { p: 0 };

      /* ONE scrubbed timeline drives everything → guaranteed sync */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          end: "bottom 78%",
          scrub: 0.6,
        },
      });

      /* 1. draw the path + move the travelling dot */
      tl.to(
        proxy,
        {
          p: 1,
          duration: 1,
          ease: "none",
          onUpdate: () => {
            const l = proxy.p * total;
            path.style.strokeDashoffset = `${total - l}`;

            if (dot) {
              const pt = path.getPointAtLength(l);
              dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
              dot.style.opacity = proxy.p > 0.002 && proxy.p < 0.998 ? "1" : "0";
            }
          },
        },
        0
      );

      /* 2. per-stat reveal, synced to the node the line reaches */
      STATS.forEach((stat, i) => {
        const t = nodeProgress[i];
        const card = cards[i];
        const node = nodes[i];
        const conn = conns[i];
        const num = nums[i];
        const { side } = layout.cards[i];
        const nodePt = layout.nodes[i];

        /* connector fades in just before the line arrives */
        if (conn) {
          tl.fromTo(
            conn,
            { opacity: 0 },
            { opacity: 0.45, duration: 0.06 },
            Math.max(0, t - 0.055)
          );
        }

        /* node pops */
        if (node) {
          tl.fromTo(
            node,
            { scale: 0, opacity: 0, svgOrigin: `${nodePt.x} ${nodePt.y}` },
            { scale: 1, opacity: 1, duration: 0.075, ease: "back.out(2.2)" },
            Math.max(0, t - 0.035)
          );
        }

        /* card slides + fades in */
        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, x: side === "right" ? -44 : 44 },
            { opacity: 1, x: 0, duration: 0.085, ease: "power2.out" },
            Math.max(0, t - 0.05)
          );
        }

        /* number count-up */
        if (num) {
          const counter = { v: 0 };
          tl.to(
            counter,
            {
              v: stat.value,
              duration: 0.17,
              ease: "power1.out",
              onUpdate: () => {
                num.textContent = `${Math.round(counter.v)}${stat.suffix ?? ""}`;
              },
            },
            Math.max(0, t - 0.03)
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [layout]);

  /* ---------------- render ---------------- */
  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative w-full overflow-hidden bg-[#0a0a0a]"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

            .stats-num {
              font-family: 'Anton', 'Arial Narrow', 'Space Grotesk', sans-serif;
              font-weight: 400;
              line-height: 0.92;
              letter-spacing: -0.015em;
              font-size: clamp(38px, 4.6vw, 56px);
              color: #ffffff;
              font-variant-numeric: tabular-nums;
            }
            .stats-label {
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              font-size: 11px;
              line-height: 1;
              letter-spacing: 0.24em;
              text-transform: uppercase;
            }
            .stats-hint {
              font-family: 'JetBrains Mono', monospace;
              font-weight: 400;
              font-size: 11.5px;
              line-height: 1.5;
              color: rgba(255,255,255,0.4);
            }
            .stats-year {
              font-family: 'Anton', sans-serif;
              font-size: 26px;
              line-height: 1;
              letter-spacing: 0.02em;
              color: rgba(255,255,255,0.22);
            }
          `,
        }}
      />

      <div ref={wrapRef} className="relative mx-auto w-full max-w-[1920px]">
        {/* ---------- decorations (desktop only) ---------- */}
        {DECOS.map((d, i) => (
          <div
            key={i}
            className="pointer-events-none absolute hidden select-none md:block"
            style={{
              left: d.left,
              top: d.top,
              width: d.w,
              opacity: d.opacity,
            }}
          >
            <Deco kind={d.kind} color={d.color} />
          </div>
        ))}

        {/* ---------- header ---------- */}
        <div className="pointer-events-none absolute left-6 top-7 z-20 sm:left-10 sm:top-9">
          <p className="stats-label" style={{ color: "#fde047" }}>
            By the numbers
          </p>
          <p className="stats-year mt-2">2025</p>
        </div>

        <div
          className="relative w-full"
          style={{ height: layout ? `${layout.height}px` : "1516px" }}
        >
          {/* ---------- SVG LAYER ---------- */}
          {layout && (
            <svg
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
              fill="none"
            >
              <defs>
                <filter id="stats-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* connectors */}
              {layout.cards.map((c, i) => {
                const n = layout.nodes[i];
                const x2 = c.side === "right" ? c.x : c.x + c.w;
                return (
                  <line
                    key={`conn-${STATS[i].id}`}
                    ref={(el) => {
                      connRefs.current[i] = el;
                    }}
                    x1={n.x}
                    y1={n.y}
                    x2={x2}
                    y2={c.y}
                    stroke={STATS[i].color}
                    strokeWidth={2}
                    strokeDasharray="7 7"
                    strokeLinecap="round"
                    opacity={0.45}
                  />
                );
              })}

              {/* the snaking path */}
              <path
                ref={pathRef}
                d={layout.d}
                stroke="#fde047"
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#stats-glow)"
              />

              {/* travelling dot */}
              <g ref={dotRef} opacity={0}>
                <circle r={17} fill="#fde047" opacity={0.28} />
                <circle r={9} fill="#fde047" />
                <circle r={3.5} fill="#0a0a0a" />
              </g>

              {/* nodes */}
              {layout.nodes.map((n, i) => (
                <g
                  key={`node-${STATS[i].id}`}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={20}
                    stroke={STATS[i].color}
                    strokeWidth={2}
                    opacity={0.35}
                  />
                  <circle cx={n.x} cy={n.y} r={11} fill={STATS[i].color} />
                  <circle cx={n.x} cy={n.y} r={4} fill="#0a0a0a" />
                </g>
              ))}
            </svg>
          )}

          {/* ---------- CARD LAYER ---------- */}
          {layout &&
            layout.cards.map((c, i) => {
              const stat = STATS[i];
              return (
                <div
                  key={stat.id}
                  className="absolute z-10"
                  style={{
                    left: `${c.x}px`,
                    top: `${c.y}px`,
                    width: `${c.w}px`,
                    transform: "translateY(-50%)",
                  }}
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 opacity-0"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="flex items-center gap-4">
                      <StatIcon shape={stat.shape} color={stat.color} />
                      <span
                        ref={(el) => {
                          numRefs.current[i] = el;
                        }}
                        className="stats-num"
                      >
                        {stat.value}
                        {stat.suffix ?? ""}
                      </span>
                    </div>

                    <div className="mt-4 h-px w-full bg-white/[0.07]" />

                    <p className="stats-label mt-3" style={{ color: stat.color }}>
                      {stat.label}
                    </p>

                    <p className="stats-hint mt-1.5">{stat.hint}</p>
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