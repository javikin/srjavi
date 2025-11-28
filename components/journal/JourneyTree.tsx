'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface JourneyNode {
  id: string;
  title: string;
  date: string;
  status: 'published' | 'coming-soon' | 'future';
  branch?: 'left' | 'right' | 'center';
  description?: string;
}

interface JourneyTreeProps {
  nodes: JourneyNode[];
  onNodeClick?: (id: string) => void;
}

export function JourneyTree({ nodes, onNodeClick }: JourneyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <div ref={containerRef} className="relative min-h-screen py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface/50" />

      {/* Ambient glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-mint/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-mono text-mint mb-4 tracking-widest">EL CAMINO</h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            Cada decisión abre nuevas ramas. Este es el mapa de mi journey.
          </p>
        </motion.div>

        {/* Tree SVG */}
        <div className="relative">
          {/* Main trunk line */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-4"
            viewBox="0 0 16 100"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M8 0 L8 100"
              stroke="url(#trunkGradient)"
              strokeWidth="2"
              fill="none"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8AD8C0" />
                <stop offset="50%" stopColor="#8AD8C0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#B295CE" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Nodes */}
          <div className="relative space-y-24">
            {nodes.map((node, index) => (
              <TreeNode
                key={node.id}
                node={node}
                index={index}
                total={nodes.length}
                onClick={() => onNodeClick?.(node.id)}
              />
            ))}
          </div>
        </div>

        {/* Future hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex flex-col items-center text-text-muted"
          >
            <span className="text-xs mb-2">Sigue creciendo</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  index,
  total,
  onClick,
}: {
  node: JourneyNode;
  index: number;
  total: number;
  onClick: () => void;
}) {
  const isRoot = index === 0;
  const isComingSoon = node.status === 'coming-soon';
  const isFuture = node.status === 'future';

  // Alternate sides for branches
  const side = node.branch || (index % 2 === 0 ? 'right' : 'left');
  const isLeft = side === 'left';
  const isCenter = side === 'center' || isRoot;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative flex items-center ${
        isCenter ? 'justify-center' : isLeft ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Branch line */}
      {!isCenter && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
          className={`absolute top-1/2 h-0.5 w-24 md:w-32 ${
            isLeft ? 'left-1/2 origin-left' : 'right-1/2 origin-right'
          }`}
          style={{
            background: isComingSoon
              ? 'linear-gradient(90deg, transparent, rgba(178, 149, 206, 0.5))'
              : 'linear-gradient(90deg, transparent, rgba(138, 216, 192, 0.5))',
          }}
        />
      )}

      {/* Center dot on trunk */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', delay: index * 0.15 + 0.2 }}
        className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${
          isComingSoon ? 'bg-lavender/50' : 'bg-mint'
        }`}
      >
        {/* Pulse effect for root */}
        {isRoot && (
          <motion.div
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-mint"
          />
        )}
      </motion.div>

      {/* Node card */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`relative group ${
          isCenter ? 'w-full max-w-md' : 'w-full max-w-xs'
        } ${!isCenter && (isLeft ? 'mr-auto ml-8' : 'ml-auto mr-8')} ${
          isCenter ? '' : 'md:w-80'
        }`}
      >
        <div
          className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all ${
            isRoot
              ? 'bg-mint/10 border-mint/30 hover:border-mint/50'
              : isComingSoon
              ? 'bg-lavender/5 border-lavender/20 hover:border-lavender/40'
              : 'bg-surface/80 border-white/10 hover:border-white/20'
          }`}
        >
          {/* Status badge */}
          <div className={`absolute -top-3 ${isCenter ? 'left-6' : isLeft ? 'right-6' : 'left-6'}`}>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isRoot
                  ? 'bg-mint/20 text-mint border border-mint/30'
                  : isComingSoon
                  ? 'bg-lavender/20 text-lavender border border-lavender/30'
                  : 'bg-surface text-text-muted border border-white/10'
              }`}
            >
              {isRoot ? 'Origen' : isComingSoon ? '~Dic 2025' : node.date}
            </span>
          </div>

          {/* Content */}
          <div className={`${isCenter ? 'text-center' : isLeft ? 'text-left' : 'text-right'}`}>
            <h3
              className={`text-xl md:text-2xl font-bold mb-2 ${
                isRoot
                  ? 'text-mint'
                  : isComingSoon
                  ? 'text-lavender/80'
                  : 'text-text-primary'
              }`}
            >
              {node.title}
            </h3>

            {node.description && (
              <p className={`text-sm ${isComingSoon ? 'text-text-muted' : 'text-text-secondary'}`}>
                {node.description}
              </p>
            )}

            {/* Arrow indicator */}
            {!isComingSoon && (
              <motion.div
                className={`mt-4 flex items-center gap-2 text-xs font-medium ${
                  isRoot ? 'text-mint justify-center' : 'text-text-muted'
                } ${isCenter ? 'justify-center' : isLeft ? 'justify-start' : 'justify-end'}`}
              >
                <span>Leer</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.div>
            )}

            {/* Coming soon indicator */}
            {isComingSoon && (
              <div className={`mt-4 flex items-center gap-2 text-xs text-lavender/60 ${
                isCenter ? 'justify-center' : isLeft ? 'justify-start' : 'justify-end'
              }`}>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-lavender/50"
                />
                <span>En progreso</span>
              </div>
            )}
          </div>

          {/* Glow effect */}
          <div
            className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
              isRoot ? 'shadow-[0_0_30px_rgba(138,216,192,0.2)]' : ''
            }`}
          />
        </div>
      </motion.button>
    </motion.div>
  );
}

export default JourneyTree;
