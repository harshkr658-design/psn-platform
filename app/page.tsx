'use client'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(0)

  // Animated particle network background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {x:number,y:number,vx:number,vy:number,size:number}[] = []
    for(let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5
      })
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Draw connections
      particles.forEach((p, i) => {
        particles.slice(i+1).forEach(p2 => {
          const dist = Math.hypot(p.x-p2.x, p.y-p2.y)
          if(dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(14,165,233,${0.15*(1-dist/120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(14,165,233,0.6)'
        ctx.fill()
        // Move
        if (canvas) {
          p.x += p.vx
          p.y += p.vy
          if(p.x < 0 || p.x > canvas.width) p.vx *= -1
          if(p.y < 0 || p.y > canvas.height) p.vy *= -1
        }
      })
      requestAnimationFrame(draw)
    }
    draw()

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Counting animation for stats
  useEffect(() => {
    let start = 0
    const timer = setInterval(() => {
      start += 7
      setCount(start)
      if(start >= 2847) { setCount(2847); clearInterval(timer) }
    }, 10)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{background:'#000',minHeight:'100vh',color:'#fff',overflowX:'hidden',fontFamily:"'DM Sans', sans-serif"}}>
      
      {/* Particle canvas background */}
      <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:0,opacity:0.7}} />
      
      {/* Gradient overlay */}
      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.05) 0%, transparent 50%)',zIndex:1,pointerEvents:'none'}} />

      {/* Content */}
      <div style={{position:'relative',zIndex:2}}>

        {/* HERO SECTION */}
        <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 5vw',maxWidth:'1200px',margin:'0 auto'}}>
          
          {/* System status line */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'48px',fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#0ea5e9',letterSpacing:'0.15em'}}>
            <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#0ea5e9',boxShadow:'0 0 8px #0ea5e9',animation:'pulse 2s infinite'}} />
            UPRAXIS_NETWORK // ONLINE // V2.0 // {count.toLocaleString()} PROBLEMS INDEXED
          </div>

          {/* Main headline */}
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(60px,12vw,180px)',lineHeight:'0.9',letterSpacing:'0.02em',margin:'0 0 32px',background:'linear-gradient(135deg, #ffffff 0%, #94a3b8 60%, #0ea5e9 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            THE INTERNET<br/>WAS BUILT TO<br/><span style={{WebkitTextFillColor:'transparent',background:'linear-gradient(90deg,#0ea5e9,#06b6d4)',WebkitBackgroundClip:'text'}}>CAPTURE</span><br/>ATTENTION.
          </h1>

          {/* Divider line with label */}
          <div style={{display:'flex',alignItems:'center',gap:'16px',margin:'0 0 32px'}}>
            <div style={{height:'1px',width:'60px',background:'#0ea5e9'}} />
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#64748b',letterSpacing:'0.1em'}}>WE BUILT THIS TO SOLVE PROBLEMS</span>
            <div style={{height:'1px',flex:1,background:'linear-gradient(90deg,#1e293b,transparent)'}} />
          </div>

          <p style={{fontSize:'18px',color:'#94a3b8',maxWidth:'480px',lineHeight:'1.7',margin:'0 0 48px',fontWeight:300}}>
            A decentralized meritocracy. No algorithms. No followers. Only the quality of your thinking determines what the world sees.
          </p>

          {/* CTA buttons */}
          <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
            <a href="/submit" style={{display:'inline-flex',alignItems:'center',gap:'10px',background:'#0ea5e9',color:'#000',padding:'16px 32px',borderRadius:'4px',fontWeight:'700',textDecoration:'none',fontSize:'14px',letterSpacing:'0.05em',fontFamily:"'JetBrains Mono',monospace",transition:'all 0.2s',boxShadow:'0 0 40px rgba(14,165,233,0.3)'}}>
              SUBMIT A PROBLEM →
            </a>
            <a href="/feed" style={{display:'inline-flex',alignItems:'center',gap:'10px',border:'1px solid #1e293b',color:'#94a3b8',padding:'16px 32px',borderRadius:'4px',fontWeight:'500',textDecoration:'none',fontSize:'14px',letterSpacing:'0.05em',fontFamily:"'JetBrains Mono',monospace",background:'rgba(255,255,255,0.02)'}}>
              EXPLORE FEED
            </a>
          </div>

        </section>

        {/* MANIFESTO STRIP */}
        <section style={{borderTop:'1px solid #0f172a',borderBottom:'1px solid #0f172a',padding:'80px 5vw',background:'rgba(14,165,233,0.02)'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'48px'}}>
            {[
              {num:'01',title:'PASTE ANYTHING',body:'Drop a YouTube video, Instagram post, tweet, or raw opinion. Our AI extracts the core problem and structures it into a high-merit proposal.',icon:'⌗'},
              {num:'02',title:'BLIND REVIEW',body:'No names. No profile pictures. No follower counts. Your submission is judged purely on clarity, logic, and evidence by the community.',icon:'◎'},
              {num:'03',title:'MERIT WINS',body:'GRS + MRS formula ensures what rises is what matters. High-impact thinking surfaces. Noise gets buried. No engagement hacking.',icon:'◈'},
            ].map(c => (
              <div key={c.num} style={{borderLeft:'1px solid #1e293b',paddingLeft:'24px'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'16px'}}>{c.num} // {c.icon}</div>
                <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'32px',letterSpacing:'0.05em',marginBottom:'12px',color:'#fff'}}>{c.title}</h3>
                <p style={{color:'#64748b',lineHeight:'1.7',fontSize:'14px',fontWeight:300}}>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4-STEP EVOLUTION */}
        <section style={{padding:'120px 5vw',maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'24px'}}>THE PROCESS</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(40px,7vw,80px)',marginBottom:'80px',color:'#fff',letterSpacing:'0.03em'}}>4-STEP EVOLUTION</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'2px'}}>
            {[
              {step:'01',title:'SUBMIT',desc:'AI structures your raw input into a problem post with evidence and proposed solutions.'},
              {step:'02',title:'BLIND REVIEW',desc:'Community experts grade the post without knowing who submitted it.'},
              {step:'03',title:'SCORE',desc:'GRS and MRS points are calculated. Merit scores determine feed position.'},
              {step:'04',title:'IMPACT',desc:'The world acts on ranked, high-merit problems. Solutions evolve into threads.'},
            ].map((s,i) => (
              <div key={s.step} style={{background:'#0a0f1a',border:'1px solid #0f172a',padding:'40px 32px',position:'relative',overflow:'hidden',minHeight:'240px'}}>
                <div style={{position:'absolute',top:'-20px',right:'-10px',fontFamily:"'Bebas Neue',sans-serif",fontSize:'100px',color:'rgba(14,165,233,0.04)',lineHeight:1}}>{s.step}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'16px'}}>{s.step}</div>
                <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',letterSpacing:'0.05em',marginBottom:'12px',color:'#fff'}}>{s.title}</h3>
                <p style={{color:'#64748b',fontSize:'13px',lineHeight:'1.6',fontWeight:300}}>{s.desc}</p>
                {i < 3 && <div style={{position:'absolute',right:'-1px',top:'50%',transform:'translateY(-50%)',width:'8px',height:'8px',background:'#0ea5e9',borderRadius:'50%',zIndex:10}} />}
              </div>
            ))}
          </div>
        </section>

        {/* PHASE ROADMAP */}
        <section style={{padding:'80px 5vw',borderTop:'1px solid #0f172a',maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'24px'}}>ROADMAP</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'24px'}}>
            {[
              {phase:'PHASE I',title:'PERSONAL',status:'ACTIVE',desc:'Individual problem solving. Build your reputation. Find your voice.'},
              {phase:'PHASE II',title:'CITY',status:'NEXT',desc:'Local infrastructure, communities, and civic challenges.'},
              {phase:'PHASE III',title:'GLOBAL',status:'PLANNED',desc:'Planetary-scale coordination on climate, health, and civilizational challenges.'},
            ].map(p => (
              <div key={p.phase} style={{padding:'32px',background: p.status==='ACTIVE'?'rgba(14,165,233,0.05)':'transparent',border:`1px solid ${p.status==='ACTIVE'?'#0ea5e9':'#1e293b'}`,borderRadius:'4px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#64748b',letterSpacing:'0.15em'}}>{p.phase}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color: p.status==='ACTIVE'?'#0ea5e9':'#334155',background: p.status==='ACTIVE'?'rgba(14,165,233,0.1)':'#0f172a',padding:'3px 8px',borderRadius:'2px',letterSpacing:'0.1em'}}>{p.status}</span>
                </div>
                <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'36px',letterSpacing:'0.05em',color:'#fff',margin:'0 0 8px'}}>{p.title}</h3>
                <p style={{color:'#64748b',fontSize:'13px',lineHeight:'1.6',margin:0}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{padding:'160px 5vw',textAlign:'center',borderTop:'1px solid #0f172a',position:'relative'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'600px',background:'radial-gradient(circle,rgba(14,165,233,0.06) 0%,transparent 70%)',pointerEvents:'none'}} />
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'#0ea5e9',letterSpacing:'0.2em',marginBottom:'24px'}}>JOIN THE NETWORK</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(48px,8vw,100px)',lineHeight:'0.9',marginBottom:'32px',color:'#fff',letterSpacing:'0.02em'}}>READY TO BUILD<br/>THE FUTURE?</h2>
          <a href="/signup" style={{display:'inline-flex',alignItems:'center',gap:'12px',background:'#0ea5e9',color:'#000',padding:'20px 48px',borderRadius:'4px',fontWeight:'700',textDecoration:'none',fontSize:'14px',letterSpacing:'0.08em',fontFamily:"'JetBrains Mono',monospace",boxShadow:'0 0 60px rgba(14,165,233,0.4)'}}>
            INITIALIZE YOUR NODE →
          </a>

          <div style={{marginTop:'120px',borderTop:'1px solid #0f172a',paddingTop:'48px',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#334155',letterSpacing:'0.2em'}}>
            UPRAXIS // 2026 // DECENTRALISED MERITOCRACY
          </div>
        </section>

      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
