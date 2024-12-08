// src/components/Navigation.tsx
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const getActiveClass = (path: string) => {
    return pathname === path 
      ? 'bg-white text-blue-700 font-semibold rounded-md' 
      : 'text-white hover:bg-white/20 rounded-md transition-colors';
  };

  return (
    <nav 
      className="flex items-center justify-between px-4 py-2"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link 
        href="/" 
        className="text-xl font-bold text-white"
        aria-label="Core Values Home"
      >
        Core Values
      </Link>

      {/* Desktop Navigation */}
      <div 
        className="hidden md:flex space-x-4"
        role="menubar"
        aria-label="Desktop navigation"
      >
        <Link 
          href="/" 
          className={`${getActiveClass('/')} text-lg px-4 py-2`}
          role="menuitem"
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`${getActiveClass('/about')} text-lg px-4 py-2`}
          role="menuitem"
        >
          About
        </Link>
        <Link 
          href="/history" 
          className={`${getActiveClass('/history')} text-lg px-4 py-2`}
          role="menuitem"
        >
          History
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white p-2"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="absolute top-14 right-4 bg-white shadow-lg rounded-lg py-2 z-50"
            role="menu"
            aria-label="Mobile navigation"
          >
            <Link 
              href="/" 
              className="block px-4 py-2 text-white hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-2 text-white hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
            >
              About
            </Link>
            <Link 
              href="/history" 
              className="block px-4 py-2 text-white hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
            >
              History
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
