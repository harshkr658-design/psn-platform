'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Dynamic import for Leaflet (client-side only)
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })

const MAP_PINS = [
  { lat: 40.7128, lng: -74.0060, city: 'New York', problems: 847, category: 'Technology' },
  { lat: 51.5074, lng: -0.1278, city: 'London', problems: 623, category: 'Social' },
  { lat: 28.6139, lng: 77.2090, city: 'New Delhi', problems: 512, category: 'Education' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', problems: 445, category: 'Technology' },
  { lat: -23.5505, lng: -46.6333, city: 'São Paulo', problems: 389, category: 'Economy' },
  { lat: 48.8566, lng: 2.3522, city: 'Paris', problems: 334, category: 'Environment' },
  { lat: 55.7558, lng: 37.6173, city: 'Moscow', problems: 298, category: 'Politics' },
  { lat: 39.9042, lng: 116.4074, city: 'Beijing', problems: 276, category: 'Health' },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', problems: 198, category: 'Social' },
  { lat: 6.5244, lng: 3.3792, city: 'Lagos', problems: 167, category: 'Economy' },
  { lat: 19.0760, lng: 72.8777, city: 'Mumbai', problems: 445, category: 'Social' },
  { lat: 37.5665, lng: 126.9780, city: 'Seoul', problems: 312, category: 'Technology' },
  { lat: -26.2041, lng: 28.0473, city: 'Johannesburg', problems: 143, category: 'Social' },
  { lat: 41.0082, lng: 28.9784, city: 'Istanbul', problems: 187, category: 'Politics' },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai', problems: 156, category: 'Economy' },
]

export default function WorldMap() {
  const [isClient, setIsClient] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    import('leaflet').then((leaflet) => {
      setL(leaflet)
    })
  }, [])

  if (!isClient || !L) return <div className="min-h-screen bg-black flex items-center justify-center text-[#0ea5e9] font-mono">INITIALIZING GLOBAL UPLINK...</div>

  // Create custom pulsing icon
  const pulsingIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #0ea5e9; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 10px #0ea5e9; animation: pulse 2s infinite;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })

  return (
    <main className="h-screen w-full bg-black relative flex flex-col overflow-hidden pt-16">
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .leaflet-container { background: #000 !important; }
        .leaflet-popup-content-wrapper { background: #050a14; color: #fff; border: 1px solid #0ea5e940; border-radius: 8px; }
        .leaflet-popup-tip { background: #050a14; border: 1px solid #0ea5e940; }
      `}</style>
      
      {/* Top Stats Bar */}
      <div className="z-[1000] bg-black/80 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center overflow-x-auto gap-12 shrink-0">
        {[
          { label: 'TOTAL PROBLEMS', value: '5,847' },
          { label: 'ACTIVE CITIES', value: '127' },
          { label: 'COUNTRIES', value: '43' },
          { label: 'SOLVED THIS WEEK', value: '234', color: '#0ea5e9' }
        ].map(s => (
          <div key={s.label} className="flex flex-col min-w-fit">
            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{s.label}</span>
            <span className="text-2xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", color: s.color || '#fff' }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 relative flex">
        {/* Collapsible Sidebar */}
        <div className={`z-[1000] bg-black/90 border-r border-white/5 transition-all duration-300 relative ${sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
          <div className="p-8 w-80">
            <h2 className="text-[10px] font-bold text-[#0ea5e9] tracking-[0.3em] mb-8 uppercase">// HOT SPOTS</h2>
            <div className="space-y-8">
              {MAP_PINS.slice(0, 5).sort((a,b) => b.problems - a.problems).map(city => (
                <div key={city.city}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-sm tracking-tight">{city.city.toUpperCase()}</span>
                    <span className="text-[10px] font-mono text-slate-500">{city.problems} ITEMS</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0ea5e9]" style={{ width: `${(city.problems / 847) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="z-[1000] absolute left-0 top-1/2 -translate-y-1/2 bg-black border border-white/10 p-1 rounded-r-md text-slate-500 hover:text-white"
          style={{ marginLeft: sidebarOpen ? '320px' : '0' }}
        >
          {sidebarOpen ? '←' : '→'}
        </button>

        {/* Map Container */}
        <div className="flex-1 h-full z-0">
          <MapContainer center={[20, 0]} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {MAP_PINS.map((pin, i) => (
              <Marker key={i} position={[pin.lat, pin.lng]} icon={pulsingIcon}>
                <Popup>
                  <div className="p-2">
                      <h4 className="font-bold text-lg mb-1 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{pin.city}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-tighter">{pin.category} // {pin.problems} PROBLEMS</p>
                      <a href="/feed" className="text-[#0ea5e9] text-[10px] font-bold uppercase tracking-widest no-underline">View Problems →</a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </main>
  )
}
