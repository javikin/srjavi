'use client';

import { useEffect, useState } from 'react';

export default function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    setShowMonitor(true);

    let lastTime = performance.now();
    let frames = 0;

    const checkFPS = () => {
      const currentTime = performance.now();
      frames++;

      if (currentTime >= lastTime + 1000) {
        const currentFPS = Math.round((frames * 1000) / (currentTime - lastTime));
        setFps(currentFPS);
        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(checkFPS);
    };

    const rafId = requestAnimationFrame(checkFPS);

    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!showMonitor) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg bg-dark-bg/90 text-white text-sm font-mono backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${fps >= 55 ? 'bg-green-500' : fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        <span>{fps} FPS</span>
      </div>
    </div>
  );
}
