'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Import all our creative components
import { MagneticCard, LiquidGlow, ParallaxLayers, TextScramble } from '../effects/HoverEffects';
import { GlassmorphCard, StaggerReveal, StaggerItem, AnimatedGradientBg, FloatingParticles, ScrollProgress } from '../effects/ImmersiveEffects';

/**
 * SHOWCASE VIEW - Combining all creative techniques
 * This demonstrates how to use multiple effects together
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

interface ShowcaseViewProps {
  posts: Post[];
}

export function ShowcaseView({ posts }: ShowcaseViewProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('grid');

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  );

  // Filter posts by tag
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  // Split into featured and regular
  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <AnimatedGradientBg />
      <FloatingParticles count={15} />
      <ScrollProgress />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10">
        <GlassmorphCard intensity="high" className="rounded-none border-x-0 border-t-0">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <Link
                  href="/"
                  className="text-text-secondary hover:text-text-primary transition-colors text-sm mb-2 inline-block"
                >
                  ← Volver al inicio
                </Link>
                <TextScramble text="Journal" className="text-4xl font-bold text-text-primary block" />
                <p className="text-text-secondary text-sm mt-1">
                  Pensamientos, fotos y momentos de mi vida
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-mint/20 text-mint border border-mint/50'
                      : 'bg-white/5 text-text-secondary border border-white/10'
                  }`}
                >
                  Grid
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('featured')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'featured'
                      ? 'bg-mint/20 text-mint border border-mint/50'
                      : 'bg-white/5 text-text-secondary border border-white/10'
                  }`}
                >
                  Featured
                </motion.button>
              </div>
            </div>

            {/* Tag Filter */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === null
                    ? 'bg-mint/20 text-mint border border-mint/50'
                    : 'bg-white/5 text-text-secondary border border-white/10 hover:border-white/20'
                }`}
              >
                Todos
              </motion.button>
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-mint/20 text-mint border border-mint/50'
                      : 'bg-white/5 text-text-secondary border border-white/10 hover:border-white/20'
                  }`}
                >
                  #{tag}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </GlassmorphCard>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {viewMode === 'featured' ? (
            <FeaturedView
              key="featured"
              featuredPost={featuredPost}
              regularPosts={regularPosts}
            />
          ) : (
            <GridView key="grid" posts={filteredPosts} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Featured View - Hero + Grid
function FeaturedView({
  featuredPost,
  regularPosts,
}: {
  featuredPost: Post;
  regularPosts: Post[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12"
    >
      {/* Featured Post - Full Width */}
      <LiquidGlow color="#8AD8C0">
        <Link href={featuredPost?.comingSoon ? '#' : featuredPost?.slug || '#'}>
          <MagneticCard className="rounded-3xl overflow-hidden">
            <GlassmorphCard intensity="medium" className="border-mint/30">
              <ParallaxLayers
                imageSrc={featuredPost?.coverPhoto || ''}
                title={featuredPost?.title || ''}
                subtitle={featuredPost?.excerpt || ''}
                className="h-[600px]"
              />
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {featuredPost?.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-mint/20 text-mint"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-text-muted">
                    {featuredPost?.readTime} • {featuredPost?.photoCount} fotos
                  </div>
                </div>
              </div>
            </GlassmorphCard>
          </MagneticCard>
        </Link>
      </LiquidGlow>

      {/* Regular Posts Grid */}
      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularPosts.map((post, index) => (
          <StaggerItem key={post.id}>
            <ShowcaseCard post={post} index={index} />
          </StaggerItem>
        ))}
      </StaggerReveal>
    </motion.div>
  );
}

// Grid View - All Posts Equal
function GridView({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <StaggerItem key={post.id}>
            <ShowcaseCard post={post} index={index} />
          </StaggerItem>
        ))}
      </StaggerReveal>
    </motion.div>
  );
}

// Showcase Card - Individual Post Card
function ShowcaseCard({ post, index }: { post: Post; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <MagneticCard className="h-full">
      <LiquidGlow color={post.comingSoon ? '#B295CE' : '#8AD8C0'}>
        <motion.div
          whileHover={{ y: -8 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="h-full"
        >
          <GlassmorphCard
            intensity="medium"
            className={`h-full overflow-hidden transition-all duration-500 ${
              post.comingSoon
                ? 'border-lavender/30 hover:border-lavender/50'
                : 'border-mint/30 hover:border-mint/50 cursor-pointer'
            }`}
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border shadow-lg ${
                  post.comingSoon
                    ? 'bg-lavender/30 border-lavender/50 text-lavender'
                    : 'bg-mint/30 border-mint/50 text-mint'
                }`}
              >
                {post.comingSoon ? 'Próximamente' : 'Publicado'}
              </motion.div>

              {/* Photo Count */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-xl border border-white/20">
                <PhotoIcon className="w-3 h-3 text-mint" />
                <span className="text-xs font-medium text-text-primary">
                  {post.photoCount}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              {/* Date */}
              <div className="flex items-center justify-between text-xs text-text-muted">
                <time>
                  {new Date(post.date).toLocaleDateString('es-MX', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                <span>{post.readTime}</span>
              </div>

              {/* Title */}
              <h2
                className={`text-xl font-bold line-clamp-2 transition-colors duration-300 ${
                  post.comingSoon
                    ? 'text-text-secondary'
                    : 'text-text-primary group-hover:text-mint'
                }`}
              >
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      post.comingSoon
                        ? 'bg-lavender/20 text-lavender'
                        : 'bg-mint/20 text-mint'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Hover Glow */}
            <AnimatePresence>
              {isHovered && !post.comingSoon && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(138, 216, 192, 0.15), transparent 70%)',
                  }}
                />
              )}
            </AnimatePresence>
          </GlassmorphCard>
        </motion.div>
      </LiquidGlow>
    </MagneticCard>
  );

  return post.comingSoon ? (
    cardContent
  ) : (
    <Link href={post.slug} className="block h-full">
      {cardContent}
    </Link>
  );
}

// Icon
const PhotoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
      clipRule="evenodd"
    />
  </svg>
);
