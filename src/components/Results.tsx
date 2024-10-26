'use client'

import { useRef, useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import { Value } from '../types';

export default function Results() {
  const printRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { categories } = useGameStore();

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

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <div className="p-8">
      <div ref={printRef}>
        <h1 className="text-3xl font-bold mb-8 text-center">Your Core Values</h1>
        <div className="max-w-2xl mx-auto">
          {categories['Very Important']?.map((value: Value, index: number) => (
            <div key={value.title} className="mb-6 p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">{index + 1}. {value.title}</h2>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Print Results
        </button>
      </div>
    </div>
  );
}
