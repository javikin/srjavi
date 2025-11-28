'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/journal/store';
import { getMoodColor, getMoodEmoji, formatDate } from '@/lib/journal/utils';
import type { JournalEntry } from '@/lib/journal/types';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';

// Static posts (published blog posts)
const staticPosts = [
  {
    id: 'carrillo-studio',
    slug: '/journal/carrillo-studio',
    slugES: '/journal/es/estudio-carrillo',
    title: 'Two Years of Not Knowing',
    titleES: 'Dos Años Sin Saber',
    excerpt: 'How I finally chose where to belong after two years of uncertainty between cities, decisions, and versions of myself.',
    excerptES: 'Cómo finalmente elegí dónde pertenezco después de dos años de incertidumbre entre ciudades, decisiones y versiones de mí mismo.',
    coverPhoto: '/images/journal/carrillo-studio/01-hero-stars.jpg',
    date: '2025-11-20',
    tags: ['life', 'carrillo', 'journey'],
    tagsES: ['vida', 'carrillo', 'viaje'],
    readTime: '8 min',
    readTimeES: '9 min',
    photoCount: 9,
  },
];

export default function JournalPage() {
  const [mounted, setMounted] = useState(false);
  const getAllEntries = useJournalStore((state) => state.getAllEntries);
  const [dynamicEntries, setDynamicEntries] = useState<JournalEntry[]>([]);
  const { locale } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setDynamicEntries(getAllEntries());
    }
  }, [mounted, getAllEntries]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">{locale === 'es' ? 'Cargando...' : 'Loading...'}</div>
      </div>
    );
  }

  const hasAnyContent = staticPosts.length > 0 || dynamicEntries.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
                ← {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
              </Link>
              <h1 className="text-3xl font-bold text-text-primary mt-2">Journal</h1>
              <p className="text-text-secondary text-sm mt-1">
                {locale === 'es'
                  ? 'Pensamientos, fotos y momentos de mi vida'
                  : 'Thoughts, photos, and moments from my life'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!hasAnyContent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {locale === 'es' ? 'Aún no hay entradas' : 'No entries yet'}
            </h2>
            <p className="text-text-secondary">
              {locale === 'es'
                ? 'El journal está vacío. ¡Vuelve pronto para actualizaciones!'
                : 'The journal is empty. Check back soon for updates!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <AnimatePresence>
              {/* Static Posts */}
              {staticPosts.map((post, index) => (
                <StaticPostCard key={post.id} post={post} index={index} />
              ))}

              {/* Dynamic Entries */}
              {dynamicEntries.map((entry, index) => (
                <EntryCard key={entry.id} entry={entry} index={staticPosts.length + index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

function StaticPostCard({ post, index }: { post: typeof staticPosts[0]; index: number }) {
  const { locale } = useI18n();
  const postUrl = locale === 'es' ? post.slugES : post.slug;
  const title = locale === 'es' ? post.titleES : post.title;
  const excerpt = locale === 'es' ? post.excerptES : post.excerpt;
  const tags = locale === 'es' ? post.tagsES : post.tags;
  const readTime = locale === 'es' ? post.readTimeES : post.readTime;

  return (
    <Link href={postUrl}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group relative rounded-2xl overflow-hidden bg-surface border border-white/10 hover:border-white/20 transition-all cursor-pointer"
        whileHover={{ y: -4 }}
      >
        {/* Cover Photo */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.coverPhoto}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge for published posts */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-mint/20 border border-mint text-mint text-xs font-medium backdrop-blur-sm">
            Published
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date */}
          <div className="flex items-center justify-between mb-3">
            <time className="text-xs text-text-muted">
              {new Date(post.date).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="text-xs text-text-muted">{readTime} {locale === 'es' ? 'lectura' : 'read'}</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-mint transition-colors">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-text-secondary text-sm line-clamp-3 mb-4">
            {excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-medium bg-mint/15 text-mint"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-text-muted pt-4 border-t border-white/10">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              {post.photoCount}
            </span>
            <span className="text-xs">
              Available in EN/ES
            </span>
          </div>

          {/* Hover glow effect */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              boxShadow: '0 0 30px rgba(138, 216, 192, 0.3)',
            }}
          />
        </div>
      </motion.article>
    </Link>
  );
}

function EntryCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const moodColor = entry.mood ? getMoodColor(entry.mood) : '#666';
  const moodEmoji = entry.mood ? getMoodEmoji(entry.mood) : '📝';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden bg-surface border border-white/10 hover:border-white/20 transition-all"
      whileHover={{ y: -4 }}
    >
      {/* Cover Photo */}
      {entry.coverPhoto && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={entry.coverPhoto}
            alt={entry.title || 'Journal entry'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Mood overlay */}
          <div
            className="absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{
              backgroundColor: `${moodColor}20`,
              border: `2px solid ${moodColor}`,
            }}
          >
            {moodEmoji}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Date & Mood (if no cover photo) */}
        <div className="flex items-center justify-between mb-3">
          <time className="text-xs text-text-muted">
            {formatDate(entry.createdAt)}
          </time>
          {!entry.coverPhoto && entry.mood && (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{
                backgroundColor: `${moodColor}20`,
                border: `2px solid ${moodColor}`,
              }}
            >
              {moodEmoji}
            </div>
          )}
        </div>

        {/* Title */}
        {entry.title && (
          <h2 className="text-xl font-bold text-text-primary mb-2 line-clamp-2">
            {entry.title}
          </h2>
        )}

        {/* Excerpt */}
        {entry.excerpt && (
          <p className="text-text-secondary text-sm line-clamp-3 mb-4">
            {entry.excerpt}
          </p>
        )}

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  color: 'rgb(52, 211, 153)',
                }}
              >
                #{tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-text-muted">
                +{entry.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-text-muted pt-4 border-t border-white/10">
          {entry.wordCount > 0 && (
            <span>{entry.wordCount} words</span>
          )}
          {entry.photoCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              {entry.photoCount}
            </span>
          )}
          {entry.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {entry.location.name}
            </span>
          )}
        </div>

        {/* Hover border effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${moodColor}40`,
          }}
        />
      </div>
    </motion.article>
  );
}
