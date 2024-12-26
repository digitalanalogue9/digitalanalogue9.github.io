'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StartScreen from "@/components/features/Home/components/StartScreen";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PWAPrompt from "@/components/common/PWAPrompt";
import { clearGameState } from "@/lib/utils/storage";
import { forceReload } from "@/lib/utils/cache";
import { getLocalStorage, setLocalStorage } from '../lib/utils/localStorage';

/**
 * The Home component is the main entry point for the Core Values application.
 * It handles version checking and game state clearing on initial load.
 *
 * @returns {JSX.Element} The rendered Home component.
 *
 * @remarks
 * - Uses `useRouter` for navigation.
 * - Checks the application version stored in localStorage and forces a reload if it has changed.
 * - Clears the game state on initial load.
 * - Utilizes `DndProvider` for drag-and-drop functionality.
 *
 * @component
 * @example
 * ```tsx
 * import Home from './page';
 * 
 * function App() {
 *   return <Home />;
 * }
 * ```
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const lastVersion = getLocalStorage('app-version', '0.0.0');
    const currentVersion = process.env.NEXT_PUBLIC_VERSION ?? '0.0.0';
    if (lastVersion !== currentVersion) {
      setLocalStorage('app-version', currentVersion);
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
