import { useDrop } from 'react-dnd';
import Card from './Card';
import { Value, CategoryName } from '../types';

interface CategoryColumnProps {
  title: CategoryName;
  cards: Value[];
  onDrop: (cardId: string, category: CategoryName) => void;
  onMoveCard: (category: CategoryName, fromIndex: number, toIndex: number) => void;
}

export default function CategoryColumn({ title, cards, onDrop, onMoveCard }: CategoryColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item: { id: string }) => onDrop(item.id, title),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveCardUp = (index: number) => {
    if (index > 0) {
      onMoveCard(title, index, index - 1);
    }
  };

  const moveCardDown = (index: number) => {
    if (index < cards.length - 1) {
      onMoveCard(title, index, index + 1);
    }
  };

  return (
    <div
      {...drop}
      className={`category-column p-4 border rounded min-h-[200px] ${
        isOver ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {cards.map((card, index) => (
          <Card
            key={card.title}
            value={card}
            inCategory={true}
            onMoveUp={() => moveCardUp(index)}
            onMoveDown={() => moveCardDown(index)}
          />
        ))}
      </div>
    </div>
  );
}
