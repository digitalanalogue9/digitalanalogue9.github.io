import { RoundHeaderProps } from '@/features/Round/types';


export function RoundHeader({
  targetCoreValues,
  roundNumber,
  remainingCardsCount
}: RoundHeaderProps) {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4">
        {/* Both Mobile and Desktop use the same lozenge style */}
        <div>
          <div className="bg-blue-100 rounded-full px-3 py-1.5 text-center shadow-sm">
            <h2 className="text-xs sm:text-sm font-semibold text-blue-800 uppercase tracking-wide">
              Target
            </h2>
            <p className="text-lg sm:text-2xl font-bold text-blue-900">
              {targetCoreValues}
            </p>
          </div>
        </div>
        <div>
          <div className="bg-purple-100 rounded-full px-3 py-1.5 text-center shadow-sm">
            <h2 className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">
              Round
            </h2>
            <p className="text-lg sm:text-2xl font-bold text-purple-900">
              {roundNumber}
            </p>
          </div>
        </div>
        <div>
          <div className="bg-green-100 rounded-full px-3 py-1.5 text-center shadow-sm">
            <h2 className="text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wide">
              Cards
            </h2>
            <p className="text-lg sm:text-2xl font-bold text-green-900">
              {remainingCardsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}