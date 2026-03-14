export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'24px',padding:'40px',textAlign:'center',fontFamily:'system-ui'}}>
      <div style={{fontSize:'11px',letterSpacing:'0.2em',color:'#0ea5e9',textTransform:'uppercase',fontFamily:'monospace'}}>UPRAXIS — Public Beta</div>
      <h1 style={{fontSize:'clamp(40px,7vw,90px)',fontWeight:'300',maxWidth:'800px',lineHeight:'1.1',margin:'0',letterSpacing:'-0.02em'}}>
        The internet was built to capture <em style={{color:'#475569'}}>attention.</em>
      </h1>
      <h2 style={{fontSize:'clamp(40px,7vw,90px)',fontWeight:'300',margin:'0',color:'#0ea5e9',letterSpacing:'-0.02em'}}>
        We built this to solve problems.
      </h2>
      <p style={{fontSize:'18px',color:'#64748b',maxWidth:'460px',lineHeight:'1.7',margin:'0',fontWeight:'300'}}>
        A decentralised meritocracy. No algorithms. No followers. Only the quality of your thinking determines what the world sees.
      </p>
      <div style={{display:'flex',gap:'12px',marginTop:'8px'}}>
        <a href="/submit" style={{background:'#fff',color:'#000',padding:'14px 28px',borderRadius:'100px',fontWeight:'500',textDecoration:'none',fontSize:'15px'}}>Start solving →</a>
        <a href="/feed" style={{border:'1px solid rgba(255,255,255,0.1)',color:'#64748b',padding:'14px 28px',borderRadius:'100px',textDecoration:'none',fontSize:'15px'}}>Explore feed</a>
      </div>
    </div>
  )
}
