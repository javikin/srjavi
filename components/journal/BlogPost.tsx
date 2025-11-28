'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

type ContentItem = {
  type: 'paragraph' | 'quote' | 'callout' | 'callout-large' | 'rhythm-box';
  text?: string;
  emphasis?: boolean;
  title?: string;
  items?: Array<{
    icon: string;
    color: string;
    text: string;
  }>;
};

type Section = {
  type: 'intro' | 'section' | 'pull-quote' | 'closing';
  title?: string;
  layout?: string;
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
  images?: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  content: ContentItem[];
};

type BlogContent = {
  meta: {
    title: string;
    subtitle?: string;
    date: string;
    tags: string[];
    readTime: string;
  };
  hero: {
    image: string;
    alt: string;
  };
  sections: Section[];
};

interface BlogPostProps {
  content: BlogContent;
  backLabel: string;
  backUrl?: string;
}

export default function BlogPost({ content, backLabel, backUrl = '/journal' }: BlogPostProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const renderContentItem = (item: ContentItem, index: number) => {
    switch (item.type) {
      case 'quote':
        return (
          <p
            key={index}
            className="text-lg md:text-xl text-text-secondary leading-relaxed mb-6 italic border-l-4 border-mint pl-6"
          >
            {item.text}
          </p>
        );

      case 'paragraph':
        return (
          <p
            key={index}
            className={`text-lg text-text-secondary leading-relaxed ${item.emphasis ? 'font-medium' : ''}`}
            dangerouslySetInnerHTML={{ __html: item.text || '' }}
          />
        );

      case 'callout':
        return (
          <div key={index} className="bg-surface p-8 rounded-2xl border-l-4 border-coral my-6">
            <p className="text-2xl font-bold text-text-primary">{item.text}</p>
          </div>
        );

      case 'callout-large':
        return (
          <div key={index} className="bg-background p-8 rounded-2xl border-2 border-mint my-8">
            <p className="text-2xl font-bold text-text-primary text-center">{item.text}</p>
          </div>
        );

      case 'rhythm-box':
        return (
          <div key={index} className="bg-background p-6 rounded-2xl">
            <p className="text-xl font-bold text-text-primary mb-4">{item.title}</p>
            <ul className="space-y-3 text-text-secondary">
              {item.items?.map((rhythmItem, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`text-${rhythmItem.color}`}>{rhythmItem.icon}</span>
                  <span>{rhythmItem.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSection = (section: Section, index: number) => {
    switch (section.type) {
      case 'intro':
        return (
          <section key={index} className="max-w-3xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="prose prose-lg prose-invert space-y-4"
            >
              {section.content.map(renderContentItem)}
            </motion.div>
          </section>
        );

      case 'pull-quote':
        return (
          <section key={index} className="py-24">
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto px-6 text-center"
            >
              <p className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-coral via-mint to-sky leading-tight">
                &ldquo;{(section as any).text}&rdquo;
              </p>
            </motion.blockquote>
          </section>
        );

      case 'section':
        if (section.layout === 'three-column-photos') {
          return (
            <section key={index} className="py-24">
              <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-5xl font-bold text-text-primary mb-16 text-center"
                >
                  {section.title}
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {section.images?.slice(0, 3).map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {i === 1 && section.images?.[3] && (
                        <div className="relative aspect-square rounded-2xl overflow-hidden">
                          <Image
                            src={section.images[3].src}
                            alt={section.images[3].alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm text-text-muted italic mt-4 text-center">
                        {img.caption}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto space-y-6"
                >
                  {section.content.map(renderContentItem)}
                </motion.div>
              </div>
            </section>
          );
        }

        const isImageRight = section.layout === 'image-right';
        const isWide = section.layout === 'image-left-wide';

        return (
          <section
            key={index}
            className={`py-24 ${index % 2 === 0 ? 'bg-surface' : ''}`}
          >
            <div className="max-w-7xl mx-auto px-6">
              {section.title && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-5xl font-bold text-text-primary mb-16 text-center"
                >
                  {section.title}
                </motion.h2>
              )}

              <div className={`grid ${isWide ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-12 items-center`}>
                <motion.div
                  initial={{ opacity: 0, x: isImageRight ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={isImageRight ? 'order-1 md:order-2' : ''}
                >
                  {section.image && (
                    <>
                      <div className={`relative ${isWide ? 'aspect-[3/4]' : 'aspect-[4/3]'} rounded-2xl overflow-hidden`}>
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm text-text-muted italic mt-4 text-center">
                        {section.image.caption}
                      </p>
                    </>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: isImageRight ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`space-y-6 ${isImageRight ? 'order-2 md:order-1' : ''} ${isWide ? 'flex flex-col justify-center' : ''}`}
                >
                  {section.content.map(renderContentItem)}
                </motion.div>
              </div>
            </div>
          </section>
        );

      case 'closing':
        return (
          <section key={index} className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background opacity-50" />

            <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold text-text-primary mb-12"
              >
                {section.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 text-lg text-text-secondary leading-relaxed"
              >
                {section.content.map(renderContentItem)}
              </motion.div>

              {/* Date & Tags */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="pt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted"
              >
                <time>{new Date(content.meta.date).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</time>
                <span>•</span>
                <div className="flex gap-2">
                  {content.meta.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full ${
                        i === 0 ? 'bg-mint/20 text-mint' :
                        i === 1 ? 'bg-sky/20 text-sky' :
                        'bg-lavender/20 text-lavender'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Back to Journal */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="pt-12"
              >
                <Link
                  href={backUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mint/10 hover:bg-mint/20 text-mint font-medium transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {backLabel}
                </Link>
              </motion.div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <article className="min-h-screen bg-background">
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-mint via-sky to-lavender z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ y: heroY }}
      >
        <div className="absolute inset-0">
          <Image
            src={content.hero.image}
            alt={content.hero.alt}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link
              href={backUrl}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-mint transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </Link>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {content.meta.title}
            </h1>
            {content.meta.subtitle && (
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                {content.meta.subtitle}
              </p>
            )}

            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ opacity: heroOpacity }}
            >
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-white/50 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Sections */}
      {content.sections.map(renderSection)}
    </article>
  );
}
