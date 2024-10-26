import { useDrag } from 'react-dnd';
import { useState } from 'react';
import { Value } from '../types';

interface CardProps {
  value: Value;
  inCategory?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function Card({ value, inCategory, onMoveUp, onMoveDown }: CardProps) {
  const [showDescription, setShowDescription] = useState(!inCategory);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id: value.title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
    {...drag}
      className={`card border p-4 rounded mb-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <h3 
          onClick={() => setShowDescription(!showDescription)}
          className="cursor-pointer font-bold"
        >
          {value.title}
        </h3>
        {inCategory && (
          <div className="flex gap-2">
            <button 
              onClick={onMoveUp}
              className="px-2 py-1 text-sm bg-gray-200 rounded"
            >
              ↑
            </button>
            <button 
              onClick={onMoveDown}
              className="px-2 py-1 text-sm bg-gray-200 rounded"
            >
              ↓
            </button>
          </div>
        )}
      </div>
      {showDescription && <p className="mt-2 text-sm">{value.description}</p>}
    </div>
  );
}
