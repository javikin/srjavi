'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from '@/lib/i18n-context';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWorkProps {
  showCTA?: boolean;
}

type ProjectType = 'client' | 'pro-bono' | 'personal';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  url: string;
  type: ProjectType;
}

const typeBadgeLabel: Record<ProjectType, string> = {
  client: 'Client',
  'pro-bono': 'Pro Bono',
  personal: 'Personal',
};

const typeBadgeColor: Record<ProjectType, string> = {
  client: 'bg-mint/10 text-mint border-mint/20',
  'pro-bono': 'bg-sky/10 text-sky border-sky/20',
  personal: 'bg-lavender/10 text-lavender border-lavender/20',
};

export default function FeaturedWork({ showCTA = false }: FeaturedWorkProps) {
  const t = useTranslations('work');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const projects: Project[] = [
    {
      title: 'Carpy',
      description: t('carpyDesc'),
      image: '/images/projects/carpy-hero.png',
      tags: ['Next.js', 'Supabase', 'Vercel', 'SEO'],
      url: 'https://carpy.mx',
      type: 'client',
    },
    {
      title: 'Pelta',
      description: t('peltaDesc'),
      image: '/images/projects/pelta-hero.png',
      tags: ['Next.js', 'Supabase', 'Tailwind', 'SaaS'],
      url: 'https://pelta.app',
      type: 'pro-bono',
    },
    {
      title: 'Caimito Silvestre',
      description: t('caimitoDesc'),
      image: '/images/projects/caimito-hero.png',
      tags: ['Next.js', 'Supabase', 'E-commerce'],
      url: 'https://caimito.vercel.app',
      type: 'pro-bono',
    },
    {
      title: 'Oden POS',
      description: t('odenDesc'),
      image: '/images/projects/oden-hero.png',
      tags: ['Next.js', 'Supabase', 'Real-time', 'POS'],
      url: 'https://www.oden.food',
      type: 'personal',
    },
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      data-scroll-section
      className="relative py-32 overflow-hidden bg-surface"
    >
      {/* Fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />

      {/* Subtle pastel orbs for depth */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-lavender/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky/8 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h2
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-16 text-center"
        >
          {t('title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="group block rounded-2xl bg-background border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-300"
            >
              {/* Image container */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0 w-full h-full transition-all duration-500"
                  style={{ filter: 'grayscale(100%)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(0%)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(100%)';
                  }}
                >
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                {/* Type badge — top right corner */}
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${typeBadgeColor[project.type]}`}
                >
                  {typeBadgeLabel[project.type]}
                </span>
              </div>

              {/* Card content */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  {/* External link arrow */}
                  <svg
                    className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-surface border border-primary/20 text-xs font-medium text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA — only show if showCTA is true */}
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <a
              href="#contact"
              className="inline-block text-text-secondary hover:text-text-primary font-medium transition-colors"
            >
              {t('cta')} →
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
