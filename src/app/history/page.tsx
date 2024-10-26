'use client'

import dynamic from 'next/dynamic'

const History = dynamic(() => import('../../pages/history'), { ssr: false })

export default function HistoryPage() {
  return <History />
}
