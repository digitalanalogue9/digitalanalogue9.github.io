// src/components/Round/RoundUIDebug.tsx
'use client'

import { Profiler, ProfilerOnRenderCallback } from 'react';
import RoundUI from './RoundUI';

// Explicitly type the callback using the React type
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
