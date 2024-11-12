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
        <meta charSet="utf-8" />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" 
        />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <title>Core Values</title>
        <meta name="description" content="Discover and prioritise your personal core values" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
        {/* Add cache busting for development */}
        {process.env.NODE_ENV === 'development' && (
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        )}
      </head>
      <body>
        <MobileProvider>
          <Navigation />
          <main className="pt-3 min-h-[calc(100vh-env(safe-area-inset-bottom))]">
            {children}
            <div id="portal-root" />
          </main>
        </MobileProvider>
      </body>
    </html>
  )
}
