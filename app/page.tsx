'use client';

import { useState } from 'react';
import { Hero } from '@/components/landing/Hero';
import { EditingFlow } from '@/components/editor/EditingFlow';

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return <EditingFlow />;
  }

  return <Hero onStart={() => setShowEditor(true)} />;
}
