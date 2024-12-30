// src/components/Results.tsx
'use client';

import { getPostItStyles } from "@/components/features/Cards/components/styles";
import { useRef, useEffect, useState } from 'react';
import { ValueWithReason, Categories, CategoryName } from "@/lib/types";
import Link from 'next/link';
import { useGameState } from "@/components/features/Exercise/hooks/useGameState";
import { clearGameState } from "@/lib/utils/storage";
import { getCompletedSession } from "@/lib/db/indexedDB";
import { useSession } from "@/components/features/Exercise/hooks/useSession";
import { useRouter } from 'next/navigation';
import { useMobile } from "@/lib/contexts/MobileContext";
import { getResponsiveTextStyles } from "@/lib/utils/styles/textStyles";
import { BlueskyShareButton, LinkedInShareButton, TwitterShareButton } from '@/components/common/ShareButtons';

/**
 * The `Results` component displays the core values results for a user.
 * It fetches and enriches the categories with reasons from a completed session,
 * and provides options to print the results, copy them to the clipboard, start a new exercise, or view previous results.
 *
 * @component
 * @returns {JSX.Element | null} The rendered component or null if not mounted.
 *
 * @example
 * <Results />
 *
 * @remarks
 * This component uses several hooks:
 * - `useRouter` for navigation.
 * - `useRef` to reference the printable content.
 * - `useState` to manage component state.
 * - `useEffect` to fetch and enrich categories with reasons.
 *
 * @function
 * @name Results
 */
export default function Results() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { categories } = useGameState();
  const { sessionId } = useSession();
  const [enrichedCategories, setEnrichedCategories] = useState<Categories>(categories);
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  useEffect(() => {
    setMounted(true);
    const enrichCategoriesWithReasons = async () => {
      if (sessionId) {
        try {
          const completedSession = await getCompletedSession(sessionId);
          if (completedSession?.finalValues) {
            const reasonsMap = Object.fromEntries(completedSession.finalValues.map(value => [value.id, value.reason]));
            const enriched = Object.entries(categories).reduce((acc, [category, values = []]) => {
              acc[category as CategoryName] = (values as ValueWithReason[]).map(value => ({
                ...value,
                reason: reasonsMap[value.id]
              }));
              return acc;
            }, {} as Record<CategoryName, ValueWithReason[]>);
            setEnrichedCategories(enriched);
          }
        } catch (error) {
          console.error('Failed to load reasons:', error);
        }
      }
    };
    enrichCategoriesWithReasons();
  }, [sessionId, categories]);
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (!winPrint) return;
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          margin: 2cm;
        }
        
        body { 
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #000;
          background: #fff;
        }

        h1 { 
          font-size: 24pt;
          color: #1a365d;
          text-align: center;
          margin-bottom: 20pt;
        }

        h2 { 
          font-size: 18pt;
          color: #2c5282;
          border-bottom: 1pt solid #2c5282;
          padding-bottom: 5pt;
          margin: 15pt 0;
        }

        h3 { 
          font-size: 14pt;
          color: #2d3748;
          margin: 10pt 0;
        }

        p { 
          font-size: 11pt;
          margin: 5pt 0;
        }

        article {
          page-break-inside: avoid;
          border: 1pt solid #e2e8f0;
          padding: 10pt;
          margin: 10pt 0;
          background: #fff;
          border-radius: 4pt;
          box-shadow: 2pt 2pt 4pt rgba(0,0,0,0.1);
        }

        section {
          margin: 20pt 0;
          page-break-inside: avoid;
        }

        .value-reason {
          font-style: italic;
          color: #4a5568;
          margin-top: 8pt;
          padding-top: 8pt;
          border-top: 1pt solid #e2e8f0;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15pt;
        }

        /* Hide non-printable elements */
        button, .no-print {
          display: none !important;
        }
      }
    `;
    winPrint.document.head.appendChild(style);
    winPrint.document.write(printContent.innerHTML);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
  };


  const veryImportantValues = Object.entries(enrichedCategories)
    .filter(([category, values]) => category === 'Very Important' && values && values.length > 0)
    .flatMap(([_, values]) => values)
    .filter((value): value is ValueWithReason => value !== undefined);

  // Add this utility function at the top of both files
  const formatValueForClipboard = (value: ValueWithReason): string => {
    return `Title: ${value.title}\nDescription: ${value.description}${value.reason ? `\nWhy: ${value.reason}` : ''}\n\n`;
  };

  const handleCopyToClipboard = (values: ValueWithReason[]) => {
    const formattedText = `My Core Values\n--------------\n\n`
      + values.map(formatValueForClipboard).join('') + `\n\nCreated with https://core-values.me`;

    navigator.clipboard.writeText(formattedText)
      .then(() => {
        // You might want to add a toast notification here
        console.log('Copied to clipboard');
        setCopySuccess(true);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setCopySuccess(false);
      });
  };

  const generateFullText = (values: ValueWithReason[]): string => {
    return values.map(value => `${value.title}${value.description ? ` - ${value.description}` : ''}`).join(', ');
  };

  const generateTitles = (values: ValueWithReason[]): string => {
    return values.map(value => value.title).join(', ');
  };

  const formatTextForPlatform = (values: ValueWithReason[], platform: 'bluesky' | 'twitter' | 'linkedin'): string => {
    const baseText = `My Core Values: `;
    const link = ` https://core-values.me`;
    const maxLength = platform === 'bluesky' ? 300 : platform === 'twitter' ? 144 : Infinity;

    const fullText = baseText + generateFullText(values) + link;
    const titlesText = baseText + generateTitles(values) + link;

    if (fullText.length <= maxLength) {
      return fullText;
    }
    else if (titlesText.length <= maxLength) {
      return titlesText;
    }
    else {
      return titlesText.substring(0, maxLength - 3) + '...';
    }

  };

  const handleNewExercise = () => {
    clearGameState();
    router.push('/');
  };

  const handleViewHistory = () => {
    router.push('/history');
  };
  const {
    postItBaseStyles,
    tapeEffect
  } = getPostItStyles(false, false);
  if (!mounted) return null;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12" role="region" aria-labelledby="results-title">
    <div ref={printRef} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
      <h1 id="results-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-black">
        Your Core Values Results
      </h1>
      <div className="flex space-x-2 justify-center pb-2">
        {!isMobile && (<button
          onClick={handlePrint}
          className="p-0  w-8 h-8 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 rounded-none flex items-center justify-center"
          aria-label="Print values"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 2a2 2 0 00-2 2v3h12V4a2 2 0 00-2-2H6zM4 8v6h12V8H4zm2 8v2a2 2 0 002 2h4a2 2 0 002-2v-2H6z" />
          </svg>
        </button>)}
        <button
          onClick={() => { setCopySuccess(!copySuccess); handleCopyToClipboard(veryImportantValues); }}
          className=" p-0 w-8 h-8 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-none flex items-center justify-center"
          aria-label="Copy values to clipboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-1h1a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a2 2 0 00-2-2H8zm0 2h4v1H8V4zm-3 3h10v9H5V7zm2 2a1 1 0 000 2h6a1 1 0 100-2H7z" />
          </svg>
          {copySuccess && (
            <span aria-hidden="true" className="text-white ml-2">
              ✓
            </span>
          )}
        </button>
        <BlueskyShareButton
          url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
          text={formatTextForPlatform(veryImportantValues, 'bluesky')}
          size={22} fill='white'
        />
        <TwitterShareButton
          url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
          text={formatTextForPlatform(veryImportantValues, 'twitter')}
          size={22} fill='white'
        />
        <LinkedInShareButton
          url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
          text={formatTextForPlatform(veryImportantValues, 'bluesky')}
          size={32} fill='white'
        />
      </div>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10" role="list" aria-label="Categories and values">
        {(Object.entries(enrichedCategories) as [CategoryName, ValueWithReason[]][]).filter(([category, values]) => category === 'Very Important' && values && values.length > 0).map(([category, values]) => <section key={category} className="bg-gray-100 rounded-lg p-4 sm:p-6" role="listitem" aria-labelledby={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
          <h2 id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-black">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" role="list" aria-label={`Values in ${category}`}>
            {values.map((value: ValueWithReason) => <article key={value.id} className={`${postItBaseStyles} ${tapeEffect} p-4`} role="listitem">
              <h3 className="font-medium text-base sm:text-lg text-black mb-2">
                {value.title}
              </h3>
              <p className="text-sm sm:text-base text-black mb-3">
                {value.description}
              </p>
              {value.reason && <div className="mt-3 pt-3 border-t border-gray-200" aria-label={`Personal meaning for ${value.title}`}>
                <p className="text-sm font-medium text-black mb-1">
                  Why it is meaningful:
                </p>
                <p className="text-sm sm:text-base text-black italic">
                  {value.reason}
                </p>
              </div>}
            </article>)}
          </div>
        </section>)}
      </div>
      <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4" role="group" aria-label="Result actions">
        <div className="flex space-x-2">
          {!isMobile && (<button
            onClick={handlePrint}
            className="p-0  w-8 h-8 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 rounded-none flex items-center justify-center"
            aria-label="Print values"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 2a2 2 0 00-2 2v3h12V4a2 2 0 00-2-2H6zM4 8v6h12V8H4zm2 8v2a2 2 0 002 2h4a2 2 0 002-2v-2H6z" />
            </svg>
          </button>)}
          <button
            onClick={() => { setCopySuccess(!copySuccess); handleCopyToClipboard(veryImportantValues); }}
            className=" p-0 w-8 h-8 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-none flex items-center justify-center"
            aria-label="Copy values to clipboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-1h1a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a2 2 0 00-2-2H8zm0 2h4v1H8V4zm-3 3h10v9H5V7zm2 2a1 1 0 000 2h6a1 1 0 100-2H7z" />
            </svg>
            {copySuccess && (
              <span aria-hidden="true" className="text-white ml-2">
                ✓
              </span>
            )}
          </button>
          <BlueskyShareButton
            url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
            text={formatTextForPlatform(veryImportantValues, 'bluesky')}
            size={22} fill='white'
          />
          <TwitterShareButton
            url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
            text={formatTextForPlatform(veryImportantValues, 'twitter')}
            size={22} fill='white'
          />
          <LinkedInShareButton
            url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
            text={formatTextForPlatform(veryImportantValues, 'linkedin')}
            size={22} fill='white' />

        </div>
        <button
          onClick={handleViewHistory}
          className="w-full sm:w-auto px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
          aria-label="View all your previous results"
        >
          View All Previous Results
        </button>
        <button
          onClick={handleNewExercise}
          className="w-full sm:w-auto px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          aria-label="Start a new values exercise"
        >
          Start New Exercise
        </button>
      </div>
    </div>


  </div>;
}