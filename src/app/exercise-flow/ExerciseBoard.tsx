import { useState } from 'react';
import type { CategoryName, RoundCommand, RoundSnapshot } from '../../lib/contracts/types';

export function ExerciseBoard({
  round,
  busy,
  onCommand,
}: {
  round: RoundSnapshot;
  busy: boolean;
  onCommand: (command: RoundCommand) => Promise<void>;
}) {
  const [choices, setChoices] = useState<Record<string, CategoryName>>({});
  function categorySelect(key: string, label: string, fallback: CategoryName) {
    return (
      <label>
        {label}
        <select
          value={choices[key] ?? fallback}
          onChange={(event) => setChoices({ ...choices, [key]: event.target.value as CategoryName })}
          disabled={busy}
        >
          {round.activeCategories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <section aria-label={`Round ${round.roundNumber}`}>
      <h2>Round {round.roundNumber}</h2>
      {round.deck.length > 0 && (
        <ul aria-label="Value cards to sort">
          {round.deck.map((card) => (
            <li key={card.id}>
              <strong>{card.title}</strong> — {card.description}
              {categorySelect(card.id, `Category for ${card.title}`, round.activeCategories[0])}
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void onCommand({
                    kind: 'drop',
                    valueId: card.id,
                    toCategory: choices[card.id] ?? round.activeCategories[0],
                  })
                }
              >
                Place {card.title}
              </button>
            </li>
          ))}
        </ul>
      )}
      {round.activeCategories.map((category) => (
        <section key={category} aria-label={category}>
          <h3>
            {category} ({round.categories[category].length})
          </h3>
          <ul>
            {round.categories[category].map((card) => (
              <li key={card.id}>
                <span>{card.title}</span>
                {categorySelect(`move-${card.id}`, `Move ${card.title} to`, category)}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void onCommand({
                      kind: 'move',
                      valueId: card.id,
                      fromCategory: category,
                      toCategory: choices[`move-${card.id}`] ?? category,
                    })
                  }
                >
                  Move {card.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
