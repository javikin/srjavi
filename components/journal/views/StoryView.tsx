'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * SCROLL STORYTELLING VIEW - Apple/Airbnb style
 * Features:
 * - Scroll-triggered animations
 * - Layered parallax with depth
 * - Text reveals on scroll
 * - Image zoom/pan effects
 * - Floating elements
 * - Sticky sections
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

interface StoryViewProps {
  posts: Post[];
}

export function StoryView({ posts }: StoryViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <HeroSection scrollProgress={scrollYProgress} />

      {/* Story Cards */}
      <div className="space-y-32 py-32">
        {posts.map((post, index) => (
          <StoryCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Floating Background Elements */}
      <FloatingElements scrollProgress={scrollYProgress} />
    </div>
  );
}

function HeroSection({ scrollProgress }: { scrollProgress: any }) {
  const opacity = useTransform(scrollProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollProgress, [0, 0.2], [1, 0.8]);
  const y = useTransform(scrollProgress, [0, 0.2], [0, -100]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="sticky top-0 h-screen flex items-center justify-center -z-10"
    >
      <div className="text-center space-y-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-br from-mint via-sky to-lavender bg-clip-text text-transparent">
            Journal
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-xl text-text-secondary max-w-2xl mx-auto"
        >
          Historias, pensamientos y momentos capturados en el tiempo
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-text-muted"
        >
          <span>Scroll para descubrir</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StoryCard({ post, index }: { post: Post; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Different parallax speeds for depth
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Alternating layouts
  const isEven = index % 2 === 0;

  const cardContent = (
    <motion.article
      ref={cardRef}
      style={{ opacity: contentOpacity }}
      className="relative min-h-screen flex items-center"
    >
      <div className={`container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
        isEven ? '' : 'lg:grid-flow-dense'
      }`}>
        {/* Image Section */}
        <motion.div
          ref={imageRef}
          style={{ y: imageY }}
          className={`relative ${isEven ? '' : 'lg:col-start-2'}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden group"
          >
            <motion.div
              style={{ scale: imageScale }}
              className="w-full h-full"
            >
              <Image
                src={post.coverPhoto}
                alt={post.title}
                fill
                className={`object-cover transition-all duration-700 ${
                  post.comingSoon ? 'grayscale' : 'group-hover:brightness-110'
                }`}
              />
            </motion.div>

            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className={`absolute bottom-6 left-6 px-4 py-2 rounded-full backdrop-blur-xl border ${
                post.comingSoon
                  ? 'bg-lavender/30 border-lavender/50 text-lavender'
                  : 'bg-mint/30 border-mint/50 text-mint'
              } text-sm font-semibold shadow-lg`}
            >
              {post.comingSoon ? 'Próximamente' : 'Publicado'}
            </motion.div>

            {/* Photo count */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="absolute top-6 right-6 flex items-center gap-2 px-3 py-2 rounded-full bg-background/60 backdrop-blur-xl border border-white/20"
            >
              <PhotoIcon className="w-4 h-4 text-mint" />
              <span className="text-sm font-medium text-text-primary">
                {post.photoCount}
              </span>
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.3 } : {}}
            transition={{ delay: 0.6 }}
            className="absolute -inset-4 bg-gradient-to-br from-mint/20 via-transparent to-lavender/20 rounded-3xl -z-10 blur-3xl"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          style={{ y: textY }}
          className={`space-y-6 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
        >
          {/* Date */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 text-text-muted"
          >
            <div className="h-px w-12 bg-gradient-to-r from-mint to-transparent" />
            <time className="text-sm">
              {new Date(post.date).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </motion.div>

          {/* Title with word reveal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-5xl md:text-6xl font-bold leading-tight ${
              post.comingSoon ? 'text-text-secondary' : 'text-text-primary'
            }`}
          >
            {post.title.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-text-secondary leading-relaxed max-w-lg"
          >
            {post.excerpt}
          </motion.p>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {post.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.05 }}
                className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                  post.comingSoon
                    ? 'bg-lavender/20 text-lavender border border-lavender/30'
                    : 'bg-mint/20 text-mint border border-mint/30 hover:bg-mint/30'
                }`}
              >
                #{tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-6 pt-4"
          >
            <div className="flex items-center gap-2 text-text-muted">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm">{post.readTime}</span>
            </div>
            {!post.comingSoon && (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-mint font-medium cursor-pointer"
              >
                <span>Leer artículo completo</span>
                <ArrowIcon className="w-5 h-5" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );

  return post.comingSoon ? cardContent : <Link href={post.slug}>{cardContent}</Link>;
}

function FloatingElements({ scrollProgress }: { scrollProgress: any }) {
  const y1 = useTransform(scrollProgress, [0, 1], [0, -500]);
  const y2 = useTransform(scrollProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollProgress, [0, 1], [0, -700]);

  return (
    <>
      <motion.div
        style={{ y: y1 }}
        className="fixed top-20 right-10 w-64 h-64 bg-mint/10 rounded-full blur-3xl -z-20"
      />
      <motion.div
        style={{ y: y2 }}
        className="fixed top-1/2 left-10 w-96 h-96 bg-lavender/10 rounded-full blur-3xl -z-20"
      />
      <motion.div
        style={{ y: y3 }}
        className="fixed bottom-20 right-1/4 w-80 h-80 bg-coral/10 rounded-full blur-3xl -z-20"
      />
    </>
  );
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
