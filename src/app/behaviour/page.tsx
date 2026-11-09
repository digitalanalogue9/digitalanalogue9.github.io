'use client';

import { useEffect } from 'react';
import BehaviourReflectionClient from './BehaviourReflectionClient';

export default function BehaviourReflectionPage() {
  useEffect(() => {
    document.title = 'Core Values - Behaviour reflection';
  }, []);

  return <BehaviourReflectionClient />;
}
