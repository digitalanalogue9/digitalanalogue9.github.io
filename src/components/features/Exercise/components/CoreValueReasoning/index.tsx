// src/components/CoreValueReasoning.tsx
import { useEffect, useState } from 'react';
import { ValueWithReason } from "@/lib/types";
import { motion } from 'framer-motion';
import { getPostItStyles } from "@/components/features/Cards/components/styles";
import { CoreValueReasoningProps } from './types';
import { getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';
import { useMobile } from '@/components/common/MobileProvider';

/**
 * CoreValueReasoning component allows users to provide reasons for why certain values are meaningful to them.
 */
export function CoreValueReasoning({
  values,
  onComplete
}: CoreValueReasoningProps) {
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  const {
    postItBaseStyles,
    tapeEffect
  } = getPostItStyles(false, false);
  useEffect(() => {
    // Check if all values have non-empty reasons
    const hasAllReasons = values.every(value => reasons[value.id]?.trim());
  }, [reasons, values]);
  const handleReasonChange = (valueId: string, reason: string) => {
    setReasons(prev => ({
      ...prev,
      [valueId]: reason
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valuesWithReasons: ValueWithReason[] = values.map(value => ({
      ...value,
      reason: reasons[value.id]?.trim() || '' // Empty string if no reason given
    }));
    onComplete(valuesWithReasons);
  };
  return <div className="container mx-auto px-4 py-8" role="region" aria-labelledby="reasoning-title">
    <h1 id="reasoning-title" className={`${styles.heading} font-extrabold mb-4 sm:mb-6`}>
      Why are these values meaningful to you?
    </h1>
    <p className="text-black mb-6">
      Optionally, explain why each value is meaningful. This can help you reflect on your choices.
    </p>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Save reasons and view results">
          Continue to Results
        </button>
      </div>
      <div className="space-y-6 mb-8" role="list" aria-label="Value reflection entries">
        {values.map((value, index) => <motion.div key={value.id} className={`${postItBaseStyles} ${tapeEffect} p-6`} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
          <div role="listitem">
            <div role="group" aria-labelledby={`value-title-${value.id}`}>
              <h2 id={`value-title-${value.id}`} className="font-bold text-lg mb-2">
                {value.title}
              </h2>
              <p className="text-black mb-4">
                {value.description}
              </p>
              <div>
                <label htmlFor={`reason-${value.id}`} className="block text-sm font-medium text-black mb-2">
                  Why is this value meaningful to you? (Optional)
                </label>
                <textarea id={`reason-${value.id}`} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" rows={3} value={reasons[value.id] || ''} onChange={e => handleReasonChange(value.id, e.target.value)} placeholder="Share your thoughts... (optional)" aria-label={`Reasoning for ${value.title}`} />
              </div>
            </div>
          </div>
        </motion.div>)}
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Save reasons and view results">
          Continue to Results
        </button>
      </div>
    </form>
  </div>;
}