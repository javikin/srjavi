'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CinematicPostProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverPhoto: string;
    date: string;
    tags: string[];
    readTime: string;
    photoCount: number;
    comingSoon?: boolean;
  };
  index: number;
}

export function CinematicPost({ post, index }: CinematicPostProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  const isComingSoon = post.comingSoon;

  const Content = (
    <motion.article
      ref={ref}
      style={{ opacity }}
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      id={post.id}
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y: smoothY }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div style={{ y: imageY }} className="relative w-full h-[120%] -top-[10%]">
          <Image
            src={post.coverPhoto}
            alt={post.title}
            fill
            className={`object-cover ${isComingSoon ? 'grayscale blur-sm' : ''}`}
            priority={index === 0}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

        {/* Film grain for coming soon */}
        {isComingSoon && (
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </motion.div>

      {/* Content container */}
      <motion.div
        style={{ scale: smoothScale }}
        className="relative max-w-4xl w-full"
      >
        {/* Scene number */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="absolute -left-4 md:-left-16 top-0 font-mono text-8xl md:text-9xl text-white/5 font-bold select-none"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          {isComingSoon ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender/10 border border-lavender/30 text-lavender text-sm font-medium">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-lavender"
              />
              Próximamente ~Diciembre 2025
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/30 text-mint text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-mint" />
              Publicado
            </span>
          )}
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-6">
          <motion.h2
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-5xl md:text-7xl font-bold leading-tight ${
              isComingSoon ? 'text-text-secondary' : 'text-text-primary'
            }`}
          >
            {post.title}
          </motion.h2>
        </div>

        {/* Excerpt */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`text-xl md:text-2xl leading-relaxed mb-8 max-w-2xl ${
            isComingSoon ? 'text-text-muted' : 'text-text-secondary'
          }`}
        >
          {post.excerpt}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {post.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                isComingSoon
                  ? 'bg-lavender/10 text-lavender border border-lavender/20'
                  : 'bg-mint/10 text-mint border border-mint/20'
              }`}
            >
              #{tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center gap-6 text-text-muted mb-8"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            {post.readTime} lectura
          </span>
          <span className="w-px h-4 bg-text-muted/30" />
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            {post.photoCount} fotos
          </span>
          {!isComingSoon && (
            <>
              <span className="w-px h-4 bg-text-muted/30" />
              <span className="font-mono text-sm">
                {new Date(post.date).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </>
          )}
        </motion.div>

        {/* CTA */}
        {!isComingSoon && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href={post.slug}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-mint/10 hover:bg-mint/20 border border-mint/30 hover:border-mint/50 rounded-full text-mint font-medium transition-all"
            >
              <span>Leer la historia</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </Link>
          </motion.div>
        )}

        {/* Coming soon message */}
        {isComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4 p-6 bg-lavender/5 border border-lavender/20 rounded-2xl max-w-md"
          >
            <div className="text-4xl">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔮
              </motion.span>
            </div>
            <div>
              <p className="text-lavender font-medium mb-1">En construcción</p>
              <p className="text-text-muted text-sm">
                Esta historia está tomando forma. Vuelve pronto.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator (only on first) */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-text-muted"
          >
            <span className="text-xs mb-2">Explora</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </motion.article>
  );

  // Don't wrap coming soon in Link
  if (isComingSoon) {
    return Content;
  }

  return Content;
}

export default CinematicPost;
