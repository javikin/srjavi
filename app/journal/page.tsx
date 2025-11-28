'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

// Tree structure
const journalTree = {
  id: 'dos-anos',
  slug: '/journal/brief',
  title: 'Dos Años',
  subtitle: 'El origen',
  excerpt: '',
  coverPhoto: '/images/journal/carrillo-studio/07-room-after-hero.jpg',
  date: 'Nov 2025',
  status: 'published' as const,
  color: 'sage',
  children: [
    {
      id: 'elestudio',
      slug: '/journal/elestudio',
      title: 'Elestudio',
      subtitle: 'Un espacio creativo',
      excerpt: '',
      coverPhoto: '/images/journal/carrillo-studio/09-night-setup.jpg',
      date: '~Dic 2025',
      status: 'coming-soon' as const,
      color: 'lavender',
      children: [
        {
          id: 'videos',
          title: 'Videos',
          excerpt: '',
          status: 'idea' as const,
          color: 'peach',
        },
        {
          id: 'notas',
          title: 'Notas',
          excerpt: 'Ideas sueltas',
          status: 'idea' as const,
          color: 'sky',
        },
        {
          id: 'proyectos',
          title: '?',
          excerpt: 'Lo que surja',
          status: 'idea' as const,
          color: 'sage',
        },
      ],
    },
    {
      id: 'ritmos',
      title: 'Ritmos',
      subtitle: 'Balance',
      excerpt: 'Las rutinas que me mantienen centrado.',
      date: '2026',
      status: 'idea' as const,
      color: 'peach',
      children: [],
    },
    {
      id: 'raices',
      title: 'Raíces',
      subtitle: 'Origen',
      excerpt: 'Lo que dejé atrás para encontrar lo que buscaba.',
      date: '2026',
      status: 'idea' as const,
      color: 'sky',
      children: [],
    },
    {
      id: 'colaboraciones',
      title: 'Colaboraciones',
      subtitle: 'Comunidad',
      excerpt: 'Proyectos que nacen de conexiones.',
      date: '2026',
      status: 'idea' as const,
      color: 'lavender',
      children: [],
    },
  ],
};

const colorClasses = {
  sage: {
    bg: 'bg-[#E8F0E8] dark:bg-[#1a2a1a]',
    border: 'border-[#B8D4B8] dark:border-[#3a5a3a]',
    text: 'text-[#5A7A5A] dark:text-[#8BAF8B]',
    dot: 'bg-[#8BAF8B]',
  },
  lavender: {
    bg: 'bg-[#F0EBF4] dark:bg-[#1f1a24]',
    border: 'border-[#D4C4E4] dark:border-[#4a3a5a]',
    text: 'text-[#6A5A7A] dark:text-[#A894C4]',
    dot: 'bg-[#A894C4]',
  },
  peach: {
    bg: 'bg-[#FDF0EB] dark:bg-[#2a1f1a]',
    border: 'border-[#F0D4C4] dark:border-[#5a4a3a]',
    text: 'text-[#8A6A5A] dark:text-[#D4A894]',
    dot: 'bg-[#D4A894]',
  },
  sky: {
    bg: 'bg-[#EBF4F8] dark:bg-[#1a1f24]',
    border: 'border-[#C4D8E8] dark:border-[#3a4a5a]',
    text: 'text-[#5A6A7A] dark:text-[#94B4C8]',
    dot: 'bg-[#94B4C8]',
  },
};

export default function JournalPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-muted">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-text-muted/20">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-text-muted hover:text-text-secondary transition-colors text-sm flex items-center gap-2"
            >
              <span>←</span>
              <span>Inicio</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="font-serif text-text-secondary">Journal</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-4">
              El Camino
            </h1>
            <p className="text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
              Historias sobre decisiones, lugares y las versiones de mí mismo que voy descubriendo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tree - Desktop */}
      <section className="hidden md:block px-6 pb-32 overflow-x-auto">
        <div className="max-w-5xl mx-auto px-8">
          <div className="min-w-[700px]">
            {/* Root node */}
            <div className="flex flex-col items-center">
              <RootNode node={journalTree} />

              {/* Trunk line */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 40 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-0.5 bg-text-muted/30"
              />

              {/* First level branches */}
              <div className="relative">
                {/* Children with connectors */}
                <div className="flex justify-center gap-2 md:gap-4">
                  {journalTree.children.map((child, index) => (
                    <BranchNode
                      key={child.id}
                      node={child}
                      index={index}
                      total={journalTree.children.length}
                      hasChildren={child.children && child.children.length > 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tree - Mobile (Vertical List) */}
      <section className="md:hidden px-6 pb-16">
        <div className="max-w-sm mx-auto">
          {/* Root node mobile */}
          <MobileRootNode node={journalTree} />

          {/* Children as vertical list */}
          <div className="relative mt-12 ml-4 pl-6 border-l-2 border-text-muted/20">
            {journalTree.children.map((child, index) => (
              <MobileChildNode key={child.id} node={child} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8BAF8B]" />
              <span>Publicado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#A894C4]" />
              <span>En progreso</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-dashed border-text-muted/40" />
              <span>Idea</span>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-surface border border-text-muted/20"
          >
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              <span className="font-serif italic text-text-primary">¿Por qué un journal?</span>
            </p>
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              Hace poco encontré mis primeras páginas web de cuando tenía 15 años, por ahí del 2004, y recordé que pasaba horas construyéndolas sin buscar likes ni seguidores (no existía tal cosa). Eran espacios que tal vez nadie veía, pero me sirvieron para aprender sobre mí, empezar a crear y plasmar mis ideas en algo digital.
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              Este journal intenta recuperar eso, un medio menos saturado que las redes sociales, sin algoritmos ni métricas. Un espacio para construir sin la presión de promocionar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-text-muted/20">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            href="/"
            className="text-[#8BAF8B] hover:text-[#6A9A6A] dark:hover:text-[#A8C8A8] transition-colors text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
}

function RootNode({ node }: { node: typeof journalTree }) {
  const colors = colorClasses[node.color as keyof typeof colorClasses];

  return (
    <Link href={node.slug}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`group relative w-72 rounded-2xl overflow-hidden border-2 ${colors.border} ${colors.bg} hover:shadow-lg dark:hover:shadow-[#8BAF8B]/10 transition-all cursor-pointer`}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <Image
            src={node.coverPhoto}
            alt={node.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
              {node.date}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <div className="text-xs text-text-muted mb-1">{node.subtitle}</div>
          <h2 className="font-serif text-2xl text-text-primary">{node.title}</h2>
          {node.excerpt && <p className="text-sm text-text-secondary mt-1">{node.excerpt}</p>}

          <div className={`mt-3 text-sm font-medium ${colors.text} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}>
            Leer <span>→</span>
          </div>
        </div>

        {/* Root indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8BAF8B] border-4 border-background" />
      </motion.div>
    </Link>
  );
}

function BranchNode({
  node,
  index,
  total,
  hasChildren
}: {
  node: any;
  index: number;
  total: number;
  hasChildren: boolean;
}) {
  const colors = colorClasses[node.color as keyof typeof colorClasses];
  const isIdea = node.status === 'idea';
  const isComingSoon = node.status === 'coming-soon';
  const isPublished = node.status === 'published';

  // Determine connector type based on position
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isMiddle = !isFirst && !isLast;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
      className="flex flex-col items-center relative"
    >
      {/* Horizontal connector line */}
      <div className="absolute top-0 h-0.5 bg-text-muted/30" style={{
        left: isFirst ? '50%' : 0,
        right: isLast ? '50%' : 0,
      }} />

      {/* Vertical connector down to node */}
      <div className="w-0.5 h-8 bg-text-muted/30" />

      {/* Node dot */}
      <div className={`w-3 h-3 rounded-full mb-3 ${
        isIdea
          ? 'border-2 border-dashed border-text-muted/40 bg-background'
          : colors.dot
      }`} />

      {/* Card */}
      <div
        className={`relative w-36 rounded-xl overflow-hidden transition-all ${
          isIdea
            ? 'border-2 border-dashed border-text-muted/30 bg-background/50 p-4'
            : `border ${colors.border} ${colors.bg} ${!isIdea && !isComingSoon ? 'hover:shadow-md cursor-pointer' : ''}`
        }`}
      >
        {/* Image for non-idea nodes */}
        {!isIdea && node.coverPhoto && (
          <div className="relative h-24 overflow-hidden">
            <Image
              src={node.coverPhoto}
              alt={node.title}
              fill
              className={`object-cover ${isComingSoon ? 'grayscale opacity-60' : 'group-hover:scale-105'} transition-all duration-500`}
            />
            {/* Date badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                {node.date}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`${!isIdea && node.coverPhoto ? 'p-3' : ''} text-center`}>
          {isIdea && node.date && (
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-text-muted bg-surface mb-2">
              {node.date}
            </span>
          )}

          <h3 className={`font-serif text-lg ${node.excerpt ? 'mb-1' : ''} ${
            isIdea ? 'text-text-muted italic' : isComingSoon ? 'text-text-secondary' : 'text-text-primary'
          }`}>
            {node.title}
          </h3>

          {node.excerpt && (
            <p className={`text-xs leading-relaxed ${
              isIdea ? 'text-text-muted/70' : 'text-text-muted'
            }`}>
              {node.excerpt}
            </p>
          )}

          {/* Status indicator */}
          {isComingSoon && (
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-[#A894C4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A894C4] animate-pulse" />
              En progreso
            </div>
          )}

          {isPublished && (
            <div className={`mt-2 text-xs font-medium ${colors.text}`}>
              Leer →
            </div>
          )}
        </div>

        {/* Idea lightbulb */}
        {isIdea && (
          <div className="absolute top-2 right-2 text-text-muted/50">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Children branches */}
      {hasChildren && node.children && node.children.length > 0 && (
        <div className="flex flex-col items-center mt-3">
          {/* Trunk to children */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 24 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
            className="w-0.5 bg-text-muted/30"
          />

          {/* Sub-children */}
          <div className="flex gap-1">
            {node.children.map((child: any, childIndex: number) => (
              <SubNode
                key={child.id}
                node={child}
                index={childIndex}
                total={node.children.length}
                parentIndex={index}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  if (isPublished && node.slug) {
    return <Link href={node.slug} className="group">{content}</Link>;
  }

  return content;
}

function SubNode({ node, index, total, parentIndex }: { node: any; index: number; total: number; parentIndex: number }) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 + parentIndex * 0.1 + index * 0.05, duration: 0.3 }}
      className="flex flex-col items-center relative pt-4"
    >
      {/* Horizontal connector line */}
      <div className="absolute top-0 h-0.5 bg-text-muted/30" style={{
        left: isFirst ? '50%' : 0,
        right: isLast ? '50%' : 0,
      }} />

      {/* Vertical connector */}
      <div className="w-0.5 h-4 bg-text-muted/30 -mt-4" />

      {/* Small dot */}
      <div className="w-2 h-2 rounded-full border border-dashed border-text-muted/40 bg-background mb-2" />

      {/* Mini card */}
      <div className="w-20 p-2 rounded-lg border border-dashed border-text-muted/30 bg-background/30 text-center">
        <h4 className="font-serif text-xs text-text-muted italic">{node.title}</h4>
        <p className="text-[9px] text-text-muted/70 mt-0.5 leading-tight">{node.excerpt}</p>
      </div>
    </motion.div>
  );
}

// Mobile Components
function MobileRootNode({ node }: { node: typeof journalTree }) {
  const colors = colorClasses[node.color as keyof typeof colorClasses];

  return (
    <Link href={node.slug}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`group relative rounded-2xl overflow-hidden border-2 ${colors.border} ${colors.bg} active:scale-[0.98] transition-all`}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={node.coverPhoto}
            alt={node.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
              {node.date}
            </span>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-xs text-white/70 mb-1">{node.subtitle}</div>
            <h2 className="font-serif text-2xl text-white mb-2">{node.title}</h2>
            <div className="text-sm font-medium text-[#8BAF8B] inline-flex items-center gap-1">
              Leer historia <span>→</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function MobileChildNode({ node, index }: { node: any; index: number }) {
  const colors = colorClasses[node.color as keyof typeof colorClasses];
  const isIdea = node.status === 'idea';
  const isComingSoon = node.status === 'coming-soon';
  const isPublished = node.status === 'published';

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
      className="relative mb-12 last:mb-0"
    >
      {/* Horizontal connector */}
      <div className="absolute -left-6 top-4 w-6 h-0.5 bg-text-muted/20" />

      {/* Dot */}
      <div className={`absolute -left-[29px] top-2.5 w-3 h-3 rounded-full ${
        isIdea
          ? 'border-2 border-dashed border-text-muted/40 bg-background'
          : colors.dot
      }`} />

      {/* Card */}
      <div
        className={`rounded-xl overflow-hidden transition-all ${
          isIdea
            ? 'border-2 border-dashed border-text-muted/30 bg-background/50 p-4'
            : `border ${colors.border} ${colors.bg} ${isPublished ? 'active:scale-[0.98]' : ''}`
        }`}
      >
        {/* Image for non-idea nodes */}
        {!isIdea && node.coverPhoto && (
          <div className="relative h-32 overflow-hidden">
            <Image
              src={node.coverPhoto}
              alt={node.title}
              fill
              className={`object-cover ${isComingSoon ? 'grayscale opacity-60' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Date badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                {node.date}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`${!isIdea && node.coverPhoto ? 'p-4' : ''}`}>
          {isIdea && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-text-muted/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              {node.date && (
                <span className="text-xs font-mono text-text-muted bg-surface px-2 py-0.5 rounded">
                  {node.date}
                </span>
              )}
            </div>
          )}

          <h3 className={`font-serif text-lg ${
            isIdea ? 'text-text-muted italic' : isComingSoon ? 'text-text-secondary' : 'text-text-primary'
          }`}>
            {node.title}
          </h3>

          {node.subtitle && !isIdea && (
            <div className="text-xs text-text-muted mt-0.5">{node.subtitle}</div>
          )}

          {node.excerpt && (
            <p className={`text-sm mt-2 leading-relaxed ${
              isIdea ? 'text-text-muted/70' : 'text-text-muted'
            }`}>
              {node.excerpt}
            </p>
          )}

          {/* Status indicator */}
          {isComingSoon && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#A894C4]">
              <span className="w-2 h-2 rounded-full bg-[#A894C4] animate-pulse" />
              En progreso
            </div>
          )}

          {isPublished && (
            <div className={`mt-3 text-sm font-medium ${colors.text} inline-flex items-center gap-1`}>
              Leer <span>→</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-children on mobile */}
      {node.children && node.children.length > 0 && (
        <div className="ml-4 pl-4 mt-3 border-l border-dashed border-text-muted/20">
          {node.children.map((child: any, childIndex: number) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 + childIndex * 0.05 }}
              className="relative mb-3 last:mb-0"
            >
              {/* Mini connector */}
              <div className="absolute -left-4 top-2 w-4 h-0.5 bg-text-muted/20" />
              <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full border border-dashed border-text-muted/30 bg-background" />

              <div className="p-3 rounded-lg border border-dashed border-text-muted/20 bg-background/30">
                <h4 className="font-serif text-sm text-text-muted italic">{child.title}</h4>
                <p className="text-xs text-text-muted/60 mt-0.5">{child.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  if (isPublished && node.slug) {
    return <Link href={node.slug}>{content}</Link>;
  }

  return content;
}
