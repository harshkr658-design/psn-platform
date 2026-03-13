import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PSN — Problem Solving Network',
  description: 'The internet rebuilt for solving problems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0,padding:0,fontFamily:'system-ui,sans-serif'}}>
        <nav style={{background:'#0f172a',borderBottom:'1px solid #1e293b',padding:'0 20px',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
          <a href="/" style={{color:'#0ea5e9',fontWeight:'700',fontSize:'18px',textDecoration:'none',letterSpacing:'0.1em'}}>PSN</a>
          <div style={{display:'flex',gap:'24px'}}>
            <a href="/feed" style={{color:'#94a3b8',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>Feed</a>
            <a href="/submit" style={{color:'#94a3b8',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>Submit</a>
            <a href="/dashboard" style={{color:'#94a3b8',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>Dashboard</a>
          </div>
          <div style={{background:'#0ea5e9',color:'#000',padding:'6px 16px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',letterSpacing:'0.1em'}}>BETA</div>
        </nav>
        {children}
      </body>
    </html>
  )
}
