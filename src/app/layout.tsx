// src/app/layout.tsx
import './globals.css'
import ClientLayout from '../components/ClientLayout'
// src/app/layout.tsx
import { Inter, Kalam } from 'next/font/google'

const kalam = Kalam({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-kalam',
})

export const metadata = {
  title: 'Core Values',
  description: 'A tool to help you discover your core values',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
