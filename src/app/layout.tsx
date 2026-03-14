import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/theme.css'
import Navbar from '@/components/Navbar'
import MobileTabBar from '@/components/MobileTabBar'
import { DemoProvider } from '@/context/DemoStore'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PSN 2.0 — Where Thinking Becomes Doing',
  description: 'A decentralized meritocracy for the evolution of collective intelligence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-[#0ea5e9]/10`} style={{margin:0,padding:0,background:'#080808',fontFamily:"'Inter',sans-serif"}}>
        <DemoProvider>
          <Navbar />
          <div className="pb-16 md:pb-0">
            {children}
          </div>
          <MobileTabBar />
        </DemoProvider>
      </body>
    </html>
  )
}
