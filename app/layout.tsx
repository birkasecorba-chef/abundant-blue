import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Hunt for Abundant Blue — Patagonia Down Sweater',
  description:
    "Searching daily for the rare Patagonia Down Sweater in Abundant Blue colorway, Women's Small. 14 platforms monitored.",
  openGraph: {
    title: 'The Hunt for Abundant Blue',
    description: 'One discontinued colorway. 14 platforms. Daily scans.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#080c12',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
