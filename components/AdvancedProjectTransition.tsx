'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface TransitionState {
  isActive: boolean;
  imageSrc: string;
  imageRect: DOMRect | null;
  themeColor: string;
}

let transitionData: {
  callback: (() => void) | null;
  imageSrc: string;
  imageRect: DOMRect | null;
  themeColor: string;
} = {
  callback: null,
  imageSrc: '',
  imageRect: null,
  themeColor: '#10b981', // emerald-500 default
};

export function triggerAdvancedTransition(
  callback: () => void,
  imageSrc: string,
  imageElement: HTMLElement,
  themeColor: string = '#10b981'
) {
  const rect = imageElement.getBoundingClientRect();
  transitionData = {
    callback,
    imageSrc,
    imageRect: rect,
    themeColor,
  };
  window.dispatchEvent(new CustomEvent('advanced-transition-start'));
}

export default function AdvancedProjectTransition() {
  const [state, setState] = useState<TransitionState>({
    isActive: false,
    imageSrc: '',
    imageRect: null,
    themeColor: '#10b981',
  });

  useEffect(() => {
    const handleTransition = () => {
      setState({
        isActive: true,
        imageSrc: transitionData.imageSrc,
        imageRect: transitionData.imageRect,
        themeColor: transitionData.themeColor,
      });

      // Phase 1: Image expands and color takes over (800ms)
      // Phase 2: Navigate (at 600ms)
      setTimeout(() => {
        if (transitionData.callback) {
          transitionData.callback();
        }
      }, 600);

      // Phase 3: Fade out transition (at 1200ms)
      setTimeout(() => {
        setState((prev) => ({ ...prev, isActive: false }));
      }, 1200);
    };

    window.addEventListener('advanced-transition-start', handleTransition);
    return () => window.removeEventListener('advanced-transition-start', handleTransition);
  }, []);

  if (!state.isActive || !state.imageRect) return null;

  const { imageRect, imageSrc, themeColor } = state;

  // Calculate transform from image position to fullscreen
  const scaleX = window.innerWidth / imageRect.width;
  const scaleY = window.innerHeight / imageRect.height;
  const scale = Math.max(scaleX, scaleY) * 1.2; // Extra scale for effect

  const translateX = (window.innerWidth / 2) - (imageRect.left + imageRect.width / 2);
  const translateY = (window.innerHeight / 2) - (imageRect.top + imageRect.height / 2);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Image that morphs from card position to fullscreen */}
      <motion.div
        initial={{
          position: 'fixed',
          left: imageRect.left,
          top: imageRect.top,
          width: imageRect.width,
          height: imageRect.height,
          borderRadius: 24, // rounded-3xl
        }}
        animate={{
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
        }}
        transition={{
          duration: 0.7,
          ease: [0.19, 1, 0.22, 1], // Smoother easing
        }}
        className="overflow-hidden"
      >
        <motion.div
          initial={{
            filter: 'grayscale(100%) brightness(1)',
            scale: 1,
          }}
          animate={{
            filter: 'grayscale(0%) brightness(1.1)',
            scale: 1.05,
          }}
          transition={{
            duration: 0.7,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="w-full h-full relative"
        >
          <Image
            src={imageSrc}
            alt="Project"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Smooth fade to page background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.5,
        }}
        className="absolute inset-0 bg-background dark:bg-gray-900"
      />
    </div>
  );
}
