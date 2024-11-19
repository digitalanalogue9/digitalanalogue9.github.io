const DEBUG = process.env.NODE_ENV === 'development';

export const logRender = (componentName: string, props?: any) => {
  if (DEBUG) {
    console.log(`[Render] ${componentName}`, props ? { props } : '');
  }
};

export const logStateUpdate = (name: string, value: any, source: string) => {
  if (DEBUG) {
    console.group(`[State Update] ${name}`);
    console.log('Value:', value);
    console.log('Source:', source);
    console.trace('Stack trace');
    console.groupEnd();
  }
};

export const logEffect = (effectName: string, dependencies?: any[]) => {
  if (DEBUG) {
    console.log(`[Effect] ${effectName}`, dependencies ? { dependencies } : '');
  }
};
