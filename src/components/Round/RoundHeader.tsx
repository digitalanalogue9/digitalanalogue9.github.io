import { RoundHeaderProps } from './RoundHeaderProps';

export function RoundHeader({
  targetCoreValues,
  roundNumber,
  remainingCardsCount
}: RoundHeaderProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4">
      {/* Mobile Header */}
      <div className="sm:hidden">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-semibold text-gray-700">Target</h2>
          <p className="text-xl font-bold text-gray-900">{targetCoreValues}</p>
        </div>
      </div>
      <div className="sm:hidden">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-semibold text-gray-700">Round</h2>
          <p className="text-xl font-bold text-gray-900">{roundNumber}</p>
        </div>
      </div>
      <div className="sm:hidden">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-semibold text-gray-700">Cards</h2>
          <p className="text-xl font-bold text-gray-900">{remainingCardsCount}</p>
        </div>
      </div>
  
      {/* Desktop Header */}
      <div className="hidden sm:block">
        <div className="text-center flex flex-col justify-between h-20">
          <h2 className="text-xl font-semibold text-gray-700">Target Values</h2>
          <p className="text-3xl font-bold text-gray-900">{targetCoreValues}</p>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="text-center flex flex-col justify-between h-20">
          <h2 className="text-xl font-semibold text-gray-700">Round</h2>
          <p className="text-3xl font-bold text-gray-900">{roundNumber}</p>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="text-center flex flex-col justify-between h-20">
          <h2 className="text-xl font-semibold text-gray-700">Remaining Cards</h2>
          <p className="text-3xl font-bold text-gray-900">{remainingCardsCount}</p>
        </div>
      </div>
    </div>
  );
}
