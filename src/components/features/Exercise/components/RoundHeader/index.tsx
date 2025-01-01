import { RoundHeaderProps } from './types';

export function RoundHeader({ targetCoreValues, roundNumber, remainingCardsCount }: RoundHeaderProps) {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-2 p-2 sm:gap-4 sm:p-4">
        {/* Both Mobile and Desktop use the same lozenge style */}
        <div>
          <div className="rounded-full bg-red-100 px-3 py-1.5 text-center shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-blue-800 sm:text-sm">Target</h2>
            <p className="text-lg font-bold text-blue-900 sm:text-2xl">{targetCoreValues}</p>
          </div>
        </div>
        <div>
          <div className="rounded-full bg-amber-100 px-3 py-1.5 text-center shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-purple-800 sm:text-sm">Round</h2>
            <p className="text-lg font-bold text-purple-900 sm:text-2xl">{roundNumber}</p>
          </div>
        </div>
        <div>
          <div className="rounded-full bg-green-100 px-3 py-1.5 text-center shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-green-800 sm:text-sm">Cards</h2>
            <p className="text-lg font-bold text-green-900 sm:text-2xl">{remainingCardsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
