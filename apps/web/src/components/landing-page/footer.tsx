export function Footer() {
  return (
    <footer id="contact" className="bg-[#050505] border-t border-white/10 pt-24 pb-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 pb-20 border-b border-white/10">
        <div>
          <span className="text-[#FF9900] font-mono text-xs uppercase tracking-widest block mb-3">// Let's Connect</span>
          <h2 className="font-['Syne'] font-extrabold text-4xl md:text-6xl uppercase mb-6">
            Let's bring your <br /> ideas to life!
          </h2>
          <p className="text-white/60 font-light">Ready to ship secure cloud systems and build world-class tech? Reach out to our core team directly.</p>
        </div>

        <div className="flex flex-col justify-start space-y-6">
          <div>
            <span className="text-xs font-mono text-white/40 uppercase block mb-1">Mail Us</span>
            <a href="mailto:hi@aws-sbgbu.com" className="font-['Syne'] font-bold text-xl md:text-2xl text-white hover:text-[#FF9900] transition-colors">
              hi@aws-sbgbu.com
            </a>
          </div>
          <div>
            <span className="text-xs font-mono text-white/40 uppercase block mb-1">Call Us At</span>
            <a href="tel:+923132458545" className="font-['Syne'] font-bold text-xl md:text-2xl text-white hover:text-[#FF9900] transition-colors">
              +92 313 2458545
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
        <div className="flex flex-wrap gap-6 uppercase tracking-widest font-semibold">
          <a href="#" className="hover:text-white transition-colors">LinkTree</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Meetup</a>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
        <div>
          Built with ♥︎ by Waqas Ishaque
        </div>
      </div>
    </footer>
  );
}