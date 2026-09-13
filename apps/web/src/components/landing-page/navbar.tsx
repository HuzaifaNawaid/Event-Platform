import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const links = [
  { title: "Divisions", href: "#divisions" },
  { title: "Hackathons", href: "#events" },
  { title: "Projects", href: "#projects" },
  { title: "Team", href: "#team" },
];

const footerLinks = [
  { title: "Discord", href: "#discord" },
  { title: "Twitter", href: "#twitter" },
  { title: "LinkedIn", href: "#linkedin" },
  { title: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------ */
/*  Easings + variants                                                 */
/* ------------------------------------------------------------------ */
const EASE = [0.76, 0, 0.24, 1]; // panel + exits
const SOFT = [0.215, 0.61, 0.355, 1]; // content entrances

/* 3D flip-in for the big links */
const perspective = {
  initial: { opacity: 0, rotateX: 90, y: 55, x: -12 },

  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.4 + i * 0.07,
      ease: SOFT,
      opacity: { duration: 0.28, delay: 0.4 + i * 0.07 },
    },
  }),

  exit: (i: number) => ({
    opacity: 0,
    rotateX: 55,
    y: 24,
    x: 0,
    transition: { duration: 0.24, delay: i * 0.035, ease: EASE },
  }),
};

/* small slide-up for footer items */
const slideIn = {
  initial: { opacity: 0, y: 12 },

  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.58 + i * 0.06, ease: SOFT },
  }),

  exit: (i: number) => ({
    opacity: 0,
    y: 8,
    transition: { duration: 0.2, delay: i * 0.025, ease: EASE },
  }),
};

/* ------------------------------------------------------------------ */
/*  Big nav link — rolling text + index + arrow                        */
/* ------------------------------------------------------------------ */
function NavLink({
  link,
  index,
  onNavigate,
}: {
  link: { title: string; href: string };
  index: number;
  onNavigate: () => void;
}) {
  return (
    <a
      href={link.href}
      onClick={onNavigate}
      className="group flex items-center gap-3 py-[3px] no-underline"
    >
      {/* index */}
      <span className="w-6 shrink-0 text-[10px] font-bold tabular-nums tracking-[0.1em] text-black/35 transition-colors duration-500 group-hover:text-black/80">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* rolling label — two stacked copies, the parent translates -50% on hover */}
      <span className="relative block h-[1.22em] overflow-hidden text-[clamp(1.85rem,5.2vw,2.6rem)] leading-[1.22] font-extrabold tracking-[-0.045em] text-black">
        <span className="block transition-transform duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
          <span className="block">{link.title}</span>
          <span className="block">{link.title}</span>
        </span>
      </span>

      {/* arrow */}
      <span className="ml-1 block -translate-x-2 text-base font-bold text-black opacity-0 transition-all duration-[550ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:opacity-100">
        →
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel content                                                      */
/* ------------------------------------------------------------------ */
function Navigation({
  isActive,
  onNavigate,
  width,
  height,
}: {
  isActive: boolean;
  onNavigate: () => void;
  width: number;
  height: number;
}) {
  return (
    <div
      className="absolute top-0 right-0 box-border flex flex-col justify-between px-7 pt-20 pb-3 sm:px-8 sm:pt-[84px] sm:pb-4"
      style={{ width, height }}
    >
      {/* main links */}
      <div className="flex flex-col gap-1">
        {links.map((link, i) => (
          <div key={link.title} className="[perspective:800px]">
            <motion.div
              custom={i}
              variants={perspective}
              initial="initial"
              animate={isActive ? "enter" : "exit"}
              className="origin-bottom [transform-style:preserve-3d]"
            >
              <NavLink link={link} index={i} onNavigate={onNavigate} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* footer */}
      <div>
        <div className="mb-3.5 grid grid-cols-2 gap-x-3 gap-y-2">
          {footerLinks.map((link, i) => (
            <motion.a
              key={link.title}
              href={link.href}
              onClick={onNavigate}
              custom={i}
              variants={slideIn}
              initial="initial"
              animate={isActive ? "enter" : "exit"}
              className="group flex items-center gap-2 text-xs font-semibold text-black/60 no-underline transition-colors duration-300 hover:text-black"
            >
              {/* dot stretches into a dash */}
              <span className="block h-[3px] w-[3px] rounded-full bg-black/30 transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:w-3 group-hover:bg-black" />
              {link.title}
            </motion.a>
          ))}
        </div>

        {/* CTA with a shine sweep */}
        <motion.a
          href="#contact"
          onClick={onNavigate}
          custom={4}
          variants={slideIn}
          initial="initial"
          animate={isActive ? "enter" : "exit"}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-[#111111] px-5 py-3 text-[10px] font-extrabold tracking-[0.12em] text-[#F4A62A] uppercase no-underline transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
          <span className="relative">Join Portal</span>
        </motion.a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Morphing hamburger → X                                             */
/* ------------------------------------------------------------------ */
function MenuButton({
  isActive,
  toggleMenu,
}: {
  isActive: boolean;
  toggleMenu: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={toggleMenu}
      aria-label={isActive ? "Close menu" : "Open menu"}
      aria-expanded={isActive}
      initial={false}
      animate={{ backgroundColor: isActive ? "#111111" : "#F4A62A" }}
      whileHover={{ scale: 1.04, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.93 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="absolute top-0 right-0 z-[120] flex h-9 w-[88px] cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <span className="relative block h-[10px] w-[20px]">
        <motion.span
          className="absolute right-0 block h-[2px] rounded-full"
          initial={false}
          animate={
            isActive
              ? { top: 4, width: 20, rotate: 45, backgroundColor: "#F4A62A" }
              : { top: 0, width: 18, rotate: 0, backgroundColor: "#111111" }
          }
          transition={{ duration: 0.45, ease: EASE }}
        />
        <motion.span
          className="absolute right-0 block h-[2px] rounded-full"
          initial={false}
          animate={
            isActive
              ? { top: 4, width: 20, rotate: -45, backgroundColor: "#F4A62A" }
              : { top: 8, width: 12, rotate: 0, backgroundColor: "#111111" }
          }
          transition={{ duration: 0.45, ease: EASE }}
        />
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
export function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const [size, setSize] = useState({ w: 420, h: 560 });

  /* keep the open panel inside the viewport */
  useEffect(() => {
    const update = () =>
      setSize({
        w: Math.min(420, window.innerWidth - 32),
        h: Math.min(560, window.innerHeight - 32),
      });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* esc to close */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* lock scroll while open */
  useEffect(() => {
    if (!isActive) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isActive]);

  const close = useCallback(() => setIsActive(false), []);

  const menuVariants = {
    closed: {
      width: 88,
      height: 36,
      top: 0,
      right: 0,
      borderRadius: 999,
      transition: { duration: 0.5, delay: 0.3, ease: EASE },
    },
    open: {
      width: size.w,
      height: size.h,
      top: -12,
      right: -12,
      borderRadius: 24,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  return (
    <>
      <style>{`
        .aws-sbg-navbar {
          position: fixed;
          top: 20px;
          right: 28px;
          z-index: 100;
          width: 88px;
          height: 36px;
        }

        .aws-sbg-menu-panel {
          position: absolute;
          overflow: hidden;
          background:
            linear-gradient(
              145deg,
              rgba(244, 166, 42, 0.98) 0%,
              rgba(231, 146, 25, 0.98) 100%
            );
          box-shadow:
            0 22px 55px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.08);
          will-change: width, height, top, right, border-radius;
        }

        /* spacer that reserves exactly the pill's bottom edge */
        .aws-sbg-header {
          height: 56px;
        }

        .aws-sbg-brand {
          position: absolute;
          left: 28px;
          top: calc(50% + 10px);
          transform: translateY(-50%);
        }

        @media (max-width: 767px) {
          .aws-sbg-navbar { top: 16px; right: 18px; }
          .aws-sbg-header { height: 52px; }
          .aws-sbg-brand { left: 18px; top: calc(50% + 8px); }
        }

        @media (max-width: 480px) {
          .aws-sbg-navbar { top: 14px; right: 16px; }
          .aws-sbg-header { height: 50px; }
          .aws-sbg-brand { left: 16px; top: calc(50% + 7px); }
        }
      `}</style>

      <header className="aws-sbg-header pointer-events-none relative z-[100] w-full">
        {/* backdrop */}
        <motion.div
          className="fixed inset-0 z-0 bg-black/50 backdrop-blur-[3px]"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          style={{ pointerEvents: isActive ? "auto" : "none" }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={close}
        />

        {/* logo */}
        <div className="aws-sbg-brand pointer-events-auto relative z-20">
          <a
            href="#hero-container"
            className="group flex items-center gap-2.5 no-underline"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF9900] shadow-[0_0_10px_#FF9900] transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_16px_#FF9900]" />

            <span className="font-['Syne'] text-sm font-extrabold tracking-[0.08em] text-white sm:text-[15px]">
              AWS-SBG-
              <span className="text-[#FF9900]">BUKC</span>
            </span>
          </a>
        </div>

        {/* expanding menu */}
        <div className="aws-sbg-navbar pointer-events-auto z-30">
          <motion.div
            className="aws-sbg-menu-panel"
            variants={menuVariants}
            initial="closed"
            animate={isActive ? "open" : "closed"}
          >
            {/* Content is pinned to the panel's top-right at full size so it
                never reflows while the panel is resizing. */}
            <motion.div
              className="absolute top-0 right-0"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{
                duration: isActive ? 0.35 : 0.18,
                delay: isActive ? 0.22 : 0,
                ease: EASE,
              }}
              style={{ pointerEvents: isActive ? "auto" : "none" }}
              aria-hidden={!isActive}
            >
              <Navigation
                isActive={isActive}
                onNavigate={close}
                width={size.w}
                height={size.h}
              />
            </motion.div>
          </motion.div>

          <MenuButton isActive={isActive} toggleMenu={() => setIsActive((c) => !c)} />
        </div>
      </header>
    </>
  );
}

export default Navbar;