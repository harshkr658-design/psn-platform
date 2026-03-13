export default function Home() {
  return (
    <main style={{minHeight:'100vh',background:'#000',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'24px',padding:'40px',textAlign:'center'}}>
      <div style={{fontSize:'11px',letterSpacing:'0.3em',color:'#0ea5e9',textTransform:'uppercase'}}>PSN — Public Beta</div>
      <h1 style={{fontSize:'clamp(32px,6vw,64px)',fontWeight:'700',maxWidth:'700px',lineHeight:'1.1',margin:'0'}}>
        The internet was built to capture attention.
      </h1>
      <p style={{fontSize:'20px',color:'#94a3b8',maxWidth:'500px',margin:'0'}}>
        We built this to solve problems.
      </p>
      <div style={{display:'flex',gap:'16px',flexWrap:'wrap',justifyContent:'center'}}>
        <a href="/submit" style={{background:'#0ea5e9',color:'#000',padding:'14px 32px',borderRadius:'8px',fontWeight:'600',textDecoration:'none',fontSize:'16px'}}>Start Solving</a>
        <a href="/feed" style={{border:'1px solid #334155',color:'#fff',padding:'14px 32px',borderRadius:'8px',fontWeight:'600',textDecoration:'none',fontSize:'16px'}}>See What Is Being Solved</a>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',maxWidth:'700px',marginTop:'40px'}}>
        {[
          {title:'Paste anything',desc:'Any link, opinion, or rant. AI structures it for you.'},
          {title:'Reviewed blindly',desc:'No names, no followers. Only the idea is judged.'},
          {title:'Merit wins',desc:'GRS + MRS decides what the world sees. Not the algorithm.'},
        ].map(c => (
          <div key={c.title} style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:'12px',padding:'20px',textAlign:'left'}}>
            <div style={{fontWeight:'600',marginBottom:'8px',color:'#0ea5e9'}}>{c.title}</div>
            <div style={{fontSize:'14px',color:'#94a3b8',lineHeight:'1.5'}}>{c.desc}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
