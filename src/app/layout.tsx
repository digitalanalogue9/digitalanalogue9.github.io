// layout.tsx
'use client';

import '@/styles/globals.css';
import Navigation from "@/components/common/Navigation";
import { MobileProvider } from "@/lib/contexts/MobileContext";
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.webmanifest" type="application/manifest+json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <title>Core Values</title>
        <meta name="description" content="Discover and prioritise your personal values" />
        {/* {process.env.NODE_ENV === 'development' && <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />} */}
      </head>
      <body className="bg-gray-100">
        <MobileProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-blue-700 text-white shadow-md flex-shrink-0" role="banner" aria-label="Site header">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Navigation />
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex flex-col md:overflow-hidden" // Only hide overflow on desktop
          role="main" aria-label="Main content">
              {children}
              <div id="portal-root" />
            </main>

            {/* Footer */}
            <footer className="bg-blue-700 text-white md:flex-shrink-0" // Only shrink on desktop
          role="contentinfo" aria-label="Site footer">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-white text-sm">
                  © {new Date().getFullYear()} Core Values App
                </p>
              </div>
            </footer>
          </div>
        </MobileProvider>
      </body>
    </html>;
}