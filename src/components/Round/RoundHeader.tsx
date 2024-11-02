import { RoundHeaderProps } from './RoundHeaderProps';

export function RoundHeader({ 
  targetCoreValues, 
  roundNumber, 
  remainingCardsCount 
}: RoundHeaderProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">Target Values</h2>
        <p className="text-3xl font-bold text-gray-900">{targetCoreValues}</p>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">Round</h2>
        <p className="text-3xl font-bold text-gray-900">{roundNumber}</p>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">Remaining Cards</h2>
        <p className="text-3xl font-bold text-gray-900">{remainingCardsCount}</p>
      </div>
    </div>
  );
}
