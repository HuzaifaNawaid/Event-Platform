export function Divisions() {
  return (
    <section id="divisions" className="py-32 px-6 lg:px-16 max-w-7xl mx-auto">
      <div className="mb-20">
        <span className="text-[#FF9900] font-mono text-xs uppercase tracking-widest block mb-3">// Core Architecture</span>
        <h2 className="font-['Syne'] font-extrabold text-4xl md:text-6xl uppercase">From Code To Cloud</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-[#FF9900]/50 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 font-['Syne'] font-extrabold text-7xl text-white/5 group-hover:text-[#FF9900]/10 transition-colors">01</div>
          <span className="text-xs font-mono text-[#FF9900] uppercase tracking-wider block mb-4">Division Alpha</span>
          <h3 className="font-['Syne'] font-bold text-2xl md:text-3xl mb-4 text-white">Cloud & AI Division</h3>
          <p className="text-white/60 leading-relaxed font-light mb-8 max-w-xl">
            Dive deep into cloud computing, artificial intelligence, and modern infrastructure. We conduct hands-on labs on AWS services, guiding you from cloud fundamentals to deploying generative AI applications.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF9900]">
            <span>Explore Labs</span> →
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-[#FF9900]/50 transition-all duration-500 flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 font-['Syne'] font-extrabold text-7xl text-white/5 group-hover:text-[#FF9900]/10 transition-colors">02</div>
          <div>
            <span className="text-xs font-mono text-[#FF9900] uppercase tracking-wider block mb-4">Division Beta</span>
            <h3 className="font-['Syne'] font-bold text-2xl mb-4 text-white">Hackathons & Bootcamps</h3>
            <p className="text-white/60 leading-relaxed font-light text-sm">
              Intensive build sprints designed to push your limits, solve real-world problems, and ship production code under strict timelines.
            </p>
          </div>
          <div className="mt-8 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">View Sprints →</div>
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-[#FF9900]/50 transition-all duration-500 flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 font-['Syne'] font-extrabold text-7xl text-white/5 group-hover:text-[#FF9900]/10 transition-colors">03</div>
          <div>
            <span className="text-xs font-mono text-[#FF9900] uppercase tracking-wider block mb-4">Division Gamma</span>
            <h3 className="font-['Syne'] font-bold text-2xl mb-4 text-white">Projects & Innovation Labs</h3>
            <p className="text-white/60 leading-relaxed font-light text-sm">
              Real AWS-powered products created by community builders, going from raw repository lines to deployed global cloud systems.
            </p>
          </div>
          <div className="mt-8 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">See Repos →</div>
        </div>

        <div className="md:col-span-2 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden group hover:border-[#FF9900]/50 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 font-['Syne'] font-extrabold text-7xl text-white/5 group-hover:text-[#FF9900]/10 transition-colors">04</div>
          <span className="text-xs font-mono text-[#FF9900] uppercase tracking-wider block mb-4">Division Delta</span>
          <h3 className="font-['Syne'] font-bold text-2xl md:text-3xl mb-4 text-white">Community & Mentorship</h3>
          <p className="text-white/60 leading-relaxed font-light mb-8 max-w-xl">
            Connect with high-caliber student peers and industry leaders. We foster an environment where experience is shared openly, transforming raw talent into production-ready software engineers.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF9900]">
            <span>Join Network</span> →
          </div>
        </div>
      </div>
    </section>
  );
}