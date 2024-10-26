import { useDrop } from 'react-dnd';
import Card from './Card';

export default function CategoryColumn({ title, cards, onDrop, onMoveCard }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item) => onDrop(item.id, title),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveCardUp = (index) => {
    if (index > 0) {
      onMoveCard(title, index, index - 1);
    }
  };

  const moveCardDown = (index) => {
    if (index < cards.length - 1) {
      onMoveCard(title, index, index + 1);
    }
  };

  return (
    <div
      ref={drop}
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
