import { useEffect, useState } from 'react';
import { Value, ValueWithReason } from '@/types';
import { motion } from 'framer-motion';
import { getPostItStyles } from '@/components/Card/styles';

interface CoreValueReasoningProps {
    values: Value[];
    onComplete: (valuesWithReasons: ValueWithReason[]) => void;
}

export function CoreValueReasoning({ values, onComplete }: CoreValueReasoningProps) {
    const [reasons, setReasons] = useState<Record<string, string>>({});
    const { postItBaseStyles, tapeEffect } = getPostItStyles(false, false);
    const [allValuesHaveReasons, setAllValuesHaveReasons] = useState(false);

    useEffect(() => {
        // Check if all values have non-empty reasons
        const hasAllReasons = values.every(value => reasons[value.id]?.trim());
        setAllValuesHaveReasons(hasAllReasons);
    }, [reasons, values]);

    const handleReasonChange = (valueId: string, reason: string) => {
        setReasons(prev => ({
            ...prev,
            [valueId]: reason
        }));
    };

    const handleSubmit = () => {
        if (!allValuesHaveReasons) {
            alert("Please provide a reason for each value before continuing.");
            return;
        }

        const valuesWithReasons: ValueWithReason[] = values.map(value => ({
            ...value,
            reason: reasons[value.id]
        }));
        onComplete(valuesWithReasons);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Why are these values meaningful to you?</h1>
            <div className="space-y-6 mb-8">
                {values.map((value) => (
                    <motion.div
                        key={value.id}
                        className={`${postItBaseStyles} ${tapeEffect} p-6`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                        <p className="text-gray-600 mb-4">{value.description}</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Why is this value meaningful to you?
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                value={reasons[value.id] || ''}
                                onChange={(e) => handleReasonChange(value.id, e.target.value)}
                                placeholder="Share your thoughts..."
                                required
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={!allValuesHaveReasons}
                    className={`px-6 py-2 rounded-md transition-colors
              ${allValuesHaveReasons
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    Continue to Results
                </button>
            </div>
        </div>
    );
}