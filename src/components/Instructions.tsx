'use client'

interface InstructionsProps {
    onClose: () => void;
  }
  
  export default function Instructions({ onClose }: InstructionsProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">How to Use Core Values</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Enter the number of core values you want to end up with (typically 5).</li>
            <li>For each round, you'll see value cards that you need to sort into categories.</li>
            <li>Drag each card into one of the five categories based on its importance to you:
              <ul className="list-disc ml-6 mt-2">
                <li>Very Important</li>
                <li>Quite Important</li>
                <li>Important</li>
                <li>Of Some Importance</li>
                <li>Not Important</li>
              </ul>
            </li>
            <li>Click on a card's title to show/hide its description.</li>
            <li>Use the up/down arrows to reorder cards within a category.</li>
            <li>When you're done sorting all cards, click "Next Round".</li>
            <li>In the next round, cards marked as "Not Important" will be removed.</li>
            <li>Continue sorting until you reach your target number of core values.</li>
          </ol>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }
  