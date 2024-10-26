// src/components/ClientLayout.tsx
'use client'

import { ReactNode } from 'react'

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Your client-side logic here
  return (
    <div>
      {/* Client-side features */}
      {children}
    </div>
  )
}
