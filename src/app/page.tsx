'use client'

import dynamic from 'next/dynamic'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// Dynamically import components to avoid SSR issues with drag and drop
const Home = dynamic(() => import('../pages/index'), { ssr: false })

export default function Page() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Home />
    </DndProvider>
  )
}
