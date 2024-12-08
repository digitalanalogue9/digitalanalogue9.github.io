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
export default function Results() {
  const printRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const {
    categories
  } = useGameState();
  const {
    sessionId
  } = useSession();
  const [enrichedCategories, setEnrichedCategories] = useState<Categories>(categories);
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
        body { font-size: 12pt; }
        h1 { font-size: 24pt; }
        h2 { font-size: 18pt; }
        h3 { font-size: 14pt; }
      }
    `;
    winPrint.document.head.appendChild(style);
    winPrint.document.write(printContent.innerHTML);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
  };
  const handleNewExercise = () => {
    clearGameState();
  };
  const {
    postItBaseStyles,
    tapeEffect
  } = getPostItStyles(false, false);
  if (!mounted) return null;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12" role="region" aria-labelledby="results-title">
      <div ref={printRef} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
        <h1 id="results-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-gray-900">
          Your Core Values Results
        </h1>

        <div className="space-y-6 sm:space-y-8 lg:space-y-10" role="list" aria-label="Categories and values">
          {(Object.entries(enrichedCategories) as [CategoryName, ValueWithReason[]][]).filter(([_, values]) => values && values.length > 0).map(([category, values]) => <section key={category} className="bg-gray-100 rounded-lg p-4 sm:p-6" aria-labelledby={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                <h2 id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" role="list" aria-label={`Values in ${category}`}>
                  {values.map((value: ValueWithReason) => <article key={value.id} className={`${postItBaseStyles} ${tapeEffect} p-4`} role="listitem">
                      <h3 className="font-medium text-base sm:text-lg text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 mb-3">
                        {value.description}
                      </p>
                      {value.reason && <div className="mt-3 pt-3 border-t border-gray-200" aria-label={`Personal meaning for ${value.title}`}>
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            Why it is meaningful:
                          </p>
                          <p className="text-sm sm:text-base text-gray-700 italic">
                            {value.reason}
                          </p>
                        </div>}
                    </article>)}
                </div>
              </section>)}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4" role="group" aria-label="Result actions">
        <button onClick={handlePrint} className="w-full sm:w-auto px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2" aria-label="Print your results">
          Print Results
        </button>

        <Link href="/" onClick={handleNewExercise} className="w-full sm:w-auto px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2" aria-label="Start a new values exercise">
          Start New Exercise
        </Link>

        <Link href="/history" className="text-blue-700 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded px-2 py-1" aria-label="View all your previous results">
          View All Previous Results
        </Link>
      </div>
    </div>;
}