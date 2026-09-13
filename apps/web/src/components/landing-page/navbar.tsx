export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 lg:px-12 py-5 backdrop-blur-xl bg-[#030303]/70 border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#FF9900] animate-pulse shadow-[0_0_12px_#FF9900]" />
        <span className="font-['Syne'] font-extrabold text-lg tracking-wider text-white">
          AWS SBG <span className="text-[#FF9900]">BUK</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-semibold text-white/60">
        <a href="#divisions" className="hover:text-white transition-colors cursor-pointer">Divisions</a>
        <a href="#events" className="hover:text-white transition-colors cursor-pointer">Hackathons</a>
        <a href="#divisions" className="hover:text-white transition-colors cursor-pointer">Projects</a>
        <a href="#contact" className="hover:text-white transition-colors cursor-pointer">Team</a>
      </div>

      <a 
        href="#contact" 
        className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-[#FF9900] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        Join Portal
      </a>
    </header>
  );
}