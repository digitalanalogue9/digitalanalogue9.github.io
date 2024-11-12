// src/app/layout.tsx
'use client'

import './globals.css'
import Navigation from '../components/Navigation'
import { MobileProvider } from '@/contexts/MobileContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <title>Core Values</title>
        <meta name="description" content="Discover and prioritise your personal core values" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
      </head>
      <body>
        <MobileProvider>
          <Navigation />
          <main className="pt-3">
            {children}
            <div id="portal-root" />
          </main>
        </MobileProvider>
      </body>
    </html>
  )
}
