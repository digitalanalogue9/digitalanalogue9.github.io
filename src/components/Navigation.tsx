// src/components/Navigation.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// src/components/Navigation.tsx
export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/history', label: 'History' }
  ];

  return (
    <nav 
      aria-label="Main navigation"
      className="flex justify-between items-center h-16"
    >
      <div 
        className="flex-shrink-0"
        aria-label="Site logo"
      >
        <Link 
          href="/" 
          className="text-xl font-bold text-white hover:text-white/90 transition-colors"
          aria-label="Core Values Home"
        >
          <span aria-hidden="true">Core Values</span>
          <span className="sr-only">Return to homepage</span>
        </Link>
      </div>

      <div className="flex items-center">
        <ul 
          className="flex space-x-4" 
          role="menubar"
          aria-label="Primary navigation"
        >
          {navItems.map(({ href, label }) => (
            <li 
              key={href} 
              role="none"
            >
              <Link
                href={href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-white text-blue-600'
                    : 'text-white/90 hover:bg-blue-400 hover:text-white'
                }`}
                role="menuitem"
                aria-current={pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
