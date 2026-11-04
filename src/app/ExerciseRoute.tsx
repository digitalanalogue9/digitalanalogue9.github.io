import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import personalValues from '../data/values.json';
import teamValues from '../data/team-values.json';
import {
  completeSession,
  createSession,
  loadSession,
  saveSessionProgress,
  type RoundSnapshot,
  type SessionRecord,
} from '../lib/db/canonicalSessionRepository';

type ExerciseType = 'personal' | 'team';
type Category = RoundSnapshot['activeCategories'][number];
const CATEGORIES: Category[] = [
  'Very Important',
  'Quite Important',
  'Important',
  'Of Some Importance',
  'Not Important',
];

function activeCategories(cardCount: number, target: number): Category[] {
  const ratio = cardCount / target;
  if (ratio <= 1.5) return ['Very Important', 'Not Important'];
  if (ratio <= 2) return ['Very Important', 'Quite Important', 'Not Important'];
  if (ratio <= 3) return ['Very Important', 'Quite Important', 'Important', 'Not Important'];
  return CATEGORIES;
}

export function ExerciseRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('sessionId');
  const [record, setRecord] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState('');
  const [target, setTarget] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, Category>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setRecord(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadSession(sessionId)
      .then((loaded) => {
        if (!cancelled) {
          setRecord(loaded);
          if (!loaded) setError('This saved exercise could not be opened.');
        }
      })
      .catch(() => !cancelled && setError('Your saved exercise could not be loaded.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const remaining = record?.currentRound.deck ?? [];
  const categories = record?.currentRound.categories;
  const activeValueCount = categories
    ? CATEGORIES.filter((category) => category !== 'Not Important').reduce(
        (total, category) => total + categories[category].length,
        0
      )
    : 0;
  const canComplete = Boolean(
    record &&
    record.session.status === 'active' &&
    remaining.length === 0 &&
    categories?.['Very Important'].length === record.session.targetCoreValues &&
    activeValueCount === record.session.targetCoreValues
  );
  const canContinue = Boolean(
    record &&
    record.session.status === 'active' &&
    remaining.length === 0 &&
    activeValueCount >= record.session.targetCoreValues &&
    categories?.['Not Important'].length
  );
  const progressText = useMemo(() => {
    if (!record) return '';
    return `Round ${record.currentRound.roundNumber}: ${remaining.length} cards to sort`;
  }, [record, remaining.length]);

  async function start(type: ExerciseType) {
    setBusy(true);
    setError('');
    try {
      const chosenValues = (type === 'team' ? teamValues.values : personalValues.values).map(
        ({ id, title, description }) => ({
          id,
          title,
          description,
        })
      );
      const started = await createSession({
        initialValues: chosenValues,
        targetCoreValues: Math.max(1, Math.min(target, chosenValues.length)),
        exerciseType: type,
      });
      navigate(`/exercise?sessionId=${encodeURIComponent(started.session.id)}`);
    } catch {
      setError('The exercise could not be started. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function placeCard(cardId: string) {
    if (!record || !categories) return;
    const category = selectedCategories[cardId] ?? record.currentRound.activeCategories[0];
    const card = remaining.find((candidate) => candidate.id === cardId);
    if (!card) return;
    const updatedCategories = { ...categories, [category]: [...categories[category], card] };
    const updatedRound: RoundSnapshot = {
      ...record.currentRound,
      deck: remaining.filter((candidate) => candidate.id !== cardId),
      categories: updatedCategories,
      commands: [...record.currentRound.commands, { kind: 'drop', valueId: cardId, toCategory: category }],
    };
    setBusy(true);
    try {
      await saveSessionProgress(record.session.id, updatedRound);
      setRecord({ ...record, session: { ...record.session, updatedAt: Date.now() }, currentRound: updatedRound });
    } catch {
      setError('Your sorting choice could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function moveCard(cardId: string, fromCategory: Category) {
    if (!record || !categories) return;
    const toCategory = selectedCategories[`move-${cardId}`] ?? fromCategory;
    const fromCards = categories[fromCategory];
    const fromIndex = fromCards.findIndex((card) => card.id === cardId);
    if (fromIndex < 0) return;
    const card = fromCards[fromIndex];
    const updatedCategories = {
      ...categories,
      [fromCategory]: fromCards.filter((candidate) => candidate.id !== cardId),
      [toCategory]: [...categories[toCategory].filter((candidate) => candidate.id !== cardId), card],
    };
    const updatedRound: RoundSnapshot = {
      ...record.currentRound,
      categories: updatedCategories,
      commands: [
        ...record.currentRound.commands,
        { kind: 'move', valueId: cardId, fromCategory, toCategory, fromIndex },
      ],
    };
    setBusy(true);
    try {
      await saveSessionProgress(record.session.id, updatedRound);
      setRecord({ ...record, currentRound: updatedRound });
    } catch {
      setError('Your sorting choice could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function nextRound() {
    if (!record || !categories) return;
    const nextCards = CATEGORIES.filter((category) => category !== 'Not Important').flatMap(
      (category) => categories[category]
    );
    const nextCategories = CATEGORIES.reduce(
      (result, category) => ({ ...result, [category]: [] }),
      {} as RoundSnapshot['categories']
    );
    const now = Date.now();
    const next: RoundSnapshot = {
      version: 2,
      sessionId: record.session.id,
      roundNumber: record.currentRound.roundNumber + 1,
      targetCoreValues: record.session.targetCoreValues,
      deck: nextCards,
      categories: nextCategories,
      activeCategories: activeCategories(nextCards.length, record.session.targetCoreValues),
      commands: [],
      createdAt: now,
      updatedAt: now,
    };
    setBusy(true);
    try {
      await saveSessionProgress(record.session.id, next);
      setRecord({
        ...record,
        session: { ...record.session, currentRoundNumber: next.roundNumber },
        currentRound: next,
        rounds: [...record.rounds, next],
      });
    } catch {
      setError('The next round could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    if (!record || !categories) return;
    setBusy(true);
    try {
      const finalValues = categories['Very Important'].map((card) => ({ ...card }));
      await completeSession(record.session.id, finalValues);
      setRecord({
        ...record,
        session: { ...record.session, status: 'completed', updatedAt: Date.now() },
        completedSession: { version: 2, sessionId: record.session.id, completedAt: Date.now(), finalValues },
      });
    } catch {
      setError('Your completed exercise could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p role="status">Loading saved exercise…</p>;
  if (!sessionId) {
    return (
      <section aria-labelledby="exercise-start-heading">
        <h1 id="exercise-start-heading">Start an exercise</h1>
        <p>Sort value cards into categories to identify the values that matter most to you.</p>
        <label htmlFor="target-core-values">Target number of core values</label>
        <input
          id="target-core-values"
          type="number"
          min={1}
          max={35}
          value={target}
          onChange={(event) => setTarget(Number(event.target.value))}
        />
        <div>
          <button type="button" onClick={() => start('personal')} disabled={busy}>
            Start personal exercise
          </button>
          <button type="button" onClick={() => start('team')} disabled={busy}>
            Start team values exercise
          </button>
        </div>
        {error && <p role="alert">{error}</p>}
        <p>Sessions are saved in this browser so you can resume them later.</p>
      </section>
    );
  }
  if (!record) {
    return (
      <section>
        <h1>Exercise unavailable</h1>
        <p role="alert">{error || 'This saved exercise could not be opened.'}</p>
        <Link to="/history">View saved exercises</Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="exercise-heading">
      <h1 id="exercise-heading">{record.session.status === 'completed' ? 'Exercise complete' : 'Sort your values'}</h1>
      <p>
        {record.session.exerciseType === 'team' ? 'Team values' : 'Personal values'} · {progressText}
      </p>
      {record.session.status === 'completed' ? (
        <>
          <h2>Your core values</h2>
          <ul>
            {(record.completedSession?.finalValues ?? []).map((card) => (
              <li key={card.id}>{card.title}</li>
            ))}
          </ul>
          <h2>Saved rounds</h2>
          {record.rounds.map((round) => (
            <section key={round.roundNumber} aria-label={`Round ${round.roundNumber}`}>
              <h3>Round {round.roundNumber}</h3>
              <p>{round.commands.length} saved sorting choices</p>
            </section>
          ))}
          <Link to="/history">Back to history</Link>
        </>
      ) : (
        <>
          {record.rounds.map((round) => (
            <section key={round.roundNumber} aria-label={`Round ${round.roundNumber}`}>
              <h2>Round {round.roundNumber}</h2>
              {round.roundNumber === record.currentRound.roundNumber && remaining.length > 0 && (
                <ul aria-label="Value cards to sort">
                  {remaining.map((card) => (
                    <li key={card.id}>
                      <strong>{card.title}</strong> — {card.description}
                      <label htmlFor={`category-${card.id}`}> Category for {card.title}</label>
                      <select
                        id={`category-${card.id}`}
                        value={selectedCategories[card.id] ?? round.activeCategories[0]}
                        onChange={(event) =>
                          setSelectedCategories({ ...selectedCategories, [card.id]: event.target.value as Category })
                        }
                      >
                        {round.activeCategories.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                      <button type="button" disabled={busy} onClick={() => placeCard(card.id)}>
                        Place {card.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div>
                {round.activeCategories.map((category) => (
                  <section key={category} aria-label={category}>
                    <h3>
                      {category} ({round.categories[category].length})
                    </h3>
                    <ul>
                      {round.categories[category].map((card) => (
                        <li key={card.id}>
                          {card.title}
                          {round.roundNumber === record.currentRound.roundNumber && (
                            <>
                              <label htmlFor={`move-${card.id}`}> Move {card.title} to</label>
                              <select
                                id={`move-${card.id}`}
                                value={selectedCategories[`move-${card.id}`] ?? category}
                                onChange={(event) =>
                                  setSelectedCategories({
                                    ...selectedCategories,
                                    [`move-${card.id}`]: event.target.value as Category,
                                  })
                                }
                              >
                                {round.activeCategories.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                              <button type="button" disabled={busy} onClick={() => moveCard(card.id, category)}>
                                Move {card.title}
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </section>
          ))}
          {canContinue && (
            <button type="button" disabled={busy} onClick={nextRound}>
              Continue to next round
            </button>
          )}
          {canComplete && (
            <button type="button" disabled={busy} onClick={finish}>
              Complete exercise
            </button>
          )}
          {error && <p role="alert">{error}</p>}
          <Link to="/history">Save and return to history</Link>
        </>
      )}
    </section>
  );
}
