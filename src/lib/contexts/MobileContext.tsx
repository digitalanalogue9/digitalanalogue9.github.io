'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MobileContextType } from '../types/Context';

const MobileContext = createContext<MobileContextType | undefined>(undefined);

/**
 * Provides a context to determine if the current viewport is considered mobile.
 * It listens to window resize events and updates the context value accordingly.
 *
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 *
 * @returns {JSX.Element} The provider component that supplies the `isMobile` value to its children.
 */
export function MobileProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return <MobileContext.Provider value={{ isMobile }}>{children}</MobileContext.Provider>;
}

export function useMobile() {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
}
