'use client'

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
              Core Values
            </Link>
          </div>
          <div className="flex">
            <Link href="/history" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
              History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
