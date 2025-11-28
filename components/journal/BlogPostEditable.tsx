"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import InlineEdit from '../InlineEdit';

type BlogContent = any;

interface BlogPostEditableProps {
  content: BlogContent;
  backLabel: string;
  backUrl?: string;
  editMode: boolean;
  onUpdate: (field: string, value: string) => Promise<void>;
}

export default function BlogPostEditable({
  content,
  backLabel,
  backUrl = '/journal',
  editMode,
  onUpdate
}: BlogPostEditableProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Smooth transition reveal for intro section
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start end", "start center"]
  });

  const renderContentItem = (item: any, index: number, sectionName: string) => {
    // Use jsonPath from adapter if available, otherwise fallback to generated path
    const getPath = (suffix?: string) => {
      if (item.jsonPath) return item.jsonPath;
      return suffix ? `${sectionName}.content.${index}.${suffix}` : `${sectionName}.content.${index}`;
    };

    switch (item.type) {
      case 'quote':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="my-8"
          >
            <blockquote className="border-l-2 border-mint/50 pl-6">
              <p className="text-xl md:text-2xl text-text-primary/90 leading-relaxed font-light italic">
                <InlineEdit
                  value={item.text}
                  onSave={async (val) => await onUpdate(getPath(), val)}
                  field={getPath()}
                  editMode={editMode}
                  multiline
                  className="text-xl md:text-2xl text-text-primary/90 leading-relaxed font-light italic"
                />
              </p>
            </blockquote>
          </motion.div>
        );

      case 'paragraph':
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
            className={`text-lg md:text-xl text-text-secondary leading-relaxed ${item.emphasis ? 'font-medium text-text-primary' : ''}`}
          >
            <InlineEdit
              value={item.text || ''}
              onSave={async (val) => await onUpdate(getPath(), val)}
              field={getPath()}
              editMode={editMode}
              multiline
              className={`text-lg md:text-xl text-text-secondary leading-relaxed ${item.emphasis ? 'font-medium text-text-primary' : ''}`}
            />
          </motion.p>
        );

      case 'callout':
        return (
          <div key={index} className="bg-surface p-8 rounded-2xl border-l-4 border-coral my-6">
            <p className="text-2xl font-bold text-text-primary">
              <InlineEdit
                value={item.text}
                onSave={async (val) => await onUpdate(getPath(), val)}
                field={getPath()}
                editMode={editMode}
                multiline
                className="text-2xl font-bold text-text-primary"
              />
            </p>
          </div>
        );

      case 'callout-large':
        return (
          <div key={index} className="bg-background p-8 rounded-2xl border-2 border-mint my-8">
            <p className="text-2xl font-bold text-text-primary text-center">
              <InlineEdit
                value={item.text}
                onSave={async (val) => await onUpdate(getPath(), val)}
                field={getPath()}
                editMode={editMode}
                multiline
                className="text-2xl font-bold text-text-primary"
              />
            </p>
          </div>
        );

      case 'rhythm-box':
        return (
          <div key={index} className="bg-background p-6 rounded-2xl">
            <p className="text-xl font-bold text-text-primary mb-4">
              <InlineEdit
                value={item.title}
                onSave={async (val) => await onUpdate(item.titleJsonPath || `${sectionName}.content.${index}.title`, val)}
                field={item.titleJsonPath || `${sectionName}.content.${index}.title`}
                editMode={editMode}
                className="text-xl font-bold text-text-primary"
              />
            </p>
            <ul className="space-y-3 text-text-secondary">
              {item.items?.map((rhythmItem: any, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`text-${rhythmItem.color}`}>{rhythmItem.icon}</span>
                  <span>
                    <InlineEdit
                      value={rhythmItem.text}
                      onSave={async (val) => await onUpdate(rhythmItem.jsonPath || `${sectionName}.content.${index}.items.${i}.text`, val)}
                      field={rhythmItem.jsonPath || `${sectionName}.content.${index}.items.${i}.text`}
                      editMode={editMode}
                      multiline
                      className="text-text-secondary"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSection = (section: any, index: number) => {
    const sectionName = `sections.${index}`;

    switch (section.type) {
      case 'intro':
        return (
          <section key={index} className="relative bg-background">
            <div ref={introRef} className="max-w-3xl mx-auto px-6 pt-24 pb-32">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {section.content.map((item: any, idx: number) =>
                  renderContentItem(item, idx, sectionName)
                )}
              </motion.div>

              {/* Simple divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="mt-20 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent"
              />
            </div>
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
                "<InlineEdit
                  value={(section as any).text}
                  onSave={async (val) => await onUpdate(section.jsonPath || `${sectionName}.text`, val)}
                  field={section.jsonPath || `${sectionName}.text`}
                  editMode={editMode}
                  multiline
                  className="text-3xl md:text-5xl font-bold"
                />"
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
                  <InlineEdit
                    value={section.title}
                    onSave={async (val) => await onUpdate(section.titleJsonPath || `${sectionName}.title`, val)}
                    field={section.titleJsonPath || `${sectionName}.title`}
                    editMode={editMode}
                    className="text-3xl md:text-5xl font-bold text-text-primary"
                  />
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {section.images?.slice(0, 3).map((img: any, i: number) => (
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
                        <InlineEdit
                          value={img.caption}
                          onSave={async (val) => await onUpdate(`${sectionName}.images.${i}.caption`, val)}
                          field={`${sectionName}.images.${i}.caption`}
                          editMode={editMode}
                          multiline
                          className="text-sm text-text-muted italic"
                        />
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
                  {section.content.map((item: any, idx: number) =>
                    renderContentItem(item, idx, sectionName)
                  )}
                </motion.div>
              </div>
            </section>
          );
        }

        // Dual Voice Typography - Two Worlds layout
        if (section.layout === 'dual-voice') {
          return (
            <section key={index} className="py-24 bg-surface overflow-hidden">
              <div className="max-w-5xl mx-auto px-6">
                {/* Title with gradient */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-bold text-center mb-8"
                >
                  <span className="bg-gradient-to-r from-lavender via-text-primary to-coral bg-clip-text text-transparent">
                    <InlineEdit
                      value={section.title}
                      onSave={async (val) => await onUpdate(section.titleJsonPath || `${sectionName}.title`, val)}
                      field={section.titleJsonPath || `${sectionName}.title`}
                      editMode={editMode}
                      className="text-4xl md:text-6xl font-bold"
                    />
                  </span>
                </motion.h2>

                {/* Callout centered */}
                {section.callout && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl italic text-center text-text-secondary/70 mb-16 max-w-2xl mx-auto"
                  >
                    <InlineEdit
                      value={section.callout}
                      onSave={async (val) => await onUpdate(section.calloutJsonPath || `${sectionName}.callout`, val)}
                      field={section.calloutJsonPath || `${sectionName}.callout`}
                      editMode={editMode}
                      multiline
                      className="text-xl md:text-2xl italic text-text-secondary/70"
                    />
                  </motion.p>
                )}

                {/* Two voices container - skip content[0] which is callout */}
                <div className="space-y-12">
                  {/* Questions - from left (Carrillo voice) */}
                  {section.content[1] && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="max-w-xl"
                    >
                      <div className="border-l-2 border-lavender/50 pl-6">
                        <span className="text-xs uppercase tracking-widest text-lavender/60 mb-2 block">Carrillo</span>
                        <p className="text-lg md:text-xl text-lavender/90 leading-relaxed">
                          <InlineEdit
                            value={section.content[1].text}
                            onSave={async (val) => await onUpdate(section.content[1].jsonPath, val)}
                            field={section.content[1].jsonPath}
                            editMode={editMode}
                            multiline
                            className="text-lg md:text-xl text-lavender/90 leading-relaxed"
                          />
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tired statement - centered emphasis */}
                  {section.content[2] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-center py-8"
                    >
                      <p className="text-2xl md:text-3xl font-bold text-text-primary">
                        <InlineEdit
                          value={section.content[2].text}
                          onSave={async (val) => await onUpdate(section.content[2].jsonPath, val)}
                          field={section.content[2].jsonPath}
                          editMode={editMode}
                          multiline
                          className="text-2xl md:text-3xl font-bold text-text-primary"
                        />
                      </p>
                    </motion.div>
                  )}

                  {/* City promise - from right (Mérida voice) */}
                  {section.content[3] && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="max-w-xl ml-auto"
                    >
                      <div className="border-r-2 border-coral/50 pr-6 text-right">
                        <span className="text-xs uppercase tracking-widest text-coral/60 mb-2 block">Mérida</span>
                        <p className="text-lg md:text-xl text-coral/90 leading-relaxed">
                          <InlineEdit
                            value={section.content[3].text}
                            onSave={async (val) => await onUpdate(section.content[3].jsonPath, val)}
                            field={section.content[3].jsonPath}
                            editMode={editMode}
                            multiline
                            className="text-lg md:text-xl text-coral/90 leading-relaxed"
                          />
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Final question - centered with glow */}
                  {section.content[4] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-center pt-8"
                    >
                      <p className="text-3xl md:text-4xl font-bold text-mint drop-shadow-[0_0_30px_rgba(138,216,192,0.3)]">
                        <InlineEdit
                          value={section.content[4].text}
                          onSave={async (val) => await onUpdate(section.content[4].jsonPath, val)}
                          field={section.content[4].jsonPath}
                          editMode={editMode}
                          multiline
                          className="text-3xl md:text-4xl font-bold text-mint"
                        />
                      </p>
                    </motion.div>
                  )}
                </div>
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
                  <InlineEdit
                    value={section.title}
                    onSave={async (val) => await onUpdate(section.titleJsonPath || `${sectionName}.title`, val)}
                    field={section.titleJsonPath || `${sectionName}.title`}
                    editMode={editMode}
                    className="text-3xl md:text-5xl font-bold text-text-primary"
                  />
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
                        <InlineEdit
                          value={section.image.caption}
                          onSave={async (val) => await onUpdate(`${sectionName}.image.caption`, val)}
                          field={`${sectionName}.image.caption`}
                          editMode={editMode}
                          multiline
                          className="text-sm text-text-muted italic"
                        />
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
                  {section.content.map((item: any, idx: number) =>
                    renderContentItem(item, idx, sectionName)
                  )}
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
                <InlineEdit
                  value={section.title}
                  onSave={async (val) => await onUpdate(section.titleJsonPath || `${sectionName}.title`, val)}
                  field={section.titleJsonPath || `${sectionName}.title`}
                  editMode={editMode}
                  className="text-3xl md:text-5xl font-bold text-text-primary"
                />
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 text-lg text-text-secondary leading-relaxed"
              >
                {section.content.map((item: any, idx: number) =>
                  renderContentItem(item, idx, sectionName)
                )}
              </motion.div>

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
                  {content.meta.tags.map((tag: string, i: number) => (
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-mint via-sky to-lavender z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

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
          {/* Gradient natural que complementa los verdes */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-emerald-950/50 to-black" />
          {/* Vignette sutil para enfocar */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-40" />
        </div>

        {/* Back button con glassmorphism - fixed */}
        <Link
          href={backUrl}
          className="fixed top-8 left-8 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white/90 hover:bg-mint/20 hover:border-mint/50 hover:text-mint transition-all hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">{backLabel}</span>
        </Link>

        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-4xl"
          >
            {/* Título con mayor impacto */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[0.95] drop-shadow-2xl">
              <InlineEdit
                value={content.meta.title}
                onSave={async (val) => await onUpdate('title', val)}
                field="title"
                editMode={editMode}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95]"
              />
            </h1>

            {/* Subtítulo más poético */}
            {content.meta.subtitle && (
              <p className="text-xl md:text-3xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light tracking-wide italic">
                <InlineEdit
                  value={content.meta.subtitle}
                  onSave={async (val) => await onUpdate('subtitle', val)}
                  field="subtitle"
                  editMode={editMode}
                  multiline
                  className="text-xl md:text-3xl text-white/80 font-light tracking-wide italic leading-relaxed"
                />
              </p>
            )}

            {/* Metadata emocional */}
            <div className="mt-12 flex items-center justify-center gap-4 text-sm text-white/60">
              <time className="font-mono tracking-wider">
                {new Date(content.meta.date).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{content.meta.readTime} lectura</span>
            </div>

            {/* Scroll indicator mejorado */}
            <motion.div
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ opacity: heroOpacity }}
            >
              <span className="text-white/40 text-xs uppercase tracking-widest font-light">Sigue leyendo</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                <motion.div
                  className="w-1.5 h-3 bg-gradient-to-b from-mint to-white/50 rounded-full"
                  animate={{ y: [0, 12, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {content.sections.map(renderSection)}

      {editMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-mint text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50">
          ✏️ Haz clic en cualquier texto para editarlo
        </div>
      )}
    </article>
  );
}
