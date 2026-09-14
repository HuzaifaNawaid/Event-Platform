import React, { useState, useEffect, useRef } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   Word-by-word reveal helpers
   ========================================================= */
function wrapWordsForReveal(element: HTMLElement): HTMLElement[] {
  const innerSpans: HTMLElement[] = [];
  const textNodes: Node[] = [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node: Node) => {
      const parent = (node as Text).parentElement;
      if (parent?.closest(".reveal-skip")) return NodeFilter.FILTER_REJECT;
      if (!node.textContent || !node.textContent.trim())
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node);

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

function unwrapRevealWords(root: HTMLElement): void {
  root.querySelectorAll(".reveal-mask").forEach((mask: Element) => {
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
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');

  .font-inter { font-family: 'Inter', sans-serif; }
  .font-anton { font-family: 'Anton', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }

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
`;

export default function Events() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Universal Text Reveal for EVERYTHING (Heading, Desc, Sticker, Buttons, Cards)
      const cardTextElements = section!.querySelectorAll<HTMLElement>(".card-reveal-text");
      
      cardTextElements.forEach((el: HTMLElement) => {
        const words = wrapWordsForReveal(el);
        if (!words.length) return;
        
        gsap.set(words, { y: "110%" });

        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: () => {
            gsap.to(words, {
              y: "0%",
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.02,
              overwrite: true,
            });
          },
          onLeaveBack: () => {
            gsap.to(words, {
              y: "110%",
              duration: 0.4,
              ease: "power2.in",
              overwrite: true,
            });
          }
        });
      });

      // 2. Floating Sticker Animations
      const stickers = section!.querySelectorAll<HTMLElement>(".floating-sticker");
      stickers.forEach((sticker: HTMLElement, i: number) => {
        gsap.to(sticker, {
          y: i % 2 === 0 ? -8 : 8,
          rotation: i % 2 === 0 ? 3 : -3,
          duration: 3 + i * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

    }, section);

    return () => {
      ctx.revert();
      // Unwrap all dynamically modified DOM nodes
      const cardTextElements = section.querySelectorAll<HTMLElement>(".card-reveal-text");
      cardTextElements.forEach((el: HTMLElement) => unwrapRevealWords(el));
    };
  }, [filter]); // Re-run when filter changes to apply animations to new cards

  return (
    <section ref={sectionRef} className="relative bg-[#050508] text-white pt-24 pb-32 px-4 sm:px-8 lg:px-14 overflow-hidden border-t border-white/10" id="events">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* Background Ambient Effects */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>
      <div className="pointer-events-none absolute left-1/4 top-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#ec4899]/15 via-purple-800/10 to-transparent blur-[160px]"></div>
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-yellow-400/10 via-[#FF5500]/10 to-transparent blur-[160px]"></div>

      {/* Header Section */}
      <div className="relative z-20 max-w-6xl mx-auto mb-16 sm:mb-20">
        <div className="relative flex flex-col items-center justify-center text-center">
          
          {/* Main Title & Sticker */}
          <div className="relative inline-flex items-center justify-center my-4">
            <h2 
              className="card-reveal-text font-anton text-6xl sm:text-8xl md:text-9xl text-white tracking-normal uppercase select-none"
            >
              Events
            </h2>
            
            <div className="absolute -right-6 sm:-right-14 md:-right-20 -top-6 sm:-top-8 rotate-[11deg] z-30 cursor-pointer floating-sticker">
              <div className="relative inline-block transition-transform hover:rotate-3 hover:scale-105">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-pink-500 transform translate-x-1.5 translate-y-1.5 border-2 border-black"></div>
                <div className="relative bg-white text-black border-2 sm:border-3 border-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl shadow-[4px_5px_0px_#000000] font-black uppercase font-mono text-xs sm:text-base tracking-wider flex items-center gap-1.5 card-reveal-text">
                  <span className="text-[#FF5500]">✦</span> AI / ML
                </div>
              </div>
            </div>
          </div>

          <p 
            className="card-reveal-text font-inter mt-4 max-w-2xl text-zinc-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed"
          >
            From virtual deep dives to flagship in-person hackathons. Discover upcoming encounters and explore the archives of past builder sessions. Reserve your spot before capacity closes.
          </p>

          {/* Filter Buttons */}
          <div className="mt-10 inline-flex p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl gap-2 z-20">
            <button 
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all card-reveal-text ${filter === 'all' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              All Events
            </button>
            <button 
              onClick={() => setFilter('upcoming')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 card-reveal-text ${filter === 'upcoming' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              <span>Upcoming</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ec4899] text-white text-[10px] font-mono font-bold">2</span>
            </button>
            <button 
              onClick={() => setFilter('past')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 card-reveal-text ${filter === 'past' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              <span>Past Archives</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-[10px] font-mono font-bold">1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events List Container */}
      <div className="relative z-20 max-w-6xl mx-auto space-y-12 sm:space-y-16" id="events-list-container">
        
        {/* UPCOMING EVENT 1: Builder's Connect Ep. 2 */}
        {(filter === 'all' || filter === 'upcoming') && (
          <div className="event-card upcoming-event group relative rounded-[32px] sm:rounded-[40px] bg-[#100d14] border-2 border-white/10 hover:border-[#ec4899]/60 p-6 sm:p-10 transition-all duration-300 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 font-mono font-black text-xs sm:text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] animate-ping"></span>
                    <span className="card-reveal-text">COMING SOON</span>
                  </div>
                  <div className="text-zinc-400 card-reveal-text">TBA</div>
                </div>
                <div>
                  <div className="inline-block mb-3">
                    <span className="px-4 py-1.5 rounded-md bg-[#ff2a6d] text-black font-black font-mono text-xs sm:text-sm tracking-wider uppercase shadow-[3px_3px_0px_#000000] border-2 border-black inline-block -rotate-1">
                      ONSITE WORKSHOP
                    </span>
                  </div>
                  <h3 className="card-reveal-text font-anton text-4xl sm:text-5xl lg:text-6xl text-white tracking-normal uppercase leading-[0.95] mb-2">
                    Builder's Connect Ep. 2
                  </h3>
                  <div className="card-reveal-text text-xs sm:text-sm font-semibold text-zinc-400 mb-4">
                    with <span className="text-white underline decoration-pink-500 underline-offset-4">AWS Student Builder Group BUKC</span>
                  </div>
                  <p className="card-reveal-text text-zinc-300 text-xs sm:text-sm sm:leading-relaxed font-normal max-w-xl mb-4">
                    The premier in-person edition bringing builders, developers, and cloud architects together for deep-dive technical sessions, architecture tear-downs, and collaborative networking. Onsite at Event Venue, Karachi, Pakistan.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="card-reveal-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-pink-300">
                      <span>📍</span> Event Venue, Karachi, Pakistan
                    </div>
                    <div className="card-reveal-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-xs font-mono text-green-400 font-bold">
                      <span>★</span> Free
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-3">
                  <button className="inline-flex items-center gap-1.5 group/btn transition-transform hover:scale-105 active:scale-95 duration-200">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#ff2a6d] border-2 border-black rounded-lg flex items-center justify-center text-black font-mono font-black text-lg shadow-[3px_3px_0px_#000000]">↗</div>
                    <div className="h-11 sm:h-12 px-6 sm:px-8 bg-[#ff2a6d] border-2 border-black rounded-lg flex items-center justify-center text-black font-black uppercase tracking-wider text-xs sm:text-sm shadow-[3px_3px_0px_#000000]">
                      GET TICKET
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Right Image */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div className="relative w-full aspect-[4/3] max-w-md">
                  <div className="w-full h-full rounded-[60px_160px_70px_150px] border-3 border-black overflow-hidden shadow-[8px_10px_0px_#000000] bg-[#1a1423] relative group-hover:rotate-1 transition-transform duration-300">
                    <img alt="Builder's Connect Episode 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-dxqzYgYXBb3YG53HCUb73FR9AbaHYVeDR9Nh4prIRqU7mMTjos-ry_NXbcTjWGGQ-TRt5AvNTR9gpN4qknYRUBzMdsBaqpLySOQcwUlBopHnfe8ZeTysVKmzCcStrA2qvqIRQ2tsnaKjTnxTkIbzdbjCD_s9e1TrkgLqk3a6i00gYRoBLaIzKp584C3MNc-A_VDK0xXy0FcF1Qh4xlrRTJkTuyk85jz3vFrmAdrYmJ_OosJWgFco" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>
                  <div className="absolute -top-6 -right-4 z-30 floating-sticker">
                    <div className="bg-blue-600 border-2 border-black rounded-2xl px-4 py-2 text-white font-black text-xs font-mono shadow-[3px_3px_0px_#000000] -rotate-6">
                      ✦ AI / MACHINE LEARNING
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPCOMING EVENT 2: Kirothon (SOFT BLUE THEME) */}
        {(filter === 'all' || filter === 'upcoming') && (
          <div className="event-card upcoming-event group relative rounded-[32px] sm:rounded-[40px] bg-[#100d14] border-2 border-white/10 hover:border-[#60A5FA]/60 p-6 sm:p-10 transition-all duration-300 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Image (Reversed) */}
              <div className="lg:col-span-5 flex justify-center relative order-2 lg:order-1">
                <div className="relative w-full aspect-[4/3] max-w-md">
                  <div className="w-full h-full rounded-[150px_70px_160px_60px] border-3 border-black overflow-hidden shadow-[8px_10px_0px_#000000] bg-[#1a1423] relative group-hover:-rotate-1 transition-transform duration-300">
                    <img alt="Kirothon Hackathon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMI48gBT8xxG_CysJnrTINXyHWSHbL-t5MtAz9A3LMH-JeZ-oIIJXTzT24ZF-SdtCLVbfDKFrGgPr6khkk0rp68YBwT_r3f5sNFyc1xTrlHyzkDI1XoEqKyygkYNa_v-u5kzGJSBrp-NDmZzTm8UHVlvyFrxfjGsuIulhSPr25r74MMlAfRca4RHV56UPPjXoUehctKOFM_dPpWuTkxXuBcpW-MZmv9xHhDgdxfRfJi-Oliyax8Ax8" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>
                  <div className="absolute -top-6 -left-4 z-30 floating-sticker">
                    <div className="bg-[#60A5FA] border-2 border-black rounded-2xl px-4 py-2 text-white font-black text-xs font-mono shadow-[3px_3px_0px_#000000] rotate-6">
                      ✦ TECH INNOVATION
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content (Reversed) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6 order-1 lg:order-2">
                <div className="flex flex-wrap items-center justify-between gap-4 font-mono font-black text-xs sm:text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] animate-ping"></span>
                    <span className="card-reveal-text">COMING SOON</span>
                  </div>
                  <div className="text-zinc-400 card-reveal-text">TBA</div>
                </div>
                <div>
                  <div className="inline-block mb-3">
                    <span className="px-4 py-1.5 rounded-md bg-[#60A5FA] text-white font-black font-mono text-xs sm:text-sm tracking-wider uppercase shadow-[3px_3px_0px_#000000] border-2 border-black inline-block rotate-1">
                      FLAGSHIP HACKATHON
                    </span>
                  </div>
                  <h3 className="card-reveal-text font-anton text-4xl sm:text-5xl lg:text-6xl text-white tracking-normal uppercase leading-[0.95] mb-2">
                    Kirothon
                  </h3>
                  <div className="card-reveal-text text-xs sm:text-sm font-semibold text-zinc-400 mb-4">
                    with <span className="text-white underline decoration-[#60A5FA] underline-offset-4">AWS SBG BUKC &amp; Tech Ecosystem Partners</span>
                  </div>
                  <p className="card-reveal-text text-zinc-300 text-xs sm:text-sm sm:leading-relaxed font-normal max-w-xl mb-4">
                    36 hours of relentless ideation, prototyping, and cloud deployment. Gather your squad, build production-ready architectures on AWS, and compete for cloud compute grants, mentor access, and top-tier swag.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="card-reveal-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-blue-300">
                      <span>📍</span> Bahria University, Karachi, Pakistan
                    </div>
                    <div className="card-reveal-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#60A5FA]/10 border border-[#60A5FA]/30 text-xs font-mono text-[#60A5FA] font-bold">
                      <span>★</span> Free
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-3">
                  <button className="inline-flex items-center gap-1.5 group/btn transition-transform hover:scale-105 active:scale-95 duration-200">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#60A5FA] border-2 border-black rounded-lg flex items-center justify-center text-white font-mono font-black text-lg shadow-[3px_3px_0px_#000000]">↗</div>
                    <div className="h-11 sm:h-12 px-6 sm:px-8 bg-[#60A5FA] border-2 border-black rounded-lg flex items-center justify-center text-white font-black uppercase tracking-wider text-xs sm:text-sm shadow-[3px_3px_0px_#000000]">
                      GET TICKET
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAST ARCHIVES SECTION */}
        {(filter === 'all' || filter === 'past') && (
          <div className="event-card past-event group relative rounded-[32px] sm:rounded-[40px] bg-[#0c0a14] border-2 border-white/10 hover:border-white/40 p-6 sm:p-10 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 font-mono font-black text-xs sm:text-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span className="card-reveal-text">APRIL 2026</span>
                  </div>
                </div>
                <div>
                  <h3 className="card-reveal-text font-anton text-3xl sm:text-4xl lg:text-5xl text-white tracking-normal uppercase leading-[0.95] mb-2">
                    Builder's Connect Ep. 1
                  </h3>
                  <div className="card-reveal-text text-xs sm:text-sm font-medium text-zinc-400 mb-3">
                    with <span className="text-zinc-200 font-semibold">Core Architecture Team &amp; Cloud Mentors</span>
                  </div>
                  <p className="card-reveal-text text-zinc-400 text-xs sm:text-sm font-normal leading-relaxed max-w-2xl">
                    The inaugural virtual session that launched our community. Over 300+ students tuned in across Discord and Twitch for a 3-hour masterclass on AWS fundamentals, serverless pipelines, and student builder career roadmaps.
                  </p>
                </div>
                <div className="pt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-black uppercase tracking-wider transition-colors duration-200 border border-white/20">
                    <span>VIEW RECORDING &amp; SLIDES</span>
                    <span>↗</span>
                  </button>
                  <div className="flex items-center gap-4 text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      3h 15m
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      420+ Views
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-xs p-6 rounded-3xl bg-black/60 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center text-2xl shadow-lg">
                    ▶
                  </div>
                  <div className="font-mono text-xs text-zinc-400">
                    ARCHIVED LIVESTREAM
                  </div>
                  <div className="text-sm font-bold text-white uppercase tracking-tight">
                    300+ Live Attendees
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}