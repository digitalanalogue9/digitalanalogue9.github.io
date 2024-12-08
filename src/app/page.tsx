'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StartScreen from "@/components/features/Home/components/StartScreen";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PWAPrompt from "@/components/common/PWAPrompt";
import { clearGameState } from "@/lib/utils/storage";
import { forceReload } from "@/lib/utils/cache";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const lastVersion = localStorage.getItem('app-version');
    const currentVersion = process.env.NEXT_PUBLIC_VERSION ?? '0.0.0';
    if (lastVersion !== currentVersion) {
      localStorage.setItem('app-version', currentVersion);
      forceReload();
    }
  }, []);

  useEffect(() => {
    clearGameState();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex flex-col" aria-label="Core Values Application">
        <h1 className="sr-only">Core Values - Personal Value Discovery Tool</h1>
        <StartScreen />
        <PWAPrompt />
      </div>
    </DndProvider>
  );
}
