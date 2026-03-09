import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Hunt for Abundant Blue — Patagonia Down Sweater',
  description: 'Searching daily for the rare Patagonia Down Sweater in Abundant Blue colorway, Women\'s Small.',
  themeColor: '#080c12',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
