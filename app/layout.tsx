import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PSN — Problem Solving Network',
  description: 'A decentralised meritocracy for the evolution of collective intelligence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-[#0ea5e9]/30`}>
        <Navbar />
        <div className="pb-16 md:pb-0">
          {children}
        </div>
      </body>
    </html>
  )
}
