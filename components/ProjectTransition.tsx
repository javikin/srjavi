'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let transitionCallback: (() => void) | null = null;

export function triggerProjectTransition(callback: () => void) {
  transitionCallback = callback;
  window.dispatchEvent(new CustomEvent('project-transition-start'));
}

export default function ProjectTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleTransition = () => {
      setIsTransitioning(true);

      // Execute callback after overlay appears
      setTimeout(() => {
        if (transitionCallback) {
          transitionCallback();
          transitionCallback = null;
        }
      }, 400);

      // Remove overlay after navigation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    };

    window.addEventListener('project-transition-start', handleTransition);
    return () => window.removeEventListener('project-transition-start', handleTransition);
  }, []);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ originY: 0 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-secondary to-primary pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
