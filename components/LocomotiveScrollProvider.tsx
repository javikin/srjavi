'use client';

import { ReactNode } from 'react';

interface LocomotiveScrollProviderProps {
  children: ReactNode;
}

export default function LocomotiveScrollProvider({ children }: LocomotiveScrollProviderProps) {
  // Temporarily disabled Locomotive Scroll due to conflict with Framer Motion useScroll
  // TODO: Re-enable with proper integration or choose one scroll library

  return (
    <>
      {children}
    </>
  );
}
