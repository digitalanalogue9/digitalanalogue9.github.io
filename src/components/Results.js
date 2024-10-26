import { useRef } from 'react';
import useGameStore from '../store/useGameStore';

export default function Results() {
  const printRef = useRef();
  const { categories } = useGameStore();

  const handlePrint = () => {
    const printContent = printRef.current;
    const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    winPrint.document.write(printContent.innerHTML);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
  };

  return (
    <div className="p-8">
      <div ref={printRef}>
        <h1 className="text-3xl font-bold mb-8 text-center">Your Core Values</h1>
        <div className="max-w-2xl mx-auto">
          {categories['Very Important'].map((value, index) => (
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
