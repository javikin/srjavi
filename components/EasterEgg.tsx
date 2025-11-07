'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EasterEggRef {
  open: () => void;
}

const EasterEgg = forwardRef<EasterEggRef>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasFound, setHasFound] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('🎨');

  const handleOpen = () => {
    if (!hasFound) {
      setHasFound(true);
      // Save to localStorage so it persists
      localStorage.setItem('easter_egg_found', 'true');
    }
    // Get the current emoji from sessionStorage
    const emoji = sessionStorage.getItem('currentEmoji') || '🎨';
    setCurrentEmoji(emoji);
    setIsModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen
  }));

  return (
    <>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative max-w-2xl w-full bg-background rounded-3xl p-8 md:p-12 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors text-2xl"
              >
                ✕
              </button>

              {/* Content */}
              <div className="space-y-6 text-center">
                {/* Big emoji animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="text-8xl"
                >
                  {hasFound ? '🎉' : '🥚'}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"
                >
                  {hasFound ? '¡Lo encontraste!' : '¡Easter Egg!'}
                </motion.h2>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 text-text-secondary leading-relaxed"
                >
                  <p className="text-lg">
                    Cada vez que cargas, sale un emoji random. Pueden ser 500+ diferentes.
                  </p>
                  <p className="text-base">
                    Desde 😊 🚀 💎 hasta 💩 🍆
                  </p>
                </motion.div>

                {/* Show current emoji */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 rounded-2xl border border-mint/30 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(138, 216, 192, 0.08) 0%, rgba(120, 225, 205, 0.08) 25%, rgba(107, 225, 212, 0.08) 50%, rgba(120, 214, 215, 0.08) 75%, rgba(133, 203, 218, 0.08) 100%)'
                  }}
                >
                  <p className="text-text-muted text-sm mb-2">Tu emoji:</p>
                  <div className="text-7xl my-2">{currentEmoji}</div>
                  <p className="text-sm text-text-secondary mt-3">
                    ¿Épico? Mándame screenshot → 1 chela 🍺
                  </p>
                  <p className="text-sm text-text-secondary">
                    Con foto tuya al lado → 2 chelas 🍺🍺
                  </p>
                </motion.div>

                {/* Stats if found */}
                {hasFound && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4 border-t border-text-primary/10"
                  >
                    <p className="text-sm text-text-muted">
                      🏆 Eres oficialmente un <span className="text-emerald-400 font-bold">Explorador Chismoso™</span>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

EasterEgg.displayName = 'EasterEgg';

export default EasterEgg;
