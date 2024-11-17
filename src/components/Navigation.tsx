// src/components/Navigation.tsx
import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          className="text-white"
          role="menuitem"
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className="text-white"
          role="menuitem"
        >
          About
        </Link>
        <Link 
          href="/history" 
          className="text-white"
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
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
            >
              About
            </Link>
            <Link 
              href="/history" 
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
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
