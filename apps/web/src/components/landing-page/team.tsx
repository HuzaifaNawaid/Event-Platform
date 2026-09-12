export function Team() {
  return (
    <section className="py-32 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-[#FF9900] font-mono text-xs uppercase tracking-widest block mb-3">// Leadership</span>
        <h2 className="font-['Syne'] font-extrabold text-4xl md:text-5xl uppercase mb-4">Our Creative Team</h2>
        <p className="text-white/60 text-sm">The minds powering AWS Student Builder Group at Bahria University.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center group hover:border-[#FF9900]/40 transition-all">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF9900] to-purple-600 mx-auto mb-6 flex items-center justify-center font-['Syne'] font-bold text-2xl text-black shadow-lg">
            AA
          </div>
          <h3 className="font-['Syne'] font-bold text-xl text-white mb-1">Affan Bin Amir</h3>
          <p className="text-xs font-mono text-[#FF9900] uppercase tracking-wider">Captain AWSSBG</p>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center group hover:border-[#FF9900]/40 transition-all">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-[#FF9900] mx-auto mb-6 flex items-center justify-center font-['Syne'] font-bold text-2xl text-black shadow-lg">
            WI
          </div>
          <h3 className="font-['Syne'] font-bold text-xl text-white mb-1">Waqas Ishaque</h3>
          <p className="text-xs font-mono text-[#FF9900] uppercase tracking-wider">Development Head</p>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center group hover:border-[#FF9900]/40 transition-all">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mx-auto mb-6 flex items-center justify-center font-['Syne'] font-bold text-2xl text-black shadow-lg">
            HR
          </div>
          <h3 className="font-['Syne'] font-bold text-xl text-white mb-1">Huzaifa Rehman</h3>
          <p className="text-xs font-mono text-[#FF9900] uppercase tracking-wider">Management Head</p>
        </div>
      </div>
    </section>
  );
}