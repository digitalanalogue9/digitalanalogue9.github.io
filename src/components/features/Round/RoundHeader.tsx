import { RoundHeaderProps } from '@/features/Round/types';


/**
 * Component that displays the header for a round, including target core values, round number, and remaining cards count.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.targetCoreValues - The target core values for the round.
 * @param {number} props.roundNumber - The current round number.
 * @param {number} props.remainingCardsCount - The number of remaining cards.
 * @returns {JSX.Element} The rendered component.
 */
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
          <div className="bg-red-100 rounded-full px-3 py-1.5 text-center shadow-sm">
            <h2 className="text-xs sm:text-sm font-semibold text-blue-800 uppercase tracking-wide">
              Target
            </h2>
            <p className="text-lg sm:text-2xl font-bold text-blue-900">
              {targetCoreValues}
            </p>
          </div>
        </div>
        <div>
          <div className="bg-amber-100 rounded-full px-3 py-1.5 text-center shadow-sm">
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