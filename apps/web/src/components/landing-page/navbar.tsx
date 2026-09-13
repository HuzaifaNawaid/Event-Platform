import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const menuVariants = {
  open: {
    width: "min(420px, calc(100vw - 24px))",
    height: "min(560px, calc(100vh - 24px))",
    top: "-12px",
    right: "-12px",
    borderRadius: "24px",
    transition: {
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1],
    },
  },

  closed: {
    width: "88px",
    height: "36px",
    top: "0px",
    right: "0px",
    borderRadius: "999px",
    transition: {
      duration: 0.7,
      delay: 0.3,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const perspective = {
  initial: {
    opacity: 0,
    rotateX: 90,
    y: 55,
    x: -12,
  },

  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    x: 0,
    transition: {
      duration: 0.55,
      delay: 0.4 + i * 0.08,
      ease: [0.215, 0.61, 0.355, 1],
      opacity: {
        duration: 0.3,
      },
    },
  }),

  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const slideIn = {
  initial: {
    opacity: 0,
    y: 12,
  },

  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.65 + i * 0.08,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),

  exit: {
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

function PerspectiveText({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] hover:[transform:rotateX(90deg)]">
      <p className="m-0 text-[9px] font-extrabold uppercase tracking-[0.12em] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] hover:-translate-y-full hover:opacity-0">
        {label}
      </p>

      <p className="absolute m-0 translate-y-[8px] rotate-x-[-90deg] text-[9px] font-extrabold uppercase tracking-[0.12em] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] hover:translate-y-0 hover:opacity-100">
        {label}
      </p>
    </div>
  );
}

function MenuButton({
  isActive,
  toggleMenu,
}: {
  isActive: boolean;
  toggleMenu: () => void;
}) {
  return (
    <div className="absolute right-0 top-0 z-[120] h-9 w-[88px] overflow-hidden rounded-full">
      <motion.div
        className="relative h-full w-full"
        animate={{
          top: isActive ? "-100%" : "0%",
        }}
        transition={{
          duration: 0.45,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Open menu"
          className="flex h-9 w-full items-center justify-center border-0 bg-[#F4A62A] p-0 text-black outline-none"
        >
          <span className="flex flex-col items-end gap-[4px]">
            <span className="block h-[2px] w-[17px] rounded-full bg-current" />
            <span className="block h-[2px] w-[12px] rounded-full bg-current" />
          </span>
        </button>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Close menu"
          className="flex h-9 w-full items-center justify-center border-0 bg-[#111111] p-0 text-[#F4A62A] outline-none"
        >
          <span className="relative block h-[18px] w-[18px]">
            <span className="absolute left-1/2 top-1/2 block h-[2px] w-[20px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
            <span className="absolute left-1/2 top-1/2 block h-[2px] w-[20px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
          </span>
        </button>
      </motion.div>
    </div>
  );
}

function Navigation({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between box-border px-7 pb-2 pt-20 sm:px-8 sm:pb-2.5 sm:pt-[86px]">
      <div className="flex flex-col gap-1">
        {links.map((link, i) => (
          <div key={link.title} className="[perspective:120px]">
            <motion.div
              custom={i}
              variants={perspective}
              initial="initial"
              animate="enter"
              exit="exit"
              className="origin-bottom"
            >
              <a
                href={link.href}
                onClick={onNavigate}
                className="inline-block text-[clamp(2rem,5.5vw,2.7rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-black no-underline transition-all duration-300 hover:translate-x-2 hover:opacity-60"
              >
                {link.title}
              </a>
            </motion.div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1">
          {footerLinks.map((link, i) => (
            <motion.a
              key={link.title}
              href={link.href}
              onClick={onNavigate}
              custom={i}
              variants={slideIn}
              initial="initial"
              animate="enter"
              exit="exit"
              className="text-xs font-semibold text-black/65 no-underline transition-all duration-300 hover:translate-x-1 hover:text-black"
            >
              {link.title}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          onClick={onNavigate}
          custom={4}
          variants={slideIn}
          initial="initial"
          animate="enter"
          exit="exit"
          className="flex w-full items-center justify-center rounded-full bg-[#111111] px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#F4A62A] no-underline transition-all duration-300 hover:scale-[1.01] hover:bg-black active:scale-[0.98]"
        >
          Join Portal
        </motion.a>
      </div>
    </div>
  );
}

export function Navbar() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <style>{`
        .aws-sbg-navbar {
          position: fixed;
          top: 20px;
          right: 28px;
          z-index: 100;
        }

        .aws-sbg-menu-panel {
          position: relative;
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
        }

        /* Spacer that reserves exactly the pill's bottom edge.
           no dead gap before the hero */
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
          .aws-sbg-navbar {
            top: 16px;
            right: 18px;
          }

          .aws-sbg-header {
            height: 52px;
          }

          .aws-sbg-brand {
            left: 18px;
            top: calc(50% + 8px);
          }
        }

        @media (max-width: 480px) {
          .aws-sbg-navbar {
            top: 14px;
            right: 16px;
          }

          .aws-sbg-header {
            height: 50px;
          }

          .aws-sbg-brand {
            left: 16px;
            top: calc(50% + 7px);
          }
        }
      `}</style>

      <header className="aws-sbg-header pointer-events-none relative z-[100] w-full">
        {/* AWS-SBG-BUKC Logo */}
        <div className="aws-sbg-brand pointer-events-auto">
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

        {/* Framer-style expanding menu */}
        <div className="aws-sbg-navbar pointer-events-auto">
          <motion.div
            className="aws-sbg-menu-panel"
            variants={menuVariants}
            animate={isActive ? "open" : "closed"}
            initial="closed"
          >
            <AnimatePresence mode="wait">
              {isActive && (
                <Navigation
                  onNavigate={() => setIsActive(false)}
                />
              )}
            </AnimatePresence>
          </motion.div>

          <MenuButton
            isActive={isActive}
            toggleMenu={() =>
              setIsActive((current) => !current)
            }
          />
        </div>
      </header>
    </>
  );
}

export default Navbar;