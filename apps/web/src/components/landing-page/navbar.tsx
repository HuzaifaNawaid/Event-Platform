import React from "react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center font-sans pointer-events-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        .navbar-glass {
          background: rgba(10, 10, 10, 0.58);
          border: 1px solid rgba(255, 255, 255, 0.10);
          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(18px) saturate(130%);
          -webkit-backdrop-filter: blur(18px) saturate(130%);
        }
      `}</style>

      <div className="w-full max-w-[1400px] flex items-center justify-between px-4 lg:px-12 relative font-poppins pointer-events-none">

        {/* =====================================================
            LEFT — LOGO
        ===================================================== */}
        <div className="z-20 pointer-events-auto pt-6 lg:pt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-black text-black text-xs shadow-lg font-mono transition-all duration-300 hover:scale-105 hover:rotate-3">
              B//U
            </div>

            <span className="text-sm font-extrabold tracking-wider uppercase text-white">
              CORLAB.
            </span>
          </div>
        </div>

        {/* =====================================================
            CENTER — STATIC GLASS NAVIGATION
        ===================================================== */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            hidden md:flex
            items-center
            gap-6
            lg:gap-8
            px-8
            py-3
            rounded-full
            text-xs
            font-medium
            font-poppins
            navbar-glass
            text-white
            pointer-events-auto
          "
        >
          {["Guideline", "Faq", "Contact Us", "Discord", "Twitter"].map(
            (link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="
                  relative
                  group
                  text-white/75
                  transition-all
                  duration-300
                  ease-out
                  hover:text-white
                  hover:-translate-y-0.5
                "
              >
                {link}

                <span
                  className="
                    absolute
                    -bottom-1
                    left-1/2
                    -translate-x-1/2
                    w-0
                    h-px
                    bg-white
                    transition-all
                    duration-300
                    ease-out
                    group-hover:w-full
                    rounded-full
                    opacity-0
                    group-hover:opacity-100
                  "
                />
              </a>
            ),
          )}
        </div>

        {/* =====================================================
            RIGHT — GET UPDATES
        ===================================================== */}
        <div className="z-20 pointer-events-auto pt-6 lg:pt-8 ml-auto">
          <button
            type="button"
            className="
              relative
              group
              px-5
              py-2.5
              rounded-full
              text-xs
              font-bold
              uppercase
              tracking-wider
              bg-white
              text-black
              hover:bg-[#8b5cf6]
              hover:text-white
              transition-all
              duration-300
              hover:scale-105
              active:scale-95
              shadow-md
              flex
              items-center
              gap-2
            "
          >
            <span>Get Updates</span>

            <svg
              className="
                w-3.5
                h-3.5
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}
        <button
          type="button"
          aria-label="Open menu"
          className="
            z-20
            pointer-events-auto
            md:hidden
            text-white
            hover:text-white/70
            transition-all
            duration-300
            p-2
            ml-2
            hover:scale-105
            active:scale-95
          "
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Navbar;