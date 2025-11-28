'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * MASONRY LAYOUT - Pinterest-style with dynamic columns
 * Features:
 * - Responsive columns (1-4 based on screen size)
 * - Cards with varying heights based on content
 * - Parallax scroll effect on images
 * - Staggered reveal animations
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

interface MasonryViewProps {
  posts: Post[];
}

export function MasonryView({ posts }: MasonryViewProps) {
  const [columns, setColumns] = useState(3);

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else if (window.innerWidth < 1536) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute posts across columns
  const distributeColumns = () => {
    const cols: Post[][] = Array.from({ length: columns }, () => []);
    posts.forEach((post, idx) => {
      cols[idx % columns].push(post);
    });
    return cols;
  };

  const columnPosts = distributeColumns();

  return (
    <div className="flex gap-6 items-start">
      {columnPosts.map((columnItems, colIndex) => (
        <div key={colIndex} className="flex-1 space-y-6">
          {columnItems.map((post, itemIndex) => (
            <MasonryCard
              key={post.id}
              post={post}
              index={colIndex * Math.ceil(posts.length / columns) + itemIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MasonryCard({ post, index }: { post: Post; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Parallax effect - image moves slower than card
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Random heights for variety (controlled randomness)
  const heights = ['h-64', 'h-72', 'h-80', 'h-96'];
  const heightClass = heights[index % heights.length];

  const cardContent = (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group relative rounded-3xl overflow-hidden bg-surface border border-white/10
        ${post.comingSoon ? 'cursor-default opacity-70' : 'cursor-pointer hover:border-mint/40'}
        shadow-lg hover:shadow-2xl hover:shadow-mint/20 transition-all duration-500`}
    >
      {/* Image with parallax */}
      <div className={`relative w-full ${heightClass} overflow-hidden`}>
        <motion.div
          style={{ y: imageY }}
          className="relative w-full h-[120%]"
        >
          <Image
            src={post.coverPhoto}
            alt={post.title}
            fill
            className={`object-cover transition-all duration-700 ${
              post.comingSoon
                ? 'grayscale'
                : 'group-hover:scale-110 group-hover:brightness-110'
            }`}
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />

        {/* Status badge with morphing animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-semibold
            backdrop-blur-xl border shadow-lg ${
            post.comingSoon
              ? 'bg-lavender/30 border-lavender/50 text-lavender shadow-lavender/20'
              : 'bg-mint/30 border-mint/50 text-mint shadow-mint/20'
          }`}
        >
          {post.comingSoon ? 'Próximamente' : 'Publicado'}
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="p-6 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        {/* Date & Read Time */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <time>{new Date(post.date).toLocaleDateString('es-MX', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}</time>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h2 className={`text-xl font-bold line-clamp-2 transition-colors duration-300 ${
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
        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.slice(0, 2).map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.4 + i * 0.05 }}
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                post.comingSoon
                  ? 'bg-lavender/20 text-lavender'
                  : 'bg-mint/20 text-mint hover:bg-mint/30'
              }`}
            >
              #{tag}
            </motion.span>
          ))}
        </div>

        {/* Photo count */}
        <div className="flex items-center gap-2 text-xs text-text-muted pt-3 border-t border-white/5">
          <PhotoIcon className="w-4 h-4" />
          <span>{post.photoCount} fotos</span>
        </div>
      </motion.div>

      {/* Hover glow */}
      {!post.comingSoon && (
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(138, 216, 192, 0.15), transparent 70%)',
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
