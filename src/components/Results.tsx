'use client'

import { useRef, useEffect, useState } from 'react';
import { Value, Categories, CategoryName } from "@/types";
import Link from 'next/link';
import { useGameState } from '@/hooks/useGameState';
import { clearGameState } from '@/utils/storage';

export default function Results() {
  const printRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { categories } = useGameState();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (!winPrint) return;

    winPrint.document.write(printContent.innerHTML);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
  };

  const handleNewExercise = () => {
    clearGameState();
  };

  if (!mounted) return null;

  return (
    <div className="p-8">
      <div ref={printRef}>
        <h1 className="text-3xl font-bold mb-6">Your Core Values Results</h1>
        {(Object.entries(categories) as [CategoryName, Value[]][]).map(([category, values]) => (
          values.length > 0 && (
            <div key={category} className="mb-6">
              <h2 className="text-xl font-semibold mb-3">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {values.map((value: Value) => (
                  <div key={value.id} className="p-4 bg-white rounded shadow">
                    <h3 className="font-medium">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex space-x-4">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Print Results
          </button>

          <Link
            href="/"
            onClick={handleNewExercise}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Start New Exercise
          </Link>
        </div>

        <Link
          href="/history"
          className="text-blue-600 hover:text-blue-800 underline mt-2"
        >
          View All Previous Results
        </Link>
      </div>
    </div>
  );
}
