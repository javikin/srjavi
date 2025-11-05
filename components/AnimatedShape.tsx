'use client';

import { motion } from 'framer-motion';

export default function AnimatedShape() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-3xl blur-2xl" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Geometric shapes */}
      <div className="relative">
        <motion.div
          className="w-80 h-80 relative preserve-3d"
          animate={{ rotateY: 360, rotateX: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {/* Diamond shape */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1, 0.9, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-full h-full relative">
              {/* Top triangle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-0 h-0 border-l-[160px] border-r-[160px] border-b-[160px] border-l-transparent border-r-transparent border-b-secondary/30"
                  style={{ filter: 'drop-shadow(0 0 40px rgba(96, 165, 250, 0.6))' }}
                />
              </div>

              {/* Bottom triangle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-0 h-0 border-l-[160px] border-r-[160px] border-t-[160px] border-l-transparent border-r-transparent border-t-primary/30"
                  style={{ filter: 'drop-shadow(0 0 40px rgba(167, 139, 250, 0.6))' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Wireframe circles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-secondary/20 rounded-full"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{
                rotate: { duration: 15 + i * 5, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ transformOrigin: 'center' }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
