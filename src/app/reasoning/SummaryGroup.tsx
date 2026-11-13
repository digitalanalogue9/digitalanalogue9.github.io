import type { ExerciseType } from '@/lib/contracts/types';
import type { ReflectionSummaryItem } from '@/lib/content/reflectionContent';

export function SummaryGroup({
  title,
  exerciseType,
  items,
}: {
  title: string;
  exerciseType: ExerciseType;
  items: ReflectionSummaryItem[];
}) {
  const statusLabel = (status: ReflectionSummaryItem['status']) => {
    if (status === 'unsure') return exerciseType === 'team' ? 'Mixed views / unsure' : 'Not sure';
    if (status === 'unanswered') return 'Not answered';
    if (status === 'relationship') return 'Possible relationship';
    return null;
  };

  return (
    <div>
      <h3 className="text-interface-base-small text-sys-color-text-primary font-semibold">{title}</h3>
      <ul className="text-interface-base-small text-sys-color-text-secondary mt-1 list-inside list-disc space-y-1 leading-6">
        {items.map((item, index) => (
          <li key={`${item.valueTitle}-${index}`}>
            <span className="font-semibold">{item.valueTitle}:</span> {item.text}{' '}
            <span>({statusLabel(item.status) ?? item.attribution})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
