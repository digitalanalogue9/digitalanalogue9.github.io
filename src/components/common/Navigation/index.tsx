// src/components/Navigation.tsx
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
/**
 * Navigation component that provides both desktop and mobile navigation menus.
 * 
 * @component
 * @example
 * // Usage example:
 * <Navigation /> 
 */
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const getActiveClass = (path: string) => {
    return pathname === path
      ? 'bg-white text-blue-700 font-bold rounded-md no-underline'
      : 'text-white font-semibold hover:bg-white/80 hover:text-blue-700 rounded-md transition-colors no-underline';
  };

  return (
    <nav
      className="flex items-center justify-between px-4 py-2"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="text-xl font-bold text-white no-underline hover:text-green-400 transition-colors"
        aria-label="Core Values Home"
      >
        Core Values
      </Link>

      {/* Desktop Navigation */}
      <div
        className="hidden md:flex space-x-4"
        aria-label="Desktop navigation"
      >
        <Link
          href="/"
          className={`${getActiveClass('/')} text-lg px-4 py-2`}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`${getActiveClass('/about')} text-lg px-4 py-2`}
          aria-current={pathname === '/about' ? 'page' : undefined}
        >
          About
        </Link>
        <Link
          href="/history"
          className={`${getActiveClass('/history')} text-lg px-4 py-2`}
          aria-current={pathname === '/history' ? 'page' : undefined}
        >
          History
        </Link>
        <Link
          href="/privacy"
          className={`${getActiveClass('/privacy')} text-lg px-4 py-2`}
          aria-current={pathname === '/privacy' ? 'page' : undefined}
        >
          Privacy
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white p-2 bg-blue-700"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
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
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              className="block px-4 py-2 text-black hover:bg-gray-100 no-underline"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-black hover:bg-gray-100 no-underline"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === '/about' ? 'page' : undefined}
              role="menuitem"
            >
              About
            </Link>
            <Link
              href="/history"
              className="block px-4 py-2 text-black hover:bg-gray-100 no-underline"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === '/history' ? 'page' : undefined}
            >
              History
            </Link>
            <Link
              href="/privacy"
              className="block px-4 py-2 text-black hover:bg-gray-100 no-underline"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === '/privacy' ? 'page' : undefined}
            >
              Privacy
            </Link>
          </div>

        )}
      </div>
    </nav>
  );
}
