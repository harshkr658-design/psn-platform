export default function Home() {
  return (
    <main className="min-h-screen bg-[#000] text-white selection:bg-[#0ea5e9]/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#0ea5e9]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0ea5e9]/20 bg-[#0ea5e9]/5 text-[#0ea5e9] text-xs font-medium tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ea5e9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ea5e9]"></span>
            </span>
            System Online — V2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 max-w-4xl leading-[0.9]">
            The internet was built to <span className="text-[#0ea5e9]">capture attention.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
            We built this to <span className="text-white font-medium">solve problems.</span> 
            A decentralized meritocracy where logic wins over algorithms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/submit" className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
              Start Solving
            </a>
            <a href="/feed" className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm">
              Explore Feed
            </a>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Paste Anything", 
              desc: "Any link, opinion, or rant. Our AI extracts the core problem and structures it into a high-merit proposal instantly.",
              icon: "M12 4v16m8-8H4"
            },
            { 
              title: "Reviewed Blindly", 
              desc: "No names, no profile pictures, no influence. Submissions are judged solely on clarity, logic, and evidence.",
              icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            },
            { 
              title: "Merit Wins", 
              desc: "The GRS + MRS formula ensures the world sees what matters. High-impact problems rise while noise is filtered out.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-[#0f172a]/50 border border-white/5 hover:border-[#0ea5e9]/30 transition-all hover:bg-[#0f172a] transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center mb-6 text-[#0ea5e9]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow Diagram Section */}
      <section className="py-24 px-6 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">The 4-Step Evolution</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <div className="hidden lg:block absolute top-[2.5rem] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-[#0ea5e9]/0 via-[#0ea5e9]/40 to-[#0ea5e9]/0" />
            
            {[
              { step: "01", name: "Submit", desc: "AI structures your raw input into a problem post." },
              { step: "02", name: "Blind Review", desc: "Community experts grade the post without bias." },
              { step: "03", name: "Score", desc: "Points are awarded. Merit scores are calculated." },
              { step: "04", name: "Feed", desc: "The world acts on ranked, high-merit problems." }
            ].map((step, i) => (
              <div key={i} className="relative p-6 text-center z-10">
                <div className="w-16 h-16 rounded-full bg-[#000] border border-[#0ea5e9]/40 flex items-center justify-center mx-auto mb-6 text-[#0ea5e9] font-mono font-bold text-xl shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                  {step.step}
                </div>
                <h4 className="text-lg font-bold mb-2 uppercase tracking-wide">{step.name}</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Phase Roadmap</h2>
          <div className="h-1 w-20 bg-[#0ea5e9] mx-auto rounded-full" />
        </div>
        
        <div className="space-y-12">
          {[
            { phase: "Phase I: Personal", status: "Active", desc: "Solving problems within your own scope — health, productivity, personal growth." },
            { phase: "Phase II: City", status: "Next", desc: "Addressing local infrastructure, school systems, and community bottlenecks." },
            { phase: "Phase III: Global", status: "Planned", desc: "Leveraging the network to coordinate global-scale climate and social actions." }
          ].map((item, i) => (
            <div key={i} className="flex gap-8 items-start border-l-2 border-white/5 pl-8 relative">
              <div className={`absolute -left-[5px] top-2 w-[8px] h-[8px] rounded-full ${item.status === 'Active' ? 'bg-[#0ea5e9] shadow-[0_0_10px_#0ea5e9]' : 'bg-slate-700'}`} />
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-2xl font-bold tracking-tight">{item.phase}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.status === 'Active' ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-slate-700 text-slate-500'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center bg-gradient-to-t from-[#0ea5e9]/5 to-transparent border-t border-white/5">
        <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Ready to build the future?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/submit" className="bg-[#0ea5e9] text-black px-10 py-4 rounded-xl font-bold transition-transform hover:scale-105">
            Submit Your First Problem
          </a>
          <a href="/feed" className="bg-white/5 border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
            View Mission Board
          </a>
        </div>
        <p className="mt-12 text-slate-600 font-mono text-xs uppercase tracking-[0.4em]">
          Problem Solving Network // 2026
        </p>
      </section>
    </main>
  )
}
