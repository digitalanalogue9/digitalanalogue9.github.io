import './globals.css'
import Navigation from '../components/Navigation'

export const viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata = {
  title: 'Core Values',
  description: 'Discover and prioritise your personal core values',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
      </head>
      <body>
        <Navigation />
        <main className="pt-3">
          {children}
          <div id="portal-root" />
        </main>
      </body>
    </html>
  )
}
