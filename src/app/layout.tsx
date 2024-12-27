// layout.tsx
'use client';

import '@/styles/globals.css';
import Navigation from "@/components/common/Navigation";
import { MobileProvider } from "@/lib/contexts/MobileContext";
import CookieBanner from '@/components/common/CookieBanner';
import GoogleAnalytics from '@/components/common/GoogleAnalytics';
import { getEnvString } from "@/lib/utils/config/envUtils";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import { BlueskyShareButton, LinkedInShareButton, TwitterShareButton } from '@/components/common/ShareButtons';


/**
 * RootLayout component that serves as the main layout for the application.
 * It includes the HTML structure, head metadata, and the main layout structure
 * with a header, main content area, and footer.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the main content area.
 *
 * @returns {JSX.Element} The RootLayout component.
 */
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return <html lang="en">
    <head>
      <title>Core Values</title>
      <meta name="description" content="Discover and prioritise your personal values" />
      <meta name="msapplication-TileColor" content="#1d4ed8" />
      <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
      <meta name="theme-color" content="#1d4ed8" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'} />
      <meta property="og:title" content="Core Values" />
      <meta property="og:description" content="Discover and prioritise your personal values" />
      <meta property="og:image" content="https://core-values.me/icons/icon-192x192.png" />
      <meta property="og:site_name" content="Core Values" />
      <link rel="manifest" href="/manifest.webmanifest" type="application/manifest+json" />
      <link rel="shortcut icon" href="/icons/favicon.ico" />
      <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <Suspense>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-JZPX5JCP5D'} />
      </Suspense>
    </head>
    <body className="bg-gray-100">
      <MobileProvider>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-blue-700 text-white shadow-md flex-shrink-0" role="banner" aria-label="Site header">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Navigation />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 flex flex-col md:overflow-hidden" // Only hide overflow on desktop
            role="main" aria-label="Main content">
            {children}
            <div id="portal-root" />
          </main>
          <CookieBanner />
          {/* Footer */}
          <footer className="bg-blue-700 text-white md:flex-shrink-0" // Only shrink on desktop
            role="contentinfo" aria-label="Site footer">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full text-white text-sm">
              <span>
                © {new Date().getFullYear()} Core Values App
              </span>
              {/* Share Buttons */}
              <div className="flex space-x-4">
                <BlueskyShareButton
                  text="Check out Core Values at https://core-values.me"
                  size={22} fill='none'
                  url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
                  round
                />
                <TwitterShareButton
                  url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
                  text="Check out Core Values!" size={20} fill='currentColor' round />
                <LinkedInShareButton
                  url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
                  text="Check out Core Values at https://core-values.me" size={32} fill='currentColor' round />
              </div>
            </div>
          </footer>
        </div>
      </MobileProvider>

    </body>
  </html>;
}