import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
