'use client'

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import OfflineIndicator from './OfflineIndicator';
import UpdateNotification from './UpdateNotification';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isHistoryPage = pathname === '/history';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <main className="flex-grow container mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
      <footer className="mt-auto py-4 text-center text-xs sm:text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Core Values. All rights reserved.</p>
      </footer>
      {!isHistoryPage && <OfflineIndicator />}
      <UpdateNotification />
    </div>
  );
}
