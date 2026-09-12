export function Events() {
  return (
    <section id="events" className="py-32 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
        <div>
          <span className="text-[#FF9900] font-mono text-xs uppercase tracking-widest block mb-3">// Live Timeline</span>
          <h2 className="font-['Syne'] font-extrabold text-4xl md:text-6xl uppercase">Upcoming Events</h2>
        </div>
        <span className="text-white/40 text-sm mt-4 md:mt-0">Join workshops, hackathons & community meetups.</span>
      </div>

      <div className="space-y-4">
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.05] transition-all group">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#FF9900]/10 text-[#FF9900] font-mono text-xs mb-3">Upcoming Event</span>
            <h3 className="font-['Syne'] font-bold text-2xl text-white group-hover:text-[#FF9900] transition-colors">Builders Connect</h3>
            <p className="text-white/60 text-sm mt-1">Talks about AWS & Cloud Careers with Hands-on Workshop.</p>
          </div>
          <button className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#FF9900] transition-all">
            Reserve Seat
          </button>
        </div>

        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.05] transition-all group">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/70 font-mono text-xs mb-3">Upcoming Hackathon</span>
            <h3 className="font-['Syne'] font-bold text-2xl text-white group-hover:text-[#FF9900] transition-colors">Kirothon</h3>
            <p className="text-white/60 text-sm mt-1">Upcoming Hackathon — Themes & Dates To Be Decided.</p>
          </div>
          <button className="px-6 py-3 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all">
            Get Notified
          </button>
        </div>
      </div>
    </section>
  );
}