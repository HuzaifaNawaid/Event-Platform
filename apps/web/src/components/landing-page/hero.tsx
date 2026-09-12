export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-32 pb-20 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,153,0,0.12),rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 mb-8 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-xs font-medium tracking-wide text-white/80">Bahria University • Karachi (+5:00 GMT)</span>
      </div>

      <h1 className="font-['Syne'] font-extrabold text-5xl md:text-7xl lg:text-9xl tracking-tight max-w-6xl uppercase leading-[0.95] mb-8">
        From Students <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9900] via-[#ffb84d] to-white">
          To Builders.
        </span>
      </h1>

      <p className="max-w-2xl text-base md:text-lg text-white/60 font-light leading-relaxed mb-12">
        AWS Student Builder Group @ Bahria University is a community of student developers learning cloud, AI, and modern software through hands-on building — not just theory.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <a 
          href="#divisions" 
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF9900] text-black font-bold text-sm uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(255,153,0,0.3)]"
        >
          Explore Divisions
        </a>
        <a 
          href="#events" 
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.05] border border-white/10 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
        >
          Upcoming Events
        </a>
      </div>
    </section>
  );
}