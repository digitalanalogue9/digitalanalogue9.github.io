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
    <nav className="flex items-center justify-between px-4 py-2" role="navigation" aria-label="Main navigation">
      <Link
        href="/"
        className="text-xl font-bold text-white no-underline transition-colors hover:text-green-400"
        aria-label="Core Values Home"
      >
        Core Values
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden space-x-4 md:flex" aria-label="Desktop navigation">
        <Link
          href="/"
          className={`${getActiveClass('/')} px-4 py-2 text-lg`}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`${getActiveClass('/about')} px-4 py-2 text-lg`}
          aria-current={pathname === '/about' ? 'page' : undefined}
        >
          About
        </Link>
        <Link
          href="/howtouse"
          className={`${getActiveClass('/howtouse')} px-4 py-2 text-lg`}
          aria-current={pathname === '/howtouse' ? 'page' : undefined}
        >
          How to use
        </Link>
        <Link
          href="/history"
          className={`${getActiveClass('/history')} px-4 py-2 text-lg`}
          aria-current={pathname === '/history' ? 'page' : undefined}
        >
          History
        </Link>
        <Link
          href="/privacy"
          className={`${getActiveClass('/privacy')} px-4 py-2 text-lg`}
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
          className="bg-blue-700 p-2 text-white"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-controls="mobile-menu"
        >
          <svg
            className="h-6 w-6"
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
            className="absolute right-4 top-14 z-50 rounded-lg bg-white py-2 shadow-lg"
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              className="block px-4 py-2 text-black no-underline hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-black no-underline hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === '/about' ? 'page' : undefined}
              role="menuitem"
            >
              About
            </Link>
            <Link
              href="/history"
              className="block px-4 py-2 text-black no-underline hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === '/history' ? 'page' : undefined}
            >
              History
            </Link>
            <Link
              href="/privacy"
              className="block px-4 py-2 text-black no-underline hover:bg-gray-100"
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
