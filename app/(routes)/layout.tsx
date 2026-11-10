"use client";

import { useState } from 'react'
import { Roboto } from 'next/font/google'
import '../globals.css'
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { cn } from '@/lib/utils'
import { SessionProvider } from "next-auth/react"
import Topbar from '@/components/custom-components/topbar';
import SideNav from '@/components/custom-components/sidenav';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export default function RootLayout({
  children
}: {
  children: React.ReactNode,
}) {
  // sidebar starts as the icon rail; the top bar's menu button expands it (lg+)
  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <html lang="en">
      <body className={cn(roboto.className, "custom-scrollbar min-h-screen antialiased")}>
        <SessionProvider>
          <Topbar onToggleGuide={() => setGuideOpen((open) => !open)} />
          <SideNav expanded={guideOpen} />
          {/* offsets match the fixed top bar (h-14) and sidebar (72px rail / 240px guide) */}
          <main className={cn("min-h-screen pl-[72px] pt-14", guideOpen && "lg:pl-60")}>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
