import { getEnvBoolean } from '../config';

const isDebug = getEnvBoolean('NEXT_PUBLIC_DEBUG', false);

export const logRender = (componentName: string, props?: unknown) => {
  if (isDebug) {
    console.log(`[Render] ${componentName}`, props ? { props } : '');
  }
};

export const logStateUpdate = (name: string, value: unknown, source: string) => {
  if (isDebug) {
    console.group(`[State Update] ${name}`);
    console.log('Value:', value);
    console.log('Source:', source);
    console.trace('Stack trace');
    console.groupEnd();
  }
};

export const logEffect = (effectName: string, dependencies?: unknown[]) => {
  if (isDebug) {
    console.log(`[Effect] ${effectName}`, dependencies ? { dependencies } : '');
  }
};
