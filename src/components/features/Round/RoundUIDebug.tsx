// src/components/Round/RoundUIDebug.tsx
'use client'

import { Profiler, ProfilerOnRenderCallback } from 'react';
import RoundUI from './RoundUI';

// Explicitly type the callback using the React type
/**
 * Callback function for React Profiler's onRender event.
 *
 * @param id - The id prop of the Profiler tree that has just committed.
 * @param phase - Identifies whether the callback is for a mount, update, or nested-update phase.
 * @param actualDuration - Time spent rendering the committed update.
 * @param baseDuration - Estimated time to render the entire subtree without memoization.
 * @param startTime - When React began rendering this update.
 * @param commitTime - When React committed this update.
 */
const onRender: ProfilerOnRenderCallback = function(
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`[Profiler] ${id} - ${phase}`);
    console.log(`Actual duration: ${actualDuration.toFixed(2)}ms`);
    console.log(`Base duration: ${baseDuration.toFixed(2)}ms`);
    console.log(`Start time: ${startTime.toFixed(2)}ms`);
    console.log(`Commit time: ${commitTime.toFixed(2)}ms`);
    console.groupEnd();
  }
};

export default function RoundUIDebug() {
  // Only render profiler in development
  if (process.env.NODE_ENV !== 'development') {
    return <RoundUI />;
  }

  return (
    <div> {/* Hide profiler wrapper from screen readers */}
      <Profiler 
        id="RoundUI" 
        onRender={onRender}
      >
        <RoundUI />
      </Profiler>
    </div>
  );
}
