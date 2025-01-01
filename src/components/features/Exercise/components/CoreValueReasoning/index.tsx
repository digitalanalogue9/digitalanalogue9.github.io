// src/components/CoreValueReasoning.tsx
import { useEffect, useState } from 'react';
import { ValueWithReason } from '@/lib/types';
import { motion } from 'framer-motion';
import { getPostItStyles } from '@/components/features/Cards/components/styles';
import { CoreValueReasoningProps } from './types';
import { getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';
import { useMobile } from '@/lib/contexts/MobileContext';

/**
 * CoreValueReasoning component allows users to provide reasons for why certain values are meaningful to them.
 *
 * @param {CoreValueReasoningProps} props - The properties for the CoreValueReasoning component.
 * @param {Array<Value>} props.values - An array of value objects that the user can provide reasons for.
 * @param {Function} props.onComplete - A callback function that is called when the form is submitted with the values and their corresponding reasons.
 *
 * @returns {JSX.Element} The rendered CoreValueReasoning component.
 *
 * @component
 *
 * @example
 * const values = [
 *   { id: '1', title: 'Integrity', description: 'Adherence to moral and ethical principles.' },
 *   { id: '2', title: 'Excellence', description: 'Striving for the highest quality and standards.' }
 * ];
 *
 * function handleComplete(valuesWithReasons) {
 *   console.log(valuesWithReasons);
 * }
 *
 * <CoreValueReasoning values={values} onComplete={handleComplete} />
 */
export function CoreValueReasoning({ values, onComplete }: CoreValueReasoningProps) {
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  const { postItBaseStyles, tapeEffect } = getPostItStyles(false, false);
  useEffect(() => {
    // Check if all values have non-empty reasons
    const hasAllReasons = values.every((value) => reasons[value.id]?.trim());
  }, [reasons, values]);
  const handleReasonChange = (valueId: string, reason: string) => {
    setReasons((prev) => ({
      ...prev,
      [valueId]: reason,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valuesWithReasons: ValueWithReason[] = values.map((value) => ({
      ...value,
      reason: reasons[value.id]?.trim() || '', // Empty string if no reason given
    }));
    onComplete(valuesWithReasons);
  };
  return (
    <div className="container mx-auto px-4 py-8" role="region" aria-labelledby="reasoning-title">
      <h1 id="reasoning-title" className={`${styles.heading} mb-4 font-extrabold sm:mb-6`}>
        Why are these values meaningful to you?
      </h1>
      <p className="mb-6 text-black">
        Optionally, explain why each value is meaningful. This can help you reflect on your choices.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Save reasons and view results"
          >
            Continue to Results
          </button>
        </div>
        <div className="mb-8 space-y-6" role="list" aria-label="Value reflection entries">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              className={`${postItBaseStyles} ${tapeEffect} p-6`}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div role="listitem">
                <div role="group" aria-labelledby={`value-title-${value.id}`}>
                  <h2 id={`value-title-${value.id}`} className="mb-2 text-lg font-bold">
                    {value.title}
                  </h2>
                  <p className="mb-4 text-black">{value.description}</p>
                  <div>
                    <label htmlFor={`reason-${value.id}`} className="mb-2 block text-sm font-medium text-black">
                      Why is this value meaningful to you? (Optional)
                    </label>
                    <textarea
                      id={`reason-${value.id}`}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                      value={reasons[value.id] || ''}
                      onChange={(e) => handleReasonChange(value.id, e.target.value)}
                      placeholder="Share your thoughts... (optional)"
                      aria-label={`Reasoning for ${value.title}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Save reasons and view results"
          >
            Continue to Results
          </button>
        </div>
      </form>
    </div>
  );
}
