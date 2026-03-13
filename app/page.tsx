'use client'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      background: '#080808',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>

      {/* HERO — full viewport */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 6vw',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}>

        {/* Subtle background gradient */}
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse 80% 60% at 10% 40%, rgba(14,165,233,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Status pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '64px',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(14,165,233,0.08)',
            border: '1px solid rgba(14,165,233,0.2)',
            borderRadius: '100px',
            padding: '6px 14px 6px 10px'
          }}>
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: '#0ea5e9',
              boxShadow: '0 0 8px #0ea5e9',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#0ea5e9',
              letterSpacing: '0.08em'
            }}>Public Beta — Phase I Active</span>
          </div>
        </div>

        {/* Main headline — Instrument Serif, massive */}
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(48px, 8.5vw, 130px)',
          lineHeight: '1.0',
          fontWeight: 400,
          margin: '0 0 0',
          maxWidth: '900px',
          letterSpacing: '-0.02em',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease 0.1s',
          position: 'relative',
          zIndex: 1
        }}>
          The internet was built to capture{' '}
          <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>attention.</span>
        </h1>

        {/* Second line — different weight */}
        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(48px, 8.5vw, 130px)',
          lineHeight: '1.0',
          fontWeight: 400,
          margin: '0 0 48px',
          letterSpacing: '-0.02em',
          color: '#0ea5e9',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease 0.2s',
          position: 'relative',
          zIndex: 1
        }}>
          We built this to solve problems.
        </h2>

        {/* Descriptor */}
        <p style={{
          fontSize: '18px',
          color: '#64748b',
          maxWidth: '480px',
          lineHeight: '1.7',
          margin: '0 0 56px',
          fontWeight: 300,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease 0.3s',
          position: 'relative',
          zIndex: 1
        }}>
          A decentralised meritocracy where the quality of your thinking —
          not your follower count — determines what the world sees.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease 0.4s',
          position: 'relative',
          zIndex: 1
        }}>
          <a href="/submit" style={{
            background: '#fff',
            color: '#000',
            padding: '14px 28px',
            borderRadius: '100px',
            fontWeight: '500',
            textDecoration: 'none',
            fontSize: '15px',
            letterSpacing: '-0.01em',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Start solving →
          </a>
          <a href="/feed" style={{
            background: 'transparent',
            color: '#94a3b8',
            padding: '14px 28px',
            borderRadius: '100px',
            fontWeight: '400',
            textDecoration: 'none',
            fontSize: '15px',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.2s'
          }}>
            Explore the feed
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '6vw',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.3
        }}>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, #fff, transparent)',
            animation: 'scrollLine 2s ease infinite'
          }} />
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '32px 6vw',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {[
          { num: '5,847', label: 'Problems indexed' },
          { num: '127', label: 'Cities active' },
          { num: '23,400+', label: 'Reviews submitted' },
          { num: '4.2', label: 'Avg merit score' },
        ].map(s => (
          <div key={s.label}>
            <div style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: '36px',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1,
              marginBottom: '6px'
            }}>{s.num}</div>
            <div style={{
              fontSize: '13px',
              color: '#475569',
              fontWeight: 400
            }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS — asymmetric */}
      <section style={{
        padding: '160px 6vw',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'start'
        }}>
          {/* Left — sticky label */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#0ea5e9',
              letterSpacing: '0.15em',
              marginBottom: '24px'
            }}>HOW IT WORKS</div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(36px, 4vw, 64px)',
              fontWeight: 400,
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              margin: '0 0 24px',
              color: '#fff'
            }}>
              Four steps.<br />
              <span style={{ color: '#475569', fontStyle: 'italic' }}>
                One mission.
              </span>
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#475569',
              lineHeight: '1.7',
              maxWidth: '320px'
            }}>
              Every great solution starts as a messy thought. UPRAXIS turns that thought into structured, reviewed, evolving action.
            </p>
          </div>

          {/* Right — steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              {
                num: '01',
                title: 'Paste anything',
                body: 'Drop a YouTube link, Instagram post, frustrated opinion, or raw idea. AI structures it into a clear, evidence-backed problem post in seconds.'
              },
              {
                num: '02',
                title: 'Reviewed blindly',
                body: 'No names. No avatars. No follower counts. Your submission is judged purely on clarity, logic, and evidence by the community.'
              },
              {
                num: '03',
                title: 'Merit is calculated',
                body: 'GRS and MRS scores determine feed position. Quality rises. Noise sinks. No engagement hacking possible.'
              },
              {
                num: '04',
                title: 'Ideas evolve',
                body: 'Solutions branch into threads. Others build on your thinking. Problems gain momentum until they become real.'
              },
            ].map((s, i) => (
              <div key={s.num} style={{
                padding: '40px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '16px',
                marginBottom: '8px',
                transition: 'all 0.3s'
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#334155',
                  letterSpacing: '0.15em',
                  marginBottom: '12px'
                }}>{s.num}</div>
                <h3 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: '28px',
                  fontWeight: 400,
                  margin: '0 0 10px',
                  letterSpacing: '-0.01em'
                }}>{s.title}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  lineHeight: '1.7',
                  margin: 0,
                  fontWeight: 300
                }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section style={{
        padding: '0 6vw 160px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#0ea5e9',
          letterSpacing: '0.15em',
          marginBottom: '64px'
        }}>THE FOUNDATION</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px'
        }}>
          {[
            {
              title: 'Paste anything',
              body: 'Any link, opinion, or rant. AI extracts the core problem and structures it into a high-merit proposal.',
              icon: '⌗'
            },
            {
              title: 'Reviewed blindly',
              body: 'Author identity fully hidden. Five-dimensional scoring. Only the idea is judged — never the person.',
              icon: '◎'
            },
            {
              title: 'Merit wins',
              body: 'GRS × MRS formula surfaces what matters. High-impact thinking rises. Noise gets buried permanently.',
              icon: '◈'
            },
          ].map(c => (
            <div key={c.title} style={{
              padding: '48px 40px',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '16px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '20px',
                opacity: 0.4
              }}>{c.icon}</div>
              <h3 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '24px',
                fontWeight: 400,
                margin: '0 0 12px',
                letterSpacing: '-0.01em'
              }}>{c.title}</h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.7',
                margin: 0,
                fontWeight: 300
              }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHASE ROADMAP */}
      <section style={{
        padding: '0 6vw 160px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#0ea5e9',
          letterSpacing: '0.15em',
          marginBottom: '64px'
        }}>ROADMAP</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px'
        }}>
          {[
            { phase: 'Phase I', title: 'Personal', status: 'NOW', desc: 'Individual problem solving. Build your reputation. Prove the mechanic works.' },
            { phase: 'Phase II', title: 'City', status: 'NEXT', desc: 'Civic problems. Local communities. Geographic problem clusters on the world map.' },
            { phase: 'Phase III', title: 'Global', status: 'FUTURE', desc: 'Institutional challenges. Funded bounties. Civilisation-scale coordination.' },
          ].map((p, i) => (
            <div key={p.phase} style={{
              padding: '48px 40px',
              background: i === 0 ? 'rgba(14,165,233,0.04)' : 'rgba(255,255,255,0.015)',
              border: `1px solid ${i === 0 ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.04)'}`,
              borderRadius: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#334155',
                  letterSpacing: '0.1em'
                }}>{p.phase}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  color: i === 0 ? '#0ea5e9' : '#334155',
                  background: i === 0 ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.04)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  letterSpacing: '0.1em'
                }}>{p.status}</span>
              </div>
              <h3 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '36px',
                fontWeight: 400,
                margin: '0 0 12px',
                letterSpacing: '-0.01em',
                color: i === 0 ? '#fff' : '#475569'
              }}>{p.title}</h3>
              <p style={{
                fontSize: '14px',
                color: '#475569',
                lineHeight: '1.7',
                margin: 0,
                fontWeight: 300
              }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        padding: '160px 6vw',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px', height: '800px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(40px, 6vw, 80px)',
          fontWeight: 400,
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          margin: '0 0 24px',
          position: 'relative'
        }}>
          Ready to build<br />
          <span style={{ fontStyle: 'italic', color: '#475569' }}>the future?</span>
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#475569',
          marginBottom: '40px',
          position: 'relative'
        }}>Join the first hundred thinkers on the network.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', position: 'relative' }}>
          <a href="/signup" style={{
            background: '#fff',
            color: '#000',
            padding: '16px 36px',
            borderRadius: '100px',
            fontWeight: '500',
            textDecoration: 'none',
            fontSize: '15px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>Get started →</a>
          <a href="/feed" style={{
            background: 'transparent',
            color: '#64748b',
            padding: '16px 36px',
            borderRadius: '100px',
            fontWeight: '400',
            textDecoration: 'none',
            fontSize: '15px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>Browse the feed</a>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #0ea5e9; }
          50% { opacity: 0.4; box-shadow: 0 0 4px #0ea5e9; }
        }
        @keyframes scrollLine {
          0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(1); transform-origin: bottom; }
        }
        * { box-sizing: border-box; }
        ::selection { background: rgba(14,165,233,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .roadmap-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
