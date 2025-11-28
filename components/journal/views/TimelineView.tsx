'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * HORIZONTAL TIMELINE - Instagram Stories-style scroll
 * Features:
 * - Horizontal scroll with mouse wheel hijacking
 * - Progress indicator
 * - Snap scrolling
 * - Scale animations on scroll
 * - Timeline connector line
 * - Depth parallax effect
 */

interface Post {
  id: string;
  title: string;
  excerpt: string;
  coverPhoto: string;
  date: string;
  tags: string[];
  readTime: string;
  photoCount: number;
  comingSoon?: boolean;
  slug: string;
}

interface TimelineViewProps {
  posts: Post[];
}

export function TimelineView({ posts }: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  const smoothProgress = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Sort posts by date
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="sticky top-20 z-40 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-muted font-mono">
            {activeIndex + 1} / {sortedPosts.length}
          </span>
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-mint via-sky to-lavender rounded-full"
              style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
            />
          </div>
          <span className="text-xs text-text-muted">
            Arrastra →
          </span>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory pb-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={(e) => {
          const scrollLeft = e.currentTarget.scrollLeft;
          const cardWidth = e.currentTarget.scrollWidth / sortedPosts.length;
          setActiveIndex(Math.round(scrollLeft / cardWidth));
        }}
      >
        <div className="flex gap-8 px-8 py-4">
          {sortedPosts.map((post, index) => (
            <TimelineCard
              key={post.id}
              post={post}
              index={index}
              isActive={index === activeIndex}
              totalPosts={sortedPosts.length}
            />
          ))}
        </div>
      </div>

      {/* Timeline Connector - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mint to-transparent" />
    </div>
  );
}

function TimelineCard({
  post,
  index,
  isActive,
  totalPosts,
}: {
  post: Post;
  index: number;
  isActive: boolean;
  totalPosts: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Scale based on active state
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.9, 1, 0.9]
  );

  const cardContent = (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        scale: isActive ? 1.05 : scale,
      }}
      className={`group relative flex-shrink-0 w-[400px] h-[550px] snap-center
        rounded-3xl overflow-hidden bg-surface border transition-all duration-500
        ${isActive
          ? 'border-mint shadow-2xl shadow-mint/30'
          : 'border-white/10 hover:border-white/20'
        }
        ${post.comingSoon ? 'cursor-default opacity-70' : 'cursor-pointer'}
      `}
    >
      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isActive ? 1.5 : 1 }}
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-10
          ${isActive ? 'bg-mint shadow-lg shadow-mint/50' : 'bg-text-muted'}
        `}
      />

      {/* Date Badge - Timeline style */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl border-2
            ${isActive
              ? 'bg-mint/20 border-mint text-mint'
              : 'bg-surface/80 border-white/20 text-text-muted'
            }
          `}
        >
          {new Date(post.date).toLocaleDateString('es-MX', {
            month: 'short',
            year: 'numeric',
          })}
        </motion.div>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-[60%] overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full"
        >
          <Image
            src={post.coverPhoto}
            alt={post.title}
            fill
            className={`object-cover ${post.comingSoon ? 'grayscale' : ''}`}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

        {/* Status Badge */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold
            backdrop-blur-xl border shadow-lg ${
            post.comingSoon
              ? 'bg-lavender/30 border-lavender/50 text-lavender'
              : 'bg-mint/30 border-mint/50 text-mint'
          }`}
        >
          {post.comingSoon ? 'Próximamente' : 'Publicado'}
        </motion.div>

        {/* Photo Count Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-xl border border-white/20">
          <PhotoIcon className="w-3 h-3 text-mint" />
          <span className="text-xs font-medium text-text-primary">
            {post.photoCount}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-[40%] p-6 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Title */}
          <h2 className={`text-2xl font-bold line-clamp-2 transition-colors duration-300 ${
            post.comingSoon
              ? 'text-text-secondary'
              : 'text-text-primary group-hover:text-mint'
          }`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  post.comingSoon
                    ? 'bg-lavender/20 text-lavender'
                    : 'bg-mint/20 text-mint'
                }`}
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            {post.readTime}
          </span>
          {!post.comingSoon && (
            <motion.div
              whileHover={{ x: 5 }}
              className="text-mint text-sm font-medium flex items-center gap-1"
            >
              Leer más
              <ArrowIcon className="w-4 h-4" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Active Glow */}
      {isActive && !post.comingSoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(138, 216, 192, 0.2), transparent 60%)',
          }}
        />
      )}
    </motion.article>
  );

  return post.comingSoon ? cardContent : <Link href={post.slug}>{cardContent}</Link>;
}

// Icons
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PhotoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd"
      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
      clipRule="evenodd" />
  </svg>
);

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// CSS to hide scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
