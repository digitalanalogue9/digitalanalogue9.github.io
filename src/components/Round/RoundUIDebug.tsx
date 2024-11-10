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
  commitTime: number) {
  console.group(`[Profiler] ${id} - ${phase}`);
  console.log(`Actual duration: ${actualDuration.toFixed(2)}ms`);
  console.log(`Base duration: ${baseDuration.toFixed(2)}ms`);
  console.log(`Commit time: ${commitTime}`);
  console.groupEnd();
};

export default function RoundUIDebug() {
  return (
    <Profiler id="RoundUI" onRender={onRender}>
      <RoundUI />
    </Profiler>
  );
}
